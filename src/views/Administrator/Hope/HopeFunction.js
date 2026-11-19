import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { connect } from "react-redux";
import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
} from "@material-ui/icons";
import { pdf } from "@react-pdf/renderer";
import HopeReportDocument from "./components/HopeReportDocument";
import HopeSummaryReportDocument from "./components/HopeSummaryReportDocument";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToUpdatePatient } from "store/actions/patientAction";
import { resetUpdatePatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { patientUpdateStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import moment from "moment";
import CustomDatePicker from "components/Date/CustomDatePicker";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  tableContainer: {
    overflowX: "auto",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
  },
  tableCell: {
    fontSize: "0.875rem",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
  headerCell: {
    fontSize: "0.875rem",
    fontWeight: "600",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
};

const useStyles = makeStyles(styles);

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;

const SYMPTOM_OPTIONS = ["N/A", "Mild", "Moderate", "Severe"];

const IQIES_MILESTONES = [
  { key: "admission", label: "Admission (HOPE-A)" },
  { key: "huv1", label: "HUV1" },
  { key: "huv2", label: "HUV2" },
  { key: "discharge", label: "Discharge (HOPE-D)" },
];

const hasIqiesError = (formData) =>
  IQIES_MILESTONES.some(
    (m) => formData[`iqies_${m.key}_result`] === "Error"
  );

const buildIqiesExceptionPayload = (formData, milestoneKey) => {
  if (formData[`iqies_${milestoneKey}_result`] !== "Error") {
    return null;
  }

  const issueAffectedRecords = (
    formData[`iqies_${milestoneKey}_issue_affected_records`] || ""
  ).trim();
  const rootCause = (
    formData[`iqies_${milestoneKey}_root_cause`] || ""
  ).trim();
  const actionOwner = (
    formData[`iqies_${milestoneKey}_action_owner`] || ""
  ).trim();

  if (!issueAffectedRecords && !rootCause && !actionOwner) {
    return null;
  }

  return {
    issue_affected_records: issueAffectedRecords,
    root_cause: rootCause,
    action_owner: actionOwner,
  };
};

function HopeFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    is_hope_completed: false,
    first_symptom: "",
    second_symptom: "",
    third_symptom: "",
    sfv_admission_dt: null,
    sfv_huv1_completed_dt: null,
    sfv_huv2_completed_dt: null,
    huv1_completed_dt: null,
    huv2_completed_dt: null,
    hope_discharge_dt: null,
    hope_discharge_reason: "",
    iqies_admission_result: "",
    iqies_admission_accepted_date: null,
    iqies_huv1_result: "",
    iqies_huv1_accepted_dt: null,
    iqies_huv2_result: "",
    iqies_huv2_accepted_dt: null,
    iqies_discharge_result: "",
    iqies_discharge_accepted_dt: null,
    iqies_admission_issue_affected_records: "",
    iqies_admission_root_cause: "",
    iqies_admission_action_owner: "",
    iqies_huv1_issue_affected_records: "",
    iqies_huv1_root_cause: "",
    iqies_huv1_action_owner: "",
    iqies_huv2_issue_affected_records: "",
    iqies_huv2_root_cause: "",
    iqies_huv2_action_owner: "",
    iqies_discharge_issue_affected_records: "",
    iqies_discharge_root_cause: "",
    iqies_discharge_action_owner: "",
    hope_report_admission_dt: null,
    hope_report_huv1_dt: null,
    hope_report_huv2_dt: null,
    hope_report_discharge_dt: null,
    hope_report_admission_code: "",
    hope_report_huv1_code: "",
    hope_report_huv2_code: "",
    hope_report_discharge_code: "",
  });
  const [hopeCompletedFilter, setHopeCompletedFilter] = useState("both"); // "both", "yes", "no"
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printTargetPatient, setPrintTargetPatient] = useState(null);
  const [printFormData, setPrintFormData] = useState({
    reportDate: null,
    preparedBy: "Jasmin Angela Velasco, Admin Mgr",
    administrator: "Marivic Eleno, RN",
    patientName: "",
    caseManager: "",
  });
  const [summaryPrintDialogOpen, setSummaryPrintDialogOpen] = useState(false);
  const [summaryPrintFormData, setSummaryPrintFormData] = useState({
    reportDate: null,
    preparedBy: "Jasmin Angela Velasco (Admin Mgr)",
    reviewedApprovedBy: "Marivic Eleno, RN (Administrator)",
  });

  useEffect(() => {
    console.log("Hope - loading patient data");
    isPatientListDone = false;
    setIsPatientsCollection(true);
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
      });
    }

    // Cleanup: reset state when component unmounts
    return () => {
      props.resetListPatients();
    };
  }, []);

  // Handle update patient response
  useEffect(() => {
    if (props.patientUpdate?.status === ACTION_STATUSES.SUCCEED) {
      // Update local data source
      setDataSource((prevData) =>
        prevData.map((p) =>
          p.id === selectedPatient?.id
            ? {
                ...p,
                is_hope_completed: editFormData.is_hope_completed,
                first_symptom: editFormData.first_symptom,
                second_symptom: editFormData.second_symptom,
                third_symptom: editFormData.third_symptom,
                sfv_admission_dt: editFormData.sfv_admission_dt,
                sfv_huv1_completed_dt: editFormData.sfv_huv1_completed_dt,
                sfv_huv2_completed_dt: editFormData.sfv_huv2_completed_dt,
                huv1_completed_dt: editFormData.huv1_completed_dt,
                huv2_completed_dt: editFormData.huv2_completed_dt,
                hope_discharge_dt: editFormData.hope_discharge_dt,
                hope_discharge_reason: editFormData.hope_discharge_reason,
                iqies_admission_result: editFormData.iqies_admission_result || null,
                iqies_admission_accepted_date:
                  editFormData.iqies_admission_accepted_date,
                iqies_huv1_result: editFormData.iqies_huv1_result || null,
                iqies_huv1_accepted_dt: editFormData.iqies_huv1_accepted_dt,
                iqies_huv2_result: editFormData.iqies_huv2_result || null,
                iqies_huv2_accepted_dt: editFormData.iqies_huv2_accepted_dt,
                iqies_discharge_result:
                  editFormData.iqies_discharge_result || null,
                iqies_discharge_accepted_dt:
                  editFormData.iqies_discharge_accepted_dt,
                iqies_admission_exceptions_correction:
                  buildIqiesExceptionPayload(editFormData, "admission"),
                iqies_huv1_exceptions_correction: buildIqiesExceptionPayload(
                  editFormData,
                  "huv1"
                ),
                iqies_huv2_exceptions_correction: buildIqiesExceptionPayload(
                  editFormData,
                  "huv2"
                ),
                iqies_discharge_exceptions_correction:
                  buildIqiesExceptionPayload(editFormData, "discharge"),
                hope_report_admission_dt:
                  editFormData.hope_report_admission_dt,
                hope_report_huv1_dt: editFormData.hope_report_huv1_dt,
                hope_report_huv2_dt: editFormData.hope_report_huv2_dt,
                hope_report_discharge_dt:
                  editFormData.hope_report_discharge_dt,
                hope_report_admission_code:
                  editFormData.hope_report_admission_code,
                hope_report_huv1_code: editFormData.hope_report_huv1_code,
                hope_report_huv2_code: editFormData.hope_report_huv2_code,
                hope_report_discharge_code:
                  editFormData.hope_report_discharge_code,
              }
            : p
        )
      );

      alert("Patient data updated successfully");
      handleCloseDialog();
      props.resetUpdatePatient();
    } else if (props.patientUpdate?.status === ACTION_STATUSES.FAILED) {
      alert(
        "Failed to update patient data: " +
          (props.patientUpdate?.error || "Unknown error")
      );
      props.resetUpdatePatient();
    }
  }, [props.patientUpdate]);

  if (
    isPatientsCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    let source = props.patients.data;
    if (source && source.length) {
      // Filter patients with SOC >= 10/01/2025
      const cutoffDate = moment("2025-10-01");
      source = source.filter((p) => {
        if (!p.soc) return false;
        return moment(p.soc).isSameOrAfter(cutoffDate, "day");
      });
    }
    setDataSource(source);
    setIsPatientsCollection(false);
    props.resetListPatients();
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD/YYYY");
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD");
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
  };

  const getFilteredData = () => {
    if (!dataSource) return [];

    if (hopeCompletedFilter === "both") {
      return dataSource;
    } else if (hopeCompletedFilter === "yes") {
      return dataSource.filter((p) => p.is_hope_completed === true);
    } else if (hopeCompletedFilter === "no") {
      return dataSource.filter((p) => !p.is_hope_completed);
    }

    return dataSource;
  };

  const calculateTimeline = (socDate) => {
    if (!socDate) return {};
    const soc = moment(socDate);

    return {
      admitDate: soc.format("MM/DD/YYYY"),
      svfDue: soc.clone().add(2, "days").format("MM/DD/YYYY"),
      comprehensiveAssessment: soc.clone().add(5, "days").format("MM/DD/YYYY"),
      huvDateStart: soc.clone().add(6, "days"),
      huvDateEnd: soc.clone().add(15, "days"),
      sfvDueStart: soc.clone().add(8, "days"),
      sfvDueEnd: soc.clone().add(15, "days"),
      huv1Completed: soc.clone().add(15, "days").format("MM/DD/YYYY"),
      huv2DateStart: soc.clone().add(16, "days"),
      huv2DateEnd: soc.clone().add(30, "days"),
      sfv2DueStart: soc.clone().add(18, "days"),
      sfv2DueEnd: soc.clone().add(30, "days"),
      huv2Completed: soc.clone().add(30, "days").format("MM/DD/YYYY"),
    };
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    const admissionExceptions =
      patient.iqies_admission_exceptions_correction || {};
    const huv1Exceptions = patient.iqies_huv1_exceptions_correction || {};
    const huv2Exceptions = patient.iqies_huv2_exceptions_correction || {};
    const dischargeExceptions =
      patient.iqies_discharge_exceptions_correction || {};
    setEditFormData({
      is_hope_completed: patient.is_hope_completed || false,
      first_symptom: patient.first_symptom || "",
      second_symptom: patient.second_symptom || "",
      third_symptom: patient.third_symptom || "",
      sfv_admission_dt: patient.sfv_admission_dt || null,
      sfv_huv1_completed_dt: patient.sfv_huv1_completed_dt || null,
      sfv_huv2_completed_dt: patient.sfv_huv2_completed_dt || null,
      huv1_completed_dt: patient.huv1_completed_dt || null,
      huv2_completed_dt: patient.huv2_completed_dt || null,
      hope_discharge_dt: patient.hope_discharge_dt || null,
      hope_discharge_reason: patient.hope_discharge_reason || "",
      iqies_admission_result: patient.iqies_admission_result || "",
      iqies_admission_accepted_date:
        patient.iqies_admission_accepted_date || null,
      iqies_huv1_result: patient.iqies_huv1_result || "",
      iqies_huv1_accepted_dt: patient.iqies_huv1_accepted_dt || null,
      iqies_huv2_result: patient.iqies_huv2_result || "",
      iqies_huv2_accepted_dt: patient.iqies_huv2_accepted_dt || null,
      iqies_discharge_result: patient.iqies_discharge_result || "",
      iqies_discharge_accepted_dt:
        patient.iqies_discharge_accepted_dt || null,
      iqies_admission_issue_affected_records:
        admissionExceptions.issue_affected_records || "",
      iqies_admission_root_cause: admissionExceptions.root_cause || "",
      iqies_admission_action_owner: admissionExceptions.action_owner || "",
      iqies_huv1_issue_affected_records:
        huv1Exceptions.issue_affected_records || "",
      iqies_huv1_root_cause: huv1Exceptions.root_cause || "",
      iqies_huv1_action_owner: huv1Exceptions.action_owner || "",
      iqies_huv2_issue_affected_records:
        huv2Exceptions.issue_affected_records || "",
      iqies_huv2_root_cause: huv2Exceptions.root_cause || "",
      iqies_huv2_action_owner: huv2Exceptions.action_owner || "",
      iqies_discharge_issue_affected_records:
        dischargeExceptions.issue_affected_records || "",
      iqies_discharge_root_cause: dischargeExceptions.root_cause || "",
      iqies_discharge_action_owner: dischargeExceptions.action_owner || "",
      hope_report_admission_dt: patient.hope_report_admission_dt || null,
      hope_report_huv1_dt: patient.hope_report_huv1_dt || null,
      hope_report_huv2_dt: patient.hope_report_huv2_dt || null,
      hope_report_discharge_dt: patient.hope_report_discharge_dt || null,
      hope_report_admission_code: patient.hope_report_admission_code || "",
      hope_report_huv1_code: patient.hope_report_huv1_code || "",
      hope_report_huv2_code: patient.hope_report_huv2_code || "",
      hope_report_discharge_code: patient.hope_report_discharge_code || "",
    });
    setEditDialogOpen(true);
  };

  const handlePrintClick = (patient) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setPrintTargetPatient(patient);
    setPrintFormData({
      reportDate: `${year}-${month}-${day}`,
      preparedBy: "Jasmin Angela Velasco, Admin Mgr",
      administrator: "Marivic Eleno, RN",
      patientName: patient?.patientCd || "",
      caseManager: patient?.case_manager || "",
    });
    setPrintDialogOpen(true);
  };

  const handleClosePrintDialog = () => {
    setPrintDialogOpen(false);
    setPrintTargetPatient(null);
  };

  const handlePrintFieldChange = (field, value) => {
    setPrintFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrintDateChange = (value) => {
    if (!value) {
      handlePrintFieldChange("reportDate", null);
      return;
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    handlePrintFieldChange("reportDate", `${year}-${month}-${day}`);
  };

  const handleConfirmPrint = async () => {
    if (!printTargetPatient) return;
    try {
      const doc = (
        <HopeReportDocument
          patient={printTargetPatient}
          reportDate={
            printFormData.reportDate
              ? new Date(printFormData.reportDate + "T12:00:00")
              : new Date()
          }
          preparedBy={printFormData.preparedBy}
          administrator={printFormData.administrator}
          patientName={printFormData.patientName}
          caseManager={printFormData.caseManager}
        />
      );
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      handleClosePrintDialog();
    } catch (error) {
      console.error("Error generating HOPE report PDF:", error);
      alert("Failed to generate HOPE report PDF. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleOpenSummaryPrintDialog = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setSummaryPrintFormData({
      reportDate: `${year}-${month}-${day}`,
      preparedBy: "Jasmin Angela Velasco (Admin Mgr)",
      reviewedApprovedBy: "Marivic Eleno, RN (Administrator)",
    });
    setSummaryPrintDialogOpen(true);
  };

  const handleCloseSummaryPrintDialog = () => {
    setSummaryPrintDialogOpen(false);
  };

  const handleSummaryPrintFieldChange = (field, value) => {
    setSummaryPrintFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSummaryPrintDateChange = (value) => {
    if (!value) {
      handleSummaryPrintFieldChange("reportDate", null);
      return;
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    handleSummaryPrintFieldChange("reportDate", `${year}-${month}-${day}`);
  };

  const handleConfirmSummaryPrint = async () => {
    try {
      const doc = (
        <HopeSummaryReportDocument
          patients={getFilteredData()}
          reportDate={
            summaryPrintFormData.reportDate
              ? new Date(summaryPrintFormData.reportDate + "T12:00:00")
              : new Date()
          }
          preparedBy={summaryPrintFormData.preparedBy}
          reviewedApprovedBy={summaryPrintFormData.reviewedApprovedBy}
        />
      );
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      handleCloseSummaryPrintDialog();
    } catch (error) {
      console.error("Error generating HOPE summary report PDF:", error);
      alert("Failed to generate HOPE summary report PDF. Please try again.");
    }
  };

  const SYMPTOM_TO_SFV_FIELD = {
    first_symptom: "sfv_admission_dt",
    second_symptom: "sfv_huv1_completed_dt",
    third_symptom: "sfv_huv2_completed_dt",
  };

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };
      const sfvField = SYMPTOM_TO_SFV_FIELD[field];
      if (sfvField && ["N/A", "Mild"].includes(value)) {
        next[sfvField] = null;
      }
      return next;
    });
  };

  const handleDateFormChange = (value, field) => {
    if (!value) {
      handleFormChange(field, null);
      return;
    }
    // Extract local date parts to avoid timezone issues
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    handleFormChange(field, `${year}-${month}-${day}`);
  };

  const handleSaveChanges = () => {
    if (!selectedPatient) return;

    const params = {
      id: selectedPatient.id,
      is_hope_completed: editFormData.is_hope_completed,
      first_symptom: editFormData.first_symptom,
      second_symptom: editFormData.second_symptom,
      third_symptom: editFormData.third_symptom,
      sfv_admission_dt: editFormData.sfv_admission_dt || null,
      sfv_huv1_completed_dt: editFormData.sfv_huv1_completed_dt || null,
      sfv_huv2_completed_dt: editFormData.sfv_huv2_completed_dt || null,
      huv1_completed_dt: editFormData.huv1_completed_dt || null,
      huv2_completed_dt: editFormData.huv2_completed_dt || null,
      hope_discharge_dt: editFormData.hope_discharge_dt || null,
      hope_discharge_reason: editFormData.hope_discharge_reason || null,
      iqies_admission_result: editFormData.iqies_admission_result || null,
      iqies_admission_accepted_date:
        editFormData.iqies_admission_accepted_date || null,
      iqies_huv1_result: editFormData.iqies_huv1_result || null,
      iqies_huv1_accepted_dt: editFormData.iqies_huv1_accepted_dt || null,
      iqies_huv2_result: editFormData.iqies_huv2_result || null,
      iqies_huv2_accepted_dt: editFormData.iqies_huv2_accepted_dt || null,
      iqies_discharge_result: editFormData.iqies_discharge_result || null,
      iqies_discharge_accepted_dt:
        editFormData.iqies_discharge_accepted_dt || null,
      iqies_admission_exceptions_correction: buildIqiesExceptionPayload(
        editFormData,
        "admission"
      ),
      iqies_huv1_exceptions_correction: buildIqiesExceptionPayload(
        editFormData,
        "huv1"
      ),
      iqies_huv2_exceptions_correction: buildIqiesExceptionPayload(
        editFormData,
        "huv2"
      ),
      iqies_discharge_exceptions_correction: buildIqiesExceptionPayload(
        editFormData,
        "discharge"
      ),
      hope_report_admission_dt: editFormData.hope_report_admission_dt || null,
      hope_report_huv1_dt: editFormData.hope_report_huv1_dt || null,
      hope_report_huv2_dt: editFormData.hope_report_huv2_dt || null,
      hope_report_discharge_dt: editFormData.hope_report_discharge_dt || null,
      hope_report_admission_code:
        editFormData.hope_report_admission_code || null,
      hope_report_huv1_code: editFormData.hope_report_huv1_code || null,
      hope_report_huv2_code: editFormData.hope_report_huv2_code || null,
      hope_report_discharge_code:
        editFormData.hope_report_discharge_code || null,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile.name,
        userId: context.userProfile.id,
        date: new Date(),
      },
    };

    props.updatePatient(params);
  };

  isProcessDone = isPatientListDone;

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>Loading Patient Timeline...</div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Patient Timeline (HOPE)
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Patient milestones for SOC on or after 10/01/2025
                  </p>
                </CardHeader>
                <CardBody>
                  <Box
                    mb={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      style={{ minWidth: 200 }}
                    >
                      <InputLabel>HOPE Completed</InputLabel>
                      <Select
                        value={hopeCompletedFilter}
                        onChange={(e) => setHopeCompletedFilter(e.target.value)}
                        label="HOPE Completed"
                      >
                        <MenuItem value="both">Both</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AssessmentIcon />}
                      onClick={handleOpenSummaryPrintDialog}
                    >
                      HOPE Report
                    </Button>
                  </Box>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell className={classes.headerCell}>
                            Action
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Hope Completed
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Patient
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Admit Date
                            <br />
                            (Day 0)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 1
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SVF DUE
                            <br />
                            (Day 2)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Comprehensive Assessment
                            <br />
                            (Day 5)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV Date
                            <br />
                            (Day 6-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 2
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV Due
                            <br />
                            (Day 8-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV1 Completed
                            <br />
                            (Day 15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Date
                            <br />
                            (Day 16-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 3
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV2 Due
                            <br />
                            (Day 18-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Completed
                            <br />
                            (Day 30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Discharge
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredData().length > 0 ? (
                          getFilteredData().map((patient, index) => {
                            const timeline = calculateTimeline(patient.soc);
                            const isFirstSymptomMildOrNA = ["MILD", "N/A"].includes(
                              patient.first_symptom?.toUpperCase()
                            );
                            const isSecondSymptomMildOrNA = ["MILD", "N/A"].includes(
                              patient.second_symptom?.toUpperCase()
                            );
                            const isThirdSymptomMildOrNA = ["MILD", "N/A"].includes(
                              patient.third_symptom?.toUpperCase()
                            );

                            return (
                              <TableRow key={index} hover>
                                <TableCell className={classes.tableCell}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(patient)}
                                    title="Edit patient HOPE data"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handlePrintClick(patient)}
                                    title="Print HOPE report"
                                  >
                                    <PrintIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                                <TableCell
                                  className={classes.tableCell}
                                  align="center"
                                >
                                  {patient.is_hope_completed && (
                                    <CheckIcon style={{ color: "#43a047" }} />
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.patientCd || "N/A"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.admitDate}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.first_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isFirstSymptomMildOrNA ? "N/A" : timeline.svfDue}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.comprehensiveAssessment}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huvDateStart,
                                    timeline.huvDateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.second_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isSecondSymptomMildOrNA
                                    ? "N/A"
                                    : formatDateRange(
                                        timeline.sfvDueStart,
                                        timeline.sfvDueEnd
                                      )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv1Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huv2DateStart,
                                    timeline.huv2DateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.third_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isThirdSymptomMildOrNA
                                    ? "N/A"
                                    : formatDateRange(
                                        timeline.sfv2DueStart,
                                        timeline.sfv2DueEnd
                                      )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv2Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.eoc ? formatDate(patient.eoc) : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={16} align="center">
                              No patient data found (SOC >= 10/01/2025)
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>

          {/* Edit Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Edit HOPE Data - {selectedPatient?.patientCd || "N/A"}
            </DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: "10px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.is_hope_completed}
                      onChange={(e) =>
                        handleFormChange("is_hope_completed", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="HOPE Completed"
                />
                <Box mt={2} mb={1}>
                  <strong>Admission / SFV1</strong>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Admission Date (SOC)"
                      value={
                        selectedPatient?.soc
                          ? formatDate(selectedPatient.soc)
                          : "N/A"
                      }
                      margin="none"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="none">
                      <InputLabel shrink>Symptom 1</InputLabel>
                      <Select
                        label="Symptom 1"
                        notched
                        value={editFormData.first_symptom || ""}
                        onChange={(e) =>
                          handleFormChange("first_symptom", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {SYMPTOM_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomDatePicker
                      label="SFV Admission Visit"
                      name="sfv_admission_dt"
                      value={
                        editFormData.sfv_admission_dt
                          ? new Date(editFormData.sfv_admission_dt + "T12:00:00")
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                </Grid>

                <Box mt={2} mb={1}>
                  <strong>HUV1 / SFV2</strong>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <CustomDatePicker
                      label="HUV1 Completed Date"
                      name="huv1_completed_dt"
                      value={
                        editFormData.huv1_completed_dt
                          ? new Date(editFormData.huv1_completed_dt + "T12:00:00")
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="none">
                      <InputLabel shrink>Symptom 2</InputLabel>
                      <Select
                        label="Symptom 2"
                        notched
                        value={editFormData.second_symptom || ""}
                        onChange={(e) =>
                          handleFormChange("second_symptom", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {SYMPTOM_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomDatePicker
                      label="SFV HUV1 Visit"
                      name="sfv_huv1_completed_dt"
                      value={
                        editFormData.sfv_huv1_completed_dt
                          ? new Date(
                              editFormData.sfv_huv1_completed_dt + "T12:00:00"
                            )
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                </Grid>

                <Box mt={2} mb={1}>
                  <strong>HUV2 / SFV3</strong>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <CustomDatePicker
                      label="HUV2 Completed Date"
                      name="huv2_completed_dt"
                      value={
                        editFormData.huv2_completed_dt
                          ? new Date(editFormData.huv2_completed_dt + "T12:00:00")
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="none">
                      <InputLabel shrink>Symptom 3</InputLabel>
                      <Select
                        label="Symptom 3"
                        notched
                        value={editFormData.third_symptom || ""}
                        onChange={(e) =>
                          handleFormChange("third_symptom", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {SYMPTOM_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomDatePicker
                      label="SFV HUV2 Visit"
                      name="sfv_huv2_completed_dt"
                      value={
                        editFormData.sfv_huv2_completed_dt
                          ? new Date(
                              editFormData.sfv_huv2_completed_dt + "T12:00:00"
                            )
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                </Grid>

                <Box mt={2} mb={1}>
                  <strong>Discharge</strong>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <CustomDatePicker
                      label="HOPE Discharge Date"
                      name="hope_discharge_dt"
                      value={
                        editFormData.hope_discharge_dt
                          ? new Date(editFormData.hope_discharge_dt + "T12:00:00")
                          : null
                      }
                      onChange={handleDateFormChange}
                      noDefault={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="HOPE Discharge Reason"
                      value={editFormData.hope_discharge_reason}
                      onChange={(e) =>
                        handleFormChange("hope_discharge_reason", e.target.value)
                      }
                      margin="none"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Box mt={2} mb={1}>
                  <strong>Hope Report</strong>
                </Box>
                {IQIES_MILESTONES.map((m) => {
                  const hrDateField = `hope_report_${m.key}_dt`;
                  const hrCodeField = `hope_report_${m.key}_code`;

                  return (
                    <Grid container spacing={2} key={`hope-report-${m.key}`}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Record"
                          value={m.label}
                          margin="none"
                          variant="outlined"
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <CustomDatePicker
                          label="Date"
                          name={hrDateField}
                          value={
                            editFormData[hrDateField]
                              ? new Date(editFormData[hrDateField] + "T12:00:00")
                              : null
                          }
                          onChange={handleDateFormChange}
                          noDefault={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Submission Code"
                          value={editFormData[hrCodeField]}
                          onChange={(e) =>
                            handleFormChange(hrCodeField, e.target.value)
                          }
                          margin="none"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  );
                })}

                <Box mt={2} mb={1}>
                  <strong>iQIES Submission</strong>
                </Box>
                {IQIES_MILESTONES.map((m) => {
                  const dateField =
                    m.key === "admission"
                      ? "iqies_admission_accepted_date"
                      : `iqies_${m.key}_accepted_dt`;
                  const resultField = `iqies_${m.key}_result`;
                  const issueField = `iqies_${m.key}_issue_affected_records`;
                  const rootCauseField = `iqies_${m.key}_root_cause`;
                  const actionOwnerField = `iqies_${m.key}_action_owner`;
                  const isError = editFormData[resultField] === "Error";

                  return (
                    <React.Fragment key={m.key}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Record"
                            value={m.label}
                            margin="none"
                            variant="outlined"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <CustomDatePicker
                            label="Accepted Date"
                            name={dateField}
                            value={
                              editFormData[dateField]
                                ? new Date(editFormData[dateField] + "T12:00:00")
                                : null
                            }
                            onChange={handleDateFormChange}
                            noDefault={true}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            margin="none"
                          >
                            <InputLabel shrink>Result</InputLabel>
                            <Select
                              label="Result"
                              notched
                              value={editFormData[resultField] || ""}
                              onChange={(e) =>
                                handleFormChange(resultField, e.target.value)
                              }
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Select</em>
                              </MenuItem>
                              <MenuItem value="Accepted">Accepted</MenuItem>
                              <MenuItem value="Error">Error</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {isError && (
                        <Box
                          mt={1}
                          mb={2}
                          pl={2}
                          pr={2}
                          pt={2}
                          pb={1}
                          style={{
                            backgroundColor: "#FFF7F0",
                            border: "1px solid #F0D5B8",
                            borderRadius: 4,
                          }}
                        >
                          <Box mb={1}>
                            <strong>
                              {m.label} &mdash; Exceptions and Corrective
                              Action
                            </strong>
                          </Box>
                          <TextField
                            fullWidth
                            label="Issue / Affected Records"
                            value={editFormData[issueField]}
                            onChange={(e) =>
                              handleFormChange(issueField, e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={2}
                          />
                          <TextField
                            fullWidth
                            label="Root Cause"
                            value={editFormData[rootCauseField]}
                            onChange={(e) =>
                              handleFormChange(rootCauseField, e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={2}
                          />
                          <TextField
                            fullWidth
                            label="Action / Owner"
                            value={editFormData[actionOwnerField]}
                            onChange={(e) =>
                              handleFormChange(
                                actionOwnerField,
                                e.target.value
                              )
                            }
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={2}
                          />
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                color="primary"
                variant="contained"
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Print Report Dialog */}
          <Dialog
            open={printDialogOpen}
            onClose={handleClosePrintDialog}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>
              Print HOPE Report - {printTargetPatient?.patientCd || "N/A"}
            </DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: "10px" }}>
                <CustomDatePicker
                  label="Report Date"
                  name="reportDate"
                  value={
                    printFormData.reportDate
                      ? new Date(printFormData.reportDate + "T12:00:00")
                      : null
                  }
                  onChange={handlePrintDateChange}
                  noDefault={true}
                />
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={printFormData.patientName}
                  onChange={(e) =>
                    handlePrintFieldChange("patientName", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                  helperText="Overwrites the patient name shown on the PDF"
                />
                <TextField
                  fullWidth
                  label="Case Manager"
                  value={printFormData.caseManager}
                  onChange={(e) =>
                    handlePrintFieldChange("caseManager", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                  helperText="Overwrites the case manager shown on the PDF"
                />
                <TextField
                  fullWidth
                  label="Prepared By"
                  value={printFormData.preparedBy}
                  onChange={(e) =>
                    handlePrintFieldChange("preparedBy", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Administrator"
                  value={printFormData.administrator}
                  onChange={(e) =>
                    handlePrintFieldChange("administrator", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePrintDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPrint}
                color="primary"
                variant="contained"
              >
                Generate PDF
              </Button>
            </DialogActions>
          </Dialog>

          {/* Summary Print Report Dialog */}
          <Dialog
            open={summaryPrintDialogOpen}
            onClose={handleCloseSummaryPrintDialog}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Print HOPE Report</DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: "10px" }}>
                <CustomDatePicker
                  label="Report Date"
                  name="reportDate"
                  value={
                    summaryPrintFormData.reportDate
                      ? new Date(summaryPrintFormData.reportDate + "T12:00:00")
                      : null
                  }
                  onChange={handleSummaryPrintDateChange}
                  noDefault={true}
                />
                <TextField
                  fullWidth
                  label="Prepared By"
                  value={summaryPrintFormData.preparedBy}
                  onChange={(e) =>
                    handleSummaryPrintFieldChange("preparedBy", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Reviewed and Approved By"
                  value={summaryPrintFormData.reviewedApprovedBy}
                  onChange={(e) =>
                    handleSummaryPrintFieldChange(
                      "reviewedApprovedBy",
                      e.target.value
                    )
                  }
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSummaryPrintDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSummaryPrint}
                color="primary"
                variant="contained"
              >
                Generate PDF
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  patientUpdate: patientUpdateStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  updatePatient: (data) => dispatch(attemptToUpdatePatient(data)),
  resetUpdatePatient: () => dispatch(resetUpdatePatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HopeFunction);

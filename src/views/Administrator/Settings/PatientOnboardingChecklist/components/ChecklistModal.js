import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
  Button as MuiButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";
import {
  ExpandMore,
  Clear,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudDownload as PopulateIcon,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import moment from "moment";
import { connect } from "react-redux";
import { SupaContext } from "App";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchAssignment } from "store/actions/assignmentAction";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { ACTION_STATUSES } from "utils/constants";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "90%",
    maxHeight: "90%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    outline: "none",
    overflowY: "auto",
  },
  header: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  content: {
    padding: "20px",
  },
  accordion: {
    marginBottom: "10px",
  },
  accordionSummary: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dateField: {
    marginLeft: "40px",
    width: "200px",
  },
  pocEntry: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    position: "sticky",
    bottom: 0,
    backgroundColor: "white",
    zIndex: 1,
  },
}));

function ChecklistModal({
  open,
  onClose,
  onSubmit,
  item,
  mode,
  patientList,
  assignments,
  employees,
  fetchAssignments,
  fetchEmployees
}) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const context = useContext(SupaContext);

  // Patient selection
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Assignments and employees data
  const [assignmentList, setAssignmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isPopulatingIDT, setIsPopulatingIDT] = useState(false);
  const populateTimeoutRef = useRef(null);

  // Admission group
  const [admission, setAdmission] = useState({
    demographicSheet: { checked: false },
    hospiceEvalOrder: "",
    informedConsent: "",
    electionOfHospice: "",
    polstrDnr: "",
    changeOfHospice: "",
    poaAdvanceDirective: "",
    billOfRights: "",
    telehealthConsent: "",
    patientNotification: "",
  });

  // Assessment group
  const [assessment, setAssessment] = useState({
    nursing: "",
    nursingRemarks: "",
    spiritual: "",
    spiritualRemarks: "",
    psychosocial: "",
    psychosocialRemarks: "",
  });

  // Treatment Order group
  const [treatmentOrder, setTreatmentOrder] = useState({
    treatmentOrder: { checked: false },
  });

  // Physician group
  const [physician, setPhysician] = useState({
    cti: { value: "", date: "" },
    order: { value: "", date: "" },
    f2fVisit: { value: "", date: "" },
    referral: "",
  });

  // IDG Notes
  const [idgNotes, setIdgNotes] = useState({
    date: "",
    createdUser: "",
    remarks: "",
  });

  // Skilled Nursing Notes
  const [skilledNursingNotes, setSkilledNursingNotes] = useState({
    date: "",
    createdUser: "",
    remarks: "",
  });

  // HA Notes
  const [haNotes, setHaNotes] = useState({
    date: "",
    createdUser: "",
    remarks: "",
  });

  // Volunteer Notes
  const [volunteerNotes, setVolunteerNotes] = useState({
    date: "",
    createdUser: "",
    remarks: "",
  });

  // Miscellaneous group
  const [miscellaneous, setMiscellaneous] = useState({
    medicalRecords: "",
    dpoa: "",
    hp: "",
    eligibility: "",
    insuranceCard: "",
    id: "",
    dme: "",
    transportation: "",
  });

  // Discharge group
  const [discharge, setDischarge] = useState({
    date: "",
    reason: "",
    documentation: { checked: false },
  });

  // Compliance group
  const [compliance, setCompliance] = useState({
    hopeAdmission: { value: "", date: "" },
    hopeHuv1: { value: "", date: "" },
    hopeHuv2: { value: "", date: "" },
    hopeDischarge: { value: "", date: "" },
    lcdEligibility: { checked: false },
  });

  // POC array
  const [poc, setPoc] = useState([]);

  // Fetch employees when modal opens
  useEffect(() => {
    if (open && context.userProfile?.companyId) {
      fetchEmployees({ companyId: context.userProfile.companyId });
    }
  }, [open]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (populateTimeoutRef.current) {
        clearTimeout(populateTimeoutRef.current);
      }
    };
  }, []);

  // Process employee data
  useEffect(() => {
    if (employees && employees.status === ACTION_STATUSES.SUCCEED) {
      const fetchedEmployees = employees.data || [];
      const employeeOptions = fetchedEmployees
        .map((emp) => ({
          id: emp.id,
          value: emp.name || `${emp.fn || ''} ${emp.ln || ''}`.trim(),
          label: emp.name || `${emp.fn || ''} ${emp.ln || ''}`.trim(),
          status: emp.status,
          firstName: emp.fn || '',
        }))
        .sort((a, b) => {
          // Sort by first name alphabetically
          const nameA = a.firstName.toLowerCase();
          const nameB = b.firstName.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      setEmployeeList(employeeOptions);
    }
  }, [employees]);

  // Process assignment data
  useEffect(() => {
    if (assignments && assignments.status === ACTION_STATUSES.SUCCEED) {
      setAssignmentList(assignments.data || []);
    } else if (assignments && assignments.status === ACTION_STATUSES.FAILED) {
      // Clear timeout and reset loading state if fetch fails
      if (populateTimeoutRef.current) {
        clearTimeout(populateTimeoutRef.current);
        populateTimeoutRef.current = null;
      }
      setIsPopulatingIDT(false);
      alert("Failed to fetch IDT assignments. Please try again.");
    }
  }, [assignments]);

  // Initialize form with existing data
  useEffect(() => {
    if (mode === "edit" && item) {
      // Set patient
      const patient = patientList.find((p) => p.id === item.patientId);
      if (patient) {
        setSelectedPatient(patient);
      }

      // Set all groups
      setAdmission(item.admission || admission);
      setAssessment(item.assessment || assessment);
      setTreatmentOrder(item.treatmentOrder || treatmentOrder);
      setPhysician(item.physician || physician);
      setIdgNotes(item.idgNotes || idgNotes);
      setSkilledNursingNotes(item.skilledNursingNotes || skilledNursingNotes);
      setHaNotes(item.haNotes || haNotes);
      setVolunteerNotes(item.volunteerNotes || volunteerNotes);
      setMiscellaneous(item.miscellaneous || miscellaneous);
      setDischarge(item.discharge || discharge);
      setCompliance(item.compliance || compliance);
      setPoc(item.poc || []);
    } else {
      // Reset for create mode
      resetForm();
    }
  }, [item, mode, open]);

  const resetForm = () => {
    setSelectedPatient(null);
    setAdmission({
      demographicSheet: { checked: false },
      hospiceEvalOrder: "",
      informedConsent: "",
      electionOfHospice: "",
      polstrDnr: "",
      changeOfHospice: "",
      poaAdvanceDirective: "",
      billOfRights: "",
      telehealthConsent: "",
      patientNotification: "",
    });
    setAssessment({
      nursing: "",
      nursingRemarks: "",
      spiritual: "",
      spiritualRemarks: "",
      psychosocial: "",
      psychosocialRemarks: "",
    });
    setTreatmentOrder({
      treatmentOrder: { checked: false },
    });
    setPhysician({
      cti: { value: "", date: "" },
      order: { value: "", date: "" },
      f2fVisit: { value: "", date: "" },
      referral: "",
    });
    setIdgNotes({ date: "", createdUser: "", remarks: "" });
    setSkilledNursingNotes({ date: "", createdUser: "", remarks: "" });
    setHaNotes({ date: "", createdUser: "", remarks: "" });
    setVolunteerNotes({ date: "", createdUser: "", remarks: "" });
    setMiscellaneous({
      medicalRecords: "",
      dpoa: "",
      hp: "",
      eligibility: "",
      insuranceCard: "",
      id: "",
      dme: "",
      transportation: "",
    });
    setDischarge({ date: "", reason: "", documentation: { checked: false } });
    setCompliance({
      hopeAdmission: { value: "", date: "" },
      hopeHuv1: { value: "", date: "" },
      hopeHuv2: { value: "", date: "" },
      hopeDischarge: { value: "", date: "" },
      lcdEligibility: { checked: false },
    });
    setPoc([]);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBooleanChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: { ...group[field], checked: event.target.checked },
    });
  };

  const handleBooleanWithDateChange = (group, setGroup, field, type) => (event) => {
    if (type === "checkbox") {
      setGroup({
        ...group,
        [field]: { ...group[field], checked: event.target.checked },
      });
    } else if (type === "date") {
      setGroup({
        ...group,
        [field]: { ...group[field], date: event.target.value },
      });
    }
  };

  const handleDateChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: event.target.value,
    });
  };

  const handleTextChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: event.target.value,
    });
  };

  const handleSelectWithDateChange = (group, setGroup, field, type) => (event) => {
    if (type === "select") {
      setGroup({
        ...group,
        [field]: { ...group[field], value: event.target.value },
      });
    } else if (type === "date") {
      setGroup({
        ...group,
        [field]: { ...group[field], date: event.target.value },
      });
    }
  };

  const renderYNNASelect = (label, value, group, setGroup, field) => (
    <FormControl fullWidth style={{ marginBottom: "15px" }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleSelectChange(group, setGroup, field)}
      >
        <MenuItem value="">-- Select --</MenuItem>
        <MenuItem value="Y">Yes</MenuItem>
        <MenuItem value="N">No</MenuItem>
        <MenuItem value="NA">Not Applicable</MenuItem>
      </Select>
    </FormControl>
  );

  const renderYNNASelectWithRemarks = (label, value, remarks, group, setGroup, field, remarksField) => (
    <div style={{ marginBottom: "15px" }}>
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={handleSelectChange(group, setGroup, field)}
        >
          <MenuItem value="">-- Select --</MenuItem>
          <MenuItem value="Y">Yes</MenuItem>
          <MenuItem value="N">No</MenuItem>
          <MenuItem value="NA">Not Applicable</MenuItem>
        </Select>
      </FormControl>
      {(value === "N" || value === "NA") && (
        <TextField
          label={`${label} - Remarks`}
          value={remarks}
          onChange={handleTextChange(group, setGroup, remarksField)}
          fullWidth
          multiline
          rows={2}
          placeholder="Please explain why..."
        />
      )}
    </div>
  );

  const renderYNNASelectWithDate = (label, data, group, setGroup, field) => (
    <div style={{ marginBottom: "15px" }}>
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={data.value}
          onChange={handleSelectWithDateChange(group, setGroup, field, "select")}
        >
          <MenuItem value="">-- Select --</MenuItem>
          <MenuItem value="Y">Yes</MenuItem>
          <MenuItem value="N">No</MenuItem>
          <MenuItem value="NA">Not Applicable</MenuItem>
        </Select>
      </FormControl>
      {data.value === "Y" && (
        <TextField
          type="date"
          label={`${label} Date`}
          value={data.date}
          onChange={handleSelectWithDateChange(group, setGroup, field, "date")}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      )}
    </div>
  );

  const addPocEntry = () => {
    setPoc([...poc, { staff: "", frequency: "" }]);
  };

  const removePocEntry = (index) => {
    const newPoc = [...poc];
    newPoc.splice(index, 1);
    setPoc(newPoc);
  };

  const handlePocChange = (index, field, value) => {
    const newPoc = [...poc];
    newPoc[index][field] = value;
    setPoc(newPoc);
  };

  const handlePopulateIDTAssignment = () => {
    if (!selectedPatient) {
      alert("Please select a patient first");
      return;
    }

    if (!context.userProfile?.companyId) {
      alert("Company ID not found");
      return;
    }

    // Clear any existing timeout
    if (populateTimeoutRef.current) {
      clearTimeout(populateTimeoutRef.current);
    }

    setIsPopulatingIDT(true);
    fetchAssignments({ companyId: context.userProfile.companyId });

    // Safety timeout to prevent infinite loading state
    populateTimeoutRef.current = setTimeout(() => {
      setIsPopulatingIDT(false);
      console.warn("IDT Assignment population timed out");
    }, 15000); // 15 seconds timeout
  };

  // Populate POC when assignments are fetched
  useEffect(() => {
    if (isPopulatingIDT && selectedPatient && assignments?.status === ACTION_STATUSES.SUCCEED) {
      // Clear the timeout since we're processing
      if (populateTimeoutRef.current) {
        clearTimeout(populateTimeoutRef.current);
        populateTimeoutRef.current = null;
      }

      // Check if we have assignment data (even if empty array)
      if (assignmentList.length === 0) {
        alert("No IDT assignments found for this patient");
        setIsPopulatingIDT(false);
        return;
      }

      // Filter assignments by patient code
      const patientAssignments = assignmentList.filter(
        (assignment) => assignment.patientCd === selectedPatient.patientCd
      );

      if (patientAssignments.length === 0) {
        alert("No IDT assignments found for this patient");
        setIsPopulatingIDT(false);
        return;
      }

      // Map assignments to POC entries
      const pocEntries = patientAssignments.map((assignment) => ({
        staff: `${assignment.disciplinePosition || ""} - ${
          assignment.disciplineName || ""
        }`.trim(),
        frequency: assignment.frequencyVisit && assignment.visitType
          ? `${assignment.frequencyVisit}/${assignment.visitType}`
          : "",
      }));

      setPoc(pocEntries);
      setIsPopulatingIDT(false);
    }
  }, [assignmentList, isPopulatingIDT, selectedPatient, assignments]);

  const handleSubmit = () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }

    const data = {
      patientId: selectedPatient.id,
      patientCd: selectedPatient.patientCd,
      admission,
      assessment,
      treatmentOrder,
      physician,
      idgNotes,
      skilledNursingNotes,
      haNotes,
      volunteerNotes,
      miscellaneous,
      discharge,
      compliance,
      poc,
    };

    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>
            {mode === "edit" ? "Edit" : "Add"} Patient Onboarding Checklist
          </h3>
          <Clear style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <div className={classes.content}>
          {/* Patient Selection */}
          <div style={{ marginBottom: "20px" }}>
            <CustomSingleAutoComplete
              placeholder="Select Patient"
              label="Select Patient"
              searchList={patientList || []}
              options={patientList || []}
              value={selectedPatient}
              onSelectHandler={handlePatientSelect}
              disabled={mode === "edit"}
            />
          </div>

          {/* 1. Admission */}
          <Accordion className={classes.accordion} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">1. Admission</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.demographicSheet.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "demographicSheet")}
                      color="primary"
                    />
                  }
                  label="Demographic Sheet"
                />

                {/* Consents Subsection */}
                <Typography variant="subtitle1" style={{ marginTop: "15px", marginBottom: "10px", fontWeight: "600", color: "#667eea" }}>
                  Consents
                </Typography>
                <div style={{ paddingLeft: "20px", borderLeft: "3px solid #667eea", marginLeft: "10px" }}>
                  <FormControl fullWidth style={{ marginBottom: "15px" }}>
                    <InputLabel>Hospice Eval Order</InputLabel>
                    <Select
                      value={admission.hospiceEvalOrder}
                      onChange={handleSelectChange(admission, setAdmission, "hospiceEvalOrder")}
                    >
                      <MenuItem value="">-- Select --</MenuItem>
                      <MenuItem value="Y">Yes</MenuItem>
                      <MenuItem value="N">No</MenuItem>
                      <MenuItem value="NA">Not Applicable</MenuItem>
                    </Select>
                  </FormControl>
                  {renderYNNASelect("Informed Consent", admission.informedConsent, admission, setAdmission, "informedConsent")}
                  {renderYNNASelect("Election of Hospice", admission.electionOfHospice, admission, setAdmission, "electionOfHospice")}
                  {renderYNNASelect("Polstr/DNR", admission.polstrDnr, admission, setAdmission, "polstrDnr")}
                  {renderYNNASelect("Change of Hospice (if applicable)", admission.changeOfHospice, admission, setAdmission, "changeOfHospice")}
                  {renderYNNASelect("POA/Advance Directive", admission.poaAdvanceDirective, admission, setAdmission, "poaAdvanceDirective")}
                  {renderYNNASelect("Bill of Rights", admission.billOfRights, admission, setAdmission, "billOfRights")}
                  {renderYNNASelect("Telehealth Consent", admission.telehealthConsent, admission, setAdmission, "telehealthConsent")}
                </div>

                {renderYNNASelect("Patient Notification", admission.patientNotification, admission, setAdmission, "patientNotification")}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 2. Assessment */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">2. Assessment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                {renderYNNASelectWithRemarks(
                  "Nursing",
                  assessment.nursing,
                  assessment.nursingRemarks,
                  assessment,
                  setAssessment,
                  "nursing",
                  "nursingRemarks"
                )}
                {renderYNNASelectWithRemarks(
                  "Spiritual",
                  assessment.spiritual,
                  assessment.spiritualRemarks,
                  assessment,
                  setAssessment,
                  "spiritual",
                  "spiritualRemarks"
                )}
                {renderYNNASelectWithRemarks(
                  "Psychosocial",
                  assessment.psychosocial,
                  assessment.psychosocialRemarks,
                  assessment,
                  setAssessment,
                  "psychosocial",
                  "psychosocialRemarks"
                )}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 3. Treatment Order */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">3. Treatment Order</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={treatmentOrder.treatmentOrder.checked}
                      onChange={handleBooleanChange(treatmentOrder, setTreatmentOrder, "treatmentOrder")}
                      color="primary"
                    />
                  }
                  label="Treatment Order"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 4. Physician */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">4. Physician</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                {renderYNNASelectWithDate("CTI", physician.cti, physician, setPhysician, "cti")}
                {renderYNNASelectWithDate("Order", physician.order, physician, setPhysician, "order")}
                {renderYNNASelectWithDate("F2F Visit", physician.f2fVisit, physician, setPhysician, "f2fVisit")}
                {renderYNNASelect("Referral", physician.referral, physician, setPhysician, "referral")}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 5. IDG Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">5. IDG Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={idgNotes.date}
                  onChange={handleDateChange(idgNotes, setIdgNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth style={{ marginBottom: "15px" }}>
                  <InputLabel>Created User</InputLabel>
                  <Select
                    value={idgNotes.createdUser}
                    onChange={handleSelectChange(idgNotes, setIdgNotes, "createdUser")}
                  >
                    <MenuItem value="">-- Select Employee --</MenuItem>
                    {employeeList.map((emp) => (
                      <MenuItem key={emp.id} value={emp.value}>
                        {emp.label} {emp.status === "inactive" ? "(Inactive)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Remarks"
                  value={idgNotes.remarks}
                  onChange={handleTextChange(idgNotes, setIdgNotes, "remarks")}
                  fullWidth
                  multiline
                  rows={2}
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 6. Skilled Nursing Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">6. Skilled Nursing Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={skilledNursingNotes.date}
                  onChange={handleDateChange(skilledNursingNotes, setSkilledNursingNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth style={{ marginBottom: "15px" }}>
                  <InputLabel>Created User</InputLabel>
                  <Select
                    value={skilledNursingNotes.createdUser}
                    onChange={handleSelectChange(skilledNursingNotes, setSkilledNursingNotes, "createdUser")}
                  >
                    <MenuItem value="">-- Select Employee --</MenuItem>
                    {employeeList.map((emp) => (
                      <MenuItem key={emp.id} value={emp.value}>
                        {emp.label} {emp.status === "inactive" ? "(Inactive)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Remarks"
                  value={skilledNursingNotes.remarks}
                  onChange={handleTextChange(skilledNursingNotes, setSkilledNursingNotes, "remarks")}
                  fullWidth
                  multiline
                  rows={2}
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 7. HA Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">7. HA Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={haNotes.date}
                  onChange={handleDateChange(haNotes, setHaNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth style={{ marginBottom: "15px" }}>
                  <InputLabel>Created User</InputLabel>
                  <Select
                    value={haNotes.createdUser}
                    onChange={handleSelectChange(haNotes, setHaNotes, "createdUser")}
                  >
                    <MenuItem value="">-- Select Employee --</MenuItem>
                    {employeeList.map((emp) => (
                      <MenuItem key={emp.id} value={emp.value}>
                        {emp.label} {emp.status === "inactive" ? "(Inactive)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Remarks"
                  value={haNotes.remarks}
                  onChange={handleTextChange(haNotes, setHaNotes, "remarks")}
                  fullWidth
                  multiline
                  rows={2}
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 8. Volunteer Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">8. Volunteer Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={volunteerNotes.date}
                  onChange={handleDateChange(volunteerNotes, setVolunteerNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth style={{ marginBottom: "15px" }}>
                  <InputLabel>Created User</InputLabel>
                  <Select
                    value={volunteerNotes.createdUser}
                    onChange={handleSelectChange(volunteerNotes, setVolunteerNotes, "createdUser")}
                  >
                    <MenuItem value="">-- Select Employee --</MenuItem>
                    {employeeList.map((emp) => (
                      <MenuItem key={emp.id} value={emp.value}>
                        {emp.label} {emp.status === "inactive" ? "(Inactive)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Remarks"
                  value={volunteerNotes.remarks}
                  onChange={handleTextChange(volunteerNotes, setVolunteerNotes, "remarks")}
                  fullWidth
                  multiline
                  rows={2}
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 9. Miscellaneous */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">9. Miscellaneous</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                {renderYNNASelect("Medical Records", miscellaneous.medicalRecords, miscellaneous, setMiscellaneous, "medicalRecords")}
                {renderYNNASelect("DPOA", miscellaneous.dpoa, miscellaneous, setMiscellaneous, "dpoa")}
                {renderYNNASelect("HP (History & Physical)", miscellaneous.hp, miscellaneous, setMiscellaneous, "hp")}
                {renderYNNASelect("Eligibility", miscellaneous.eligibility, miscellaneous, setMiscellaneous, "eligibility")}
                {renderYNNASelect("Insurance Card", miscellaneous.insuranceCard, miscellaneous, setMiscellaneous, "insuranceCard")}
                {renderYNNASelect("ID", miscellaneous.id, miscellaneous, setMiscellaneous, "id")}
                {renderYNNASelect("DME", miscellaneous.dme, miscellaneous, setMiscellaneous, "dme")}
                {renderYNNASelect("Transportation", miscellaneous.transportation, miscellaneous, setMiscellaneous, "transportation")}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 10. Discharge */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">10. Discharge</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={discharge.date}
                  onChange={handleDateChange(discharge, setDischarge, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Reason"
                  value={discharge.reason}
                  onChange={handleTextChange(discharge, setDischarge, "reason")}
                  fullWidth
                  multiline
                  rows={2}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={discharge.documentation?.checked || false}
                      onChange={(e) => setDischarge({
                        ...discharge,
                        documentation: { checked: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="Documentation"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 11. Compliance */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">11. Compliance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                {renderYNNASelectWithDate("HOPE Admission", compliance.hopeAdmission, compliance, setCompliance, "hopeAdmission")}
                {renderYNNASelectWithDate("HOPE HUV 1", compliance.hopeHuv1, compliance, setCompliance, "hopeHuv1")}
                {renderYNNASelectWithDate("HOPE HUV 2", compliance.hopeHuv2, compliance, setCompliance, "hopeHuv2")}
                {renderYNNASelectWithDate("HOPE Discharge", compliance.hopeDischarge, compliance, setCompliance, "hopeDischarge")}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={compliance.lcdEligibility?.checked || false}
                      onChange={(e) => setCompliance({
                        ...compliance,
                        lcdEligibility: { checked: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="LCD Eligibility"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 12. Plan of Care (POC) */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">12. Plan of Care (POC)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <MuiButton
                    variant="contained"
                    color="primary"
                    startIcon={isPopulatingIDT ? <CircularProgress size={20} color="inherit" /> : <PopulateIcon />}
                    onClick={handlePopulateIDTAssignment}
                    disabled={!selectedPatient || isPopulatingIDT}
                  >
                    {isPopulatingIDT ? "Loading..." : "Populate IDT Assignment"}
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={addPocEntry}
                  >
                    Add POC Entry
                  </MuiButton>
                </div>
                {poc.map((entry, index) => (
                  <div key={index} className={classes.pocEntry}>
                    <TextField
                      label="Staff"
                      value={entry.staff}
                      onChange={(e) => handlePocChange(index, "staff", e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <TextField
                      label="Frequency"
                      value={entry.frequency}
                      onChange={(e) => handlePocChange(index, "frequency", e.target.value)}
                      placeholder="e.g., 1/wk, 2/month"
                      style={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={() => removePocEntry(index)}
                      color="secondary"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className={classes.footer}>
          <Button color="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  assignments: assignmentListStateSelector(state),
  employees: employeeListStateSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  fetchEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistModal);

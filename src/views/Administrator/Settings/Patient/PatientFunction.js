import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import PatientHandler from "./handler/PatientHandler";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";

import HospiceTable from "components/Table/HospiceTable";
import { AddAlert, ImportExport, Print } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";

import PatientForm from "./components/Form";
import PrintAssessmentTrendsModal from "./components/PrintAssessmentTrendsModal";
import { attemptToUpdatePatient } from "store/actions/patientAction";

import { patientListStateSelector } from "store/selectors/patientSelector";
import { patientCreateStateSelector } from "store/selectors/patientSelector";
import { patientUpdateStateSelector } from "store/selectors/patientSelector";
import { patientDeleteStateSelector } from "store/selectors/patientSelector";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToCreatePatient } from "store/actions/patientAction";
import { resetCreatePatientState } from "store/actions/patientAction";
import { resetUpdatePatientState } from "store/actions/patientAction";
import { attemptToDeletePatient } from "store/actions/patientAction";
import { resetDeletePatientState } from "store/actions/patientAction";
import FilterTable from "components/Table/FilterTable";
import { attemptToFetchLocation } from "store/actions/locationAction";
import { resetFetchLocationState } from "store/actions/locationAction";
import { locationListStateSelector } from "store/selectors/locationSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import Snackbar from "components/Snackbar/Snackbar";
import { handleExport } from "utils/XlsxHelper";
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
};

const useStyles = makeStyles(styles);
let productList = [];
let grandTotal = 0.0;
let originalSource = undefined;
let locationList = [];

let isListPatientDone = false;
let isListLocationDone = false;
function PatientFunction(props) {
  const classes = useStyles();
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const context = useContext(SupaContext);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(PatientHandler.columns(true));
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [isCreatePatientCollection, setIsCreatePatientCollection] = useState(
    true
  );
  const [isUpdatePatientCollection, setIsUpdatePatientCollection] = useState(
    true
  );
  const [isDeletePatientCollection, setIsDeletePatientCollection] = useState(
    true
  );
  const [isProductCollection, setIsProductCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");
  const [isAssessmentTrendsModalOpen, setIsAssessmentTrendsModalOpen] = useState(false);
  const [logoBase64, setLogoBase64] = useState(null);

  const showNotification = (place, color, msg) => {
    setMessage(msg);
    switch (place) {
      case "tc":
        if (!tc) {
          setTC(true);
          setColor(color);
          setTimeout(function () {
            setTC(false);
          }, 6000);
        }
        break;
      default:
        break;
    }
  };

  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isPatientsCollection &&
      props.patients &&
      props.patients.status === ACTION_STATUSES.SUCCEED
    ) {
      isListPatientDone = true;
      props.resetListPatients();
      setIsPatientsCollection(true);
    }

    if (
      !isCreatePatientCollection &&
      props.createPatientState &&
      props.createPatientState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreatePatient();

      setIsCreatePatientCollection(true);
    }
    if (
      !isUpdatePatientCollection &&
      props.updatePatientState &&
      props.updatePatientState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdatePatient();

      setIsUpdatePatientCollection(true);
    }
    if (
      !isDeletePatientCollection &&
      props.deletePatientState &&
      props.deletePatientState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeletePatient();
      setIsDeletePatientCollection(true);
    }
  }, [
    isDeletePatientCollection,
    isUpdatePatientCollection,
    isCreatePatientCollection,
    isPatientsCollection,
  ]);
  useEffect(() => {
    console.log("list Patients", props.profileState);
    if (context.userProfile?.companyId) {
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listLocations({ companyId: context.userProfile?.companyId });
    }

    // Load logo for PDF generation
    const loadLogo = async () => {
      try {
        const logoUrl = "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
        const logo = await Helper.getImageBase64(logoUrl);
        setLogoBase64(logo);
      } catch (error) {
        console.error("Failed to load logo:", error);
      }
    };
    loadLogo();
  }, []);

  const sortByWorth = (items) => {
    items.sort((a, b) => {
      const tempA = !a.worth ? 0 : parseFloat(a.worth);
      const tempB = !b.worth ? 0 : parseFloat(b.worth);
      if (tempA > tempB) {
        return -1;
      }
      if (tempA < tempB) {
        return 1;
      }
      return 0;
    });

    console.log("[return me]", items);
    return items;
  };
  if (
    isPatientsCollection &&
    props.patients &&
    props.patients.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.patients.data;
    if (source && source.length) {
      source = PatientHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = PatientHandler.columns(true).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              printHandler={printPatientInfoHandler}
              isPrintFunction={true}
              data={{ ...cellProps.data }}
            />
          ),
        };
      } else {
        return {
          ...col,
          editable: () => false,
        };
      }
    });
    setColumns(cols);
    originalSource = [...source];
    source = sortByWorth(source);
    setDataSource(source);
    setIsPatientsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Patient id]", id);
    props.deletePatient(id);
  };
  const createPatientHandler = (payload, mode) => {
    const params = {
      fn: "*",
      patientCd: payload.patientCd,
      phone: payload.phone,
      address: payload.address,
      contactPerson: payload.contactPerson,
      ln: "*",
      soc: new Date(payload.soc),
      status:
        payload.status && payload.status.value
          ? payload.status.value
          : "Active",
      location: payload.location ? payload.location.name : "",
      locationId: payload.location ? payload.location.id : "",
      careType: payload.location ? payload.location.locationType : "",
      locationCd: payload.location ? payload.location.locationCd : "",
      insurance: payload.insurance?.name,
      insuranceCd: payload.insurance?.code,
      state: payload.state?.code || null,
      county: payload.county?.name || null,
      is_prior_hospice: payload.isPriorHospice,
      prior_benefits_period: parseInt(payload.priorBenefitsPeriod || 0, 10),
      prior_day_care: parseInt(payload.priorDayCare || 0, 10),
      prior_last_day_care: parseInt(payload.lastDayCare || 0, 10),
      prior_hospice_discharge: payload.priorHospiceDischarge?.name,
      eoc_discharge: payload.eocDischarge?.name,
      new_hospice_care_day: parseInt(payload.newHospiceCareDays || 0, 10),
      admitted_benefits_period: parseInt(payload.numberOfBenefits || 0, 10),
      assessment: payload.assessment?.value || payload.assessment || null,
      dme: payload.dme || [],
      dme_last_dt: payload.dme_last_dt || null,
      dme_end_dt: payload.dme_end_dt || null,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    if (payload.recertDt) {
      params.last_recertification_dt = payload.recertDt;
    }
    if (payload.priorHospiceDischargeDt) {
      params.prior_hospice_discharge_dt = payload.priorHospiceDischargeDt;
    }
    if (payload.newHospiceDod) {
      params.new_hospice_dod = payload.newHospiceDod;
    }
    if (payload.eoc) {
      params.eoc = new Date(payload.eoc);
      params.status = "Inactive";
    }
    if (mode === "create") {
      params.created = new Date();
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };
      props.createPatient(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updatePatient(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Patient Collection]", props.createPatientState);
  if (
    isCreatePatientCollection &&
    props.createPatientState &&
    props.createPatientState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreatePatientCollection(false);
    showNotification("tc", "success", "Patient successfully created.");
    props.listPatients({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdatePatientCollection &&
    props.updatePatientState &&
    props.updatePatientState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Patient successfully updated.");
    setIsUpdatePatientCollection(false);
    props.listPatients({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeletePatient]",
    isDeletePatientCollection,
    props.deletePatientState
  );
  if (
    isDeletePatientCollection &&
    props.deletePatientState &&
    props.deletePatientState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Patient successfully deleted.");
    setIsDeletePatientCollection(false);

    props.listPatients({ companyId: context.userProfile?.companyId });
  }

  if (props.locations && props.locations.status === ACTION_STATUSES.SUCCEED) {
    locationList = props.locations.data;
    isListLocationDone = true;
    props.resetListLocations();
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Original]", originalSource);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];

      let found = temp.filter(
        (data) =>
          data.patientCd?.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );

      setDataSource(found);
    }
  };
  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    }
    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];
    dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `patient_list_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
    }
  };

  const printPatientInfoHandler = (patient) => {
    if (!patient) return;

    // Find location details
    const location = locationList.find(loc => loc.locationCd === patient.locationCd);

    // Create a new window for the PDF
    const printWindow = window.open('', '_blank');

    // Build the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Information - ${patient.patientCd}</title>
        <style>
          @media print {
            @page { margin: 0.5in; }
            body { margin: 0; }
            .no-print { display: none; }
          }

          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #e91e63;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .header img {
            max-width: 300px;
            height: auto;
            margin-bottom: 10px;
          }

          .header h1 {
            color: #e91e63;
            margin: 10px 0;
            font-size: 28px;
            font-weight: 300;
          }

          .patient-code {
            font-size: 18px;
            color: #666;
            margin: 5px 0;
          }

          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }

          .section-title {
            background: #e91e63;
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            border-radius: 4px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px 30px;
            padding: 0 15px;
          }

          .info-item {
            display: flex;
            flex-direction: column;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .info-label {
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            font-weight: 600;
          }

          .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 400;
          }

          .info-value.empty {
            color: #ccc;
            font-style: italic;
          }

          .dme-list {
            padding: 0 15px;
          }

          .dme-item {
            padding: 8px 12px;
            background: #f8f8f8;
            margin-bottom: 8px;
            border-left: 3px solid #e91e63;
            border-radius: 3px;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #999;
            font-size: 12px;
          }

          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e91e63;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
            transition: all 0.3s ease;
          }

          .print-button:hover {
            background: #c2185b;
            box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
          }

          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-active {
            background: #e8f5e9;
            color: #2e7d32;
          }

          .status-inactive {
            background: #ffebee;
            color: #c62828;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ Print PDF</button>

        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Company Logo" />` : ''}
          <h1>Patient Information Report</h1>
          <div class="patient-code">Patient Code: <strong>${patient.patientCd || 'N/A'}</strong></div>
          <div class="patient-code">
            Status:
            <span class="status-badge ${patient.status === 'Active' ? 'status-active' : 'status-inactive'}">
              ${patient.status || 'N/A'}
            </span>
          </div>
        </div>

        <!-- Patient Profile -->
        <div class="section">
          <div class="section-title">Patient Profile</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Last Name</div>
              <div class="info-value">${patient.ln || ''}</div>
            </div>
            <div class="info-item">
              <div class="info-label">First Name</div>
              <div class="info-value">${patient.fn || ''}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value ${!patient.phone ? 'empty' : ''}">${patient.phone || 'Not provided'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Contact Person</div>
              <div class="info-value ${!patient.contactPerson ? 'empty' : ''}">${patient.contactPerson || 'Not provided'}</div>
            </div>
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">Address</div>
              <div class="info-value ${!patient.address ? 'empty' : ''}">${patient.address || 'Not provided'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Location</div>
              <div class="info-value">${location?.name || patient.locationCd || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Care Type</div>
              <div class="info-value ${!patient.careType ? 'empty' : ''}">${patient.careType || 'Not specified'}</div>
            </div>
          </div>
        </div>

        <!-- Prior Hospice Information -->
        <div class="section">
          <div class="section-title">Prior Hospice Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Has Prior Hospice Care</div>
              <div class="info-value">${patient.is_prior_hospice ? 'Yes' : 'No'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Prior Hospice Discharge Reason</div>
              <div class="info-value ${!patient.prior_hospice_discharge ? 'empty' : ''}">${patient.prior_hospice_discharge || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Prior Hospice Discharge Date</div>
              <div class="info-value ${!patient.prior_hospice_discharge_dt ? 'empty' : ''}">${patient.prior_hospice_discharge_dt ? moment(patient.prior_hospice_discharge_dt).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Prior Hospice Total Daycare</div>
              <div class="info-value ${!patient.prior_day_care ? 'empty' : ''}">${patient.prior_day_care || '0'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Prior Hospice Last Daycare</div>
              <div class="info-value ${!patient.prior_last_day_care ? 'empty' : ''}">${patient.prior_last_day_care || '0'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Max Benefits Period</div>
              <div class="info-value ${!patient.prior_benefits_period ? 'empty' : ''}">${patient.prior_benefits_period || 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- Admission Information -->
        <div class="section">
          <div class="section-title">Admission Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">SOC (Start of Care)</div>
              <div class="info-value">${patient.soc ? moment(patient.soc).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Admitted Benefits Period</div>
              <div class="info-value">${patient.admitted_benefits_period || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Current Benefits Period</div>
              <div class="info-value">${patient.current_benefits || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Insurance</div>
              <div class="info-value ${!patient.insurance ? 'empty' : ''}">${patient.insurance || 'Not specified'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">State</div>
              <div class="info-value ${!patient.state ? 'empty' : ''}">${patient.state || 'Not specified'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">County</div>
              <div class="info-value ${!patient.county ? 'empty' : ''}">${patient.county || 'Not specified'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Eligible for Cap</div>
              <div class="info-value">${patient.is_eligible_cap ? 'Yes' : 'No'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Recertification Date</div>
              <div class="info-value ${!patient.last_recertification_dt ? 'empty' : ''}">${patient.last_recertification_dt ? moment(patient.last_recertification_dt).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Clinician Assessment</div>
              <div class="info-value ${!patient.assessment ? 'empty' : ''}">${patient.assessment || 'Not assessed'}</div>
            </div>
          </div>
        </div>

        <!-- EOC / Discharge Information -->
        <div class="section">
          <div class="section-title">EOC / Discharge Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">EOC (End of Care)</div>
              <div class="info-value ${!patient.eoc ? 'empty' : ''}">${patient.eoc ? moment(patient.eoc).format('MM/DD/YYYY') : 'Not discharged'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">EOC Discharge Reason</div>
              <div class="info-value ${!patient.eoc_discharge ? 'empty' : ''}">${patient.eoc_discharge || 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- Post-Discharge Information -->
        <div class="section">
          <div class="section-title">Post-Discharge (EOC)</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Total Hospice Days of Care (All Agencies)</div>
              <div class="info-value ${!patient.new_hospice_care_day ? 'empty' : ''}">${patient.new_hospice_care_day || '0'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date of Death</div>
              <div class="info-value ${!patient.new_hospice_dod ? 'empty' : ''}">${patient.new_hospice_dod ? moment(patient.new_hospice_dod).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- DME Information -->
        <div class="section">
          <div class="section-title">DME Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">DME Last Invoice Date</div>
              <div class="info-value ${!patient.dme_last_dt ? 'empty' : ''}">${patient.dme_last_dt ? moment(patient.dme_last_dt).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">DME End Contract Date</div>
              <div class="info-value ${!patient.dme_end_contract ? 'empty' : ''}">${patient.dme_end_contract ? moment(patient.dme_end_contract).format('MM/DD/YYYY') : 'N/A'}</div>
            </div>
          </div>
          ${patient.dme && Array.isArray(patient.dme) && patient.dme.length > 0 ? `
            <div style="margin-top: 15px;">
              <div class="info-label" style="padding: 0 15px; margin-bottom: 10px;">Equipment List (${patient.dme.length})</div>
              <div class="dme-list">
                ${patient.dme.map(equipment => `<div class="dme-item">${equipment}</div>`).join('')}
              </div>
            </div>
          ` : `
            <div style="margin-top: 15px; padding: 0 15px;">
              <div class="info-value empty">No DME equipment recorded</div>
            </div>
          `}
        </div>

        <div class="footer">
          <p>Generated on ${moment().format('MMMM DD, YYYY [at] hh:mm A')}</p>
          <p>This document contains confidential patient information</p>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      {tc && (
        <div style={{ paddingTop: 10 }}>
          <Snackbar
            place="tc"
            color={color}
            icon={AddAlert}
            message={message}
            open={tc}
            closeNotification={() => setTC(false)}
            close
          />
        </div>
      )}
      {!isListLocationDone || !isListPatientDone ? (
        <div align="center">
          <CircularProgress></CircularProgress>Loading...
        </div>
      ) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="rose">
                <Grid container justifyContent="space-between">
                  <h4 className={classes.cardTitleWhite}>Patient</h4>
                </Grid>
              </CardHeader>
              <CardBody>
                <GridContainer alignItems="center" style={{ paddingLeft: 12 }}>
                  <Grid item xs={12} md={6}>
                    <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap" }}>
                      <Button
                        color="info"
                        className={classes.marginRight}
                        onClick={() => createFormHandler()}
                      >
                        <AddIcon className={classes.icons} /> Add Patient
                      </Button>

                      <Button
                        color="rose"
                        className={classes.marginRight}
                        onClick={() => setIsAssessmentTrendsModalOpen(true)}
                        disabled={!dataSource || dataSource.length === 0}
                      >
                        <Print className={classes.icons} /> Assessment Trends
                      </Button>

                      {isAddGroupButtons && (
                        <Button
                          color="success"
                          className={classes.marginRight}
                          onClick={() => exportToExcelHandler()}
                        >
                          <ImportExport className={classes.icons} /> Export
                          Excel
                        </Button>
                      )}
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: 20,
                    }}
                  >
                    <FilterTable
                      filterRecordHandler={filterRecordHandler}
                      isNoDate={true}
                      main={false}
                      search={12}
                    />
                  </Grid>
                </GridContainer>
                <HospiceTable
                  columns={columns}
                  main={true}
                  grandTotal={grandTotal}
                  dataSource={dataSource}
                  height={400}
                  onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                />
                ;
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
      {isFormModal && (
        <PatientForm
          locationList={locationList}
          filterRecordHandler={filterRecordHandler}
          productList={productList}
          dataSource={dataSource}
          createPatientHandler={createPatientHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
      {isAssessmentTrendsModalOpen && (
        <PrintAssessmentTrendsModal
          isOpen={isAssessmentTrendsModalOpen}
          onClose={() => setIsAssessmentTrendsModalOpen(false)}
          patientsData={dataSource}
          logoBase64={logoBase64}
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  createPatientState: patientCreateStateSelector(store),
  updatePatientState: patientUpdateStateSelector(store),
  deletePatientState: patientDeleteStateSelector(store),
  locations: locationListStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listLocations: (data) => dispatch(attemptToFetchLocation(data)),
  resetListLocations: () => dispatch(resetFetchLocationState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  createPatient: (data) => dispatch(attemptToCreatePatient(data)),
  resetCreatePatient: () => dispatch(resetCreatePatientState()),
  updatePatient: (data) => dispatch(attemptToUpdatePatient(data)),
  resetUpdatePatient: () => dispatch(resetUpdatePatientState()),
  deletePatient: (data) => dispatch(attemptToDeletePatient(data)),
  resetDeletePatient: () => dispatch(resetDeletePatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientFunction);

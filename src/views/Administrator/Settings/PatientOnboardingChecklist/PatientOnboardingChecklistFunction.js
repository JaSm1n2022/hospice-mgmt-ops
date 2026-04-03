import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import HospiceTable from "components/Table/HospiceTable";
import AddIcon from "@material-ui/icons/Add";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";
import ChecklistActionsFunction from "./components/ChecklistActionsFunction";
import { connect } from "react-redux";
import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { Print as PrintIcon } from "@material-ui/icons";

import PatientOnboardingHandler from "./handler/PatientOnboardingHandler";
import ChecklistModal from "./components/ChecklistModal";
import PrintModal from "./components/PrintModal";
import PrintAllModal from "./components/PrintAllModal";

// Redux imports for Patient
import { patientListStateSelector } from "store/selectors/patientSelector";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";

// Redux imports for Patient Checklist
import {
  patientChecklistListStateSelector,
  patientChecklistCreateStateSelector,
  patientChecklistUpdateStateSelector,
  patientChecklistDeleteStateSelector,
} from "store/selectors/patientChecklistSelector";
import {
  attemptToFetchPatientChecklist,
  resetFetchPatientChecklistState,
  attemptToCreatePatientChecklist,
  resetCreatePatientChecklistState,
  attemptToUpdatePatientChecklist,
  resetUpdatePatientChecklistState,
  attemptToDeletePatientChecklist,
  resetDeletePatientChecklistState,
} from "store/actions/patientChecklistAction";

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
  },
  icons: {
    width: "17px",
    height: "17px",
    color: "#FFFFFF",
  },
};

const useStyles = makeStyles(styles);

// Define checklist structure for calculating group statuses
const CHECKLIST_STRUCTURE = {
  admission: {
    items: [
      { key: "demographicSheet", type: "boolean", mandatory: true },
      { key: "hospiceEvalOrder", type: "select", mandatory: true },
      { key: "informedConsent", type: "select", mandatory: true },
      { key: "electionOfHospice", type: "select", mandatory: true },
      { key: "polstrDnr", type: "select", mandatory: true },
      { key: "changeOfHospice", type: "select", mandatory: false },
      { key: "poaAdvanceDirective", type: "select", mandatory: true },
      { key: "billOfRights", type: "select", mandatory: true },
      { key: "telehealthConsent", type: "select", mandatory: true },
      { key: "patientNotification", type: "select", mandatory: true },
    ],
  },
  assessment: {
    items: [
      { key: "nursing", type: "select", mandatory: true },
      { key: "spiritual", type: "select", mandatory: true },
      { key: "psychosocial", type: "select", mandatory: true },
    ],
  },
  treatmentOrder: {
    items: [{ key: "treatmentOrder", type: "boolean", mandatory: true }],
  },
  physician: {
    items: [
      { key: "cti", type: "selectWithDate", mandatory: true },
      { key: "order", type: "selectWithDate", mandatory: true },
      { key: "f2fVisit", type: "selectWithDate", mandatory: true },
      { key: "referral", type: "select", mandatory: true },
    ],
  },
  idgNotes: {
    items: [
      { key: "date", type: "date", mandatory: true },
      { key: "createdUser", type: "text", mandatory: false },
      { key: "remarks", type: "text", mandatory: false },
    ],
  },
  skilledNursingNotes: {
    items: [
      { key: "date", type: "date", mandatory: true },
      { key: "createdUser", type: "text", mandatory: false },
      { key: "remarks", type: "text", mandatory: false },
    ],
  },
  haNotes: {
    items: [
      { key: "date", type: "date", mandatory: true },
      { key: "createdUser", type: "text", mandatory: false },
      { key: "remarks", type: "text", mandatory: false },
    ],
  },
  volunteerNotes: {
    items: [
      { key: "date", type: "date", mandatory: true },
      { key: "createdUser", type: "text", mandatory: false },
      { key: "remarks", type: "text", mandatory: false },
    ],
  },
  miscellaneous: {
    items: [
      { key: "medicalRecords", type: "select", mandatory: true },
      { key: "dpoa", type: "select", mandatory: true },
      { key: "hp", type: "select", mandatory: true },
      { key: "eligibility", type: "select", mandatory: true },
      { key: "insuranceCard", type: "select", mandatory: true },
      { key: "id", type: "select", mandatory: true },
      { key: "dme", type: "select", mandatory: true },
      { key: "transportation", type: "select", mandatory: true },
    ],
  },
  discharge: {
    items: [
      { key: "dischargeDate", type: "date", mandatory: false },
      { key: "dischargeReason", type: "text", mandatory: false },
      { key: "dischargeDocumentation", type: "boolean", mandatory: false },
    ],
  },
  compliance: {
    items: [
      { key: "hopeAdmission", type: "selectWithDate", mandatory: true },
      { key: "hopeHuv1", type: "selectWithDate", mandatory: true },
      { key: "hopeHuv2", type: "selectWithDate", mandatory: true },
      { key: "hopeDischarge", type: "selectWithDate", mandatory: true },
      { key: "lcdEligibility", type: "boolean", mandatory: true },
    ],
  },
  poc: {
    items: [{ key: "poc", type: "array", mandatory: false }],
  },
};

function PatientOnboardingChecklistFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [columns, setColumns] = useState(PatientOnboardingHandler.columns(true));
  const [patientList, setPatientList] = useState([]);
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isChecklistCollection, setIsChecklistCollection] = useState(true);
  const [
    isCreateChecklistCollection,
    setIsCreateChecklistCollection,
  ] = useState(true);
  const [
    isUpdateChecklistCollection,
    setIsUpdateChecklistCollection,
  ] = useState(true);
  const [
    isDeleteChecklistCollection,
    setIsDeleteChecklistCollection,
  ] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintData, setSelectedPrintData] = useState(null);
  const [isPrintAllModalOpen, setIsPrintAllModalOpen] = useState(false);

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
    setSelectedItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };

  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  const deleteRecordItemHandler = (data) => {
    if (
      window.confirm(
        `Are you sure you want to delete the checklist for ${data.patientCd}?`
      )
    ) {
      props.deleteChecklist(data.id);
      setIsDeleteChecklistCollection(false);
    }
  };

  const printChecklistHandler = (data) => {
    console.log("Print checklist for:", data);
    // Find the patient to get EOC information
    const patient = patientList.find((p) => p.id === data.patientId);
    const enrichedData = {
      ...data,
      patientEoc: patient?.eoc || null,
    };
    setSelectedPrintData(enrichedData);
    setIsPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setIsPrintModalOpen(false);
    setSelectedPrintData(null);
  };

  const printAllChecklistsHandler = () => {
    console.log("Print all checklists");
    setIsPrintAllModalOpen(true);
  };

  const closePrintAllModal = () => {
    setIsPrintAllModalOpen(false);
  };

  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
  };

  // Filter data based on search keyword
  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setFilteredDataSource(dataSource);
    } else {
      const filtered = dataSource.filter((item) => {
        const patientCd = item.patientCd?.toLowerCase() || "";
        const keyword = searchKeyword.toLowerCase();

        return patientCd.includes(keyword);
      });
      setFilteredDataSource(filtered);
    }
  }, [searchKeyword, dataSource]);

  // Handle status changes
  useEffect(() => {
    // Fetch patients completed
    if (
      !isPatientCollection &&
      props.patients &&
      props.patients.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListPatients();
      setIsPatientCollection(true);
    }

    // Fetch checklists completed
    if (
      !isChecklistCollection &&
      props.checklists &&
      props.checklists.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListChecklists();
      setIsChecklistCollection(true);
    }

    // Create completed
    if (
      !isCreateChecklistCollection &&
      props.createChecklistState &&
      props.createChecklistState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateChecklist();
      setIsCreateChecklistCollection(true);
      showNotification("tc", "success", "Checklist created successfully");
      // Refetch after create
      if (context.userProfile?.companyId) {
        props.resetListChecklists();
        setIsChecklistCollection(true);
        props.listChecklists({ companyId: context.userProfile?.companyId });
      }
    }

    // Update completed
    if (
      !isUpdateChecklistCollection &&
      props.updateChecklistState &&
      props.updateChecklistState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateChecklist();
      setIsUpdateChecklistCollection(true);
      showNotification("tc", "success", "Checklist updated successfully");
      // Refetch after update
      if (context.userProfile?.companyId) {
        props.resetListChecklists();
        setIsChecklistCollection(true);
        props.listChecklists({ companyId: context.userProfile?.companyId });
      }
    }

    // Delete completed
    if (
      !isDeleteChecklistCollection &&
      props.deleteChecklistState &&
      props.deleteChecklistState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeleteChecklist();
      setIsDeleteChecklistCollection(true);
      showNotification("tc", "success", "Checklist deleted successfully");
      // Refetch after delete
      if (context.userProfile?.companyId) {
        props.resetListChecklists();
        setIsChecklistCollection(true);
        props.listChecklists({ companyId: context.userProfile?.companyId });
      }
    }
  }, [
    isPatientCollection,
    isChecklistCollection,
    isCreateChecklistCollection,
    isUpdateChecklistCollection,
    isDeleteChecklistCollection,
    props.patients,
    props.checklists,
    props.createChecklistState,
    props.updateChecklistState,
    props.deleteChecklistState,
  ]);

  // Initial fetch
  useEffect(() => {
    if (context.userProfile?.companyId) {
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listChecklists({ companyId: context.userProfile?.companyId });
    }
  }, []);

  // Process patient data
  if (
    isPatientCollection &&
    props.patients &&
    props.patients.status === ACTION_STATUSES.SUCCEED
  ) {
    const fetchedPatients = props.patients.data || [];

    const patientOptions = fetchedPatients.map((pat) => ({
      id: pat.id,
      patientCd: pat.patientCd,
      name: pat.patientCd,
      value: pat.patientCd,
      label: pat.patientCd,
      eoc: pat.eoc, // Store EOC for conditional discharge border
    }));

    setPatientList(patientOptions);
    setIsPatientCollection(false);
  }

  // Process checklist data
  if (
    isChecklistCollection &&
    props.checklists &&
    props.checklists.status === ACTION_STATUSES.SUCCEED
  ) {
    const fetchedChecklists = props.checklists.data || [];

    // Transform database format to table format
    const tableData = fetchedChecklists.map((checklist) => {
      // Calculate group statuses
      const admissionStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.admission,
        CHECKLIST_STRUCTURE.admission.items
      );
      const assessmentStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.assessment,
        CHECKLIST_STRUCTURE.assessment.items
      );
      const treatmentOrderStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.treatmentOrder,
        CHECKLIST_STRUCTURE.treatmentOrder.items
      );
      const physicianStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.physician,
        CHECKLIST_STRUCTURE.physician.items
      );
      const idgNotesStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.idgNotes,
        CHECKLIST_STRUCTURE.idgNotes.items
      );
      const skilledNursingNotesStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.skilledNursingNotes,
        CHECKLIST_STRUCTURE.skilledNursingNotes.items
      );
      const haNotesStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.haNotes,
        CHECKLIST_STRUCTURE.haNotes.items
      );
      const volunteerNotesStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.volunteerNotes,
        CHECKLIST_STRUCTURE.volunteerNotes.items
      );
      const miscellaneousStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.miscellaneous,
        CHECKLIST_STRUCTURE.miscellaneous.items
      );
      const dischargeStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.discharge,
        CHECKLIST_STRUCTURE.discharge.items
      );
      const complianceStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.compliance,
        CHECKLIST_STRUCTURE.compliance.items
      );
      const pocStatus = PatientOnboardingHandler.calculateGroupStatus(
        checklist.poc,
        CHECKLIST_STRUCTURE.poc.items
      );

      // Calculate overall progress
      const totalItems = Object.values(CHECKLIST_STRUCTURE).reduce(
        (sum, group) => sum + group.items.filter(i => i.mandatory !== false).length,
        0
      );
      const completedItems =
        admissionStatus.completed +
        assessmentStatus.completed +
        treatmentOrderStatus.completed +
        physicianStatus.completed +
        idgNotesStatus.completed +
        skilledNursingNotesStatus.completed +
        haNotesStatus.completed +
        volunteerNotesStatus.completed +
        miscellaneousStatus.completed +
        dischargeStatus.completed +
        complianceStatus.completed +
        pocStatus.completed;
      const overallProgress = `${Math.round(
        (completedItems / totalItems) * 100
      )}%`;

      return {
        ...checklist,
        id: checklist.id,
        patientId: checklist.patientId,
        patientCd: checklist.patientCd,
        admissionStatus,
        assessmentStatus,
        treatmentOrderStatus,
        physicianStatus,
        idgNotesStatus,
        skilledNursingNotesStatus,
        haNotesStatus,
        volunteerNotesStatus,
        miscellaneousStatus,
        dischargeStatus,
        complianceStatus, // Includes all 5 items: 4 HOPE + LCD
        pocStatus,
        overallProgress,
        lastUpdated: checklist.updated_at || checklist.created_at,
      };
    });

    const mappedData = PatientOnboardingHandler.mapData(tableData);

    // Add actions to columns
    const cols = PatientOnboardingHandler.columns(true).map((col) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ChecklistActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              printChecklistHandler={printChecklistHandler}
              data={{ ...cellProps.data }}
              isNoDeleteEnabled={false}
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
    setDataSource(mappedData);
    setIsChecklistCollection(false);
  }

  const handleChecklistSubmit = (data) => {
    console.log("Submitting checklist:", data);

    const payload = {
      patientId: data.patientId,
      patientCd: data.patientCd,
      companyId: context.userProfile?.companyId,
      admission: data.admission || {},
      assessment: data.assessment || {},
      treatmentOrder: data.treatmentOrder || {},
      physician: data.physician || {},
      idgNotes: data.idgNotes || {},
      skilledNursingNotes: data.skilledNursingNotes || {},
      haNotes: data.haNotes || {},
      volunteerNotes: data.volunteerNotes || {},
      miscellaneous: data.miscellaneous || {},
      discharge: data.discharge || {},
      compliance: data.compliance || {},
      poc: data.poc || [],
      remarks: data.remarks || [],

      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };

    if (mode === "edit" && selectedItem?.id) {
      // Update existing
      payload.id = selectedItem.id;
      props.updateChecklist(payload);
      setIsUpdateChecklistCollection(false);
    } else {
      // Create new
      payload.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };
      props.createChecklist(payload);
      setIsCreateChecklistCollection(false);
    }

    // Close modal
    closeFormModalHandler();
  };

  return (
    <>
      <Snackbar
        place="tc"
        color={color}
        icon={AddAlert}
        message={message}
        open={tc}
        closeNotification={() => setTC(false)}
        close
      />
      <ChecklistModal
        open={isFormModal}
        onClose={closeFormModalHandler}
        onSubmit={handleChecklistSubmit}
        item={selectedItem}
        mode={mode}
        patientList={patientList}
      />
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={closePrintModal}
        patientData={selectedPrintData}
      />
      <PrintAllModal
        isOpen={isPrintAllModalOpen}
        onClose={closePrintAllModal}
        patientsData={dataSource}
      />
      <div style={{ marginTop: "10px" }}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <Grid container justifyContent="space-between">
                  <div>
                    <h4 className={classes.cardTitleWhite}>
                      Patient Onboarding Checklist
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      Patient onboarding documentation and compliance tracking
                    </p>
                  </div>
                </Grid>
              </CardHeader>
              <CardBody>
                <GridContainer
                  alignItems="center"
                  style={{ paddingLeft: 12, marginBottom: 20 }}
                >
                  <Grid item xs={12} md={6}>
                    <div style={{ display: "inline-flex", gap: 10 }}>
                      <Button
                        color="info"
                        onClick={() => createFormHandler({}, "create")}
                      >
                        <AddIcon className={classes.icons} /> Add Checklist
                      </Button>
                      <Button
                        color="success"
                        onClick={printAllChecklistsHandler}
                        disabled={dataSource.length === 0}
                      >
                        <PrintIcon className={classes.icons} /> Print All
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Search by Patient Code"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchKeyword}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: <SearchIcon style={{ marginRight: 8, color: "#999" }} />,
                      }}
                    />
                  </Grid>
                </GridContainer>

                <HospiceTable
                  columns={columns}
                  dataSource={filteredDataSource}
                  loading={false}
                  onCheckboxSelectionHandler={() => {}}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  checklists: patientChecklistListStateSelector(store),
  createChecklistState: patientChecklistCreateStateSelector(store),
  updateChecklistState: patientChecklistUpdateStateSelector(store),
  deleteChecklistState: patientChecklistDeleteStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listChecklists: (data) => dispatch(attemptToFetchPatientChecklist(data)),
  resetListChecklists: () => dispatch(resetFetchPatientChecklistState()),
  createChecklist: (data) => dispatch(attemptToCreatePatientChecklist(data)),
  resetCreateChecklist: () => dispatch(resetCreatePatientChecklistState()),
  updateChecklist: (data) => dispatch(attemptToUpdatePatientChecklist(data)),
  resetUpdateChecklist: () => dispatch(resetUpdatePatientChecklistState()),
  deleteChecklist: (data) => dispatch(attemptToDeletePatientChecklist(data)),
  resetDeleteChecklist: () => dispatch(resetDeletePatientChecklistState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientOnboardingChecklistFunction);

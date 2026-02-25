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
import ActionsFunction from "components/Actions/ActionsFunction";
import { connect } from "react-redux";
import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import moment from "moment";

import HROnboardingHandler from "./handler/HROnboardingHandler";
import ChecklistModal from "./components/ChecklistModal";

// Redux imports for Employee
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";

// Redux imports for Employee Checklist
import {
  employeeChecklistListStateSelector,
  employeeChecklistCreateStateSelector,
  employeeChecklistUpdateStateSelector,
  employeeChecklistDeleteStateSelector,
} from "store/selectors/employeeChecklistSelector";
import {
  attemptToFetchEmployeeChecklist,
  resetFetchEmployeeChecklistState,
  attemptToCreateEmployeeChecklist,
  resetCreateEmployeeChecklistState,
  attemptToUpdateEmployeeChecklist,
  resetUpdateEmployeeChecklistState,
  attemptToDeleteEmployeeChecklist,
  resetDeleteEmployeeChecklistState,
} from "store/actions/employeeChecklistAction";

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

// Define checklist structure for calculating section statuses
const CHECKLIST_STRUCTURE = {
  section1: {
    items: [
      { key: "applicationForm", hasExpiration: false, mandatory: true },
      { key: "resume", hasExpiration: false, mandatory: true },
    ],
  },
  section2: {
    items: [
      { key: "licenseVerification", hasExpiration: true, mandatory: true },
      { key: "diploma", hasExpiration: false, mandatory: true },
      { key: "pli", hasExpiration: true, mandatory: false },
      { key: "ssc", hasExpiration: false, mandatory: true },
      { key: "cprCard", hasExpiration: true, mandatory: true },
      { key: "driversLicense", hasExpiration: true, mandatory: true },
      { key: "autoInsurance", hasExpiration: true, mandatory: true },
    ],
  },
  section3: {
    items: [
      { key: "jobDescription", hasExpiration: false, mandatory: true },
      { key: "offerLetter", hasExpiration: false, mandatory: true },
      { key: "orientation", hasExpiration: false, mandatory: true },
      { key: "competency", hasExpiration: false, mandatory: true },
      { key: "performanceEvaluations", hasExpiration: false, mandatory: true },
    ],
  },
  section4: {
    items: [
      { key: "confidentiality", hasExpiration: false, mandatory: true },
      { key: "eSig", hasExpiration: false, mandatory: true },
      { key: "fieldPractices", hasExpiration: false, mandatory: true },
      { key: "handbook", hasExpiration: false, mandatory: true },
      { key: "compliance", hasExpiration: false, mandatory: true },
      { key: "policies", hasExpiration: false, mandatory: true },
      { key: "ppe", hasExpiration: false, mandatory: true },
      { key: "hipaa", hasExpiration: false, mandatory: true },
    ],
  },
  section5: {
    items: [
      { key: "inServicesHire", hasExpiration: false, mandatory: false },
      { key: "inServicesAnnual", hasExpiration: false, mandatory: false },
      { key: "ceus", hasExpiration: false, mandatory: false },
    ],
  },
  section6: {
    items: [
      { key: "physicalExam", hasExpiration: false, mandatory: true },
      { key: "hepatitisB", hasExpiration: false, mandatory: true },
      { key: "tbCxr", hasExpiration: false, mandatory: true },
      { key: "tbQuestionnaire", hasExpiration: false, mandatory: true },
      { key: "criminalHistory", hasExpiration: false, mandatory: true },
    ],
  },
  section7: {
    items: [{ key: "backgroundCheck", hasExpiration: false, mandatory: true }],
  },
  section8: {
    items: [
      { key: "formI9", hasExpiration: false, mandatory: true },
      { key: "w4W9", hasExpiration: false, mandatory: true },
    ],
  },
};

function HROnboardingChecklistFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(HROnboardingHandler.columns(true));
  const [employeeList, setEmployeeList] = useState([]);
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);
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
        `Are you sure you want to delete the checklist for ${data.employeeName}?`
      )
    ) {
      props.deleteChecklist(data.id);
      setIsDeleteChecklistCollection(false);
    }
  };

  // Handle status changes
  useEffect(() => {
    // Fetch employees completed
    if (
      !isEmployeeCollection &&
      props.employees &&
      props.employees.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListEmployees();
      setIsEmployeeCollection(true);
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
    isEmployeeCollection,
    isChecklistCollection,
    isCreateChecklistCollection,
    isUpdateChecklistCollection,
    isDeleteChecklistCollection,
    props.employees,
    props.checklists,
    props.createChecklistState,
    props.updateChecklistState,
    props.deleteChecklistState,
  ]);

  // Initial fetch
  useEffect(() => {
    if (context.userProfile?.companyId) {
      props.listEmployees({ companyId: context.userProfile?.companyId });
      props.listChecklists({ companyId: context.userProfile?.companyId });
    }
  }, []);

  // Process employee data
  if (
    isEmployeeCollection &&
    props.employees &&
    props.employees.status === ACTION_STATUSES.SUCCEED
  ) {
    const fetchedEmployees = props.employees.data || [];
    const employeeOptions = fetchedEmployees.map((emp) => ({
      id: emp.id,
      name: emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim(),
      value: emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim(),
      label: emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim(),
    }));

    setEmployeeList(employeeOptions);
    setIsEmployeeCollection(false);
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
      // Calculate section statuses
      const section1Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section1,
        CHECKLIST_STRUCTURE.section1.items
      );
      const section2Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section2,
        CHECKLIST_STRUCTURE.section2.items
      );
      const section3Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section3,
        CHECKLIST_STRUCTURE.section3.items
      );
      const section4Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section4,
        CHECKLIST_STRUCTURE.section4.items
      );
      const section5Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section5,
        CHECKLIST_STRUCTURE.section5.items
      );
      const section6Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section6,
        CHECKLIST_STRUCTURE.section6.items
      );
      const section7Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section7,
        CHECKLIST_STRUCTURE.section7.items
      );
      const section8Status = HROnboardingHandler.calculateSectionStatus(
        checklist.section8,
        CHECKLIST_STRUCTURE.section8.items
      );

      // Calculate overall progress
      const totalItems = Object.values(CHECKLIST_STRUCTURE).reduce(
        (sum, section) => sum + section.items.length,
        0
      );
      const completedItems =
        section1Status.completed +
        section2Status.completed +
        section3Status.completed +
        section4Status.completed +
        section5Status.completed +
        section6Status.completed +
        section7Status.completed +
        section8Status.completed;
      const overallProgress = `${Math.round(
        (completedItems / totalItems) * 100
      )}%`;

      // Get employee name from checklist or look up from employee list
      const employeeName = checklist.employeeName || "Unknown Employee";

      return {
        ...checklist,
        id: checklist.id,
        employeeId: checklist.employeeId,
        employeeName: employeeName,
        section1Status,
        section2Status,
        section3Status,
        section4Status,
        section5Status,
        section6Status,
        section7Status,
        section8Status,
        overallProgress,
        lastUpdated: checklist.updated_at || checklist.created_at,
        // Store original checklist data for editing
        checklistData: {
          ...checklist.section1,
          ...checklist.section2,
          ...checklist.section3,
          ...checklist.section4,
          ...checklist.section5,
          ...checklist.section6,
          ...checklist.section7,
          ...checklist.section8,
        },
        employee: {
          id: checklist.employeeId,
          name: employeeName,
          value: employeeName,
          label: employeeName,
        },
      };
    });

    const mappedData = HROnboardingHandler.mapData(tableData);

    // Add actions to columns
    const cols = HROnboardingHandler.columns(true).map((col) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
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

    // Transform checklistData back to section format
    const sections = {};
    Object.keys(CHECKLIST_STRUCTURE).forEach((sectionKey) => {
      const sectionData = {};
      CHECKLIST_STRUCTURE[sectionKey].items.forEach((item) => {
        if (data.checklistData[item.key]) {
          sectionData[item.key] = data.checklistData[item.key];
        }
      });
      sections[sectionKey] = sectionData;
    });

    const payload = {
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      companyId: context.userProfile?.companyId,
      section1: sections.section1,
      section2: sections.section2,
      section3: sections.section3,
      section4: sections.section4,
      section5: sections.section5,
      section6: sections.section6,
      section7: sections.section7,
      section8: sections.section8,

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
        employeeList={employeeList}
      />
      <div style={{ marginTop: "10px" }}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <Grid container justifyContent="space-between">
                  <div>
                    <h4 className={classes.cardTitleWhite}>
                      HR Onboarding Checklist
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      Employee onboarding documentation and compliance tracking
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
                    </div>
                  </Grid>
                </GridContainer>

                <HospiceTable
                  columns={columns}
                  dataSource={dataSource}
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
  employees: employeeListStateSelector(store),
  checklists: employeeChecklistListStateSelector(store),
  createChecklistState: employeeChecklistCreateStateSelector(store),
  updateChecklistState: employeeChecklistUpdateStateSelector(store),
  deleteChecklistState: employeeChecklistDeleteStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listChecklists: (data) => dispatch(attemptToFetchEmployeeChecklist(data)),
  resetListChecklists: () => dispatch(resetFetchEmployeeChecklistState()),
  createChecklist: (data) => dispatch(attemptToCreateEmployeeChecklist(data)),
  resetCreateChecklist: () => dispatch(resetCreateEmployeeChecklistState()),
  updateChecklist: (data) => dispatch(attemptToUpdateEmployeeChecklist(data)),
  resetUpdateChecklist: () => dispatch(resetUpdateEmployeeChecklistState()),
  deleteChecklist: (data) => dispatch(attemptToDeleteEmployeeChecklist(data)),
  resetDeleteChecklist: () => dispatch(resetDeleteEmployeeChecklistState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HROnboardingChecklistFunction);

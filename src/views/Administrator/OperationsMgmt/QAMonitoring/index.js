import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HospiceTable from "components/Table/HospiceTable";
import moment from "moment";
import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import TOAST from "modules/toastManager";

import { attemptToFetchQA, resetFetchQAState } from "store/actions/qaAction";
import { attemptToCreateQA, resetCreateQAState } from "store/actions/qaAction";
import { attemptToUpdateQA, resetUpdateQAState } from "store/actions/qaAction";
import { attemptToDeleteQA, resetDeleteQAState } from "store/actions/qaAction";
import { qaListStateSelector, qaCreateStateSelector, qaUpdateStateSelector, qaDeleteStateSelector } from "store/selectors/qaSelector";

import { attemptToFetchPatient, resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

import { attemptToFetchEmployee, resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";

import QAForm from "./components/QAForm";

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

function QAMonitoring(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      name: "qa_type",
      header: "QA Type",
      defaultFlex: 1,
      minWidth: 120,
    },
    {
      name: "patient_name",
      header: "Patient",
      defaultFlex: 1,
      minWidth: 120,
    },
    {
      name: "discipline_name",
      header: "Discipline",
      defaultFlex: 1,
      minWidth: 150,
    },
    {
      name: "qa_date",
      header: "QA Date",
      defaultFlex: 1,
      minWidth: 120,
      render: ({ value }) => value ? moment(value).format("MM/DD/YYYY") : "",
    },
    {
      name: "qa_status",
      header: "Status",
      defaultFlex: 1,
      minWidth: 100,
    },
    {
      name: "qa_source_dt",
      header: "Source Date",
      defaultFlex: 1,
      minWidth: 120,
      render: ({ value }) => value ? moment(value).format("MM/DD/YYYY") : "",
    },
    {
      name: "reviewer_name",
      header: "Reviewer",
      defaultFlex: 1,
      minWidth: 150,
    },
  ];

  // Fetch QA records
  useEffect(() => {
    if (context.userProfile && context.userProfile.companyId) {
      props.fetchQA({ companyId: context.userProfile.companyId });
      props.fetchPatient({ companyId: context.userProfile.companyId });
      props.fetchEmployee({ companyId: context.userProfile.companyId });
    }
  }, [context.userProfile]);

  // Handle QA list response
  useEffect(() => {
    if (props.qaList.status === ACTION_STATUSES.SUCCEED) {
      const qaData = Array.isArray(props.qaList.data) ? props.qaList.data : [];
      setDataSource(qaData);
      setIsLoading(false);
      props.resetFetchQA();
    } else if (props.qaList.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to fetch QA records");
      setDataSource([]);
      setIsLoading(false);
      props.resetFetchQA();
    } else if (props.qaList.status === ACTION_STATUSES.PENDING) {
      setIsLoading(true);
    }
  }, [props.qaList]);

  // Handle patient list response
  useEffect(() => {
    if (props.patientList.status === ACTION_STATUSES.SUCCEED) {
      const patientData = Array.isArray(props.patientList.data) ? props.patientList.data : [];
      const patients = patientData.map((p) => ({
        ...p,
        name: p.name || `${p.fn || ""} ${p.ln || ""}`.trim(),
        label: p.name || `${p.fn || ""} ${p.ln || ""}`.trim(),
        value: p.patientCd || p.id,
      }));
      setPatientList(patients);
      props.resetFetchPatient();
    } else if (props.patientList.status === ACTION_STATUSES.FAILED) {
      setPatientList([]);
      props.resetFetchPatient();
    }
  }, [props.patientList]);

  // Handle employee list response
  useEffect(() => {
    if (props.employeeList.status === ACTION_STATUSES.SUCCEED) {
      const employeeData = Array.isArray(props.employeeList.data) ? props.employeeList.data : [];
      const employees = employeeData.map((e) => ({
        ...e,
        name: e.name || `${e.fn || ""} ${e.ln || ""}`.trim(),
        label: e.name || `${e.fn || ""} ${e.ln || ""}`.trim(),
        value: e.id,
      }));
      setEmployeeList(employees);
      props.resetFetchEmployee();
    } else if (props.employeeList.status === ACTION_STATUSES.FAILED) {
      setEmployeeList([]);
      props.resetFetchEmployee();
    }
  }, [props.employeeList]);

  // Handle create response
  useEffect(() => {
    if (props.qaCreate.status === ACTION_STATUSES.SUCCEED) {
      TOAST.success("QA record created successfully");
      setIsFormOpen(false);
      props.resetCreateQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaCreate.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to create QA record");
      props.resetCreateQA();
    }
  }, [props.qaCreate]);

  // Handle update response
  useEffect(() => {
    if (props.qaUpdate.status === ACTION_STATUSES.SUCCEED) {
      TOAST.success("QA record updated successfully");
      setIsFormOpen(false);
      props.resetUpdateQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaUpdate.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to update QA record");
      props.resetUpdateQA();
    }
  }, [props.qaUpdate]);

  // Handle delete response
  useEffect(() => {
    if (props.qaDelete.status === ACTION_STATUSES.SUCCEED) {
      TOAST.success("QA record deleted successfully");
      props.resetDeleteQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaDelete.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to delete QA record");
      props.resetDeleteQA();
    }
  }, [props.qaDelete]);

  const handleAddNew = () => {
    setFormMode("create");
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleRowDoubleClick = (rowProps) => {
    setFormMode("edit");
    setSelectedItem(rowProps.data);
    setIsFormOpen(true);
  };

  const handleDelete = (rowData) => {
    if (window.confirm("Are you sure you want to delete this QA record?")) {
      props.deleteQA({ id: rowData.id });
    }
  };

  const handleFormSubmit = (payload, mode) => {
    payload.companyId = context.userProfile.companyId;
    payload.created_at = new Date();
    payload.createdUser = {
      name: context.userProfile.name,
      userId: context.userProfile.id,
      date: new Date(),
    };
    payload.updatedUser = {
      name: context.userProfile.name,
      userId: context.userProfile.id,
      date: new Date(),
    };

    if (mode === "create") {
      props.createQA(payload);
    } else {
      props.updateQA(payload);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  // Safety check: if data is loaded but still showing loading, hide it
  useEffect(() => {
    // Set loading to false after initial data fetch attempts complete
    const hasQAResponse = props.qaList && props.qaList.status !== null && props.qaList.status !== ACTION_STATUSES.PENDING;
    const hasPatientResponse = props.patientList && props.patientList.status !== null && props.patientList.status !== ACTION_STATUSES.PENDING;
    const hasEmployeeResponse = props.employeeList && props.employeeList.status !== null && props.employeeList.status !== ACTION_STATUSES.PENDING;

    if (hasQAResponse || hasPatientResponse || hasEmployeeResponse) {
      setIsLoading(false);
    }
  }, [props.qaList, props.patientList, props.employeeList]);

  if (isLoading && (!context.userProfile || !context.userProfile.companyId)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 className={classes.cardTitleWhite}>QA Monitoring</h4>
                <Button color="white" onClick={handleAddNew}>
                  <AddIcon /> Add QA Record
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <HospiceTable
                columns={columns}
                dataSource={Array.isArray(dataSource) ? dataSource : []}
                loading={isLoading}
                onRowDoubleClick={handleRowDoubleClick}
                style={{ minHeight: 550 }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <QAForm
        isOpen={isFormOpen}
        mode={formMode}
        item={selectedItem}
        patientList={Array.isArray(patientList) ? patientList : []}
        employeeList={Array.isArray(employeeList) ? employeeList : []}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  qaList: qaListStateSelector(state) || { data: [], status: null, error: null },
  qaCreate: qaCreateStateSelector(state) || { data: {}, status: null, error: null },
  qaUpdate: qaUpdateStateSelector(state) || { data: {}, status: null, error: null },
  qaDelete: qaDeleteStateSelector(state) || { data: {}, status: null, error: null },
  patientList: patientListStateSelector(state) || { data: [], status: null, error: null },
  employeeList: employeeListStateSelector(state) || { data: [], status: null, error: null },
});

const mapDispatchToProps = {
  fetchQA: attemptToFetchQA,
  resetFetchQA: resetFetchQAState,
  createQA: attemptToCreateQA,
  resetCreateQA: resetCreateQAState,
  updateQA: attemptToUpdateQA,
  resetUpdateQA: resetUpdateQAState,
  deleteQA: attemptToDeleteQA,
  resetDeleteQA: resetDeleteQAState,
  fetchPatient: attemptToFetchPatient,
  resetFetchPatient: resetFetchPatientState,
  fetchEmployee: attemptToFetchEmployee,
  resetFetchEmployee: resetFetchEmployeeState,
};

export default connect(mapStateToProps, mapDispatchToProps)(QAMonitoring);

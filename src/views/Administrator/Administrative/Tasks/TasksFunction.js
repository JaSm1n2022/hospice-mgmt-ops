import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import TasksHandler from "./components/TasksHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { tasksListStateSelector } from "store/selectors/tasksSelector";
import { tasksCreateStateSelector } from "store/selectors/tasksSelector";
import { tasksDeleteStateSelector } from "store/selectors/tasksSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchTasks } from "store/actions/tasksAction";
import { resetFetchTasksState } from "store/actions/tasksAction";
import { attemptToCreateTasks } from "store/actions/tasksAction";
import { resetCreateTasksState } from "store/actions/tasksAction";
import { resetUpdateTasksState } from "store/actions/tasksAction";
import { attemptToDeleteTasks } from "store/actions/tasksAction";
import { resetDeleteTasksState } from "store/actions/tasksAction";
import { tasksUpdateStateSelector } from "store/selectors/tasksSelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, CircularProgress, Grid, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { CheckCircle, HelpOutline, ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import TasksForm from "./components/TasksFormV2";
import { attemptToUpdateTasks } from "store/actions/tasksAction";
import TOAST from "modules/toastManager";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

import { vendorListStateSelector } from "store/selectors/vendorSelector";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { resetFetchVendorState } from "store/actions/vendorAction";
import { attemptToFetchLocation } from "store/actions/locationAction";
import { resetFetchLocationState } from "store/actions/locationAction";
import { locationListStateSelector } from "store/selectors/locationSelector";
import moment from "moment";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";

import { profileListStateSelector } from "store/selectors/profileSelector";
import FilterTable from "components/Table/FilterTable";
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
let patientList = [];
let vendorList = [];
let locationList = [];
let isProcessDone = true;
let isPatientListDone = true;
let isTasksListDone = true;
let isVendorDone = true;
let isLocationDone = true;
let isEmployeeDone = true;
let employeeList = [];
let itemForCreates = [];
let itemCnt = 1;
let userProfile = {};
function TasksFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(TasksHandler.columns(main));
  const [isTasksCollection, setIsTasksCollection] = useState(true);
  const [isLocationCollection, setIsLocationCollection] = useState(true);
  const [isCreateTasksCollection, setIsCreateTasksCollection] = useState(true);
  const [isUpdateTasksCollection, setIsUpdateTasksCollection] = useState(true);
  const [isDeleteTasksCollection, setIsDeleteTasksCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");

  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    console.log(
      "[useEffect]",
      isDeleteTasksCollection,
      props.deleteTasksState.status
    );

    if (
      !isTasksCollection &&
      props.tasks &&
      props.tasks.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListTasks();

      setIsTasksCollection(true);
    }

    if (
      !isCreateTasksCollection &&
      props.createTasksState &&
      props.createTasksState.status === ACTION_STATUSES.SUCCEED
    ) {
      isTasksListDone = true;
      itemCnt += 1;
      setIsCreateTasksCollection(true);
    }
    if (
      !isUpdateTasksCollection &&
      props.updateTasksState &&
      props.updateTasksState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateTasks();

      setIsUpdateTasksCollection(true);
    }
    if (
      !isDeleteTasksCollection &&
      props.deleteTasksState &&
      props.deleteTasksState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteTasks();
      setIsDeleteTasksCollection(true);
    }
    if (
      !isLocationCollection &&
      props.locations &&
      props.locations.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetListLocations();
      setIsLocationCollection(true);
    }
  }, [
    isTasksCollection,
    isLocationCollection,
    isCreateTasksCollection,
    isUpdateTasksCollection,
    isDeleteTasksCollection,
  ]);
  useEffect(() => {
    console.log("list tasks", props.main);
    isTasksListDone = false;
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      const dates = Helper.formatDateRangeByCriteriaV2("thisWeek");
      setDateFrom(dates.from);
      setDateTo(dates.to);

      props.listTasks({
        companyId: userProfile.companyId,
        from: dates.from,
        to: dates.to,
      });
    }
  }, []);
  useEffect(() => {
    console.log("[Props.main]", props.main);
    if (props.main) {
      isPatientListDone = true;
      isVendorDone = true;
      isLocationDone = true;
      isEmployeeDone = false;
      console.log("[List Patients]");
      if (
        !userProfile.name &&
        props.profileState &&
        props.profileState.data &&
        props.profileState.data.length
      ) {
        userProfile = props.profileState.data[0];
      }
      props.listPatients({ companyId: userProfile.companyId });
      props.listEmployees({ companyId: userProfile.companyId });
    } else {
      isPatientListDone = true;
    }
  }, [props.main]);
  console.log("[props.Tasks]", props.tasks, props.patients);

  if (
    isTasksCollection &&
    props.tasks &&
    props.tasks.status === ACTION_STATUSES.SUCCEED
  ) {
    isTasksListDone = true;
    grandTotal = 0.0;
    let source = props.tasks.data;
    if (source && source.length) {
      source = TasksHandler.mapData(source, productList);
    }

    const cols = TasksHandler.columns(main).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              data={{ ...cellProps.data }}
            />
          ),
        };
      }
      if (["patientCd"].includes(col.name)) {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <div style={{ display: "inline-flex", gap: 2 }}>
              {cellProps.data[col.name]}
            </div>
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
    // source = sortByWorth(source);
    setDataSource(source);
    setIsTasksCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Tasks id]", id);
    props.deleteTasks(id);
  };
  const createTasksHandler = (payload, mode) => {
    console.log("[Create Tasks Handler]", payload, mode);

    const params = {
      notes: payload.notes,
      description: payload.description,
      assignee: {
        name: payload.assignee.name,
        id: payload.assignee.id,
      },
      assignedDt: payload.assignedDt,
      status: payload.status.value,
    };
    if (payload.status.value === "Done" && payload.completedDt) {
      params.completedDt = payload.completedDt;
    }
    if (
      payload.status?.value?.toLowerCase() === "in process" &&
      payload.inProcessDt
    ) {
      params.inProcessDt = payload.inprocessDt;
    }
    if (payload.status?.value?.toLowerCase() === "todo" && payload.todoDt) {
      params.todoDt = payload.todoDt;
    }
    params.companyId = userProfile.companyId;
    params.updatedUser = {
      name: userProfile.name,
      userId: userProfile.id,
      date: new Date(),
    };

    if (mode === "create") {
      params.created_at = new Date();
      params.createdUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
    }

    if (payload.id) {
      params.id = payload.id;
    }
    console.log("[Params]", params);
    if (mode === "create") {
      props.createTasks(params);
    } else if (mode === "edit") {
      props.updateTasks(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Tasks Collection]", props.createTasksState);
  if (
    isCreateTasksCollection &&
    props.createTasksState &&
    props.createTasksState.status === ACTION_STATUSES.SUCCEED
  ) {
    props.resetCreateTasks();
    setIsCreateTasksCollection(false);

    if (itemForCreates.length === itemCnt) {
      isTasksListDone = true;
      props.listTasks({
        companyId: userProfile.companyId,
        from: dateFrom,
        to: dateTo,
      });
      closeFormModalHandler();
      TOAST.ok("Tasks successfully created.");
    } else {
      props.createTasks(itemForCreates[itemCnt - 1]);
    }
  }
  if (
    isUpdateTasksCollection &&
    props.updateTasksState &&
    props.updateTasksState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Tasks successfully updated.");
    setIsUpdateTasksCollection(false);
    props.listTasks({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  console.log(
    "[isDeleteTasks]",
    isDeleteTasksCollection,
    props.deleteTasksState
  );
  if (
    isDeleteTasksCollection &&
    props.deleteTasksState &&
    props.deleteTasksState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Tasks successfully deleted.");
    setIsDeleteTasksCollection(false);

    props.listTasks({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }

  if (
    props.main &&
    props.patients &&
    props.patients.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    patientList = props.patients.data;
    console.log("[props.patients.data]", props.patients.data);
    props.resetListPatients();
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword, originalSource);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];

      let found = temp.filter(
        (data) =>
          (data.description &&
            data.description.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.assignee &&
            data.assignee.name &&
            data.assignee.name.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.notes &&
            data.notes.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
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
    //  dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `tasks_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
      import(/* webpackChunkName: 'json2xls' */ "json2xls")
        .then((json2xls) => {
          // let fileName = fname + '_' + new Date().getTime();
          const xls =
            typeof json2xls === "function"
              ? json2xls(excel)
              : json2xls.default(excel);
          const buffer = Buffer.from(xls, "binary");
          // let buffer = Buffer.from(excelBuffer);
          const data = new Blob([buffer], { type: fileType });
          FileSaver.saveAs(data, fileName + fileExtension);
        })
        .catch((err) => {
          // Handle failure
          console.log(err);
        });
    }
  };
  const onPressEnterKeyHandler = (value) => {
    filterRecordHandler(value);
    setKeywordValue(value);
  };
  const inputHandler = (e) => {
    if (e.target.name === "keywordValue") {
      setKeywordValue(e.target.value);
      filterRecordHandler(e.target.value);
    }
  };

  console.log("[Props Employee]", props.employees);
  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    isEmployeeDone = true;

    employeeList = props.employees.data;
    props.resetListEmployees();
  }

  console.log("[done tasks]", isTasksListDone, isEmployeeDone, props.tasks);
  isProcessDone = isTasksListDone && isEmployeeDone;
  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);
    props.listTasks({
      companyId: userProfile.companyId,
      from: moment(new Date(dates.from)).utc().format("YYYY-MM-DD"),
      to: moment(new Date(dates.to)).utc().format("YYYY-MM-DD"),
    });
  };
  return (
    <>
      {!isProcessDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <div>
          {main ? (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="success">
                    <Grid container justifyContent="space-between">
                      <h4 className={classes.cardTitleWhite}>
                        Tasks Management
                      </h4>
                    </Grid>
                  </CardHeader>
                  <CardBody>
                    <Grid
                      container
                      justifyContent="space-between"
                      style={{ paddingBottom: 4 }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          gap: 10,
                        }}
                      >
                        <Button
                          onClick={() => createFormHandler()}
                          variant="contained"
                          style={{
                            border: "solid 1px #2196f3",
                            color: "white",
                            background: "#2196f3",
                            fontFamily: "Roboto",
                            fontSize: "12px",
                            fontWeight: 500,
                            fontStretch: "normal",
                            fontStyle: "normal",
                            lineHeight: 1.71,
                            letterSpacing: "0.4px",
                            textAlign: "left",
                            cursor: "pointer",
                            height: "42px",
                          }}
                          component="span"
                          startIcon={<AddIcon />}
                        >
                          ADD Tasks
                        </Button>
                        {isAddGroupButtons && (
                          <Button
                            onClick={() => exportToExcelHandler()}
                            variant="outlined"
                            style={{
                              fontFamily: "Roboto",
                              fontSize: "12px",
                              fontWeight: 500,
                              fontStretch: "normal",
                              fontStyle: "normal",
                              lineHeight: 1.71,
                              letterSpacing: "0.4px",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                            component="span"
                            startIcon={<ImportExport />}
                          >
                            {" "}
                            Export Excel{" "}
                          </Button>
                        )}
                      </div>
                      <div>
                        <FilterTable
                          dateRangeSelection={"thisWeek"}
                          filterRecordHandler={filterRecordHandler}
                          filterByDateHandler={filterByDateHandler}
                        />
                      </div>
                      {/*
                      <SearchCustomTextField
                        background={"white"}
                        onChange={inputHandler}
                        placeholder={"Search Item"}
                        label={"Search Item"}
                        name={"keywordValue"}
                        onPressEnterKeyHandler={onPressEnterKeyHandler}
                        isAllowEnterKey={true}
                        value={keywordValue}
                      />
                    */}
                    </Grid>
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
          ) : (
            <div>
              <Grid style={{ paddingBottom: 2 }} container>
                <Grid md={4} xs={12} sm={6}>
                  <SearchCustomTextField
                    background={"white"}
                    onChange={inputHandler}
                    placeholder={"Search Item"}
                    label={"Search Item"}
                    name={"keywordValue"}
                    onPressEnterKeyHandler={onPressEnterKeyHandler}
                    isAllowEnterKey={true}
                    value={keywordValue}
                  />
                </Grid>
              </Grid>
              <HospiceTable
                main={false}
                columns={columns}
                dataSource={dataSource}
                height={300}
              />
            </div>
          )}
        </div>
      )}
      {isFormModal && (
        <TasksForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createTasksHandler={createTasksHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          employeeList={employeeList}
          vendorList={vendorList}
          locationList={locationList}
          patientList={patientList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  locations: locationListStateSelector(store),
  employees: employeeListStateSelector(store),
  patients: patientListStateSelector(store),
  vendors: vendorListStateSelector(store),
  tasks: tasksListStateSelector(store),
  createTasksState: tasksCreateStateSelector(store),
  updateTasksState: tasksUpdateStateSelector(store),
  deleteTasksState: tasksDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listLocations: (data) => dispatch(attemptToFetchLocation(data)),
  resetListLocations: () => dispatch(resetFetchLocationState()),
  listVendors: (data) => dispatch(attemptToFetchVendor(data)),
  resetListVendors: () => dispatch(resetFetchVendorState()),
  listTasks: (data) => dispatch(attemptToFetchTasks(data)),
  resetListTasks: () => dispatch(resetFetchTasksState()),
  createTasks: (data) => dispatch(attemptToCreateTasks(data)),
  resetCreateTasks: () => dispatch(resetCreateTasksState()),
  updateTasks: (data) => dispatch(attemptToUpdateTasks(data)),
  resetUpdateTasks: () => dispatch(resetUpdateTasksState()),
  deleteTasks: (data) => dispatch(attemptToDeleteTasks(data)),
  resetDeleteTasks: () => dispatch(resetDeleteTasksState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(TasksFunction);

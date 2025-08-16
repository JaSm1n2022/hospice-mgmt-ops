import React, { useContext, useEffect, useState } from "react";
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
import AssignmentHandler from "./components/AssignmentHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
import { assignmentCreateStateSelector } from "store/selectors/assignmentSelector";
import { assignmentDeleteStateSelector } from "store/selectors/assignmentSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchAssignment } from "store/actions/assignmentAction";
import { resetFetchAssignmentState } from "store/actions/assignmentAction";
import { attemptToCreateAssignment } from "store/actions/assignmentAction";
import { resetCreateAssignmentState } from "store/actions/assignmentAction";
import { resetUpdateAssignmentState } from "store/actions/assignmentAction";
import { attemptToDeleteAssignment } from "store/actions/assignmentAction";
import { resetDeleteAssignmentState } from "store/actions/assignmentAction";
import { assignmentUpdateStateSelector } from "store/selectors/assignmentSelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { SupaContext } from "App";
import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import AssignmentForm from "./components/AssignmentForm";
import { attemptToUpdateAssignment } from "store/actions/assignmentAction";
import TOAST from "modules/toastManager";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { v4 as uuidv4 } from "uuid";
import { profileListStateSelector } from "store/selectors/profileSelector";
import IDTForm from "./components/IDTForm";
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
let employeeList = [];
let grandTotal = 0.0;
let originalSource = undefined;
let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;
let isAssignmentListDone = true;
let isEmployeeListDone = true;

function AssignmentFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(AssignmentHandler.columns(main));
  const [isAssignmentsCollection, setIsAssignmentsCollection] = useState(true);
  const [
    isCreateAssignmentCollection,
    setIsCreateAssignmentCollection,
  ] = useState(true);
  const [
    isUpdateAssignmentCollection,
    setIsUpdateAssignmentCollection,
  ] = useState(true);
  const [
    isDeleteAssignmentCollection,
    setIsDeleteAssignmentCollection,
  ] = useState(true);
  const [isProductCollection, setIsProductCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
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
      isDeleteAssignmentCollection,
      props.deleteAssignmentState.status
    );

    if (
      !isAssignmentsCollection &&
      props.assignments &&
      props.assignments.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListAssignments();

      setIsAssignmentsCollection(true);
    }

    if (
      !isCreateAssignmentCollection &&
      props.createAssignmentState &&
      props.createAssignmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateAssignment();

      setIsCreateAssignmentCollection(true);
    }
    if (
      !isUpdateAssignmentCollection &&
      props.updateAssignmentState &&
      props.updateAssignmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateAssignment();

      setIsUpdateAssignmentCollection(true);
    }
    if (
      !isDeleteAssignmentCollection &&
      props.deleteAssignmentState &&
      props.deleteAssignmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteAssignment();
      setIsDeleteAssignmentCollection(true);
    }
    if (
      !isProductCollection &&
      props.products &&
      props.products.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetListProducts();
      setIsProductCollection(true);
    }
  }, [
    isProductCollection,
    isAssignmentsCollection,
    isCreateAssignmentCollection,
    isUpdateAssignmentCollection,
    isDeleteAssignmentCollection,
  ]);
  useEffect(() => {
    console.log("list assignments", props.main);
    if (context.userProfile?.companyId) {
      isAssignmentListDone = false;

      props.listAssignments({ companyId: context.userProfile?.companyId });
    }
  }, []);
  useEffect(() => {
    console.log("[Props.main]", props.main);
    if (props.main) {
      if (context.userProfile?.companyId) {
        isPatientListDone = false;
        isEmployeeListDone = false;

        props.listEmployees({ companyId: context.userProfile?.companyId });
        props.listPatients({ companyId: context.userProfile?.companyId });
      }
    } else {
      isPatientListDone = true;
      isEmployeeListDone = true;
    }
  }, [props.main]);
  console.log("[props.Assignments]", props.assignments, props.patients);
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
    isAssignmentsCollection &&
    props.assignments &&
    props.assignments.status === ACTION_STATUSES.SUCCEED
  ) {
    isAssignmentListDone = true;
    grandTotal = 0.0;
    let source = props.assignments.data;
    if (source && source.length) {
      source = AssignmentHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = AssignmentHandler.columns(main).map((col, index) => {
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
    setIsAssignmentsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Assignment id]", id);
    props.deleteAssignment(id);
  };
  const createAssignmentHandler = (payload, mode) => {
    console.log("[Create Assignment Handler]", payload, mode);
    const params = {
      created_at: new Date(),
      patientId: payload.patient.id,
      patientCd: payload.patient.patientCd,
      patientLocation: `${payload.patient.careType} - ${payload.patient.locationCd}`,
      cnaId: payload.cna?.id,
      cnaName: payload.cna?.name,
      cnaWeek: payload.cnaWeek?.length
        ? payload.cnaWeek?.map((map) => map.name)
        : undefined,
      cnaFreqVisitType: payload?.cnaVisitType?.name,
      cnaFreqVisit: parseInt(payload.cnaFreqVisit || 0),
      cnaTime: payload?.cnaTime,

      lpnId: payload.lpn?.id || undefined,
      lpnName: payload?.lpn?.name,
      lpnTime: payload?.lpnTime,
      lpnFreqVisit: parseInt(payload.lpnFreqVisit || 0),
      lpnWeek: payload.lpnWeek?.length
        ? payload.lpnWeek?.map((map) => map.name)
        : undefined,
      lpnFreqVisitType: payload?.lpnVisitType?.name,

      rnId: payload.rn?.id,
      rnName: payload.rn?.name,
      rnTime: payload.rnTime,
      rnFreqVisit: parseInt(payload.rnFreqVisit || 0),
      rnWeek: payload.rnWeek?.length
        ? payload.rnWeek?.map((map) => map.name)
        : undefined,
      rnFreqVisitType: payload?.rnVisitType?.name,

      mswId: payload.msw?.id,
      mswName: payload.msw?.name,
      mswTime: payload?.mswTime,
      mswFreqVisit: parseInt(payload.mswFreqVisit || 0),
      mswWeek: payload.mswWeek?.length
        ? payload.mswWeek?.map((map) => map.name)
        : undefined,
      mswFreqVisitType: payload?.mswVisitType?.name,

      chaplainId: payload.chaplain?.id,
      chaplainName: payload.chaplain?.name,
      chaplainTime: payload?.chaplainTime,
      chaplainFreqVisit: parseInt(payload.chaplainFreqVisit || 0),
      chaplainWeek: payload.chaplainWeek
        ? payload.chaplainWeek?.map((map) => map.name)
        : undefined,
      chaplainFreqVisitType: payload?.chaplainVisitType?.name,

      createdUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
      },
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    params.disciplines = [];
    if (payload.lpn?.id) {
      params.disciplines.push(payload.lpn?.id);
    }
    if (payload.rn?.id) {
      params.disciplines.push(payload.rn?.id);
    }
    if (payload.cna?.id) {
      params.disciplines.push(payload.cna?.id);
    }
    if (payload.msw?.id) {
      params.disciplines.push(payload.msw?.id);
    }
    if (payload.chaplain?.id) {
      params.disciplines.push(payload.chaplain?.id);
    }

    if (mode === "create") {
      console.log("[Mode]", params);
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };
      props.createAssignment(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateAssignment(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Assignment Collection]", props.createAssignmentState);
  if (
    isCreateAssignmentCollection &&
    props.createAssignmentState &&
    props.createAssignmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    isAssignmentListDone = true;
    setIsCreateAssignmentCollection(false);
    TOAST.ok("Assignment successfully created.");
    props.listAssignments({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateAssignmentCollection &&
    props.updateAssignmentState &&
    props.updateAssignmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Assignment successfully updated.");
    setIsUpdateAssignmentCollection(false);
    props.listAssignments({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeleteAssignment]",
    isDeleteAssignmentCollection,
    props.deleteAssignmentState
  );
  if (
    isDeleteAssignmentCollection &&
    props.deleteAssignmentState &&
    props.deleteAssignmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Assignment successfully deleted.");
    setIsDeleteAssignmentCollection(false);

    props.listAssignments({ companyId: context.userProfile?.companyId });
  }

  if (
    props.main &&
    props.patients &&
    props.patients.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    patientList = [];
    if (props.patients.data?.length) {
      props.patients.data.forEach((f) => {
        if (f.status?.toLowerCase() === "active") {
          patientList.push(f);
        }
      });
    }

    props.resetListPatients();
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Tempt]", temp);
      let found = temp.filter(
        (data) =>
          (data.patientCd &&
            data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.cnaName &&
            data.cnaName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.rnName &&
            data.rnName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
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
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `assignment_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
      handleExport(excelData, fileName);
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

  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    isEmployeeListDone = true;

    employeeList = props.employees.data;
    props.resetListEmployees();
  }
  console.log(
    "[done]",
    isPatientListDone,
    isAssignmentListDone,
    isEmployeeListDone
  );
  isProcessDone =
    isPatientListDone && isAssignmentListDone && isEmployeeListDone;
  console.log("[Employee List]", employeeList, patientList);
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
                  <CardHeader color="rose">
                    <Grid container justifyContent="space-between">
                      <h4 className={classes.cardTitleWhite}>IDT Assignment</h4>
                    </Grid>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} md={12}>
                        <div
                          style={{
                            display: "inline-flex",
                            gap: 10,
                          }}
                        >
                          <Button
                            color="info"
                            className={classes.marginRight}
                            onClick={() => createFormHandler()}
                          >
                            <AddIcon className={classes.icons} /> Add Assignment
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
                      </GridItem>
                      <GridItem xs={12}>
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
                      </GridItem>
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
        <IDTForm
          filterRecordHandler={filterRecordHandler}
          employeeList={employeeList}
          dataSource={dataSource}
          createAssignmentHandler={createAssignmentHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          patientList={patientList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  assignments: assignmentListStateSelector(store),
  createAssignmentState: assignmentCreateStateSelector(store),
  updateAssignmentState: assignmentUpdateStateSelector(store),
  deleteAssignmentState: assignmentDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),

  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignments: () => dispatch(resetFetchAssignmentState()),
  createAssignment: (data) => dispatch(attemptToCreateAssignment(data)),
  resetCreateAssignment: () => dispatch(resetCreateAssignmentState()),
  updateAssignment: (data) => dispatch(attemptToUpdateAssignment(data)),
  resetUpdateAssignment: () => dispatch(resetUpdateAssignmentState()),
  deleteAssignment: (data) => dispatch(attemptToDeleteAssignment(data)),
  resetDeleteAssignment: () => dispatch(resetDeleteAssignmentState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentFunction);

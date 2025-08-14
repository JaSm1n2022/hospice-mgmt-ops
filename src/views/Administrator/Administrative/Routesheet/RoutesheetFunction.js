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

import RoutesheetHandler from "./components/RoutesheetHandler";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import RoutesheetForm from "./components/RoutesheetForm";

import TOAST from "modules/toastManager";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import FilterTable from "components/Table/FilterTable";
import { routesheetListStateSelector } from "store/selectors/routesheetSelector";
import { routesheetCreateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetUpdateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetDeleteStateSelector } from "store/selectors/routesheetSelector";
import { attemptToFetchRoutesheet } from "store/actions/routesheetAction";
import { resetFetchRoutesheetState } from "store/actions/routesheetAction";
import { attemptToCreateRoutesheet } from "store/actions/routesheetAction";
import { resetCreateRoutesheetState } from "store/actions/routesheetAction";
import { attemptToUpdateRoutesheet } from "store/actions/routesheetAction";
import { attemptToDeleteRoutesheet } from "store/actions/routesheetAction";
import { resetDeleteRoutesheetState } from "store/actions/routesheetAction";
import SignatureBased from "./components/SignatureBased";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchContract } from "store/actions/contractAction";
import { resetFetchContractState } from "store/actions/contractAction";
import { contractListStateSelector } from "store/selectors/contractSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
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
let contractList = [];
let isRoutesheetListDone = true;
let isEmployeeDone = true;
let isPatientDone = true;
let isContractDone = true;
let employeeList = [];
let userProfile = {};
function RoutesheetFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(RoutesheetHandler.columns(main));
  const [isRoutesheetCollection, setIsRoutesheetCollection] = useState(true);
  const [
    isCreateRoutesheetCollection,
    setIsCreateRoutesheetCollection,
  ] = useState(true);
  const [
    isUpdateRoutesheetCollection,
    setIsUpdateRoutesheetCollection,
  ] = useState(true);
  const [
    isDeleteRoutesheetCollection,
    setIsDeleteRoutesheetCollection,
  ] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
      !isRoutesheetCollection &&
      props.routesheet &&
      props.routesheet.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListRoutesheets();

      setIsRoutesheetCollection(true);
    }

    if (
      !isCreateRoutesheetCollection &&
      props.createRouteSheetState &&
      props.createRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateRoutesheet();

      setIsCreateRoutesheetCollection(true);
    }
    if (
      !isUpdateRoutesheetCollection &&
      props.updateRouteSheetState &&
      props.updateRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateRoutesheet();

      setIsUpdateRoutesheetCollection(true);
    }
    if (
      !isDeleteRoutesheetCollection &&
      props.deleteRouteSheetState &&
      props.deleteRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteRoutesheet();
      setIsDeleteRoutesheetCollection(true);
    }
  }, [
    isRoutesheetCollection,

    isCreateRoutesheetCollection,
    isUpdateRoutesheetCollection,
    isDeleteRoutesheetCollection,
  ]);
  useEffect(() => {
    console.log("list routesheet", props.main);
    isRoutesheetListDone = false;
    isContractDone = false;
    isPatientDone = false;
    isEmployeeDone = false;
    setIsRoutesheetCollection(true);
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      const dates = Helper.formatDateRangeByCriteriaV2("thisWeek");
      setDateFrom(dates.from);
      setDateTo(dates.to);
      props.listEmployees({ companyId: userProfile.companyId });
      props.listRoutesheet({
        companyId: userProfile.companyId,
        from: dates.from,
        to: dates.to,
      });
      props.listContracts({ companyId: userProfile.companyId });
      props.listPatients({ companyId: userProfile.companyId });
    }
  }, []);

  if (
    isRoutesheetCollection &&
    props.routesheet &&
    props.routesheet.status === ACTION_STATUSES.SUCCEED
  ) {
    isRoutesheetListDone = true;
    grandTotal = 0.0;
    let source = props.routesheet.data;
    if (source && source.length) {
      source = RoutesheetHandler.mapData(source, productList);
    }

    const cols = RoutesheetHandler.columns(main).map((col, index) => {
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
      if (col.name === "signature") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <SignatureBased data={{ ...cellProps.data }} />
          ),
        };
      }
      return {
        ...col,
        editable: () => false,
      };
    });
    originalSource = [...source];
    // source = sortByWorth(source);
    setDataSource(source);
    setColumns(cols);
    setIsRoutesheetCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Routesheet id]", id);
    props.deleteRoutesheet(id);
  };
  const createRoutesheetHandler = (payload, mode) => {
    if (mode === "create") {
      props.createRoutesheet(payload);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateRoutesheet(params);
    }
    closeFormModalHandler();
  };

  if (
    isCreateRoutesheetCollection &&
    props.createRouteSheetState &&
    props.createRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    isRoutesheetListDone = true;
    setIsCreateRoutesheetCollection(false);
    closeFormModalHandler();
    TOAST.ok("Routesheet successfully created.");
    props.listRoutesheet({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  if (
    isUpdateRoutesheetCollection &&
    props.updateRouteSheetState &&
    props.updateRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Routesheet successfully updated.");
    setIsUpdateRoutesheetCollection(false);
    props.listRoutesheet({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  console.log(
    "[isDeleteRoutesheet]",
    isDeleteRoutesheetCollection,
    props.deleteRouteSheetState
  );
  if (
    isDeleteRoutesheetCollection &&
    props.deleteRouteSheetState &&
    props.deleteRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Routesheet successfully deleted.");
    setIsDeleteRoutesheetCollection(false);

    props.listRoutesheet({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];

      let found = temp.filter(
        (data) =>
          data.requestor &&
          data.requestor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
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
    let fileName = `routesheet_list_batch_${new Date().getTime()}`;

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

  console.log(
    "[Propsi States]",
    props.contracts,
    props.patients,
    props.employees
  );
  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    isEmployeeDone = true;

    employeeList = props.employees.data;
    props.resetListEmployees();
  }
  if (props.contracts && props.contracts.status === ACTION_STATUSES.SUCCEED) {
    isContractDone = true;
    console.log("[Propsi Contract]", props.contracts);
    contractList = props.contracts.data;
    props.resetListContracts();
  }
  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    isPatientDone = true;
    console.log("[Propsi Patients]", props.patients);
    const ps = props.patients.data;
    ps.forEach((p) => {
      p.name = p.patientCd;
      p.value = p.name;
      p.label = p.name;
      p.description = p.name;
      p.category = "patient";
    });
    patientList = ps;
    props.resetListPatients();
  }

  console.log("[done routesheet]", isRoutesheetListDone, isEmployeeDone);
  isProcessDone =
    isRoutesheetListDone && isEmployeeDone && isContractDone && isPatientDone;
  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);
    props.listRoutesheet({
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
                        Routesheet Management
                      </h4>
                      <h4 className={classes.cardTitleWhite}>{`$${parseFloat(
                        grandTotal || 0
                      ).toFixed(2)}`}</h4>
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
                            height: "40px",
                            fontStretch: "normal",
                            fontStyle: "normal",
                            lineHeight: 1.71,
                            letterSpacing: "0.4px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                          component="span"
                          startIcon={<AddIcon />}
                        >
                          ADD Routesheet
                        </Button>
                      </div>
                      <div>
                        <FilterTable
                          dateRangeSelection={"thisWeek"}
                          filterRecordHandler={filterRecordHandler}
                          filterByDateHandler={filterByDateHandler}
                        />
                      </div>
                      <Grid item md={12} xs={12}>
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
                              height: "40px",
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
                      </Grid>
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
        <RoutesheetForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createRoutesheetHandler={createRoutesheetHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          employeeList={employeeList}
          vendorList={vendorList}
          contractList={contractList}
          userProfile={userProfile}
          locationList={locationList}
          patientList={patientList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  routesheet: routesheetListStateSelector(store),
  createRouteSheetState: routesheetCreateStateSelector(store),
  updateRouteSheetState: routesheetUpdateStateSelector(store),
  deleteRouteSheetState: routesheetDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
  employees: employeeListStateSelector(store),
  patients: patientListStateSelector(store),
  contracts: contractListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listRoutesheet: (data) => dispatch(attemptToFetchRoutesheet(data)),
  resetListRoutesheets: () => dispatch(resetFetchRoutesheetState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),

  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  createRoutesheet: (data) => dispatch(attemptToCreateRoutesheet(data)),
  resetCreateRoutesheet: () => dispatch(resetCreateRoutesheetState()),
  updateRoutesheet: (data) => dispatch(attemptToUpdateRoutesheet(data)),
  resetUpdateRoutesheet: () => dispatch(resetUpdateRoutesheetState()),
  deleteRoutesheet: (data) => dispatch(attemptToDeleteRoutesheet(data)),
  resetDeleteRoutesheet: () => dispatch(resetDeleteRoutesheetState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutesheetFunction);

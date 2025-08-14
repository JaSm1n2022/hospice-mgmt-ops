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

import TrainingHandler from "./components/TrainingHandler";
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
import TrainingForm from "./components/TrainingForm";

import TOAST from "modules/toastManager";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import FilterTable from "components/Table/FilterTable";
import { trainingListStateSelector } from "store/selectors/trainingSelector";
import { trainingCreateStateSelector } from "store/selectors/trainingSelector";
import { trainingUpdateStateSelector } from "store/selectors/trainingSelector";
import { trainingDeleteStateSelector } from "store/selectors/trainingSelector";
import { attemptToFetchTraining } from "store/actions/trainingAction";
import { resetFetchTrainingState } from "store/actions/trainingAction";
import { attemptToCreateTraining } from "store/actions/trainingAction";
import { resetCreateTrainingState } from "store/actions/trainingAction";
import { attemptToUpdateTraining } from "store/actions/trainingAction";
import { attemptToDeleteTraining } from "store/actions/trainingAction";
import { resetDeleteTrainingState } from "store/actions/trainingAction";
import SignatureBased from "./components/SignatureBased";
import TrainingAttendance from "views/Document/TrainingAttendance";
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

let isTrainingListDone = true;
let isEmployeeDone = true;
let employeeList = [];
let currentItem;
let userProfile = {};

function TrainingFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(TrainingHandler.columns(main));
  const [isTrainingCollection, setIsTrainingCollection] = useState(true);
  const [isPrint, setIsPrint] = useState(false);
  const [isCreateTrainingCollection, setIsCreateTrainingCollection] = useState(
    true
  );
  const [isUpdateTrainingCollection, setIsUpdateTrainingCollection] = useState(
    true
  );
  const [isDeleteTrainingCollection, setIsDeleteTrainingCollection] = useState(
    true
  );
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
      !isTrainingCollection &&
      props.training &&
      props.training.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListTrainings();

      setIsTrainingCollection(true);
    }

    if (
      !isCreateTrainingCollection &&
      props.createTrainingtate &&
      props.createTrainingtate.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateTraining();

      setIsCreateTrainingCollection(true);
    }
    if (
      !isUpdateTrainingCollection &&
      props.updateTrainingtate &&
      props.updateTrainingtate.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateTraining();

      setIsUpdateTrainingCollection(true);
    }
    if (
      !isDeleteTrainingCollection &&
      props.deleteTrainingtate &&
      props.deleteTrainingtate.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteTraining();
      setIsDeleteTrainingCollection(true);
    }
  }, [
    isTrainingCollection,

    isCreateTrainingCollection,
    isUpdateTrainingCollection,
    isDeleteTrainingCollection,
  ]);
  useEffect(() => {
    console.log("list training", props.main);
    isTrainingListDone = false;
    setIsTrainingCollection(true);
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      const dates = Helper.formatDateRangeByCriteriaV2("thisWeek");
      setDateFrom(dates.from);
      setDateTo(dates.to);

      props.listTraining({
        companyId: userProfile.companyId,
        from: dates.from,
        to: dates.to,
      });
    }
  }, []);

  if (
    isTrainingCollection &&
    props.training &&
    props.training.status === ACTION_STATUSES.SUCCEED
  ) {
    isTrainingListDone = true;
    grandTotal = 0.0;
    let source = props.training.data;
    if (source && source.length) {
      source = TrainingHandler.mapData(source, productList);
    }

    const cols = TrainingHandler.columns(main).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              isPrintFunction={true}
              printHandler={printHandler}
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
    setIsTrainingCollection(false);
  }
  const printHandler = (item) => {
    currentItem = item;
    if (item.signature) {
      setIsPrint(true);
    } else {
      alert("The participant has not completed the course.");
    }
  };
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Training id]", id);
    props.deleteTraining(id);
  };
  const createTrainingHandler = (payload, mode) => {
    console.log("[Create Training Handler]", payload, mode);
    const params = {
      created_at: payload.created_at || new Date(),
      notes: payload.notes,
      reported: {
        name: payload.reported.name,
        id: payload.reported.id,
      },
      response: payload.response,
      reason: payload.reasonCalled,
      caller: {
        name: payload.callerName,
        phone: payload.callerNumber,
      },
      calledDt: new Date(payload.dateCalled),

      companyId: userProfile.companyId,
      updatedUser: {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      },
    };
    if (mode === "create") {
      params.created_at = new Date();
      params.createdUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
      props.createTraining(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateTraining(params);
    }
    closeFormModalHandler();
  };

  if (
    isCreateTrainingCollection &&
    props.createTrainingState &&
    props.createTrainingState.status === ACTION_STATUSES.SUCCEED
  ) {
    isTrainingListDone = true;
    setIsCreateTrainingCollection(false);
    closeFormModalHandler();
    TOAST.ok("Training successfully created.");
    props.listTraining({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  if (
    isUpdateTrainingCollection &&
    props.updateTrainingState &&
    props.updateTrainingState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Training successfully updated.");
    setIsUpdateTrainingCollection(false);
    props.listTraining({
      companyId: userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  console.log(
    "[isDeleteTraining]",
    isDeleteTrainingCollection,
    props.deleteTrainingState
  );
  if (
    isDeleteTrainingCollection &&
    props.deleteTrainingState &&
    props.deleteTrainingState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Training successfully deleted.");
    setIsDeleteTrainingCollection(false);

    props.listTraining({
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
          (data.caller.name &&
            data.caller.name.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.caller.phone &&
            data.caller.phone.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.reported.name &&
            data.reported.name.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1)
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
    let fileName = `training_list_batch_${new Date().getTime()}`;

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

  console.log("[done training]", isTrainingListDone, isEmployeeDone);
  isProcessDone = isTrainingListDone && isEmployeeDone;
  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);
    props.listTraining({
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
                        Training Management
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
                          ADD Training
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
      {isPrint && (
        <TrainingAttendance
          isOpen={isPrint}
          printData={currentItem}
          closePrintModalHandler={() => setIsPrint(false)}
        />
      )}
      {isFormModal && (
        <TrainingForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createTrainingHandler={createTrainingHandler}
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
  training: trainingListStateSelector(store),
  createTrainingState: trainingCreateStateSelector(store),
  updateTrainingState: trainingUpdateStateSelector(store),
  deleteTrainingState: trainingDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listTraining: (data) => dispatch(attemptToFetchTraining(data)),
  resetListTrainings: () => dispatch(resetFetchTrainingState()),

  createTraining: (data) => dispatch(attemptToCreateTraining(data)),
  resetCreateTraining: () => dispatch(resetCreateTrainingState()),
  updateTraining: (data) => dispatch(attemptToUpdateTraining(data)),
  resetUpdateTraining: () => dispatch(resetUpdateTrainingState()),
  deleteTraining: (data) => dispatch(attemptToDeleteTraining(data)),
  resetDeleteTraining: () => dispatch(resetDeleteTrainingState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrainingFunction);

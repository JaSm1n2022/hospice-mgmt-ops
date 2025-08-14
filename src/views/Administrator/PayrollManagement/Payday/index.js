import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import PaydayHandler from "./components/PaydayHandler";
import { connect } from "react-redux";
import { paydayListStateSelector } from "store/selectors/paydaySelector";
import { paydayCreateStateSelector } from "store/selectors/paydaySelector";
import { paydayDeleteStateSelector } from "store/selectors/paydaySelector";

import { attemptToFetchPayday } from "store/actions/paydayAction";
import { resetFetchPaydayState } from "store/actions/paydayAction";
import { attemptToCreatePayday } from "store/actions/paydayAction";
import { resetCreatePaydayState } from "store/actions/paydayAction";
import { resetUpdatePaydayState } from "store/actions/paydayAction";
import { attemptToDeletePayday } from "store/actions/paydayAction";
import { resetDeletePaydayState } from "store/actions/paydayAction";
import { paydayUpdateStateSelector } from "store/selectors/paydaySelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import PaydayForm from "./components/PaydayForm";
import { attemptToUpdatePayday } from "store/actions/paydayAction";
import TOAST from "modules/toastManager";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
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
let employeeList = [];
let patientList = [];

let originalSource = undefined;
let userProfile = {};

let isPaydayListDone = false;

let isLoadingDone = false;
function PaydayFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(PaydayHandler.columns(main));
  const [isPaydaysCollection, setIsPaydaysCollection] = useState(true);
  const [isCreatePaydayCollection, setIsCreatePaydayCollection] = useState(
    true
  );
  const [isUpdatePaydayCollection, setIsUpdatePaydayCollection] = useState(
    true
  );
  const [isDeletePaydayCollection, setIsDeletePaydayCollection] = useState(
    true
  );
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
      isDeletePaydayCollection,
      props.deletePaydayState.status
    );

    if (
      !isPaydaysCollection &&
      props.paydays &&
      props.paydays.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListPaydays();

      setIsPaydaysCollection(true);
    }

    if (
      !isCreatePaydayCollection &&
      props.createPaydayState &&
      props.createPaydayState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreatePayday();

      setIsCreatePaydayCollection(true);
    }
    if (
      !isUpdatePaydayCollection &&
      props.updatePaydayState &&
      props.updatePaydayState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdatePayday();

      setIsUpdatePaydayCollection(true);
    }
    if (
      !isDeletePaydayCollection &&
      props.deletePaydayState &&
      props.deletePaydayState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeletePayday();
      setIsDeletePaydayCollection(true);
    }
  }, [
    isPaydaysCollection,
    isCreatePaydayCollection,
    isUpdatePaydayCollection,
    isDeletePaydayCollection,
  ]);
  useEffect(() => {
    console.log("list paydays");
    isPaydayListDone = false;
    isLoadingDone = false;
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listPaydays({ companyId: userProfile.companyId });
    }
  }, []);

  if (
    isPaydaysCollection &&
    props.paydays &&
    props.paydays.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.paydays.data;
    if (source && source.length) {
      source = PaydayHandler.mapData(source);
    }

    const cols = PaydayHandler.columns(main).map((col, index) => {
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
    setDataSource(source);
    isPaydayListDone = true;
    setIsPaydaysCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete payday id]", id);
    props.deletePayday(id);
  };
  const createPaydayHandler = (payload, mode) => {
    console.log("[Create Payday Handler]", payload, mode);
    const params = {
      companyId: userProfile.companyId,
      payday: payload.payday,
      start_period: payload.startPeriod,
      end_period: payload.endPeriod,
    };

    props.createPayday(params);

    closeFormModalHandler();
  };
  console.log("[Is Create Payday Collection]", props.createPaydayState);
  if (
    isCreatePaydayCollection &&
    props.createPaydayState &&
    props.createPaydayState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreatePaydayCollection(false);
    TOAST.ok("Payday successfully created.");
    props.listPaydays({ companyId: userProfile.companyId });
  }
  if (
    isUpdatePaydayCollection &&
    props.updatePaydayState &&
    props.updatePaydayState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Payday successfully updated.");
    setIsUpdatePaydayCollection(false);
    props.listPaydays({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeletePayday]",
    isDeletePaydayCollection,
    props.deletePaydayState
  );
  if (
    isDeletePaydayCollection &&
    props.deletePaydayState &&
    props.deletePaydayState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Payday successfully deleted.");
    setIsDeletePaydayCollection(false);

    props.listPaydays({ companyId: userProfile.companyId });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword, originalSource);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Tempt]", temp);
      let found = temp.filter(
        (data) =>
          data.payday?.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
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
    let fileName = `payday_list_batch_${new Date().getTime()}`;

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
  isLoadingDone = isPaydayListDone;
  return (
    <>
      {!isLoadingDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <Grid container justifyContent="space-between">
                  <h4 className={classes.cardTitleWhite}>Payday Management</h4>
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
                      ADD PAYDAY
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
                <HospiceTable
                  columns={columns}
                  main={true}
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
      {isFormModal && isLoadingDone && (
        <PaydayForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createPaydayHandler={createPaydayHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          employeeList={employeeList}
          patientList={patientList}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}

PaydayFunction.defaultProps = {
  main: false,
};
PaydayFunction.propTypes = {
  main: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
  paydays: paydayListStateSelector(store),
  createPaydayState: paydayCreateStateSelector(store),
  updatePaydayState: paydayUpdateStateSelector(store),
  deletePaydayState: paydayDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPaydays: (data) => dispatch(attemptToFetchPayday(data)),
  resetListPaydays: () => dispatch(resetFetchPaydayState()),
  createPayday: (data) => dispatch(attemptToCreatePayday(data)),
  resetCreatePayday: () => dispatch(resetCreatePaydayState()),
  updatePayday: (data) => dispatch(attemptToUpdatePayday(data)),
  resetUpdatePayday: () => dispatch(resetUpdatePaydayState()),
  deletePayday: (data) => dispatch(attemptToDeletePayday(data)),
  resetDeletePayday: () => dispatch(resetDeletePaydayState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaydayFunction);

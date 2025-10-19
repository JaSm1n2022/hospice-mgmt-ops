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

import AdmittanceHandler from "./components/AdmittanceHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { admittanceListStateSelector } from "store/selectors/admittanceSelector";
import { admittanceCreateStateSelector } from "store/selectors/admittanceSelector";
import { admittanceDeleteStateSelector } from "store/selectors/admittanceSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchAdmittance } from "store/actions/admittanceAction";
import { resetFetchAdmittanceState } from "store/actions/admittanceAction";
import { attemptToCreateAdmittance } from "store/actions/admittanceAction";
import { resetCreateAdmittanceState } from "store/actions/admittanceAction";
import { resetUpdateAdmittanceState } from "store/actions/admittanceAction";
import { attemptToDeleteAdmittance } from "store/actions/admittanceAction";
import { resetDeleteAdmittanceState } from "store/actions/admittanceAction";
import { admittanceUpdateStateSelector } from "store/selectors/admittanceSelector";
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
import AdmittanceForm from "./components/AdmittanceForm";
import { attemptToUpdateAdmittance } from "store/actions/admittanceAction";
import TOAST from "modules/toastManager";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { v4 as uuidv4 } from "uuid";
import { profileListStateSelector } from "store/selectors/profileSelector";
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
let isAdmittanceListDone = true;
let userProfile = {};
function AdmittanceFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(AdmittanceHandler.columns(main));
  const [isAdmittancesCollection, setIsAdmittancesCollection] = useState(true);
  const [
    isCreateAdmittanceCollection,
    setIsCreateAdmittanceCollection,
  ] = useState(true);
  const [
    isUpdateAdmittanceCollection,
    setIsUpdateAdmittanceCollection,
  ] = useState(true);
  const [
    isDeleteAdmittanceCollection,
    setIsDeleteAdmittanceCollection,
  ] = useState(true);
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
      isDeleteAdmittanceCollection,
      props.deleteAdmittanceState.status
    );

    if (
      !isAdmittancesCollection &&
      props.admittances &&
      props.admittances.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListAdmittances();

      setIsAdmittancesCollection(true);
    }

    if (
      !isCreateAdmittanceCollection &&
      props.createAdmittanceState &&
      props.createAdmittanceState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateAdmittance();

      setIsCreateAdmittanceCollection(true);
    }
    if (
      !isUpdateAdmittanceCollection &&
      props.updateAdmittanceState &&
      props.updateAdmittanceState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateAdmittance();

      setIsUpdateAdmittanceCollection(true);
    }
    if (
      !isDeleteAdmittanceCollection &&
      props.deleteAdmittanceState &&
      props.deleteAdmittanceState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteAdmittance();
      setIsDeleteAdmittanceCollection(true);
    }
  }, [
    isAdmittancesCollection,
    isCreateAdmittanceCollection,
    isUpdateAdmittanceCollection,
    isDeleteAdmittanceCollection,
  ]);
  useEffect(() => {
    console.log("list admittances", props.main);
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      isAdmittanceListDone = false;
      props.listAdmissions({ companyId: userProfile.companyId });
    }
  }, []);
  useEffect(() => {
    console.log("[Props.main]", props.main);
    if (props.main) {
      if (
        props.profileState &&
        props.profileState.data &&
        props.profileState.data.length
      ) {
        userProfile = props.profileState.data[0];
        isPatientListDone = false;

        console.log("[List Patients]");
        props.listPatients({ companyId: userProfile.companyId });
      }
    } else {
      isPatientListDone = true;
    }
  }, [props.main]);
  console.log("[props.Admittances]", props.admittances, props.patients);
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
    isAdmittancesCollection &&
    props.admittances &&
    props.admittances.status === ACTION_STATUSES.SUCCEED
  ) {
    isAdmittanceListDone = true;
    grandTotal = 0.0;
    let source = props.admittances.data;
    if (source && source.length) {
      source = AdmittanceHandler.mapData(source, productList);
    }

    const cols = AdmittanceHandler.columns(main).map((col, index) => {
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
              {cellProps.data.isDone ? (
                <Tooltip title={"Completed"}>
                  <CheckCircle style={{ color: "green" }} />
                </Tooltip>
              ) : (
                <Tooltip title={"Incomplete"}>
                  <HelpOutline style={{ color: "black" }} />
                </Tooltip>
              )}
              {cellProps.data[col.name]}
            </div>
          ),
        };
      }
      if (!["referral"].includes(col.name)) {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <div style={{ display: "inline-flex", gap: 2 }}>
              {cellProps.data[col.name] ? (
                <CheckCircle />
              ) : (
                <HelpOutline style={{ color: "red" }} />
              )}
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
    source = sortByWorth(source);
    setDataSource(source);
    setIsAdmittancesCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Admittance id]", id);
    props.deleteAdmittance(id);
  };
  const createAdmittanceHandler = (payload, mode) => {
    console.log("[Create Admittance Handler]", payload, mode);
    const params = {
      created_at: new Date(),
      patientId: payload.patient.id,
      patientCd: payload.patient.patientCd,
      location: `${payload.patient.careType} - ${payload.patient.locationCd}`,
      companyId: userProfile.companyId,
      eval: payload.eval || undefined,
      eligibility: payload.eligibility || undefined,
      hp: payload.hp || undefined,
      intake: payload.intake || undefined,
      soc: payload.soc || undefined,
      noe: payload.noe || undefined,
      polst: payload.polst || undefined,
      referral: payload.referral,
      assessment: payload.assessment || undefined,
      cti: payload.cti || undefined,
      medRecord: payload.medRecord || undefined,
    };

    if (mode === "create") {
      params.createdUser = {
        name: "NRV",
        userId: uuidv4(),
      };
    }
    if (["create", "edit"].includes(mode)) {
      params.updatedUser = {
        name: "NRV",
        userId: uuidv4(),
      };
    }

    if (mode === "create") {
      console.log("[Mode]", params);
      props.createAdmittance(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateAdmittance(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Admittance Collection]", props.createAdmittanceState);
  if (
    isCreateAdmittanceCollection &&
    props.createAdmittanceState &&
    props.createAdmittanceState.status === ACTION_STATUSES.SUCCEED
  ) {
    isAdmittanceListDone = true;
    setIsCreateAdmittanceCollection(false);
    TOAST.ok("Admittance successfully created.");
    props.listAdmissions({ companyId: userProfile.companyId });
  }
  if (
    isUpdateAdmittanceCollection &&
    props.updateAdmittanceState &&
    props.updateAdmittanceState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Admittance successfully updated.");
    setIsUpdateAdmittanceCollection(false);
    props.listAdmissions({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteAdmittance]",
    isDeleteAdmittanceCollection,
    props.deleteAdmittanceState
  );
  if (
    isDeleteAdmittanceCollection &&
    props.deleteAdmittanceState &&
    props.deleteAdmittanceState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Admittance successfully deleted.");
    setIsDeleteAdmittanceCollection(false);

    props.listAdmissions({ companyId: userProfile.companyId });
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
    let fileName = `admittance_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
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

  console.log("[done admittance]", isPatientListDone, isAdmittanceListDone);
  isProcessDone = isPatientListDone && isAdmittanceListDone;

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
                        Admittance Management
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
                          ADD Admittance
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
        <AdmittanceForm
          filterRecordHandler={filterRecordHandler}
          employeeList={employeeList}
          dataSource={dataSource}
          createAdmittanceHandler={createAdmittanceHandler}
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
  admittances: admittanceListStateSelector(store),
  createAdmittanceState: admittanceCreateStateSelector(store),
  updateAdmittanceState: admittanceUpdateStateSelector(store),
  deleteAdmittanceState: admittanceDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listAdmissions: (data) => dispatch(attemptToFetchAdmittance(data)),
  resetListAdmittances: () => dispatch(resetFetchAdmittanceState()),
  createAdmittance: (data) => dispatch(attemptToCreateAdmittance(data)),
  resetCreateAdmittance: () => dispatch(resetCreateAdmittanceState()),
  updateAdmittance: (data) => dispatch(attemptToUpdateAdmittance(data)),
  resetUpdateAdmittance: () => dispatch(resetUpdateAdmittanceState()),
  deleteAdmittance: (data) => dispatch(attemptToDeleteAdmittance(data)),
  resetDeleteAdmittance: () => dispatch(resetDeleteAdmittanceState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdmittanceFunction);

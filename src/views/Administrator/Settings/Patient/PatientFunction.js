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

import HospiceTable from "components/Table/HospiceTable";
import { AddAlert, ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";

import PatientForm from "./components/Form";
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
      is_prior_hospice: payload.isPriorHospice,
      prior_benefits_period: parseInt(payload.priorBenefitsPeriod || 0, 10),
      prior_day_care: parseInt(payload.priorDayCare || 0, 10),
      prior_hospice_discharge: payload.priorHospiceDischarge?.name,
      eoc_discharge: payload.eocDischarge?.name,
      admitted_benefits_period: parseInt(payload.numberOfBenefits || 0, 10),
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    if (payload.priorHospiceDischargeDt) {
      params.prior_hospice_discharge_dt = payload.priorHospiceDischargeDt;
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
                    <div style={{ display: "inline-flex", gap: 10 }}>
                      <Button
                        color="info"
                        className={classes.marginRight}
                        onClick={() => createFormHandler()}
                      >
                        <AddIcon className={classes.icons} /> Add Patient
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

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

import TransportationHandler from "./components/TransportationHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { transportationListStateSelector } from "store/selectors/transportationSelector";
import { transportationCreateStateSelector } from "store/selectors/transportationSelector";
import { transportationDeleteStateSelector } from "store/selectors/transportationSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchTransportation } from "store/actions/transportationAction";
import { resetFetchTransportationState } from "store/actions/transportationAction";
import { attemptToCreateTransportation } from "store/actions/transportationAction";
import { resetCreateTransportationState } from "store/actions/transportationAction";
import { resetUpdateTransportationState } from "store/actions/transportationAction";
import { attemptToDeleteTransportation } from "store/actions/transportationAction";
import { resetDeleteTransportationState } from "store/actions/transportationAction";
import { transportationUpdateStateSelector } from "store/selectors/transportationSelector";
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
import TransportationForm from "./components/TransportationForm";
import { attemptToUpdateTransportation } from "store/actions/transportationAction";
import TOAST from "modules/toastManager";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { v4 as uuidv4 } from "uuid";
import { vendorListStateSelector } from "store/selectors/vendorSelector";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { resetFetchVendorState } from "store/actions/vendorAction";
import { attemptToFetchLocation } from "store/actions/locationAction";
import { resetFetchLocationState } from "store/actions/locationAction";
import { locationListStateSelector } from "store/selectors/locationSelector";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import TransportationOrderDocument from "views/Document/TransportationOrderDocument";
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
let isTransportationListDone = true;
let isVendorDone = true;
let isLocationDone = true;
let userProfile = {};

function TransportationFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [printData, setPrintData] = useState(undefined);
  const [isPrint, setIsPrint] = useState(false);
  const [columns, setColumns] = useState(TransportationHandler.columns(main));
  const [
    isTransportationsCollection,
    setIsTransportationsCollection,
  ] = useState(true);
  const [isLocationCollection, setIsLocationCollection] = useState(true);
  const [
    isCreateTransportationCollection,
    setIsCreateTransportationCollection,
  ] = useState(true);
  const [
    isUpdateTransportationCollection,
    setIsUpdateTransportationCollection,
  ] = useState(true);
  const [
    isDeleteTransportationCollection,
    setIsDeleteTransportationCollection,
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
      isDeleteTransportationCollection,
      props.deleteTransportationState.status
    );

    if (
      !isTransportationsCollection &&
      props.transportations &&
      props.transportations.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListTransportations();

      setIsTransportationsCollection(true);
    }

    if (
      !isCreateTransportationCollection &&
      props.createTransportationState &&
      props.createTransportationState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateTransportation();

      setIsCreateTransportationCollection(true);
    }
    if (
      !isUpdateTransportationCollection &&
      props.updateTransportationState &&
      props.updateTransportationState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateTransportation();

      setIsUpdateTransportationCollection(true);
    }
    if (
      !isDeleteTransportationCollection &&
      props.deleteTransportationState &&
      props.deleteTransportationState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteTransportation();
      setIsDeleteTransportationCollection(true);
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
    isTransportationsCollection,
    isLocationCollection,
    isCreateTransportationCollection,
    isUpdateTransportationCollection,
    isDeleteTransportationCollection,
  ]);
  useEffect(() => {
    console.log("list transportations", props.main);
    isTransportationListDone = false;
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listTransportations({ companyId: userProfile.companyId });
    }
  }, []);
  useEffect(() => {
    console.log("[Props.main]", props.main);
    if (props.main) {
      isPatientListDone = false;
      isVendorDone = false;
      isLocationDone = true;
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
      //   props.listLocations();
      props.listVendors({ companyId: userProfile.companyId });
    } else {
      isPatientListDone = true;
    }
  }, [props.main]);
  console.log("[props.Transportations]", props.transportations, props.patients);

  if (
    isTransportationsCollection &&
    props.transportations &&
    props.transportations.status === ACTION_STATUSES.SUCCEED
  ) {
    isTransportationListDone = true;
    grandTotal = 0.0;
    let source = props.transportations.data;
    if (source && source.length) {
      source = TransportationHandler.mapData(source, productList);
    }

    const cols = TransportationHandler.columns(main).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              printHandler={printHandler}
              isPrintFunction={true}
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
    setIsTransportationsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Transportation id]", id);
    props.deleteTransportation(id);
  };
  const createTransportationHandler = (payload, mode) => {
    console.log("[Create Transportation Handler]", payload, mode);
    const params = {
      created_at: new Date(),
      patient: {
        ...payload.patientData,
        id: payload.patient.id,
        code: payload.patient.patientCd,

        fullCodeDNR: payload.patientData.fullCodeDNR.value,
        modeOfTransfer: payload.patientData.modeOfTransfer.value,
        covidTest: payload.patientData.covidTest.value,

        oxygenRequired: payload.patientData.oxygenRequired.value,
        rideAlong: payload.patientData.rideAlong.value,
      },

      companyId: userProfile.companyId,
      vendor: {
        name: payload.vendor.name,
        id: payload.vendor.id,
      },
      notes: payload.notes,
      pickup: {
        ...payload.pickup,
        story: payload.pickup.story.value,
        stairs: payload.pickup.stairs.value,
        locType: payload.pickup.locType.value,
      },
      destination: {
        ...payload.destination,
        story: payload.destination.story.value,
        stairs: payload.destination.stairs.value,
        locType: payload.destination.locType.value,
      },
      appointment: `${moment(payload.appointmentDt)
        .utc()
        .format("YYYY-MM-DD")}T${payload.appointmentTm}:00.000Z`,
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
      props.createTransportation(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateTransportation(params);
    }
    closeFormModalHandler();
  };
  console.log(
    "[Is Create Transportation Collection]",
    props.createTransportationState
  );
  if (
    isCreateTransportationCollection &&
    props.createTransportationState &&
    props.createTransportationState.status === ACTION_STATUSES.SUCCEED
  ) {
    isTransportationListDone = true;
    setIsCreateTransportationCollection(false);
    closeFormModalHandler();
    TOAST.ok("Transportation successfully created.");
    props.listTransportations({ companyId: userProfile.companyId });
  }
  if (
    isUpdateTransportationCollection &&
    props.updateTransportationState &&
    props.updateTransportationState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Transportation successfully updated.");
    setIsUpdateTransportationCollection(false);
    props.listTransportations({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteTransportation]",
    isDeleteTransportationCollection,
    props.deleteTransportationState
  );
  if (
    isDeleteTransportationCollection &&
    props.deleteTransportationState &&
    props.deleteTransportationState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Transportation successfully deleted.");
    setIsDeleteTransportationCollection(false);

    props.listTransportations({ companyId: userProfile.companyId });
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
    let fileName = `transportation_list_batch_${new Date().getTime()}`;

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

  if (
    props.main &&
    props.vendors &&
    props.vendors.status === ACTION_STATUSES.SUCCEED
  ) {
    isVendorDone = true;
    vendorList = props.vendors.data;
    props.resetListVendors();
  }
  if (
    props.main &&
    isLocationCollection &&
    props.locations &&
    props.locations.status === ACTION_STATUSES.SUCCEED
  ) {
    isLocationDone = true;
    locationList = props.locations.data;
    setIsLocationCollection(false);
    //   props.resetListVendors();
  }
  console.log(
    "[done transportation]",
    isPatientListDone,
    isTransportationListDone
  );

  const printHandler = (item) => {
    console.log("[Item]", item);
    setPrintData(item);
    setIsPrint(true);
  };
  const closePrintModalHandler = () => {
    setIsPrint(false);
  };
  isProcessDone = isPatientListDone && isTransportationListDone && isVendorDone;

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
                  <CardHeader color="primary">
                    <Grid container justifyContent="space-between">
                      <h4 className={classes.cardTitleWhite}>
                        Transportation Management
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
                          }}
                          component="span"
                          startIcon={<AddIcon />}
                        >
                          ADD Transportation
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
      {isPrint && (
        <TransportationOrderDocument
          isOpen={isPrint}
          printData={printData}
          closePrintModalHandler={closePrintModalHandler}
        />
      )}
      {isFormModal && (
        <TransportationForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createTransportationHandler={createTransportationHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
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
  patients: patientListStateSelector(store),
  vendors: vendorListStateSelector(store),
  transportations: transportationListStateSelector(store),
  createTransportationState: transportationCreateStateSelector(store),
  updateTransportationState: transportationUpdateStateSelector(store),
  deleteTransportationState: transportationDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listLocations: (data) => dispatch(attemptToFetchLocation(data)),
  resetListLocations: () => dispatch(resetFetchLocationState()),
  listVendors: (data) => dispatch(attemptToFetchVendor(data)),
  resetListVendors: () => dispatch(resetFetchVendorState()),
  listTransportations: (data) => dispatch(attemptToFetchTransportation(data)),
  resetListTransportations: () => dispatch(resetFetchTransportationState()),
  createTransportation: (data) => dispatch(attemptToCreateTransportation(data)),
  resetCreateTransportation: () => dispatch(resetCreateTransportationState()),
  updateTransportation: (data) => dispatch(attemptToUpdateTransportation(data)),
  resetUpdateTransportation: () => dispatch(resetUpdateTransportationState()),
  deleteTransportation: (data) => dispatch(attemptToDeleteTransportation(data)),
  resetDeleteTransportation: () => dispatch(resetDeleteTransportationState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransportationFunction);

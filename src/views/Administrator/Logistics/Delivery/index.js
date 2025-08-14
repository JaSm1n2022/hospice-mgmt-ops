import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import PickupHandler from "./handler/PickupHandler";

import { makeStyles } from "@material-ui/core/styles";

import { useState } from "react";
import * as FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";

import { connect } from "react-redux";

import { productListStateSelector } from "store/selectors/productSelector";
import { stockListStateSelector } from "store/selectors/stockSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { templateListStateSelector } from "store/selectors/templateSelector";
import { distributionListStateSelector } from "store/selectors/distributionSelector";
import { distributionCreateStateSelector } from "store/selectors/distributionSelector";
import { distributionUpdateStateSelector } from "store/selectors/distributionSelector";
import { templateUpdateStateSelector } from "store/selectors/templateSelector";
import { distributionDeleteStateSelector } from "store/selectors/distributionSelector";
import { stockUpdateStateSelector } from "store/selectors/stockSelector";
import { templateCreateStateSelector } from "store/selectors/templateSelector";
import { templateDeleteStateSelector } from "store/selectors/templateSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchStock } from "store/actions/stockAction";
import { resetFetchStockState } from "store/actions/stockAction";
import { attemptToFetchDistribution } from "store/actions/distributionAction";
import { resetFetchDistributionState } from "store/actions/distributionAction";
import { attemptToCreateDistribution } from "store/actions/distributionAction";
import { resetCreateDistributionState } from "store/actions/distributionAction";
import { attemptToUpdateDistribution } from "store/actions/distributionAction";
import { resetUpdateDistributionState } from "store/actions/distributionAction";
import { attemptToDeleteDistribution } from "store/actions/distributionAction";
import { resetDeleteDistributionState } from "store/actions/distributionAction";
import { attemptToUpdateStock } from "store/actions/stockAction";
import { resetUpdateStockState } from "store/actions/stockAction";
import { attemptToCreateTemplate } from "store/actions/templateAction";
import { resetCreateTemplateState } from "store/actions/templateAction";
import { attemptToFetchTemplate } from "store/actions/templateAction";
import { resetFetchTemplateState } from "store/actions/templateAction";
import { attemptToUpdateTemplate } from "store/actions/templateAction";
import { resetUpdateTemplateState } from "store/actions/templateAction";
import { attemptToDeleteTemplate } from "store/actions/templateAction";
import { resetDeleteTemplateState } from "store/actions/templateAction";
import HospiceTable from "components/Table/HospiceTable";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";
import ActionsFunction from "components/Actions/ActionsFunction";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";

import { profileListStateSelector } from "store/selectors/profileSelector";
import ReactSignatureCanvas from "react-signature-canvas";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { DEFAULT_ITEM } from "utils/constants";

import CustomTextField from "components/TextField/CustomTextField";
import { proofCreateStateSelector } from "store/selectors/proofSelector";
import { attemptToCreateProof } from "store/actions/proofAction";
import { resetCreateProofState } from "store/actions/proofAction";
import PhotoModal from "../PhotoModal";
import { CameraAlt } from "@material-ui/icons";
import TOAST from "modules/toastManager";
import ImageIcon from "@material-ui/icons/Image";

let productList = [];
let employeeList = [];
let patientList = [];
let originalDataSource = [];
let isPatientListDone = false;
let isProductListDone = false;
let isDistributionListDone = false;
let isAllFetchDone = false;
let isEmployeeListDone = false;
let isSaveDone = true;
let progressMsg = "Loading";
let originalSource = undefined;

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
let userProfile = {};
let isSigned = false;
const useStyles = makeStyles(styles);
const Delivery = (props) => {
  const sigCanvas = useRef();
  const classes = useStyles();
  const [isRefresh, setIsRefresh] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(PickupHandler.columns());
  const [employee, setEmployee] = useState(DEFAULT_ITEM);
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [printedName, setPrintedName] = useState("");
  const [
    isUpdateDistributionCollection,
    setIsUpdateDistributionCollection,
  ] = useState(true);
  const [isDistributionsCollection, setIsDistributionsCollection] = useState(
    true
  );
  const [isSignatureCollection, setIsSignatureCollection] = useState(true);
  useEffect(() => {
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      employeeList = [];
      userProfile = props.profileState.data[0];
      const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
      setDateFrom(dates.from);
      setDateTo(dates.to);
      isEmployeeListDone = false;
      isProductListDone = false;
      isDistributionListDone = true;
      isPatientListDone = false;
      props.listPatients({
        companyId: userProfile.companyId,
        isDelivery: true,
      });
      props.listEmployees({ companyId: userProfile.companyId });
      props.listProducts({ companyId: userProfile.companyId });
    }
    /*
      props.listDistributions({
        from: dates.from,
        to: dates.to,
        companyId: userProfile.companyId,
      });
    }
    */
  }, []);

  useEffect(() => {
    if (
      !isUpdateDistributionCollection &&
      props.updateDistributionState &&
      props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
    ) {
      clearFilterHandler();
      props.resetUpdateDistribution();

      setIsUpdateDistributionCollection(true);
    }
    if (
      !isDistributionsCollection &&
      props.distributions &&
      props.distributions.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListDistributions();

      setIsDistributionsCollection(true);
    }
    if (
      !isSignatureCollection &&
      props.proofState &&
      props.proofState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateProof();
      const finalPayload = [];
      dataSource.forEach((d) => {
        finalPayload.push({
          id: d.id,
          actualDeliveredDt: new Date(),
          updatedUser: {
            name: userProfile.name,
            userId: userProfile.id,
            date: new Date(),
          },
        });
      });
      props.updateDistribution(finalPayload);
      setIsSignatureCollection(true);
    }
  }, [
    isDistributionsCollection,
    isSignatureCollection,
    isUpdateDistributionCollection,
  ]);

  if (props.products && props.products.status === ACTION_STATUSES.SUCCEED) {
    productList = [...props.products.data];
    productList.forEach((item) => {
      item.name = item.description.toUpperCase();
      item.value = item.description.toUpperCase();
      item.label = item.description.toUpperCase();
      item.categoryType = "description";
    });
    isProductListDone = true;
    props.resetListProducts();
  }
  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    employeeList = [...props.employees.data];
    employeeList.forEach((item) => {
      item.name = item.name.toUpperCase();
      item.value = item.name.toUpperCase();
      item.label = item.name.toUpperCase();
      item.categoryType = "employee";
    });
    isEmployeeListDone = true;
    props.resetListEmployees();
  }
  if (
    isProductListDone &&
    isDistributionsCollection &&
    props.distributions &&
    props.distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.distributions.data;
    for (const src of source) {
      const prodDetails = productList.find((pr) => pr.id === src.productId);
      if (prodDetails) {
        src.shortDescription = prodDetails.short_description;
        src.size = prodDetails.size;
        src.flavor = prodDetails.flavor;
        src.vendor = prodDetails.vendor;
      }
    }
    if (source && source.length) {
      source = PickupHandler.mapData(source);
    }
    setDataSource(source);
    if (source?.length === 0) {
      TOAST.ok("No record found!");
    }
    isDistributionListDone = true;
    setIsDistributionsCollection(false);
  }

  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    patientList = [...props.patients.data];
    patientList.forEach((item) => {
      if (item.patientCd) {
        item.name = item.patientCd.toUpperCase();
        item.value = item.patientCd.toUpperCase();
        item.label = item.patientCd.toUpperCase();
        item.categoryType = "patient";
      }
    });

    isPatientListDone = true;
    props.resetListPatients();
  }

  const clearSignatureHandler = () => {
    isSigned = false;
    sigCanvas.current?.clear();
    setIsRefresh(!isRefresh);
  };
  const onBeginHandler = (event) => {
    isSigned = true;

    setIsRefresh(!isRefresh);
  };
  const inputGeneralHandler = ({ target }) => {
    if (target.name === "printedName") {
      setPrintedName(target.value);
    }
  };
  const autoCompleteGeneralInputHander = (item) => {
    if (item.categoryType === "employee") {
      setEmployee(item);
      // setPrintedName(item.name);
      if (patient?.id) {
        props.listDistributions({
          requestor: item.id,
          isDelivery: true,
          patientId: patient.id,
          companyId: userProfile.companyId,
        });
      }
      console.log("[Item]", item, patientList);
    } else if (item.categoryType === "patient") {
      console.log("[item patient]", item);
      setPatient(item);
      props.listDistributions({
        requestor: employee.id,
        isDelivery: true,
        patientId: item.id,
        companyId: userProfile.companyId,
      });
      console.log("[Item]", item, patientList);
    }
  };

  const onChangeGeneralInputHandler = (e) => {
    if (!e.target.value && e.target.name === "employee") {
      setEmployee(DEFAULT_ITEM);
    } else if (!e.target.value && e.target.name === "patient") {
      setPatient(DEFAULT_ITEM);
    }
  };

  const clearFilterHandler = () => {
    console.log("[Clear]", isSaveDone);
    isSaveDone = true;
    setPrintedName("");
    setPatient(DEFAULT_ITEM);
    setDataSource([]);
    setEmployee(DEFAULT_ITEM);
  };

  const saveHandler = () => {
    isSaveDone = false;
    progressMsg = "Saving";
    const signImg = sigCanvas.current?.getCanvas().toDataURL("image/png");
    const orderIds = dataSource.map((p) => p.record_id);

    const finalPayload = [];
    for (const orderId of orderIds.filter((o) => o)) {
      const params = {
        created_at: new Date(),
        category: "delivery_signature",
        record_id: orderId || "",
        image_based: signImg,
        printedName: printedName,
        companyId: userProfile.companyId,
        updatedUser: {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        },
        createdUser: {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        },
      };
      finalPayload.push(params);
    }
    if (imgSrc) {
      for (const orderId of orderIds.filter((o) => o)) {
        const params = {
          created_at: new Date(),
          category: "delivery_photo",
          record_id: orderId || "",
          image_based: imgSrc,
          printedName: printedName,
          companyId: userProfile.companyId,
          updatedUser: {
            name: userProfile.name,
            userId: userProfile.id,
            date: new Date(),
          },
          createdUser: {
            name: userProfile.name,
            userId: userProfile.id,
            date: new Date(),
          },
        };
        finalPayload.push(params);
      }
    }

    props.createProof(finalPayload);
    setIsRefresh(!isRefresh);
  };

  if (
    isSignatureCollection &&
    props.proofState &&
    props.proofState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsSignatureCollection(false);
  }

  if (
    isUpdateDistributionCollection &&
    props.updateDistributionState &&
    props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdateDistributionCollection(false);
  }

  isAllFetchDone =
    isEmployeeListDone &&
    isDistributionListDone &&
    isProductListDone &&
    isPatientListDone &&
    isSaveDone
      ? true
      : false;
  console.log(
    "Is All Fetch",
    isProductListDone,
    isDistributionListDone,
    isSaveDone,
    isAllFetchDone
  );
  console.log("[DataSource]", dataSource);

  const closePhotoHandler = () => {
    setIsPhotoOpen(false);
  };
  const onUsePhotoHandler = (img) => {
    console.log("[Images]", img);
    setImgSrc(img);
    setIsPhotoOpen(false);
  };
  const takePhotoHandler = () => {
    setImgSrc("");
    setIsPhotoOpen(true);
  };
  return (
    <React.Fragment>
      {!isAllFetchDone && (
        <div align="center" style={{ paddingTop: "100px" }}>
          <br />
          <CircularProgress />
          &nbsp;<span>{progressMsg}</span>...
        </div>
      )}
      {isAllFetchDone && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <Grid justifyContent="space-between" container>
                  <h4 className={classes.cardTitleWhite}>
                    Delivery Management
                  </h4>
                </Grid>
              </CardHeader>
              <CardBody>
                <Grid container spacing={2} direction="row">
                  <Grid item xs={12} md={4} style={{ paddingTop: 10 }}>
                    <CustomSingleAutoComplete
                      options={employeeList || [DEFAULT_ITEM]}
                      value={employee}
                      name={"employee"}
                      label={"Requestor"}
                      placeholder={"Requestor"}
                      onSelectHandler={autoCompleteGeneralInputHander}
                      onChangeHandler={onChangeGeneralInputHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} style={{ paddingTop: 10 }}>
                    <CustomSingleAutoComplete
                      options={patientList || [DEFAULT_ITEM]}
                      value={patient}
                      name={"patient"}
                      label={"Patient"}
                      placeholder={"Patient"}
                      onSelectHandler={autoCompleteGeneralInputHander}
                      onChangeHandler={onChangeGeneralInputHandler}
                    />
                  </Grid>
                  {/*
                  <Grid item xs={12} md={4} style={{ paddingTop: 10 }}>
                    <Button
                      onClick={() => clearFilterHandler()}
                      variant="contained"
                      style={{
                        border: "solid 1px #2196f3",
                        color: "white",
                        background: "#2196f3",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 500,
                        fontStretch: "normal",
                        fontStyle: "normal",
                        lineHeight: 1.71,
                        letterSpacing: "0.4px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      component="span"
                    >
                      CLEAR
                    </Button>
                  </Grid>
                    */}
                </Grid>
                {dataSource?.length > 0 && (
                  <Typography variant="h6">
                    {`Supplies (${dataSource.length})`}{" "}
                  </Typography>
                )}
                {/*dataSource.map((m, indx) => {
                  return (
                    <Grid container>
                      <div style={{ display: "inline-flex", gap: 4 }}>
                        <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          {indx + 1}.
                        </Typography>
                        <Typography variant="body1">
                          {m.shortDescription} / {m.units}
                        </Typography>
                      </div>
                    </Grid>
                  );
                })*/}
                <Grid container spacing={2}>
                  {dataSource?.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          borderRadius: 2,

                          display: "grid",
                          align: "left",
                          paddingLeft: 2,
                          paddingRight: 2,
                        }}
                      >
                        <Paper
                          elevation={1}
                          style={{
                            textAlign: "left",
                            paddingLeft: 4,
                            color: "gray",
                            height: 40,
                            lineHeight: "40px",
                          }}
                        >
                          <div
                            style={{ display: "inline-flex", gap: 1 }}
                            align="left"
                          >
                            <Typography>{index + 1}.</Typography>
                            <Typography>{item.shortDescription} /</Typography>
                            <Typography>{item.units}</Typography>
                          </div>
                        </Paper>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {employee.name && dataSource && dataSource.length ? (
                  <div>
                    <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                      <Typography>Please sign here</Typography>
                    </div>
                    <div
                      style={{
                        border: "1px solid black",
                        width: 280,
                        paddingBottom: 4,
                      }}
                    >
                      <ReactSignatureCanvas
                        penColor="green"
                        onBegin={(e) => onBeginHandler(e)}
                        ref={(ref) => {
                          sigCanvas.current = ref;
                        }}
                        canvasProps={{
                          width: 280,
                          height: 120,
                          className: "sigCanvas",
                        }}
                      />
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <Button
                        variant="contained"
                        onClick={clearSignatureHandler}
                      >
                        Clear Signature
                      </Button>
                    </div>
                    <div
                      style={{ paddingTop: 4, paddingBottom: 4, width: 240 }}
                    >
                      <Typography>Printed Name</Typography>
                      <CustomTextField
                        name={"printedName"}
                        value={printedName}
                        onChange={inputGeneralHandler}
                      />
                    </div>
                    <div>
                      {" "}
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt="proof"
                          height="200px"
                          width="200px"
                        />
                      )}
                    </div>
                    <div style={{ display: "inline-flex", gap: 10 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={takePhotoHandler}
                        startIcon={<CameraAlt />}
                      >
                        Take Photo
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => saveHandler()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : null}
                {isPhotoOpen && (
                  <PhotoModal
                    isOpen={isPhotoOpen}
                    closePhotoHandler={closePhotoHandler}
                    onUsePhotoHandler={onUsePhotoHandler}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  stocks: stockListStateSelector(store),
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  templates: templateListStateSelector(store),
  distributions: distributionListStateSelector(store),
  createDistributionState: distributionCreateStateSelector(store),
  updateDistributionState: distributionUpdateStateSelector(store),
  updateTemplateState: templateUpdateStateSelector(store),
  deleteDistributionState: distributionDeleteStateSelector(store),
  updateStockState: stockUpdateStateSelector(store),
  createTemplateState: templateCreateStateSelector(store),
  deleteTemplateState: templateDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
  proofState: proofCreateStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  listStocks: (data) => dispatch(attemptToFetchStock(data)),
  resetListStocks: () => dispatch(resetFetchStockState()),
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistributions: () => dispatch(resetFetchDistributionState()),
  createDistribution: (data) => dispatch(attemptToCreateDistribution(data)),
  resetCreateDistribution: () => dispatch(resetCreateDistributionState()),
  updateDistribution: (data) => dispatch(attemptToUpdateDistribution(data)),
  resetUpdateDistribution: () => dispatch(resetUpdateDistributionState()),
  deleteDistribution: (data) => dispatch(attemptToDeleteDistribution(data)),
  resetDeleteDistribution: () => dispatch(resetDeleteDistributionState()),
  updateStock: (data) => dispatch(attemptToUpdateStock(data)),
  resetUpdateStock: () => dispatch(resetUpdateStockState()),
  createTemplate: (data) => dispatch(attemptToCreateTemplate(data)),
  resetCreateTemplate: () => dispatch(resetCreateTemplateState()),
  listTemplates: (data) => dispatch(attemptToFetchTemplate(data)),
  resetListTemplates: () => dispatch(resetFetchTemplateState()),
  updateTemplate: (data) => dispatch(attemptToUpdateTemplate(data)),
  resetUpdateTemplate: () => dispatch(resetUpdateTemplateState()),
  deleteTemplate: (data) => dispatch(attemptToDeleteTemplate(data)),
  resetDeleteTemplate: () => dispatch(resetDeleteTemplateState()),
  createProof: (data) => dispatch(attemptToCreateProof(data)),
  resetCreateProof: () => dispatch(resetCreateProofState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);

import React, { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import Pod from "../Pod";
import {
  CameraAlt,
  CameraAltOutlined,
  ClearOutlined,
  Favorite,
  Gesture,
  AddAlertOutlined,
} from "@material-ui/icons";

import { useToasts } from "react-toast-notifications";
import ReactSignatureCanvas from "react-signature-canvas";
import PhotoModal from "./PhotoModal";
import PickupIcon from "@material-ui/icons/LocalShippingOutlined";
import { distributionListStateSelector } from "store/selectors/distributionSelector";
import { proofCreateStateSelector } from "store/selectors/proofSelector";
import { distributionUpdateStateSelector } from "store/selectors/distributionSelector";
import { attemptToFetchDistribution } from "store/actions/distributionAction";
import { resetFetchDistributionState } from "store/actions/distributionAction";
import { attemptToCreateProof } from "store/actions/proofAction";
import { resetCreateProofState } from "store/actions/proofAction";
import { attemptToUpdateDistribution } from "store/actions/distributionAction";
import { resetUpdateDistributionState } from "store/actions/distributionAction";
import { ACTION_STATUSES } from "utils/constants";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import Table from "components/Table/Table.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import NavPills from "components/NavPills/NavPills.js";
// @material-ui/icons

import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";

// core components

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import { SupaContext } from "App.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import styles from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import styles2 from "../../../assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Tooltip,
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
let originalSource = [];
let isSigned = false;
const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Pickup = (props) => {
  const sigCanvas = useRef();
  const context = useContext(SupaContext);
  const { addToast } = useToasts();
  const [tc, setTC] = React.useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [printedName, setPrintedName] = useState("");
  const [printedNameError, setPrintedNameError] = useState({
    isError: false,
    message: "",
  });
  const [message, setMessage] = useState(
    "Supplies have been successfully picked up."
  );
  const [color, setColor] = useState("success");
  const [dataSource, setDataSource] = useState([]);
  const [suppliesData, setSuppliesData] = useState([]);
  const [signatureError, setSignatureError] = useState(false);
  const [isProofCollection, setIsProofCollection] = useState(true);
  const [isProcessDone, setIsProcessDone] = useState(false);
  const [
    isUpdateDistributionCollection,
    setIsUpdateDistributionCollection,
  ] = useState(true);
  const [isDistributionCollection, setIsDistributionCollection] = useState(
    true
  );
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    const emp = context.employeeProfile;

    if (emp?.id) {
      console.log("[Props employee1]", emp);
      setIsProcessDone(false);
      setPrintedName(emp.name);
      props.listDistributions({
        requestor: emp.id,
        isPickup: true,
        companyId: emp.companyId,
      });
    } else {
      props.history.push(`/`);
    }
  }, [context]);

  useEffect(() => {
    if (
      !isDistributionCollection &&
      props.distributions?.status === ACTION_STATUSES.SUCCEED
    ) {
      const data = props.distributions?.data?.filter(
        (f) => f.category === "Medical/Incontinence"
      );
      console.log("[Data]", data);
      originalSource = data || [];

      const arr = Array.from(new Set(data?.map((m) => m.patientCd) || []));
      setClients(arr);
      setDataSource(data);

      setIsProcessDone(true);
      props.resetListDistributions();
      setIsDistributionCollection(true);
    }
    if (
      !isProofCollection &&
      props.proofState &&
      props.proofState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateProof();
      const finalPayload = [];
      dataSource.forEach((d) => {
        finalPayload.push({
          companyId: context.userProfile.companyId,
          id: d.id,
          actualPickupDt: new Date(),
          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
        });
      });
      props.updateDistribution(finalPayload);
      setIsProofCollection(true);
    }
    if (
      !isUpdateDistributionCollection &&
      props.updateDistributionState &&
      props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateDistribution();
      clearHandler();
      showNotification("tc", "success");
      setIsUpdateDistributionCollection(true);
      props.listDistributions({
        requestor: context.employeeProfile.id,
        isPickup: true,
        companyId: context.employeeProfile.companyId,
      });
    }
  }, [
    isDistributionCollection,
    isProofCollection,
    isUpdateDistributionCollection,
  ]);

  const createTableDataHandler = (data) => {
    const colors = ["success", "info", "warning", "danger"];
    const tables = [];
    let grandTotal = 0.0;
    let colorInt = 0;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      let c = {};

      if ((i + 1) % 2 === 0) {
        c = [
          i + 1,
          `${d.short_description || d.description}`,
          `${d.order_qty} ${d.unit_uom}`,
        ];
      } else {
        c.color = colors[colorInt];
        c.data = [
          i + 1,
          `${d.short_description || d.description}`,
          `${d.order_qty} ${d.unit_uom}`,
        ];
        colorInt++;
      }

      if (colorInt === 4) {
        colorInt = 0;
      }
      tables.push(c);
    }

    return tables;
  };

  const onBeginHandler = () => {
    isSigned = true;
    setSignatureError({ isError: false, message: "" });
    setIsRefresh(!isRefresh);
  };

  const clearSignatureHandler = () => {
    sigCanvas.current?.clear();
    isSigned = false;

    setIsRefresh(!isRefresh);
  };

  const clearHandler = () => {
    setClient("");
    sigCanvas.current?.clear();
    setDataSource([]);
    setImgSrc("");

    setPrintedName("");
  };

  const takePhotoHandler = () => {
    setImgSrc("");
    setIsPhotoOpen(true);
  };
  const closePhotoHandler = () => setIsPhotoOpen(false);
  const onUsePhotoHandler = (img) => {
    setImgSrc(img);
    setIsPhotoOpen(false);
  };
  const showNotification = (place, color) => {
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
  const inputHandler = ({ target }) => {
    console.log("[INPUT HANDLER]", target);
    if (target.name === "printedName") {
      setPrintedNameError({
        isError: false,
        message: "Received by is required.",
      });
      setPrintedName(target.value);
    } else if (target.name === "client") {
      setClient(target.value);
      const ds = originalSource.filter(
        (f) =>
          f.patientCd === target.value && f.category === "Medical/Incontinence"
      );
      setSuppliesData(createTableDataHandler(ds) || []);
      setDataSource(ds);
    }
  };

  const saveHandler = () => {
    const signImg = sigCanvas.current?.getCanvas().toDataURL("image/png");
    const orderIds = dataSource.map((p) => p.record_id);
    let isValid = true;
    if (!isSigned) {
      setSignatureError({ isError: true, message: "Signature is required." });
      console.log("[IS INVALID SIGNATURE]");
      isValid = false;
    }
    if (!printedName) {
      setPrintedNameError({
        isError: true,
        message: "Received by is required.",
      });
      console.log("[IS INVALID SIGNATURE]");
      isValid = false;
    }
    if (!isValid) {
      return;
    } else {
      const finalPayload = [];
      for (const orderId of orderIds.filter((o) => o)) {
        const params = {
          created_at: new Date(),
          category: "pickup_signature",
          record_id: orderId || "",
          image_based: signImg,
          printedName: printedName,
          companyId: context.userProfile.companyId,
          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
          createdUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
        };
        finalPayload.push(params);
      }
      if (imgSrc) {
        for (const orderId of orderIds.filter((o) => o)) {
          const params = {
            created_at: new Date(),
            category: "pickup_photo",
            record_id: orderId || "",
            image_based: imgSrc,
            printedName: printedName,
            companyId: context.userProfile.companyId,
            updatedUser: {
              name: context.userProfile.name,
              userId: context.userProfile.id,
              date: new Date(),
            },
            createdUser: {
              name: context.userProfile.name,
              userId: context.userProfile.id,
              date: new Date(),
            },
          };
          finalPayload.push(params);
        }
      }

      props.createProof(finalPayload);
      setIsRefresh(!isRefresh);
    }
  };

  if (
    isDistributionCollection &&
    props.distributions?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsDistributionCollection(false);
  }
  if (
    isProofCollection &&
    props.proofState &&
    props.proofState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsProofCollection(false);
  }
  if (
    isUpdateDistributionCollection &&
    props.updateDistributionState &&
    props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdateDistributionCollection(false);
  }

  const refreshHandler = () => {
    clearHandler();
    setIsProcessDone(false);
    props.listDistributions({
      requestor: context.employeeProfile.id,
      isPickup: true,
      companyId: context.employeeProfile.companyId,
    });
  };

  console.log("[CONTEXt]", context);
  /*
  return (
    <>
      <div
        style={{
          background: "#56764c",
          width: !context.isMobile ? "50%" : "100%",
          paddingLeft: !context.isMobile ? "25%" : "0%",
          paddingRight: !context.isMobile ? "25%" : "0%",
        }}
      >
        <div
          align="center"
          style={{ paddingLeft: 16, paddingBottom: 4, paddingRight: 16 }}
        >
          <Typography
            style={{ color: "white", background: "#033D39" }}
            variant="h6"
          >
            Pickup Tracking
          </Typography>
        </div>

        <div align="left" style={{ paddingLeft: 16, paddingBottom: 4 }}>
          <Typography style={{ color: "white" }} variant="h6">
            {`Select Client ${clients?.length ? `(${clients.length})` : ""}`}
          </Typography>
        </div>

        <div align="left" style={{ paddingRight: 16, paddingLeft: 16 }}>
          <Box style={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <Select
                id="client-select-select"
                value={client}
                name="client"
                style={{ background: "white" }}
                onChange={inputHandler}
              >
                <MenuItem disabled value="Select">
                  Select One
                </MenuItem>
                {clients.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {clients?.length === 0 && isProcessDone && (
          <div style={{ width: "100%" }}>
            <div align="left" style={{ paddingLeft: 16, paddingTop: 5 }}>
              <Typography style={{ color: "white" }} variant="h6">
                There are currently no supplies available for client pickup.
                Please refresh the page to check for any available supplies.
              </Typography>
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: client && client !== "Select" ? "" : "none",
          }}
        >
          <div align="left" style={{ paddingLeft: 16, paddingTop: 5 }}>
            <Typography style={{ color: "white" }} variant="h6">
              {`Supplies (${dataSource.length})`}
            </Typography>
          </div>

          <Pod isMobile={context.isMobile} dataSource={dataSource} />

          <div align="left" style={{ paddingLeft: 16, paddingTop: 5 }}>
            <Typography style={{ color: "white" }} variant="h6">
              Signature
            </Typography>
          </div>

          <div
            align="left"
            style={{
              border: "4px solid white",
              background: "white",
              marginLeft: 16,
              marginRight: 16,
            }}
          >
            <ReactSignatureCanvas
              penColor="green"
              onBegin={(e) => onBeginHandler(e)}
              ref={(ref) => {
                sigCanvas.current = ref;
              }}
              canvasProps={{
                height: 80,
                width: 300,
                background: "white",
                className: "sigCanvas",
              }}
            />
          </div>

          <div align="left" style={{ paddingLeft: 16, paddingTop: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearSignatureHandler}
            >
              Clear
            </Button>
          </div>

          <div align="left" style={{ paddingLeft: 16, paddingTop: 5 }}>
            <Typography style={{ color: "white" }} variant="h6">
              Received By:
            </Typography>
          </div>

          <div
            align="left"
            style={{
              marginLeft: 16,
              marginRight: 16,
              paddingBottom: 4,
            }}
          >
            <TextField
              name="printedName"
              value={printedName}
              placeholder="Printed Name"
              style={{ width: "100%", background: "white" }}
              onChange={inputHandler}
            />
          </div>

          <div
            style={{
              gap: 10,
              paddingTop: 2,
              paddingLeft: 16,
              paddingBottom: 2,
            }}
          >
            {imgSrc && (
              <img src={imgSrc} alt="proof" height="120px" width="120px" />
            )}
          </div>

          <div
            style={{
              display: "inline-flex",
              gap: 10,
              paddingTop: 2,
              paddingLeft: 16,
              paddingBottom: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={takePhotoHandler}
              startIcon={<CameraAlt />}
            >
              {imgSrc ? "Retake Photo" : "Take Photo"}
            </Button>

            <Button variant="contained" color="primary" onClick={saveHandler}>
              Submit
            </Button>
          </div>
        </div>

        {isPhotoOpen && (
          <PhotoModal
            isOpen={isPhotoOpen}
            isMobile={context.isMobile}
            closePhotoHandler={closePhotoHandler}
            onUsePhotoHandler={onUsePhotoHandler}
          />
        )}
      </div>
    </>
  );
  */
  return (
    <>
      {" "}
      <GridContainer>
        <GridItem>
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
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="danger" icon>
              <CardIcon color="danger">
                <PickupIcon />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Pickup Tracking – Supplies
              </h4>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={6} lg={6}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* Left side: Select */}
                  <div style={{ flex: client ? "0 0 90%" : "100%" }}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="select-client"
                        className={classes.selectLabel}
                      >
                        Select Client
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        onChange={inputHandler}
                        inputProps={{
                          name: "client",
                          id: "select-client",
                        }}
                        value={client}
                        name="client"
                      >
                        {clients.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                        {/* ...MenuItems... */}
                      </Select>
                    </FormControl>
                    {client?.length === 0 && (
                      <SnackbarContent
                        message={"No supplies for pickup. Refresh to update."}
                        color="rose"
                        close
                        icon={AddAlertOutlined}
                      />
                    )}
                  </div>
                </div>
              </GridItem>
              {client && (
                <GridItem xs={12} md={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5
                      className={classes.cardIconTitle}
                      style={{ fontWeight: "bold" }}
                    >
                      Supplies
                    </h5>
                  </div>

                  <Table
                    hover
                    tableHead={["#", "Item", "Qty"]}
                    tableData={
                      Array.isArray(suppliesData) && suppliesData?.length
                        ? suppliesData
                        : []
                    }
                  />
                </GridItem>
              )}
              {client && (
                <GridItem xs={12} sm={12} md={6}>
                  <Card>
                    <CardHeader color="info" icon>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div style={{ flex: "0 0 90%" }}>
                          <div style={{ display: "inline-flex" }}>
                            <CardIcon color="info">
                              <Gesture />
                            </CardIcon>

                            <h4 className={classes.cardIconTitle}>Signature</h4>
                          </div>
                        </div>
                        <Tooltip title="Clear Signature">
                          <ClearOutlined
                            style={{ color: "red" }}
                            onClick={clearSignatureHandler}
                          />
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <ReactSignatureCanvas
                        penColor="green"
                        onBegin={(e) => onBeginHandler(e)}
                        ref={(ref) => {
                          sigCanvas.current = ref;
                        }}
                        canvasProps={{
                          height: 60,
                          width: 500,
                          background: "white",
                          className: "sigCanvas",
                        }}
                      />
                      {signatureError.isError && (
                        <SnackbarContent
                          message={signatureError.message}
                          color="rose"
                          close
                          icon={AddAlertOutlined}
                        />
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {client && (
                <GridItem xs={12} md={6} style={{ paddingLeft: 0 }}>
                  <CustomInput
                    id="help-text"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      name: "printedName",
                      onChange: (event) => {
                        inputHandler(event);
                      },
                      value: printedName,
                    }}
                    helperText={"Received By:"}
                  />
                  {printedNameError.isError && (
                    <SnackbarContent
                      message={printedNameError.message}
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  )}
                </GridItem>
              )}
              <div
                style={{
                  gap: 10,
                  paddingTop: 2,
                  paddingLeft: 16,
                  paddingBottom: 2,
                }}
              >
                {imgSrc && (
                  <img src={imgSrc} alt="proof" height="120px" width="120px" />
                )}
              </div>
              {client && (
                <GridItem sm={12} md={6}>
                  <div style={{ display: "inline-flex", gap: 2 }}>
                    <Button
                      color="info"
                      round
                      className={classes.marginRight}
                      onClick={takePhotoHandler}
                    >
                      <CameraAltOutlined className={classes.icons} /> Take Photo
                    </Button>
                    <Button
                      color="primary"
                      round
                      className={classes.marginRight}
                      onClick={saveHandler}
                    >
                      <Favorite className={classes.icons} /> Submit
                    </Button>
                  </div>
                </GridItem>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {isPhotoOpen && (
        <PhotoModal
          isOpen={isPhotoOpen}
          isMobile={context.isMobile}
          closePhotoHandler={closePhotoHandler}
          onUsePhotoHandler={onUsePhotoHandler}
        />
      )}
    </>
  );
};

const mapStateToProps = (store) => ({
  distributions: distributionListStateSelector(store),
  proofState: proofCreateStateSelector(store),
  updateDistributionState: distributionUpdateStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistributions: () => dispatch(resetFetchDistributionState()),
  createProof: (data) => dispatch(attemptToCreateProof(data)),
  resetCreateProof: () => dispatch(resetCreateProofState()),
  updateDistribution: (data) => dispatch(attemptToUpdateDistribution(data)),
  resetUpdateDistribution: () => dispatch(resetUpdateDistributionState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pickup);

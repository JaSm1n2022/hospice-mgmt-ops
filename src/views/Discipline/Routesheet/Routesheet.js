import React, { useContext, useEffect, useRef, useState } from "react";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
// react component plugin for creating beatiful tags on an input

// plugin that creates slider

// @material-ui/core components
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

import InputLabel from "@material-ui/core/InputLabel";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import NavPills from "components/NavPills/NavPills.js";
// @material-ui/icons

import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import styles2 from "../../../assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import dayjs from "dayjs";

import { SupaContext } from "App.js";
import {
  AddAlertOutlined,
  AssignmentIndOutlined,
  ClearOutlined,
  DriveEta,
  EventOutlined,
  Favorite,
  Gesture,
  NotesOutlined,
} from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import ReactSignatureCanvas from "react-signature-canvas";
import { TextareaAutosize, Tooltip } from "@material-ui/core";
import { routesheetCreateStateSelector } from "store/selectors/routesheetSelector.js";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector.js";
import { contractListStateSelector } from "store/selectors/contractSelector.js";
import { patientListStateSelector } from "store/selectors/patientSelector.js";
import { attemptToCreateRoutesheet } from "store/actions/routesheetAction.js";
import { resetCreateRoutesheetState } from "store/actions/routesheetAction.js";
import { attemptToFetchAssignment } from "store/actions/assignmentAction.js";
import { resetFetchAssignmentState } from "store/actions/assignmentAction.js";
import { attemptToFetchContract } from "store/actions/contractAction.js";
import { resetFetchContractState } from "store/actions/contractAction.js";
import { attemptToFetchPatient } from "store/actions/patientAction.js";
import { resetFetchPatientState } from "store/actions/patientAction.js";
import { connect } from "react-redux";
import { ACTION_STATUSES } from "utils/constants.js";
import SortUtil from "utils/sortUtil.js";
import { CLIENT_SERVICES } from "utils/constants.js";
import Typography from "views/Components/Typography.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";

const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
let serviceList = [];
let dataSource = [];
let isSigned = false;
let contractList = [];
let patientList = [];
let isProcessDone = false;
let isAssignmentDone = false;
let isPatientDone = false;
let isContractDone = false;
let assignmentList = [];
function Routesheet(props) {
  const [simpleSelect, setSimpleSelect] = useState("");
  const sigCanvas = useRef();
  const context = useContext(SupaContext);
  const [tc, setTC] = React.useState(false);
  const [noticeModal, setNoticeModal] = React.useState(false);
  const [mileage, setMileage] = useState(0);
  const [client, setClient] = useState("");
  const [notes, setNotes] = useState("");
  const [clients, setClients] = useState([]);
  const [clientService, setClientService] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isSignRequired, setIsSignRequired] = useState(false);
  const [isMileageRate, setIsMileageRate] = useState(false);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);
  const [isRoutesheetCollection, setIsRoutesheetCollection] = useState(true);
  const [contractRate, setContractRate] = useState(undefined);
  const [clientError, setClientError] = useState({
    isError: false,
    message: "",
  });
  const [signatureError, setSignatureError] = useState({
    isError: false,
    message: "",
  });
  const [dos, setDos] = useState(dayjs(new Date()));
  const [dosStart, setDosStart] = useState(
    dayjs(new Date()).format("YYYY-MM-DD HH:mm")
  );
  const [dosEnd, setDosEnd] = useState(
    dayjs(new Date()).add(1, "hour").format("YYYY-MM-DD HH:mm")
  );
  const [timeIn, setTimeIn] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [timeOut, setTimeOut] = useState(
    dayjs(new Date()).add(1, "hour").format("YYYY-MM-DD")
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [otherService, setOtherService] = useState("");
  const [otherServiceError, setOtherServiceError] = useState({
    isError: false,
    message: "",
  });
  const [message, setMessage] = useState(
    "Success! Service rendered has been saved."
  );
  const [color, setColor] = useState("success");
  const [patientInfo, setPatientInfo] = useState(undefined);
  const classes = useStyles();
  const classes2 = useStyles2();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-popover" : undefined;
  useEffect(() => {
    serviceList = [];
    console.log(
      "[context.employeeProfile?.position]",
      context.employeeProfile?.position
    );
    const tempServices = SortUtil.sortByAsc(CLIENT_SERVICES, "name", false);
    tempServices.forEach((t) => {
      if (t?.permission?.length === 1 && t?.permission[0] === "*") {
        serviceList.push(t);
      } else if (
        t?.permission?.length &&
        t?.permission.find((p) => p === context.employeeProfile?.position)
      ) {
        serviceList.push(t);
      }
    });
  }, []);
  useEffect(() => {
    if (
      !isContractCollection &&
      props.contracts?.status === ACTION_STATUSES.SUCCEED
    ) {
      isContractDone = true;
      props.resetListContracts();
      contractList = props.contracts.data;
      setIsContractCollection(true);
    }

    if (
      !isPatientCollection &&
      props.patients.status === ACTION_STATUSES.SUCCEED
    ) {
      isPatientDone = true;
      props.resetListPatients();
      patientList = props.patients.data;
      console.log("[PATIENT LIST]", patientList, assignmentList);
      assignmentList.forEach((e) => {
        const assignPatient = patientList.find(
          (p) => p.patientCd === e.patientCd
        );

        e.patient = assignPatient || undefined;
      });
      setIsPatientCollection(true);
    }

    if (
      !isAssignmentCollection &&
      props.assignmentState?.status === ACTION_STATUSES.SUCCEED
    ) {
      isAssignmentDone = true;
      props.resetListAssignment();

      setIsAssignmentCollection(true);
      const arr = props.assignmentState?.data || [];
      assignmentList = [];
      arr.forEach((e) => {
        if (e.disciplines?.find((e) => e && e === context.employeeProfile.id)) {
          console.log("[contezt 1]", e);
          assignmentList.push(e);
        }
      });
      const uniqueList = Array.from(
        new Set(assignmentList?.map((m) => m.patientCd) || [])
      );
      console.log(
        "[contezt]",
        context.employeeProfile,
        props.assignmentState?.data,
        dataSource,
        uniqueList
      );
      setClients(uniqueList);
      props.listPatients({
        companyId: context.employeeProfile.companyId,
        patientCd: uniqueList,
      });
      if (uniqueList?.length === 1) {
        //setClient(uniqueList[0]);
      }
    }
    if (
      !isRoutesheetCollection &&
      props.createRoutesheetState?.status === ACTION_STATUSES.SUCCEED
    ) {
      showNotification("tc", "success");
      props.resetCreateRoutesheet();
      setIsRoutesheetCollection(true);
      clearHandler();
    }
  }, [
    isAssignmentCollection,
    isPatientCollection,
    isRoutesheetCollection,
    isContractCollection,
  ]);
  useEffect(() => {
    const emp = context.employeeProfile;
    console.log("[EMP]", emp);
    if (emp?.id) {
      isProcessDone = false;
      props.listAssignments({ companyId: emp.companyId });
      props.listContracts({
        companyId: emp.companyId,
        employeeId: emp.id,
      });
    } else {
      props.history.push(`/`);
    }
  }, [context]);

  const onBeginHandler = () => {
    isSigned = true;
    setSignatureError({ isError: false, message: "" });
    setIsRefresh(!isRefresh);
  };
  const clearSignatureHandler = () => {
    isSigned = false;
    sigCanvas.current?.clear();
    setIsRefresh(!isRefresh);
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
  const clientInformationFrequencyHandler = () => {
    const cls = assignmentList.find((a) => a.patientCd === client);
    if (cls?.cnaId === context.employeeProfile.id) {
      console.log("[CLS]", cls);
      return `${cls.cnaFreqVisit}x/${cls.cnaFreqVisitType}`;
    } else if (cls.rnId === context.employeeProfile.id) {
      return `${cls.rnFreqVisit}x/${cls.rnFreqVisitType}`;
    } else if (cls.lpnId === context.employeeProfile.id) {
      return `${cls.lpnFreqVisit}x/${cls.lpnFreqVisitType}`;
    } else if (cls.mswId === context.employeeProfile.id) {
      return `${cls.mswFreqVisit}x/${cls.mswFreqVisitType}`;
    } else if (cls.chaplainId === context.employeeProfile.id) {
      return `${cls.chaplainFreqVisit}x/${cls.chaplainFreqVisitType}`;
    }
  };
  const clientInformationDayHandler = () => {
    const cls = assignmentList.find((a) => a.patientCd === client);
    if (cls?.cnaId === context.employeeProfile.id) {
      return `${cls.cnaWeek} - ${cls.cnaTime}`;
    } else if (cls?.rnId === context.employeeProfile.id) {
      return `${cls.rnWeek} - ${cls.rnTime}`;
    } else if (cls?.lpnId === context.employeeProfile.id) {
      return `${cls.lpnWeek} - ${cls.lpnTime}`;
    } else if (cls?.mswId === context.employeeProfile.id) {
      return `${cls.mswWeek} - ${cls.mswTime}`;
    } else if (cls?.chaplainId === context.employeeProfile.id) {
      return `${cls.chaplainWeek} - ${cls.chaplainTime}`;
    }
  };
  const clearHandler = () => {
    //clear
    setClient("");

    setIsMileageRate(false);
    setMileage(0);
    setClientService("");
    setNotes("");
    sigCanvas.current?.clear();
    setDos(dayjs(new Date()));
    setTimeOut(dayjs(new Date()));
    setTimeIn(dayjs(new Date()).format("HH:mm"));
    setTimeOut(dayjs(new Date()).add(1, "hour").format("HH:mm"));
  };

  const inputHandler = ({ target }) => {
    console.log("[IN]", target?.value);
    if (target.name === "notes") {
      setNotes(target.value);
    } else if (target.name === "otherService") {
      setOtherService(target.value);
      if (target.value) {
        setOtherServiceError({ isError: false, message: "" });
      } else {
        setOtherServiceError({
          isError: true,
          message: "Other service is required.",
        });
      }
    } else if (target.name === "mileage") {
      setMileage(target.value);
    } else if (target.name === "client") {
      setClientError({ isError: false, message: "" });

      const m = contractList.find(
        (c) => c.serviceType === clientService && c.patientCd === target.value
      );
      if (m) {
        setContractRate(m);
        if (m?.isMileageRate) {
          setIsMileageRate(m?.isMileageRate);
        } else {
          setIsMileageRate(false);
        }
      }
      const assignPatient = assignmentList.find(
        (a) => a.patientCd === target.value
      );

      setPatientInfo(assignPatient?.patient);
      //if specific

      setClient(target.value);
    } else if (target.name === "clientService") {
      setClientError({ isError: false, message: "" });
      setOtherServiceError({ isError: false, message: "" });
      if (target.value === "Attendance") {
        setTimeIn(dayjs(new Date()).set("hour", 8).set("minute", 0));
        setTimeOut(dayjs(new Date()).set("hour", 17).set("minute", 0));
      }

      let m = contractList.find(
        (c) => c.serviceType === target.value && !c.patientCd
      );

      setContractRate(m);
      if (m?.isMileageRate) {
        setIsMileageRate(m?.isMileageRate);
      } else {
        setIsMileageRate(false);
      }

      setClientService(target.value);
    }
  };

  const saveHandler = () => {
    const signImg = sigCanvas.current?.getCanvas().toDataURL("image/png");
    console.log("[SIGNATURE]", signImg, sigCanvas.current?.getCanvas());
    setClientError({ isError: false, message: "" });
    setSignatureError({ isError: false, message: "" });
    let isValid = true;
    if (isClientRequiredHandler() && !client) {
      setClientError({ isError: true, message: "Client is required." });
      console.log("[IS INVALID CLIENT]");
      isValid = false;
    }
    if (!isSigned) {
      setSignatureError({ isError: true, message: "Signature is required." });
      console.log("[IS INVALID SIGNATURE]");
      isValid = false;
    }
    if (
      clientService &&
      clientService?.toLowerCase() === "other" &&
      !otherService
    ) {
      setOtherServiceError({ isError: true, message: "Field is required." });
      console.log("[IS INVALID CLIENT SERVICE]");
      isValid = false;
    } else {
      setOtherServiceError({ isError: false, message: "" });
    }

    if (!isValid) {
      return;
    }
    const params = {
      created_at: new Date(),
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
      signature_based: signImg,
      requestor: context.employeeProfile.name,
      requestorId: context.employeeProfile.id,
      requestorTitle: context.employeeProfile.position,
      mileage: mileage || 0,
      isMileageRate: isMileageRate || false,
      serviceRate: contractRate?.serviceRate || 0,
      serviceNotes: notes || "",
      mileageRate: contractRate?.mileageRate || 0,
      mileageMaxReimbursement: contractRate?.maxReimbursement || 0,
      mileageCost: contractRate?.mileageRate
        ? parseFloat(contractRate?.mileageRate * mileage)
        : 0,

      //  dos: dayjs(new Date(dos)).format("YYYY-MM-DD"),
      dosStart: dayjs(new Date(dosStart)).format("YYYY-MM-DD HH:mm"),
      dosEnd: dayjs(new Date(dosEnd)).format("YYYY-MM-DD HH:mm"),
    };

    params.totalMileageReimbursement =
      params.mileageCost > params.mileageMaxReimbursement
        ? params.mileageMaxReimbursement
        : params.mileageCost;
    params.estimatedPayment = parseFloat(
      parseFloat(params.totalMileageReimbursement) +
        parseFloat(params.serviceRate)
    ).toFixed(2);
    params.approvedPayment = params.estimatedPayment;
    if (clientService?.toLowerCase() === "other") {
      params.service = otherService || "Other";
      params.serviceCd = "Other";
    } else {
      const serviceInfo = serviceList.find((f) => f.name === clientService);
      params.service = serviceInfo?.name || "";
      params.serviceCd = serviceInfo?.code || "";
    }
    params.patientCd = client;
    console.log("[Params]", params);
    props.createRoutesheet(params);
  };

  const refreshHandler = () => {
    isProcessDone = false;
    clearHandler();
  };
  const dateInputHandler = (name, value) => {
    if (name === "dos") {
      setDos(new Date(value));
    } else if (name === "dosStart") {
      setDosStart(new Date(value));
    } else if (name === "dosEnd") {
      setDosEnd(new Date(value));
    }
  };

  const timeInputHandler = (name, value) => {
    if (name === "timeIn") {
      setTimeIn(value);
    } else if (name === "timeOut") {
      setTimeOut(value);
    }
  };
  const isClientRequiredHandler = () => {
    if (!clientService) {
      return false;
    } else if (clientService?.toLowerCase() === "other") {
      return true;
    } else if (serviceList.find((s) => s.name === clientService)) {
      return serviceList.find((s) => s.name === clientService)
        ?.isClientRequired;
    }
  };
  if (
    isContractCollection &&
    props.contracts?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsContractCollection(false);
  }
  if (
    isAssignmentCollection &&
    props.assignmentState?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsAssignmentCollection(false);
  }
  if (
    isPatientCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsPatientCollection(false);
  }
  if (
    isRoutesheetCollection &&
    props.createRoutesheetState?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsRoutesheetCollection(false);
  }
  isProcessDone = isAssignmentDone && isContractDone && isPatientDone;

  const handleSimple = (event) => {
    setSimpleSelect(event.target.value);
  };

  return (
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
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <AssignmentIndOutlined />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Service Route Sheet</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                sm={6}
                md={clientService?.toLowerCase() === "other" ? 4 : 6}
                lg={clientService?.toLowerCase() === "other" ? 4 : 6}
              >
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel
                    htmlFor="client-service"
                    className={classes.selectLabel}
                  >
                    Select Service
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
                      name: "clientService",
                      id: "client-service",
                    }}
                    value={clientService}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Service
                    </MenuItem>
                    {serviceList.map((item, index) => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        key={index}
                        value={item.name}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>

              {clientService === "Other" && (
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <FormControl fullWidth>
                    <CustomInput
                      id="otherService"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        placeholder: "other service here",
                        name: "otherService",
                        onChange: (event) => {
                          inputHandler(event);
                        },
                        value: otherService,
                      }}
                    />
                  </FormControl>
                  {otherServiceError.isError && (
                    <SnackbarContent
                      message={otherServiceError.message}
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  )}
                </GridItem>
              )}

              <GridItem
                xs={12}
                sm={12}
                md={clientService?.toLowerCase() === "other" ? 4 : 6}
                lg={clientService?.toLowerCase() === "other" ? 4 : 6}
                style={{ display: isClientRequiredHandler() ? "" : "none" }}
              >
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
                    {clientError.isError && (
                      <SnackbarContent
                        message={clientError.message}
                        color="rose"
                        close
                        icon={AddAlertOutlined}
                      />
                    )}
                  </div>
                  {clients?.length === 0 &&
                    isProcessDone &&
                    isClientRequiredHandler() && (
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <div
                          align="left"
                          style={{ paddingLeft: 16, paddingTop: 5 }}
                        >
                          <Typography variant="h6">
                            No client has been assigned to your service. Please
                            contact the administrator to request an assignment.
                          </Typography>
                        </div>
                      </div>
                    )}
                  {/* Right side: Clear Icon */}
                  {client && (
                    <div style={{ flex: "0 0 5%", textAlign: "right" }}>
                      <Tooltip title="View Client Information">
                        <Button
                          justIcon
                          round
                          color="twitter"
                          onClick={() => setNoticeModal(true)}
                        >
                          <i className={"fas fa-info"} />
                        </Button>
                      </Tooltip>
                      <Dialog
                        classes={{
                          paper: classes2.modal,
                        }}
                        open={noticeModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setNoticeModal(false)}
                        aria-labelledby="notice-modal-slide-title"
                        aria-describedby="notice-modal-slide-description"
                      >
                        <DialogTitle
                          id="notice-modal-slide-title"
                          disableTypography
                          className={classes2.modalHeader}
                        >
                          <Button
                            justIcon
                            className={classes2.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="transparent"
                            onClick={() => setNoticeModal(false)}
                          >
                            <Close className={classes2.modalClose} />
                          </Button>
                          <div align="center">
                            <h4 className={classes2.modalTitle}>{client}</h4>
                          </div>
                        </DialogTitle>
                        <DialogContent id="notice-modal-slide-description">
                          <Card>
                            <CardBody>
                              <NavPills
                                color="warning"
                                tabs={[
                                  {
                                    tabButton: "Client Info",
                                    tabContent: (
                                      <span>
                                        <p>
                                          <strong>Address :</strong>
                                          {patientInfo?.address ||
                                            "Call Agency"}
                                        </p>

                                        <p>
                                          <strong>Contact Person :</strong>
                                          {patientInfo?.contactPerson ||
                                            "Call Agency"}
                                        </p>

                                        <p>
                                          <strong>Contact Number :</strong>
                                          {patientInfo?.contactNumber ||
                                            "Call Agency"}
                                        </p>
                                      </span>
                                    ),
                                  },
                                  {
                                    tabButton: "Service Info",
                                    tabContent: (
                                      <span>
                                        <p>
                                          <strong>Visit Frequency: </strong>
                                          {clientInformationFrequencyHandler()}
                                        </p>

                                        <p>
                                          <strong>Day/Time :</strong>
                                          {clientInformationDayHandler()}
                                        </p>
                                      </span>
                                    ),
                                  },
                                  {
                                    tabButton: "Contracted Rate",
                                    tabContent: (
                                      <span>
                                        <p>
                                          <strong>Service Rate: </strong>
                                          {contractRate?.serviceRate
                                            ? `$${contractRate?.serviceRate}/${
                                                contractRate?.serviceRateType ||
                                                ""
                                              }`
                                            : "Call Agency"}
                                        </p>
                                        <p>
                                          <strong>Mileage Rate: </strong>
                                          {`$${contractRate?.mileageRate}/mile`}
                                        </p>
                                      </span>
                                    ),
                                  },
                                ]}
                              />
                            </CardBody>
                          </Card>
                        </DialogContent>
                        <DialogActions
                          className={
                            classes2.modalFooter +
                            " " +
                            classes2.modalFooterCenter
                          }
                        >
                          <Button
                            onClick={() => setNoticeModal(false)}
                            color="info"
                            round
                          >
                            Sounds Good
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  )}
                </div>
              </GridItem>
            </GridContainer>
            {clientService && (
              <GridItem xs={12} sm={12} md={12}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="success" icon>
                        <CardIcon color="success">
                          <EventOutlined />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>
                          Date of Service
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            <h4>Time In</h4>
                            <FormControl fullWidth>
                              <Datetime
                                inputProps={{
                                  placeholder: "Date Here",
                                  name: "dosStart",
                                }}
                                value={dosStart || dayjs(new Date())}
                                onChange={(e) =>
                                  dateInputHandler("dosStart", e)
                                }
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <h4>Time Out</h4>
                            <FormControl fullWidth>
                              <Datetime
                                inputProps={{
                                  placeholder: "Date Here",
                                  name: "dosEnd",
                                }}
                                value={dosEnd || dayjs(new Date())}
                                onChange={(e) => dateInputHandler("dosEnd", e)}
                              />
                            </FormControl>
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </GridItem>
            )}
            {/*clientService && (
              <GridItem xs={12} sm={12} md={12}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Card>
                      <CardHeader color="success" icon>
                        <CardIcon color="success">
                          <EventOutlined />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>
                          Date of Service Time In
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <FormControl fullWidth>
                          <Datetime
                            timeFormat={false}
                            inputProps={{
                              placeholder: "Date Here",
                              name: "dos",
                            }}
                            value={dos || dayjs(new Date())}
                            onChange={(e) => dateInputHandler("dos", e)}
                          />
                        </FormControl>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Card>
                      <CardHeader color="success" icon>
                        <CardIcon color="success">
                          <AvTimer />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Time In</h4>
                      </CardHeader>
                      <CardBody>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={false}
                            inputProps={{
                              placeholder: "Time In here",
                              name: "timeIn",
                            }}
                            value={timeIn || dayjs(new Date())}
                            onChange={(e) => timeInputHandler("timeIn", e)}
                          />
                        </FormControl>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Card>
                      <CardHeader color="success" icon>
                        <CardIcon color="success">
                          <AvTimer />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Time Out</h4>
                      </CardHeader>
                      <CardBody>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={false}
                            inputProps={{
                              placeholder: "Time Out Here",
                              name: "timeOut",
                            }}
                            value={timeOut || dayjs(new Date())}
                            onChange={(e) => timeInputHandler("timeOut", e)}
                          />
                        </FormControl>
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </GridItem>
                          )*/}
            <GridContainer>
              {isMileageRate && (
                <GridItem xs={12} sm={12} md={4}>
                  <Card>
                    <CardHeader color="danger" icon>
                      <CardIcon color="danger">
                        <DriveEta />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Log Mileage</h4>
                    </CardHeader>
                    <CardBody>
                      <FormControl fullWidth>
                        <CustomInput
                          id="mileage"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          onChange={inputHandler}
                          inputProps={{
                            placeholder: "mileage here",
                            name: "mileage",
                            onChange: (event) => {
                              inputHandler(event);
                            },
                            type: "number",
                            value: mileage,
                          }}
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {clientService && (
                <GridItem xs={12} sm={12} md={isMileageRate ? 4 : 6}>
                  <Card>
                    <CardHeader color="warning" icon>
                      <CardIcon color="warning">
                        <NotesOutlined />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Notes</h4>
                    </CardHeader>
                    <CardBody>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={4}
                        rows={4}
                        value={notes}
                        placeholder="notes here"
                        name={"notes"}
                        style={{ width: "100%", border: 0 }}
                        className="form-control"
                        onKeyPress={(ev) => {
                          if (ev.key === "Enter") {
                            // Do code here
                            ev.preventDefault();
                          }
                        }}
                        onChange={inputHandler}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {clientService && (
                <GridItem xs={12} sm={12} md={isMileageRate ? 4 : 6}>
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
              {clientService && (
                <GridItem xs={12} sm={12} md={5}>
                  <Button
                    color="primary"
                    round
                    className={classes.marginRight}
                    onClick={() => saveHandler()}
                  >
                    <Favorite className={classes.icons} /> Submit
                  </Button>
                </GridItem>
              )}
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
const mapStateToProps = (store) => ({
  createRoutesheetState: routesheetCreateStateSelector(store),
  assignmentState: assignmentListStateSelector(store),
  contracts: contractListStateSelector(store),
  patients: patientListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  createRoutesheet: (data) => dispatch(attemptToCreateRoutesheet(data)),
  resetCreateRoutesheet: () => dispatch(resetCreateRoutesheetState()),
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignment: () => dispatch(resetFetchAssignmentState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Routesheet);

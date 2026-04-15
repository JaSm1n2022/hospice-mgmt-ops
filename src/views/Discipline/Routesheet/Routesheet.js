import React, { useContext, useEffect, useRef, useState } from "react";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
// react component plugin for creating beatiful tags on an input

// plugin that creates slider

// @material-ui/core components
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";

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
import {
  TextareaAutosize,
  Tooltip,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
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
  const [clientService, setClientService] = useState("Regular Visit"); // Default to Regular Visit
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
  const [serviceDate, setServiceDate] = useState(dayjs(new Date()));
  const [dosStart, setDosStart] = useState(
    dayjs(new Date()).format("YYYY-MM-DD HH:mm")
  );
  const [dosEnd, setDosEnd] = useState(
    dayjs(new Date()).add(1, "hour").format("YYYY-MM-DD HH:mm")
  );
  const [timeIn, setTimeIn] = useState(dayjs(new Date()));
  const [timeOut, setTimeOut] = useState(dayjs(new Date()).add(45, "minute"));
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
  const [signatureModal, setSignatureModal] = useState(false);
  const [signatureMode, setSignatureMode] = useState("draw"); // "draw" or "type"
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState("Dancing Script");
  const [signaturePreview, setSignaturePreview] = useState(null);
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
        if (e.disciplineId === context.employeeProfile.id) {
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
        const selectedClient = uniqueList[0];
        setClient(selectedClient); // Auto-select if only one client

        // Trigger contract lookup for auto-selected client
        let m = contractList.find(
          (c) =>
            c.serviceType?.toLowerCase() === clientService?.toLowerCase() &&
            c.patientCd === selectedClient &&
            context.employeeProfile.id === c.employeeId
        );
        if (!m) {
          m = contractList.find(
            (c) =>
              c.serviceType?.toLowerCase() === clientService?.toLowerCase() &&
              context.employeeProfile.id === c.employeeId
          );
        }
        if (m) {
          setContractRate(m);
          if (m?.isMileageRate) {
            setIsMileageRate(m?.isMileageRate);
          } else {
            setIsMileageRate(false);
          }
        }

        // Set patient info for auto-selected client
        const assignPatient = assignmentList.find(
          (a) => a.patientCd === selectedClient && a.disciplinePosition === context.employeeProfile?.position
        );
        setPatientInfo(assignPatient?.patient);

        // Set Time In and Time Out based on IDT assignment
        if (assignPatient) {
          const assignedTime = assignPatient.timeOfVisit;
          if (assignedTime && assignedTime !== "Open") {
            const [hours, minutes] = assignedTime.split(":");
            const timeInValue = dayjs(new Date()).set("hour", parseInt(hours)).set("minute", parseInt(minutes));
            setTimeIn(timeInValue);
            setTimeOut(timeInValue.add(45, "minute"));
          }
        }
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
      // Navigate to dashboard after successful submission
      setTimeout(() => {
        props.history.push("/discipline-dashboard");
      }, 1000);
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
    setSignaturePreview(null);
    setTypedName("");
    setSignatureMode("draw");
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
    const cls = assignmentList.find(
      (a) =>
        a.patientCd === client && a.disciplineId === context.employeeProfile.id
    );
    return cls ? `${cls.frequencyVisit}x/${cls.visitType}` : "";
  };
  const clientInformationDayHandler = () => {
    const cls = assignmentList.find(
      (a) =>
        a.patientCd === client && a.disciplineId === context.employeeProfile.id
    );
    return cls ? `${cls.dayOfTheWeek} - ${cls.timeOfVisit}` : "";
    /*
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
    */
  };
  const calculateDuration = () => {
    if (!timeIn || !timeOut) return "0h 0m";

    const start = dayjs(timeIn);
    const end = dayjs(timeOut);

    const diffMinutes = end.diff(start, "minute");
    if (diffMinutes < 0) return "0h 0m";

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const clearHandler = () => {
    //clear
    // Auto-select client if only one available
    if (clients?.length === 1) {
      setClient(clients[0]);
    } else {
      setClient("");
    }

    setIsMileageRate(false);
    setMileage(0);
    setClientService("Regular Visit"); // Reset to Regular Visit default
    setNotes("");
    sigCanvas.current?.clear();
    setSignaturePreview(null);
    setTypedName("");
    setSignatureMode("draw");
    isSigned = false;
    setDos(dayjs(new Date()));
    setServiceDate(dayjs(new Date()));
    setTimeIn(dayjs(new Date()));
    setTimeOut(dayjs(new Date()).add(45, "minute"));
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
      console.log("[CLIENT]", clientService, contractList, target.value);
      let m = contractList.find(
        (c) =>
          c.serviceType?.toLowerCase() === clientService?.toLocaleLowerCase() &&
          c.patientCd === target.value &&
          context.employeeProfile.id === c.employeeId
      );
      console.log("[CONTRACT LIST]", m);
      if (!m) {
        m = contractList.find(
          (c) =>
            c.serviceType?.toLowerCase() === clientService?.toLowerCase() &&
            context.employeeProfile.id === c.employeeId
        );
        console.log("[CONTRACT LIST2]", m);
      }
      if (m) {
        setContractRate(m);
        if (m?.isMileageRate) {
          setIsMileageRate(m?.isMileageRate);
        } else {
          setIsMileageRate(false);
        }
      }
      const assignPatient = assignmentList.find(
        (a) => a.patientCd === target.value && a.disciplinePosition === context.employeeProfile?.position
      );

      setPatientInfo(assignPatient?.patient);

      // Set Time In and Time Out based on IDT assignment
      if (assignPatient) {
        const assignedTime = assignPatient.timeOfVisit;

        // Only set time if assignment has a specific time (not "Open" and not empty)
        if (assignedTime && assignedTime !== "Open") {
          const [hours, minutes] = assignedTime.split(":");
          const timeInValue = dayjs(new Date()).set("hour", parseInt(hours)).set("minute", parseInt(minutes));
          setTimeIn(timeInValue);
          setTimeOut(timeInValue.add(45, "minute"));
        }
      }

      setClient(target.value);
    } else if (target.name === "clientService") {
      console.log(
        "[CLIENT]",
        clientService,
        contractList,
        target.value,
        context.employeeProfile.id
      );

      setClientError({ isError: false, message: "" });
      setOtherServiceError({ isError: false, message: "" });
      if (target.value === "Attendance") {
        setTimeIn(dayjs(new Date()).set("hour", 8).set("minute", 0));
        setTimeOut(dayjs(new Date()).set("hour", 17).set("minute", 0));
      }

      let m = contractList.find(
        (c) =>
          c.serviceType?.toLowerCase() === target.value?.toLowerCase() &&
          context.employeeProfile.id === c.employeeId
      );
      console.log(
        "[CLIENT2]",
        m,
        context.employeeProfile.id,
        clientService,
        contractList,
        target.value
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

  const handleSignatureConfirm = () => {
    if (signatureMode === "draw") {
      const signImg = sigCanvas.current?.getCanvas().toDataURL("image/png");
      setSignaturePreview(signImg);
      isSigned = true;
    } else if (signatureMode === "type" && typedName.trim()) {
      // Create canvas with typed signature
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      // Set background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text style
      ctx.fillStyle = "green";
      ctx.font = `48px '${selectedFont}', cursive`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

      const signImg = canvas.toDataURL("image/png");
      setSignaturePreview(signImg);
      isSigned = true;
    }
    setSignatureModal(false);
    setSignatureError({ isError: false, message: "" });
  };

  const handleSignatureModalOpen = () => {
    setSignatureModal(true);
  };

  const saveHandler = () => {
    const signImg =
      signaturePreview || sigCanvas.current?.getCanvas().toDataURL("image/png");
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

    // Combine serviceDate with timeIn and timeOut
    const dateStr = dayjs(serviceDate).format("YYYY-MM-DD");
    const timeInStr = dayjs(timeIn).format("HH:mm");
    const timeOutStr = dayjs(timeOut).format("HH:mm");

    const combinedDosStart = `${dateStr} ${timeInStr}`;
    const combinedDosEnd = `${dateStr} ${timeOutStr}`;

    // Get the day of the week from serviceDate
    const dayOfWeek = dayjs(serviceDate).format("ddd"); // Returns Mon, Tue, Wed, etc.

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
      dosStart: combinedDosStart,
      dosEnd: combinedDosEnd,
      day: dayOfWeek,
    };

    params.totalMileageReimbursement =
      params.mileageCost > params.mileageMaxReimbursement
        ? params.mileageMaxReimbursement
        : params.mileageCost;

    // Add serviceRateType to params
    params.serviceRateType = contractRate?.serviceRateType || "";

    // Calculate service payment based on rate type
    let servicePayment = parseFloat(params.serviceRate) || 0;

    console.log("[DISCIPLINE RATE CALCULATION DEBUG]", {
      serviceRateType: params.serviceRateType,
      serviceRate: params.serviceRate,
      dosStart: combinedDosStart,
      dosEnd: combinedDosEnd,
    });

    // If hourly rate, calculate based on duration
    if (params.serviceRateType?.toLowerCase() === "hourly") {
      const dosStartMoment = dayjs(combinedDosStart, "YYYY-MM-DD HH:mm");
      const dosEndMoment = dayjs(combinedDosEnd, "YYYY-MM-DD HH:mm");
      const durationMinutes = dosEndMoment.diff(dosStartMoment, "minutes");
      const durationHours = durationMinutes / 60;
      servicePayment = durationHours * (parseFloat(params.serviceRate) || 0);

      console.log("[DISCIPLINE HOURLY RATE CALCULATION]", {
        durationMinutes,
        durationHours,
        hourlyRate: params.serviceRate,
        servicePayment,
      });
    }

    params.estimatedPayment = parseFloat(
      parseFloat(params.totalMileageReimbursement) + servicePayment
    ).toFixed(2);
    params.approvedPayment = params.estimatedPayment;

    console.log("[DISCIPLINE FINAL ESTIMATED PAYMENT]", {
      totalMileageReimbursement: params.totalMileageReimbursement,
      servicePayment,
      estimatedPayment: params.estimatedPayment,
    });
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
    } else if (name === "serviceDate") {
      setServiceDate(dayjs(value));
    } else if (name === "dosStart") {
      setDosStart(new Date(value));
    } else if (name === "dosEnd") {
      setDosEnd(new Date(value));
    }
  };

  const timeInputHandler = (name, value) => {
    if (name === "timeIn") {
      const newTimeIn = dayjs(value);
      setTimeIn(newTimeIn);
      // Automatically adjust timeOut to be 45 minutes after timeIn
      setTimeOut(newTimeIn.add(45, "minute"));
    } else if (name === "timeOut") {
      setTimeOut(dayjs(value));
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
                        scroll="paper"
                        maxWidth="md"
                        fullWidth
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
                                      <div style={{ padding: "10px" }}>
                                        <div
                                          style={{
                                            marginBottom: "12px",
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #00acc1",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Address
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "14px",
                                              color: "#333",
                                            }}
                                          >
                                            {patientInfo?.address ||
                                              "Call Agency"}
                                          </p>
                                        </div>

                                        <div
                                          style={{
                                            marginBottom: "12px",
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #00acc1",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Contact Person
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "14px",
                                              color: "#333",
                                            }}
                                          >
                                            {patientInfo?.contactPerson ||
                                              "Call Agency"}
                                          </p>
                                        </div>

                                        <div
                                          style={{
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #00acc1",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Contact Number
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "14px",
                                              color: "#333",
                                            }}
                                          >
                                            {patientInfo?.contactNumber ||
                                              "Call Agency"}
                                          </p>
                                        </div>
                                      </div>
                                    ),
                                  },
                                  {
                                    tabButton: "Service Info",
                                    tabContent: (
                                      <div style={{ padding: "10px" }}>
                                        <div
                                          style={{
                                            marginBottom: "12px",
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #4caf50",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Visit Frequency
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "14px",
                                              color: "#333",
                                            }}
                                          >
                                            {clientInformationFrequencyHandler()}
                                          </p>
                                        </div>

                                        <div
                                          style={{
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #4caf50",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Day/Time
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "14px",
                                              color: "#333",
                                            }}
                                          >
                                            {clientInformationDayHandler()}
                                          </p>
                                        </div>
                                      </div>
                                    ),
                                  },
                                  {
                                    tabButton: "Contracted Rate",
                                    tabContent: (
                                      <div style={{ padding: "10px" }}>
                                        <div
                                          style={{
                                            marginBottom: "15px",
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #ff9800",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Service Rate
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "18px",
                                              fontWeight: "bold",
                                              color: "#333",
                                            }}
                                          >
                                            {contractRate?.serviceRate
                                              ? `$${
                                                  contractRate?.serviceRate
                                                }/${
                                                  contractRate?.serviceRateType ||
                                                  "hr"
                                                }`
                                              : "Call Agency"}
                                          </p>
                                        </div>

                                        <div
                                          style={{
                                            padding: "12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #ff9800",
                                          }}
                                        >
                                          <p
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "12px",
                                              color: "#666",
                                            }}
                                          >
                                            Mileage Rate
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "18px",
                                              fontWeight: "bold",
                                              color: "#333",
                                            }}
                                          >
                                            {contractRate?.mileageRate
                                              ? `$${contractRate?.mileageRate}/mile`
                                              : "Not Applicable"}
                                          </p>
                                        </div>
                                      </div>
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

              {clients?.length === 0 &&
                isProcessDone &&
                isClientRequiredHandler() && (
                  <GridItem>
                    <SnackbarContent
                      message={
                        "No client has been assigned to your service. Please contact the administrator to request an assignment."
                      }
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  </GridItem>
                )}
            </GridContainer>
            {clientService && (!isClientRequiredHandler() || client) && (
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
                          <GridItem xs={12} sm={6} md={3}>
                            <h4>Date</h4>
                            <FormControl fullWidth>
                              <Datetime
                                timeFormat={false}
                                inputProps={{
                                  placeholder: "YYYY-MM-DD",
                                  name: "serviceDate",
                                }}
                                value={
                                  serviceDate
                                    ? serviceDate.toDate()
                                    : new Date()
                                }
                                onChange={(e) =>
                                  dateInputHandler("serviceDate", e)
                                }
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3}>
                            <h4>Time In</h4>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={false}
                                timeFormat="hh:mm A"
                                inputProps={{
                                  placeholder: "HH:mm A",
                                  name: "timeIn",
                                }}
                                value={timeIn ? timeIn.toDate() : new Date()}
                                onChange={(e) => timeInputHandler("timeIn", e)}
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3}>
                            <h4>Time Out</h4>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={false}
                                timeFormat="hh:mm A"
                                inputProps={{
                                  placeholder: "HH:mm A",
                                  name: "timeOut",
                                }}
                                value={timeOut ? timeOut.toDate() : new Date()}
                                onChange={(e) => timeInputHandler("timeOut", e)}
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3}>
                            <h4>Duration</h4>
                            <Typography
                              variant="h6"
                              style={{
                                color: "#1976d2",
                                fontWeight: "bold",
                                marginTop: "8px",
                              }}
                            >
                              {calculateDuration()}
                            </Typography>
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
              {isMileageRate &&
                clientService &&
                (!isClientRequiredHandler() || client) && (
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
              {clientService && (!isClientRequiredHandler() || client) && (
                <GridItem xs={12} sm={12} md={isMileageRate ? 4 : 6}>
                  <Card>
                    <CardHeader color="warning" icon>
                      <CardIcon color="warning">
                        <NotesOutlined />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Comments</h4>
                    </CardHeader>
                    <CardBody>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={4}
                        rows={4}
                        value={notes}
                        placeholder="comments here"
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
              {clientService && (!isClientRequiredHandler() || client) && (
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
                        {signaturePreview && (
                          <Tooltip title="Clear Signature">
                            <ClearOutlined
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={clearSignatureHandler}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </CardHeader>
                    <CardBody>
                      {!signaturePreview ? (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <Button
                            color="info"
                            round
                            onClick={handleSignatureModalOpen}
                          >
                            <Gesture className={classes.icons} /> Sign Here
                          </Button>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <img
                            src={signaturePreview}
                            alt="Signature"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      )}
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
              {clientService && (!isClientRequiredHandler() || client) && (
                <GridItem xs={12} sm={12} md={5}>
                  <Button
                    color="primary"
                    round
                    className={classes.marginRight}
                    onClick={() => saveHandler()}
                    disabled={props.createRoutesheetState?.status === ACTION_STATUSES.PENDING}
                  >
                    {props.createRoutesheetState?.status === ACTION_STATUSES.PENDING ? (
                      <>
                        <CircularProgress size={20} style={{ color: "white", marginRight: 8 }} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Favorite className={classes.icons} /> Submit
                      </>
                    )}
                  </Button>
                </GridItem>
              )}
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

      {/* Signature Modal */}
      <Dialog
        classes={{
          paper: classes2.modal,
        }}
        open={signatureModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setSignatureModal(false)}
        scroll="paper"
        maxWidth="md"
        fullWidth
        aria-labelledby="signature-modal-title"
      >
        <DialogTitle
          id="signature-modal-title"
          disableTypography
          className={classes2.modalHeader}
        >
          <Button
            justIcon
            className={classes2.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => setSignatureModal(false)}
          >
            <Close className={classes2.modalClose} />
          </Button>
          <div align="center">
            <h4 className={classes2.modalTitle}>Add Your Signature</h4>
          </div>
        </DialogTitle>
        <DialogContent id="signature-modal-content">
          <Card>
            <CardBody>
              {/* Radio buttons for Draw/Type selection */}
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <RadioGroup
                  row
                  value={signatureMode}
                  onChange={(e) => setSignatureMode(e.target.value)}
                  style={{ justifyContent: "center" }}
                >
                  <FormControlLabel
                    value="draw"
                    control={<Radio color="primary" />}
                    label="Draw Signature"
                  />
                  <FormControlLabel
                    value="type"
                    control={<Radio color="primary" />}
                    label="Type Signature"
                  />
                </RadioGroup>
              </div>

              {/* Draw Mode */}
              {signatureMode === "draw" && (
                <div>
                  <div
                    style={{
                      marginBottom: "10px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <p>Draw your signature below using your mouse or finger</p>
                  </div>
                  <div
                    style={{
                      border: "2px solid #00acc1",
                      borderRadius: "8px",
                      padding: "15px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <ReactSignatureCanvas
                      penColor="green"
                      onBegin={(e) => onBeginHandler(e)}
                      ref={(ref) => {
                        sigCanvas.current = ref;
                      }}
                      canvasProps={{
                        height: window.innerWidth <= 768 ? 300 : 200,
                        className: "sigCanvas",
                        style: {
                          width: "100%",
                          border: "1px dashed #ccc",
                          backgroundColor: "white",
                          borderRadius: "4px",
                        },
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <Button
                      color="rose"
                      simple
                      onClick={() => sigCanvas.current?.clear()}
                    >
                      Clear Canvas
                    </Button>
                  </div>
                </div>
              )}

              {/* Type Mode */}
              {signatureMode === "type" && (
                <div>
                  <div
                    style={{
                      marginBottom: "20px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <p>Type your name and select a signature style</p>
                  </div>
                  <TextField
                    fullWidth
                    label="Type your name"
                    variant="outlined"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    style={{ marginBottom: "20px" }}
                  />

                  <div style={{ marginBottom: "10px" }}>
                    <Typography
                      variant="subtitle2"
                      style={{ marginBottom: "10px" }}
                    >
                      Select signature style:
                    </Typography>
                    <RadioGroup
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                    >
                      <FormControlLabel
                        value="Dancing Script"
                        control={<Radio color="primary" />}
                        label={
                          <span
                            style={{
                              fontFamily: "'Dancing Script', cursive",
                              fontSize: "24px",
                            }}
                          >
                            {typedName || "Dancing Script"}
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="Great Vibes"
                        control={<Radio color="primary" />}
                        label={
                          <span
                            style={{
                              fontFamily: "'Great Vibes', cursive",
                              fontSize: "24px",
                            }}
                          >
                            {typedName || "Great Vibes"}
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="Pacifico"
                        control={<Radio color="primary" />}
                        label={
                          <span
                            style={{
                              fontFamily: "'Pacifico', cursive",
                              fontSize: "24px",
                            }}
                          >
                            {typedName || "Pacifico"}
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="Satisfy"
                        control={<Radio color="primary" />}
                        label={
                          <span
                            style={{
                              fontFamily: "'Satisfy', cursive",
                              fontSize: "24px",
                            }}
                          >
                            {typedName || "Satisfy"}
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="Allura"
                        control={<Radio color="primary" />}
                        label={
                          <span
                            style={{
                              fontFamily: "'Allura', cursive",
                              fontSize: "24px",
                            }}
                          >
                            {typedName || "Allura"}
                          </span>
                        }
                      />
                    </RadioGroup>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </DialogContent>
        <DialogActions
          className={classes2.modalFooter + " " + classes2.modalFooterCenter}
        >
          <Button onClick={() => setSignatureModal(false)} color="rose" simple>
            Cancel
          </Button>
          <Button
            onClick={handleSignatureConfirm}
            color="success"
            round
            disabled={signatureMode === "type" && !typedName.trim()}
          >
            Confirm Signature
          </Button>
        </DialogActions>
      </Dialog>
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

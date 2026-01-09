import React, { useEffect, useState, useRef } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Avatar,
  Button,
  Card,
  Grid,
  Modal,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import { v4 as uuidv4 } from "uuid";
import HeaderModal from "components/Modal/HeaderModal";
import { useTheme } from "@material-ui/core";
import CustomMultipleAutoComplete from "components/AutoComplete/CustomMultipleAutoComplete";
import { DAY_OF_WEEK } from "utils/constants";
import { SERVICE_TYPE } from "utils/constants";
import CustomTimePicker from "components/Time/CustomTimePicker";
import Delete from "@material-ui/icons/Delete";
import { Add, DeleteOutline, Money } from "@material-ui/icons";
import moment from "moment";
import dayjs from "dayjs";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import TOAST from "modules/toastManager";
import SortUtil from "utils/sortUtil";
import { CLIENT_SERVICES } from "utils/constants";
import { setSeconds } from "date-fns";
import ReactSignatureCanvas from "react-signature-canvas";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
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

let categoryList = [];
let uoms = [];
QUANTITY_UOM.forEach((item, index) => {
  uoms.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "uom",
  });
});
SUPPLY_CATEGORY.forEach((item, index) => {
  categoryList.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "category",
  });
});
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;
  const right = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  padding0: {
    padding: 0,
  },
  media: {
    height: 200,
  },
  paper: {
    position: "absolute",
    minWidth: "80%",
    maxWidth: "100%",
    minHeight: "50%",
    maxHeight: "100%",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));
let serviceList = [];
let currentContract = undefined;
let isSigned = false;
function RoutesheetForm(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [employee, setEmployee] = useState(DEFAULT_ITEM);
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [clientService, setClientService] = useState(DEFAULT_ITEM);
  const [modalStyle] = React.useState(getModalStyle);
  const [isRefresh, setIsRefresh] = useState(false);
  const [mileage, setMileage] = useState(0);
  const [totalMileageReimbursement, setTotalMileageReimbursement] = useState(0);
  const [notes, setNotes] = useState("");
  const [otherService, setOtherService] = useState("");
  const [isMileageRate, setIsMileageRate] = useState(false);
  const [contractRate, setContractRate] = useState(0);
  const [approvedPayment, setApprovedPayment] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [comments, setComments] = useState("");
  const sigCanvas = useRef();
  const [dosStartDate, setDosStartDate] = useState(new Date());
  const [dosStartTime, setDosStartTime] = useState(
    dayjs(new Date()).format("HH:mm")
  );
  const [dosEndDate, setDosEndDate] = useState(new Date());
  const [dosEndTime, setDosEndTime] = useState(
    dayjs(new Date()).add(1, "hour").format("HH:mm")
  );
  const [clientError, setClientError] = useState({
    isError: false,
    message: "",
  });
  const [signatureError, setSignatureError] = useState({
    isError: false,
    message: "",
  });
  const [otherServiceError, setOtherServiceError] = useState({
    isError: false,
    message: "",
  });
  const [serviceError, setServiceError] = useState({
    isError: false,
    message: "",
  });
  const [employeeError, setEmployeeError] = useState({
    isError: false,
    message: "",
  });
  const { isOpen } = props;

  useEffect(() => {
    console.log("[props.patientList]", props.patientList);
    let tempUsers = [];
    if (props.employeeList) {
      tempUsers = [...props.employeeList];
      tempUsers.forEach((c) => {
        c.value = c.name;
        c.label = c.name;
        c.uuid = uuidv4();
        c.category = "user";
      });
      const cs = [];
      CLIENT_SERVICES.forEach((c) => {
        c.label = c.name;
        c.value = c.name;
        c.description = c.name;
        c.category = "service";
        cs.push(c);
      });
      serviceList = SortUtil.sortByAsc(cs, "name", false);
      setUsers(tempUsers);
    }
  }, [props.employeeList, props.item]);

  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Routesheet";
    } else if (props.mode === "edit") {
      return "Edit Routesheet";
    } else {
      return "Create Routesheet";
    }
  };
  const clearModalHandler = () => {
    props.closeFormModalHandler();
  };

  const autoCompleteGeneralHander = (item) => {
    if (item.category === "service") {
      setClientService(item);
      setServiceError({ isError: false, message: "" });
      setContractRateHandler(patient?.name, item);
      setOtherServiceError({ isError: false, message: "" });
    } else if (item.category === "user") {
      setEmployee(item);
      setEmployeeError({ isError: false, message: "" });
    } else if (item.category === "patient") {
      setPatient(item);
      setClientError({ isError: false, message: "" });
    }
  };
  const approvedPaymentHandler = (mileage, rate) => {
    const mileageMaxReimbursement = currentContract?.maxReimbursement || 0;
    const mileageCost = currentContract?.mileageRate
      ? parseFloat(currentContract?.mileageRate * mileage)
      : 0;
    const calcMileage =
      mileageCost > mileageMaxReimbursement
        ? mileageMaxReimbursement
        : mileageCost;
    setTotalMileageReimbursement(calcMileage);

    setApprovedPayment(
      parseFloat(parseFloat(calcMileage) + parseFloat(rate)).toFixed(2)
    );
  };
  const inputHandler = ({ target }) => {
    console.log("[TARGET]", target.name);
    if (target.name === "employee" && !target.value) {
      setEmployee(DEFAULT_ITEM);
    }
    if (target.name === "isApprovedPayment") {
      setIsApproved(target.checked);
    }
    if (target.name === "clientService" && !target.value) {
      setClientService(DEFAULT_ITEM);
      setServiceError({ isError: true, message: "Service is required." });
    }
    if (target.name === "patient" && !target.value) {
      setPatient(DEFAULT_ITEM);
    }
    if (target.name === "rate") {
      setContractRate(target.value);
    }
    if (target.name === "approvedPayment") {
      console.log("[APPROVED PAYMENT]", target.value);
      setApprovedPayment(target.value);
    }
    if (target.name === "notes") {
      setNotes(target.value);
    }
    if (target.name === "comments") {
      setComments(target.value);
    }

    if (target.name === "otherService") {
      setOtherService(target.value);
      if (target.value) {
        setOtherServiceError({ isError: false, message: "" });
      } else {
        setOtherServiceError({
          isError: true,
          message: "Other service is required.",
        });
      }
    }
    if (target.name === "mileage") {
      setMileage(target.value);
      approvedPaymentHandler(target.value, contractRate);
    }
  };

  const setContractRateHandler = (patientCd, service) => {
    let m = props.contractList.find(
      (c) =>
        c.serviceType?.toLowerCase() === service?.name?.toLowerCase() &&
        c.patientCd === patientCd &&
        c.employeeId === employee.id
    );
    if (!m) {
      m = props.contractList.find(
        (c) =>
          c.serviceType?.toLowerCase() === service?.name?.toLowerCase() &&
          c.employeeId === employee.id
      );
    }
    console.log("[CONTRACT WITH PATIENT]", m);
    currentContract = m;
    setContractRate(m?.serviceRate, 0);
    if (m?.isMileageRate) {
      setIsMileageRate(m?.isMileageRate);
    } else {
      setIsMileageRate(false);
    }
    approvedPaymentHandler(mileage, m.serviceRate || 0);
  };

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

  const dateInputHandler = (value, name) => {
    if (name === "dosStartDate") {
      setDosStartDate(value);
    } else if (name === "dosEndDate") {
      setDosEndDate(value);
    }
  };

  const timeInputHandler = ({ target }) => {
    if (target.name === "dosStartTime") {
      setDosStartTime(target.value);
    } else if (target.name === "dosEndTime") {
      setDosEndTime(target.value);
    }
  };

  const isClientRequiredHandler = () => {
    if (!clientService?.name) {
      return false;
    } else if (clientService?.name?.toLowerCase() === "other") {
      return true;
    } else if (serviceList.find((s) => s.name === clientService?.name)) {
      return serviceList.find((s) => s.name === clientService?.name)
        ?.isClientRequired;
    }
  };

  const validateFormHandler = () => {
    const signImg = sigCanvas.current?.getCanvas().toDataURL("image/png");
    console.log(
      "[VALIDATE]",
      employee,
      clientService,
      patient,
      approvedPayment
    );

    setEmployeeError({ isError: false, message: "" });
    setClientError({ isError: false, message: "" });
    setSignatureError({ isError: false, message: "" });
    setOtherServiceError({ isError: false, message: "" });

    let isValid = true;

    if (!employee?.id) {
      setEmployeeError({ isError: true, message: "Employee is required." });
      isValid = false;
    }

    if (!clientService?.name) {
      setServiceError({ isError: true, message: "Service is required." });

      isValid = false;
    }

    if (isClientRequiredHandler() && !patient?.patientCd) {
      setClientError({ isError: true, message: "Client is required." });
      isValid = false;
    }

    if (!isSigned) {
      setSignatureError({ isError: true, message: "Signature is required." });
      isValid = false;
    }

    if (
      clientService &&
      clientService?.name?.toLowerCase() === "other" &&
      !otherService
    ) {
      setOtherServiceError({ isError: true, message: "Field is required." });
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Combine date and time
    const dosStartCombined = dayjs(dosStartDate)
      .hour(parseInt(dosStartTime.split(":")[0]))
      .minute(parseInt(dosStartTime.split(":")[1]));
    const dosEndCombined = dayjs(dosEndDate)
      .hour(parseInt(dosEndTime.split(":")[0]))
      .minute(parseInt(dosEndTime.split(":")[1]));

    const params = {
      created_at: new Date(),
      companyId: props.userProfile.companyId,
      updatedUser: {
        name: props.userProfile.name,
        userId: props.userProfile.id,
        date: new Date(),
      },
      createdUser: {
        name: props.userProfile.name,
        userId: props.userProfile.id,
        date: new Date(),
      },
      signature_based: signImg,
      timeIn: dosStartTime,
      timeOut: dosEndTime,
      requestor: employee.name,
      requestorId: employee.id,
      requestorTitle: employee.position,
      mileage: mileage || 0,
      isMileageRate: isMileageRate || false,
      serviceRate: contractRate || 0,
      comments: comments,
      approvedPayment: approvedPayment || contractRate,
      serviceRateType: currentContract?.serviceRateType || "",
      serviceNotes: notes || "",
      mileageRate: currentContract.mileageRate || 0,
      mileageMaxReimbursement: currentContract?.maxReimbursement || 0,
      mileageCost: mileage * currentContract?.mileageRate || 0,
      totalMileageReimbursement: totalMileageReimbursement,
      dosStart: dosStartCombined.format("YYYY-MM-DD HH:mm"),
      dosEnd: dosEndCombined.format("YYYY-MM-DD HH:mm"),
      dos: dayjs(dosStartDate).format("YYYY-MM-DD"),
      status: isApproved ? "Approved" : "For Review",
    };

    params.totalMileageReimbursement =
      params.mileageCost > params.mileageMaxReimbursement
        ? params.mileageMaxReimbursement
        : params.mileageCost;
    params.estimatedPayment = parseFloat(
      parseFloat(params.totalMileageReimbursement) +
        parseFloat(params.serviceRate)
    ).toFixed(2);

    if (clientService?.name?.toLowerCase() === "other") {
      params.service = otherService || "Other";
      params.serviceCd = "Other";
    } else {
      const serviceInfo = serviceList.find(
        (f) => f.name === clientService?.name
      );
      params.service = serviceInfo?.name || "";
      params.serviceCd = serviceInfo?.code || "";
    }
    params.patientCd = patient?.patientCd || "";

    console.log("[PARAMS]", params);
    props.createRoutesheetHandler([params], props.mode || "create");
  };

  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="routesheet"
      aria-describedby="routesheetmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={titleHandler()} onClose={clearModalHandler} />
        <Grid xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              <Grid
                container
                spacing={2}
                direction="row"
                style={{ paddingBottom: 10 }}
              >
                <Grid item xs={12} md={3} sm={12}>
                  <CustomSingleAutoComplete
                    name={"employee"}
                    label="Select Employee"
                    placeholder="Select Employee"
                    options={users || [DEFAULT_ITEM]}
                    value={employee}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                  />
                  {employeeError.isError && (
                    <SnackbarContent
                      message={employeeError.message}
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={3} sm={12}>
                  <CustomSingleAutoComplete
                    name={"clientService"}
                    label="Select Service"
                    placeholder="Select Service"
                    options={serviceList || [DEFAULT_ITEM]}
                    value={clientService}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                    disabled={!employee.name}
                  />
                  {serviceError.isError && (
                    <SnackbarContent
                      message={serviceError.message}
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  )}
                </Grid>

                {clientService === "Other" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <CustomTextField
                      name="otherService"
                      placeholder="Other service here"
                      label="Other Service"
                      onChange={inputHandler}
                      value={otherService}
                    />
                    {otherServiceError.isError && (
                      <SnackbarContent
                        message={otherServiceError.message}
                        color="rose"
                        close
                        icon={AddAlertOutlined}
                      />
                    )}
                  </Grid>
                )}

                <Grid
                  item
                  xs={12}
                  md={3}
                  sm={12}
                  style={{
                    display: isClientRequiredHandler() ? "" : "none",
                  }}
                >
                  <CustomSingleAutoComplete
                    name={"patient"}
                    label="Select Client"
                    placeholder="Select Client"
                    options={(props.patientList || []).map((item) => ({
                      value: item.patientCd,
                      name: item.patientCd,
                      label: item.patientCd,
                      category: "patient",
                      id: item.patientCd,
                      patientCd: item.patientCd,
                      description: item.patientCd,
                    }))}
                    value={patient}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                    disabled={!clientService?.name}
                  />

                  {clientError.isError && (
                    <SnackbarContent
                      message={clientError.message}
                      color="rose"
                      close
                      icon={AddAlertOutlined}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={3} sm={12}>
                  <CustomTextField
                    name={"rate"}
                    type="number"
                    label="Contract Rate"
                    placeholder="Contract Rate"
                    value={contractRate}
                    onChange={inputHandler}
                  />
                </Grid>
              </Grid>

              {clientService && (
                <Grid container spacing={2} style={{ paddingTop: 20 }}>
                  <Grid item xs={12}>
                    <Card>
                      <div
                        style={{
                          background:
                            "linear-gradient(60deg, #66bb6a, #43a047)",
                          padding: "15px",
                          marginTop: "-20px",
                          marginLeft: "15px",
                          marginRight: "15px",
                          borderRadius: "3px",
                          boxShadow:
                            "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(76, 175, 80,.4)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            paddingTop: 10,
                          }}
                        >
                          <EventOutlined
                            style={{ color: "white", fontSize: "24px" }}
                          />
                          <Typography
                            variant="h6"
                            style={{
                              color: "white",
                              margin: 0,
                              fontWeight: 400,
                            }}
                          >
                            Date of Service
                          </Typography>
                        </div>
                      </div>
                      <CardBody style={{ paddingTop: "30px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <CustomDatePicker
                              label="Start Date"
                              name="dosStartDate"
                              value={dosStartDate}
                              onChange={dateInputHandler}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <CustomTimePicker
                              label="Start Time"
                              name="dosStartTime"
                              value={dosStartTime}
                              onChange={timeInputHandler}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <CustomDatePicker
                              label="End Date"
                              name="dosEndDate"
                              value={dosEndDate}
                              onChange={dateInputHandler}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <CustomTimePicker
                              label="End Time"
                              name="dosEndTime"
                              value={dosEndTime}
                              onChange={timeInputHandler}
                            />
                          </Grid>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Grid>

                  {isMileageRate && (
                    <Grid item xs={12} sm={12} md={4}>
                      <Card style={{ height: "100%" }}>
                        <div
                          style={{
                            background:
                              "linear-gradient(60deg, #ef5350, #e53935)",
                            padding: "15px",
                            marginTop: "-20px",
                            marginLeft: "15px",
                            marginRight: "15px",
                            borderRadius: "3px",
                            boxShadow:
                              "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(244, 67, 54,.4)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              paddingTop: 10,
                            }}
                          >
                            <DriveEta
                              style={{ color: "white", fontSize: "24px" }}
                            />
                            <Typography
                              variant="h6"
                              style={{
                                color: "white",
                                margin: 0,
                                fontWeight: 400,
                              }}
                            >
                              Log Mileage
                            </Typography>
                          </div>
                        </div>
                        <CardBody style={{ paddingTop: "30px" }}>
                          <CustomTextField
                            name="mileage"
                            placeholder="Enter mileage"
                            label="Mileage"
                            onChange={inputHandler}
                            value={mileage}
                            type="number"
                          />
                        </CardBody>
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={12} md={isMileageRate ? 4 : 6}>
                    <Card style={{ height: "100%" }}>
                      <div
                        style={{
                          background:
                            "linear-gradient(60deg, #ffa726, #fb8c00)",
                          padding: "15px",
                          marginTop: "-20px",
                          marginLeft: "15px",
                          marginRight: "15px",
                          borderRadius: "3px",
                          boxShadow:
                            "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            paddingTop: 10,
                          }}
                        >
                          <NotesOutlined
                            style={{ color: "white", fontSize: "24px" }}
                          />
                          <Typography
                            variant="h6"
                            style={{
                              color: "white",
                              margin: 0,
                              fontWeight: 400,
                            }}
                          >
                            Service Notes
                          </Typography>
                        </div>
                      </div>
                      <CardBody style={{ paddingTop: "30px" }}>
                        <TextareaAutosize
                          aria-label="service notes"
                          minRows={4}
                          rows={4}
                          value={notes}
                          placeholder="Enter service notes here..."
                          name={"notes"}
                          style={{
                            width: "100%",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "8px",
                            fontSize: "10pt",
                            fontFamily: "inherit",
                          }}
                          onKeyPress={(ev) => {
                            if (ev.key === "Enter") {
                              ev.preventDefault();
                            }
                          }}
                          onChange={inputHandler}
                        />
                      </CardBody>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={12} md={isMileageRate ? 4 : 6}>
                    <Card style={{ height: "100%" }}>
                      <div
                        style={{
                          background:
                            "linear-gradient(60deg, #26c6da, #00acc1)",
                          padding: "15px",
                          marginTop: "-20px",
                          marginLeft: "15px",
                          marginRight: "15px",
                          borderRadius: "3px",
                          boxShadow:
                            "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(0, 172, 193,.4)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            paddingTop: 10,
                          }}
                        >
                          <Gesture
                            style={{ color: "white", fontSize: "24px" }}
                          />
                          <Typography
                            variant="h6"
                            style={{
                              color: "white",
                              margin: 0,
                              fontWeight: 400,
                            }}
                          >
                            Signature
                          </Typography>
                        </div>
                      </div>
                      <CardBody style={{ paddingTop: "30px" }}>
                        <div
                          style={{
                            border: "2px dashed #ddd",
                            borderRadius: "4px",
                            padding: "10px",
                            background: "#fafafa",
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
                              width: "100%",
                              style: {
                                width: "100%",
                                height: "80px",
                                background: "white",
                                borderRadius: "4px",
                              },
                              className: "sigCanvas",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={clearSignatureHandler}
                            startIcon={<ClearOutlined />}
                          >
                            Clear
                          </Button>
                        </div>
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
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Card style={{ height: "100%" }}>
                      <div
                        style={{
                          background:
                            "linear-gradient(60deg, #26c6da, #00acc1)",
                          padding: "15px",
                          marginTop: "-20px",
                          marginLeft: "15px",
                          marginRight: "15px",
                          borderRadius: "3px",
                          boxShadow:
                            "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(0, 172, 193,.4)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            paddingTop: 10,
                          }}
                        >
                          <Money style={{ color: "white", fontSize: "24px" }} />
                          <Typography
                            variant="h6"
                            style={{
                              color: "white",
                              margin: 0,
                              fontWeight: 400,
                            }}
                          >
                            Approved Payment
                          </Typography>
                        </div>
                      </div>
                      <CardBody style={{ paddingTop: "30px" }}>
                        <div
                          style={{
                            border: "2px dashed #ddd",
                            borderRadius: "4px",
                            padding: "10px",
                            background: "#fafafa",
                          }}
                        >
                          <div>
                            <Typography variant="body">
                              Service Rate: {contractRate}
                            </Typography>
                          </div>
                          <div style={{ paddingBottom: 20 }}>
                            <Typography variant="body">
                              Mileage Reimbursement: {totalMileageReimbursement}
                            </Typography>
                          </div>
                          <CustomTextField
                            name="approvedPayment"
                            placeholder="Approved Payment"
                            label="Approved Payment"
                            onChange={inputHandler}
                            value={approvedPayment}
                            type="number"
                          />
                          <div style={{ paddingTop: 10 }}>
                            <CustomTextField
                              name="comments"
                              placeholder="Comments"
                              label="Comments"
                              onChange={inputHandler}
                              value={comments}
                              type="text"
                            />
                          </div>
                          <div style={{ paddingTop: 10 }}>
                            <CustomCheckbox
                              label="Is Approved for Payment?"
                              isChecked={isApproved}
                              name={"isApprovedPayment"}
                              onChange={inputHandler}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Grid>
                </Grid>
              )}

              <div
                style={{
                  paddingTop: 30,
                  paddingBottom: 10,
                  borderTop: "1px solid #e0e0e0",
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => props.closeFormModalHandler()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateFormHandler()}
                  disabled={!clientService}
                >
                  Submit Routesheet
                </Button>
              </div>
            </CardBody>
          </Card>
        </Grid>
      </div>
    </Modal>
  );
}
export default RoutesheetForm;

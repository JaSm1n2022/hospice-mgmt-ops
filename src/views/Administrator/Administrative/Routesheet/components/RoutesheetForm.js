import React, { useEffect, useState } from "react";
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
import { Add, DeleteOutline } from "@material-ui/icons";
import moment from "moment";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import TOAST from "modules/toastManager";
import SortUtil from "utils/sortUtil";
import { CLIENT_SERVICES } from "utils/constants";
import { setSeconds } from "date-fns";

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
function RoutesheetForm(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [employee, setEmployee] = useState(DEFAULT_ITEM);
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [clientService, setClientService] = useState(DEFAULT_ITEM);
  const [modalStyle] = React.useState(getModalStyle);
  const [detailForm, setDetailForm] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const { isOpen } = props;
  useEffect(() => {
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
    if (item.category === "user") {
      setEmployee(item);
    } else if (item.category === "service") {
      setClientService(item);
    } else if (item.category === "patient") {
      setPatient(item);
    }
  };
  const inputHandler = ({ target }) => {
    console.log("[TARGET]", target.name);
    if (target.name === "employee" && !target.value) {
      setEmployee(DEFAULT_ITEM);
    }
    if (target.name === "clientService" && !target.value) {
      setClientService(DEFAULT_ITEM);
    }
    if (target.name === "patient" && !target.value) {
      setPatient(DEFAULT_ITEM);
    }
  };
  const inputSourceHandler = ({ target }, source) => {
    if (target.name === "timeIn") {
      source.in = target.value;
    } else if (target.name === "timeOut") {
      source.out = target.value;
    } else if (target.name === "mileage") {
      source.mileage = target.value;
    }
    setIsRefresh(!isRefresh);
  };
  const contractRateHandler = () => {
    const contracts = props.contractList || [];
    console.log(
      "[Contracts]",
      contracts,
      employee,
      clientService,
      patient.value
    );
    let rate;
    rate =
      contracts.find(
        (c) =>
          c.serviceType &&
          c.patientCd &&
          c.employeeId === employee.id &&
          clientService.value === c.serviceType &&
          c.patientCd == patient.value
      ) || undefined;
    if (!rate) {
      rate = contracts.find(
        (c) =>
          c.serviceType &&
          c.employeeId === employee.id &&
          clientService.value === c.serviceType
      );
    }
    currentContract = rate;
    return rate?.serviceRate || 0;
  };
  const mileageRateHandler = () => {
    return currentContract?.isMileageRate || false;
    /*
    const contracts = props.contractList || [];
    console.log(
      "[Contracts]",
      contracts,
      employee,
      clientService,
      patient.value
    );
    let isMileageRate = false;
    isMileageRate =
      contracts.find(
        (c) =>
          c.serviceType &&
          c.patientCd &&
          c.employeeId === employee.id &&
          clientService.value === c.serviceType &&
          c.patientCd == patient.value
      )?.isMileageRate || false;
    if (!isMileageRate) {
      isMileageRate =
        contracts.find(
          (c) =>
            c.serviceType &&
            c.employeeId === employee.id &&
            clientService.value === c.serviceType
        )?.isMileageRate || false;
    }
    return isMileageRate;
    */
  };
  const addItemHandler = () => {
    const records = [...detailForm];
    records.push({
      id: uuidv4(),
      dt: new Date(),
      in: moment(new Date()).format("HH:mm"),
      out: moment(new Date()).add(1, "hour").format("HH:mm"),
      mileage: 0,
    });
    setDetailForm(records);
  };
  if (detailForm?.length === 0) {
    addItemHandler();
  }
  const dateInputHandler = (value, name, source) => {
    if (name === "dt") {
      source.dt = value;
    }
    setIsRefresh(!isRefresh);
  };
  const validateFormHandler = () => {
    console.log("[DETAIL FORM]", detailForm, employee, patient, clientService);
    const params = [];

    detailForm.forEach((d) => {
      const detail = {
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

        timeIn: d.in,
        timeOut: d.out,
        requestor: employee.name,
        requestorId: employee.id,
        requestorTitle: employee.position,
        mileage: d.mileage || 0,
        isMileageRate: currentContract?.isMileageRate || false,
        serviceRate: currentContract?.serviceRate || 0,
        serviceRateType: currentContract?.serviceRateType || "",
        mileageRate: currentContract?.mileageRate || 0,
        mileageMaxReimbursement: currentContract?.maxReimbursement || 0,
        mileageCost: currentContract?.mileageRate
          ? parseFloat(currentContract?.mileageRate * d.mileage)
          : 0,

        dos: moment(d.dt).format("YYYY-MM-DD"),
      };
      detail.totalMileageReimbursement =
        detail.mileageCost > detail.mileageMaxReimbursement
          ? detail.mileageMaxReimbursement
          : detail.mileageCost;
      detail.status = "For Review";
      detail.service = clientService?.name || "";
      detail.serviceCd = clientService?.code || "";
      detail.patientCd = patient.patientCd;
      detail.estimatedPayment =
        detail.totalMileageReimbursement + detail.serviceRate;
      detail.approvedPayment = detail.estimatedPayment;
      params.push(detail);
    });
    console.log("[PARAMS]", params);
    props.createRoutesheetHandler(params, props.mode || "create");
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
                style={{ paddingTop: 10 }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={12} md={3} sm={12}>
                  <CustomSingleAutoComplete
                    name={"employee"}
                    label="Employee"
                    placeholder="Employee"
                    options={users || [DEFAULT_ITEM]}
                    value={employee}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <CustomSingleAutoComplete
                    name={"clientService"}
                    label="Service"
                    placeholder="Service"
                    options={serviceList || [DEFAULT_ITEM]}
                    value={clientService}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                    disabled={!employee?.name}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <CustomSingleAutoComplete
                    name={"patient"}
                    label="Client"
                    placeholder="Client"
                    options={props.patientList || [DEFAULT_ITEM]}
                    value={patient}
                    onSelectHandler={autoCompleteGeneralHander}
                    onChangeHandler={inputHandler}
                    disabled={!clientService?.name}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <CustomTextField
                    name={"rate"}
                    label="Contract Rate"
                    placeholder="Contract Rate"
                    value={contractRateHandler()}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: 4 }}>
                <Typography variant="h6">TIME IN/OUT</Typography>
              </Grid>
              {detailForm.map((item, index) => {
                return (
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    style={{ paddingBottom: 12 }}
                    key={`contr-${index}`}
                  >
                    <Grid item xs={12} md={1}>
                      <div style={{ display: "inline-flex", gap: 10 }}>
                        <div style={{ paddingTop: 4 }}>
                          <Tooltip title={"Delete Item"}>
                            <DeleteOutline
                              style={{
                                color: "#F62100",
                                fontSize: "24px",
                                cursor: "pointer",
                              }}
                              onClick={() => deleteItemHandler(index)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomDatePicker
                        name="dt"
                        source={item}
                        value={item.dt}
                        onChange={dateInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomTimePicker
                        name="timeIn"
                        label="Time In"
                        source={item}
                        value={item.in || "08:00"}
                        onChange={inputSourceHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomTimePicker
                        name="timeOut"
                        label="time Out"
                        source={item}
                        value={item.out || "17:00"}
                        onChange={inputSourceHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} sm={12}>
                      <CustomTextField
                        name="mileage"
                        label="Mileage"
                        source={item}
                        value={mileageRateHandler() ? item.mileage : 0}
                        disabled={!mileageRateHandler()}
                        onChange={inputSourceHandler}
                      />
                    </Grid>
                  </Grid>
                );
              })}
              <div
                style={{
                  paddingTop: 4,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ fontSize: 14 }}
                  onClick={() => addItemHandler()}
                >
                  Add Item
                </Button>
              </div>
              <div
                align="right"
                style={{
                  paddingTop: 4,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{ fontSize: 14 }}
                  onClick={() => validateFormHandler()}
                >
                  Submit
                </Button>
                <span>&nbsp;</span>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ fontSize: 14 }}
                  onClick={() => props.closeFormModalHandler()}
                >
                  Cancel
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

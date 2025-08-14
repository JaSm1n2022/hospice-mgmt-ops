import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Button,
  Card,
  Grid,
  Modal,
  TextareaAutosize,
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
import { Add } from "@material-ui/icons";
import moment from "moment";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import TOAST from "modules/toastManager";

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
const CALLER_NUMBER_ERR_MSG = "Caller number is required";
const CALLER_NAME_ERR_MSG = "Caller name is required";
const CALLER_REASON_CALLED_ERR_MSG = "Caller Reason is required";

function TrainingForm(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    dateCalled: new Date(),
    timeCalled: moment(new Date()).format("HH:mm"),
    callerName: "",
    callerNameError: {
      isError: false,
      errorMsg: CALLER_NAME_ERR_MSG,
    },
    callerNumber: "",
    callerNumberError: {
      isError: false,
      errorMsg: CALLER_NUMBER_ERR_MSG,
    },
    reasonCalled: "",
    reasonCalledError: {
      isError: false,
      errorMsg: CALLER_REASON_CALLED_ERR_MSG,
    },
    response: "",
    notes: "",
    reported: DEFAULT_ITEM,
  });
  const [modalStyle] = React.useState(getModalStyle);
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

      setUsers(tempUsers);
    }
    if (props.item) {
      const temp = { ...form, ...props.item };
      temp.callerName = temp.caller.name;
      temp.callerNumber = temp.caller.phone;
      temp.reasonCalled = temp.reason;

      temp.reported =
        [...tempUsers].find(
          (r) =>
            temp.reported.id && r.id.toString() === temp.reported.id.toString()
        ) || DEFAULT_ITEM;
      setForm(temp);
    }
  }, [props.employeeList, props.item]);

  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Training";
    } else if (props.mode === "edit") {
      return "Edit Training";
    } else {
      return "Create Training";
    }
  };
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const dateInputHandler = (value, name) => {
    const temp = { ...form };
    temp[name] = value;
    setForm(temp);
  };
  const inputGeneralHandler = ({ target }) => {
    const temp = { ...form };
    if (target.name === "reported" && !target.value) {
      temp[target.name] = DEFAULT_ITEM;
    } else {
      temp[target.name] = target.value;
    }
    if (target.name === "callerNumber") {
      temp.callerNumberError.isError = target.value ? false : true;
    }
    if (target.name === "callerName") {
      temp.callerNameError.isError = target.value ? false : true;
    }
    if (target.name === "reasonCalled") {
      temp.reasonCalledError.isError = target.value ? false : true;
    }
    setForm(temp);
  };
  const autoCompleteGeneralInputHander = (item) => {
    if (item.category === "user") {
      const temp = { ...form };
      temp.reported = item;
      setForm(temp);
    }
  };

  const validateFormHandler = () => {
    let isValid = true;
    const temp = { ...form };
    if (!temp.callerName) {
      isValid = false;
      temp.callerNameError.isError = true;
    }
    if (!temp.callerNumber) {
      isValid = false;
      temp.callerNumberError.isError = true;
    }
    if (!temp.reasonCalled) {
      isValid = false;
      temp.reasonCalledError.isError = true;
    }
    setForm(temp);
    if (isValid) {
      props.createTrainingHandler(form, props.mode);
    }
  };
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="training"
      aria-describedby="trainingmodal"
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
                  <CustomDatePicker
                    name="dateCalled"
                    value={form.dateCalled}
                    onChange={dateInputHandler}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <CustomTimePicker
                    name="timeCalled"
                    value={form.timeCalled}
                    onChange={inputGeneralHandler}
                  />
                </Grid>

                <Grid item xs={12} md={3} sm={12}>
                  <CustomTextField
                    label="Caller Number *"
                    placeholder="Caller Number *"
                    name="callerNumber"
                    isError={form.callerNumberError.isError}
                    errorMsg={form.callerNumberError.errorMsg}
                    value={form.callerNumber}
                    onChange={inputGeneralHandler}
                  />
                  {form.callerNameError.isError && (
                    <div style={{ paddingBottom: 10 }}></div>
                  )}
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <CustomTextField
                    label="Caller Name *"
                    placeholder="Caller Name *"
                    name="callerName"
                    isError={form.callerNameError.isError}
                    errorMsg={form.callerNameError.errorMsg}
                    value={form.callerName}
                    onChange={inputGeneralHandler}
                  />
                  {form.callerNameError.isError && (
                    <div style={{ paddingBottom: 10 }}></div>
                  )}
                </Grid>
              </Grid>
              <Grid
                style={{ paddingTop: 10 }}
                container
                spacing={2}
                direction="row"
              >
                <Grid item xs={12} md={3} sm={12}>
                  <Grid container direction="row">
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography variant="body">Reason called?</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={3}
                        style={{ width: "100%" }}
                        className="form-control"
                        name="reasonCalled"
                        value={form.reasonCalled}
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                    {form.reasonCalledError.isError && (
                      <div style={{ paddingBottom: 10, color: "red" }}>
                        {form.reasonCalledError.errorMsg}
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <Grid container direction="row">
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography variant="body">Response</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={3}
                        style={{ width: "100%" }}
                        className="form-control"
                        name="response"
                        value={form.response}
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <Grid container direction="row">
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography variant="body">
                        Additional Information
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={3}
                        style={{ width: "100%" }}
                        className="form-control"
                        name="notes"
                        value={form.notes}
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} sm={12}>
                  <Grid container direction="row">
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography variant="body">Reported By</Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <CustomSingleAutoComplete
                        label="User"
                        placeholder="User"
                        name="reported"
                        height={52}
                        value={form.reported}
                        options={users || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <div align="right">
                    <Button
                      variant="contained"
                      color={"primary"}
                      onClick={() => validateFormHandler()}
                    >
                      Submit
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardBody>
          </Card>
        </Grid>
      </div>
    </Modal>
  );
}
export default TrainingForm;

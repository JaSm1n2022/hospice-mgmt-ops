import React, { useEffect, useState } from "react";
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

import { v4 as uuidv4 } from "uuid";
import HeaderModal from "components/Modal/HeaderModal";
import Delete from "@material-ui/icons/Delete";
import { Add } from "@material-ui/icons";
import moment from "moment";

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
    minWidth: "60%",
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
const TASK_STATUS = [
  {
    name: "Todo",
    value: "Todo",
    label: "Todo",
    category: "status",
    id: "Todo",
  },
  {
    name: "In process",
    value: "In process",
    label: "In Process",
    category: "status",
    id: "In process",
  },
  {
    name: "Done",
    value: "Done",
    label: "Done",
    category: "status",
    id: "Done",
  },
];
const defaultItems = {
  description: "",
  notes: "",
  status: TASK_STATUS.find((t) => t.name === "Todo"),
  completedDt: undefined,
  descriptionErrorMsg: "Description is required",
  uuid: uuidv4(),
};

function TasksForm(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    assigned: {
      dt: `${moment().format("YYYY-MM-DD")} 00:00`,
      assignee: DEFAULT_ITEM,
      isAssigneeError: false,
      assigneeErrorMsg: "Assignee is required",
      isDateError: false,
      dateErrorMsg: "Date is required",
    },
    items: [{ ...defaultItems }],
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
      console.log("[Item]", props.item);
      const temp = { ...form, ...props.item };
      temp.assigned.dt = new Date(temp.assignedDt);
      temp.assigned.assignee = tempUsers.find((t) => t.id === temp.assignee.id);
      temp.items = [
        {
          ...defaultItems,
          description: temp.description,
          notes: temp.notes,
          status: TASK_STATUS.find((t) => t.name === temp.status),
          uuid: uuidv4(),
        },
      ];
      setForm(temp);
    }
  }, [props.employeeList, props.item]);

  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Tasks";
    } else if (props.mode === "edit") {
      return "Edit Tasks";
    } else {
      return "Create Tasks";
    }
  };
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const dateInputHandler = (value, name) => {
    console.log("[Date Input]", value);
    const temp = { ...form };
    if (name === "assignedDt") {
      temp.assigned.dt = value;
      temp.assigned.isDateError = false;
      if (!value) {
        temp.assigned.isDateError = true;
      }
    }

    setForm(temp);
  };
  const inputGeneralHandler = ({ target }, source) => {
    const temp = { ...form };
    if (target.name === "assignee" && !target.value) {
      temp.assigned.isAssigneeError = true;
    }
    setForm(temp);
  };
  const autoCompleteGeneralInputHander = (item, source) => {
    console.log("[Source]", source, item);
    const temp = { ...form };
    if (item.category === "user") {
      temp.assigned.assignee = item;
      temp.assigned.isAssigneeError = false;
      setForm(temp);
    } else if (source) {
      const arr = [...temp.items];
      const findOne = arr.find(
        (i) => i.uuid.toString() === source.uuid.toString()
      );
      findOne[item.category] = item;
    }
    setForm(temp);
  };
  const deleteItemHandler = (item) => {
    const temp = { ...form };
    const arr = temp.items;
    const list = arr.filter((f) => f.uuid.toString() !== item.uuid.toString());
    temp.items = list;

    setForm(temp);
  };
  const addItemHandler = () => {
    const temp = { ...form };
    const arr = temp.items;
    arr.push({ ...defaultItems, uuid: uuidv4() });
    console.log("[Form]", temp);
    setForm(temp);
  };
  const inputTextAreaHandler = (e, item) => {
    const temp = { ...form };
    const arr = [...temp.items];
    const findOne = arr.find((i) => i.uuid.toString() === item.uuid.toString());
    findOne[e.target.name] = e.target.value;
    if (e.target.name) {
      findOne.isDescriptionError = false;
    }
    if (!e.target.value && e.target.name === "description") {
      findOne.isDescriptionError = true;
    }
    console.log("[Find One]", findOne, temp);
    setForm(temp);
  };
  const validateFormHandler = () => {
    const temp = { ...form };
    let isValid = true;
    temp.assigned.isDateError = false;
    temp.assigned.isAssigneeError = false;
    if (!temp.assigned.dt) {
      isValid = false;
      temp.assigned.isDateError = true;
    }
    if (!temp.assigned.assignee.name) {
      isValid = false;
      temp.assigned.isAssigneeError = true;
    }
    temp.items.forEach((c) => {
      c.isDescriptionError = false;
      if (!c.description) {
        isValid = false;
        c.isDescriptionError = true;
      }
    });
    if (isValid) {
      props.createTasksHandler(temp, props.mode);
    } else {
      setForm(temp);
    }
  };
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="tasks"
      aria-describedby="tasksmodal"
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
                    name="assignedDt"
                    value={form.assigned.dt}
                    label="Date"
                    onChange={dateInputHandler}
                    isError={form.assigned.isDateError}
                    errorMsg={form.assigned.dateErrorMsg}
                  />
                  {form.assigned.isDateError && (
                    <div style={{ paddingBottom: 10 }}></div>
                  )}
                </Grid>
                <Grid item xs={12} md={5} sm={12}>
                  <CustomSingleAutoComplete
                    label="Assignee"
                    placeholder="Assignee"
                    name="assignee"
                    value={form.assigned.assignee}
                    options={users || []}
                    isError={form.assigned.isAssigneeError}
                    errorMsg={form.assigned.assigneeErrorMsg}
                    onSelectHandler={autoCompleteGeneralInputHander}
                    onChangeHandler={inputGeneralHandler}
                  />
                  {form.assigned.isAssigneeError && (
                    <div style={{ paddingBottom: 10 }}></div>
                  )}
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <Typography variant="body">Tasks List</Typography>
                </Grid>
                <Grid
                  style={{ paddingTop: 10 }}
                  container
                  spacing={1}
                  direction="row"
                >
                  <Grid item xs={12} md={1} sm={12}>
                    <Typography>Delete</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Description</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>Notes</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography>Status</Typography>
                  </Grid>
                </Grid>
                {form.items.map((rec, indx) => (
                  <Grid
                    style={{ paddingTop: 10 }}
                    container
                    spacing={1}
                    key={indx}
                    direction="row"
                  >
                    <Grid item xs={12} md={1} sm={12}>
                      <div style={{ display: "inline-flex", gap: 2 }}>
                        <Typography variant="body2">{indx + 1}.</Typography>
                        <Delete
                          style={{
                            fontSize: 18,
                            color: props.mode === "edit" ? "gray" : "red",
                            cursor: "pointer",
                            disabled: props.mode === "edit",
                          }}
                          onClick={() => deleteItemHandler(rec)}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={2}
                        style={{
                          width: "100%",
                          border: rec.isDescriptionError ? "1px solid red" : "",
                        }}
                        name="description"
                        source={rec}
                        isError={rec.isDescriptionError}
                        errorMsg={rec.descriptionErrorMsg}
                        value={rec.description}
                        className="form-control"
                        onChange={(e) => inputTextAreaHandler(e, rec)}
                      />
                      {rec.isDescriptionError && (
                        <div style={{ paddingBottom: 10 }}>
                          {rec.descriptionErrorMsg}
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={2}
                        name="notes"
                        source={rec}
                        value={rec.notes}
                        style={{ width: "100%" }}
                        className="form-control"
                        onChange={(e) => inputTextAreaHandler(e, rec)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <CustomSingleAutoComplete
                        label="Select"
                        placeholder="Select"
                        name="status"
                        source={rec}
                        value={
                          rec.status ||
                          TASK_STATUS.find((t) => t.name === "Todo")
                        }
                        options={TASK_STATUS || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                ))}
                {props.mode === "create" && (
                  <Grid item xs={12} md={6} sm={12}>
                    <Button
                      variant="contained"
                      onClick={() => addItemHandler()}
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
                      startIcon={<Add />}
                    >
                      ADD ITEM
                    </Button>
                  </Grid>
                )}
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
export default TasksForm;

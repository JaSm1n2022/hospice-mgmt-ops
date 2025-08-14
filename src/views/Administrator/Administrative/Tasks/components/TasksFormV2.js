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

import moment from "moment";
import CustomTimePicker from "components/Time/CustomTimePicker";

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
    minHeight: "75%",
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

function TasksFormV2(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [assigneeError, setAssigneeError] = useState({
    isError: false,
    msg: "",
  });
  const [taskDt, setTaskDt] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [taskTm, setTaskTm] = useState(moment(new Date()).format("HH:mm"));
  const [taskDtError, setTaskDtError] = useState({ isError: false, msg: "" });
  const [statusDt, setStatusDt] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [statusTm, setStatusTm] = useState(moment(new Date()).format("HH:mm"));
  const [doneDt, setDoneDt] = useState(undefined);
  const [doneTm, setDoneTm] = useState(undefined);
  const [inProcessDt, setInProcessDt] = useState(undefined);
  const [inProcessTm, setInprocessTm] = useState(undefined);
  const [todoDt, setTodoDt] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [todoTm, setTodoTm] = useState(moment(new Date()).format("HH:mm"));

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState({
    isError: false,
    msg: "",
  });
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(
    TASK_STATUS.find((t) => t.name === "Todo")
  );
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
    if (name === "taskDt") {
      setTaskDt(value);
      setTaskDtError({ isError: false, msg: "" });
      if (!value) {
        setTaskDtError({ isError: true, msg: "Date is required" });
      }
    } else if (name === "statusDt") {
      setStatusDt(value);
      if (status?.name?.toLowerCase() === "done") {
        setDoneDt(value);
      } else if (status?.name?.toLowerCase() === "in process") {
        setInProcessDt(value);
      } else if (status?.name?.toLowerCase() === "todo") {
        setTodoDt(value);
      }
    }
  };
  const inputHandler = ({ target }) => {
    if (target.name === "assignee" && !target.value) {
      setAssigneeError({ isError: true, msg: "Assignee is required." });
    } else if (target.name === "taskTm") {
      setTaskTm(target.value);
    } else if (target.name === "description") {
      if (target.value) {
        setDescription(target.value);
        setDescriptionError({ isError: false, msg: "" });
      } else {
        setDescriptionError({ isError: true, msg: "Description is required." });
      }
    } else if (target.name === "notes") {
      setNotes(target.value);
    } else if (target.name === "statusTm") {
      setStatusTm(target.value);
      if (status?.name?.toLowerCase() === "done") {
        setDoneTm(target.value);
      } else if (status?.name?.toLowerCase() === "in process") {
        setInprocessTm(target.value);
      } else if (status?.name?.toLowerCase() === "todo") {
        setTodoTm(target.value);
      }
    }
  };
  const autoCompleteInputHander = (item) => {
    if (item.category === "user") {
      setAssignee(item);
      setAssigneeError({ isError: false, msg: "" });
    }
    if (item.category === "status") {
      setStatus(item);
    }
  };

  const validateFormHandler = () => {
    let isValid = true;
    if (!assignee?.name) {
      isValid = false;
      setAssigneeError({ isError: true, msg: "Assignee is required." });
    }
    if (!description) {
      isValid = false;
      setDescriptionError({ isError: true, msg: "Description is required." });
    }
    if (isValid) {
      const payload = {
        assignee,
        notes,
        description,
        status,
        assignedDt: new Date(
          `${moment(taskDt).format("YYYY-MM-DD")} ${taskTm}`
        ),
        taskDt,
        taskTm,
      };
      if (status?.name?.toLowerCase() === "done") {
        payload.doneDt = doneDt || statusDt;
        payload.doneTm = doneTm || statusTm;
        payload.completedDt = new Date(
          `${moment(payload.doneDt).format("YYYY-MM-DD")} ${payload.doneTm}`
        );
      } else if (status?.name?.toLowerCase() === "in process") {
        payload.inProcessDt = inProcessDt || statusDt;
        payload.inProcessTm = inProcessTm || statusTm;
      } else {
        payload.todoDt = todoDt || statusDt;
        payload.todoTm = todoTm || statusTm;
      }
      console.log("[Payload]", payload);
      props.createTasksHandler(payload, props.mode);
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
                <Grid item xs={12} md={12} sm={12}>
                  <CustomSingleAutoComplete
                    label="Assignee"
                    placeholder="Assignee"
                    name="assignee"
                    value={assignee}
                    options={users || []}
                    isError={assigneeError.isError}
                    onSelectHandler={autoCompleteInputHander}
                    onChangeHandler={inputHandler}
                  />
                  {assigneeError.isError && (
                    <div style={{ paddingBottom: 10 }}>
                      <Typography variant="body2" style={{ color: "red" }}>
                        {assigneeError.msg}
                      </Typography>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <CustomDatePicker
                      name="taskDt"
                      value={taskDt}
                      label="Date"
                      onChange={dateInputHandler}
                      isError={taskDtError.isError}
                      errorMsg={taskDtError.msg}
                    />
                    {taskDtError.isError && (
                      <div style={{ paddingBottom: 10 }}></div>
                    )}
                    <CustomTimePicker
                      name="taskTm"
                      label="Time"
                      value={taskTm}
                      onChange={inputHandler}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <div>
                    <Typography>Description</Typography>
                  </div>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={4}
                    style={{
                      width: "100%",
                    }}
                    onChange={inputHandler}
                    name="description"
                    className="form-control"
                  />

                  {descriptionError.isError && (
                    <div style={{ paddingBottom: 10 }}>
                      <Typography variant="body2" style={{ color: "red" }}>
                        {descriptionError.msg}
                      </Typography>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <div>
                    <Typography>Add Notes</Typography>
                  </div>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={4}
                    value={notes}
                    onChange={inputHandler}
                    name="notes"
                    style={{ width: "100%" }}
                    className="form-control"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <div>
                    <Typography>Status</Typography>
                  </div>
                  <CustomSingleAutoComplete
                    label="Select"
                    placeholder="Select"
                    name="status"
                    value={status}
                    options={TASK_STATUS || []}
                    onSelectHandler={autoCompleteInputHander}
                    onChangeHandler={inputHandler}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <div>
                    <Typography>Actual {status?.name || ""}</Typography>
                  </div>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <CustomDatePicker
                      name="statusDt"
                      value={statusDt}
                      label="Date"
                      onChange={dateInputHandler}
                    />

                    <CustomTimePicker
                      name="statusTm"
                      label="Time"
                      value={statusTm}
                      onChange={inputHandler}
                    />
                  </div>
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
export default TasksFormV2;

import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Card, Grid, Modal, Typography } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";
import CustomMultipleAutoComplete from "components/AutoComplete/CustomMultipleAutoComplete";
import { DAY_OF_WEEK } from "utils/constants";
import { AddOutlined, Clear, Close, DeleteOutlined } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import HospiceTable from "components/Table/HospiceTable";
import AssignmentHandler from "./AssignmentHandler";
import Button from "components/CustomButtons/Button.js";
import { IDT_POSITION } from "utils/constants";
import { VISIT_TYPE } from "utils/constants";
import ActionsFunction from "./ActionsFunction";
let categoryList = [];
let uoms = [];
let positionList = [];

let dayOfWeekOptions = [];
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "dayOfWeek";
  dayOfWeekOptions.push({ ...d });
});
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
    width: "95%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    overFlowY: "auto",
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
  typo: {
    paddingLeft: "25%",
    position: "relative",
  },
  hdr: {
    position: "relative",
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px",
  },
}));

const visitOption = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "visitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "visitType",
  },
];

function IDGForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedPatient, setSelectedPatient] = useState(DEFAULT_ITEM);
  const [selectedDiscipline, setSelectedDiscipline] = useState(DEFAULT_ITEM);
  const [selectedVisitType, setSelectedVisitType] = useState(DEFAULT_ITEM);
  const [numberOfVisit, setNumberOfVisit] = useState(undefined);
  const [selectedPosition, setSelectedPosition] = useState(DEFAULT_ITEM);
  const [timeOfVisit, setTimeOfVisit] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [comps, setComps] = useState();
  const [columns, setColumns] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [patientTeam, setPatientTeam] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const { isOpen } = props;
  useEffect(() => {
    const cols = AssignmentHandler.columns(true).map((col, index) => {
      if (col.name === "action") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              id={{ ...cellProps.data.id }}
              data={{ ...cellProps.data }}
              onEdit={editHandler}
              onDelete={deleteHandler}
            />
          ),
        };
      }

      return {
        ...col,
        editable: () => false,
      };
    });
    setColumns(cols);
    setPatientTeam(props.patientTeam);
  }, [props.patientTeam]);
  useEffect(() => {
    positionList = IDT_POSITION;
    if (props.patientList && props.patientList.length) {
      const ptList = [...props.patientList];
      ptList.forEach((f) => {
        f.name = f.patientCd;
        f.value = f.patientCd;
        f.id = f.id;
        f.label = f.patientCd;
        f.category = "patient";
      });
      setPatientList(ptList);
    }
    if (props.employeeList && props.employeeList.length) {
      filterEmployeeByPositionHandler(null);
    }
  }, [props.patientList, props.employeeList, props.item]);
  const POSITION_GROUPS = {
    "registered nurse": ["registered nurse", "director of nurse"],
    "director of nurse": ["registered nurse", "director of nurse"],
    chaplain: ["chaplain", "bereavement"],
    bereavement: ["chaplain", "bereavement"],
  };

  const normalize = (s) => (s ?? "").toString().trim().toLowerCase();

  const decorate = (emp) => ({
    ...emp,
    value: emp.name,
    label: emp.name,
    category: "discipline",
  });

  const filterByJob = (job, list) => {
    const target = normalize(job);
    const decorated = list.map(decorate);

    if (!target) return decorated; // no filter → return all

    const allowed = POSITION_GROUPS[target];
    return decorated.filter((emp) => {
      const pos = normalize(emp.position);
      return allowed ? allowed.includes(pos) : pos === target;
    });
  };

  // Usage inside your component:
  const filterEmployeeByPositionHandler = (job) => {
    const next = filterByJob(job, props.employeeList);
    console.log("[NEXT]", next, patientTeam);
    const anotherFilter = [];
    next.forEach((n) => {
      if (
        !patientTeam?.find(
          (f) => f.disciplineName?.toLowerCase() === n.name?.toLowerCase()
        )
      ) {
        anotherFilter.push(n);
      }
    });
    setEmployeeList(anotherFilter);
  };
  const autoCompleteGeneralInputHander = (item) => {
    if (item.category === "patient") {
      setSelectedPatient(item);
      clearFormHandler();
      props.patientSelectionHandler(item.id);
    } else if (item.category === "position") {
      setSelectedPosition(item);
      filterEmployeeByPositionHandler(item.name);
    } else if (item.category === "discipline") {
      setSelectedDiscipline(item);
    } else if (item.category === "visitType") {
      setSelectedVisitType(item);
    }
  };
  const onChangeGeneralInputHandler = (e) => {
    if (e.target.name === "numberOfVisit") {
      setNumberOfVisit(e.target.value);
    }
    if (e.target.name === "timeOfVisit") {
      setTimeOfVisit(e.target.value);
    }
  };

  const deleteHandler = (item) => {
    console.log("[DELETE ITEM]", item);
    props.deleteRecordItemHandler(item.id);
  };

  const editHandler = (item) => {
    console.log("[EDIT ITEM]", item);
    props.createAssignmentHandler(item, "edit");
  };
  const selectAllHandler = (isAll, options) => {
    console.log("[SELECT ALL]", options);

    options.forEach((option) => {
      option.selected = isAll;
    });
    setIsRefresh(!isRefresh);
  };
  const onChangeInputHandler = (e, source, reason) => {
    console.log("[On Change]", e, source, reason);
    if (!e.target.value) {
      if (source && reason === "clear") {
        source.forEach((s) => (s.selected = false));
        src[e.target.name] = source;
      }
    }
  };
  const clearFormHandler = () => {
    dayOfWeekOptions.forEach((c) => {
      c.selected = false;
    });

    setSelectedDiscipline(DEFAULT_ITEM);
    setSelectedVisitType(DEFAULT_ITEM);
    setSelectedPosition(DEFAULT_ITEM);
    setNumberOfVisit(undefined);
    setTimeOfVisit("");
  };
  const addItemHandler = (source) => {
    // for items it is not needed for this handler
    console.log("[SOURCE}", source);
    dayOfWeekOptions = source;
    setIsRefresh(!isRefresh);
  };
  const addDisciplineHandler = () => {
    const payload = {
      patientId: selectedPatient.id,
      patientCd: selectedPatient.patientCd,
      disciplineId: selectedDiscipline.id,
      disciplinePosition: selectedPosition.value,
      disciplineName: selectedDiscipline.name,
      frequencyVisit: numberOfVisit,
      visitType: selectedVisitType.code,
      dayOfTheWeek:
        dayOfWeekOptions.filter((s) => s.selected)?.map((m) => m.value) || [],
      timeOfVisit: timeOfVisit,
    };
    props.createAssignmentHandler(payload, "create");
    clearFormHandler();
  };
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="assignment"
      aria-describedby="assignmentmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <CardHeader color="rose">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ flex: "0 0 98%" }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Create IDT
              </Typography>
            </div>
            <div style={{ flex: "0 0 2%" }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={() => props.onClose()}
              />
            </div>
          </div>
        </CardHeader>
        <br />
        <Card plain>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} md={6}>
                <CustomSingleAutoComplete
                  placeholder="Select Patient"
                  label="Select Patient"
                  searchList={patientList || []}
                  options={patientList || []}
                  value={selectedPatient}
                  onSelectHandler={autoCompleteGeneralInputHander}
                  onChangeHandler={onChangeGeneralInputHandler}
                />
              </GridItem>
              <GridContainer style={{ paddingLeft: 20 }}>
                <Grid item xs={12} md={4}>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    style={{ padding: 0 }}
                  >
                    <GridItem xs={12} md={12}>
                      <div className={classes.hdr}>
                        <h3>ADD TEAM</h3>
                      </div>
                    </GridItem>
                    {/*headers?.map((h) => {
                      return (
                        <GridItem xs={2}>
                          <div className={classes.typo}>
                            <h6>{h}</h6>
                          </div>
                        </GridItem>
                      );
                    })*/}
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    style={{ padding: 0 }}
                  >
                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Discipline
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomSingleAutoComplete
                            searchList={positionList || []}
                            options={positionList || []}
                            value={selectedPosition}
                            disabled={!selectedPatient?.id}
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={onChangeGeneralInputHandler}
                          />
                        </div>
                      </div>
                    </GridItem>

                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Name
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomSingleAutoComplete
                            searchList={employeeList || []}
                            options={employeeList || []}
                            value={selectedDiscipline}
                            disabled={!selectedPosition?.name}
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={onChangeGeneralInputHandler}
                          />
                        </div>
                      </div>
                    </GridItem>

                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Visit Type
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomSingleAutoComplete
                            searchList={[...VISIT_TYPE] || []}
                            options={[...VISIT_TYPE] || []}
                            value={selectedVisitType}
                            disabled={!selectedDiscipline?.name}
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={onChangeGeneralInputHandler}
                          />
                        </div>
                      </div>
                    </GridItem>
                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Frequency
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomTextField
                            placeholder="Number of Visit"
                            label="# of Visit"
                            type="number"
                            name="numberOfVisit"
                            disabled={!selectedDiscipline?.name}
                            value={numberOfVisit}
                            onChange={onChangeGeneralInputHandler}
                          />
                        </div>
                      </div>
                    </GridItem>
                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Day of Week
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomMultipleAutoComplete
                            name="dayOfWeek"
                            label="Day of Week"
                            placeholder="Day of Week"
                            disabled={!selectedDiscipline?.name}
                            onChangeHandler={onChangeInputHandler}
                            selected={dayOfWeekOptions.filter(
                              (s) => s.selected
                            )}
                            selectAllHandler={selectAllHandler}
                            selectHandler={addItemHandler}
                            searchList={dayOfWeekOptions || []}
                          />
                        </div>
                      </div>
                    </GridItem>
                    <GridItem xs={12} md={12}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 10,
                          paddingRight: 10,
                        }}
                      >
                        {/* Left side: Label */}
                        <div style={{ flex: "0 0 auto", minWidth: 126 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Time
                          </Typography>
                        </div>

                        {/* Right side: Input */}
                        <div style={{ flex: 1 }}>
                          <CustomTextField
                            placeholder="Time of Visit"
                            label="Time"
                            type="text"
                            name="timeOfVisit"
                            disabled={!selectedDiscipline?.name}
                            value={timeOfVisit}
                            onChange={onChangeGeneralInputHandler}
                          />
                        </div>
                      </div>
                    </GridItem>

                    <GridItem xs={12} md={12}>
                      <div
                        onClick={() => addDisciplineHandler()}
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                      >
                        <Button color="info" round>
                          ADD
                        </Button>
                      </div>
                    </GridItem>
                  </Grid>
                </Grid>
                <Grid xs={12} md={8} style={{ paddingRight: 20 }}>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    style={{ padding: 0 }}
                  >
                    <GridItem xs={12} md={12}>
                      <div className={classes.hdr}>
                        <h3>CURRENT TEAM</h3>
                      </div>
                    </GridItem>
                    <GridItem xs={12} md={12}>
                      <HospiceTable
                        columns={columns}
                        dataSource={patientTeam}
                      />
                    </GridItem>
                    {/*headers?.map((h) => {
                      return (
                        <GridItem xs={2}>
                          <div className={classes.typo}>
                            <h6>{h}</h6>
                          </div>
                        </GridItem>
                      );
                    })*/}
                  </Grid>
                </Grid>
              </GridContainer>
            </GridContainer>
          </CardBody>
        </Card>
        <br />
      </div>
    </Modal>
  );
}
export default IDGForm;

import React, { useState } from "react";
import Button from "components/CustomButtons/Button.js";
import { useEffect } from "react";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import styles from "../../../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import styles2 from "../../../../assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Card from "components/Card/Card.js";

import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete.js";
import { DEFAULT_ITEM } from "utils/constants.js";
import { VISIT_TYPE } from "utils/constants.js";
import CustomTextField from "components/TextField/CustomTextField.js";
import CustomMultipleAutoComplete from "components/AutoComplete/CustomMultipleAutoComplete.js";
import { DAY_OF_WEEK } from "utils/constants.js";

const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ActionsFunction(props) {
  const classes = useStyles();
  const classes2 = useStyles2();
  const [dayOfWeekOptions, setDayOfWeekOptions] = useState([]);
  const [isRowForDelete, setIsRowForDelete] = useState(false);
  const [selectedVisitType, setSelectedVisitType] = useState(DEFAULT_ITEM);
  const [numberOfVisit, setNumberOfVisit] = useState(0);
  const [timeOfVisit, setTimeOfVisit] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  const [isRefresh, setIsRefresh] = useState(false);
  useEffect(() => {
    if (props.data) {
      // console.log('[CurrentItem]', currentItem);

      setCurrentItem(props.data);
    }
  }, [props.data]);
  const openEditModalHandler = () => {
    props.createFormHandler(currentItem, "edit");
  };
  const printRecordHandler = () => {
    props.printHandler(currentItem);
  };
  const deleteRecordHandler = () => {
    setIsRowForDelete(true);
  };
  const noDeleteHandler = () => {
    setIsRowForDelete(false);
  };
  const deleteRowHandler = (mode) => {
    if (mode === "Delete") {
      props.onDelete(currentItem);
    } else if (mode === "Edit") {
      setSelectedVisitType(
        VISIT_TYPE.find((a) => a.code === currentItem?.visitType) ||
          DEFAULT_ITEM
      );
      setNumberOfVisit(currentItem?.frequencyVisit);
      setTimeOfVisit(currentItem?.timeOfVisit);
      const weeks = [];
      [...DAY_OF_WEEK].forEach((d) => {
        d.category = "dayOfWeek";
        if (currentItem?.dayOfTheWeek?.find((p) => p === d.value)) {
          d.selected = true;
        } else {
          d.selected = false;
        }

        weeks.push({ ...d });
      });
      setDayOfWeekOptions(weeks);
      setEditModal(true);
    }
  };
  const updateAssignmentHandler = () => {
    setEditModal(false);
    currentItem.frequencyVisit = numberOfVisit;

    currentItem.dayOfTheWeek =
      dayOfWeekOptions.filter((f) => f.selected)?.map((m) => m.value) || [];
    currentItem.visitType = selectedVisitType.value;
    currentItem.timeOfVisit = timeOfVisit;
    props.onEdit(currentItem);
  };
  const selectAllHandler = (isAll, options) => {
    console.log("[SELECT ALL]", options);

    options.forEach((option) => {
      option.selected = isAll;
    });
    setIsRefresh(!isRefresh);
  };
  const autoCompleteGeneralInputHander = (item) => {
    if (item.category === "visitType") {
      setSelectedVisitType(item);
    }
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
  const onChangeGeneralInputHandler = (e) => {
    if (e.target.name === "numberOfVisit") {
      setNumberOfVisit(e.target.value);
    }
    if (e.target.name === "timeOfVisit") {
      setTimeOfVisit(e.target.value);
    }
  };
  const fillButtons = [
    { color: "info", icon: Edit, mode: "Edit" },
    { color: "danger", icon: Close, mode: "Delete" },
  ].map((prop, key) => {
    return (
      <Button
        color={prop.color}
        className={classes.actionButton}
        key={key}
        onClick={() => deleteRowHandler(prop.mode)}
      >
        <prop.icon className={classes.icon} />
      </Button>
    );
  });
  const addItemHandler = (source) => {
    // for items it is not needed for this handler
    console.log("[SOURCE}", source);
    setDayOfWeekOptions([...source]);
    setIsRefresh(!isRefresh);
  };
  return (
    <React.Fragment>
      {currentItem ? fillButtons : null}
      {currentItem && (
        <div style={{ flex: "0 0 5%", textAlign: "right" }}>
          <Dialog
            classes={{
              paper: classes2.modal,
            }}
            open={editModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setEditModal(false)}
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
                onClick={() => setEditModal(false)}
              >
                <Close className={classes2.modalClose} />
              </Button>
              <div align="center">
                <h4 className={classes2.modalTitle}>Edit Assignment</h4>
              </div>
            </DialogTitle>
            <DialogContent id="notice-modal-slide-description">
              <Card>
                <CardBody>
                  <GridContainer style={{ paddingLeft: 20 }}>
                    <Grid item xs={12} md={12}>
                      <Grid
                        container
                        spacing={1}
                        direction="row"
                        style={{ padding: 0 }}
                      >
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
                              <Typography variant="h6">
                                {currentItem.disciplinePosition?.toLowerCase() ===
                                "certified nurse assistant"
                                  ? "CNA"
                                  : currentItem.disciplinePosition}
                              </Typography>
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
                              <Typography variant="h6">
                                {currentItem.disciplineName}
                              </Typography>
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
                                value={timeOfVisit}
                                onChange={onChangeGeneralInputHandler}
                              />
                            </div>
                          </div>
                        </GridItem>
                      </Grid>
                    </Grid>
                  </GridContainer>
                </CardBody>
              </Card>
            </DialogContent>
            <DialogActions
              className={
                classes2.modalFooter + " " + classes2.modalFooterCenter
              }
            >
              <Button
                onClick={() => updateAssignmentHandler()}
                color="info"
                round
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
}

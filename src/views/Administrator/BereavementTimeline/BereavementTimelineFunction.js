import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { connect } from "react-redux";
import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  AddAlert,
} from "@material-ui/icons";
import Snackbar from "components/Snackbar/Snackbar";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToUpdatePatient } from "store/actions/patientAction";
import { resetUpdatePatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { patientUpdateStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import moment from "moment";
import BereavementTimelineHandler from "./components/BereavementTimelineHandler";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  tableContainer: {
    overflowX: "auto",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
  },
  tableCell: {
    fontSize: "0.875rem",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
  headerCell: {
    fontSize: "0.875rem",
    fontWeight: "600",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
  milestoneCell: {
    minWidth: "150px",
  },
  completedIcon: {
    color: "#43a047",
    fontSize: "20px",
  },
  overdueText: {
    color: "#d32f2f",
    fontWeight: "600",
  },
  upcomingText: {
    color: "#f57c00",
    fontWeight: "600",
  },
  urgentText: {
    color: "#ff5722",
    fontWeight: "600",
  },
};

const useStyles = makeStyles(styles);

let isProcessDone = true;
let isPatientListDone = true;

function BereavementTimelineFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    bereavement_month_0: false,
    bereavement_month_1: false,
    bereavement_month_3: false,
    bereavement_month_6: false,
    bereavement_month_9: false,
    bereavement_month_12: false,
    bereavement_month_13: false,
  });
  const [completedFilter, setCompletedFilter] = useState("both"); // "both", "yes", "no"
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const showNotification = (place, color, msg) => {
    setMessage(msg);
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

  useEffect(() => {
    console.log("Bereavement Timeline - loading patient data");
    isPatientListDone = false;
    setIsPatientsCollection(true);
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
      });
    }

    // Cleanup: reset state when component unmounts
    return () => {
      props.resetListPatients();
    };
  }, []);

  // Handle update patient response
  useEffect(() => {
    if (props.patientUpdate?.status === ACTION_STATUSES.SUCCEED) {
      showNotification("tc", "success", "Bereavement data updated successfully");
      handleCloseDialog();
      props.resetUpdatePatient();

      // Refresh patient list to reload table data with updated milestones
      setIsPatientsCollection(true);
      if (context.userProfile?.companyId) {
        props.listPatients({
          companyId: context.userProfile?.companyId,
        });
      }
    } else if (props.patientUpdate?.status === ACTION_STATUSES.FAILED) {
      showNotification(
        "tc",
        "danger",
        "Failed to update bereavement data: " +
          (props.patientUpdate?.error || "Unknown error")
      );
      props.resetUpdatePatient();
    }
  }, [props.patientUpdate]);

  if (
    isPatientsCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    let source = props.patients.data;
    if (source && source.length) {
      // Apply BereavementTimelineHandler to filter and map data
      source = BereavementTimelineHandler.mapData(source);
    }
    setDataSource(source);
    setIsPatientsCollection(false);
    props.resetListPatients();
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD/YYYY");
  };

  const getFilteredData = () => {
    if (!dataSource) return [];

    if (completedFilter === "both") {
      return dataSource;
    } else if (completedFilter === "yes") {
      return dataSource.filter((p) => p.bereavementCompleted === true);
    } else if (completedFilter === "no") {
      return dataSource.filter((p) => !p.bereavementCompleted);
    }

    return dataSource;
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      bereavement_month_0: patient.bereavement_month_0 || false,
      bereavement_month_1: patient.bereavement_month_1 || false,
      bereavement_month_3: patient.bereavement_month_3 || false,
      bereavement_month_6: patient.bereavement_month_6 || false,
      bereavement_month_9: patient.bereavement_month_9 || false,
      bereavement_month_12: patient.bereavement_month_12 || false,
      bereavement_month_13: patient.bereavement_month_13 || false,
    });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (!selectedPatient) return;

    const params = {
      id: selectedPatient.id,
      bereavement_month_0: editFormData.bereavement_month_0,
      bereavement_month_1: editFormData.bereavement_month_1,
      bereavement_month_3: editFormData.bereavement_month_3,
      bereavement_month_6: editFormData.bereavement_month_6,
      bereavement_month_9: editFormData.bereavement_month_9,
      bereavement_month_12: editFormData.bereavement_month_12,
      bereavement_month_13: editFormData.bereavement_month_13,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile.name,
        userId: context.userProfile.id,
        date: new Date(),
      },
    };

    props.updatePatient(params);
  };

  const renderMilestoneCell = (milestone) => {
    const daysUntil = BereavementTimelineHandler.calculateDaysUntil(
      milestone.dueDate
    );

    return (
      <TableCell className={`${classes.tableCell} ${classes.milestoneCell}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontWeight: 500 }}>{milestone.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            Due: {formatDate(milestone.dueDate)}
            <br />({milestone.dueDateRange})
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "4px",
            }}
          >
            {milestone.completed ? (
              <Tooltip title="Completed">
                <CheckCircleIcon className={classes.completedIcon} />
              </Tooltip>
            ) : (
              <>
                {milestone.status === "overdue" && (
                  <span className={classes.overdueText}>
                    {Math.abs(daysUntil)} days overdue
                  </span>
                )}
                {milestone.status === "urgent" && (
                  <span className={classes.urgentText}>
                    {daysUntil} days left
                  </span>
                )}
                {milestone.status === "upcoming" && (
                  <span className={classes.upcomingText}>
                    {daysUntil} days left
                  </span>
                )}
                {milestone.status === "scheduled" && (
                  <span style={{ fontSize: "0.75rem", color: "#666" }}>
                    {daysUntil} days
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </TableCell>
    );
  };

  isProcessDone = isPatientListDone;

  return (
    <>
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
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>
            Loading Bereavement Timeline...
          </div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="rose">
                  <h4 className={classes.cardTitleWhite}>
                    Bereavement Timeline
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Track bereavement support milestones for patients with death
                    discharge (within 13 months)
                  </p>
                </CardHeader>
                <CardBody>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <FormControl
                      variant="outlined"
                      size="small"
                      style={{ minWidth: 200 }}
                    >
                      <InputLabel>Bereavement Completed</InputLabel>
                      <Select
                        value={completedFilter}
                        onChange={(e) => setCompletedFilter(e.target.value)}
                        label="Bereavement Completed"
                      >
                        <MenuItem value="both">Both</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                    <Box
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      Total Patients: {getFilteredData().length}
                    </Box>
                  </Box>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell className={classes.headerCell}>
                            #
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Action
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Bereavement
                            <br />
                            Completed
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Patient
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Date of Death
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 0
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 1
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 3
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 6
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 9
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 12
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Month 13
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredData().length > 0 ? (
                          getFilteredData().map((patient, index) => {
                            return (
                              <TableRow key={index} hover>
                                <TableCell className={classes.tableCell}>
                                  {index + 1}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(patient)}
                                    title="Edit bereavement milestones"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                                <TableCell
                                  className={classes.tableCell}
                                  align="center"
                                >
                                  {patient.bereavementCompleted && (
                                    <CheckIcon
                                      className={classes.completedIcon}
                                    />
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.patientCd || "N/A"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDate(patient.dateOfDeath)}
                                </TableCell>
                                {patient.milestones.map((milestone, idx) => (
                                  <React.Fragment key={idx}>
                                    {renderMilestoneCell(milestone)}
                                  </React.Fragment>
                                ))}
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={12} align="center">
                              No patients with death discharge found (within 13
                              months)
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>

          {/* Edit Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Edit Bereavement Milestones - {selectedPatient?.patientCd || "N/A"}
            </DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: "10px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_0}
                      onChange={(e) =>
                        handleFormChange("bereavement_month_0", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Month 0: Bereavement Card (7-14 days)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_1}
                      onChange={(e) =>
                        handleFormChange("bereavement_month_1", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Month 1: Follow-up Bereavement Card (30-40 days)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_3}
                      onChange={(e) =>
                        handleFormChange("bereavement_month_3", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Month 3: Check-in Card or Letter (90 days)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_6}
                      onChange={(e) =>
                        handleFormChange("bereavement_month_6", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Month 6: Mid-Year Support Card (6 months)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_9}
                      onChange={(e) =>
                        handleFormChange("bereavement_month_9", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Month 9: Supportive Outreach (9 months)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_12}
                      onChange={(e) =>
                        handleFormChange(
                          "bereavement_month_12",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Month 12: Anniversary Card (1 year)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.bereavement_month_13}
                      onChange={(e) =>
                        handleFormChange(
                          "bereavement_month_13",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Month 13: Closure/Transition Letter (13 months)"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="default">
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                color="primary"
                variant="contained"
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  patientUpdate: patientUpdateStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  updatePatient: (data) => dispatch(attemptToUpdatePatient(data)),
  resetUpdatePatient: () => dispatch(resetUpdatePatientState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BereavementTimelineFunction);

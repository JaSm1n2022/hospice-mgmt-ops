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
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import { Edit as EditIcon, Check as CheckIcon } from "@material-ui/icons";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToUpdatePatient } from "store/actions/patientAction";
import { resetUpdatePatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { patientUpdateStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import moment from "moment";

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
};

const useStyles = makeStyles(styles);

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;

function HopeFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    is_hope_completed: false,
    first_symptom: "",
    second_symptom: "",
    third_symptom: "",
  });
  const [hopeCompletedFilter, setHopeCompletedFilter] = useState("both"); // "both", "yes", "no"

  useEffect(() => {
    console.log("Hope - loading patient data");
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
      // Update local data source
      setDataSource((prevData) =>
        prevData.map((p) =>
          p.id === selectedPatient?.id
            ? {
                ...p,
                is_hope_completed: editFormData.is_hope_completed,
                first_symptom: editFormData.first_symptom,
                second_symptom: editFormData.second_symptom,
                third_symptom: editFormData.third_symptom,
              }
            : p
        )
      );

      alert("Patient data updated successfully");
      handleCloseDialog();
      props.resetUpdatePatient();
    } else if (props.patientUpdate?.status === ACTION_STATUSES.FAILED) {
      alert(
        "Failed to update patient data: " +
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
      // Filter patients with SOC >= 10/01/2025
      const cutoffDate = moment("2025-10-01");
      source = source.filter((p) => {
        if (!p.soc) return false;
        return moment(p.soc).isSameOrAfter(cutoffDate, "day");
      });
    }
    setDataSource(source);
    setIsPatientsCollection(false);
    props.resetListPatients();
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD/YYYY");
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD");
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
  };

  const getFilteredData = () => {
    if (!dataSource) return [];

    if (hopeCompletedFilter === "both") {
      return dataSource;
    } else if (hopeCompletedFilter === "yes") {
      return dataSource.filter(p => p.is_hope_completed === true);
    } else if (hopeCompletedFilter === "no") {
      return dataSource.filter(p => !p.is_hope_completed);
    }

    return dataSource;
  };

  const calculateTimeline = (socDate) => {
    if (!socDate) return {};
    const soc = moment(socDate);

    return {
      admitDate: soc.format("MM/DD/YYYY"),
      svfDue: soc.clone().add(2, "days").format("MM/DD/YYYY"),
      comprehensiveAssessment: soc.clone().add(5, "days").format("MM/DD/YYYY"),
      huvDateStart: soc.clone().add(6, "days"),
      huvDateEnd: soc.clone().add(15, "days"),
      sfvDueStart: soc.clone().add(8, "days"),
      sfvDueEnd: soc.clone().add(15, "days"),
      huv1Completed: soc.clone().add(15, "days").format("MM/DD/YYYY"),
      huv2DateStart: soc.clone().add(16, "days"),
      huv2DateEnd: soc.clone().add(30, "days"),
      sfv2DueStart: soc.clone().add(18, "days"),
      sfv2DueEnd: soc.clone().add(30, "days"),
      huv2Completed: soc.clone().add(30, "days").format("MM/DD/YYYY"),
    };
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      is_hope_completed: patient.is_hope_completed || false,
      first_symptom: patient.first_symptom || "",
      second_symptom: patient.second_symptom || "",
      third_symptom: patient.third_symptom || "",
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
      is_hope_completed: editFormData.is_hope_completed,
      first_symptom: editFormData.first_symptom,
      second_symptom: editFormData.second_symptom,
      third_symptom: editFormData.third_symptom,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile.name,
        userId: context.userProfile.id,
        date: new Date(),
      },
    };

    props.updatePatient(params);
  };

  isProcessDone = isPatientListDone;

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>Loading Patient Timeline...</div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Patient Timeline (HOPE)
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Patient milestones for SOC on or after 10/01/2025
                  </p>
                </CardHeader>
                <CardBody>
                  <Box mb={2}>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                      <InputLabel>HOPE Completed</InputLabel>
                      <Select
                        value={hopeCompletedFilter}
                        onChange={(e) => setHopeCompletedFilter(e.target.value)}
                        label="HOPE Completed"
                      >
                        <MenuItem value="both">Both</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell className={classes.headerCell}>
                            Action
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Hope Completed
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Patient
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Admit Date
                            <br />
                            (Day 0)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 1
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SVF DUE
                            <br />
                            (Day 2)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Comprehensive Assessment
                            <br />
                            (Day 5)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV Date
                            <br />
                            (Day 6-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 2
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV Due
                            <br />
                            (Day 8-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV1 Completed
                            <br />
                            (Day 15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Date
                            <br />
                            (Day 16-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Symptoms 3
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV2 Due
                            <br />
                            (Day 18-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Completed
                            <br />
                            (Day 30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Discharge
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredData().length > 0 ? (
                          getFilteredData().map((patient, index) => {
                            const timeline = calculateTimeline(patient.soc);
                            const isFirstSymptomMild = patient.first_symptom?.toUpperCase() === "MILD";
                            const isSecondSymptomMild = patient.second_symptom?.toUpperCase() === "MILD";
                            const isThirdSymptomMild = patient.third_symptom?.toUpperCase() === "MILD";

                            return (
                              <TableRow key={index} hover>
                                <TableCell className={classes.tableCell}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(patient)}
                                    title="Edit patient HOPE data"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="center">
                                  {patient.is_hope_completed && (
                                    <CheckIcon style={{ color: "#43a047" }} />
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.patientCd || "N/A"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.admitDate}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.first_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isFirstSymptomMild ? "N/A" : timeline.svfDue}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.comprehensiveAssessment}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huvDateStart,
                                    timeline.huvDateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.second_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isSecondSymptomMild
                                    ? "N/A"
                                    : formatDateRange(
                                        timeline.sfvDueStart,
                                        timeline.sfvDueEnd
                                      )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv1Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huv2DateStart,
                                    timeline.huv2DateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.third_symptom || "-"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {isThirdSymptomMild
                                    ? "N/A"
                                    : formatDateRange(
                                        timeline.sfv2DueStart,
                                        timeline.sfv2DueEnd
                                      )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv2Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.eoc ? formatDate(patient.eoc) : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={16} align="center">
                              No patient data found (SOC >= 10/01/2025)
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
              Edit HOPE Data - {selectedPatient?.patientCd || "N/A"}
            </DialogTitle>
            <DialogContent>
              <div style={{ paddingTop: "10px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData.is_hope_completed}
                      onChange={(e) =>
                        handleFormChange("is_hope_completed", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="HOPE Completed"
                />
                <TextField
                  fullWidth
                  label="Symptoms 1 (Between Admit Date and SVF Due)"
                  value={editFormData.first_symptom}
                  onChange={(e) =>
                    handleFormChange("first_symptom", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Symptoms 2 (Between HUV Date and SFV Due)"
                  value={editFormData.second_symptom}
                  onChange={(e) =>
                    handleFormChange("second_symptom", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Symptoms 3 (Between HUV2 Date and SFV Due)"
                  value={editFormData.third_symptom}
                  onChange={(e) =>
                    handleFormChange("third_symptom", e.target.value)
                  }
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
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

export default connect(mapStateToProps, mapDispatchToProps)(HopeFunction);

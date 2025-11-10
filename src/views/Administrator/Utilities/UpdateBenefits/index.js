import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { CircularProgress, Typography } from "@material-ui/core";
import { Refresh, CheckCircle, Warning } from "@material-ui/icons";
import { SupaContext } from "App";
import { connect } from "react-redux";

import BenefitPeriodCalculator from "utils/BenefitPeriodCalculator";
import Snackbar from "components/Snackbar/Snackbar";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { attemptToUpdatePatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { resetUpdatePatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { patientUpdateStateSelector } from "store/selectors/patientSelector";
import { ACTION_STATUSES } from "utils/constants";

const styles = {
  cardTitle: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  cardCategory: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  stats: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
  successText: {
    color: "#4caf50",
    fontWeight: 600,
  },
  warningText: {
    color: "#ff9800",
    fontWeight: 600,
  },
};

const useStyles = makeStyles(styles);

let isPatientsCollection = true;
let isUpdateCollection = true;
let patientsToUpdate = [];
let currentUpdateIndex = 0;

function UpdateBenefits(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("success");
  const [showNotification, setShowNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Cleanup: reset states when component unmounts
    return () => {
      props.resetListPatients();
      props.resetUpdatePatient();
    };
  }, []);

  useEffect(() => {
    if (
      isPatientsCollection &&
      props.patients &&
      props.patients.status === ACTION_STATUSES.SUCCEED
    ) {
      isPatientsCollection = false;
      props.resetListPatients();

      const patients = props.patients.data;

      if (!patients || patients.length === 0) {
        setMessage("No patients found to update");
        setMessageColor("info");
        setShowNotification(true);
        setLoading(false);
        return;
      }

      // Calculate current benefits for all patients
      const patientsWithBenefits =
        BenefitPeriodCalculator.batchCalculateCurrentBenefits(patients);

      // Prepare updates
      const updates = [];
      let skippedCount = 0;

      for (const patient of patientsWithBenefits) {
        if (patient.current_benefits !== null) {
          updates.push({
            id: patient.id,
            current_benefits: patient.current_benefits,
          });
        } else {
          skippedCount++;
        }
      }

      patientsToUpdate = updates;
      currentUpdateIndex = 0;

      setStats({
        total: patients.length,
        updated: 0,
        skipped: skippedCount,
      });

      // Start updating if there are patients to update
      if (updates.length > 0) {
        setIsUpdating(true);
        updateNextPatient();
      } else {
        setMessage("No patients to update");
        setMessageColor("info");
        setShowNotification(true);
        setLoading(false);
      }
    }
  }, [props.patients]);

  useEffect(() => {
    if (
      !isUpdateCollection &&
      props.updatePatientState &&
      props.updatePatientState.status === ACTION_STATUSES.SUCCEED
    ) {
      isUpdateCollection = true;
      props.resetUpdatePatient();

      // Update stats
      setStats((prevStats) => ({
        ...prevStats,
        updated: currentUpdateIndex,
      }));

      // Continue with next patient
      if (currentUpdateIndex < patientsToUpdate.length) {
        updateNextPatient();
      } else {
        // All updates complete
        setIsUpdating(false);
        setLoading(false);
        setMessage(
          `Successfully updated ${patientsToUpdate.length} patient records`
        );
        setMessageColor("success");
        setShowNotification(true);
      }
    }

    if (
      !isUpdateCollection &&
      props.updatePatientState &&
      props.updatePatientState.status === ACTION_STATUSES.FAILED
    ) {
      isUpdateCollection = true;
      props.resetUpdatePatient();

      console.error(
        `Error updating patient ${patientsToUpdate[currentUpdateIndex - 1]?.id}`
      );

      // Continue with next patient even if one fails
      if (currentUpdateIndex < patientsToUpdate.length) {
        updateNextPatient();
      } else {
        setIsUpdating(false);
        setLoading(false);
        setMessage(`Update completed with some errors`);
        setMessageColor("warning");
        setShowNotification(true);
      }
    }
  }, [props.updatePatientState]);

  const updateNextPatient = () => {
    if (currentUpdateIndex < patientsToUpdate.length) {
      const patient = patientsToUpdate[currentUpdateIndex];
      currentUpdateIndex++;

      const params = {
        id: patient.id,
        current_benefits: patient.current_benefits,
        companyId: context.userProfile?.companyId,
        updatedUser: {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        },
      };

      isUpdateCollection = false;
      props.updatePatient(params);
    }
  };

  const updateAllBenefits = () => {
    setLoading(true);
    setStats(null);
    isPatientsCollection = true;
    patientsToUpdate = [];
    currentUpdateIndex = 0;

    // Fetch all patients using saga
    props.listPatients({ companyId: context.userProfile?.companyId });
  };

  return (
    <>
      <Snackbar
        place="tc"
        color={messageColor}
        icon={messageColor === "success" ? CheckCircle : Warning}
        message={message}
        open={showNotification}
        closeNotification={() => setShowNotification(false)}
        close
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitle}>
                Update Current Benefits Period
              </h4>
              <p className={classes.cardCategory}>
                Batch update current_benefits field for all patients in Supabase
              </p>
            </CardHeader>
            <CardBody>
              <Typography variant="body1" gutterBottom>
                This utility will calculate and update the current benefit
                period for all patients based on:
              </Typography>
              <ul>
                <li>SOC (Start of Care) date</li>
                <li>EOC (End of Care) date (if applicable)</li>
                <li>Admitted benefits period</li>
              </ul>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Calculation Rules:</strong>
              </Typography>
              <ul>
                <li>Benefit 1: 90 days from SOC</li>
                <li>Benefit 2: 90 days from end of Benefit 1</li>
                <li>Benefit 3+: 60 days each</li>
                <li>
                  If EOC exists, calculates which benefit period the EOC date
                  falls into
                </li>
                <li>
                  If no EOC, calculates which benefit period today's date falls
                  into
                </li>
              </ul>

              <div style={{ marginTop: "20px" }}>
                <Button
                  color="primary"
                  onClick={updateAllBenefits}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Refresh />
                  }
                >
                  {loading ? "Updating..." : "Update All Patients"}
                </Button>
              </div>

              {stats && (
                <div className={classes.stats}>
                  <Typography variant="h6" gutterBottom>
                    Update Results
                  </Typography>
                  <div className={classes.statRow}>
                    <span>Total Patients:</span>
                    <strong>{stats.total}</strong>
                  </div>
                  <div className={classes.statRow}>
                    <span>Successfully Updated:</span>
                    <strong className={classes.successText}>
                      {stats.updated}
                    </strong>
                  </div>
                  {stats.skipped > 0 && (
                    <div className={classes.statRow}>
                      <span>Skipped (No SOC):</span>
                      <strong className={classes.warningText}>
                        {stats.skipped}
                      </strong>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  updatePatientState: patientUpdateStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  updatePatient: (data) => dispatch(attemptToUpdatePatient(data)),
  resetUpdatePatient: () => dispatch(resetUpdatePatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBenefits);

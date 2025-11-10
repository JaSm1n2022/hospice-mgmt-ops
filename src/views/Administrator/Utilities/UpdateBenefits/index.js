import React, { useState, useContext } from "react";
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

import BenefitPeriodCalculator from "utils/BenefitPeriodCalculator";
import Snackbar from "components/Snackbar/Snackbar";

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

function UpdateBenefits() {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("success");
  const [showNotification, setShowNotification] = useState(false);

  const updateAllBenefits = async () => {
    try {
      setLoading(true);
      setStats(null);

      // Fetch all patients
      const { data: patients, error: fetchError } = await supabase
        .from("patient")
        .select("*")
        .eq("companyId", context.userProfile?.companyId);

      if (fetchError) {
        throw new Error(`Error fetching patients: ${fetchError.message}`);
      }

      if (!patients || patients.length === 0) {
        setMessage("No patients found to update");
        setMessageColor("info");
        setShowNotification(true);
        return;
      }

      // Calculate current benefits for all patients
      const patientsWithBenefits = BenefitPeriodCalculator.batchCalculateCurrentBenefits(
        patients
      );

      // Prepare updates
      const updates = [];
      let updatedCount = 0;
      let skippedCount = 0;

      for (const patient of patientsWithBenefits) {
        if (patient.current_benefits !== null) {
          updates.push({
            id: patient.id,
            current_benefits: patient.current_benefits,
          });
          updatedCount++;
        } else {
          skippedCount++;
        }
      }

      // Batch update using Supabase
      if (updates.length > 0) {
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from("patient")
            .update({ current_benefits: update.current_benefits })
            .eq("id", update.id);

          if (updateError) {
            console.error(`Error updating patient ${update.id}:`, updateError);
          }
        }
      }

      setStats({
        total: patients.length,
        updated: updatedCount,
        skipped: skippedCount,
      });

      setMessage(`Successfully updated ${updatedCount} patient records`);
      setMessageColor("success");
      setShowNotification(true);
    } catch (error) {
      console.error("Error updating benefits:", error);
      setMessage(`Error: ${error.message}`);
      setMessageColor("danger");
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
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

export default UpdateBenefits;

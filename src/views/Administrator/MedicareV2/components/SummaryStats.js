import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Box } from "@material-ui/core";
import {
  TrendingUp,
  AttachMoney,
  AccountBalance,
  MonetizationOn,
  People,
  PersonAdd,
  CheckCircle,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    marginBottom: theme.spacing(3),
  },
  statCard: {
    padding: theme.spacing(3),
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: theme.spacing(1),
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    },
  },
  statCard2024: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  statCard2025: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  statCardPositive: {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  statCardReadyToUse: {
    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  statCardOverview: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: theme.spacing(2),
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    opacity: 0.9,
    marginBottom: theme.spacing(1),
  },
  value: {
    fontSize: "1.75rem",
    fontWeight: 700,
    lineHeight: 1.2,
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}));

const SummaryStats = ({ data }) => {
  const classes = useStyles();

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate totals - aggregate caps, patient counts, admissions, and discharges by FY
  const calculateTotals = () => {
    if (!data || data.length === 0) {
      return {
        totalPatients: 0,
        totalActive: 0,
        totalInactive: 0,
        fy2025TotalAggregate: 0,
        fy2025TotalUsed: 0,
        fy2025TotalAvailable: 0,
        fy2025AvailableCapReadyToUse: 0,
        fy2025AdmittedCount: 0,
        fy2025DischargedCount: 0,
        fy2026TotalAggregate: 0,
        fy2026TotalUsed: 0,
        fy2026TotalAvailable: 0,
        fy2026AvailableCapReadyToUse: 0,
        fy2026AdmittedCount: 0,
        fy2026DischargedCount: 0,
      };
    }

    const totals = data.reduce(
      (acc, patient) => {
        // Count total patients
        acc.totalPatients += 1;

        // Count active vs inactive (inactive = has EOC date)
        if (!patient.eoc || patient.eoc === "N/A") {
          acc.totalActive += 1;
        } else {
          acc.totalInactive += 1;
        }

        // FY 2025: 2024-10-01 to 2025-09-30 (ends in 2025)
        // FY 2026: 2025-10-01 to 2026-09-30 (ends in 2026)
        // Only aggregate if patient's SOC is within each FY period
        if (patient.soc) {
          const socDate = new Date(`${patient.soc} 17:00`);
          const fy2025Start = new Date("2024-10-01 17:00");
          const fy2025End = new Date("2025-09-30 17:00");
          const fy2026Start = new Date("2025-10-01 17:00");
          const fy2026End = new Date("2026-09-30 17:00");

          // Check if SOC is in FY 2025 (2024-10-01 to 2025-09-30)
          if (socDate >= fy2025Start && socDate <= fy2025End) {
            // Exclude patients from aggregate cap calculations if:
            // 1. Their allowed cap is "0.00" (meaning prior hospice exceeded cap or total usage exceeded cap)
            const allowedCap = parseFloat(patient.allowedCapFirstPeriod || 0);

            if (allowedCap > 0) {
              // Only aggregate the admission FY cap (firstPeriodCap), not continuation caps
              acc.fy2025TotalAggregate += parseFloat(patient.firstPeriodCap || 0);
              acc.fy2025TotalUsed += parseFloat(patient.usedCapFirstPeriod || 0);
              acc.fy2025TotalAvailable += parseFloat(patient.availableCapFirstPeriod || 0);
            }

            // Calculate Available Cap Ready to Use (death discharge patients only, positive available cap only)
            if (
              patient.eoc_discharge === "Death Discharge" &&
              parseFloat(patient.availableCapFirstPeriod || 0) > 0
            ) {
              acc.fy2025AvailableCapReadyToUse += parseFloat(
                patient.availableCapFirstPeriod || 0
              );
            }

            acc.fy2025AdmittedCount += 1;

            // Count discharges (any patient admitted in FY 2025 who has EOC - is inactive)
            if (patient.eoc && patient.eoc !== "N/A") {
              acc.fy2025DischargedCount += 1;
            }
          }

          // Check if SOC is in FY 2026 (2025-10-01 to 2026-09-30)
          if (socDate >= fy2026Start && socDate <= fy2026End) {
            // Exclude patients from aggregate cap calculations if:
            // 1. Their allowed cap is "0.00" (meaning prior hospice exceeded cap or total usage exceeded cap)
            const allowedCap = parseFloat(patient.allowedCapFirstPeriod || 0);

            if (allowedCap > 0) {
              // Only aggregate the admission FY cap (firstPeriodCap), not continuation caps
              acc.fy2026TotalAggregate += parseFloat(patient.firstPeriodCap || 0);
              acc.fy2026TotalUsed += parseFloat(patient.usedCapFirstPeriod || 0);
              acc.fy2026TotalAvailable += parseFloat(patient.availableCapFirstPeriod || 0);
            }

            // Calculate Available Cap Ready to Use (death discharge patients only, positive available cap only)
            if (
              patient.eoc_discharge === "Death Discharge" &&
              parseFloat(patient.availableCapFirstPeriod || 0) > 0
            ) {
              acc.fy2026AvailableCapReadyToUse += parseFloat(
                patient.availableCapFirstPeriod || 0
              );
            }

            acc.fy2026AdmittedCount += 1;

            // Count discharges (any patient admitted in FY 2026 who has EOC - is inactive)
            if (patient.eoc && patient.eoc !== "N/A") {
              acc.fy2026DischargedCount += 1;
            }
          }
        }

        return acc;
      },
      {
        totalPatients: 0,
        totalActive: 0,
        totalInactive: 0,
        fy2025TotalAggregate: 0,
        fy2025TotalUsed: 0,
        fy2025TotalAvailable: 0,
        fy2025AvailableCapReadyToUse: 0,
        fy2025AdmittedCount: 0,
        fy2025DischargedCount: 0,
        fy2026TotalAggregate: 0,
        fy2026TotalUsed: 0,
        fy2026TotalAvailable: 0,
        fy2026AvailableCapReadyToUse: 0,
        fy2026AdmittedCount: 0,
        fy2026DischargedCount: 0,
      }
    );

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className={classes.summaryContainer}>
      {/* Overview Section */}
      <Typography className={classes.sectionTitle}>
        Patient Overview
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={`${classes.statCard} ${classes.statCardOverview}`} elevation={3}>
            <Box className={classes.iconBox}>
              <People className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Total Patients
            </Typography>
            <Typography className={classes.value}>
              {totals.totalPatients}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper className={`${classes.statCard} ${classes.statCardPositive}`} elevation={3}>
            <Box className={classes.iconBox}>
              <People className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Active Patients
            </Typography>
            <Typography className={classes.value}>
              {totals.totalActive}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper className={`${classes.statCard} ${classes.statCard2024}`} elevation={3}>
            <Box className={classes.iconBox}>
              <People className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Inactive Patients
            </Typography>
            <Typography className={classes.value}>
              {totals.totalInactive}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography className={classes.sectionTitle}>
        FY 2025 Summary
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCardOverview}`} elevation={3}>
            <Box className={classes.iconBox}>
              <PersonAdd className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Admissions
            </Typography>
            <Typography className={classes.value}>
              {totals.fy2025AdmittedCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2024}`} elevation={3}>
            <Box className={classes.iconBox}>
              <People className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Discharges
            </Typography>
            <Typography className={classes.value}>
              {totals.fy2025DischargedCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2024}`} elevation={3}>
            <Box className={classes.iconBox}>
              <AccountBalance className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Aggregate Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2025TotalAggregate)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2024}`} elevation={3}>
            <Box className={classes.iconBox}>
              <TrendingUp className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Used Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2025TotalUsed)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2024}`} elevation={3}>
            <Box className={classes.iconBox}>
              <MonetizationOn className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Available Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2025TotalAvailable)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCardReadyToUse}`} elevation={3}>
            <Box className={classes.iconBox}>
              <CheckCircle className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Available Cap Ready to Use
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2025AvailableCapReadyToUse)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography className={classes.sectionTitle}>
        FY 2026 Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCardOverview}`} elevation={3}>
            <Box className={classes.iconBox}>
              <PersonAdd className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Admissions
            </Typography>
            <Typography className={classes.value}>
              {totals.fy2026AdmittedCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2025}`} elevation={3}>
            <Box className={classes.iconBox}>
              <People className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Discharges
            </Typography>
            <Typography className={classes.value}>
              {totals.fy2026DischargedCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2025}`} elevation={3}>
            <Box className={classes.iconBox}>
              <AccountBalance className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Aggregate Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2026TotalAggregate)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2025}`} elevation={3}>
            <Box className={classes.iconBox}>
              <TrendingUp className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Used Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2026TotalUsed)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCard2025}`} elevation={3}>
            <Box className={classes.iconBox}>
              <MonetizationOn className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Available Cap
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2026TotalAvailable)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} style={{ flexBasis: '20%', maxWidth: '20%' }}>
          <Paper className={`${classes.statCard} ${classes.statCardReadyToUse}`} elevation={3}>
            <Box className={classes.iconBox}>
              <CheckCircle className={classes.icon} />
            </Box>
            <Typography className={classes.label}>
              Available Cap Ready to Use
            </Typography>
            <Typography className={classes.value}>
              {formatCurrency(totals.fy2026AvailableCapReadyToUse)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default SummaryStats;

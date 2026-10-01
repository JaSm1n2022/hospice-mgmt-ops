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
import Helper from "utils/helper";

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

  // Dashboard always shows the last 2 fiscal years (current FY + previous FY),
  // computed dynamically from today's date (FY = Oct 1 - Sep 30).
  const currFY = Helper.getCurrentFiscalYear();
  const prevFY = currFY - 1;

  const emptyTotals = () => ({
    totalPatients: 0,
    totalActive: 0,
    totalInactive: 0,
    prevFYTotalAggregate: 0,
    prevFYTotalUsed: 0,
    prevFYTotalAvailable: 0,
    prevFYAvailableCapReadyToUse: 0,
    prevFYAdmittedCount: 0,
    prevFYDischargedCount: 0,
    currFYTotalAggregate: 0,
    currFYTotalUsed: 0,
    currFYTotalAvailable: 0,
    currFYAvailableCapReadyToUse: 0,
    currFYAdmittedCount: 0,
    currFYDischargedCount: 0,
  });

  // Calculate totals - aggregate caps, patient counts, admissions, and discharges
  // for the last 2 fiscal years (prevFY and currFY)
  const calculateTotals = () => {
    if (!data || data.length === 0) {
      return emptyTotals();
    }

    const totals = data.reduce((acc, patient) => {
      // Count total patients
      acc.totalPatients += 1;

      // Count active vs inactive (inactive = has EOC date)
      if (!patient.eoc || patient.eoc === "N/A") {
        acc.totalActive += 1;
      } else {
        acc.totalInactive += 1;
      }

      if (patient.soc) {
        const patientFY = Helper.getFiscalYearForDate(`${patient.soc} 17:00`);
        const allowedCap = parseFloat(patient.allowedCapFirstPeriod || 0);
        const usedTotal =
          parseFloat(patient.usedCapFirstPeriod || 0) +
          parseFloat(patient.usedCapSecondPeriod || 0);
        const isDeathDischargeWithCap =
          patient.eoc_discharge === "Death Discharge" &&
          parseFloat(patient.availableCapFirstPeriod || 0) > 0;
        const isDischarged = patient.eoc && patient.eoc !== "N/A";

        const prefix =
          patientFY === prevFY ? "prevFY" : patientFY === currFY ? "currFY" : null;

        if (prefix) {
          if (allowedCap > 0) {
            // Only aggregate the admission FY cap (firstPeriodCap), not continuation caps
            acc[`${prefix}TotalAggregate`] += parseFloat(patient.firstPeriodCap || 0);
            acc[`${prefix}TotalUsed`] += usedTotal;
            acc[`${prefix}TotalAvailable`] += parseFloat(patient.availableCapFirstPeriod || 0);
          }

          if (isDeathDischargeWithCap) {
            acc[`${prefix}AvailableCapReadyToUse`] += parseFloat(
              patient.availableCapFirstPeriod || 0
            );
          }

          acc[`${prefix}AdmittedCount`] += 1;

          if (isDischarged) {
            acc[`${prefix}DischargedCount`] += 1;
          }
        }
      }

      return acc;
    }, emptyTotals());

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
        FY {prevFY} Summary
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
              {totals.prevFYAdmittedCount}
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
              {totals.prevFYDischargedCount}
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
              {formatCurrency(totals.prevFYTotalAggregate)}
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
              {formatCurrency(totals.prevFYTotalUsed)}
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
              {formatCurrency(totals.prevFYTotalAvailable)}
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
              {formatCurrency(totals.prevFYAvailableCapReadyToUse)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography className={classes.sectionTitle}>
        FY {currFY} Summary
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
              {totals.currFYAdmittedCount}
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
              {totals.currFYDischargedCount}
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
              {formatCurrency(totals.currFYTotalAggregate)}
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
              {formatCurrency(totals.currFYTotalUsed)}
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
              {formatCurrency(totals.currFYTotalAvailable)}
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
              {formatCurrency(totals.currFYAvailableCapReadyToUse)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default SummaryStats;

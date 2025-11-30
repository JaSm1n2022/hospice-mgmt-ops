import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Divider,
  Box,
} from "@material-ui/core";
import {
  Person,
  CalendarToday,
  LocalHospital,
  AttachMoney,
  Timeline,
} from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  cardHeaderActive: {
    background: "linear-gradient(60deg, #66bb6a, #43a047)",
    color: "white",
    padding: theme.spacing(2),
  },
  cardHeaderInactive: {
    background: "linear-gradient(60deg, #f44336, #e91e63)",
    color: "white",
    padding: theme.spacing(2),
  },
  cardContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
    fontWeight: 600,
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "#666",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0.5, 0),
  },
  label: {
    fontSize: "0.875rem",
    color: "#666",
    fontWeight: 500,
  },
  value: {
    fontSize: "0.875rem",
    color: "#333",
    fontWeight: 600,
  },
  positiveValue: {
    color: "#43a047",
  },
  negativeValue: {
    color: "#e53935",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  icon: {
    fontSize: "1rem",
  },
}));

const MedicareCard = ({ data }) => {
  const classes = useStyles();

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date;
  };

  // Determine if patient is active or inactive based on EOC
  const isActive = !data.eoc || data.eoc === "N/A";
  const statusText = isActive ? "Active" : "Inactive";

  // Determine which FY period the patient belongs to based on SOC
  // FY 2024: 2023-10-01 to 2024-09-30 (ends in 2024)
  // FY 2025: 2024-10-01 to 2025-09-30 (ends in 2025)
  // FY 2026: 2025-10-01 to 2026-09-30 (ends in 2026)
  const getFiscalYear = () => {
    if (!data.soc) return null;
    const socDate = new Date(`${data.soc} 17:00`);
    const fy2024Start = new Date("2023-10-01 17:00");
    const fy2024End = new Date("2024-09-30 17:00");
    const fy2025Start = new Date("2024-10-01 17:00");
    const fy2025End = new Date("2025-09-30 17:00");
    const fy2026Start = new Date("2025-10-01 17:00");
    const fy2026End = new Date("2026-09-30 17:00");

    if (socDate >= fy2024Start && socDate <= fy2024End) {
      return "FY2024";
    } else if (socDate >= fy2025Start && socDate <= fy2025End) {
      return "FY2025";
    } else if (socDate >= fy2026Start && socDate <= fy2026End) {
      return "FY2026";
    }
    return null;
  };

  const fiscalYear = getFiscalYear();

  // Get benefit labels based on admission fiscal year
  const getBenefitLabels = () => {
    const baseYear =
      fiscalYear === "FY2024" ? 2024 : fiscalYear === "FY2025" ? 2025 : 2026;
    return {
      first: `FY ${baseYear}`,
      second: `FY ${baseYear + 1}`,
      third: `FY ${baseYear + 2}`,
      fourth: `FY ${baseYear + 3}`,
    };
  };

  const benefitLabels = getBenefitLabels();

  return (
    <Card className={classes.card}>
      <CardHeader
        className={
          isActive ? classes.cardHeaderActive : classes.cardHeaderInactive
        }
        title={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Person />
              <Typography variant="h6">{data.clientName || "N/A"}</Typography>
            </Box>
            <Chip
              label={statusText}
              size="small"
              className={classes.statusChip}
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
                color: "white",
              }}
            />
          </Box>
        }
        subheader={
          <Typography
            variant="body2"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Patient # {data.patientCd || "N/A"}
          </Typography>
        }
      />

      <CardContent className={classes.cardContent}>
        {/* Basic Information */}
        <Typography className={classes.sectionTitle}>
          <CalendarToday className={classes.icon} />
          Care Period
        </Typography>
        <div className={classes.dataRow}>
          <span className={classes.label}>SOC:</span>
          <span className={classes.value}>{formatDate(data.soc)}</span>
        </div>
        <div className={classes.dataRow}>
          <span className={classes.label}>EOC:</span>
          <span className={classes.value}>{formatDate(data.eoc)}</span>
        </div>
        {data.eoc && (
          <div className={classes.dataRow}>
            <span className={classes.label}>Discharge Reason:</span>
            <span className={classes.value}>{data.eoc_discharge}</span>
          </div>
        )}
        <div className={classes.dataRow}>
          <span className={classes.label}>Insurance:</span>
          <span className={classes.value}>{data.insurance || "N/A"}</span>
        </div>
        {data.hasPriorHospice && (
          <div className={classes.dataRow}>
            <span className={classes.label}>Prior Hospice:</span>
            <Chip
              label="Yes"
              size="small"
              style={{
                backgroundColor: "#ff9800",
                color: "white",
                fontWeight: 600,
              }}
            />
          </div>
        )}
        {data.hasPriorHospice && data.priorDayCare > 0 && (
          <div className={classes.dataRow}>
            <span className={classes.label}>Prior Total Day Care:</span>
            <span className={classes.value}>{data.priorDayCare} days</span>
          </div>
        )}

        <Divider className={classes.divider} />

        {/* Benefits Information */}
        <Typography className={classes.sectionTitle}>
          <LocalHospital className={classes.icon} />
          Benefits Admitted (Benefit Period {data.benefitCount || 0})
        </Typography>
        <Grid container spacing={1}>
          {data.first90Benefit && (
            <Grid item>
              <Chip
                label={`${benefitLabels.first}: ${data.first90Benefit} days`}
                size="small"
                color="primary"
                className={classes.chip}
              />
            </Grid>
          )}
          {data.second90Benefit && (
            <Grid item>
              <Chip
                label={`${benefitLabels.second}: ${data.second90Benefit} days`}
                size="small"
                color="primary"
                className={classes.chip}
              />
            </Grid>
          )}
          {data.third60Benefit && (
            <Grid item>
              <Chip
                label={`${benefitLabels.third}: ${data.third60Benefit} days`}
                size="small"
                color="primary"
                className={classes.chip}
              />
            </Grid>
          )}
          {data.fourth60Benefit && (
            <Grid item>
              <Chip
                label={`${benefitLabels.fourth}: ${data.fourth60Benefit} days`}
                size="small"
                color="primary"
                className={classes.chip}
              />
            </Grid>
          )}
        </Grid>

        <Divider className={classes.divider} />

        {/* FY Cap - Show admission FY cap and continuation FY cap if applicable */}
        {fiscalYear && (
          <>
            <Typography className={classes.sectionTitle}>
              <AttachMoney className={classes.icon} />
              Fiscal Year Cap (Admitted in{" "}
              {fiscalYear === "FY2024"
                ? "FY 2024"
                : fiscalYear === "FY2025"
                ? "FY 2025"
                : "FY 2026"}
              )
            </Typography>
            <div className={classes.dataRow}>
              <span className={classes.label}>
                {fiscalYear === "FY2024"
                  ? "FY 2024 Cap:"
                  : fiscalYear === "FY2025"
                  ? "FY 2025 Cap:"
                  : "FY 2026 Cap:"}
              </span>
              <span className={classes.value}>
                {formatCurrency(data.firstPeriodCap)}
              </span>
            </div>
            {data.secondPeriodDays > 0 && data.secondPeriodCap && (
              <div className={classes.dataRow}>
                <span className={classes.label}>
                  {fiscalYear === "FY2024"
                    ? "FY 2025 Cap (Continued):"
                    : fiscalYear === "FY2025"
                    ? "FY 2026 Cap (Continued):"
                    : "FY 2027 Cap (Continued):"}
                </span>
                <span className={classes.value}>
                  {formatCurrency(data.secondPeriodCap)}
                </span>
              </div>
            )}
            {data.hasPriorHospice && data.priorDayCare > 0 && (
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#1976d2",
                }}
              >
                ℹ️ FY cap apportioned including prior hospice days (
                {data.priorDayCare} days)
              </div>
            )}

            <Divider className={classes.divider} />
          </>
        )}

        {/* Previous Hospice Agency Used Cap - Only show if prior hospice exists */}
        {data.hasPriorHospice && data.priorDayCare > 0 && (
          <>
            <Typography className={classes.sectionTitle}>
              <LocalHospital className={classes.icon} />
              Previous Hospice Agency
            </Typography>
            <div className={classes.dataRow}>
              <span className={classes.label}>Prior Days:</span>
              <span className={classes.value}>{data.priorDayCare} days</span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Allowed Cap (Apportioned):</span>
              <span className={classes.value}>
                {formatCurrency(data.priorHospiceAllowedCap)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Estimated Used Cap:</span>
              <span className={classes.value}>
                {formatCurrency(data.priorHospiceUsedCap)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Available Cap:</span>
              <span
                className={`${classes.value} ${
                  parseFloat(data.priorHospiceAvailableCap || 0) >= 0
                    ? classes.positiveValue
                    : classes.negativeValue
                }`}
              >
                {formatCurrency(data.priorHospiceAvailableCap)}
              </span>
            </div>
            {parseFloat(data.priorHospiceAvailableCap || 0) > 0 ? (
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#2e7d32",
                }}
              >
                ✓ Available cap included in total (transfer patient)
              </div>
            ) : (
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#fff3e0",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#e65100",
                }}
              >
                ℹ️ No available cap to transfer (negative cap set to zero)
              </div>
            )}

            <Divider className={classes.divider} />
          </>
        )}

        {/* Utilization Summary */}
        <Typography className={classes.sectionTitle}>
          <Timeline className={classes.icon} />
          Utilization Summary
        </Typography>
        <div className={classes.dataRow}>
          <span className={classes.label}>Total # of Day Care:</span>
          <span className={classes.value}>{data.totalDayCare || 0} days</span>
        </div>
        <div className={classes.dataRow}>
          <span className={classes.label}>Total Claim:</span>
          <span className={classes.value}>
            {formatCurrency(data.totalClaim)}
          </span>
        </div>

        <Divider className={classes.divider} />

        {/* First FY Period Breakdown - Based on admission FY */}
        {fiscalYear && (
          <>
            <Typography className={classes.sectionTitle}>
              {fiscalYear === "FY2024"
                ? "FY 2024 Breakdown"
                : fiscalYear === "FY2025"
                ? "FY 2025 Breakdown"
                : "FY 2026 Breakdown"}
            </Typography>
            <div className={classes.dataRow}>
              <span className={classes.label}>Accumulated Days:</span>
              <span className={classes.value}>
                {data.firstPeriodDays || 0} days
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Used Cap:</span>
              <span className={classes.value}>
                {formatCurrency(data.usedCapFirstPeriod)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Allowed Cap (Apportioned):</span>
              <span className={classes.value}>
                {formatCurrency(data.allowedCapFirstPeriod)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Available Cap:</span>
              <span
                className={`${classes.value} ${
                  parseFloat(data.availableCapFirstPeriod || 0) >= 0
                    ? classes.positiveValue
                    : classes.negativeValue
                }`}
              >
                {formatCurrency(data.availableCapFirstPeriod)}
              </span>
            </div>
          </>
        )}

        {/* Second FY Period Breakdown - Only if patient continues into next FY */}
        {fiscalYear && data.secondPeriodDays > 0 && (
          <>
            <Divider className={classes.divider} />
            <Typography className={classes.sectionTitle}>
              {fiscalYear === "FY2024"
                ? "FY 2025 Breakdown (Continued)"
                : fiscalYear === "FY2025"
                ? "FY 2026 Breakdown (Continued)"
                : "FY 2027 Breakdown (Continued)"}
            </Typography>
            <div className={classes.dataRow}>
              <span className={classes.label}>Accumulated Days:</span>
              <span className={classes.value}>
                {data.secondPeriodDays || 0} days
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Used Cap:</span>
              <span className={classes.value}>
                {formatCurrency(data.usedCapSecondPeriod)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Allowed Cap (Apportioned):</span>
              <span className={classes.value}>
                {formatCurrency(data.allowedCapSecondPeriod)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Available Cap:</span>
              <span
                className={`${classes.value} ${
                  parseFloat(data.availableCapSecondPeriod || 0) >= 0
                    ? classes.positiveValue
                    : classes.negativeValue
                }`}
              >
                {formatCurrency(data.availableCapSecondPeriod)}
              </span>
            </div>
          </>
        )}

        {/* POST-DISCHARGE (EOC) - Only show if post-discharge days exist */}
        {data.postDischargeDays > 0 && (
          <>
            <Divider className={classes.divider} />
            <Typography className={classes.sectionTitle}>
              <LocalHospital className={classes.icon} />
              POST-DISCHARGE (EOC)
            </Typography>
            <div className={classes.dataRow}>
              <span className={classes.label}>Post-Discharge Days:</span>
              <span className={classes.value}>
                {data.postDischargeDays} days
              </span>
            </div>
            {data.new_hospice_dod && (
              <div className={classes.dataRow}>
                <span className={classes.label}>Date of Death:</span>
                <span className={classes.value}>
                  {moment(data.new_hospice_dod).format("MM/DD/YYYY")}
                </span>
              </div>
            )}
            <div className={classes.dataRow}>
              <span className={classes.label}>Allowed Cap (Apportioned):</span>
              <span className={classes.value}>
                {formatCurrency(data.postDischargeAllowedCap)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Estimated Used Cap:</span>
              <span className={classes.value}>
                {formatCurrency(data.postDischargeUsedCap)}
              </span>
            </div>
            <div className={classes.dataRow}>
              <span className={classes.label}>Available Cap:</span>
              <span
                className={`${classes.value} ${
                  parseFloat(data.postDischargeAvailableCap || 0) >= 0
                    ? classes.positiveValue
                    : classes.negativeValue
                }`}
              >
                {formatCurrency(data.postDischargeAvailableCap)}
              </span>
            </div>
            <div
              style={{
                padding: "8px",
                backgroundColor: "#fff3e0",
                borderRadius: "4px",
                marginTop: "8px",
                fontSize: "0.75rem",
                color: "#e65100",
              }}
            >
              ℹ️ Not included in total used cap, revenue, or available cap
            </div>
          </>
        )}

        {/* Warning for non-death discharge without post-discharge days */}
        {data.eoc &&
          !data.postDischargeDays &&
          data.eoc_discharge &&
          data.eoc_discharge !== "Death Discharge" &&
          !data.eoc_discharge.toLowerCase().includes("death") && (
            <>
              <Divider className={classes.divider} />
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#ffebee",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#c62828",
                  fontWeight: 500,
                  border: "1px solid #ef5350",
                }}
              >
                ⚠️ Patient discharged (non-death). Please review the
                Post-Discharge (EOC) number of care days. Verify eligibility and
                update the patient's post-discharge total days in the patient
                profile.
              </div>
            </>
          )}

        {/* Apportionment complete statement - Shows independently of POST-DISCHARGE section */}
        {(() => {
          // Priority 1: Check post-discharge Date of Death (new_hospice_dod)
          if (data.new_hospice_dod) {
            return (
              <>
                <Divider className={classes.divider} />
                <div
                  style={{
                    padding: "8px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "4px",
                    marginTop: "8px",
                    fontSize: "0.75rem",
                    color: "#2e7d32",
                    fontWeight: 500,
                  }}
                >
                  ✓ The patient passed away on{" "}
                  {moment(data.new_hospice_dod).format("MM/DD/YYYY")}, so
                  apportionment is now complete.
                </div>
              </>
            );
          }

          // Priority 2: If no new_hospice_dod, check EOC with death discharge
          if (
            data.eoc &&
            data.eoc_discharge &&
            (data.eoc_discharge === "Death Discharge" ||
              data.eoc_discharge.toLowerCase().includes("death"))
          ) {
            return (
              <>
                <Divider className={classes.divider} />
                <div
                  style={{
                    padding: "8px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "4px",
                    marginTop: "8px",
                    fontSize: "0.75rem",
                    color: "#2e7d32",
                    fontWeight: 500,
                  }}
                >
                  ✓ The patient passed away on{" "}
                  {moment(data.eoc).format("MM/DD/YYYY")}, so apportionment is
                  now complete.
                </div>
              </>
            );
          }

          return null;
        })()}
      </CardContent>
    </Card>
  );
};

export default MedicareCard;

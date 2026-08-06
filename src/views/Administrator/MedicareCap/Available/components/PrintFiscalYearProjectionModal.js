import React from "react";
import { Modal, makeStyles, CircularProgress } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import FiscalYearProjectionDocument from "./FiscalYearProjectionDocument";
import moment from "moment";
import AvailableHandler from "./AvailableHandler";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "600px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    outline: "none",
  },
  header: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    cursor: "pointer",
    fontSize: "24px",
  },
  content: {
    padding: "30px",
  },
  infoSection: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  infoLabel: {
    color: "#666",
  },
  infoValue: {
    fontWeight: "bold",
    color: "#000",
  },
  warningText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
  positiveText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#4caf50",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  note: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#999",
    fontStyle: "italic",
  },
}));

function PrintFiscalYearProjectionModal({ isOpen, onClose, patientsData, handler }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  // Calculate projections using the provided handler or default to AvailableHandler
  const projectionHandler = handler || AvailableHandler;
  const projectedData = projectionHandler.calculateFiscalYearProjection(patientsData);

  // Calculate summary statistics
  const currentDate = moment();
  const currentYear = currentDate.year();
  const fiscalYearEnd = moment(`${currentYear}-09-30`);
  if (currentDate.isAfter(fiscalYearEnd)) {
    fiscalYearEnd.add(1, "year");
  }

  // Separate active and death discharge patients
  const activePatients = projectedData.filter((p) => p.isActiveProjection);
  const deathDischargePatients = projectedData.filter((p) => p.isDeathDischarge);

  // Get EOC non-death patients from original data
  const eocNonDeathPatients = patientsData.filter((p) => {
    if (!p.eoc || p.eoc === "N/A") return false;
    return p.eoc_discharge !== "Death Discharge";
  });

  const summary = {
    fiscalYearEnd: fiscalYearEnd.format("YYYY-MM-DD"),
    totalActivePatients: activePatients.length,
    totalDeathDischargePatients: deathDischargePatients.length,
    totalEocNonDeathPatients: eocNonDeathPatients.length,
    totalPatients: projectedData.length,

    // Active patients projected values
    activeProjectedUsedCap: activePatients
      .reduce((sum, p) => sum + parseFloat(p.projectedTotalClaim || 0), 0)
      .toFixed(2),
    activeProjectedAllowedCap: activePatients
      .reduce(
        (sum, p) =>
          sum +
          parseFloat(p.projectedAllowedCapFirstPeriod || 0) +
          parseFloat(p.projectedAllowedCapSecondPeriod || 0),
        0
      )
      .toFixed(2),

    // Death discharge available cap
    deathDischargeAvailableCap: deathDischargePatients
      .reduce((sum, p) => sum + parseFloat(p.projectedTotalAvailableCap || 0), 0)
      .toFixed(2),

    // EOC non-death available cap (can be positive or negative)
    eocNonDeathAvailableCap: eocNonDeathPatients
      .reduce(
        (sum, p) =>
          sum +
          parseFloat(p.availableCapFirstPeriod || 0) +
          parseFloat(p.availableCapSecondPeriod || 0),
        0
      )
      .toFixed(2),

    // Combined totals
    totalProjectedUsedCap: projectedData
      .reduce((sum, p) => sum + parseFloat(p.projectedTotalClaim || 0), 0)
      .toFixed(2),
    totalProjectedAllowedCap: projectedData
      .reduce(
        (sum, p) =>
          sum +
          parseFloat(p.projectedAllowedCapFirstPeriod || 0) +
          parseFloat(p.projectedAllowedCapSecondPeriod || 0),
        0
      )
      .toFixed(2),
  };

  // Calculate active patients' projected available cap
  summary.activeProjectedAvailableCap = (
    parseFloat(summary.activeProjectedAllowedCap) -
    parseFloat(summary.activeProjectedUsedCap)
  ).toFixed(2);

  // Total projected available cap = active projected available + death discharge available
  summary.totalProjectedAvailableCap = (
    parseFloat(summary.activeProjectedAvailableCap) +
    parseFloat(summary.deathDischargeAvailableCap)
  ).toFixed(2);

  const isCapAvailable = parseFloat(summary.totalProjectedAvailableCap) >= 0;

  const fileName = `Medicare_Cap_FY_Projection_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  // Limit to prevent freezing with large datasets
  const limitedData = projectedData.slice(0, 50);
  const isLimited = projectedData.length > 50;

  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    const numValue = parseFloat(value);
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Fiscal Year Projection</h3>
          <Clear className={classes.closeButton} onClick={onClose} />
        </div>
        <div className={classes.content}>
          {error ? (
            <div style={{ color: "red", marginBottom: 20 }}>
              <p>Error: {error.message || error.toString()}</p>
              <p>Please try again.</p>
            </div>
          ) : (
            <>
              <div className={classes.infoSection}>
                <div className={classes.infoTitle}>Projection Summary</div>
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>Fiscal Year End:</span>
                  <span className={classes.infoValue}>{summary.fiscalYearEnd}</span>
                </div>
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>Active Patients (Projected):</span>
                  <span className={classes.infoValue}>
                    {summary.totalActivePatients}
                  </span>
                </div>
                {summary.totalEocNonDeathPatients > 0 && (
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel}>EOC (Non-Death) Patients:</span>
                    <span className={classes.infoValue}>
                      {summary.totalEocNonDeathPatients}
                    </span>
                  </div>
                )}
                {summary.totalDeathDischargePatients > 0 && (
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel}>Death Discharge w/ Available Cap:</span>
                    <span className={classes.infoValue}>
                      {summary.totalDeathDischargePatients}
                    </span>
                  </div>
                )}
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>Total Patients:</span>
                  <span className={classes.infoValue}>
                    {limitedData.length}
                    {isLimited && (
                      <span style={{ color: "orange", fontSize: "0.9em" }}>
                        {" "}
                        (of {summary.totalPatients} total)
                      </span>
                    )}
                  </span>
                </div>
                <div style={{ borderTop: "1px solid #ddd", margin: "10px 0", paddingTop: "10px" }}>
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel}>
                      Active Patients - Projected Used Cap by {summary.fiscalYearEnd}:
                    </span>
                    <span className={classes.infoValue}>
                      {formatCurrency(summary.activeProjectedUsedCap)}
                    </span>
                  </div>
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel}>Active Patients - Projected Allowed Cap:</span>
                    <span className={classes.infoValue}>
                      {formatCurrency(summary.activeProjectedAllowedCap)}
                    </span>
                  </div>
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel}>Active Patients - Projected Available Cap:</span>
                    <span className={classes.infoValue}>
                      {formatCurrency(summary.activeProjectedAvailableCap)}
                    </span>
                  </div>
                  {summary.totalEocNonDeathPatients > 0 && (
                    <div className={classes.infoRow}>
                      <span className={classes.infoLabel}>
                        EOC (Non-Death) - Available Cap:
                      </span>
                      <span className={parseFloat(summary.eocNonDeathAvailableCap) >= 0 ? classes.positiveText : classes.warningText}>
                        {formatCurrency(summary.eocNonDeathAvailableCap)}
                      </span>
                    </div>
                  )}
                  {summary.totalDeathDischargePatients > 0 && (
                    <div className={classes.infoRow}>
                      <span className={classes.infoLabel}>
                        Death Discharge - Available Cap Ready to Use:
                      </span>
                      <span className={classes.positiveText}>
                        {formatCurrency(summary.deathDischargeAvailableCap)}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ borderTop: "2px solid #4caf50", margin: "10px 0", paddingTop: "10px" }}>
                  <div className={classes.infoRow}>
                    <span className={classes.infoLabel} style={{ fontWeight: "bold", fontSize: "16px" }}>
                      Total Projected Available Cap (FY {summary.fiscalYearEnd}):
                    </span>
                    <span
                      className={
                        isCapAvailable ? classes.positiveText : classes.warningText
                      }
                      style={{ fontSize: "18px" }}
                    >
                      {formatCurrency(summary.totalProjectedAvailableCap)}
                    </span>
                  </div>
                </div>
                {!isCapAvailable && (
                  <div style={{ marginTop: 10 }}>
                    <span className={classes.warningText}>
                      WARNING: Projected to exceed cap by fiscal year end!
                    </span>
                  </div>
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <PDFDownloadLink
                  document={
                    <FiscalYearProjectionDocument
                      patientsData={limitedData}
                      summary={summary}
                    />
                  }
                  fileName={fileName}
                  className={classes.downloadButton}
                >
                  {({ blob, url, loading, error: pdfError }) => {
                    if (pdfError) {
                      console.error("PDF Generation Error:", pdfError);
                      setError(pdfError);
                    }
                    return loading ? (
                      <>
                        <CircularProgress size={20} style={{ color: "white" }} />
                        Generating Projection PDF...
                      </>
                    ) : (
                      <>
                        <GetApp />
                        Download Fiscal Year Projection PDF
                      </>
                    );
                  }}
                </PDFDownloadLink>
              </div>

              <p className={classes.note}>
                This comprehensive report includes: (1) Summary overview, (2) Detailed breakdowns for
                patients with available cap, patients exceeding cap, EOC non-death patients, and death
                discharge patients, (3) Individual patient details sorted by available cap.
                Projections use location-specific RHC rates and include prior hospice allocations.
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PrintFiscalYearProjectionModal;

import React from "react";
import { Modal, makeStyles, CircularProgress } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import AvailableHandler from "./AvailableHandler";

// Import the summary document and the full projection document for shared functions
import FiscalYearProjectionDocument from "./FiscalYearProjectionDocument";

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
  positiveText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  warningText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
}));

function PrintCurrentFYSummaryModal({ isOpen, onClose, patientsData, handler }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  // Calculate projections using the provided handler or default to AvailableHandler
  const projectionHandler = handler || AvailableHandler;
  const projectedData = projectionHandler.calculateFiscalYearProjection(patientsData);

  // Calculate summary statistics (same as full projection)
  const currentDate = moment();
  const currentYear = currentDate.year();
  const fiscalYearEnd = moment(`${currentYear}-09-30`);
  if (currentDate.isAfter(fiscalYearEnd)) {
    fiscalYearEnd.add(1, "year");
  }

  // Separate active and death discharge patients
  const activePatients = projectedData.filter((p) => p.isActiveProjection);
  const deathDischargePatients = projectedData.filter((p) => p.isDeathDischarge);

  // Get EOC non-death patients - ONLY those with NEGATIVE available cap
  const eocNonDeathPatients = patientsData.filter((p) => {
    if (!p.eoc || p.eoc === "N/A") return false;
    if (p.eoc_discharge === "Death Discharge") return false;

    const totalAvailableCap = parseFloat(p.availableCapFirstPeriod || 0) +
                               parseFloat(p.availableCapSecondPeriod || 0);

    return totalAvailableCap < 0;
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

    // EOC non-death cap deficit (only negative values included)
    eocNonDeathCapDeficit: eocNonDeathPatients
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

  // Total projected available cap = active projected available + death discharge available - EOC non-death deficit
  summary.totalProjectedAvailableCap = (
    parseFloat(summary.activeProjectedAvailableCap) +
    parseFloat(summary.deathDischargeAvailableCap) +
    parseFloat(summary.eocNonDeathCapDeficit) // This is already negative
  ).toFixed(2);

  const isCapAvailable = parseFloat(summary.totalProjectedAvailableCap) >= 0;

  const fileName = `Medicare_Cap_Current_FY_Summary_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

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
          <h3 style={{ margin: 0 }}>Current FY Summary</h3>
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
                <div className={classes.infoTitle}>Summary Preview</div>
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>Fiscal Year End:</span>
                  <span className={classes.infoValue}>{summary.fiscalYearEnd}</span>
                </div>
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>Active Patients:</span>
                  <span className={classes.infoValue}>{summary.totalActivePatients}</span>
                </div>
                <div className={classes.infoRow}>
                  <span className={classes.infoLabel}>
                    TOTAL Projected Available Cap:
                  </span>
                  <span
                    className={
                      isCapAvailable ? classes.positiveText : classes.warningText
                    }
                  >
                    {formatCurrency(summary.totalProjectedAvailableCap)}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <PDFDownloadLink
                  document={
                    <FiscalYearProjectionDocument
                      patientsData={projectedData.slice(0, 50)}
                      originalPatientsData={patientsData}
                      summary={summary}
                      summaryOnly={true}
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
                        Generating Summary PDF...
                      </>
                    ) : (
                      <>
                        <GetApp />
                        Download Current FY Summary PDF
                      </>
                    );
                  }}
                </PDFDownloadLink>
              </div>

              <p className={classes.note}>
                This summary includes: Page 1 overview and all summary tables (Active with Available Cap,
                Patients Exceeding Cap, Death Discharge, and EOC Non-Death). Individual patient details
                are excluded for a concise report.
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PrintCurrentFYSummaryModal;

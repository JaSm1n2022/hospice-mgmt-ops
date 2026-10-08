import React from "react";
import {
  Modal,
  makeStyles,
  CircularProgress,
  TextField,
  Button,
} from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp, ArrowBack } from "@material-ui/icons";
import FiscalYearProjectionDocument from "../../MedicareCap/Available/components/FiscalYearProjectionDocument";
import moment from "moment";
import AvailableHandler from "../../MedicareCap/Available/components/AvailableHandler";
import Helper from "utils/helper";

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
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    color: "#4caf50",
    fontSize: "13px",
    marginBottom: "15px",
  },
}));

function FYExceedProjectionModal({ isOpen, onClose, patientsData, handler }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [numDays, setNumDays] = React.useState("");
  const [submittedDays, setSubmittedDays] = React.useState(null);

  const resetState = () => {
    setNumDays("");
    setSubmittedDays(null);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCalculate = () => {
    const parsedDays = parseInt(numDays, 10);
    if (!parsedDays || parsedDays <= 0) {
      setError(new Error("Please enter a valid number of days greater than 0."));
      return;
    }
    setError(null);
    setSubmittedDays(parsedDays);
  };

  const handleBack = () => {
    setSubmittedDays(null);
    setError(null);
  };

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const projectionHandler = handler || AvailableHandler;
  const calculateProjection =
    typeof projectionHandler.calculateFYExceedProjection === "function"
      ? projectionHandler.calculateFYExceedProjection.bind(projectionHandler)
      : projectionHandler.calculateFiscalYearProjection.bind(projectionHandler);

  const fyStartDate = Helper.getCurrentFiscalYearStartDate();
  const rangeEndDate = submittedDays
    ? moment(fyStartDate).add(submittedDays, "days")
    : null;

  let summary = null;
  let limitedData = [];
  let isLimited = false;
  let isCapAvailable = true;
  let fileName = "";

  if (submittedDays) {
    const projectedData = calculateProjection(patientsData, rangeEndDate);

    const activePatients = projectedData.filter((p) => p.isActiveProjection);
    const deathDischargePatients = projectedData.filter((p) => p.isDeathDischarge);

    const eocNonDeathPatients = patientsData.filter((p) => {
      if (!p.eoc || p.eoc === "N/A") return false;
      if (p.eoc_discharge === "Death Discharge") return false;

      const eocDate = moment(p.eoc, "YYYY-MM-DD");
      const isWithinRange =
        eocDate.isSameOrAfter(moment(fyStartDate)) &&
        eocDate.isSameOrBefore(rangeEndDate);
      if (!isWithinRange) return false;

      const totalAvailableCap =
        parseFloat(p.availableCapFirstPeriod || 0) +
        parseFloat(p.availableCapSecondPeriod || 0);

      return totalAvailableCap < 0;
    });

    summary = {
      rangeStart: moment(fyStartDate).format("MM/DD/YYYY"),
      rangeEnd: rangeEndDate.format("MM/DD/YYYY"),
      fiscalYearEnd: rangeEndDate.format("YYYY-MM-DD"),
      totalActivePatients: activePatients.length,
      totalDeathDischargePatients: deathDischargePatients.length,
      totalEocNonDeathPatients: eocNonDeathPatients.length,
      totalPatients: projectedData.length,

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

      deathDischargeAvailableCap: deathDischargePatients
        .reduce((sum, p) => sum + parseFloat(p.projectedTotalAvailableCap || 0), 0)
        .toFixed(2),

      eocNonDeathCapDeficit: eocNonDeathPatients
        .reduce(
          (sum, p) =>
            sum +
            parseFloat(p.availableCapFirstPeriod || 0) +
            parseFloat(p.availableCapSecondPeriod || 0),
          0
        )
        .toFixed(2),

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

    summary.activeProjectedAvailableCap = (
      parseFloat(summary.activeProjectedAllowedCap) -
      parseFloat(summary.activeProjectedUsedCap)
    ).toFixed(2);

    summary.totalProjectedAvailableCap = (
      parseFloat(summary.activeProjectedAvailableCap) +
      parseFloat(summary.deathDischargeAvailableCap) +
      parseFloat(summary.eocNonDeathCapDeficit)
    ).toFixed(2);

    isCapAvailable = parseFloat(summary.totalProjectedAvailableCap) >= 0;

    fileName = `Medicare_Cap_FY_Exceed_Projection_${moment().format(
      "YYYY-MM-DD_HHmmss"
    )}.pdf`;

    limitedData = projectedData.slice(0, 50);
    isLimited = projectedData.length > 50;
  }

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
      onClose={handleClose}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>FY Exceed Projection</h3>
          <Clear className={classes.closeButton} onClick={handleClose} />
        </div>
        <div className={classes.content}>
          {!submittedDays ? (
            <>
              <div className={classes.infoSection}>
                <div className={classes.infoTitle}>Projection Range</div>
                <div style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
                  Enter the number of days to project from the start of the
                  current fiscal year ({moment(fyStartDate).format("MM/DD/YYYY")}
                  ). For example, entering 30 will project through approximately{" "}
                  {moment(fyStartDate).add(30, "days").format("MM/DD/YYYY")}.
                </div>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  label="Number of Days"
                  value={numDays}
                  onChange={(e) => setNumDays(e.target.value)}
                  inputProps={{ min: 1 }}
                  autoFocus
                />
              </div>

              {error && (
                <div style={{ color: "red", marginBottom: 20 }}>
                  {error.message || error.toString()}
                </div>
              )}

              <div style={{ textAlign: "right" }}>
                <Button onClick={handleClose} style={{ marginRight: 10 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4caf50", color: "white" }}
                  onClick={handleCalculate}
                >
                  Calculate Projection
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={classes.backLink} onClick={handleBack}>
                <ArrowBack style={{ fontSize: "16px" }} /> Change number of days
              </div>

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
                      <span className={classes.infoLabel}>Projection Range:</span>
                      <span className={classes.infoValue}>
                        {summary.rangeStart} - {summary.rangeEnd}
                      </span>
                    </div>
                    <div className={classes.infoRow}>
                      <span className={classes.infoLabel}>Number of Days:</span>
                      <span className={classes.infoValue}>{submittedDays}</span>
                    </div>
                    <div className={classes.infoRow}>
                      <span className={classes.infoLabel}>Active Patients (Projected):</span>
                      <span className={classes.infoValue}>
                        {summary.totalActivePatients}
                      </span>
                    </div>
                    {summary.totalEocNonDeathPatients > 0 && (
                      <div className={classes.infoRow}>
                        <span className={classes.infoLabel}>EOC (Non-Death) Exceeded Cap:</span>
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
                          Active Patients - Projected Used Cap by {summary.rangeEnd}:
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
                            EOC (Non-Death) - Cap Deficit:
                          </span>
                          <span className={classes.warningText}>
                            {formatCurrency(summary.eocNonDeathCapDeficit)}
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
                          TOTAL Projected Available Cap ({summary.rangeStart} - {summary.rangeEnd}):
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
                      {summary.totalEocNonDeathPatients > 0 && (
                        <div style={{ marginTop: "8px", fontSize: "11px", color: "#666", fontStyle: "italic" }}>
                          * Includes EOC (Non-Death) cap deficit of {formatCurrency(summary.eocNonDeathCapDeficit)} subtracted from total
                        </div>
                      )}
                    </div>
                    {!isCapAvailable && (
                      <div style={{ marginTop: 10 }}>
                        <span className={classes.warningText}>
                          WARNING: Projected to exceed cap by end of range!
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <PDFDownloadLink
                      document={
                        <FiscalYearProjectionDocument
                          patientsData={limitedData}
                          originalPatientsData={patientsData}
                          summary={summary}
                        />
                      }
                      fileName={fileName}
                      className={classes.downloadButton}
                    >
                      {({ loading, error: pdfError }) => {
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
                            Download FY Exceed Projection PDF
                          </>
                        );
                      }}
                    </PDFDownloadLink>
                  </div>

                  <p className={classes.note}>
                    This report projects patient Medicare cap usage from{" "}
                    {summary.rangeStart} through {summary.rangeEnd} ({submittedDays}{" "}
                    day{submittedDays === 1 ? "" : "s"} from the start of the
                    current fiscal year). Any cap deficit accrued prior to
                    10/01 (the current fiscal year start) is excluded/treated
                    as zero, since it is already resolved via the aggregate
                    cap pool - only the current fiscal year portion is used to
                    determine exceeded cap. Includes: (1) Summary overview, (2)
                    Detailed breakdowns for patients with available cap, patients
                    exceeding cap, EOC non-death patients, and death discharge
                    patients, (3) Individual patient details sorted by available
                    cap. Projections use location-specific RHC rates and include
                    prior hospice allocations.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default FYExceedProjectionModal;

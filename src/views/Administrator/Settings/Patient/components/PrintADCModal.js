import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import ADCDocument from "./ADCDocument";

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
    width: "500px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#e91e63",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: 600,
    margin: 0,
  },
  closeIcon: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  content: {
    padding: "30px",
  },
  description: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  yearField: {
    marginBottom: "20px",
  },
  stats: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  },
  statLabel: {
    color: "#666",
  },
  statValue: {
    fontWeight: 600,
    color: "#333",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#e91e63",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    width: "100%",
    justifyContent: "center",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#d81b60",
    },
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
    marginTop: "10px",
  },
}));

const isDeathDischarge = (patient) => {
  const reason = patient.eoc_discharge;
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return reason === "Death Discharge" || lower.includes("death");
};

function computeADC(inScope, yearStart, yearEnd) {
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);

  if (periodEnd.isBefore(yearStart, "day")) {
    return { adc: 0, isYTD: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(yearStart, "days") + 1;
  let totalPatientDays = 0;

  inScope.forEach((patient) => {
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;
    const effStart = moment.max(soc, yearStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isYTD = periodEnd.isBefore(yearEnd, "day");

  return { adc, isYTD, periodEnd };
}

function buildYearOptions() {
  const currentYear = moment().year();
  const options = [];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    options.push({ value: y, name: `${y}`, description: `${y}` });
  }
  return options;
}

const yearOptions = buildYearOptions();

function PrintADCModal({ isOpen, onClose, patientsData, logoBase64 }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(moment().year());

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setError(null);
  };

  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");

  const inScope = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(yearEnd)) return false;
    if (eoc && eoc.isBefore(yearStart)) return false;

    return true;
  });

  const activeCount = inScope.filter((p) => !p.eoc).length;
  const deathDischargeCount = inScope.filter((p) => p.eoc && isDeathDischarge(p)).length;
  const liveDischargeCount = inScope.filter((p) => p.eoc && !isDeathDischarge(p)).length;
  const { adc, isYTD, periodEnd } = computeADC(inScope, yearStart, yearEnd);
  const coverageLabel = `${yearStart.format("MMMM YYYY")} - ${periodEnd.format("MMMM YYYY")}`;

  const fileName = `ADC_Report_${year}_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>ADC Report</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a fiscal year to generate an ADC report of Active Patients
            (SOC with no EOC), Death Discharge, and Live Discharge clients.
          </Typography>

          <div className={classes.yearField}>
            <CustomSelect
              label="Year"
              name="year"
              placeholder="Select Year"
              value={selectedYear}
              options={yearOptions}
              onChange={handleYearChange}
            />
          </div>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Coverage:</span>
              <span className={classes.statValue}>{coverageLabel}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>
                {isYTD ? "Year-to-Date ADC" : "Average Daily Census (ADC)"}:
              </span>
              <span className={classes.statValue}>{Math.round(adc)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total On Service ({year}):</span>
              <span className={classes.statValue}>{inScope.length}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Active Patients:</span>
              <span className={classes.statValue}>{activeCount}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Death Discharge:</span>
              <span className={classes.statValue}>{deathDischargeCount}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Live Discharge:</span>
              <span className={classes.statValue}>{liveDischargeCount}</span>
            </div>
          </div>

          <PDFDownloadLink
            key={year}
            document={
              <ADCDocument
                patientsData={patientsData}
                logoBase64={logoBase64}
                selectedYear={year}
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
                  Generating PDF...
                </>
              ) : (
                <>
                  <GetApp />
                  Download ADC Report PDF
                </>
              );
            }}
          </PDFDownloadLink>

          {error && (
            <Typography className={classes.errorText}>
              Error generating PDF: {error.message}
            </Typography>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PrintADCModal;

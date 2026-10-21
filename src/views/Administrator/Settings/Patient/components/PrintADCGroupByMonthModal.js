import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import ADCGroupByMonthDocument from "./ADCGroupByMonthDocument";

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
    width: "900px",
    maxWidth: "95vw",
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
    maxWidth: "250px",
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
  tableWrapper: {
    overflowX: "auto",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  th: {
    backgroundColor: "#e91e63",
    color: "white",
    padding: "6px 4px",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  thCategory: {
    backgroundColor: "#e91e63",
    color: "white",
    padding: "6px 8px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "6px 4px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
  },
  tdCategory: {
    padding: "6px 8px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "1px solid #eee",
  },
  tdTotal: {
    padding: "6px 4px",
    textAlign: "center",
    fontWeight: 600,
    borderBottom: "1px solid #eee",
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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const matchesReason = (reason, keywords) => {
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

const buildMonthlyCounts = (patientsData, year) => {
  const soc = new Array(12).fill(0);
  const deathDischarge = new Array(12).fill(0);
  const revocation = new Array(12).fill(0);
  const liveDischarge = new Array(12).fill(0);
  const transfer = new Array(12).fill(0);

  (patientsData || []).forEach((patient) => {
    if (patient.soc) {
      const socDate = moment(patient.soc);
      if (socDate.year() === year) {
        soc[socDate.month()]++;
      }
    }

    if (patient.eoc) {
      const eocDate = moment(patient.eoc);
      if (eocDate.year() === year) {
        const reason = patient.eoc_discharge;
        const monthIdx = eocDate.month();

        if (matchesReason(reason, ["death"])) {
          deathDischarge[monthIdx]++;
        } else if (matchesReason(reason, ["revocation"])) {
          revocation[monthIdx]++;
        } else if (matchesReason(reason, ["transfer"])) {
          transfer[monthIdx]++;
        } else if (
          matchesReason(reason, [
            "extended prognosis",
            "travel outside of service area",
            "discharge for cause",
          ])
        ) {
          liveDischarge[monthIdx]++;
        }
      }
    }
  });

  return { soc, deathDischarge, revocation, liveDischarge, transfer };
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const computeADC = (patientsData, yearStart, yearEnd) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);

  if (periodEnd.isBefore(yearStart, "day")) {
    return { adc: 0, isYTD: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(yearStart, "days") + 1;
  let totalPatientDays = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(yearEnd)) return;
    if (eoc && eoc.isBefore(yearStart)) return;

    const effStart = moment.max(soc, yearStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isYTD = periodEnd.isBefore(yearEnd, "day");

  return { adc, isYTD, periodEnd };
};

const computeMonthlyADC = (patientsData, year) => {
  const today = moment().endOf("day");
  const adcByMonth = new Array(12).fill(0);

  for (let m = 0; m < 12; m++) {
    const monthStart = moment([year, m, 1]).startOf("day");
    const monthEnd = moment(monthStart).endOf("month");
    const periodEnd = moment.min(monthEnd, today);

    if (periodEnd.isBefore(monthStart, "day")) {
      adcByMonth[m] = 0;
      continue;
    }

    const daysInPeriod = periodEnd.diff(monthStart, "days") + 1;
    let totalPatientDays = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      if (soc.isAfter(monthEnd)) return;
      if (eoc && eoc.isBefore(monthStart)) return;

      const effStart = moment.max(soc, monthStart);
      const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

      if (effEnd.isSameOrAfter(effStart, "day")) {
        totalPatientDays += effEnd.diff(effStart, "days") + 1;
      }
    });

    adcByMonth[m] = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  }

  return adcByMonth;
};

function buildYearOptions() {
  const currentYear = moment().year();
  const options = [];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    options.push({ value: y, name: `${y}`, description: `${y}` });
  }
  return options;
}

const yearOptions = buildYearOptions();

function PrintADCGroupByMonthModal({ isOpen, onClose, patientsData, logoBase64 }) {
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
  const { soc, deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    year
  );

  const { adc, isYTD, periodEnd } = computeADC(patientsData, yearStart, yearEnd);
  const adcByMonth = computeMonthlyADC(patientsData, year);

  const rows = [
    { label: "Admission", values: soc },
    { label: "Death Discharge", values: deathDischarge },
    { label: "Revocation", values: revocation },
    { label: "Live Discharge", values: liveDischarge },
    { label: "Transfer", values: transfer },
    { label: "ADC", values: adcByMonth, isDecimal: true, total: adc },
  ];

  const activePatients = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const socDate = moment(patient.soc);
    return socDate.year() === year && !patient.eoc;
  }).length;
  const coverageLabel = `${yearStart.format("MMMM YYYY")} - ${periodEnd.format("MMMM YYYY")}`;

  const fileName = `Census_Group_By_Month_${year}_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Census Group By Month</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a fiscal year to generate a monthly breakdown of Admission, Death
            Discharge, Revocation, Live Discharge, and Transfer counts.
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
              <span className={classes.statValue}>{adc.toFixed(2)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Admission:</span>
              <span className={classes.statValue}>{sumArray(soc)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Death Discharge:</span>
              <span className={classes.statValue}>{sumArray(deathDischarge)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Revocation:</span>
              <span className={classes.statValue}>{sumArray(revocation)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Live Discharge:</span>
              <span className={classes.statValue}>{sumArray(liveDischarge)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Transfer:</span>
              <span className={classes.statValue}>{sumArray(transfer)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Active Patients:</span>
              <span className={classes.statValue}>{activePatients}</span>
            </div>
          </div>

          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.thCategory}>Category</th>
                  {MONTHS.map((m) => (
                    <th key={m} className={classes.th}>{m}</th>
                  ))}
                  <th className={classes.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className={classes.tdCategory}>{row.label}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} className={classes.td}>
                        {row.isDecimal ? val.toFixed(2) : val}
                      </td>
                    ))}
                    <td className={classes.tdTotal}>
                      {row.isDecimal
                        ? (row.total !== undefined ? row.total : sumArray(row.values)).toFixed(2)
                        : sumArray(row.values)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={year}
            document={
              <ADCGroupByMonthDocument
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
                  Download Census Group By Month PDF
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

export default PrintADCGroupByMonthModal;

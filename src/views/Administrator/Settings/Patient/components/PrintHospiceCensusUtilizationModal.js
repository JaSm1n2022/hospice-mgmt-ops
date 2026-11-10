import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomTextField from "components/TextField/CustomTextField";
import HospiceCensusUtilizationDocument from "./HospiceCensusUtilizationDocument";

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
    width: "960px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
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
  fieldsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  fieldItem: {
    minWidth: "200px",
  },
  dateField: {
    minWidth: "200px",
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
    backgroundColor: "#153348",
    color: "white",
    padding: "6px 4px",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  thCategory: {
    backgroundColor: "#153348",
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
  rowHighlight: {
    backgroundColor: "#c8e6c9",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
    marginTop: "10px",
  },
}));

const matchesReason = (reason, keywords) => {
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildMonthBuckets = (periodStart, periodEnd) => {
  const buckets = [];
  const cursor = moment(periodStart).startOf("month");
  const last = moment(periodEnd).startOf("month");

  while (cursor.isSameOrBefore(last, "month")) {
    buckets.push({
      year: cursor.year(),
      month: cursor.month(),
      label: cursor.format("MMM"),
      fullLabel: cursor.format("MMM YY"),
    });
    cursor.add(1, "month");
  }

  return buckets;
};

const buildMonthlyCounts = (patientsData, buckets, periodStart, periodEnd) => {
  const n = buckets.length;
  const soc = new Array(n).fill(0);
  const deathDischarge = new Array(n).fill(0);
  const revocation = new Array(n).fill(0);
  const liveDischarge = new Array(n).fill(0);
  const transfer = new Array(n).fill(0);
  const bucketIndexByKey = new Map(
    buckets.map((b, idx) => [`${b.year}-${b.month}`, idx])
  );

  (patientsData || []).forEach((patient) => {
    if (patient.soc) {
      const socDate = moment(patient.soc);
      if (
        !socDate.isBefore(periodStart, "day") &&
        !socDate.isAfter(periodEnd, "day")
      ) {
        const idx = bucketIndexByKey.get(`${socDate.year()}-${socDate.month()}`);
        if (idx !== undefined) soc[idx]++;
      }
    }

    if (patient.eoc) {
      const eocDate = moment(patient.eoc);
      if (
        !eocDate.isBefore(periodStart, "day") &&
        !eocDate.isAfter(periodEnd, "day")
      ) {
        const idx = bucketIndexByKey.get(`${eocDate.year()}-${eocDate.month()}`);
        if (idx === undefined) return;
        const reason = patient.eoc_discharge;

        if (matchesReason(reason, ["death"])) {
          deathDischarge[idx]++;
        } else if (matchesReason(reason, ["revocation"])) {
          revocation[idx]++;
        } else if (matchesReason(reason, ["transfer"])) {
          transfer[idx]++;
        } else if (
          matchesReason(reason, [
            "extended prognosis",
            "travel outside of service area",
            "discharge for cause",
          ])
        ) {
          liveDischarge[idx]++;
        }
      }
    }
  });

  return { soc, deathDischarge, revocation, liveDischarge, transfer };
};

const computeADC = (patientsData, periodStart, periodEndRaw) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(periodEndRaw, today);

  if (periodEnd.isBefore(periodStart, "day")) {
    return { adc: 0, isPartialPeriod: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(periodStart, "days") + 1;
  let totalPatientDays = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(periodEndRaw)) return;
    if (eoc && eoc.isBefore(periodStart)) return;

    const effStart = moment.max(soc, periodStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isPartialPeriod = periodEnd.isBefore(periodEndRaw, "day");

  return { adc, isPartialPeriod, periodEnd };
};

const computeMonthlyADC = (patientsData, buckets, periodStart, periodEndRaw) => {
  const today = moment().endOf("day");
  const adcByMonth = new Array(buckets.length).fill(0);

  buckets.forEach((b, idx) => {
    const bucketMonthStart = moment([b.year, b.month, 1]).startOf("day");
    const bucketMonthEnd = moment(bucketMonthStart).endOf("month");
    const rangeStart = moment.max(bucketMonthStart, periodStart);
    const rangeEnd = moment.min(bucketMonthEnd, periodEndRaw, today);

    if (rangeEnd.isBefore(rangeStart, "day")) {
      adcByMonth[idx] = 0;
      return;
    }

    const daysInPeriod = rangeEnd.diff(rangeStart, "days") + 1;
    let totalPatientDays = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      if (soc.isAfter(rangeEnd)) return;
      if (eoc && eoc.isBefore(rangeStart)) return;

      const effStart = moment.max(soc, rangeStart);
      const effEnd = eoc ? moment.min(eoc, rangeEnd) : rangeEnd;

      if (effEnd.isSameOrAfter(effStart, "day")) {
        totalPatientDays += effEnd.diff(effStart, "days") + 1;
      }
    });

    adcByMonth[idx] = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  });

  return adcByMonth;
};

function PrintHospiceCensusUtilizationModal({ isOpen, onClose, patientsData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [periodFrom, setPeriodFrom] = React.useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [periodTo, setPeriodTo] = React.useState(
    moment().format("YYYY-MM-DD")
  );
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const handlePeriodFromChange = (event) => {
    const value = event.target.value;
    setPeriodFrom(value);
    if (value && periodTo && moment(value).isAfter(moment(periodTo))) {
      setPeriodTo(value);
    }
    setError(null);
  };

  const handlePeriodToChange = (event) => {
    const value = event.target.value;
    setPeriodTo(value);
    if (value && periodFrom && moment(value).isBefore(moment(periodFrom))) {
      setPeriodFrom(value);
    }
    setError(null);
  };

  const periodStart = moment(periodFrom).startOf("day");
  const periodEndRaw = moment(periodTo).endOf("day");
  const buckets = buildMonthBuckets(periodStart, periodEndRaw);
  const spansMultipleYears =
    buckets.length > 0 && buckets[0].year !== buckets[buckets.length - 1].year;

  const { soc, deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    buckets,
    periodStart,
    periodEndRaw
  );

  const { adc, isPartialPeriod, periodEnd } = computeADC(patientsData, periodStart, periodEndRaw);
  const adcByMonth = computeMonthlyADC(patientsData, buckets, periodStart, periodEndRaw);

  const rows = [
    { label: "Admissions", values: soc },
    { label: "Death Discharges", values: deathDischarge },
    { label: "Revocations", values: revocation },
    { label: "Live Discharges", values: liveDischarge },
    { label: "Transfers", values: transfer },
    { label: "Average Daily Census", values: adcByMonth, isDecimal: true, total: adc },
  ];

  const activePatients = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const socDate = moment(patient.soc);
    return (
      !socDate.isBefore(periodStart, "day") &&
      !socDate.isAfter(periodEndRaw, "day") &&
      !patient.eoc
    );
  }).length;
  const coverageLabel = `${periodStart.format("MMMM D, YYYY")} - ${periodEndRaw.format("MMMM D, YYYY")}`;

  const fileName = `Hospice_Census_Utilization_${periodStart.format(
    "YYYY-MM-DD"
  )}_to_${periodEndRaw.format("YYYY-MM-DD")}_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Hospice Census &amp; Utilization Report</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a date range to generate a Hospice Census &amp; Utilization report summarizing
            Admissions, Death Discharges, Revocations, Live Discharges, Transfers, and Average Daily
            Census (ADC).
          </Typography>

          <div className={classes.fieldsRow}>
            <div className={classes.dateField}>
              <CustomTextField
                label="Period Start"
                type="date"
                name="periodFrom"
                value={periodFrom}
                onChange={handlePeriodFromChange}
              />
            </div>
            <div className={classes.dateField}>
              <CustomTextField
                label="Period End"
                type="date"
                name="periodTo"
                value={periodTo}
                onChange={handlePeriodToChange}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Medicare Provider No. (CCN)"
                name="ccn"
                value={ccn}
                onChange={(e) => setCcn(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Prepared By"
                name="preparedBy"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Reviewed By"
                name="reviewedBy"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Coverage:</span>
              <span className={classes.statValue}>{coverageLabel}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>
                {isPartialPeriod ? "Period-to-Date ADC" : "Average Daily Census (ADC)"}:
              </span>
              <span className={classes.statValue}>{Math.round(adc)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Admissions:</span>
              <span className={classes.statValue}>{sumArray(soc)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Death Discharges:</span>
              <span className={classes.statValue}>{sumArray(deathDischarge)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Revocations:</span>
              <span className={classes.statValue}>{sumArray(revocation)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Live Discharges:</span>
              <span className={classes.statValue}>{sumArray(liveDischarge)}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Transfers:</span>
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
                  <th className={classes.thCategory}>Measure</th>
                  {buckets.map((b) => (
                    <th key={`${b.year}-${b.month}`} className={classes.th}>
                      {spansMultipleYears ? b.fullLabel : b.label}
                    </th>
                  ))}
                  <th className={classes.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.label}
                    className={row.isDecimal ? classes.rowHighlight : undefined}
                  >
                    <td className={classes.tdCategory}>{row.label}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} className={classes.td}>
                        {row.isDecimal ? Math.round(val) : val}
                      </td>
                    ))}
                    <td className={classes.tdTotal}>
                      {row.isDecimal
                        ? Math.round(row.total !== undefined ? row.total : sumArray(row.values))
                        : sumArray(row.values)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={`${periodFrom}-${periodTo}-${ccn}-${preparedBy}-${reviewedBy}`}
            document={
              <HospiceCensusUtilizationDocument
                patientsData={patientsData}
                periodFrom={periodFrom}
                periodTo={periodTo}
                ccn={ccn}
                preparedBy={preparedBy}
                reviewedBy={reviewedBy}
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
                  Download Hospice Census &amp; Utilization Report PDF
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

export default PrintHospiceCensusUtilizationModal;

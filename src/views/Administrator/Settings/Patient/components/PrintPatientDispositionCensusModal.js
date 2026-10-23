import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import CustomTextField from "components/TextField/CustomTextField";
import PatientDispositionCensusDocument from "./PatientDispositionCensusDocument";

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
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
    marginBottom: "10px",
    marginTop: "10px",
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
  emptyText: {
    fontSize: "13px",
    color: "#999",
    fontStyle: "italic",
    padding: "10px 0",
    textAlign: "center",
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

const classifyDisposition = (reason) => {
  if (matchesReason(reason, ["death"])) return "Death Discharge";
  if (matchesReason(reason, ["revocation"])) return "Revocation";
  if (matchesReason(reason, ["transfer"])) return "Transfer";
  if (
    matchesReason(reason, [
      "extended prognosis",
      "travel outside of service area",
      "discharge for cause",
    ])
  ) {
    return "Live Discharge";
  }
  return null;
};

const buildMonthlyCounts = (patientsData, year) => {
  const deathDischarge = new Array(12).fill(0);
  const revocation = new Array(12).fill(0);
  const liveDischarge = new Array(12).fill(0);
  const transfer = new Array(12).fill(0);

  (patientsData || []).forEach((patient) => {
    if (!patient.eoc) return;
    const eocDate = moment(patient.eoc);
    if (eocDate.year() !== year) return;

    const monthIdx = eocDate.month();
    const type = classifyDisposition(patient.eoc_discharge);

    if (type === "Death Discharge") deathDischarge[monthIdx]++;
    else if (type === "Revocation") revocation[monthIdx]++;
    else if (type === "Live Discharge") liveDischarge[monthIdx]++;
    else if (type === "Transfer") transfer[monthIdx]++;
  });

  return { deathDischarge, revocation, liveDischarge, transfer };
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildRegister = (patientsData, year) => {
  return (patientsData || [])
    .filter((patient) => {
      if (!patient.eoc) return false;
      if (moment(patient.eoc).year() !== year) return false;
      return !!classifyDisposition(patient.eoc_discharge);
    })
    .map((patient) => ({
      patientCd: patient.patientCd,
      soc: patient.soc,
      eoc: patient.eoc,
      type: classifyDisposition(patient.eoc_discharge),
      reason: patient.eoc_discharge,
    }))
    .sort((a, b) => moment(a.eoc).valueOf() - moment(b.eoc).valueOf());
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

function PrintPatientDispositionCensusModal({ isOpen, onClose, patientsData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");

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
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);
  const coverageLabel = `${yearStart.format("MMMM YYYY")} - ${periodEnd.format("MMMM YYYY")}`;

  const { deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    year
  );

  const rows = [
    { label: "Death Discharge", values: deathDischarge },
    { label: "Revocation", values: revocation },
    { label: "Live Discharge", values: liveDischarge },
    { label: "Transfer", values: transfer },
  ];

  const totalDeath = sumArray(deathDischarge);
  const totalRevocation = sumArray(revocation);
  const totalLive = sumArray(liveDischarge);
  const totalTransfer = sumArray(transfer);
  const totalEvents = totalDeath + totalRevocation + totalLive + totalTransfer;
  const activeCensus = (patientsData || []).filter((p) => !p.eoc).length;

  const register = buildRegister(patientsData, year);

  const fileName = `Patient_Disposition_Census_${year}_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Patient Disposition Census</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a fiscal year to generate a discharge, transfer, and revocation disposition
            census (no admission or ADC figures are included in this report).
          </Typography>

          <div className={classes.fieldsRow}>
            <div className={classes.fieldItem}>
              <CustomSelect
                label="Year"
                name="year"
                placeholder="Select Year"
                value={selectedYear}
                options={yearOptions}
                onChange={handleYearChange}
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
              <span className={classes.statLabel}>Death Discharges:</span>
              <span className={classes.statValue}>{totalDeath}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Revocations:</span>
              <span className={classes.statValue}>{totalRevocation}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Live Discharges:</span>
              <span className={classes.statValue}>{totalLive}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Transfers:</span>
              <span className={classes.statValue}>{totalTransfer}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Disposition Events:</span>
              <span className={classes.statValue}>{totalEvents}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Active Census (reference only):</span>
              <span className={classes.statValue}>{activeCensus}</span>
            </div>
          </div>

          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.thCategory}>Disposition</th>
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
                      <td key={idx} className={classes.td}>{val}</td>
                    ))}
                    <td className={classes.tdTotal}>{sumArray(row.values)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Typography className={classes.sectionTitle}>
            Patient-Level Disposition Register
          </Typography>
          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.thCategory}>Patient / ID</th>
                  <th className={classes.th}>Start of Care</th>
                  <th className={classes.th}>Disposition Date</th>
                  <th className={classes.th}>Disposition Type</th>
                  <th className={classes.th}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {register.length === 0 ? (
                  <tr>
                    <td className={classes.emptyText} colSpan={5}>
                      No disposition events found for {year}.
                    </td>
                  </tr>
                ) : (
                  register.map((r, idx) => (
                    <tr key={`${r.patientCd}-${idx}`}>
                      <td className={classes.tdCategory}>{r.patientCd}</td>
                      <td className={classes.td}>
                        {r.soc ? moment(r.soc).format("MM/DD/YYYY") : "N/A"}
                      </td>
                      <td className={classes.td}>
                        {r.eoc ? moment(r.eoc).format("MM/DD/YYYY") : "N/A"}
                      </td>
                      <td className={classes.td}>{r.type}</td>
                      <td className={classes.td}>{r.reason || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={`${year}-${ccn}-${preparedBy}-${reviewedBy}`}
            document={
              <PatientDispositionCensusDocument
                patientsData={patientsData}
                selectedYear={year}
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
                  Download Patient Disposition Census PDF
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

export default PrintPatientDispositionCensusModal;

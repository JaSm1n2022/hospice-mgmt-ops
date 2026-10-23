import React from "react";
import {
  Modal,
  makeStyles,
  CircularProgress,
  Typography,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import CustomTextField from "components/TextField/CustomTextField";
import UnduplicatedAdmissionsDocument from "./UnduplicatedAdmissionsDocument";

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
    width: "700px",
    maxWidth: "95vw",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#163B2A",
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
  fieldsRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  fieldItem: {
    flex: "1 1 200px",
    minWidth: "180px",
  },
  finalToggle: {
    marginBottom: "10px",
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
    backgroundColor: "#163B2A",
    color: "white",
    padding: "6px 4px",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  thCategory: {
    backgroundColor: "#163B2A",
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
    backgroundColor: "#163B2A",
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
      backgroundColor: "#0F2A1D",
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

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildUnduplicatedAdmissions = (patientsData, year) => {
  const admissionsByMonth = new Array(12).fill(0);
  let totalAdmissions = 0;
  let patientsWithMultipleAdmissions = 0;

  (patientsData || []).forEach((patient) => {
    if (patient.insurance !== "Traditional Medicare") return;
    if (!patient.soc) return;
    const socDate = moment(patient.soc);
    if (socDate.year() !== year) return;

    admissionsByMonth[socDate.month()] += 1;
    totalAdmissions += 1;

    const noOfAdmission =
      patient.no_of_admission === null || patient.no_of_admission === undefined
        ? 1
        : patient.no_of_admission;

    if (noOfAdmission > 1) {
      patientsWithMultipleAdmissions += 1;
    }
  });

  return { admissionsByMonth, totalAdmissions, patientsWithMultipleAdmissions };
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

function PrintUnduplicatedAdmissionsModal({ isOpen, onClose, patientsData, logoBase64 }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");
  const [isFinal, setIsFinal] = React.useState(false);

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

  const { admissionsByMonth, totalAdmissions, patientsWithMultipleAdmissions } =
    buildUnduplicatedAdmissions(patientsData, year);

  const rows = [{ label: "Unduplicated Admissions", values: admissionsByMonth }];

  const statusLabel = isFinal ? "FINAL" : "DRAFT";
  const fileName = `Unduplicated_Admissions_${ccn || "ALL"}_${yearStart.format(
    "YYYY-MM-DD"
  )}_to_${periodEnd.format("YYYY-MM-DD")}_${statusLabel}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Unduplicated Admissions Per Medicare Provider</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a fiscal year to generate a monthly breakdown of unduplicated admissions
            per Medicare provider.
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

          <div className={classes.fieldsRow}>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Medicare Provider No. (CCN)"
                placeholder="e.g. 29XXXX"
                name="ccn"
                value={ccn}
                onChange={(e) => setCcn(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Prepared By"
                placeholder="Preparer name"
                name="preparedBy"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Reviewed By"
                placeholder="Reviewer name"
                name="reviewedBy"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.finalToggle}>
            <FormControlLabel
              control={
                <Switch
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                  color="primary"
                />
              }
              label={isFinal ? "Marked as Final" : "Draft (mark as Final when reviewed)"}
            />
          </div>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Coverage:</span>
              <span className={classes.statValue}>{coverageLabel}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>
                Number of Unduplicated Admissions (Per Medicare Provider):
              </span>
              <span className={classes.statValue}>{totalAdmissions}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Patients with More Than 1 Admission:</span>
              <span className={classes.statValue}>{patientsWithMultipleAdmissions}</span>
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
                        {val}
                      </td>
                    ))}
                    <td className={classes.tdTotal}>{sumArray(row.values)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={`${year}-${ccn}-${preparedBy}-${reviewedBy}-${isFinal}`}
            document={
              <UnduplicatedAdmissionsDocument
                patientsData={patientsData}
                logoBase64={logoBase64}
                selectedYear={year}
                ccn={ccn}
                preparedBy={preparedBy}
                reviewedBy={reviewedBy}
                isFinal={isFinal}
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
                  Download Unduplicated Admissions PDF
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

export default PrintUnduplicatedAdmissionsModal;

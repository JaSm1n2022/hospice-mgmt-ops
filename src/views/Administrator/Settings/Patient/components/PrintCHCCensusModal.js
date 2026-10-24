import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import CustomTextField from "components/TextField/CustomTextField";
import CHCCensusDocument from "./CHCCensusDocument";

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
    backgroundColor: "#153348",
    color: "white",
    padding: "6px 8px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "6px 8px",
    borderBottom: "1px solid #eee",
  },
  tdCount: {
    padding: "6px 8px",
    textAlign: "center",
    fontWeight: 600,
    borderBottom: "1px solid #eee",
  },
  tdNames: {
    padding: "6px 8px",
    borderBottom: "1px solid #eee",
    color: "#555",
  },
  rowHighlight: {
    backgroundColor: "#e8f4ed",
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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const buildCHCMonthlyRegister = (patientsData, year) => {
  const monthMaps = Array.from({ length: 12 }, () => new Map());
  const uniquePatientKeys = new Set();

  (patientsData || []).forEach((patient) => {
    const hasEoc = !!patient.eoc;
    const eocInYear = hasEoc && moment(patient.eoc).year() === year;
    if (hasEoc && !eocInYear) return;

    const chcDates = patient.continous_care_dates;
    if (!chcDates || chcDates.length === 0) return;

    const key = patient.patientCd || `${patient.fn || ""}-${patient.ln || ""}`;
    const name =
      `${patient.fn || ""} ${patient.ln || ""}`.trim() ||
      patient.patientCd ||
      "Unknown Patient";

    let patientHasChcInYear = false;

    chcDates.forEach((rawDate) => {
      const date = moment(rawDate);
      if (!date.isValid() || date.year() !== year) return;
      const monthIdx = date.month();
      if (!monthMaps[monthIdx].has(key)) {
        monthMaps[monthIdx].set(key, name);
      }
      patientHasChcInYear = true;
    });

    if (patientHasChcInYear) {
      uniquePatientKeys.add(key);
    }
  });

  const monthPatients = monthMaps.map((map) =>
    Array.from(map.values()).sort((a, b) => a.localeCompare(b))
  );

  const monthsWithChc = monthPatients.filter((names) => names.length > 0).length;
  const patientMonthEntries = monthPatients.reduce((sum, names) => sum + names.length, 0);

  return {
    monthPatients,
    uniqueChcPatients: uniquePatientKeys.size,
    monthsWithChc,
    patientMonthEntries,
  };
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

function PrintCHCCensusModal({ isOpen, onClose, patientsData }) {
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
  const { monthPatients, uniqueChcPatients, monthsWithChc, patientMonthEntries } =
    buildCHCMonthlyRegister(patientsData, year);

  const fileName = `CHC_Census_${year}_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>CHC Census</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select a fiscal year to generate a Continuous Home Care (CHC) monthly
            patient register. Patients with no discharge, or whose discharge falls
            within the selected year, are checked for recorded CHC dates and grouped
            by the month each date falls in.
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
              <span className={classes.statLabel}>Unique CHC Patients:</span>
              <span className={classes.statValue}>{uniqueChcPatients}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Months with CHC:</span>
              <span className={classes.statValue}>{monthsWithChc}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Patient-Month Entries:</span>
              <span className={classes.statValue}>{patientMonthEntries}</span>
            </div>
          </div>

          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.th}>Month</th>
                  <th className={classes.th} style={{ textAlign: "center" }}>
                    Patients
                  </th>
                  <th className={classes.th}>Patient Names</th>
                </tr>
              </thead>
              <tbody>
                {MONTH_NAMES.map((monthName, idx) => {
                  const names = monthPatients[idx];
                  return (
                    <tr
                      key={monthName}
                      className={names.length > 0 ? classes.rowHighlight : undefined}
                    >
                      <td className={classes.td}>{monthName}</td>
                      <td className={classes.tdCount}>{names.length}</td>
                      <td className={classes.tdNames}>
                        {names.length > 0 ? names.join(", ") : "No CHC patients"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={`${year}-${ccn}-${preparedBy}-${reviewedBy}`}
            document={
              <CHCCensusDocument
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
                  Download CHC Census PDF
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

export default PrintCHCCensusModal;

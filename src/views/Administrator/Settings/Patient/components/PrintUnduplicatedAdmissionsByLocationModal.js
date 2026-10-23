import React from "react";
import {
  Modal,
  makeStyles,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomSelect from "components/Select/CustomSelect";
import CustomTextField from "components/TextField/CustomTextField";
import UnduplicatedAdmissionsByLocationDocument from "./UnduplicatedAdmissionsByLocationDocument";

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

function buildYearOptions() {
  const currentYear = moment().year();
  const options = [];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    options.push({ value: y, name: `${y}`, description: `${y}` });
  }
  return options;
}

const yearOptions = buildYearOptions();

function PrintUnduplicatedAdmissionsByLocationModal({ isOpen, onClose }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [parentLocation, setParentLocation] = React.useState("Henderson, Nevada");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setError(null);
  };

  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);
  const coverageLabel = `${yearStart.format("MMMM D, YYYY")} - ${periodEnd.format(
    "MMMM D, YYYY"
  )}`;

  const fileName = `Unduplicated_Admissions_By_Location_${ccn || "ALL"}_${year}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>
            Unduplicated Admissions By Multiple Location
          </h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Select the reporting year and provide the Medicare Provider Number
            (CCN) to generate the Unduplicated Admissions by Multiple Location
            declaration report.
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
                label="Parent Location"
                placeholder="City, State"
                name="parentLocation"
                value={parentLocation}
                onChange={(e) => setParentLocation(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Reporting Period:</span>
              <span className={classes.statValue}>{coverageLabel}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Status:</span>
              <span className={classes.statValue}>NOT APPLICABLE (N/A)</span>
            </div>
          </div>

          <PDFDownloadLink
            key={`${year}-${ccn}-${preparedBy}-${parentLocation}`}
            document={
              <UnduplicatedAdmissionsByLocationDocument
                selectedYear={year}
                ccn={ccn}
                preparedBy={preparedBy}
                parentLocation={parentLocation}
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
                  Download Unduplicated Admissions By Location PDF
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

export default PrintUnduplicatedAdmissionsByLocationModal;

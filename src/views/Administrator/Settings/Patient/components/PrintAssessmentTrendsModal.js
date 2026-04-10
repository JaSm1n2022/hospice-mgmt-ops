import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import AssessmentTrendsDocument from "./AssessmentTrendsDocument";
import moment from "moment";

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

function PrintAssessmentTrendsModal({ isOpen, onClose, patientsData, logoBase64 }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const fileName = `Assessment_Trends_Report_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  // Calculate some basic stats for display
  const totalPatients = patientsData.length;
  const assessmentsCount = new Set(patientsData.map(p => p.assessment).filter(Boolean)).size;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Assessment Trends Report</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Generate a comprehensive PDF report analyzing patient assessment trends, mortality rates, and alerts.
          </Typography>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Patients:</span>
              <span className={classes.statValue}>{totalPatients}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Assessment Types:</span>
              <span className={classes.statValue}>{assessmentsCount}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Report Date:</span>
              <span className={classes.statValue}>{moment().format("MM/DD/YYYY")}</span>
            </div>
          </div>

          <PDFDownloadLink
            document={
              <AssessmentTrendsDocument
                patientsData={patientsData}
                logoBase64={logoBase64}
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
                  Generating PDF...
                </>
              ) : (
                <>
                  <GetApp />
                  Download Assessment Trends PDF
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

export default PrintAssessmentTrendsModal;

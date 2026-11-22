import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import RosterDocument, { buildRosterModel } from "./RosterDocument";

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
    width: "520px",
    maxWidth: "95vw",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#153348",
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
    backgroundColor: "#26935B",
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
      backgroundColor: "#1F6B46",
    },
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
    marginTop: "10px",
  },
}));

function PrintRosterModal({ isOpen, onClose, employeesData, checklistsData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!employeesData || employeesData.length === 0) {
    return null;
  }

  const { clinicalEmployees, contractors, aides, volunteers } = buildRosterModel(
    employeesData,
    { checklists: checklistsData }
  );

  const fileName = `HSP1-2A_Clinical_Staff_Roster_${moment().format("YYYY-MM-DD")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Clinical Staff Roster</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Generates a four-section roster PDF (Clinical Employees, Contracted
            Clinical Staff, Hospice Aides, Volunteers) from active employee
            records.
          </Typography>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Clinical Employees:</span>
              <span className={classes.statValue}>{clinicalEmployees.length}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Contracted Clinical Staff:</span>
              <span className={classes.statValue}>{contractors.length}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Hospice Aides:</span>
              <span className={classes.statValue}>{aides.length}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Volunteers:</span>
              <span className={classes.statValue}>{volunteers.length}</span>
            </div>
          </div>

          <PDFDownloadLink
            document={
              <RosterDocument
                employeesData={employeesData}
                checklistsData={checklistsData}
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
                  Download Roster PDF
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

export default PrintRosterModal;

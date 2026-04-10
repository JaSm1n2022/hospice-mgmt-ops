import React from "react";
import { Modal, makeStyles, CircularProgress } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import ChecklistAlertDocument from "./ChecklistAlertDocument";
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
    outline: "none",
  },
  header: {
    backgroundColor: "#f44336",
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
    textAlign: "center",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#f44336",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  info: {
    marginBottom: "20px",
    color: "#666",
  },
}));

function PrintAlertViewModal({ isOpen, onClose, patientsData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const fileName = `Patient_Checklist_Alerts_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  // Limit to prevent freezing with large datasets
  const limitedData = patientsData.slice(0, 50); // Max 50 patients per PDF
  const isLimited = patientsData.length > 50;

  console.log("PrintAlertViewModal - Number of patients:", patientsData.length);
  console.log("PrintAlertViewModal - Limited to:", limitedData.length);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Alert View - Selected Patients</h3>
          <Clear className={classes.closeButton} onClick={onClose} />
        </div>
        <div className={classes.content}>
          {error ? (
            <div style={{ color: "red", marginBottom: 20 }}>
              <p>Error: {error.message || error.toString()}</p>
              <p>Please try again or print individual checklists.</p>
            </div>
          ) : (
            <>
              <p className={classes.info}>
                Ready to download alert view for {limitedData.length} patient{limitedData.length !== 1 ? 's' : ''}
                {isLimited && <span style={{ color: "orange", display: "block", fontSize: "0.9em" }}>
                  (Limited to first 50 patients - total: {patientsData.length})
                </span>}
              </p>
              <p style={{ fontSize: "0.9em", color: "#999", marginBottom: 20 }}>
                This view shows only alerts, incomplete items, and remarks for each patient.
              </p>
              <PDFDownloadLink
                document={<ChecklistAlertDocument patientsData={limitedData} />}
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
                      Download Alert View PDF
                    </>
                  );
                }}
              </PDFDownloadLink>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PrintAlertViewModal;

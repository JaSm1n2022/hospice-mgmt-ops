import React from "react";
import { Modal, makeStyles, CircularProgress } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import PatientSummaryDocument from "./PatientSummaryDocument";
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
    backgroundColor: "#4caf50",
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
    backgroundColor: "#4caf50",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  info: {
    marginBottom: "20px",
    color: "#666",
  },
  patientName: {
    fontSize: "1.1em",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
}));

function PrintPatientModal({ isOpen, onClose, patientData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientData) {
    return null;
  }

  const fileName = `Patient_Summary_${patientData.patientCd || "Unknown"}_${moment().format(
    "YYYY-MM-DD_HHmmss"
  )}.pdf`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Print Patient Summary</h3>
          <Clear className={classes.closeButton} onClick={onClose} />
        </div>
        <div className={classes.content}>
          {error ? (
            <div style={{ color: "red", marginBottom: 20 }}>
              <p>Error: {error.message || error.toString()}</p>
              <p>Please try again.</p>
            </div>
          ) : (
            <>
              <p className={classes.patientName}>
                {patientData.clientName || "N/A"}
              </p>
              <p className={classes.info}>
                Patient # {patientData.patientCd || "N/A"}
              </p>
              <p style={{ fontSize: "0.9em", color: "#999", marginBottom: 20 }}>
                Includes all patient Medicare cap details, benefits, and FY breakdown.
              </p>
              <PDFDownloadLink
                document={<PatientSummaryDocument patientData={patientData} />}
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
                      Download Patient Summary PDF
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

export default PrintPatientModal;

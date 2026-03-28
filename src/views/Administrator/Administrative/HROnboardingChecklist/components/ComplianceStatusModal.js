import React, { useEffect, useRef } from "react";
import { Modal, makeStyles } from "@material-ui/core";
import { pdf } from "@react-pdf/renderer";
import { Clear } from "@material-ui/icons";
import ComplianceStatusDocumentSimple from "./ComplianceStatusDocumentSimple";

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
    width: "90%",
    height: "90%",
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
    position: "relative",
    zIndex: 10000,
  },
  closeButton: {
    cursor: "pointer",
    fontSize: "24px",
    zIndex: 10001,
    "&:hover": {
      opacity: 0.8,
    },
  },
  pdfContainer: {
    width: "100%",
    height: "calc(100% - 60px)",
  },
}));

function ComplianceStatusModal({ isOpen, onClose, complianceData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const iframeRef = useRef(null);


  // Generate PDF blob when modal opens
  useEffect(() => {
    if (isOpen && complianceData && complianceData.length > 0) {
      setLoading(true);
      setError(null);

      let timeoutId;

      const generatePdf = async () => {
        try {
          // Set a timeout to catch infinite loops
          timeoutId = setTimeout(() => {
            setError("PDF generation timed out. Please try again with fewer employees.");
            setLoading(false);
          }, 15000); // 15 second timeout

          const doc = <ComplianceStatusDocumentSimple complianceData={complianceData} />;
          const asPdf = pdf(doc);
          const blob = await asPdf.toBlob();

          clearTimeout(timeoutId);

          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
        } catch (err) {
          clearTimeout(timeoutId);
          console.error("Error generating PDF:", err);
          setError(err.message || "Error generating PDF. Please try again.");
          setLoading(false);
        }
      };

      generatePdf();

      // Cleanup
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }
  }, [isOpen, complianceData]);

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    onClose && onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Compliance Status Report ({complianceData?.length || 0} employees)</h3>
          <div
            onClick={handleClose}
            style={{
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10001,
            }}
          >
            <Clear style={{ fontSize: "24px" }} />
          </div>
        </div>
        <div className={classes.pdfContainer}>
          {!complianceData || complianceData.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", backgroundColor: "white" }}>
              <p>No compliance data available.</p>
              <button onClick={handleClose}>Close</button>
            </div>
          ) : loading ? (
            <div style={{ padding: 20, textAlign: "center", backgroundColor: "white" }}>
              <p>Generating PDF...</p>
              <p style={{ fontSize: 12, color: "#666" }}>Please wait while we prepare your compliance report.</p>
            </div>
          ) : error ? (
            <div style={{ padding: 20, textAlign: "center", backgroundColor: "white", color: "red" }}>
              <p>Error generating PDF: {error}</p>
              <button onClick={handleClose}>Close</button>
            </div>
          ) : pdfUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Compliance Status Report"
            />
          ) : (
            <div style={{ padding: 20, textAlign: "center", backgroundColor: "white" }}>
              <p>Initializing PDF viewer...</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ComplianceStatusModal;

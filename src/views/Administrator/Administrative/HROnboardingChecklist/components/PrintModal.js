import React from "react";
import { Modal, makeStyles } from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import { Clear } from "@material-ui/icons";
import ChecklistPrintDocument from "./ChecklistPrintDocument";

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
    backgroundColor: "#667eea",
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
  pdfContainer: {
    width: "100%",
    height: "calc(100% - 60px)",
  },
}));

function PrintModal({ isOpen, onClose, employeeData, checklistData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  if (!employeeData || !checklistData) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Print HR Onboarding Checklist</h3>
          <Clear className={classes.closeButton} onClick={onClose} />
        </div>
        <div className={classes.pdfContainer}>
          <PDFViewer width="100%" height="100%">
            <ChecklistPrintDocument
              employeeData={employeeData}
              checklistData={checklistData}
            />
          </PDFViewer>
        </div>
      </div>
    </Modal>
  );
}

export default PrintModal;

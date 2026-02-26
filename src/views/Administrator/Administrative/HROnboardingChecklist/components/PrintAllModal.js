import React from "react";
import { Modal, makeStyles } from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import { Clear } from "@material-ui/icons";
import ChecklistPrintAllDocument from "./ChecklistPrintAllDocument";

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

function PrintAllModal({ isOpen, onClose, employeesData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  if (!employeesData || employeesData.length === 0) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Print All HR Onboarding Checklists</h3>
          <Clear className={classes.closeButton} onClick={onClose} />
        </div>
        <div className={classes.pdfContainer}>
          <PDFViewer width="100%" height="100%">
            <ChecklistPrintAllDocument employeesData={employeesData} />
          </PDFViewer>
        </div>
      </div>
    </Modal>
  );
}

export default PrintAllModal;

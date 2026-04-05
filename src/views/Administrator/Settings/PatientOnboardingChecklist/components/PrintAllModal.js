import React from "react";
import { Modal, makeStyles, CircularProgress } from "@material-ui/core";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
// import ChecklistPrintAllDocument from "./ChecklistPrintAllDocument";
import moment from "moment";

// Simple Print All Document
const SimpleTestDocument = ({ patientsData }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "white",
    },
    header: {
      marginBottom: 20,
      borderBottom: "2px solid #667eea",
      paddingBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#667eea",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 10,
      color: "#666",
    },
    patientSection: {
      marginTop: 15,
      paddingTop: 10,
      borderTop: "1px solid #ccc",
    },
    patientHeader: {
      backgroundColor: "#667eea",
      color: "white",
      padding: 8,
      marginBottom: 10,
      borderRadius: 3,
    },
    patientCd: {
      fontSize: 12,
      fontWeight: "bold",
    },
    sectionRow: {
      flexDirection: "row",
      marginBottom: 5,
      paddingLeft: 10,
    },
    sectionLabel: {
      fontSize: 10,
      flex: 2,
    },
    sectionStatus: {
      fontSize: 10,
      flex: 1,
      textAlign: "right",
    },
    complete: {
      color: "#4caf50",
      fontWeight: "bold",
    },
    incomplete: {
      color: "#f44336",
      fontWeight: "bold",
    },
    progress: {
      fontSize: 10,
      marginTop: 10,
      paddingTop: 10,
      borderTop: "1px solid #eee",
      textAlign: "right",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Patient Onboarding Checklist Summary</Text>
          <Text style={styles.subtitle}>
            Total Patients: {patientsData?.length || 0}
          </Text>
          <Text style={styles.subtitle}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {patientsData && patientsData.length > 0 ? (
          patientsData.map((patient, index) => {
            const renderStatus = (status) => {
              if (!status) return "0/0";
              return `${status.completed}/${status.total}`;
            };

            return (
              <View key={patient.id || index} style={styles.patientSection} wrap={false}>
                <View style={styles.patientHeader}>
                  <Text style={styles.patientCd}>{patient.patientCd || "N/A"}</Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Admission:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.admissionStatus?.completed === patient.admissionStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.admissionStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Assessment:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.assessmentStatus?.completed === patient.assessmentStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.assessmentStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Treatment Order:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.treatmentOrderStatus?.completed === patient.treatmentOrderStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.treatmentOrderStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Physician:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.physicianStatus?.completed === patient.physicianStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.physicianStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>IDG Notes:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.idgNotesStatus?.completed === patient.idgNotesStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.idgNotesStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Skilled Nursing Notes:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.skilledNursingNotesStatus?.completed === patient.skilledNursingNotesStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.skilledNursingNotesStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>HA Notes:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.haNotesStatus?.completed === patient.haNotesStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.haNotesStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Volunteer Notes:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.volunteerNotesStatus?.completed === patient.volunteerNotesStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.volunteerNotesStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Miscellaneous:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.miscellaneousStatus?.completed === patient.miscellaneousStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.miscellaneousStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Discharge:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.dischargeStatus?.completed === patient.dischargeStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.dischargeStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Compliance:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.complianceStatus?.completed === patient.complianceStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.complianceStatus)}
                  </Text>
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>POC:</Text>
                  <Text style={[styles.sectionStatus,
                    patient.pocStatus?.completed === patient.pocStatus?.total ? styles.complete : styles.incomplete]}>
                    {renderStatus(patient.pocStatus)}
                  </Text>
                </View>

                <Text style={styles.progress}>
                  Overall Progress: {patient.overallProgress || "0%"}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={{ fontSize: 10, marginTop: 20 }}>No patient data available</Text>
        )}

        <View style={{ marginTop: 30, paddingTop: 10, borderTop: "1px solid #ccc" }}>
          <Text style={{ fontSize: 9, color: "#666" }}>
            Note: For detailed checklist information, please print individual patient checklists.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

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
  content: {
    padding: "30px",
    textAlign: "center",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#5568d3",
    },
  },
  info: {
    marginBottom: "20px",
    color: "#666",
  },
}));

function PrintAllModal({ isOpen, onClose, patientsData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);

  if (!patientsData || patientsData.length === 0) {
    return null;
  }

  const fileName = `Patient_Onboarding_Checklists_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  // Limit to prevent freezing with large datasets
  const limitedData = patientsData.slice(0, 50); // Max 50 patients per PDF
  const isLimited = patientsData.length > 50;

  console.log("PrintAllModal - Number of patients:", patientsData.length);
  console.log("PrintAllModal - Limited to:", limitedData.length);
  console.log("PrintAllModal - Sample data:", patientsData[0]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>Print All Patient Onboarding Checklists</h3>
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
                Ready to download {limitedData.length} patient checklist{limitedData.length !== 1 ? 's' : ''}
                {isLimited && <span style={{ color: "orange", display: "block", fontSize: "0.9em" }}>
                  (Limited to first 50 patients - total: {patientsData.length})
                </span>}
              </p>
              <PDFDownloadLink
                document={<SimpleTestDocument patientsData={limitedData} />}
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
                      Download PDF
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

export default PrintAllModal;

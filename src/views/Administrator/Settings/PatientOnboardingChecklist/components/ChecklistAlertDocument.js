import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
  },
  mainHeader: {
    marginBottom: 20,
    borderBottom: "3px solid #667eea",
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#667eea",
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
  },
  patientSection: {
    marginTop: 20,
    marginBottom: 15,
    borderTop: "2px solid #ccc",
    paddingTop: 15,
  },
  patientHeader: {
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  patientCd: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  alertSection: {
    border: "2px solid #f44336",
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  alertSectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f44336",
    marginBottom: 8,
  },
  alertSubsection: {
    marginTop: 8,
    marginBottom: 6,
  },
  alertSubsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  alertItem: {
    fontSize: 10,
    color: "#333",
    marginLeft: 15,
    marginBottom: 3,
  },
  alertRemarkItem: {
    fontSize: 10,
    color: "#f44336",
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 4,
  },
  noAlertText: {
    fontSize: 10,
    color: "#4caf50",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 10,
    color: "#666",
  },
});

const GROUP_LABELS = {
  admission: "1. Admission",
  assessment: "2. Assessment",
  treatmentOrder: "3. Treatment Order",
  physician: "4. Physician",
  idgNotes: "5. IDG Notes",
  skilledNursingNotes: "6. Skilled Nursing Notes",
  haNotes: "7. HA Notes",
  volunteerNotes: "8. Volunteer Notes",
  miscellaneous: "9. Miscellaneous",
  discharge: "10. Discharge",
  bereavement: "11. Bereavement",
  compliance: "12. Compliance",
  poc: "13. Plan of Care (POC)",
  generalRemarks: "14. General Remarks",
};

const ITEM_LABELS = {
  demographicSheet: "Demographic Sheet",
  hospiceEvalOrder: "Hospice Eval Order",
  informedConsent: "Informed Consent",
  electionOfHospice: "Election of Hospice",
  polstrDnr: "Polstr/DNR",
  changeOfHospice: "Change of Hospice",
  poaAdvanceDirective: "POA/Advance Directive",
  billOfRights: "Bill of Rights",
  telehealthConsent: "Telehealth Consent",
  patientNotification: "Patient Notification",
  nursing: "Nursing",
  spiritual: "Spiritual",
  psychosocial: "Psychosocial",
  treatmentOrder: "Treatment Order",
  cti: "CTI",
  order: "Order",
  f2fVisit: "F2F Visit",
  referral: "Referral",
  medicalRecords: "Medical Records",
  dpoa: "DPOA",
  hp: "HP (History & Physical)",
  eligibility: "Eligibility",
  insuranceCard: "Insurance Card",
  id: "ID",
  dme: "DME",
  transportation: "Transportation",
  recordOfDeath: "Record of Death",
  drugDisposalRefusalForm: "Drug Disposal/Refusal Form",
  sympathyCard: "Sympathy Card",
  lettersOfBereavement: "Letters of Bereavement",
  hopeAdmission: "HOPE Admission",
  hopeHuv1: "HOPE HUV 1",
  hopeHuv2: "HOPE HUV 2",
  hopeDischarge: "HOPE Discharge",
  lcdEligibility: "LCD Eligibility",
};

// Helper function to check if remarks contain alert keywords
const hasAlertKeyword = (remarks) => {
  if (!remarks) return false;
  const remarksLower = remarks.toLowerCase().trim();
  return (
    remarksLower.includes("unresolve") ||
    remarksLower.includes("unresolved") ||
    remarksLower.includes("un-resolved") ||
    remarksLower.includes("not resolved") ||
    remarksLower.includes("poc issue") ||
    remarksLower.includes("declined") ||
    remarksLower.includes("no notes") ||
    remarksLower.includes("no chaplain signature") ||
    remarksLower.includes("no msw signature") ||
    remarksLower.includes("no rn signature") ||
    remarksLower.includes("no signature") ||
    remarksLower.includes("no assessment")
  );
};

// Helper function to collect alerts from patient data
const collectPatientAlerts = (patient) => {
  const incompleteItems = [];
  const alertRemarks = [];

  // Check Admission items
  if (patient.admission) {
    if (!patient.admission.demographicSheet?.checked) {
      incompleteItems.push("Admission: Demographic Sheet");
    }
    ["hospiceEvalOrder", "informedConsent", "electionOfHospice", "polstrDnr", "poaAdvanceDirective", "billOfRights", "telehealthConsent", "patientNotification"].forEach((key) => {
      if (!patient.admission[key] || (patient.admission[key] !== "Y" && patient.admission[key] !== "NA")) {
        incompleteItems.push(`Admission: ${ITEM_LABELS[key]}`);
      }
    });
  }

  // Check Assessment items and remarks
  if (patient.assessment) {
    ["nursing", "spiritual", "psychosocial"].forEach((key) => {
      if (!patient.assessment[key] || (patient.assessment[key] !== "Y" && patient.assessment[key] !== "NA")) {
        incompleteItems.push(`Assessment: ${ITEM_LABELS[key]}`);
      }
      const remarksKey = `${key}Remarks`;
      if (patient.assessment[remarksKey] && hasAlertKeyword(patient.assessment[remarksKey])) {
        alertRemarks.push(`Assessment (${ITEM_LABELS[key]}): ${patient.assessment[remarksKey]}`);
      }
    });
  }

  // Check Treatment Order
  if (patient.treatmentOrder) {
    if (!patient.treatmentOrder.treatmentOrder?.checked) {
      incompleteItems.push("Treatment Order");
    }
  }

  // Check Physician items
  if (patient.physician) {
    ["cti", "order", "f2fVisit"].forEach((key) => {
      const item = patient.physician[key];
      if (!item || !item.value || (item.value !== "Y" && item.value !== "NA")) {
        incompleteItems.push(`Physician: ${ITEM_LABELS[key]}`);
      } else if (item.value === "Y" && !item.date) {
        incompleteItems.push(`Physician: ${ITEM_LABELS[key]} (missing date)`);
      }
    });
    if (!patient.physician.referral || (patient.physician.referral !== "Y" && patient.physician.referral !== "NA")) {
      incompleteItems.push("Physician: Referral");
    }
  }

  // Check Notes sections
  ["idgNotes", "skilledNursingNotes", "haNotes", "volunteerNotes"].forEach((section) => {
    if (patient[section]) {
      if (!patient[section].date) {
        incompleteItems.push(`${GROUP_LABELS[section]}: Date`);
      }
      if (patient[section].remarks && hasAlertKeyword(patient[section].remarks)) {
        alertRemarks.push(`${GROUP_LABELS[section]}: ${patient[section].remarks}`);
      }
    }
  });

  // Check Miscellaneous items
  if (patient.miscellaneous) {
    ["medicalRecords", "dpoa", "hp", "eligibility", "insuranceCard", "id", "dme", "transportation"].forEach((key) => {
      if (!patient.miscellaneous[key] || (patient.miscellaneous[key] !== "Y" && patient.miscellaneous[key] !== "NA")) {
        incompleteItems.push(`Miscellaneous: ${ITEM_LABELS[key]}`);
      }
    });
  }

  // Check Bereavement items
  if (patient.bereavement) {
    ["recordOfDeath", "drugDisposalRefusalForm", "sympathyCard", "lettersOfBereavement"].forEach((key) => {
      if (!patient.bereavement[key] || (patient.bereavement[key] !== "Y" && patient.bereavement[key] !== "NA")) {
        incompleteItems.push(`Bereavement: ${ITEM_LABELS[key]}`);
      }
    });
  }

  // Check Compliance items
  if (patient.compliance) {
    ["hopeAdmission", "hopeHuv1", "hopeHuv2", "hopeDischarge"].forEach((key) => {
      const item = patient.compliance[key];
      if (!item || !item.value || (item.value !== "Y" && item.value !== "NA")) {
        incompleteItems.push(`Compliance: ${ITEM_LABELS[key]}`);
      } else if (item.value === "Y" && !item.date) {
        incompleteItems.push(`Compliance: ${ITEM_LABELS[key]} (missing date)`);
      }
    });
    if (!patient.compliance.lcdEligibility?.checked) {
      incompleteItems.push("Compliance: LCD Eligibility");
    }
  }

  // General remarks are always included in alert section
  const generalRemarks = patient.remarks && Array.isArray(patient.remarks) && patient.remarks.length > 0
    ? patient.remarks.filter(r => r && r.trim() !== "")
    : [];

  return {
    incompleteItems,
    alertRemarks,
    generalRemarks,
  };
};

const ChecklistAlertDocument = ({ patientsData }) => {
  const renderAlertSection = (patient) => {
    const alerts = collectPatientAlerts(patient);
    const { incompleteItems, alertRemarks, generalRemarks } = alerts;

    const hasAlerts = incompleteItems.length > 0 || alertRemarks.length > 0 || generalRemarks.length > 0;

    if (!hasAlerts) {
      return (
        <View style={styles.alertSection}>
          <Text style={styles.alertSectionTitle}>⚠ ALERT SECTION</Text>
          <Text style={styles.noAlertText}>✓ No alerts - All items completed!</Text>
        </View>
      );
    }

    return (
      <View style={styles.alertSection}>
        <Text style={styles.alertSectionTitle}>⚠ ALERT SECTION</Text>

        {/* Incomplete Items */}
        {incompleteItems.length > 0 && (
          <View style={styles.alertSubsection}>
            <Text style={styles.alertSubsectionTitle}>Incomplete Items ({incompleteItems.length}):</Text>
            {incompleteItems.map((item, idx) => (
              <Text key={idx} style={styles.alertItem}>• {item}</Text>
            ))}
          </View>
        )}

        {/* Alert Remarks (Red Label Remarks) */}
        {alertRemarks.length > 0 && (
          <View style={styles.alertSubsection}>
            <Text style={styles.alertSubsectionTitle}>Issues Requiring Attention ({alertRemarks.length}):</Text>
            {alertRemarks.map((remark, idx) => (
              <Text key={idx} style={styles.alertRemarkItem}>• {remark}</Text>
            ))}
          </View>
        )}

        {/* General Remarks */}
        {generalRemarks.length > 0 && (
          <View style={styles.alertSubsection}>
            <Text style={styles.alertSubsectionTitle}>General Remarks ({generalRemarks.length}):</Text>
            {generalRemarks.map((remark, idx) => (
              <Text key={idx} style={styles.alertItem}>• {remark}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPatient = (patient, index) => {
    return (
      <View
        key={patient.id || index}
        style={styles.patientSection}
        break={index > 0}
      >
        <View style={styles.patientHeader}>
          <Text style={styles.patientCd}>{patient.patientCd || "N/A"}</Text>
        </View>

        {/* Alert Section Only */}
        {renderAlertSection(patient)}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>
            Patient Onboarding Checklist - Alert View
          </Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={styles.generatedText}>
            Total Patients: {patientsData?.length || 0}
          </Text>
        </View>

        {patientsData && patientsData.length > 0 ? (
          patientsData.map((patient, index) => renderPatient(patient, index))
        ) : (
          <Text>No patient data available</Text>
        )}

        <View style={styles.footer}>
          <Text>
            Alert View - Shows only incomplete items, issues requiring attention, and general remarks
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChecklistAlertDocument;

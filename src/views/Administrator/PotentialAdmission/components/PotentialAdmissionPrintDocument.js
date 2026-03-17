import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: 2,
    borderBottomColor: "#333",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  generated: {
    fontSize: 9,
    color: "#999",
    marginTop: 5,
  },
  section: {
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
    backgroundColor: "#667eea",
    color: "white",
    padding: 5,
  },
  fieldRow: {
    marginBottom: 4,
    marginLeft: 10,
  },
  fieldLabel: {
    fontSize: 9,
    color: "#333",
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: 1,
    borderTopColor: "#ccc",
    borderTopStyle: "solid",
  },
});

const PotentialAdmissionPrintDocument = ({ admissionData }) => {
  // Ensure we have valid data
  if (!admissionData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  const safeString = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return String(value);
  };

  const safeDate = (date) => {
    if (!date) return "N/A";
    try {
      return moment(date).format("MM/DD/YYYY");
    } catch (e) {
      return "N/A";
    }
  };

  const safeStatus = (status) => {
    if (!status) return "N/A";
    if (status === "no_prior_hospice") return "No Prior Hospice";
    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  const safeCost = (cost) => {
    if (!cost) return "N/A";
    try {
      return `$${parseFloat(cost).toFixed(2)}`;
    } catch (e) {
      return "N/A";
    }
  };

  const getAdmissionDecisionLabel = (decision) => {
    if (!decision || decision === "" || decision === "N/A") {
      return "Pending/Further Evaluation";
    }
    return String(decision);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Potential Admission Summary</Text>
          <Text style={styles.subtitle}>Patient Code: {safeString(admissionData.patientCd)}</Text>
          <Text style={styles.subtitle}>Admission Decision: {getAdmissionDecisionLabel(admissionData.admission_decision)}</Text>
          {admissionData.admission_decision === "Admit to Hospice" && admissionData.admission_dt && (
            <Text style={styles.subtitle}>Admission Date: {safeDate(admissionData.admission_dt)}</Text>
          )}
          <Text style={styles.generated}>Generated: {moment().format("MM/DD/YYYY hh:mm A")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Patient Code: {safeString(admissionData.patientCd)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Referral: {safeString(admissionData.referral)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Eligibility Date: {safeDate(admissionData.eligibility_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Age: {safeString(admissionData.age)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Current Location: {safeString(admissionData.current_location)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Hospice Status: {safeStatus(admissionData.hospice_status)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Current Hospice Benefits: {safeString(admissionData.current_hospice_benefits)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Received HP Date: {safeDate(admissionData.received_hp_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Emailed HP to Pre-Admission: {safeDate(admissionData.emailed_hp_to_pre_admission_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Received Pre-Admission: {safeDate(admissionData.received_pre_admission_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Forwarded Pre-Admission: {safeDate(admissionData.forwarded_pre_admission_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Evaluation Date: {safeDate(admissionData.eval_dt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Admission Date: {safeDate(admissionData.admission_dt)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Staff and Admission Decision</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Assigned NP: {safeString(admissionData.eval_staff)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Admission Nurse: {safeString(admissionData.admission_nurse)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Admission Decision: {safeString(admissionData.admission_decision)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Admission Cost: {safeCost(admissionData.admission_cost)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical Information</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Pre-Admission Prognosis: {safeString(admissionData.pre_admission_prognosis)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>HP Prognosis: {safeString(admissionData.hp_prognosis)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>MD Prognosis: {safeString(admissionData.md_prognosis)}</Text>
          </View>
        </View>

        {admissionData.comments && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comments</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Comments: {safeString(admissionData.comments)}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text>This document was generated automatically. Please verify all information before use.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PotentialAdmissionPrintDocument;

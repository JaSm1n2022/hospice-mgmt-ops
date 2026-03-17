import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
    fontSize: 11,
    color: "#666",
    marginBottom: 3,
  },
  generated: {
    fontSize: 9,
    color: "#999",
    marginTop: 5,
  },
  patientSection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderLeft: 4,
    borderLeftColor: "#667eea",
    borderLeftStyle: "solid",
  },
  patientHeader: {
    fontSize: 13,
    color: "#667eea",
    marginBottom: 8,
  },
  section: {
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    marginBottom: 4,
    backgroundColor: "#667eea",
    color: "white",
    padding: 4,
  },
  fieldRow: {
    marginBottom: 3,
    marginLeft: 8,
  },
  fieldLabel: {
    fontSize: 8,
    color: "#333",
  },
  divider: {
    marginTop: 6,
    marginBottom: 6,
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
  summarySection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 13,
    marginBottom: 8,
    color: "#333",
  },
  summaryRow: {
    marginBottom: 3,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#555",
  },
});

const PotentialAdmissionBatchPrintDocument = ({ admissionsData }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD/YYYY");
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return String(value);
  };

  const formatHospiceStatus = (status) => {
    if (!status) return "N/A";
    if (status === "no_prior_hospice") return "No Prior Hospice";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCost = (cost) => {
    if (!cost) return "N/A";
    return `$${parseFloat(cost).toFixed(2)}`;
  };

  const getAdmissionDecisionLabel = (decision) => {
    if (!decision || decision === "" || decision === "N/A") {
      return "Pending/Further Evaluation";
    }
    return String(decision);
  };

  // Calculate summary counts
  const calculateSummary = () => {
    if (!admissionsData || admissionsData.length === 0) {
      return {
        total: 0,
        admitted: 0,
        nonAdmit: 0,
        pending: 0,
        noPriorHospice: 0,
        revoked: 0,
        discharged: 0,
        locationCounts: {},
        prognosisCounts: {},
      };
    }

    const total = admissionsData.length;
    let admitted = 0;
    let nonAdmit = 0;
    let pending = 0;
    let noPriorHospice = 0;
    let revoked = 0;
    let discharged = 0;
    const locationCounts = {};
    const prognosisCounts = {};

    admissionsData.forEach((admission) => {
      // Admission decision counts
      const decision = admission.admission_decision;
      if (decision === "Admit to Hospice") {
        admitted++;
      } else if (decision === "Non-Admit") {
        nonAdmit++;
      } else {
        pending++; // N/A, empty, or "Pending / Further Evaluation"
      }

      // Hospice status counts
      const status = admission.hospice_status;
      if (status === "no_prior_hospice" || status === "No Prior Hospice") {
        noPriorHospice++;
      } else if (status === "revoked" || status === "Revoked") {
        revoked++;
      } else if (status === "discharged" || status === "Discharged") {
        discharged++;
      }

      // Current location counts
      const location = admission.current_location || "Not Specified";
      locationCounts[location] = (locationCounts[location] || 0) + 1;

      // Pre-admission prognosis counts
      const prognosis = admission.pre_admission_prognosis || "";
      const prognosisLower = prognosis.toLowerCase();

      // Check if prognosis indicates "Insufficient clinical information"
      if (
        prognosisLower.includes("insufficient to support") ||
        prognosisLower.includes("insufficient clinical information")
      ) {
        prognosisCounts["Insufficient clinical information"] =
          (prognosisCounts["Insufficient clinical information"] || 0) + 1;
      }
      // Check if prognosis indicates "No Terminal Diagnosis"
      else if (
        prognosisLower.includes("terminal trajectory not yet clear") ||
        prognosisLower.includes("no terminal diagnosis") ||
        prognosisLower.includes("no clearly identified terminal diagnosis") ||
        prognosisLower.includes(
          "no recent hospitalizations related to terminal disease progression"
        ) ||
        prognosisLower.includes(
          "a qualifying terminal diagnosis has not been established"
        )
      ) {
        prognosisCounts["No Terminal Diagnosis"] =
          (prognosisCounts["No Terminal Diagnosis"] || 0) + 1;
      } else if (prognosis && prognosis.trim() !== "") {
        // Group by actual prognosis value
        prognosisCounts[prognosis] = (prognosisCounts[prognosis] || 0) + 1;
      } else {
        prognosisCounts["Not Specified"] =
          (prognosisCounts["Not Specified"] || 0) + 1;
      }
    });

    return {
      total,
      admitted,
      nonAdmit,
      pending,
      noPriorHospice,
      revoked,
      discharged,
      locationCounts,
      prognosisCounts,
    };
  };

  const renderField = (label, value) => {
    return (
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>
          {label}: {formatValue(value)}
        </Text>
      </View>
    );
  };

  const renderDateField = (label, date) => {
    return (
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>
          {label}: {formatDate(date)}
        </Text>
      </View>
    );
  };

  const renderPatient = (admissionData, index, isLast) => {
    return (
      <View key={admissionData.id || index} wrap={false}>
        <View style={styles.patientSection}>
          <Text style={styles.patientHeader}>
            Patient {index + 1}: {admissionData?.patientCd || "N/A"}
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>
              Admission Decision:{" "}
              {getAdmissionDecisionLabel(admissionData.admission_decision)}
            </Text>
          </View>
          {admissionData.admission_decision === "Admit to Hospice" &&
            admissionData.admission_dt && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>
                  Admission Date: {formatDate(admissionData.admission_dt)}
                </Text>
              </View>
            )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {renderField("Patient Code", admissionData.patientCd)}
            {renderField("Referral", admissionData.referral)}
            {renderDateField("Eligibility Date", admissionData.eligibility_dt)}
            {renderField("Age", admissionData.age)}
            {renderField("Current Location", admissionData.current_location)}
            {renderField(
              "Hospice Status",
              formatHospiceStatus(admissionData.hospice_status)
            )}
            {renderField(
              "Current Hospice Benefits",
              admissionData.current_hospice_benefits
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Important Dates</Text>
            {renderDateField("Received HP Date", admissionData.received_hp_dt)}
            {renderDateField(
              "Emailed HP to Pre-Admission",
              admissionData.emailed_hp_to_pre_admission_dt
            )}
            {renderDateField(
              "Received Pre-Admission",
              admissionData.received_pre_admission_dt
            )}
            {renderDateField(
              "Forwarded Pre-Admission",
              admissionData.forwarded_pre_admission_dt
            )}
            {renderDateField("Evaluation Date", admissionData.eval_dt)}
            {renderDateField("Admission Date", admissionData.admission_dt)}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Staff and Decision</Text>
            {renderField("Assigned NP", admissionData.eval_staff)}
            {renderField("Admission Nurse", admissionData.admission_nurse)}
            {renderField("Medical Director", admissionData.medical_director)}
            {renderField(
              "Admission Decision",
              admissionData.admission_decision
            )}
            {renderField(
              "Admission Cost",
              formatCost(admissionData.admission_cost)
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinical Information</Text>
            {renderField(
              "Pre-Admission Prognosis",
              admissionData.pre_admission_prognosis
            )}
            {renderField("HP Prognosis", admissionData.hp_prognosis)}
            {renderField("MD Prognosis", admissionData.md_prognosis)}
          </View>

          {admissionData.comments && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comments</Text>
                {renderField("Comments", admissionData.comments)}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const summary = calculateSummary();

  // Sort admissions by decision: Admit to Hospice, Pending, then Non-Admit
  const sortAdmissionsByDecision = (data) => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      const getDecisionOrder = (decision) => {
        if (decision === "Admit to Hospice") return 1;
        if (decision === "Non-Admit") return 3;
        return 2; // Pending/Further Evaluation or empty
      };

      return (
        getDecisionOrder(a.admission_decision) -
        getDecisionOrder(b.admission_decision)
      );
    });
  };

  const sortedAdmissions = sortAdmissionsByDecision(admissionsData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Potential Admissions Report</Text>
          <Text style={styles.subtitle}>
            Total Patients: {admissionsData?.length || 0}
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {admissionsData && admissionsData.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary Statistics</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Total Patients: {summary.total}
              </Text>
            </View>

            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>
                Admission Decision:
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • Admit to Hospice: {summary.admitted}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • Pending/Further Evaluation: {summary.pending}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • Non-Admit: {summary.nonAdmit}
              </Text>
            </View>

            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>
                Hospice Status:
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • No Prior Hospice: {summary.noPriorHospice}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • Revoked: {summary.revoked}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {" "}
                • Discharged: {summary.discharged}
              </Text>
            </View>

            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>
                Current Location:
              </Text>
            </View>
            {Object.entries(summary.locationCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([location, count]) => (
                <View key={location} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {" "}
                    • {location}: {count}
                  </Text>
                </View>
              ))}

            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>
                Pre-Admission Prognosis:
              </Text>
            </View>
            {Object.entries(summary.prognosisCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([prognosis, count]) => (
                <View key={prognosis} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {" "}
                    • {prognosis}: {count}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {sortedAdmissions && sortedAdmissions.length > 0 ? (
          sortedAdmissions.map((admission, index) =>
            renderPatient(
              admission,
              index,
              index === sortedAdmissions.length - 1
            )
          )
        ) : (
          <Text style={styles.fieldLabel}>No admissions data available.</Text>
        )}

        <View style={styles.footer}>
          <Text>
            This document was generated automatically. Please verify all
            information before use.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PotentialAdmissionBatchPrintDocument;

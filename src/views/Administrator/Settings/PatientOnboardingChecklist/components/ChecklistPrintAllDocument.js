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
  section: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    backgroundColor: "#667eea",
    color: "white",
    padding: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 10,
  },
  checkboxContainer: {
    width: 14,
    height: 14,
    border: "2px solid #666",
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainerChecked: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkboxContainerUnchecked: {
    backgroundColor: "white",
    borderColor: "#f44336",
  },
  itemText: {
    fontSize: 10,
    flex: 1,
  },
  dateText: {
    fontSize: 9,
    color: "#666",
    marginLeft: 5,
  },
  textRow: {
    paddingLeft: 10,
    marginBottom: 5,
  },
  textLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textValue: {
    fontSize: 9,
    color: "#333",
    marginLeft: 10,
  },
  pocEntry: {
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: 3,
  },
  pocBullet: {
    fontSize: 9,
    marginRight: 5,
  },
  pocText: {
    fontSize: 9,
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 10,
    color: "#666",
  },
  pageBreak: {
    marginTop: 30,
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
  compliance: "11. Compliance",
  poc: "12. Plan of Care (POC)",
};

const ITEM_LABELS = {
  demographicSheet: "Demographic Sheet",
  polst: "POLST",
  consents: "Consents",
  patientNotification: "Patient Notification",
  nursing: "Nursing",
  spiritual: "Spiritual",
  psychosocial: "Psychosocial",
  treatmentOrder: "Treatment Order",
  cti: "CTI",
  order: "Order",
  f2fVisit: "F2F Visit",
  medicalRecords: "Medical Records",
  dpoa: "DPOA",
  hp: "HP (History & Physical)",
  eligibility: "Eligibility",
  insuranceCard: "Insurance Card",
  id: "ID",
};

const ChecklistPrintAllDocument = ({ patientsData }) => {
  const renderBooleanItem = (itemKey, itemData) => {
    const isChecked = itemData && itemData.checked;

    return (
      <View style={styles.itemRow} key={itemKey}>
        <View
          style={[
            styles.checkboxContainer,
            isChecked ? styles.checkboxContainerChecked : styles.checkboxContainerUnchecked,
          ]}
        />
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
      </View>
    );
  };

  const renderBooleanWithDateItem = (itemKey, itemData) => {
    const isChecked = itemData && itemData.checked;
    const hasDate = itemData && itemData.date;

    return (
      <View style={styles.itemRow} key={itemKey}>
        <View
          style={[
            styles.checkboxContainer,
            isChecked ? styles.checkboxContainerChecked : styles.checkboxContainerUnchecked,
          ]}
        />
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
        {hasDate && (
          <Text style={styles.dateText}>
            {moment(itemData.date).format("MM/DD/YY")}
          </Text>
        )}
      </View>
    );
  };

  const renderDateField = (label, value) => {
    return (
      <View style={styles.textRow}>
        <Text style={styles.textLabel}>{label}:</Text>
        <Text style={styles.textValue}>
          {value ? moment(value).format("MM/DD/YYYY") : "N/A"}
        </Text>
      </View>
    );
  };

  const renderTextField = (label, value) => {
    return (
      <View style={styles.textRow}>
        <Text style={styles.textLabel}>{label}:</Text>
        <Text style={styles.textValue}>{value || "N/A"}</Text>
      </View>
    );
  };

  const renderNotesInline = (date, createdUser, remarks) => {
    const remarksLower = remarks ? remarks.toLowerCase().trim() : "";
    const isUnresolved = remarksLower.includes("unresolve") ||
                         remarksLower.includes("unresolved") ||
                         remarksLower.includes("un-resolved") ||
                         remarksLower.includes("not resolved");

    return (
      <View style={styles.textRow}>
        <Text style={{ fontSize: 10 }}>
          Date: {date ? moment(date).format("MM/DD/YYYY") : "N/A"} |
          {" "}Created User: {createdUser || "N/A"} |
          {" "}Remarks: <Text style={isUnresolved ? { fontWeight: "bold", color: "#f44336" } : { fontWeight: "bold" }}>
            {remarks || "N/A"}
          </Text>
        </Text>
      </View>
    );
  };

  const renderPatient = (patient, index) => {
    return (
      <View key={patient.id || index} style={styles.patientSection} break={index > 0}>
        <View style={styles.patientHeader}>
          <Text style={styles.patientCd}>
            {patient.patientCd || "N/A"}
          </Text>
        </View>

        {/* Admission */}
        {patient.admission && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.admission}</Text>
            {renderBooleanItem("demographicSheet", patient.admission.demographicSheet)}
            {renderBooleanItem("polst", patient.admission.polst)}
            {renderBooleanItem("consents", patient.admission.consents)}
            {renderBooleanItem("patientNotification", patient.admission.patientNotification)}
          </View>
        )}

        {/* Assessment */}
        {patient.assessment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.assessment}</Text>
            {renderBooleanItem("nursing", patient.assessment.nursing)}
            {renderBooleanItem("spiritual", patient.assessment.spiritual)}
            {renderBooleanItem("psychosocial", patient.assessment.psychosocial)}
          </View>
        )}

        {/* Treatment Order */}
        {patient.treatmentOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.treatmentOrder}</Text>
            {renderBooleanItem("treatmentOrder", patient.treatmentOrder.treatmentOrder)}
          </View>
        )}

        {/* Physician */}
        {patient.physician && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.physician}</Text>
            {renderBooleanWithDateItem("cti", patient.physician.cti)}
            {renderBooleanWithDateItem("order", patient.physician.order)}
            {renderBooleanWithDateItem("f2fVisit", patient.physician.f2fVisit)}
          </View>
        )}

        {/* IDG Notes */}
        {patient.idgNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.idgNotes}</Text>
            {renderNotesInline(patient.idgNotes.date, patient.idgNotes.createdUser, patient.idgNotes.remarks)}
          </View>
        )}

        {/* Skilled Nursing Notes */}
        {patient.skilledNursingNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.skilledNursingNotes}</Text>
            {renderNotesInline(patient.skilledNursingNotes.date, patient.skilledNursingNotes.createdUser, patient.skilledNursingNotes.remarks)}
          </View>
        )}

        {/* HA Notes */}
        {patient.haNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.haNotes}</Text>
            {renderNotesInline(patient.haNotes.date, patient.haNotes.createdUser, patient.haNotes.remarks)}
          </View>
        )}

        {/* Volunteer Notes */}
        {patient.volunteerNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.volunteerNotes}</Text>
            {renderNotesInline(patient.volunteerNotes.date, patient.volunteerNotes.createdUser, patient.volunteerNotes.remarks)}
          </View>
        )}

        {/* Miscellaneous */}
        {patient.miscellaneous && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.miscellaneous}</Text>
            {renderBooleanItem("medicalRecords", patient.miscellaneous.medicalRecords)}
            {renderBooleanItem("dpoa", patient.miscellaneous.dpoa)}
            {renderBooleanItem("hp", patient.miscellaneous.hp)}
            {renderBooleanItem("eligibility", patient.miscellaneous.eligibility)}
            {renderBooleanItem("insuranceCard", patient.miscellaneous.insuranceCard)}
            {renderBooleanItem("id", patient.miscellaneous.id)}
          </View>
        )}

        {/* Discharge */}
        {patient.discharge && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.discharge}</Text>
            <View style={styles.textRow}>
              <Text style={{ fontSize: 10 }}>
                Date: {patient.discharge.date ? moment(patient.discharge.date).format("MM/DD/YYYY") : "N/A"} |
                {" "}Reason: {patient.discharge.reason || "N/A"} |
                {" "}Documentation: {patient.discharge.documentation?.checked ? "YES" : "NO"}
              </Text>
            </View>
          </View>
        )}

        {/* Compliance */}
        {patient.compliance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.compliance}</Text>
            {renderDateField("HOPE Admission", patient.compliance.hopeAdmission)}
            {renderDateField("HOPE HUV 1", patient.compliance.hopeHuv1)}
            {renderDateField("HOPE HUV 2", patient.compliance.hopeHuv2)}
            {renderDateField("HOPE Discharge", patient.compliance.hopeDischarge)}
          </View>
        )}

        {/* POC */}
        {patient.poc && Array.isArray(patient.poc) && patient.poc.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.poc}</Text>
            {patient.poc.map((entry, idx) => (
              <View style={styles.pocEntry} key={idx}>
                <Text style={styles.pocBullet}>•</Text>
                <Text style={styles.pocText}>
                  {entry.staff} - {entry.frequency}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>
            Patient Onboarding Checklist - All Patients
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
            Legend: Green box = Completed | Red border = Incomplete
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChecklistPrintAllDocument;

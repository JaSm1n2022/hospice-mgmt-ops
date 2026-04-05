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
    width: 50,
    height: 16,
    border: "1px solid #666",
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  checkboxContainerChecked: {
    backgroundColor: "#4caf50",
    border: "1px solid #4caf50",
  },
  checkboxContainerUnchecked: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #f44336",
  },
  checkboxText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
  },
  checkboxTextUnchecked: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#f44336",
  },
  selectBox: {
    width: 50,
    height: 16,
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  selectBoxY: {
    backgroundColor: "#4caf50",
    border: "1px solid #4caf50",
  },
  selectBoxN: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #f44336",
  },
  selectBoxNA: {
    backgroundColor: "#fff9c4",
    border: "1px solid #fbc02d",
  },
  selectText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
  },
  selectTextDark: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333",
  },
  selectTextRed: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#f44336",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 10,
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
  remarkEntry: {
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: 3,
  },
  remarkBullet: {
    fontSize: 9,
    marginRight: 5,
  },
  remarkText: {
    fontSize: 9,
    flex: 1,
    color: "#333",
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
  generalRemarks: "13. General Remarks",
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
  hopeAdmission: "HOPE Admission",
  hopeHuv1: "HOPE HUV 1",
  hopeHuv2: "HOPE HUV 2",
  hopeDischarge: "HOPE Discharge",
  lcdEligibility: "LCD Eligibility",
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
        >
          <Text style={isChecked ? styles.checkboxText : styles.checkboxTextUnchecked}>
            {isChecked ? "YES" : "NO"}
          </Text>
        </View>
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
      </View>
    );
  };

  const renderSelectItem = (itemKey, itemValue) => {
    let boxStyle = styles.selectBoxN;
    let textStyle = styles.selectTextDark;
    let displayValue = "N/A";

    if (itemValue === "Y") {
      boxStyle = styles.selectBoxY;
      textStyle = styles.selectText;
      displayValue = "YES";
    } else if (itemValue === "N") {
      boxStyle = styles.selectBoxN;
      textStyle = styles.selectTextRed;
      displayValue = "NO";
    } else if (itemValue === "NA") {
      boxStyle = styles.selectBoxNA;
      textStyle = styles.selectTextDark;
      displayValue = "N/A";
    }

    return (
      <View style={styles.selectContainer} key={itemKey}>
        <View style={[styles.selectBox, boxStyle]}>
          <Text style={textStyle}>{displayValue}</Text>
        </View>
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
      </View>
    );
  };

  const renderSelectItemWithRemarks = (itemKey, itemValue, remarks) => {
    let boxStyle = styles.selectBoxN;
    let textStyle = styles.selectTextDark;
    let displayValue = "N/A";

    if (itemValue === "Y") {
      boxStyle = styles.selectBoxY;
      textStyle = styles.selectText;
      displayValue = "YES";
    } else if (itemValue === "N") {
      boxStyle = styles.selectBoxN;
      textStyle = styles.selectTextRed;
      displayValue = "NO";
    } else if (itemValue === "NA") {
      boxStyle = styles.selectBoxNA;
      textStyle = styles.selectTextDark;
      displayValue = "N/A";
    }

    // Check if remarks contains keywords for red highlighting
    const remarksLower = remarks ? remarks.toLowerCase().trim() : "";
    const hasIssue = remarksLower.includes("unresolve") ||
                     remarksLower.includes("unresolved") ||
                     remarksLower.includes("un-resolved") ||
                     remarksLower.includes("not resolved") ||
                     remarksLower.includes("poc issue") ||
                     remarksLower.includes("declined") ||
                     remarksLower.includes("no notes");
    const remarksColor = hasIssue ? "#f44336" : "#666";

    return (
      <View key={itemKey}>
        <View style={styles.selectContainer}>
          <View style={[styles.selectBox, boxStyle]}>
            <Text style={textStyle}>{displayValue}</Text>
          </View>
          <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
        </View>
        {(itemValue === "N" || itemValue === "NA") && remarks && (
          <View style={[styles.textRow, { marginLeft: 58, marginTop: -3 }]}>
            <Text style={{ fontSize: 9, color: remarksColor, fontStyle: "italic", fontWeight: hasIssue ? "bold" : "normal" }}>
              Remarks: {remarks}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSelectWithDateItem = (itemKey, itemData) => {
    const value = itemData?.value || "";
    const date = itemData?.date || "";

    let boxStyle = styles.selectBoxN;
    let textStyle = styles.selectTextDark;
    let displayValue = "N/A";

    if (value === "Y") {
      boxStyle = styles.selectBoxY;
      textStyle = styles.selectText;
      displayValue = "YES";
    } else if (value === "N") {
      boxStyle = styles.selectBoxN;
      textStyle = styles.selectTextRed;
      displayValue = "NO";
    } else if (value === "NA") {
      boxStyle = styles.selectBoxNA;
      textStyle = styles.selectTextDark;
      displayValue = "N/A";
    }

    return (
      <View style={styles.selectContainer} key={itemKey}>
        <View style={[styles.selectBox, boxStyle]}>
          <Text style={textStyle}>{displayValue}</Text>
        </View>
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
        {value === "Y" && date && (
          <Text style={styles.dateText}>
            Date: {moment(date).format("MM/DD/YYYY")}
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
                         remarksLower.includes("not resolved") ||
                         remarksLower.includes("poc issue") ||
                         remarksLower.includes("declined") ||
                         remarksLower.includes("no notes");

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
            {renderSelectItem("hospiceEvalOrder", patient.admission.hospiceEvalOrder)}
            {renderSelectItem("informedConsent", patient.admission.informedConsent)}
            {renderSelectItem("electionOfHospice", patient.admission.electionOfHospice)}
            {renderSelectItem("polstrDnr", patient.admission.polstrDnr)}
            {renderSelectItem("changeOfHospice", patient.admission.changeOfHospice)}
            {renderSelectItem("poaAdvanceDirective", patient.admission.poaAdvanceDirective)}
            {renderSelectItem("billOfRights", patient.admission.billOfRights)}
            {renderSelectItem("telehealthConsent", patient.admission.telehealthConsent)}
            {renderSelectItem("patientNotification", patient.admission.patientNotification)}
          </View>
        )}

        {/* Assessment */}
        {patient.assessment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.assessment}</Text>
            {renderSelectItemWithRemarks("nursing", patient.assessment.nursing, patient.assessment.nursingRemarks)}
            {renderSelectItemWithRemarks("spiritual", patient.assessment.spiritual, patient.assessment.spiritualRemarks)}
            {renderSelectItemWithRemarks("psychosocial", patient.assessment.psychosocial, patient.assessment.psychosocialRemarks)}
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
            {renderSelectWithDateItem("cti", patient.physician.cti)}
            {renderSelectWithDateItem("order", patient.physician.order)}
            {renderSelectWithDateItem("f2fVisit", patient.physician.f2fVisit)}
            {renderSelectItem("referral", patient.physician.referral)}
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
            {renderSelectItem("medicalRecords", patient.miscellaneous.medicalRecords)}
            {renderSelectItem("dpoa", patient.miscellaneous.dpoa)}
            {renderSelectItem("hp", patient.miscellaneous.hp)}
            {renderSelectItem("eligibility", patient.miscellaneous.eligibility)}
            {renderSelectItem("insuranceCard", patient.miscellaneous.insuranceCard)}
            {renderSelectItem("id", patient.miscellaneous.id)}
            {renderSelectItem("dme", patient.miscellaneous.dme)}
            {renderSelectItem("transportation", patient.miscellaneous.transportation)}
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
            {renderSelectWithDateItem("hopeAdmission", patient.compliance.hopeAdmission)}
            {renderSelectWithDateItem("hopeHuv1", patient.compliance.hopeHuv1)}
            {renderSelectWithDateItem("hopeHuv2", patient.compliance.hopeHuv2)}
            {renderSelectWithDateItem("hopeDischarge", patient.compliance.hopeDischarge)}
            {renderBooleanItem("lcdEligibility", patient.compliance.lcdEligibility)}
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

        {/* General Remarks */}
        {patient.remarks && Array.isArray(patient.remarks) && patient.remarks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{GROUP_LABELS.generalRemarks}</Text>
            {patient.remarks.map((remark, idx) => (
              <View style={styles.remarkEntry} key={idx}>
                <Text style={styles.remarkBullet}>•</Text>
                <Text style={styles.remarkText}>
                  {remark || "N/A"}
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
            Legend: Green box = Yes/Completed | Gray box = No | Yellow box = N/A | Red border = Incomplete
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChecklistPrintAllDocument;

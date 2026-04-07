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
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  patientCd: {
    fontSize: 16,
    color: "#333",
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#667eea",
    color: "white",
    padding: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
  },
  checkboxContainer: {
    width: 60,
    height: 18,
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
    fontSize: 9,
    fontWeight: "bold",
    color: "white",
  },
  checkboxTextUnchecked: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#f44336",
  },
  checkboxContainerGray: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #666",
  },
  checkboxTextGray: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#666",
  },
  itemText: {
    fontSize: 11,
    flex: 1,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
  },
  selectBox: {
    width: 60,
    height: 18,
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
    fontSize: 9,
    fontWeight: "bold",
    color: "white",
  },
  selectTextDark: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
  },
  selectTextRed: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#f44336",
  },
  dischargeWithEoc: {
    border: "2px solid #f44336",
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  physicianAlert: {
    border: "3px solid #f44336",
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  alertBadge: {
    backgroundColor: "#f44336",
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    padding: "4px 8px",
    marginBottom: 8,
    borderRadius: 3,
  },
  dateText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 5,
  },
  textRow: {
    paddingLeft: 10,
    marginBottom: 6,
  },
  textLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
  },
  textValue: {
    fontSize: 10,
    color: "#333",
    marginLeft: 10,
  },
  inlineRow: {
    flexDirection: "row",
    paddingLeft: 10,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  inlineField: {
    flexDirection: "row",
    marginRight: 15,
  },
  inlineLabel: {
    fontSize: 10,
  },
  inlineValue: {
    fontSize: 10,
    color: "#333",
    marginLeft: 5,
  },
  inlineValueBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  inlineValueUnresolved: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#f44336",
    marginLeft: 5,
  },
  pocEntry: {
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: 4,
  },
  pocBullet: {
    fontSize: 10,
    marginRight: 5,
  },
  pocText: {
    fontSize: 10,
    flex: 1,
  },
  remarkEntry: {
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: 6,
  },
  remarkBullet: {
    fontSize: 10,
    marginRight: 5,
  },
  remarkText: {
    fontSize: 10,
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
  lcdEligibility: "LCD Eligibility",
};

const ChecklistPrintDocument = ({ patientData }) => {
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
                     remarksLower.includes("no notes") ||
                     remarksLower.includes("no chaplain signature") ||
                     remarksLower.includes("no msw signature") ||
                     remarksLower.includes("no rn signature") ||
                     remarksLower.includes("no signature");
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
          <View style={[styles.textRow, { marginLeft: 68, marginTop: -3 }]}>
            <Text style={{ fontSize: 10, color: remarksColor, fontStyle: "italic", fontWeight: hasIssue ? "bold" : "normal" }}>
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
        >
          <Text style={isChecked ? styles.checkboxText : styles.checkboxTextUnchecked}>
            {isChecked ? "YES" : "NO"}
          </Text>
        </View>
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
        {hasDate && (
          <Text style={styles.dateText}>
            Date: {moment(itemData.date).format("MM/DD/YYYY")}
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
    // Check if remarks contains "unresolve", "unresolved", "POC ISSUE", "DECLINED", or "NO NOTES" (case insensitive)
    // Also trim whitespace and check for variations
    const remarksLower = remarks ? remarks.toLowerCase().trim() : "";
    const isUnresolved = remarksLower.includes("unresolve") ||
                         remarksLower.includes("unresolved") ||
                         remarksLower.includes("un-resolved") ||
                         remarksLower.includes("not resolved") ||
                         remarksLower.includes("poc issue") ||
                         remarksLower.includes("declined") ||
                         remarksLower.includes("no notes") ||
                         remarksLower.includes("no chaplain signature") ||
                         remarksLower.includes("no msw signature") ||
                         remarksLower.includes("no rn signature") ||
                         remarksLower.includes("no signature");
    // Always bold, red only for unresolved/issues
    const remarksStyle = isUnresolved ? styles.inlineValueUnresolved : styles.inlineValueBold;

    return (
      <View style={styles.inlineRow}>
        <View style={styles.inlineField}>
          <Text style={styles.inlineLabel}>Date:</Text>
          <Text style={styles.inlineValue}>
            {date ? moment(date).format("MM/DD/YYYY") : "N/A"}
          </Text>
        </View>
        <View style={styles.inlineField}>
          <Text style={styles.inlineLabel}>Created User:</Text>
          <Text style={styles.inlineValue}>{createdUser || "N/A"}</Text>
        </View>
        <View style={styles.inlineField}>
          <Text style={styles.inlineLabel}>Remarks:</Text>
          <Text style={remarksStyle}>{remarks || "N/A"}</Text>
        </View>
      </View>
    );
  };

  const renderDischargeInline = (date, reason, documentation, hasEoc) => {
    const isChecked = documentation && documentation.checked;

    // Determine checkbox style based on checked status and EOC
    let checkboxStyle, textStyle;
    if (isChecked) {
      checkboxStyle = styles.checkboxContainerChecked;
      textStyle = styles.checkboxText;
    } else if (hasEoc) {
      // Patient has EOC and documentation not checked - show RED
      checkboxStyle = styles.checkboxContainerUnchecked;
      textStyle = styles.checkboxTextUnchecked;
    } else {
      // Patient has NO EOC and documentation not checked - show GRAY
      checkboxStyle = styles.checkboxContainerGray;
      textStyle = styles.checkboxTextGray;
    }

    return (
      <View style={styles.inlineRow}>
        <View style={styles.inlineField}>
          <Text style={styles.inlineLabel}>Date:</Text>
          <Text style={styles.inlineValue}>
            {date ? moment(date).format("MM/DD/YYYY") : "N/A"}
          </Text>
        </View>
        <View style={styles.inlineField}>
          <Text style={styles.inlineLabel}>Reason:</Text>
          <Text style={styles.inlineValue}>{reason || "N/A"}</Text>
        </View>
        <View style={[styles.inlineField, { alignItems: "center" }]}>
          <Text style={styles.inlineLabel}>Documentation:</Text>
          <View
            style={[
              styles.checkboxContainer,
              { marginLeft: 5, marginRight: 0 },
              checkboxStyle,
            ]}
          >
            <Text style={textStyle}>
              {isChecked ? "YES" : "NO"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAdmission = () => {
    const data = patientData.admission;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.admission}</Text>
        {renderBooleanItem("demographicSheet", data.demographicSheet)}
        {renderSelectItem("hospiceEvalOrder", data.hospiceEvalOrder)}
        {renderSelectItem("informedConsent", data.informedConsent)}
        {renderSelectItem("electionOfHospice", data.electionOfHospice)}
        {renderSelectItem("polstrDnr", data.polstrDnr)}
        {renderSelectItem("changeOfHospice", data.changeOfHospice)}
        {renderSelectItem("poaAdvanceDirective", data.poaAdvanceDirective)}
        {renderSelectItem("billOfRights", data.billOfRights)}
        {renderSelectItem("telehealthConsent", data.telehealthConsent)}
        {renderSelectItem("patientNotification", data.patientNotification)}
      </View>
    );
  };

  const renderAssessment = () => {
    const data = patientData.assessment;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.assessment}</Text>
        {renderSelectItemWithRemarks("nursing", data.nursing, data.nursingRemarks)}
        {renderSelectItemWithRemarks("spiritual", data.spiritual, data.spiritualRemarks)}
        {renderSelectItemWithRemarks("psychosocial", data.psychosocial, data.psychosocialRemarks)}
      </View>
    );
  };

  const renderTreatmentOrder = () => {
    const data = patientData.treatmentOrder;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.treatmentOrder}</Text>
        {renderBooleanItem("treatmentOrder", data.treatmentOrder)}
      </View>
    );
  };

  const renderPhysician = () => {
    const data = patientData.physician;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.physician}</Text>
        {renderSelectWithDateItem("cti", data.cti)}
        {renderSelectWithDateItem("order", data.order)}
        {renderSelectWithDateItem("f2fVisit", data.f2fVisit)}
        {renderSelectItem("referral", data.referral)}
      </View>
    );
  };

  const renderIdgNotes = () => {
    const data = patientData.idgNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.idgNotes}</Text>
        {renderNotesInline(data.date, data.createdUser, data.remarks)}
      </View>
    );
  };

  const renderSkilledNursingNotes = () => {
    const data = patientData.skilledNursingNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.skilledNursingNotes}</Text>
        {renderNotesInline(data.date, data.createdUser, data.remarks)}
      </View>
    );
  };

  const renderHaNotes = () => {
    const data = patientData.haNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.haNotes}</Text>
        {renderNotesInline(data.date, data.createdUser, data.remarks)}
      </View>
    );
  };

  const renderVolunteerNotes = () => {
    const data = patientData.volunteerNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.volunteerNotes}</Text>
        {renderNotesInline(data.date, data.createdUser, data.remarks)}
      </View>
    );
  };

  const renderMiscellaneous = () => {
    const data = patientData.miscellaneous;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.miscellaneous}</Text>
        {renderSelectItem("medicalRecords", data.medicalRecords)}
        {renderSelectItem("dpoa", data.dpoa)}
        {renderSelectItem("hp", data.hp)}
        {renderSelectItem("eligibility", data.eligibility)}
        {renderSelectItem("insuranceCard", data.insuranceCard)}
        {renderSelectItem("id", data.id)}
        {renderSelectItem("dme", data.dme)}
        {renderSelectItem("transportation", data.transportation)}
      </View>
    );
  };

  const renderDischarge = () => {
    const data = patientData.discharge;
    if (!data) return null;

    // Check if patient has EOC (End of Care) - only show red border if EOC exists
    const hasEoc = patientData.patientEoc != null && patientData.patientEoc !== "";
    const sectionStyle = hasEoc ? styles.dischargeWithEoc : styles.section;

    return (
      <View style={sectionStyle}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.discharge}</Text>
        {renderDischargeInline(data.date, data.reason, data.documentation, hasEoc)}
      </View>
    );
  };

  const renderCompliance = () => {
    const data = patientData.compliance;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.compliance}</Text>
        {renderSelectWithDateItem("hopeAdmission", data.hopeAdmission)}
        {renderSelectWithDateItem("hopeHuv1", data.hopeHuv1)}
        {renderSelectWithDateItem("hopeHuv2", data.hopeHuv2)}
        {renderSelectWithDateItem("hopeDischarge", data.hopeDischarge)}
        {renderBooleanItem("lcdEligibility", data.lcdEligibility)}
      </View>
    );
  };

  const renderPoc = () => {
    const data = patientData.poc;
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.poc}</Text>
        {data.map((entry, index) => (
          <View style={styles.pocEntry} key={index}>
            <Text style={styles.pocBullet}>•</Text>
            <Text style={styles.pocText}>
              {entry.staff} - {entry.frequency}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderGeneralRemarks = () => {
    const data = patientData.remarks;
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.generalRemarks}</Text>
        {data.map((remark, index) => (
          <View style={styles.remarkEntry} key={index}>
            <Text style={styles.remarkBullet}>•</Text>
            <Text style={styles.remarkText}>
              {remark || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Patient Onboarding Checklist</Text>
          <Text style={styles.patientCd}>
            Patient: {patientData?.patientCd || "N/A"}
          </Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {renderAdmission()}
        {renderAssessment()}
        {renderTreatmentOrder()}
        {renderPhysician()}
        {renderIdgNotes()}
        {renderSkilledNursingNotes()}
        {renderHaNotes()}
        {renderVolunteerNotes()}
        {renderMiscellaneous()}
        {renderDischarge()}
        {renderCompliance()}
        {renderPoc()}
        {renderGeneralRemarks()}

        <View style={styles.footer}>
          <Text>
            Legend: Green box = Yes/Completed | Gray box = No | Yellow box = N/A | Red border = Incomplete | Red line = LCD Eligibility Unchecked
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChecklistPrintDocument;

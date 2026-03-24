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
    border: "1px solid #999",
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
  lcdUnchecked: {
    borderLeft: "4px solid #f44336",
    paddingLeft: 6,
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
  miscellaneous: "8. Miscellaneous",
  discharge: "9. Discharge",
  compliance: "10. Compliance",
  poc: "11. Plan of Care (POC)",
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
  const renderBooleanItem = (itemKey, itemData, isLcdEligibility = false) => {
    const isChecked = itemData && itemData.checked;

    return (
      <View style={[styles.itemRow, !isChecked && isLcdEligibility ? styles.lcdUnchecked : {}]} key={itemKey}>
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
      textStyle = styles.selectTextDark;
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
      textStyle = styles.selectTextDark;
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
        />
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
        {renderBooleanItem("nursing", data.nursing)}
        {renderBooleanItem("spiritual", data.spiritual)}
        {renderBooleanItem("psychosocial", data.psychosocial)}
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
        {renderDateField("Date", data.date)}
        {renderTextField("Created User", data.createdUser)}
      </View>
    );
  };

  const renderSkilledNursingNotes = () => {
    const data = patientData.skilledNursingNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.skilledNursingNotes}</Text>
        {renderDateField("Date", data.date)}
        {renderTextField("Created User", data.createdUser)}
      </View>
    );
  };

  const renderHaNotes = () => {
    const data = patientData.haNotes;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.haNotes}</Text>
        {renderDateField("Date", data.date)}
        {renderTextField("Created User", data.createdUser)}
      </View>
    );
  };

  const renderMiscellaneous = () => {
    const data = patientData.miscellaneous;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.miscellaneous}</Text>
        {renderBooleanItem("medicalRecords", data.medicalRecords)}
        {renderBooleanItem("dpoa", data.dpoa)}
        {renderBooleanItem("hp", data.hp)}
        {renderBooleanItem("eligibility", data.eligibility)}
        {renderBooleanItem("insuranceCard", data.insuranceCard)}
        {renderBooleanItem("id", data.id)}
        {renderSelectItem("dme", data.dme)}
        {renderSelectItem("transportation", data.transportation)}
      </View>
    );
  };

  const renderDischarge = () => {
    const data = patientData.discharge;
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_LABELS.discharge}</Text>
        {renderDateField("Date", data.date)}
        {renderTextField("Reason", data.reason)}
        {renderBooleanItem("documentation", data.documentation)}
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
        {renderBooleanItem("lcdEligibility", data.lcdEligibility, true)}
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
        {renderMiscellaneous()}
        {renderDischarge()}
        {renderCompliance()}
        {renderPoc()}

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

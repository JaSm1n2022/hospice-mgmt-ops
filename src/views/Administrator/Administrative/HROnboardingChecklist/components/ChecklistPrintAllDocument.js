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
  employeeSection: {
    marginTop: 20,
    marginBottom: 15,
    borderTop: "2px solid #ccc",
    paddingTop: 15,
  },
  employeeHeader: {
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  employeeName: {
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
  checkmark: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    lineHeight: 1,
  },
  xmark: {
    fontSize: 11,
    color: "#f44336",
    fontWeight: "bold",
    lineHeight: 1,
  },
  itemText: {
    fontSize: 10,
    flex: 1,
  },
  expirationText: {
    fontSize: 9,
    color: "#666",
    marginLeft: 5,
  },
  alertIcon: {
    fontSize: 9,
    color: "#ff9800",
    marginLeft: 5,
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

const SECTION_LABELS = {
  section1: "Section 1: Application Materials",
  section2: "Section 2: Licenses & Credentials",
  section3: "Section 3: Employment Documentation",
  section4: "Section 4: Policies & Procedures",
  section5: "Section 5: Training & Education",
  section6: "Section 6: Health & Background",
  section7: "Section 7: NABS Check",
  section8: "Section 8: Tax Forms",
};

const ITEM_LABELS = {
  applicationForm: "Application Form",
  resume: "Resume",
  licenseVerification: "License Verification",
  diploma: "Diploma",
  pli: "PLI (Professional Liability Insurance)",
  ssc: "SSC (Social Security Card)",
  cprCard: "CPR Card",
  driversLicense: "Driver's License",
  autoInsurance: "Auto Insurance",
  jobDescription: "Job Description",
  offerLetter: "Offer Letter",
  orientation: "Orientation",
  competency: "Competency Assessment",
  performanceEvaluations: "Performance Evaluations",
  confidentiality: "Confidentiality Agreement",
  eSig: "E-Signature Policy",
  fieldPractices: "Field Practices",
  handbook: "Employee Handbook",
  compliance: "Compliance Training",
  policies: "Company Policies",
  ppe: "PPE (Personal Protective Equipment)",
  hipaa: "HIPAA Training",
  inServicesHire: "In-Services (At Hire)",
  inServicesAnnual: "In-Services (Annual)",
  ceus: "CEUs (Continuing Education Units)",
  physicalExam: "Physical Exam",
  hepatitisB: "Hepatitis B Vaccination",
  tbCxr: "TB CXR (Chest X-Ray)",
  tbQuestionnaire: "TB Questionnaire",
  criminalHistory: "Criminal History Check",
  backgroundCheck: "NABS Background Check",
  formI9: "Form I-9",
  w4W9: "W-4/W-9 Tax Forms",
};

const ChecklistPrintAllDocument = ({ employeesData }) => {
  const renderItem = (itemKey, itemData) => {
    const isChecked = itemData && itemData.checked;
    const hasExpiration = itemData && itemData.expirationDate;
    const isExpired =
      hasExpiration && moment(itemData.expirationDate).isBefore(moment(), "day");

    return (
      <View style={styles.itemRow} key={itemKey}>
        <View
          style={[
            styles.checkboxContainer,
            isChecked
              ? styles.checkboxContainerChecked
              : styles.checkboxContainerUnchecked,
          ]}
        />
        <Text style={styles.itemText}>{ITEM_LABELS[itemKey] || itemKey}</Text>
        {hasExpiration && (
          <>
            <Text style={styles.expirationText}>
              Exp: {moment(itemData.expirationDate).format("MM/DD/YYYY")}
            </Text>
            {isExpired && <Text style={styles.alertIcon}>⚠</Text>}
          </>
        )}
      </View>
    );
  };

  const renderSection = (sectionKey, sectionData) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return null;
    }

    return (
      <View style={styles.section} key={sectionKey}>
        <Text style={styles.sectionTitle}>
          {SECTION_LABELS[sectionKey] || sectionKey}
        </Text>
        {Object.keys(sectionData).map((itemKey) =>
          renderItem(itemKey, sectionData[itemKey])
        )}
      </View>
    );
  };

  const renderEmployee = (employee, index) => {
    return (
      <View key={employee.id || index} style={styles.employeeSection} break={index > 0}>
        <View style={styles.employeeHeader}>
          <Text style={styles.employeeName}>
            {employee.employeeName || "N/A"}
          </Text>
        </View>

        {employee.section1 && renderSection("section1", employee.section1)}
        {employee.section2 && renderSection("section2", employee.section2)}
        {employee.section3 && renderSection("section3", employee.section3)}
        {employee.section4 && renderSection("section4", employee.section4)}
        {employee.section5 && renderSection("section5", employee.section5)}
        {employee.section6 && renderSection("section6", employee.section6)}
        {employee.section7 && renderSection("section7", employee.section7)}
        {employee.section8 && renderSection("section8", employee.section8)}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>
            HR Onboarding Checklist - All Employees
          </Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={styles.generatedText}>
            Total Employees: {employeesData?.length || 0}
          </Text>
        </View>

        {employeesData && employeesData.length > 0 ? (
          employeesData.map((employee, index) => renderEmployee(employee, index))
        ) : (
          <Text>No employee data available</Text>
        )}

        <View style={styles.footer}>
          <Text>
            Legend: Green box = Completed | Red border box = Incomplete | ⚠ = Expired
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChecklistPrintAllDocument;

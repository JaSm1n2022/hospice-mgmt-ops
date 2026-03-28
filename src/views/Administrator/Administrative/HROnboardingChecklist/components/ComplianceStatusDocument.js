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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  employeeSection: {
    marginBottom: 20,
    border: "1px solid #e0e0e0",
    borderRadius: 4,
    padding: 12,
  },
  employeeHeader: {
    backgroundColor: "#f44336",
    color: "white",
    padding: 8,
    marginBottom: 10,
    borderRadius: 3,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  employeePosition: {
    fontSize: 11,
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottom: "2px solid #333",
    marginBottom: 5,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #e0e0e0",
  },
  tableRowNumber: {
    width: 30,
    fontSize: 10,
    color: "#666",
  },
  tableRowText: {
    flex: 1,
    fontSize: 10,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },
  summaryBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    padding: 10,
    marginBottom: 15,
    borderRadius: 3,
  },
  summaryText: {
    fontSize: 11,
    color: "#856404",
  },
  noIssuesText: {
    fontSize: 12,
    color: "#4caf50",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#f1f8f4",
    borderRadius: 3,
  },
});

const ComplianceStatusDocument = ({ complianceData }) => {
  console.log("=== ComplianceStatusDocument Rendering ===");
  console.log("Received complianceData:", complianceData);

  if (!complianceData || complianceData.length === 0) {
    console.log("No compliance data to render!");
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>No Data Available</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Calculate total missing files
  const totalMissingFiles = complianceData.reduce(
    (sum, emp) => sum + emp.missingFiles.length,
    0
  );

  console.log("Total missing files:", totalMissingFiles);
  console.log("Number of employees with issues:", complianceData.length);

  const renderEmployeeSection = (employee, index) => {
    console.log(`Rendering employee section ${index}:`, employee.employeeName);
    return (
      <View key={`emp-section-${index}`} style={styles.employeeSection} wrap={false}>
        {/* Employee Header */}
        <View style={styles.employeeHeader}>
          <Text style={styles.employeeName}>
            {employee.employeeName || "Unknown Employee"}
          </Text>
          <Text style={styles.employeePosition}>
            Position: {employee.employeePosition || "N/A"}
          </Text>
        </View>

        {/* Missing Files Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: 30 }]}>#</Text>
          <Text style={styles.tableHeaderText}>Missing/Expired File</Text>
        </View>

        {employee.missingFiles && employee.missingFiles.length > 0 ? (
          employee.missingFiles.map((file, fileIndex) => (
            <View key={`file-row-${index}-${fileIndex}`} style={styles.tableRow}>
              <Text style={styles.tableRowNumber}>{fileIndex + 1}</Text>
              <Text style={styles.tableRowText}>{file}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.tableRowText}>No missing files</Text>
          </View>
        )}

        {/* Summary for this employee */}
        <View style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e0e0e0" }}>
          <Text style={{ fontSize: 10, color: "#666", fontWeight: "bold" }}>
            Total Issues: {employee.missingFiles ? employee.missingFiles.length : 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Compliance Status Report</Text>
            <Text style={styles.subtitle}>
              Generated: {moment().format("MM/DD/YYYY hh:mm A")}
            </Text>
            <Text style={styles.subtitle}>
              Employees with Issues: {complianceData.length}
            </Text>
            <Text style={styles.subtitle}>
              Total Missing/Expired Files: {totalMissingFiles}
            </Text>
          </View>

          {/* Summary Box */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              This report lists employees with missing or expired documents.
              Items marked with "(Expired: DATE)" need to be renewed immediately.
            </Text>
          </View>

          {/* Employee Sections */}
          {complianceData && complianceData.length > 0 ? (
            complianceData.map((employee, index) => renderEmployeeSection(employee, index))
          ) : (
            <Text>No compliance data</Text>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              This is an automated compliance report. Please address all missing
              and expired documents promptly.
            </Text>
          </View>
        </Page>
    </Document>
  );
};

export default ComplianceStatusDocument;

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#d32f2f",
  },
  fileItem: {
    fontSize: 10,
    marginLeft: 20,
    marginBottom: 3,
  },
});

const ComplianceStatusDocumentSimple = ({ complianceData }) => {
  if (!complianceData || complianceData.length === 0) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Compliance Status Report</Text>
          <Text style={{ fontSize: 10 }}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={{ fontSize: 10 }}>
            Employees with Issues: {complianceData.length}
          </Text>
        </View>

        {complianceData.map((employee, idx) => (
          <View key={idx} style={{ marginBottom: 15 }}>
            <Text style={styles.employeeName}>
              {employee.employeeName} - {employee.employeePosition || "N/A"}
            </Text>
            {employee.missingFiles && employee.missingFiles.map((file, fileIdx) => (
              <Text key={fileIdx} style={styles.fileItem}>
                • {file}
              </Text>
            ))}
            <Text style={{ fontSize: 9, marginLeft: 20, marginTop: 5, color: "#666" }}>
              Total Issues: {employee.missingFiles ? employee.missingFiles.length : 0}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ComplianceStatusDocumentSimple;

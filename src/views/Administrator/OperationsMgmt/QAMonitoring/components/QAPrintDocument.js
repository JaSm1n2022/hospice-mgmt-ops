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
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: 2,
    borderBottomColor: "#9c27b0",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#9c27b0",
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
    marginBottom: 20,
    break: "inside",
  },
  patientHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#9c27b0",
    color: "#fff",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "solid",
  },
  tableCell: {
    padding: 6,
    fontSize: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#999",
    borderRightStyle: "solid",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: "1px solid #ccc",
  },
});

const QAPrintDocument = ({ qaRecords }) => {
  // Group records by patient and sort by source date
  const groupByPatient = () => {
    const grouped = {};

    qaRecords.forEach((record) => {
      const patientKey = record.patientCd || "Unknown";
      if (!grouped[patientKey]) {
        grouped[patientKey] = [];
      }
      grouped[patientKey].push(record);
    });

    // Sort records within each patient by source date
    Object.keys(grouped).forEach((patientKey) => {
      grouped[patientKey].sort((a, b) => {
        const dateA = a.qa_source_dt ? moment(a.qa_source_dt) : moment(0);
        const dateB = b.qa_source_dt ? moment(b.qa_source_dt) : moment(0);
        return dateA.diff(dateB);
      });
    });

    return grouped;
  };

  const groupedRecords = groupByPatient();
  const sortedPatients = Object.keys(groupedRecords).sort();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            QA Monitoring Report
          </Text>
          <Text style={styles.subtitle}>
            Quality Assurance Records Grouped by Patient
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {sortedPatients.map((patientCd, index) => {
          const records = groupedRecords[patientCd];
          return (
            <View key={index} style={styles.patientSection} wrap={false}>
              <Text style={styles.patientHeader}>
                Patient: {patientCd} ({records.length} record{records.length !== 1 ? "s" : ""})
              </Text>

              <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>QA Type</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Source Date</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>QA Date</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Complete Date</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Status</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Discipline</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Reviewer</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>LCD</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.5, ...styles.lastCell }]}>Cert #</Text>
                </View>

                {/* Data Rows */}
                {records.map((record, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {record.qa_type || ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                      {record.qa_source_dt ? moment(record.qa_source_dt).format("MM/DD/YYYY") : ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                      {record.qa_date ? moment(record.qa_date).format("MM/DD/YYYY") : ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                      {record.completed_dt ? moment(record.completed_dt).format("MM/DD/YYYY") : ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                      {record.qa_status || ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {record.discipline_name || ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {record.reviewer_name || ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.7 }]}>
                      {record.qa_type && (
                        record.qa_type.toLowerCase().includes("visit") ||
                        record.qa_type === "SC Assessment" ||
                        record.qa_type === "MSW Assessment"
                      )
                        ? "N/A"
                        : record.isLcdCompliance === true
                          ? "Compliant"
                          : record.isLcdCompliance === false
                            ? "Non-Compliant"
                            : ""}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.5, ...styles.lastCell }]}>
                      {record.recertNumber || ""}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>
            This document was generated automatically. Please verify all information before use.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Total Patients: {sortedPatients.length} | Total Records: {qaRecords.length}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QAPrintDocument;

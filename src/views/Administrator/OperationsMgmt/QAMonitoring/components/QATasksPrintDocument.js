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
    borderBottomColor: "#d32f2f",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#d32f2f",
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
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    borderBottomStyle: "solid",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#d32f2f",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    borderBottomStyle: "solid",
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#333",
    borderRightStyle: "solid",
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 9,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#333",
    borderRightStyle: "solid",
    color: "#fff",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  checkboxCell: {
    padding: 8,
    fontSize: 9,
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: "#333",
    borderRightStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 12,
    height: 12,
    border: "2px solid #333",
    borderRadius: 2,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: "1px solid #ccc",
  },
  emptyMessage: {
    padding: 20,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});

const QATasksPrintDocument = ({ qaRecords }) => {
  // Filter only incomplete records (status is not "Completed" or "Resolved")
  const incompleteRecords = qaRecords.filter((record) => {
    const status = (record.qa_status || "").toLowerCase();
    return status !== "completed" && status !== "resolved";
  });

  // Sort by patient and then by source date
  const sortedRecords = [...incompleteRecords].sort((a, b) => {
    // First sort by patient
    const patientA = a.patientCd || "";
    const patientB = b.patientCd || "";
    if (patientA !== patientB) {
      return patientA.localeCompare(patientB);
    }
    // Then by source date
    const dateA = a.qa_source_dt ? moment(a.qa_source_dt) : moment(0);
    const dateB = b.qa_source_dt ? moment(b.qa_source_dt) : moment(0);
    return dateA.diff(dateB);
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            QA Tasks - Incomplete Records
          </Text>
          <Text style={styles.subtitle}>
            Quality Assurance Records Pending Review
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")} | Total Tasks: {sortedRecords.length}
          </Text>
        </View>

        {sortedRecords.length === 0 ? (
          <View style={styles.emptyMessage}>
            <Text>No incomplete QA tasks found. All records are completed!</Text>
          </View>
        ) : (
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.checkboxCell]}>Mark</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Patient</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>QA Type</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Source Date</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Discipline</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, ...styles.lastCell }]}>Reviewer</Text>
            </View>

            {/* Data Rows */}
            {sortedRecords.map((record, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.checkboxCell]}>
                  <View style={styles.checkbox} />
                </View>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {record.patientCd || ""}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>
                  {record.qa_type || ""}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                  {record.qa_source_dt ? moment(record.qa_source_dt).format("MM/DD/YYYY") : ""}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {record.discipline_name || ""}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                  {record.qa_status || "Pending"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, ...styles.lastCell }]}>
                  {record.reviewer_name || ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>
            This is a task checklist for QA monitoring. Mark the checkbox when each task is reviewed and completed.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Total Incomplete Tasks: {sortedRecords.length}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QATasksPrintDocument;

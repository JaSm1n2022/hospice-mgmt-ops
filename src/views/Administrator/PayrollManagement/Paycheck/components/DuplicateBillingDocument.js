import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#fff3cd",
    border: "2px solid #ffc107",
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: "#856404",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#d32f2f",
    borderBottom: "2px solid #d32f2f",
    paddingBottom: 5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #333",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableRowHighlight: {
    flexDirection: "row",
    backgroundColor: "#ffebee",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  columnHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
  },
  columnCell: {
    fontSize: 8,
    color: "#333",
  },
  col1: { width: "15%" },
  col2: { width: "15%" },
  col3: { width: "25%" },
  col4: { width: "25%" },
  col5: { width: "10%", textAlign: "center" },
  col6: { width: "10%", textAlign: "right" },
  duplicateCount: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#d32f2f",
    textAlign: "center",
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
  warningText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  noDuplicatesBox: {
    backgroundColor: "#d4edda",
    border: "2px solid #28a745",
    padding: 20,
    marginTop: 20,
    borderRadius: 4,
    textAlign: "center",
  },
  noDuplicatesText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#155724",
  },
});

const DuplicateBillingDocument = ({ duplicateGroups, logoBase64, totalRecords, totalDuplicates }) => {
  const hasDuplicates = duplicateGroups && duplicateGroups.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {logoBase64 && (
            <Image
              cache={false}
              src={logoBase64}
              style={styles.logo}
            />
          )}
          <Text style={styles.mainTitle}>Duplicate Billing Report</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {/* Summary Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Report Summary</Text>
          <Text style={styles.summaryText}>Total Records Analyzed: {totalRecords}</Text>
          <Text style={styles.summaryText}>
            Duplicate Records Found: <Text style={styles.warningText}>{totalDuplicates}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Duplicate Groups: <Text style={styles.warningText}>{duplicateGroups.length}</Text>
          </Text>
        </View>

        {hasDuplicates ? (
          <>
            {/* Duplicates Table */}
            <Text style={styles.sectionTitle}>Duplicate Billing Entries</Text>

            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, styles.col1]}>DOS</Text>
                <Text style={[styles.columnHeader, styles.col2]}>Service Type</Text>
                <Text style={[styles.columnHeader, styles.col3]}>Client</Text>
                <Text style={[styles.columnHeader, styles.col4]}>Employee</Text>
                <Text style={[styles.columnHeader, styles.col5]}>Pay Date</Text>
                <Text style={[styles.columnHeader, styles.col6]}>Count</Text>
              </View>

              {/* Duplicate Groups */}
              {duplicateGroups.map((group, groupIndex) => (
                <View key={groupIndex} wrap={false}>
                  {/* Group Header Row */}
                  <View style={styles.tableRowHighlight}>
                    <Text style={[styles.columnCell, styles.col1]}>
                      {group.dos}
                    </Text>
                    <Text style={[styles.columnCell, styles.col2]}>
                      {group.serviceType}
                    </Text>
                    <Text style={[styles.columnCell, styles.col3]}>
                      {group.client}
                    </Text>
                    <Text style={[styles.columnCell, styles.col4]}>
                      {group.employee}
                    </Text>
                    <Text style={[styles.columnCell, styles.col5]}>
                      -
                    </Text>
                    <Text style={[styles.duplicateCount, styles.col6]}>
                      {group.count} duplicates
                    </Text>
                  </View>

                  {/* Individual Records in Group */}
                  {group.records.map((record, recordIndex) => (
                    <View
                      key={recordIndex}
                      style={recordIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                    >
                      <Text style={[styles.columnCell, styles.col1]}>
                        {record.dosDisplay || group.dos}
                      </Text>
                      <Text style={[styles.columnCell, styles.col2]}>
                        {record.serviceType || group.serviceType}
                      </Text>
                      <Text style={[styles.columnCell, styles.col3]}>
                        {record.patientCd || group.client}
                      </Text>
                      <Text style={[styles.columnCell, styles.col4]}>
                        {record.employeeName || group.employee}
                      </Text>
                      <Text style={[styles.columnCell, styles.col5]}>
                        {record.payDate ? moment(record.payDate).format("MM/DD/YY") : "-"}
                      </Text>
                      <Text style={[styles.columnCell, styles.col6]}>
                        ${record.payAmount || "0.00"}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noDuplicatesBox}>
            <Text style={styles.noDuplicatesText}>✓ No Duplicate Billing Found</Text>
            <Text style={[styles.generatedText, { marginTop: 10 }]}>
              All billing records are unique based on DOS, Service Type, Client, and Employee combination.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Duplicate Billing Report — Duplicates detected by matching DOS (split from array), Service Type, Client, and Employee
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DuplicateBillingDocument;

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// Create styles - NO background colors as requested
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
  },
  mainHeader: {
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#2196F3", // Blue color
    borderBottom: "2px solid #2196F3",
    paddingBottom: 5,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: "extrabold", // Bolder
    marginTop: 12,
    marginBottom: 8,
    color: "#333",
    borderBottom: "1px solid #999",
    paddingBottom: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10,
  },
  rowHighlighted: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10,
    backgroundColor: "#E3F2FD", // Light blue background
    padding: "5px 10px",
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    flex: 1,
    color: "#333",
  },
  value: {
    fontSize: 10,
    flex: 1,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
  },
  summaryBox: {
    border: "1px solid #999",
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
});

const MedicareV2OverviewDocument = ({ summaryData, totalRevenue }) => {
  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Medicare Cap Overview Report</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {/* Patient Overview */}
        <Text style={styles.sectionTitle}>Patient Overview</Text>
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Patients:</Text>
            <Text style={styles.value}>{summaryData.totalPatients}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Active Patients:</Text>
            <Text style={styles.value}>{summaryData.totalActive}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Inactive Patients:</Text>
            <Text style={styles.value}>{summaryData.totalInactive}</Text>
          </View>
        </View>

        {/* Previous FY Summary */}
        <Text style={styles.sectionTitle}>FY {summaryData.prevFY} Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.subsectionTitle}>Admissions & Discharges</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Admissions:</Text>
            <Text style={styles.value}>{summaryData.prevFYAdmittedCount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discharges:</Text>
            <Text style={styles.value}>{summaryData.prevFYDischargedCount}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Cap Analysis</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Aggregate Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.prevFYTotalAggregate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Used Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.prevFYTotalUsed)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Available Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.prevFYTotalAvailable)}</Text>
          </View>
          <View style={styles.rowHighlighted}>
            <Text style={styles.label}>Available Cap Ready to Use:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.prevFYAvailableCapReadyToUse)}</Text>
          </View>
        </View>

        {/* Current FY Summary */}
        <Text style={styles.sectionTitle}>FY {summaryData.currFY} Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.subsectionTitle}>Admissions & Discharges</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Admissions:</Text>
            <Text style={styles.value}>{summaryData.currFYAdmittedCount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discharges:</Text>
            <Text style={styles.value}>{summaryData.currFYDischargedCount}</Text>
          </View>

          <Text style={styles.subsectionTitle}>Cap Analysis</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Aggregate Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.currFYTotalAggregate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Used Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.currFYTotalUsed)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Available Cap:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.currFYTotalAvailable)}</Text>
          </View>
          <View style={styles.rowHighlighted}>
            <Text style={styles.label}>Available Cap Ready to Use:</Text>
            <Text style={styles.value}>{formatCurrency(summaryData.currFYAvailableCapReadyToUse)}</Text>
          </View>
        </View>

        {/* Total Revenue vs Cap */}
        <Text style={styles.sectionTitle}>Total Revenue vs Cap</Text>
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Revenue (Used Cap):</Text>
            <Text style={styles.value}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Patients in Report:</Text>
            <Text style={styles.value}>{summaryData.totalPatients}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Medicare Cap Overview Report - Summary of Patient Overview, FY {summaryData.prevFY} & FY {summaryData.currFY}, and Total Revenue</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicareV2OverviewDocument;

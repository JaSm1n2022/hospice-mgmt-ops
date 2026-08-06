import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// Import shared styles from FiscalYearProjectionDocument
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
  summarySection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    borderTop: "2px solid #4caf50",
    borderBottom: "2px solid #4caf50",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4caf50",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    flex: 1,
    color: "#333",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 11,
    flex: 1,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
  },
  warningText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
  positiveText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
});

// FY Summary Document - Only Page 1 and Summary Tables
const FiscalYearSummaryDocument = ({
  patientsData,
  originalPatientsData,
  summary,
  renderSummaryPage,
  renderPatientsWithAvailableCapSummary,
  renderPatientsExceedingCapSummary,
  renderDeathDischargeSummary,
  renderEocNonDeathSummary
}) => {
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    const numValue = parseFloat(value);
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderMainSummary = () => {
    if (!summary) return null;

    const totalAvailableCap = parseFloat(summary.totalProjectedAvailableCap || 0);
    const isCapAvailable = totalAvailableCap >= 0;

    return (
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Fiscal Year Projection Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fiscal Year End Date:</Text>
          <Text style={styles.summaryValue}>{summary.fiscalYearEnd}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Active Patients (Projected to FY End):</Text>
          <Text style={styles.summaryValue}>{summary.totalActivePatients || 0}</Text>
        </View>
        {summary.totalEocNonDeathPatients > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>EOC (Non-Death) Exceeded Cap:</Text>
            <Text style={styles.summaryValue}>{summary.totalEocNonDeathPatients}</Text>
          </View>
        )}
        {summary.totalDeathDischargePatients > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Death Discharge w/ Available Cap:</Text>
            <Text style={styles.summaryValue}>{summary.totalDeathDischargePatients}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Patients Included:</Text>
          <Text style={styles.summaryValue}>{summary.totalPatients || summary.totalActivePatients || 0}</Text>
        </View>

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #999" }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Used Cap by {summary.fiscalYearEnd}:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedUsedCap || summary.totalProjectedUsedCap)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Allowed Cap:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedAllowedCap || summary.totalProjectedAllowedCap)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Available Cap:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedAvailableCap || (parseFloat(summary.totalProjectedAllowedCap || 0) - parseFloat(summary.totalProjectedUsedCap || 0)).toFixed(2))}
            </Text>
          </View>
          {summary.totalEocNonDeathPatients > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>EOC (Non-Death) - Cap Deficit ({summary.totalEocNonDeathPatients} patients):</Text>
              <Text style={[styles.summaryValue, styles.warningText]}>
                {formatCurrency(summary.eocNonDeathCapDeficit || 0)}
              </Text>
            </View>
          )}
          {summary.totalDeathDischargePatients > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Death Discharge - Available Cap Ready to Use:</Text>
              <Text style={[styles.summaryValue, styles.positiveText]}>
                {formatCurrency(summary.deathDischargeAvailableCap)}
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "2px solid #4caf50" }}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { fontWeight: "bold", fontSize: 12 }]}>
              TOTAL Projected Available Cap (FY {summary.fiscalYearEnd}):
            </Text>
            <Text style={[styles.summaryValue, { fontSize: 12 }, isCapAvailable ? styles.positiveText : styles.warningText]}>
              {formatCurrency(summary.totalProjectedAvailableCap)}
            </Text>
          </View>
          {summary.totalEocNonDeathPatients > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 8, color: "#666", fontStyle: "italic" }}>
                * Includes EOC (Non-Death) cap deficit of {formatCurrency(summary.eocNonDeathCapDeficit || 0)} subtracted from total
              </Text>
            </View>
          )}
        </View>

        {!isCapAvailable && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.warningText}>
              WARNING: Projected to exceed cap by fiscal year end!
            </Text>
          </View>
        )}

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #ccc" }}>
          <Text style={{ fontSize: 9, color: "#666", fontStyle: "italic" }}>
            Note: Detailed summary tables follow showing breakdowns by patient category.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* Page 1 - Main Summary Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Medicare Cap - Current FY Summary</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={styles.generatedText}>
            Total Patients Analyzed: {patientsData?.length || 0}
          </Text>
        </View>

        {renderMainSummary()}

        <View style={styles.footer}>
          <Text>
            Medicare Cap Fiscal Year Summary - High-level overview with summary tables only.
          </Text>
        </View>
      </Page>

      {/* Summary Tables Only - No Individual Patient Details */}
      {renderPatientsWithAvailableCapSummary && renderPatientsWithAvailableCapSummary()}
      {renderPatientsExceedingCapSummary && renderPatientsExceedingCapSummary()}
      {renderDeathDischargeSummary && renderDeathDischargeSummary()}
      {renderEocNonDeathSummary && renderEocNonDeathSummary()}
    </Document>
  );
};

export default FiscalYearSummaryDocument;

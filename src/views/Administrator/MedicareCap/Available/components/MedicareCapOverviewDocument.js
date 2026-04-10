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
  patientSection: {
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 15,
    borderTop: "1px solid #ccc",
  },
  patientHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottom: "2px solid #333",
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
    borderBottom: "1px solid #999",
    paddingBottom: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 10,
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
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
  },
});

const MedicareCapOverviewDocument = ({ patientsData }) => {
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderPatient = (patient, index) => {
    return (
      <View key={patient.id || index} style={styles.patientSection} break={index > 0}>
        <Text style={styles.patientHeader}>
          Patient: {patient.patientCd || "N/A"}
        </Text>

        {/* Patient Overview */}
        <Text style={styles.sectionTitle}>Patient Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Client #:</Text>
          <Text style={styles.value}>{patient.patientCd || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>SOC (Start of Care):</Text>
          <Text style={styles.value}>{patient.soc || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>EOC (End of Care):</Text>
          <Text style={styles.value}>{patient.eoc || "Active"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Insurance:</Text>
          <Text style={styles.value}>{patient.insurance || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Day Care:</Text>
          <Text style={styles.value}>{patient.totalDayCare || "0"} days</Text>
        </View>

        {/* First FY Summary */}
        <Text style={styles.sectionTitle}>First Fiscal Year Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>First FY Cap:</Text>
          <Text style={styles.value}>{formatCurrency(patient.firstPeriodCap)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Accumulated First FY Days:</Text>
          <Text style={styles.value}>{patient.firstPeriodDays || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Used Cap First FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.usedCapFirstPeriod)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Allowed Cap First FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.allowedCapFirstPeriod)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Available Cap First FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.availableCapFirstPeriod)}</Text>
        </View>

        {/* Second FY Summary */}
        <Text style={styles.sectionTitle}>Second Fiscal Year Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Second FY Cap:</Text>
          <Text style={styles.value}>{formatCurrency(patient.secondPeriodCap)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Accumulated Second FY Days:</Text>
          <Text style={styles.value}>{patient.secondPeriodDays || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Used Cap Second FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.usedCapSecondPeriod)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Allowed Cap Second FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.allowedCapSecondPeriod)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Available Cap Second FY:</Text>
          <Text style={styles.value}>{formatCurrency(patient.availableCapSecondPeriod)}</Text>
        </View>

        {/* Total Revenue vs Cap */}
        <Text style={styles.sectionTitle}>Total Revenue vs Cap</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Claim:</Text>
          <Text style={styles.value}>{formatCurrency(patient.totalClaim)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>First Benefit (90 days):</Text>
          <Text style={styles.value}>{patient.first90Benefit || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Second Benefit (90 days):</Text>
          <Text style={styles.value}>{patient.second90Benefit || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Third Benefit (60 days):</Text>
          <Text style={styles.value}>{patient.third60Benefit || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fourth Benefit (60 days):</Text>
          <Text style={styles.value}>{patient.fourth60Benefit || "0"} days</Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Medicare Cap Overview</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={styles.generatedText}>
            Total Patients: {patientsData?.length || 0}
          </Text>
        </View>

        {patientsData && patientsData.length > 0 ? (
          patientsData.map((patient, index) => renderPatient(patient, index))
        ) : (
          <Text style={{ fontSize: 10, marginTop: 20 }}>No patient data available</Text>
        )}

        <View style={styles.footer}>
          <Text>Medicare Cap Overview Report - Patient Summary with FY Details and Revenue Analysis</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicareCapOverviewDocument;

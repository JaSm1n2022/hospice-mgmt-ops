import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 80,
    marginBottom: 15,
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  employeeSection: {
    marginBottom: 20,
    pageBreakInside: "avoid",
  },
  employeeHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    fontSize: 9,
  },
  badge: {
    padding: "3px 6px",
    borderRadius: 3,
  },
  scheduledBadge: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  },
  completedBadge: {
    backgroundColor: "#e8f5e9",
    color: "#388e3c",
  },
  missingBadge: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
  },
  excessBadge: {
    backgroundColor: "#fff3e0",
    color: "#f57c00",
  },
  warningsBadge: {
    backgroundColor: "#fff9c4",
    color: "#f57f17",
  },
  patientSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  patientName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  panels: {
    flexDirection: "row",
    gap: 10,
  },
  panel: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: 4,
  },
  panelHeader: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    fontSize: 11,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
  },
  table: {
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    minHeight: 20,
    alignItems: "center",
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
  },
  dateCol: {
    width: "40%",
  },
  dayCol: {
    width: "25%",
  },
  statusCol: {
    width: "35%",
  },
  timeCol: {
    width: "30%",
  },
  durationCol: {
    width: "25%",
  },
  paymentCol: {
    width: "30%",
    textAlign: "right",
  },
  matched: {
    color: "#388e3c",
  },
  unmatched: {
    color: "#d32f2f",
  },
  totalPayment: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f5f5f5",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    borderRadius: 4,
  },
});

const VisitTrackerPrintDocument = ({ employeeData, startDate, endDate, logoBase64 }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          {logoBase64 && (
            <Image
              cache={false}
              src={logoBase64}
              style={styles.logo}
            />
          )}
          <Text style={styles.title}>Visit Tracker Report</Text>
          <Text style={styles.dateRange}>
            {moment(startDate).format("MMM DD, YYYY")} - {moment(endDate).format("MMM DD, YYYY")}
          </Text>
        </View>

        {/* Employee Sections */}
        {employeeData.map((empData, empIndex) => (
          <View key={`employee-${empIndex}`} style={styles.employeeSection} wrap={false}>
            {/* Employee Header with Badges */}
            <View style={styles.employeeHeader}>
              <Text style={styles.employeeName}>
                {empData.employee.name} — {empData.employee.position}
              </Text>
              <View style={styles.badges}>
                <Text style={[styles.badge, styles.scheduledBadge]}>
                  {empData.stats.scheduled} scheduled
                </Text>
                <Text style={[styles.badge, styles.completedBadge]}>
                  {empData.stats.completed} completed
                </Text>
                {empData.stats.excess > 0 && (
                  <Text style={[styles.badge, styles.excessBadge]}>
                    {empData.stats.excess} excess
                  </Text>
                )}
                {empData.stats.missing > 0 && (
                  <Text style={[styles.badge, styles.missingBadge]}>
                    {empData.stats.missing} missing
                  </Text>
                )}
                {empData.stats.warnings > 0 && (
                  <Text style={[styles.badge, styles.warningsBadge]}>
                    {empData.stats.warnings} warnings
                  </Text>
                )}
              </View>
            </View>

            {/* Patient Sections */}
            {empData.patients.map((patient, patIndex) => (
              <View key={`patient-${patIndex}`} style={styles.patientSection}>
                <Text style={styles.patientName}>{patient.patientName}</Text>

                {/* Side-by-side panels */}
                <View style={styles.panels}>
                  {/* Expected Schedule Panel */}
                  <View style={styles.panel}>
                    <Text style={styles.panelHeader}>Expected Schedule</Text>
                    <View style={styles.table}>
                      {patient.expected.map((exp, expIndex) => (
                        <View key={`exp-${expIndex}`} style={styles.tableRow}>
                          <Text style={[styles.tableCell, styles.dateCol]}>
                            {moment(exp.date).format("MMM DD, YYYY")}
                          </Text>
                          <Text style={[styles.tableCell, styles.dayCol]}>
                            {exp.dayLabel}
                          </Text>
                          <Text style={[styles.tableCell, styles.statusCol, exp.matched ? styles.matched : styles.unmatched]}>
                            {exp.matched ? "✓ Completed" : "⚠ Missing"}
                          </Text>
                        </View>
                      ))}
                      {patient.expected.length === 0 && (
                        <Text style={[styles.tableCell, { padding: 10, color: "#999", fontStyle: "italic" }]}>
                          No scheduled visits
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Actual Visits Panel */}
                  <View style={styles.panel}>
                    <Text style={styles.panelHeader}>Actual Visits</Text>
                    <View style={styles.table}>
                      {patient.actual.map((act, actIndex) => (
                        <View key={`act-${actIndex}`} style={styles.tableRow}>
                          <Text style={[styles.tableCell, styles.dateCol]}>
                            {moment(act.dos).format("MMM DD, YYYY")}
                          </Text>
                          <Text style={[styles.tableCell, styles.timeCol]}>
                            {act.timeIn} - {act.timeOut}
                          </Text>
                          <Text style={[styles.tableCell, styles.paymentCol]}>
                            ${parseFloat(act.estimatedPayment || 0).toFixed(2)}
                          </Text>
                        </View>
                      ))}
                      {patient.actual.length === 0 && (
                        <Text style={[styles.tableCell, { padding: 10, color: "#999", fontStyle: "italic" }]}>
                          No visits recorded
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Total Payment */}
            {empData.stats.totalEstimatedPayment > 0 && (
              <View style={styles.totalPayment}>
                <Text>
                  Total Estimated Payment: ${parseFloat(empData.stats.totalEstimatedPayment).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default VisitTrackerPrintDocument;

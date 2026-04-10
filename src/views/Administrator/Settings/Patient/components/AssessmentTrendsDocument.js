import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import { CLINICIAN_ASSESSMENT } from "utils/constants";

// Create styles
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#e91e63",
    borderBottom: "2px solid #e91e63",
    paddingBottom: 5,
  },
  chartContainer: {
    marginBottom: 20,
    padding: 10,
    border: "1px solid #ddd",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 9,
    width: "30%",
    color: "#333",
  },
  chartBarContainer: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  chartBar: {
    height: 16,
    backgroundColor: "#e91e63",
    marginRight: 5,
  },
  chartValue: {
    fontSize: 9,
    width: "20%",
    textAlign: "right",
    fontWeight: "bold",
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  legendText: {
    fontSize: 8,
    color: "#666",
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
  columnHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
  },
  columnCell: {
    fontSize: 9,
    color: "#333",
  },
  col1: { width: "20%" },
  col2: { width: "12%", textAlign: "right" },
  col3: { width: "12%", textAlign: "right" },
  col4: { width: "12%", textAlign: "right" },
  col5: { width: "12%", textAlign: "right" },
  col6: {
    width: "32%",
    textAlign: "left",
    fontSize: 8,
    paddingLeft: 5,
  },
  // Section 3 columns
  patientCol1: { width: "14%", fontSize: 8 },
  patientCol2: { width: "11%", textAlign: "center", fontSize: 8 },
  patientCol3: { width: "11%", textAlign: "center", fontSize: 8 },
  patientCol4: { width: "16%", fontSize: 8 },
  patientCol5: { width: "11%", textAlign: "center", fontSize: 8 },
  patientCol6: { width: "11%", textAlign: "center", fontSize: 8 },
  patientCol7: { width: "16%", textAlign: "center", fontSize: 8 },
  patientCol8: { width: "10%", textAlign: "center", fontSize: 8 },
  patientCdText: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  assessmentSubText: {
    fontSize: 7,
    color: "#666",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
  summaryText: {
    fontSize: 10,
    marginBottom: 5,
    color: "#333",
  },
  alertText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  warningText: {
    color: "#f57c00",
    fontWeight: "bold",
  },
});

const AssessmentTrendsDocument = ({ patientsData, logoBase64 }) => {
  // Process data to group by assessment
  const processAssessmentData = () => {
    const assessmentGroups = {};

    // Initialize groups for all assessment types
    Object.keys(CLINICIAN_ASSESSMENT).forEach((code) => {
      assessmentGroups[code] = {
        code,
        name: CLINICIAN_ASSESSMENT[code],
        patients: [],
        totalPatients: 0,
        activePatients: 0,
        deaths: 0,
        alerts: 0,
        alertPatients: [],
      };
    });

    // Group patients by assessment
    patientsData.forEach((patient) => {
      const assessmentCode = patient.assessment || "NONSPEC"; // Default to Non-Specific if no assessment

      if (assessmentGroups[assessmentCode]) {
        assessmentGroups[assessmentCode].patients.push(patient);
        assessmentGroups[assessmentCode].totalPatients++;

        // Track active patients (those without EOC)
        if (!patient.eoc) {
          assessmentGroups[assessmentCode].activePatients++;
        }

        // Check if patient has died
        const isDeath = checkIfDeath(patient);
        if (isDeath) {
          assessmentGroups[assessmentCode].deaths++;
        }

        // Check if patient meets alert criteria
        const isAlert = checkAlertCriteria(patient);
        if (isAlert) {
          assessmentGroups[assessmentCode].alerts++;
          assessmentGroups[assessmentCode].alertPatients.push(patient.patientCd);
        }
      }
    });

    // Convert to array and filter out empty groups, then sort by patient count
    return Object.values(assessmentGroups)
      .filter(group => group.totalPatients > 0)
      .map(group => ({
        ...group,
        mortalityRate: group.totalPatients > 0
          ? ((group.deaths / group.totalPatients) * 100).toFixed(1)
          : "0.0",
      }))
      .sort((a, b) => b.totalPatients - a.totalPatients);
  };

  const checkIfDeath = (patient) => {
    // Check EOC discharge reason for death
    if (patient.eoc_discharge) {
      const eocLower = patient.eoc_discharge.toLowerCase();
      if (eocLower.includes("death") || eocLower.includes("deceased")) {
        return true;
      }
    }

    // Check if POST discharge date of death exists
    if (patient.new_hospice_dod) {
      return true;
    }

    return false;
  };

  const checkAlertCriteria = (patient) => {
    const today = moment();
    const soc = moment(patient.soc);

    // Case 1: If POST discharge death date exists, use that
    if (patient.new_hospice_dod) {
      const deathDate = moment(patient.new_hospice_dod);
      const daysBetween = deathDate.diff(soc, 'days');
      if (daysBetween > 180) {
        return true;
      }
    }
    // Case 2: If EOC exists AND it's a death discharge
    else if (patient.eoc && patient.eoc_discharge) {
      const eocLower = patient.eoc_discharge.toLowerCase();
      const isDeathDischarge = eocLower.includes("death");

      if (isDeathDischarge) {
        const eocDate = moment(patient.eoc);
        const daysBetween = eocDate.diff(soc, 'days');
        if (daysBetween > 180) {
          return true;
        }
      }
      // If EOC exists but NOT death discharge, patient discharged alive - no alert
    }
    // Case 3: No EOC (patient still active)
    else if (!patient.eoc) {
      const daysFromSOC = today.diff(soc, 'days');
      if (daysFromSOC > 180) {
        // Patient still living but alert (over 6 months)
        return true;
      }
    }

    return false;
  };

  const assessmentData = processAssessmentData();
  const maxPatients = Math.max(...assessmentData.map(d => d.totalPatients), 1);
  const totalPatients = patientsData.length;
  const totalActivePatients = assessmentData.reduce((sum, d) => sum + d.activePatients, 0);
  const totalDeaths = assessmentData.reduce((sum, d) => sum + d.deaths, 0);
  const totalAlerts = assessmentData.reduce((sum, d) => sum + d.alerts, 0);
  const allAlertPatients = assessmentData.reduce((acc, d) => [...acc, ...d.alertPatients], []);

  // Process patient details for Section 3
  const processPatientDetails = () => {
    return patientsData.map((patient) => {
      const soc = patient.soc ? moment(patient.soc) : null;
      const eoc = patient.eoc ? moment(patient.eoc) : null;
      const postEoc = patient.new_hospice_dod ? moment(patient.new_hospice_dod) : null;

      // Determine final EOC date
      let finalEocDate = null;
      if (postEoc) {
        finalEocDate = postEoc;
      } else if (eoc) {
        finalEocDate = eoc;
      }

      // Calculate time frame
      let timeFrame = "Active";
      if (finalEocDate && soc) {
        const days = finalEocDate.diff(soc, 'days');
        timeFrame = `${days} days`;
      } else if (soc) {
        const days = moment().diff(soc, 'days');
        timeFrame = `${days} days (Active)`;
      }

      // Check if patient is an alert
      const isAlert = checkAlertCriteria(patient);

      // Clean patient code (remove date suffix after dot)
      const cleanPatientCd = patient.patientCd ? patient.patientCd.split('.')[0] : "N/A";

      // Get assessment display name
      const assessmentCode = patient.assessment || "NONSPEC";
      const assessmentName = CLINICIAN_ASSESSMENT[assessmentCode] || assessmentCode;

      return {
        patientCd: cleanPatientCd,
        assessmentName,
        soc: soc ? soc.format("MM/DD/YYYY") : "N/A",
        eoc: eoc ? eoc.format("MM/DD/YYYY") : "N/A",
        eocDischarge: patient.eoc_discharge || "N/A",
        postEoc: postEoc ? postEoc.format("MM/DD/YYYY") : "N/A",
        finalEoc: finalEocDate ? finalEocDate.format("MM/DD/YYYY") : "Active",
        timeFrame,
        isAlert,
        assessment: assessmentCode,
      };
    }).sort((a, b) => {
      // Sort by alert status first, then by patient code
      if (a.isAlert && !b.isAlert) return -1;
      if (!a.isAlert && b.isAlert) return 1;
      return a.patientCd.localeCompare(b.patientCd);
    });
  };

  const patientDetails = processPatientDetails();

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
          <Text style={styles.mainTitle}>Assessment Trends Report</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {/* Summary Statistics */}
        <View style={{ marginBottom: 15, padding: 10, backgroundColor: "#f5f5f5" }}>
          <Text style={styles.summaryText}>Total Patients: {totalPatients}</Text>
          <Text style={styles.summaryText}>Total Deaths: {totalDeaths}</Text>
          <Text style={styles.summaryText}>
            Total Alerts: <Text style={styles.alertText}>{totalAlerts}</Text>
          </Text>
          <Text style={styles.summaryText}>Assessment Groups: {assessmentData.length}</Text>
        </View>

        {/* SECTION 1 - Assessment Chart */}
        <Text style={styles.sectionTitle}>SECTION 1 — Assessment Distribution</Text>

        <View style={styles.chartContainer}>
          {assessmentData.map((item, index) => {
            const barWidth = (item.totalPatients / maxPatients) * 100;
            return (
              <View key={index} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{item.name}</Text>
                <View style={styles.chartBarContainer}>
                  <View style={[styles.chartBar, { width: `${barWidth}%` }]} />
                </View>
                <Text style={styles.chartValue}>
                  {item.totalPatients} pts / {item.activePatients} active
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#e91e63" }]} />
            <Text style={styles.legendText}>Patient Count</Text>
          </View>
        </View>

        {/* SECTION 2 - Assessment Summary Table */}
        <Text style={styles.sectionTitle}>SECTION 2 — Assessment Summary Table</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.col1]}>Assessment</Text>
            <Text style={[styles.columnHeader, styles.col2]}>Patients</Text>
            <Text style={[styles.columnHeader, styles.col3]}>Active</Text>
            <Text style={[styles.columnHeader, styles.col4]}>Deaths</Text>
            <Text style={[styles.columnHeader, styles.col5]}>Mortality %</Text>
            <Text style={[styles.columnHeader, styles.col6]}>Alerts (Patient Codes)</Text>
          </View>

          {/* Table Rows */}
          {assessmentData.map((item, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={[styles.columnCell, styles.col1]}>{item.name}</Text>
              <Text style={[styles.columnCell, styles.col2]}>{item.totalPatients}</Text>
              <Text style={[styles.columnCell, styles.col3]}>{item.activePatients}</Text>
              <Text style={[styles.columnCell, styles.col4]}>{item.deaths}</Text>
              <Text style={[styles.columnCell, styles.col5]}>{item.mortalityRate}%</Text>
              <Text style={[styles.columnCell, styles.col6, item.alerts > 0 && styles.alertText]}>
                {item.alerts > 0
                  ? `${item.alerts}: ${item.alertPatients.join(', ')}`
                  : '0'
                }
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableHeader, { marginTop: 5 }]}>
            <Text style={[styles.columnHeader, styles.col1]}>TOTAL</Text>
            <Text style={[styles.columnHeader, styles.col2]}>{totalPatients}</Text>
            <Text style={[styles.columnHeader, styles.col3]}>{totalActivePatients}</Text>
            <Text style={[styles.columnHeader, styles.col4]}>{totalDeaths}</Text>
            <Text style={[styles.columnHeader, styles.col5]}>
              {totalPatients > 0 ? ((totalDeaths / totalPatients) * 100).toFixed(1) : "0.0"}%
            </Text>
            <Text style={[styles.columnHeader, styles.col6]}>
              {totalAlerts > 0
                ? `${totalAlerts}: ${allAlertPatients.join(', ')}`
                : '0'
              }
            </Text>
          </View>
        </View>

        {/* SECTION 3 - Patients EOC Details */}
        <Text style={styles.sectionTitle} break>SECTION 3 — Patients EOC Details</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.patientCol1]}>Patient</Text>
            <Text style={[styles.columnHeader, styles.patientCol2]}>SOC</Text>
            <Text style={[styles.columnHeader, styles.patientCol3]}>EOC</Text>
            <Text style={[styles.columnHeader, styles.patientCol4]}>EOC Discharge</Text>
            <Text style={[styles.columnHeader, styles.patientCol5]}>POST EOC</Text>
            <Text style={[styles.columnHeader, styles.patientCol6]}>Final EOC</Text>
            <Text style={[styles.columnHeader, styles.patientCol7]}>Time Frame</Text>
            <Text style={[styles.columnHeader, styles.patientCol8]}>Alert</Text>
          </View>

          {/* Patient Rows */}
          {patientDetails.map((patient, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              wrap={false}
            >
              <View style={styles.patientCol1}>
                <Text style={styles.patientCdText}>{patient.patientCd}</Text>
                <Text style={styles.assessmentSubText}>{patient.assessmentName}</Text>
              </View>
              <Text style={[styles.columnCell, styles.patientCol2]}>{patient.soc}</Text>
              <Text style={[styles.columnCell, styles.patientCol3]}>{patient.eoc}</Text>
              <Text style={[styles.columnCell, styles.patientCol4]}>{patient.eocDischarge}</Text>
              <Text style={[styles.columnCell, styles.patientCol5]}>{patient.postEoc}</Text>
              <Text style={[styles.columnCell, styles.patientCol6]}>{patient.finalEoc}</Text>
              <Text style={[styles.columnCell, styles.patientCol7]}>{patient.timeFrame}</Text>
              <Text style={[styles.columnCell, styles.patientCol8, patient.isAlert && styles.alertText]}>
                {patient.isAlert ? "YES" : "NO"}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Assessment Trends Report — Alerts: (1) POST discharge death date: SOC to death &gt; 180 days, (2) Death discharge: SOC to EOC &gt; 180 days, (3) Active patients: SOC to today &gt; 180 days
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AssessmentTrendsDocument;

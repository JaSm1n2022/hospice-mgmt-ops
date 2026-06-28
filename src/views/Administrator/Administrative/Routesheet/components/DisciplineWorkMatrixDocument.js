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
    borderBottomColor: "#3498db",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3498db",
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
    borderColor: "#ddd",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
    minHeight: 24,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "solid",
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
    flexDirection: "column",
    gap: 2,
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#999",
    borderRightStyle: "solid",
    textAlign: "center",
  },
  patientCell: {
    flex: 1.5,
  },
  dayCell: {
    flex: 1,
    textAlign: "center",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  disciplineBadge: {
    color: "#fff",
    padding: "2px 4px",
    borderRadius: 3,
    fontSize: 7,
    marginBottom: 2,
    textAlign: "center",
  },
  nurseBadge: {
    backgroundColor: "#27ae60",
  },
  cnaBadge: {
    backgroundColor: "#2196f3",
  },
  mswBadge: {
    backgroundColor: "#9c27b0",
  },
  scBadge: {
    backgroundColor: "#ffc107",
    color: "#000",
  },
  summary: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#3498db",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
  },
  summaryBadge: {
    width: 60,
    padding: "3px 6px",
    borderRadius: 3,
    fontSize: 8,
    color: "#fff",
    textAlign: "center",
    marginRight: 8,
  },
  summaryText: {
    fontSize: 9,
    color: "#666",
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

const DisciplineWorkMatrixDocument = ({ disciplineData, patientData, weekStart, weekEnd, disciplineCounts }) => {
  const patients = Object.keys(patientData).sort();
  const disciplines = Object.keys(disciplineData).sort();

  // Get all unique dates from the actual visit data
  const uniqueDatesSet = new Set();

  // Collect all dates from discipline data
  Object.values(disciplineData).forEach((disciplineInfo) => {
    Object.values(disciplineInfo.clientVisits).forEach((clientVisits) => {
      Object.keys(clientVisits).forEach((dateKey) => {
        uniqueDatesSet.add(dateKey);
      });
    });
  });

  // Also collect dates from patient data
  Object.values(patientData).forEach((patientVisits) => {
    Object.keys(patientVisits).forEach((dateKey) => {
      uniqueDatesSet.add(dateKey);
    });
  });

  // Convert to array and sort chronologically (ascending)
  const allDates = Array.from(uniqueDatesSet)
    .sort()
    .map(dateStr => moment(dateStr));

  // Get the first occurrence of each day of the week (Mon-Sun)
  // 0 = Sunday, 1 = Monday, etc.
  const firstDayOccurrence = {};

  allDates.forEach((date) => {
    const dayOfWeek = date.day(); // 0-6 (Sunday-Saturday)
    if (!firstDayOccurrence[dayOfWeek]) {
      firstDayOccurrence[dayOfWeek] = date;
    }
  });

  // Create weekDays array in order: Sunday to Saturday
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    if (firstDayOccurrence[i]) {
      weekDays.push(firstDayOccurrence[i]);
    }
  }

  // Helper function to get discipline badge style
  const getDisciplineBadgeStyle = (position) => {
    if (!position) return styles.nurseBadge;

    const positionLower = position.toLowerCase();
    // Check CNA first before checking for "nurse" (to avoid matching "Certified Nursing Assistant")
    if (positionLower.includes("cna") ||
        positionLower.includes("aide") ||
        positionLower.includes("assistant") ||
        positionLower.includes("certified nurse assistant") ||
        positionLower.includes("certified nursing assistant")) {
      return styles.cnaBadge;
    } else if (positionLower.includes("rn") || positionLower.includes("lpn")) {
      return styles.nurseBadge;
    } else if (positionLower.includes("nurse")) {
      // If it contains "nurse" but didn't match CNA checks above, it's a nurse
      return styles.nurseBadge;
    } else if (positionLower.includes("msw") || positionLower.includes("social")) {
      return styles.mswBadge;
    } else if (positionLower.includes("sc") || positionLower.includes("chaplain")) {
      return styles.scBadge;
    }
    return styles.nurseBadge; // Default
  };

  return (
    <Document>
      {/* Page 1: Original Discipline View */}
      {disciplines.map((disciplineName, index) => {
        const disciplineInfo = disciplineData[disciplineName];
        const clients = Object.keys(disciplineInfo.clientVisits).sort();

        return (
          <Page key={index} size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Discipline Work Matrix - Regular Visits
              </Text>
              <Text style={styles.subtitle}>
                Week: {moment(weekStart).format("MMM DD, YYYY")} - {moment(weekEnd).format("MMM DD, YYYY")}
              </Text>
              <Text style={styles.generated}>
                Generated: {moment().format("MM/DD/YYYY hh:mm A")}
              </Text>
            </View>

            <View style={{ marginBottom: 10, padding: 8, backgroundColor: "#3498db" }}>
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff" }}>
                {disciplineName} ({disciplineInfo.position}) - {clients.length} Client{clients.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.table}>
              {/* Header Row */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.patientCell]}>
                  Client
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>
                  Freq
                </Text>
                {weekDays.map((day, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.tableHeaderCell,
                      styles.dayCell,
                      idx === weekDays.length - 1 ? styles.lastCell : {}
                    ]}
                  >
                    {day.format("ddd")}
                  </Text>
                ))}
              </View>

              {/* Data Rows */}
              {clients.map((clientCd, clientIdx) => {
                const clientVisits = disciplineInfo.clientVisits[clientCd] || {};
                const frequency = disciplineInfo.clientFrequency?.[clientCd] || "-";

                return (
                  <View key={clientIdx} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.patientCell]}>
                      {clientCd}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.5, textAlign: "center", fontWeight: "bold" }]}>
                      {frequency}
                    </Text>
                    {weekDays.map((day, dayIdx) => {
                      // Find the first visit that matches this day of the week
                      const targetDayOfWeek = day.day(); // 0-6 (Sunday-Saturday)
                      let visit = null;

                      // Search through all client visits to find one on the same day of week
                      for (const dateKey in clientVisits) {
                        const visitDate = moment(dateKey);
                        if (visitDate.day() === targetDayOfWeek) {
                          visit = clientVisits[dateKey];
                          break; // Use first occurrence
                        }
                      }

                      return (
                        <View
                          key={dayIdx}
                          style={[
                            styles.tableCell,
                            styles.dayCell,
                            dayIdx === weekDays.length - 1 ? styles.lastCell : {}
                          ]}
                        >
                          {visit && (
                            <View style={[styles.disciplineBadge, getDisciplineBadgeStyle(disciplineInfo.position)]}>
                              <Text>{visit.date}</Text>
                              <Text>{visit.timeIn}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>

            <View style={styles.footer}>
              <Text>
                This page shows {disciplineName}'s schedule. Time shown is visit start time.
              </Text>
            </View>
          </Page>
        );
      })}

      {/* Last Page: Patient Summary View */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Patient Visit Schedule - Summary
          </Text>
          <Text style={styles.subtitle}>
            Week: {moment(weekStart).format("MMM DD, YYYY")} - {moment(weekEnd).format("MMM DD, YYYY")}
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.patientCell]}>
              Patient
            </Text>
            {weekDays.map((day, idx) => (
              <Text
                key={idx}
                style={[
                  styles.tableHeaderCell,
                  styles.dayCell,
                  idx === weekDays.length - 1 ? styles.lastCell : {}
                ]}
              >
                {day.format("ddd")}
              </Text>
            ))}
          </View>

          {/* Data Rows */}
          {patients.map((patientCd, patientIdx) => {
            const patientVisits = patientData[patientCd];

            return (
              <View key={patientIdx} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.patientCell]}>
                  {patientCd}
                </Text>
                {weekDays.map((day, dayIdx) => {
                  // Find ALL visits that match this day of the week
                  const targetDayOfWeek = day.day(); // 0-6 (Sunday-Saturday)
                  const allVisits = [];

                  // Search through all patient visits to find ALL occurrences on the same day of week
                  const sortedDateKeys = Object.keys(patientVisits).sort();
                  for (const dateKey of sortedDateKeys) {
                    const visitDate = moment(dateKey);
                    if (visitDate.day() === targetDayOfWeek) {
                      // Collect ALL visits from this day
                      allVisits.push(...patientVisits[dateKey]);
                    }
                  }

                  // Remove duplicate disciplines - keep unique by disciplineName
                  const uniqueVisits = [];
                  const seenDisciplines = new Set();

                  allVisits.forEach((visit) => {
                    if (!seenDisciplines.has(visit.disciplineName)) {
                      seenDisciplines.add(visit.disciplineName);
                      uniqueVisits.push(visit);
                    }
                  });

                  return (
                    <View
                      key={dayIdx}
                      style={[
                        styles.tableCell,
                        styles.dayCell,
                        dayIdx === weekDays.length - 1 ? styles.lastCell : {}
                      ]}
                    >
                      {uniqueVisits.map((visit, visitIdx) => (
                        <View
                          key={visitIdx}
                          style={[
                            styles.disciplineBadge,
                            getDisciplineBadgeStyle(visit.position)
                          ]}
                        >
                          <Text>{visit.disciplineName}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Discipline Legend & Summary</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBadge, styles.nurseBadge]}>
              <Text>Nurse</Text>
            </View>
            <Text style={styles.summaryText}>
              RN, LPN - {disciplineCounts.nurse || 0} visit(s)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBadge, styles.cnaBadge]}>
              <Text>CNA</Text>
            </View>
            <Text style={styles.summaryText}>
              Certified Nursing Assistant - {disciplineCounts.cna || 0} visit(s)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBadge, styles.mswBadge]}>
              <Text>MSW</Text>
            </View>
            <Text style={styles.summaryText}>
              Medical Social Worker - {disciplineCounts.msw || 0} visit(s)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBadge, styles.scBadge]}>
              <Text>SC</Text>
            </View>
            <Text style={styles.summaryText}>
              Spiritual Care/Chaplain - {disciplineCounts.sc || 0} visit(s)
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            This summary shows all disciplines visiting each patient. Color-coded badges indicate discipline type.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Total Patients: {patients.length} | Filtered by: Regular Visit service type
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DisciplineWorkMatrixDocument;

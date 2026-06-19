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
    borderBottomColor: "#e91e63",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#e91e63",
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
  summarySection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  summaryRow: {
    marginBottom: 4,
    fontSize: 10,
  },
  monthSection: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#e91e63",
    color: "#fff",
  },
  patientRow: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingBottom: 8,
    borderBottom: "1px solid #eee",
  },
  patientHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 8,
    color: "#666",
    marginBottom: 3,
  },
  milestoneRow: {
    marginTop: 4,
    fontSize: 8,
    color: "#333",
    paddingLeft: 8,
    paddingBottom: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #f0f0f0",
  },
  monthBadge: {
    backgroundColor: "#e91e63",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: 3,
    fontSize: 7,
    fontWeight: "bold",
    marginRight: 6,
  },
  overdueText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  upcomingText: {
    color: "#f57c00",
    fontWeight: "bold",
  },
  urgentText: {
    color: "#ff5722",
    fontWeight: "bold",
  },
  completedText: {
    color: "#43a047",
    fontWeight: "bold",
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

const BereavementPrintDocument = ({ patients, startDate, endDate }) => {
  const today = moment();

  // Use provided date range
  const rangeStart = moment(startDate);
  const rangeEnd = moment(endDate);

  // Group patients by month based on their milestones' due dates
  const groupPatientsByMonth = () => {
    const patientsByMonth = {};

    patients.forEach((patient) => {
      const milestones = patient.milestones || [];

      // Check which milestones fall within the date range
      milestones.forEach((milestone) => {
        const dueDate = moment(milestone.dueDate);

        // Only include milestones within the selected date range
        if (dueDate.isBetween(rangeStart, rangeEnd, null, "[]")) {
          const monthKey = dueDate.format("YYYY-MM");
          const monthLabel = dueDate.format("MMMM YYYY");

          if (!patientsByMonth[monthKey]) {
            patientsByMonth[monthKey] = {
              label: monthLabel,
              patients: [],
            };
          }

          // Check if patient already exists in this month
          let existingPatient = patientsByMonth[monthKey].patients.find(
            p => p.patientCd === patient.patientCd
          );

          if (!existingPatient) {
            existingPatient = {
              patientCd: patient.patientCd,
              patientName: patient.patientName,
              dateOfDeath: patient.dateOfDeath,
              bereavementCompleted: patient.bereavementCompleted,
              bereavement_remarks: patient.bereavement_remarks,
              milestonesInMonth: [],
            };
            patientsByMonth[monthKey].patients.push(existingPatient);
          }

          // Add this milestone to the patient's milestones for this month
          existingPatient.milestonesInMonth.push({
            name: milestone.name,
            dueDate: milestone.dueDate,
            dueDateRange: milestone.dueDateRange,
            status: milestone.status,
            completed: milestone.completed,
            daysUntil: dueDate.diff(today, "days"),
          });
        }
      });
    });

    // Sort milestones within each patient by date
    Object.keys(patientsByMonth).forEach((monthKey) => {
      patientsByMonth[monthKey].patients.forEach((patient) => {
        patient.milestonesInMonth.sort((a, b) => {
          return moment(a.dueDate).diff(moment(b.dueDate));
        });
      });

      // Sort patients by first milestone date
      patientsByMonth[monthKey].patients.sort((a, b) => {
        const aFirstDate = moment(a.milestonesInMonth[0].dueDate);
        const bFirstDate = moment(b.milestonesInMonth[0].dueDate);
        return aFirstDate.diff(bFirstDate);
      });
    });

    return patientsByMonth;
  };

  const patientsByMonth = groupPatientsByMonth();
  const sortedMonths = Object.keys(patientsByMonth).sort();

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "overdue":
        return styles.overdueText;
      case "urgent":
        return styles.urgentText;
      case "upcoming":
        return styles.upcomingText;
      default:
        return {};
    }
  };

  const getStatusLabel = (milestone) => {
    if (milestone.completed) {
      return "COMPLETED";
    }

    const daysUntil = milestone.daysUntil;
    if (daysUntil < 0) {
      return `OVERDUE (${Math.abs(daysUntil)} days)`;
    } else if (daysUntil <= 7) {
      return `URGENT (${daysUntil} days)`;
    } else if (daysUntil <= 14) {
      return `UPCOMING (${daysUntil} days)`;
    } else {
      return `${daysUntil} days`;
    }
  };

  const totalPatients = patients.length;
  const totalMilestones = sortedMonths.reduce((sum, month) => {
    return sum + patientsByMonth[month].patients.reduce((pSum, p) => {
      return pSum + p.milestonesInMonth.length;
    }, 0);
  }, 0);

  const completedPatients = patients.filter(p => p.bereavementCompleted).length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Bereavement Timeline Report
          </Text>
          <Text style={styles.subtitle}>
            Bereavement Support Milestones (Within 13 Months from EOC)
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <Text style={styles.summaryRow}>
            Total Patients: {totalPatients}
          </Text>
          <Text style={styles.summaryRow}>
            Bereavement Completed: {completedPatients}
          </Text>
          <Text style={styles.summaryRow}>
            In Progress: {totalPatients - completedPatients}
          </Text>
          <Text style={styles.summaryRow}>
            Total Milestones Due (Selected Range): {totalMilestones}
          </Text>
          <Text style={styles.summaryRow}>
            Report Period: {rangeStart.format("MM/DD/YYYY")} to{" "}
            {rangeEnd.format("MM/DD/YYYY")}
          </Text>
        </View>

        {sortedMonths.length === 0 ? (
          <View style={{ marginTop: 20, textAlign: "center" }}>
            <Text style={{ fontSize: 11, color: "#666" }}>
              No milestones due within the selected date range
            </Text>
          </View>
        ) : (
          sortedMonths.map((monthKey, index) => {
            const monthData = patientsByMonth[monthKey];
            return (
              <View key={monthKey} style={styles.monthSection} wrap={false}>
                <Text style={styles.monthTitle}>{monthData.label}</Text>
                {monthData.patients.map((patient, patientIndex) => (
                  <View key={patientIndex} style={styles.patientRow}>
                    <Text style={styles.patientHeader}>
                      {patient.patientCd} {patient.patientName ? `- ${patient.patientName}` : ""}
                      {patient.bereavementCompleted && " [COMPLETED]"}
                    </Text>
                    <Text style={styles.patientInfo}>
                      EOC: {moment(patient.dateOfDeath).format("MM/DD/YYYY")}
                    </Text>
                    {patient.bereavement_remarks && (
                      <Text style={styles.patientInfo}>
                        Remarks: {patient.bereavement_remarks}
                      </Text>
                    )}

                    {patient.milestonesInMonth.map((milestone, milestoneIndex) => {
                      // Extract month number from milestone name (e.g., "Month 3" -> "3")
                      const monthMatch = milestone.name.match(/Month (\d+)/);
                      const monthNumber = monthMatch ? monthMatch[1] : "";

                      // Extract the description after the colon (e.g., "Month 3: Check-in Card" -> "Check-in Card")
                      const descriptionMatch = milestone.name.match(/Month \d+:\s*(.+)/);
                      const description = descriptionMatch ? descriptionMatch[1] : milestone.name;

                      return (
                        <View key={milestoneIndex} style={styles.milestoneRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 8, color: "#333", marginBottom: 2 }}>
                              {description}
                            </Text>
                            <Text style={{ fontSize: 7, color: "#999" }}>
                              Due: {moment(milestone.dueDate).format("MM/DD/YYYY")} ({milestone.dueDateRange}) {monthNumber && `Month ${monthNumber}`}
                            </Text>
                          </View>
                          <View style={{ alignItems: "flex-end" }}>
                            {milestone.completed ? (
                              <Text style={styles.completedText}>
                                ✓ COMPLETED
                              </Text>
                            ) : (
                              <Text style={getStatusBadgeStyle(milestone.status)}>
                                {getStatusLabel(milestone)}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            );
          })
        )}

        <View style={styles.footer}>
          <Text>
            This document was generated automatically. Please verify all
            information before use.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Legend: OVERDUE (past due) | URGENT (≤7 days) | UPCOMING (8-14 days)
          </Text>
          <Text style={{ marginTop: 4 }}>
            Milestones: Month 0 (7-14 days) | Month 1 (30-40 days) | Month 3 (90 days) |
            Month 6 (6 months) | Month 9 (9 months) | Month 12 (1 year) | Month 13 (13 months)
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BereavementPrintDocument;

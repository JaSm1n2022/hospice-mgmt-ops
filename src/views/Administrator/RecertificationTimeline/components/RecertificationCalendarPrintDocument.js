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
    borderBottomColor: "#00acc1",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#00acc1",
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
  patientSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
  },
  patientHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#00acc1",
  },
  recertRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 4,
    borderBottom: "1px solid #eee",
  },
  recertLabel: {
    fontSize: 9,
    color: "#666",
  },
  recertValue: {
    fontSize: 9,
    color: "#333",
  },
  urgentBadge: {
    color: "#f44336",
    fontWeight: "bold",
  },
  upcomingBadge: {
    color: "#ff9800",
    fontWeight: "bold",
  },
  scheduledBadge: {
    color: "#4caf50",
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
  monthSection: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#00acc1",
    color: "#fff",
  },
  eventRow: {
    marginBottom: 6,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const RecertificationCalendarPrintDocument = ({ patients, startDate, endDate }) => {
  const today = moment();

  // Use provided date range or default to 1 year
  const rangeStart = startDate ? moment(startDate) : today;
  const rangeEnd = endDate ? moment(endDate) : moment().add(1, "year");

  // Group recertifications by month
  const groupEventsByMonth = () => {
    const eventsByMonth = {};

    patients.forEach((patient) => {
      const recertifications = patient.recertifications || [];

      recertifications.forEach((recert) => {
        const dueDate = moment(recert.dueDate);

        // Only include recertifications within the selected date range
        if (dueDate.isBetween(rangeStart, rangeEnd, null, "[]")) {
          const monthKey = dueDate.format("YYYY-MM");
          const monthLabel = dueDate.format("MMMM YYYY");

          if (!eventsByMonth[monthKey]) {
            eventsByMonth[monthKey] = {
              label: monthLabel,
              events: [],
            };
          }

          // The recert.benefitPeriod is the CURRENT period
          // The recertification due is to certify for the NEXT period (benefitPeriod + 1)
          const currentBP = recert.benefitPeriod;
          const certifyingForBP = currentBP + 1;

          // Cert #2 is when currently in BP 1, certifying for BP 2
          const isCert2 = currentBP === 1;
          // F2F is required when certifying for BP 3 or higher (currently in BP 2+)
          const isF2F = certifyingForBP >= 3;

          // Calculate suggested visit date
          // F2F (BP 3+): 15 days before due date
          // Cert #2 and Cert #1 (BP 1-2): 5 days before due date
          let suggestedVisitDate = null;
          let suggestedDaysBefore = 0;
          if (isF2F) {
            suggestedVisitDate = moment(dueDate).subtract(15, "days");
            suggestedDaysBefore = 15;
          } else {
            // For BP 1 and BP 2, suggest 5 days before
            suggestedVisitDate = moment(dueDate).subtract(5, "days");
            suggestedDaysBefore = 5;
          }

          eventsByMonth[monthKey].events.push({
            date: dueDate.format("MM/DD/YYYY"),
            suggestedVisitDate: suggestedVisitDate ? suggestedVisitDate.format("MM/DD/YYYY") : null,
            suggestedDaysBefore: suggestedDaysBefore,
            patientCd: patient.patientCd,
            patientName: patient.patientName,
            currentBP: currentBP,
            certifyingForBP: certifyingForBP,
            benefitPeriod: recert.benefitPeriod,
            daysInPeriod: recert.daysInPeriod,
            status: recert.status,
            daysUntil: dueDate.diff(today, "days"),
            isF2F: isF2F,
            isCert2: isCert2,
          });
        }
      });
    });

    // Sort events within each month by date
    Object.keys(eventsByMonth).forEach((monthKey) => {
      eventsByMonth[monthKey].events.sort((a, b) => {
        return moment(a.date, "MM/DD/YYYY").diff(moment(b.date, "MM/DD/YYYY"));
      });
    });

    return eventsByMonth;
  };

  const eventsByMonth = groupEventsByMonth();
  const sortedMonths = Object.keys(eventsByMonth).sort();

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "urgent":
        return styles.urgentBadge;
      case "upcoming":
        return styles.upcomingBadge;
      case "scheduled":
        return styles.scheduledBadge;
      default:
        return {};
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "urgent":
        return "URGENT";
      case "upcoming":
        return "UPCOMING";
      case "scheduled":
        return "SCHEDULED";
      default:
        return "PENDING";
    }
  };

  const totalEvents = sortedMonths.reduce(
    (sum, month) => sum + eventsByMonth[month].events.length,
    0
  );

  const f2fEvents = sortedMonths.reduce((sum, month) => {
    return sum + eventsByMonth[month].events.filter(e => e.isF2F).length;
  }, 0);

  const cert2Events = sortedMonths.reduce((sum, month) => {
    return sum + eventsByMonth[month].events.filter(e => e.isCert2).length;
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Recertification Calendar Summary
          </Text>
          <Text style={styles.subtitle}>
            All Active Patients - F2F Starting from 3rd Benefit Period
          </Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <Text style={styles.summaryRow}>
            Total Patients: {patients.length}
          </Text>
          <Text style={styles.summaryRow}>
            Total Recertification Events (Selected Range): {totalEvents}
          </Text>
          <Text style={styles.summaryRow}>
            Cert #2 Events (Benefit Period 2): {cert2Events}
          </Text>
          <Text style={styles.summaryRow}>
            F2F Required Events (Benefit Period 3+): {f2fEvents}
          </Text>
          <Text style={styles.summaryRow}>
            Report Period: {rangeStart.format("MM/DD/YYYY")} to{" "}
            {rangeEnd.format("MM/DD/YYYY")}
          </Text>
        </View>

        {sortedMonths.map((monthKey, index) => {
          const monthData = eventsByMonth[monthKey];
          return (
            <View key={monthKey} style={styles.monthSection} wrap={false}>
              <Text style={styles.monthTitle}>{monthData.label}</Text>
              {monthData.events.map((event, eventIndex) => (
                <View key={eventIndex} style={styles.eventRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      <Text style={{ fontSize: 9, color: "#333", fontWeight: "bold" }}>
                        {event.date} - {event.patientCd} ({event.patientName || "N/A"})
                      </Text>
                      {event.isCert2 && (
                        <Text style={{ fontSize: 9, color: "#9c27b0", fontWeight: "bold", marginLeft: 4 }}>
                          [Cert #2 is due]
                        </Text>
                      )}
                      {event.isF2F && (
                        <Text style={{ fontSize: 9, color: "#00acc1", fontWeight: "bold", marginLeft: 4 }}>
                          [F2F Required - BP {event.certifyingForBP}]
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
                      Current Benefits: {event.currentBP}
                    </Text>
                    {event.suggestedVisitDate && (
                      <Text style={{
                        fontSize: 8,
                        color: event.isF2F ? "#00acc1" : "#9c27b0",
                        marginTop: 2,
                        fontWeight: "bold"
                      }}>
                        Suggested Visit: {event.suggestedVisitDate} ({event.suggestedDaysBefore} days before due)
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={getStatusBadgeStyle(event.status)}>
                      {getStatusLabel(event.status)}
                    </Text>
                    <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
                      {event.daysUntil >= 0
                        ? `${event.daysUntil} days`
                        : `${Math.abs(event.daysUntil)} days overdue`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>
            This document was generated automatically. Please verify all
            information before use.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Legend: URGENT (≤7 days) | UPCOMING (8-14 days) | SCHEDULED (15+
            days)
          </Text>
          <Text style={{ marginTop: 4 }}>
            F2F (Face-to-Face) is required for Benefit Period 3 and beyond.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Suggested visit dates: BP 1-2 = 5 days before due | BP 3+ (F2F) = 15 days before due.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default RecertificationCalendarPrintDocument;

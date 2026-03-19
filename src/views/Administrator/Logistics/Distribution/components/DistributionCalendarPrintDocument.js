import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
  dateSection: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#e91e63",
    color: "#fff",
  },
  patientSection: {
    marginBottom: 15,
  },
  patientHeader: {
    fontSize: 10,
    color: "#e91e63",
    fontWeight: "bold",
    marginBottom: 8,
    paddingLeft: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginLeft: 10,
    marginRight: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableColDescription: {
    width: "75%",
    padding: 5,
    fontSize: 9,
  },
  tableColQty: {
    width: "25%",
    padding: 5,
    fontSize: 9,
    textAlign: "right",
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

const DistributionCalendarPrintDocument = ({ distributions, startDate, endDate }) => {
  // Use provided date range
  const rangeStart = startDate ? moment(startDate) : moment().subtract(1, "month");
  const rangeEnd = endDate ? moment(endDate) : moment();

  // Filter distributions by date range AND category (Medical/Incontinence only)
  const filteredDistributions = Array.isArray(distributions)
    ? distributions.filter((dist) => {
        if (!dist || !dist.order_at) return false;

        // Check date range
        const orderDate = moment(dist.order_at);
        if (!orderDate.isBetween(rangeStart, rangeEnd, "day", "[]")) return false;

        // Check category - only Medical/Incontinence
        const category = dist.category || "";
        const subCategory = dist.subCategory || "";

        // Check if it's Medical/Incontinence or just Incontinence
        if (category.toLowerCase().includes("medical") ||
            category.toLowerCase().includes("incontinence") ||
            subCategory.toLowerCase().includes("incontinence")) {
          return true;
        }

        return false;
      })
    : [];

  // Group by order date and patient
  const eventsByDate = {};

  filteredDistributions.forEach((dist) => {
    if (!dist || !dist.order_at) return;

    const orderDate = moment(dist.order_at);
    const dateKey = orderDate.format("YYYY-MM-DD");
    const dateLabel = orderDate.format("dddd, MMMM DD, YYYY");
    const patientCd = dist.patientCd || "N/A";

    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = {
        label: dateLabel,
        patients: {},
      };
    }

    if (!eventsByDate[dateKey].patients[patientCd]) {
      eventsByDate[dateKey].patients[patientCd] = {
        patientCd: patientCd,
        items: [],
      };
    }

    const itemDescription = dist.shortDescription || dist.description || "N/A";
    const itemQty = dist.order_qty || 0;
    const itemUom = dist.unit_uom || "";

    eventsByDate[dateKey].patients[patientCd].items.push({
      description: itemDescription,
      qty: itemQty,
      uom: itemUom,
    });
  });

  const sortedDates = Object.keys(eventsByDate).sort((a, b) => moment(b).diff(moment(a)));

  // Calculate summary
  const patientCounts = {};
  filteredDistributions.forEach((dist) => {
    if (!dist) return;
    const patient = dist.patientCd || "N/A";
    patientCounts[patient] = (patientCounts[patient] || 0) + 1;
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Distribution Calendar Report</Text>
          <Text style={styles.subtitle}>Medical/Incontinence Category Only</Text>
          <Text style={styles.generated}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <Text style={styles.summaryRow}>
            Total Orders: {filteredDistributions.length}
          </Text>
          <Text style={styles.summaryRow}>
            Unique Patients: {Object.keys(patientCounts).length}
          </Text>
          <Text style={styles.summaryRow}>
            Report Period: {rangeStart.format("MM/DD/YYYY")} to {rangeEnd.format("MM/DD/YYYY")}
          </Text>
        </View>

        {sortedDates.map((dateKey) => {
          const dateData = eventsByDate[dateKey];
          const patientEntries = Object.values(dateData.patients);

          return (
            <View key={dateKey} style={styles.dateSection}>
              <Text style={styles.dateTitle}>{dateData.label}</Text>
              {patientEntries.map((patientData, patientIndex) => (
                <View key={patientIndex} style={styles.patientSection}>
                  <Text style={styles.patientHeader}>
                    Patient: {patientData.patientCd}
                  </Text>

                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableColDescription}>Description</Text>
                      <Text style={styles.tableColQty}>Qty</Text>
                    </View>
                    {patientData.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.tableRow}>
                        <Text style={styles.tableColDescription}>{item.description}</Text>
                        <Text style={styles.tableColQty}>
                          {item.qty} {item.uom}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>
            This document was generated automatically. Please verify all information before use.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DistributionCalendarPrintDocument;

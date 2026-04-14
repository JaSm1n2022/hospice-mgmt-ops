import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

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
    marginBottom: 3,
    color: "#666",
  },
  employeeName: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 15,
    marginBottom: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    backgroundColor: "#e0e0e0",
    minHeight: 30,
    alignItems: "center",
    fontWeight: "bold",
  },
  tableCol: {
    padding: 5,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  tableColClient: {
    width: "20%",
  },
  tableColDate: {
    width: "35%",
  },
  tableColService: {
    width: "25%",
  },
  tableColPayment: {
    width: "20%",
    textAlign: "right",
  },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    minHeight: 30,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  totalLabel: {
    width: "80%",
    padding: 8,
    fontSize: 11,
    textAlign: "right",
    fontWeight: "bold",
  },
  totalValue: {
    width: "20%",
    padding: 8,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    borderLeftWidth: 1,
    borderLeftColor: "#000",
    borderLeftStyle: "solid",
  },
});

const EarningPrintDocument = ({ data, logoBase64, employeeName, dateStart, dateEnd, total }) => {
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
          <Text style={styles.title}>Services & Earnings Report</Text>
          {employeeName && (
            <Text style={styles.employeeName}>{employeeName}</Text>
          )}
          <Text style={styles.dateRange}>
            {dateStart} to {dateEnd}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow} fixed>
            <View style={[styles.tableCol, styles.tableColClient, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={styles.headerText}>Client</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColDate, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColService, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={styles.headerText}>Service</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColPayment, { borderRightWidth: 0, justifyContent: "center", alignItems: "center" }]}>
              <Text style={styles.headerText}>Estimated Payment</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.map((row, rowIndex) => {
            // Clean patient code - remove date suffix
            const patientCode = row.patientCd || "";
            const cleanedPatient = patientCode.includes(".")
              ? patientCode.split(".")[0]
              : patientCode;

            // Format date
            const date = row.dosStart ? dayjs(row.dosStart).format("YYYY-MM-DD") : "";

            // Format times
            const timeIn = row.dosStart ? dayjs(row.dosStart).format("HH:mm") : "";
            const timeOut = row.dosEnd ? dayjs(row.dosEnd).format("HH:mm") : "";

            // Get day of week
            const dayOfWeek = row.dosStart ? dayjs(row.dosStart).format("ddd") : "";

            // Calculate duration
            let duration = "";
            if (row.dosStart && row.dosEnd) {
              const start = dayjs(row.dosStart);
              const end = dayjs(row.dosEnd);
              const durationMinutes = end.diff(start, "minutes");
              const hours = Math.floor(durationMinutes / 60);
              const minutes = durationMinutes % 60;
              duration = `${hours}h ${minutes}m`;
            }

            // Combine: Date TimeIn - TimeOut (Day) Duration
            const dateTimeDisplay = `${date} ${timeIn} - ${timeOut} (${dayOfWeek}) ${duration}`;

            // Format payment
            const payment = row.estimatedPayment
              ? `$${parseFloat(row.estimatedPayment).toFixed(2)}`
              : "$0.00";

            return (
              <View key={`row-${rowIndex}`} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCol, styles.tableColClient]}>
                  {cleanedPatient}
                </Text>
                <Text style={[styles.tableCol, styles.tableColDate]}>
                  {dateTimeDisplay}
                </Text>
                <Text style={[styles.tableCol, styles.tableColService]}>
                  {row.service || ""}
                </Text>
                <Text style={[styles.tableCol, styles.tableColPayment, { borderRightWidth: 0 }]}>
                  {payment}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Total Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total Earnings:
          </Text>
          <Text style={styles.totalValue}>
            ${parseFloat(total || 0).toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EarningPrintDocument;

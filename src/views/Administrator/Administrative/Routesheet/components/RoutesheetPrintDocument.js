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
import { CLIENT_SERVICES } from "utils/constants";

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
    marginBottom: 5,
  },
  staffInfo: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 3,
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
  tableWrapper: {
    border: "1px solid #000",
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
    padding: 3,
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  tableColPatient: {
    width: "11%",
  },
  tableColService: {
    width: "7%",
  },
  tableColDate: {
    width: "9%",
  },
  tableColTimeBegin: {
    width: "7%",
  },
  tableColTimeEnd: {
    width: "7%",
  },
  tableColDuration: {
    width: "7%",
  },
  tableColSignature: {
    width: "14%",
  },
  tableColRate: {
    width: "9%",
  },
  tableColComments: {
    width: "29%",
  },
  signatureImage: {
    width: 60,
    height: 25,
    objectFit: "contain",
  },
  headerText: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  serviceCodesSection: {
    marginTop: 20,
  },
  serviceCodesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceCodesTable: {
    display: "table",
    width: "auto",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  serviceCodesHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    backgroundColor: "#e0e0e0",
    minHeight: 25,
    alignItems: "center",
    fontWeight: "bold",
  },
  serviceCodesRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 20,
    alignItems: "center",
  },
  serviceCodesHeaderCol: {
    width: "12.5%",
    padding: 5,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    justifyContent: "center",
  },
  serviceCodesDataCol: {
    width: "12.5%",
    padding: 3,
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    justifyContent: "center",
  },
  staffInfoTable: {
    display: "table",
    width: "auto",
    marginBottom: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  staffInfoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 25,
    alignItems: "center",
  },
  staffInfoLabel: {
    width: "30%",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  staffInfoValue: {
    width: "70%",
    padding: 5,
    fontSize: 9,
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
    padding: 5,
    fontSize: 10,
    textAlign: "right",
    fontWeight: "bold",
  },
  totalValue: {
    width: "20%",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    borderLeftWidth: 1,
    borderLeftColor: "#000",
    borderLeftStyle: "solid",
  },
  pageBreak: {
    marginTop: 20,
  },
});

const RoutesheetPrintDocument = ({ groupedData, logoBase64 }) => {
  // groupedData is an object with employee names as keys
  // Each value is { employeeName, position, rows: [] }

  return (
    <Document>
      {Object.keys(groupedData).map((employeeName, empIndex) => {
        const employeeData = groupedData[employeeName];
        const rows = employeeData.rows;
        const position = employeeData.position || "";

        // Calculate total for this employee
        const total = rows.reduce((sum, row) => {
          return sum + (parseFloat(row.approvedPayment) || 0);
        }, 0);

        return (
          <Page key={`employee-${empIndex}`} size="A4" style={styles.page} wrap>
            {/* Header */}
            <View style={styles.header} fixed>
              {logoBase64 && (
                <Image
                  cache={false}
                  src={logoBase64}
                  style={styles.logo}
                />
              )}
              <Text style={styles.title}>Route Sheet</Text>

              {/* Staff Info Table */}
              <View style={styles.staffInfoTable}>
                <View style={styles.staffInfoRow}>
                  <Text style={styles.staffInfoLabel}>Staff Member</Text>
                  <Text style={styles.staffInfoValue}>{employeeName}</Text>
                </View>
                {position && (
                  <View style={[styles.staffInfoRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.staffInfoLabel}>Position</Text>
                    <Text style={styles.staffInfoValue}>{position}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow} fixed>
                <View style={[styles.tableCol, styles.tableColPatient, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Patient</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColService, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Service</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColDate, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Date</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColTimeBegin, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Time</Text>
                  <Text style={styles.headerText}>Begin</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColTimeEnd, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Time</Text>
                  <Text style={styles.headerText}>End</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColDuration, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Duration</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColSignature, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Signature</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColRate, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Service</Text>
                  <Text style={styles.headerText}>Rate</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColComments, { borderRightWidth: 0, justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Comments</Text>
                </View>
              </View>

              {/* Table Rows */}
              {rows.map((row, rowIndex) => {
                // Extract date from timeIn or dosStart (for discipline routesheet compatibility)
                const startTime = row.timeIn || row.dosStart;
                const endTime = row.timeOut || row.dosEnd;

                const date = startTime
                  ? moment(startTime).format("YYYY-MM-DD")
                  : "";

                // Extract time from timeIn/dosStart and timeOut/dosEnd
                const timeBegin = startTime
                  ? moment(startTime).format("HH:mm")
                  : "";
                const timeEnd = endTime
                  ? moment(endTime).format("HH:mm")
                  : "";

                // Format approved payment
                const serviceRate = row.approvedPayment
                  ? `$${parseFloat(row.approvedPayment).toFixed(2)}`
                  : "$0.00";

                // Trim patient code - keep only digits before dot, max 20 chars
                const patientCode = row.patientCd || "";
                let trimmedPatient = patientCode.includes(".")
                  ? patientCode.split(".")[0]
                  : patientCode;
                // Truncate to 20 characters
                if (trimmedPatient.length > 20) {
                  trimmedPatient = trimmedPatient.substring(0, 20);
                }

                // Get service code - use serviceCd if available, otherwise find from CLIENT_SERVICES
                let serviceCode = row.serviceCd || "";
                if (!serviceCode && row.service) {
                  const serviceMatch = CLIENT_SERVICES.find(
                    (s) => s.name === row.service
                  );
                  serviceCode = serviceMatch ? serviceMatch.code : row.service;
                }

                // Calculate duration
                let duration = "";
                if (startTime && endTime) {
                  const start = moment(startTime);
                  const end = moment(endTime);
                  const durationMinutes = end.diff(start, "minutes");
                  const hours = Math.floor(durationMinutes / 60);
                  const minutes = durationMinutes % 60;
                  duration = `${hours}h ${minutes}m`;
                }

                return (
                  <View key={`row-${rowIndex}`} style={styles.tableRow} wrap={false}>
                    <Text style={[styles.tableCol, styles.tableColPatient]}>
                      {trimmedPatient}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColService]}>
                      {serviceCode}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColDate]}>
                      {date}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColTimeBegin]}>
                      {timeBegin}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColTimeEnd]}>
                      {timeEnd}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColDuration]}>
                      {duration}
                    </Text>
                    <View style={[styles.tableCol, styles.tableColSignature, { justifyContent: "center", alignItems: "center" }]}>
                      {row.signature_based ? (
                        <Image
                          src={row.signature_based}
                          style={styles.signatureImage}
                        />
                      ) : (
                        <Text style={{ fontSize: 7 }}>-</Text>
                      )}
                    </View>
                    <Text style={[styles.tableCol, styles.tableColRate]}>
                      {serviceRate}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColComments, { borderRightWidth: 0 }]}>
                      {[row.serviceNotes || "", row.comments || ""].filter(Boolean).join(" ") || ""}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total Rate for Services:
              </Text>
              <Text style={styles.totalValue}>
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Service Codes Table */}
            <View style={styles.serviceCodesSection}>
              <Text style={styles.serviceCodesTitle}>Service Codes</Text>
              <View style={styles.serviceCodesTable}>
                {/* Header Row */}
                <View style={styles.serviceCodesHeaderRow}>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Code</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Description</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Code</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Description</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Code</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Description</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%" }]}>Code</Text>
                  <Text style={[styles.serviceCodesHeaderCol, { width: "12.5%", borderRightWidth: 0 }]}>Description</Text>
                </View>

                {/* Split CLIENT_SERVICES into rows of 4 columns (2 code-name pairs per row) */}
                {Array.from({ length: Math.ceil(CLIENT_SERVICES.length / 4) }).map((_, rowIdx) => {
                  const startIdx = rowIdx * 4;
                  const rowServices = CLIENT_SERVICES.slice(startIdx, startIdx + 4);

                  return (
                    <View key={`service-row-${rowIdx}`} style={styles.serviceCodesRow}>
                      {/* Service 1: Code */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[0]?.code || ""}
                      </Text>
                      {/* Service 1: Description */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[0]?.name || ""}
                      </Text>

                      {/* Service 2: Code */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[1]?.code || ""}
                      </Text>
                      {/* Service 2: Description */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[1]?.name || ""}
                      </Text>

                      {/* Service 3: Code */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[2]?.code || ""}
                      </Text>
                      {/* Service 3: Description */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[2]?.name || ""}
                      </Text>

                      {/* Service 4: Code */}
                      <Text style={styles.serviceCodesDataCol}>
                        {rowServices[3]?.code || ""}
                      </Text>
                      {/* Service 4: Description (no right border) */}
                      <Text style={[styles.serviceCodesDataCol, { borderRightWidth: 0 }]}>
                        {rowServices[3]?.name || ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default RoutesheetPrintDocument;

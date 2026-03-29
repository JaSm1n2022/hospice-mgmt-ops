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
    width: 400,
    height: 40,
    marginBottom: 10,
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
    width: "8%",
  },
  tableColService: {
    width: "15%",
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
  tableColSignature: {
    width: "15%",
  },
  tableColRate: {
    width: "9%",
  },
  tableColComments: {
    width: "30%",
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
  serviceCodesRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 20,
  },
  serviceCodePair: {
    width: "25%",
    flexDirection: "row",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  serviceCodeCol: {
    width: "30%",
    padding: 3,
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    justifyContent: "center",
  },
  serviceNameCol: {
    width: "70%",
    padding: 3,
    fontSize: 7,
    justifyContent: "center",
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
              <Text style={styles.staffInfo}>
                Staff Member: {employeeName}
              </Text>
              {position && (
                <Text style={styles.staffInfo}>Position: {position}</Text>
              )}
            </View>

            {/* Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
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
                // Extract date from timeIn
                const date = row.timeIn
                  ? moment(row.timeIn).format("YYYY-MM-DD")
                  : "";

                // Extract time from timeIn and timeOut
                const timeBegin = row.timeIn
                  ? moment(row.timeIn).format("HH:mm")
                  : "";
                const timeEnd = row.timeOut
                  ? moment(row.timeOut).format("HH:mm")
                  : "";

                // Format approved payment
                const serviceRate = row.approvedPayment
                  ? `$${parseFloat(row.approvedPayment).toFixed(2)}`
                  : "$0.00";

                // Trim patient code - keep only digits before dot, max 15 chars
                const patientCode = row.patientCd || "";
                let trimmedPatient = patientCode.includes(".")
                  ? patientCode.split(".")[0]
                  : patientCode;
                // Truncate to 15 characters
                if (trimmedPatient.length > 15) {
                  trimmedPatient = trimmedPatient.substring(0, 15);
                }

                // Get service code - use serviceCd if available, otherwise find from CLIENT_SERVICES
                let serviceCode = row.serviceCd || "";
                if (!serviceCode && row.service) {
                  const serviceMatch = CLIENT_SERVICES.find(
                    (s) => s.name === row.service
                  );
                  serviceCode = serviceMatch ? serviceMatch.code : row.service;
                }

                return (
                  <View key={`row-${rowIndex}`} style={styles.tableRow}>
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
                      {row.comments || ""}
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
                {/* Split CLIENT_SERVICES into rows of 4 columns (2 code-name pairs per row) */}
                {Array.from({ length: Math.ceil(CLIENT_SERVICES.length / 4) }).map((_, rowIdx) => {
                  const startIdx = rowIdx * 4;
                  const rowServices = CLIENT_SERVICES.slice(startIdx, startIdx + 4);

                  return (
                    <View key={`service-row-${rowIdx}`} style={styles.serviceCodesRow}>
                      {/* Column 1: Code + Name */}
                      {rowServices[0] && (
                        <View style={styles.serviceCodePair}>
                          <View style={styles.serviceCodeCol}>
                            <Text>{rowServices[0].code}</Text>
                          </View>
                          <View style={styles.serviceNameCol}>
                            <Text>{rowServices[0].name}</Text>
                          </View>
                        </View>
                      )}
                      {!rowServices[0] && <View style={styles.serviceCodePair} />}

                      {/* Column 2: Code + Name */}
                      {rowServices[1] && (
                        <View style={styles.serviceCodePair}>
                          <View style={styles.serviceCodeCol}>
                            <Text>{rowServices[1].code}</Text>
                          </View>
                          <View style={styles.serviceNameCol}>
                            <Text>{rowServices[1].name}</Text>
                          </View>
                        </View>
                      )}
                      {!rowServices[1] && <View style={styles.serviceCodePair} />}

                      {/* Column 3: Code + Name */}
                      {rowServices[2] && (
                        <View style={styles.serviceCodePair}>
                          <View style={styles.serviceCodeCol}>
                            <Text>{rowServices[2].code}</Text>
                          </View>
                          <View style={styles.serviceNameCol}>
                            <Text>{rowServices[2].name}</Text>
                          </View>
                        </View>
                      )}
                      {!rowServices[2] && <View style={styles.serviceCodePair} />}

                      {/* Column 4: Code + Name (no right border) */}
                      {rowServices[3] && (
                        <View style={[styles.serviceCodePair, { borderRightWidth: 0 }]}>
                          <View style={styles.serviceCodeCol}>
                            <Text>{rowServices[3].code}</Text>
                          </View>
                          <View style={styles.serviceNameCol}>
                            <Text>{rowServices[3].name}</Text>
                          </View>
                        </View>
                      )}
                      {!rowServices[3] && <View style={[styles.serviceCodePair, { borderRightWidth: 0 }]} />}
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

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
    marginBottom: 20,
  },
  employeeSection: {
    marginBottom: 25,
    pageBreakInside: "avoid",
  },
  employeeHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
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
  tableColServiceType: {
    width: "25%",
  },
  tableColServiceRate: {
    width: "20%",
    textAlign: "right",
  },
  tableColRateType: {
    width: "20%",
  },
  tableColMileageRate: {
    width: "15%",
    textAlign: "right",
  },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const ContractPrintDocument = ({ contractsByEmployee, logoBase64 }) => {
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
          <Text style={styles.title}>Contract Management Report</Text>
        </View>

        {/* Employee Sections */}
        {contractsByEmployee.map((employeeGroup, empIndex) => (
          <View key={`employee-${empIndex}`} style={styles.employeeSection} wrap={false}>
            {/* Employee Header */}
            <Text style={styles.employeeHeader}>
              {employeeGroup.employeeName} ({employeeGroup.employeeTitle}) ({employeeGroup.employeeType})
            </Text>

            {/* Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <View style={[styles.tableCol, styles.tableColClient, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Client</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColServiceType, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Service Type</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColServiceRate, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Service Rate</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColRateType, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Rate Type</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColMileageRate, { borderRightWidth: 0, justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.headerText}>Mileage Rate</Text>
                </View>
              </View>

              {/* Table Rows */}
              {employeeGroup.contracts.map((contract, rowIndex) => {
                const serviceRate = contract.serviceRate
                  ? `$${parseFloat(contract.serviceRate).toFixed(2)}`
                  : "$0.00";

                const mileageRate = contract.mileageRate
                  ? `$${parseFloat(contract.mileageRate).toFixed(2)}`
                  : "$0.00";

                return (
                  <View key={`row-${rowIndex}`} style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableColClient]}>
                      {contract.patientCd || ""}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColServiceType]}>
                      {contract.serviceType || ""}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColServiceRate]}>
                      {serviceRate}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColRateType]}>
                      {contract.serviceRateType || ""}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableColMileageRate, { borderRightWidth: 0 }]}>
                      {mileageRate}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ContractPrintDocument;

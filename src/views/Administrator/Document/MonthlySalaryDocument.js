import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "assets/img/headerdoc.png";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Title mappings for better fit in PDF
const shortenTitle = (title) => {
  const titleMap = {
    "Certified Nurse Assistant": "CNA",
    "Administrative Manager": "Admin Manager",
    "Director Community Liaison": "Dir. Community Liaison",
  };
  return titleMap[title] || title;
};

// Create styles for landscape PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #333",
    paddingBottom: 10,
  },
  logo: {
    width: "100%",
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    textAlign: "center",
    color: "#555",
  },
  metaInfo: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #ddd",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: "2pt solid #333",
    fontWeight: "bold",
  },
  tableTotalRow: {
    flexDirection: "row",
    backgroundColor: "#e8e8e8",
    borderTop: "2pt solid #333",
    fontWeight: "bold",
  },
  tableCellTitle: {
    width: "12%",
    padding: 5,
    fontSize: 8,
    borderRight: "1pt solid #ddd",
  },
  tableCellMonth: {
    width: "6.5%",
    padding: 5,
    fontSize: 7,
    textAlign: "right",
    borderRight: "1pt solid #ddd",
  },
  tableCellTotal: {
    width: "8.5%",
    padding: 5,
    fontSize: 7,
    textAlign: "right",
    fontWeight: "bold",
  },
  tableHeaderCell: {
    padding: 5,
    fontSize: 8,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTop: "1pt solid #ddd",
    paddingTop: 10,
  },
});

const MonthlySalaryDocument = ({
  year,
  summaryData,
  monthlyTotals,
  grandTotal,
  employeeData,
  employeeMonthlyTotals,
  employeeGrandTotal,
  generatedDate,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.title}>Monthly Salary Report</Text>
          <Text style={styles.subtitle}>Year: {year}</Text>
          <Text style={styles.metaInfo}>
            Generated on: {generatedDate}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellTitle, styles.tableHeaderCell]}>
              Employee Title
            </Text>
            {MONTHS.map((month) => (
              <Text
                key={month}
                style={[styles.tableCellMonth, styles.tableHeaderCell]}
              >
                {month}
              </Text>
            ))}
            <Text style={[styles.tableCellTotal, styles.tableHeaderCell]}>
              Total (YTD)
            </Text>
          </View>

          {/* Data Rows */}
          {summaryData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellTitle}>{shortenTitle(row.title)}</Text>
              {row.months.map((amount, idx) => (
                <Text key={idx} style={styles.tableCellMonth}>
                  {amount > 0 ? formatCurrency(amount) : "-"}
                </Text>
              ))}
              <Text style={styles.tableCellTotal}>
                {formatCurrency(row.total)}
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.tableTotalRow}>
            <Text style={styles.tableCellTitle}>Monthly Totals</Text>
            {monthlyTotals.map((amount, idx) => (
              <Text key={idx} style={styles.tableCellMonth}>
                {amount > 0 ? formatCurrency(amount) : "-"}
              </Text>
            ))}
            <Text style={styles.tableCellTotal}>
              {formatCurrency(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This report summarizes total payroll expenses by employee title for
            each month of {year}.
          </Text>
          <Text>Hospice Management Operations System</Text>
        </View>
      </Page>

      {/* Second Page - By Employee Name */}
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.title}>Monthly Salary Report - By Employee Name</Text>
          <Text style={styles.subtitle}>Year: {year}</Text>
          <Text style={styles.metaInfo}>
            Generated on: {generatedDate}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellTitle, styles.tableHeaderCell]}>
              Employee Name
            </Text>
            {MONTHS.map((month) => (
              <Text
                key={month}
                style={[styles.tableCellMonth, styles.tableHeaderCell]}
              >
                {month}
              </Text>
            ))}
            <Text style={[styles.tableCellTotal, styles.tableHeaderCell]}>
              Total (YTD)
            </Text>
          </View>

          {/* Data Rows */}
          {employeeData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellTitle}>{row.name}</Text>
              {row.months.map((amount, idx) => (
                <Text key={idx} style={styles.tableCellMonth}>
                  {amount > 0 ? formatCurrency(amount) : "-"}
                </Text>
              ))}
              <Text style={styles.tableCellTotal}>
                {formatCurrency(row.total)}
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.tableTotalRow}>
            <Text style={styles.tableCellTitle}>Monthly Totals</Text>
            {employeeMonthlyTotals.map((amount, idx) => (
              <Text key={idx} style={styles.tableCellMonth}>
                {amount > 0 ? formatCurrency(amount) : "-"}
              </Text>
            ))}
            <Text style={styles.tableCellTotal}>
              {formatCurrency(employeeGrandTotal)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This report summarizes total payroll expenses by employee name for
            each month of {year}.
          </Text>
          <Text>Hospice Management Operations System</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MonthlySalaryDocument;

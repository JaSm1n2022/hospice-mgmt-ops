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
    padding: 20,
    fontSize: 9,
  },
  header: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: "#9c27b0",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#9c27b0",
  },
  subtitle: {
    fontSize: 8,
    color: "#666",
    marginBottom: 2,
  },
  generated: {
    fontSize: 7,
    color: "#999",
    marginTop: 3,
  },
  patientSection: {
    marginBottom: 15,
    marginTop: 10,
  },
  patientHeader: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#9c27b0",
    color: "#fff",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
    minHeight: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "solid",
    minHeight: 22,
  },
  tableCell: {
    padding: 4,
    fontSize: 7,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
    textAlign: "left",
    justifyContent: "center",
    overflow: "hidden",
  },
  tableHeaderCell: {
    padding: 4,
    fontSize: 7,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#999",
    borderRightStyle: "solid",
    textAlign: "left",
    justifyContent: "center",
    overflow: "hidden",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  summarySection: {
    marginTop: 10,
    width: "70%",
  },
  summaryTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#9c27b0",
  },
  summaryTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  summaryHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "solid",
    minHeight: 18,
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
    minHeight: 16,
  },
  summaryHeaderCell: {
    padding: 3,
    fontSize: 7,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#999",
    borderRightStyle: "solid",
    textAlign: "left",
    justifyContent: "center",
  },
  summaryCell: {
    padding: 3,
    fontSize: 7,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
    textAlign: "left",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    paddingTop: 5,
    fontSize: 6,
    color: "#666",
    textAlign: "center",
    borderTop: "1px solid #ccc",
  },
});

const QAPrintDocument = ({ qaRecords }) => {
  const ROWS_PER_PAGE = 20;

  // Group records by patient and sort by source date
  const groupByPatient = () => {
    const grouped = {};

    qaRecords.forEach((record) => {
      // Only include records with a valid patientCd
      if (record && record.patientCd && record.patientCd.trim()) {
        const patientKey = record.patientCd.trim();
        if (!grouped[patientKey]) {
          grouped[patientKey] = [];
        }
        grouped[patientKey].push(record);
      }
    });

    // Sort records within each patient by QA Type
    Object.keys(grouped).forEach((patientKey) => {
      grouped[patientKey].sort((a, b) => {
        const typeA = a.qa_type || "";
        const typeB = b.qa_type || "";
        return typeA.localeCompare(typeB);
      });
    });

    return grouped;
  };

  // Split records into pages with max 20 rows per page
  const paginateRecords = (records, patientCd) => {
    const pages = [];
    // Only create pages if there are records
    if (!records || records.length === 0) {
      return pages;
    }

    for (let i = 0; i < records.length; i += ROWS_PER_PAGE) {
      const recordsSlice = records.slice(i, i + ROWS_PER_PAGE);
      // Only add page if the slice has records
      if (recordsSlice.length > 0) {
        pages.push({
          patientCd,
          records: recordsSlice,
          pageNum: Math.floor(i / ROWS_PER_PAGE) + 1,
          totalPages: Math.ceil(records.length / ROWS_PER_PAGE),
          totalRecords: records.length,
        });
      }
    }
    return pages;
  };

  const groupedRecords = groupByPatient();
  const sortedPatients = Object.keys(groupedRecords).sort();

  // Create paginated pages for all patients
  const allPages = [];
  sortedPatients.forEach((patientCd) => {
    const records = groupedRecords[patientCd];
    if (records && records.length > 0) {
      const patientPages = paginateRecords(records, patientCd);
      // Only add pages that have records
      if (patientPages && patientPages.length > 0) {
        patientPages.forEach(page => {
          if (page && page.records && page.records.length > 0) {
            allPages.push(page);
          }
        });
      }
    }
  });

  // Filter out any null or invalid pages
  const validPages = allPages.filter(page =>
    page &&
    page.patientCd &&
    page.records &&
    page.records.length > 0
  );

  // Build final doc items: each patient's data pages followed by a dedicated summary page
  const docItems = [];
  validPages.forEach((page) => {
    docItems.push({ type: "data", page });
    if (page.pageNum === page.totalPages) {
      docItems.push({ type: "summary", patientCd: page.patientCd });
    }
  });

  console.log('QA Print Debug:', {
    totalRecords: qaRecords.length,
    groupedPatientsCount: sortedPatients.length,
    totalPages: allPages.length,
    validPagesCount: validPages.length,
    validPages: validPages.map(p => ({
      patient: p.patientCd,
      recordCount: p.records.length,
      pageNum: p.pageNum
    }))
  });

  // Render table header
  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>QA Type</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Source Date</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>QA Date</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Complete Date</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Status</Text>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Discipline</Text>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Reviewer</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>LCD</Text>
      <Text style={[styles.tableHeaderCell, { flex: 0.5, ...styles.lastCell }]}>Cert #</Text>
    </View>
  );

  // Render data row
  const renderDataRow = (record, idx) => (
    <View key={idx} style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        {record.qa_type || ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.8 }]}>
        {record.qa_source_dt ? moment(record.qa_source_dt).format("MM/DD/YYYY") : ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.8 }]}>
        {record.qa_date ? moment(record.qa_date).format("MM/DD/YYYY") : ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.8 }]}>
        {record.completed_dt ? moment(record.completed_dt).format("MM/DD/YYYY") : ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.8 }]}>
        {record.qa_status || ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        {record.discipline_name || ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        {record.reviewer_name || ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.7 }]}>
        {record.qa_type && (
          record.qa_type.toLowerCase().includes("visit") ||
          record.qa_type === "SC Assessment" ||
          record.qa_type === "MSW Assessment"
        )
          ? "N/A"
          : record.isLcdCompliance === true
            ? "Compliant"
            : record.isLcdCompliance === false
              ? "Non-Compliant"
              : ""}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.5, ...styles.lastCell }]}>
        {record.recertNumber || ""}
      </Text>
    </View>
  );

  // Render summary of completed/pending counts by QA Type for a patient
  const renderPatientSummary = (patientCd) => {
    const records = groupedRecords[patientCd] || [];
    const summaryMap = {};

    records.forEach((record) => {
      const type = record.qa_type || "Unknown";
      if (!summaryMap[type]) {
        summaryMap[type] = { completed: 0, pending: 0 };
      }
      if (record.qa_status === "Complete") {
        summaryMap[type].completed += 1;
      } else {
        summaryMap[type].pending += 1;
      }
    });

    const types = Object.keys(summaryMap).sort();

    return (
      <View style={styles.summarySection}>
        <Text style={styles.patientHeader}>
          Patient: {patientCd}
        </Text>
        <Text style={styles.summaryTitle}>Summary by QA Type</Text>
        <View style={styles.summaryTable}>
          <View style={styles.summaryHeaderRow}>
            <Text style={[styles.summaryHeaderCell, { flex: 1.5 }]}>QA Type</Text>
            <Text style={[styles.summaryHeaderCell, { flex: 1 }]}>Completed</Text>
            <Text style={[styles.summaryHeaderCell, { flex: 1, ...styles.lastCell }]}>Pending</Text>
          </View>
          {types.map((type, idx) => (
            <View key={idx} style={styles.summaryRow}>
              <Text style={[styles.summaryCell, { flex: 1.5 }]}>{type}</Text>
              <Text style={[styles.summaryCell, { flex: 1 }]}>{summaryMap[type].completed}</Text>
              <Text style={[styles.summaryCell, { flex: 1, ...styles.lastCell }]}>{summaryMap[type].pending}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Return empty document if no pages
  if (validPages.length === 0) {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>
              QA Monitoring Report
            </Text>
            <Text style={styles.subtitle}>
              No records found
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {docItems.map((item, itemIndex) => (
        <Page key={itemIndex} size="A4" orientation="landscape" style={styles.page} wrap>
          <View style={styles.header} fixed>
            <Text style={styles.title}>
              QA Monitoring Report
            </Text>
            <Text style={styles.subtitle}>
              Quality Assurance Records Grouped by Patient
            </Text>
            <Text style={styles.generated}>
              Generated: {moment().format("MM/DD/YYYY hh:mm A")}
            </Text>
          </View>

          {item.type === "data" ? (
            <View style={styles.patientSection}>
              <Text style={styles.patientHeader}>
                Patient: {item.page.patientCd} ({item.page.totalRecords} total record{item.page.totalRecords !== 1 ? "s" : ""} - Page {item.page.pageNum} of {item.page.totalPages})
              </Text>

              <View style={styles.table}>
                {renderTableHeader()}
                {item.page.records.map((record, idx) => renderDataRow(record, idx))}
              </View>
            </View>
          ) : (
            <View style={styles.patientSection}>
              {renderPatientSummary(item.patientCd)}
            </View>
          )}

          <View style={styles.footer} fixed>
            <Text>
              This document was generated automatically. Please verify all information before use.
            </Text>
            <Text style={{ marginTop: 2 }}>
              Page {itemIndex + 1} of {docItems.length} | Total Patients: {sortedPatients.length} | Total Records: {qaRecords.length}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default QAPrintDocument;

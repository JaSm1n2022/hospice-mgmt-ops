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

// Color palette
const C = {
  ink: "#242A27",
  muted: "#6F6C64",
  faint: "#9C988E",
  terra: "#C15E38",
  terraSoft: "#F4E7DF",
  gold: "#B58A34",
  brandGreen: "#20443B",
  sage: "#2E7D6E",
  line: "#E4DED2",
  lineSoft: "#EFEADF",
  head: "#F5F0E7",
  tint: "#FBF8F2",
  white: "#FFFFFF",
  alert: "#ff9800",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingRight: 40,
    paddingBottom: 30,
    paddingLeft: 40,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: C.ink,
    backgroundColor: C.white,
  },

  // header image
  headerImage: {
    width: "100%",
    height: 80,
    objectFit: "contain",
    marginBottom: 15,
  },

  // title
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 12,
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: "Helvetica",
    fontSize: 6,
    letterSpacing: 2.4,
    color: C.alert,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    color: C.brandGreen,
    marginTop: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: "Times-Roman",
    fontStyle: "italic",
    fontSize: 9,
    color: C.terra,
    marginTop: 3,
  },
  generatedSection: {
    textAlign: "right",
  },
  generatedLabel: {
    fontSize: 5.4,
    letterSpacing: 1.8,
    color: C.faint,
    textTransform: "uppercase",
  },
  generatedValue: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: C.ink,
    marginTop: 2,
  },

  // summary box
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.terraSoft,
    border: `1 solid ${C.terra}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 6,
    letterSpacing: 1.6,
    color: C.terra,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontFamily: "Times-Roman",
    fontSize: 18,
    color: C.brandGreen,
    marginTop: 3,
  },

  // table
  table: {
    marginTop: 8,
  },
  tHead: {
    flexDirection: "row",
    backgroundColor: C.head,
    borderTop: `1 solid ${C.line}`,
    borderBottom: `1 solid ${C.line}`,
    borderLeft: `1 solid ${C.line}`,
    borderRight: `1 solid ${C.line}`,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    fontFamily: "Helvetica",
    fontSize: 5.6,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#4A4E45",
  },
  tRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${C.lineSoft}`,
    borderLeft: `1 solid ${C.line}`,
    borderRight: `1 solid ${C.line}`,
  },
  tRowAlt: {
    backgroundColor: C.tint,
  },
  td: {
    minHeight: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 7,
    justifyContent: "center",
    borderRight: `1 solid ${C.lineSoft}`,
  },
  tdLast: {
    borderRight: 0,
  },
  alertBadge: {
    backgroundColor: C.alert,
    color: C.white,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 6.5,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },

  // footer
  foot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 8,
    borderTop: `1 solid ${C.line}`,
  },
  footC: {
    fontSize: 5.4,
    color: C.faint,
  },
  footB: {
    fontFamily: "Helvetica",
    color: C.muted,
  },
  footP: {
    fontFamily: "Times-Roman",
    fontSize: 6,
    color: C.faint,
    letterSpacing: 1,
  },
});

const NonComplianceReportDocument = ({ records, logoBase64, thresholdHours, generatedDate }) => {
  // Column widths
  const W = {
    client: "14%",
    service: "18%",
    timeIn: "13%",
    employee: "15%",
    position: "14%",
    hours: "11%",
    notes: "15%",
  };

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Header */}
        {logoBase64 && <Image src={logoBase64} style={styles.headerImage} />}

        {/* Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleSection}>
            <Text style={styles.eyebrow}>⚠ Compliance Alert Report</Text>
            <Text style={styles.title}>{thresholdHours}-Hour Non-Compliance Report</Text>
            <Text style={styles.subtitle}>
              Records pending review beyond {thresholdHours}-hour threshold
            </Text>
          </View>
          <View style={styles.generatedSection}>
            <Text style={styles.generatedLabel}>Generated</Text>
            <Text style={styles.generatedValue}>{generatedDate}</Text>
          </View>
        </View>

        {/* Summary Box */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Records</Text>
            <Text style={styles.summaryValue}>{records.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Threshold</Text>
            <Text style={styles.summaryValue}>{thresholdHours}h</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Max Hours Pending</Text>
            <Text style={styles.summaryValue}>
              {records.length > 0
                ? Math.max(...records.map((r) => r.hoursSinceTimeIn))
                : 0}
              h
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tHead}>
            <Text style={[styles.th, { width: W.client }]}>Client</Text>
            <Text style={[styles.th, { width: W.service }]}>Type of Visit</Text>
            <Text style={[styles.th, { width: W.timeIn }]}>Time In</Text>
            <Text style={[styles.th, { width: W.employee }]}>Employee</Text>
            <Text style={[styles.th, { width: W.position }]}>Position</Text>
            <Text style={[styles.th, { width: W.hours }]}>Hours Since</Text>
            <Text style={[styles.th, { width: W.notes }]}>Notes</Text>
          </View>

          {/* Data Rows */}
          {records.map((record, index) => (
            <View
              key={`record-${index}`}
              style={[styles.tRow, index % 2 === 1 && styles.tRowAlt]}
              wrap={false}
            >
              <View style={[styles.td, { width: W.client }]}>
                <Text>{record.client}</Text>
              </View>
              <View style={[styles.td, { width: W.service }]}>
                <Text>{record.service}</Text>
              </View>
              <View style={[styles.td, { width: W.timeIn }]}>
                <Text>{record.timeIn}</Text>
              </View>
              <View style={[styles.td, { width: W.employee }]}>
                <Text>{record.employee}</Text>
              </View>
              <View style={[styles.td, { width: W.position }]}>
                <Text>{record.position}</Text>
              </View>
              <View style={[styles.td, { width: W.hours }]}>
                <Text style={styles.alertBadge}>{record.hoursSinceTimeIn}h</Text>
              </View>
              <View style={[styles.td, styles.tdLast, { width: W.notes }]}>
                <Text>{record.notes}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.foot}>
          <Text style={styles.footC}>
            <Text style={styles.footB}>Action Required. </Text>
            All records listed require immediate review and documentation per compliance
            policy.
          </Text>
          <Text style={styles.footP}>HALOES TOUCH HOSPICE</Text>
        </View>
      </Page>
    </Document>
  );
};

export default NonComplianceReportDocument;

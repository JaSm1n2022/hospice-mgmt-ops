import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const DARKGREEN = "#163B2A";
const BRIGHTGREEN = "#23854D";
const GOLD = "#D6BC62";
const MINT = "#EDF6EF";
const MUTED = "#647469";
const RULE = "#D8E2DA";
const INK = "#1C2B22";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 36,
    paddingTop: 46,
    paddingBottom: 46,
    fontFamily: "Helvetica",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: DARKGREEN,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: DARKGREEN,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DARKGREEN,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 26,
    marginBottom: 26,
    position: "relative",
    overflow: "hidden",
  },
  headerGoldBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: GOLD,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 14,
  },
  avatarImage: {
    width: 40,
    height: 40,
    objectFit: "cover",
  },
  headerCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerCardSubtitle: {
    fontSize: 7,
    color: "#CFE3D6",
    marginTop: 3,
    letterSpacing: 0.4,
  },
  reportLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: BRIGHTGREEN,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: INK,
    lineHeight: 1.25,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 16,
  },
  rule: {
    height: 1,
    backgroundColor: RULE,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  infoLabel: {
    width: "38%",
    fontSize: 8,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.4,
  },
  infoValue: {
    flex: 1,
    fontSize: 11,
    color: INK,
  },
  statusBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: MINT,
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: INK,
    letterSpacing: 0.4,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: BRIGHTGREEN,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: INK,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 9.5,
    color: INK,
    lineHeight: 1.6,
    marginBottom: 28,
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  signatureCol: {
    flex: 1,
    marginRight: 20,
  },
  signatureColLast: {
    marginRight: 0,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    marginBottom: 6,
    height: 18,
    justifyContent: "flex-end",
  },
  signatureValue: {
    fontSize: 9,
    color: INK,
  },
  signatureLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.4,
  },
  footnote: {
    fontSize: 7.5,
    color: MUTED,
    fontStyle: "italic",
    marginTop: 14,
  },
});

const UnduplicatedAdmissionsByLocationDocument = ({
  selectedYear,
  ccn,
  preparedBy,
  parentLocation,
}) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);
  const coverageLabel = `${yearStart.format("MMMM D, YYYY")} - ${periodEnd.format(
    "MMMM D, YYYY"
  )}`;
  const location = parentLocation || "Henderson, Nevada";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.topBar} fixed />
        <View style={styles.bottomBar} fixed />

        <View style={styles.headerCard}>
          <View style={styles.headerGoldBar} />
          <View style={styles.avatar}>
            <Image src={docLogo} style={styles.avatarImage} />
          </View>
          <View>
            <Text style={styles.headerCardTitle}>HALOES TOUCH HOSPICE INC.</Text>
            <Text style={styles.headerCardSubtitle}>
              ACHC SURVEY DOCUMENTATION  /  MEDICARE CERTIFICATION
            </Text>
          </View>
        </View>

        <Text style={styles.reportLabel}>MULTIPLE LOCATION REPORT</Text>
        <Text style={styles.title}>Unduplicated Admissions{"\n"}by Multiple Location</Text>
        <Text style={styles.subtitle}>
          Reporting under the parent Medicare Provider Number
        </Text>
        <View style={styles.rule} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>REPORTING PERIOD</Text>
          <Text style={styles.infoValue}>{coverageLabel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>MEDICARE PROVIDER NO. (CCN)</Text>
          <Text style={styles.infoValue}>{ccn || "[ENTER CCN]"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PARENT LOCATION</Text>
          <Text style={styles.infoValue}>{location}</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={styles.statusValue}>NOT APPLICABLE (N/A)</Text>
        </View>

        <Text style={styles.sectionTitle}>Agency Location Declaration</Text>
        <Text style={styles.bodyText}>
          Haloes Touch Hospice Inc. operates from a single location in {location},
          and does not maintain additional hospice branches or multiple locations
          operating under its parent Medicare Provider Number. Therefore, a
          separate unduplicated admissions report by multiple locations is not
          applicable.
        </Text>

        <View style={styles.rule} />

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>{preparedBy || ""}</Text>
            </View>
            <Text style={styles.signatureLabel}>PREPARED BY</Text>
          </View>
          <View style={[styles.signatureCol, styles.signatureColLast]}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>
                {moment().format("MM/DD/YYYY")}
              </Text>
            </View>
            <Text style={styles.signatureLabel}>DATE GENERATED</Text>
          </View>
        </View>

        <Text style={styles.footnote}>
          Verify single-location status and CCN before issuing this report.
        </Text>
      </Page>
    </Document>
  );
};

export default UnduplicatedAdmissionsByLocationDocument;

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const DARKGREEN = "#163B2A";
const GOLD = "#D6BC62";
const MINT = "#EDF6EF";
const MUTED = "#647469";
const RULE = "#D8E2DA";
const INK = "#1C2B22";
const LIGHTBG = "#F4F6F4";
const ZEBRA = "#F7FAF8";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    paddingBottom: 56,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: DARKGREEN,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 18,
    paddingLeft: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
  },
  headerAvatarImage: {
    width: 32,
    height: 32,
    objectFit: "cover",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerSubLine: {
    fontSize: 7,
    color: "#CFE3D6",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  headerBadge: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  headerBadgeText: {
    fontSize: 7,
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerBadgeStatus: {
    fontSize: 8,
    color: GOLD,
    fontWeight: "bold",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: DARKGREEN,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  summaryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: RULE,
    backgroundColor: MINT,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  summaryBoxLast: {
    marginRight: 0,
  },
  summaryLabel: {
    fontSize: 6,
    color: MUTED,
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 10,
    color: INK,
    fontWeight: "bold",
  },
  tableSectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  tableSectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: INK,
  },
  tableSectionNote: {
    fontSize: 7,
    color: MUTED,
  },
  table: {
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: DARKGREEN,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: ZEBRA,
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  th: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  td: {
    fontSize: 8,
    color: INK,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tdMuted: {
    fontSize: 8,
    color: MUTED,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tdBold: {
    fontSize: 8,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  colNum: { width: "4%" },
  colPatientName: { width: "16%" },
  colSoc: { width: "9%" },
  colDiagnosis: { width: "19%" },
  colDisciplines: { width: "18%" },
  colLocation: { width: "26%" },
  colLoc: { width: "8%" },
  disciplineLine: {
    fontSize: 7.5,
    color: INK,
    marginBottom: 1,
  },
  locationLine: {
    fontSize: 7.5,
    color: INK,
    marginBottom: 1,
  },
  locationLineBold: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  emptyText: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic",
    padding: 14,
    textAlign: "center",
  },
  noteBox: {
    backgroundColor: LIGHTBG,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    padding: 10,
    marginTop: 14,
  },
  noteTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: DARKGREEN,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  noteText: {
    fontSize: 7.5,
    color: MUTED,
    lineHeight: 1.4,
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 20,
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
    borderBottomColor: INK,
    marginBottom: 4,
    height: 16,
    justifyContent: "flex-end",
  },
  signatureValue: {
    fontSize: 9,
    color: INK,
  },
  signatureLabel: {
    fontSize: 7,
    color: MUTED,
    letterSpacing: 0.4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
    maxWidth: "80%",
  },
  footerPage: {
    fontSize: 7,
    color: MUTED,
  },
});

const mostCommon = (values) => {
  const counts = {};
  let best = null;
  let bestCount = 0;
  values.forEach((v) => {
    if (!v) return;
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > bestCount) {
      bestCount = counts[v];
      best = v;
    }
  });
  return best;
};

const PatientCensusDocument = ({
  censusData,
  ccn,
  preparedBy,
  reviewedBy,
}) => {
  const rows = [...(censusData || [])].sort((a, b) => {
    const aTime = a.soc ? moment(a.soc).valueOf() : 0;
    const bTime = b.soc ? moment(b.soc).valueOf() : 0;
    return aTime - bTime;
  });

  const primaryLevelOfCare =
    mostCommon(rows.map((r) => r.levelOfCare)) || "RC";

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View style={styles.headerGoldBar} />
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Image
                src={docLogo}
                cache={false}
                style={styles.headerAvatarImage}
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerSubLine}>
                ACHC ON-SITE SURVEY READINESS
              </Text>
            </View>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>CENSUS</Text>
            <Text style={styles.headerBadgeStatus}>
              {moment().format("MM/DD/YYYY")}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Current Patient Census</Text>
        <Text style={styles.subtitle}>
          PATIENT-LEVEL CENSUS  |  SORTED BY START OF CARE
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>CENSUS AS OF</Text>
            <Text style={styles.summaryValue}>
              {moment().format("MMMM D, YYYY")}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>ACTIVE PATIENTS</Text>
            <Text style={styles.summaryValue}>{rows.length}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>MEDICARE CCN</Text>
            <Text style={styles.summaryValue}>{ccn || "—"}</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxLast]}>
            <Text style={styles.summaryLabel}>PRIMARY LEVEL OF CARE</Text>
            <Text style={styles.summaryValue}>{primaryLevelOfCare}</Text>
          </View>
        </View>

        <View style={styles.tableSectionRow}>
          <Text style={styles.tableSectionTitle}>Active patient roster</Text>
          <Text style={styles.tableSectionNote}>
            Clients on service with no EOC on file
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <Text style={[styles.th, styles.colNum]}>#</Text>
            <Text style={[styles.th, styles.colPatientName]}>Patient Name</Text>
            <Text style={[styles.th, styles.colSoc]}>Start of Care</Text>
            <Text style={[styles.th, styles.colDiagnosis]}>
              Admitting Diagnosis
            </Text>
            <Text style={[styles.th, styles.colDisciplines]}>
              Disciplines Providing Care
            </Text>
            <Text style={[styles.th, styles.colLocation]}>
              Location
            </Text>
            <Text style={[styles.th, styles.colLoc]}>LOC</Text>
          </View>

          {rows.length === 0 ? (
            <Text style={styles.emptyText}>
              No active clients (without an EOC) were found for this census.
            </Text>
          ) : (
            rows.map((row, index) => (
              <View
                key={row.id}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                wrap={false}
              >
                <Text style={[styles.tdMuted, styles.colNum]}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={[styles.tdBold, styles.colPatientName]}>
                  {row.patientName || "—"}
                </Text>
                <Text style={[styles.td, styles.colSoc]}>
                  {row.soc ? moment(row.soc).format("MM/DD/YYYY") : "—"}
                </Text>
                <Text style={[styles.td, styles.colDiagnosis]}>
                  {row.admittingDiagnosis || "—"}
                </Text>
                <View style={styles.colDisciplines}>
                  {row.disciplines && row.disciplines.length ? (
                    row.disciplines.map((d, i) => (
                      <Text key={i} style={styles.disciplineLine}>
                        {d.name}
                        {d.position ? ` (${d.position})` : ""}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.disciplineLine}>—</Text>
                  )}
                </View>
                <View style={styles.colLocation}>
                  {row.locationName ||
                  row.locationAddress ||
                  row.locationCity ||
                  row.locationState ||
                  row.locationPostal ? (
                    <>
                      {row.locationName ? (
                        <Text style={styles.locationLineBold}>
                          {row.locationName.toUpperCase()}
                        </Text>
                      ) : null}
                      {row.locationAddress ? (
                        <Text style={styles.locationLine}>
                          {row.locationAddress}
                        </Text>
                      ) : null}
                      {row.locationCity || row.locationState || row.locationPostal ? (
                        <Text style={styles.locationLine}>
                          {[row.locationCity, row.locationState]
                            .filter(Boolean)
                            .join(", ")}
                          {row.locationPostal ? ` ${row.locationPostal}` : ""}
                        </Text>
                      ) : null}
                    </>
                  ) : (
                    <Text style={styles.locationLine}>—</Text>
                  )}
                </View>
                <Text style={[styles.tdBold, styles.colLoc]}>
                  {row.levelOfCare || "—"}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>SURVEY DOCUMENTATION NOTE</Text>
          <Text style={styles.noteText}>
            Includes every active patient as of the census date above. Review
            assigned care disciplines, location of care, and current hospice
            level of care for completeness prior to survey submission.
          </Text>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>{preparedBy || ""}</Text>
            </View>
            <Text style={styles.signatureLabel}>PREPARED BY</Text>
          </View>
          <View style={[styles.signatureCol, styles.signatureColLast]}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>{reviewedBy || ""}</Text>
            </View>
            <Text style={styles.signatureLabel}>REVIEWED BY</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated {moment().format("MM/DD/YYYY hh:mm A")} — Protect patient
            information as confidential PHI.
          </Text>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default PatientCensusDocument;

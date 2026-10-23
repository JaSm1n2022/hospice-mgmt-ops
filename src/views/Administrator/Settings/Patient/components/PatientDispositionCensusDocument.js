import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const NAVY = "#153348";
const NAVY_SOFT = "#9FB0C3";
const ACCENT = "#26935B";
const AMBER = "#D49A38";
const SLATE = "#60727C";
const MUTED = "#64748B";
const RULE = "#D9DEE6";
const INK = "#1C2430";
const LIGHTBG = "#F4F6F8";
const ZEBRA = "#F4F6F8";
const TOTALS_BG = "#E8F4ED";
const TOTALS_TEXT = "#1F6B46";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 0,
    paddingBottom: 40,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: NAVY,
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  headerAvatarImage: {
    width: 32,
    height: 32,
    objectFit: "cover",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: ACCENT,
    marginTop: 5,
    letterSpacing: 0.4,
  },
  headerSubLine: {
    fontSize: 7.5,
    color: NAVY_SOFT,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerRightLabel: {
    fontSize: 7.5,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRightValue: {
    fontSize: 8.5,
    color: NAVY_SOFT,
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 28,
  },
  coverageBand: {
    backgroundColor: LIGHTBG,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 16,
  },
  coverageLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  coverageValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: NAVY,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: RULE,
    borderLeftWidth: 4,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: NAVY,
  },
  th: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  colCategory: { width: "16%" },
  colMonth: { width: "6.46%" },
  colTotal: { width: "6.5%" },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  td: {
    fontSize: 8.5,
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  categoryCell: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  totalCell: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: TOTALS_BG,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  totalsLabel: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  totalsValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
  },
  activeCensusLabel: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    letterSpacing: 0.4,
    marginBottom: 3,
    textAlign: "right",
  },
  activeCensusValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "right",
  },
  notesBlock: {
    marginTop: 12,
  },
  noteText: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 3,
  },
  regTable: {
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 3,
    overflow: "hidden",
  },
  regHeaderRow: {
    flexDirection: "row",
    backgroundColor: NAVY,
  },
  regTh: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  regRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  regRowAlt: {
    backgroundColor: ZEBRA,
  },
  regTd: {
    fontSize: 8.5,
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  regTdBold: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  colPatient: { width: "22%" },
  colSoc: { width: "15%" },
  colDispDate: { width: "15%" },
  colDispType: { width: "18%" },
  colReason: { width: "30%" },
  emptyText: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic",
    padding: 14,
    textAlign: "center",
  },
  includeBox: {
    backgroundColor: TOTALS_BG,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  includeRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  includeLabel: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    width: 50,
  },
  includeText: {
    fontSize: 7.5,
    color: INK,
    flex: 1,
  },
  signatureFooter: {
    marginTop: 16,
    flexDirection: "row",
  },
  signatureFooterText: {
    fontSize: 8.5,
    color: MUTED,
    marginRight: 30,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerPage: {
    fontSize: 7,
    color: MUTED,
  },
});

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const matchesReason = (reason, keywords) => {
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

const classifyDisposition = (reason) => {
  if (matchesReason(reason, ["death"])) return "Death discharge";
  if (matchesReason(reason, ["revocation"])) return "Revocation";
  if (matchesReason(reason, ["transfer"])) return "Transfer";
  if (
    matchesReason(reason, [
      "extended prognosis",
      "travel outside of service area",
      "discharge for cause",
    ])
  ) {
    return "Live discharge";
  }
  return null;
};

const buildMonthlyCounts = (patientsData, year) => {
  const deathDischarge = new Array(12).fill(0);
  const revocation = new Array(12).fill(0);
  const liveDischarge = new Array(12).fill(0);
  const transfer = new Array(12).fill(0);

  (patientsData || []).forEach((patient) => {
    if (!patient.eoc) return;
    const eocDate = moment(patient.eoc);
    if (eocDate.year() !== year) return;

    const monthIdx = eocDate.month();
    const type = classifyDisposition(patient.eoc_discharge);

    if (type === "Death discharge") deathDischarge[monthIdx]++;
    else if (type === "Revocation") revocation[monthIdx]++;
    else if (type === "Live discharge") liveDischarge[monthIdx]++;
    else if (type === "Transfer") transfer[monthIdx]++;
  });

  return { deathDischarge, revocation, liveDischarge, transfer };
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildRegister = (patientsData, year) => {
  return (patientsData || [])
    .filter((patient) => {
      if (!patient.eoc) return false;
      if (moment(patient.eoc).year() !== year) return false;
      return !!classifyDisposition(patient.eoc_discharge);
    })
    .map((patient) => ({
      patientCd: patient.patientCd,
      soc: patient.soc,
      eoc: patient.eoc,
      type: classifyDisposition(patient.eoc_discharge),
      reason: patient.eoc_discharge,
    }))
    .sort((a, b) => moment(a.eoc).valueOf() - moment(b.eoc).valueOf());
};

const PatientDispositionCensusDocument = ({ patientsData, selectedYear, ccn, preparedBy, reviewedBy }) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);
  const isPartial = periodEnd.isBefore(yearEnd, "day");
  const coverageValue = `${yearStart.format("MMM YYYY").toUpperCase()} - ${periodEnd
    .format("MMM YYYY")
    .toUpperCase()}${isPartial ? "  (PARTIAL PERIOD)" : ""}`;

  const { deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    year
  );

  const rows = [
    { label: "Death discharge", values: deathDischarge, color: NAVY },
    { label: "Revocation", values: revocation, color: AMBER },
    { label: "Live discharge", values: liveDischarge, color: ACCENT },
    { label: "Transfer", values: transfer, color: SLATE },
  ];

  const totalDeath = sumArray(deathDischarge);
  const totalRevocation = sumArray(revocation);
  const totalLive = sumArray(liveDischarge);
  const totalTransfer = sumArray(transfer);
  const totalEvents = totalDeath + totalRevocation + totalLive + totalTransfer;
  const activeCensus = (patientsData || []).filter((p) => !p.eoc).length;

  const register = buildRegister(patientsData, year);

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerSubTitle}>
                DISCHARGE, TRANSFER &amp; REVOCATION CENSUS
              </Text>
              <Text style={styles.headerSubLine}>
                ACHC SURVEY / 12-MONTH DISPOSITION REPORT
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>
              CONFIDENTIAL PATIENT INFORMATION
            </Text>
            <Text style={styles.headerRightValue}>CCN: {ccn || "____________"}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.coverageBand}>
            <View>
              <Text style={styles.coverageLabel}>SOURCE REPORT COVERAGE</Text>
              <Text style={styles.coverageValue}>{coverageValue}</Text>
            </View>
            <View>
              <Text style={styles.coverageLabel}>ACHC REQUIRED PERIOD</Text>
              <Text style={styles.coverageValue}>
                Rolling 12 months preceding survey
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderLeftColor: NAVY }]}>
              <Text style={styles.summaryLabel}>DEATH DISCHARGES</Text>
              <Text style={[styles.summaryValue, { color: NAVY }]}>{totalDeath}</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: AMBER }]}>
              <Text style={styles.summaryLabel}>REVOCATIONS</Text>
              <Text style={[styles.summaryValue, { color: AMBER }]}>{totalRevocation}</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: ACCENT }]}>
              <Text style={styles.summaryLabel}>LIVE DISCHARGES</Text>
              <Text style={[styles.summaryValue, { color: ACCENT }]}>{totalLive}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast, { borderLeftColor: SLATE }]}>
              <Text style={styles.summaryLabel}>TRANSFERS</Text>
              <Text style={[styles.summaryValue, { color: SLATE }]}>{totalTransfer}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow} fixed>
              <Text style={[styles.th, styles.colCategory]}>PATIENT DISPOSITION</Text>
              {MONTHS.map((m) => (
                <Text key={m} style={[styles.th, styles.colMonth, { textAlign: "center" }]}>
                  {m}
                </Text>
              ))}
              <Text style={[styles.th, styles.colTotal, { textAlign: "center" }]}>Total</Text>
            </View>

            {rows.map((row) => (
              <View key={row.label} style={styles.tableRow}>
                <Text style={[styles.categoryCell, styles.colCategory]}>{row.label}</Text>
                {row.values.map((val, idx) => (
                  <Text
                    key={idx}
                    style={[styles.td, styles.colMonth, { textAlign: "center" }]}
                  >
                    {val}
                  </Text>
                ))}
                <Text style={[styles.totalCell, styles.colTotal, { textAlign: "center" }]}>
                  {sumArray(row.values)}
                </Text>
              </View>
            ))}

            <View style={styles.totalsRow}>
              <View>
                <Text style={styles.totalsLabel}>
                  TOTAL DISPOSITION EVENTS IN SOURCE PERIOD
                </Text>
                <Text style={styles.totalsValue}>
                  {totalEvents} events ({totalDeath} deaths + {totalRevocation} revocations +{" "}
                  {totalLive} live discharges + {totalTransfer} transfers)
                </Text>
              </View>
              <View>
                <Text style={styles.activeCensusLabel}>ACTIVE CENSUS</Text>
                <Text style={styles.activeCensusValue}>{activeCensus} | reference only</Text>
              </View>
            </View>
          </View>

          <View style={styles.notesBlock}>
            {isPartial && (
              <Text style={styles.noteText}>
                Important: this source covers {yearStart.format("MMM")}-{periodEnd.format("MMM YYYY")},
                not a complete rolling 12-month period.
              </Text>
            )}
            <Text style={styles.noteText}>
              Monthly counts summarize events; maintain a patient-level discharge/transfer/revocation
              roster for survey review.
            </Text>
            <Text style={styles.noteText}>
              The {totalEvents} events are not necessarily {totalEvents} unique patients. Verify
              individual records and reporting dates.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerSubTitle}>
                PATIENT-LEVEL DISPOSITION REGISTER
              </Text>
              <Text style={styles.headerSubLine}>
                ACHC SURVEY / 12-MONTH DISPOSITION REPORT
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>
              CONFIDENTIAL PATIENT INFORMATION
            </Text>
            <Text style={styles.headerRightValue}>CCN: {ccn || "____________"}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.coverageBand}>
            <View>
              <Text style={styles.coverageLabel}>REPORTING PERIOD</Text>
              <Text style={styles.coverageValue}>
                {yearStart.format("MM/DD/YYYY")} - {periodEnd.format("MM/DD/YYYY")}
              </Text>
            </View>
            <View>
              <Text style={styles.coverageLabel}>MEDICARE PROVIDER NUMBER (CCN)</Text>
              <Text style={styles.coverageValue}>{ccn || "____________"}</Text>
            </View>
          </View>

          <View style={styles.regTable}>
            <View style={styles.regHeaderRow} fixed>
              <Text style={[styles.regTh, styles.colPatient]}>PATIENT / ID</Text>
              <Text style={[styles.regTh, styles.colSoc]}>START OF CARE</Text>
              <Text style={[styles.regTh, styles.colDispDate]}>DISPOSITION DATE</Text>
              <Text style={[styles.regTh, styles.colDispType]}>DISPOSITION TYPE</Text>
              <Text style={[styles.regTh, styles.colReason]}>REASON / DESTINATION</Text>
            </View>

            {register.length === 0 ? (
              <Text style={styles.emptyText}>
                No disposition events found for this period.
              </Text>
            ) : (
              register.map((r, idx) => (
                <View
                  key={`${r.patientCd}-${idx}`}
                  style={[styles.regRow, idx % 2 === 1 ? styles.regRowAlt : {}]}
                  wrap={false}
                >
                  <Text style={[styles.regTdBold, styles.colPatient]}>{r.patientCd}</Text>
                  <Text style={[styles.regTd, styles.colSoc]}>
                    {r.soc ? moment(r.soc).format("MM/DD/YYYY") : "N/A"}
                  </Text>
                  <Text style={[styles.regTd, styles.colDispDate]}>
                    {r.eoc ? moment(r.eoc).format("MM/DD/YYYY") : "N/A"}
                  </Text>
                  <Text style={[styles.regTd, styles.colDispType]}>{r.type}</Text>
                  <Text style={[styles.regTd, styles.colReason]}>{r.reason || "N/A"}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.includeBox}>
            <View style={styles.includeRow}>
              <Text style={styles.includeLabel}>INCLUDE:</Text>
              <Text style={styles.includeText}>
                Death discharge, live discharge, revocation, and transfer records within the
                selected 12 months.
              </Text>
            </View>
            <View style={styles.includeRow}>
              <Text style={styles.includeLabel}>EXCLUDE:</Text>
              <Text style={styles.includeText}>
                Patients still active without a discharge/transfer/revocation event.
              </Text>
            </View>
          </View>

          <View style={styles.signatureFooter}>
            <Text style={styles.signatureFooterText}>
              Prepared by: {preparedBy || "_______________________"}
            </Text>
            <Text style={styles.signatureFooterText}>
              Reviewed by: {reviewedBy || "_______________________"}
            </Text>
            <Text style={styles.signatureFooterText}>
              Generated: {moment().format("MM/DD/YYYY hh:mm A")}
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export default PatientDispositionCensusDocument;

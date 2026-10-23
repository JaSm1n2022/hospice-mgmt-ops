import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const DARKGREEN = "#163B2A";
const BRIGHTGREEN = "#23854D";
const MINT = "#EDF6EF";
const GOLD = "#D6BC62";
const MUTED = "#647469";
const LIGHTBG = "#F4F6F4";
const RULE = "#D8E2DA";
const INK = "#1C2B22";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 36,
    paddingBottom: 56,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: DARKGREEN,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 12,
  },
  headerAvatarImage: {
    width: 36,
    height: 36,
    objectFit: "cover",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerTitleSub: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#CFE3D6",
    letterSpacing: 0.3,
  },
  headerSubLine: {
    fontSize: 8,
    color: "#CFE3D6",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  headerAccentLine: {
    fontSize: 7,
    color: GOLD,
    marginTop: 3,
    letterSpacing: 0.5,
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
    fontSize: 9,
    color: GOLD,
    fontWeight: "bold",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  titleRow: {
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: DARKGREEN,
    textAlign: "center",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: MUTED,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  goldRule: {
    height: 2,
    backgroundColor: GOLD,
    width: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: RULE,
    backgroundColor: MINT,
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  summaryBoxDark: {
    flex: 1,
    backgroundColor: DARKGREEN,
    borderRadius: 4,
    padding: 10,
    marginRight: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: {
    fontSize: 7,
    color: MUTED,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  summaryLabelDark: {
    fontSize: 7,
    color: "#CFE3D6",
    letterSpacing: 0.4,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 11,
    color: INK,
    fontWeight: "bold",
  },
  summaryValueDark: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableSectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: DARKGREEN,
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  monthChip: {
    flex: 1,
    backgroundColor: DARKGREEN,
    borderRadius: 4,
    paddingVertical: 6,
    marginRight: 3,
    alignItems: "center",
  },
  totalChipHeader: {
    flex: 1.15,
    backgroundColor: BRIGHTGREEN,
    borderRadius: 4,
    paddingVertical: 6,
    marginRight: 0,
    alignItems: "center",
  },
  monthChipText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  valueChip: {
    flex: 1,
    backgroundColor: MINT,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    paddingVertical: 8,
    marginRight: 3,
    alignItems: "center",
  },
  valueChipDimmed: {
    flex: 1,
    backgroundColor: LIGHTBG,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    paddingVertical: 8,
    marginRight: 3,
    alignItems: "center",
  },
  totalChipValue: {
    flex: 1.15,
    backgroundColor: DARKGREEN,
    borderRadius: 4,
    paddingVertical: 8,
    marginRight: 0,
    alignItems: "center",
  },
  valueChipText: {
    fontSize: 10,
    fontWeight: "bold",
    color: DARKGREEN,
  },
  valueChipTextDimmed: {
    fontSize: 10,
    fontWeight: "bold",
    color: MUTED,
  },
  totalChipValueText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  table: {
    marginBottom: 18,
  },
  methodologyBox: {
    backgroundColor: LIGHTBG,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  methodologyTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: DARKGREEN,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  methodologyText: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  methodologyStat: {
    fontSize: 8,
    fontWeight: "bold",
    color: INK,
  },
  footnote: {
    fontSize: 7,
    color: MUTED,
    fontStyle: "italic",
    marginBottom: 3,
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 22,
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
    left: 36,
    right: 36,
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

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildUnduplicatedAdmissions = (patientsData, year) => {
  const admissionsByMonth = new Array(12).fill(0);
  let totalAdmissions = 0;
  let patientsWithMultipleAdmissions = 0;

  (patientsData || []).forEach((patient) => {
    if (patient.insurance !== "Traditional Medicare") return;
    if (!patient.soc) return;
    const socDate = moment(patient.soc);
    if (socDate.year() !== year) return;

    admissionsByMonth[socDate.month()] += 1;
    totalAdmissions += 1;

    const noOfAdmission =
      patient.no_of_admission === null || patient.no_of_admission === undefined
        ? 1
        : patient.no_of_admission;

    if (noOfAdmission > 1) {
      patientsWithMultipleAdmissions += 1;
    }
  });

  return { admissionsByMonth, totalAdmissions, patientsWithMultipleAdmissions };
};

const UnduplicatedAdmissionsDocument = ({
  patientsData,
  logoBase64,
  selectedYear,
  ccn,
  preparedBy,
  reviewedBy,
  isFinal,
}) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);
  const isPartialYear = periodEnd.isBefore(yearEnd, "day");
  const partialMonthIndex = isPartialYear ? periodEnd.month() : -1;
  const coverageLabel = `${yearStart.format("MMM D, YYYY")} – ${periodEnd.format("MMM D, YYYY")}`;

  const { admissionsByMonth, totalAdmissions, patientsWithMultipleAdmissions } =
    buildUnduplicatedAdmissions(patientsData, year);

  const statusLabel = isFinal ? "FINAL" : "DRAFT";
  const footerStatusText = isFinal
    ? "Counts computed from patient-level SOC records • Reviewed and signed by QAPI"
    : "Internal survey-preparation draft • Source figures not independently verified";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerBand}>
          <View style={styles.headerGoldBar} />
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} style={styles.headerAvatarImage} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                HALOES TOUCH <Text style={styles.headerTitleSub}>HOSPICE INC.</Text>
              </Text>
              <Text style={styles.headerSubLine}>QUALITY &amp; COMPLIANCE REPORTING</Text>
              <Text style={styles.headerAccentLine}>ACHC SURVEY PREPARATION</Text>
            </View>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>SURVEY PREP</Text>
            <Text style={styles.headerBadgeStatus}>{statusLabel} {year}</Text>
          </View>
        </View>

        <Text style={styles.title}>Unduplicated Hospice Admissions</Text>
        <Text style={styles.subtitle}>
          PER MEDICARE PROVIDER NUMBER  |  MONTHLY SUMMARY  |  {statusLabel} {year}
        </Text>
        <View style={styles.goldRule} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>REPORTING PERIOD</Text>
            <Text style={styles.summaryValue}>
              {coverageLabel}
              {isPartialYear ? " *" : ""}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>MEDICARE PROVIDER NO. (CCN)</Text>
            <Text style={styles.summaryValue}>{ccn || "—"}</Text>
          </View>
          <View style={styles.summaryBoxDark}>
            <Text style={styles.summaryLabelDark}>REPORTED ADMISSIONS</Text>
            <Text style={styles.summaryValueDark}>{totalAdmissions}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <Text style={styles.tableSectionTitle}>MONTHLY ADMISSION BREAKDOWN</Text>

          <View style={styles.chipRow}>
            {MONTHS.map((m, idx) => (
              <View key={m} style={styles.monthChip}>
                <Text style={styles.monthChipText}>
                  {m}{idx === partialMonthIndex ? "*" : ""}
                </Text>
              </View>
            ))}
            <View style={styles.totalChipHeader}>
              <Text style={styles.monthChipText}>TOTAL</Text>
            </View>
          </View>

          <View style={styles.chipRow}>
            {admissionsByMonth.map((val, idx) => {
              const isFuture = idx > periodEnd.month() && year === today.year();
              return (
                <View key={idx} style={isFuture ? styles.valueChipDimmed : styles.valueChip}>
                  <Text style={isFuture ? styles.valueChipTextDimmed : styles.valueChipText}>
                    {isFuture ? "—" : val}
                  </Text>
                </View>
              );
            })}
            <View style={styles.totalChipValue}>
              <Text style={styles.totalChipValueText}>{sumArray(admissionsByMonth)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.methodologyBox}>
          <Text style={styles.methodologyTitle}>COUNTING METHODOLOGY</Text>
          <Text style={styles.methodologyText}>
            Each client is counted once per Medicare provider number within the
            selected reporting period, in the month of their start of care (SOC).
            The admission number recorded on the client record (no_of_admission)
            is not used as a multiplier — every qualifying SOC record contributes
            exactly one admission to the total above, regardless of its stored
            admission number. Confirm the total against patient-level SOC records
            and unique patient identifiers before submission.
          </Text>
          <Text style={styles.methodologyStat}>
            Patients with more than one admission in this period: {patientsWithMultipleAdmissions}
          </Text>
        </View>

        {isPartialYear && (
          <Text style={styles.footnote}>
            *Partial period: data included through {periodEnd.format("MMMM D, YYYY")}.
          </Text>
        )}
        {!isFinal && (
          <Text style={styles.footnote}>
            Regenerate for the exact 12-month ACHC survey reporting period before
            final submission.
          </Text>
        )}

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>{preparedBy || ""}</Text>
            </View>
            <Text style={styles.signatureLabel}>PREPARED BY</Text>
          </View>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureValue}>
                {moment().format("MM/DD/YYYY")}
              </Text>
            </View>
            <Text style={styles.signatureLabel}>DATE</Text>
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
            {statusLabel} — {footerStatusText}
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

export default UnduplicatedAdmissionsDocument;

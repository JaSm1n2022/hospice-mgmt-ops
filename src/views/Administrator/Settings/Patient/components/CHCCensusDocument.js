import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const NAVY = "#153348";
const NAVY_SOFT = "#9FB0C3";
const ACCENT = "#26935B";
const TITLE_MINT = "#8EDFB5";
const MUTED = "#64748B";
const RULE = "#D9DEE6";
const INK = "#1C2430";
const LIGHTBG = "#F4F6F8";
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
  headerEyebrow: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: TITLE_MINT,
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerRightLabel: {
    fontSize: 8,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
  content: {
    paddingHorizontal: 28,
  },
  infoBand: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 14,
  },
  infoText: {
    fontSize: 9,
    color: MUTED,
  },
  infoTextRight: {
    fontSize: 9,
    color: MUTED,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHTBG,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  summaryCardAccent: {
    backgroundColor: TOTALS_BG,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: NAVY,
    marginRight: 12,
  },
  summaryNumberAccent: {
    color: TOTALS_TEXT,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 7,
    color: MUTED,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  monthRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  monthCard: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 5,
    overflow: "hidden",
  },
  monthCardLast: {
    marginRight: 0,
  },
  monthHeader: {
    backgroundColor: NAVY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  monthHeaderName: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  monthHeaderCount: {
    fontSize: 6.5,
    color: "#FFFFFF",
  },
  monthBody: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    minHeight: 48,
  },
  monthPatientText: {
    fontSize: 7.5,
    color: INK,
    marginBottom: 2,
  },
  monthEmptyText: {
    fontSize: 7,
    color: MUTED,
    fontStyle: "italic",
  },
  countingRuleBox: {
    backgroundColor: TOTALS_BG,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  countingRuleTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  countingRuleText: {
    fontSize: 7.5,
    color: INK,
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerSignature: {
    fontSize: 8.5,
    color: MUTED,
  },
  footerPage: {
    fontSize: 7,
    color: MUTED,
  },
});

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const buildCHCMonthlyRegister = (patientsData, year) => {
  const monthMaps = Array.from({ length: 12 }, () => new Map());
  const uniquePatientKeys = new Set();

  (patientsData || []).forEach((patient) => {
    const hasEoc = !!patient.eoc;
    const eocInYear = hasEoc && moment(patient.eoc).year() === year;
    if (hasEoc && !eocInYear) return;

    const chcDates = patient.continous_care_dates;
    if (!chcDates || chcDates.length === 0) return;

    const key = patient.patientCd || `${patient.fn || ""}-${patient.ln || ""}`;
    const name =
      `${patient.fn || ""} ${patient.ln || ""}`.trim() ||
      patient.patientCd ||
      "Unknown Patient";

    let patientHasChcInYear = false;

    chcDates.forEach((rawDate) => {
      const date = moment(rawDate);
      if (!date.isValid() || date.year() !== year) return;
      const monthIdx = date.month();
      if (!monthMaps[monthIdx].has(key)) {
        monthMaps[monthIdx].set(key, name);
      }
      patientHasChcInYear = true;
    });

    if (patientHasChcInYear) {
      uniquePatientKeys.add(key);
    }
  });

  const monthPatients = monthMaps.map((map) =>
    Array.from(map.values()).sort((a, b) => a.localeCompare(b))
  );

  const monthsWithChc = monthPatients.filter((names) => names.length > 0).length;
  const patientMonthEntries = monthPatients.reduce((sum, names) => sum + names.length, 0);

  return {
    monthPatients,
    uniqueChcPatients: uniquePatientKeys.size,
    monthsWithChc,
    patientMonthEntries,
  };
};

const MonthCard = ({ monthIndex, names, isLast }) => (
  <View style={[styles.monthCard, isLast && styles.monthCardLast]}>
    <View style={styles.monthHeader}>
      <Text style={styles.monthHeaderName}>
        {MONTH_NAMES[monthIndex].toUpperCase()}
      </Text>
      <Text style={styles.monthHeaderCount}>
        {names.length} patient{names.length === 1 ? "" : "s"}
      </Text>
    </View>
    <View style={styles.monthBody}>
      {names.length === 0 ? (
        <Text style={styles.monthEmptyText}>No CHC patients</Text>
      ) : (
        names.map((name, idx) => (
          <Text key={idx} style={styles.monthPatientText}>
            {name}
          </Text>
        ))
      )}
    </View>
  </View>
);

const CHCCensusDocument = ({ patientsData, selectedYear, ccn, preparedBy, reviewedBy }) => {
  const year = parseInt(selectedYear, 10);
  const { monthPatients, uniqueChcPatients, monthsWithChc, patientMonthEntries } =
    buildCHCMonthlyRegister(patientsData, year);

  const reportDate = moment().format("MM/DD/YYYY");

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.headerEyebrow}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerTitle}>
                Continuous Home Care | Monthly Patient Register
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>
              ACHC SURVEY &nbsp;/&nbsp; CHC LEVEL OF CARE
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoBand}>
            <Text style={styles.infoText}>
              REPORTING PERIOD: January 1 - December 31, {year}
            </Text>
            <Text style={styles.infoTextRight}>
              MEDICARE CCN: {ccn || "____________________"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryCardAccent]}>
              <Text style={[styles.summaryNumber, styles.summaryNumberAccent]}>
                {uniqueChcPatients}
              </Text>
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>UNIQUE CHC PATIENTS</Text>
                <Text style={styles.summarySub}>
                  Count each patient once across all months
                </Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{monthsWithChc}</Text>
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>MONTHS WITH CHC</Text>
                <Text style={styles.summarySub}>
                  Months containing at least one CHC patient
                </Text>
              </View>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <Text style={styles.summaryNumber}>{patientMonthEntries}</Text>
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>PATIENT-MONTH ENTRIES</Text>
                <Text style={styles.summarySub}>
                  A patient may appear in multiple months
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.monthRow}>
            {[0, 1, 2, 3, 4, 5].map((m) => (
              <MonthCard
                key={m}
                monthIndex={m}
                names={monthPatients[m]}
                isLast={m === 5}
              />
            ))}
          </View>
          <View style={styles.monthRow}>
            {[6, 7, 8, 9, 10, 11].map((m) => (
              <MonthCard
                key={m}
                monthIndex={m}
                names={monthPatients[m]}
                isLast={m === 11}
              />
            ))}
          </View>

          <View style={styles.countingRuleBox}>
            <Text style={styles.countingRuleTitle}>
              COUNTING RULE &nbsp;|&nbsp; UNIQUE PATIENTS
            </Text>
            <Text style={styles.countingRuleText}>
              Monthly cells list each patient who received CHC during that month. A
              patient may appear in more than one month.
            </Text>
            <Text style={styles.countingRuleText}>
              The unique total counts each patient only once across the full
              reporting period, regardless of repeated months or CHC episodes.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerSignature}>
            Prepared by: {preparedBy || "_______________________"}
            {"    "}Reviewed by: {reviewedBy || "_______________________"}
            {"    "}Date: {reportDate}
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

export default CHCCensusDocument;

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Line,
  Polyline,
  Circle,
} from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const NAVY = "#153348";
const NAVY_SOFT = "#9FB0C3";
const ACCENT = "#26935B";
const AMBER = "#D49A38";
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  headerSubLine: {
    fontSize: 8.5,
    color: NAVY_SOFT,
    marginTop: 4,
    letterSpacing: 0.4,
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
  accentBar: {
    height: 4,
    backgroundColor: ACCENT,
  },
  content: {
    paddingHorizontal: 28,
  },
  chartPageContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  infoBand: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 16,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: NAVY,
  },
  infoValueAmber: {
    fontSize: 11,
    fontWeight: "bold",
    color: AMBER,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: LIGHTBG,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
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
    fontSize: 19,
    fontWeight: "bold",
    color: NAVY,
  },
  summarySub: {
    fontSize: 7,
    color: MUTED,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  sectionHeaderNote: {
    fontSize: 7.5,
    color: MUTED,
  },
  chartBox: {
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 16,
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
    textAlign: "center",
  },
  thCategory: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
    paddingVertical: 7,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
    backgroundColor: LIGHTBG,
  },
  tableRowHighlight: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
    backgroundColor: TOTALS_BG,
  },
  categoryCell: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  categoryCellAccent: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  td: {
    fontSize: 8.5,
    color: NAVY,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  tdAccent: {
    fontSize: 9,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  totalCell: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  colCategory: { width: "16%" },
  colMonth: { width: "6.46%" },
  colTotal: { width: "6.5%" },
  notesBlock: {
    backgroundColor: LIGHTBG,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  notesTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 7.5,
    color: MUTED,
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

const matchesReason = (reason, keywords) => {
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const buildMonthBuckets = (periodStart, periodEnd) => {
  const buckets = [];
  const cursor = moment(periodStart).startOf("month");
  const last = moment(periodEnd).startOf("month");

  while (cursor.isSameOrBefore(last, "month")) {
    buckets.push({
      year: cursor.year(),
      month: cursor.month(),
      label: cursor.format("MMM"),
      fullLabel: cursor.format("MMM YY"),
    });
    cursor.add(1, "month");
  }

  return buckets;
};

const buildMonthlyCounts = (patientsData, buckets, periodStart, periodEnd) => {
  const n = buckets.length;
  const soc = new Array(n).fill(0);
  const deathDischarge = new Array(n).fill(0);
  const revocation = new Array(n).fill(0);
  const liveDischarge = new Array(n).fill(0);
  const transfer = new Array(n).fill(0);
  const bucketIndexByKey = new Map(
    buckets.map((b, idx) => [`${b.year}-${b.month}`, idx])
  );

  (patientsData || []).forEach((patient) => {
    if (patient.soc) {
      const socDate = moment(patient.soc);
      if (
        !socDate.isBefore(periodStart, "day") &&
        !socDate.isAfter(periodEnd, "day")
      ) {
        const idx = bucketIndexByKey.get(`${socDate.year()}-${socDate.month()}`);
        if (idx !== undefined) soc[idx]++;
      }
    }

    if (patient.eoc) {
      const eocDate = moment(patient.eoc);
      if (
        !eocDate.isBefore(periodStart, "day") &&
        !eocDate.isAfter(periodEnd, "day")
      ) {
        const idx = bucketIndexByKey.get(`${eocDate.year()}-${eocDate.month()}`);
        if (idx === undefined) return;
        const reason = patient.eoc_discharge;

        if (matchesReason(reason, ["death"])) {
          deathDischarge[idx]++;
        } else if (matchesReason(reason, ["revocation"])) {
          revocation[idx]++;
        } else if (matchesReason(reason, ["transfer"])) {
          transfer[idx]++;
        } else if (
          matchesReason(reason, [
            "extended prognosis",
            "travel outside of service area",
            "discharge for cause",
          ])
        ) {
          liveDischarge[idx]++;
        }
      }
    }
  });

  return { soc, deathDischarge, revocation, liveDischarge, transfer };
};

const computePatientDaysByMonth = (patientsData, buckets, periodStart, periodEndRaw) => {
  const n = buckets.length;
  const byMonth = new Array(n).fill(0);

  buckets.forEach((b, idx) => {
    const bucketMonthStart = moment([b.year, b.month, 1]).startOf("day");
    const bucketMonthEnd = moment(bucketMonthStart).endOf("month");
    const rangeStart = moment.max(bucketMonthStart, periodStart);
    const rangeEnd = moment.min(bucketMonthEnd, periodEndRaw);

    if (rangeEnd.isBefore(rangeStart, "day")) {
      byMonth[idx] = 0;
      return;
    }

    let total = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      const start = moment.max(soc, rangeStart);
      const end = moment.min(eoc || rangeEnd, rangeEnd);

      const days = end.diff(start, "days") + 1;
      if (days > 0) total += days;
    });

    byMonth[idx] = total;
  });

  return byMonth;
};

const buildMedicareCapNewBeneficiaries = (patientsData, buckets, periodStart, periodEnd) => {
  const n = buckets.length;
  const counts = new Array(n).fill(0);
  const bucketIndexByKey = new Map(
    buckets.map((b, idx) => [`${b.year}-${b.month}`, idx])
  );

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    if (patient.insurance !== "Traditional Medicare") return;

    const admittedBenefit = parseInt(patient.admitted_benefits_period || 1);
    if (admittedBenefit !== 1) return;

    const socDate = moment(patient.soc);
    if (
      socDate.isBefore(periodStart, "day") ||
      socDate.isAfter(periodEnd, "day")
    ) {
      return;
    }

    const idx = bucketIndexByKey.get(`${socDate.year()}-${socDate.month()}`);
    if (idx !== undefined) counts[idx]++;
  });

  return counts;
};

const computeADC = (patientsData, periodStart, periodEndRaw) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(periodEndRaw, today);

  if (periodEnd.isBefore(periodStart, "day")) {
    return { adc: 0, isPartialPeriod: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(periodStart, "days") + 1;
  let totalPatientDays = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(periodEndRaw)) return;
    if (eoc && eoc.isBefore(periodStart)) return;

    const effStart = moment.max(soc, periodStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isPartialPeriod = periodEnd.isBefore(periodEndRaw, "day");

  return { adc, isPartialPeriod, periodEnd };
};

const computeALOS = (patientsData, buckets, periodStart, periodEndRaw) => {
  const n = buckets.length;
  const sumByMonth = new Array(n).fill(0);
  const countByMonth = new Array(n).fill(0);
  const avgByMonth = new Array(n).fill(0);
  const bucketIndexByKey = new Map(
    buckets.map((b, idx) => [`${b.year}-${b.month}`, idx])
  );

  let overallSum = 0;
  let overallCount = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc || !patient.eoc) return;
    const eocDate = moment(patient.eoc);
    if (
      eocDate.isBefore(periodStart, "day") ||
      eocDate.isAfter(periodEndRaw, "day")
    ) {
      return;
    }

    const socDate = moment(patient.soc);
    const los = eocDate.diff(socDate, "days");
    if (los < 0) return;

    const idx = bucketIndexByKey.get(`${eocDate.year()}-${eocDate.month()}`);
    if (idx === undefined) return;

    sumByMonth[idx] += los;
    countByMonth[idx] += 1;
    overallSum += los;
    overallCount += 1;
  });

  for (let i = 0; i < n; i++) {
    avgByMonth[i] = countByMonth[i] > 0 ? sumByMonth[i] / countByMonth[i] : 0;
  }

  const overallAvg = overallCount > 0 ? overallSum / overallCount : 0;

  return { avgByMonth, overallAvg, overallCount };
};

const computeMonthlyADC = (patientsData, buckets, periodStart, periodEndRaw) => {
  const today = moment().endOf("day");
  const adcByMonth = new Array(buckets.length).fill(0);

  buckets.forEach((b, idx) => {
    const bucketMonthStart = moment([b.year, b.month, 1]).startOf("day");
    const bucketMonthEnd = moment(bucketMonthStart).endOf("month");
    const rangeStart = moment.max(bucketMonthStart, periodStart);
    const rangeEnd = moment.min(bucketMonthEnd, periodEndRaw, today);

    if (rangeEnd.isBefore(rangeStart, "day")) {
      adcByMonth[idx] = 0;
      return;
    }

    const daysInPeriod = rangeEnd.diff(rangeStart, "days") + 1;
    let totalPatientDays = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      if (soc.isAfter(rangeEnd)) return;
      if (eoc && eoc.isBefore(rangeStart)) return;

      const effStart = moment.max(soc, rangeStart);
      const effEnd = eoc ? moment.min(eoc, rangeEnd) : rangeEnd;

      if (effEnd.isSameOrAfter(effStart, "day")) {
        totalPatientDays += effEnd.diff(effStart, "days") + 1;
      }
    });

    adcByMonth[idx] = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  });

  return adcByMonth;
};

const buildDispositionSummary = (totalDeath, totalRevocation, totalLive, totalTransfer) => {
  const parts = [];
  if (totalDeath > 0) parts.push(`${totalDeath} death${totalDeath === 1 ? "" : "s"}`);
  if (totalRevocation > 0) parts.push(`${totalRevocation} revocation${totalRevocation === 1 ? "" : "s"}`);
  if (totalLive > 0) parts.push(`${totalLive} live`);
  if (totalTransfer > 0) parts.push(`${totalTransfer} transfer${totalTransfer === 1 ? "" : "s"}`);
  return parts.length > 0 ? parts.join(" \u00B7 ") : "No dispositions recorded";
};

const CHART_W = 700;
const CHART_H = 190;
const PLOT_LEFT = 32;
const PLOT_RIGHT = CHART_W - 14;
const PLOT_TOP = 26;
const PLOT_BOTTOM = CHART_H - 28;

const buildNiceMax = (max) => {
  if (max <= 0) return 5;
  return Math.ceil(max / 5) * 5;
};

const CensusTrendChart = ({ values, buckets, numBucketsToShow, spansMultipleYears }) => {
  const availableValues = values.slice(0, numBucketsToShow);
  const niceMax = buildNiceMax(Math.max(...availableValues, 0));
  const plotWidth = PLOT_RIGHT - PLOT_LEFT;
  const plotHeight = PLOT_BOTTOM - PLOT_TOP;
  const numPoints = buckets.length || 1;
  const xDenom = Math.max(numPoints - 1, 1);

  const xAt = (i) => PLOT_LEFT + (i * plotWidth) / xDenom;
  const yAt = (v) => PLOT_BOTTOM - (v / niceMax) * plotHeight;

  const gridSteps = niceMax / 5;
  const gridValues = [];
  for (let i = 0; i <= gridSteps; i++) {
    gridValues.push(i * 5);
  }

  const points = availableValues.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

  return (
    <Svg width="100%" height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
      {gridValues.map((gv) => (
        <React.Fragment key={gv}>
          <Line
            x1={PLOT_LEFT}
            y1={yAt(gv)}
            x2={PLOT_RIGHT}
            y2={yAt(gv)}
            stroke={RULE}
            strokeWidth={0.75}
          />
          <Text
            x={PLOT_LEFT - 8}
            y={yAt(gv)}
            textAnchor="end"
            dominantBaseline="middle"
            fill={MUTED}
            fontSize={7}
          >
            {gv}
          </Text>
        </React.Fragment>
      ))}

      {buckets.map((b, i) => (
        <Text
          key={`${b.year}-${b.month}`}
          x={xAt(i)}
          y={PLOT_BOTTOM + 14}
          textAnchor="middle"
          fill={i < numBucketsToShow ? NAVY : NAVY_SOFT}
          fontSize={7}
          fontWeight={i < numBucketsToShow ? "bold" : "normal"}
        >
          {(spansMultipleYears ? b.fullLabel : b.label).toUpperCase()}
        </Text>
      ))}

      {availableValues.length > 1 && (
        <Polyline
          points={points}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {availableValues.map((v, i) => (
        <Circle key={i} cx={xAt(i)} cy={yAt(v)} r={3} fill={ACCENT} />
      ))}
    </Svg>
  );
};

const HospiceCensusUtilizationDocument = ({
  patientsData,
  periodFrom,
  periodTo,
  ccn,
  preparedBy,
  reviewedBy,
}) => {
  const periodStart = moment(periodFrom).startOf("day");
  const periodEndRaw = moment(periodTo).endOf("day");
  const buckets = buildMonthBuckets(periodStart, periodEndRaw);
  const spansMultipleYears =
    buckets.length > 0 && buckets[0].year !== buckets[buckets.length - 1].year;

  const { soc, deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    buckets,
    periodStart,
    periodEndRaw
  );
  const { adc, isPartialPeriod, periodEnd } = computeADC(patientsData, periodStart, periodEndRaw);
  const adcByMonth = computeMonthlyADC(patientsData, buckets, periodStart, periodEndRaw);
  const { avgByMonth: alosByMonth, overallAvg: alos, overallCount: totalDischarges } = computeALOS(
    patientsData,
    buckets,
    periodStart,
    periodEndRaw
  );
  const patientDaysByMonth = computePatientDaysByMonth(
    patientsData,
    buckets,
    periodStart,
    periodEndRaw
  );
  const totalPatientDays = sumArray(patientDaysByMonth);
  const medicareCapNewBeneficiaries = buildMedicareCapNewBeneficiaries(
    patientsData,
    buckets,
    periodStart,
    periodEndRaw
  );
  const totalMedicareCapNewBeneficiaries = sumArray(medicareCapNewBeneficiaries);

  const numBucketsToShow = buckets.filter(
    (b) =>
      b.year < periodEnd.year() ||
      (b.year === periodEnd.year() && b.month <= periodEnd.month())
  ).length;

  const totalAdmissions = sumArray(soc);
  const totalDeath = sumArray(deathDischarge);
  const totalRevocation = sumArray(revocation);
  const totalLive = sumArray(liveDischarge);
  const totalTransfer = sumArray(transfer);
  const totalDispositions = totalDeath + totalRevocation + totalLive + totalTransfer;

  const activePatients = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const socDate = moment(patient.soc);
    return (
      !socDate.isBefore(periodStart, "day") &&
      !socDate.isAfter(periodEndRaw, "day") &&
      !patient.eoc
    );
  }).length;

  const coverageLabel = `${periodStart.format("MMM D, YYYY")} \u2013 ${periodEndRaw.format("MMM D, YYYY")}`;
  const dispositionSummary = buildDispositionSummary(
    totalDeath,
    totalRevocation,
    totalLive,
    totalTransfer
  );

  const rows = [
    { label: "Admissions", values: soc, total: totalAdmissions },
    {
      label: "Medicare cap: new beneficiaries",
      values: medicareCapNewBeneficiaries,
      total: totalMedicareCapNewBeneficiaries,
    },
    { label: "Death discharges", values: deathDischarge, total: totalDeath },
    { label: "Revocations", values: revocation, total: totalRevocation },
    { label: "Live discharges", values: liveDischarge, total: totalLive },
    { label: "Transfers", values: transfer, total: totalTransfer },
    {
      label: "Average length of stay (days)",
      values: alosByMonth,
      total: alos,
      isDecimal: true,
    },
    { label: "Patient days", values: patientDaysByMonth, total: totalPatientDays },
    {
      label: "Average daily census",
      values: adcByMonth,
      total: adc,
      isDecimal: true,
      highlight: true,
    },
  ];

  const ReportHeader = () => (
    <>
      <View style={styles.headerBand}>
        <View style={styles.headerLeftRow}>
          <View style={styles.headerAvatar}>
            <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
          </View>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEyebrow}>HALOES TOUCH HOSPICE INC.</Text>
            <Text style={styles.headerTitle}>
              Hospice Census &amp; Utilization Report
            </Text>
            <Text style={styles.headerSubLine}>
              Monthly Admissions &middot; Patient Dispositions &middot; Average Daily Census
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerRightLabel}>ACHC SURVEY SUPPORT</Text>
          <Text style={styles.headerRightValue}>CCN: {ccn || "____________"}</Text>
        </View>
      </View>
      <View style={styles.accentBar} />
    </>
  );

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader />

        <View style={styles.content}>
          <View style={styles.infoBand}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>REPORTING PERIOD</Text>
              <Text style={styles.infoValue}>{coverageLabel}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>REPORT TYPE</Text>
              <Text style={styles.infoValue}>
                {isPartialPeriod ? "Period-to-Date" : "Full Period"}
                {isPartialPeriod ? ` \u00B7 ${periodEnd.format("MMMM D")} partial` : ""}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DATA STATUS</Text>
              <Text style={styles.infoValueAmber}>
                Computed from uploaded census data
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>ADMISSIONS</Text>
              <Text style={styles.summaryValue}>{totalAdmissions}</Text>
              <Text style={styles.summarySub}>SOC records</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>DISPOSITIONS</Text>
              <Text style={styles.summaryValue}>{totalDispositions}</Text>
              <Text style={styles.summarySub}>{dispositionSummary}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>AVG. LENGTH OF STAY</Text>
              <Text style={styles.summaryValue}>{Math.round(alos)}</Text>
              <Text style={styles.summarySub}>
                {totalDischarges} discharge{totalDischarges === 1 ? "" : "s"}, days
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                {isPartialPeriod ? "PERIOD-TO-DATE ADC" : "AVERAGE DAILY CENSUS"}
              </Text>
              <Text style={styles.summaryValue}>{Math.round(adc)}</Text>
              <Text style={styles.summarySub}>
                {isPartialPeriod ? "Period-to-date average" : "Full-period average"}
              </Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <Text style={styles.summaryLabel}>ACTIVE PATIENTS</Text>
              <Text style={styles.summaryValue}>{activePatients}</Text>
              <Text style={styles.summarySub}>Admitted in period, no discharge</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>MONTHLY MEASURES</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow} fixed>
              <Text style={[styles.thCategory, styles.colCategory]}>MEASURE</Text>
              {buckets.map((b) => (
                <Text key={`${b.year}-${b.month}`} style={[styles.th, styles.colMonth]}>
                  {(spansMultipleYears ? b.fullLabel : b.label).toUpperCase()}
                </Text>
              ))}
              <Text style={[styles.th, styles.colTotal]}>TOTAL</Text>
            </View>

            {rows.map((row, index) => (
              <View
                key={row.label}
                style={
                  row.highlight
                    ? styles.tableRowHighlight
                    : index % 2 === 1
                    ? styles.tableRowAlt
                    : styles.tableRow
                }
              >
                <Text
                  style={[
                    row.highlight ? styles.categoryCellAccent : styles.categoryCell,
                    styles.colCategory,
                  ]}
                >
                  {row.label}
                </Text>
                {row.values.map((val, idx) => {
                  const isFuture = row.isDecimal && idx >= numBucketsToShow;
                  return (
                    <Text
                      key={idx}
                      style={[row.highlight ? styles.tdAccent : styles.td, styles.colMonth]}
                    >
                      {isFuture ? "\u2014" : row.isDecimal ? Math.round(val) : val}
                    </Text>
                  );
                })}
                <Text
                  style={[row.highlight ? styles.tdAccent : styles.totalCell, styles.colTotal]}
                >
                  {row.isDecimal ? `${Math.round(row.total)}*` : row.total}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.notesBlock}>
            <Text style={styles.notesTitle}>REPORT NOTES</Text>
            <Text style={styles.noteText}>
              ADC is a patient-day weighted measure. ALOS reflects SOC-to-EOC days for patients
              discharged in each month; monthly values above are rounded for display.
            </Text>
            {isPartialPeriod && (
              <Text style={styles.noteText}>
                {buckets[numBucketsToShow]
                  ? `${(spansMultipleYears ? buckets[numBucketsToShow].fullLabel : buckets[numBucketsToShow].label)}\u2013${(spansMultipleYears ? buckets[buckets.length - 1].fullLabel : buckets[buckets.length - 1].label)} are not yet reported.`
                  : ""}
                {" "}Totals reflect data entered to date, not a validated full-period ACHC
                extract.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerSignature}>
            Prepared by: {preparedBy || "_______________________"}
            {"    "}Reviewed by: {reviewedBy || "_______________________"}
          </Text>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader />

        <View style={styles.chartPageContent}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>MONTHLY CENSUS TREND</Text>
            <Text style={styles.sectionHeaderNote}>Average Daily Census (ADC)</Text>
          </View>
          <View style={styles.chartBox}>
            <CensusTrendChart
              values={adcByMonth}
              buckets={buckets}
              numBucketsToShow={numBucketsToShow}
              spansMultipleYears={spansMultipleYears}
            />
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerSignature}>
            Prepared by: {preparedBy || "_______________________"}
            {"    "}Reviewed by: {reviewedBy || "_______________________"}
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

export default HospiceCensusUtilizationDocument;

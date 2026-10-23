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
  infoBand: {
    backgroundColor: LIGHTBG,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 18,
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
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: LIGHTBG,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryCardAccent: {
    backgroundColor: TOTALS_BG,
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
  summaryValueAccent: {
    color: ACCENT,
  },
  summarySub: {
    fontSize: 7.5,
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
  td: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  tdYtd: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  notesBlock: {
    marginTop: 12,
  },
  noteTextMuted: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 3,
  },
  noteTextAmber: {
    fontSize: 7.5,
    color: AMBER,
    marginBottom: 3,
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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const computeADC = (patientsData, yearStart, yearEnd) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);

  if (periodEnd.isBefore(yearStart, "day")) {
    return { adc: 0, isYTD: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(yearStart, "days") + 1;
  let totalPatientDays = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(yearEnd)) return;
    if (eoc && eoc.isBefore(yearStart)) return;

    const effStart = moment.max(soc, yearStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isYTD = periodEnd.isBefore(yearEnd, "day");

  return { adc, isYTD, periodEnd };
};

const computeMonthlyADC = (patientsData, year) => {
  const today = moment().endOf("day");
  const adcByMonth = new Array(12).fill(0);

  for (let m = 0; m < 12; m++) {
    const monthStart = moment([year, m, 1]).startOf("day");
    const monthEnd = moment(monthStart).endOf("month");
    const periodEnd = moment.min(monthEnd, today);

    if (periodEnd.isBefore(monthStart, "day")) {
      adcByMonth[m] = 0;
      continue;
    }

    const daysInPeriod = periodEnd.diff(monthStart, "days") + 1;
    let totalPatientDays = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      if (soc.isAfter(monthEnd)) return;
      if (eoc && eoc.isBefore(monthStart)) return;

      const effStart = moment.max(soc, monthStart);
      const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

      if (effEnd.isSameOrAfter(effStart, "day")) {
        totalPatientDays += effEnd.diff(effStart, "days") + 1;
      }
    });

    adcByMonth[m] = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  }

  return adcByMonth;
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

const ADCTrendChart = ({ months, values }) => {
  const niceMax = buildNiceMax(Math.max(...values, 0));
  const plotWidth = PLOT_RIGHT - PLOT_LEFT;
  const plotHeight = PLOT_BOTTOM - PLOT_TOP;
  const numPoints = values.length;

  const xAt = (i) =>
    numPoints > 1
      ? PLOT_LEFT + (i * plotWidth) / (numPoints - 1)
      : PLOT_LEFT + plotWidth / 2;
  const yAt = (v) => PLOT_BOTTOM - (v / niceMax) * plotHeight;

  const gridSteps = niceMax / 5;
  const gridValues = [];
  for (let i = 0; i <= gridSteps; i++) {
    gridValues.push(i * 5);
  }

  const points = values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

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

      {months.map((m, i) => (
        <Text
          key={m}
          x={xAt(i)}
          y={PLOT_BOTTOM + 14}
          textAnchor="middle"
          fill={MUTED}
          fontSize={7}
        >
          {m.toUpperCase()}
        </Text>
      ))}

      <Polyline
        points={points}
        fill="none"
        stroke={ACCENT}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {values.map((v, i) => (
        <Circle key={i} cx={xAt(i)} cy={yAt(v)} r={3} fill={ACCENT} />
      ))}

      {values.map((v, i) => (
        <Text
          key={`label-${i}`}
          x={xAt(i)}
          y={yAt(v) - 8}
          textAnchor="middle"
          fill={NAVY}
          fontSize={7.5}
          fontWeight="bold"
        >
          {Math.round(v)}
        </Text>
      ))}
    </Svg>
  );
};

const MonthlyADCReportDocument = ({
  patientsData,
  selectedYear,
  ccn,
  preparedBy,
  reviewedBy,
}) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");

  const { adc, isYTD, periodEnd } = computeADC(patientsData, yearStart, yearEnd);
  const adcByMonth = computeMonthlyADC(patientsData, year);

  const numMonthsToShow = periodEnd.year() === year ? periodEnd.month() + 1 : 12;
  const displayMonths = MONTHS.slice(0, numMonthsToShow);
  const displayValues = adcByMonth.slice(0, numMonthsToShow);

  const latestIdx = numMonthsToShow - 1;
  const latestMonthLabel = MONTHS[latestIdx];
  const latestMonthADC = adcByMonth[latestIdx];
  const latestIsPartial = isYTD && periodEnd.month() === latestIdx && !periodEnd.isSame(moment(periodEnd).endOf("month"), "day");

  let peakIdx = 0;
  displayValues.forEach((v, i) => {
    if (v > displayValues[peakIdx]) peakIdx = i;
  });
  const peakMonthLabel = MONTHS[peakIdx];
  const peakValue = displayValues[peakIdx] || 0;

  const coverageLabel = `${yearStart.format("MMM D")} \u2013 ${periodEnd.format("MMM D, YYYY")}`;

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
                MONTHLY AVERAGE DAILY CENSUS (ADC) REPORT
              </Text>
              <Text style={styles.headerSubLine}>
                Hospice Census &amp; Utilization Summary
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>ACHC SURVEY REFERENCE</Text>
            <Text style={styles.headerRightValue}>
              CCN: {ccn || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoBand}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>REPORTING PERIOD</Text>
              <Text style={styles.infoValue}>{coverageLabel}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>REPORT TYPE</Text>
              <Text style={styles.infoValue}>
                {isYTD ? "Year-to-Date" : "Full Year"}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DATA SOURCE</Text>
              <Text style={styles.infoValue}>
                Uploaded {year} Census Data
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryCardAccent]}>
              <Text style={styles.summaryLabel}>
                {isYTD ? "REPORTED YTD ADC" : "REPORTED FULL-YEAR ADC"}
              </Text>
              <Text style={[styles.summaryValue, styles.summaryValueAccent]}>
                {Math.round(adc)}
              </Text>
              <Text style={styles.summarySub}>patients / day</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                {latestMonthLabel.toUpperCase()} ADC
              </Text>
              <Text style={styles.summaryValue}>
                {Math.round(latestMonthADC)}
              </Text>
              <Text style={styles.summarySub}>
                {latestIsPartial ? "month-to-date" : "monthly"}
              </Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <Text style={styles.summaryLabel}>PEAK MONTH</Text>
              <Text style={styles.summaryValue}>{Math.round(peakValue)}</Text>
              <Text style={styles.summarySub}>
                {peakMonthLabel} {year}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>MONTHLY ADC TREND</Text>
          <View style={styles.chartBox}>
            <ADCTrendChart months={displayMonths} values={displayValues} />
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCategory, { width: "14%" }]}>
                MONTHLY ADC
              </Text>
              {displayMonths.map((m) => (
                <Text
                  key={m}
                  style={[
                    styles.th,
                    { width: `${86 / (numMonthsToShow + 1)}%` },
                  ]}
                >
                  {m.toUpperCase()}
                </Text>
              ))}
              <Text
                style={[styles.th, { width: `${86 / (numMonthsToShow + 1)}%` }]}
              >
                YTD
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.categoryCell, { width: "14%" }]}>ADC</Text>
              {displayValues.map((v, idx) => (
                <Text
                  key={idx}
                  style={[styles.td, { width: `${86 / (numMonthsToShow + 1)}%` }]}
                >
                  {Math.round(v)}
                </Text>
              ))}
              <Text
                style={[styles.tdYtd, { width: `${86 / (numMonthsToShow + 1)}%` }]}
              >
                {Math.round(adc)}
              </Text>
            </View>
          </View>

          <View style={styles.notesBlock}>
            <Text style={styles.noteTextMuted}>
              ADC = total patient days ÷ calendar days in the period. Values
              above are rounded as displayed in the source report.
            </Text>
            <Text style={styles.noteTextAmber}>
              Validate against unrounded daily census / patient-day data
              before final ACHC submission.
            </Text>
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

export default MonthlyADCReportDocument;

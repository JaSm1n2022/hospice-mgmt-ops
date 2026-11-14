import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const GREEN = "#2E6B3F";
const GREEN_MID = "#5A9A68";
const GREEN_LIGHT = "#DDEFD9";
const GREEN_PALE = "#F3F9F1";
const GREEN_HEADER_SUB = "#E3F1E0";
const INK = "#22302A";
const MUTED = "#6B7B72";
const LINE = "#C9DCC6";
const AMBER = "#C98A12";
const AMBER_BG = "#FDF3DE";
const BLUE = "#3B6EA5";
const BLUE_BG = "#E6EEF8";
const RED = "#B23B3B";
const RED_BG = "#F9E4E4";
const GREY_BG = "#EEF1EF";
const ROW_ALT = "#FAFCFA";

const STATUS_META = {
  done: { text: "Completed", fg: GREEN, bg: GREEN_LIGHT },
  due: { text: "Due Soon", fg: AMBER, bg: AMBER_BG },
  upcoming: { text: "Upcoming", fg: BLUE, bg: BLUE_BG },
  overdue: { text: "Overdue", fg: RED, bg: RED_BG },
  na: { text: "Not Required", fg: MUTED, bg: GREY_BG },
  discharged: { text: "Discharged", fg: MUTED, bg: GREY_BG },
};

const fmt = (d) => (d ? moment(d).format("MM/DD/YYYY") : "—");
const fmtShort = (d) => (d ? moment(d).format("MM/DD") : "—");
const fmtOrNA = (d, isNA) => (d ? fmt(d) : isNA ? "Not Required" : "—");
const textOrNA = (text, isNA) =>
  text ? text : isNA ? "Not Required" : "—";
const fmtOrReason = (d, reason) => (d ? fmt(d) : reason || "—");
const textOrReason = (text, reason) => (text ? text : reason || "—");

const getDischargeDate = (patient) => {
  if (!patient) return null;
  if (patient.eoc) return moment(patient.eoc);
  if (patient.hope_discharge_dt) return moment(patient.hope_discharge_dt);
  return null;
};

const buildMilestones = (patient, reportDate) => {
  if (!patient || !patient.soc) return [];
  const soc = moment(patient.soc);
  const add = (n) => soc.clone().add(n, "days");
  const report = reportDate ? moment(reportDate) : moment();
  const discharge = getDischargeDate(patient);

  const huv1Moment = patient.huv1_completed_dt
    ? moment(patient.huv1_completed_dt)
    : null;
  const sfv1Moment = patient.sfv_huv1_completed_dt
    ? moment(patient.sfv_huv1_completed_dt)
    : null;
  const huv1CompletedActual =
    sfv1Moment && huv1Moment
      ? sfv1Moment.isAfter(huv1Moment)
        ? sfv1Moment
        : huv1Moment
      : sfv1Moment || huv1Moment || null;

  const huv2Moment = patient.huv2_completed_dt
    ? moment(patient.huv2_completed_dt)
    : null;
  const sfv2Moment = patient.sfv_huv2_completed_dt
    ? moment(patient.sfv_huv2_completed_dt)
    : null;
  const huv2CompletedActual =
    sfv2Moment && huv2Moment
      ? sfv2Moment.isAfter(huv2Moment)
        ? sfv2Moment
        : huv2Moment
      : sfv2Moment || huv2Moment || null;

  const defs = [
    {
      day: "Admit",
      sub: "Admit Date",
      target: soc,
      targetEnd: soc,
      actual: soc,
    },
    {
      day: "Day 2",
      sub: "SFV Due",
      target: add(2),
      targetEnd: add(2),
      actual: patient.sfv_admission_dt ? moment(patient.sfv_admission_dt) : null,
      symptomNA: patient.first_symptom === "N/A",
    },
    {
      day: "Day 5",
      sub: "Comprehensive Assessment",
      target: add(5),
      targetEnd: add(5),
      actual: add(5),
    },
    {
      day: "Day 6-15",
      sub: "HUV1 Window",
      target: add(6),
      targetEnd: add(15),
      actual: patient.huv1_completed_dt
        ? moment(patient.huv1_completed_dt)
        : null,
      isWindow: true,
    },
    {
      day: "Day 8-15",
      sub: "SFV Window",
      target: add(8),
      targetEnd: add(15),
      actual: patient.sfv_huv1_completed_dt
        ? moment(patient.sfv_huv1_completed_dt)
        : null,
      isWindow: true,
      symptomNA: patient.second_symptom === "N/A",
    },
    {
      day: "Day 15",
      sub: "HUV1 Completed",
      target: add(15),
      targetEnd: add(15),
      actual: huv1CompletedActual,
    },
    {
      day: "Day 16-30",
      sub: "HUV2 Window",
      target: add(16),
      targetEnd: add(30),
      actual: patient.huv2_completed_dt
        ? moment(patient.huv2_completed_dt)
        : null,
      isWindow: true,
    },
    {
      day: "Day 18-30",
      sub: "SFV2 Window",
      target: add(18),
      targetEnd: add(30),
      actual: patient.sfv_huv2_completed_dt
        ? moment(patient.sfv_huv2_completed_dt)
        : null,
      isWindow: true,
      symptomNA: patient.third_symptom === "N/A",
    },
    {
      day: "Day 30",
      sub: "HUV2 Completed",
      target: add(30),
      targetEnd: add(30),
      actual: huv2CompletedActual,
    },
  ];

  return defs.map((m, idx) => {
    let status;
    if (idx === 0) {
      status = "done";
    } else if (m.actual) {
      status = "done";
    } else if (discharge && discharge.isSameOrBefore(m.targetEnd, "day")) {
      status = "discharged";
    } else if (m.symptomNA) {
      status = "na";
    } else if (report.isAfter(m.targetEnd, "day")) {
      status = "overdue";
    } else if (m.targetEnd.diff(report, "days") <= 7) {
      status = "due";
    } else {
      status = "upcoming";
    }

    return {
      day: m.day,
      sub: m.sub,
      isWindow: !!m.isWindow,
      targetText:
        status === "discharged"
          ? "N/A"
          : m.isWindow
          ? `${fmtShort(m.target)}-${fmtShort(m.targetEnd)}`
          : fmt(m.target),
      actualText: m.actual ? fmt(m.actual) : "—",
      status,
    };
  });
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    paddingBottom: 36,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: GREEN_LIGHT,
    borderBottomWidth: 2,
    borderBottomColor: GREEN_MID,
    paddingVertical: 10,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeftRow: { flexDirection: "row", alignItems: "center" },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "white",
    borderWidth: 1.2,
    borderColor: GREEN_MID,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoImage: { width: 24, height: 24, objectFit: "contain" },
  companyName: { fontSize: 12, fontWeight: "bold", color: GREEN },
  companyAddress: { fontSize: 7.5, color: MUTED, marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  headerRightTitle: { fontSize: 10.5, fontWeight: "bold", color: GREEN },
  headerRightSub: { fontSize: 7.5, color: MUTED, marginTop: 2 },

  content: { paddingHorizontal: 32, paddingTop: 14 },

  title: { fontSize: 18, fontWeight: "bold", color: GREEN },
  subtitle: { fontSize: 9, color: MUTED, marginTop: 2, marginBottom: 10 },

  patientStrip: {
    flexDirection: "row",
    backgroundColor: GREEN_PALE,
    borderWidth: 0.8,
    borderColor: LINE,
    marginBottom: 16,
  },
  patientCell: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRightWidth: 0.5,
    borderRightColor: LINE,
  },
  patientCellLast: { borderRightWidth: 0 },
  patientCellWide: { flex: 2 },
  patientCellCaseManager: { flex: 2 },
  patientLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    marginBottom: 2,
  },
  patientValue: { fontSize: 9.5, color: INK },
  patientValueBold: { fontSize: 11, color: INK, fontWeight: "bold" },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1.2,
    borderBottomColor: GREEN_MID,
    paddingBottom: 4,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: GREEN },
  sectionNote: { fontSize: 8, color: MUTED },

  board: { borderWidth: 0.8, borderColor: LINE, marginBottom: 6 },
  boardRow: { flexDirection: "row" },
  boardLabelCellHead: {
    width: 72,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  boardLabelCell: {
    width: 72,
    backgroundColor: GREEN_PALE,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    justifyContent: "center",
  },
  boardLabelText: { fontSize: 8, fontWeight: "bold", color: GREEN },
  boardHeadCell: {
    flex: 1,
    backgroundColor: GREEN,
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderLeftWidth: 0.5,
    borderLeftColor: LINE,
    alignItems: "center",
  },
  boardHeadCellWindow: { backgroundColor: GREEN_MID },
  boardHeadDay: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  boardHeadSub: {
    fontSize: 6.5,
    color: GREEN_HEADER_SUB,
    textAlign: "center",
    marginTop: 1,
  },
  boardDataCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    borderLeftWidth: 0.5,
    borderLeftColor: LINE,
    alignItems: "center",
    justifyContent: "center",
  },
  boardDataCellAlt: { backgroundColor: ROW_ALT },
  boardCellText: { fontSize: 8.5, color: INK, textAlign: "center" },
  boardCellTextBold: {
    fontSize: 8.5,
    color: INK,
    fontWeight: "bold",
    textAlign: "center",
  },
  chip: {
    borderRadius: 7,
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: 7.5, fontWeight: "bold" },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  progressLabel: { fontSize: 7.5, color: MUTED, width: 150 },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: GREY_BG,
    marginHorizontal: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressFill: { height: 7, backgroundColor: GREEN_MID },
  legendRow: { flexDirection: "row" },
  legendItem: { fontSize: 7.5, fontWeight: "bold", marginLeft: 8 },

  cardsRow: { flexDirection: "row", marginBottom: 18 },
  card: {
    flex: 1,
    borderWidth: 0.8,
    borderColor: LINE,
    marginRight: 10,
  },
  cardLast: { marginRight: 0 },
  cardHead: {
    backgroundColor: GREEN_LIGHT,
    borderBottomWidth: 0.8,
    borderBottomColor: LINE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  cardHeadTitle: { fontSize: 10, fontWeight: "bold", color: GREEN },
  cardHeadTag: { fontSize: 7, color: MUTED },
  cardBody: { paddingHorizontal: 9, paddingVertical: 6 },
  cardFieldLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    marginTop: 5,
  },
  cardFieldValue: { fontSize: 9, color: INK, marginTop: 1 },

  iqTable: { borderWidth: 0.8, borderColor: LINE },
  iqTableFull: { marginBottom: 20 },
  iqHeadRow: { flexDirection: "row", backgroundColor: GREEN },
  iqHeadCellRecord: { flex: 0.13, padding: 6 },
  iqHeadCellSigDate: { flex: 0.09, padding: 6 },
  iqHeadCellCode: { flex: 0.08, padding: 6 },
  iqHeadCellDate: { flex: 0.09, padding: 6 },
  iqHeadCellResult: { flex: 0.13, padding: 6, alignItems: "center" },
  iqHeadCellIssue: { flex: 0.19, padding: 6 },
  iqHeadCellRootCause: { flex: 0.17, padding: 6 },
  iqHeadCellAction: { flex: 0.12, padding: 6 },
  iqHeadText: { fontSize: 8.5, fontWeight: "bold", color: "white" },
  iqRow: {
    flexDirection: "row",
    backgroundColor: GREEN_PALE,
    borderTopWidth: 0.5,
    borderTopColor: LINE,
  },
  iqRowAlt: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: LINE,
  },
  iqCellRecord: { flex: 0.13, padding: 7 },
  iqCellSigDate: { flex: 0.09, padding: 7 },
  iqCellCode: { flex: 0.08, padding: 7 },
  iqCellDate: { flex: 0.09, padding: 7 },
  iqCellResult: { flex: 0.13, padding: 6, alignItems: "center" },
  iqCellIssue: { flex: 0.19, padding: 7 },
  iqCellRootCause: { flex: 0.17, padding: 7 },
  iqCellAction: { flex: 0.12, padding: 7 },
  iqText: { fontSize: 8.5, color: INK },

  resultChip: {
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  resultChipText: { fontSize: 7.5, fontWeight: "bold" },

  sigRow: {
    flexDirection: "row",
    borderWidth: 0.8,
    borderColor: LINE,
    backgroundColor: GREEN_PALE,
  },
  sigBlock: {
    flex: 1,
    padding: 12,
    borderRightWidth: 0.5,
    borderRightColor: LINE,
  },
  sigBlockLast: { borderRightWidth: 0 },
  sigRole: { fontSize: 9, fontWeight: "bold", color: GREEN, marginBottom: 16 },
  sigLineRow: { flexDirection: "row" },
  sigLine: {
    flex: 0.64,
    borderBottomWidth: 0.8,
    borderBottomColor: INK,
    marginRight: 10,
    minHeight: 14,
    justifyContent: "flex-end",
  },
  sigLineDate: {
    flex: 0.3,
    borderBottomWidth: 0.8,
    borderBottomColor: INK,
    minHeight: 14,
    justifyContent: "flex-end",
  },
  sigFilledText: { fontSize: 9, color: INK, paddingBottom: 2 },
  sigCaptionRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  sigCaption: { fontSize: 7.5, color: MUTED, flex: 0.64, marginRight: 10 },
  sigCaptionDate: { fontSize: 7.5, color: MUTED, flex: 0.3 },

  footer: {
    position: "absolute",
    bottom: 14,
    left: 32,
    right: 32,
    borderTopWidth: 0.6,
    borderTopColor: LINE,
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7.5, color: MUTED },
});

const Chip = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.upcoming;
  return (
    <View style={[styles.chip, { backgroundColor: meta.bg }]}>
      <Text style={[styles.chipText, { color: meta.fg }]}>{meta.text}</Text>
    </View>
  );
};

const ReportHeader = () => (
  <View style={styles.headerBand}>
    <View style={styles.headerLeftRow}>
      <View style={styles.logoCircle}>
        <Image src={docLogo} cache={false} style={styles.logoImage} />
      </View>
      <View>
        <Text style={styles.companyName}>Haloes Touch Hospice Inc.</Text>
        <Text style={styles.companyAddress}>
          11500 S. Eastern Ave., Ste. 150, Henderson, NV 89052
        </Text>
      </View>
    </View>
    <View style={styles.headerRight}>
      <Text style={styles.headerRightTitle}>HOPE Tracking Report</Text>
      <Text style={styles.headerRightSub}>
        Hospice Outcomes &amp; Patient Evaluation
      </Text>
    </View>
  </View>
);

const ReportFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      CONFIDENTIAL — Contains PHI. For internal QAPI use only.
    </Text>
    <Text
      style={styles.footerText}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    />
  </View>
);

const HopeReportDocument = ({
  patient,
  reportDate,
  preparedBy,
  administrator,
  patientName,
  caseManager,
}) => {
  const safePatient = patient || {};
  const effectiveReportDate = reportDate || new Date();
  const signatureRoles = [
    { role: "Prepared By", name: preparedBy || "" },
    { role: "Administrator", name: administrator || "" },
  ];
  const milestones = buildMilestones(safePatient, effectiveReportDate);
  const doneCount = milestones.filter(
    (m) =>
      m.status === "done" || m.status === "na" || m.status === "discharged"
  ).length;
  const totalCount = milestones.length || 9;
  const pct = totalCount ? doneCount / totalCount : 0;

  const socMoment = safePatient.soc ? moment(safePatient.soc) : null;
  const dischargeDate = getDischargeDate(safePatient);
  const huv1WindowEnd = socMoment ? socMoment.clone().add(15, "days") : null;
  const huv2WindowEnd = socMoment ? socMoment.clone().add(30, "days") : null;
  const isHuv1DischargedNA =
    !!dischargeDate &&
    !!huv1WindowEnd &&
    dischargeDate.isSameOrBefore(huv1WindowEnd, "day");
  const isHuv2DischargedNA =
    !!dischargeDate &&
    !!huv2WindowEnd &&
    dischargeDate.isSameOrBefore(huv2WindowEnd, "day");

  const getIqiesMeta = (result, isDischargedNA) =>
    result === "Error"
      ? { text: "Error", fg: RED, bg: RED_BG }
      : result === "Accepted"
      ? { text: "Accepted", fg: GREEN, bg: GREEN_LIGHT }
      : isDischargedNA
      ? { text: "Not Required", fg: MUTED, bg: GREY_BG }
      : { text: "Pending", fg: BLUE, bg: BLUE_BG };

  const iqiesRows = [
    {
      key: "admission",
      label: "Admission (HOPE-A)",
      date: safePatient.iqies_admission_accepted_date,
      result: safePatient.iqies_admission_result,
      exceptions: safePatient.iqies_admission_exceptions_correction || {},
      sigDate: safePatient.hope_report_admission_dt,
      code: safePatient.hope_report_admission_code,
      isDischargedNA: false,
    },
    {
      key: "huv1",
      label: "HUV1",
      date: safePatient.iqies_huv1_accepted_dt,
      result: safePatient.iqies_huv1_result,
      exceptions: safePatient.iqies_huv1_exceptions_correction || {},
      sigDate: safePatient.hope_report_huv1_dt,
      code: safePatient.hope_report_huv1_code,
      isDischargedNA: isHuv1DischargedNA,
    },
    {
      key: "huv2",
      label: "HUV2",
      date: safePatient.iqies_huv2_accepted_dt,
      result: safePatient.iqies_huv2_result,
      exceptions: safePatient.iqies_huv2_exceptions_correction || {},
      sigDate: safePatient.hope_report_huv2_dt,
      code: safePatient.hope_report_huv2_code,
      isDischargedNA: isHuv2DischargedNA,
    },
    {
      key: "discharge",
      label: "Discharge (HOPE-D)",
      date: safePatient.iqies_discharge_accepted_dt,
      result: safePatient.iqies_discharge_result,
      exceptions: safePatient.iqies_discharge_exceptions_correction || {},
      sigDate: safePatient.hope_report_discharge_dt,
      code: safePatient.hope_report_discharge_code,
      isDischargedNA: false,
    },
  ];

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader />

        <View style={styles.content}>
          <Text style={styles.title}>HOPE Report</Text>
          <Text style={styles.subtitle}>
            Admission, HOPE Update Visits (HUV), Symptom Follow-up Visits
            (SFV), Discharge &amp; iQIES submission tracking
          </Text>

          <View style={styles.patientStrip}>
            <View style={[styles.patientCell, styles.patientCellWide]}>
              <Text style={styles.patientLabel}>PATIENT</Text>
              <Text style={styles.patientValueBold}>
                {patientName || safePatient.patientCd || "—"}
              </Text>
            </View>
            <View style={[styles.patientCell, styles.patientCellCaseManager]}>
              <Text style={styles.patientLabel}>CASE MANAGER</Text>
              <Text style={styles.patientValue}>
                {caseManager || safePatient.case_manager || "—"}
              </Text>
            </View>
            <View style={[styles.patientCell, styles.patientCellLast]}>
              <Text style={styles.patientLabel}>REPORT DATE</Text>
              <Text style={styles.patientValue}>
                {fmt(effectiveReportDate)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>HOPE Progress Board</Text>
            <Text style={styles.sectionNote}>
              Timeline anchored to Admit Date {fmt(safePatient.soc)} • Status
              as of {fmt(effectiveReportDate)}
            </Text>
          </View>

          <View style={styles.board}>
            <View style={styles.boardRow}>
              <View style={styles.boardLabelCellHead} />
              {milestones.map((m, idx) => (
                <View
                  key={`hd-${idx}`}
                  style={[
                    styles.boardHeadCell,
                    m.isWindow && styles.boardHeadCellWindow,
                  ]}
                >
                  <Text style={styles.boardHeadDay}>{m.day}</Text>
                  <Text style={styles.boardHeadSub}>{m.sub}</Text>
                </View>
              ))}
            </View>

            <View style={styles.boardRow}>
              <View style={styles.boardLabelCell}>
                <Text style={styles.boardLabelText}>Target Date</Text>
              </View>
              {milestones.map((m, idx) => (
                <View key={`tg-${idx}`} style={styles.boardDataCell}>
                  <Text style={styles.boardCellTextBold}>{m.targetText}</Text>
                </View>
              ))}
            </View>

            <View style={styles.boardRow}>
              <View style={styles.boardLabelCell}>
                <Text style={styles.boardLabelText}>Actual Date</Text>
              </View>
              {milestones.map((m, idx) => (
                <View
                  key={`ac-${idx}`}
                  style={[styles.boardDataCell, styles.boardDataCellAlt]}
                >
                  <Text style={styles.boardCellText}>{m.actualText}</Text>
                </View>
              ))}
            </View>

            <View style={styles.boardRow}>
              <View style={styles.boardLabelCell}>
                <Text style={styles.boardLabelText}>Status</Text>
              </View>
              {milestones.map((m, idx) => (
                <View key={`st-${idx}`} style={styles.boardDataCell}>
                  <Chip status={m.status} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {doneCount} of {totalCount} milestones complete (
              {Math.round(pct * 100)}%)
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${pct * 100}%` }]}
              />
            </View>
            <View style={styles.legendRow}>
              <Text style={[styles.legendItem, { color: GREEN }]}>
                Completed
              </Text>
              <Text style={[styles.legendItem, { color: AMBER }]}>
                Due Soon
              </Text>
              <Text style={[styles.legendItem, { color: BLUE }]}>
                Upcoming
              </Text>
              <Text style={[styles.legendItem, { color: RED }]}>
                Overdue
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Actual Visit Record</Text>
            <Text style={styles.sectionNote}>
              Dates and findings as they occurred
            </Text>
          </View>

          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardHeadTitle}>Admission</Text>
                <Text style={styles.cardHeadTag}>HOPE-A</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardFieldLabel}>ADMIT DATE</Text>
                <Text style={styles.cardFieldValue}>
                  {fmt(safePatient.soc)}
                </Text>
                <Text style={styles.cardFieldLabel}>SYMPTOMS (IMPACT)</Text>
                <Text style={styles.cardFieldValue}>
                  {safePatient.first_symptom || "—"}
                </Text>
                <Text style={styles.cardFieldLabel}>SFV VISIT</Text>
                <Text style={styles.cardFieldValue}>
                  {fmtOrNA(
                    safePatient.sfv_admission_dt,
                    safePatient.first_symptom === "N/A"
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardHeadTitle}>HUV1</Text>
                <Text style={styles.cardHeadTag}>Day 6-15</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardFieldLabel}>HUV VISIT</Text>
                <Text style={styles.cardFieldValue}>
                  {fmtOrReason(
                    safePatient.huv1_completed_dt,
                    isHuv1DischargedNA ? "Not Required - Discharged" : null
                  )}
                </Text>
                <Text style={styles.cardFieldLabel}>SYMPTOMS (IMPACT)</Text>
                <Text style={styles.cardFieldValue}>
                  {textOrReason(
                    safePatient.second_symptom,
                    isHuv1DischargedNA ? "Not Required - Discharged" : null
                  )}
                </Text>
                <Text style={styles.cardFieldLabel}>SFV1 VISIT</Text>
                <Text style={styles.cardFieldValue}>
                  {fmtOrReason(
                    safePatient.sfv_huv1_completed_dt,
                    isHuv1DischargedNA
                      ? "Not Required - Discharged"
                      : safePatient.second_symptom === "N/A"
                      ? "Not Required"
                      : null
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardHeadTitle}>HUV2</Text>
                <Text style={styles.cardHeadTag}>Day 16-30</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardFieldLabel}>HUV VISIT</Text>
                <Text style={styles.cardFieldValue}>
                  {fmtOrReason(
                    safePatient.huv2_completed_dt,
                    isHuv2DischargedNA ? "Not Required - Discharged" : null
                  )}
                </Text>
                <Text style={styles.cardFieldLabel}>SYMPTOMS (IMPACT)</Text>
                <Text style={styles.cardFieldValue}>
                  {textOrReason(
                    safePatient.third_symptom,
                    isHuv2DischargedNA ? "Not Required - Discharged" : null
                  )}
                </Text>
                <Text style={styles.cardFieldLabel}>SFV2 VISIT</Text>
                <Text style={styles.cardFieldValue}>
                  {fmtOrReason(
                    safePatient.sfv_huv2_completed_dt,
                    isHuv2DischargedNA
                      ? "Not Required - Discharged"
                      : safePatient.third_symptom === "N/A"
                      ? "Not Required"
                      : null
                  )}
                </Text>
              </View>
            </View>

            <View style={[styles.card, styles.cardLast]}>
              <View style={styles.cardHead}>
                <Text style={styles.cardHeadTitle}>Discharge</Text>
                <Text style={styles.cardHeadTag}>HOPE-D</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardFieldLabel}>DISCHARGE DATE</Text>
                <Text style={styles.cardFieldValue}>
                  {fmt(safePatient.hope_discharge_dt)}
                </Text>
                <Text style={styles.cardFieldLabel}>REASON</Text>
                <Text style={styles.cardFieldValue}>
                  {safePatient.hope_discharge_reason || "—"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ReportFooter />
      </Page>

      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader />

        <View style={styles.content}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>iQIES Submission</Text>
          </View>
          <View style={[styles.iqTable, styles.iqTableFull]}>
            <View style={styles.iqHeadRow}>
              <View style={styles.iqHeadCellRecord}>
                <Text style={styles.iqHeadText}>Record</Text>
              </View>
              <View style={styles.iqHeadCellSigDate}>
                <Text style={styles.iqHeadText}>Signature Date</Text>
              </View>
              <View style={styles.iqHeadCellCode}>
                <Text style={styles.iqHeadText}>Code</Text>
              </View>
              <View style={styles.iqHeadCellDate}>
                <Text style={styles.iqHeadText}>Accepted Date</Text>
              </View>
              <View style={styles.iqHeadCellResult}>
                <Text style={styles.iqHeadText}>Result</Text>
              </View>
              <View style={styles.iqHeadCellIssue}>
                <Text style={styles.iqHeadText}>Issue / Affected Records</Text>
              </View>
              <View style={styles.iqHeadCellRootCause}>
                <Text style={styles.iqHeadText}>Root Cause</Text>
              </View>
              <View style={styles.iqHeadCellAction}>
                <Text style={styles.iqHeadText}>Action / Owner</Text>
              </View>
            </View>
            {iqiesRows.map((row, idx) => {
              const meta = getIqiesMeta(row.result, row.isDischargedNA);
              const isError = row.result === "Error";
              return (
                <View
                  style={idx % 2 === 1 ? styles.iqRowAlt : styles.iqRow}
                  key={row.label}
                >
                  <View style={styles.iqCellRecord}>
                    <Text style={styles.iqText}>{row.label}</Text>
                  </View>
                  <View style={styles.iqCellSigDate}>
                    <Text style={styles.iqText}>{fmt(row.sigDate)}</Text>
                  </View>
                  <View style={styles.iqCellCode}>
                    <Text style={styles.iqText}>{row.code || "—"}</Text>
                  </View>
                  <View style={styles.iqCellDate}>
                    <Text style={styles.iqText}>{fmt(row.date)}</Text>
                  </View>
                  <View style={styles.iqCellResult}>
                    <View
                      style={[
                        styles.resultChip,
                        { backgroundColor: meta.bg },
                      ]}
                    >
                      <Text
                        style={[styles.resultChipText, { color: meta.fg }]}
                      >
                        {meta.text}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.iqCellIssue}>
                    <Text style={styles.iqText}>
                      {isError
                        ? row.exceptions.issue_affected_records || "—"
                        : "—"}
                    </Text>
                  </View>
                  <View style={styles.iqCellRootCause}>
                    <Text style={styles.iqText}>
                      {isError ? row.exceptions.root_cause || "—" : "—"}
                    </Text>
                  </View>
                  <View style={styles.iqCellAction}>
                    <Text style={styles.iqText}>
                      {isError ? row.exceptions.action_owner || "—" : "—"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Review &amp; Approval</Text>
          </View>
          <View style={styles.sigRow}>
            {signatureRoles.map((item, idx) => (
              <View
                key={item.role}
                style={[
                  styles.sigBlock,
                  idx === signatureRoles.length - 1 && styles.sigBlockLast,
                ]}
              >
                <Text style={styles.sigRole}>{item.role}:</Text>
                <View style={styles.sigLineRow}>
                  <View style={styles.sigLine}>
                    <Text style={styles.sigFilledText}>{item.name}</Text>
                  </View>
                  <View style={styles.sigLineDate}>
                    <Text style={styles.sigFilledText}>
                      {fmt(effectiveReportDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.sigCaptionRow}>
                  <Text style={styles.sigCaption}>
                    Signature / Printed Name
                  </Text>
                  <Text style={styles.sigCaptionDate}>Date</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <ReportFooter />
      </Page>
    </Document>
  );
};

export default HopeReportDocument;

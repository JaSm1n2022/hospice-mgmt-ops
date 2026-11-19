import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const GREEN = "#2E6B3F";
const GREEN_MID = "#5A9A68";
const GREEN_LIGHT = "#DDEFD9";
const INK = "#22302A";
const MUTED = "#6B7B72";
const LINE = "#C9DCC6";
const RED = "#B23B3B";
const AMBER = "#C98A12";
const ROW_ALT = "#FAFCFA";

const fmtShort = (d) => (d ? moment(d).format("MM/DD/YY") : "\u2014");
const fmt = (d) => (d ? moment(d).format("MM/DD/YYYY") : "\u2014");

const formatPatientName = (code) => {
  if (!code) return "N/A";
  return code
    .replace(/[0-9.]/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "N/A";
};

const symptomColor = (symptom) => {
  if (symptom === "Severe") return RED;
  if (symptom === "Moderate") return AMBER;
  return INK;
};

const getDischargeDate = (patient) => {
  if (!patient) return null;
  if (patient.eoc) return moment(patient.eoc);
  if (patient.hope_discharge_dt) return moment(patient.hope_discharge_dt);
  return null;
};

const isDischargedBeforeWindow = (patient, days) => {
  const soc = patient.soc ? moment(patient.soc) : null;
  const discharge = getDischargeDate(patient);
  if (!soc || !discharge) return false;
  const windowEnd = soc.clone().add(days, "days");
  return discharge.isSameOrBefore(windowEnd, "day");
};

const ACTUAL_VISIT_COLS = [
  { key: "patient", label: "Patient", width: 14, align: "left" },
  { key: "admit", label: "Admit", width: 12.3 },
  { key: "sfv0", label: "SFV0", width: 12.3 },
  { key: "huv1", label: "HUV1", width: 12.3 },
  { key: "sfv1", label: "SFV1", width: 12.3 },
  { key: "huv2", label: "HUV2", width: 12.3 },
  { key: "sfv2", label: "SFV2", width: 12.3 },
  { key: "discharge", label: "Discharge", width: 12.2 },
];

const HOPE_REPORT_COLS = [
  { key: "patient", label: "Patient", width: 20, align: "left" },
  { key: "admit", label: "Admit", width: 20 },
  { key: "huv1", label: "HUV1", width: 20 },
  { key: "huv2", label: "HUV2", width: 20 },
  { key: "discharge", label: "Discharge", width: 20 },
];

const IQIES_GROUPS = [
  { key: "admission", label: "Admit", subCols: ["Sig Dt", "Code", "Acc Dt", "Result"] },
  { key: "huv1", label: "HUV1", subCols: ["Sig Dt", "Code", "Acc Dt", "Result"] },
  { key: "huv2", label: "HUV2", subCols: ["Sig Dt", "Code", "Result"] },
  { key: "discharge", label: "Discharge", subCols: ["Sig Dt", "Code", "Acc Dt", "Result"] },
];

const IQIES_FLAT_COLS = [{ key: "patient", label: "Patient", width: 10, align: "left" }];
const IQIES_DATA_COL_WIDTH = 90 / IQIES_GROUPS.reduce((n, g) => n + g.subCols.length, 0);
IQIES_GROUPS.forEach((g) => {
  g.subCols.forEach((sc) => {
    IQIES_FLAT_COLS.push({
      key: `${g.key}_${sc}`,
      label: `${g.label} ${sc}`,
      width: IQIES_DATA_COL_WIDTH,
      groupKey: g.key,
      subLabel: sc,
    });
  });
});

const buildSfvCell = (date, symptom) => {
  if (!date) return "N/A";
  return {
    text: symptom || "\u2014",
    sub: fmtShort(date),
    color: symptomColor(symptom),
  };
};

const getActualVisitValue = (patient, key) => {
  switch (key) {
    case "admit":
      return patient.soc ? fmtShort(patient.soc) : "N/A";
    case "sfv0":
      return buildSfvCell(patient.sfv_admission_dt, patient.first_symptom);
    case "sfv1":
      return buildSfvCell(patient.sfv_huv1_completed_dt, patient.second_symptom);
    case "sfv2":
      return buildSfvCell(patient.sfv_huv2_completed_dt, patient.third_symptom);
    case "huv1":
      if (patient.huv1_completed_dt) return fmtShort(patient.huv1_completed_dt);
      return isDischargedBeforeWindow(patient, 15) ? "Discharged" : "N/A";
    case "huv2":
      if (patient.huv2_completed_dt) return fmtShort(patient.huv2_completed_dt);
      return isDischargedBeforeWindow(patient, 30) ? "Discharged" : "N/A";
    case "discharge": {
      const discharge = getDischargeDate(patient);
      return discharge ? fmtShort(discharge) : "N/A";
    }
    default:
      return "N/A";
  }
};

const getHopeReportValue = (patient, key) => {
  switch (key) {
    case "admit":
      return patient.hope_report_admission_dt
        ? fmtShort(patient.hope_report_admission_dt)
        : "N/A";
    case "huv1":
      if (patient.hope_report_huv1_dt) return fmtShort(patient.hope_report_huv1_dt);
      return isDischargedBeforeWindow(patient, 15) ? "Discharged" : "N/A";
    case "huv2":
      if (patient.hope_report_huv2_dt) return fmtShort(patient.hope_report_huv2_dt);
      return isDischargedBeforeWindow(patient, 30) ? "Discharged" : "N/A";
    case "discharge":
      return patient.hope_report_discharge_dt
        ? fmtShort(patient.hope_report_discharge_dt)
        : "N/A";
    default:
      return "N/A";
  }
};

const IQIES_WINDOW_DAYS = { huv1: 15, huv2: 30 };

const getIqiesCell = (patient, groupKey, subLabel) => {
  const sigField = `hope_report_${groupKey}_dt`;
  const codeField = `hope_report_${groupKey}_code`;
  const accField =
    groupKey === "admission"
      ? "iqies_admission_accepted_date"
      : `iqies_${groupKey}_accepted_dt`;
  const resultField = `iqies_${groupKey}_result`;

  const windowDays = IQIES_WINDOW_DAYS[groupKey];
  const placeholder =
    windowDays && isDischargedBeforeWindow(patient, windowDays) ? "DC" : "N/A";
  const placeholderColor = MUTED;

  if (subLabel === "Sig Dt") {
    return patient[sigField]
      ? { text: fmtShort(patient[sigField]), color: INK }
      : { text: placeholder, color: placeholderColor };
  }
  if (subLabel === "Code") {
    return patient[codeField]
      ? { text: patient[codeField], color: INK }
      : { text: placeholder, color: placeholderColor };
  }
  if (subLabel === "Acc Dt") {
    return patient[accField]
      ? { text: fmtShort(patient[accField]), color: INK }
      : { text: placeholder, color: placeholderColor };
  }
  if (subLabel === "Result") {
    const result = patient[resultField];
    if (result === "Accepted") return { text: "Acc", color: GREEN };
    if (result === "Error") return { text: "Err", color: RED };
    return { text: placeholder, color: placeholderColor };
  }
  return { text: placeholder, color: placeholderColor };
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 30,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: GREEN_LIGHT,
    borderBottomWidth: 2,
    borderBottomColor: GREEN_MID,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeftRow: { flexDirection: "row", alignItems: "center" },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: GREEN_MID,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoImage: { width: 18, height: 18, objectFit: "contain" },
  companyName: { fontSize: 10, fontWeight: "bold", color: GREEN },
  companyAddress: { fontSize: 6.5, color: MUTED, marginTop: 1 },
  headerRight: { alignItems: "flex-end" },
  headerRightTitle: { fontSize: 9.5, fontWeight: "bold", color: GREEN },
  headerRightSub: { fontSize: 6.5, color: MUTED, marginTop: 1 },

  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1.2,
    borderBottomColor: GREEN_MID,
    paddingBottom: 4,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: GREEN },
  sectionNote: { fontSize: 7.5, color: MUTED },

  legendRow: { flexDirection: "row", marginBottom: 8 },
  legendText: { fontSize: 7, marginRight: 12 },

  table: {
    borderWidth: 0.8,
    borderColor: LINE,
  },
  headRow: {
    flexDirection: "row",
    backgroundColor: GREEN,
  },
  headCell: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.5,
    borderLeftColor: GREEN_MID,
  },
  headCellFirst: { borderLeftWidth: 0, alignItems: "flex-start" },
  headText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headTextFirst: { textAlign: "left" },

  dataRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    minHeight: 16,
  },
  dataRowAlt: { backgroundColor: ROW_ALT },
  dataCell: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.4,
    borderLeftColor: LINE,
  },
  dataCellFirst: { borderLeftWidth: 0, alignItems: "flex-start" },
  dataText: { fontSize: 6.5, color: INK, textAlign: "center" },
  dataSubText: { fontSize: 5.8, color: MUTED, textAlign: "center", marginTop: 1 },
  dataTextFirst: { textAlign: "left", fontWeight: "bold" },
  emptyText: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic",
    padding: 14,
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    bottom: 12,
    left: 24,
    right: 24,
    borderTopWidth: 0.6,
    borderTopColor: LINE,
    paddingTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 6.5, color: MUTED },

  sigSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: GREEN,
    marginTop: 14,
    marginBottom: 6,
  },
  sigRow: {
    flexDirection: "row",
    borderWidth: 0.8,
    borderColor: LINE,
    backgroundColor: "#F3F9F1",
  },
  sigBlock: {
    flex: 1,
    padding: 10,
    borderRightWidth: 0.5,
    borderRightColor: LINE,
  },
  sigBlockLast: { borderRightWidth: 0 },
  sigRole: { fontSize: 8.5, fontWeight: "bold", color: GREEN, marginBottom: 14 },
  sigLineRow: { flexDirection: "row" },
  sigLine: {
    flex: 0.64,
    borderBottomWidth: 0.8,
    borderBottomColor: INK,
    marginRight: 10,
    minHeight: 13,
    justifyContent: "flex-end",
  },
  sigLineDate: {
    flex: 0.3,
    borderBottomWidth: 0.8,
    borderBottomColor: INK,
    minHeight: 13,
    justifyContent: "flex-end",
  },
  sigFilledText: { fontSize: 8.5, color: INK, paddingBottom: 2 },
  sigCaptionRow: { flexDirection: "row", marginTop: 3 },
  sigCaption: { fontSize: 6.5, color: MUTED, flex: 0.64, marginRight: 10 },
  sigCaptionDate: { fontSize: 6.5, color: MUTED, flex: 0.3 },
});

const ReportHeader = ({ subtitle }) => (
  <View style={styles.headerBand} fixed>
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
      <Text style={styles.headerRightTitle}>HOPE Report Summary</Text>
      <Text style={styles.headerRightSub}>{subtitle}</Text>
    </View>
  </View>
);

const ReportFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      CONFIDENTIAL &mdash; Contains PHI. For internal QAPI use only.
    </Text>
    <Text
      style={styles.footerText}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    />
  </View>
);

const SectionTable = ({ columns, patients, getValue }) => (
  <View style={styles.table}>
    <View style={styles.headRow} fixed>
      {columns.map((col, idx) => (
        <View
          key={col.key}
          style={[
            styles.headCell,
            { width: `${col.width}%` },
            idx === 0 && styles.headCellFirst,
          ]}
        >
          <Text
            style={[styles.headText, idx === 0 && styles.headTextFirst]}
          >
            {col.label}
          </Text>
        </View>
      ))}
    </View>

    {patients.length === 0 ? (
      <Text style={styles.emptyText}>No patient data available</Text>
    ) : (
      patients.map((patient, rIdx) => (
        <View
          key={patient.id || rIdx}
          style={[styles.dataRow, rIdx % 2 === 1 && styles.dataRowAlt]}
          wrap={false}
        >
          {columns.map((col, cIdx) => {
            if (cIdx === 0) {
              return (
                <View
                  key={col.key}
                  style={[
                    styles.dataCell,
                    styles.dataCellFirst,
                    { width: `${col.width}%` },
                  ]}
                >
                  <Text style={[styles.dataText, styles.dataTextFirst]}>
                    {formatPatientName(patient.patientCd)}
                  </Text>
                </View>
              );
            }
            const cell = getValue(patient, col);
            const text = typeof cell === "string" ? cell : cell.text;
            const color = typeof cell === "string" ? INK : cell.color || INK;
            const sub = typeof cell === "string" ? null : cell.sub;
            return (
              <View
                key={col.key}
                style={[styles.dataCell, { width: `${col.width}%` }]}
              >
                <Text style={[styles.dataText, { color }]}>{text}</Text>
                {sub ? <Text style={styles.dataSubText}>{sub}</Text> : null}
              </View>
            );
          })}
        </View>
      ))
    )}
  </View>
);

const HopeSummaryReportDocument = ({
  patients,
  reportDate,
  preparedBy,
  reviewedApprovedBy,
}) => {
  const list = patients || [];
  const effectiveReportDate = reportDate || new Date();
  const metaSub = `Report Date: ${fmtShort(effectiveReportDate)} | Patients: ${list.length}`;
  const signatureRoles = [
    { role: "Prepared By", name: preparedBy || "" },
    { role: "Reviewed and Approved By", name: reviewedApprovedBy || "" },
  ];

  return (
    <Document>
      {/* Table 1: Patient HOPE Actual Visit */}
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader subtitle={metaSub} />
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Patient HOPE Actual Visit</Text>
          <Text style={styles.sectionNote}>
            Dates and visits as they actually occurred (Admit / SFV0 / HUV1 /
            SFV1 / HUV2 / SFV2)
          </Text>
        </View>
        <SectionTable
          columns={ACTUAL_VISIT_COLS}
          patients={list}
          getValue={(patient, col) => getActualVisitValue(patient, col.key)}
        />
        <ReportFooter />
      </Page>

      {/* Table 2: Patient HOPE Report */}
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader subtitle={metaSub} />
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Patient HOPE Report</Text>
          <Text style={styles.sectionNote}>
            Signature / completion dates recorded for HOPE submission
            milestones
          </Text>
        </View>
        <SectionTable
          columns={HOPE_REPORT_COLS}
          patients={list}
          getValue={(patient, col) => getHopeReportValue(patient, col.key)}
        />
        <ReportFooter />
      </Page>

      {/* Table 3: Patient IQIES Submission */}
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <ReportHeader subtitle={metaSub} />
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Patient IQIES Submission</Text>
          <Text style={styles.sectionNote}>
            Signature date, submission code, accepted date &amp; result per
            milestone
          </Text>
        </View>
        <View style={styles.legendRow}>
          <Text style={[styles.legendText, { color: GREEN }]}>
            Acc = Accepted
          </Text>
          <Text style={[styles.legendText, { color: RED }]}>Err = Error</Text>
          <Text style={[styles.legendText, { color: MUTED }]}>
            DC = Discharged (prior to window)
          </Text>
          <Text style={[styles.legendText, { color: MUTED }]}>
            N/A = Not yet submitted
          </Text>
        </View>
        <SectionTable
          columns={IQIES_FLAT_COLS}
          patients={list}
          getValue={(patient, col) =>
            getIqiesCell(patient, col.groupKey, col.subLabel)
          }
        />

        <Text style={styles.sigSectionTitle}>Review &amp; Approval</Text>
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

        <ReportFooter />
      </Page>
    </Document>
  );
};

export default HopeSummaryReportDocument;

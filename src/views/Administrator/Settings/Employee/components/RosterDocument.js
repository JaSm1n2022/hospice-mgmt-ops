/**
 * HSP1-2A Clinical Staff Roster
 *
 * Implements ROSTER_FEATURE_SPEC.md sections 2-7 (design tokens, layout,
 * status flags, and the exact column/field map per section).
 *
 * ---------------------------------------------------------------------
 * DATA CONTRACT (section 7 of the spec)
 * ---------------------------------------------------------------------
 * This adapter reads the following fields directly off each employee
 * record, using the *exact* names from the spec. None of these exist on
 * the `employees` table yet except the ones noted "(current)". Add the
 * rest to the table/record shape and this file will pick them up with
 * no further changes:
 *
 *   employmentType          'W-2' | 'Contractor' | 'Volunteer'   (current: employeeType – falls back/maps automatically)
 *   category                'clinical_employee' | 'contractor' | 'aide' | 'volunteer'  (current: derived from position as a fallback)
 *   schedule                'Full-Time' | 'Per Diem' | ...        (current: falls back to employeeType)
 *   credentials             string, e.g. "RN"
 *   fileLocation            string, e.g. "HSP4"
 *   license: { number, expirationDate, verifiedDate }
 *   certification: { number, expirationDate, verifiedDate }
 *   competency: { initialDate, lastAnnualDate }
 *   cpr: { expirationDate }
 *   contract: { effectiveDate, expirationDate, autoRenew }
 *   service, contractParty, orientationDate
 *   inserviceHours12mo, supervision: { lastAnnualDate }
 *   volunteerRole, startDate, backgroundCheckDate, healthScreeningDate,
 *   confidentialityDate, lastInserviceDate, supervisorName, hoursInPeriod
 *
 * displayName / position / status / hireDate / employeeId map to the
 * existing employees fields (name|fn+ln, position, status, dateHired).
 *
 * ---------------------------------------------------------------------
 * HR ONBOARDING CHECKLIST FALLBACK (Settings > HR Onboarding Checklist)
 * ---------------------------------------------------------------------
 * `buildRosterModel(rawEmployees, { checklists })` accepts the raw
 * `employeeChecklist` records (one per employee, keyed by `employeeId`,
 * shape defined in HROnboardingChecklistFunction.js's CHECKLIST_STRUCTURE).
 * Of its ~30 items, only two store a real date today:
 *   section2.licenseVerification: { checked, expirationDate }  -> license.expirationDate
 *   section2.cprCard:             { checked, expirationDate }  -> cpr.expirationDate
 * These are merged in automatically (explicit emp.license/emp.cpr still
 * win if present). Every other checklist item (competency, orientation,
 * backgroundCheck, confidentiality, inServicesAnnual, etc.) is stored as
 * a plain checkbox with NO date — so license.number, license.verifiedDate,
 * competency.*, orientationDate, backgroundCheckDate, confidentialityDate,
 * healthScreeningDate, lastInserviceDate, supervision.*, contract.*, and
 * all volunteer-specific fields have no real source anywhere in the app
 * yet and will keep showing MISSING/N/A until those fields/dates are
 * added (either to `employees` or to the checklist) as planned.
 * ---------------------------------------------------------------------
 */
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

export const C = {
  headerBg: "#E3F1E3",
  headerBorder: "#9FD09F",
  brandDark: "#1B5E20",
  brandMid: "#2E7D32",
  kicker: "#4C8C4F",
  text: "#1F2A24",
  muted: "#6A7A6D",
  tableHeadBg: "#F1F8F1",
  tableHeadTx: "#2E5A31",
  tableBorder: "#CFE3CF",
  rowBorder: "#E4EFE4",
  noteBg: "#F1F8F1",
  noteBar: "#66BB6A",
  pillBorder: "#9FBFA0",
  expiredTx: "#B71C1C",
  expiredBg: "#FDECEA",
  dueSoonTx: "#8A5300",
  dueSoonBg: "#FFF4E0",
  missingTx: "#B71C1C",
};

export const MARGIN_X = 32;
export const DUE_SOON_DAYS = 60;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    paddingBottom: 36,
    backgroundColor: "#FFFFFF",
  },
  headerBar: {
    height: 44,
    width: "100%",
    backgroundColor: C.headerBg,
    borderBottomWidth: 1.5,
    borderBottomColor: C.headerBorder,
    paddingHorizontal: MARGIN_X,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandDark: { fontSize: 14, fontWeight: 700, color: C.brandDark },
  brandMid: { fontSize: 14, fontWeight: 400, color: C.brandMid },
  pill: {
    borderWidth: 1,
    borderColor: C.pillBorder,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  pillText: { fontSize: 7.5, color: C.text },
  content: { paddingHorizontal: MARGIN_X, paddingTop: 10 },
  kicker: {
    fontSize: 7.5,
    fontWeight: 500,
    color: C.kicker,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: C.brandDark,
    marginTop: 2,
    marginBottom: 4,
  },
  lead: { fontSize: 9.5, color: C.text, marginBottom: 4 },
  asOfLine: { fontSize: 8.5, color: C.text, marginBottom: 8 },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: C.tableBorder,
  },
  headerRow: { flexDirection: "row", backgroundColor: C.tableHeadBg },
  headerCell: {
    fontSize: 7.5,
    fontWeight: 600,
    color: C.tableHeadTx,
    padding: 4,
  },
  bodyRow: { flexDirection: "row", minHeight: 22 },
  bodyRowAlt: {
    flexDirection: "row",
    minHeight: 22,
    backgroundColor: "#FBFDFB",
  },
  bodyCell: {
    fontSize: 7.5,
    color: C.text,
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: C.rowBorder,
    borderBottomWidth: 0.5,
    borderBottomColor: C.rowBorder,
    justifyContent: "center",
  },
  normalText: { fontSize: 7.5, color: C.text },
  mutedText: { fontSize: 7.5, color: C.muted },
  missingText: { fontSize: 7.5, color: C.missingTx, fontWeight: 600 },
  dueSoonCell: { backgroundColor: C.dueSoonBg },
  dueSoonText: { fontSize: 7.5, color: C.dueSoonTx, fontWeight: 600 },
  expiredCell: { backgroundColor: C.expiredBg },
  expiredText: { fontSize: 7.5, color: C.expiredTx, fontWeight: 600 },
  emptyRow: { padding: 10 },
  emptyText: {
    fontSize: 9,
    fontWeight: 600,
    color: C.expiredTx,
    textAlign: "center",
    width: "100%",
  },
  footnote: {
    backgroundColor: C.noteBg,
    borderLeftWidth: 3,
    borderLeftColor: C.noteBar,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  footnoteText: { fontSize: 8, color: C.text },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  legendSwatch: { width: 7, height: 7, marginRight: 4 },
  legendText: { fontSize: 7, color: C.muted },
  summaryBox: {
    backgroundColor: C.noteBg,
    borderWidth: 1,
    borderColor: C.tableBorder,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  summaryText: { fontSize: 8, color: C.text, marginRight: 16 },
  summaryPercentBad: { fontSize: 8, color: C.expiredTx, fontWeight: 700 },
  footer: {
    position: "absolute",
    bottom: 12,
    left: MARGIN_X,
    right: MARGIN_X,
    borderTopWidth: 0.5,
    borderTopColor: C.tableBorder,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7, color: C.muted },
});

export function flag(dateValue, asOf, dueSoonDays = DUE_SOON_DAYS) {
  if (!dateValue) return "missing";
  const d = moment(dateValue).startOf("day").diff(moment(asOf).startOf("day"), "days");
  if (d < 0) return "expired";
  if (d <= dueSoonDays) return "dueSoon";
  return "ok";
}

export const nextAnnual = (lastDate) =>
  lastDate ? moment(lastDate).add(12, "months").toDate() : null;

const isLessThan12MonthsHired = (p, asOf) =>
  !!p.hireDate && moment(asOf).diff(moment(p.hireDate), "months") < 12;

const fmtDate = (d) => moment(d).format("MM/DD/YYYY");
const fmtMonth = (d) => moment(d).format("MM/YYYY");

function resolveRequired(required, p) {
  if (typeof required === "function") return required(p);
  return required === undefined ? true : required;
}

function dateCell(col, p, asOf) {
  if (col.na && col.na(p)) {
    return { text: "N/A", textStyle: styles.mutedText };
  }
  const displayVal = col.date(p);
  const statusVal = col.statusDate ? col.statusDate(p) : displayVal;

  if (!displayVal) {
    if (col.allowBlank && col.allowBlank(p, asOf)) {
      return { text: "—", textStyle: styles.mutedText };
    }
    if (resolveRequired(col.required, p)) {
      return { text: "MISSING", textStyle: styles.missingText };
    }
    return { text: "—", textStyle: styles.mutedText };
  }

  const formatted = col.monthOnly ? fmtMonth(displayVal) : fmtDate(displayVal);

  if (col.flag) {
    const status = flag(statusVal, asOf, col.dueSoonDays);
    if (status === "expired") {
      return { text: formatted, containerStyle: styles.expiredCell, textStyle: styles.expiredText };
    }
    if (status === "dueSoon") {
      return { text: formatted, containerStyle: styles.dueSoonCell, textStyle: styles.dueSoonText };
    }
    return { text: formatted, textStyle: styles.normalText };
  }

  return { text: formatted, textStyle: styles.normalText };
}

function textCell(col, p) {
  if (col.na && col.na(p)) {
    return { text: "N/A", textStyle: styles.mutedText };
  }
  const v = col.value(p);
  if (v === null || v === undefined || v === "") {
    if (resolveRequired(col.required, p) && col.required !== false) {
      return { text: "MISSING", textStyle: styles.missingText };
    }
    return { text: "N/A", textStyle: styles.mutedText };
  }
  return { text: String(v), textStyle: styles.normalText };
}

function renderCellContent(col, p, asOf) {
  if (col.type === "custom") return col.render(p, asOf);
  if (col.type === "date") return dateCell(col, p, asOf);
  return textCell(col, p);
}

const Cell = ({ col, p, asOf }) => {
  const { text, textStyle, containerStyle } = renderCellContent(col, p, asOf);
  return (
    <View style={[styles.bodyCell, { width: col.width }, containerStyle]}>
      <Text style={textStyle || styles.normalText}>{text}</Text>
    </View>
  );
};

const Legend = () => (
  <View style={styles.legendRow}>
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: C.expiredBg, borderWidth: 1, borderColor: C.expiredTx }]} />
      <Text style={styles.legendText}>Expired</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: C.dueSoonBg, borderWidth: 1, borderColor: C.dueSoonTx }]} />
      <Text style={styles.legendText}>Due within {DUE_SOON_DAYS} days</Text>
    </View>
    <View style={styles.legendItem}>
      <Text style={styles.legendText}>MISSING = required, blank</Text>
    </View>
  </View>
);

const RosterTable = ({ columns, rows, asOf, emptyText, footnote }) => (
  <View>
    <View style={styles.table}>
      <View style={styles.headerRow} fixed>
        {columns.map((col) => (
          <Text key={col.header} style={[styles.headerCell, { width: col.width }]}>
            {col.header}
          </Text>
        ))}
      </View>

      {rows.map((p, index) => (
        <View key={p.id || index} style={index % 2 === 1 ? styles.bodyRowAlt : styles.bodyRow} wrap={false}>
          {columns.map((col) => (
            <Cell key={col.header} col={col} p={p} asOf={asOf} />
          ))}
        </View>
      ))}

      {rows.length === 0 && (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>

    {footnote && (
      <View style={styles.footnote}>
        <Text style={styles.footnoteText}>{footnote}</Text>
      </View>
    )}
    <Legend />
  </View>
);

const RosterPage = ({
  section,
  title,
  lead,
  asOf,
  preparedBy,
  reviewedBy,
  columns,
  rows,
  emptyText,
  footnote,
  summary,
}) => (
  <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
    <View style={styles.headerBar} fixed>
      <View style={styles.brandRow}>
        <Text style={styles.brandDark}>Haloes Touch</Text>
        <Text style={styles.brandMid}> Hospice Inc.</Text>
      </View>
      <View style={styles.pill}>
        <Text style={styles.pillText}>ACHC · HSP1-2A</Text>
      </View>
    </View>

    <View style={styles.content}>
      <View fixed>
        <Text style={styles.kicker}>CLINICAL STAFF ROSTER · SECTION {section}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.lead}>{lead}</Text>
        <Text style={styles.asOfLine}>
          As of: {fmtDate(asOf)}   Prepared by: ______________   Reviewed by (Admin): ______________
        </Text>
      </View>

      <RosterTable columns={columns} rows={rows} asOf={asOf} emptyText={emptyText} footnote={footnote} />

      {summary && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Volunteer hours ({fmtDate(summary.periodStart)} – {fmtDate(summary.periodEnd)}):{" "}
            {summary.volunteerHours.toFixed(1)}
          </Text>
          <Text style={styles.summaryText}>
            Patient care hours: {summary.patientCareHours.toFixed(1)}
          </Text>
          <Text style={summary.percent < 5 ? styles.summaryPercentBad : styles.summaryText}>
            Volunteer %: {summary.percent.toFixed(1)}% (requirement: ≥ 5%)
          </Text>
        </View>
      )}
    </View>

    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>HSP1-2A Clinical Staff Roster · Internal use</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  </Page>
);

// ---------------------------------------------------------------------
// Category / employmentType fallback mapping (section 7 "Prefer an
// explicit category field; the regex is only a fallback.")
// ---------------------------------------------------------------------
const CLINICAL_EMPLOYEE_POSITIONS = [
  "Director of Nurse",
  "Case Manager",
  "Registered Nurse",
  "LPN",
  "MSW",
  "Chaplain",
  "Clinician QA",
];
const AIDE_POSITIONS = ["Certified Nurse Assistant"];
const CONTRACTOR_CLINICAL_POSITIONS = ["Medical Director", "Nurse Practitioner", "Admission Nurse"];
const LEGACY_CONTRACTOR_TYPES = ["Contractor", "Direct-Care Contractor"];
const LEGACY_W2_TYPES = ["Full-Time", "Part-time", "Per Diem"];

function deriveCategory(emp) {
  if (emp.category) return emp.category;
  const position = emp.position || "";
  const employeeType = emp.employeeType || "";
  if (position === "Volunteer" || employeeType === "Volunteer") return "volunteer";
  if (AIDE_POSITIONS.includes(position)) return "aide";
  if (LEGACY_CONTRACTOR_TYPES.includes(employeeType) && CONTRACTOR_CLINICAL_POSITIONS.includes(position)) {
    return "contractor";
  }
  if (CLINICAL_EMPLOYEE_POSITIONS.includes(position) && !LEGACY_CONTRACTOR_TYPES.includes(employeeType)) {
    return "clinical_employee";
  }
  return "admin";
}

function deriveEmploymentType(emp) {
  if (emp.employmentType) return emp.employmentType;
  if (emp.employeeType === "Volunteer") return "Volunteer";
  if (LEGACY_CONTRACTOR_TYPES.includes(emp.employeeType)) return "Contractor";
  if (LEGACY_W2_TYPES.includes(emp.employeeType)) return "W-2";
  return emp.employeeType || null;
}

function deriveSchedule(emp) {
  if (emp.schedule) return emp.schedule;
  return LEGACY_W2_TYPES.includes(emp.employeeType) ? emp.employeeType : "";
}

const ROLE_ORDER = CLINICAL_EMPLOYEE_POSITIONS;
const CONTRACTOR_ROLE_ORDER = CONTRACTOR_CLINICAL_POSITIONS;

// ---------------------------------------------------------------------
// HR Onboarding Checklist fallback (see DATA CONTRACT note above) — the
// only two checklist items that carry a real date.
// ---------------------------------------------------------------------
function licenseFromChecklist(checklist) {
  const item = checklist?.section2?.licenseVerification;
  if (!item || !item.checked) return null;
  return {
    number: item.number || null,
    expirationDate: item.expirationDate || null,
    verifiedDate: item.verifiedDate || null,
  };
}

function cprFromChecklist(checklist) {
  const item = checklist?.section2?.cprCard;
  if (!item || !item.checked) return null;
  return { expirationDate: item.expirationDate || null };
}

function competencyFromChecklist(checklist) {
  const item = checklist?.section3?.competency;
  if (!item || !item.checked || (!item.initialDate && !item.lastDate)) return null;
  return {
    initialDate: item.initialDate || null,
    lastAnnualDate: item.lastDate || item.initialDate || null,
  };
}

function orientationFromChecklist(checklist) {
  const item = checklist?.section3?.orientation;
  if (!item || !item.checked || !item.date) return null;
  return item.date;
}

function contractFromChecklist(checklist) {
  const item = checklist?.section3?.contract;
  if (!item || !item.checked) return null;
  return {
    effectiveDate: item.date || null,
    expirationDate: item.expirationDate || null,
    autoRenew: false,
  };
}

function inserviceHoursFromChecklist(checklist) {
  const item = checklist?.section5?.inserviceHours;
  if (!item || !item.checked || !item.hours) return null;
  const parsed = Number(item.hours);
  return Number.isFinite(parsed) ? parsed : null;
}

function backgroundCheckFromChecklist(checklist) {
  const item = checklist?.section7?.backgroundCheck;
  if (!item || !item.checked || !item.date) return null;
  return item.date;
}

function policyAcknowledgeDateFromChecklist(checklist) {
  return checklist?.section4?.policyAcknowledgeDate || null;
}

function healthScreeningFromChecklist(checklist) {
  const tbCxr = checklist?.section6?.tbCxr;
  if (tbCxr && tbCxr.checked && tbCxr.date) return tbCxr.date;
  const tbQuestionnaire = checklist?.section6?.tbQuestionnaire;
  if (tbQuestionnaire && tbQuestionnaire.checked && tbQuestionnaire.date) {
    return tbQuestionnaire.date;
  }
  return null;
}

function reportToFromChecklist(checklist) {
  const reportTo = checklist?.section1?.reportTo;
  if (!reportTo || !Array.isArray(reportTo) || reportTo.length === 0) {
    return null;
  }
  return reportTo.join(", ");
}

function lastTrainingFromChecklist(checklist) {
  const item = checklist?.section5?.lastTraining;
  if (!item || !item.checked || !item.date) return null;
  return item.date;
}

function lastTrainingTopicFromChecklist(checklist) {
  const item = checklist?.section5?.lastTraining;
  if (!item || !item.checked || !item.topic) return null;
  return item.topic;
}

function toPerson(emp, checklist) {
  const displayName =
    emp.displayName || emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim() || "N/A";
  return {
    ...emp,
    id: emp.id,
    displayName,
    ln: emp.ln || "",
    credentials: emp.credentials || "",
    position: emp.position || "",
    status: emp.status || "",
    hireDate: emp.hireDate || emp.dateHired || null,
    employmentType: deriveEmploymentType(emp),
    workerClassification: emp.workerClassification || null,
    schedule: deriveSchedule(emp),
    category: deriveCategory(emp),
    fileLocation: emp.fileLocation || null,
    license: emp.license || licenseFromChecklist(checklist),
    certification: emp.certification || null,
    competency: emp.competency || competencyFromChecklist(checklist),
    cpr: emp.cpr || cprFromChecklist(checklist),
    contract: emp.contract || contractFromChecklist(checklist),
    service: emp.service || null,
    contractParty: emp.contractParty || null,
    orientationDate: emp.orientationDate || orientationFromChecklist(checklist),
    inserviceHours12mo:
      typeof emp.inserviceHours12mo === "number"
        ? emp.inserviceHours12mo
        : inserviceHoursFromChecklist(checklist),
    supervision: emp.supervision || null,
    volunteerRole: emp.volunteerRole || "Patient Care (Companionship)",
    startDate: emp.hireDate || emp.dateHired || emp.startDate || null,
    backgroundCheckDate: emp.backgroundCheckDate || backgroundCheckFromChecklist(checklist),
    healthScreeningDate:
      emp.healthScreeningDate || healthScreeningFromChecklist(checklist),
    confidentialityDate:
      emp.confidentialityDate || policyAcknowledgeDateFromChecklist(checklist),
    lastInserviceDate: emp.lastInserviceDate || null,
    lastTrainingDate: emp.lastTrainingDate || lastTrainingFromChecklist(checklist),
    lastTrainingTopic: emp.lastTrainingTopic || lastTrainingTopicFromChecklist(checklist),
    supervisorName:
      emp.supervisorName ||
      reportToFromChecklist(checklist) ||
      "Volunteer Coordinator",
    hoursInPeriod: typeof emp.hoursInPeriod === "number" ? emp.hoursInPeriod : null,
  };
}

function sortByRoleThenLastName(rows, roleOrder) {
  return [...rows].sort((a, b) => {
    const ra = roleOrder.indexOf(a.position);
    const rb = roleOrder.indexOf(b.position);
    const sa = ra === -1 ? roleOrder.length : ra;
    const sb = rb === -1 ? roleOrder.length : rb;
    if (sa !== sb) return sa - sb;
    return a.ln.localeCompare(b.ln) || a.displayName.localeCompare(b.displayName);
  });
}

export function buildRosterModel(rawEmployees, options = {}) {
  const asOf = options.asOf || new Date();
  const checklistByEmployeeId = {};
  (options.checklists || []).forEach((c) => {
    if (c && c.employeeId) checklistByEmployeeId[c.employeeId] = c;
  });
  const people = (rawEmployees || [])
    .filter((e) => (e.status || "").toLowerCase() === "active")
    .map((e) => toPerson(e, checklistByEmployeeId[e.id]));

  const clinicalEmployees = sortByRoleThenLastName(
    people.filter((p) => p.employmentType === "W-2" && p.category === "clinical_employee"),
    ROLE_ORDER
  );
  const contractors = sortByRoleThenLastName(
    people.filter((p) => p.employmentType === "Contractor" && p.category === "contractor"),
    CONTRACTOR_ROLE_ORDER
  );
  const aides = sortByRoleThenLastName(
    people.filter((p) => p.category === "aide"),
    []
  );
  const volunteers = sortByRoleThenLastName(
    people.filter((p) => p.category === "volunteer"),
    []
  );

  let volunteerSummary = null;
  if (
    options.patientCareHours != null &&
    options.volunteerHours != null &&
    options.patientCareHours > 0
  ) {
    const percent = (options.volunteerHours / options.patientCareHours) * 100;
    volunteerSummary = {
      periodStart: options.periodStart || moment(asOf).subtract(12, "months").toDate(),
      periodEnd: options.periodEnd || asOf,
      volunteerHours: options.volunteerHours,
      patientCareHours: options.patientCareHours,
      percent,
    };
  }

  return {
    asOf,
    sections: { clinicalEmployees, contractors, aides, volunteers },
    clinicalEmployees,
    contractors,
    aides,
    volunteers,
    volunteerSummary,
  };
}

// ---------------------------------------------------------------------
// Column definitions — section 5 of the spec
// ---------------------------------------------------------------------
const nameCredCol = (width) => ({
  header: "Name & credentials",
  width,
  type: "text",
  required: false,
  value: (p) => `${p.displayName}${p.credentials ? ", " + p.credentials : ""}`,
});

const clinicalEmployeeColumns = [
  nameCredCol("13%"),
  { header: "Discipline / position", width: "11%", type: "text", required: false, value: (p) => p.position },
  {
    header: "Employment type",
    width: "9%",
    type: "text",
    required: false,
    value: (p) => p.workerClassification || "N/A",
  },
  { header: "Hire date", width: "7%", type: "date", required: false, date: (p) => p.hireDate },
  {
    header: "License #",
    width: "8%",
    type: "text",
    na: (p) => p.position === "Chaplain" || !p.license,
    required: true,
    value: (p) => p.license?.number,
  },
  {
    header: "License exp.",
    width: "7.5%",
    type: "date",
    flag: true,
    na: (p) => p.position === "Chaplain" || !p.license,
    required: true,
    date: (p) => p.license?.expirationDate,
  },
  {
    header: "Verified",
    width: "7.5%",
    type: "date",
    na: (p) => p.position === "Chaplain" || !p.license,
    required: (p) => p.position !== "Chaplain",
    date: (p) => p.license?.verifiedDate,
  },
  {
    header: "Initial comp.",
    width: "7.5%",
    type: "date",
    na: (p) => !p.competency,
    required: true,
    date: (p) => p.competency?.initialDate,
  },
  {
    header: "Last annual comp.",
    width: "7.5%",
    type: "date",
    na: (p) => !p.competency,
    allowBlank: (p, asOf) => isLessThan12MonthsHired(p, asOf),
    required: (p) => true,
    date: (p) => p.competency?.lastAnnualDate,
  },
  {
    header: "Next due",
    width: "6.5%",
    type: "date",
    flag: true,
    monthOnly: true,
    na: (p) => !p.competency,
    required: true,
    date: (p) => nextAnnual(p.competency?.lastAnnualDate ?? p.competency?.initialDate),
  },
  {
    header: "CPR exp.",
    width: "7%",
    type: "date",
    flag: true,
    na: (p) => !p.cpr,
    required: true,
    date: (p) => p.cpr?.expirationDate,
  },
  {
    header: "File",
    width: "5.5%",
    type: "text",
    required: false,
    value: (p) => p.fileLocation || "HSP4",
  },
];

const contractorColumns = [
  nameCredCol("14%"),
  { header: "Service", width: "11%", type: "text", required: true, value: (p) => p.position },
  {
    header: "Company / individual",
    width: "11%",
    type: "text",
    required: false,
    value: (p) => p.contractParty || "Individual",
  },
  {
    header: "Contract date",
    width: "9%",
    type: "date",
    required: true,
    date: (p) => (p.contract ? p.contract.effectiveDate : p.hireDate),
  },
  {
    header: "Contract exp.",
    width: "9%",
    type: "custom",
    render: (p, asOf) => {
      if (!p.contract) {
        return { text: "N/A", textStyle: styles.mutedText };
      }
      if (p.contract.autoRenew) {
        return { text: "Auto-renew", textStyle: styles.normalText };
      }
      return dateCell(
        { flag: true, required: true, date: (pp) => pp.contract?.expirationDate },
        p,
        asOf
      );
    },
  },
  {
    header: "License #",
    width: "9%",
    type: "text",
    na: (p) => !p.license,
    required: false,
    value: (p) => p.license?.number,
  },
  {
    header: "License exp.",
    width: "9%",
    type: "date",
    flag: true,
    na: (p) => !p.license,
    required: false,
    date: (p) => p.license?.expirationDate,
  },
  {
    header: "Verified",
    width: "9%",
    type: "date",
    na: (p) => !p.license,
    required: false,
    date: (p) => p.license?.verifiedDate,
  },
  {
    header: "Orientation",
    width: "10%",
    type: "date",
    required: true,
    date: (p) => p.orientationDate,
  },
  {
    header: "File",
    width: "9%",
    type: "text",
    required: false,
    value: (p) => p.fileLocation || "HSP1",
  },
];

const aideColumns = [
  nameCredCol("13%"),
  {
    header: "Employment type",
    width: "10%",
    type: "text",
    required: false,
    value: (p) => p.workerClassification || "N/A",
  },
  { header: "Hire date", width: "8%", type: "date", required: false, date: (p) => p.hireDate },
  {
    header: "License #",
    width: "10%",
    type: "text",
    na: (p) => !p.license,
    required: true,
    value: (p) => p.license?.number,
  },
  {
    header: "License exp.",
    width: "8%",
    type: "date",
    flag: true,
    na: (p) => !p.license,
    required: true,
    date: (p) => p.license?.expirationDate,
  },
  {
    header: "Verified",
    width: "8%",
    type: "date",
    na: (p) => !p.license,
    required: (p) => !!p.license,
    date: (p) => p.license?.verifiedDate,
  },
  {
    header: "Competency evaluation",
    width: "11%",
    type: "date",
    na: (p) => !p.competency,
    required: true,
    date: (p) => p.competency?.initialDate,
  },
  {
    header: "In-service hrs (last 12 mo.)",
    width: "11%",
    type: "custom",
    render: (p, asOf) => {
      const hrs = p.inserviceHours12mo;
      if (hrs === null) return { text: "MISSING", textStyle: styles.missingText };
      const text = `${hrs.toFixed(1)} / 12`;
      const low = hrs < 12 && !isLessThan12MonthsHired(p, asOf);
      return low
        ? { text, containerStyle: styles.expiredCell, textStyle: styles.expiredText }
        : { text, textStyle: styles.normalText };
    },
  },
  {
    header: "Annual on-site supervision",
    width: "12%",
    type: "date",
    flag: true,
    statusDate: (p) => nextAnnual(p.supervision?.lastAnnualDate),
    allowBlank: (p, asOf) => isLessThan12MonthsHired(p, asOf),
    required: true,
    date: (p) => p.supervision?.lastAnnualDate,
  },
  {
    header: "File",
    width: "9%",
    type: "text",
    required: false,
    value: (p) => p.fileLocation || "HSP4",
  },
];

const volunteerColumns = [
  { header: "Name", width: "12%", type: "text", required: false, value: (p) => p.displayName },
  {
    header: "Volunteer role",
    width: "13%",
    type: "text",
    required: false,
    value: (p) => p.volunteerRole,
  },
  { header: "Start date", width: "8%", type: "date", required: false, date: (p) => p.hireDate },
  {
    header: "Orientation & training",
    width: "10%",
    type: "date",
    na: (p) => !p.orientationDate,
    required: true,
    date: (p) => p.orientationDate,
  },
  {
    header: "Background check",
    width: "10%",
    type: "date",
    na: (p) => !p.backgroundCheckDate,
    required: false,
    date: (p) => p.backgroundCheckDate,
  },
  {
    header: "Health screening",
    width: "9%",
    type: "date",
    required: false,
    date: (p) => p.healthScreeningDate,
  },
  {
    header: "Confidentiality / HIPAA",
    width: "10%",
    type: "date",
    na: (p) => !p.confidentialityDate,
    required: false,
    date: (p) => p.confidentialityDate,
  },
  {
    header: "Last Training",
    width: "9%",
    type: "custom",
    render: (p, asOf) => {
      const cell = dateCell(
        {
          na: (pp) => !pp.lastTrainingDate,
          flag: true,
          statusDate: (pp) => nextAnnual(pp.lastTrainingDate),
          required: true,
          date: (pp) => pp.lastTrainingDate,
        },
        p,
        asOf
      );
      if (p.lastTrainingTopic) {
        return { ...cell, text: `${cell.text}\n${p.lastTrainingTopic}` };
      }
      return cell;
    },
  },
  {
    header: "Supervisor",
    width: "10%",
    type: "text",
    required: false,
    value: (p) => p.supervisorName,
  },
  {
    header: "Hours (period)",
    width: "9%",
    type: "text",
    required: false,
    value: (p) => (typeof p.hoursInPeriod === "number" ? p.hoursInPeriod.toFixed(1) : null),
  },
];

const LEADS = {
  A:
    "Active Haloes Touch employees providing core services. Every clinician is a W-2 employee with a current, verified license and current competency.",
  B:
    "Active contracted clinical staff. Haloes Touch keeps responsibility for contracted services, so licenses are verified here too.",
  C: "Active hospice aides, with certification, competency, in-service hours, and annual supervision.",
  D: "Active volunteers, with screening, training, supervision, and hours for the period.",
};

const NOTES = {
  A:
    "Core services (nursing, medical social services, spiritual counseling) must be provided by Haloes Touch employees. License verification is the date of the primary-source check on the state board website; the printout is in each personnel file. Chaplain: no state license; ordination/credentials are on file.",
  B:
    "Non-core and physician services may be contracted, but Haloes Touch keeps professional and administrative responsibility for them. Each contract is listed in the contract log (HSP1); licenses are verified the same way as for employees.",
  C:
    "Aides are checked under the aide standards: competency evaluation before independent care, at least 12 hours of in-service in each 12-month period, and annual on-site supervision while giving care. The 14-day supervisory visits are per patient and are shown in the chart samples, not here.",
  D:
    "Volunteers are neither employees nor contractors. Haloes Touch Hospice checks that each volunteer was screened, trained before working with patients or families, and supervised. Hours are kept in a separate hours log; volunteer hours must equal at least 5% of total patient care hours.",
};

const TITLES = {
  A: "Clinical Employees (Core Services)",
  B: "Contracted Clinical Staff",
  C: "Hospice Aides",
  D: "Volunteers",
};

const RosterDocument = ({
  employeesData,
  checklistsData,
  asOf,
  patientCareHours,
  volunteerHours,
  periodStart,
  periodEnd,
}) => {
  const reportDate = asOf || new Date();
  const model = buildRosterModel(employeesData, {
    asOf: reportDate,
    checklists: checklistsData,
    patientCareHours,
    volunteerHours,
    periodStart,
    periodEnd,
  });

  return (
    <Document
      title={`HSP1-2A Clinical Staff Roster – ${fmtDate(reportDate)}`}
      author="Haloes Touch Hospice Inc."
    >
      <RosterPage
        section="A"
        title={TITLES.A}
        lead={LEADS.A}
        asOf={reportDate}
        columns={clinicalEmployeeColumns}
        rows={model.clinicalEmployees}
        emptyText={`No active clinical employees as of ${fmtDate(reportDate)}.`}
        footnote={NOTES.A}
      />
      <RosterPage
        section="B"
        title={TITLES.B}
        lead={LEADS.B}
        asOf={reportDate}
        columns={contractorColumns}
        rows={model.contractors}
        emptyText={`No active contracted clinical staff as of ${fmtDate(reportDate)}.`}
        footnote={NOTES.B}
      />
      <RosterPage
        section="C"
        title={TITLES.C}
        lead={LEADS.C}
        asOf={reportDate}
        columns={aideColumns}
        rows={model.aides}
        emptyText={`No active hospice aides as of ${fmtDate(reportDate)}.`}
        footnote={NOTES.C}
      />
      <RosterPage
        section="D"
        title={TITLES.D}
        lead={LEADS.D}
        asOf={reportDate}
        columns={volunteerColumns}
        rows={model.volunteers}
        emptyText={`No active volunteers as of ${fmtDate(reportDate)}.`}
        footnote={NOTES.D}
        summary={model.volunteerSummary}
      />
    </Document>
  );
};

export default RosterDocument;

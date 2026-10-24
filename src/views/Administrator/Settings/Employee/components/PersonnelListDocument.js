import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";
import { EMPLOYEE_POSITION } from "utils/constants";

const NAVY = "#153348";
const ACCENT = "#26935B";
const TITLE_MINT = "#8EDFB5";
const NAVY_SOFT = "#9FB0C3";
const MUTED = "#64748B";
const RULE = "#D9DEE6";
const INK = "#1C2430";
const LIGHTBG = "#F4F6F8";
const TOTALS_BG = "#E8F4ED";
const TOTALS_TEXT = "#1F6B46";

const POSITION_DISCIPLINE = EMPLOYEE_POSITION.reduce((map, p) => {
  map[p.value] = p.alias || p.value;
  return map;
}, {});

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
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: TITLE_MINT,
    letterSpacing: 0.3,
    marginTop: 6,
  },
  headerSubLine: {
    fontSize: 8.5,
    color: NAVY_SOFT,
    marginTop: 6,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerRightLabel: {
    fontSize: 7.5,
    color: NAVY_SOFT,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRightValue: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  headerRightCcn: {
    fontSize: 8.5,
    color: NAVY_SOFT,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 28,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: LIGHTBG,
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryBar: {
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: NAVY,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.3,
  },
  sectionHeaderNote: {
    fontSize: 7.5,
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
    backgroundColor: ACCENT,
  },
  th: {
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
  td: {
    fontSize: 8,
    color: NAVY,
    paddingVertical: 7,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  tdName: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
    paddingVertical: 7,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  tdStatusCell: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: TOTALS_BG,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusBadgeText: {
    fontSize: 7,
    fontWeight: "bold",
    color: TOTALS_TEXT,
    letterSpacing: 0.3,
  },
  colIndex: { width: "4%" },
  colName: { width: "20%" },
  colPosition: { width: "19%" },
  colDiscipline: { width: "16%" },
  colStartDate: { width: "13%" },
  colClassification: { width: "15%" },
  colStatus: { width: "13%" },
  scopeBox: {
    backgroundColor: TOTALS_BG,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  scopeTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  scopeText: {
    fontSize: 7.5,
    color: INK,
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

const NO_DISCIPLINE_POSITIONS = [
  "CEO",
  "Office Staff",
  "Administrative Manager",
  "Administrator",
  "Director Community Liaison",
];

const getDiscipline = (position) => {
  if (NO_DISCIPLINE_POSITIONS.includes(position)) return "-";
  return POSITION_DISCIPLINE[position] || position || "N/A";
};

const buildPersonnelRegister = (employeesData) => {
  const activeEmployees = (employeesData || []).filter(
    (emp) => (emp.status || "").toLowerCase() === "active"
  );

  const rows = activeEmployees
    .map((emp) => ({
      name: emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim() || "N/A",
      position: emp.position || "N/A",
      discipline: getDiscipline(emp.position),
      startDate: emp.dateHired ? moment(emp.dateHired).format("MM/DD/YYYY") : "N/A",
      classification: emp.employeeType || "N/A",
      status: emp.status || "N/A",
      isContractor:
        emp.position === "Contractor" ||
        emp.employeeType === "Contractor" ||
        emp.employeeType === "Direct-Care Contractor",
      isVolunteer: emp.position === "Volunteer" || emp.employeeType === "Volunteer",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeEmployeeCount = rows.filter((r) => !r.isContractor && !r.isVolunteer).length;
  const directCareContractors = rows.filter((r) => r.isContractor).length;
  const activeVolunteers = rows.filter((r) => r.isVolunteer).length;
  const totalPersonnel = rows.length;

  return { rows, activeEmployeeCount, directCareContractors, activeVolunteers, totalPersonnel };
};

const PersonnelListDocument = ({ employeesData, ccn, preparedBy, reviewedBy }) => {
  const { rows, activeEmployeeCount, directCareContractors, activeVolunteers, totalPersonnel } =
    buildPersonnelRegister(employeesData);

  const reportDate = moment().format("MMMM D, YYYY");

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerBand} fixed>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.headerEyebrow}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerTitle}>
                CURRENT PERSONNEL, CONTRACT STAFF &amp; VOLUNTEER ROSTER
              </Text>
              <Text style={styles.headerSubLine}>
                ACHC Medicare Recertification Survey &nbsp;|&nbsp; Personnel &amp; Staffing
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>REPORT AS OF</Text>
            <Text style={styles.headerRightValue}>{reportDate}</Text>
            <Text style={styles.headerRightCcn}>CCN: {ccn || "____________"}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryBar} />
              <Text style={styles.summaryLabel}>ACTIVE EMPLOYEES</Text>
              <Text style={styles.summaryValue}>{activeEmployeeCount}</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryBar} />
              <Text style={styles.summaryLabel}>DIRECT-CARE CONTRACTORS</Text>
              <Text style={styles.summaryValue}>{directCareContractors}</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryBar} />
              <Text style={styles.summaryLabel}>ACTIVE VOLUNTEERS</Text>
              <Text style={styles.summaryValue}>{activeVolunteers}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <View style={styles.summaryBar} />
              <Text style={styles.summaryLabel}>TOTAL PERSONNEL</Text>
              <Text style={styles.summaryValue}>{totalPersonnel}</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>PERSONNEL REGISTER</Text>
            <Text style={styles.sectionHeaderNote}>
              Active personnel as of {reportDate}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow} fixed>
              <Text style={[styles.th, styles.colIndex]}>#</Text>
              <Text style={[styles.th, styles.colName]}>PERSONNEL NAME</Text>
              <Text style={[styles.th, styles.colPosition]}>POSITION / TITLE</Text>
              <Text style={[styles.th, styles.colDiscipline]}>DISCIPLINE</Text>
              <Text style={[styles.th, styles.colStartDate]}>START DATE</Text>
              <Text style={[styles.th, styles.colClassification]}>CLASSIFICATION</Text>
              <Text style={[styles.th, styles.colStatus]}>STATUS</Text>
            </View>

            {rows.map((row, index) => (
              <View
                key={index}
                style={index % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
                wrap={false}
              >
                <Text style={[styles.td, styles.colIndex]}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={[styles.tdName, styles.colName]}>{row.name}</Text>
                <Text style={[styles.td, styles.colPosition]}>{row.position}</Text>
                <Text style={[styles.td, styles.colDiscipline]}>{row.discipline}</Text>
                <Text style={[styles.td, styles.colStartDate]}>{row.startDate}</Text>
                <Text style={[styles.td, styles.colClassification]}>
                  {row.classification}
                </Text>
                <View style={[styles.tdStatusCell, styles.colStatus]}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {row.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {rows.length === 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.td, { width: "100%", textAlign: "center" }]}>
                  No active personnel records found.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.scopeBox}>
            <Text style={styles.scopeTitle}>REPORT SCOPE</Text>
            <Text style={styles.scopeText}>
              Current active employees, contracted direct-care personnel and
              volunteers as of the report date.
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
              `Confidential personnel information  |  Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default PersonnelListDocument;

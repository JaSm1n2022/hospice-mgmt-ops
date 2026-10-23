import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const NAVY = "#152238";
const NAVY_SOFT = "#9FB0C3";
const ACCENT = "#2BAE76";
const AMBER = "#C9971F";
const MUTED = "#64748B";
const RULE = "#D9DEE6";
const INK = "#1C2430";
const LIGHTBG = "#F3F6FA";
const ZEBRA = "#EEF2F7";
const CONFIRMED_BG = "#D9F2E3";
const CONFIRMED_TEXT = "#176B43";
const PROJECTED_BG = "#FBEAC6";
const PROJECTED_TEXT = "#8A6116";
const NEEDS_BG = "#ECECEC";
const NEEDS_TEXT = "#5A5A5A";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 28,
    paddingBottom: 56,
    fontFamily: "Helvetica",
  },
  headerBand: {
    backgroundColor: NAVY,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 20,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: ACCENT,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  headerSubLine: {
    fontSize: 7,
    color: NAVY_SOFT,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerRightLabel: {
    fontSize: 7,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRightValue: {
    fontSize: 8,
    color: NAVY_SOFT,
    marginTop: 4,
  },
  headerAccentBar: {
    height: 4,
    backgroundColor: ACCENT,
    marginBottom: 14,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: LIGHTBG,
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
    fontSize: 11,
    color: NAVY,
    fontWeight: "bold",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: MUTED,
    letterSpacing: 0.4,
    marginRight: 10,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendText: {
    fontSize: 7,
    color: INK,
  },
  legendNote: {
    fontSize: 7,
    color: MUTED,
    marginLeft: "auto",
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
    fontSize: 7,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.3,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  colPatient: { width: "22%" },
  colDiscipline: { width: "19%" },
  colFrequency: { width: "12%" },
  colDates: { width: "47%" },
  disciplineRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  td: {
    fontSize: 8,
    color: INK,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  patientName: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
  },
  patientNameSub: {
    fontSize: 7.5,
    color: INK,
    marginTop: 1,
  },
  careLocation: {
    fontSize: 7,
    color: MUTED,
    fontStyle: "italic",
    marginTop: 1,
  },
  disciplineLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: INK,
  },
  staffName: {
    fontSize: 7,
    color: MUTED,
    marginTop: 1,
  },
  frequencyText: {
    fontSize: 8,
    color: INK,
  },
  datesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 6.5,
    fontWeight: "bold",
  },
  needsChip: {
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: NEEDS_BG,
  },
  needsChipText: {
    fontSize: 6.5,
    fontStyle: "italic",
    color: NEEDS_TEXT,
  },
  emptyText: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic",
    padding: 14,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 28,
    right: 28,
  },
  signatureRow: {
    flexDirection: "row",
    marginBottom: 8,
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
    height: 14,
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
  disclaimerRow: {
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disclaimerText: {
    fontSize: 7,
    color: MUTED,
    fontStyle: "italic",
    maxWidth: "85%",
  },
  footerPage: {
    fontSize: 7,
    color: MUTED,
  },
});

const DateChip = ({ date, status }) => {
  const isPast = moment(date).isBefore(moment(), "day");
  const isConfirmed = status === "confirmed" || isPast;
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: isConfirmed ? CONFIRMED_BG : PROJECTED_BG,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: isConfirmed ? CONFIRMED_TEXT : PROJECTED_TEXT },
        ]}
      >
        {moment(date).format("MMM D")}
      </Text>
    </View>
  );
};

const PatientScheduledVisitsDocument = ({
  scheduleData,
  ccn,
  preparedBy,
  reviewedBy,
}) => {
  const data = scheduleData || {};
  const patients = data.patients || [];
  const periodStart = data.periodStart
    ? moment(data.periodStart).format("MMM D")
    : "";
  const periodEnd = data.periodEnd
    ? moment(data.periodEnd).format("MMM D, YYYY")
    : "";

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
                CURRENT PATIENT VISIT SCHEDULE
              </Text>
              <Text style={styles.headerSubLine}>
                ACHC SURVEY / 30-DAY SCHEDULE
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
        <View style={styles.headerAccentBar} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>SCHEDULE PERIOD</Text>
            <Text style={styles.summaryValue}>
              {periodStart} – {periodEnd}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>PATIENTS SHOWN</Text>
            <Text style={styles.summaryValue}>{data.totalPatients || 0}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>CONFIRMED VISITS</Text>
            <Text style={styles.summaryValue}>{data.totalConfirmed || 0}</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxLast]}>
            <Text style={styles.summaryLabel}>PROJECTED VISITS</Text>
            <Text style={styles.summaryValue}>{data.totalProjected || 0}</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>VISIT STATUS</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: ACCENT }]} />
            <Text style={styles.legendText}>
              Confirmed — entered in schedule
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: AMBER }]} />
            <Text style={styles.legendText}>
              Projected — based on visit pattern
            </Text>
          </View>
          <Text style={styles.legendNote}>
            Dates are grouped by patient and discipline
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <Text style={[styles.th, styles.colPatient]}>
              PATIENT / CARE LOCATION
            </Text>
            <Text style={[styles.th, styles.colDiscipline]}>
              DISCIPLINE / STAFF
            </Text>
            <Text style={[styles.th, styles.colFrequency]}>
              POC FREQUENCY
            </Text>
            <Text style={[styles.th, styles.colDates]}>
              VISIT DATES • STATUS
            </Text>
          </View>

          {patients.length === 0 ? (
            <Text style={styles.emptyText}>
              No active patients with applicable discipline assignments were
              found for this schedule period.
            </Text>
          ) : (
            patients.map((patient, pIdx) =>
              (patient.disciplines || []).map((d, dIdx) => (
                <View
                  key={`${patient.id}-${dIdx}`}
                  style={[
                    styles.disciplineRow,
                    pIdx % 2 === 1 ? { backgroundColor: ZEBRA } : {},
                  ]}
                  wrap={false}
                >
                  <View style={styles.colPatient}>
                    {dIdx === 0 ? (
                      <>
                        <Text style={styles.patientName}>
                          {patient.patientName || patient.patientCd}
                        </Text>
                        {patient.careLocation ? (
                          <Text style={styles.careLocation}>
                            {patient.careLocation}
                          </Text>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                  <View style={styles.colDiscipline}>
                    <Text style={styles.disciplineLabel}>
                      {d.disciplinePosition}
                    </Text>
                    <Text style={styles.staffName}>
                      {d.disciplineName || "Unassigned"}
                    </Text>
                  </View>
                  <Text style={[styles.td, styles.colFrequency]}>
                    {d.frequencyLabel}
                  </Text>
                  <View style={styles.colDates}>
                    {d.needsConfirmation ? (
                      <View style={styles.needsChip}>
                        <Text style={styles.needsChipText}>
                          Needs Scheduling Confirmation
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.datesWrap}>
                        {(d.visits || []).map((v, vIdx) => (
                          <DateChip
                            key={vIdx}
                            date={v.date}
                            status={v.status}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))
            )
          )}
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.signatureRow}>
            <View style={styles.signatureCol}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{preparedBy || ""}</Text>
              </View>
              <Text style={styles.signatureLabel}>PREPARED BY</Text>
            </View>
            <View style={styles.signatureCol}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{reviewedBy || ""}</Text>
              </View>
              <Text style={styles.signatureLabel}>REVIEWED BY</Text>
            </View>
            <View style={[styles.signatureCol, styles.signatureColLast]}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>
                  {moment().format("MM/DD/YYYY hh:mm A")}
                </Text>
              </View>
              <Text style={styles.signatureLabel}>GENERATED</Text>
            </View>
          </View>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerText}>
              Confirmed dates are sourced from the scheduling system.
              Projected dates are auto-generated from assignment frequency and
              suggested visit days and require staff verification prior to
              ACHC survey submission.
            </Text>
            <Text
              style={styles.footerPage}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PatientScheduledVisitsDocument;

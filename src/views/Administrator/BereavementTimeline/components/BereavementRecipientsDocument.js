import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import docLogo from "assets/img/doclogo.png";

const NAVY = "#153348";
const ACCENT = "#26935B";
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
  headerSubtitle: {
    fontSize: 8,
    color: "#C9D4E0",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerRightLabel: {
    fontSize: 8,
    color: "#C9D4E0",
    letterSpacing: 0.4,
  },
  headerRightValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 2,
  },
  titleBand: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: ACCENT,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: NAVY,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: "bold",
    color: ACCENT,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 28,
  },
  infoBand: {
    backgroundColor: TOTALS_BG,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 14,
    flexDirection: "row",
  },
  infoLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.3,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 9,
    color: INK,
  },
  table: {
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: ACCENT,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 7.5,
    fontWeight: "bold",
    letterSpacing: 0.3,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  tableRowAlt: {
    backgroundColor: LIGHTBG,
  },
  tableCell: {
    fontSize: 7.5,
    color: INK,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableCellMuted: {
    fontSize: 7.5,
    color: MUTED,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  colIdx: { width: "5%" },
  colName: { width: "24%" },
  colRecipient: { width: "20%" },
  colRelationship: { width: "14%" },
  colLastLetter: { width: "13%" },
  colType: { width: "10%" },
  colDod: { width: "14%" },
  emptyRow: {
    paddingVertical: 14,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 9,
    color: MUTED,
    fontStyle: "italic",
  },
  preparedBand: {
    backgroundColor: ACCENT,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginTop: 22,
  },
  preparedBandText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
  preparedBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: RULE,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  preparedName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: NAVY,
  },
  preparedRole: {
    fontSize: 8,
    color: MUTED,
    marginTop: 2,
  },
  preparedDateLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 14,
  },
  preparedDateLine: {
    borderTopWidth: 1,
    borderTopColor: NAVY,
    width: 140,
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
    justifyContent: "center",
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
  },
});

const formatDate = (date) => (date ? moment(date).format("MM/DD/YYYY") : "N/A");

const BereavementRecipientsDocument = ({
  recipients,
  startDate,
  endDate,
  ccn,
  preparedBy,
}) => {
  const rows = recipients || [];
  const periodLabel = `${moment(startDate).format("MMMM D, YYYY")} \u2013 ${moment(
    endDate
  ).format("MMMM D, YYYY")}`;

  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerAvatar}>
              <Image src={docLogo} cache={false} style={styles.headerAvatarImage} />
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.headerEyebrow}>HALOES TOUCH HOSPICE INC.</Text>
              <Text style={styles.headerSubtitle}>
                ACHC Medicare Recertification Survey
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLabel}>CCN</Text>
            <Text style={styles.headerRightValue}>
              {ccn || "____________"}
            </Text>
          </View>
        </View>

        <View style={styles.titleBand}>
          <Text style={styles.titleText}>Bereavement Services Recipient List</Text>
          <Text style={styles.subtitleText}>
            {moment(endDate).diff(moment(startDate), "months") >= 11
              ? "Past 12 Months"
              : "Selected Date Range"}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoBand}>
            <Text style={styles.infoLabel}>REPORTING PERIOD:</Text>
            <Text style={styles.infoValue}>{periodLabel}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow} fixed>
              <Text style={[styles.tableHeaderCell, styles.colIdx]}>#</Text>
              <Text style={[styles.tableHeaderCell, styles.colName]}>
                DECEASED PATIENT
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colRecipient]}>
                RECIPIENT
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colRelationship]}>
                RELATIONSHIP
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colLastLetter]}>
                LAST LETTER
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colType]}>
                TYPE
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colDod]}>
                DATE OF DEATH
              </Text>
            </View>

            {rows.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>
                  No bereavement recipients found for the selected date range.
                </Text>
              </View>
            ) : (
              rows.map((row, idx) => (
                <View
                  key={idx}
                  style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                  wrap={false}
                >
                  <Text style={[styles.tableCellMuted, styles.colIdx]}>
                    {idx + 1}
                  </Text>
                  <Text style={[styles.tableCell, styles.colName]}>
                    {row.patientName}
                  </Text>
                  <Text style={[styles.tableCell, styles.colRecipient]}>
                    {row.bereavementRecipientName || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colRelationship]}>
                    {row.bereavementRecipientRelationship || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colLastLetter]}>
                    {formatDate(row.lastLetterDate)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colType]}>
                    {row.bereavementType || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDod]}>
                    {formatDate(row.dateOfDeath)}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.preparedBand}>
            <Text style={styles.preparedBandText}>PREPARED BY</Text>
          </View>
          <View style={styles.preparedBody}>
            <View>
              <Text style={styles.preparedName}>
                {preparedBy || "_______________________"}
              </Text>
              <Text style={styles.preparedRole}>
                Administrator | Haloes Touch Hospice Inc.
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.preparedDateLabel}>
                Date Prepared: {moment().format("MM/DD/YYYY")}
              </Text>
              <View style={styles.preparedDateLine} />
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `ACHC Survey Preparation  \u2022  Bereavement Recipient Register  \u2022  Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default BereavementRecipientsDocument;

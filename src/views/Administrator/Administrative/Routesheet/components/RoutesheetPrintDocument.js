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
  Circle,
  Path,
} from "@react-pdf/renderer";
import moment from "moment";
import { CLIENT_SERVICES } from "utils/constants";

// Using built-in fonts to avoid browser compatibility issues
// Helvetica (sans-serif) and Times-Roman (serif) are used throughout

// Color palette
const C = {
  ink: "#242A27",
  muted: "#6F6C64",
  faint: "#9C988E",
  terra: "#C15E38",
  terraSoft: "#F4E7DF",
  gold: "#B58A34",
  brandGreen: "#20443B",
  sage: "#2E7D6E",
  line: "#E4DED2",
  lineSoft: "#EFEADF",
  head: "#F5F0E7",
  tint: "#FBF8F2",
  white: "#FFFFFF",
};

// Column widths
const W = {
  client: "13%",
  code: "8%",
  date: "11%",
  tin: "8%",
  tout: "8%",
  sig: "15%",
  rate: "9%",
  cmt: "28%",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingRight: 40,
    paddingBottom: 30,
    paddingLeft: 40,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: C.ink,
    backgroundColor: C.white,
  },

  // header image
  headerImage: {
    width: "100%",
    height: 80,
    objectFit: "contain",
    marginBottom: 15,
  },

  // masthead
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: { flexDirection: "row", alignItems: "center" },
  wm: { marginLeft: 8 },
  wmName: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: C.brandGreen,
  },
  wmTag: {
    fontFamily: "Helvetica",
    fontSize: 5,
    letterSpacing: 2.4,
    color: C.faint,
    marginTop: 2,
  },
  contact: { textAlign: "right", fontSize: 5.6, color: C.muted, lineHeight: 1.5 },
  contactOrg: {
    fontFamily: "Helvetica",
    fontSize: 6.2,
    color: "#33372F",
  },
  rule: { height: 1, backgroundColor: C.line, marginTop: 9 },

  // title
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 12,
  },
  eyebrow: {
    fontFamily: "Helvetica",
    fontSize: 6,
    letterSpacing: 2.4,
    color: C.terra,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 24,
    color: C.brandGreen,
    marginTop: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: "Times-Roman",
    fontStyle: "italic",
    fontSize: 9.5,
    color: C.terra,
    marginTop: 3,
  },
  periodLbl: {
    fontSize: 5.4,
    letterSpacing: 1.8,
    color: C.faint,
    textTransform: "uppercase",
    textAlign: "right",
  },
  periodVal: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: C.ink,
    marginTop: 2,
    textAlign: "right",
  },

  // staff card
  staff: {
    marginTop: 12,
    flexDirection: "row",
    border: `1 solid ${C.line}`,
    borderRadius: 8,
    minHeight: 44,
  },
  mono: {
    width: 78,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.terraSoft,
    borderRight: `1 solid ${C.line}`,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  monoTxt: { fontFamily: "Times-Roman", fontSize: 18, color: C.terra },
  sf: { flex: 1, paddingVertical: 9, paddingHorizontal: 14, justifyContent: "center" },
  sfDiv: { borderLeft: `1 solid ${C.lineSoft}` },
  k: {
    fontSize: 5.6,
    letterSpacing: 1.8,
    color: C.faint,
    textTransform: "uppercase",
  },
  v: { fontFamily: "Times-Roman", fontSize: 11.5, color: C.ink, marginTop: 3 },
  vCred: { fontFamily: "Helvetica", fontSize: 7, color: C.terra },

  // section header
  sec: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 7 },
  secNo: { fontFamily: "Times-Roman", fontSize: 9, color: C.terra, marginRight: 6 },
  secH: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#33372F",
    marginRight: 6,
  },
  secFill: { flex: 1, height: 1, backgroundColor: C.line },

  // table
  tHead: {
    flexDirection: "row",
    backgroundColor: C.head,
    borderTop: `1 solid ${C.line}`,
    borderBottom: `1 solid ${C.line}`,
    borderLeft: `1 solid ${C.line}`,
    borderRight: `1 solid ${C.line}`,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontFamily: "Helvetica",
    fontSize: 5.6,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#4A4E45",
  },
  tRow: { flexDirection: "row" },
  tRowFilled: { backgroundColor: C.tint },
  td: {
    minHeight: 18,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 6.6,
    justifyContent: "center",
    borderBottom: `1 solid ${C.lineSoft}`,
    borderLeft: `1 solid ${C.lineSoft}`,
  },
  tdFirst: { borderLeft: `1 solid ${C.line}` },
  tdLast: { borderRight: `1 solid ${C.line}` },
  ctr: { textAlign: "center" },
  right: { textAlign: "right" },
  client: { fontFamily: "Helvetica", color: C.ink },
  cmt: { color: C.muted },
  sig: { fontFamily: "Times-Roman", fontStyle: "italic", fontSize: 8, color: C.brandGreen },
  chip: {
    alignSelf: "flex-start",
    fontFamily: "Helvetica",
    fontSize: 6,
    color: "#33372F",
    border: `1 solid ${C.line}`,
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  chipFilled: { borderColor: C.terra, color: C.terra },
  signatureImage: {
    height: 16,
    objectFit: "contain",
  },

  // total
  total: { flexDirection: "row", justifyContent: "flex-end", marginTop: 9 },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    border: `1 solid ${C.line}`,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: C.tint,
  },
  totalLbl: {
    fontSize: 6,
    letterSpacing: 2,
    color: C.faint,
    textTransform: "uppercase",
    marginRight: 14,
  },
  totalAmt: { fontFamily: "Times-Roman", fontSize: 16, color: C.brandGreen },
  totalCur: { fontSize: 10, color: C.terra },

  // reference
  codes: { border: `1 solid ${C.line}`, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10 },
  codeGrid: { flexDirection: "row", flexWrap: "wrap" },
  ci: { width: "25%", flexDirection: "row", alignItems: "center", paddingVertical: 2.5, paddingHorizontal: 4 },
  ciCode: {
    fontFamily: "Helvetica",
    fontSize: 6,
    color: "#33372F",
    border: `1 solid ${C.line}`,
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 4,
    textAlign: "center",
    minWidth: 26,
    marginRight: 6,
  },
  ciDesc: { fontSize: 6.2, color: C.muted },

  // footer
  foot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTop: `1 solid ${C.line}`,
  },
  footC: { fontSize: 5.4, color: C.faint },
  footB: { fontFamily: "Helvetica", color: C.muted },
  footP: { fontFamily: "Times-Roman", fontSize: 6, color: C.faint, letterSpacing: 1 },
});

// Logo component
const Logo = () => (
  <Svg width={38} height={38} viewBox="0 0 100 100">
    <Line
      x1={50}
      y1={22}
      x2={50}
      y2={8}
      stroke={C.terra}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Line
      x1={71}
      y1={31}
      x2={81}
      y2={21}
      stroke={C.gold}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Line
      x1={80}
      y1={52}
      x2={94}
      y2={52}
      stroke={C.sage}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Line
      x1={29}
      y1={31}
      x2={19}
      y2={21}
      stroke={C.brandGreen}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Line
      x1={20}
      y1={52}
      x2={6}
      y2={52}
      stroke={C.terra}
      strokeWidth={6}
      strokeLinecap="round"
    />
    <Circle cx={50} cy={49} r={7} fill={C.brandGreen} />
    <Path d="M35 78 C35 58 43 52 50 52 C57 52 65 58 65 78 Z" fill={C.sage} />
  </Svg>
);

const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const RoutesheetPrintDocument = ({ groupedData, logoBase64 }) => {
  // groupedData is an object with employee names as keys
  // Each value is { employeeName, position, rows: [] }

  return (
    <Document>
      {Object.keys(groupedData).map((employeeName, empIndex) => {
        const employeeData = groupedData[employeeName];
        const rows = employeeData.rows;
        const position = employeeData.position || "";

        // Calculate total for this employee
        const total = rows.reduce((sum, row) => {
          return sum + (parseFloat(row.approvedPayment) || 0);
        }, 0);

        // Determine date range from rows
        const dates = rows
          .map((row) => moment(row.timeIn || row.dosStart))
          .filter((date) => date.isValid())
          .sort((a, b) => a.diff(b));

        const period =
          dates.length > 0
            ? `${dates[0].format("MMM D, YYYY")} - ${dates[dates.length - 1].format("MMM D, YYYY")}`
            : "";

        // Ensure minimum 20 rows for consistent layout
        const minRows = 20;
        const displayRows = [...rows];
        while (displayRows.length < minRows) {
          displayRows.push({
            patientCd: "",
            serviceCd: "",
            timeIn: "",
            timeOut: "",
            approvedPayment: null,
            comments: "",
            serviceNotes: "",
            signature_based: null,
          });
        }

        return (
          <Page key={`employee-${empIndex}`} size="LETTER" style={styles.page}>
            {/* Header - use custom image if provided, otherwise use built-in masthead */}
            {logoBase64 ? (
              <Image src={logoBase64} style={styles.headerImage} />
            ) : (
              <>
                <View style={styles.head}>
                  <View style={styles.brand}>
                    <Logo />
                    <View style={styles.wm}>
                      <Text style={styles.wmName}>
                        HALOES <Text style={{ color: C.terra }}>TOUCH</Text>
                      </Text>
                      <Text style={styles.wmTag}>HOSPICE INC.</Text>
                    </View>
                  </View>
                  <View style={styles.contact}>
                    <Text style={styles.contactOrg}>Haloes Touch Hospice Inc.</Text>
                    <Text>11500 S Eastern Ave, Ste. 150 #1509 · Henderson, NV 89052</Text>
                    <Text>Ph 702 625 4644 · Fax 702 960 4605 · hello@haloestouch.com</Text>
                    <Text>haloestouch.com</Text>
                  </View>
                </View>
                <View style={styles.rule} />
              </>
            )}

            {/* Title */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.eyebrow}>Field Staff Documentation</Text>
                <Text style={styles.title}>Route Sheet</Text>
                <Text style={styles.subtitle}>Visit log &amp; service record</Text>
              </View>
              <View>
                <Text style={styles.periodLbl}>Reporting Period</Text>
                <Text style={styles.periodVal}>{period}</Text>
              </View>
            </View>

            {/* Staff */}
            <View style={styles.staff}>
              <View style={styles.mono}>
                <Text style={styles.monoTxt}>{initials(employeeName)}</Text>
              </View>
              <View style={styles.sf}>
                <Text style={styles.k}>Staff Member</Text>
                <Text style={styles.v}>{employeeName}</Text>
              </View>
              <View style={[styles.sf, styles.sfDiv]}>
                <Text style={styles.k}>Position</Text>
                <Text style={styles.v}>{position}</Text>
              </View>
            </View>

            {/* Visit Log */}
            <View style={styles.sec}>
              <Text style={styles.secNo}>01</Text>
              <Text style={styles.secH}>Visit Log</Text>
              <View style={styles.secFill} />
            </View>

            {/* Table Header */}
            <View style={styles.tHead}>
              <Text style={[styles.th, { width: W.client }]}>Client</Text>
              <Text style={[styles.th, { width: W.code }]}>Service Code</Text>
              <Text style={[styles.th, { width: W.date }, styles.ctr]}>Date</Text>
              <Text style={[styles.th, { width: W.tin }, styles.ctr]}>Time In</Text>
              <Text style={[styles.th, { width: W.tout }, styles.ctr]}>Time Out</Text>
              <Text style={[styles.th, { width: W.sig }]}>Signature</Text>
              <Text style={[styles.th, { width: W.rate }, styles.right]}>Rate</Text>
              <Text style={[styles.th, { width: W.cmt }]}>Comment</Text>
            </View>

            {/* Table Rows */}
            {displayRows.map((row, rowIndex) => {
              const filled = !!row.patientCd;

              // Extract date and time from timeIn/dosStart
              const startTime = row.timeIn || row.dosStart;
              const endTime = row.timeOut || row.dosEnd;

              const date = startTime ? moment(startTime).format("YYYY-MM-DD") : "";
              const timeIn = startTime ? moment(startTime).format("HH:mm") : "";
              const timeOut = endTime ? moment(endTime).format("HH:mm") : "";

              // Trim patient code - keep only the part before dot
              let trimmedPatient = row.patientCd || "";
              if (trimmedPatient.includes(".")) {
                trimmedPatient = trimmedPatient.split(".")[0];
              }

              // Get service code
              let serviceCode = row.serviceCd || "";
              if (!serviceCode && row.service) {
                const serviceMatch = CLIENT_SERVICES.find((s) => s.name === row.service);
                serviceCode = serviceMatch ? serviceMatch.code : row.service;
              }

              // Format rate
              const rate = row.approvedPayment != null ? parseFloat(row.approvedPayment).toFixed(2) : "";

              // Combine comments
              const comment = [row.serviceNotes || "", row.comments || ""]
                .filter(Boolean)
                .join(" ") || "";

              return (
                <View key={`row-${rowIndex}`} style={[styles.tRow, filled && styles.tRowFilled]} wrap={false}>
                  <View style={[styles.td, styles.tdFirst, { width: W.client }]}>
                    <Text style={styles.client}>{trimmedPatient}</Text>
                  </View>
                  <View style={[styles.td, { width: W.code }]}>
                    {serviceCode ? (
                      <Text style={[styles.chip, filled && styles.chipFilled]}>{serviceCode}</Text>
                    ) : (
                      <Text> </Text>
                    )}
                  </View>
                  <View style={[styles.td, { width: W.date }]}>
                    <Text style={styles.ctr}>{date}</Text>
                  </View>
                  <View style={[styles.td, { width: W.tin }]}>
                    <Text style={styles.ctr}>{timeIn}</Text>
                  </View>
                  <View style={[styles.td, { width: W.tout }]}>
                    <Text style={styles.ctr}>{timeOut}</Text>
                  </View>
                  <View style={[styles.td, { width: W.sig }]}>
                    {row.signature_based ? (
                      <Image src={row.signature_based} style={styles.signatureImage} />
                    ) : filled ? (
                      <Text style={styles.sig}>{employeeName}</Text>
                    ) : (
                      <Text> </Text>
                    )}
                  </View>
                  <View style={[styles.td, { width: W.rate }]}>
                    <Text style={styles.right}>{rate ? `$${rate}` : ""}</Text>
                  </View>
                  <View style={[styles.td, styles.tdLast, { width: W.cmt }]}>
                    <Text style={styles.cmt}>{comment}</Text>
                  </View>
                </View>
              );
            })}

            {/* Total */}
            <View style={styles.total}>
              <View style={styles.totalBox}>
                <Text style={styles.totalLbl}>Total Earnings</Text>
                <Text style={styles.totalAmt}>
                  <Text style={styles.totalCur}>$</Text>
                  {total.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Service Code Reference */}
            <View wrap={false}>
              <View style={styles.sec}>
                <Text style={styles.secNo}>02</Text>
                <Text style={styles.secH}>Service Code Reference</Text>
                <View style={styles.secFill} />
              </View>
              <View style={styles.codes}>
                <View style={styles.codeGrid}>
                  {CLIENT_SERVICES.map((service) => (
                    <View key={service.code} style={styles.ci}>
                      <Text style={styles.ciCode}>{service.code}</Text>
                      <Text style={styles.ciDesc}>{service.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.foot}>
              <Text style={styles.footC}>
                <Text style={styles.footB}>Confidential. </Text>
                Contains protected health information — handle per HIPAA &amp; agency policy.
              </Text>
              <Text style={styles.footP}>HALOES TOUCH HOSPICE</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default RoutesheetPrintDocument;

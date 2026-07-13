import { makeStyles } from "@material-ui/core";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Svg,
  Line,
  Circle,
  Path,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import HeaderModal from "components/Modal/HeaderModal";
import docStyles from "./document.module.css";
import logo from "assets/img/headerdoc.png";
import Helper from "utils/helper";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    margin: "auto",
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    minWidth: 600,
    backgroundColor: "white",
    border: "2px solid #000",
    overflowX: "auto",
  },
}));

// Color palette (matching RoutesheetPrintDocument)
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
  num: "5%",
  client: "15%",
  service: "17%",
  visits: "9%",
  rate: "10%",
  total: "11%",
  comments: "33%",
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
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
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

  // summary boxes
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 9,
    gap: 12,
  },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center",
    border: `1 solid ${C.line}`,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: C.tint,
  },
  summaryLbl: {
    fontSize: 6,
    letterSpacing: 2,
    color: C.faint,
    textTransform: "uppercase",
    marginRight: 14,
  },
  summaryAmt: { fontFamily: "Times-Roman", fontSize: 16, color: C.brandGreen },
  summaryCur: { fontSize: 10, color: C.terra },

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

// Helper function to check if service type should be counted as a visit
const isVisitServiceType = (serviceType) => {
  if (!serviceType) return false;
  const serviceUpper = serviceType.toUpperCase();
  return !serviceUpper.includes("IDT") && !serviceUpper.includes("OTHER");
};

// Create Document Component
export default function EmployeePaycheckSummaryV2(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [printData, setPrintData] = useState(undefined);
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    console.log("[Props V2]", props);
    setPrintData(props.printData);
  }, [props.printData]);

  const handleClose = () => {
    props.closePrintModalHandler();
  };

  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
        },
        content: {
          position: "absolute",
          top: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          right: "0",
          left: "0",
          overflow: "none",
          WebkitOverflowScrolling: "touch",
          border: "none",
          padding: "0px",
          background: "none",
        },
      }}
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
    >
      <div className={docStyles.form}>
        <HeaderModal title={"Employee Paycheck Summary v2"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData && printData ? (
            <PDFViewer style={styles.viewer}>
              <Document>
                {printData.map((m, empIndex) => {
                  const employeeName = m.employee.name;
                  const rows = m.employee?.details || [];

                  // Calculate totals
                  const totalVisits = rows.reduce((sum, detail) => {
                    if (isVisitServiceType(detail.serviceType)) {
                      return sum + (detail.noOfService || 0);
                    }
                    return sum;
                  }, 0);

                  const totalNonVisits = rows.reduce((sum, detail) => {
                    if (!isVisitServiceType(detail.serviceType)) {
                      return sum + (detail.noOfService || 0);
                    }
                    return sum;
                  }, 0);

                  const totalServices = rows.length;
                  const totalPayment = parseFloat(m.employee.totalPayment || 0);
                  const totalRate = parseFloat(m.employee.totalRate || 0);
                  const totalDeduction = parseFloat(m.employee.totalDeduction || 0);

                  // Period
                  const period = `${m.employee?.start_period} - ${m.employee?.end_period}`;

                  return (
                    <Page key={`employee-${empIndex}`} size="LETTER" style={styles.page}>
                      {/* Header - use logo if available */}
                      <Image src={logo} style={styles.headerImage} />

                      {/* Title */}
                      <View style={styles.titleRow}>
                        <View>
                          <Text style={styles.eyebrow}>Employee Compensation</Text>
                          <Text style={styles.title}>Paycheck Summary</Text>
                          <Text style={styles.subtitle}>Service record &amp; payment details</Text>
                        </View>
                        <View>
                          <Text style={styles.periodLbl}>Pay Period</Text>
                          <Text style={styles.periodVal}>{period}</Text>
                        </View>
                      </View>

                      {/* Staff */}
                      <View style={styles.staff}>
                        <View style={styles.mono}>
                          <Text style={styles.monoTxt}>{initials(employeeName)}</Text>
                        </View>
                        <View style={styles.sf}>
                          <Text style={styles.k}>Employee</Text>
                          <Text style={styles.v}>{employeeName}</Text>
                        </View>
                        <View style={[styles.sf, styles.sfDiv]}>
                          <Text style={styles.k}>Pay Date</Text>
                          <Text style={styles.v}>{m.employee.payDate}</Text>
                        </View>
                      </View>

                      {/* Service Details */}
                      <View style={styles.sec}>
                        <Text style={styles.secNo}>01</Text>
                        <Text style={styles.secH}>Service Details</Text>
                        <View style={styles.secFill} />
                      </View>

                      {/* Table Header */}
                      <View style={styles.tHead}>
                        <Text style={[styles.th, { width: W.num }]}>#</Text>
                        <Text style={[styles.th, { width: W.client }]}>Client</Text>
                        <Text style={[styles.th, { width: W.service }]}>Services</Text>
                        <Text style={[styles.th, { width: W.visits }, styles.ctr]}>Visits</Text>
                        <Text style={[styles.th, { width: W.rate }, styles.right]}>Rate</Text>
                        <Text style={[styles.th, { width: W.total }, styles.right]}>Total Paid</Text>
                        <Text style={[styles.th, { width: W.comments }]}>Comments</Text>
                      </View>

                      {/* Table Rows */}
                      {rows.map((row, rowIndex) => {
                        const filled = true;
                        const visitCount = isVisitServiceType(row.serviceType)
                          ? row.noOfService || 0
                          : 0;

                        // Trim client code - limit to 12 characters
                        let trimmedClient = row.patientCd?.replace(/[\d.]/g, '') || "";
                        trimmedClient = trimmedClient.substring(0, 12);

                        const comment = [
                          row.dos?.toString().replace(/,/g, ", "),
                          row.comments || "",
                        ]
                          .filter(Boolean)
                          .join(" ") || "";

                        return (
                          <View
                            key={`row-${rowIndex}`}
                            style={[styles.tRow, filled && styles.tRowFilled]}
                            wrap={false}
                          >
                            <View style={[styles.td, styles.tdFirst, { width: W.num }]}>
                              <Text style={styles.ctr}>{rowIndex + 1}</Text>
                            </View>
                            <View style={[styles.td, { width: W.client }]}>
                              <Text style={styles.client}>{trimmedClient}</Text>
                            </View>
                            <View style={[styles.td, { width: W.service }]}>
                              <Text>{row.serviceType || ""}</Text>
                            </View>
                            <View style={[styles.td, { width: W.visits }]}>
                              <Text style={styles.ctr}>{visitCount || ""}</Text>
                            </View>
                            <View style={[styles.td, { width: W.rate }]}>
                              <Text style={styles.right}>
                                {row.serviceRate ? `$${row.serviceRate}` : ""}
                              </Text>
                            </View>
                            <View style={[styles.td, { width: W.total }]}>
                              <Text style={styles.right}>
                                {row.payAmount ? `$${row.payAmount}` : ""}
                              </Text>
                            </View>
                            <View style={[styles.td, styles.tdLast, { width: W.comments }]}>
                              <Text style={styles.cmt}>{comment}</Text>
                            </View>
                          </View>
                        );
                      })}

                      {/* Summary Section */}
                      <View style={styles.summarySection}>
                        {totalVisits > 0 && (
                          <View style={styles.summaryBox}>
                            <Text style={styles.summaryLbl}>Total Visits</Text>
                            <Text style={styles.summaryAmt}>{totalVisits}</Text>
                          </View>
                        )}
                        {totalNonVisits > 0 && (
                          <View style={styles.summaryBox}>
                            <Text style={styles.summaryLbl}>Non-Visits</Text>
                            <Text style={styles.summaryAmt}>{totalNonVisits}</Text>
                          </View>
                        )}
                      </View>

                      {/* Payment Summary */}
                      <View style={styles.sec}>
                        <Text style={styles.secNo}>02</Text>
                        <Text style={styles.secH}>Payment Summary</Text>
                        <View style={styles.secFill} />
                      </View>

                      <View style={styles.summarySection}>
                        {totalDeduction > 0 && (
                          <View style={styles.summaryBox}>
                            <Text style={styles.summaryLbl}>Service Paid</Text>
                            <Text style={styles.summaryAmt}>
                              <Text style={styles.summaryCur}>$</Text>
                              {new Intl.NumberFormat("en-US", {}).format(totalRate.toFixed(2))}
                            </Text>
                          </View>
                        )}
                        {totalDeduction > 0 && (
                          <View style={styles.summaryBox}>
                            <Text style={styles.summaryLbl}>Deduction</Text>
                            <Text style={styles.summaryAmt}>
                              <Text style={styles.summaryCur}>$</Text>
                              {new Intl.NumberFormat("en-US", {}).format(totalDeduction.toFixed(2))}
                            </Text>
                          </View>
                        )}
                        <View style={styles.summaryBox}>
                          <Text style={styles.summaryLbl}>Net Pay</Text>
                          <Text style={[styles.summaryAmt, { color: "#27ae60" }]}>
                            <Text style={styles.summaryCur}>$</Text>
                            {new Intl.NumberFormat("en-US", {}).format(totalPayment.toFixed(2))}
                          </Text>
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={styles.foot}>
                        <Text style={styles.footC}>
                          <Text style={styles.footB}>Confidential. </Text>
                          Contains protected health information — handle per HIPAA &amp; agency
                          policy.
                        </Text>
                        <Text style={styles.footP}>HALOES TOUCH HOSPICE</Text>
                      </View>
                    </Page>
                  );
                })}
              </Document>
            </PDFViewer>
          ) : (
            <div>
              <span>No Record</span>
            </div>
          )}
        </div>
      </div>
    </ReactModal>
  );
}

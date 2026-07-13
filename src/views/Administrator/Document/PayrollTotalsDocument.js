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

// Color palette (matching v2 style)
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
  num: "6%",
  payDate: "15%",
  employee: "30%",
  amount: "15%",
  paymentType: "17%",
  info: "17%",
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

  // pay period card
  payPeriodCard: {
    marginTop: 12,
    flexDirection: "row",
    border: `1 solid ${C.line}`,
    borderRadius: 8,
    minHeight: 44,
    backgroundColor: C.terraSoft,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  payPeriodLabel: {
    fontSize: 6,
    letterSpacing: 1.8,
    color: C.terra,
    textTransform: "uppercase",
    marginRight: 10,
  },
  payPeriodValue: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    color: C.brandGreen,
    fontWeight: "bold",
  },

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
  employee: { fontFamily: "Helvetica", color: C.ink },

  // grand total
  grandTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 9,
  },
  grandTotalBox: {
    flexDirection: "row",
    alignItems: "center",
    border: `2 solid ${C.line}`,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: C.tint,
  },
  grandTotalLbl: {
    fontSize: 7,
    letterSpacing: 2,
    color: C.faint,
    textTransform: "uppercase",
    marginRight: 16,
  },
  grandTotalAmt: { fontFamily: "Times-Roman", fontSize: 18, color: "#27ae60" },
  grandTotalCur: { fontSize: 12, color: C.terra },

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

// Create Document Component
export default function PayrollTotalsDocument(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [printData, setPrintData] = useState(undefined);
  const [grandTotal, setGrandTotal] = useState(0.0);
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    console.log("[Props Payroll Totals]", props);
    if (props.printData && Array.isArray(props.printData)) {
      setPrintData(props.printData);
      let total = 0;
      props.printData.forEach((c) => {
        total += parseFloat(c.amount || 0);
      });
      setGrandTotal(parseFloat(total));
    } else {
      setPrintData([]);
      setGrandTotal(0);
    }
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
        <HeaderModal title={"Payroll Totals"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData && Array.isArray(printData) && printData.length > 0 ? (
            <PDFViewer style={styles.viewer}>
              <Document>
                <Page size="A4" style={styles.page} orientation="portrait" wrap>
                  {/* Header */}
                  <Image src={logo} style={styles.headerImage} />

                  {/* Title */}
                  <View style={styles.titleRow}>
                    <View>
                      <Text style={styles.eyebrow}>Payroll Administration</Text>
                      <Text style={styles.title}>Payroll Totals</Text>
                      <Text style={styles.subtitle}>Employee payment summary</Text>
                    </View>
                    <View>
                      <Text style={styles.periodLbl}>Total Employees</Text>
                      <Text style={styles.periodVal}>{printData.length}</Text>
                    </View>
                  </View>

                  {/* Pay Period Card */}
                  <View style={styles.payPeriodCard}>
                    <Text style={styles.payPeriodLabel}>Pay Period:</Text>
                    <Text style={styles.payPeriodValue}>
                      {printData[0]?.payPeriod || "N/A"}
                    </Text>
                  </View>

                  {/* Payment Details */}
                  <View style={styles.sec}>
                    <Text style={styles.secNo}>01</Text>
                    <Text style={styles.secH}>Payment Details</Text>
                    <View style={styles.secFill} />
                  </View>

                  {/* Table Header */}
                  <View style={styles.tHead}>
                    <Text style={[styles.th, { width: W.num }]}>#</Text>
                    <Text style={[styles.th, { width: W.payDate }]}>Pay Date</Text>
                    <Text style={[styles.th, { width: W.employee }]}>Employee</Text>
                    <Text style={[styles.th, { width: W.amount }, styles.right]}>Amount</Text>
                    <Text style={[styles.th, { width: W.paymentType }, styles.ctr]}>
                      Payment Type
                    </Text>
                    <Text style={[styles.th, { width: W.info }]}>Info</Text>
                  </View>

                  {/* Table Rows */}
                  {printData.map((row, index) => {
                    const filled = index % 2 === 1;

                    return (
                      <View
                        key={`row-${index}`}
                        style={[styles.tRow, filled && styles.tRowFilled]}
                        wrap={false}
                      >
                        <View style={[styles.td, styles.tdFirst, { width: W.num }]}>
                          <Text style={styles.ctr}>{index + 1}</Text>
                        </View>
                        <View style={[styles.td, { width: W.payDate }]}>
                          <Text>{row.payDate || ""}</Text>
                        </View>
                        <View style={[styles.td, { width: W.employee }]}>
                          <Text style={styles.employee}>{row.employee || ""}</Text>
                        </View>
                        <View style={[styles.td, { width: W.amount }]}>
                          <Text style={styles.right}>
                            {row.amount
                              ? `$${new Intl.NumberFormat("en-US", {}).format(
                                  parseFloat(row.amount).toFixed(2)
                                )}`
                              : ""}
                          </Text>
                        </View>
                        <View style={[styles.td, { width: W.paymentType }]}>
                          <Text style={styles.ctr}>
                            {row.paymentType ? row.paymentType.toUpperCase() : ""}
                          </Text>
                        </View>
                        <View style={[styles.td, styles.tdLast, { width: W.info }]}>
                          <Text>{row.paymentInfo ? row.paymentInfo.toUpperCase() : ""}</Text>
                        </View>
                      </View>
                    );
                  })}

                  {/* Grand Total */}
                  <View style={styles.grandTotal}>
                    <View style={styles.grandTotalBox}>
                      <Text style={styles.grandTotalLbl}>Grand Total</Text>
                      <Text style={styles.grandTotalAmt}>
                        <Text style={styles.grandTotalCur}>$</Text>
                        {new Intl.NumberFormat("en-US", {}).format(
                          grandTotal.toFixed(2)
                        )}
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

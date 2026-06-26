import { makeStyles, Modal } from "@material-ui/core";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import HeaderModal from "components/Modal/HeaderModal";
import docStyles from "./document.module.css";
import logo from "assets/img/headerdoc.png";
import { PAY_PERIOD } from "utils/constants";
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
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  spaceHeader: {
    marginTop: 4,
  },
  spaceHeaderTop20: {
    marginTop: 4,
  },
  spaceHeaderMargin20: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sectionHeader2: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 10,
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  row1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    fontSize: 8,
    fontWeight: "bold",
  },
  row: {
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",

    borderBottom: "none",
  },
  smallText: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 6,
    padding: "5px 2px 0 0",
    lineHeight: "1.4",
  },
  longText: {
    fontSize: 9,
    width: "540px",
  },
  title: {
    fontSize: 12,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginTop: 15,
    border: "1px solid #3498db",
  },
  payPeriodBox: {
    backgroundColor: "#ecf0f1",
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderLeft: "4px solid #3498db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  payPeriodLabel: {
    fontSize: 11,
    color: "#7f8c8d",
    marginRight: 10,
  },
  payPeriodValue: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  grandTotalBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "2px solid #3498db",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 16,
    color: "#27ae60",
    fontWeight: "bold",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  tableCell2x: {
    width: "280px",
    display: "flex",
    flexWrap: "wrap",
    fontSize: 9,
    border: "1px solid #000",
  },
  tableCell: {
    width: "140px",
    display: "flex",
    flexWrap: "wrap",
    fontSize: 9,
  },

  cellLeft: {
    display: "flex",
    flexWrap: "wrap",

    paddingLeft: 20,
  },
  cellLeftGray: {
    width: "280px",
    display: "flex",
    flexWrap: "wrap",
    fontSize: 9,
    borderRight: "1px solid #000",
    backgroundColor: "lightgray",
  },
  cellRight: { width: "280px", display: "flex", flexWrap: "wrap", fontSize: 9 },
  cellRightGray: { width: "280px" },
  // section: {
  //   margin: 10,
  //   padding: 10,
  //   flexGrow: 1
  // },
  line1: {
    x1: "10", // starting coords are x1 and y1
    y1: "10",
    x2: "200", // ending coords:
    y2: "10",
    strokeWidth: 1,
    stroke: "black", // stroke color rgb(255,255,255)
  },
  borderTop: { borderTop: "1px solid #000" },
  form: {
    minHeight: "80%",
    maxHeight: "100%",
    minWidth: "98%",
    maxWidth: "100%",

    background: "white",
    position: "relative",
    padding: "0 0 25.6px",
  },
  content: {
    minHeight: "775",
    maxHeight: "100%",
    position: "absolute",
    top: "57px",
    right: "0",
    bottom: "55px",
    left: 0,
    display: "block",
    overflowY: "auto",
    backgroundColor: "white",
    padding: "15px",
  },
  detailsHeader: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 9,
    backgroundColor: "#3498db",
    color: "white",
    textAlign: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRight: "1px solid #2980b9",
    fontWeight: "bold",
  },
  detailsHeaderLast: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 9,
    backgroundColor: "#3498db",
    color: "white",
    textAlign: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "8px",
    paddingBottom: "8px",
    fontWeight: "bold",
    width: "100%",
  },
  detailsCell: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 8,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "6px",
    paddingBottom: "6px",
    borderRight: "1px solid #bdc3c7",
    borderTop: "none",
    borderBottom: "1px solid #ecf0f1",
  },
  detailsCellLast: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 8,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "6px",
    paddingBottom: "6px",
    borderTop: "none",
    borderBottom: "1px solid #ecf0f1",
    width: "100%",
  },
  detailsCellCnt: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 8,
    backgroundColor: "#ecf0f1",
    color: "black",
    textAlign: "center",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "6px",
    paddingBottom: "6px",
    borderLeft: "1px solid #bdc3c7",
    borderRight: "1px solid #bdc3c7",
    borderTop: "none",
    borderBottom: "1px solid #ecf0f1",
    fontWeight: "bold",
  },
});

// Create Document Component
export default function PayrollPaymentDocument(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [printData, setPrintData] = useState(undefined);
  const [grandTotal, setGrandTotal] = useState(0.0);
  const [modalStyle] = useState(getModalStyle);
  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);
  useEffect(() => {
    console.log("[Props]", props);
    setPrintData(props.printData);
    let total = 0;
    props.printData.forEach((c) => {
      total += parseFloat(c.amount || 0);
    });
    setGrandTotal(parseFloat(total), 2);
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
        <HeaderModal title={"Payroll Payment Summary"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData && printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page} orientation="portrait" wrap>
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image
                      src={logo}
                      style={{ height: "70px", width: "520px" }}
                    />
                  </View>

                  <View style={styles.spaceHeaderMargin20}>
                    <Text style={styles.sectionHeader}>{`TOTAL PAYMENT SUMMARY`}</Text>
                  </View>

                  <View style={styles.payPeriodBox}>
                    <Text style={styles.payPeriodLabel}>PAY PERIOD:</Text>
                    <Text style={styles.payPeriodValue}>
                      {printData[0]?.payPeriod || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.grandTotalBox}>
                    <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
                    <Text style={styles.grandTotalValue}>
                      ${new Intl.NumberFormat("en-US", {}).format(
                        parseFloat(grandTotal).toFixed(2)
                      )}
                    </Text>
                  </View>
                  <View style={{ ...styles.table }}>
                    {/*SERVICES*/}
                    <View
                      style={{
                        ...styles.row1,
                        textAlign: "center",
                        borderTop: "none",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "20px",
                          padding: "5px 0",
                        }}
                      >
                        #
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "100px",
                          padding: "5px 0",
                        }}
                      >
                        PAY DATE
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "160px",
                          padding: "5px 0",
                        }}
                      >
                        EMPLOYEE
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        AMOUNT
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        PAYMENT TYPE
                      </Text>
                      {/*
                            <Text
                              style={{
                                ...styles.detailsHeader,
                                width: "80px",
                                padding: "5px 0",
                              }}
                            >
                              TOTAL RATE
                            </Text>
                           
                            <Text
                              style={{
                                ...styles.detailsHeader,
                                width: "80px",
                                padding: "5px 0",
                              }}
                            >
                              DEDUCTION
                            </Text>
                            */}
                      <Text
                        style={{
                          ...styles.detailsHeaderLast,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        INFO
                      </Text>
                    </View>

                    {printData.map((m, indx) => {
                      return (
                        <View
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <View
                            style={{
                              ...styles.row,
                              textAlign: "center",
                              borderTop: "none",
                            }}
                          >
                            <Text
                              style={{
                                ...styles.detailsCellCnt,
                                width: "20px",
                                padding: "5px 0",
                              }}
                            >
                              {indx + 1}
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "100px",
                                padding: "5px 0",
                              }}
                            >
                              {m.payDate}
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "160px",
                                padding: "5px 0",
                              }}
                            >
                              {m.employee}
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "80px",
                                padding: "5px 0",
                              }}
                            >
                              {`$${new Intl.NumberFormat("en-US", {}).format(
                                parseFloat(m.amount).toFixed(2)
                              )}`}
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "80px",
                                padding: "5px 0",
                              }}
                            >
                              {m.paymentType.toUpperCase()}
                            </Text>
                            {/*
                                    <Text
                                      style={{
                                        ...styles.detailsCell,
                                        width: "80px",
                                        padding: "5px 0",
                                      }}
                                    >
                                      ${m2.totalRate}
                                    </Text>
                                    <Text
                                      style={{
                                        ...styles.detailsCell,
                                        width: "80px",
                                        padding: "5px 0",
                                      }}
                                    >
                                    
                                      ${m2.deduction}
                                    </Text>
                                    */}
                            <Text
                              style={{
                                ...styles.detailsCellLast,
                                width: "80px",
                                padding: "5px 0",
                              }}
                            >
                              {m.paymentInfo?.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
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

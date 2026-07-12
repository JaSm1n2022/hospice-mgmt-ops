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
    marginTop: 10,
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
    width: window.innerWidth,
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
  summaryBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "2px solid #3498db",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#34495e",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 11,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  netPayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 10,
    borderTop: "2px solid #3498db",
  },
  netPayLabel: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  netPayValue: {
    fontSize: 13,
    color: "#27ae60",
    fontWeight: "bold",
  },
  cellLeft: {
    display: "flex",
    flexWrap: "wrap",
    paddingLeft: 0,
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
  line1: {
    x1: "10",
    y1: "10",
    x2: "200",
    y2: "10",
    strokeWidth: 1,
    stroke: "black",
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
    flex: 1,
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
    flex: 1,
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
  employeeInfo: {
    backgroundColor: "#ecf0f1",
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderLeft: "4px solid #3498db",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  employeeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 4,
  },
  employeeLabel: {
    fontSize: 10,
    color: "#7f8c8d",
    marginRight: 5,
  },
  employeeValue: {
    fontSize: 11,
    color: "#2c3e50",
    fontWeight: "bold",
  },
});

// Create Document Component
export default function PaycheckDocument(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [printData, setPrintData] = useState(undefined);
  const [modalStyle] = useState(getModalStyle);
  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);
  useEffect(() => {
    console.log("[Props]", props);
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
        <HeaderModal
          title={"Paycheck Services Summary"}
          onClose={handleClose}
        />
        <div className={docStyles.content}>
          {printData && printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                {printData.map((m, indx) => {
                  return (
                    <Page
                      size="A4"
                      style={styles.page}
                      orientation="portrait"
                      wrap
                    >
                      <View
                        wrap="false"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <View
                          style={{ justifyContent: "center", alignItems: "center" }}
                        >
                          <Image
                            src={logo}
                            style={{ height: "70px", width: "520px" }}
                          />
                        </View>
                        <View style={styles.spaceHeaderMargin20}>
                          <Text style={styles.sectionHeader}>{`PAYCHECK SUMMARY`}</Text>
                        </View>

                        <View style={styles.employeeInfo}>
                          <View style={styles.employeeInfoItem}>
                            <Text style={styles.employeeLabel}>EMPLOYEE:</Text>
                            <Text style={styles.employeeValue}>
                              {m.employee.name}
                            </Text>
                          </View>
                          <View style={styles.employeeInfoItem}>
                            <Text style={styles.employeeLabel}>PAY PERIOD:</Text>
                            <Text style={styles.employeeValue}>
                              {m.employee?.start_period} - {m.employee?.end_period}
                            </Text>
                          </View>
                          <View style={styles.employeeInfoItem}>
                            <Text style={styles.employeeLabel}>PAY DATE:</Text>
                            <Text style={styles.employeeValue}>
                              {m.employee.payDate}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.summaryBox}>
                          {parseFloat(m.employee.totalDeduction).toFixed(2) > 0 && (
                            <View style={styles.summaryRow}>
                              <Text style={styles.summaryLabel}>Service Paid:</Text>
                              <Text style={styles.summaryValue}>
                                ${new Intl.NumberFormat("en-US", {}).format(
                                  parseFloat(m.employee.totalRate).toFixed(2)
                                )}
                              </Text>
                            </View>
                          )}
                          {parseFloat(m.employee.totalDeduction).toFixed(2) > 0 && (
                            <View style={styles.summaryRow}>
                              <Text style={styles.summaryLabel}>Deduction:</Text>
                              <Text style={styles.summaryValue}>
                                ${new Intl.NumberFormat("en-US", {}).format(
                                  parseFloat(m.employee.totalDeduction).toFixed(2)
                                )}
                              </Text>
                            </View>
                          )}
                          <View style={styles.netPayRow}>
                            <Text style={styles.netPayLabel}>NET PAY:</Text>
                            <Text style={styles.netPayValue}>
                              ${new Intl.NumberFormat("en-US", {}).format(
                                parseFloat(m.employee.totalPayment).toFixed(2)
                              )}
                            </Text>
                          </View>
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
                              CLIENT
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsHeader,
                                width: "100px",
                                padding: "5px 0",
                              }}
                            >
                              SERVICES
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsHeader,
                                width: "60px",
                                padding: "5px 0",
                              }}
                            >
                              NO. SRVC
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsHeader,
                                width: "60px",
                                padding: "5px 0",
                              }}
                            >
                              RATE
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
                                ...styles.detailsHeader,
                                width: "60px",
                                padding: "5px 0",
                              }}
                            >
                              TOTAL PAID
                            </Text>
                            <Text
                              style={{
                                ...styles.detailsHeaderLast,
                                padding: "5px 0",
                              }}
                            >
                              COMMENTS
                            </Text>
                          </View>
                          {m.employee?.details?.length
                            ? m.employee?.details.map((m2, indx) => {
                                return (
                                  <View>
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
                                        {m2.patientCd?.replace(/[\d.]/g, '')}
                                      </Text>
                                      <Text
                                        style={{
                                          ...styles.detailsCell,
                                          width: "100px",
                                          padding: "5px 0",
                                        }}
                                      >
                                        {m2.serviceType}
                                      </Text>
                                      <Text
                                        style={{
                                          ...styles.detailsCell,
                                          width: "60px",
                                          padding: "5px 0",
                                        }}
                                      >
                                        {m2.noOfService}
                                      </Text>
                                      <Text
                                        style={{
                                          ...styles.detailsCell,
                                          width: "60px",
                                          padding: "5px 0",
                                        }}
                                      >
                                        ${m2.serviceRate}
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
                                          ...styles.detailsCell,
                                          width: "60px",
                                          padding: "5px 0",
                                        }}
                                      >
                                        ${m2.payAmount}
                                      </Text>
                                      <Text
                                        style={{
                                          ...styles.detailsCellLast,
                                          padding: "5px 0",
                                          height: "50px",
                                        }}
                                      >
                                        {m2.dos?.toString().replace(/,/g, ", ")}{" "}
                                        {m2.comments}
                                      </Text>
                                    </View>
                                  </View>
                                );
                              })
                            : null}
                        </View>
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

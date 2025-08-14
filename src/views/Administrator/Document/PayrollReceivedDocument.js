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
  },
  spaceHeader: {
    marginTop: 4,
  },
  spaceHeaderTop20: {
    marginTop: 4,
  },
  spaceHeaderMargin20: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 14,
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
    paddingLeft: 20,
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
    fontSize: 12,
    border: "1px solid #000",
  },
  tableCell: {
    width: "140px",
    display: "flex",
    flexWrap: "wrap",
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 12,
    backgroundColor: "gray",
    color: "black",
    textAlign: "center",
    paddingLeft: "10px",
    borderRight: "1px solid #000",
    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderTop: "none", // '1px solid #000',
  },
  detailsCell: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 12,
    backgroundColor: "white",
    color: "black",
    textAlign: "left",
    paddingLeft: "40px",
    borderRight: "1px solid #000",
    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderTop: "none",

    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderBottom: "1px solid #000", // '1px solid #000',
  },
  detailsCellCnt: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: 12,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    paddingLeft: "10px",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderTop: "none",

    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderBottom: "1px solid #000", // '1px solid #000',
  },
});

// Create Document Component
export default function PayrollReceivedDocument(props) {
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
        <HeaderModal title={"Payroll Log Sheet"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData && printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page} orientation="portrait" wrap>
                  <View style={styles.spaceHeader} />
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      src={logo}
                      style={{ height: "80px", width: "600px" }}
                    />
                  </View>

                  <View style={styles.spaceHeaderMargin20}>
                    <Text>{`Payroll Check Received Log Sheet`}</Text>
                  </View>
                  <View style={styles.spaceHeaderMargin20}>
                    <Text>
                      {" "}
                      Pay Period : {printData[0].startPeriod} to{" "}
                      {printData[0].endPeriod}
                    </Text>
                  </View>
                  <View style={styles.spaceHeaderMargin20}>
                    <Text>Pay Date : {printData[0].payDate}</Text>
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
                          width: "160px",
                          padding: "5px 0",
                        }}
                      >
                        EMPLOYEE NAME
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "160px",
                          padding: "5px 0",
                        }}
                      >
                        JOB TITLE
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        DATE
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
                          width: "120px",
                          padding: "5px 0",
                        }}
                      >
                        SIGNATURE
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
                                width: "160px",
                                padding: "5px 0",
                              }}
                            >
                              {m.employee}
                            </Text>

                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "160px",
                                padding: "5px 0",
                              }}
                            >
                              {m.position}
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
                                width: "80px",
                                padding: "5px 0",
                              }}
                            ></Text>
                            <Text
                              style={{
                                ...styles.detailsCell,
                                width: "120px",
                                padding: "5px 0",
                              }}
                            ></Text>
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

import { makeStyles, Modal } from "@material-ui/core";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import HeaderModal from "components/Modal/HeaderModal";
import docStyles from "./document.module.css";
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
    marginTop: 20,
  },
  spaceHeaderTop20: {
    marginTop: 20,
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
    fontSize: 10,
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
    fontSize: 10,
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
    fontSize: 8,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    paddingLeft: "10px",

    // paddingBottom: '2px',
    // paddingTop: '1px',
    borderTop: "none", // '1px solid #000',
  },
});

// Create Document Component
export default function OverheadDocument(props) {
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
        <HeaderModal title={"Overhead Budget"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page}>
                  <View style={styles.spaceHeaderTop20} />
                  <View style={styles.sectionHeader}>
                    <Text>{`OVERHEAD BUDGET FOR ${printData.month.toUpperCase()} ${
                      printData.year
                    }`}</Text>
                  </View>
                  {printData && printData.total && (
                    <View style={styles.sectionHeader}>
                      <Text>
                        {" "}
                        {`TOTAL :$${new Intl.NumberFormat("en-US", {}).format(
                          parseFloat(printData.total || 0.0).toFixed(2)
                        )}`}
                      </Text>
                    </View>
                  )}
                  <View style={styles.sectionHeader2}>
                    <Text>Prepared By : Jasmin Velasco</Text>
                  </View>
                  <View style={styles.spaceHeaderTop20} />
                  <View style={styles.row}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text
                          style={{
                            ...styles.cellLeft,
                            fontSize: 12,
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          UTILITIES EXPENSE
                        </Text>
                        {printData &&
                        printData.utilitiesExpense &&
                        printData.utilitiesExpense.length
                          ? printData?.utilitiesExpense.map((m) => {
                              return (
                                <Text
                                  style={{
                                    ...styles.cellLeft,
                                    fontSize: 11,
                                  }}
                                >
                                  {`${m.name.toUpperCase()}: $${new Intl.NumberFormat(
                                    "en-US",
                                    {}
                                  ).format(
                                    parseFloat(m.total || 0.0).toFixed(2)
                                  )}`}
                                </Text>
                              );
                            })
                          : null}
                      </View>
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text
                          style={{
                            ...styles.cellLeft,
                            fontSize: 12,
                            fontWeight: 500,
                            textDecoration: "underline",
                          }}
                        >
                          OTHER/OPERATION EXPENSE
                        </Text>
                        {printData &&
                        printData.otherOperationExpense &&
                        printData.otherOperationExpense.length
                          ? printData.otherOperationExpense.map((m) => {
                              return (
                                <Text
                                  style={{
                                    ...styles.cellLeft,
                                    fontSize: 11,
                                  }}
                                >
                                  {`${m.name.toUpperCase()}: $${new Intl.NumberFormat(
                                    "en-US",
                                    {}
                                  ).format(
                                    parseFloat(m.total || 0.0).toFixed(2)
                                  )}`}
                                </Text>
                              );
                            })
                          : null}
                      </View>
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text
                          style={{
                            ...styles.cellLeft,
                            fontSize: 12,
                            fontWeight: 500,
                            textDecoration: "underline",
                          }}
                        >
                          SUPPLIES EXPENSE
                        </Text>
                        {printData &&
                        printData.suppliesExpense &&
                        printData.suppliesExpense.length
                          ? printData.suppliesExpense.map((m) => {
                              return (
                                <Text
                                  style={{
                                    ...styles.cellLeft,
                                    fontSize: 11,
                                  }}
                                >
                                  {`${m.name.toUpperCase()}: $${new Intl.NumberFormat(
                                    "en-US",
                                    {}
                                  ).format(
                                    parseFloat(m.total || 0.0).toFixed(2)
                                  )}`}
                                </Text>
                              );
                            })
                          : null}
                      </View>
                    </View>
                  </View>

                  <View style={styles.spaceHeader}>
                    <Text
                      style={{
                        ...styles.cellLeft,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      OFFICE EXPENSE DETAILS
                    </Text>
                  </View>

                  <View style={{ ...styles.table }}>
                    {/*OFFICE*/}
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
                          width: "30px",
                          padding: "5px 0",
                        }}
                      >
                        #
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "300px",
                          padding: "5px 0",
                        }}
                      >
                        DESCRIPTION
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "60px",
                          padding: "5px 0",
                        }}
                      >
                        VENDOR
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        QTY
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        TOTAL
                      </Text>
                    </View>
                    {printData &&
                    printData.officeDetails &&
                    printData.officeDetails.length
                      ? printData.officeDetails.map((m, indx) => {
                          return (
                            <View
                              style={{
                                ...styles.row,
                                textAlign: "center",
                                borderTop: "none",
                              }}
                            >
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "30px",
                                  padding: "5px 0",
                                }}
                              >
                                {indx + 1}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "300px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.shortDescription}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "60px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.vendor}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "80px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.qty} {m.qtyUom}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "80px",
                                  padding: "5px 0",
                                }}
                              >
                                {`$${new Intl.NumberFormat("en-US", {}).format(
                                  parseFloat(m.grandTotal || 0.0).toFixed(2)
                                )}`}
                              </Text>
                            </View>
                          );
                        })
                      : null}
                  </View>

                  <View style={styles.spaceHeader}>
                    <Text
                      style={{
                        ...styles.cellLeft,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      MEDICAL EXPENSE DETAILS
                    </Text>
                  </View>

                  <View style={{ ...styles.table }}>
                    {/*OFFICE*/}
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
                          width: "30px",
                          padding: "5px 0",
                        }}
                      >
                        #
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "300px",
                          padding: "5px 0",
                        }}
                      >
                        DESCRIPTION
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "60px",
                          padding: "5px 0",
                        }}
                      >
                        VENDOR
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        QTY
                      </Text>
                      <Text
                        style={{
                          ...styles.detailsHeader,
                          width: "80px",
                          padding: "5px 0",
                        }}
                      >
                        TOTAL
                      </Text>
                    </View>
                    {printData &&
                    printData.medicalDetails &&
                    printData.medicalDetails.length
                      ? printData.medicalDetails.map((m, indx) => {
                          return (
                            <View
                              style={{
                                ...styles.row,
                                textAlign: "center",
                                borderTop: "none",
                              }}
                            >
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "30px",
                                  padding: "5px 0",
                                }}
                              >
                                {indx + 1}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "300px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.shortDescription}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "60px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.vendor}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "80px",
                                  padding: "5px 0",
                                }}
                              >
                                {m.qty} {m.qtyUom}
                              </Text>
                              <Text
                                style={{
                                  ...styles.detailsCell,
                                  width: "80px",
                                  padding: "5px 0",
                                }}
                              >
                                {`$${new Intl.NumberFormat("en-US", {}).format(
                                  parseFloat(m.grandTotal || 0.0).toFixed(2)
                                )}`}
                              </Text>
                            </View>
                          );
                        })
                      : null}
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

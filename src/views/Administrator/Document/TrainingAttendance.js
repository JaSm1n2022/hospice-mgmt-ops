import { makeStyles, Modal, Typography } from "@material-ui/core";
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

import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { connect } from "react-redux";
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

  titleText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,

    width: "100px",
  },
  agreementText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,

    width: "800px",
  },
  leftLineText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    borderBottom: "2px solid black",
    width: "300px",
  },
  leftLineTextNoBorder: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
  },
  leftLineHeader: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",

    width: "300px",
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
  viewStyle: {
    width: "800px",
    flexDirection: "row", // Use row direction to place elements side by side
    // justifyContent: "space-between", // Distribute elements evenly along the row
  },
  table: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    paddingLeft: 10,
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
    textIndent: true,
    paddingLeft: "10px",
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
function TrainingAttendance(props) {
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
    const tempData = props.printData;
    if (tempData.details?.length < 15) {
      const addCnt = 15 - tempData.details.length;
      for (let i = 0; i < addCnt; i++) {
        tempData.details.push({
          description: "",
        });
      }
    }
    setPrintData(tempData);
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
        <HeaderModal title={"DME Form"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData && printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page} orientation="portrait" wrap>
                  <View style={styles.spaceHeader} />
                  <View
                    style={{ justifyContent: "center", flexDirection: "row" }}
                  >
                    <View>
                      <Image
                        src={logo}
                        style={{
                          height: "80px",
                          width: "500px",
                        }}
                      />
                    </View>
                    {/*
                    <View>
                      <Text>
                        {props.profileState?.data[0]?.company_name || ""}
                      </Text>
                      <Text>{props.profileState?.data[0]?.address || ""}</Text>
                      <Text>
                        {props.profileState?.data[0]?.city || ""}{" "}
                        {props.profileState?.data[0]?.state || ""}{" "}
                        {props.profileState?.data[0]?.postal || ""}
                      </Text>
                    </View>
                   */}
                  </View>

                  <View style={styles.spaceHeaderMargin20}>
                    <Text>{`Event Attendance Confirmation Form`}</Text>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Event Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{props.printData?.eventName}</Text>
                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Date: </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{props.printData?.eventDt}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Venue : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>11500 S Eastern Ave, Henderson NV 89052</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{props.printData?.fullName}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Email : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{props.printData?.email}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Phone : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{props.printData?.phone}</Text>
                    </View>
                  </View>

                  <View>
                    <Image
                      src={props.printData?.signature}
                      style={{
                        width: 300, // Adjust width as needed
                        // Adjust height as needed
                        objectFit: "contain",
                      }}
                    />
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.agreementText}>
                      <Text>
                        I, the undersigned, confirm my attendance at the
                        above-mentioned event.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.agreementText}>
                      <Text>
                        I understand the importance of my participation and will
                        make every effort to be present.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.agreementText}>
                      <Text>
                        Terms and Conditions: By confirming my attendance, I
                        agree to abide by the rules and regulations
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.agreementText}>
                      <Text>
                        set forth by the organizers for the smooth conduct of
                        the event.{" "}
                      </Text>
                    </View>
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          ) : null}
        </div>
      </div>
    </ReactModal>
  );
}
const mapStateToProps = (store) => ({
  profileState: profileListStateSelector(store),
});
export default connect(mapStateToProps, null)(TrainingAttendance);

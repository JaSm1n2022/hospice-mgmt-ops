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
import moment from "moment";
import { styled } from "@material-ui/core";
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
    border: "1px solid #000",

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

  leftLineText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    borderBottom: "1px solid black",
    width: "280px",
  },
  leftLineTextFullBorder: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    border: "1px solid black",
    width: "280px",
  },
  rightLineText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "right",
    fontSize: 12,
    borderBottom: "1px solid black",
    width: "200px",
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
  leftSectionHeader: {
    flexDirection: "row",
    justifyContent: "left",
    marginLeft: 10,
    fontSize: 14,
    paddingTop: "10px",
    borderBottom: "1px solid black",
    width: "200px",
  },
  leftSectionHeader2: {
    flexDirection: "row",
    justifyContent: "left",
    marginLeft: 10,
    fontSize: 16,
    paddingTop: "10px",
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
  titleText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    width: "90px",
  },

  titleText2: {
    marginTop: 5,
    marginLeft: 5,
    justifyContent: "left",
    fontSize: 12,

    width: "80px",
  },
  leftLineText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    borderBottom: "2px solid black",
    width: "240px",
  },
  leftLineText2: {
    marginTop: 5,

    fontSize: 12,
    borderBottom: "2px solid black",
    width: "120px",
  },

  table: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  infoTitleText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    width: "100px",
  },

  infoTitleText2: {
    marginTop: 5,
    marginLeft: 5,
    justifyContent: "left",
    fontSize: 12,

    width: "100px",
  },
  infoLeftLineText: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "left",
    fontSize: 12,
    borderBottom: "2px solid black",
    width: "180px",
  },
  infoLeftLineText2: {
    marginTop: 5,

    fontSize: 12,
    borderBottom: "2px solid black",
    width: "120px",
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
  cellSectionHeader: {
    width: "280px",
    display: "flex",
    flexWrap: "wrap",
    fontSize: 8,
    backgroundColor: "indigo",
    color: "white",
    textAlign: "left",
    paddingLeft: "2px",
    // borderRight: '1px solid #000',
    // borderTop: '1px solid #000',
    // borderLeft: '1px solid #000',
    paddingBottom: "2px",
    paddingTop: "2px",
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
function TransportationOrderDocument(props) {
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
        <HeaderModal title={"Transporation Form"} onClose={handleClose} />
        <div className={docStyles.content}>
          {printData ? (
            <PDFViewer style={styles.viewer}>
              {/* Start of the document*/}
              <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page} orientation="portrait" wrap>
                  <View style={styles.spaceHeader} />
                  <View
                    style={{ justifyContent: "center", flexDirection: "row" }}
                  >
                    <View style={{ marginRight: 10 }}>
                      <Image
                        src={logo}
                        style={{
                          height: "80px",
                          width: "600px",
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
                    <Text>{`Transportation Information Sheet`}</Text>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Date : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>
                        {moment(new Date()).utc().format("YYYY-MM-DD HH:mm")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Vendor Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData?.vendorName}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Patient Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData?.patientCd}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>DOB : </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text></Text>
                    </View>
                  </View>
                  <View style={styles.leftSectionHeader}>
                    <Text>{`TRANSFER INFORMATION :`}</Text>
                  </View>
                  <View style={styles.leftSectionHeader2}>
                    <Text>{`PICKUP`}</Text>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Pickup Date : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>
                        {" "}
                        {moment(new Date(printData.appointment))
                          .utc()
                          .format("YYYY-MM-DD")}
                      </Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Pick-up Time : </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>
                        {" "}
                        {moment(new Date(printData.appointment))
                          .utc()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.pickup.locName}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Type : </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.pickup.locType}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Address : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.pickup.address}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Reservation #: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.pickup.reservation || "N/A"}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Contact Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.pickup.contactPerson}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Contact No: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.pickup.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Room : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.pickup.room}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Gate Code: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.pickup.gate}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Story : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.pickup.story}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Stairs: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.pickup.stairs}</Text>
                    </View>
                  </View>
                  {/* DESTINATION */}
                  <View style={styles.leftSectionHeader2}>
                    <Text>{`DESTINATION`}</Text>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.destination.locName}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Type: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.destination.locType}</Text>
                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Address : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.destination.address}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Reservation #: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text> {printData.destination.reservation || "N/A"}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Contact Name : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.destination.contactPerson}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Contact No: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.destination.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Room No : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.destination.room}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Gate Code: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.destination.gate}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.titleText}>
                      <Text>Story : </Text>
                    </View>
                    <View style={styles.leftLineText}>
                      <Text>{printData.destination.story}</Text>
                    </View>
                    <View style={styles.titleText2}>
                      <Text>Stairs: </Text>
                    </View>
                    <View style={styles.leftLineText2}>
                      <Text>{printData.destination.stairs}</Text>
                    </View>
                  </View>
                  {/* PATIENT INFO */}
                  <View style={styles.leftSectionHeader2}>
                    <Text>{`Patient Information and needs during transfer:`}</Text>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.infoTitleText}>
                      <Text>Patient's Height : </Text>
                    </View>
                    <View style={styles.infoLeftLineText}>
                      <Text>{printData.patient?.height}</Text>
                    </View>
                    <View style={styles.infoTitleText2}>
                      <Text>Patient's Weight : </Text>
                    </View>
                    <View style={styles.infoLeftLineText2}>
                      <Text>{printData.patient?.weight}</Text>
                    </View>
                  </View>
                  <View style={styles.viewStyle}>
                    <View style={styles.infoTitleText}>
                      <Text>Full Code or DNR : </Text>
                    </View>
                    <View style={styles.infoLeftLineText}>
                      <Text>{printData?.patient?.fullCodeDNR}</Text>
                    </View>
                    <View style={styles.infoTitleText2}>
                      <Text>Oxygen required : </Text>
                    </View>
                    <View style={styles.infoLeftLineText2}>
                      <Text>{printData.patient?.oxygenRequired}</Text>
                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.infoTitleText}>
                      <Text>Mode of Transfer : </Text>
                    </View>
                    <View style={styles.infoLeftLineText}>
                      <Text>{printData.patient?.modeOfTransfer}</Text>
                    </View>
                    <View style={styles.infoTitleText2}>
                      <Text>Ride Along : </Text>
                    </View>
                    <View style={styles.infoLeftLineText2}>
                      <Text>{printData?.patient?.rideAlong}</Text>
                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={styles.infoTitleText}>
                      <Text>Covid Test Result : </Text>
                    </View>
                    <View style={styles.infoLeftLineText}>
                      <Text>{printData?.patient?.covidTest}</Text>
                    </View>
                    <View style={styles.infoTitleText2}>
                      <Text>MRN : </Text>
                    </View>
                    <View style={styles.infoLeftLineText2}>
                      <Text>{printData?.patient?.mrn}</Text>
                    </View>
                  </View>

                  <View style={styles.leftSectionHeader2}>
                    <Text>{`NOTES:`}</Text>
                  </View>
                  <View style={styles.row}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text
                        style={{
                          ...styles.leftLineTextFullBorder,
                          width: "560px",
                          paddingLeft: "20px",
                          paddingTop: "20px",
                          paddingBottom: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        {printData.notes}
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
export default connect(mapStateToProps, null)(TransportationOrderDocument);

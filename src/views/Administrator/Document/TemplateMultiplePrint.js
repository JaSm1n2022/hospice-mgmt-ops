import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";

import Hospice from "assets/img/headerdoc.png";

import { makeStyles } from "@material-ui/core/styles";

import DocumentHandler from "./DocumentHandler";
import PrintTable from "./PrintTable";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { connect } from "react-redux";

const useStyles = makeStyles({
  tableRow: {
    height: 32,
  },
  tableRow2: {
    height: 32,
  },
  tableCell: {
    padding: "0",
  },
});
let items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const TemplateMultiplePrint = (props) => {
  const [multiplePatients, setMultiplePatients] = useState([]);
  const [prepared, setPrepared] = useState("");
  const [pickup, setPickup] = useState("");
  const [patientName, setPatientName] = useState("");
  const [details, setDetails] = useState([]);
  const [logo, setLogo] = useState("");
  const classes = useStyles();
  useEffect(() => {
    console.log("[Template Print[", props);
    setMultiplePatients(props.multiPatients);
    setLogo(Hospice);
  }, [props]);

  const pcsHandler = (qty, unit) => {
    if (unit && unit === "Pcs" && qty < 2) {
      return `Pc`;
    }
    return unit;
  };
  const makeCategoryShortHandler = (category, product) => {
    if (category && category.toLowerCase().startsWith("underwear")) {
      return "Underwear";
    } else if (category && category.toLowerCase().startsWith("pill crusher")) {
      return "Pill Crusher";
    } else if (category && category.toLowerCase() === "perineal cleanser") {
      return "Cleanser";
    } else if (category && category.toLowerCase() === "abdominal pad") {
      return "Pad";
    } else if (category && category.toLowerCase() === "adhesive pad") {
      return "Pad";
    } else if (category && category.toLowerCase() === "blood oxygen monitor") {
      return "BO Monitor";
    } else if (category && category.toLowerCase() === "condom catheter") {
      return "Catheter";
    } else if (category && category.toLowerCase().endsWith("jelly")) {
      return "Jelly";
    } else if (
      category &&
      category.toLowerCase() === "nutrition shake" &&
      product.indexOf("Ensure") !== -1
    ) {
      return "Nutrition";
    } else if (
      category &&
      category.toLowerCase() === "nutrition shake" &&
      product.indexOf("BOOST") !== -1
    ) {
      return "Nutrition";
    } else {
      return category;
    }
  };
  const inputHandler = ({ target }) => {
    if (target.name === "prepared") {
      setPrepared(target.value);
    } else if (target.name === "pickup") {
      setPickup(target.value);
    } else if (target.name === "patientName") {
      setPatientName(target.value);
    }
  };
  console.log("[MultiplePatients]", multiplePatients);
  return (
    <React.Fragment>
      {multiplePatients && multiplePatients.length ? (
        <Grid container style={{ width: "800px", paddingLeft: 20 }}>
          {multiplePatients &&
            multiplePatients.length &&
            multiplePatients.map((item, indx) => {
              return (
                <Grid key={`p-${indx}`}>
                  <Grid key={`p2-${indx}`} item xs={12} spacing={2}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: 10,
                        paddingTop: 10,
                      }}
                    >
                      <img
                        src={logo}
                        alt=""
                        style={{ height: "120px", width: "800px" }}
                      />
                      {/*
                      <div>
                        <div>
                          <Typography variant="h6">
                            {props.profileState?.data[0]?.company_name || ""}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h6">
                            {props.profileState?.data[0]?.address || ""}
                          </Typography>
                        </div>
                       
                        <div>
                          <Typography variant="h6">
                            {props.profileState?.data[0]?.city || ""}{" "}
                            {props.profileState?.data[0]?.state || ""}{" "}
                            {props.profileState?.data[0]?.postal || ""}
                          </Typography>
                        </div>
                      </div>
                      */}
                    </div>
                    <div align="center" style={{ width: "800px" }}>
                      <Typography variant="h6">
                        SUPPLIES DELIVERY RECORDS
                      </Typography>

                      <div
                        style={{
                          paddingLeft: 10,
                          paddingRight: 50,
                          paddingBottom: 20,
                        }}
                      >
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              gap: 4,
                            }}
                          >
                            <Typography>Patient Name :</Typography>
                            <TextField
                              variant="standard"
                              inputProps={{
                                style: {
                                  height: 16,
                                  padding: "0 14px",
                                },
                              }}
                              value={patientName}
                              name="patientName"
                              onChange={inputHandler}
                            />
                          </div>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            <Typography>Date Prepared :</Typography>
                            <div style={{ paddingTop: 6 }}>
                              <Typography>
                                <TextField
                                  variant="standard"
                                  inputProps={{
                                    style: {
                                      height: 16,
                                      padding: "0 14px",
                                    },
                                  }}
                                  value={
                                    prepared ||
                                    moment(new Date()).format("YYYY-MM-DD")
                                  }
                                  name="prepared"
                                  onChange={inputHandler}
                                />
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              gap: 4,
                              borderBottom: "1px solid black",
                            }}
                          >
                            <Typography>Facility/POS :</Typography>
                            <Typography>
                              {item.general.facility ||
                                item.general.patient.location}
                            </Typography>
                          </div>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            <Typography>Date Pickup :</Typography>
                            <div style={{ paddingTop: 6 }}>
                              <Typography>
                                <TextField
                                  variant="standard"
                                  inputProps={{
                                    style: {
                                      height: 16,
                                      padding: "0 14px",
                                    },
                                  }}
                                  value={
                                    pickup ||
                                    moment(new Date()).format("YYYY-MM-DD")
                                  }
                                  name="pickup"
                                  onChange={inputHandler}
                                />
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        {/*
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableBody>
                            <TableRow className={classes.tableRow2}>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                  width: "50%",
                                }}
                                component="th"
                                scope="row"
                              >
                                Patient Name : {item.general.patientName || ""}
                              </TableCell>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                <div style={{ display: "inline-flex" }}>
                                  <Typography variant="bold1">{`Date Prepared : `}</Typography>
                                  <TextField
                                    variant="standard"
                                    inputProps={{
                                      style: {
                                        height: 16,
                                        padding: "0 14px",
                                      },
                                    }}
                                    value={prepared}
                                    name="prepared"
                                    onChange={inputHandler}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className={classes.tableRow2}>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                Facility/POS : {item.general.facility || ""}
                              </TableCell>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                <div style={{ display: "inline-flex" }}>
                                  <Typography variant="bold1">
                                    Date Pickup :{" "}
                                  </Typography>
                                  <TextField
                                    variant="standard"
                                    inputProps={{
                                      style: {
                                        height: 16,
                                        padding: "0 14px",
                                      },
                                    }}
                                    value={pickup}
                                    name="pickup"
                                    onChange={inputHandler}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                                  */}
                      </div>
                      <div
                        style={{
                          paddingLeft: 10,
                          paddingRight: 50,
                        }}
                      >
                        <PrintTable
                          onCheckboxSelectionHandler={null}
                          columns={DocumentHandler.cnaColumns()}
                          dataSource={DocumentHandler.productItems(
                            item.details,
                            "admin"
                          )}
                        />
                      </div>
                      <div style={{ paddingLeft: 10, paddingRight: 50 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableBody>
                            <TableRow
                              style={{ border: 0 }}
                              className={classes.tableRow}
                            >
                              <TableCell style={{ height: 24, border: 0 }}>
                                <div>
                                  {item.general.requestor
                                    ? item.general.requestor.name
                                    : ""}{" "}
                                  {item.general.requestor &&
                                  item.general.requestor.position
                                    ? `(${item.general.requestor.position})`
                                    : ""}
                                </div>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Name and Title</div>
                              </TableCell>
                              <TableCell align="right" style={{ border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Name of Patient/Caregiver</div>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              style={{ border: 0 }}
                              className={classes.tableRow}
                            >
                              <TableCell style={{ height: 24, border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Signature</div>
                              </TableCell>
                              <TableCell align="right" style={{ border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Signature</div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div align="right">
                          <small>CNA Copy</small>
                        </div>
                      </div>
                    </div>
                  </Grid>

                  <Grid
                    key={`p3-${indx}`}
                    item
                    xs={12}
                    spacing={2}
                    style={{ paddingTop: 60 }}
                  >
                    <div align="center" style={{ width: "800px" }}>
                      <Typography variant="h6">
                        SUPPLIES DELIVERY RECORDS
                      </Typography>

                      <div
                        style={{
                          paddingLeft: 10,
                          paddingRight: 50,
                          paddingBottom: 30,
                        }}
                      >
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              gap: 4,
                              borderBottom: "1px solid black",
                            }}
                          >
                            <Typography>Patient Name :</Typography>
                            <Typography>
                              {item.general.patientName ||
                                item.general.patient.name}
                            </Typography>
                          </div>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            <Typography>Date Prepared :</Typography>
                            <div style={{ paddingTop: 6 }}>
                              <Typography>
                                <TextField
                                  variant="standard"
                                  inputProps={{
                                    style: {
                                      height: 16,
                                      padding: "0 14px",
                                    },
                                  }}
                                  value={
                                    prepared ||
                                    moment(new Date()).format("YYYY-MM-DD")
                                  }
                                  name="prepared"
                                  onChange={inputHandler}
                                />
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              gap: 4,
                              borderBottom: "1px solid black",
                            }}
                          >
                            <Typography>Facility/POS :</Typography>
                            <Typography>
                              {item.general.facility ||
                                item.general.patient.location}
                            </Typography>
                          </div>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            <Typography>Date Pickup :</Typography>
                            <div style={{ paddingTop: 6 }}>
                              <Typography>
                                <TextField
                                  variant="standard"
                                  inputProps={{
                                    style: {
                                      height: 16,
                                      padding: "0 14px",
                                    },
                                  }}
                                  value={
                                    pickup ||
                                    moment(new Date()).format("YYYY-MM-DD")
                                  }
                                  name="pickup"
                                  onChange={inputHandler}
                                />
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        {/*
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableBody>
                            <TableRow className={classes.tableRow2}>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                  width: "50%",
                                }}
                                component="th"
                                scope="row"
                              >
                                Patient Name : {item.general.patientName || ""}
                              </TableCell>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                <div style={{ display: "inline-flex" }}>
                                  <Typography variant="bold1">{`Date Prepared : `}</Typography>
                                  <TextField
                                    variant="standard"
                                    inputProps={{
                                      style: {
                                        height: 16,
                                        padding: "0 14px",
                                      },
                                    }}
                                    value={prepared}
                                    name="prepared"
                                    onChange={inputHandler}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className={classes.tableRow2}>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                Facility/POS : {item.general.facility || ""}
                              </TableCell>
                              <TableCell
                                className={classes.tableCell}
                                style={{
                                  height: "auto !important",
                                  border: "solid 1px black",
                                }}
                                component="th"
                                scope="row"
                              >
                                <div style={{ display: "inline-flex" }}>
                                  <Typography variant="bold1">
                                    Date Pickup :{" "}
                                  </Typography>
                                  <TextField
                                    variant="standard"
                                    inputProps={{
                                      style: {
                                        height: 16,
                                        padding: "0 14px",
                                      },
                                    }}
                                    value={pickup}
                                    name="pickup"
                                    onChange={inputHandler}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                                  */}
                      </div>
                      <div
                        style={{
                          paddingLeft: 10,
                          paddingRight: 50,
                          paddingTop: 0,
                        }}
                      >
                        <PrintTable
                          onCheckboxSelectionHandler={null}
                          columns={DocumentHandler.adminColumns()}
                          dataSource={[
                            ...DocumentHandler.productItems(
                              item.details,
                              "admin"
                            ),
                          ]}
                        />
                      </div>
                      <div style={{ paddingLeft: 10, paddingRight: 50 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableBody>
                            <TableRow
                              style={{ border: 0 }}
                              className={classes.tableRow}
                            >
                              <TableCell style={{ height: 24, border: 0 }}>
                                <div>
                                  {item.general.requestor
                                    ? item.general.requestor.name
                                    : ""}{" "}
                                  {item.general.requestor &&
                                  item.general.requestor.position
                                    ? `(${item.general.requestor.position})`
                                    : ""}
                                </div>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Name and Title</div>
                              </TableCell>
                              <TableCell align="right" style={{ border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Name of Patient/Caregiver</div>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              style={{ border: 0 }}
                              className={classes.tableRow}
                            >
                              <TableCell style={{ height: 24, border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Signature</div>
                              </TableCell>
                              <TableCell align="right" style={{ border: 0 }}>
                                <div>
                                  _________________________________________
                                </div>
                                <div>Signature</div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div align="right">
                          <small>Admin Copy</small>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      ) : null}
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  profileState: profileListStateSelector(store),
});

export default connect(mapStateToProps, null)(TemplateMultiplePrint);

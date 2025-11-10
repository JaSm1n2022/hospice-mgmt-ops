import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { connect } from "react-redux";
import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import moment from "moment";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  tableContainer: {
    overflowX: "auto",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
  },
  tableCell: {
    fontSize: "0.875rem",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
  headerCell: {
    fontSize: "0.875rem",
    fontWeight: "600",
    padding: "12px 8px",
    whiteSpace: "nowrap",
  },
};

const useStyles = makeStyles(styles);

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;

function HopeFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);

  useEffect(() => {
    console.log("Hope - loading patient data");
    isPatientListDone = false;
    setIsPatientsCollection(true);
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
      });
    }

    // Cleanup: reset state when component unmounts
    return () => {
      props.resetListPatients();
    };
  }, []);

  if (
    isPatientsCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    let source = props.patients.data;
    if (source && source.length) {
      // Filter patients with SOC >= 10/01/2025
      const cutoffDate = moment("2025-10-01");
      source = source.filter((p) => {
        if (!p.soc) return false;
        return moment(p.soc).isSameOrAfter(cutoffDate, 'day');
      });
    }
    setDataSource(source);
    setIsPatientsCollection(false);
    props.resetListPatients();
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD/YYYY");
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MM/DD");
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
  };

  const calculateTimeline = (socDate) => {
    if (!socDate) return {};
    const soc = moment(socDate);

    return {
      admitDate: soc.format("MM/DD/YYYY"),
      svfDue: soc.clone().add(2, "days").format("MM/DD/YYYY"),
      comprehensiveAssessment: soc.clone().add(5, "days").format("MM/DD/YYYY"),
      huvDateStart: soc.clone().add(6, "days"),
      huvDateEnd: soc.clone().add(15, "days"),
      sfvDueStart: soc.clone().add(8, "days"),
      sfvDueEnd: soc.clone().add(15, "days"),
      huv1Completed: soc.clone().add(15, "days").format("MM/DD/YYYY"),
      huv2DateStart: soc.clone().add(16, "days"),
      huv2DateEnd: soc.clone().add(30, "days"),
      sfv2DueStart: soc.clone().add(18, "days"),
      sfv2DueEnd: soc.clone().add(30, "days"),
      huv2Completed: soc.clone().add(30, "days").format("MM/DD/YYYY"),
    };
  };

  isProcessDone = isPatientListDone;

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>Loading Patient Timeline...</div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Patient Timeline (HOPE)
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Patient milestones for SOC on or after 10/01/2025
                  </p>
                </CardHeader>
                <CardBody>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small">
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell className={classes.headerCell}>Patient</TableCell>
                          <TableCell className={classes.headerCell}>
                            Admit Date<br />(Day 0)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SVF DUE<br />(Day 2)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Comprehensive Assessment<br />(Day 5)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV Date<br />(Day 6-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV Due<br />(Day 8-15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV1 Completed<br />(Day 15)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Date<br />(Day 16-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            SFV2 Due<br />(Day 18-30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            HUV2 Completed<br />(Day 30)
                          </TableCell>
                          <TableCell className={classes.headerCell}>
                            Discharge
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataSource && dataSource.length > 0 ? (
                          dataSource.map((patient, index) => {
                            const timeline = calculateTimeline(patient.soc);
                            return (
                              <TableRow key={index} hover>
                                <TableCell className={classes.tableCell}>
                                  {patient.patientCd || "N/A"}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.admitDate}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.svfDue}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.comprehensiveAssessment}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huvDateStart,
                                    timeline.huvDateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.sfvDueStart,
                                    timeline.sfvDueEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv1Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.huv2DateStart,
                                    timeline.huv2DateEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {formatDateRange(
                                    timeline.sfv2DueStart,
                                    timeline.sfv2DueEnd
                                  )}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {timeline.huv2Completed}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  {patient.eoc ? formatDate(patient.eoc) : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={11} align="center">
                              No patient data found (SOC >= 10/01/2025)
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HopeFunction);

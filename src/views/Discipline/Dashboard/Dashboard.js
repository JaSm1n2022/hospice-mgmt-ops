import React, { useContext, useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
import { contractListStateSelector } from "store/selectors/contractSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { attemptToFetchAssignment } from "store/actions/assignmentAction";
import { resetFetchAssignmentState } from "store/actions/assignmentAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { connect } from "react-redux";
import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import {
  Event,
  EventAvailableOutlined,
  MonetizationOnOutlined,
  PeopleAltOutlined,
  TodayOutlined,
} from "@material-ui/icons";
import { attemptToFetchRoutesheet } from "store/actions/routesheetAction";
import { resetFetchRoutesheetState } from "store/actions/routesheetAction";
import { routesheetListStateSelector } from "store/selectors/routesheetSelector";
import { CircularProgress } from "@material-ui/core";
import Helper from "utils/helper";
import Assignment from "@material-ui/icons/Assignment";
import { attemptToFetchContract } from "store/actions/contractAction";
import { resetFetchContractState } from "store/actions/contractAction";
import { contractCreateStateSelector } from "store/selectors/contractSelector";
import dayjs from "dayjs";

let earnings = [];

let isAssignmentDone = false;
let isRoutesheetDone = false;
let assignmentList = [];
let routesheetList = [];
let contractList = [];
let isProcessDone = false;
let isContractDone = false;
let assignFrequencyVisit = [];
const useStyles = makeStyles(styles);

function Dashboard(props) {
  const context = useContext(SupaContext);
  const [scheduledVisit, setScheduledVisit] = useState(0);
  const [completedVisit, setCompletedVisit] = useState(0);
  const [estimatedPayment, setEstimatedPayment] = useState(0);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isRoutesheetCollection, setIsRouteSheetCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);
  const [routesheetData, setRoutesheetData] = useState([]);
  const [totalServicePayment, setTotalServicePayment] = useState(0);
  const [visitData, setVisitData] = useState([]);
  const [visits, setVisits] = useState([]);

  const classes = useStyles();
  useEffect(() => {
    const dates = Helper.formatDateRangeByCriteriaV2("thisWeek");
    if (context.userProfile?.companyId) {
      props.listAssignments({
        companyId: context.userProfile.companyId,
        discipline: context.employeeProfile.id,
      });

      props.listRoutesheets({
        companyId: context.userProfile.companyId,
        discipline: context.employeeProfile.id,
        from: dates.from,
        to: dates.to,
      });
    }
  }, []);
  useEffect(() => {
    if (
      !isAssignmentCollection &&
      props.assignmentState?.status === ACTION_STATUSES.SUCCEED
    ) {
      isAssignmentDone = true;
      props.resetListAssignment();
      setIsAssignmentCollection(true);
      assignmentList = props.assignmentState?.data || [];
      setScheduledVisit(clientInformationFrequencyHandler(assignmentList));
      setVisitData(createVisitDataHandler(assignmentList));
      isContractDone = false;
      const uniqueList = Array.from(
        new Set(assignmentList?.map((m) => m.patientCd) || [])
      );
      props.listContracts({
        companyId: context.userProfile.companyId,
        discipline: context.employeeProfile.id,
        // patientIds: uniqueList,
      });
      isAssignmentDone = true;
      // collect contracts of patients
    }
    if (
      !isRoutesheetCollection &&
      props.routesheetState?.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListRoutesheet();
      setIsRouteSheetCollection(true);
      routesheetList = props.routesheetState.data || [];
      setCompletedVisit(routesheetList?.length);
      setRoutesheetData(createTableDataHandler(routesheetList));

      earnings = setEarningsHandler(routesheetList);
      isRoutesheetDone = true;
    }
    if (
      !isContractCollection &&
      props.contracts?.status === ACTION_STATUSES.SUCCEED
    ) {
      contractList = props.contracts.data || [];
      setEstimatedPayment(calculateEstimatedPaymentHandler(contractList));
      props.resetListContracts();
      setIsContractCollection(true);

      console.log(
        "[Contract List]",
        contractList,
        assignmentList,
        scheduledVisit
      );
      isContractDone = true;
      //setRoutesheetData(createTableDataHandler(routesheetList));
    }
  }, [isAssignmentCollection, isRoutesheetCollection, isContractCollection]);
  if (
    isAssignmentCollection &&
    props.assignmentState?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsAssignmentCollection(false);
  }
  if (
    isRoutesheetCollection &&
    props.routesheetState?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsRouteSheetCollection(false);
  }
  if (
    isContractCollection &&
    props.contracts?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsContractCollection(false);
  }
  const calculateEstimatedPaymentHandler = (data) => {
    let cost = 0;
    let cntrRate;
    if (assignmentList?.length) {
      assignmentList.forEach((a) => {
        cntrRate = data.find(
          (d) =>
            a.patientCd?.toString() === d.patientCd &&
            d.serviceType?.toLowerCase() === "regular visit"
        );
        if (!cntrRate) {
          cntrRate = data.find(
            (d) => d.serviceType?.toLowerCase() === "regular visit"
          );
          console.log("[FOUND]", cntrRate);
        }

        if (cntrRate) {
          const frequencyVisit = clientInformationFrequencyHandler([a]);
          cost += cntrRate.serviceRate * (frequencyVisit || 0);
        }
      });
    }
    return cost;
  };
  console.log("[assignment]", assignmentList);
  const setEarningsHandler = (data) => {
    const less = [];
    data.forEach((d) => {
      less.push({
        name: d.patientCd,
        date: dayjs(d.dosStart).format("YYYY-MM-DD HH:mm"),
        service: d.service,
        amount: d.estimatedPayment
          ? `$${parseFloat(d.estimatedPayment).toFixed(2)}`
          : 0,
      });
    });
    return less;
  };
  const createTableDataHandler = (data) => {
    const colors = ["success", "info", "warning", "danger"];
    const tables = [];
    let grandTotal = 0.0;
    let colorInt = 0;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      grandTotal += d.estimatedPayment;
      let c = {};

      if ((i + 1) % 2 === 0) {
        c = [
          dayjs(d.dosStart).format("YYYY-MM-DD HH:mm"),
          d.patientCd || "N/A",
          d.service,
          d.estimatedPayment
            ? `$${parseFloat(d.estimatedPayment).toFixed(2)}`
            : `$0`,
        ];
      } else {
        c.color = colors[colorInt];
        c.data = [
          dayjs(d.dosStart).format("YYYY-MM-DD HH:mm"),
          d.patientCd || "N/A",
          d.service,
          d.estimatedPayment
            ? `$${parseFloat(d.estimatedPayment).toFixed(2)}`
            : `$0.00`,
        ];
        colorInt++;
      }

      if (colorInt === 4) {
        colorInt = 0;
      }
      tables.push(c);
    }
    setTotalServicePayment(parseFloat(grandTotal).toFixed(2));
    return tables;
  };
  const clientInformationFrequencyHandler = (data) => {
    let totalVisit = 0;
    data.forEach((cls) => {
      if (cls?.cnaId === context.employeeProfile.id) {
        totalVisit += parseInt(cls.cnaFreqVisit || 0);
      } else if (cls.rnId === context.employeeProfile.id) {
        totalVisit += parseInt(cls.rnFreqVisit || 0);
      } else if (cls.lpnId === context.employeeProfile.id) {
        totalVisit += parseInt(cls.lpnFreqVisit || 0);
      } else if (cls.mswId === context.employeeProfile.id) {
        totalVisit += parseInt(cls.mswFreqVisit || 0);
      } else if (cls.chaplainId === context.employeeProfile.id) {
        totalVisit += parseInt(cls.chaplainFreqVisit || 0);
      }
    });
    return totalVisit;
  };
  const createVisitDataHandler = (data) => {
    const colors = ["success", "info", "warning", "danger"];
    const tables = [];
    const visitList = [];
    let grandTotal = 0.0;
    let colorInt = 0;
    for (let i = 0; i < data.length; i++) {
      const cls = data[i];
      let vis = {};
      if (cls?.cnaId === context.employeeProfile.id) {
        vis = {
          patient: cls.patientCd,
          frequencyVisit: cls.cnaFreqVisit
            ? `${parseInt(cls.cnaFreqVisit || 0)}x/${cls.cnaFreqVisitType}`
            : "",
          time: cls.cnaTime || "No fixed time",
          days: cls.cnaWeek?.length ? cls.cnaWeek.toString() : "N/A",
        };
      } else if (cls.rnId === context.employeeProfile.id) {
        vis = {
          patient: cls.patientCd,
          frequencyVisit: cls.rnFreqVisit
            ? `${parseInt(cls.rnFreqVisit || 0)}x/${cls.rnFreqVisitType}`
            : "",
          time: cls.rnTime || "No fixed time",
          days: cls.rnWeek?.length ? cls.rnWeek.toString() : "N/A",
        };
      } else if (cls.lpnId === context.employeeProfile.id) {
        vis = {
          patient: cls.patientCd,
          frequencyVisit: cls.lpnFreqVisit
            ? `${parseInt(cls.lpnFreqVisit || 0)}x/${cls.lpnFreqVisitType}`
            : "",
          time: cls.lpnTime || "No fixed time",
          days: cls.lpnWeek?.length ? cls.lpnWeek.toString() : "N/A",
        };
      } else if (cls.mswId === context.employeeProfile.id) {
        vis = {
          patient: cls.patientCd,
          frequencyVisit: cls.mswFreqVisit
            ? `${parseInt(cls.mswFreqVisit || 0)}x/${cls.mswFreqVisitType}`
            : "",
          time: cls.mswTime || "No fixed time",
          days: cls.mswWeek?.length ? cls.mswWeek.toString() : "N/A",
        };
      } else if (cls.chaplainId === context.employeeProfile.id) {
        vis = {
          patient: cls.patientCd,
          frequencyVisit: cls.chaplainFreqVisit
            ? `${parseInt(cls.chaplainFreqVisit || 0)}x/${
                cls.chaplainFreqVisitType
              }`
            : "",
          time: cls.chaplainTime || "No fixed time",
          days: cls.chaplainWeek?.length ? cls.chaplainWeek.toString() : "N/A",
        };
      }
      visitList.push(vis);
      let c = {};

      if ((i + 1) % 2 === 0) {
        c = [vis.patient, vis.frequencyVisit, vis.days, vis.time];
      } else {
        c.color = colors[colorInt];
        c.data = [vis.patient, vis.frequencyVisit, vis.days, vis.time];
        colorInt++;
      }

      if (colorInt === 4) {
        colorInt = 0;
      }
      tables.push(c);
    }
    setVisits(visitList);
    return tables;
  };
  const tableData = earnings?.map((item, index) => [
    <div
      key={index}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ flex: "60%" }}>
        <span>
          <small className={classes.tdNameAnchor}>{item.name}</small>

          <h6 className={classes.tdNameSmall}>{item.service}</h6>
        </span>
      </div>
      <div style={{ flex: "40%" }}>
        <span>
          <small>{item.date}</small>

          <h5 style={{ fontWeight: "bold" }}>{item.amount}</h5>
        </span>
      </div>
    </div>,
  ]);

  const visitTableData = visits?.map((item, index) => [
    <div
      key={index}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ flex: "60%" }}>
        <span>
          <h6 className={classes.tdNameAnchor}>{item.patient}</h6>

          <small className={classes.tdNameSmall}>{item.days}</small>
        </span>
      </div>
      <div style={{ flex: "40%" }}>
        <span>
          <h6 className={classes.tdNameAnchor}>{item.frequencyVisit}</h6>
          <small>
            {item.time && item.time?.toLowerCase() !== "open"
              ? item.time
              : "No fixed time"}
          </small>
        </span>
      </div>
    </div>,
  ]);
  isProcessDone = isAssignmentDone && isRoutesheetDone && isContractDone;
  console.log("[ROUTESHEET]", routesheetData);
  return (
    <>
      {isProcessDone ? (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <PeopleAltOutlined />
                  </CardIcon>
                  <p className={classes.cardCategory}>Assigned Patients</p>
                  <h3 className={classes.cardTitle}>
                    {assignmentList?.length}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>As of Today</div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <TodayOutlined />
                  </CardIcon>
                  <p className={classes.cardCategory}>Scheduled Visits</p>
                  <h3 className={classes.cardTitle}>{scheduledVisit}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <TodayOutlined />
                    This Week
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <EventAvailableOutlined />
                  </CardIcon>
                  <p className={classes.cardCategory}>Completed Visits</p>
                  <h3 className={classes.cardTitle}>{completedVisit}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <TodayOutlined />
                    This Week
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <MonetizationOnOutlined />
                  </CardIcon>
                  <p className={classes.cardCategory}>Est. Visit Payment</p>
                  <h3
                    className={classes.cardTitle}
                  >{`$${estimatedPayment}`}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <TodayOutlined />
                    This Week
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            {context.isMobile ? (
              <GridItem xs={12}>
                <Card>
                  <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                      <Assignment />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      This Week’s Earnings
                      <br></br>
                      <h6
                        style={{ fontWeight: "bold" }}
                      >{`Total Earnings: $${totalServicePayment}`}</h6>
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Table
                      tableData={tableData || []}
                      tableShopping
                      customHeadCellClasses={[
                        classes.center,
                        classes.description,
                        classes.description,
                        classes.right,
                        classes.right,
                        classes.right,
                      ]}
                      customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
                      customCellClasses={[
                        classes.tdName,
                        classes.customFont,
                        classes.customFont,
                        classes.tdNumber,
                        classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                        classes.tdNumber,
                      ]}
                      customClassesForCells={[1, 2, 3, 4, 5, 6]}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            ) : (
              <GridItem xs={12}>
                <Card>
                  <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                      <Assignment />
                    </CardIcon>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4 className={classes.cardIconTitle}>
                        This Week’s Earnings Overview
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody className={classes.customCardContentClass}>
                    <div align="right">
                      <h4
                        style={{ fontWeight: "bold" }}
                      >{`Total Earnings: $${totalServicePayment}`}</h4>
                    </div>
                    <Table
                      hover
                      tableHead={[
                        "Date",
                        "Client",
                        "Service",
                        "Estimated Payment",
                      ]}
                      tableData={
                        Array.isArray(routesheetData) && routesheetData?.length
                          ? routesheetData
                          : []
                      }
                    />
                  </CardBody>
                </Card>
              </GridItem>
            )}
          </GridContainer>
          {/* Scheduled Visits Assignment */}
          <GridContainer>
            {context.isMobile ? (
              <GridItem xs={12}>
                <Card>
                  <CardHeader color="warning" icon>
                    <CardIcon color="warning">
                      <Event />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      Scheduled Visit Details
                      <br></br>
                      <h6
                        style={{ fontWeight: "bold" }}
                      >{`Total Visit: ${scheduledVisit}`}</h6>
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Table
                      tableData={visitTableData || []}
                      tableShopping
                      customHeadCellClasses={[
                        classes.center,
                        classes.description,
                        classes.description,
                        classes.right,
                        classes.right,
                        classes.right,
                      ]}
                      customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
                      customCellClasses={[
                        classes.tdName,
                        classes.customFont,
                        classes.customFont,
                        classes.tdNumber,
                        classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                        classes.tdNumber,
                      ]}
                      customClassesForCells={[1, 2, 3, 4, 5, 6]}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            ) : (
              <GridItem xs={12}>
                <Card>
                  <CardHeader color="warning" icon>
                    <CardIcon color="warning">
                      <Event />
                    </CardIcon>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4 className={classes.cardIconTitle}>
                        Scheduled Visit Details
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody className={classes.customCardContentClass}>
                    <div align="right">
                      <h4
                        style={{ fontWeight: "bold" }}
                      >{`Total Visit: ${scheduledVisit}`}</h4>
                    </div>
                    <Table
                      hover
                      tableHead={["Patient", "Frequency", "Days", "Time"]}
                      tableData={
                        Array.isArray(visitData) && visitData?.length
                          ? visitData
                          : []
                      }
                    />
                  </CardBody>
                </Card>
              </GridItem>
            )}
          </GridContainer>
        </div>
      ) : (
        <div>
          <CircularProgress></CircularProgress>Loading...
        </div>
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  assignmentState: assignmentListStateSelector(store),
  contracts: contractListStateSelector(store),
  patients: patientListStateSelector(store),
  routesheetState: routesheetListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignment: () => dispatch(resetFetchAssignmentState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listRoutesheets: (data) => dispatch(attemptToFetchRoutesheet(data)),
  resetListRoutesheet: () => dispatch(resetFetchRoutesheetState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

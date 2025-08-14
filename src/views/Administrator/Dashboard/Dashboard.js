import React, { useState, useEffect, useContext } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
//import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";

/* Do not import for now
import Scheduled from "@material-ui/icons/Schedule";
import Phone from "@material-ui/icons/Phone";
import Office from "@material-ui/icons/HomeWork";
import Cloud from "@material-ui/icons/Cloud";
*/

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
/* Do not import for now

import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
*/
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
/* do nit import for now
import CardBody from "components/Card/CardBody.js";
*/
import CardFooter from "components/Card/CardFooter.js";
/* do not import
import { dme, call, office } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";
*/
import styles from "../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { SupaContext } from "App";
import {
  AccountCircle,
  AirportShuttle,
  AttachMoney,
  Settings,
  TimelineRounded,
} from "@material-ui/icons";
/* Do not imoprt
import StockRoomView from "views/Logistics/StockRoom/StockRoomView";
*/
import { CircularProgress } from "@material-ui/core";

/* do not import
import CallView from "views/Administrative/Calls/CallsView";
import OfficeTaskView from "views/Administrative/Tasks/TasksView";
import GearSetting from "components/Popper/GearSetting";
import TransportationView from "views/Logistics/Transportation/TransportationView";

import AdmittanceView from "views/Admittance/AdmittanceView";
*/

import TransactionHandler from "../Transaction/handler/TransactionHandler.js";
import { patientListStateSelector } from "store/selectors/patientSelector.js";
import { distributionListStateSelector } from "store/selectors/distributionSelector.js";
import { transactionListStateSelector } from "store/selectors/transactionSelector.js";
import { profileListStateSelector } from "store/selectors/profileSelector.js";
import { attemptToFetchPatient } from "store/actions/patientAction.js";
import { resetFetchPatientState } from "store/actions/patientAction.js";
import { attemptToFetchDistribution } from "store/actions/distributionAction.js";
import { resetFetchDistributionState } from "store/actions/distributionAction.js";
import { attemptToFetchTransaction } from "store/actions/transactionAction.js";
import { resetFetchTransactionState } from "store/actions/transactionAction.js";
import { connect } from "react-redux";
import { ACTION_STATUSES } from "utils/constants.js";
import Helper from "utils/helper.js";

import {
  roundedLineChart,
  straightLinesChart,
  simpleBarChart,
  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart,
  pieChart,
} from "variables/charts.js";

import chartStyles from "../../../assets/jss/material-dashboard-pro-react/views/chartsStyle.js";
import Timeline from "components/Timeline/Timeline.js";
import CardBody from "components/Card/CardBody.js";

const useStyles = makeStyles(styles);

const useChartStyles = makeStyles(chartStyles);
let isPatientListDone = false;
let isDisplayDone = false;
let isDistributionDone = false;
let patientCnt = 0;
let distributionTotal = 0.0;
let transactionTotal = 0.0;
let isTransactionDone = false;
function Dashboard(props) {
  const context = useContext(SupaContext);

  useEffect(() => {
    const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");

    if (context.userProfile?.companyId) {
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listDistributions({
        from: dates.from,
        to: dates.to,
        companyId: context.userProfile?.companyId,
      });
      props.listTransactions({
        from: dates.from,
        to: dates.to,
        companyId: context.userProfile?.companyId,
      });
    }
  }, []);
  const classes = useStyles();
  const chartClasses = useChartStyles();
  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    isPatientListDone = true;
    patientCnt = props?.patients?.data?.filter(
      (p) => p.status.toLowerCase() === "active"
    ).length;
    props.resetListPatients();
  }
  if (
    props.distributions &&
    props.distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    isDistributionDone = true;
    distributionTotal = 0.0;
    props.distributions.data.forEach((e) => {
      distributionTotal = parseFloat(
        parseFloat(distributionTotal) + parseFloat(e.estimated_total_amt)
      ).toFixed(2);
    });

    props.resetListDistributions();
  }
  if (
    props.transactions &&
    props.transactions.status === ACTION_STATUSES.SUCCEED
  ) {
    transactionTotal = 0.0;
    isTransactionDone = true;
    let source = props.transactions.data;
    if (source && source.length) {
      source = TransactionHandler.mapData(source);
      const grands = source.map((map) => map.grand_total);
      grands.forEach((g) => {
        transactionTotal += parseFloat(g) || 0.0;
      });
    }
    props.resetlistTransactions();
  }
  console.log(
    "[IS PATIENT]",
    isPatientListDone,
    isDistributionDone,
    isTransactionDone
  );
  isDisplayDone = isPatientListDone && isDistributionDone && isTransactionDone;
  return (
    <div>
      {!isDisplayDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <AccountCircle />
                  </CardIcon>
                  <p className={classes.cardCategory}>Patients</p>
                  <h3 className={classes.cardTitle}>
                    {patientCnt} <small>Active</small>
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    As of today
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Store />
                  </CardIcon>
                  <p className={classes.cardCategory}>Discharge</p>
                  <h3 className={classes.cardTitle}>{0}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    This month
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <AttachMoney />
                  </CardIcon>
                  <p className={classes.cardCategory}>Estimated Revenue</p>
                  <h3 className={classes.cardTitle}>{`${parseFloat(
                    transactionTotal || 0.0
                  ).toFixed(2)}`}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    This month
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <AirportShuttle />
                  </CardIcon>
                  <p className={classes.cardCategory}>Est. Expenses</p>
                  <h3 className={classes.cardTitle}>$0</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    This month
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="rose" icon>
                  <CardIcon color="rose">
                    <TimelineRounded />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>
                    Expenses vs. Revenue <small>- 12-Month </small>
                  </h4>
                </CardHeader>
                <CardBody>
                  <ChartistGraph
                    data={multipleBarsChart.data}
                    type="Bar"
                    options={multipleBarsChart.options}
                    listener={multipleBarsChart.animation}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          {/*
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomTabs
                title="Tasks:"
                headerColor="haloes"
                noGear={true}
                tabs={[
                  {
                    tabName: "DME appointment",
                    tabIcon: Scheduled,
                    tabContent: <EquipmentView />,
                  },
                  {
                    tabName: "Transportation",
                    tabIcon: AirportShuttle,
                    tabContent: <TransportationView />,
                  },
                  {
                    tabName: "Call logs",
                    tabIcon: Phone,
                    tabContent: <CallView />,
                  },
                  {
                    tabName: "Office",
                    tabIcon: Office,
                    tabContent: <OfficeTaskView />,
                  },
                ]}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <Grid container justifyContent="space-between">
                    <div>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: "bold" }}
                      >
                        STOCKROOM
                      </Typography>
                      <Typography variant="body2">
                        Available as of today
                      </Typography>
                    </div>
                    <div style={{ paddinTop: 12 }}>
                      <GearSetting />
                    </div>
                  </Grid>
                </CardHeader>
                <CardBody>
                  <StockRoomView />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="info">
                  <Grid container justifyContent="space-between">
                    <div>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: "bold" }}
                      >
                        IDT Assignment
                      </Typography>
                      <Typography variant="body2">As of Today</Typography>
                    </div>
                    <div style={{ paddinTop: 12 }}>
                      <GearSetting />
                    </div>
                  </Grid>
                </CardHeader>
                <CardBody>
                  <AssignmentView />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <Grid container justifyContent="space-between">
                    <div>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: "bold" }}
                      >
                        Admittance Process checklist
                      </Typography>
                      <Typography variant="body2">As of Today</Typography>
                    </div>
                    <div style={{ paddinTop: 12 }}>
                      <GearSetting />
                    </div>
                  </Grid>
                </CardHeader>
                <CardBody>
                  <AdmittanceView />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
              */}
        </div>
      )}
    </div>
  );
}
const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  distributions: distributionListStateSelector(store),
  transactions: transactionListStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistributions: () => dispatch(resetFetchDistributionState()),
  listTransactions: (data) => dispatch(attemptToFetchTransaction(data)),
  resetlistTransactions: () => dispatch(resetFetchTransactionState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

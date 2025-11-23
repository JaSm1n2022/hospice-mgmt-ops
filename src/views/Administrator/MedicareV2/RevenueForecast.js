import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ChartistGraph from "react-chartist";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";

import MedicareHandler from "./components/MedicareHandler";
import { ACTION_STATUSES } from "utils/constants";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { SupaContext } from "App";

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
  },
  filterSection: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  selectField: {
    backgroundColor: "white",
    borderRadius: "4px",
  },
  chartLegend: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  tableContainer: {
    marginTop: "30px",
    maxHeight: "500px",
    overflowY: "auto",
  },
  tableHeader: {
    backgroundColor: "#667eea",
    "& th": {
      color: "black",
      fontWeight: "bold",
      fontSize: "0.95rem",
    },
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f5f5f5",
    },
    "&:hover": {
      backgroundColor: "#e3f2fd",
    },
  },
  totalRow: {
    backgroundColor: "#667eea !important",
    "& td": {
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  chartWrapper: {
    backgroundColor: "#ffffff !important",
    padding: "20px",
    "& .ct-chart": {
      "& .ct-label.ct-horizontal.ct-end, & .ct-label.ct-vertical.ct-start": {
        fill: "#000000 !important",
        color: "#000000 !important",
        fontSize: "13px !important",
        fontWeight: "600 !important",
        textShadow: "0 0 2px white",
      },
      "& .ct-label": {
        fill: "#000000 !important",
        color: "#000000 !important",
        fontSize: "13px !important",
        fontWeight: "600 !important",
      },
      "& text": {
        fill: "#000000 !important",
        color: "#000000 !important",
      },
      "& .ct-grid": {
        stroke: "rgba(0, 0, 0, 0.1)",
      },
      "& .ct-bar": {
        stroke: "#667eea",
        strokeWidth: "30px",
      },
    },
  },
};

const useStyles = makeStyles(styles);

let isPatientListDone = true;
let originalSource = [];

function RevenueForecast(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [chartData, setChartData] = useState({ labels: [], series: [[]] });
  const [monthlyDetails, setMonthlyDetails] = useState([]);
  const [isProcessDone, setIsProcessDone] = useState(false);

  useEffect(() => {
    console.log("Revenue Forecast - loading patient data");
    isPatientListDone = false;
    setIsPatientsCollection(true);
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
      });
    }

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
      source = MedicareHandler.mapData(source);
    }

    originalSource = [...source];
    setDataSource(source);
    setIsPatientsCollection(false);
    props.resetListPatients();
    setIsProcessDone(true);
  }

  // Calculate monthly used cap data using tiered Medicare rates
  const calculateMonthlyData = (patientId = null) => {
    let patientsToAnalyze = dataSource;

    // Filter by selected patient if any
    if (patientId) {
      patientsToAnalyze = dataSource.filter((p) => p.patientCd === patientId);
    }

    // Group data by month
    const monthlyData = {};

    patientsToAnalyze.forEach((patient) => {
      if (!patient.soc) return;

      const socDate = moment(patient.soc);
      const eocDate = patient.eoc ? moment(patient.eoc) : moment();

      // Get rates for this patient
      const rates = MedicareHandler.getRatesForLocation(
        patient.state,
        patient.county,
        patient.soc
      );

      // Track cumulative days from SOC
      let cumulativeDays = 0;

      // Get all months between SOC and EOC (or current date)
      let currentMonth = socDate.clone().startOf("month");
      const endMonth = eocDate.clone().startOf("month");

      while (currentMonth.isSameOrBefore(endMonth)) {
        const monthKey = currentMonth.format("YYYY-MM");
        const monthLabel = currentMonth.format("MMM YYYY");

        // Calculate days in this month for this patient
        const monthStart = currentMonth.clone();
        const monthEnd = currentMonth.clone().endOf("month");

        const effectiveStart = moment.max(socDate, monthStart);
        const effectiveEnd = moment.min(eocDate, monthEnd);

        const daysInMonth = effectiveEnd.diff(effectiveStart, "days") + 1;

        if (daysInMonth > 0) {
          // Calculate revenue using tiered rates
          const daysBeforeMonth = cumulativeDays;
          const daysAfterMonth = cumulativeDays + daysInMonth;

          // Calculate cumulative claim up to end of this month
          const claimAfterMonth = parseFloat(
            MedicareHandler.calculateClaim(daysAfterMonth, rates)
          );
          // Calculate cumulative claim up to start of this month
          const claimBeforeMonth = parseFloat(
            MedicareHandler.calculateClaim(daysBeforeMonth, rates)
          );

          // Month revenue is the difference
          const monthRevenue = claimAfterMonth - claimBeforeMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              label: monthLabel,
              usedCap: 0,
              patientCount: new Set(),
            };
          }

          monthlyData[monthKey].usedCap += monthRevenue;
          monthlyData[monthKey].patientCount.add(patient.patientCd);

          cumulativeDays += daysInMonth;
        }

        currentMonth.add(1, "month");
      }
    });

    // Convert to chart format
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map((key) => monthlyData[key].label);
    const values = sortedMonths.map((key) => monthlyData[key].usedCap);
    const details = sortedMonths.map((key) => ({
      month: monthlyData[key].label,
      usedCap: monthlyData[key].usedCap,
      patientCount: monthlyData[key].patientCount.size,
    }));

    return { labels, series: [values], monthlyData, details };
  };

  // Update chart when patient selection changes
  useEffect(() => {
    if (dataSource.length > 0) {
      const { labels, series, details } = calculateMonthlyData(selectedPatient);
      setChartData({ labels, series });
      setMonthlyDetails(details);
    }
  }, [selectedPatient, dataSource]);

  const handlePatientChange = (e) => {
    setSelectedPatient(e.target.value);
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const chartOptions = {
    seriesBarDistance: 10,
    axisX: {
      showGrid: false,
      labelOffset: {
        x: 0,
        y: 5,
      },
    },
    axisY: {
      labelInterpolationFnc: function (value) {
        return "$" + (value / 1000).toFixed(0) + "K";
      },
      labelOffset: {
        x: 0,
        y: 0,
      },
    },
    height: "400px",
    chartPadding: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 20,
    },
  };

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>
            Loading Revenue Forecast Data...
          </div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <Grid container justifyContent="space-between">
                    <h4 className={classes.cardTitleWhite}>
                      Revenue Forecast - Monthly Used Cap Analysis
                    </h4>
                  </Grid>
                </CardHeader>
                <CardBody>
                  {/* Filter Section */}
                  <GridContainer className={classes.filterSection}>
                    <GridItem md={6} sm={12} xs={12}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.selectField}
                      >
                        <InputLabel>Select Patient</InputLabel>
                        <Select
                          value={selectedPatient}
                          onChange={handlePatientChange}
                          label="Select Patient"
                        >
                          <MenuItem value="">
                            <em>All Patients (Total)</em>
                          </MenuItem>
                          {dataSource.map((patient, index) => (
                            <MenuItem key={index} value={patient.patientCd}>
                              {patient.patientCd} - {patient.status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem md={6} sm={12} xs={12}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <Typography variant="h6">
                          {selectedPatient
                            ? `Viewing: ${selectedPatient}`
                            : "Viewing: All Patients"}
                        </Typography>
                      </Box>
                    </GridItem>
                  </GridContainer>

                  {/* Chart */}
                  <GridContainer style={{ marginTop: 20 }}>
                    <GridItem xs={12}>
                      <Card chart>
                        <CardHeader className={classes.chartWrapper}>
                          <ChartistGraph
                            className="ct-chart"
                            data={chartData}
                            type="Bar"
                            options={chartOptions}
                          />
                        </CardHeader>
                        <CardBody>
                          <h4 style={{ marginTop: 0 }}>
                            Monthly Used Cap Trend
                          </h4>
                          <p className={classes.cardCategory}>
                            Displaying used cap revenue by month
                            {selectedPatient
                              ? ` for patient ${selectedPatient}`
                              : " for all patients"}
                          </p>
                          <div className={classes.chartLegend}>
                            <Typography variant="body2">
                              <strong>Total Revenue (Used Cap):</strong>{" "}
                              {formatCurrency(
                                chartData.series[0].reduce((a, b) => a + b, 0)
                              )}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Months Displayed:</strong>{" "}
                              {chartData.labels.length}
                            </Typography>
                          </div>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>

                  {/* Monthly Summary Table */}
                  <GridContainer style={{ marginTop: 20 }}>
                    <GridItem xs={12}>
                      <Card>
                        <CardHeader color="success">
                          <h4
                            className={classes.cardTitleWhite}
                            style={{ margin: 0 }}
                          >
                            Month-by-Month Revenue Breakdown
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <TableContainer className={classes.tableContainer}>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow className={classes.tableHeader}>
                                  <TableCell>Month</TableCell>
                                  <TableCell align="right">
                                    Used Cap Revenue
                                  </TableCell>
                                  {!selectedPatient && (
                                    <TableCell align="right">
                                      Patient Count
                                    </TableCell>
                                  )}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {monthlyDetails.map((detail, index) => (
                                  <TableRow
                                    key={index}
                                    className={classes.tableRow}
                                  >
                                    <TableCell>{detail.month}</TableCell>
                                    <TableCell align="right">
                                      {formatCurrency(detail.usedCap)}
                                    </TableCell>
                                    {!selectedPatient && (
                                      <TableCell align="right">
                                        {detail.patientCount}
                                      </TableCell>
                                    )}
                                  </TableRow>
                                ))}
                                {/* Total Row */}
                                <TableRow className={classes.totalRow}>
                                  <TableCell>
                                    <strong>TOTAL</strong>
                                  </TableCell>
                                  <TableCell align="right">
                                    <strong>
                                      {formatCurrency(
                                        monthlyDetails.reduce(
                                          (sum, d) => sum + d.usedCap,
                                          0
                                        )
                                      )}
                                    </strong>
                                  </TableCell>
                                  {!selectedPatient && (
                                    <TableCell align="right">
                                      <strong>
                                        {monthlyDetails.reduce(
                                          (max, d) =>
                                            Math.max(max, d.patientCount),
                                          0
                                        )}
                                      </strong>
                                    </TableCell>
                                  )}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
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
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RevenueForecast);

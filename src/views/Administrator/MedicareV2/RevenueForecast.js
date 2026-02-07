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
  IconButton,
  Button,
} from "@material-ui/core";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  GetApp,
} from "@material-ui/icons";
import { connect } from "react-redux";
import moment from "moment";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

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

// PDF Styles for Revenue Forecast
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#667eea",
    color: "white",
    padding: 8,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    borderBottom: "1 solid #ddd",
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    fontSize: 9,
    borderBottom: "1 solid #f0f0f0",
  },
  monthCell: {
    width: "25%",
  },
  daysCell: {
    width: "15%",
    textAlign: "right",
  },
  revenueCell: {
    width: "20%",
    textAlign: "right",
  },
  patientCell: {
    width: "40%",
    paddingLeft: 20,
    fontSize: 8,
  },
  totalRow: {
    flexDirection: "row",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#667eea",
    color: "white",
    marginTop: 5,
  },
  fullForecastSection: {
    marginTop: 20,
    pageBreakBefore: "always",
  },
  patientRow: {
    flexDirection: "row",
    padding: 4,
    fontSize: 8,
    borderBottom: "1 solid #f0f0f0",
  },
});

// PDF Document Component for Revenue Forecast
const RevenueForecastPDF = ({ monthlyDetails, fullMonthForecast, selectedPatient }) => {
  const totalRevenue = monthlyDetails.reduce((sum, m) => sum + m.usedCap, 0);
  const totalPatients = monthlyDetails.reduce((sum, m) => sum + (m.patientCount || 0), 0);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Revenue Forecast Report</Text>
        <Text style={pdfStyles.subHeader}>
          {selectedPatient ? `Patient: ${selectedPatient}` : "All Patients"}
        </Text>

        {/* Month-by-Month Breakdown */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Month-by-Month Revenue Breakdown</Text>
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.monthCell}>Month</Text>
              <Text style={pdfStyles.revenueCell}>Revenue</Text>
              {!selectedPatient && (
                <Text style={pdfStyles.revenueCell}>Patient Count</Text>
              )}
            </View>
            {monthlyDetails.map((detail, idx) => (
              <View key={idx} wrap={false}>
                <View style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.monthCell}>{detail.month}</Text>
                  <Text style={pdfStyles.revenueCell}>
                    ${parseFloat(detail.usedCap).toFixed(2)}
                  </Text>
                  {!selectedPatient && (
                    <Text style={pdfStyles.revenueCell}>{detail.patientCount}</Text>
                  )}
                </View>
                {/* Per-patient details if available */}
                {detail.patients && detail.patients.length > 0 && (
                  <View style={{ paddingLeft: 10, backgroundColor: "#f9f9f9" }}>
                    {detail.patients.map((patient, pIdx) => (
                      <View key={pIdx} style={pdfStyles.patientRow}>
                        <Text style={pdfStyles.patientCell}>{patient.patientCd}</Text>
                        <Text style={pdfStyles.revenueCell}>
                          ${parseFloat(patient.revenue).toFixed(2)}
                        </Text>
                        {!selectedPatient && (
                          <Text style={pdfStyles.revenueCell}>{patient.days} days</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
            <View style={pdfStyles.totalRow}>
              <Text style={pdfStyles.monthCell}>TOTAL</Text>
              <Text style={pdfStyles.revenueCell}>
                ${parseFloat(totalRevenue).toFixed(2)}
              </Text>
              {!selectedPatient && (
                <Text style={pdfStyles.revenueCell}></Text>
              )}
            </View>
          </View>
        </View>

        {/* Full Month Forecast */}
        {fullMonthForecast && fullMonthForecast.patients && fullMonthForecast.patients.length > 0 && (
          <View style={pdfStyles.fullForecastSection} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>
              {fullMonthForecast.label} Full Forecast — Census: {fullMonthForecast.patients.length}
            </Text>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.tableHeader}>
                <Text style={{ width: "40%" }}>Patient</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>Days</Text>
                <Text style={{ width: "25%", textAlign: "right" }}>Revenue</Text>
                <Text style={{ width: "20%", textAlign: "right" }}>Status</Text>
              </View>
              {fullMonthForecast.patients.map((patient, idx) => (
                <View key={idx} style={pdfStyles.patientRow}>
                  <Text style={{ width: "40%" }}>{patient.patientCd}</Text>
                  <Text style={{ width: "15%", textAlign: "right" }}>{patient.days}</Text>
                  <Text style={{ width: "25%", textAlign: "right" }}>
                    ${parseFloat(patient.revenue).toFixed(2)}
                  </Text>
                  <Text style={{ width: "20%", textAlign: "right" }}>{patient.status || "—"}</Text>
                </View>
              ))}
              <View style={pdfStyles.totalRow}>
                <Text style={{ width: "40%" }}>TOTAL</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>
                  {fullMonthForecast.patients.reduce((sum, p) => sum + p.days, 0)}
                </Text>
                <Text style={{ width: "25%", textAlign: "right" }}>
                  ${parseFloat(
                    fullMonthForecast.patients.reduce((sum, p) => sum + p.revenue, 0)
                  ).toFixed(2)}
                </Text>
                <Text style={{ width: "20%", textAlign: "right" }}></Text>
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

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
  const [fullMonthForecast, setFullMonthForecast] = useState({
    label: "",
    patients: [],
  });
  const [expandedMonths, setExpandedMonths] = useState({});
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
              patients: {},
            };
          }

          monthlyData[monthKey].usedCap += monthRevenue;
          monthlyData[monthKey].patientCount.add(patient.patientCd);

          if (!monthlyData[monthKey].patients[patient.patientCd]) {
            monthlyData[monthKey].patients[patient.patientCd] = {
              days: 0,
              revenue: 0,
            };
          }
          monthlyData[monthKey].patients[patient.patientCd].days += daysInMonth;
          monthlyData[monthKey].patients[patient.patientCd].revenue +=
            monthRevenue;

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
      patients: Object.entries(monthlyData[key].patients)
        .map(([patientCd, data]) => ({
          patientCd,
          days: data.days,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue),
    }));

    return { labels, series: [values], monthlyData, details };
  };

  // Calculate full-month forecast for the current month, broken down per patient.
  // Active patients are assumed to stay enrolled through the end of the month.
  const calculateFullMonthForecast = () => {
    const currentMonthStart = moment().startOf("month");
    const currentMonthEnd = moment().endOf("month");
    const currentMonthLabel = moment().format("MMMM YYYY");

    const patientForecasts = [];

    dataSource.forEach((patient) => {
      if (!patient.soc) return;

      const socDate = moment(patient.soc);
      const eocDate = patient.eoc ? moment(patient.eoc) : null;

      // Skip patients who ended before the current month started
      if (eocDate && eocDate.isBefore(currentMonthStart, "day")) return;

      // Skip patients who haven't started yet
      if (socDate.isAfter(currentMonthEnd, "day")) return;

      const rates = MedicareHandler.getRatesForLocation(
        patient.state,
        patient.county,
        patient.soc
      );

      // Accumulate days from SOC up to (but not including) the current month
      let cumulativeDays = 0;
      let iterMonth = socDate.clone().startOf("month");

      while (iterMonth.isBefore(currentMonthStart)) {
        const monthStart = iterMonth.clone();
        const monthEnd = iterMonth.clone().endOf("month");

        const effStart = moment.max(socDate, monthStart);
        // For prior months use actual EOC if patient already discharged
        const effEnd = eocDate ? moment.min(eocDate, monthEnd) : monthEnd;

        const days = effEnd.diff(effStart, "days") + 1;
        if (days > 0) cumulativeDays += days;

        iterMonth.add(1, "month");
      }

      // Current month: full calendar month, capped at EOC only if already discharged
      const effStart = moment.max(socDate, currentMonthStart);
      const effEnd = eocDate ? moment.min(eocDate, currentMonthEnd) : currentMonthEnd;
      const fullDays = effEnd.diff(effStart, "days") + 1;

      if (fullDays > 0) {
        const claimBefore = parseFloat(
          MedicareHandler.calculateClaim(cumulativeDays, rates)
        );
        const claimAfter = parseFloat(
          MedicareHandler.calculateClaim(cumulativeDays + fullDays, rates)
        );

        patientForecasts.push({
          patientCd: patient.patientCd,
          status: patient.status,
          days: fullDays,
          revenue: claimAfter - claimBefore,
        });
      }
    });

    // Sort by revenue descending
    patientForecasts.sort((a, b) => b.revenue - a.revenue);

    return { label: currentMonthLabel, patients: patientForecasts };
  };

  // Update chart when patient selection changes
  useEffect(() => {
    if (dataSource.length > 0) {
      const { labels, series, details } = calculateMonthlyData(selectedPatient);
      setChartData({ labels, series });
      setMonthlyDetails(details);
      setFullMonthForecast(calculateFullMonthForecast());
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
              {/* PDF Download Button */}
              {monthlyDetails && monthlyDetails.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
                  <PDFDownloadLink
                    document={
                      <RevenueForecastPDF
                        monthlyDetails={monthlyDetails}
                        fullMonthForecast={fullMonthForecast}
                        selectedPatient={selectedPatient}
                      />
                    }
                    fileName={`Revenue_Forecast_${moment().format("YYYY_MM")}.pdf`}
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetApp />}
                        disabled={loading}
                      >
                        {loading ? "Generating PDF..." : "Download PDF Report"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              )}
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Revenue Forecast - Monthly Used Cap Analysis
                  </h4>
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
                                  <TableCell style={{ width: 40 }} />
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
                                {monthlyDetails.map((detail, index) => {
                                  const isOpen = !!expandedMonths[detail.month];
                                  return (
                                    <React.Fragment key={index}>
                                      {/* Month summary row */}
                                      <TableRow
                                        className={classes.tableRow}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          setExpandedMonths((prev) => ({
                                            ...prev,
                                            [detail.month]: !prev[detail.month],
                                          }))
                                        }
                                      >
                                        <TableCell style={{ padding: "4px 0 4px 4px" }}>
                                          <IconButton size="small">
                                            {isOpen ? (
                                              <KeyboardArrowUp />
                                            ) : (
                                              <KeyboardArrowDown />
                                            )}
                                          </IconButton>
                                        </TableCell>
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
                                      {/* Per-patient detail rows */}
                                      {isOpen &&
                                        detail.patients.map((p, pIdx) => (
                                          <TableRow
                                            key={pIdx}
                                            style={{
                                              backgroundColor: "#eef2ff",
                                            }}
                                          >
                                            <TableCell />
                                            <TableCell
                                              style={{ paddingLeft: 32, color: "#555" }}
                                            >
                                              {p.patientCd}
                                            </TableCell>
                                            <TableCell align="right" style={{ color: "#555" }}>
                                              {formatCurrency(p.revenue)}
                                            </TableCell>
                                            {!selectedPatient && (
                                              <TableCell align="right" style={{ color: "#555" }}>
                                                {p.days} days
                                              </TableCell>
                                            )}
                                          </TableRow>
                                        ))}
                                    </React.Fragment>
                                  );
                                })}
                                {/* Total Row */}
                                <TableRow className={classes.totalRow}>
                                  <TableCell />
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

                  {/* Full Month Forecast - per patient */}
                  <GridContainer style={{ marginTop: 20 }}>
                    <GridItem xs={12}>
                      <Card>
                        <CardHeader color="success">
                          <h4
                            className={classes.cardTitleWhite}
                            style={{ margin: 0 }}
                          >
                            {fullMonthForecast.label} Full Forecast — Census: {fullMonthForecast.patients.length}
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <Typography
                            variant="body2"
                            style={{ marginBottom: 8, color: "#666" }}
                          >
                            Forecasted revenue assuming all active patients
                            remain enrolled through the end of{" "}
                            {fullMonthForecast.label}.
                          </Typography>
                          <TableContainer className={classes.tableContainer}>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow className={classes.tableHeader}>
                                  <TableCell>Patient</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell align="right">Days</TableCell>
                                  <TableCell align="right">
                                    Forecasted Revenue
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {fullMonthForecast.patients.map((p, index) => (
                                  <TableRow
                                    key={index}
                                    className={classes.tableRow}
                                  >
                                    <TableCell>{p.patientCd}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                    <TableCell align="right">
                                      {p.days}
                                    </TableCell>
                                    <TableCell align="right">
                                      {formatCurrency(p.revenue)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className={classes.totalRow}>
                                  <TableCell>
                                    <strong>TOTAL</strong>
                                  </TableCell>
                                  <TableCell />
                                  <TableCell align="right">
                                    <strong>
                                      {fullMonthForecast.patients.reduce(
                                        (sum, p) => sum + p.days,
                                        0
                                      )}
                                    </strong>
                                  </TableCell>
                                  <TableCell align="right">
                                    <strong>
                                      {formatCurrency(
                                        fullMonthForecast.patients.reduce(
                                          (sum, p) => sum + p.revenue,
                                          0
                                        )
                                      )}
                                    </strong>
                                  </TableCell>
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

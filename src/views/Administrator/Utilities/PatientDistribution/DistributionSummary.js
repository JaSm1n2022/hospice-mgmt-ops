import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Grid, makeStyles, Table, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const useStyles = makeStyles({
  tableRow: {
    height: 32,
  },
  tableRowGray: {
    height: 32,
    background: "#667eea",
    fontWeight: "bold",
    color: "white",
  },
  tableRow2: {
    height: 42,
  },
  tableCell: {
    padding: "0px 16px",
  },
  printButton: {
    marginBottom: 20,
  },
  "@media print": {
    "@page": {
      size: "landscape",
      margin: "10mm",
    },
    ".no-print": {
      display: "none !important",
    },
  },
});
let grandTotal = 0.0;
const DistributionSummary = (props) => {
  const [details, setDetails] = useState(undefined);
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [suppliesChartData, setSuppliesChartData] = useState({ categories: [], series: [] });
  const [dmeChartData, setDmeChartData] = useState({ categories: [], series: [] });
  const [pharmacyChartData, setPharmacyChartData] = useState({ categories: [], series: [] });
  const [transportationChartData, setTransportationChartData] = useState({ categories: [], series: [] });
  const [clinicianChartData, setClinicianChartData] = useState({ categories: [], series: [] });

  const classes = useStyles();

  // Reusable chart render function
  const renderBarChart = (title, chartData, color = "#667eea") => {
    if (!chartData.categories || chartData.categories.length === 0) {
      return null;
    }

    return (
      <Grid item xs={12} style={{ marginTop: 40, width: "100%" }}>
        <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center" }}>
          {title}
        </Typography>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Chart
            options={{
              chart: {
                id: `chart-${title.toLowerCase().replace(/\s+/g, '-')}`,
                toolbar: {
                  show: true,
                },
              },
              xaxis: {
                categories: chartData.categories,
                labels: {
                  rotate: -45,
                  style: {
                    fontSize: "10px",
                  },
                },
              },
              yaxis: {
                title: {
                  text: "Amount ($)",
                },
                labels: {
                  formatter: (value) => `$${value}`,
                },
              },
              plotOptions: {
                bar: {
                  distributed: true,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val) => `$${val}`,
                offsetY: -20,
                style: {
                  fontSize: "10px",
                  colors: ["#304758"],
                },
              },
              colors: [color],
              legend: {
                show: false,
              },
              title: {
                text: "",
                align: "center",
              },
            }}
            series={[
              {
                name: title,
                data: chartData.series,
              },
            ]}
            type="bar"
            height={400}
          />
        </div>
      </Grid>
    );
  };

  useEffect(() => {
    const tempData = [];
    grandTotal = 0.0;
    let medical = 0.0;
    let dme = 0.0;
    let transportation = 0.0;
    let cna = 0.0;
    let nurse = 0.0;
    let msw = 0.0;
    let chaplain = 0.0;
    let lpn = 0.0;
    let pharmacy = 0.0;
    if (props?.details.length) {
      console.log("[Props details]", props.details);
      const dateFrom = moment(props.from);
      const dateTo = moment(props.to);
      const totalDaysInRange = dateTo.diff(dateFrom, 'days') + 1;

      props.details.forEach((d) => {
        // Calculate #day cares
        let dayCares = 0;
        const patientSOC = d.soc ? moment(d.soc) : null;
        const patientEOC = d.eoc ? moment(d.eoc) : null;

        // Determine the effective start and end dates within the range
        const effectiveStart = patientSOC && patientSOC.isAfter(dateFrom) ? patientSOC : dateFrom;
        const effectiveEnd = patientEOC && patientEOC.isBefore(dateTo) ? patientEOC : dateTo;

        // Calculate day cares
        if (patientSOC || patientEOC) {
          // If we have SOC or EOC, calculate days between effective dates
          dayCares = effectiveEnd.diff(effectiveStart, 'days') + 1;
        } else {
          // No SOC and no EOC means patient was active the entire range
          dayCares = totalDaysInRange;
        }

        // Ensure day cares is not negative
        dayCares = Math.max(0, dayCares);

        tempData.push({
          patient: d.name,
          soc: d.soc || "",
          eoc: d.eoc || "",
          dayCares: dayCares,
          medical: d.series[0],
          dme: d.series[1],
          transportation: d.series[2],
          pharmacy: d.series[3],
          cna: d.series[4],
          nurse: d.series[5],
          msw: d.series[6],
          chaplain: d.series[7],
          lpn: d.series[8],
          grand: d.estimatedAmt,
        });
        medical += parseFloat(d.series[0], 2);
        dme += parseFloat(d.series[1], 2);
        transportation += parseFloat(d.series[2], 2);
        pharmacy += parseFloat(d.series[3], 2);
        cna += parseFloat(d.series[4], 2);
        nurse += parseFloat(d.series[5], 2);
        msw += parseFloat(d.series[6], 2);
        chaplain += parseFloat(d.series[7], 2);
        lpn += parseFloat(d.series[8], 2);
        grandTotal += d.estimatedAmt;
      });

      // Sort by Grand Total descending
      tempData.sort((a, b) => b.grand - a.grand);

      tempData.push({
        patient: "TOTAL",
        soc: "",
        eoc: "",
        dayCares: "",
        medical: parseFloat(medical, 2),
        dme: parseFloat(dme, 2),
        transportation: parseFloat(transportation, 2),
        pharmacy: parseFloat(pharmacy, 2),
        cna: parseFloat(cna, 2),
        nurse: parseFloat(nurse, 2),
        msw: parseFloat(msw, 2),
        chaplain: parseFloat(chaplain, 2),
        lpn: parseFloat(lpn, 2),
        grand: grandTotal,
      });

      // Prepare chart data: Include only patients without EOC or EOC >= starting date range
      // dateFrom and dateTo already declared above
      const chartFilteredData = tempData.filter((d) => {
        if (d.patient === "TOTAL") return false;
        if (!d.eoc) return true; // No EOC means patient is still active
        const eocDate = moment(d.eoc);
        return eocDate.isSameOrAfter(dateFrom, 'day'); // EOC is on or after the start date
      });

      // Helper function to prepare chart data and sort by highest value
      const prepareChartData = (dataKey) => {
        const filtered = chartFilteredData
          .map((d) => ({
            patient: d.patient,
            value: parseFloat(d[dataKey] || 0),
          }))
          .filter((d) => d.value > 0) // Only include patients with values > 0
          .sort((a, b) => b.value - a.value); // Sort by highest to lowest

        return {
          categories: filtered.map((d) => d.patient),
          series: filtered.map((d) => d.value.toFixed(2)),
        };
      };

      // Grand Total Chart
      const grandTotalData = chartFilteredData
        .map((d) => ({
          patient: d.patient,
          value: parseFloat(d.grand || 0),
        }))
        .sort((a, b) => b.value - a.value);
      setChartData({
        categories: grandTotalData.map((d) => d.patient),
        series: grandTotalData.map((d) => d.value.toFixed(2)),
      });

      // Individual category charts
      setSuppliesChartData(prepareChartData('medical'));
      setDmeChartData(prepareChartData('dme'));
      setPharmacyChartData(prepareChartData('pharmacy'));
      setTransportationChartData(prepareChartData('transportation'));

      // Clinician Chart (CNA + Nurse + LPN + MSW + Chaplain)
      const clinicianData = chartFilteredData
        .map((d) => ({
          patient: d.patient,
          value: parseFloat(d.cna || 0) + parseFloat(d.nurse || 0) + parseFloat(d.lpn || 0) + parseFloat(d.msw || 0) + parseFloat(d.chaplain || 0),
        }))
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value);
      setClinicianChartData({
        categories: clinicianData.map((d) => d.patient),
        series: clinicianData.map((d) => d.value.toFixed(2)),
      });
    }
    setDetails(tempData);
  }, [props]);

  return (
    <React.Fragment>
      {details && details.length && (
        <Grid container style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Grid item xs={12}>
            <div>
              <div
                style={{
                  paddingBottom: 20,
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          height: "auto !important",
                          border: "solid 1px black",
                        }}
                        component="th"
                        scope="row"
                      >
                        Patient
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
                        SOC
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
                        EOC
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
                        #Day Cares
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
                        Supplies
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
                        DME
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
                        Pharmacy
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
                        Transportation
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
                        CNA
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
                        Nurse
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
                        LPN
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
                        MSW
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
                        Chaplain
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
                        GRAND TOTAL
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details &&
                      details.length &&
                      details.map((map, indx) => {
                        const isTotalRow = indx === details.length - 1;
                        const cellStyle = {
                          height: "auto !important",
                          border: "solid 1px black",
                          color: isTotalRow ? "white" : "inherit",
                        };
                        return (
                          <TableRow
                            className={
                              isTotalRow
                                ? classes.tableRowGray
                                : classes.tableRow
                            }
                          >
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >
                              {map.patient}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >
                              {map.soc}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >
                              {map.eoc}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >
                              {map.dayCares}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.medical || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.dme || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.pharmacy || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.transportation || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.cna || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.nurse || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.lpn || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.msw || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={cellStyle}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.chaplain || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={{
                                ...cellStyle,
                                color: isTotalRow ? "white" : "blue",
                                fontWeight: "bold",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.grand || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Grid>

          {/* Revenue vs Direct Patient Care Cost Table */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Revenue vs Direct Patient Care Cost
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="revenue vs cost table">
              <TableBody>
                <TableRow className={classes.tableRow}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                    }}
                    component="th"
                    scope="row"
                  >
                    Forecast Revenue
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "green",
                    }}
                    component="th"
                    scope="row"
                  >
                    ${parseFloat(props.revenueForecast || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.tableRow}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                    }}
                    component="th"
                    scope="row"
                  >
                    Direct Patient Care Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "red",
                    }}
                    component="th"
                    scope="row"
                  >
                    ${parseFloat(grandTotal || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Direct Care Cost Percentage
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    {props.revenueForecast > 0
                      ? `${((grandTotal / props.revenueForecast) * 100).toFixed(2)}%`
                      : "0.00%"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* Breakdown of Direct Patient Care Costs Table */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Breakdown of Direct Patient Care Costs
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="clinical services breakdown table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Clinical Service
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  // Get the TOTAL row (last row in details array)
                  const totalRow = details[details.length - 1];

                  // Define clinical services to display
                  const clinicalServices = [
                    { label: "CNA", value: totalRow.cna },
                    { label: "Nurse (RN)", value: totalRow.nurse },
                    { label: "LPN", value: totalRow.lpn },
                    { label: "MSW", value: totalRow.msw },
                    { label: "Chaplain", value: totalRow.chaplain },
                  ];

                  return clinicalServices.map((service, index) => {
                    const cost = parseFloat(service.value || 0);
                    const percentOfRevenue = props.revenueForecast > 0
                      ? ((cost / props.revenueForecast) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {service.label}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${cost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfRevenue}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Haloes Touch Hospice Performance Category Table */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Haloes Touch Hospice Performance Category
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="performance category table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Haloes Touch
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Benchmark
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "center",
                    }}
                    component="th"
                    scope="row"
                  >
                    Remark
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  // Get the TOTAL row (last row in details array)
                  const totalRow = details[details.length - 1];

                  // Helper function to calculate percentage
                  const calculatePercentage = (value) => {
                    return props.revenueForecast > 0
                      ? ((parseFloat(value || 0) / props.revenueForecast) * 100)
                      : 0;
                  };

                  // Helper function to determine remark
                  const getRemark = (percentage, minBenchmark, maxBenchmark) => {
                    if (percentage < minBenchmark) {
                      return { text: "Low", color: "#1976d2" }; // Blue
                    } else if (percentage >= minBenchmark && percentage <= maxBenchmark) {
                      return { text: "Within Range", color: "#388e3c" }; // Green
                    } else {
                      return { text: "High", color: "#d32f2f" }; // Red
                    }
                  };

                  // Calculate category values
                  const clinicalLabor = parseFloat(totalRow.cna || 0) +
                                       parseFloat(totalRow.nurse || 0) +
                                       parseFloat(totalRow.lpn || 0) +
                                       parseFloat(totalRow.msw || 0) +
                                       parseFloat(totalRow.chaplain || 0);
                  const pharmacy = parseFloat(totalRow.pharmacy || 0);
                  const dme = parseFloat(totalRow.dme || 0);
                  const supplies = parseFloat(totalRow.medical || 0);
                  const transportation = parseFloat(totalRow.transportation || 0);
                  const totalPatientCare = parseFloat(totalRow.grand || 0);

                  // Define performance categories with benchmarks
                  const performanceCategories = [
                    {
                      category: "Clinical Labor",
                      value: clinicalLabor,
                      percentage: calculatePercentage(clinicalLabor),
                      benchmark: "40–55%",
                      minBenchmark: 40,
                      maxBenchmark: 55,
                    },
                    {
                      category: "Pharmacy",
                      value: pharmacy,
                      percentage: calculatePercentage(pharmacy),
                      benchmark: "10–20%",
                      minBenchmark: 10,
                      maxBenchmark: 20,
                    },
                    {
                      category: "DME",
                      value: dme,
                      percentage: calculatePercentage(dme),
                      benchmark: "5–10%",
                      minBenchmark: 5,
                      maxBenchmark: 10,
                    },
                    {
                      category: "Supplies",
                      value: supplies,
                      percentage: calculatePercentage(supplies),
                      benchmark: "2–5%",
                      minBenchmark: 2,
                      maxBenchmark: 5,
                    },
                    {
                      category: "Transportation",
                      value: transportation,
                      percentage: calculatePercentage(transportation),
                      benchmark: "2–4%",
                      minBenchmark: 2,
                      maxBenchmark: 4,
                    },
                    {
                      category: "Total Patient Care Cost",
                      value: totalPatientCare,
                      percentage: calculatePercentage(totalPatientCare),
                      benchmark: "65–75%",
                      minBenchmark: 65,
                      maxBenchmark: 75,
                    },
                  ];

                  return performanceCategories.map((cat, index) => {
                    const remark = getRemark(cat.percentage, cat.minBenchmark, cat.maxBenchmark);
                    const isTotalRow = cat.category === "Total Patient Care Cost";

                    return (
                      <TableRow
                        key={index}
                        className={isTotalRow ? classes.tableRowGray : classes.tableRow}
                      >
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: isTotalRow ? "bold" : "normal",
                            color: isTotalRow ? "white" : "inherit",
                          }}
                          component="th"
                          scope="row"
                        >
                          {cat.category}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                            fontWeight: isTotalRow ? "bold" : "normal",
                            color: isTotalRow ? "white" : "inherit",
                          }}
                          component="th"
                          scope="row"
                        >
                          {cat.percentage.toFixed(2)}%
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                            fontWeight: isTotalRow ? "bold" : "normal",
                            color: isTotalRow ? "white" : "inherit",
                          }}
                          component="th"
                          scope="row"
                        >
                          {cat.benchmark}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "center",
                            fontWeight: "bold",
                            color: isTotalRow ? "white" : remark.color,
                          }}
                          component="th"
                          scope="row"
                        >
                          {remark.text}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Estimated Revenue Remaining for Operations */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Estimated Revenue Remaining for Operations
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="revenue remaining table">
              <TableBody>
                {(() => {
                  const forecastRevenue = parseFloat(props.revenueForecast || 0);
                  const directPatientCareCost = parseFloat(grandTotal || 0);
                  const remainingRevenue = forecastRevenue - directPatientCareCost;
                  const remainingRevenuePercent = forecastRevenue > 0
                    ? ((remainingRevenue / forecastRevenue) * 100)
                    : 0;

                  const revenueRows = [
                    {
                      label: "Forecast Revenue",
                      value: forecastRevenue,
                      isPercentage: false,
                      color: "green",
                    },
                    {
                      label: "Direct Patient Care Cost",
                      value: directPatientCareCost,
                      isPercentage: false,
                      color: "red",
                    },
                    {
                      label: "Remaining Revenue",
                      value: remainingRevenue,
                      isPercentage: false,
                      color: "blue",
                      isBold: true,
                    },
                    {
                      label: "Remaining Revenue %",
                      value: remainingRevenuePercent,
                      isPercentage: true,
                      color: "blue",
                      isBold: true,
                    },
                  ];

                  return revenueRows.map((row, index) => {
                    const isLastTwo = index >= 2;
                    return (
                      <TableRow
                        key={index}
                        className={isLastTwo ? classes.tableRowGray : classes.tableRow}
                      >
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: row.isBold || isLastTwo ? "bold" : "normal",
                            color: isLastTwo ? "white" : "inherit",
                            width: "50%",
                          }}
                          component="th"
                          scope="row"
                        >
                          {row.label}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                            fontWeight: row.isBold || isLastTwo ? "bold" : "normal",
                            color: isLastTwo ? "white" : row.color,
                            width: "50%",
                          }}
                          component="th"
                          scope="row"
                        >
                          {row.isPercentage
                            ? `${row.value.toFixed(2)}%`
                            : `$${row.value.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>

            {/* Notes Section */}
            <div style={{
              marginTop: 20,
              padding: "15px 20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}>
              <Typography variant="body1" style={{ fontWeight: "bold", marginBottom: 10 }}>
                The remaining revenue will support:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                <li>Administrator and Director of Nursing salaries</li>
                <li>Administrative staff</li>
                <li>Office operations</li>
                <li>Billing and compliance functions</li>
                <li>Insurance and utilities</li>
                <li>EHR system (HospiceMD)</li>
                <li>Other operational overhead expenses</li>
              </ul>
            </div>
          </Grid>

          {/* Top 5 Highest Total Care Cost */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Total Care Cost
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 highest cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  // Filter out the TOTAL row and get top 5 patients (already sorted by grand total descending)
                  const topPatients = details
                    .filter((d) => d.patient !== "TOTAL")
                    .slice(0, 5);

                  return topPatients.map((patient, index) => {
                    const cost = parseFloat(patient.grand || 0);
                    const percentOfRevenue = props.revenueForecast > 0
                      ? ((cost / props.revenueForecast) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${cost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfRevenue}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Top 5 Highest Care Cost - Supplies */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Care Cost – Supplies
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 supplies cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Supplies Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Patient's Total Direct Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  // Filter out the TOTAL row, filter patients with supplies > 0, sort by supplies cost descending, and get top 5
                  const topSuppliesPatients = details
                    .filter((d) => d.patient !== "TOTAL" && parseFloat(d.medical || 0) > 0)
                    .sort((a, b) => parseFloat(b.medical || 0) - parseFloat(a.medical || 0))
                    .slice(0, 5);

                  return topSuppliesPatients.map((patient, index) => {
                    const suppliesCost = parseFloat(patient.medical || 0);
                    const patientGrandTotal = parseFloat(patient.grand || 0);
                    const percentOfPatientTotal = patientGrandTotal > 0
                      ? ((suppliesCost / patientGrandTotal) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${suppliesCost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfPatientTotal}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Top 5 Highest Care Cost - DME */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Care Cost – DME
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 dme cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    DME Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Patient's Total Direct Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  const topDMEPatients = details
                    .filter((d) => d.patient !== "TOTAL" && parseFloat(d.dme || 0) > 0)
                    .sort((a, b) => parseFloat(b.dme || 0) - parseFloat(a.dme || 0))
                    .slice(0, 5);

                  return topDMEPatients.map((patient, index) => {
                    const dmeCost = parseFloat(patient.dme || 0);
                    const patientGrandTotal = parseFloat(patient.grand || 0);
                    const percentOfPatientTotal = patientGrandTotal > 0
                      ? ((dmeCost / patientGrandTotal) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${dmeCost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfPatientTotal}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Top 5 Highest Care Cost - Pharmacy */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Care Cost – Pharmacy
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 pharmacy cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Pharmacy Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Patient's Total Direct Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  const topPharmacyPatients = details
                    .filter((d) => d.patient !== "TOTAL" && parseFloat(d.pharmacy || 0) > 0)
                    .sort((a, b) => parseFloat(b.pharmacy || 0) - parseFloat(a.pharmacy || 0))
                    .slice(0, 5);

                  return topPharmacyPatients.map((patient, index) => {
                    const pharmacyCost = parseFloat(patient.pharmacy || 0);
                    const patientGrandTotal = parseFloat(patient.grand || 0);
                    const percentOfPatientTotal = patientGrandTotal > 0
                      ? ((pharmacyCost / patientGrandTotal) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${pharmacyCost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfPatientTotal}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Top 5 Highest Care Cost - Transportation */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Care Cost – Transportation
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 transportation cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Transportation Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Patient's Total Direct Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  const topTransportationPatients = details
                    .filter((d) => d.patient !== "TOTAL" && parseFloat(d.transportation || 0) > 0)
                    .sort((a, b) => parseFloat(b.transportation || 0) - parseFloat(a.transportation || 0))
                    .slice(0, 5);

                  return topTransportationPatients.map((patient, index) => {
                    const transportationCost = parseFloat(patient.transportation || 0);
                    const patientGrandTotal = parseFloat(patient.grand || 0);
                    const percentOfPatientTotal = patientGrandTotal > 0
                      ? ((transportationCost / patientGrandTotal) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${transportationCost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfPatientTotal}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Top 5 Highest Care Cost - Clinical Labor */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Top 5 Highest Care Cost – Clinical Labor
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="top 5 clinical labor cost table">
              <TableHead>
                <TableRow className={classes.tableRowGray}>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    component="th"
                    scope="row"
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    Clinical Labor Cost
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      height: "auto !important",
                      border: "solid 1px black",
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "right",
                    }}
                    component="th"
                    scope="row"
                  >
                    % of Patient's Total Direct Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 && (() => {
                  // Calculate clinical labor for each patient and create a new array with this data
                  const patientsWithClinicalLabor = details
                    .filter((d) => d.patient !== "TOTAL")
                    .map((patient) => {
                      const clinicalLaborCost =
                        parseFloat(patient.cna || 0) +
                        parseFloat(patient.nurse || 0) +
                        parseFloat(patient.lpn || 0) +
                        parseFloat(patient.msw || 0) +
                        parseFloat(patient.chaplain || 0);
                      return {
                        ...patient,
                        clinicalLaborCost: clinicalLaborCost
                      };
                    })
                    .filter((d) => d.clinicalLaborCost > 0)
                    .sort((a, b) => b.clinicalLaborCost - a.clinicalLaborCost)
                    .slice(0, 5);

                  return patientsWithClinicalLabor.map((patient, index) => {
                    const clinicalLaborCost = patient.clinicalLaborCost;
                    const patientGrandTotal = parseFloat(patient.grand || 0);
                    const percentOfPatientTotal = patientGrandTotal > 0
                      ? ((clinicalLaborCost / patientGrandTotal) * 100).toFixed(2)
                      : "0.00";

                    return (
                      <TableRow key={index} className={classes.tableRow}>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            fontWeight: "bold",
                          }}
                          component="th"
                          scope="row"
                        >
                          {patient.patient}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          ${clinicalLaborCost.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                          style={{
                            height: "auto !important",
                            border: "solid 1px black",
                            textAlign: "right",
                          }}
                          component="th"
                          scope="row"
                        >
                          {percentOfPatientTotal}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h5" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Distribution Charts (Active Patients within the date range)
            </Typography>
          </Grid>

          {/* Grand Total Chart - Full Width */}
          {chartData.categories.length > 0 && (
            <Grid item xs={12} style={{ marginTop: 20, width: "100%" }}>
              <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center" }}>
                Grand Total by Patient
              </Typography>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Chart
                  options={{
                    chart: {
                      id: "patient-grand-total-bar",
                      toolbar: {
                        show: true,
                      },
                    },
                    xaxis: {
                      categories: chartData.categories,
                      labels: {
                        rotate: -45,
                        style: {
                          fontSize: "10px",
                        },
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Grand Total ($)",
                      },
                      labels: {
                        formatter: (value) => `$${value}`,
                      },
                    },
                    plotOptions: {
                      bar: {
                        distributed: true,
                        dataLabels: {
                          position: "top",
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val) => `$${val}`,
                      offsetY: -20,
                      style: {
                        fontSize: "10px",
                        colors: ["#304758"],
                      },
                    },
                    colors: ["#667eea"],
                    legend: {
                      show: false,
                    },
                    title: {
                      text: "",
                      align: "center",
                    },
                  }}
                  series={[
                    {
                      name: "Grand Total",
                      data: chartData.series,
                    },
                  ]}
                  type="bar"
                  height={400}
                />
              </div>
            </Grid>
          )}

          {/* Category Charts in 2-column grid */}
          {renderBarChart("Supplies by Patient", suppliesChartData, "#5CACEE")}
          {renderBarChart("DME by Patient", dmeChartData, "#0000FF")}
          {renderBarChart("Pharmacy by Patient", pharmacyChartData, "#FFA500")}
          {renderBarChart("Transportation by Patient", transportationChartData, "#967bb6")}
          {renderBarChart("Clinician Total by Patient", clinicianChartData, "#EE4B2B")}
        </Grid>
      )}
    </React.Fragment>
  );
};
export default DistributionSummary;

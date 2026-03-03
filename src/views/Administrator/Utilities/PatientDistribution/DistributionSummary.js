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
    background: "gray",
    fontWeight: "bold",
  },
  tableRow2: {
    height: 42,
  },
  tableCell: {
    padding: "0px 16px",
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
      <Grid item xs={12} md={6} style={{ marginTop: 40, width: "100%" }}>
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
      props.details.forEach((d) => {
        tempData.push({
          patient: d.name,
          soc: d.soc || "",
          eoc: d.eoc || "",
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
      const dateFrom = moment(props.from);
      const dateTo = moment(props.to);
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
                        return (
                          <TableRow
                            className={
                              indx === details.length - 1
                                ? classes.tableRowGray
                                : classes.tableRow
                            }
                          >
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >
                              {map.patient}
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
                              {map.soc}
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
                              {map.eoc}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.medical || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.dme || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.pharmacy || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.transportation || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.cna || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.nurse || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.lpn || 0.0).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.msw || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.chaplain || 0.0).toFixed(
                              2
                            )}`}</TableCell>

                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                                color: "blue",
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

          {/* Charts Section */}
          <Grid item xs={12} style={{ marginTop: 40 }}>
            <Typography variant="h5" style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
              Distribution Charts (Active Patients or EOC ≥ Start Date)
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

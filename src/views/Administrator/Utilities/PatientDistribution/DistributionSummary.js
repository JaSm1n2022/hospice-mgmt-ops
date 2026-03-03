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

  const classes = useStyles();
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

      const chartCategories = chartFilteredData.map((d) => d.patient);
      const chartSeries = chartFilteredData.map((d) => parseFloat(d.grand || 0).toFixed(2));

      setChartData({
        categories: chartCategories,
        series: chartSeries,
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

          {/* Bar Chart - Grand Total by Patient */}
          {chartData.categories.length > 0 && (
            <Grid item xs={12} style={{ marginTop: 40, width: "100%" }}>
              <Typography variant="h6" style={{ marginBottom: 20, textAlign: "center" }}>
                Grand Total by Patient (Active Patients or EOC within Date Range)
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
        </Grid>
      )}
    </React.Fragment>
  );
};
export default DistributionSummary;

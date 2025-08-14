import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Grid, makeStyles, Table, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles({
  tableRow: {
    height: 32,
  },
  tableRow2: {
    height: 42,
  },
  tableCell: {
    padding: "0px 16px",
  },
});
const CardServicesTransaction = (props) => {
  const [details, setDetails] = useState(undefined);

  const classes = useStyles();
  useEffect(() => {
    setDetails(props.details);
  }, [props]);

  return (
    <React.Fragment>
      {details && details.length && (
        <Grid container style={{ width: "800px", paddingLeft: 20 }}>
          <Grid item xs={12} align="center">
            <div>
              <div style={{ paddingTop: 100 }}>
                <Typography variant="h6">
                  CARD/CASH/BANK PAYMENT HISTORY REPORT (SERVICES)
                </Typography>
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Typography
                  variant="bold"
                  style={{ color: "gray" }}
                >{`${props.dateFrom} to ${props.dateTo}`}</Typography>
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Typography
                  variant="h4"
                  style={{ color: "blue" }}
                >{`$${new Intl.NumberFormat("en-US", {}).format(
                  parseFloat(props.grandTotal).toFixed(2)
                )}`}</Typography>
              </div>
            </div>
            <div style={{ width: "800px" }}>
              <div
                style={{ paddingLeft: 10, paddingRight: 50, paddingBottom: 20 }}
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
                        CARD/BANK
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
                        SILVERFLUME
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
                        CLARK COUNTY
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
                        HOSPICE MD
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
                        DPBH
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
                        QLIQ SOFT
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
                        OTHERS
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
                      details.map((map) => {
                        return (
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
                              {map.info}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              style={{
                                height: "auto !important",
                                border: "solid 1px black",
                              }}
                              component="th"
                              scope="row"
                            >{`$${parseFloat(map.silverflume || 0.0).toFixed(
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
                            >{`$${parseFloat(map.clarkCounty || 0.0).toFixed(
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
                            >{`$${parseFloat(map.hospiceMD || 0.0).toFixed(
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
                            >{`$${parseFloat(map.dpbh || 0.0).toFixed(
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
                            >{`$${parseFloat(map.qliq || 0.0).toFixed(
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
                            >{`$${parseFloat(map.others || 0.0).toFixed(
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
        </Grid>
      )}
    </React.Fragment>
  );
};
export default CardServicesTransaction;

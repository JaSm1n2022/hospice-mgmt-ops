import { Avatar, Grid, Typography } from "@material-ui/core";
import React from "react";
import Helper from "utils/helper";

import ClientPieChart from "./ClientPieChart";

class ClientExpensesReport extends React.Component {
  render() {
    const {
      patientDashboard,
      numberActive,
      numberInactive,
      clientExpensesAmt,
      dateFrom,
      dateTo,
    } = this.props;

    console.log("[Details]", patientDashboard);
    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          style={{
            width: "1200px",
            height: "800px",

            overflow: "auto",
          }}
        >
          {patientDashboard.length
            ? patientDashboard.length &&
              patientDashboard.map((map, index) => (
                <Grid item xs={12} md={5} sm={12} id={index}>
                  <div>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {index + 1}
                      </Avatar>
                      {`${map.name.toUpperCase()} - $${parseFloat(
                        map.estimatedAmt
                      ).toFixed(2)}`}
                    </div>

                    <Typography variant="body2">
                      {map.status && map.status.toLowerCase() === "inactive"
                        ? `(INACTIVE SINCE ${map.eoc})`
                        : `(ACTIVE SINCE ${map.soc})`}
                    </Typography>
                    <Typography variant="body2" style={{ color: "blue" }}>
                      {map.status && map.status.toLowerCase() === "inactive"
                        ? `Days in Hospice : ${Helper.calculateDaysInStorage(
                            new Date(map.soc),
                            new Date(map.eoc)
                          )})`
                        : `Days in Hospice  : ${Helper.calculateDaysInStorage(
                            new Date(map.soc)
                          )}`}
                    </Typography>

                    {map.cna && (
                      <Typography
                        variant="body2"
                        style={{ color: "green" }}
                      >{`CNA : ${map.cna.toUpperCase()}`}</Typography>
                    )}
                    {map.rn && (
                      <Typography
                        variant="body2"
                        style={{ color: "green" }}
                      >{`RN : ${map.rn.toUpperCase()}`}</Typography>
                    )}
                    {map.lpn && (
                      <Typography
                        variant="body2"
                        style={{ color: "green" }}
                      >{`LPN : ${map.lpn.toUpperCase()}`}</Typography>
                    )}
                  </div>
                  <div>
                    <ClientPieChart series={map.series} />
                  </div>
                  {index !== 0 && index <= 14 && index % 14 === 0 ? (
                    <div style={{ paddingBottom: 130 }}></div>
                  ) : index !== 0 && index >= 29 && index % 29 === 0 ? (
                    <div style={{ paddingBottom: 200 }}></div>
                  ) : null}
                </Grid>
              ))
            : null}
        </Grid>
      </React.Fragment>
    );
  }
}
export default ClientExpensesReport;

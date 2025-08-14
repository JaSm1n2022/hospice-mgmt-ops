import { Grid } from "@material-ui/core";
import React from "react";
import CardTransaction from "./CardTransaction";

class CardHistoryReport extends React.Component {
  render() {
    const { details, dateFrom, dateTo, grandTotal } = this.props;

    return (
      <React.Fragment>
        <Grid container style={{ width: "1200px", paddingLeft: 20 }}>
          {
            <CardTransaction
              details={details}
              grandTotal={grandTotal}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          }
        </Grid>
      </React.Fragment>
    );
  }
}
export default CardHistoryReport;

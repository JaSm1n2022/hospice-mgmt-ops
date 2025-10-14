import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { SupaContext } from "App";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { attemptToFetchTransaction } from "store/actions/transactionAction";
import { resetFetchTransactionState } from "store/actions/transactionAction";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { transactionListStateSelector } from "store/selectors/transactionSelector";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";

import ReportChart from "./Chart/ReportChart";

let numberOfMonth = 0;
let numberOfProcess = 1;
let data = [];
let grandTotal = 0.0;

const YTD_LIST = Helper.getDaysInMonth();
const Services = (props) => {
  const context = useContext(SupaContext);
  const [isProcessCollection, setIsProcessCollection] = useState(true);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (context.userProfile?.companyId) {
      data = [];
      numberOfProcess = 0;
      numberOfMonth = YTD_LIST.length;

      props.listTransactions({
        from: YTD_LIST[numberOfProcess].from,
        to: YTD_LIST[numberOfProcess].to,
        companyId: context.userProfile?.companyId,
      });
    }
    //start with 2022
  }, []);
  useEffect(() => {
    if (
      !isProcessCollection &&
      props.transactions.status === ACTION_STATUSES.SUCCEED
    ) {
      const record = [...props.transactions.data].filter(
        (p) => p.category.toLowerCase() === "provider/services"
      );
      console.log(
        "[record]",
        record[0],
        record.length,
        YTD_LIST[numberOfProcess]
      );

      data.push({
        numberOfRecord: record.length,
        data: [...record],
        query: YTD_LIST[numberOfProcess],
      });
      numberOfProcess += 1;
      props.resetlistTransactions();

      if (numberOfProcess < numberOfMonth) {
        setIsProcessCollection(true);

        props.listTransactions({
          from: YTD_LIST[numberOfProcess].from,
          to: YTD_LIST[numberOfProcess].to,
          companyId: context.userProfile?.companyId,
        });
      } else {
        grandTotal = 0.0;
        const recs = [];
        for (const d of data) {
          const amts = d.data.map((map) => map.grand_total);
          let grand = 0.0;
          amts.forEach((a) => {
            grand += parseFloat(a || 0.0);
          });
          grandTotal += grand;
          recs.push({
            range: `${d.query.from} to ${d.query.to}`,
            cnt: d.data.length,

            total: parseFloat(grand | 0.0).toFixed(2),
          });
        }
        setSummary(recs);
      }
    }
  }, [isProcessCollection]);

  if (
    isProcessCollection &&
    props.transactions &&
    props.transactions.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsProcessCollection(false);
  }

  return (
    <React.Fragment>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left side: Select */}
        <div style={{ flex: "0 0 90%" }}>
          <h4>Services Purchased Report</h4>
        </div>
        <div align="right" style={{ flex: "0 0 10%" }}>
          <h4>{`$${new Intl.NumberFormat("en-US", {}).format(
            parseFloat(grandTotal)
          )}`}</h4>
        </div>
      </div>

      <Grid justifyContent="space-between" container style={{ padding: 10 }}>
        <Typography variant="body1" color="textSecondary">
          Provider/Services reports, including consulting services, professional
          services, state and local governments, regulatory commissions, public
          safety departments, and more.
        </Typography>
      </Grid>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date Range</TableCell>
            <TableCell>Number Of Records/Items</TableCell>
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary && summary.length
            ? summary.map((m) => {
                return (
                  <TableRow key={m.range}>
                    <TableCell component="th" scope="row">
                      {m.range}
                    </TableCell>
                    <TableCell>{m.cnt}</TableCell>

                    <TableCell>{`$${m.total}`}</TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
      <div style={{ paddingTop: 10 }}>
        <Typography variant="h6">Graph Presentation</Typography>
        <ReportChart data={summary} />
      </div>
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  transactions: transactionListStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listTransactions: (data) => dispatch(attemptToFetchTransaction(data)),
  resetlistTransactions: () => dispatch(resetFetchTransactionState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);

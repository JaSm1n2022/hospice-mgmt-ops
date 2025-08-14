import {
  Card,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import CardBody from "components/Card/CardBody";
import CustomDatePicker from "components/Date/CustomDatePicker";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import SimpleTable from "components/Table/SimpleTable";
import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetFetchTransactionState } from "store/actions/transactionAction";
import { attemptToFetchTransaction } from "store/actions/transactionAction";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { transactionListStateSelector } from "store/selectors/transactionSelector";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";

import PrintReport from "../components/PrintReport";
import MethodHandler from "./MethodHandler";

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
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  small: {
    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));

let isTransactionDone = false;
let userProfile = {};
let allTransactionsSeries = [];
let allTransactionGrandTotal = 0.0;
const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
const PaymentMethod = (props) => {
  const { listTransactions, resetlistTransactions, transactions } = props;
  const classes = useStyles();

  const [dateFrom, setDateFrom] = useState(dates.from);
  const [dateTo, setDateTo] = useState(dates.to);
  const [transactionList, setTransactionList] = useState([]);
  const [isTransactionCollection, setIsTransactionCollection] = useState(true);
  useEffect(() => {
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      listTransactions({
        from: dates.from,
        to: dates.to,
        companyId: userProfile.companyId,
      });
    }
  }, []);

  useEffect(() => {
    if (
      !isTransactionCollection &&
      transactions.status === ACTION_STATUSES.SUCCEED
    ) {
      setTransactionList(transactions.data || []);
      resetlistTransactions();
      setIsTransactionCollection(true);
    }
  }, [isTransactionCollection]);

  const cardHandler = (data, paymentMethod) => {
    let paymentInfo;
    let dataSet = data.filter(
      (a) => a.payment_method?.toLowerCase() === paymentMethod?.toLowerCase()
    );
    if (paymentMethod === "tbd")
      dataSet = data.filter(
        (a) =>
          a.payment_method?.toLowerCase() === paymentMethod?.toLowerCase() ||
          !a.payment_method
      );
    console.log("[CARDS1]", dataSet);
    if (paymentMethod === "card") {
      paymentInfo = dataSet.map((a) => a.payment_info?.toString().trim());
      paymentInfo = Array.from(new Set(paymentInfo));
    } else if (paymentMethod === "bank") {
      paymentInfo = dataSet.map(
        (a) =>
          `${a.payment_method
            ?.toString()
            .trim()} - ${a.payment_info?.toString().trim()}`
      );
      paymentInfo = Array.from(new Set(paymentInfo));
    } else if (paymentMethod === "direct deposit") {
      paymentInfo = ["direct deposit"];
    } else if (paymentMethod === "tbd") {
      paymentInfo = ["tbd"];
    } else {
      paymentInfo = dataSet.map((a) => a.payment_method?.toString().trim());
      paymentInfo = Array.from(new Set(paymentInfo));
    }

    const series = [];
    console.log("[CARD 2]", paymentInfo);
    if (paymentInfo?.length) {
      paymentInfo.forEach((c) => {
        let arr;
        if (paymentMethod === "bank") {
          arr = dataSet.filter(
            (ca) =>
              c?.toString().trim() ===
              `${ca.payment_method
                ?.toString()
                .trim()
                .toLowerCase()} - ${ca.payment_info
                ?.toString()
                .trim()
                .toLowerCase()}`
          );
        } else if (paymentMethod === "card") {
          arr = dataSet.filter(
            (ca) =>
              c?.toString().trim().toLowerCase() ===
              ca.payment_info?.toString().trim().toLowerCase()
          );
        } else if (paymentMethod === "tbd") {
          arr = dataSet.filter(
            (ca) =>
              c?.toString().trim().toLowerCase() === "tbd" || !ca.payment_method
          );
        } else {
          arr = dataSet.filter(
            (ca) =>
              c?.toString().trim().toLowerCase() ===
              ca.payment_method?.toString().trim().toLowerCase()
          );
        }

        let totalOfficeExpenses = 0.0;
        let medicalExpenses = 0.0;
        let dmeExpenses = 0.0;
        let transportationExpenses = 0.0;
        let pharmacyExpenses = 0.0;
        let servicesExpenses = 0.0;
        let marketingExpenses = 0.0;
        let payrollExpenses = 0.0;
        let utilitiesExpenses = 0.0;
        arr.forEach((a) => {
          if (a.category?.toLowerCase() === "office") {
            totalOfficeExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "medical/incontinence") {
            medicalExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "dme") {
            dmeExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "transportation") {
            transportationExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "pharmacy") {
            pharmacyExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "provider/services") {
            servicesExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "marketing") {
            marketingExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "payroll") {
            payrollExpenses += parseFloat(a.grand_total);
          } else if (a.category?.toLowerCase() === "utilities") {
            utilitiesExpenses += parseFloat(a.grand_total);
          }
        });
        series.push({
          category:
            paymentMethod?.toLowerCase() === "card"
              ? `CARD - ${c}`
              : c.toUpperCase(),
          office: parseFloat(totalOfficeExpenses).toFixed(2),
          medicalIncontinence: parseFloat(medicalExpenses).toFixed(2),
          dme: parseFloat(dmeExpenses).toFixed(2),
          transportation: parseFloat(transportationExpenses).toFixed(2),
          pharmacy: parseFloat(pharmacyExpenses).toFixed(2),
          services: parseFloat(servicesExpenses).toFixed(2),
          payroll: parseFloat(payrollExpenses).toFixed(2),
          marketing: parseFloat(marketingExpenses).toFixed(2),
          utilities: parseFloat(utilitiesExpenses).toFixed(2),
        });
      });
    }
    return series;
  };
  const allTransactionsHandler = (data) => {
    // process transactions data
    allTransactionsSeries = [];
    const cards = cardHandler(data, "card");
    allTransactionsSeries = allTransactionsSeries.concat(cards);
    console.log("[CARDS]", cards);
    const checks = cardHandler(data, "check");
    allTransactionsSeries = allTransactionsSeries.concat(checks);
    const banks = cardHandler(data, "bank");
    allTransactionsSeries = allTransactionsSeries.concat(banks);
    const cash = cardHandler(data, "cash");
    allTransactionsSeries = allTransactionsSeries.concat(cash);
    const db = cardHandler(data, "direct deposit");
    allTransactionsSeries = allTransactionsSeries.concat(db);
    const tbd = cardHandler(data, "tbd");
    allTransactionsSeries = allTransactionsSeries.concat(tbd);
    allTransactionGrandTotal = 0.0;
    allTransactionsSeries.forEach((c) => {
      allTransactionGrandTotal +=
        parseFloat(c.office) +
        parseFloat(c.medicalIncontinence) +
        parseFloat(c.dme) +
        parseFloat(c.transportation) +
        parseFloat(c.pharmacy) +
        parseFloat(c.services) +
        parseFloat(c.payroll) +
        parseFloat(c.utilities) +
        parseFloat(c.marketing);
    });
    /*
    cards.forEach((c) => {
      allTransactionsSeries.push(c);
    });
    checks.forEach((c) => {
      allTransactionsSeries.push(c);
    });
    banks.forEach((c) => {
      allTransactionsSeries.push(c);
    });
    */

    // unique payment method and payment info
    // card used
  };
  if (
    isTransactionCollection &&
    transactions.status === ACTION_STATUSES.SUCCEED
  ) {
    console.log("[Transactions]", transactions);
    //const transactionData = transactions.data;
    if (transactions?.data.length) {
      allTransactionsHandler(transactions?.data);
    }
    isTransactionDone = true;
    setIsTransactionCollection(false);
  }
  const dateInputHandler = (value, name) => {
    console.log("[Date Input value]", value, name);
    if (name === "dateFrom") {
      setDateFrom(value);
      setIsTransactionCollection(true);
      listTransactions({
        from: moment(new Date(value)).format("YYYY-MM-DD"),
        to: moment(new Date(dateTo)).format("YYYY-MM-DD"),
        companyId: userProfile.companyId,
      });
    } else if (name === "dateTo") {
      setDateTo(value);
      setIsTransactionCollection(true);
      listTransactions({
        from: moment(new Date(dateFrom)).format("YYYY-MM-DD"),
        to: moment(new Date(value)).format("YYYY-MM-DD"),
        companyId: userProfile.companyId,
      });
    }
  };

  return (
    <>
      <div>
        {!isTransactionDone ? (
          <div align="center" style={{ paddingTop: "100px" }}>
            <br />
            <CircularProgress />
            &nbsp;<span>Loading</span>...
          </div>
        ) : (
          <Card plain>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDatePicker
                    label="From"
                    placeholder="From"
                    value={dateFrom}
                    name="dateFrom"
                    onChange={dateInputHandler}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDatePicker
                    label="To"
                    placeholder="To"
                    value={dateTo}
                    name="dateTo"
                    onChange={dateInputHandler}
                  />
                </GridItem>

                {transactionList.length === 0 ? (
                  <Grid container style={{ paddingTop: 20, paddingLeft: 20 }}>
                    <GridItem xs={12} md={12}>
                      <div>
                        <Typography variant="body1">
                          {moment(new Date(dateFrom)).format("YYYY-MM-DD")} -{" "}
                          {moment(new Date(dateTo)).format("YYYY-MM-DD")}
                        </Typography>
                      </div>
                      <Typography variant="body">
                        No Record Found. Please verify your date range data.
                      </Typography>
                    </GridItem>
                  </Grid>
                ) : (
                  <GridItem xs={12} sm={12} md={12}>
                    <GridContainer>
                      <GridItem xs={12} md={12}>
                        <div style={{ paddingTop: 20 }}>
                          <Typography variant="h6">
                            PAYMENT HISTORY REPORT (ALL TRANSACTION TYPES)
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="body1">
                            {moment(new Date(dateFrom)).format("YYYY-MM-DD")} -{" "}
                            {moment(new Date(dateTo)).format("YYYY-MM-DD")}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" style={{ color: "blue" }}>
                            {`$${new Intl.NumberFormat("en-US", {}).format(
                              parseFloat(allTransactionGrandTotal).toFixed(2)
                            )}`}
                          </Typography>
                        </div>
                      </GridItem>
                      <GridItem xs={12} md={12}>
                        <SimpleTable
                          columns={MethodHandler.allTransactionsColumns()}
                          main={true}
                          grandTotal={0.0}
                          dataSource={allTransactionsSeries}
                          height={420}
                        />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
              </GridContainer>
            </CardBody>
          </Card>
        )}
      </div>
    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);

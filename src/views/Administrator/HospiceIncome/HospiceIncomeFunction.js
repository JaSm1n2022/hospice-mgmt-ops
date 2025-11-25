import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { connect } from "react-redux";
import moment from "moment";

import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import {
  attemptToFetchIncome,
  attemptToCreateIncome,
  resetFetchIncomeState,
  resetCreateIncomeState,
} from "store/actions/incomeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import {
  incomeListStateSelector,
  incomeCreateStateSelector,
} from "store/selectors/incomeSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  formField: {
    marginBottom: "20px",
  },
  tableTotal: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  },
};

const useStyles = makeStyles(styles);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`income-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function HospiceIncomeFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    patientCd: "",
    payor: "",
    payPeriod: "",
    datePaid: "",
    remitRef: "",
    amount: "",
  });

  // Filter state
  const [periodFilter, setPeriodFilter] = useState("");
  const [payorFilter, setPayorFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("Hospice Income - loading data");
    if (context.userProfile?.companyId) {
      props.fetchIncome({ companyId: context.userProfile.companyId });
      props.fetchPatients({ companyId: context.userProfile.companyId });
    }
    return () => {
      props.resetIncome();
    };
  }, []);

  // Handle income data loaded
  useEffect(() => {
    if (props.incomeData?.status === ACTION_STATUSES.SUCCEED) {
      setIsLoading(false);
    }
  }, [props.incomeData]);

  // Handle create success
  useEffect(() => {
    if (props.createIncome?.status === ACTION_STATUSES.SUCCEED) {
      // Reload income data
      props.fetchIncome({ companyId: context.userProfile.companyId });
      // Reset form
      setFormData({
        patientCd: "",
        payor: "",
        payPeriod: "",
        datePaid: "",
        remitRef: "",
        amount: "",
      });
      props.resetCreateIncome();
    }
  }, [props.createIncome]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    const payload = {
      payor: formData.payor,
      pay_Period: formData.payPeriod,
      date_paid: formData.datePaid,
      remit_ref: formData.remitRef,

      patientCd: formData.patientCd,
      patientId: patientList.find((p) => p.patientCd === formData.patientCd)
        ?.id,
      companyId: context.userProfile.companyId,
      amount_usd: parseFloat(formData.amount),
      createdAt: new Date(),
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
      createdUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    console.log("[PAYLOAD]", payload);
    props.createIncome(payload);
  };

  const handleCancel = () => {
    setFormData({
      patientCd: "",
      payor: "",
      payPeriod: "",
      datePaid: "",
      remitRef: "",
      amount: "",
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const incomeList = Array.isArray(props.incomeData?.data)
    ? props.incomeData.data
    : [];
  const patientList = Array.isArray(props.patients?.data)
    ? props.patients.data
    : [];

  // Apply filters
  const filteredIncome = incomeList.filter((item) => {
    if (periodFilter && item.payPeriod !== periodFilter) return false;
    if (payorFilter && item.payor !== payorFilter) return false;
    if (
      searchQuery &&
      !item.patientCd?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const totalAmount = filteredIncome.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  // Get unique periods and payors for filters
  const periods = [...new Set(incomeList.map((item) => item.payPeriod))].filter(
    Boolean
  );
  const payors = [...new Set(incomeList.map((item) => item.payor))].filter(
    Boolean
  );

  if (isLoading && props.incomeData?.status === ACTION_STATUSES.PENDING) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <CircularProgress />
        <div style={{ marginTop: "20px" }}>Loading Income Data...</div>
      </div>
    );
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>
                Hospice Income Management
              </h4>
              <p
                className={classes.cardTitleWhite}
                style={{ fontSize: "0.9rem" }}
              >
                Actual Income • Manual Entry • Reporting
              </p>
            </CardHeader>
            <CardBody>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Manual Entry" />
                <Tab label="Income Table" />
                <Tab label="Report" />
              </Tabs>

              {/* Manual Entry Tab */}
              <TabPanel value={tabValue} index={0}>
                <Card>
                  <CardBody>
                    <Typography variant="h6" gutterBottom>
                      Add Income Entry
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth className={classes.formField}>
                          <InputLabel>Patient</InputLabel>
                          <Select
                            value={formData.patientCd}
                            onChange={handleFormChange("patientCd")}
                          >
                            <MenuItem value="">
                              <em>Select Patient</em>
                            </MenuItem>
                            {patientList.map((patient, idx) => (
                              <MenuItem key={idx} value={patient.patientCd}>
                                {patient.patientCd} - {patient.status}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth className={classes.formField}>
                          <InputLabel>Payor / Funding Source</InputLabel>
                          <Select
                            value={formData.payor}
                            onChange={handleFormChange("payor")}
                          >
                            <MenuItem value="">
                              <em>Select Payor</em>
                            </MenuItem>
                            <MenuItem value="Medicare">Medicare</MenuItem>
                            <MenuItem value="Medicaid">Medicaid</MenuItem>
                            <MenuItem value="Private Insurance">
                              Private Insurance
                            </MenuItem>
                            <MenuItem value="Private Pay">Private Pay</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Pay Period (MMM-YYYY)"
                          placeholder="Oct-2025"
                          value={formData.payPeriod}
                          onChange={handleFormChange("payPeriod")}
                          className={classes.formField}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date Paid"
                          type="date"
                          value={formData.datePaid}
                          onChange={handleFormChange("datePaid")}
                          InputLabelProps={{ shrink: true }}
                          className={classes.formField}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="EFT / Check Number"
                          placeholder="EFT-123456 or CHK-98765"
                          value={formData.remitRef}
                          onChange={handleFormChange("remitRef")}
                          className={classes.formField}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Amount (USD)"
                          placeholder="0.00"
                          type="number"
                          value={formData.amount}
                          onChange={handleFormChange("amount")}
                          className={classes.formField}
                        />
                      </Grid>
                    </Grid>

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap={2}
                      mt={3}
                    >
                      <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <span />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={
                          !formData.patientCd ||
                          !formData.payor ||
                          !formData.amount
                        }
                      >
                        Save Income Entry
                      </Button>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Income Table Tab */}
              <TabPanel value={tabValue} index={1}>
                <Card>
                  <CardBody>
                    <Typography variant="h6" gutterBottom>
                      Income Entries
                    </Typography>

                    {/* Filters */}
                    <Grid container spacing={2} style={{ marginBottom: 20 }}>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Filter: Pay Period</InputLabel>
                          <Select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>All Periods</em>
                            </MenuItem>
                            {periods.map((period) => (
                              <MenuItem key={period} value={period}>
                                {period}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Filter: Payor</InputLabel>
                          <Select
                            value={payorFilter}
                            onChange={(e) => setPayorFilter(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>All Payors</em>
                            </MenuItem>
                            {payors.map((payor) => (
                              <MenuItem key={payor} value={payor}>
                                {payor}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Search Patient"
                          placeholder="Type patient ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date Paid</TableCell>
                            <TableCell>Pay Period</TableCell>
                            <TableCell>Patient</TableCell>
                            <TableCell>Payor</TableCell>
                            <TableCell>EFT/Check #</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredIncome.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.datePaid
                                  ? moment(item.datePaid).format("MM/DD/YY")
                                  : ""}
                              </TableCell>
                              <TableCell>{item.payPeriod}</TableCell>
                              <TableCell>{item.patientCd}</TableCell>
                              <TableCell>{item.payor}</TableCell>
                              <TableCell>{item.remitRef}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(item.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className={classes.tableTotal}>
                            <TableCell colSpan={5}>
                              <strong>Total (Current View)</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{formatCurrency(totalAmount)}</strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Paper
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        Total: <strong>{formatCurrency(totalAmount)}</strong>
                      </Paper>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Report Tab */}
              <TabPanel value={tabValue} index={2}>
                <Card>
                  <CardBody>
                    <Typography variant="h6" gutterBottom>
                      Income Summary Report
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Paper style={{ padding: 20 }}>
                          <Typography variant="caption" color="textSecondary">
                            Total Entries
                          </Typography>
                          <Typography variant="h5">
                            {incomeList.length}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper style={{ padding: 20 }}>
                          <Typography variant="caption" color="textSecondary">
                            Total Income
                          </Typography>
                          <Typography variant="h5">
                            {formatCurrency(
                              incomeList.reduce(
                                (sum, item) =>
                                  sum + parseFloat(item.amount || 0),
                                0
                              )
                            )}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper style={{ padding: 20 }}>
                          <Typography variant="caption" color="textSecondary">
                            Avg Payment
                          </Typography>
                          <Typography variant="h5">
                            {formatCurrency(
                              incomeList.length > 0
                                ? incomeList.reduce(
                                    (sum, item) =>
                                      sum + parseFloat(item.amount || 0),
                                    0
                                  ) / incomeList.length
                                : 0
                            )}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper style={{ padding: 20 }}>
                          <Typography variant="caption" color="textSecondary">
                            Unique Patients
                          </Typography>
                          <Typography variant="h5">
                            {
                              new Set(incomeList.map((item) => item.patientCd))
                                .size
                            }
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardBody>
                </Card>
              </TabPanel>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = (store) => ({
  incomeData: incomeListStateSelector(store),
  createIncome: incomeCreateStateSelector(store),
  patients: patientListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  fetchIncome: (data) => dispatch(attemptToFetchIncome(data)),
  createIncome: (data) => dispatch(attemptToCreateIncome(data)),
  fetchPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetIncome: () => dispatch(resetFetchIncomeState()),
  resetCreateIncome: () => dispatch(resetCreateIncomeState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HospiceIncomeFunction);

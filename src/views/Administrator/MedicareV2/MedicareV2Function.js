import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import MedicareHandler from "./components/MedicareHandler";
import MedicareCard from "./components/MedicareCard";
import SummaryStats from "./components/SummaryStats";
import { connect } from "react-redux";

import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Box,
  Typography,
} from "@material-ui/core";
import { Search, AttachMoney } from "@material-ui/icons";

import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";

import { patientListStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
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
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  searchField: {
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "4px",
  },
  revenueCard: {
    padding: "24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  revenueIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: "20px",
  },
  revenueValue: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "8px",
  },
  revenueLabel: {
    fontSize: "0.875rem",
    opacity: 0.9,
  },
};

const useStyles = makeStyles(styles);

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;

let originalSource = [];

function MedicareV2Function(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [keywordValue, setKeywordValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");

  useEffect(() => {
    console.log("Medicare V2 - loading patient data");
    isPatientListDone = false;
    setIsPatientsCollection(true);
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
      });
    }

    // Cleanup: reset state when component unmounts
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
  }

  const filterRecordHandler = (keyword, startDt, endDt, fy) => {
    console.log("[Filters]", { keyword, startDt, endDt, fy }, originalSource);

    let filtered = [...originalSource];

    // Filter by patient ID
    if (keyword) {
      filtered = filtered.filter(
        (data) =>
          data.patientCd &&
          data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    }

    // Filter by SOC date range
    if (startDt) {
      filtered = filtered.filter((data) => {
        if (!data.soc) return false;
        return new Date(data.soc) >= new Date(startDt);
      });
    }

    if (endDt) {
      filtered = filtered.filter((data) => {
        if (!data.soc) return false;
        return new Date(data.soc) <= new Date(endDt);
      });
    }

    // Filter by Fiscal Year
    if (fy) {
      filtered = filtered.filter((data) => {
        if (!data.soc) return false;
        const socDate = new Date(`${data.soc} 17:00`);

        if (fy === "FY2024") {
          const fy2024Start = new Date("2023-10-01 17:00");
          const fy2024End = new Date("2024-09-30 17:00");
          return socDate >= fy2024Start && socDate <= fy2024End;
        } else if (fy === "FY2025") {
          const fy2025Start = new Date("2024-10-01 17:00");
          const fy2025End = new Date("2025-09-30 17:00");
          return socDate >= fy2025Start && socDate <= fy2025End;
        } else if (fy === "FY2026") {
          const fy2026Start = new Date("2025-10-01 17:00");
          const fy2026End = new Date("2026-09-30 17:00");
          return socDate >= fy2026Start && socDate <= fy2026End;
        }
        return true;
      });
    }

    setDataSource(filtered);
  };

  const inputHandler = (e) => {
    const value = e.target.value;
    setKeywordValue(value);
    filterRecordHandler(value, startDate, endDate, fiscalYear);
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    filterRecordHandler(keywordValue, value, endDate, fiscalYear);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    filterRecordHandler(keywordValue, startDate, value, fiscalYear);
  };

  const handleFiscalYearChange = (e) => {
    const value = e.target.value;
    setFiscalYear(value);
    filterRecordHandler(keywordValue, startDate, endDate, value);
  };

  // Calculate total revenue from used cap (all FY periods)
  // Excludes patients with zero allowed cap (same logic as Summary Stats)
  const calculateTotalRevenue = () => {
    if (!dataSource || dataSource.length === 0) return 0;

    return dataSource.reduce((total, patient) => {
      // Exclude patients with zero allowed cap (matches Summary Stats aggregation logic)
      const allowedCap = parseFloat(patient.allowedCapFirstPeriod || 0);
      if (allowedCap === 0) return total;

      const usedFirst = parseFloat(patient.usedCapFirstPeriod || 0);
      const usedSecond = parseFloat(patient.usedCapSecondPeriod || 0);
      return total + usedFirst + usedSecond;
    }, 0);
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const totalRevenue = calculateTotalRevenue();

  isProcessDone = isPatientListDone;

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>Loading Medicare Cap Data...</div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <Grid container justifyContent="space-between">
                    <h4 className={classes.cardTitleWhite}>
                      Medicare Cap Management - Dashboard
                    </h4>
                  </Grid>
                </CardHeader>
                <CardBody>
                  {/* Search and Filter Section */}
                  <GridContainer
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GridItem md={4} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by patient ID..."
                        value={keywordValue}
                        onChange={inputHandler}
                        className={classes.searchField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </GridItem>

                    <GridItem md={2} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="SOC Start Date"
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className={classes.searchField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridItem>

                    <GridItem md={2} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="SOC End Date"
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className={classes.searchField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridItem>

                    <GridItem md={2} sm={6} xs={12}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.searchField}
                      >
                        <InputLabel>Fiscal Year</InputLabel>
                        <Select
                          value={fiscalYear}
                          onChange={handleFiscalYearChange}
                          label="Fiscal Year"
                        >
                          <MenuItem value="">
                            <em>All</em>
                          </MenuItem>
                          <MenuItem value="FY2024">FY 2024</MenuItem>
                          <MenuItem value="FY2025">FY 2025</MenuItem>
                          <MenuItem value="FY2026">FY 2026</MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem md={2} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Filtered Count"
                        value={`${dataSource.length} patients`}
                        className={classes.searchField}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  {/* Summary Statistics */}
                  <GridContainer
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GridItem md={12} sm={12} xs={12}>
                      <SummaryStats data={dataSource} />
                    </GridItem>
                  </GridContainer>

                  {/* Total Revenue Card */}
                  <GridContainer
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GridItem md={12} sm={12} xs={12}>
                      <Paper className={classes.revenueCard} elevation={3}>
                        <Box display="flex" alignItems="center">
                          <Box className={classes.revenueIconBox}>
                            <AttachMoney style={{ fontSize: 32 }} />
                          </Box>
                          <Box>
                            <Typography className={classes.revenueValue}>
                              {formatCurrency(totalRevenue)}
                            </Typography>
                            <Typography className={classes.revenueLabel}>
                              Total Revenue (Used Cap) - {dataSource.length}{" "}
                              {dataSource.length === 1 ? "Patient" : "Patients"}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </GridItem>
                  </GridContainer>

                  {/* Patient Cards */}
                  <GridContainer spacing={3} style={{ padding: "0 20px" }}>
                    {dataSource && dataSource.length > 0 ? (
                      dataSource.map((patient, index) => (
                        <GridItem key={index} xs={12} sm={6} md={4} lg={3}>
                          <MedicareCard data={patient} />
                        </GridItem>
                      ))
                    ) : (
                      <GridItem xs={12}>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#999",
                          }}
                        >
                          No patient data found
                        </div>
                      </GridItem>
                    )}
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
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MedicareV2Function);

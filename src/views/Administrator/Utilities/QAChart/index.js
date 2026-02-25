import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { connect } from "react-redux";
import moment from "moment";
import { handleExport } from "utils/XlsxHelper";

import { ACTION_STATUSES } from "utils/constants";
import {
  attemptToFetchPatient,
  resetFetchPatientState,
} from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
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
  },
  tableContainer: {
    marginTop: "20px",
    maxHeight: "600px",
    overflowY: "auto",
  },
  tableHeader: {
    backgroundColor: "#667eea",
    "& th": {
      color: "black",
      fontWeight: "bold",
      fontSize: "0.95rem",
      padding: "12px",
    },
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f5f5f5",
    },
    "&:hover": {
      backgroundColor: "#e3f2fd",
    },
  },
  monthGroupHeader: {
    backgroundColor: "#9F7AEA",
    "& td": {
      color: "white",
      fontWeight: "bold",
      fontSize: "1.1rem",
      padding: "16px",
    },
  },
  subtotalRow: {
    backgroundColor: "#E9D8FD",
    "& td": {
      fontWeight: "bold",
      fontSize: "0.95rem",
      padding: "12px",
    },
  },
};

const useStyles = makeStyles(styles);

function QAChart(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [isProcessDone, setIsProcessDone] = useState(false);
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [chartData, setChartData] = useState({ months: [], patientRows: [] });
  const [patientList, setPatientList] = useState([]);

  // Date range for calculation
  const START_DATE = moment("2025-06-01");
  const END_DATE = moment("2026-02-28");

  useEffect(() => {
    if (context.userProfile?.companyId) {
      setIsPatientCollection(false);
      props.listPatients({ companyId: context.userProfile?.companyId });
    }
  }, [context.userProfile?.companyId]);

  useEffect(() => {
    if (
      !isPatientCollection &&
      props.patients &&
      props.patients.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListPatients();
      setPatientList(props.patients.data || []);
      setIsPatientCollection(true);
    }
  }, [isPatientCollection, props.patients]);

  useEffect(() => {
    if (isPatientCollection && patientList.length > 0) {
      const data = calculateQAData();
      setChartData(data);
      setIsProcessDone(true);
    }
  }, [isPatientCollection, patientList]);

  const calculateWeeksForMonth = (socDate, eocDate, monthStart, monthEnd) => {
    const soc = moment(socDate);
    const eoc = eocDate ? moment(eocDate) : null;

    // If SOC is after this month, return 0
    if (soc.isAfter(monthEnd, "day")) {
      return 0;
    }

    // If EOC is before this month, return 0
    if (eoc && eoc.isBefore(monthStart, "day")) {
      return 0;
    }

    // Calculate effective start and end for this month
    const effectiveStart = soc.isAfter(monthStart) ? soc : monthStart;
    const effectiveEnd = eoc && eoc.isBefore(monthEnd) ? eoc : monthEnd;

    // Calculate days in this month
    const daysInMonth = effectiveEnd.diff(effectiveStart, "days") + 1;

    if (daysInMonth <= 0) return 0;

    // Convert to weeks
    const weeks = (daysInMonth / 7).toFixed(2);
    return parseFloat(weeks);
  };

  const calculateQAData = () => {
    // Define the months from June 2025 to February 2026
    const months = [
      { label: "Jun 2025", start: moment("2025-06-01"), end: moment("2025-06-30") },
      { label: "Jul 2025", start: moment("2025-07-01"), end: moment("2025-07-31") },
      { label: "Aug 2025", start: moment("2025-08-01"), end: moment("2025-08-31") },
      { label: "Sep 2025", start: moment("2025-09-01"), end: moment("2025-09-30") },
      { label: "Oct 2025", start: moment("2025-10-01"), end: moment("2025-10-31") },
      { label: "Nov 2025", start: moment("2025-11-01"), end: moment("2025-11-30") },
      { label: "Dec 2025", start: moment("2025-12-01"), end: moment("2025-12-31") },
      { label: "Jan 2026", start: moment("2026-01-01"), end: moment("2026-01-31") },
      { label: "Feb 2026", start: moment("2026-02-01"), end: moment("2026-02-28") },
    ];

    // Filter patients whose SOC is within the date range
    const filteredPatients = patientList.filter((patient) => {
      if (!patient.soc) return false;
      const socDate = moment(patient.soc);
      return socDate.isSameOrAfter(START_DATE, "day") &&
             socDate.isSameOrBefore(END_DATE, "day");
    });

    // Build patient rows with weeks for each month
    const patientRows = filteredPatients.map((patient) => {
      const socDate = moment(patient.soc);
      const eocDate = patient.eoc;

      const row = {
        patientCd: patient.patientCd || "N/A",
        patientName: patient.name || `${patient.fn || ""} ${patient.ln || ""}`.trim() || "Unknown",
        socDate: socDate.format("MM/DD/YYYY"),
        eocDate: eocDate ? moment(eocDate).format("MM/DD/YYYY") : "—",
        monthWeeks: {},
        totalWeeks: 0,
      };

      // Calculate weeks for each month
      months.forEach((month) => {
        const weeks = calculateWeeksForMonth(patient.soc, eocDate, month.start, month.end);
        row.monthWeeks[month.label] = weeks;
        row.totalWeeks += weeks;
      });

      row.totalWeeks = row.totalWeeks.toFixed(2);

      return row;
    });

    return { months, patientRows };
  };

  const exportToExcel = () => {
    if (!chartData.patientRows || chartData.patientRows.length === 0) {
      return;
    }

    // Format data for Excel export
    const excelData = chartData.patientRows.map((patient) => {
      const row = {
        Patient: patient.patientCd,
        SOC: patient.socDate,
        EOC: patient.eocDate,
      };

      // Add each month's weeks
      chartData.months.forEach((month) => {
        row[month.label] = patient.monthWeeks[month.label] > 0
          ? patient.monthWeeks[month.label].toFixed(2)
          : "—";
      });

      row["Total Weeks"] = patient.totalWeeks;

      return row;
    });

    handleExport(excelData, "QA_Chart_Patient_Weeks");
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitleWhite}>
              QA Chart - Patient Weeks of Care
            </h4>
            <p className={classes.cardCategoryWhite}>
              Calculation Period: June 1, 2025 - February 28, 2026
            </p>
          </CardHeader>
          <CardBody>
            {isProcessDone && chartData.patientRows && chartData.patientRows.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <Button color="success" onClick={exportToExcel}>
                  <GetApp /> Export to Excel
                </Button>
              </div>
            )}
            {!isProcessDone ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress />
                <Typography>Loading patient data...</Typography>
              </div>
            ) : (
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow className={classes.tableHeader}>
                      <TableCell>Patient</TableCell>
                      <TableCell>SOC</TableCell>
                      <TableCell>EOC</TableCell>
                      {chartData.months?.map((month) => (
                        <TableCell key={month.label} align="center">
                          {month.label}
                        </TableCell>
                      ))}
                      <TableCell align="center"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!chartData.patientRows || chartData.patientRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} align="center">
                          <Typography>No patients found in the specified date range</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      chartData.patientRows.map((patient, idx) => (
                        <TableRow key={idx} className={classes.tableRow}>
                          <TableCell>{patient.patientCd}</TableCell>
                          <TableCell>{patient.socDate}</TableCell>
                          <TableCell>{patient.eocDate}</TableCell>
                          {chartData.months.map((month) => (
                            <TableCell key={month.label} align="center">
                              {patient.monthWeeks[month.label] > 0
                                ? patient.monthWeeks[month.label].toFixed(2)
                                : "—"}
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <strong>{patient.totalWeeks}</strong>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(QAChart);

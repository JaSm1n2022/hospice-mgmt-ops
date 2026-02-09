import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  CircularProgress,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp, GetApp } from "@material-ui/icons";
import { connect } from "react-redux";
import moment from "moment";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

import { ACTION_STATUSES } from "utils/constants";
import {
  attemptToFetchEmployee,
  resetFetchEmployeeState,
} from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import {
  attemptToFetchPatient,
  resetFetchPatientState,
} from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import {
  attemptToFetchAssignment,
  resetFetchAssignmentState,
} from "store/actions/assignmentAction";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
import {
  attemptToFetchContract,
  resetFetchContractState,
} from "store/actions/contractAction";
import { contractListStateSelector } from "store/selectors/contractSelector";
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
  totalRow: {
    backgroundColor: "#667eea !important",
    "& td": {
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  detailRow: {
    backgroundColor: "#eef2ff",
    "& td": {
      fontSize: "0.85rem",
      color: "#444",
    },
  },
  socRow: {
    backgroundColor: "#fff3e0",
    "& td": {
      fontSize: "0.85rem",
      fontStyle: "italic",
      color: "#e65100",
    },
  },
  fixedRow: {
    backgroundColor: "#e8f5e9",
    "& td": {
      fontSize: "0.85rem",
      fontStyle: "italic",
      color: "#2e7d32",
    },
  },
};

const useStyles = makeStyles(styles);

// Hardcoded expense constants
const PAYROLL_CONSTANTS = {
  DEATH_PRONOUNCEMENT: 120, // Default rate if no contract found
};

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  employeeHeader: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#667eea",
    color: "white",
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#eef2ff",
    padding: 5,
    marginTop: 5,
  },
  socSectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#fff3e0",
    color: "#e65100",
    padding: 5,
    marginTop: 5,
  },
  fixedSectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: 5,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingLeft: 20,
    fontSize: 9,
    backgroundColor: "#f9f9f9",
  },
  col1: { width: "30%" },
  col2: { width: "15%" },
  col3: { width: "15%" },
  col4: { width: "10%" },
  col5: { width: "15%" },
  col6: { width: "15%" },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#667eea",
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
  grandTotalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#4c51bf",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 10,
  },
});

// PDF Document Component
const PayrollForecastPDF = ({ data, currentMonthLabel }) => {
  const totalPayroll = data.reduce((sum, emp) => sum + emp.totalPayroll, 0);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Employee Payroll Forecast</Text>
        <Text style={pdfStyles.subtitle}>{currentMonthLabel}</Text>

        {data.map((employee, idx) => (
          <View key={idx}>
            {/* Employee Header */}
            <Text style={pdfStyles.employeeHeader}>
              {employee.employeeName} - {employee.employeePosition} | Total: ${employee.totalPayroll.toFixed(2)}
            </Text>

            {/* Salaried Employee */}
            {employee.isSalaried && (
              <View>
                <Text style={pdfStyles.fixedSectionHeader}>Salaried (Fixed)</Text>
                <View style={pdfStyles.detailRow}>
                  <Text style={pdfStyles.col1}>Salary</Text>
                  <Text style={pdfStyles.col6}>${employee.salaryAmount.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Non-Salaried Employee */}
            {!employee.isSalaried && (
              <View>
                {/* Regular Visit Expenses */}
                {employee.regularDetails && employee.regularDetails.length > 0 && (
                  <View>
                    <Text style={pdfStyles.sectionHeader}>
                      Regular Visit Expenses: ${employee.regularExpenses.toFixed(2)}
                    </Text>
                    {employee.regularDetails.map((detail, dIdx) => (
                      <View key={dIdx} style={pdfStyles.detailRow}>
                        <Text style={pdfStyles.col1}>{detail.patientCd}</Text>
                        <Text style={pdfStyles.col2}>{detail.frequencyVisit}</Text>
                        <Text style={pdfStyles.col3}>{detail.visitType}</Text>
                        <Text style={pdfStyles.col4}>{detail.visits}</Text>
                        <Text style={pdfStyles.col5}>${detail.rate.toFixed(2)}</Text>
                        <Text style={pdfStyles.col6}>${detail.amount.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* SOC Expenses */}
                {employee.socDetails && employee.socDetails.length > 0 && (
                  <View>
                    <Text style={pdfStyles.socSectionHeader}>
                      SOC Expenses: ${employee.socExpenses.toFixed(2)}
                    </Text>
                    {employee.socDetails.map((detail, dIdx) => (
                      <View key={dIdx} style={pdfStyles.detailRow}>
                        <Text style={pdfStyles.col1}>{detail.patientCd}</Text>
                        <Text style={pdfStyles.col2}>{detail.serviceType}</Text>
                        <Text style={pdfStyles.col5}>${detail.rate.toFixed(2)}</Text>
                        <Text style={pdfStyles.col6}>${detail.amount.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Fixed IDT */}
                {employee.fixedDetails && employee.fixedDetails.length > 0 && (
                  <View>
                    <Text style={pdfStyles.fixedSectionHeader}>
                      Fixed IDT Meeting: ${employee.fixedExpenses.toFixed(2)}
                    </Text>
                    {employee.fixedDetails.map((detail, dIdx) => (
                      <View key={dIdx} style={pdfStyles.detailRow}>
                        <Text style={pdfStyles.col1}>{detail.description}</Text>
                        <Text style={pdfStyles.col4}>{detail.visits}</Text>
                        <Text style={pdfStyles.col5}>${detail.rate.toFixed(2)}</Text>
                        <Text style={pdfStyles.col6}>${detail.amount.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {/* Grand Total */}
        <View style={pdfStyles.grandTotalRow}>
          <Text style={{ width: "70%" }}>GRAND TOTAL PAYROLL</Text>
          <Text style={{ width: "30%" }}>${totalPayroll.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Module-level cached data (persists across renders)
let employeeList = [];
let patientList = [];
let assignmentList = [];
let contractList = [];
let isEmployeeListDone = false;
let isPatientListDone = false;
let isAssignmentListDone = false;
let isContractListDone = false;

function EmployeePayrollForecast(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [forecastData, setForecastData] = useState([]);
  const [isProcessDone, setIsProcessDone] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Data collection states
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);

  const currentMonthLabel = moment().format("MMMM YYYY");

  useEffect(() => {
    // Reset flags on mount
    isEmployeeListDone = false;
    isPatientListDone = false;
    isAssignmentListDone = false;
    isContractListDone = false;

    // Trigger initial employee fetch
    if (context.userProfile?.companyId) {
      props.listEmployees({
        companyId: context.userProfile.companyId,
      });
    }

    return () => {
      props.resetListEmployees();
      props.resetListPatients();
      props.resetListAssignments();
      props.resetListContracts();
    };
  }, []);

  // Gate: employees arrive → fetch patients
  if (
    isEmployeeCollection &&
    props.employees?.status === ACTION_STATUSES.SUCCEED
  ) {
    employeeList = props.employees.data || [];
    isEmployeeListDone = true;
    props.resetListEmployees();
    setIsEmployeeCollection(false);

    // Trigger patient fetch
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile.companyId,
      });
    }
  }

  // Gate: patients arrive → fetch assignments
  if (
    isPatientCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    patientList = props.patients.data || [];
    isPatientListDone = true;
    props.resetListPatients();
    setIsPatientCollection(false);

    // Trigger assignment fetch
    if (context.userProfile?.companyId) {
      props.listAssignments({
        companyId: context.userProfile.companyId,
      });
    }
  }

  // Gate: assignments arrive → fetch contracts
  if (
    isAssignmentCollection &&
    props.assignments?.status === ACTION_STATUSES.SUCCEED
  ) {
    assignmentList = props.assignments.data || [];
    isAssignmentListDone = true;
    props.resetListAssignments();
    setIsAssignmentCollection(false);

    // Trigger contract fetch
    if (context.userProfile?.companyId) {
      props.listContracts({
        companyId: context.userProfile.companyId,
      });
    }
  }

  // Gate: contracts arrive → calculate forecast
  if (
    isContractCollection &&
    props.contracts?.status === ACTION_STATUSES.SUCCEED
  ) {
    contractList = props.contracts.data || [];
    isContractListDone = true;
    props.resetListContracts();
    setIsContractCollection(false);
  }

  // Calculate once all datasets are ready
  useEffect(() => {
    if (
      isEmployeeListDone &&
      isPatientListDone &&
      isAssignmentListDone &&
      isContractListDone
    ) {
      const result = calculatePayrollForecast();
      setForecastData(result);
      setIsProcessDone(true);
    }
  }, [
    isEmployeeCollection,
    isPatientCollection,
    isAssignmentCollection,
    isContractCollection,
  ]);

  const calculatePayrollForecast = () => {
    const today = moment();
    const currentMonthStart = today.clone().startOf("month");
    const currentMonthEnd = today.clone().endOf("month");
    const daysInMonth = currentMonthEnd.date();

    const results = [];

    employeeList.forEach((employee) => {
      const employeeName = employee.name || `${employee.fn || ""} ${employee.ln || ""}`.trim() || "Unknown";
      const employeeId = employee.id; // Use id for matching with assignments/contracts
      const employeePosition = employee.position || "";

      // Check for salaried contract (ignore employeeType, only check contracts)
      const salaryContract = contractList.find(
        (c) =>
          c.employeeId?.toString() === employeeId?.toString() &&
          c.serviceRateType?.toLowerCase()?.includes("salaried")
      );

      const salaryAmount = salaryContract
        ? parseFloat(salaryContract.serviceRate || 0)
        : 0;

      // Calculate all types of payroll for this employee
      let regularExpenses = 0;
      const regularDetails = [];
      let socExpenses = 0;
      const socDetails = [];
      let fixedExpenses = 0;
      const fixedDetails = [];

      // Get assignments for this employee
      const employeeAssignments = assignmentList.filter(
        (a) => a.disciplineId?.toString() === employeeId?.toString()
      );

      // Process each assignment
      if (employeeAssignments.length > 0) {
        employeeAssignments.forEach((assignment) => {
          const patient = patientList.find(
            (p) => p.patientCd === assignment.patientCd
          );
          if (!patient || !patient.soc) return;

          const socDate = moment(patient.soc);
          const eocDate = patient.eoc ? moment(patient.eoc) : null;

          // Skip patients not active in the current month
          if (eocDate && eocDate.isBefore(currentMonthStart, "day")) return;
          if (socDate.isAfter(currentMonthEnd, "day")) return;

          const effStart = moment.max(socDate, currentMonthStart);
          const effEnd = eocDate
            ? moment.min(eocDate, currentMonthEnd)
            : currentMonthEnd;
          const daysInCurrentMonth = effEnd.diff(effStart, "days") + 1;
          if (daysInCurrentMonth <= 0) return;

          const patientCd = patient.patientCd || "—";
          const freq = parseInt(assignment.frequencyVisit || 0);
          const visitType = (assignment.visitType || "").toLowerCase();

          // --- Regular Visits ---
          if (freq > 0) {
            let visits = 0;
            if (visitType === "week") {
              visits = Math.ceil((daysInCurrentMonth / 7) * freq);
            } else if (visitType === "month") {
              visits = Math.ceil((daysInCurrentMonth / daysInMonth) * freq);
            }
            if (visits < 1) {
              visits = 1;
            }

            // Find regular visit contract
            let contract = contractList.find(
              (c) =>
                c.employeeId?.toString() === employeeId?.toString() &&
                c.patientCd === patient.patientCd &&
                c.serviceType?.toLowerCase() === "regular visit"
            );
            if (!contract) {
              contract = contractList.find(
                (c) =>
                  c.employeeId?.toString() === employeeId?.toString() &&
                  (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
                  c.serviceType?.toLowerCase() === "regular visit"
              );
            }

            const rate = contract ? parseFloat(contract.serviceRate || 0) : 0;
            const amount = visits * rate;
            regularExpenses += amount;
            regularDetails.push({
              patientCd,
              frequencyVisit: `${freq}/${visitType === "week" ? "Week" : "Month"}`,
              visitType: visitType === "week" ? "Week" : "Month",
              visits,
              rate,
              amount,
            });
          }

          // --- SOC Expenses ---
          // Only for nurse, MSW, chaplain using SOC/Assessment contract rate
          const isSocInCurrentMonth =
            socDate.isSameOrAfter(currentMonthStart, "day") &&
            socDate.isSameOrBefore(currentMonthEnd, "day");

          const position = employeePosition.toLowerCase();
          const canDoSocAssessment =
            position.includes("nurse") ||
            position.includes("rn") ||
            position.includes("msw") ||
            position.includes("social worker") ||
            position.includes("chaplain");

          if (isSocInCurrentMonth && canDoSocAssessment) {
            // Look for SOC/Assessment contract
            let socAssessmentContract = contractList.find(
              (c) =>
                c.employeeId?.toString() === employeeId?.toString() &&
                c.patientCd === patient.patientCd &&
                (c.serviceType?.toLowerCase() === "soc" ||
                  c.serviceType?.toLowerCase() === "assessment" ||
                  c.serviceType?.toLowerCase() === "soc/assessment")
            );
            if (!socAssessmentContract) {
              socAssessmentContract = contractList.find(
                (c) =>
                  c.employeeId?.toString() === employeeId?.toString() &&
                  (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
                  (c.serviceType?.toLowerCase() === "soc" ||
                    c.serviceType?.toLowerCase() === "assessment" ||
                    c.serviceType?.toLowerCase() === "soc/assessment")
              );
            }

            if (socAssessmentContract) {
              const socRate = parseFloat(socAssessmentContract.serviceRate || 0);
              socExpenses += socRate;
              socDetails.push({
                patientCd,
                serviceType: "SOC/Assessment",
                rate: socRate,
                amount: socRate,
              });
            }
          }

          // --- Death Pronouncement (EOC - goes in Regular Visits) ---
          // Only Case Manager or Registered Nurse can do Death Pronouncement
          const isEocInCurrentMonth =
            eocDate &&
            eocDate.isSameOrAfter(currentMonthStart, "day") &&
            eocDate.isSameOrBefore(currentMonthEnd, "day");

          const canDoDeathPronouncement =
            position.includes("case manager") ||
            position.includes("registered nurse") ||
            position.includes("rn");

          if (isEocInCurrentMonth && canDoDeathPronouncement) {
            let deathPronouncementContract = contractList.find(
              (c) =>
                c.employeeId?.toString() === employeeId?.toString() &&
                c.patientCd === patient.patientCd &&
                c.serviceType?.toLowerCase() === "death pronouncement"
            );
            if (!deathPronouncementContract) {
              deathPronouncementContract = contractList.find(
                (c) =>
                  c.employeeId?.toString() === employeeId?.toString() &&
                  (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
                  c.serviceType?.toLowerCase() === "death pronouncement"
              );
            }

            const deathRate = deathPronouncementContract
              ? parseFloat(deathPronouncementContract.serviceRate || 0)
              : PAYROLL_CONSTANTS.DEATH_PRONOUNCEMENT;

            regularExpenses += deathRate;
            regularDetails.push({
              patientCd,
              frequencyVisit: "Death Pronouncement",
              visitType: "EOC",
              visits: 1,
              rate: deathRate,
              amount: deathRate,
            });
          }
        });
      }

      // --- Fixed IDT Meeting Compensation ---
      // Not patient-associated, just check if employee has contract
      // Qualifying roles: Registered Nurse, Case Manager, MSW, Chaplain
      const position = employeePosition.toLowerCase();
      const canDoIDT =
        position.includes("registered nurse") ||
        position.includes("rn") ||
        position.includes("case manager") ||
        position.includes("msw") ||
        position.includes("social worker") ||
        position.includes("chaplain");

      if (canDoIDT) {
        // Find IDT Meeting via Person contract (not patient-specific)
        let idtContract = contractList.find(
          (c) =>
            c.employeeId?.toString() === employeeId?.toString() &&
            c.serviceType?.toLowerCase()?.includes("idt meeting") &&
            (c.serviceType?.toLowerCase()?.includes("person") || c.serviceType?.toLowerCase()?.includes("in person")) &&
            (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL")
        );

        if (idtContract) {
          const idtRate = parseFloat(idtContract.serviceRate || 0);
          const idtAmount = 2 * idtRate; // Fixed 2 visits
          fixedExpenses += idtAmount;
          fixedDetails.push({
            description: "IDT meeting in Person",
            visits: 2,
            rate: idtRate,
            amount: idtAmount,
          });
        }
      }

      // Calculate total payroll = salary + visits + SOC + fixed IDT
      const totalPayroll = salaryAmount + regularExpenses + socExpenses + fixedExpenses;

      // Only add employee to results if they have any payroll
      if (totalPayroll > 0) {
        results.push({
          employeeName,
          employeeId,
          employeePosition,
          isSalaried: salaryAmount > 0 && employeeAssignments.length === 0, // True only if ONLY salaried, no assignments
          salaryAmount,
          totalPayroll,
          regularExpenses,
          regularDetails,
          socExpenses,
          socDetails,
          fixedExpenses,
          fixedDetails,
        });
      }
    });

    // Sort by total payroll descending
    return results.sort((a, b) => b.totalPayroll - a.totalPayroll);
  };

  const toggleRowExpand = (employeeId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const totalPayroll = forecastData.reduce(
    (sum, emp) => sum + emp.totalPayroll,
    0
  );

  return (
    <GridContainer>
      <GridItem xs={12}>
        {!isProcessDone && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <CircularProgress />
            <Typography variant="h6" style={{ marginTop: 20 }}>
              Loading Employee Payroll Forecast...
            </Typography>
          </div>
        )}

        {isProcessDone && (
          <>
            {/* PDF Download Button */}
            {forecastData && forecastData.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
                <PDFDownloadLink
                  document={
                    <PayrollForecastPDF
                      data={forecastData}
                      currentMonthLabel={currentMonthLabel}
                    />
                  }
                  fileName={`Employee_Payroll_Forecast_${moment().format("YYYY_MM")}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<GetApp />}
                      disabled={loading}
                    >
                      {loading ? "Generating PDF..." : "Download PDF Report"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}

            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Employee Payroll Forecast - {currentMonthLabel}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  Projected payroll expenses for the current month
                </p>
              </CardHeader>
              <CardBody>
                {forecastData.length === 0 ? (
                  <Typography variant="body1">
                    No employee payroll data available for this month.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell style={{ width: "3%" }}></TableCell>
                          <TableCell style={{ width: "20%" }}>Employee Name</TableCell>
                          <TableCell style={{ width: "15%" }}>Position</TableCell>
                          <TableCell align="right" style={{ width: "12%" }}>
                            Salaried
                          </TableCell>
                          <TableCell align="right" style={{ width: "12%" }}>
                            Regular Visits
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            SOC
                          </TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            Fixed IDT
                          </TableCell>
                          <TableCell align="right" style={{ width: "13%" }}>
                            <strong>Total Payroll</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecastData.map((employee) => {
                          const isExpanded = expandedRows[employee.employeeId];

                          return (
                            <React.Fragment key={employee.employeeId}>
                              {/* Main Employee Row */}
                              <TableRow className={classes.tableRow}>
                                <TableCell>
                                  {!employee.isSalaried && (
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleRowExpand(employee.employeeId)}
                                    >
                                      {isExpanded ? (
                                        <KeyboardArrowUp />
                                      ) : (
                                        <KeyboardArrowDown />
                                      )}
                                    </IconButton>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <strong>{employee.employeeName}</strong>
                                </TableCell>
                                <TableCell>
                                  {employee.employeePosition}
                                </TableCell>
                                <TableCell align="right">
                                  {employee.salaryAmount > 0 ? `$${employee.salaryAmount.toFixed(2)}` : "—"}
                                </TableCell>
                                <TableCell align="right">
                                  ${employee.regularExpenses.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  ${employee.socExpenses.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  ${employee.fixedExpenses.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  <strong>${employee.totalPayroll.toFixed(2)}</strong>
                                </TableCell>
                              </TableRow>

                              {/* Expanded Detail Rows */}
                              {isExpanded && !employee.isSalaried && (
                                <>
                                  {/* Regular Visit Details */}
                                  {employee.regularDetails.length > 0 && (
                                    <>
                                      <TableRow className={classes.detailRow}>
                                        <TableCell colSpan={8}>
                                          <strong>Regular Visit Expenses</strong>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.detailRow}>
                                        <TableCell></TableCell>
                                        <TableCell>Patient Cd</TableCell>
                                        <TableCell>Frequency</TableCell>
                                        <TableCell align="right">Visits</TableCell>
                                        <TableCell align="right">Rate</TableCell>
                                        <TableCell align="right" colSpan={3}>Amount</TableCell>
                                      </TableRow>
                                      {employee.regularDetails.map((detail, idx) => (
                                        <TableRow key={idx} className={classes.detailRow}>
                                          <TableCell></TableCell>
                                          <TableCell>{detail.patientCd || "—"}</TableCell>
                                          <TableCell>{detail.frequencyVisit}</TableCell>
                                          <TableCell align="right">{detail.visits}</TableCell>
                                          <TableCell align="right">
                                            ${detail.rate.toFixed(2)}
                                          </TableCell>
                                          <TableCell align="right" colSpan={3}>
                                            ${detail.amount.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </>
                                  )}

                                  {/* SOC Details */}
                                  {employee.socDetails.length > 0 && (
                                    <>
                                      <TableRow className={classes.socRow}>
                                        <TableCell colSpan={8}>
                                          <strong>SOC Expenses</strong>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.socRow}>
                                        <TableCell></TableCell>
                                        <TableCell>Patient Cd</TableCell>
                                        <TableCell>Service Type</TableCell>
                                        <TableCell align="right" colSpan={2}>Rate</TableCell>
                                        <TableCell align="right" colSpan={3}>Amount</TableCell>
                                      </TableRow>
                                      {employee.socDetails.map((detail, idx) => (
                                        <TableRow key={idx} className={classes.socRow}>
                                          <TableCell></TableCell>
                                          <TableCell>{detail.patientCd || "—"}</TableCell>
                                          <TableCell>{detail.serviceType}</TableCell>
                                          <TableCell align="right" colSpan={2}>
                                            ${detail.rate.toFixed(2)}
                                          </TableCell>
                                          <TableCell align="right" colSpan={3}>
                                            ${detail.amount.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </>
                                  )}

                                  {/* Fixed IDT Details */}
                                  {employee.fixedDetails.length > 0 && (
                                    <>
                                      <TableRow className={classes.fixedRow}>
                                        <TableCell colSpan={8}>
                                          <strong>Fixed IDT Meeting</strong>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.fixedRow}>
                                        <TableCell></TableCell>
                                        <TableCell colSpan={2}>Description</TableCell>
                                        <TableCell align="right">Visits</TableCell>
                                        <TableCell align="right">Rate</TableCell>
                                        <TableCell align="right" colSpan={3}>Amount</TableCell>
                                      </TableRow>
                                      {employee.fixedDetails.map((detail, idx) => (
                                        <TableRow key={idx} className={classes.fixedRow}>
                                          <TableCell></TableCell>
                                          <TableCell colSpan={2}>{detail.description}</TableCell>
                                          <TableCell align="right">{detail.visits}</TableCell>
                                          <TableCell align="right">
                                            ${detail.rate.toFixed(2)}
                                          </TableCell>
                                          <TableCell align="right" colSpan={3}>
                                            ${detail.amount.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </>
                                  )}
                                </>
                              )}
                            </React.Fragment>
                          );
                        })}

                        {/* Grand Total Row */}
                        <TableRow className={classes.totalRow}>
                          <TableCell colSpan={7} align="right">
                            <strong>GRAND TOTAL PAYROLL</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>${totalPayroll.toFixed(2)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </GridItem>
    </GridContainer>
  );
}

const mapStateToProps = (state) => ({
  employees: employeeListStateSelector(state),
  patients: patientListStateSelector(state),
  assignments: assignmentListStateSelector(state),
  contracts: contractListStateSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignments: () => dispatch(resetFetchAssignmentState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeePayrollForecast);

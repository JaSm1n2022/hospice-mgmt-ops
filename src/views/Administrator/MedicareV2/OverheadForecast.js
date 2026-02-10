import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
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

import { ACTION_STATUSES, OVERHEAD_CONSTANTS } from "utils/constants";
import MedicareHandler from "./components/MedicareHandler";
import {
  attemptToFetchPatient,
  resetFetchPatientState,
} from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import {
  attemptToFetchEmployee,
  resetFetchEmployeeState,
} from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
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
  },
  sectionHeader: {
    backgroundColor: "#f5f5f5",
    "& td": {
      fontWeight: "bold",
      fontSize: "1rem",
      paddingTop: "15px",
      paddingBottom: "15px",
    },
  },
  subsectionHeader: {
    backgroundColor: "#fafafa",
    "& td": {
      fontWeight: "600",
      fontSize: "0.95rem",
      paddingLeft: "30px",
    },
  },
  detailRow: {
    "& td": {
      paddingLeft: "50px",
      fontSize: "0.9rem",
    },
  },
  totalRow: {
    backgroundColor: "#667eea !important",
    "& td": {
      color: "white",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
  },
  netIncomeRow: {
    backgroundColor: "#4c51bf !important",
    "& td": {
      color: "white",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
  },
};

const useStyles = makeStyles(styles);

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  sectionRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    marginTop: 10,
    fontWeight: "bold",
  },
  subsectionRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingLeft: 20,
    backgroundColor: "#fafafa",
    fontWeight: "600",
    fontSize: 9,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingLeft: 40,
    fontSize: 9,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#667eea",
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 11,
  },
  netIncomeRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#4c51bf",
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 12,
  },
  label: {
    width: "70%",
  },
  value: {
    width: "30%",
    textAlign: "right",
  },
});

// PDF Document Component
const OverheadForecastPDF = ({ data, currentMonthLabel }) => {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>
          {currentMonthLabel} — Overhead Forecast
        </Text>
        <Text style={pdfStyles.subHeader}>
          Monthly Overhead and Net Income Projection
        </Text>

        {/* Projected ADC & Revenue */}
        <View style={pdfStyles.sectionRow}>
          <Text style={pdfStyles.label}>Projected ADC (Average Daily Census)</Text>
          <Text style={pdfStyles.value}>{data.projectedADC.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.sectionRow}>
          <Text style={pdfStyles.label}>Projected Revenue</Text>
          <Text style={pdfStyles.value}>${data.projectedRevenue.toFixed(2)}</Text>
        </View>

        {/* Expenses Section */}
        <View style={pdfStyles.sectionRow}>
          <Text style={pdfStyles.label}>EXPENSES</Text>
          <Text style={pdfStyles.value}></Text>
        </View>

        {/* Salaries & Wages */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Salaries & Wages</Text>
          <Text style={pdfStyles.value}>${data.salariesWages.toFixed(2)}</Text>
        </View>

        {/* Contracted Services */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Contracted Services</Text>
          <Text style={pdfStyles.value}>${data.contractedServices.toFixed(2)}</Text>
        </View>

        {/* Payroll Taxes */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Payroll Taxes (7%)</Text>
          <Text style={pdfStyles.value}>${data.payrollTaxes.toFixed(2)}</Text>
        </View>

        {/* Medical Supplies */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Medical Supplies</Text>
          <Text style={pdfStyles.value}>${data.medicalSupplies.toFixed(2)}</Text>
        </View>

        {/* DME */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>DME (Durable Medical Equipment)</Text>
          <Text style={pdfStyles.value}>${data.dme.toFixed(2)}</Text>
        </View>

        {/* Fixed Expenses */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Fixed Expenses</Text>
          <Text style={pdfStyles.value}></Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Rent/Office</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.rent.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Utilities</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.utilities.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Office Supplies</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.officeSupplies.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Insurance</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.insurance.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Software/EHR</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.software.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Other Overhead</Text>
          <Text style={pdfStyles.value}>${data.fixedExpenses.other.toFixed(2)}</Text>
        </View>

        {/* Billing Fees */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Billing Fees</Text>
          <Text style={pdfStyles.value}>${data.billingFees.toFixed(2)}</Text>
        </View>

        {/* Marketing */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Marketing ({data.socCount} SOC patients)</Text>
          <Text style={pdfStyles.value}>${data.marketing.toFixed(2)}</Text>
        </View>

        {/* Total Expenses */}
        <View style={pdfStyles.totalRow}>
          <Text style={pdfStyles.label}>TOTAL EXPENSES</Text>
          <Text style={pdfStyles.value}>${data.totalExpenses.toFixed(2)}</Text>
        </View>

        {/* Net Income */}
        <View style={pdfStyles.netIncomeRow}>
          <Text style={pdfStyles.label}>NET INCOME</Text>
          <Text style={pdfStyles.value}>${data.netIncome.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Module-level cached data
let patientList = [];
let employeeList = [];
let assignmentList = [];
let contractList = [];
let isPatientListDone = false;
let isEmployeeListDone = false;
let isAssignmentListDone = false;
let isContractListDone = false;

function OverheadForecast(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();

  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);

  const [forecastData, setForecastData] = useState(null);
  const [isProcessDone, setIsProcessDone] = useState(false);

  const currentMonthLabel = moment().format("MMMM YYYY");

  // Fetch patients on mount
  useEffect(() => {
    isPatientListDone = false;
    isEmployeeListDone = false;
    isAssignmentListDone = false;
    isContractListDone = false;

    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile.companyId,
      });
    }

    return () => {
      props.resetListPatients();
      props.resetListEmployees();
      props.resetListAssignments();
      props.resetListContracts();
    };
  }, []);

  // Gate: patients arrive → fetch employees
  if (
    isPatientCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    patientList = props.patients.data || [];
    isPatientListDone = true;
    props.resetListPatients();
    setIsPatientCollection(false);

    if (context.userProfile?.companyId) {
      props.listEmployees({
        companyId: context.userProfile.companyId,
      });
    }
  }

  // Gate: employees arrive → fetch assignments
  if (
    isEmployeeCollection &&
    props.employees?.status === ACTION_STATUSES.SUCCEED
  ) {
    employeeList = props.employees.data || [];
    isEmployeeListDone = true;
    props.resetListEmployees();
    setIsEmployeeCollection(false);

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
      isPatientListDone &&
      isEmployeeListDone &&
      isAssignmentListDone &&
      isContractListDone
    ) {
      const result = calculateOverheadForecast();
      setForecastData(result);
      setIsProcessDone(true);
    }
  }, [
    isPatientCollection,
    isEmployeeCollection,
    isAssignmentCollection,
    isContractCollection,
  ]);

  const calculateOverheadForecast = () => {
    const today = moment();
    const currentMonthStart = today.clone().startOf("month");
    const currentMonthEnd = today.clone().endOf("month");
    const daysInMonth = currentMonthEnd.date();

    // Filter active employees only
    const activeEmployees = employeeList.filter(
      (emp) => !emp.status || emp.status.toLowerCase() === "active"
    );

    // 1. Projected ADC (Average Daily Census) and Revenue
    let totalDaysForADC = 0; // For ADC: full month for EOC patients
    let totalRevenue = 0;
    let socCount = 0;
    let dmeTotalCost = 0;

    patientList.forEach((patient) => {
      if (!patient.soc) return;

      const socDate = moment(patient.soc);
      const eocDate = patient.eoc ? moment(patient.eoc) : null;

      // Skip patients not active in current month
      if (eocDate && eocDate.isBefore(currentMonthStart, "day")) return;
      if (socDate.isAfter(currentMonthEnd, "day")) return;

      // Get Medicare rates for this patient
      const rates = MedicareHandler.getRatesForLocation(
        patient.state,
        patient.county,
        patient.soc
      );

      // Calculate cumulative days BEFORE current month
      let cumulativeDays = 0;
      let iterMonth = socDate.clone().startOf("month");

      while (iterMonth.isBefore(currentMonthStart)) {
        const monthStart = iterMonth.clone();
        const monthEnd = iterMonth.clone().endOf("month");

        const effStart = moment.max(socDate, monthStart);
        const effEnd = eocDate ? moment.min(eocDate, monthEnd) : monthEnd;

        const days = effEnd.diff(effStart, "days") + 1;
        if (days > 0) cumulativeDays += days;

        iterMonth.add(1, "month");
      }

      // Current month: use actual days for revenue calculation
      const effStart = moment.max(socDate, currentMonthStart);
      const effEnd = eocDate ? moment.min(eocDate, currentMonthEnd) : currentMonthEnd;
      const actualDaysInMonth = effEnd.diff(effStart, "days") + 1;

      if (actualDaysInMonth > 0) {
        // Revenue: Use Medicare rates with cumulative days logic
        const claimBefore = parseFloat(
          MedicareHandler.calculateClaim(cumulativeDays, rates)
        );
        const claimAfter = parseFloat(
          MedicareHandler.calculateClaim(cumulativeDays + actualDaysInMonth, rates)
        );
        const monthRevenue = claimAfter - claimBefore;
        totalRevenue += monthRevenue;

        // ADC: Count full month for patients with EOC in current month
        // If patient has EOC in current month OR is active, count as full census
        const isEOCInCurrentMonth = eocDate &&
          eocDate.isSameOrAfter(currentMonthStart, "day") &&
          eocDate.isSameOrBefore(currentMonthEnd, "day");

        if (isEOCInCurrentMonth || !eocDate) {
          // Patient has EOC in current month or is still active: count full month for ADC
          totalDaysForADC += daysInMonth;
        } else {
          // Patient EOC before this month or SOC after this month (shouldn't reach here)
          totalDaysForADC += actualDaysInMonth;
        }

        // DME calculation: actual days × $4.75
        dmeTotalCost += actualDaysInMonth * OVERHEAD_CONSTANTS.DME_DAILY_RATE;
      }

      // Count SOC in current month
      if (
        socDate.isSameOrAfter(currentMonthStart, "day") &&
        socDate.isSameOrBefore(currentMonthEnd, "day")
      ) {
        socCount++;
      }
    });

    const projectedADC = totalDaysForADC / daysInMonth;
    const projectedRevenue = totalRevenue;

    // 3. Salaries & Wages
    const salariesWages = calculateSalariesWages(activeEmployees, contractList);

    // 4. Contracted Services
    const contractedServices = calculateContractedServices(
      patientList,
      assignmentList,
      contractList,
      activeEmployees,
      currentMonthStart,
      currentMonthEnd,
      daysInMonth
    );

    // 5. Payroll Taxes (7% of salaries)
    const payrollTaxes = salariesWages * OVERHEAD_CONSTANTS.PAYROLL_TAX_RATE;

    // 6. Medical Supplies
    const medicalSupplies = projectedADC * OVERHEAD_CONSTANTS.MEDICAL_SUPPLY_RATE;

    // 7. DME (calculated above)
    const dme = dmeTotalCost;

    // 8. Fixed Expenses
    const fixedExpenses = {
      rent: OVERHEAD_CONSTANTS.RENT_OFFICE,
      utilities: OVERHEAD_CONSTANTS.UTILITIES,
      officeSupplies: OVERHEAD_CONSTANTS.OFFICE_SUPPLIES,
      insurance: OVERHEAD_CONSTANTS.INSURANCE,
      software: OVERHEAD_CONSTANTS.SOFTWARE_EHR,
      other: OVERHEAD_CONSTANTS.OTHER_OVERHEAD,
    };
    const totalFixedExpenses = Object.values(fixedExpenses).reduce(
      (sum, val) => sum + val,
      0
    );

    // 9. Billing Fees (3% of revenue, minimum $500)
    const billingFeesCalc = projectedRevenue * OVERHEAD_CONSTANTS.BILLING_FEE_RATE;
    const billingFees = Math.max(billingFeesCalc, OVERHEAD_CONSTANTS.BILLING_FEE_MINIMUM);

    // 10. Marketing ($2,500 per SOC)
    const marketing = socCount * OVERHEAD_CONSTANTS.MARKETING_PER_SOC;

    // Total Expenses
    const totalExpenses =
      salariesWages +
      contractedServices +
      payrollTaxes +
      medicalSupplies +
      dme +
      totalFixedExpenses +
      billingFees +
      marketing;

    // Net Income
    const netIncome = projectedRevenue - totalExpenses;

    return {
      projectedADC,
      projectedRevenue,
      salariesWages,
      contractedServices,
      payrollTaxes,
      medicalSupplies,
      dme,
      fixedExpenses,
      totalFixedExpenses,
      billingFees,
      marketing,
      socCount,
      totalExpenses,
      netIncome,
    };
  };

  const calculateSalariesWages = (activeEmployees, contracts) => {
    let total = 0;

    activeEmployees.forEach((employee) => {
      const salaryContract = contracts.find(
        (c) =>
          c.employeeId?.toString() === employee.id?.toString() &&
          c.serviceRateType?.toLowerCase()?.includes("salaried")
      );

      if (salaryContract) {
        total += parseFloat(salaryContract.serviceRate || 0);
      }
    });

    return total;
  };

  const calculateContractedServices = (
    patients,
    assignments,
    contracts,
    activeEmployees,
    monthStart,
    monthEnd,
    daysInMonth
  ) => {
    let total = 0;

    const activeEmployeeIds = activeEmployees.map((emp) => emp.id?.toString());

    activeEmployees.forEach((employee) => {
      const employeeId = employee.id?.toString();

      // Skip if has salary contract
      const salaryContract = contracts.find(
        (c) =>
          c.employeeId?.toString() === employeeId &&
          c.serviceRateType?.toLowerCase()?.includes("salaried")
      );
      if (salaryContract) return;

      // Get assignments for this employee
      const employeeAssignments = assignments.filter(
        (a) => a.disciplineId?.toString() === employeeId
      );

      employeeAssignments.forEach((assignment) => {
        const patient = patients.find((p) => p.patientCd === assignment.patientCd);
        if (!patient || !patient.soc) return;

        const socDate = moment(patient.soc);
        const eocDate = patient.eoc ? moment(patient.eoc) : null;

        // Skip patients not active in current month
        if (eocDate && eocDate.isBefore(monthStart, "day")) return;
        if (socDate.isAfter(monthEnd, "day")) return;

        const effStart = moment.max(socDate, monthStart);
        const effEnd = eocDate ? moment.min(eocDate, monthEnd) : monthEnd;
        const daysInCurrentMonth = effEnd.diff(effStart, "days") + 1;
        if (daysInCurrentMonth <= 0) return;

        const freq = parseInt(assignment.frequencyVisit || 0);
        const visitType = (assignment.visitType || "").toLowerCase();

        if (freq <= 0) return;

        let visits = 0;
        if (visitType === "week") {
          visits = Math.ceil((daysInCurrentMonth / 7) * freq);
        } else if (visitType === "month") {
          visits = Math.ceil((daysInCurrentMonth / daysInMonth) * freq);
        }
        if (visits < 1) visits = 1;

        // Find contract rate
        let contract = contracts.find(
          (c) =>
            c.employeeId?.toString() === employeeId &&
            c.patientCd === patient.patientCd &&
            c.serviceType?.toLowerCase() === "regular visit"
        );
        if (!contract) {
          contract = contracts.find(
            (c) =>
              c.employeeId?.toString() === employeeId &&
              (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
              c.serviceType?.toLowerCase() === "regular visit"
          );
        }

        const rate = contract ? parseFloat(contract.serviceRate || 0) : 0;
        total += visits * rate;
      });
    });

    return total;
  };

  if (!isProcessDone) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 className={classes.cardTitleWhite}>
                      {currentMonthLabel} — Overhead Forecast
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      Monthly Overhead and Net Income Projection
                    </p>
                  </div>
                  <div>
                    {forecastData && (
                      <PDFDownloadLink
                        document={
                          <OverheadForecastPDF
                            data={forecastData}
                            currentMonthLabel={currentMonthLabel}
                          />
                        }
                        fileName={`Overhead_Forecast_${currentMonthLabel.replace(" ", "_")}.pdf`}
                        style={{ textDecoration: "none" }}
                      >
                        {({ loading }) => (
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "white",
                              color: "#1976d2",
                              fontWeight: "bold",
                            }}
                            startIcon={<GetApp />}
                            disabled={loading}
                          >
                            {loading ? "Generating..." : "Download PDF"}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "70%", fontWeight: "bold" }}>
                          Description
                        </TableCell>
                        <TableCell
                          style={{ width: "30%", fontWeight: "bold", textAlign: "right" }}
                        >
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Projected ADC */}
                      <TableRow className={classes.sectionHeader}>
                        <TableCell>Projected ADC (Average Daily Census)</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {forecastData.projectedADC.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Projected Revenue */}
                      <TableRow className={classes.sectionHeader}>
                        <TableCell>Projected Revenue</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.projectedRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Expenses Header */}
                      <TableRow className={classes.sectionHeader}>
                        <TableCell colSpan={2}>EXPENSES</TableCell>
                      </TableRow>

                      {/* Salaries & Wages */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Salaries & Wages</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.salariesWages.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Contracted Services */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Contracted Services</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.contractedServices.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Payroll Taxes */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          Payroll Taxes ({(OVERHEAD_CONSTANTS.PAYROLL_TAX_RATE * 100).toFixed(0)}%)
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.payrollTaxes.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Medical Supplies */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Medical Supplies</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.medicalSupplies.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* DME */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>DME (Durable Medical Equipment)</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.dme.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Fixed Expenses */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Fixed Expenses</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.totalFixedExpenses.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Rent/Office</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.rent.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Utilities</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.utilities.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Office Supplies</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.officeSupplies.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Insurance</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.insurance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Software/EHR</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.software.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Other Overhead</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.other.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Billing Fees */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Billing Fees</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.billingFees.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Marketing */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          Marketing ({forecastData.socCount} SOC patient{forecastData.socCount !== 1 ? "s" : ""})
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.marketing.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Total Expenses */}
                      <TableRow className={classes.totalRow}>
                        <TableCell>TOTAL EXPENSES</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.totalExpenses.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Net Income */}
                      <TableRow className={classes.netIncomeRow}>
                        <TableCell>NET INCOME</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.netIncome.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  assignments: assignmentListStateSelector(store),
  contracts: contractListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignments: () => dispatch(resetFetchAssignmentState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OverheadForecast);

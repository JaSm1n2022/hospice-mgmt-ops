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
  Tooltip,
} from "@material-ui/core";
import {
  GetApp,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Info,
} from "@material-ui/icons";
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

import { ACTION_STATUSES, getOverheadValue } from "utils/constants";
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
import {
  attemptToFetchOverhead,
  resetFetchOverheadState,
} from "store/actions/overheadAction";
import { overheadListStateSelector } from "store/selectors/overheadSelector";
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
          <Text style={pdfStyles.label}>
            Projected ADC (Average Daily Census)
          </Text>
          <Text style={pdfStyles.value}>{data.projectedADC.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.sectionRow}>
          <Text style={pdfStyles.label}>Projected Revenue</Text>
          <Text style={pdfStyles.value}>
            ${data.projectedRevenue.toFixed(2)}
          </Text>
        </View>
        {data.revenueDetails &&
          data.revenueDetails.map((detail, idx) => (
            <View key={`pdf-rev-${idx}`} style={pdfStyles.detailRow}>
              <Text style={pdfStyles.label}>
                {detail.patientName} ({detail.days} days)
              </Text>
              <Text style={pdfStyles.value}>${detail.revenue.toFixed(2)}</Text>
            </View>
          ))}

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
        {data.salariesDetails &&
          data.salariesDetails.map((detail, idx) => (
            <View key={`pdf-sal-${idx}`} style={pdfStyles.detailRow}>
              <Text style={pdfStyles.label}>
                {detail.employeeName} - {detail.position}
              </Text>
              <Text style={pdfStyles.value}>${detail.amount.toFixed(2)}</Text>
            </View>
          ))}

        {/* Contracted Services */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Contracted Services</Text>
          <Text style={pdfStyles.value}>
            ${data.contractedServices.toFixed(2)}
          </Text>
        </View>
        {data.contractedDetails &&
          data.contractedDetails.map((detail, idx) => (
            <View key={`pdf-con-${idx}`} style={pdfStyles.detailRow}>
              <Text style={pdfStyles.label}>
                {detail.employeeName} - {detail.position}
              </Text>
              <Text style={pdfStyles.value}>${detail.amount.toFixed(2)}</Text>
            </View>
          ))}

        {/* Payroll Taxes */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Payroll Taxes (7.6%)</Text>
          <Text style={pdfStyles.value}>${data.payrollTaxes.toFixed(2)}</Text>
        </View>

        {/* Medical Supplies */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Medical Supplies</Text>
          <Text style={pdfStyles.value}>
            ${data.medicalSupplies.toFixed(2)}
          </Text>
        </View>

        {/* Pharmacy */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Pharmacy</Text>
          <Text style={pdfStyles.value}>${data.pharmacy.toFixed(2)}</Text>
        </View>

        {/* DME */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>DME (Durable Medical Equipment)</Text>
          <Text style={pdfStyles.value}>${data.dme.toFixed(2)}</Text>
        </View>

        {/* On-Call Phone */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>
            On-Call Phone ($3/hr weekdays & $4/hr weekend)
          </Text>
          <Text style={pdfStyles.value}>${data.onCallPhone.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>
            Weekdays: {data.onCallWeekdayCount} days ÷ 5 × 75 hrs ={" "}
            {data.onCallWeekdayHours} hrs × $3/hr
          </Text>
          <Text style={pdfStyles.value}>
            ${data.onCallWeekdayCost.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>
            Weekends: {data.onCallWeekendCount} days ÷ 2 × 48 hrs ={" "}
            {data.onCallWeekendHours} hrs × $4/hr
          </Text>
          <Text style={pdfStyles.value}>
            ${data.onCallWeekendCost.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>
            Total Hours: {data.onCallTotalHours}
          </Text>
          <Text style={pdfStyles.value}></Text>
        </View>

        {/* Potential Admission */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Potential Admission</Text>
          <Text style={pdfStyles.value}>
            ${data.potentialAdmission.toFixed(2)}
          </Text>
        </View>

        {/* Transportation */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>
            Transportation ({data.socCount} SOC patients)
          </Text>
          <Text style={pdfStyles.value}>${data.transportation.toFixed(2)}</Text>
        </View>

        {/* Fixed Expenses */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>Fixed Expenses</Text>
          <Text style={pdfStyles.value}></Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Rent/Office</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.rent.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Utilities</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.utilities.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Office Supplies</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.officeSupplies.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Liability Insurance</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.liabilityInsurance.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Software/EHR</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.software.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Business Expenses</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.businessExpenses.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Communication Expense</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.communicationExpense.toFixed(2)}
          </Text>
        </View>
        <View style={pdfStyles.detailRow}>
          <Text style={pdfStyles.label}>Other Overhead</Text>
          <Text style={pdfStyles.value}>
            ${data.fixedExpenses.other.toFixed(2)}
          </Text>
        </View>

        {/* Billing Fees */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>
            Billing Fees (Hospice MD @ 3% of revenue)
          </Text>
          <Text style={pdfStyles.value}>${data.billingFees.toFixed(2)}</Text>
        </View>

        {/* Marketing */}
        <View style={pdfStyles.subsectionRow}>
          <Text style={pdfStyles.label}>
            Marketing ({data.socCount} SOC patients)
          </Text>
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
let overheadTableData = null;
let isPatientListDone = false;
let isEmployeeListDone = false;
let isAssignmentListDone = false;
let isContractListDone = false;
let isOverheadListDone = false;

function OverheadForecast(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();

  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);
  const [isOverheadCollection, setIsOverheadCollection] = useState(true);

  const [forecastData, setForecastData] = useState(null);
  const [isProcessDone, setIsProcessDone] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    revenue: false,
    salaries: false,
    contracted: false,
  });

  const currentMonthLabel = moment().format("MMMM YYYY");

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch patients and overhead on mount
  useEffect(() => {
    isPatientListDone = false;
    isEmployeeListDone = false;
    isAssignmentListDone = false;
    isContractListDone = false;
    isOverheadListDone = false;

    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile.companyId,
      });
      props.listOverhead({
        companyId: context.userProfile.companyId,
      });
    }

    return () => {
      console.log("[Are You resetting me]");
      props.resetListPatients();
      props.resetListEmployees();
      props.resetListAssignments();
      props.resetListContracts();
      props.resetListOverhead();
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

  // Gate: contracts arrive → ready for calculation (overhead loads independently)
  if (
    isContractCollection &&
    props.contracts?.status === ACTION_STATUSES.SUCCEED
  ) {
    contractList = props.contracts.data || [];
    isContractListDone = true;
    props.resetListContracts();
    setIsContractCollection(false);
  }

  // Gate: overhead data arrive (loads independently, doesn't block calculation)
  if (
    isOverheadCollection &&
    props.overhead?.status === ACTION_STATUSES.SUCCEED
  ) {
    const fetchedData = props.overhead.data || [];
    overheadTableData = fetchedData.length > 0 ? fetchedData[0] : null;
    isOverheadListDone = true;
    props.resetListOverhead();
    setIsOverheadCollection(false);
  }

  // Calculate once all datasets are ready (overhead is optional - will use defaults if not available)
  useEffect(() => {
    if (
      isPatientListDone &&
      isEmployeeListDone &&
      isAssignmentListDone &&
      isContractListDone &&
      isOverheadListDone
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
    isOverheadCollection,
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
    const revenueDetails = []; // Store per-patient revenue details

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
      const effEnd = eocDate
        ? moment.min(eocDate, currentMonthEnd)
        : currentMonthEnd;
      const actualDaysInMonth = effEnd.diff(effStart, "days") + 1;

      if (actualDaysInMonth > 0) {
        // Revenue: Use Medicare rates with cumulative days logic
        const claimBefore = parseFloat(
          MedicareHandler.calculateClaim(cumulativeDays, rates)
        );
        const claimAfter = parseFloat(
          MedicareHandler.calculateClaim(
            cumulativeDays + actualDaysInMonth,
            rates
          )
        );
        const monthRevenue = claimAfter - claimBefore;
        totalRevenue += monthRevenue;

        // Store revenue detail for this patient
        revenueDetails.push({
          patientCd: patient.patientCd,
          patientName: patient.name || patient.patientCd,
          days: actualDaysInMonth,
          revenue: monthRevenue,
          status: patient.status || "Active",
        });

        // ADC: Count full month for patients with EOC in current month
        // If patient has EOC in current month OR is active, count as full census
        const isEOCInCurrentMonth =
          eocDate &&
          eocDate.isSameOrAfter(currentMonthStart, "day") &&
          eocDate.isSameOrBefore(currentMonthEnd, "day");

        if (isEOCInCurrentMonth || !eocDate) {
          // Patient has EOC in current month or is still active: count full month for ADC
          totalDaysForADC += daysInMonth;
        } else {
          // Patient EOC before this month or SOC after this month (shouldn't reach here)
          totalDaysForADC += actualDaysInMonth;
        }

        // DME calculation: actual days × DME_DAILY_RATE
        dmeTotalCost +=
          actualDaysInMonth *
          getOverheadValue("DME_DAILY_RATE", overheadTableData);
      }

      // Count SOC in current month
      if (
        socDate.isSameOrAfter(currentMonthStart, "day") &&
        socDate.isSameOrBefore(currentMonthEnd, "day")
      ) {
        socCount++;
      }
    });

    // Sort revenue details by revenue descending
    revenueDetails.sort((a, b) => b.revenue - a.revenue);

    const projectedADC = totalDaysForADC / daysInMonth;
    const projectedRevenue = totalRevenue;

    // 3. Salaries & Wages
    const salariesData = calculateSalariesWages(activeEmployees, contractList);
    const salariesWages = salariesData.total;
    const salariesDetails = salariesData.details;

    // 4. Contracted Services
    const contractedData = calculateContractedServices(
      patientList,
      assignmentList,
      contractList,
      activeEmployees,
      currentMonthStart,
      currentMonthEnd,
      daysInMonth
    );
    const contractedServices = contractedData.total;
    const contractedDetails = contractedData.details;

    // 5. Payroll Taxes
    const payrollTaxes =
      salariesWages * getOverheadValue("PAYROLL_TAX_RATE", overheadTableData);

    // 6. Medical Supplies
    const medicalSupplies =
      projectedADC * getOverheadValue("MEDICAL_SUPPLY_RATE", overheadTableData);

    // 7. Pharmacy
    const pharmacy =
      projectedADC * getOverheadValue("PHARMACY_RATE", overheadTableData);

    // 8. DME (calculated above)
    const dme = dmeTotalCost;

    // 9. On-Call Phone
    // Count weekdays and weekend days in current month
    let weekdayCount = 0;
    let weekendCount = 0;
    const daysIterator = currentMonthStart.clone();
    while (daysIterator.isSameOrBefore(currentMonthEnd, "day")) {
      const dayOfWeek = daysIterator.day(); // 0=Sunday, 6=Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      } else {
        weekdayCount++;
      }
      daysIterator.add(1, "day");
    }
    // Weekdays: divide by 5 (days in a week) then multiply by ONCALL_WEEKDAY_HOURS
    const numberOfWeeks = weekdayCount / 5;
    const onCallWeekdayHours =
      numberOfWeeks *
      getOverheadValue("ONCALL_WEEKDAY_HOURS", overheadTableData);
    const onCallWeekdayCost =
      onCallWeekdayHours *
      getOverheadValue("ONCALL_WEEKDAY_RATE", overheadTableData);
    // Weekends: divide by 2 (days in a weekend) then multiply by ONCALL_WEEKEND_HOURS
    const numberOfWeekends = weekendCount / 2;
    const onCallWeekendHours =
      numberOfWeekends *
      getOverheadValue("ONCALL_WEEKEND_HOURS", overheadTableData);
    const onCallWeekendCost =
      onCallWeekendHours *
      getOverheadValue("ONCALL_WEEKEND_RATE", overheadTableData);
    const onCallTotalHours = onCallWeekdayHours + onCallWeekendHours;
    const onCallPhone = onCallWeekdayCost + onCallWeekendCost;

    // 10. Potential Admission
    const potentialAdmission = getOverheadValue(
      "POTENTIAL_ADMISSION",
      overheadTableData
    );

    // 11. Transportation (per SOC)
    const transportation =
      socCount * getOverheadValue("TRANSPORTATION_PER_SOC", overheadTableData);

    // 12. Fixed Expenses
    const fixedExpenses = {
      rent: getOverheadValue("RENT_OFFICE", overheadTableData),
      utilities: getOverheadValue("UTILITIES", overheadTableData),
      officeSupplies: getOverheadValue("OFFICE_SUPPLIES", overheadTableData),
      liabilityInsurance: getOverheadValue(
        "LIABILITY_INSURANCE",
        overheadTableData
      ),
      software: getOverheadValue("SOFTWARE_EHR", overheadTableData),
      businessExpenses: getOverheadValue(
        "BUSINESS_EXPENSES",
        overheadTableData
      ),
      communicationExpense: getOverheadValue(
        "COMMUNICATION_EXPENSE",
        overheadTableData
      ),
      other: getOverheadValue("OTHER_OVERHEAD", overheadTableData),
    };
    const totalFixedExpenses = Object.values(fixedExpenses).reduce(
      (sum, val) => sum + val,
      0
    );

    // 13. Billing Fees (percentage of revenue, with minimum)
    const billingFeesCalc =
      projectedRevenue *
      getOverheadValue("BILLING_FEE_RATE", overheadTableData);
    const billingFees = Math.max(
      billingFeesCalc,
      getOverheadValue("BILLING_FEE_MINIMUM", overheadTableData)
    );

    // 14. Marketing (per SOC)
    const marketing =
      socCount * getOverheadValue("MARKETING_PER_SOC", overheadTableData);

    // Total Expenses
    const totalExpenses =
      salariesWages +
      contractedServices +
      payrollTaxes +
      medicalSupplies +
      pharmacy +
      dme +
      onCallPhone +
      potentialAdmission +
      transportation +
      totalFixedExpenses +
      billingFees +
      marketing;

    // Net Income
    const netIncome = projectedRevenue - totalExpenses;

    return {
      projectedADC,
      projectedRevenue,
      revenueDetails,
      salariesWages,
      salariesDetails,
      contractedServices,
      contractedDetails,
      payrollTaxes,
      medicalSupplies,
      pharmacy,
      dme,
      onCallPhone,
      onCallWeekdayCount: weekdayCount,
      onCallWeekendCount: weekendCount,
      onCallWeekdayHours,
      onCallWeekendHours,
      onCallWeekdayCost,
      onCallWeekendCost,
      onCallTotalHours,
      potentialAdmission,
      transportation,
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
    const details = [];

    activeEmployees.forEach((employee) => {
      const salaryContract = contracts.find(
        (c) =>
          c.employeeId?.toString() === employee.id?.toString() &&
          c.serviceRateType?.toLowerCase()?.includes("salaried")
      );

      if (salaryContract) {
        const amount = parseFloat(salaryContract.serviceRate || 0);
        total += amount;

        details.push({
          employeeName:
            employee.name || `${employee.fn || ""} ${employee.ln || ""}`.trim(),
          position: employee.position || "N/A",
          amount: amount,
        });
      }
    });

    // Sort by amount descending
    details.sort((a, b) => b.amount - a.amount);

    return { total, details };
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
    const details = [];

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

      let employeeTotal = 0;

      // 1. REGULAR VISITS
      const employeeAssignments = assignments.filter(
        (a) => a.disciplineId?.toString() === employeeId
      );

      employeeAssignments.forEach((assignment) => {
        const patient = patients.find(
          (p) => p.patientCd === assignment.patientCd
        );
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

        // Find contract rate for regular visits
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
        const amount = visits * rate;
        employeeTotal += amount;
      });

      // 2. SOC VISITS
      // Check if employee has SOC patients in current month
      const socPatients = patients.filter((p) => {
        if (!p.soc) return false;
        const socDate = moment(p.soc);
        return (
          socDate.isSameOrAfter(monthStart, "day") &&
          socDate.isSameOrBefore(monthEnd, "day")
        );
      });

      socPatients.forEach((patient) => {
        // Check if this employee is assigned to this patient
        const hasAssignment = employeeAssignments.find(
          (a) => a.patientCd === patient.patientCd
        );

        if (hasAssignment) {
          // Find SOC contract rate
          let socContract = contracts.find(
            (c) =>
              c.employeeId?.toString() === employeeId &&
              c.patientCd === patient.patientCd &&
              (c.serviceType?.toLowerCase()?.includes("soc") ||
                c.serviceType?.toLowerCase()?.includes("start of care"))
          );
          if (!socContract) {
            socContract = contracts.find(
              (c) =>
                c.employeeId?.toString() === employeeId &&
                (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
                (c.serviceType?.toLowerCase()?.includes("soc") ||
                  c.serviceType?.toLowerCase()?.includes("start of care"))
            );
          }

          if (socContract) {
            const socRate = parseFloat(socContract.serviceRate || 0);
            employeeTotal += socRate;
          }
        }
      });

      // 3. IDT MEETINGS
      // Check if employee can do IDT (based on position)
      const canDoIDT =
        employee.position?.toLowerCase()?.includes("nurse") ||
        employee.position?.toLowerCase() === "case manager" ||
        employee.position?.toLowerCase() === "social worker" ||
        employee.position?.toLowerCase() === "msw" ||
        employee.position?.toLowerCase() === "chaplain" ||
        employee.position?.toLowerCase() === "director of nurse";

      if (canDoIDT) {
        // Find IDT Meeting via Person contract (not patient-specific)
        let idtContract = contracts.find(
          (c) =>
            c.employeeId?.toString() === employeeId &&
            c.serviceType?.toLowerCase()?.includes("idt meeting") &&
            (c.serviceType?.toLowerCase()?.includes("person") ||
              c.serviceType?.toLowerCase()?.includes("in person")) &&
            (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL")
        );

        if (idtContract) {
          const idtRate = parseFloat(idtContract.serviceRate || 0);
          // Fixed IDT: 4 meetings per month
          employeeTotal += idtRate * 4;
        }
      }

      if (employeeTotal > 0) {
        details.push({
          employeeName:
            employee.name || `${employee.fn || ""} ${employee.ln || ""}`.trim(),
          position: employee.position || "N/A",
          amount: employeeTotal,
        });
      }

      total += employeeTotal;
    });

    // Sort by amount descending
    details.sort((a, b) => b.amount - a.amount);

    return { total, details };
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
                        fileName={`Overhead_Forecast_${currentMonthLabel.replace(
                          " ",
                          "_"
                        )}.pdf`}
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
                <TableContainer
                  component={Paper}
                  className={classes.tableContainer}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "70%", fontWeight: "bold" }}>
                          Description
                        </TableCell>
                        <TableCell
                          style={{
                            width: "30%",
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Projected ADC */}
                      <TableRow className={classes.sectionHeader}>
                        <TableCell>
                          Projected ADC (Average Daily Census)
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {forecastData.projectedADC.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Projected Revenue */}
                      <TableRow
                        className={classes.sectionHeader}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSection("revenue")}
                      >
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {expandedSections.revenue ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                            <span style={{ marginLeft: 8 }}>
                              Projected Revenue
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.projectedRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {expandedSections.revenue &&
                        forecastData.revenueDetails.map((detail, idx) => (
                          <TableRow
                            key={`revenue-${idx}`}
                            className={classes.detailRow}
                          >
                            <TableCell>
                              {detail.patientName} ({detail.days} days)
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              ${detail.revenue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}

                      {/* Expenses Header */}
                      <TableRow className={classes.sectionHeader}>
                        <TableCell colSpan={2}>EXPENSES</TableCell>
                      </TableRow>

                      {/* Salaries & Wages */}
                      <TableRow
                        className={classes.subsectionHeader}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSection("salaries")}
                      >
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {expandedSections.salaries ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                            <span style={{ marginLeft: 8 }}>
                              Salaries & Wages
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.salariesWages.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {expandedSections.salaries &&
                        forecastData.salariesDetails.map((detail, idx) => (
                          <TableRow
                            key={`salary-${idx}`}
                            className={classes.detailRow}
                          >
                            <TableCell style={{ paddingLeft: "70px" }}>
                              {detail.employeeName} - {detail.position}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              ${detail.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}

                      {/* Contracted Services */}
                      <TableRow
                        className={classes.subsectionHeader}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSection("contracted")}
                      >
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {expandedSections.contracted ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                            <span style={{ marginLeft: 8 }}>
                              Contracted Services
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.contractedServices.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {expandedSections.contracted &&
                        forecastData.contractedDetails.map((detail, idx) => (
                          <TableRow
                            key={`contracted-${idx}`}
                            className={classes.detailRow}
                          >
                            <TableCell style={{ paddingLeft: "70px" }}>
                              {detail.employeeName} - {detail.position}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              ${detail.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}

                      {/* Payroll Taxes */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          Payroll Taxes (
                          {(
                            getOverheadValue(
                              "PAYROLL_TAX_RATE",
                              overheadTableData
                            ) * 100
                          ).toFixed(1)}
                          %)
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

                      {/* Pharmacy */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>Pharmacy</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.pharmacy.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* DME */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          DME (Durable Medical Equipment) @ $
                          {getOverheadValue(
                            "DME_DAILY_RATE",
                            overheadTableData
                          )}
                          /daily
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.dme.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* On-Call Phone */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          On-Call Phone ($
                          {getOverheadValue(
                            "ONCALL_WEEKDAY_RATE",
                            overheadTableData
                          )}
                          /hr weekdays & $
                          {getOverheadValue(
                            "ONCALL_WEEKEND_RATE",
                            overheadTableData
                          )}
                          /hr weekend)
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.onCallPhone.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>
                          Weekdays: {forecastData.onCallWeekdayCount} days ÷ 5 ×{" "}
                          {getOverheadValue(
                            "ONCALL_WEEKDAY_HOURS",
                            overheadTableData
                          )}{" "}
                          hrs = {forecastData.onCallWeekdayHours} hrs × $
                          {getOverheadValue(
                            "ONCALL_WEEKDAY_RATE",
                            overheadTableData
                          )}
                          /hr
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.onCallWeekdayCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>
                          Weekends: {forecastData.onCallWeekendCount} days ÷ 2 ×{" "}
                          {getOverheadValue(
                            "ONCALL_WEEKEND_HOURS",
                            overheadTableData
                          )}{" "}
                          hrs = {forecastData.onCallWeekendHours} hrs × $
                          {getOverheadValue(
                            "ONCALL_WEEKEND_RATE",
                            overheadTableData
                          )}
                          /hr
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.onCallWeekendCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>
                          Total Hours: {forecastData.onCallTotalHours}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}></TableCell>
                      </TableRow>

                      {/* Potential Admission */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            Potential Admission
                            <Tooltip
                              title="A patient that were not admitted but services were done (e.g. NP evaluation, nurse admission, supplies, DME, etc)"
                              placement="top"
                              arrow
                            >
                              <Info
                                style={{
                                  fontSize: "18px",
                                  color: "#666",
                                  cursor: "help",
                                }}
                              />
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.potentialAdmission.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Transportation */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          Transportation ({forecastData.socCount} SOC patient
                          {forecastData.socCount !== 1 ? "s" : ""})
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.transportation.toFixed(2)}
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
                          $
                          {forecastData.fixedExpenses.officeSupplies.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Liability Insurance</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          $
                          {forecastData.fixedExpenses.liabilityInsurance.toFixed(
                            2
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>
                          Software/EHR (include E-Prescibe MD,etc)
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.fixedExpenses.software.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Business Expenses</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          $
                          {forecastData.fixedExpenses.businessExpenses.toFixed(
                            2
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className={classes.detailRow}>
                        <TableCell>Communication Expense</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          $
                          {forecastData.fixedExpenses.communicationExpense.toFixed(
                            2
                          )}
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
                        <TableCell>
                          Billing Fees (Hospice MD @ 3% of revenue)
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${forecastData.billingFees.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Marketing */}
                      <TableRow className={classes.subsectionHeader}>
                        <TableCell>
                          Marketing ({forecastData.socCount} SOC patient
                          {forecastData.socCount !== 1 ? "s" : ""})
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
  overhead: overheadListStateSelector(store),
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
  listOverhead: (data) => dispatch(attemptToFetchOverhead(data)),
  resetListOverhead: () => dispatch(resetFetchOverheadState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OverheadForecast);

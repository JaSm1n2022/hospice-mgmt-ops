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
import {
  attemptToFetchEmployee,
  resetFetchEmployeeState,
} from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
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
};

const useStyles = makeStyles(styles);

// Hardcoded expense constants (to be enhanced later with actual values)
const EXPENSE_CONSTANTS = {
  // SOC Expenses
  SOC_TRANSPORTATION: 165,

  // Regular Monthly Expenses (per patient)
  DME: 200,
  PHARMACY: 200,
  SUPPLIES: 300,
  DEATH_PRONOUNCEMENT: 120, // Default rate if no contract found
};

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
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  note: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  patientSection: {
    marginBottom: 15,
    borderBottom: "1 solid #ddd",
    paddingBottom: 10,
  },
  patientHeader: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#667eea",
    color: "white",
    padding: 5,
  },
  patientInfo: {
    fontSize: 9,
    marginBottom: 3,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    paddingLeft: 15,
    color: "#667eea",
  },
  detailRow: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingVertical: 2,
    fontSize: 9,
  },
  detailLabel: {
    width: "50%",
  },
  detailValue: {
    width: "20%",
    textAlign: "right",
  },
  detailAmount: {
    width: "30%",
    textAlign: "right",
  },
  socDetailRow: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingVertical: 2,
    fontSize: 9,
    fontStyle: "italic",
    color: "#e65100",
  },
  totalRow: {
    flexDirection: "row",
    marginTop: 5,
    paddingVertical: 3,
    paddingLeft: 10,
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  grandTotalSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#667eea",
    color: "white",
  },
  grandTotalRow: {
    flexDirection: "row",
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 2,
  },
  grandTotalLabel: {
    width: "70%",
  },
  grandTotalValue: {
    width: "30%",
    textAlign: "right",
  },
});

// PDF Document Component
const ExpensesForecastPDF = ({ data, currentMonthLabel }) => {
  const totalRegular = data.reduce((sum, r) => sum + r.regularExpenses, 0);
  const totalSOC = data.reduce((sum, r) => sum + r.socExpenses, 0);
  const grandTotal = totalRegular + totalSOC;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>
          {currentMonthLabel} — Expenses Client Forecast
        </Text>
        <Text style={pdfStyles.subHeader}>Census: {data.length} patients</Text>
        <Text style={pdfStyles.note}>
          Note: Forecast visits and expenses are calculated based on Days of
          Care. For active patients, Days of Care equals the full month. For
          discharged patients (with EOC), Days of Care is from SOC (or month
          start) to EOC date.
        </Text>

        {data.map((patient, idx) => (
          <View key={idx} style={pdfStyles.patientSection} wrap={false}>
            <Text style={pdfStyles.patientHeader}>
              {patient.patientName} ({patient.patientCd})
            </Text>
            <View style={pdfStyles.patientInfo}>
              <Text>Status: {patient.status}</Text>
              <Text>
                SOC: {patient.soc} | EOC: {patient.eoc}
              </Text>
              <Text>Days of Care: {patient.daysInCurrentMonth}</Text>
            </View>

            {/* Regular Expenses */}
            {patient.regularDetails.length > 0 && (
              <View>
                <Text style={pdfStyles.sectionTitle}>
                  Regular Visit Details
                </Text>
                {patient.regularDetails.map((detail, dIdx) => (
                  <View key={dIdx} style={pdfStyles.detailRow}>
                    <Text style={pdfStyles.detailLabel}>
                      {detail.disciplineName}
                      {detail.frequencyVisit !== "—" &&
                        ` (${detail.frequencyVisit}x/${detail.visitType})`}
                    </Text>
                    <Text style={pdfStyles.detailValue}>
                      {detail.visits !== "—" ? `${detail.visits} visits` : "—"}
                    </Text>
                    <Text style={pdfStyles.detailAmount}>
                      ${parseFloat(detail.amount).toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View style={pdfStyles.totalRow}>
                  <Text style={{ width: "70%" }}>Regular Expenses Total</Text>
                  <Text style={{ width: "30%", textAlign: "right" }}>
                    ${parseFloat(patient.regularExpenses).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* SOC Expenses */}
            {patient.socInCurrentMonth && patient.socDetails.length > 0 && (
              <View>
                <Text style={pdfStyles.sectionTitle}>
                  SOC Expenses (SOC in current month)
                </Text>
                {patient.socDetails.map((detail, dIdx) => (
                  <View key={dIdx} style={pdfStyles.socDetailRow}>
                    <Text style={pdfStyles.detailLabel}>
                      {detail.label} (x{detail.qty})
                    </Text>
                    <Text style={pdfStyles.detailValue}>
                      @ ${parseFloat(detail.rate).toFixed(2)}
                    </Text>
                    <Text style={pdfStyles.detailAmount}>
                      ${parseFloat(detail.amount).toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View style={pdfStyles.totalRow}>
                  <Text style={{ width: "70%" }}>SOC Expenses Total</Text>
                  <Text style={{ width: "30%", textAlign: "right" }}>
                    ${parseFloat(patient.socExpenses).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* Patient Total */}
            <View
              style={[
                pdfStyles.totalRow,
                { backgroundColor: "#667eea", color: "white" },
              ]}
            >
              <Text style={{ width: "70%" }}>Patient Total Expenses</Text>
              <Text style={{ width: "30%", textAlign: "right" }}>
                ${parseFloat(patient.totalExpenses).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {/* Grand Total Section */}
        <View style={pdfStyles.grandTotalSection}>
          <View style={pdfStyles.grandTotalRow}>
            <Text style={pdfStyles.grandTotalLabel}>
              Total Regular Expenses
            </Text>
            <Text style={pdfStyles.grandTotalValue}>
              ${parseFloat(totalRegular).toFixed(2)}
            </Text>
          </View>
          <View style={pdfStyles.grandTotalRow}>
            <Text style={pdfStyles.grandTotalLabel}>Total SOC Expenses</Text>
            <Text style={pdfStyles.grandTotalValue}>
              ${parseFloat(totalSOC).toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              pdfStyles.grandTotalRow,
              { borderTop: "1 solid white", marginTop: 5, paddingTop: 5 },
            ]}
          >
            <Text style={pdfStyles.grandTotalLabel}>GRAND TOTAL</Text>
            <Text style={pdfStyles.grandTotalValue}>
              ${parseFloat(grandTotal).toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

let isPatientListDone = false;
let isAssignmentListDone = false;
let isContractListDone = false;
let isEmployeeListDone = false;
let patientList = [];
let assignmentList = [];
let contractList = [];
let employeeList = [];

function ExpensesClientForecast(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();

  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);

  const [forecastData, setForecastData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isProcessDone, setIsProcessDone] = useState(false);

  // Fetch patients on mount
  useEffect(() => {
    isPatientListDone = false;
    isAssignmentListDone = false;
    isContractListDone = false;
    isEmployeeListDone = false;
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile.companyId,
      });
    }
    return () => {
      props.resetListPatients();
      props.resetListAssignments();
      props.resetListContracts();
      props.resetListEmployees();
    };
  }, []);

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
    props.assignmentState?.status === ACTION_STATUSES.SUCCEED
  ) {
    assignmentList = props.assignmentState.data || [];
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

  // Gate: contracts arrive → fetch employees
  if (
    isContractCollection &&
    props.contracts?.status === ACTION_STATUSES.SUCCEED
  ) {
    contractList = props.contracts.data || [];
    isContractListDone = true;
    props.resetListContracts();
    setIsContractCollection(false);

    // Trigger employee fetch
    if (context.userProfile?.companyId) {
      props.listEmployees({
        companyId: context.userProfile.companyId,
      });
    }
  }

  // Gate: employees arrive → calculate forecast
  if (
    isEmployeeCollection &&
    props.employees?.status === ACTION_STATUSES.SUCCEED
  ) {
    employeeList = props.employees.data || [];
    isEmployeeListDone = true;
    props.resetListEmployees();
    setIsEmployeeCollection(false);
  }

  // Calculate once all four datasets are ready
  useEffect(() => {
    if (
      isPatientListDone &&
      isAssignmentListDone &&
      isContractListDone &&
      isEmployeeListDone
    ) {
      const result = calculateExpensesForecast();
      setForecastData(result);
      setIsProcessDone(true);
    }
  }, [
    isPatientCollection,
    isAssignmentCollection,
    isContractCollection,
    isEmployeeCollection,
  ]);

  const calculateExpensesForecast = () => {
    const today = moment();
    const currentMonthStart = today.clone().startOf("month");
    const currentMonthEnd = today.clone().endOf("month");
    const daysInMonth = currentMonthEnd.date();

    const results = [];

    patientList.forEach((patient) => {
      if (!patient.soc) return;

      const socDate = moment(patient.soc);
      const eocDate = patient.eoc ? moment(patient.eoc) : null;

      // Skip patients not active in the current month
      if (eocDate && eocDate.isBefore(currentMonthStart, "day")) return;
      if (socDate.isAfter(currentMonthEnd, "day")) return;

      // Effective start/end in current month for Days of Care
      // If EOC exists: use EOC (capped at month end)
      // If no EOC (active): use full month end for forecast
      const effStart = moment.max(socDate, currentMonthStart);
      const effEnd = eocDate
        ? moment.min(eocDate, currentMonthEnd)
        : currentMonthEnd;
      const daysInCurrentMonth = effEnd.diff(effStart, "days") + 1;
      if (daysInCurrentMonth <= 0) return;

      // --- Regular Visit Expenses ---
      // Filter assignments for this patient AND only include active employees
      const patientAssignments = assignmentList.filter((a) => {
        if (a.patientCd !== patient.patientCd) return false;

        // Check if the employee assigned to this assignment is active
        const employee = employeeList.find(
          (emp) => emp.id?.toString() === a.disciplineId?.toString()
        );

        // Only include if employee exists and is active (or status is not set, for backward compatibility)
        return (
          employee &&
          (!employee.status || employee.status.toLowerCase() === "active")
        );
      });

      let regularExpenses = 0;
      const regularDetails = [];

      patientAssignments.forEach((assignment) => {
        const freq = parseInt(assignment.frequencyVisit || 0);
        const visitType = (assignment.visitType || "").toLowerCase();

        if (freq <= 0) return;

        // Calculate number of visits based on patient's days of care
        // If EOC: use actual days (SOC to EOC)
        // If active: use full month days
        // Round to ceiling, minimum 1 visit
        let visits = 0;
        if (visitType === "week") {
          visits = Math.ceil((daysInCurrentMonth / 7) * freq);
        } else if (visitType === "month") {
          visits = Math.ceil((daysInCurrentMonth / daysInMonth) * freq);
        }
        // Ensure at least 1 visit if assignment exists
        if (visits < 1) {
          visits = 1;
        }

        // Find matching contract rate: first try patient-specific, then fallback to company-wide (empty patientCd)
        let contract = contractList.find(
          (c) =>
            c.employeeId?.toString() === assignment.disciplineId?.toString() &&
            c.patientCd === patient.patientCd &&
            c.serviceType?.toLowerCase() === "regular visit"
        );
        if (!contract) {
          contract = contractList.find(
            (c) =>
              c.employeeId?.toString() ===
                assignment.disciplineId?.toString() &&
              (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
              c.serviceType?.toLowerCase() === "regular visit"
          );
        }

        const rate = contract ? parseFloat(contract.serviceRate || 0) : 0;
        const amount = visits * rate;
        regularExpenses += amount;

        regularDetails.push({
          disciplineName: assignment.disciplineName || "N/A",
          frequencyVisit: assignment.frequencyVisit,
          visitType: assignment.visitType,
          visits: visits,
          rate: rate,
          amount: amount,
        });
      });

      // Add fixed monthly expenses (DME, Pharmacy, Supplies)
      regularExpenses += EXPENSE_CONSTANTS.DME;
      regularExpenses += EXPENSE_CONSTANTS.PHARMACY;
      regularExpenses += EXPENSE_CONSTANTS.SUPPLIES;

      regularDetails.push({
        disciplineName: "DME (Equipment)",
        frequencyVisit: "—",
        visitType: "—",
        visits: "—",
        rate: EXPENSE_CONSTANTS.DME,
        amount: EXPENSE_CONSTANTS.DME,
      });
      regularDetails.push({
        disciplineName: "Pharmacy",
        frequencyVisit: "—",
        visitType: "—",
        visits: "—",
        rate: EXPENSE_CONSTANTS.PHARMACY,
        amount: EXPENSE_CONSTANTS.PHARMACY,
      });
      regularDetails.push({
        disciplineName: "Supplies",
        frequencyVisit: "—",
        visitType: "—",
        visits: "—",
        rate: EXPENSE_CONSTANTS.SUPPLIES,
        amount: EXPENSE_CONSTANTS.SUPPLIES,
      });

      // Add Death Pronouncement if patient has EOC (discharged)
      if (eocDate) {
        // Look for nurse contract with "Death Pronouncement" service type
        let deathPronouncementContract = contractList.find(
          (c) =>
            c.patientCd === patient.patientCd &&
            c.serviceType?.toLowerCase() === "death pronouncement"
        );
        if (!deathPronouncementContract) {
          deathPronouncementContract = contractList.find(
            (c) =>
              (!c.patientCd || c.patientCd === "" || c.patientCd === "ALL") &&
              c.serviceType?.toLowerCase() === "death pronouncement"
          );
        }

        const deathPronouncementRate = deathPronouncementContract
          ? parseFloat(deathPronouncementContract.serviceRate || 0)
          : EXPENSE_CONSTANTS.DEATH_PRONOUNCEMENT;

        regularExpenses += deathPronouncementRate;
        regularDetails.push({
          disciplineName: "Death Pronouncement",
          frequencyVisit: "—",
          visitType: "—",
          visits: "—",
          rate: deathPronouncementRate,
          amount: deathPronouncementRate,
        });
      }

      // --- SOC Expenses ---
      let socExpenses = 0;
      const socDetails = [];

      // SOC is in current month if the patient's SOC date falls within this month
      const socInCurrentMonth =
        socDate.isSameOrAfter(currentMonthStart, "day") &&
        socDate.isSameOrBefore(currentMonthEnd, "day");

      if (socInCurrentMonth) {
        // SOC visit types and their quantities:
        // HUV x 2, SFV x 2, SOC Assessment (Nurse, MSW, Chaplain) x 1 each, NP Evaluation x 1
        const socVisitTypes = [
          { label: "HUV", qty: 2 },
          { label: "SFV", qty: 2 },
          { label: "SOC Assessment - Nurse", qty: 1 },
          { label: "SOC Assessment - MSW", qty: 1 },
          { label: "SOC Assessment - Chaplain", qty: 1 },
          { label: "NP Evaluation", qty: 1 },
        ];

        // Map SOC labels to serviceType or serviceCd to look up contract rates
        const socServiceMapping = [
          {
            label: "HUV",
            serviceCd: "HUV",
            roles: ["Registered Nurse", "DON", "Case Manager"],
          },
          {
            label: "SFV",
            serviceCd: "SFV",
            roles: ["LPN", "Registered Nurse", "DON", "Case Manager"],
          },
          {
            label: "SOC Assessment - Nurse",
            serviceType: "SOC/Assessment",
            roles: ["Admission Nurse"],
          },
          {
            label: "SOC Assessment - MSW",
            serviceType: "SOC/Assessment",
            roles: ["MSW"],
          },
          {
            label: "SOC Assessment - Chaplain",
            serviceType: "SOC/Assessment",
            roles: ["Chaplain"],
          },
          {
            label: "NP Evaluation",
            serviceType: "Evaluation Visit",
            roles: ["NP", "Nurse Practitioner"],
          },
        ];
        console.log("[patient Assignments]", patientAssignments, employeeList);
        socVisitTypes.forEach((soc) => {
          // Find a matching assignment/employee for this SOC visit type
          const matchingAssignment = patientAssignments.find((assignment) => {
            const employee = employeeList.find(
              (emp) =>
                emp.id?.toString() === assignment.disciplineId?.toString()
            );
            console.log("[EMPLOYEE]", employee);
            if (!employee || !assignment.disciplinePosition) return false;

            // Find mapping that matches this SOC visit label and has roles that include the assignment's discipline position
            const mapping = socServiceMapping.find(
              (m) =>
                m.label === soc.label &&
                m.roles.some(
                  (role) =>
                    role.toLowerCase() === assignment.disciplinePosition.toLowerCase()
                )
            );

            return !!mapping;
          });

          // If we found a matching assignment, use its discipline position to find the mapping
          let mapping = null;
          console.log("[matching Assignments]", matchingAssignment);
          if (matchingAssignment) {
            const employee = employeeList.find(
              (emp) =>
                emp.id?.toString() ===
                matchingAssignment.disciplineId?.toString()
            );

            mapping = socServiceMapping.find(
              (m) =>
                m.label === soc.label &&
                m.roles.some(
                  (role) =>
                    role.toLowerCase() === matchingAssignment.disciplinePosition?.toLowerCase()
                )
            );
          }

          // Fallback: if no matching assignment found, just use label matching
          if (!mapping) {
            mapping = socServiceMapping.find((m) => m.label === soc.label);
          }

          if (!mapping) return; // skip if no matching mapping found

          // Find rate from contracts — patient-specific first, then company-wide
          // Also match by employee ID when we have a matching assignment
          let contract = null;
          const employeeId = matchingAssignment?.disciplineId?.toString();

          if (mapping.serviceCd) {
            // First try: patient-specific contract with employee match
            if (employeeId) {
              contract = contractList.find(
                (c) =>
                  c.patientCd === patient.patientCd &&
                  c.serviceCd?.toLowerCase() ===
                    mapping.serviceCd.toLowerCase() &&
                  c.employeeId?.toString() === employeeId
              );
            }
            // Second try: patient-specific contract without employee match
            if (!contract) {
              contract = contractList.find(
                (c) =>
                  c.patientCd === patient.patientCd &&
                  c.serviceCd?.toLowerCase() === mapping.serviceCd.toLowerCase()
              );
            }
            // Third try: company-wide contract with employee match
            if (!contract && employeeId) {
              contract = contractList.find(
                (c) =>
                  (!c.patientCd ||
                    c.patientCd === "" ||
                    c.patientCd === "ALL") &&
                  c.serviceCd?.toLowerCase() ===
                    mapping.serviceCd.toLowerCase() &&
                  c.employeeId?.toString() === employeeId
              );
            }
            // Fourth try: company-wide contract without employee match
            if (!contract) {
              contract = contractList.find(
                (c) =>
                  (!c.patientCd ||
                    c.patientCd === "" ||
                    c.patientCd === "ALL") &&
                  c.serviceCd?.toLowerCase() === mapping.serviceCd.toLowerCase()
              );
            }
          } else if (mapping.serviceType) {
            // First try: patient-specific contract with employee match
            if (employeeId) {
              contract = contractList.find(
                (c) =>
                  c.patientCd === patient.patientCd &&
                  c.serviceType?.toLowerCase() ===
                    mapping.serviceType.toLowerCase() &&
                  c.employeeId?.toString() === employeeId
              );
            }
            // Second try: patient-specific contract without employee match
            if (!contract) {
              contract = contractList.find(
                (c) =>
                  c.patientCd === patient.patientCd &&
                  c.serviceType?.toLowerCase() ===
                    mapping.serviceType.toLowerCase()
              );
            }
            // Third try: company-wide contract with employee match
            if (!contract && employeeId) {
              contract = contractList.find(
                (c) =>
                  (!c.patientCd ||
                    c.patientCd === "" ||
                    c.patientCd === "ALL") &&
                  c.serviceType?.toLowerCase() ===
                    mapping.serviceType.toLowerCase() &&
                  c.employeeId?.toString() === employeeId
              );
            }
            // Fourth try: company-wide contract without employee match
            if (!contract) {
              contract = contractList.find(
                (c) =>
                  (!c.patientCd ||
                    c.patientCd === "" ||
                    c.patientCd === "ALL") &&
                  c.serviceType?.toLowerCase() ===
                    mapping.serviceType.toLowerCase()
              );
            }
          }

          const rate = contract ? parseFloat(contract.serviceRate || 0) : 0;
          const amount = soc.qty * rate;
          socExpenses += amount;

          socDetails.push({
            label: soc.label,
            qty: soc.qty,
            rate: rate,
            amount: amount,
          });
        });

        // Add SOC Transportation
        socExpenses += EXPENSE_CONSTANTS.SOC_TRANSPORTATION;
        socDetails.push({
          label: "Transportation",
          qty: 1,
          rate: EXPENSE_CONSTANTS.SOC_TRANSPORTATION,
          amount: EXPENSE_CONSTANTS.SOC_TRANSPORTATION,
        });
      }

      const totalExpenses = regularExpenses + socExpenses;

      results.push({
        patientCd: patient.patientCd,
        patientName: patient.name || patient.patientCd,
        status: patient.status || "",
        soc: socDate.format("MM/DD/YYYY"),
        eoc: eocDate ? eocDate.format("MM/DD/YYYY") : "—",
        daysInCurrentMonth: daysInCurrentMonth,
        regularExpenses: regularExpenses,
        socExpenses: socExpenses,
        totalExpenses: totalExpenses,
        socInCurrentMonth: socInCurrentMonth,
        regularDetails: regularDetails,
        socDetails: socDetails,
      });
    });

    // Sort by total expenses descending
    results.sort((a, b) => b.totalExpenses - a.totalExpenses);
    return results;
  };

  const toggleExpand = (patientCd) => {
    setExpandedRows((prev) => ({
      ...prev,
      [patientCd]: !prev[patientCd],
    }));
  };

  // Summary totals
  const totalRegular = forecastData.reduce(
    (sum, r) => sum + r.regularExpenses,
    0
  );
  const totalSOC = forecastData.reduce((sum, r) => sum + r.socExpenses, 0);
  const grandTotal = totalRegular + totalSOC;

  const currentMonthLabel = moment().format("MMMM YYYY");

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
              <CardHeader color="rose">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4 className={classes.cardTitleWhite}>
                      {currentMonthLabel} — Expenses Client Forecast
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      Census: {forecastData.length} patients
                    </p>
                  </div>
                  <div>
                    {forecastData.length > 0 && (
                      <PDFDownloadLink
                        document={
                          <ExpensesForecastPDF
                            data={forecastData}
                            currentMonthLabel={currentMonthLabel}
                          />
                        }
                        fileName={`Expenses_Forecast_${currentMonthLabel.replace(
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
                              color: "#e91e63",
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
                <Typography
                  variant="body2"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    fontStyle: "italic",
                    color: "#666",
                  }}
                >
                  <strong>Note:</strong> Forecast visits and expenses are
                  calculated based on Days of Care. For active patients, Days of
                  Care equals the full month. For discharged patients (with
                  EOC), Days of Care is from SOC (or month start) to EOC date.
                </Typography>
                <TableContainer
                  component={Paper}
                  className={classes.tableContainer}
                >
                  <Table stickyHeader aria-label="expenses forecast table">
                    <TableHead>
                      <TableRow className={classes.tableHeader}>
                        <TableCell style={{ width: 40 }} />
                        <TableCell>Patient</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>SOC</TableCell>
                        <TableCell>EOC</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          Days of Care
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          Regular Expenses
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          SOC Expenses
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          Total Expenses
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {forecastData.map((row) => (
                        <React.Fragment key={row.patientCd}>
                          <TableRow
                            className={classes.tableRow}
                            onClick={() => toggleExpand(row.patientCd)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell>
                              <IconButton size="small">
                                {expandedRows[row.patientCd] ? (
                                  <KeyboardArrowUp />
                                ) : (
                                  <KeyboardArrowDown />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              {row.patientName} ({row.patientCd})
                            </TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.soc}</TableCell>
                            <TableCell>{row.eoc}</TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              {row.daysInCurrentMonth}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              ${parseFloat(row.regularExpenses).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              ${parseFloat(row.socExpenses).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ textAlign: "right" }}>
                              <strong>
                                ${parseFloat(row.totalExpenses).toFixed(2)}
                              </strong>
                            </TableCell>
                          </TableRow>

                          {/* Expanded detail rows */}
                          {expandedRows[row.patientCd] && (
                            <>
                              {/* Regular visit details header */}
                              {row.regularDetails.length > 0 && (
                                <>
                                  <TableRow>
                                    <TableCell colSpan={9}>
                                      <Typography
                                        variant="subtitle2"
                                        style={{
                                          paddingLeft: 40,
                                          color: "#667eea",
                                        }}
                                      >
                                        Regular Visit Details
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  {row.regularDetails.map((detail, idx) => (
                                    <TableRow
                                      key={`reg-${row.patientCd}-${idx}`}
                                      className={classes.detailRow}
                                    >
                                      <TableCell />
                                      <TableCell style={{ paddingLeft: 40 }}>
                                        {detail.disciplineName}
                                      </TableCell>
                                      <TableCell colSpan={3}>
                                        {detail.frequencyVisit}x/
                                        {detail.visitType}
                                      </TableCell>
                                      <TableCell style={{ textAlign: "right" }}>
                                        {detail.visits} visits
                                      </TableCell>
                                      <TableCell style={{ textAlign: "right" }}>
                                        @ ${parseFloat(detail.rate).toFixed(2)}
                                        /visit
                                      </TableCell>
                                      <TableCell />
                                      <TableCell style={{ textAlign: "right" }}>
                                        ${parseFloat(detail.amount).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </>
                              )}

                              {/* SOC detail rows */}
                              {row.socInCurrentMonth &&
                                row.socDetails.length > 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell colSpan={9}>
                                        <Typography
                                          variant="subtitle2"
                                          style={{
                                            paddingLeft: 40,
                                            color: "#e65100",
                                          }}
                                        >
                                          SOC Expenses (SOC in current month)
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                    {row.socDetails.map((detail, idx) => (
                                      <TableRow
                                        key={`soc-${row.patientCd}-${idx}`}
                                        className={classes.socRow}
                                      >
                                        <TableCell />
                                        <TableCell style={{ paddingLeft: 40 }}>
                                          {detail.label}
                                        </TableCell>
                                        <TableCell colSpan={3} />
                                        <TableCell
                                          style={{ textAlign: "right" }}
                                        >
                                          x{detail.qty}
                                        </TableCell>
                                        <TableCell
                                          style={{ textAlign: "right" }}
                                        >
                                          @ $
                                          {parseFloat(detail.rate).toFixed(2)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell
                                          style={{ textAlign: "right" }}
                                        >
                                          $
                                          {parseFloat(detail.amount).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </>
                                )}
                            </>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Grand Total Row */}
                      <TableRow className={classes.totalRow}>
                        <TableCell />
                        <TableCell colSpan={4}>TOTAL</TableCell>
                        <TableCell />
                        <TableCell style={{ textAlign: "right" }}>
                          ${parseFloat(totalRegular).toFixed(2)}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${parseFloat(totalSOC).toFixed(2)}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          ${parseFloat(grandTotal).toFixed(2)}
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
  assignmentState: assignmentListStateSelector(store),
  contracts: contractListStateSelector(store),
  employees: employeeListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignments: () => dispatch(resetFetchAssignmentState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpensesClientForecast);

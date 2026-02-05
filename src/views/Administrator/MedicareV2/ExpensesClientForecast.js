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
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { connect } from "react-redux";
import moment from "moment";

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
};

let isPatientListDone = false;
let isAssignmentListDone = false;
let isContractListDone = false;
let patientList = [];
let assignmentList = [];
let contractList = [];

function ExpensesClientForecast(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();

  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);

  const [forecastData, setForecastData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isProcessDone, setIsProcessDone] = useState(false);

  // Fetch patients on mount
  useEffect(() => {
    isPatientListDone = false;
    isAssignmentListDone = false;
    isContractListDone = false;
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile.companyId,
      });
    }
    return () => {
      props.resetListPatients();
      props.resetListAssignments();
      props.resetListContracts();
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

  // Calculate once all three datasets are ready
  useEffect(() => {
    if (isPatientListDone && isAssignmentListDone && isContractListDone) {
      const result = calculateExpensesForecast();
      setForecastData(result);
      setIsProcessDone(true);
    }
  }, [isPatientCollection, isAssignmentCollection, isContractCollection]);

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
      const effEnd = eocDate ? moment.min(eocDate, currentMonthEnd) : currentMonthEnd;
      const daysInCurrentMonth = effEnd.diff(effStart, "days") + 1;
      if (daysInCurrentMonth <= 0) return;

      // --- Regular Visit Expenses ---
      const patientAssignments = assignmentList.filter(
        (a) => a.patientCd === patient.patientCd
      );

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
          { label: "HUV", serviceCd: "HUV" },
          { label: "SFV", serviceCd: "SFV" },
          { label: "SOC Assessment - Nurse", serviceType: "SOC/Assessment" },
          { label: "SOC Assessment - MSW", serviceType: "SOC/Assessment" },
          { label: "SOC Assessment - Chaplain", serviceType: "SOC/Assessment" },
          { label: "NP Evaluation", serviceType: "Evaluation Visit" },
        ];

        socVisitTypes.forEach((soc, idx) => {
          const mapping = socServiceMapping[idx];

          // Find rate from contracts — patient-specific first, then company-wide
          let contract = null;
          if (mapping.serviceCd) {
            contract = contractList.find(
              (c) =>
                c.patientCd === patient.patientCd &&
                c.serviceCd?.toLowerCase() === mapping.serviceCd.toLowerCase()
            );
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
            contract = contractList.find(
              (c) =>
                c.patientCd === patient.patientCd &&
                c.serviceType?.toLowerCase() ===
                  mapping.serviceType.toLowerCase()
            );
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
                <h4 className={classes.cardTitleWhite}>
                  {currentMonthLabel} — Expenses Client Forecast
                </h4>
                <p className={classes.cardCategoryWhite}>
                  Census: {forecastData.length} patients
                </p>
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
                  <strong>Note:</strong> Forecast visits and expenses are calculated
                  based on Days of Care. For active patients, Days of Care equals
                  the full month. For discharged patients (with EOC), Days of Care
                  is from SOC (or month start) to EOC date.
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
});

const mapDispatchToProps = (dispatch) => ({
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
)(ExpensesClientForecast);

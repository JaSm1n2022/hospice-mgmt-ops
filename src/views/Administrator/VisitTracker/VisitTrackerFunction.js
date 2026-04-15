import React, { useState, useEffect, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

// Core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomDatePicker from "components/Date/CustomDatePicker.js";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";

// Redux actions
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { attemptToFetchAssignment } from "store/actions/assignmentAction";
import { attemptToFetchRoutesheet } from "store/actions/routesheetAction";
import { attemptToFetchPatient } from "store/actions/patientAction";

// Selectors
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
import { routesheetListStateSelector } from "store/selectors/routesheetSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";

// Context
import { SupaContext } from "../../../App";

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  datePickerContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  accordion: {
    marginBottom: "10px",
  },
  accordionSummary: {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
  },
  summaryContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  employeeName: {
    fontWeight: "500",
    fontSize: "16px",
  },
  employeePosition: {
    fontSize: "14px",
    color: "#666",
    marginLeft: "10px",
  },
  summaryBadges: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  badge: {
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  scheduledBadge: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  },
  completedBadge: {
    backgroundColor: "#e8f5e9",
    color: "#388e3c",
  },
  missingBadge: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
  },
  patientSection: {
    marginBottom: "30px",
  },
  patientName: {
    fontWeight: "500",
    fontSize: "15px",
    marginBottom: "10px",
    color: "#333",
  },
  comparisonContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    "@media (max-width: 960px)": {
      gridTemplateColumns: "1fr",
    },
  },
  panel: {
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
  },
  panelHeader: {
    backgroundColor: "#f9f9f9",
    padding: "10px 15px",
    fontWeight: "500",
    fontSize: "14px",
    borderBottom: "1px solid #e0e0e0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#fafafa",
    fontWeight: "500",
    fontSize: "13px",
    padding: "8px",
    borderBottom: "1px solid #e0e0e0",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  tableCell: {
    padding: "8px",
    fontSize: "13px",
  },
  matchedRow: {
    backgroundColor: "#e8f5e9",
  },
  unmatchedRow: {
    backgroundColor: "#ffebee",
  },
  statusIcon: {
    fontSize: "18px",
    verticalAlign: "middle",
  },
  completedIcon: {
    color: "#388e3c",
  },
  warningIcon: {
    color: "#f44336",
  },
  noActivity: {
    padding: "20px",
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
  timeInOut: {
    fontSize: "11px",
    color: "#666",
  },
}));

// Helper function to get the start of the week (Monday)
const getStartOfWeek = (date) => {
  return moment(date).startOf("isoWeek").toDate();
};

// Helper function to get the end of the week (Sunday)
const getEndOfWeek = (date) => {
  return moment(date).endOf("isoWeek").toDate();
};

// Helper function to get day of week label
const getDayLabel = (date) => {
  return moment(date).format("ddd"); // Mon, Tue, Wed, etc.
};

// Helper function to format date
const formatDate = (date) => {
  return moment(date).format("MM/DD/YYYY");
};

export default function VisitTrackerFunction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const context = useContext(SupaContext);
  const companyId = context?.userProfile?.companyId;

  // State for date range
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));
  const [endDate, setEndDate] = useState(getEndOfWeek(new Date()));

  // State for employee search/filter
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  // Get data from Redux store
  const employeeState = useSelector(employeeListStateSelector);
  const assignmentState = useSelector(assignmentListStateSelector);
  const routesheetState = useSelector(routesheetListStateSelector);
  const patientState = useSelector(patientListStateSelector);

  // Convert to arrays - data might be objects with array values or arrays directly
  const employees = Array.isArray(employeeState?.data)
    ? employeeState.data
    : (employeeState?.data ? Object.values(employeeState.data) : []);
  const assignments = Array.isArray(assignmentState?.data)
    ? assignmentState.data
    : (assignmentState?.data ? Object.values(assignmentState.data) : []);
  const routesheets = Array.isArray(routesheetState?.data)
    ? routesheetState.data
    : (routesheetState?.data ? Object.values(routesheetState.data) : []);
  const patients = Array.isArray(patientState?.data)
    ? patientState.data
    : (patientState?.data ? Object.values(patientState.data) : []);

  // Fetch data on mount and when date range changes
  useEffect(() => {
    if (companyId && startDate && endDate) {
      // Fetch active clinicians
      dispatch(attemptToFetchEmployee({ companyId }));
      // Fetch assignments
      dispatch(attemptToFetchAssignment({ companyId }));
      // Fetch patients (for EOC data)
      dispatch(attemptToFetchPatient({ companyId }));
      // Fetch routesheets for the date range
      dispatch(attemptToFetchRoutesheet({
        companyId,
        from: moment(startDate).format("YYYY-MM-DD"),
        to: moment(endDate).format("YYYY-MM-DD"),
      }));
    }
  }, [companyId, startDate, endDate, dispatch]);

  // Filter active clinicians
  const activeClinicians = useMemo(() => {
    const clinicalPositions = [
      "Registered Nurse",
      "Case Manager",
      "Director of Nurse",
      "Certified Nurse Assistant",
    ];

    const filtered = employees.filter((emp) => {
      const isActive = emp.status && emp.status.toLowerCase() !== "inactive";
      const isClinical = emp.position && clinicalPositions.includes(emp.position);

      return isActive && isClinical;
    }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return filtered;
  }, [employees]);

  // Filter employees by search term (client-side filtering)
  const filteredEmployeeData = useMemo(() => {
    if (!employeeSearchTerm.trim()) {
      return null; // Return null to indicate no filtering
    }

    const searchLower = employeeSearchTerm.toLowerCase().trim();
    return activeClinicians.filter((emp) => {
      return (emp.name || "").toLowerCase().includes(searchLower) ||
             (emp.position || "").toLowerCase().includes(searchLower);
    });
  }, [activeClinicians, employeeSearchTerm]);

  // Filter routesheets by date range
  const filteredRoutesheets = useMemo(() => {
    return routesheets.filter((rs) => {
      // Use dosStart if dos is not available
      const dosField = rs.dos || rs.dosStart;
      if (!dosField) return false;

      const dosDate = moment(dosField);
      return dosDate.isSameOrAfter(moment(startDate), "day") &&
             dosDate.isSameOrBefore(moment(endDate), "day");
    });
  }, [routesheets, startDate, endDate]);

  // Generate expected schedule from assignments
  const generateExpectedSchedule = (assignment, startDate, endDate) => {
    const expectedVisits = [];
    const { dayOfTheWeek = [], frequencyVisit = 0, frequency = 0, visitType = "week" } = assignment;
    const freq = frequencyVisit || frequency;

    if (!dayOfTheWeek || dayOfTheWeek.length === 0 || freq === 0) {
      return expectedVisits;
    }

    // Calculate how many weeks or months are in the date range
    const start = moment(startDate);
    const end = moment(endDate);
    let totalExpectedVisits = freq;

    if (visitType === "week" || visitType === "Week") {
      // Calculate number of weeks in the range
      const weeks = Math.ceil(end.diff(start, "days") / 7);
      totalExpectedVisits = freq * weeks;
    } else if (visitType === "month" || visitType === "Month") {
      // Calculate number of months in the range
      const months = end.diff(start, "months") + 1;
      totalExpectedVisits = freq * months;
    }

    // Iterate through each day in the date range
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(end, "day") && expectedVisits.length < totalExpectedVisits) {
      const dayLabel = currentDate.format("ddd"); // Mon, Tue, Wed, etc.

      if (dayOfTheWeek.includes(dayLabel)) {
        expectedVisits.push({
          date: currentDate.format("YYYY-MM-DD"),
          dayLabel: dayLabel,
          assignment: assignment,
        });
      }

      currentDate.add(1, "day");
    }

    return expectedVisits;
  };

  // Build employee data with matches
  const employeeData = useMemo(() => {
    // Use filtered employees if search is active, otherwise use all active clinicians
    const employeesToProcess = filteredEmployeeData || activeClinicians;

    return employeesToProcess.map((employee) => {
      // Get assignments for this employee - filter out patients with EOC and assignments with no frequency
      const employeeAssignments = assignments.filter((a) => {
        const freq = a.frequencyVisit || a.frequency || 0;

        // Find the patient record to check EOC
        const patient = patients.find(p => p.patientCd === a.patientCd || p.id === a.patientId);

        // Check if patient has EOC and if it's within the date range
        const eocField = patient?.eoc || patient?.endOfCare || patient?.EOC || patient?.eocDate;

        if (eocField) {
          const eocDate = moment(eocField);
          const rangeStart = moment(startDate);
          const rangeEnd = moment(endDate);

          // Only include if EOC date is within the selected date range
          const isEocInRange = eocDate.isSameOrAfter(rangeStart, "day") &&
                               eocDate.isSameOrBefore(rangeEnd, "day");

          if (!isEocInRange) {
            return false; // Exclude if EOC is outside the range
          }
        }

        return (
          a.disciplineId === employee.id &&
          freq > 0
        );
      });

      // Get routesheets for this employee
      // Note: routesheets use 'requestorId' to reference the employee
      const employeeRoutesheets = filteredRoutesheets.filter(
        (rs) => rs.requestorId === employee.id
      );

      // Group by patient
      const patientMap = new Map();

      // Process assignments - generate expected schedule
      employeeAssignments.forEach((assignment) => {
        const patientId = assignment.patientCd;
        const expectedVisits = generateExpectedSchedule(assignment, startDate, endDate);

        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            patientId,
            patientName: assignment.patientName || patientId,
            expected: [],
            actual: [],
          });
        }

        const patientData = patientMap.get(patientId);
        patientData.expected.push(...expectedVisits);
      });

      // Process routesheets - actual visits
      employeeRoutesheets.forEach((routesheet) => {
        const patientId = routesheet.patientCd;

        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            patientId,
            patientName: routesheet.patientName || patientId,
            expected: [],
            actual: [],
          });
        }

        const patientData = patientMap.get(patientId);
        // Use dosStart if dos is not available (based on the saga we saw earlier)
        const dosDate = routesheet.dos || routesheet.dosStart;

        // Extract time from dosStart and dosEnd if timeIn/timeOut are not available
        const timeInValue = routesheet.timeIn ||
                           (routesheet.dosStart ? moment(routesheet.dosStart).format("HH:mm") : null);
        const timeOutValue = routesheet.timeOut ||
                            (routesheet.dosEnd ? moment(routesheet.dosEnd).format("HH:mm") : null);

        // Calculate duration in hours
        let duration = 0;
        if (routesheet.dosStart && routesheet.dosEnd) {
          const start = moment(routesheet.dosStart);
          const end = moment(routesheet.dosEnd);
          duration = end.diff(start, 'minutes') / 60; // Convert to hours
        }

        patientData.actual.push({
          dos: dosDate,
          dayLabel: getDayLabel(dosDate),
          timeIn: timeInValue,
          timeOut: timeOutValue,
          duration: duration,
          estimatedPayment: routesheet.estimatedPayment || routesheet.approvedPayment || 0,
          patientName: routesheet.patientName || patientId,
        });
      });

      // Calculate statistics
      let scheduled = 0;
      let completed = 0;
      let missing = 0;
      let totalEstimatedPayment = 0;

      patientMap.forEach((patientData) => {
        patientData.expected.forEach((exp) => {
          scheduled++;
          const match = patientData.actual.find(
            (act) => moment(act.dos).format("YYYY-MM-DD") === exp.date
          );
          if (match) {
            exp.matched = true;
            completed++;
          } else {
            exp.matched = false;
            missing++;
          }
        });

        // Calculate total estimated payment for actual visits
        patientData.actual.forEach((act) => {
          totalEstimatedPayment += parseFloat(act.estimatedPayment || 0);
        });
      });

      // If all scheduled visits are completed, set missing to 0
      if (scheduled > 0 && scheduled === completed) {
        missing = 0;
      }

      return {
        employee,
        patients: Array.from(patientMap.values()),
        stats: { scheduled, completed, missing, totalEstimatedPayment },
        hasActivity: scheduled > 0 || employeeRoutesheets.length > 0,
      };
    });
  }, [activeClinicians, filteredEmployeeData, assignments, patients, filteredRoutesheets, startDate, endDate]);

  // Handle date changes
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <h4 className={classes.cardTitle}>Visit Tracker</h4>
          </CardHeader>
          <CardBody>
            {/* Date Range Picker */}
            <div className={classes.datePickerContainer}>
              <div style={{ minWidth: "200px" }}>
                <CustomDatePicker
                  label="Start Date"
                  value={startDate}
                  name="startDate"
                  onChange={(date) => handleStartDateChange(date)}
                />
              </div>
              <div style={{ minWidth: "200px" }}>
                <CustomDatePicker
                  label="End Date"
                  value={endDate}
                  name="endDate"
                  onChange={(date) => handleEndDateChange(date)}
                />
              </div>
              <div style={{ minWidth: "250px", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by employee name or position..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Employee Accordions */}
            {employeeData
              .filter((empData) => empData.stats.scheduled > 0) // Only show employees with scheduled visits
              .map((empData, idx) => (
              <Accordion
                key={empData.employee.id}
                defaultExpanded={false}
                className={classes.accordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.accordionSummary}
                >
                  <div className={classes.summaryContent}>
                    <div>
                      <span className={classes.employeeName}>
                        {empData.employee.name}
                      </span>
                      <span className={classes.employeePosition}>
                        — {empData.employee.position}
                      </span>
                    </div>
                    <div className={classes.summaryBadges}>
                      <span className={`${classes.badge} ${classes.scheduledBadge}`}>
                        {empData.stats.scheduled} scheduled
                      </span>
                      <span className={`${classes.badge} ${classes.completedBadge}`}>
                        {empData.stats.completed} completed
                      </span>
                      <span className={`${classes.badge} ${classes.missingBadge}`}>
                        {empData.stats.missing} missing
                      </span>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: "column" }}>
                  {!empData.hasActivity ? (
                    <div className={classes.noActivity}>No Activity</div>
                  ) : (
                    empData.patients.map((patient) => (
                      <div key={patient.patientId} className={classes.patientSection}>
                        <div className={classes.patientName}>
                          Patient: {patient.patientName}
                        </div>
                        <div className={classes.comparisonContainer}>
                          {/* Left Panel - Expected Schedule */}
                          <div className={classes.panel}>
                            <div className={classes.panelHeader}>
                              Expected Schedule
                            </div>
                            <table className={classes.table}>
                              <thead>
                                <tr>
                                  <th className={classes.tableHeader}>Date</th>
                                  <th className={classes.tableHeader}>Day</th>
                                  <th className={classes.tableHeader}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {patient.expected.length === 0 ? (
                                  <tr>
                                    <td colSpan="3" style={{ padding: "15px", textAlign: "center", color: "#999" }}>
                                      No scheduled visits
                                    </td>
                                  </tr>
                                ) : (
                                  patient.expected.map((exp, i) => (
                                    <tr
                                      key={i}
                                      className={`${classes.tableRow} ${
                                        exp.matched
                                          ? classes.matchedRow
                                          : classes.unmatchedRow
                                      }`}
                                    >
                                      <td className={classes.tableCell}>
                                        {formatDate(exp.date)}
                                      </td>
                                      <td className={classes.tableCell}>
                                        {exp.dayLabel}
                                      </td>
                                      <td className={classes.tableCell}>
                                        {exp.matched ? (
                                          <CheckCircleIcon
                                            className={`${classes.statusIcon} ${classes.completedIcon}`}
                                          />
                                        ) : (
                                          <WarningIcon
                                            className={`${classes.statusIcon} ${classes.warningIcon}`}
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Right Panel - Actual Visits */}
                          <div className={classes.panel}>
                            <div className={classes.panelHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>Actual Visit</span>
                              <span style={{ fontSize: "13px", fontWeight: "normal" }}>
                                Total: ${empData.stats.totalEstimatedPayment.toFixed(2)}
                              </span>
                            </div>
                            <table className={classes.table}>
                              <thead>
                                <tr>
                                  <th className={classes.tableHeader}>Patient</th>
                                  <th className={classes.tableHeader}>DOS</th>
                                  <th className={classes.tableHeader}>Day</th>
                                  <th className={classes.tableHeader}>Time In/Out</th>
                                  <th className={classes.tableHeader}>Duration</th>
                                  <th className={classes.tableHeader}>Est. Payment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {patient.actual.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" style={{ padding: "15px", textAlign: "center", color: "#999" }}>
                                      No actual visits
                                    </td>
                                  </tr>
                                ) : (
                                  patient.actual.map((act, i) => (
                                    <tr key={i} className={classes.tableRow}>
                                      <td className={classes.tableCell}>
                                        {act.patientName}
                                      </td>
                                      <td className={classes.tableCell}>
                                        {formatDate(act.dos)}
                                      </td>
                                      <td className={classes.tableCell}>
                                        {act.dayLabel}
                                      </td>
                                      <td className={classes.tableCell}>
                                        <div className={classes.timeInOut}>
                                          {act.timeIn || "—"} / {act.timeOut || "—"}
                                        </div>
                                      </td>
                                      <td className={classes.tableCell}>
                                        {act.duration ? `${act.duration.toFixed(2)}h` : "—"}
                                      </td>
                                      <td className={classes.tableCell}>
                                        ${act.estimatedPayment ? parseFloat(act.estimatedPayment).toFixed(2) : "0.00"}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            ))}

            {employeeData.filter((empData) => empData.stats.scheduled > 0).length === 0 && (
              <div className={classes.noActivity}>
                No scheduled visits found for the selected date range
              </div>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

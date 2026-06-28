import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { SupaContext } from "App";
import RoutesheetHandler from "./components/RoutesheetHandler";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport, Warning, MoneyOutlined } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import RoutesheetForm from "./components/RoutesheetForm";
import PayrollDueDateModal from "./components/PayrollDueDateModal";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

import TOAST from "modules/toastManager";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import FilterTable from "components/Table/FilterTable";
import { routesheetListStateSelector } from "store/selectors/routesheetSelector";
import { routesheetCreateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetUpdateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetDeleteStateSelector } from "store/selectors/routesheetSelector";
import { routesheetSubmitPayrollStateSelector } from "store/selectors/routesheetSelector";
import { attemptToFetchRoutesheet } from "store/actions/routesheetAction";
import { resetFetchRoutesheetState } from "store/actions/routesheetAction";
import { attemptToCreateRoutesheet } from "store/actions/routesheetAction";
import { resetCreateRoutesheetState } from "store/actions/routesheetAction";
import { attemptToUpdateRoutesheet } from "store/actions/routesheetAction";
import { resetUpdateRoutesheetState } from "store/actions/routesheetAction";
import { attemptToDeleteRoutesheet } from "store/actions/routesheetAction";
import { resetDeleteRoutesheetState } from "store/actions/routesheetAction";
import { attemptToSubmitRoutesheetToPayroll } from "store/actions/routesheetAction";
import { resetSubmitRoutesheetToPayrollState } from "store/actions/routesheetAction";
import SignatureBased from "./components/SignatureBased";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchContract } from "store/actions/contractAction";
import { resetFetchContractState } from "store/actions/contractAction";
import { contractListStateSelector } from "store/selectors/contractSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { supabaseClient } from "config/SupabaseClient";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";
import { pdf } from "@react-pdf/renderer";
import RoutesheetPrintDocument from "./components/RoutesheetPrintDocument";
import DisciplineWorkMatrixDocument from "./components/DisciplineWorkMatrixDocument";
import PrintIcon from "@material-ui/icons/Print";

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

const useStyles = makeStyles(styles);
let productList = [];

let grandTotal = 0.0;
let originalSource = undefined;
let patientList = [];
let vendorList = [];
let locationList = [];
let isProcessDone = true;
let contractList = [];
let isRoutesheetListDone = true;
let isEmployeeDone = true;
let isPatientDone = true;
let isContractDone = true;
let employeeList = [];

function RoutesheetFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(RoutesheetHandler.columns(main));
  const [isRoutesheetCollection, setIsRoutesheetCollection] = useState(true);
  const [
    isCreateRoutesheetCollection,
    setIsCreateRoutesheetCollection,
  ] = useState(true);
  const [
    isUpdateRoutesheetCollection,
    setIsUpdateRoutesheetCollection,
  ] = useState(true);
  const [
    isDeleteRoutesheetCollection,
    setIsDeleteRoutesheetCollection,
  ] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [bulkStatusLoading, setBulkStatusLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("success");
  const [thresholdHours, setThresholdHours] = useState(48); // Default 48 hours
  const [statusFilter, setStatusFilter] = useState("All"); // Default "All"
  const [thresholdReportLoading, setThresholdReportLoading] = useState(false);
  const [isPayrollDueDateModal, setIsPayrollDueDateModal] = useState(false);
  const [isSubmitPayrollCollection, setIsSubmitPayrollCollection] = useState(true);
  const [workMatrixLoading, setWorkMatrixLoading] = useState(false);

  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isRoutesheetCollection &&
      props.routesheet &&
      props.routesheet.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListRoutesheets();

      setIsRoutesheetCollection(true);
    }

    if (
      !isCreateRoutesheetCollection &&
      props.createRouteSheetState &&
      props.createRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateRoutesheet();

      setIsCreateRoutesheetCollection(true);
    }
    if (
      !isUpdateRoutesheetCollection &&
      props.updateRouteSheetState &&
      props.updateRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateRoutesheet();

      setIsUpdateRoutesheetCollection(true);
    }
    if (
      !isDeleteRoutesheetCollection &&
      props.deleteRouteSheetState &&
      props.deleteRouteSheetState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteRoutesheet();
      setIsDeleteRoutesheetCollection(true);
    }
    if (
      !isSubmitPayrollCollection &&
      props.submitPayrollState &&
      props.submitPayrollState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetSubmitPayroll();
      setIsSubmitPayrollCollection(true);
    }
  }, [
    isRoutesheetCollection,

    isCreateRoutesheetCollection,
    isUpdateRoutesheetCollection,
    isDeleteRoutesheetCollection,
    isSubmitPayrollCollection,
  ]);
  useEffect(() => {
    console.log("list routesheet", props.main);
    isRoutesheetListDone = false;
    isContractDone = false;
    isPatientDone = false;
    isEmployeeDone = false;
    setIsRoutesheetCollection(true);
    if (context.userProfile?.companyId) {
      const dates = Helper.formatDateRangeByCriteriaV2("thisWeek");
      setDateFrom(dates.from);
      setDateTo(dates.to);
      props.listEmployees({ companyId: context.userProfile.companyId });
      props.listRoutesheet({
        companyId: context.userProfile.companyId,
        from: dates.from,
        to: dates.to,
      });
      props.listContracts({ companyId: context.userProfile.companyId });
      props.listPatients({ companyId: context.userProfile.companyId });
    }
  }, []);

  // Update columns when threshold changes
  useEffect(() => {
    if (dataSource.length > 0) {
      const cols = RoutesheetHandler.columns(main, thresholdHours).map((col, index) => {
        if (col.name === "actions") {
          return {
            ...col,
            editable: () => false,
            render: (cellProps) => (
              <ActionsFunction
                deleteRecordItemHandler={deleteRecordItemHandler}
                createFormHandler={createFormHandler}
                data={{ ...cellProps.data }}
              />
            ),
          };
        }
        if (col.name === "signature") {
          return {
            ...col,
            editable: () => false,
            render: (cellProps) => (
              <SignatureBased data={{ ...cellProps.data }} />
            ),
          };
        }
        if (col.name === "patientCd") {
          // Patient column with alert icon
          return {
            ...col,
            editable: () => false,
          };
        }
        return {
          ...col,
          editable: () => false,
        };
      });
      setColumns(cols);
    }
  }, [thresholdHours]);

  // Apply filters when status filter changes
  useEffect(() => {
    filterRecordHandler(keywordValue);
  }, [statusFilter]);

  if (
    isRoutesheetCollection &&
    props.routesheet &&
    props.routesheet.status === ACTION_STATUSES.SUCCEED
  ) {
    isRoutesheetListDone = true;
    grandTotal = 0.0;
    let source = props.routesheet.data;
    if (source && source.length) {
      source = RoutesheetHandler.mapData(source, productList);
    }

    const cols = RoutesheetHandler.columns(main, thresholdHours).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              data={{ ...cellProps.data }}
            />
          ),
        };
      }
      if (col.name === "signature") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <SignatureBased data={{ ...cellProps.data }} />
          ),
        };
      }
      if (col.name === "patientCd") {
        // Patient column with alert icon
        return {
          ...col,
          editable: () => false,
        };
      }
      return {
        ...col,
        editable: () => false,
      };
    });
    originalSource = [...source];
    // source = sortByWorth(source);
    setDataSource(source);
    setColumns(cols);
    setIsRoutesheetCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Routesheet id]", id);
    props.deleteRoutesheet(id);
  };
  const createRoutesheetHandler = (payload, mode) => {
    if (mode === "create") {
      props.createRoutesheet(payload);
    } else if (mode === "edit") {
      // payload is an array with one object, extract the object
      const routesheetData = Array.isArray(payload) ? payload[0] : payload;
      props.updateRoutesheet(routesheetData);
    }
    closeFormModalHandler();
  };

  if (
    isCreateRoutesheetCollection &&
    props.createRouteSheetState &&
    props.createRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    isRoutesheetListDone = true;
    setIsCreateRoutesheetCollection(false);
    closeFormModalHandler();
    TOAST.ok("Routesheet successfully created.");
    props.listRoutesheet({
      companyId: context.userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  if (
    isUpdateRoutesheetCollection &&
    props.updateRouteSheetState &&
    props.updateRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Routesheet successfully updated.");
    setIsUpdateRoutesheetCollection(false);
    props.listRoutesheet({
      companyId: context.userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }
  console.log(
    "[isDeleteRoutesheet]",
    isDeleteRoutesheetCollection,
    props.deleteRouteSheetState
  );
  if (
    isDeleteRoutesheetCollection &&
    props.deleteRouteSheetState &&
    props.deleteRouteSheetState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Routesheet successfully deleted.");
    setIsDeleteRoutesheetCollection(false);

    props.listRoutesheet({
      companyId: context.userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }

  if (
    isSubmitPayrollCollection &&
    props.submitPayrollState &&
    props.submitPayrollState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsSubmitPayrollCollection(false);
    // Clear selections and refresh data
    const updatedSource = dataSource.map((item) => ({
      ...item,
      isChecked: false,
    }));
    setDataSource(updatedSource);
    originalSource = [...updatedSource];
    setIsAddGroupButtons(false);

    // Refresh from server
    props.listRoutesheet({
      companyId: context.userProfile.companyId,
      from: dateFrom,
      to: dateTo,
    });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);

    // Guard against undefined originalSource
    if (!originalSource || !Array.isArray(originalSource)) {
      return;
    }

    let filtered = [...originalSource];

    // Apply keyword filter
    if (keyword) {
      filtered = filtered.filter(
        (data) =>
          data.requestor &&
          data.requestor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "All") {
      filtered = filtered.filter(
        (data) => data.status === statusFilter
      );
    }

    setDataSource(filtered);
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    }
    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];
    //  dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const showNotification = (message, color = "success") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setNotification(true);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification(false);
    }, 4000);
  };

  const handlePayrollSubmission = () => {
    const selectedRows = dataSource.filter((r) => r.isChecked);

    if (selectedRows.length === 0) {
      showNotification("Please select at least one routesheet row.", "warning");
      return;
    }

    // Validate status
    const invalidRows = selectedRows.filter((r) => r.status !== "With Visit Notes");
    if (invalidRows.length > 0) {
      showNotification(
        "Payroll submission is only allowed for routesheets with status 'With Visit Notes'. Please review your selection.",
        "danger"
      );
      return;
    }

    // Open modal to get payroll due date
    setIsPayrollDueDateModal(true);
  };

  const handlePayrollDueDateConfirm = (payrollDueDate) => {
    const selectedRows = dataSource.filter((r) => r.isChecked);

    // Dispatch the saga action
    props.submitRoutesheetToPayroll({
      selectedRoutesheets: selectedRows,
      payrollDueDate: payrollDueDate,
      currentUser: context.userProfile,
    });

    setIsPayrollDueDateModal(false);
  };

  const bulkStatusUpdateHandler = async (newStatus) => {
    const selectedRows = dataSource.filter((r) => r.isChecked);
    const selectedRowIds = selectedRows.map((r) => r.id);

    if (selectedRowIds.length === 0) {
      showNotification("No rows selected", "warning");
      return;
    }

    setBulkStatusLoading(true);

    try {
      // Update each row individually with proper payload
      const updatePromises = selectedRowIds.map((rowId) => {
        return supabaseClient
          .from("routesheets")
          .update({
            status: newStatus,
            companyId: context.userProfile?.companyId,
            updatedUser: {
              name: context.userProfile?.name,
              userId: context.userProfile?.id,
              date: new Date(),
            },
          })
          .eq("id", rowId);
      });

      const results = await Promise.all(updatePromises);

      // Check for errors in any of the updates
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw new Error(
          `Failed to update ${errors.length} row(s): ${errors[0].error.message}`
        );
      }

      showNotification(
        `Successfully updated ${selectedRowIds.length} row(s) to "${newStatus}"`,
        "success"
      );

      // Clear selections and refresh data
      const updatedSource = dataSource.map((item) => ({
        ...item,
        isChecked: false,
        status: selectedRowIds.includes(item.id) ? newStatus : item.status,
      }));
      setDataSource(updatedSource);
      originalSource = [...updatedSource];
      setIsAddGroupButtons(false);

      // Refresh from server
      props.listRoutesheet({
        companyId: context.userProfile.companyId,
        from: dateFrom,
        to: dateTo,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification(
        error.message || "Failed to update status. Please try again.",
        "danger"
      );
    } finally {
      setBulkStatusLoading(false);
    }
  };

  const generateThresholdReportHandler = async () => {
    try {
      setThresholdReportLoading(true);

      // Get all rows that exceed threshold and are in Review status
      const pendingRows = dataSource.filter((row) => {
        return (
          row.status === "Review" &&
          row.dosStart &&
          moment().diff(moment(row.dosStart), "hours") > thresholdHours
        );
      });

      if (pendingRows.length === 0) {
        showNotification(
          `No routesheets found exceeding ${thresholdHours}h threshold with Review status`,
          "warning"
        );
        return;
      }

      // Group by employee (requestor)
      const groupedByEmployee = {};

      pendingRows.forEach((row) => {
        const employeeName = row.requestor || "Unknown Employee";
        const position = row.requestorTitle || "";

        if (!groupedByEmployee[employeeName]) {
          groupedByEmployee[employeeName] = {
            employeeName,
            position,
            rows: [],
          };
        }

        groupedByEmployee[employeeName].rows.push(row);
      });

      // Sort rows within each employee group
      Object.keys(groupedByEmployee).forEach((employeeName) => {
        const employeeData = groupedByEmployee[employeeName];
        employeeData.rows.sort((a, b) => {
          const patientCompare = (a.patientCd || "").localeCompare(
            b.patientCd || ""
          );
          if (patientCompare !== 0) return patientCompare;

          const serviceCompare = (a.service || "").localeCompare(
            b.service || ""
          );
          if (serviceCompare !== 0) return serviceCompare;

          const dateA = a.timeIn ? moment(a.timeIn) : moment(0);
          const dateB = b.timeIn ? moment(b.timeIn) : moment(0);
          return dateA.diff(dateB);
        });
      });

      // Load logo
      const logoUrl =
        "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
      const logoBase64 = await Helper.getImageBase64(logoUrl);

      // Generate PDF
      const pdfDocument = (
        <RoutesheetPrintDocument
          groupedData={groupedByEmployee}
          logoBase64={logoBase64}
        />
      );

      const blob = await pdf(pdfDocument).toBlob();

      // Create filename with date and threshold
      const dateStr = moment().format("YYYY-MM-DD");
      const filename = `pending_routesheets_${thresholdHours}h_threshold_${dateStr}.pdf`;

      // Download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      showNotification(
        `PDF generated: ${pendingRows.length} routesheet(s) exceeding ${thresholdHours}h threshold`,
        "success"
      );
    } catch (error) {
      console.error("Error generating threshold report:", error);
      showNotification(
        error.message || "Failed to generate PDF. Please try again.",
        "danger"
      );
    } finally {
      setThresholdReportLoading(false);
    }
  };

  const printReportHandler = async () => {
    try {
      setPrintLoading(true);

      // Get selected rows
      const selectedRows = dataSource.filter((r) => r.isChecked);

      if (selectedRows.length === 0) {
        showNotification(
          "Please select at least one row to print",
          "warning"
        );
        return;
      }

      // Group by employee (requestor)
      const groupedByEmployee = {};

      selectedRows.forEach((row) => {
        const employeeName = row.requestor || "Unknown Employee";
        const position = row.requestorTitle || "";

        if (!groupedByEmployee[employeeName]) {
          groupedByEmployee[employeeName] = {
            employeeName,
            position,
            rows: [],
          };
        }

        groupedByEmployee[employeeName].rows.push(row);
      });

      // Sort rows within each employee group
      Object.keys(groupedByEmployee).forEach((employeeName) => {
        const employeeData = groupedByEmployee[employeeName];
        employeeData.rows.sort((a, b) => {
          // Sort by Patient (patientCd)
          const patientCompare = (a.patientCd || "").localeCompare(
            b.patientCd || ""
          );
          if (patientCompare !== 0) return patientCompare;

          // Then by Service
          const serviceCompare = (a.service || "").localeCompare(
            b.service || ""
          );
          if (serviceCompare !== 0) return serviceCompare;

          // Then by Date (from timeIn)
          const dateA = a.timeIn ? moment(a.timeIn) : moment(0);
          const dateB = b.timeIn ? moment(b.timeIn) : moment(0);
          return dateA.diff(dateB);
        });
      });

      // Load logo
      const logoUrl =
        "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
      const logoBase64 = await Helper.getImageBase64(logoUrl);

      // Generate PDF
      const pdfDocument = (
        <RoutesheetPrintDocument
          groupedData={groupedByEmployee}
          logoBase64={logoBase64}
        />
      );

      const blob = await pdf(pdfDocument).toBlob();

      // Create filename with date
      const dateStr = moment().format("YYYY-MM-DD");
      const filename = `route_sheet_summary_report_${dateStr}.pdf`;

      // Download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      showNotification("PDF report generated successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification(
        error.message || "Failed to generate PDF. Please try again.",
        "danger"
      );
    } finally {
      setPrintLoading(false);
    }
  };

  const generateWorkMatrixHandler = async () => {
    try {
      setWorkMatrixLoading(true);

      // Get filtered data from current table view - use exactly what's filtered
      const filteredRows = dataSource.filter((row) => {
        // Filter by "Regular Visit" service type
        return row.service && row.service.toLowerCase().includes("regular visit");
      });

      if (filteredRows.length === 0) {
        showNotification(
          "No Regular Visit records found in the current view",
          "warning"
        );
        return;
      }

      // Get all unique dates and determine date range
      const allDates = [];
      filteredRows.forEach((row) => {
        const date = moment(row.timeIn);
        if (date.isValid()) {
          allDates.push(date);
        }
      });

      if (allDates.length === 0) {
        showNotification("No valid dates found in the filtered data", "warning");
        return;
      }

      // Get min and max dates from actual data
      const minDate = moment.min(allDates);
      const maxDate = moment.max(allDates);

      // Don't create week boundaries - use actual date range
      const weekStart = minDate.clone().startOf("day");
      const weekEnd = maxDate.clone().endOf("day");

      // Use all filtered Regular Visit data
      const weekData = filteredRows;

      // Fetch employee data to check status (active/inactive)
      let activeEmployeesMap = {};
      try {
        const { data: employees, error: empError } = await supabaseClient
          .from("employees")
          .select("id, name, status")
          .eq("companyId", context.userProfile.companyId);

        if (!empError && employees) {
          // Create a map of active employees
          employees.forEach((emp) => {
            const isActive = emp.status && emp.status.toLowerCase() === "active";
            activeEmployeesMap[emp.id] = isActive;
            activeEmployeesMap[emp.name] = isActive;
          });
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }

      // Fetch assignments to get frequency data
      let assignmentsMap = {};
      try {
        const { data: assignments, error } = await supabaseClient
          .from("assignments")
          .select("patientCd, disciplineName, disciplineId, frequencyVisit, visitType")
          .eq("companyId", context.userProfile.companyId);

        if (!error && assignments) {
          // Create a map keyed by patientCd-disciplineName for quick lookup
          assignments.forEach((assignment) => {
            const key1 = `${assignment.patientCd}-${assignment.disciplineName}`;
            const key2 = `${assignment.patientCd}-${assignment.disciplineId}`;
            const freqDisplay = assignment.frequencyVisit && assignment.visitType
              ? `${assignment.frequencyVisit}/${assignment.visitType}`
              : "-";

            assignmentsMap[key1] = freqDisplay;
            assignmentsMap[key2] = freqDisplay;
          });
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }

      // Group by discipline (for original view)
      const groupedByDiscipline = {};

      // Group by patient (for summary view)
      const groupedByPatient = {};
      const disciplineCounts = {
        nurse: 0,
        cna: 0,
        msw: 0,
        sc: 0,
      };

      weekData.forEach((row) => {
        const clientCd = row.patientCd || "Unknown Client";
        const position = row.requestorTitle || "";
        const disciplineName = row.requestor || "Unknown Employee";
        const timeIn = row.timeIn ? moment(row.timeIn).format("HH:mm") : "";
        const dateKey = moment(row.timeIn).format("YYYY-MM-DD");

        // Skip if discipline/employee is inactive
        const isActive = activeEmployeesMap[row.requestorId] || activeEmployeesMap[disciplineName];
        if (isActive === false) {
          return; // Skip this record
        }

        // Check if there's a frequency assignment for this patient-discipline combination
        const key1 = `${clientCd}-${disciplineName}`;
        const key2 = `${clientCd}-${row.requestorId}`;
        const frequency = assignmentsMap[key1] || assignmentsMap[key2];

        // Skip if no frequency assignment exists
        if (!frequency || frequency === "-") {
          return; // Skip this record - no frequency assignment
        }

        // Count disciplines for summary
        // Check CNA first before checking for "nurse" (to avoid matching "Certified Nursing Assistant")
        const positionLower = position.toLowerCase();
        if (positionLower.includes("cna") ||
            positionLower.includes("aide") ||
            positionLower.includes("assistant") ||
            positionLower.includes("certified nurse assistant") ||
            positionLower.includes("certified nursing assistant")) {
          disciplineCounts.cna++;
        } else if (positionLower.includes("rn") || positionLower.includes("lpn")) {
          disciplineCounts.nurse++;
        } else if (positionLower.includes("nurse")) {
          // If it contains "nurse" but didn't match CNA checks above, it's a nurse
          disciplineCounts.nurse++;
        } else if (positionLower.includes("msw") || positionLower.includes("social")) {
          disciplineCounts.msw++;
        } else if (positionLower.includes("sc") || positionLower.includes("chaplain")) {
          disciplineCounts.sc++;
        } else {
          disciplineCounts.nurse++; // Default to nurse
        }

        // Group by discipline for original view
        if (!groupedByDiscipline[disciplineName]) {
          groupedByDiscipline[disciplineName] = {
            position,
            clientVisits: {},
            clientFrequency: {},
          };
        }

        if (!groupedByDiscipline[disciplineName].clientVisits[clientCd]) {
          groupedByDiscipline[disciplineName].clientVisits[clientCd] = {};
        }

        // Store visit for this day (if multiple visits same day, keep latest)
        if (!groupedByDiscipline[disciplineName].clientVisits[clientCd][dateKey] ||
            timeIn > groupedByDiscipline[disciplineName].clientVisits[clientCd][dateKey].timeIn) {
          groupedByDiscipline[disciplineName].clientVisits[clientCd][dateKey] = {
            timeIn,
            date: moment(row.timeIn).format("MM/DD/YY"),
          };
        }

        // Look up frequency from assignments (only set once per client-discipline combination)
        if (!groupedByDiscipline[disciplineName].clientFrequency[clientCd]) {
          // Try both patientCd-disciplineName and patientCd-disciplineId as keys
          const key1 = `${clientCd}-${disciplineName}`;
          const key2 = `${clientCd}-${row.requestorId}`;
          groupedByDiscipline[disciplineName].clientFrequency[clientCd] =
            assignmentsMap[key1] || assignmentsMap[key2] || "-";
        }

        // Group by patient for summary view
        if (!groupedByPatient[clientCd]) {
          groupedByPatient[clientCd] = {};
        }

        if (!groupedByPatient[clientCd][dateKey]) {
          groupedByPatient[clientCd][dateKey] = [];
        }

        groupedByPatient[clientCd][dateKey].push({
          position,
          disciplineName,
        });
      });

      // Debug logging
      console.log("Week Start:", weekStart.format("YYYY-MM-DD"));
      console.log("Week End:", weekEnd.format("YYYY-MM-DD"));
      console.log("Grouped By Discipline:", groupedByDiscipline);
      console.log("Grouped By Patient:", groupedByPatient);

      // Generate PDF
      const pdfDocument = (
        <DisciplineWorkMatrixDocument
          disciplineData={groupedByDiscipline}
          patientData={groupedByPatient}
          weekStart={weekStart.toDate()}
          weekEnd={weekEnd.toDate()}
          disciplineCounts={disciplineCounts}
        />
      );

      const blob = await pdf(pdfDocument).toBlob();

      // Create filename with date range
      const filename = `discipline_work_matrix_${weekStart.format("YYYY-MM-DD")}_to_${weekEnd.format("YYYY-MM-DD")}.pdf`;

      // Download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      showNotification(
        `Work matrix generated for ${weekData.length} Regular Visit(s)`,
        "success"
      );
    } catch (error) {
      console.error("Error generating work matrix:", error);
      showNotification(
        error.message || "Failed to generate work matrix. Please try again.",
        "danger"
      );
    } finally {
      setWorkMatrixLoading(false);
    }
  };

  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `routesheet_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
    }
  };
  const onPressEnterKeyHandler = (value) => {
    filterRecordHandler(value);
    setKeywordValue(value);
  };
  const inputHandler = (e) => {
    if (e.target.name === "keywordValue") {
      setKeywordValue(e.target.value);
      filterRecordHandler(e.target.value);
    }
  };

  console.log(
    "[Propsi States]",
    props.contracts,
    props.patients,
    props.employees
  );
  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    isEmployeeDone = true;

    employeeList = props.employees.data;
    props.resetListEmployees();
  }
  if (props.contracts && props.contracts.status === ACTION_STATUSES.SUCCEED) {
    isContractDone = true;
    console.log("[Propsi Contract]", props.contracts);
    contractList = props.contracts.data;
    props.resetListContracts();
  }
  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    isPatientDone = true;
    console.log("[Propsi Patients]", props.patients);
    const ps = props.patients.data;
    ps.forEach((p) => {
      p.name = p.patientCd;
      p.value = p.name;
      p.label = p.name;
      p.description = p.name;
      p.category = "patient";
    });
    patientList = ps;
    props.resetListPatients();
  }

  console.log("[done routesheet]", isRoutesheetListDone, isEmployeeDone);
  isProcessDone =
    isRoutesheetListDone && isEmployeeDone && isContractDone && isPatientDone;
  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);
    props.listRoutesheet({
      companyId: context.userProfile.companyId,
      from: moment(new Date(dates.from)).utc().format("YYYY-MM-DD"),
      to: moment(new Date(dates.to)).utc().format("YYYY-MM-DD"),
    });
  };
  return (
    <>
      {!isProcessDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="rose">
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {/* Left side: Select */}
                    <div style={{ flex: "0 0 90%" }}>
                      <h4 className={classes.cardTitleWhite}>
                        Routesheet Management
                      </h4>
                    </div>
                    <div align="right" style={{ flex: "0 0 10%" }}>
                      <h4
                        className={classes.cardTitleWhite}
                      >{`$${grandTotal}`}</h4>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <GridContainer style={{ paddingLeft: 20 }}>
                    <GridItem md={8} sm={6} xs={12}>
                      <FilterTable
                        filterRecordHandler={filterRecordHandler}
                        filterByDateHandler={filterByDateHandler}
                        dateRangeSelection="thisWeek"
                      />
                    </GridItem>
                    <GridItem md={2} sm={3} xs={12}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        style={{ marginTop: 8 }}
                      >
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          label="Status Filter"
                        >
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Review">Review</MenuItem>
                          <MenuItem value="With Visit Notes">With Visit Notes</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Payroll Paid">Payroll Paid</MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem md={2} sm={3} xs={12}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        style={{ marginTop: 8 }}
                      >
                        <InputLabel>Alert Threshold (hours)</InputLabel>
                        <Select
                          value={thresholdHours}
                          onChange={(e) => setThresholdHours(e.target.value)}
                          label="Alert Threshold (hours)"
                        >
                          <MenuItem value={24}>24 hours</MenuItem>
                          <MenuItem value={48}>48 hours</MenuItem>
                          <MenuItem value={72}>72 hours</MenuItem>
                          <MenuItem value={96}>96 hours</MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer style={{ paddingLeft: 14 }}>
                    <GridItem md={12} sm={12} xs={12}>
                      <Button
                        color="info"
                        className={classes.marginRight}
                        onClick={() => createFormHandler()}
                      >
                        <AddIcon className={classes.icons} /> Add Routesheet
                      </Button>

                      <Grid item md={12} xs={12}>
                        {isAddGroupButtons && (
                          <div
                            style={{
                              backgroundColor: "#f5f5f5",
                              padding: "16px",
                              borderRadius: "8px",
                              marginTop: "10px",
                              marginBottom: "10px",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "#333",
                                marginRight: "10px",
                              }}
                            >
                              {dataSource.filter((r) => r.isChecked).length} row(s) selected
                            </span>

                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <Button
                                onClick={() => bulkStatusUpdateHandler("With Visit Notes")}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#2196f3",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                With Visit Notes
                              </Button>

                              <Button
                                onClick={() => bulkStatusUpdateHandler("Approved")}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#4caf50",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                Approved
                              </Button>

                              <Button
                                onClick={() => bulkStatusUpdateHandler("Payroll Paid")}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#9c27b0",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                Payroll Paid
                              </Button>

                              <Button
                                onClick={handlePayrollSubmission}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#00796b",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                <MoneyOutlined style={{ marginRight: "5px", fontSize: "18px" }} />
                                Submit to Payroll
                              </Button>

                              <Button
                                onClick={printReportHandler}
                                disabled={printLoading || bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: printLoading || bulkStatusLoading ? "#ccc" : "#673ab7",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                <PrintIcon style={{ marginRight: "5px", fontSize: "18px" }} />
                                {printLoading ? "Generating..." : "Print Report"}
                              </Button>

                              <Button
                                onClick={generateWorkMatrixHandler}
                                disabled={workMatrixLoading || bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: workMatrixLoading || bulkStatusLoading ? "#ccc" : "#e91e63",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                <PrintIcon style={{ marginRight: "5px", fontSize: "18px" }} />
                                {workMatrixLoading ? "Generating..." : "Work Matrix"}
                              </Button>
                            </div>

                            <Button
                              onClick={() => exportToExcelHandler()}
                              variant="outlined"
                              disabled={bulkStatusLoading}
                              style={{
                                fontFamily: "Roboto",
                                fontSize: "12px",
                                fontWeight: 500,
                                height: "36px",
                                textTransform: "none",
                                marginLeft: "auto",
                              }}
                              startIcon={<ImportExport />}
                            >
                              Export Excel
                            </Button>
                          </div>
                        )}
                      </Grid>
                    </GridItem>
                  </GridContainer>
                  {/*
                      <SearchCustomTextField
                        background={"white"}
                        onChange={inputHandler}
                        placeholder={"Search Item"}
                        label={"Search Item"}
                        name={"keywordValue"}
                        onPressEnterKeyHandler={onPressEnterKeyHandler}
                        isAllowEnterKey={true}
                        value={keywordValue}
                      />
                      */}
                  <HospiceTable
                    columns={columns}
                    main={true}
                    grandTotal={grandTotal}
                    dataSource={dataSource}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                  />
                  ;
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      )}
      {isFormModal && (
        <RoutesheetForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createRoutesheetHandler={createRoutesheetHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          employeeList={employeeList}
          vendorList={vendorList}
          contractList={contractList}
          userProfile={context.userProfile}
          locationList={locationList}
          patientList={patientList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
      <PayrollDueDateModal
        isOpen={isPayrollDueDateModal}
        onClose={() => setIsPayrollDueDateModal(false)}
        onConfirm={handlePayrollDueDateConfirm}
      />
      <Snackbar
        place="tc"
        color={notificationColor}
        icon={AddAlert}
        message={notificationMessage}
        open={notification}
        closeNotification={() => setNotification(false)}
        close
      />
    </>
  );
}

const mapStateToProps = (store) => ({
  routesheet: routesheetListStateSelector(store),
  createRouteSheetState: routesheetCreateStateSelector(store),
  updateRouteSheetState: routesheetUpdateStateSelector(store),
  deleteRouteSheetState: routesheetDeleteStateSelector(store),
  submitPayrollState: routesheetSubmitPayrollStateSelector(store),
  profileState: profileListStateSelector(store),
  employees: employeeListStateSelector(store),
  patients: patientListStateSelector(store),
  contracts: contractListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listRoutesheet: (data) => dispatch(attemptToFetchRoutesheet(data)),
  resetListRoutesheets: () => dispatch(resetFetchRoutesheetState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),

  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  createRoutesheet: (data) => dispatch(attemptToCreateRoutesheet(data)),
  resetCreateRoutesheet: () => dispatch(resetCreateRoutesheetState()),
  updateRoutesheet: (data) => dispatch(attemptToUpdateRoutesheet(data)),
  resetUpdateRoutesheet: () => dispatch(resetUpdateRoutesheetState()),
  deleteRoutesheet: (data) => dispatch(attemptToDeleteRoutesheet(data)),
  resetDeleteRoutesheet: () => dispatch(resetDeleteRoutesheetState()),
  submitRoutesheetToPayroll: (data) => dispatch(attemptToSubmitRoutesheetToPayroll(data)),
  resetSubmitPayroll: () => dispatch(resetSubmitRoutesheetToPayrollState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutesheetFunction);

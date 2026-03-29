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
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import RoutesheetForm from "./components/RoutesheetForm";

import TOAST from "modules/toastManager";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import FilterTable from "components/Table/FilterTable";
import { routesheetListStateSelector } from "store/selectors/routesheetSelector";
import { routesheetCreateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetUpdateStateSelector } from "store/selectors/routesheetSelector";
import { routesheetDeleteStateSelector } from "store/selectors/routesheetSelector";
import { attemptToFetchRoutesheet } from "store/actions/routesheetAction";
import { resetFetchRoutesheetState } from "store/actions/routesheetAction";
import { attemptToCreateRoutesheet } from "store/actions/routesheetAction";
import { resetCreateRoutesheetState } from "store/actions/routesheetAction";
import { attemptToUpdateRoutesheet } from "store/actions/routesheetAction";
import { resetUpdateRoutesheetState } from "store/actions/routesheetAction";
import { attemptToDeleteRoutesheet } from "store/actions/routesheetAction";
import { resetDeleteRoutesheetState } from "store/actions/routesheetAction";
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
  }, [
    isRoutesheetCollection,

    isCreateRoutesheetCollection,
    isUpdateRoutesheetCollection,
    isDeleteRoutesheetCollection,
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

    const cols = RoutesheetHandler.columns(main).map((col, index) => {
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
      payload.id = payload.id;
      props.updateRoutesheet(payload);
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

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];

      let found = temp.filter(
        (data) =>
          data.requestor &&
          data.requestor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );

      setDataSource(found);
    }
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
                    <GridItem md={12} sm={12} xs={12}>
                      <FilterTable
                        filterRecordHandler={filterRecordHandler}
                        filterByDateHandler={filterByDateHandler}
                      />
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
                                onClick={() => bulkStatusUpdateHandler("Payroll Submission")}
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
                                Payroll Submission
                              </Button>

                              <Button
                                onClick={() => bulkStatusUpdateHandler("Payroll Pending")}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#ff9800",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                Payroll Pending
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
                                onClick={() => bulkStatusUpdateHandler("Review")}
                                disabled={bulkStatusLoading}
                                variant="contained"
                                style={{
                                  backgroundColor: bulkStatusLoading ? "#ccc" : "#f44336",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  height: "36px",
                                  textTransform: "none",
                                }}
                              >
                                Review
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
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutesheetFunction);

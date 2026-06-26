import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from "react-redux";
import { CircularProgress, IconButton, TextField, Box, Checkbox } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import HospiceTable from "components/Table/HospiceTable";
import moment from "moment";
import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import TOAST from "modules/toastManager";
import * as XLSX from "xlsx";
import { pdf } from "@react-pdf/renderer";

import { attemptToFetchQA, resetFetchQAState } from "store/actions/qaAction";
import { attemptToCreateQA, resetCreateQAState } from "store/actions/qaAction";
import { attemptToUpdateQA, resetUpdateQAState } from "store/actions/qaAction";
import { attemptToDeleteQA, resetDeleteQAState } from "store/actions/qaAction";
import { qaListStateSelector, qaCreateStateSelector, qaUpdateStateSelector, qaDeleteStateSelector } from "store/selectors/qaSelector";

import { attemptToFetchPatient, resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

import { attemptToFetchEmployee, resetFetchEmployeeState } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";

import QAForm from "./components/QAForm";
import QAPrintDocument from "./components/QAPrintDocument";

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

function QAMonitoring(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const columns = [
    {
      name: "checkbox",
      header: () => (
        <Checkbox
          checked={selectedRows.length > 0 && selectedRows.length === filteredData.length}
          indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
          onChange={handleSelectAll}
          color="primary"
        />
      ),
      defaultFlex: 0.3,
      minWidth: 50,
      render: ({ data }) => (
        <Checkbox
          checked={selectedRows.includes(data.id)}
          onChange={() => handleRowSelection(data.id)}
          color="primary"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      name: "actions",
      header: "Actions",
      defaultFlex: 0.5,
      minWidth: 100,
      render: ({ data }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(data);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(data);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
    {
      name: "qa_type",
      header: "QA Type",
      defaultFlex: 1,
      minWidth: 120,
    },
    {
      name: "patientCd",
      header: "Patient",
      defaultFlex: 1,
      minWidth: 120,
    },
    {
      name: "discipline_name",
      header: "Discipline",
      defaultFlex: 1,
      minWidth: 150,
    },
    {
      name: "qa_date",
      header: "QA Date",
      defaultFlex: 1,
      minWidth: 120,
      render: ({ value }) => value ? moment(value).format("MM/DD/YYYY") : "",
    },
    {
      name: "qa_status",
      header: "Status",
      defaultFlex: 1,
      minWidth: 100,
    },
    {
      name: "qa_source_dt",
      header: "Source Date",
      defaultFlex: 1,
      minWidth: 120,
      render: ({ value }) => value ? moment(value).format("MM/DD/YYYY") : "",
    },
    {
      name: "reviewer_name",
      header: "Reviewer",
      defaultFlex: 1,
      minWidth: 150,
    },
    {
      name: "isLcdCompliance",
      header: "LCD",
      defaultFlex: 0.8,
      minWidth: 100,
      render: ({ value }) => {
        if (value === true) return "Compliant";
        if (value === false) return "Non-Compliant";
        return "";
      },
    },
  ];

  // Fetch QA records
  useEffect(() => {
    if (context.userProfile && context.userProfile.companyId) {
      props.fetchQA({ companyId: context.userProfile.companyId });
      props.fetchPatient({ companyId: context.userProfile.companyId });
      props.fetchEmployee({ companyId: context.userProfile.companyId });
    }
  }, [context.userProfile]);

  // Handle QA list response
  useEffect(() => {
    if (props.qaList.status === ACTION_STATUSES.SUCCEED) {
      const qaData = Array.isArray(props.qaList.data) ? props.qaList.data : [];
      setDataSource(qaData);
      setFilteredData(qaData);
      setIsLoading(false);
      props.resetFetchQA();
    } else if (props.qaList.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to fetch QA records");
      setDataSource([]);
      setFilteredData([]);
      setIsLoading(false);
      props.resetFetchQA();
    } else if (props.qaList.status === ACTION_STATUSES.PENDING) {
      setIsLoading(true);
    }
  }, [props.qaList]);

  // Handle search filtering
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(dataSource);
      return;
    }

    const lowerSearch = searchText.toLowerCase();
    const filtered = dataSource.filter((item) => {
      const patientMatch = item.patientCd?.toLowerCase().includes(lowerSearch);
      const reviewerMatch = item.reviewer_name?.toLowerCase().includes(lowerSearch);
      const disciplineMatch = item.discipline_name?.toLowerCase().includes(lowerSearch);
      return patientMatch || reviewerMatch || disciplineMatch;
    });

    setFilteredData(filtered);
    setSelectedRows([]); // Clear selection when filtering
  }, [searchText, dataSource]);

  // Handle patient list response
  useEffect(() => {
    if (props.patientList.status === ACTION_STATUSES.SUCCEED) {
      const patientData = Array.isArray(props.patientList.data) ? props.patientList.data : [];
      const patients = patientData.map((p) => ({
        ...p,
        label: p.patientCd,
        value: p.patientCd,
      }));
      setPatientList(patients);
      props.resetFetchPatient();
    } else if (props.patientList.status === ACTION_STATUSES.FAILED) {
      setPatientList([]);
      props.resetFetchPatient();
    }
  }, [props.patientList]);

  // Handle employee list response
  useEffect(() => {
    if (props.employeeList.status === ACTION_STATUSES.SUCCEED) {
      const employeeData = Array.isArray(props.employeeList.data) ? props.employeeList.data : [];
      const employees = employeeData.map((e) => ({
        ...e,
        name: e.name || `${e.fn || ""} ${e.ln || ""}`.trim(),
        label: e.name || `${e.fn || ""} ${e.ln || ""}`.trim(),
        value: e.id,
      }));
      setEmployeeList(employees);
      props.resetFetchEmployee();
    } else if (props.employeeList.status === ACTION_STATUSES.FAILED) {
      setEmployeeList([]);
      props.resetFetchEmployee();
    }
  }, [props.employeeList]);

  // Handle create response
  useEffect(() => {
    if (props.qaCreate.status === ACTION_STATUSES.SUCCEED) {
      TOAST.ok("QA record created successfully");
      setIsFormOpen(false);
      props.resetCreateQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaCreate.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to create QA record");
      props.resetCreateQA();
    }
  }, [props.qaCreate]);

  // Handle update response
  useEffect(() => {
    if (props.qaUpdate.status === ACTION_STATUSES.SUCCEED) {
      TOAST.ok("QA record updated successfully");
      setIsFormOpen(false);
      props.resetUpdateQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaUpdate.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to update QA record");
      props.resetUpdateQA();
    }
  }, [props.qaUpdate]);

  // Handle delete response
  useEffect(() => {
    if (props.qaDelete.status === ACTION_STATUSES.SUCCEED) {
      TOAST.ok("QA record deleted successfully");
      props.resetDeleteQA();
      props.fetchQA({ companyId: context.userProfile.companyId });
    } else if (props.qaDelete.status === ACTION_STATUSES.FAILED) {
      TOAST.error("Failed to delete QA record");
      props.resetDeleteQA();
    }
  }, [props.qaDelete]);

  const handleAddNew = () => {
    setFormMode("create");
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleRowDoubleClick = (rowProps) => {
    setFormMode("edit");
    setSelectedItem(rowProps.data);
    setIsFormOpen(true);
  };

  const handleEdit = (rowData) => {
    setFormMode("edit");
    setSelectedItem(rowData);
    setIsFormOpen(true);
  };

  const handleDelete = (rowData) => {
    if (window.confirm("Are you sure you want to delete this QA record?")) {
      props.deleteQA({ id: rowData.id });
    }
  };

  const handleFormSubmit = (payload, mode) => {
    payload.companyId = context.userProfile.companyId;
    payload.created_at = new Date();
    payload.createdUser = {
      name: context.userProfile.name,
      userId: context.userProfile.id,
      date: new Date(),
    };
    payload.updatedUser = {
      name: context.userProfile.name,
      userId: context.userProfile.id,
      date: new Date(),
    };

    if (mode === "create") {
      props.createQA(payload);
    } else {
      props.updateQA(payload);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleExportExcel = () => {
    const selectedData = filteredData.filter((row) => selectedRows.includes(row.id));

    if (selectedData.length === 0) {
      TOAST.error("Please select at least one record to export");
      return;
    }

    const exportData = selectedData.map((item) => ({
      "QA Type": item.qa_type || "",
      "Patient": item.patientCd || "",
      "Discipline": item.discipline_name || "",
      "QA Date": item.qa_date ? moment(item.qa_date).format("MM/DD/YYYY") : "",
      "Status": item.qa_status || "",
      "Source Date": item.qa_source_dt ? moment(item.qa_source_dt).format("MM/DD/YYYY") : "",
      "Complete Date": item.completed_dt ? moment(item.completed_dt).format("MM/DD/YYYY") : "",
      "Reviewer": item.reviewer_name || "",
      "LCD Compliance": item.isLcdCompliance === true ? "Compliant" : item.isLcdCompliance === false ? "Not Compliant" : "",
      "Cert #": item.recertNumber || "",
      "Comments": Array.isArray(item.comments) ? item.comments.join("; ") : item.comments || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QA Records");

    const fileName = `QA_Records_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    TOAST.ok(`Exported ${selectedData.length} record(s) to Excel`);
  };

  const handlePrintPDF = async () => {
    try {
      const doc = <QAPrintDocument qaRecords={filteredData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      TOAST.ok("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      TOAST.error("Failed to generate PDF. Please try again.");
    }
  };

  // Safety check: if data is loaded but still showing loading, hide it
  useEffect(() => {
    // Set loading to false after initial data fetch attempts complete
    const hasQAResponse = props.qaList && props.qaList.status !== null && props.qaList.status !== ACTION_STATUSES.PENDING;
    const hasPatientResponse = props.patientList && props.patientList.status !== null && props.patientList.status !== ACTION_STATUSES.PENDING;
    const hasEmployeeResponse = props.employeeList && props.employeeList.status !== null && props.employeeList.status !== ACTION_STATUSES.PENDING;

    if (hasQAResponse || hasPatientResponse || hasEmployeeResponse) {
      setIsLoading(false);
    }
  }, [props.qaList, props.patientList, props.employeeList]);

  if (isLoading && (!context.userProfile || !context.userProfile.companyId)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 className={classes.cardTitleWhite}>QA Monitoring</h4>
                <Button color="white" onClick={handleAddNew}>
                  <AddIcon /> Add QA Record
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Box mb={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <TextField
                  label="Search (Patient, Reviewer, Discipline)"
                  variant="outlined"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ minWidth: 300, flex: 1 }}
                />
                <Box display="flex" gap={1}>
                  {selectedRows.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExportExcel}
                      startIcon={<GetAppIcon />}
                    >
                      Export Excel ({selectedRows.length})
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrintPDF}
                    startIcon={<PrintIcon />}
                  >
                    Print PDF
                  </Button>
                </Box>
              </Box>
              <HospiceTable
                columns={columns}
                dataSource={Array.isArray(filteredData) ? filteredData : []}
                loading={isLoading}
                onRowDoubleClick={handleRowDoubleClick}
                style={{ minHeight: 550 }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <QAForm
        isOpen={isFormOpen}
        mode={formMode}
        item={selectedItem}
        patientList={Array.isArray(patientList) ? patientList : []}
        employeeList={Array.isArray(employeeList) ? employeeList : []}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  qaList: qaListStateSelector(state) || { data: [], status: null, error: null },
  qaCreate: qaCreateStateSelector(state) || { data: {}, status: null, error: null },
  qaUpdate: qaUpdateStateSelector(state) || { data: {}, status: null, error: null },
  qaDelete: qaDeleteStateSelector(state) || { data: {}, status: null, error: null },
  patientList: patientListStateSelector(state) || { data: [], status: null, error: null },
  employeeList: employeeListStateSelector(state) || { data: [], status: null, error: null },
});

const mapDispatchToProps = {
  fetchQA: attemptToFetchQA,
  resetFetchQA: resetFetchQAState,
  createQA: attemptToCreateQA,
  resetCreateQA: resetCreateQAState,
  updateQA: attemptToUpdateQA,
  resetUpdateQA: resetUpdateQAState,
  deleteQA: attemptToDeleteQA,
  resetDeleteQA: resetDeleteQAState,
  fetchPatient: attemptToFetchPatient,
  resetFetchPatient: resetFetchPatientState,
  fetchEmployee: attemptToFetchEmployee,
  resetFetchEmployee: resetFetchEmployeeState,
};

export default connect(mapStateToProps, mapDispatchToProps)(QAMonitoring);

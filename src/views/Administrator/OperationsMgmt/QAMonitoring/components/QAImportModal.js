import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import * as XLSX from "xlsx";
import TOAST from "modules/toastManager";
import { supabaseClient } from "config/SupabaseClient";
import { QA_TYPE } from "utils/constants";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: "95vw",
    maxWidth: "95vw",
    minHeight: "85vh",
    maxHeight: "85vh",
  },
  uploadBox: {
    border: "2px dashed #ccc",
    borderRadius: "12px",
    padding: theme.spacing(5),
    textAlign: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: "#f5f9ff",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  tableContainer: {
    maxHeight: "calc(85vh - 280px)",
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "auto",
    "& .MuiTable-root": {
      minWidth: 1400,
    },
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: "0.875rem",
    borderBottom: "1px solid #e0e0e0",
    whiteSpace: "nowrap",
  },
  headerCell: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    fontWeight: 600,
    padding: "14px 16px",
    fontSize: "0.875rem",
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: "2px solid #115293",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  selectControl: {
    minWidth: 200,
    fontSize: "0.875rem",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
    },
  },
  errorRow: {
    backgroundColor: "#ffebee",
    "&:hover": {
      backgroundColor: "#ffcdd2 !important",
    },
  },
  completeRow: {
    backgroundColor: "#ffffff",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5 !important",
    },
  },
  rowNumber: {
    backgroundColor: "#f5f5f5",
    fontWeight: 600,
    color: "#666",
  },
  previewColumn: {
    color: "#666",
    fontStyle: "italic",
  },
  requiredStar: {
    color: "#f44336",
    marginLeft: "4px",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: theme.spacing(2),
    borderRadius: "8px",
    marginTop: theme.spacing(2),
    border: "1px solid #90caf9",
  },
  statsBox: {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(1, 2),
    backgroundColor: "#fff",
    borderRadius: "8px",
    minWidth: "100px",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#666",
    textTransform: "uppercase",
  },
}));

function QAImportModal({ isOpen, onClose, patientList, userProfile, onSuccess }) {
  const classes = useStyles();
  const [importRows, setImportRows] = useState([]);
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setImportRows([]);
      setFile(null);
    } else {
      // Fetch employees when modal opens
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      if (!userProfile || !userProfile.companyId) {
        console.log("No user profile or companyId available");
        return;
      }

      console.log("Fetching employees for companyId:", userProfile.companyId);

      const { data, error } = await supabaseClient
        .from("employees")
        .select("*")
        .eq("companyId", userProfile.companyId)
        .order("ln", { ascending: true });

      if (error) {
        console.error("Error fetching employees:", error);
        TOAST.error("Failed to load employees");
        return;
      }

      console.log("Fetched employees:", data);
      setEmployeeList(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      TOAST.error("Failed to load employees");
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

      if (jsonData.length === 0) {
        TOAST.error("The Excel file is empty");
        return;
      }

      // Map Excel rows to import rows with smart defaults
      const rows = jsonData.map((excelRow, index) => {
        const module = (excelRow["Modules"] || excelRow["Module"] || "").toString().trim();
        const staffName = (excelRow["Staff Name"] || excelRow["StaffName"] || "").toString().trim();
        const patientName = (excelRow["Patient Name"] || excelRow["PatientName"] || "").toString().trim();

        // Smart QA Type detection
        let qaType = null;
        const moduleUpper = module.toUpperCase();
        const staffNameUpper = staffName.toUpperCase();

        if (moduleUpper.includes("VISIT NOTES")) {
          if (staffNameUpper.includes("(RN)") || staffNameUpper.includes("RN")) {
            qaType = "RN Visit";
          } else if (staffNameUpper.includes("(MSW)") || staffNameUpper.includes("MSW")) {
            qaType = "MSW Visit";
          } else if (staffNameUpper.includes("(SC)") || staffNameUpper.includes("SC")) {
            qaType = "SC Visit";
          } else if (staffNameUpper.includes("(LPN)") || staffNameUpper.includes("LPN")) {
            qaType = "LPN Visit";
          }
        } else if (moduleUpper.includes("HEALTH AIDE")) {
          qaType = "HA Visit";
        }

        // Smart DisciplineId matching - get first word of staff name
        let disciplineId = null;
        let disciplineName = null;
        const firstWord = staffName.split(/[\s,]+/)[0]; // Split by space or comma
        if (firstWord && employeeList.length > 0) {
          const matchedEmployee = employeeList.find((emp) => {
            const empLastName = (emp.ln || "").toLowerCase();
            const empFirstName = (emp.fn || "").toLowerCase();
            const searchWord = firstWord.toLowerCase();
            return empLastName.startsWith(searchWord) || empFirstName.startsWith(searchWord);
          });
          if (matchedEmployee) {
            disciplineId = matchedEmployee.id;
            const employeeName = matchedEmployee.name || `${matchedEmployee.fn || ""} ${matchedEmployee.ln || ""}`.trim();
            disciplineName = matchedEmployee.discipline || employeeName;
          }
        }

        // Smart PatientCd matching - get first 3 chars of patient name
        let patientId = null;
        let patientCd = null;
        const first3Chars = patientName.substring(0, 3).toUpperCase();
        if (first3Chars && patientList.length > 0) {
          const matchedPatient = patientList.find((p) => {
            const pCode = (p.patientCd || "").toUpperCase();
            return pCode.startsWith(first3Chars);
          });
          if (matchedPatient) {
            patientId = matchedPatient.id;
            patientCd = matchedPatient.patientCd;
          }
        }

        return {
          id: index,
          excel: excelRow,
          patientId,
          patientCd,
          disciplineId,
          disciplineName,
          qaType,
        };
      });

      setImportRows(rows);
      setFile(uploadedFile);
      TOAST.ok(`Loaded ${rows.length} rows from Excel with smart matching`);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      TOAST.error("Failed to parse Excel file. Please check the file format.");
    }
  };

  const handlePatientChange = (rowIndex, patientId) => {
    const patient = patientList.find((p) => p.id === patientId);
    setImportRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              patientId: patient?.id || null,
              patientCd: patient?.patientCd || null,
            }
          : row
      )
    );
  };

  const handleDisciplineChange = (rowIndex, employeeId) => {
    const employee = employeeList.find((e) => e.id === employeeId);
    const employeeName = employee?.name || `${employee?.fn || ""} ${employee?.ln || ""}`.trim();
    setImportRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              disciplineId: employee?.id || null,
              disciplineName: employee?.discipline || employeeName || null,
            }
          : row
      )
    );
  };

  const handleQATypeChange = (rowIndex, qaTypeValue) => {
    setImportRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              qaType: qaTypeValue,
            }
          : row
      )
    );
  };

  const validateRows = () => {
    let valid = true;
    for (const row of importRows) {
      if (!row.patientId || !row.disciplineId || !row.qaType) {
        valid = false;
        break;
      }
    }
    return valid;
  };

  const handleSave = async () => {
    if (importRows.length === 0) {
      TOAST.error("No rows to save");
      return;
    }

    if (!validateRows()) {
      TOAST.error("Please select QA Type, PatientCd, and DisciplineId (Employee) for all rows");
      return;
    }

    setIsSaving(true);

    try {
      // Transform rows to qa_monitoring payload
      const records = importRows.map((row) => {
        const excel = row.excel;

        return {
          companyId: userProfile.companyId,
          createdUser: {
            name: userProfile.name,
            userId: userProfile.id,
            date: new Date(),
          },
          qa_type: row.qaType,
          patientCd: row.patientCd,
          patientId: row.patientId,
          disciplineId: row.disciplineId,
          discipline_name: row.disciplineName,
          qa_status: "Pending",
          qa_source_dt: asDate(excel["Date"]),
        };
      });

      // Batch insert using Supabase
      const { data, error } = await supabaseClient
        .from("qa_monitoring")
        .insert(records)
        .select();

      if (error) {
        console.error("Error inserting QA records:", error);
        TOAST.error(`Failed to import records: ${error.message}`);
        setIsSaving(false);
        return;
      }

      TOAST.ok(`Successfully imported ${records.length} record(s)`);
      setIsSaving(false);
      onSuccess();
    } catch (error) {
      console.error("Error during import:", error);
      TOAST.error("An unexpected error occurred during import");
      setIsSaving(false);
    }
  };

  // Helper functions for data transformation
  const toArray = (v) => {
    if (v == null || v === "") return null;
    if (Array.isArray(v)) return v;
    return [String(v)];
  };

  const asBool = (v) => {
    if (v == null || v === "") return null;
    return ["true", "yes", "1", "y", true, 1].includes(
      typeof v === "string" ? v.toLowerCase() : v
    );
  };

  const asInt = (v) => {
    if (v == null || v === "") return null;
    const num = Number.parseInt(String(v), 10);
    return isNaN(num) ? null : num;
  };

  const asDate = (v) => {
    if (v == null || v === "") return null;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    const dateStr = String(v);
    // Try to parse the date
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  };

  const asIso = (v) => {
    if (v == null || v === "") return null;
    if (v instanceof Date) return v.toISOString();
    const dateStr = String(v);
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString();
  };

  const isRowIncomplete = (row) => {
    return !row.patientId || !row.disciplineId || !row.qaType;
  };

  const getCompletedRowsCount = () => {
    return importRows.filter((row) => row.patientId && row.disciplineId && row.qaType).length;
  };

  const getEmployeeDisplayName = (employee) => {
    if (!employee) return "";
    const firstName = employee.fn || "";
    const lastName = employee.ln || "";
    const fullName = `${lastName}, ${firstName}`.trim();
    const discipline = employee.discipline ? ` (${employee.discipline})` : "";
    return fullName ? fullName + discipline : employee.name || "";
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Visit Records</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {importRows.length === 0 ? (
          <Box>
            <input
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              id="excel-upload-input"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="excel-upload-input">
              <Box className={classes.uploadBox}>
                <CloudUploadIcon style={{ fontSize: 64, color: "#1976d2", marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>
                  Upload Excel File
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Click here or drag and drop your Excel file (.xlsx, .xls)
                </Typography>
              </Box>
            </label>
            <Box className={classes.infoBox}>
              <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 600, marginBottom: 12 }}>
                Expected Excel Columns:
              </Typography>
              <Typography variant="body2" style={{ marginBottom: 8 }}>
                <strong>Patient Name</strong>, <strong>Modules</strong>, <strong>Date</strong> (Source Date),
                <strong> Staff Name</strong>
              </Typography>
              <Typography variant="body2" style={{ marginTop: 12, color: "#d32f2f" }}>
                <strong>Note:</strong> After upload, you will need to select <strong>QA Type</strong>, <strong>PatientCd</strong> (from patients table),
                and <strong>DisciplineId</strong> (from employees table) for each row.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box className={classes.statsBox}>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber}>{importRows.length}</Typography>
                <Typography className={classes.statLabel}>Total Rows</Typography>
              </Box>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber} style={{ color: "#4caf50" }}>
                  {getCompletedRowsCount()}
                </Typography>
                <Typography className={classes.statLabel}>Completed</Typography>
              </Box>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber} style={{ color: "#f44336" }}>
                  {importRows.length - getCompletedRowsCount()}
                </Typography>
                <Typography className={classes.statLabel}>Pending</Typography>
              </Box>
              <Box flex={1} />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setImportRows([]);
                  setFile(null);
                }}
                style={{ alignSelf: "center" }}
              >
                Clear & Upload New File
              </Button>
            </Box>

            <Typography variant="body2" style={{ marginBottom: 12, fontWeight: 500 }}>
              File: <strong>{file?.name}</strong>
            </Typography>

            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerCell} style={{ minWidth: 50 }}>
                      #
                    </TableCell>
                    {/* Excel Columns */}
                    <TableCell className={classes.headerCell} style={{ minWidth: 200, backgroundColor: "#0d47a1" }}>
                      Patient Name (Excel)
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 180, backgroundColor: "#0d47a1" }}>
                      Modules (Excel)
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 120, backgroundColor: "#0d47a1" }}>
                      Date (Excel)
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 200, backgroundColor: "#0d47a1" }}>
                      Staff Name (Excel)
                    </TableCell>
                    {/* Mapping Columns */}
                    <TableCell className={classes.headerCell} style={{ minWidth: 220, backgroundColor: "#c62828" }}>
                      QA Type <span className={classes.requiredStar}>*</span>
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 180, backgroundColor: "#c62828" }}>
                      PatientCd <span className={classes.requiredStar}>*</span>
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 250, backgroundColor: "#c62828" }}>
                      DisciplineId (Employee) <span className={classes.requiredStar}>*</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importRows.map((row, index) => {
                    const isIncomplete = isRowIncomplete(row);
                    const selectedPatient = patientList.find((p) => p.id === row.patientId);
                    const selectedEmployee = employeeList.find((e) => e.id === row.disciplineId);

                    return (
                      <TableRow
                        key={row.id}
                        className={isIncomplete ? classes.errorRow : classes.completeRow}
                      >
                        <TableCell className={`${classes.tableCell} ${classes.rowNumber}`}>
                          {index + 1}
                        </TableCell>
                        {/* Excel Data */}
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          <strong>{row.excel["Patient Name"] || row.excel["PatientName"] || "—"}</strong>
                        </TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          <strong>{row.excel["Modules"] || row.excel["Module"] || "—"}</strong>
                        </TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          {row.excel["Date"]
                            ? new Date(row.excel["Date"]).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          <strong>{row.excel["Staff Name"] || row.excel["StaffName"] || "—"}</strong>
                        </TableCell>
                        {/* Mapping Dropdowns */}
                        <TableCell className={classes.tableCell} style={{ backgroundColor: isIncomplete ? "#ffcdd2" : "#fff" }}>
                          <FormControl size="small" fullWidth className={classes.selectControl}>
                            <Select
                              value={row.qaType || ""}
                              onChange={(e) => handleQATypeChange(index, e.target.value)}
                              displayEmpty
                              variant="outlined"
                            >
                              <MenuItem value="" disabled>
                                <em>— Select QA Type —</em>
                              </MenuItem>
                              {QA_TYPE.map((qaType) => (
                                <MenuItem key={qaType.id} value={qaType.value}>
                                  {qaType.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {row.qaType && (
                            <Typography variant="caption" style={{ color: "#666", marginTop: 4, display: "block" }}>
                              {row.qaType}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} style={{ backgroundColor: isIncomplete ? "#ffcdd2" : "#fff" }}>
                          <FormControl size="small" fullWidth className={classes.selectControl}>
                            <Select
                              value={row.patientId || ""}
                              onChange={(e) => handlePatientChange(index, e.target.value)}
                              displayEmpty
                              variant="outlined"
                            >
                              <MenuItem value="" disabled>
                                <em>— Select PatientCd —</em>
                              </MenuItem>
                              {patientList.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                  {patient.patientCd}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {selectedPatient && (
                            <Typography variant="caption" style={{ color: "#666", marginTop: 4, display: "block" }}>
                              {selectedPatient.patientCd}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} style={{ backgroundColor: isIncomplete ? "#ffcdd2" : "#fff" }}>
                          <FormControl size="small" fullWidth className={classes.selectControl}>
                            <Select
                              value={row.disciplineId || ""}
                              onChange={(e) => handleDisciplineChange(index, e.target.value)}
                              displayEmpty
                              variant="outlined"
                            >
                              <MenuItem value="" disabled>
                                <em>— Select Employee —</em>
                              </MenuItem>
                              {employeeList.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                  {getEmployeeDisplayName(employee)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {selectedEmployee && (
                            <Typography variant="caption" style={{ color: "#666", marginTop: 4, display: "block" }}>
                              {getEmployeeDisplayName(selectedEmployee)}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} p={2} style={{ backgroundColor: "#fff3e0", borderRadius: 8, border: "1px solid #ffb74d" }}>
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                <span className={classes.requiredStar}>*</span> Required: Select <strong>QA Type</strong>, <strong>PatientCd</strong> (from patients table),
                and <strong>DisciplineId</strong> (from employees table) for all rows.
                Incomplete rows are highlighted in <span style={{ color: "#d32f2f" }}>red</span>.
              </Typography>
              <Typography variant="caption" style={{ display: "block", marginTop: 8, color: "#666" }}>
                <strong>Dark Blue columns</strong> = Excel data | <strong>Red columns</strong> = Required mapping fields
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="default" disabled={isSaving}>
          Cancel
        </Button>
        {importRows.length > 0 && (
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? "Saving..." : "Save All Records"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default QAImportModal;

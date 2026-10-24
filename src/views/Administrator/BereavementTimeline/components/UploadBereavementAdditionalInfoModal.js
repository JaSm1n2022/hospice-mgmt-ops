import React from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import * as XLSX from "xlsx";
import TOAST from "modules/toastManager";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: "95vw",
    maxWidth: "95vw",
    minHeight: "80vh",
    maxHeight: "80vh",
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
      borderColor: "#163B2A",
      backgroundColor: "#f5f9f7",
    },
  },
  tableContainer: {
    maxHeight: "calc(80vh - 240px)",
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "auto",
    "& .MuiTable-root": {
      minWidth: 900,
    },
  },
  tableCell: {
    padding: "10px 14px",
    fontSize: "0.825rem",
    borderBottom: "1px solid #e0e0e0",
    whiteSpace: "nowrap",
  },
  headerCell: {
    backgroundColor: "#163B2A",
    color: "#ffffff",
    fontWeight: 600,
    padding: "12px 14px",
    fontSize: "0.8rem",
    position: "sticky",
    top: 0,
    zIndex: 10,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  selectControl: {
    minWidth: 180,
    fontSize: "0.825rem",
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
    "&:hover": {
      backgroundColor: "#f5f5f5 !important",
    },
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
    backgroundColor: "#EDF6EF",
    padding: theme.spacing(2),
    borderRadius: "8px",
    marginTop: theme.spacing(2),
    border: "1px solid #c9ddcf",
  },
  statsBox: {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: "center",
  },
  deleteButton: {
    color: "#f44336",
    "&:hover": {
      backgroundColor: "#ffebee",
    },
  },
}));

const EXCEL_FIELD_ALIASES = {
  patientCode: ["Patient Code", "PatientCd", "Patient Cd"],
  patientName: [
    "Patient",
    "Patient Name",
    "Deceased Patient",
    "Patient Full Name",
    "Name",
  ],
  recipientName: [
    "Bereavement Recipient",
    "Recipient",
    "Recipient Name",
    "Bereavement Recipient Name",
  ],
  relationship: ["Relationship", "Relation"],
};

function normalizeHeader(key) {
  return key.toString().trim().toLowerCase();
}

function readExcelValue(excelRow, field) {
  const aliases = (EXCEL_FIELD_ALIASES[field] || []).map(normalizeHeader);
  for (const key of Object.keys(excelRow)) {
    if (
      aliases.includes(normalizeHeader(key)) &&
      excelRow[key] != null &&
      excelRow[key] !== ""
    ) {
      return String(excelRow[key]).trim();
    }
  }
  return "";
}

function UploadBereavementAdditionalInfoModal({
  isOpen,
  onClose,
  patientOptions,
  onImport,
}) {
  const classes = useStyles();
  const [importRows, setImportRows] = React.useState([]);
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    if (!isOpen) {
      setImportRows([]);
      setFile(null);
    }
  }, [isOpen]);

  const matchPatient = (rawCodeValue, rawNameValue) => {
    const list = patientOptions || [];
    const codeValue = (rawCodeValue || "").toString().trim().toLowerCase();
    const nameValue = (rawNameValue || "").toString().trim().toLowerCase();

    let match = null;

    if (codeValue) {
      match = list.find((p) => (p.patientCd || "").toLowerCase() === codeValue);
    }

    if (!match && nameValue) {
      match = list.find((p) => (p.patientName || "").toLowerCase() === nameValue);
    }

    if (!match && nameValue) {
      match = list.find(
        (p) =>
          (p.patientName || "").toLowerCase().includes(nameValue) ||
          (nameValue.includes((p.patientName || "").toLowerCase()) &&
            p.patientName)
      );
    }

    if (!match) {
      const fallbackRaw = codeValue || nameValue;
      const first3Chars = fallbackRaw.substring(0, 3).toUpperCase();
      if (first3Chars) {
        match = list.find((p) =>
          (p.patientCd || "").toUpperCase().startsWith(first3Chars)
        );
      }
    }

    return match || null;
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

      const rows = jsonData.map((excelRow, index) => {
        const patientCodeRaw = readExcelValue(excelRow, "patientCode");
        const patientNameRaw = readExcelValue(excelRow, "patientName");
        const matched = matchPatient(patientCodeRaw, patientNameRaw);

        return {
          id: index,
          patientRaw: patientNameRaw || patientCodeRaw,
          patientName: patientNameRaw || patientCodeRaw || "",
          patientId: matched ? matched.id : null,
          patientCd: matched ? matched.patientCd : null,
          recipientName: readExcelValue(excelRow, "recipientName"),
          relationship: readExcelValue(excelRow, "relationship"),
        };
      });

      setImportRows(rows);
      setFile(uploadedFile);
      TOAST.ok(`Loaded ${rows.length} row(s) from Excel`);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      TOAST.error("Failed to parse Excel file. Please check the file format.");
    }
  };

  const handlePatientChange = (rowIndex, patientId) => {
    const patient = (patientOptions || []).find((p) => p.id === patientId);
    setImportRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              patientId: patient?.id || null,
              patientCd: patient?.patientCd || null,
              patientName: row.patientName || patient?.patientName || "",
            }
          : row
      )
    );
  };

  const handleDeleteRow = (rowIndex) => {
    setImportRows((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const getCompletedRowsCount = () =>
    importRows.filter((row) => row.patientId).length;

  const handleImport = () => {
    if (importRows.length === 0) {
      TOAST.error("No rows to import");
      return;
    }
    const unmatched = importRows.filter((row) => !row.patientId);
    if (unmatched.length > 0) {
      TOAST.error(
        "Please select a Patient Code for every row before importing"
      );
      return;
    }

    const mapped = importRows.map((row) => ({
      patientId: row.patientId,
      patientName: row.patientName,
      bereavementRecipientName: row.recipientName,
      bereavementRecipientRelationship: row.relationship,
    }));

    onImport(mapped);
    TOAST.ok(`Imported additional info for ${mapped.length} patient(s)`);
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
          <Typography variant="h6">Upload Additional Information</Typography>
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
              id="bereavement-additional-info-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="bereavement-additional-info-upload">
              <Box className={classes.uploadBox}>
                <CloudUploadIcon
                  style={{ fontSize: 64, color: "#163B2A", marginBottom: 16 }}
                />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>
                  Upload Excel File
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Click here or drag and drop your Excel file (.xlsx, .xls)
                </Typography>
              </Box>
            </label>
            <Box className={classes.infoBox}>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ fontWeight: 600, marginBottom: 12 }}
              >
                Expected Excel Columns:
              </Typography>
              <Typography variant="body2">
                <strong>Patient Code</strong>, <strong>Patient Name</strong>,{" "}
                <strong>Recipient</strong>, <strong>Relationship</strong>
              </Typography>
              <Typography
                variant="body2"
                style={{ marginTop: 12, color: "#d32f2f" }}
              >
                <strong>Note:</strong> After upload, you will need to confirm
                the matching <strong>Patient Code</strong> for each row before
                importing.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box className={classes.statsBox}>
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                File: <strong>{file?.name}</strong>
              </Typography>
              <Typography variant="body2" style={{ color: "#666" }}>
                {getCompletedRowsCount()} of {importRows.length} matched
              </Typography>
              <Box flex={1} />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setImportRows([]);
                  setFile(null);
                }}
              >
                Clear &amp; Upload New File
              </Button>
            </Box>

            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerCell} style={{ minWidth: 40 }}>
                      #
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 160 }}>
                      Patient
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 200 }}>
                      Recipient
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 160 }}>
                      Relationship
                    </TableCell>
                    <TableCell className={classes.headerCell} style={{ minWidth: 200 }}>
                      Patient Code <span className={classes.requiredStar}>*</span>
                    </TableCell>
                    <TableCell
                      className={classes.headerCell}
                      style={{ minWidth: 70, textAlign: "center" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importRows.map((row, index) => {
                    const isIncomplete = !row.patientId;
                    return (
                      <TableRow
                        key={row.id}
                        className={isIncomplete ? classes.errorRow : classes.completeRow}
                      >
                        <TableCell className={classes.tableCell}>{index + 1}</TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          {row.patientName || row.patientRaw || "—"}
                        </TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          {row.recipientName || "—"}
                        </TableCell>
                        <TableCell className={`${classes.tableCell} ${classes.previewColumn}`}>
                          {row.relationship || "—"}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <FormControl size="small" fullWidth className={classes.selectControl}>
                            <Select
                              value={row.patientId || ""}
                              onChange={(e) => handlePatientChange(index, e.target.value)}
                              displayEmpty
                              variant="outlined"
                            >
                              <MenuItem value="" disabled>
                                <em>— Select Patient Code —</em>
                              </MenuItem>
                              {(patientOptions || []).map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                  {patient.patientCd}
                                  {patient.patientName ? ` - ${patient.patientName}` : ""}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell className={classes.tableCell} style={{ textAlign: "center" }}>
                          <IconButton
                            size="small"
                            className={classes.deleteButton}
                            onClick={() => handleDeleteRow(index)}
                            title="Delete row"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        {importRows.length > 0 && (
          <Button onClick={handleImport} color="primary" variant="contained">
            Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default UploadBereavementAdditionalInfoModal;

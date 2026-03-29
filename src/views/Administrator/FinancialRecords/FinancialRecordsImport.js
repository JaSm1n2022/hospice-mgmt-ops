import React, { useState, useEffect, useContext } from "react";
import {
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUpload, Save } from "@material-ui/icons";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { SupaContext } from "App";
import { supabaseClient } from "config/SupabaseClient";
import TOAST from "modules/toastManager";
import * as XLSX from "xlsx";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";

const useStyles = makeStyles((theme) => ({
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  uploadBox: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    "&:hover": {
      borderColor: "#4caf50",
      backgroundColor: "#f5f5f5",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    "& th": {
      backgroundColor: "#f5f5f5",
      padding: "12px",
      textAlign: "left",
      borderBottom: "2px solid #ddd",
      fontWeight: "600",
    },
    "& td": {
      padding: "10px 12px",
      borderBottom: "1px solid #eee",
    },
    "& tr:hover": {
      backgroundColor: "#fafafa",
    },
  },
  selectPatient: {
    minWidth: "150px",
  },
}));

const FinancialRecordsImport = () => {
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("success");

  useEffect(() => {
    fetchPatients();
  }, []);

  const showNotification = (message, color = "success") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setNotification(true);

    setTimeout(() => {
      setNotification(false);
    }, 4000);
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("patients")
        .select("id, patientCd, name")
        .eq("companyId", context.userProfile?.companyId)
        .order("patientCd");

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("[Fetch Patients Error]", error);
      showNotification("Failed to load patients", "danger");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      showNotification("Please upload an Excel file (.xlsx or .xls)", "danger");
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // Map Excel columns to our format
          const mappedData = jsonData.map((row, index) => ({
            id: index,
            patient_cd: null, // Will be selected by user
            patient_name: row.Patient || row.patient || "",
            payer: row.Payer || row.payer || "",
            period: row.Period || row.period || "",
            date_billed: row["Date Billed"] || row.date_billed || "",
            amt_billed: parseFloat(row["Amt Billed"] || row.amt_billed || 0),
            status: row.Status || row.status || "",
            pay_date: row["Pay Date"] || row.pay_date || "",
            amt_paid: parseFloat(row["Amt Paid"] || row.amt_paid || 0),
            seq_adj: row["Seq/Adj"] || row.seq_adj || "",
            soc: row.SOC || row.soc || "",
            authorized: row.Authorized || row.authorized || "",
          }));

          setExtractedData(mappedData);
          showNotification(`Successfully extracted ${mappedData.length} rows`, "success");
        } catch (parseError) {
          console.error("[Parse Error]", parseError);
          showNotification("Failed to parse Excel file", "danger");
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        showNotification("Failed to read file", "danger");
        setUploading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("[File Upload Error]", error);
      showNotification("Failed to process file", "danger");
      setUploading(false);
    }
  };

  const handlePatientSelection = (rowId, patientCd) => {
    setExtractedData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, patient_cd: patientCd } : row
      )
    );
  };

  const handleSaveRecords = async () => {
    // Filter rows with patient_cd selected
    const recordsToSave = extractedData.filter((row) => row.patient_cd);

    if (recordsToSave.length === 0) {
      showNotification("Please select at least one patient before saving", "warning");
      return;
    }

    try {
      setSaving(true);

      // Prepare records for Supabase
      const formattedRecords = recordsToSave.map((row) => ({
        patient_cd: row.patient_cd,
        patient_name: row.patient_name,
        payer: row.payer,
        period: row.period,
        date_billed: row.date_billed,
        amt_billed: row.amt_billed,
        status: row.status,
        pay_date: row.pay_date,
        amt_paid: row.amt_paid,
        seq_adj: row.seq_adj,
        soc: row.soc,
        authorized: row.authorized,
        company_id: context.userProfile?.companyId,
        created_by: context.userProfile?.id,
        created_at: new Date().toISOString(),
      }));

      const { data, error } = await supabaseClient
        .from("financial_records")
        .insert(formattedRecords);

      if (error) throw error;

      showNotification(
        `Successfully saved ${recordsToSave.length} financial record(s)`,
        "success"
      );

      // Clear the table
      setExtractedData([]);
    } catch (error) {
      console.error("[Save Records Error]", error);
      showNotification(
        error.message || "Failed to save records. Please try again.",
        "danger"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}>
                Import Financial Records from Excel
              </h4>
            </CardHeader>
            <CardBody>
              <div className={classes.uploadBox}>
                <input
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  id="excel-upload-button"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label htmlFor="excel-upload-button">
                  <Button
                    component="span"
                    color="info"
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                  >
                    {uploading ? "Processing..." : "Upload Excel File"}
                  </Button>
                </label>
                <p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
                  Upload an Excel file (.xlsx or .xls) with financial records
                </p>
              </div>

              {extractedData.length > 0 && (
                <>
                  <div style={{ marginTop: "30px", marginBottom: "20px" }}>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <h5 style={{ margin: 0 }}>
                          {extractedData.length} record(s) extracted
                        </h5>
                      </Grid>
                      <Grid item>
                        <Button
                          color="success"
                          onClick={handleSaveRecords}
                          disabled={saving || extractedData.filter(r => r.patient_cd).length === 0}
                          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        >
                          {saving
                            ? "Saving..."
                            : `Save ${extractedData.filter(r => r.patient_cd).length} Record(s)`}
                        </Button>
                      </Grid>
                    </Grid>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table className={classes.table}>
                      <thead>
                        <tr>
                          <th>Select Patient</th>
                          <th>Patient (from Excel)</th>
                          <th>Payer</th>
                          <th>Period</th>
                          <th>Date Billed</th>
                          <th>Amt Billed</th>
                          <th>Status</th>
                          <th>Pay Date</th>
                          <th>Amt Paid</th>
                          <th>Seq/Adj</th>
                          <th>SOC</th>
                          <th>Authorized</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedData.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <FormControl className={classes.selectPatient}>
                                <Select
                                  value={row.patient_cd || ""}
                                  onChange={(e) =>
                                    handlePatientSelection(row.id, e.target.value)
                                  }
                                  displayEmpty
                                >
                                  <MenuItem value="" disabled>
                                    Select...
                                  </MenuItem>
                                  {patients.map((patient) => (
                                    <MenuItem
                                      key={patient.id}
                                      value={patient.patientCd}
                                    >
                                      {patient.patientCd} - {patient.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </td>
                            <td>{row.patient_name}</td>
                            <td>{row.payer}</td>
                            <td>{row.period}</td>
                            <td>{row.date_billed}</td>
                            <td>${row.amt_billed.toFixed(2)}</td>
                            <td>{row.status}</td>
                            <td>{row.pay_date}</td>
                            <td>${row.amt_paid.toFixed(2)}</td>
                            <td>{row.seq_adj}</td>
                            <td>{row.soc}</td>
                            <td>{row.authorized}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

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
};

export default FinancialRecordsImport;

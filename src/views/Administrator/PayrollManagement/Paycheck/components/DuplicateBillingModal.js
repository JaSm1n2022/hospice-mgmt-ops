import React, { useState, useEffect } from "react";
import {
  Modal,
  makeStyles,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp, Warning } from "@material-ui/icons";
import DuplicateBillingDocument from "./DuplicateBillingDocument";
import moment from "moment";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: 600,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  closeIcon: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  content: {
    padding: "20px",
    flex: 1,
    overflow: "auto",
  },
  summaryBox: {
    backgroundColor: "#fff3cd",
    border: "2px solid #ffc107",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  summaryTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#856404",
    marginBottom: "10px",
  },
  summaryStats: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "12px",
    color: "#856404",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#856404",
  },
  warningValue: {
    color: "#d32f2f",
  },
  tableContainer: {
    maxHeight: "400px",
    marginBottom: "20px",
  },
  duplicateGroupHeader: {
    backgroundColor: "#ffebee",
    fontWeight: 700,
  },
  duplicateRecord: {
    backgroundColor: "#fafafa",
  },
  duplicateCount: {
    fontWeight: 700,
    color: "#d32f2f",
  },
  noDuplicatesBox: {
    backgroundColor: "#d4edda",
    border: "2px solid #28a745",
    padding: "40px",
    borderRadius: "4px",
    textAlign: "center",
  },
  noDuplicatesText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#155724",
    marginBottom: "10px",
  },
  noDuplicatesSubtext: {
    fontSize: "14px",
    color: "#155724",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#d32f2f",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
  },
}));

function DuplicateBillingModal({ isOpen, onClose, payrollData, logoBase64 }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [error, setError] = useState(null);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDuplicates, setTotalDuplicates] = useState(0);

  useEffect(() => {
    if (payrollData && payrollData.length > 0) {
      const { groups, totalRecs, totalDups } = detectDuplicates(payrollData);
      setDuplicateGroups(groups);
      setTotalRecords(totalRecs);
      setTotalDuplicates(totalDups);
    }
  }, [payrollData]);

  const detectDuplicates = (data) => {
    // Step 1: Expand records - split DOS array into individual entries
    const expandedRecords = [];

    data.forEach((record) => {
      if (Array.isArray(record.dos) && record.dos.length > 0) {
        // Each date in the dos array creates a separate entry
        record.dos.forEach((dosDate) => {
          expandedRecords.push({
            ...record,
            dosDate: dosDate, // Single date from array
            dosDisplay: Array.isArray(record.dos) ? record.dos.join(", ") : dosDate,
          });
        });
      } else if (record.dos) {
        // Handle case where dos might not be an array
        expandedRecords.push({
          ...record,
          dosDate: record.dos,
          dosDisplay: record.dos,
        });
      }
    });

    // Step 2: Group by DOS + Service Type + Client + Employee
    const grouped = {};

    expandedRecords.forEach((record) => {
      // Create unique key
      const key = `${record.dosDate}|${record.serviceType}|${record.patientCd}|${record.employeeName}`;

      if (!grouped[key]) {
        grouped[key] = {
          dos: moment(record.dosDate).format("MM/DD/YYYY"),
          serviceType: record.serviceType || "N/A",
          client: record.patientCd || "N/A",
          employee: record.employeeName || "N/A",
          records: [],
        };
      }

      grouped[key].records.push(record);
    });

    // Step 3: Filter only groups with 2+ records (duplicates)
    const duplicateGroups = [];
    let totalDuplicateRecords = 0;

    Object.values(grouped).forEach((group) => {
      if (group.records.length >= 2) {
        group.count = group.records.length;
        duplicateGroups.push(group);
        totalDuplicateRecords += group.records.length;
      }
    });

    // Sort by count (highest first)
    duplicateGroups.sort((a, b) => b.count - a.count);

    return {
      groups: duplicateGroups,
      totalRecs: data.length,
      totalDups: totalDuplicateRecords,
    };
  };

  if (!payrollData || payrollData.length === 0) {
    return null;
  }

  const fileName = `Duplicate_Billing_Report_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;
  const hasDuplicates = duplicateGroups.length > 0;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>
            <Warning /> Duplicate Billing Report
          </h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>

        <div className={classes.content}>
          {/* Summary Box */}
          <div className={classes.summaryBox}>
            <div className={classes.summaryTitle}>Report Summary</div>
            <div className={classes.summaryStats}>
              <div className={classes.statItem}>
                <span className={classes.statLabel}>Total Records Analyzed</span>
                <span className={classes.statValue}>{totalRecords}</span>
              </div>
              <div className={classes.statItem}>
                <span className={classes.statLabel}>Duplicate Records Found</span>
                <span className={`${classes.statValue} ${classes.warningValue}`}>
                  {totalDuplicates}
                </span>
              </div>
              <div className={classes.statItem}>
                <span className={classes.statLabel}>Duplicate Groups</span>
                <span className={`${classes.statValue} ${classes.warningValue}`}>
                  {duplicateGroups.length}
                </span>
              </div>
            </div>
          </div>

          {hasDuplicates ? (
            <>
              <Typography variant="h6" gutterBottom style={{ color: "#d32f2f", fontWeight: 600 }}>
                Duplicate Billing Entries
              </Typography>
              <Typography variant="body2" gutterBottom style={{ marginBottom: 20, color: "#666" }}>
                Records grouped by DOS (split from array), Service Type, Client, and Employee. Groups with 2+ entries are shown below.
              </Typography>

              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>DOS</strong></TableCell>
                      <TableCell><strong>Service Type</strong></TableCell>
                      <TableCell><strong>Client</strong></TableCell>
                      <TableCell><strong>Employee</strong></TableCell>
                      <TableCell align="center"><strong>Pay Date</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {duplicateGroups.map((group, groupIndex) => (
                      <React.Fragment key={groupIndex}>
                        {/* Group Header */}
                        <TableRow className={classes.duplicateGroupHeader}>
                          <TableCell colSpan={5}>
                            <strong>
                              {group.dos} | {group.serviceType} | {group.client} | {group.employee}
                            </strong>
                          </TableCell>
                          <TableCell align="right" className={classes.duplicateCount}>
                            {group.count} duplicates
                          </TableCell>
                        </TableRow>
                        {/* Individual Records */}
                        {group.records.map((record, recordIndex) => (
                          <TableRow key={recordIndex} className={classes.duplicateRecord}>
                            <TableCell>{record.dosDisplay || group.dos}</TableCell>
                            <TableCell>{record.serviceType || group.serviceType}</TableCell>
                            <TableCell>{record.patientCd || group.client}</TableCell>
                            <TableCell>{record.employeeName || group.employee}</TableCell>
                            <TableCell align="center">
                              {record.payDate ? moment(record.payDate).format("MM/DD/YYYY") : "-"}
                            </TableCell>
                            <TableCell align="right">${record.payAmount || "0.00"}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <div className={classes.noDuplicatesBox}>
              <Typography className={classes.noDuplicatesText}>
                ✓ No Duplicate Billing Found
              </Typography>
              <Typography className={classes.noDuplicatesSubtext}>
                All billing records are unique based on DOS, Service Type, Client, and Employee combination.
              </Typography>
            </div>
          )}
        </div>

        <div className={classes.footer}>
          <Typography variant="caption" style={{ color: "#666" }}>
            Duplicates detected by matching DOS (from array), Service Type, Client, and Employee
          </Typography>

          <PDFDownloadLink
            document={
              <DuplicateBillingDocument
                duplicateGroups={duplicateGroups}
                logoBase64={logoBase64}
                totalRecords={totalRecords}
                totalDuplicates={totalDuplicates}
              />
            }
            fileName={fileName}
            className={classes.downloadButton}
          >
            {({ blob, url, loading, error: pdfError }) => {
              if (pdfError) {
                console.error("PDF Generation Error:", pdfError);
                setError(pdfError);
              }
              return loading ? (
                <>
                  <CircularProgress size={20} style={{ color: "white" }} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <GetApp />
                  Download PDF Report
                </>
              );
            }}
          </PDFDownloadLink>

          {error && (
            <Typography className={classes.errorText}>
              Error generating PDF: {error.message}
            </Typography>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DuplicateBillingModal;

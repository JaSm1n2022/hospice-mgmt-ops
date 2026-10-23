import React from "react";
import {
  Modal,
  makeStyles,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { Clear, CloudUpload, GetApp } from "@material-ui/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";
import CustomTextField from "components/TextField/CustomTextField";
import PatientScheduledVisitsDocument from "./PatientScheduledVisitsDocument";
import UploadAdditionalInfoModal from "./UploadAdditionalInfoModal";

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
    width: "92%",
    maxWidth: "1300px",
    maxHeight: "90vh",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#152238",
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
  },
  closeIcon: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  accentBar: {
    height: 4,
    backgroundColor: "#2BAE76",
  },
  content: {
    padding: "20px",
    flex: 1,
    overflow: "auto",
  },
  description: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  fieldsRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  fieldItem: {
    flex: "1 1 200px",
    minWidth: "180px",
  },
  summaryRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  summaryBox: {
    flex: "1 1 160px",
    backgroundColor: "#F3F6FA",
    borderRadius: "4px",
    padding: "10px 14px",
  },
  summaryLabel: {
    fontSize: "10px",
    color: "#64748B",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    marginBottom: "2px",
  },
  summaryValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#152238",
  },
  tableContainer: {
    maxHeight: "400px",
    overflowX: "auto",
    "& .MuiTable-root": {
      minWidth: 1200,
    },
  },
  emptyBox: {
    backgroundColor: "#f5f5f5",
    padding: "40px",
    borderRadius: "4px",
    textAlign: "center",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#152238",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#0D1726",
    },
  },
  confirmedChip: {
    backgroundColor: "#D9F2E3",
    color: "#176B43",
    fontWeight: 600,
    marginRight: 4,
    marginBottom: 4,
  },
  projectedChip: {
    backgroundColor: "#FBEAC6",
    color: "#8A6116",
    fontWeight: 600,
    marginRight: 4,
    marginBottom: 4,
  },
  needsConfirmationChip: {
    backgroundColor: "#ECECEC",
    color: "#5A5A5A",
    fontStyle: "italic",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
  },
}));

function PatientScheduledVisitsModal({ isOpen, onClose, buildScheduleData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [additionalInfoMap, setAdditionalInfoMap] = React.useState({});
  const [periodFrom, setPeriodFrom] = React.useState(
    moment().format("YYYY-MM-DD")
  );
  const [periodTo, setPeriodTo] = React.useState(
    moment().add(29, "days").format("YYYY-MM-DD")
  );

  const data =
    (typeof buildScheduleData === "function" &&
      buildScheduleData(periodFrom, periodTo)) ||
    {};
  const patients = (data.patients || []).map((p) => ({
    ...p,
    ...(additionalInfoMap[p.id] || {}),
  }));

  const patientOptions = patients.map((p) => ({
    id: p.id,
    patientCd: p.patientCd,
    patientName: p.patientName,
  }));

  const handleImportAdditionalInfo = (importedRows) => {
    setAdditionalInfoMap((prev) => {
      const next = { ...prev };
      (importedRows || []).forEach((info) => {
        next[info.patientId] = {
          ...(next[info.patientId] || {}),
          ...(info.patientName ? { patientName: info.patientName } : {}),
        };
      });
      return next;
    });
    setIsUploadModalOpen(false);
  };

  const fileName = `Patient_Scheduled_Visits_${moment().format(
    "YYYY-MM-DD_HHmmss"
  )}.pdf`;

  const handlePeriodFromChange = (e) => {
    const value = e.target.value;
    setPeriodFrom(value);
    if (value && periodTo && moment(value).isAfter(moment(periodTo))) {
      setPeriodTo(value);
    }
  };

  const handlePeriodToChange = (e) => {
    const value = e.target.value;
    setPeriodTo(value);
    if (value && periodFrom && moment(value).isBefore(moment(periodFrom))) {
      setPeriodFrom(value);
    }
  };

  const periodLabel =
    data.periodStart && data.periodEnd
      ? `${moment(data.periodStart).format("MMM D")} – ${moment(
          data.periodEnd
        ).format("MMM D, YYYY")}`
      : "—";

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div style={modalStyle} className={classes.paper}>
          <div className={classes.header}>
            <h3 className={classes.headerTitle}>Patient Scheduled Visits</h3>
            <Clear className={classes.closeIcon} onClick={onClose} />
          </div>
          <div className={classes.accentBar} />

          <div className={classes.content}>
            <Typography className={classes.description}>
              Projected visit schedule for active clients for the selected
              date range, based on assigned disciplines, visit frequency, and
              suggested visit days. Confirmed visits (from the scheduling
              system) are shown in green; auto-projected visits are shown in
              amber and require staff verification.
            </Typography>

            <div className={classes.fieldsRow}>
              <div className={classes.fieldItem}>
                <CustomTextField
                  label="Period Start"
                  type="date"
                  name="periodFrom"
                  value={periodFrom}
                  onChange={handlePeriodFromChange}
                />
              </div>
              <div className={classes.fieldItem}>
                <CustomTextField
                  label="Period End"
                  type="date"
                  name="periodTo"
                  value={periodTo}
                  onChange={handlePeriodToChange}
                />
              </div>
              <div className={classes.fieldItem}>
                <CustomTextField
                  label="Medicare Provider No. (CCN)"
                  placeholder="e.g. 29XXXX"
                  name="ccn"
                  value={ccn}
                  onChange={(e) => setCcn(e.target.value)}
                />
              </div>
              <div className={classes.fieldItem}>
                <CustomTextField
                  label="Prepared By"
                  placeholder="Preparer name"
                  name="preparedBy"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                />
              </div>
              <div className={classes.fieldItem}>
                <CustomTextField
                  label="Reviewed By"
                  placeholder="Reviewer name"
                  name="reviewedBy"
                  value={reviewedBy}
                  onChange={(e) => setReviewedBy(e.target.value)}
                />
              </div>
            </div>

            <div className={classes.summaryRow}>
              <div className={classes.summaryBox}>
                <div className={classes.summaryLabel}>Schedule Period</div>
                <div className={classes.summaryValue}>{periodLabel}</div>
              </div>
              <div className={classes.summaryBox}>
                <div className={classes.summaryLabel}>Patients Shown</div>
                <div className={classes.summaryValue}>
                  {data.totalPatients || 0}
                </div>
              </div>
              <div className={classes.summaryBox}>
                <div className={classes.summaryLabel}>Confirmed Visits</div>
                <div className={classes.summaryValue}>
                  {data.totalConfirmed || 0}
                </div>
              </div>
              <div className={classes.summaryBox}>
                <div className={classes.summaryLabel}>Projected Visits</div>
                <div className={classes.summaryValue}>
                  {data.totalProjected || 0}
                </div>
              </div>
            </div>

            {patients.length ? (
              <TableContainer
                component={Paper}
                className={classes.tableContainer}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Patient / Care Location</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Discipline / Staff</strong>
                      </TableCell>
                      <TableCell>
                        <strong>POC Frequency</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Visit Dates • Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient) =>
                      (patient.disciplines || []).map((d, dIdx) => (
                        <TableRow key={`${patient.id}-${dIdx}`}>
                          <TableCell>
                            {dIdx === 0 ? (
                              <>
                                <div style={{ fontWeight: 600 }}>
                                  {patient.patientCd}
                                </div>
                                {patient.patientName ? (
                                  <div style={{ fontSize: 12, color: "#555" }}>
                                    {patient.patientName}
                                  </div>
                                ) : null}
                                {patient.careLocation ? (
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: "#888",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {patient.careLocation}
                                  </div>
                                ) : null}
                              </>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <div style={{ fontWeight: 600 }}>
                              {d.disciplinePosition}
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              {d.disciplineName || "Unassigned"}
                            </div>
                          </TableCell>
                          <TableCell>{d.frequencyLabel}</TableCell>
                          <TableCell>
                            {d.needsConfirmation ? (
                              <Chip
                                size="small"
                                label="Needs Scheduling Confirmation"
                                className={classes.needsConfirmationChip}
                              />
                            ) : (
                              (d.visits || []).map((v, vIdx) => (
                                <Chip
                                  key={vIdx}
                                  size="small"
                                  label={moment(v.date).format("MMM D")}
                                  className={
                                    v.status === "confirmed"
                                      ? classes.confirmedChip
                                      : classes.projectedChip
                                  }
                                />
                              ))
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className={classes.emptyBox}>
                <Typography>
                  No active clients with applicable discipline assignments
                  were found for this schedule period.
                </Typography>
              </div>
            )}

            {error && (
              <Typography className={classes.errorText}>
                Error generating PDF: {error.message}
              </Typography>
            )}
          </div>

          <div className={classes.footer}>
            <Button color="info" onClick={() => setIsUploadModalOpen(true)}>
              <CloudUpload style={{ marginRight: 6 }} /> Add Additional
              Information
            </Button>

            <PDFDownloadLink
              key={`${ccn}-${preparedBy}-${reviewedBy}-${periodFrom}-${periodTo}-${patients.length}-${JSON.stringify(
                additionalInfoMap
              )}`}
              document={
                <PatientScheduledVisitsDocument
                  scheduleData={{ ...data, patients }}
                  ccn={ccn}
                  preparedBy={preparedBy}
                  reviewedBy={reviewedBy}
                />
              }
              fileName={fileName}
              className={classes.downloadButton}
            >
              {({ loading, error: pdfError }) => {
                if (pdfError) {
                  console.error("PDF Generation Error:", pdfError);
                  setError(pdfError);
                }
                return loading ? (
                  <>
                    <CircularProgress size={18} style={{ color: "white" }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <GetApp /> Print Pdf
                  </>
                );
              }}
            </PDFDownloadLink>
          </div>
        </div>
      </Modal>

      <UploadAdditionalInfoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        patientOptions={patientOptions}
        onImport={handleImportAdditionalInfo}
      />
    </>
  );
}

export default PatientScheduledVisitsModal;

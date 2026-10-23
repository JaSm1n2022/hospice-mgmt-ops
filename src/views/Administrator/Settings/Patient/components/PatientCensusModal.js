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
import PatientCensusDocument from "./PatientCensusDocument";
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
    backgroundColor: "#163B2A",
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
  tableContainer: {
    maxHeight: "400px",
    overflowX: "auto",
    "& .MuiTable-root": {
      minWidth: 1300,
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
    backgroundColor: "#163B2A",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#0F2A1D",
    },
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
  },
}));

function PatientCensusModal({ isOpen, onClose, censusData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");
  const [additionalInfoMap, setAdditionalInfoMap] = React.useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const rows = censusData || [];
  const mergedRows = rows.map((row) => ({
    ...row,
    ...(additionalInfoMap[row.id] || {}),
  }));

  const handleImportAdditionalInfo = (importedRows) => {
    setAdditionalInfoMap((prev) => {
      const next = { ...prev };
      (importedRows || []).forEach((info) => {
        next[info.patientId] = {
          ...(next[info.patientId] || {}),
          ...(info.patientName ? { patientName: info.patientName } : {}),
          admittingDiagnosis: info.admittingDiagnosis,
          locationName: info.locationName,
          locationAddress: info.locationAddress,
          locationCity: info.locationCity,
          locationState: info.locationState,
          locationPostal: info.locationPostal,
        };
      });
      return next;
    });
    setIsUploadModalOpen(false);
  };

  const fileName = `Patient_Census_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <>
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Patient Census</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>

        <div className={classes.content}>
          <Typography className={classes.description}>
            Clients currently on service (no EOC on file).
          </Typography>

          <div className={classes.fieldsRow}>
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

          {mergedRows.length ? (
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Client Code</strong></TableCell>
                    <TableCell><strong>Patient Name</strong></TableCell>
                    <TableCell><strong>SOC</strong></TableCell>
                    <TableCell><strong>Level of Care</strong></TableCell>
                    <TableCell><strong>Admitting Diagnosis</strong></TableCell>
                    <TableCell><strong>Disciplines Providing Care</strong></TableCell>
                    <TableCell><strong>Location Name</strong></TableCell>
                    <TableCell><strong>Location Address</strong></TableCell>
                    <TableCell><strong>Location City</strong></TableCell>
                    <TableCell><strong>Location State</strong></TableCell>
                    <TableCell><strong>Location Postal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mergedRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.patientCd}</TableCell>
                      <TableCell>{row.patientName || "-"}</TableCell>
                      <TableCell>
                        {row.soc ? moment(row.soc).format("MM/DD/YYYY") : ""}
                      </TableCell>
                      <TableCell>{row.levelOfCare}</TableCell>
                      <TableCell>{row.admittingDiagnosis || "-"}</TableCell>
                      <TableCell>
                        {row.disciplines && row.disciplines.length ? (
                          row.disciplines.map((d, idx) => (
                            <Chip
                              key={idx}
                              size="small"
                              label={`${d.name}${d.position ? ` (${d.position})` : ""}`}
                              style={{ marginRight: 4, marginBottom: 4 }}
                            />
                          ))
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{row.locationName || "-"}</TableCell>
                      <TableCell>{row.locationAddress || "-"}</TableCell>
                      <TableCell>{row.locationCity || "-"}</TableCell>
                      <TableCell>{row.locationState || "-"}</TableCell>
                      <TableCell>{row.locationPostal || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.emptyBox}>
              <Typography>No clients without an EOC were found.</Typography>
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
            <CloudUpload style={{ marginRight: 6 }} /> Upload Additional Information
          </Button>

          <PDFDownloadLink
            key={`${ccn}-${preparedBy}-${reviewedBy}-${mergedRows.length}`}
            document={
              <PatientCensusDocument
                censusData={mergedRows}
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
                  <GetApp /> Print Report
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
      patientOptions={rows}
      onImport={handleImportAdditionalInfo}
    />
    </>
  );
}

export default PatientCensusModal;

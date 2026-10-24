import React from "react";
import { Modal, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clear, GetApp } from "@material-ui/icons";
import moment from "moment";
import CustomTextField from "components/TextField/CustomTextField";
import { EMPLOYEE_POSITION } from "utils/constants";
import PersonnelListDocument from "./PersonnelListDocument";

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
    width: "960px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#e91e63",
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
    padding: "30px",
  },
  description: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  fieldsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  fieldItem: {
    minWidth: "200px",
  },
  stats: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  },
  statLabel: {
    color: "#666",
  },
  statValue: {
    fontWeight: 600,
    color: "#333",
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: "20px",
    maxHeight: "320px",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  th: {
    backgroundColor: "#26935B",
    color: "white",
    padding: "6px 8px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "6px 8px",
    borderBottom: "1px solid #eee",
  },
  rowAlt: {
    backgroundColor: "#f4f6f8",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#e8f4ed",
    color: "#1f6b46",
    fontWeight: 600,
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  downloadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    backgroundColor: "#e91e63",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    width: "100%",
    justifyContent: "center",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#d81b60",
    },
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "13px",
    marginTop: "10px",
  },
}));

const POSITION_DISCIPLINE = EMPLOYEE_POSITION.reduce((map, p) => {
  map[p.value] = p.alias || p.value;
  return map;
}, {});

const NO_DISCIPLINE_POSITIONS = [
  "CEO",
  "Office Staff",
  "Administrative Manager",
  "Administrator",
  "Director Community Liaison",
];

const getDiscipline = (position) => {
  if (NO_DISCIPLINE_POSITIONS.includes(position)) return "-";
  return POSITION_DISCIPLINE[position] || position || "N/A";
};

const buildPersonnelRegister = (employeesData) => {
  const activeEmployees = (employeesData || []).filter(
    (emp) => (emp.status || "").toLowerCase() === "active"
  );

  const rows = activeEmployees
    .map((emp) => ({
      name: emp.name || `${emp.fn || ""} ${emp.ln || ""}`.trim() || "N/A",
      position: emp.position || "N/A",
      discipline: getDiscipline(emp.position),
      startDate: emp.dateHired ? moment(emp.dateHired).format("MM/DD/YYYY") : "N/A",
      classification: emp.employeeType || "N/A",
      status: emp.status || "N/A",
      isContractor:
        emp.position === "Contractor" ||
        emp.employeeType === "Contractor" ||
        emp.employeeType === "Direct-Care Contractor",
      isVolunteer: emp.position === "Volunteer" || emp.employeeType === "Volunteer",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeEmployeeCount = rows.filter((r) => !r.isContractor && !r.isVolunteer).length;
  const directCareContractors = rows.filter((r) => r.isContractor).length;
  const activeVolunteers = rows.filter((r) => r.isVolunteer).length;
  const totalPersonnel = rows.length;

  return { rows, activeEmployeeCount, directCareContractors, activeVolunteers, totalPersonnel };
};

function PrintPersonnelListModal({ isOpen, onClose, employeesData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [error, setError] = React.useState(null);
  const [ccn, setCcn] = React.useState("");
  const [preparedBy, setPreparedBy] = React.useState("");
  const [reviewedBy, setReviewedBy] = React.useState("");

  if (!employeesData || employeesData.length === 0) {
    return null;
  }

  const { rows, activeEmployeeCount, directCareContractors, activeVolunteers, totalPersonnel } =
    buildPersonnelRegister(employeesData);

  const fileName = `Personnel_List_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 className={classes.headerTitle}>Personnel List</h3>
          <Clear className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.content}>
          <Typography className={classes.description}>
            Generates a current roster of active employees, direct-care contractors,
            and volunteers as of today, formatted for ACHC Medicare recertification
            survey review.
          </Typography>

          <div className={classes.fieldsRow}>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Medicare Provider No. (CCN)"
                name="ccn"
                value={ccn}
                onChange={(e) => setCcn(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Prepared By"
                name="preparedBy"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
              />
            </div>
            <div className={classes.fieldItem}>
              <CustomTextField
                label="Reviewed By"
                name="reviewedBy"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.stats}>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Active Employees:</span>
              <span className={classes.statValue}>{activeEmployeeCount}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Direct-Care Contractors:</span>
              <span className={classes.statValue}>{directCareContractors}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Active Volunteers:</span>
              <span className={classes.statValue}>{activeVolunteers}</span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statLabel}>Total Personnel:</span>
              <span className={classes.statValue}>{totalPersonnel}</span>
            </div>
          </div>

          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.th}>Name</th>
                  <th className={classes.th}>Position / Title</th>
                  <th className={classes.th}>Discipline</th>
                  <th className={classes.th}>Start Date</th>
                  <th className={classes.th}>Classification</th>
                  <th className={classes.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? classes.rowAlt : undefined}>
                    <td className={classes.td}>{row.name}</td>
                    <td className={classes.td}>{row.position}</td>
                    <td className={classes.td}>{row.discipline}</td>
                    <td className={classes.td}>{row.startDate}</td>
                    <td className={classes.td}>{row.classification}</td>
                    <td className={classes.td}>
                      <span className={classes.statusBadge}>
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className={classes.td} colSpan={6}>
                      No active personnel records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PDFDownloadLink
            key={`${ccn}-${preparedBy}-${reviewedBy}`}
            document={
              <PersonnelListDocument
                employeesData={employeesData}
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
                  <CircularProgress size={20} style={{ color: "white" }} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <GetApp />
                  Download Personnel List PDF
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

export default PrintPersonnelListModal;

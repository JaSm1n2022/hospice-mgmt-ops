import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Button from "components/CustomButtons/Button.js";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "800px",
  },
  section: {
    marginBottom: "10px",
  },
  checkboxItem: {
    marginBottom: "10px",
  },
  expirationField: {
    marginLeft: "40px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  warningChip: {
    marginLeft: "10px",
    backgroundColor: "#ff9800",
    color: "white",
  },
  expiredChip: {
    marginLeft: "10px",
    backgroundColor: "#f44336",
    color: "white",
  },
  completeChip: {
    marginLeft: "10px",
    backgroundColor: "#4caf50",
    color: "white",
  },
  sectionHeader: {
    fontWeight: "600",
    fontSize: "16px",
  },
}));

// Define checklist structure
const CHECKLIST_STRUCTURE = {
  section1: {
    title: "Section 1: Application Documents",
    items: [
      { key: "applicationForm", label: "Application Form", hasExpiration: false },
      { key: "resume", label: "Resume", hasExpiration: false },
    ],
  },
  section2: {
    title: "Section 2: License & Credentials",
    items: [
      { key: "licenseVerification", label: "License Verification", hasExpiration: true },
      { key: "diploma", label: "Diploma", hasExpiration: true },
      { key: "pli", label: "PLI (Professional Liability Insurance)", hasExpiration: true },
      { key: "ssc", label: "SSC (Social Security Card)", hasExpiration: false },
      { key: "cprCard", label: "CPR Card", hasExpiration: true },
      { key: "driversLicense", label: "Driver's License", hasExpiration: true },
      { key: "autoInsurance", label: "Auto Insurance", hasExpiration: true },
    ],
  },
  section3: {
    title: "Section 3: Employment Documents",
    items: [
      { key: "jobDescription", label: "Job Description", hasExpiration: false },
      { key: "offerLetter", label: "Offer Letter", hasExpiration: false },
      { key: "orientation", label: "Orientation", hasExpiration: false },
      { key: "competency", label: "Competency", hasExpiration: false },
      { key: "performanceEvaluations", label: "Performance Evaluations", hasExpiration: false },
    ],
  },
  section4: {
    title: "Section 4: Policies & Agreements",
    items: [
      { key: "confidentiality", label: "Confidentiality Agreement", hasExpiration: false },
      { key: "eSig", label: "E-Signature Agreement", hasExpiration: false },
      { key: "fieldPractices", label: "Field Practices Agreement", hasExpiration: false },
      { key: "handbook", label: "Employee Handbook", hasExpiration: false },
      { key: "compliance", label: "Compliance Agreement", hasExpiration: false },
      { key: "policies", label: "Policies Acknowledgment", hasExpiration: false },
      { key: "ppe", label: "PPE (Personal Protective Equipment)", hasExpiration: false },
      { key: "hipaa", label: "HIPAA Training & Agreement", hasExpiration: false },
    ],
  },
  section5: {
    title: "Section 5: Training & Education",
    items: [
      { key: "inServicesHire", label: "In-services (Hire)", hasExpiration: false },
      { key: "inServicesAnnual", label: "In-services (Annual)", hasExpiration: false },
      { key: "ceus", label: "CEUs (Continuing Education Units)", hasExpiration: false },
    ],
  },
  section6: {
    title: "Section 6: Health & Background",
    items: [
      { key: "physicalExam", label: "Physical Exam", hasExpiration: false },
      { key: "hepatitisB", label: "Hepatitis B Vaccination", hasExpiration: false },
      { key: "tbCxr", label: "TB/CXR (Chest X-Ray)", hasExpiration: false },
      { key: "tbQuestionnaire", label: "TB Questionnaire", hasExpiration: false },
      { key: "criminalHistory", label: "Criminal History Check", hasExpiration: false },
    ],
  },
  section7: {
    title: "Section 7: Background Verification",
    items: [
      { key: "backgroundCheck", label: "Background Check (NABS)", hasExpiration: false },
    ],
  },
  section8: {
    title: "Section 8: Tax & Employment Forms",
    items: [
      { key: "formI9", label: "Form I-9", hasExpiration: false },
      { key: "w4W9", label: "W4/W-9", hasExpiration: false },
    ],
  },
};

const ChecklistModal = ({ open, onClose, onSubmit, item, mode, employeeList }) => {
  const classes = useStyles();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [checklistData, setChecklistData] = useState({});

  // Initialize empty checklist
  const initializeChecklist = () => {
    const initialData = {};
    Object.keys(CHECKLIST_STRUCTURE).forEach((sectionKey) => {
      const section = CHECKLIST_STRUCTURE[sectionKey];
      section.items.forEach((checkItem) => {
        initialData[checkItem.key] = {
          checked: false,
          expirationDate: null,
        };
      });
    });
    return initialData;
  };

  useEffect(() => {
    if (item && mode === "edit") {
      // Load existing data
      setSelectedEmployee(item.employee || null);
      setChecklistData(item.checklistData || initializeChecklist());
    } else {
      // New checklist
      setSelectedEmployee(null);
      setChecklistData(initializeChecklist());
    }
  }, [item, mode, open]);

  const handleCheckboxChange = (itemKey) => (event) => {
    setChecklistData({
      ...checklistData,
      [itemKey]: {
        ...checklistData[itemKey],
        checked: event.target.checked,
      },
    });
  };

  const handleExpirationDateChange = (itemKey) => (event) => {
    setChecklistData({
      ...checklistData,
      [itemKey]: {
        ...checklistData[itemKey],
        expirationDate: event.target.value,
      },
    });
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return moment(dateString).isBefore(moment(), "day");
  };

  const isExpiringSoon = (dateString) => {
    if (!dateString) return false;
    const expirationDate = moment(dateString);
    const today = moment();
    const daysUntilExpiration = expirationDate.diff(today, "days");
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  };

  const getExpirationStatus = (checkItem) => {
    if (!checkItem.hasExpiration) return null;
    const itemData = checklistData[checkItem.key];

    if (!itemData || !itemData.checked) return null;

    if (!itemData.expirationDate) {
      return (
        <Chip
          icon={<WarningIcon />}
          label="Missing Date"
          size="small"
          className={classes.warningChip}
        />
      );
    }

    if (isExpired(itemData.expirationDate)) {
      return (
        <Chip
          icon={<WarningIcon />}
          label="Expired"
          size="small"
          className={classes.expiredChip}
        />
      );
    }

    if (isExpiringSoon(itemData.expirationDate)) {
      return (
        <Chip
          icon={<WarningIcon />}
          label="Expiring Soon"
          size="small"
          className={classes.warningChip}
        />
      );
    }

    return (
      <Chip
        icon={<CheckCircleIcon />}
        label="Valid"
        size="small"
        className={classes.completeChip}
      />
    );
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEmployeeChange = (event) => {
    // Handle clearing/changing employee selection
    if (!event.target.value) {
      setSelectedEmployee(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    onSubmit({
      employee: selectedEmployee,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.value || selectedEmployee.name || selectedEmployee.label,
      checklistData: checklistData,
    });
  };

  const renderChecklistItem = (checkItem) => {
    const itemData = checklistData[checkItem.key] || { checked: false, expirationDate: null };

    return (
      <Box key={checkItem.key} className={classes.checkboxItem}>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={itemData.checked}
                  onChange={handleCheckboxChange(checkItem.key)}
                  color="primary"
                />
              }
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  {checkItem.label}
                  {getExpirationStatus(checkItem)}
                </div>
              }
            />
          </Grid>
          {checkItem.hasExpiration && itemData.checked && (
            <Grid item xs={12}>
              <TextField
                type="date"
                label="Expiration Date"
                value={itemData.expirationDate || ""}
                onChange={handleExpirationDateChange(checkItem.key)}
                className={classes.expirationField}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                style={{ maxWidth: "300px" }}
                error={
                  itemData.checked &&
                  (!itemData.expirationDate || isExpired(itemData.expirationDate))
                }
                helperText={
                  itemData.checked && !itemData.expirationDate
                    ? "Expiration date required"
                    : itemData.checked && isExpired(itemData.expirationDate)
                    ? "This document has expired"
                    : ""
                }
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const renderSection = (sectionKey) => {
    const section = CHECKLIST_STRUCTURE[sectionKey];

    return (
      <Accordion key={sectionKey} defaultExpanded={false} className={classes.section}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.sectionHeader}>{section.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box style={{ width: "100%" }}>
            {section.items.map((checkItem) => renderChecklistItem(checkItem))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Edit HR Onboarding Checklist"
    : "Add HR Onboarding Checklist";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Box mb={2}>
          <CustomSingleAutoComplete
            placeholder="Select Employee"
            options={employeeList || []}
            value={selectedEmployee}
            onSelectHandler={handleEmployeeSelect}
            onChangeHandler={handleEmployeeChange}
            disabled={isEditMode}
          />
        </Box>

        <Box mt={2}>
          {Object.keys(CHECKLIST_STRUCTURE).map((sectionKey) =>
            renderSection(sectionKey)
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          {isViewMode ? "Close" : "Cancel"}
        </Button>
        {!isViewMode && (
          <Button onClick={handleSubmit} color="primary">
            Save Checklist
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistModal;

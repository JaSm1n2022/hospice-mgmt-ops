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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
    sectionFields: [
      {
        key: "reportTo",
        label: "Report To",
        type: "multiselect",
        options: [
          "Administrator",
          "DPCS",
          "Case Manager",
          "Volunteer Coordinator",
          "Community Liaison Director",
          "Governing Body",
          "Corporate Compliance Officer",
          "Administrative Manager",
          "Medical Director",
        ],
      },
    ],
    items: [
      {
        key: "applicationForm",
        label: "Application Form",
        hasExpiration: false,
      },
      { key: "resume", label: "Resume", hasExpiration: false },
    ],
  },
  section2: {
    title: "Section 2: License & Credentials",
    items: [
      {
        key: "licenseVerification",
        label: "License Verification",
        hasExpiration: true,
        extraFields: [
          { key: "number", label: "License Number", type: "text" },
          { key: "verifiedDate", label: "License Verified Date", type: "date" },
        ],
      },
      { key: "diploma", label: "Diploma", hasExpiration: false },
      {
        key: "pli",
        label: "PLI (Professional Liability Insurance)",
        hasExpiration: true,
      },
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
      {
        key: "orientation",
        label: "Orientation",
        hasExpiration: false,
        extraFields: [{ key: "date", label: "Orientation Date", type: "date" }],
      },
      {
        key: "competency",
        label: "Competency",
        hasExpiration: false,
        extraFields: [
          { key: "initialDate", label: "Initial Competency Date", type: "date" },
          { key: "lastDate", label: "Last Competency Date", type: "date" },
        ],
      },
      {
        key: "competencyEvaluation",
        label: "Competency Evaluation (Hands-on Skills)",
        hasExpiration: false,
      },
      {
        key: "performanceEvaluations",
        label: "Performance Evaluations",
        hasExpiration: false,
        extraFields: [
          { key: "date", label: "Performance Evaluation Date", type: "date" },
        ],
      },
      {
        key: "contract",
        label: "Contract",
        hasExpiration: true,
        expirationLabel: "Contract Expiration",
        extraFields: [{ key: "date", label: "Contract Date", type: "date" }],
      },
    ],
  },
  section4: {
    title: "Section 4: Policies & Agreements",
    sectionFields: [
      {
        key: "policyAcknowledgeDate",
        label: "Policy & Agreement Acknowledge Date",
        type: "date",
      },
    ],
    items: [
      {
        key: "confidentiality",
        label: "Confidentiality Agreement",
        hasExpiration: false,
      },
      { key: "eSig", label: "E-Signature Agreement", hasExpiration: false },
      {
        key: "fieldPractices",
        label: "Field Practices Agreement",
        hasExpiration: false,
      },
      { key: "handbook", label: "Employee Handbook", hasExpiration: false },
      {
        key: "compliance",
        label: "Compliance Agreement",
        hasExpiration: false,
      },
      {
        key: "policies",
        label: "Policies Acknowledgment",
        hasExpiration: false,
      },
      {
        key: "ppe",
        label: "PPE (Personal Protective Equipment)",
        hasExpiration: false,
      },
      {
        key: "hipaa",
        label: "HIPAA Training & Agreement",
        hasExpiration: false,
      },
    ],
  },
  section5: {
    title: "Section 5: Training & Education",
    items: [
      {
        key: "inServicesHire",
        label: "In-services (Hire)",
        hasExpiration: false,
      },
      {
        key: "inServicesAnnual",
        label: "In-services (Annual)",
        hasExpiration: false,
      },
      {
        key: "ceus",
        label: "CEUs (Continuing Education Units)",
        hasExpiration: false,
      },
      {
        key: "inserviceHours",
        label: "In-Service Hours (Last 12 Months)",
        hasExpiration: false,
        extraFields: [
          { key: "hours", label: "Hours (Last 12 Months)", type: "text" },
        ],
      },
      {
        key: "lastTraining",
        label: "Last Training",
        hasExpiration: false,
        extraFields: [
          { key: "date", label: "Last Training Date", type: "date" },
          { key: "topic", label: "Topic", type: "text" },
        ],
      },
    ],
  },
  section6: {
    title: "Section 6: Health & Background",
    items: [
      {
        key: "physicalExam",
        label: "Physical Exam",
        hasExpiration: false,
        extraFields: [
          { key: "date", label: "Physical Exam Date", type: "date" },
        ],
      },
      {
        key: "hepatitisB",
        label: "Hepatitis B Vaccination",
        hasExpiration: false,
      },
      {
        key: "tbCxr",
        label: "TB/CXR (Chest X-Ray)",
        hasExpiration: false,
        extraFields: [{ key: "date", label: "TB/CXR Date", type: "date" }],
      },
      {
        key: "tbQuestionnaire",
        label: "TB Questionnaire",
        hasExpiration: false,
        extraFields: [
          { key: "date", label: "TB Questionnaire Date", type: "date" },
        ],
      },
      {
        key: "criminalHistory",
        label: "Criminal History Check",
        hasExpiration: false,
      },
    ],
  },
  section7: {
    title: "Section 7: Background Verification",
    items: [
      {
        key: "backgroundCheck",
        label: "Background Check (NABS)",
        hasExpiration: false,
        extraFields: [
          { key: "date", label: "Background Check Date", type: "date" },
        ],
      },
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

const ChecklistModal = ({
  open,
  onClose,
  onSubmit,
  item,
  mode,
  employeeList,
}) => {
  const classes = useStyles();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [checklistData, setChecklistData] = useState({});
  const [status, setStatus] = useState("incomplete");
  const [completionDate, setCompletionDate] = useState("");

  // Initialize empty checklist
  const initializeChecklist = () => {
    const initialData = {};
    Object.keys(CHECKLIST_STRUCTURE).forEach((sectionKey) => {
      const section = CHECKLIST_STRUCTURE[sectionKey];
      (section.sectionFields || []).forEach((field) => {
        initialData[field.key] = field.type === "multiselect" ? [] : null;
      });
      section.items.forEach((checkItem) => {
        const fieldState = { checked: false, expirationDate: null };
        (checkItem.extraFields || []).forEach((field) => {
          fieldState[field.key] = null;
        });
        initialData[checkItem.key] = fieldState;
      });
    });
    return initialData;
  };

  useEffect(() => {
    if (item && mode === "edit") {
      // Load existing data
      setSelectedEmployee(item.employee || null);
      setChecklistData(item.checklistData || initializeChecklist());
      setStatus(item.status || "incomplete");
      setCompletionDate(item.completionDate || "");
    } else {
      // New checklist
      setSelectedEmployee(null);
      setChecklistData(initializeChecklist());
      setStatus("incomplete");
      setCompletionDate("");
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

  const handleExtraFieldChange = (itemKey, fieldKey) => (event) => {
    setChecklistData({
      ...checklistData,
      [itemKey]: {
        ...checklistData[itemKey],
        [fieldKey]: event.target.value,
      },
    });
  };

  const handleSectionFieldChange = (fieldKey) => (event) => {
    setChecklistData({
      ...checklistData,
      [fieldKey]: event.target.value,
    });
  };

  const handleSectionEmployeeSelect = (fieldKey) => (employee) => {
    setChecklistData({
      ...checklistData,
      [fieldKey]: employee,
    });
  };

  const handleSectionEmployeeChange = (fieldKey) => (event) => {
    if (!event.target.value) {
      setChecklistData({
        ...checklistData,
        [fieldKey]: null,
      });
    }
  };

  const handleSectionMultiSelectChange = (fieldKey) => (event) => {
    setChecklistData({
      ...checklistData,
      [fieldKey]: event.target.value,
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
      employeeName:
        selectedEmployee.value ||
        selectedEmployee.name ||
        selectedEmployee.label,
      employeePosition: selectedEmployee.position,
      checklistData: checklistData,
    });
  };

  const renderChecklistItem = (checkItem) => {
    const itemData = checklistData[checkItem.key] || {
      checked: false,
      expirationDate: null,
    };

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
                label={checkItem.expirationLabel || "Expiration Date"}
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
                  (!itemData.expirationDate ||
                    isExpired(itemData.expirationDate))
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
          {(checkItem.extraFields || []).map((field) =>
            itemData.checked ? (
              <Grid item xs={12} key={field.key}>
                <TextField
                  type={field.type}
                  label={field.label}
                  value={itemData[field.key] || ""}
                  onChange={handleExtraFieldChange(checkItem.key, field.key)}
                  className={classes.expirationField}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : undefined
                  }
                  fullWidth
                  style={{ maxWidth: "300px" }}
                  helperText={
                    itemData.checked && !itemData[field.key]
                      ? "Recommended"
                      : ""
                  }
                />
              </Grid>
            ) : null
          )}
        </Grid>
      </Box>
    );
  };

  const renderSectionField = (field) => {
    if (field.type === "multiselect") {
      const selectedValues = checklistData[field.key] || [];
      return (
        <Box key={field.key} mb={2} style={{ maxWidth: "400px" }}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              label={field.label}
              value={selectedValues}
              onChange={handleSectionMultiSelectChange(field.key)}
              renderValue={(selected) => (
                <Box display="flex" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      style={{ margin: "2px" }}
                    />
                  ))}
                </Box>
              )}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
    if (field.type === "employee") {
      return (
        <Box key={field.key} mb={2} style={{ maxWidth: "300px" }}>
          <Typography variant="body2" style={{ marginBottom: "4px" }}>
            {field.label}
          </Typography>
          <CustomSingleAutoComplete
            placeholder={field.label}
            options={employeeList || []}
            value={checklistData[field.key] || null}
            onSelectHandler={handleSectionEmployeeSelect(field.key)}
            onChangeHandler={handleSectionEmployeeChange(field.key)}
          />
        </Box>
      );
    }

    return (
      <Box key={field.key} mb={2}>
        <TextField
          type={field.type}
          label={field.label}
          value={checklistData[field.key] || ""}
          onChange={handleSectionFieldChange(field.key)}
          InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
          fullWidth
          style={{ maxWidth: "300px" }}
        />
      </Box>
    );
  };

  const renderSection = (sectionKey) => {
    const section = CHECKLIST_STRUCTURE[sectionKey];

    return (
      <Accordion
        key={sectionKey}
        defaultExpanded={false}
        className={classes.section}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.sectionHeader}>
            {section.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box style={{ width: "100%" }}>
            {(section.sectionFields || []).map((field) =>
              renderSectionField(field)
            )}
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

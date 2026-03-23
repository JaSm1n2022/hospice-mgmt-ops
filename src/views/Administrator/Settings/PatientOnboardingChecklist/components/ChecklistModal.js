import React, { useState, useEffect } from "react";
import {
  Modal,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
  Button as MuiButton,
} from "@material-ui/core";
import {
  ExpandMore,
  Clear,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
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
    maxHeight: "90%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    outline: "none",
    overflowY: "auto",
  },
  header: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  content: {
    padding: "20px",
  },
  accordion: {
    marginBottom: "10px",
  },
  accordionSummary: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dateField: {
    marginLeft: "40px",
    width: "200px",
  },
  pocEntry: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    position: "sticky",
    bottom: 0,
    backgroundColor: "white",
    zIndex: 1,
  },
}));

function ChecklistModal({ open, onClose, onSubmit, item, mode, patientList }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  // Patient selection
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Admission group
  const [admission, setAdmission] = useState({
    demographicSheet: { checked: false },
    hospiceEvalOrder: { checked: false },
    informedConsent: { checked: false },
    electionOfHospice: { checked: false },
    polstrDnr: { checked: false },
    changeOfHospice: { checked: false },
    poaAdvanceDirective: { checked: false },
    billOfRights: { checked: false },
    telehealthConsent: { checked: false },
    patientNotification: { checked: false },
  });

  // Assessment group
  const [assessment, setAssessment] = useState({
    nursing: { checked: false },
    spiritual: { checked: false },
    psychosocial: { checked: false },
  });

  // Treatment Order group
  const [treatmentOrder, setTreatmentOrder] = useState({
    treatmentOrder: { checked: false },
  });

  // Physician group
  const [physician, setPhysician] = useState({
    cti: { checked: false, date: "" },
    order: { checked: false, date: "" },
    f2fVisit: { checked: false, date: "" },
  });

  // IDG Notes
  const [idgNotes, setIdgNotes] = useState({
    date: "",
    createdUser: "",
  });

  // Skilled Nursing Notes
  const [skilledNursingNotes, setSkilledNursingNotes] = useState({
    date: "",
    createdUser: "",
  });

  // HA Notes
  const [haNotes, setHaNotes] = useState({
    date: "",
    createdUser: "",
  });

  // Miscellaneous group
  const [miscellaneous, setMiscellaneous] = useState({
    medicalRecords: { checked: false },
    dpoa: { checked: false },
    hp: { checked: false },
    eligibility: { checked: false },
    insuranceCard: { checked: false },
    id: { checked: false },
  });

  // Discharge group
  const [discharge, setDischarge] = useState({
    date: "",
    reason: "",
    documentation: { checked: false },
  });

  // Compliance group
  const [compliance, setCompliance] = useState({
    hopeAdmission: "",
    hopeHuv1: "",
    hopeHuv2: "",
    hopeDischarge: "",
    lcdEligibility: { checked: false },
  });

  // POC array
  const [poc, setPoc] = useState([]);

  // Initialize form with existing data
  useEffect(() => {
    if (mode === "edit" && item) {
      // Set patient
      const patient = patientList.find((p) => p.id === item.patientId);
      if (patient) {
        setSelectedPatient(patient);
      }

      // Set all groups
      setAdmission(item.admission || admission);
      setAssessment(item.assessment || assessment);
      setTreatmentOrder(item.treatmentOrder || treatmentOrder);
      setPhysician(item.physician || physician);
      setIdgNotes(item.idgNotes || idgNotes);
      setSkilledNursingNotes(item.skilledNursingNotes || skilledNursingNotes);
      setHaNotes(item.haNotes || haNotes);
      setMiscellaneous(item.miscellaneous || miscellaneous);
      setDischarge(item.discharge || discharge);
      setCompliance(item.compliance || compliance);
      setPoc(item.poc || []);
    } else {
      // Reset for create mode
      resetForm();
    }
  }, [item, mode, open]);

  const resetForm = () => {
    setSelectedPatient(null);
    setAdmission({
      demographicSheet: { checked: false },
      hospiceEvalOrder: { checked: false },
      informedConsent: { checked: false },
      electionOfHospice: { checked: false },
      polstrDnr: { checked: false },
      changeOfHospice: { checked: false },
      poaAdvanceDirective: { checked: false },
      billOfRights: { checked: false },
      telehealthConsent: { checked: false },
      patientNotification: { checked: false },
    });
    setAssessment({
      nursing: { checked: false },
      spiritual: { checked: false },
      psychosocial: { checked: false },
    });
    setTreatmentOrder({
      treatmentOrder: { checked: false },
    });
    setPhysician({
      cti: { checked: false, date: "" },
      order: { checked: false, date: "" },
      f2fVisit: { checked: false, date: "" },
    });
    setIdgNotes({ date: "", createdUser: "" });
    setSkilledNursingNotes({ date: "", createdUser: "" });
    setHaNotes({ date: "", createdUser: "" });
    setMiscellaneous({
      medicalRecords: { checked: false },
      dpoa: { checked: false },
      hp: { checked: false },
      eligibility: { checked: false },
      insuranceCard: { checked: false },
      id: { checked: false },
    });
    setDischarge({ date: "", reason: "", documentation: { checked: false } });
    setCompliance({
      hopeAdmission: "",
      hopeHuv1: "",
      hopeHuv2: "",
      hopeDischarge: "",
      lcdEligibility: { checked: false },
    });
    setPoc([]);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBooleanChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: { ...group[field], checked: event.target.checked },
    });
  };

  const handleBooleanWithDateChange = (group, setGroup, field, type) => (event) => {
    if (type === "checkbox") {
      setGroup({
        ...group,
        [field]: { ...group[field], checked: event.target.checked },
      });
    } else if (type === "date") {
      setGroup({
        ...group,
        [field]: { ...group[field], date: event.target.value },
      });
    }
  };

  const handleDateChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: event.target.value,
    });
  };

  const handleTextChange = (group, setGroup, field) => (event) => {
    setGroup({
      ...group,
      [field]: event.target.value,
    });
  };

  const addPocEntry = () => {
    setPoc([...poc, { staff: "", frequency: "" }]);
  };

  const removePocEntry = (index) => {
    const newPoc = [...poc];
    newPoc.splice(index, 1);
    setPoc(newPoc);
  };

  const handlePocChange = (index, field, value) => {
    const newPoc = [...poc];
    newPoc[index][field] = value;
    setPoc(newPoc);
  };

  const handleSubmit = () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }

    const data = {
      patientId: selectedPatient.id,
      patientCd: selectedPatient.patientCd,
      admission,
      assessment,
      treatmentOrder,
      physician,
      idgNotes,
      skilledNursingNotes,
      haNotes,
      miscellaneous,
      discharge,
      compliance,
      poc,
    };

    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.header}>
          <h3 style={{ margin: 0 }}>
            {mode === "edit" ? "Edit" : "Add"} Patient Onboarding Checklist
          </h3>
          <Clear style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <div className={classes.content}>
          {/* Patient Selection */}
          <div style={{ marginBottom: "20px" }}>
            <CustomSingleAutoComplete
              placeholder="Select Patient"
              label="Select Patient"
              searchList={patientList || []}
              options={patientList || []}
              value={selectedPatient}
              onSelectHandler={handlePatientSelect}
              disabled={mode === "edit"}
            />
          </div>

          {/* 1. Admission */}
          <Accordion className={classes.accordion} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">1. Admission</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.demographicSheet.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "demographicSheet")}
                      color="primary"
                    />
                  }
                  label="Demographic Sheet"
                />

                {/* Consents Subsection */}
                <Typography variant="subtitle1" style={{ marginTop: "15px", marginBottom: "10px", fontWeight: "600", color: "#667eea" }}>
                  Consents
                </Typography>
                <div style={{ paddingLeft: "20px", borderLeft: "3px solid #667eea", marginLeft: "10px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={admission.hospiceEvalOrder.checked}
                        onChange={handleBooleanChange(admission, setAdmission, "hospiceEvalOrder")}
                        color="primary"
                      />
                    }
                    label="Hospice Eval Order"
                  />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.informedConsent.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "informedConsent")}
                      color="primary"
                    />
                  }
                  label="Informed Consent"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.electionOfHospice.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "electionOfHospice")}
                      color="primary"
                    />
                  }
                  label="Election of Hospice"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.polstrDnr.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "polstrDnr")}
                      color="primary"
                    />
                  }
                  label="Polstr/DNR"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.changeOfHospice.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "changeOfHospice")}
                      color="primary"
                    />
                  }
                  label="Change of Hospice (if applicable)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.poaAdvanceDirective.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "poaAdvanceDirective")}
                      color="primary"
                    />
                  }
                  label="POA/Advance Directive"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.billOfRights.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "billOfRights")}
                      color="primary"
                    />
                  }
                  label="Bill of Rights"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.telehealthConsent.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "telehealthConsent")}
                      color="primary"
                    />
                  }
                  label="Telehealth Consent"
                />
                </div>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admission.patientNotification.checked}
                      onChange={handleBooleanChange(admission, setAdmission, "patientNotification")}
                      color="primary"
                    />
                  }
                  label="Patient Notification"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 2. Assessment */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">2. Assessment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={assessment.nursing.checked}
                      onChange={handleBooleanChange(assessment, setAssessment, "nursing")}
                      color="primary"
                    />
                  }
                  label="Nursing"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={assessment.spiritual.checked}
                      onChange={handleBooleanChange(assessment, setAssessment, "spiritual")}
                      color="primary"
                    />
                  }
                  label="Spiritual"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={assessment.psychosocial.checked}
                      onChange={handleBooleanChange(assessment, setAssessment, "psychosocial")}
                      color="primary"
                    />
                  }
                  label="Psychosocial"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 3. Treatment Order */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">3. Treatment Order</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={treatmentOrder.treatmentOrder.checked}
                      onChange={handleBooleanChange(treatmentOrder, setTreatmentOrder, "treatmentOrder")}
                      color="primary"
                    />
                  }
                  label="Treatment Order"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 4. Physician */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">4. Physician</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <div className={classes.checkboxRow}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={physician.cti.checked}
                        onChange={handleBooleanWithDateChange(physician, setPhysician, "cti", "checkbox")}
                        color="primary"
                      />
                    }
                    label="CTI"
                  />
                  <TextField
                    type="date"
                    label="CTI Date"
                    value={physician.cti.date}
                    onChange={handleBooleanWithDateChange(physician, setPhysician, "cti", "date")}
                    disabled={!physician.cti.checked}
                    InputLabelProps={{ shrink: true }}
                    className={classes.dateField}
                  />
                </div>
                <div className={classes.checkboxRow}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={physician.order.checked}
                        onChange={handleBooleanWithDateChange(physician, setPhysician, "order", "checkbox")}
                        color="primary"
                      />
                    }
                    label="Order"
                  />
                  <TextField
                    type="date"
                    label="Order Date"
                    value={physician.order.date}
                    onChange={handleBooleanWithDateChange(physician, setPhysician, "order", "date")}
                    disabled={!physician.order.checked}
                    InputLabelProps={{ shrink: true }}
                    className={classes.dateField}
                  />
                </div>
                <div className={classes.checkboxRow}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={physician.f2fVisit.checked}
                        onChange={handleBooleanWithDateChange(physician, setPhysician, "f2fVisit", "checkbox")}
                        color="primary"
                      />
                    }
                    label="F2F Visit"
                  />
                  <TextField
                    type="date"
                    label="F2F Visit Date"
                    value={physician.f2fVisit.date}
                    onChange={handleBooleanWithDateChange(physician, setPhysician, "f2fVisit", "date")}
                    disabled={!physician.f2fVisit.checked}
                    InputLabelProps={{ shrink: true }}
                    className={classes.dateField}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 5. IDG Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">5. IDG Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={idgNotes.date}
                  onChange={handleDateChange(idgNotes, setIdgNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Created User"
                  value={idgNotes.createdUser}
                  onChange={handleTextChange(idgNotes, setIdgNotes, "createdUser")}
                  fullWidth
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 6. Skilled Nursing Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">6. Skilled Nursing Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={skilledNursingNotes.date}
                  onChange={handleDateChange(skilledNursingNotes, setSkilledNursingNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Created User"
                  value={skilledNursingNotes.createdUser}
                  onChange={handleTextChange(skilledNursingNotes, setSkilledNursingNotes, "createdUser")}
                  fullWidth
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 7. HA Notes */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">7. HA Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={haNotes.date}
                  onChange={handleDateChange(haNotes, setHaNotes, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Created User"
                  value={haNotes.createdUser}
                  onChange={handleTextChange(haNotes, setHaNotes, "createdUser")}
                  fullWidth
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 8. Miscellaneous */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">8. Miscellaneous</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.medicalRecords.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "medicalRecords")}
                      color="primary"
                    />
                  }
                  label="Medical Records"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.dpoa.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "dpoa")}
                      color="primary"
                    />
                  }
                  label="DPOA"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.hp.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "hp")}
                      color="primary"
                    />
                  }
                  label="HP (History & Physical)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.eligibility.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "eligibility")}
                      color="primary"
                    />
                  }
                  label="Eligibility"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.insuranceCard.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "insuranceCard")}
                      color="primary"
                    />
                  }
                  label="Insurance Card"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={miscellaneous.id.checked}
                      onChange={handleBooleanChange(miscellaneous, setMiscellaneous, "id")}
                      color="primary"
                    />
                  }
                  label="ID"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 9. Discharge */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">9. Discharge</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="Date"
                  value={discharge.date}
                  onChange={handleDateChange(discharge, setDischarge, "date")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Reason"
                  value={discharge.reason}
                  onChange={handleTextChange(discharge, setDischarge, "reason")}
                  fullWidth
                  multiline
                  rows={2}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={discharge.documentation?.checked || false}
                      onChange={(e) => setDischarge({
                        ...discharge,
                        documentation: { checked: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="Documentation"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 10. Compliance */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">10. Compliance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <TextField
                  type="date"
                  label="HOPE Admission"
                  value={compliance.hopeAdmission}
                  onChange={handleDateChange(compliance, setCompliance, "hopeAdmission")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="HOPE HUV 1"
                  value={compliance.hopeHuv1}
                  onChange={handleDateChange(compliance, setCompliance, "hopeHuv1")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="HOPE HUV 2"
                  value={compliance.hopeHuv2}
                  onChange={handleDateChange(compliance, setCompliance, "hopeHuv2")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="HOPE Discharge"
                  value={compliance.hopeDischarge}
                  onChange={handleDateChange(compliance, setCompliance, "hopeDischarge")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={compliance.lcdEligibility?.checked || false}
                      onChange={(e) => setCompliance({
                        ...compliance,
                        lcdEligibility: { checked: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="LCD Eligibility"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* 11. Plan of Care (POC) */}
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              className={classes.accordionSummary}
            >
              <Typography variant="h6">11. Plan of Care (POC)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.sectionContent}>
                <MuiButton
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={addPocEntry}
                >
                  Add POC Entry
                </MuiButton>
                {poc.map((entry, index) => (
                  <div key={index} className={classes.pocEntry}>
                    <TextField
                      label="Staff"
                      value={entry.staff}
                      onChange={(e) => handlePocChange(index, "staff", e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <TextField
                      label="Frequency"
                      value={entry.frequency}
                      onChange={(e) => handlePocChange(index, "frequency", e.target.value)}
                      placeholder="e.g., 1/wk, 2/month"
                      style={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={() => removePocEntry(index)}
                      color="secondary"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className={classes.footer}>
          <Button color="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ChecklistModal;

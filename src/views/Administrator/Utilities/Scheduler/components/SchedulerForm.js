import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Box,
} from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import moment from "moment";

const DISCIPLINE_OPTIONS = [
  "Registered Nurse",
  "Licensed Practical Nurse",
  "Certified Nursing Assistant",
  "Medical Social Worker",
  "Spiritual Counselor",
  "Physical Therapist",
  "Occupational Therapist",
  "Speech Therapist",
];

const SERVICE_TYPE_OPTIONS = [
  "Regular Visit",
  "Admission",
  "Recertification",
  "IDT Meeting",
  "HOPE Assessment",
];

function SchedulerForm({
  isOpen,
  mode,
  item,
  patientList,
  userProfile,
  closeFormModalHandler,
  createSchedulerHandler,
}) {
  const [formData, setFormData] = useState({
    patientCd: "",
    patientId: null,
    scheduled_dt: moment().format("YYYY-MM-DD"),
    threshold_days: 7,
    service_type: "",
    discipline: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && item) {
      setFormData({
        id: item.id,
        patientCd: item.patientCd || "",
        patientId: item.patientId || null,
        scheduled_dt: item.scheduled_dt
          ? moment(item.scheduled_dt).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        threshold_days: item.threshold_days || 7,
        service_type: item.service_type || "",
        discipline: item.discipline || [],
      });
    } else {
      setFormData({
        patientCd: "",
        patientId: null,
        scheduled_dt: moment().format("YYYY-MM-DD"),
        threshold_days: 7,
        service_type: "",
        discipline: [],
      });
    }
    setErrors({});
  }, [mode, item, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePatientChange = (e) => {
    const selectedPatientCd = e.target.value;
    const selectedPatient = patientList.find((p) => p.patientCd === selectedPatientCd);

    setFormData((prev) => ({
      ...prev,
      patientCd: selectedPatientCd,
      patientId: selectedPatient?.id || null,
    }));

    if (errors.patientCd) {
      setErrors((prev) => ({
        ...prev,
        patientCd: "",
      }));
    }
  };

  const handleDisciplineChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      discipline: typeof value === "string" ? value.split(",") : value,
    }));

    if (errors.discipline) {
      setErrors((prev) => ({
        ...prev,
        discipline: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patientCd) {
      newErrors.patientCd = "Client is required";
    }

    if (!formData.scheduled_dt) {
      newErrors.scheduled_dt = "Scheduled date is required";
    }

    if (!formData.service_type) {
      newErrors.service_type = "Service type is required";
    }

    if (!formData.discipline || formData.discipline.length === 0) {
      newErrors.discipline = "At least one discipline is required";
    }

    if (!formData.threshold_days || formData.threshold_days < 1) {
      newErrors.threshold_days = "Threshold days must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload = {
      ...formData,
      companyId: userProfile.companyId,
      scheduled_dt: moment(formData.scheduled_dt).format("YYYY-MM-DD"),
      threshold_days: parseInt(formData.threshold_days),
    };

    if (mode === "create") {
      payload.createdUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
    } else {
      payload.updatedUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
    }

    createSchedulerHandler(payload, mode);
  };

  return (
    <Dialog open={isOpen} onClose={closeFormModalHandler} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Add New Schedule" : "Edit Schedule"}
      </DialogTitle>
      <DialogContent>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.patientCd}>
              <InputLabel>Client</InputLabel>
              <Select
                name="patientCd"
                value={formData.patientCd}
                onChange={handlePatientChange}
              >
                <MenuItem value="">
                  <em>Select Client</em>
                </MenuItem>
                {patientList &&
                  patientList.map((patient) => (
                    <MenuItem key={patient.id} value={patient.patientCd}>
                      {patient.patientCd}
                    </MenuItem>
                  ))}
              </Select>
              {errors.patientCd && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.patientCd}
                </span>
              )}
            </FormControl>
          </GridItem>

          <GridItem xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              name="scheduled_dt"
              label="Scheduled Date"
              type="date"
              value={formData.scheduled_dt}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.scheduled_dt}
              helperText={errors.scheduled_dt}
            />
          </GridItem>

          <GridItem xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.service_type}>
              <InputLabel>Service Type</InputLabel>
              <Select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Service Type</em>
                </MenuItem>
                {SERVICE_TYPE_OPTIONS.map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
              {errors.service_type && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.service_type}
                </span>
              )}
            </FormControl>
          </GridItem>

          <GridItem xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              name="threshold_days"
              label="Threshold Days"
              type="number"
              value={formData.threshold_days}
              onChange={handleChange}
              error={!!errors.threshold_days}
              helperText={errors.threshold_days}
            />
          </GridItem>

          <GridItem xs={12}>
            <FormControl fullWidth margin="normal" error={!!errors.discipline}>
              <InputLabel>Discipline</InputLabel>
              <Select
                multiple
                name="discipline"
                value={formData.discipline}
                onChange={handleDisciplineChange}
                input={<OutlinedInput label="Discipline" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {DISCIPLINE_OPTIONS.map((discipline) => (
                  <MenuItem key={discipline} value={discipline}>
                    {discipline}
                  </MenuItem>
                ))}
              </Select>
              {errors.discipline && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.discipline}
                </span>
              )}
            </FormControl>
          </GridItem>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFormModalHandler} color="transparent">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="info">
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SchedulerForm;

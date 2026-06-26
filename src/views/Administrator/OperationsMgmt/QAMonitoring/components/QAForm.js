import React, { useEffect, useState } from "react";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CustomTextField from "components/TextField/CustomTextField";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import HeaderModal from "components/Modal/HeaderModal";
import { QA_TYPE, QA_STATUS, LCD_COMPLIANCE, DEFAULT_ITEM } from "utils/constants";
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
    width: "60%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
}));

function QAForm(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [formData, setFormData] = useState({});
  const { isOpen, mode, item, patientList, employeeList } = props;

  useEffect(() => {
    if (item && mode === "edit") {
      const fm = { ...item };
      fm.qaType = QA_TYPE.find((c) => c.value === fm.qa_type) || DEFAULT_ITEM;
      fm.status = QA_STATUS.find((c) => c.value === fm.qa_status) || DEFAULT_ITEM;
      fm.patient = patientList.find((p) => p.id === fm.patientId) || DEFAULT_ITEM;
      fm.discipline = employeeList.find((e) => e.id === fm.disciplineId) || DEFAULT_ITEM;
      fm.reviewer = employeeList.find((e) => e.id === fm.reviewerId) || DEFAULT_ITEM;
      fm.qaDate = fm.qa_date ? new Date(fm.qa_date) : new Date();
      // Parse date-only fields without timezone conversion
      fm.qaSourceDate = fm.qa_source_dt ? moment(fm.qa_source_dt, "YYYY-MM-DD").toDate() : null;
      fm.completeDate = fm.completed_dt ? moment(fm.completed_dt, "YYYY-MM-DD").toDate() : null;
      fm.comments = fm.comments || "";
      fm.lcdCompliance = LCD_COMPLIANCE.find((c) => c.value === fm.isLcdCompliance) || DEFAULT_ITEM;
      fm.recertNumber = fm.recertNumber || "";
      setFormData(fm);
    } else {
      // Default to Pending status for new items
      setFormData({
        qaType: DEFAULT_ITEM,
        patient: DEFAULT_ITEM,
        discipline: DEFAULT_ITEM,
        reviewer: DEFAULT_ITEM,
        status: QA_STATUS.find((s) => s.code === "pending") || DEFAULT_ITEM,
        qaDate: new Date(),
        qaSourceDate: null,
        completeDate: null,
        comments: "",
        lcdCompliance: DEFAULT_ITEM,
        recertNumber: "",
      });
    }
  }, [item, mode, patientList, employeeList]);

  const handleAutoCompleteChange = (item, field) => {
    const src = { ...formData };
    src[field] = item;
    setFormData(src);
  };

  const handleDateChange = (value, name) => {
    const src = { ...formData };
    src[name] = value;
    setFormData(src);
  };

  const handleTextChange = (e) => {
    const src = { ...formData };
    src[e.target.name] = e.target.value;
    setFormData(src);
  };

  const handleSubmit = () => {
    const disciplineName = formData.discipline?.name || `${formData.discipline?.fn || ""} ${formData.discipline?.ln || ""}`.trim();
    const reviewerName = formData.reviewer?.name || `${formData.reviewer?.fn || ""} ${formData.reviewer?.ln || ""}`.trim();

    const payload = {
      qa_type: formData.qaType?.value || "",
      patientId: formData.patient?.id || null,
      patientCd: formData.patient?.patientCd || "",
      disciplineId: formData.discipline?.id || null,
      discipline_name: disciplineName,
      reviewerId: formData.reviewer?.id || null,
      reviewer_name: reviewerName,
      qa_date: formData.qaDate ? moment(formData.qaDate).format("YYYY-MM-DD HH:mm:ss") : null,
      qa_status: formData.status?.value || "Pending",
      qa_source_dt: formData.qaSourceDate ? moment(formData.qaSourceDate).format("YYYY-MM-DD") : null,
      completed_dt: formData.completeDate ? moment(formData.completeDate).format("YYYY-MM-DD") : null,
      comments: formData.comments ? [formData.comments] : [],
      recertNumber: formData.recertNumber || null,
    };

    // Only include isLcdCompliance if a value is selected (not empty/DEFAULT_ITEM)
    if (formData.lcdCompliance && formData.lcdCompliance.value !== undefined && formData.lcdCompliance !== DEFAULT_ITEM) {
      payload.isLcdCompliance = formData.lcdCompliance.value;
    }

    if (mode === "edit") {
      payload.id = item.id;
    }

    props.onSubmit(payload, mode);
  };

  const isValid = () => {
    return (
      formData.qaType &&
      formData.qaType.value &&
      formData.patient &&
      formData.patient.id &&
      formData.discipline &&
      formData.discipline.id &&
      formData.qaDate
    );
  };

  const titleHandler = () => {
    if (mode === "view") {
      return "View QA Record";
    } else if (mode === "edit") {
      return "Edit QA Record";
    } else {
      return "Create QA Record";
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={props.onClose}
      aria-labelledby="qa-form"
      aria-describedby="qa-form-modal"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <HeaderModal title={titleHandler()} onClose={props.onClose} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="QA Type *"
                  label="QA Type *"
                  value={formData.qaType || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "qaType")}
                  options={QA_TYPE}
                  disabled={mode === "view"}
                />
              </Grid>
              {formData.qaType?.code === "recertification" && (
                <Grid item xs={6}>
                  <CustomTextField
                    placeholder="Certification #"
                    label="Certification #"
                    name="recertNumber"
                    value={formData.recertNumber || ""}
                    onChange={handleTextChange}
                    type="number"
                    disabled={mode === "view"}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Patient *"
                  label="Patient *"
                  value={formData.patient || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "patient")}
                  options={patientList}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Discipline *"
                  label="Discipline *"
                  value={formData.discipline || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "discipline")}
                  options={employeeList}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="QA Source Date"
                  value={formData.qaSourceDate}
                  onChange={(value) => handleDateChange(value, "qaSourceDate")}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="QA Date *"
                  value={formData.qaDate}
                  onChange={(value) => handleDateChange(value, "qaDate")}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="Complete Date"
                  value={formData.completeDate}
                  onChange={(value) => handleDateChange(value, "completeDate")}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Reviewer"
                  label="Reviewer"
                  value={formData.reviewer || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "reviewer")}
                  options={employeeList}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Status"
                  label="Status"
                  value={formData.status || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "status")}
                  options={QA_STATUS}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="LCD Eligibility Compliance"
                  label="LCD Eligibility Compliance"
                  value={formData.lcdCompliance || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "lcdCompliance")}
                  options={LCD_COMPLIANCE}
                  disabled={mode === "view"}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  placeholder="Comments"
                  label="Comments"
                  name="comments"
                  value={formData.comments || ""}
                  onChange={handleTextChange}
                  multiline
                  rows={3}
                  disabled={mode === "view"}
                />
              </Grid>
            </Grid>
            {mode !== "view" && (
              <div style={{ paddingTop: 20 }}>
                <Button
                  disabled={!isValid()}
                  variant="contained"
                  color={isValid() ? "primary" : "default"}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

export default QAForm;

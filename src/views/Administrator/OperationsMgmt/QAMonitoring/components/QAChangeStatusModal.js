import React, { useEffect, useState } from "react";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
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
import { QA_STATUS, DEFAULT_ITEM } from "utils/constants";

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
    width: "45%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
}));

function QAChangeStatusModal(props) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [formData, setFormData] = useState({});
  const { isOpen, employeeList, selectedCount } = props;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        qaDate: null,
        completeDate: null,
        status: DEFAULT_ITEM,
        reviewer: DEFAULT_ITEM,
      });
    }
  }, [isOpen]);

  const handleAutoCompleteChange = (item, field) => {
    setFormData((prev) => ({ ...prev, [field]: item }));
  };

  const handleDateChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    return (
      formData.qaDate ||
      formData.completeDate ||
      (formData.status && formData.status.value) ||
      (formData.reviewer && formData.reviewer.id)
    );
  };

  const handleSubmit = () => {
    props.onSubmit(formData);
  };

  return (
    <Modal
      open={isOpen}
      onClose={props.onClose}
      aria-labelledby="qa-change-status-form"
      aria-describedby="qa-change-status-form-modal"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <HeaderModal title="Change Status" onClose={props.onClose} />
          <CardContent>
            <Typography variant="body2" gutterBottom>
              Updating {selectedCount} selected record{selectedCount === 1 ? "" : "s"}. Only fields you set below will be updated.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="QA Date"
                  value={formData.qaDate}
                  onChange={(value) => handleDateChange(value, "qaDate")}
                  noDefault={true}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="QA Completed"
                  value={formData.completeDate}
                  onChange={(value) => handleDateChange(value, "completeDate")}
                  noDefault={true}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Status"
                  label="Status"
                  value={formData.status || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "status")}
                  options={QA_STATUS}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomSingleAutoComplete
                  placeholder="Reviewer"
                  label="Reviewer"
                  value={formData.reviewer || DEFAULT_ITEM}
                  onSelectHandler={(item) => handleAutoCompleteChange(item, "reviewer")}
                  options={employeeList}
                />
              </Grid>
            </Grid>
            <div style={{ paddingTop: 20 }}>
              <Button
                disabled={!isValid()}
                variant="contained"
                color={isValid() ? "primary" : "default"}
                onClick={handleSubmit}
              >
                Update {selectedCount} Record{selectedCount === 1 ? "" : "s"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

export default QAChangeStatusModal;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { MoneyOutlined } from "@material-ui/icons";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    background: "linear-gradient(60deg, #66bb6a, #43a047)",
    color: "white",
    padding: "20px 24px",
  },
  titleContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dialogContent: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  dateField: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
    fontSize: "0.875rem",
  },
}));

function PayrollDueDateModal(props) {
  const classes = useStyles();
  const { isOpen, onClose, onConfirm } = props;
  const [payrollDueDate, setPayrollDueDate] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!payrollDueDate) {
      setError("Payroll due date is required.");
      return;
    }

    // Validate date format (YYYY-MM-DD)
    if (!moment(payrollDueDate, "YYYY-MM-DD", true).isValid()) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      return;
    }

    onConfirm(payrollDueDate);
    handleClose();
  };

  const handleClose = () => {
    setPayrollDueDate("");
    setError("");
    onClose();
  };

  const handleDateChange = (e) => {
    setPayrollDueDate(e.target.value);
    setError("");
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="payroll-due-date-modal"
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <div className={classes.titleContent}>
          <MoneyOutlined style={{ fontSize: "28px" }} />
          <Typography variant="h6" style={{ color: "white", fontWeight: 500 }}>
            Enter Payroll Due Date
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="body1" gutterBottom>
          Please enter the payroll due date to submit the selected routesheets to payroll.
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          The system will automatically retrieve the pay period information based on this date.
        </Typography>
        <TextField
          className={classes.dateField}
          label="Payroll Due Date"
          type="date"
          value={payrollDueDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          error={!!error}
          helperText={error}
          placeholder="YYYY-MM-DD"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={!payrollDueDate}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PayrollDueDateModal;

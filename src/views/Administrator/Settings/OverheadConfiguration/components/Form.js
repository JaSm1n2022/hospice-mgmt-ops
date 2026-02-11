import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "500px",
  },
  textField: {
    marginTop: theme.spacing(2),
  },
}));

const OverheadForm = ({
  open,
  onClose,
  onSubmit,
  item,
  mode,
}) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    label: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        key: item.key || "",
        value: item.value || "",
        label: item.label || "",
        description: item.description || "",
        category: item.category || "",
      });
    }
  }, [item]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    // Validate value is numeric
    const numericValue = parseFloat(formData.value);
    if (isNaN(numericValue)) {
      alert("Value must be a valid number");
      return;
    }

    onSubmit({
      ...formData,
      value: numericValue,
    });
    onClose();
  };

  const isViewMode = mode === "view";
  const title = isViewMode ? "View Constant" : "Edit Constant";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Label"
              value={formData.label}
              disabled
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Value"
              type="number"
              value={formData.value}
              onChange={handleChange("value")}
              disabled={isViewMode}
              className={classes.textField}
              inputProps={{
                step: "0.01",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              disabled
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              disabled
              multiline
              rows={3}
              className={classes.textField}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          {isViewMode ? "Close" : "Cancel"}
        </Button>
        {!isViewMode && (
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OverheadForm;

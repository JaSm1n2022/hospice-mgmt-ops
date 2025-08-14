import React from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
      width: "100%",
      height: "40px",
      background: "white",
    },
  },
  inputRoot: {
    width: "100%",
    height: "40px",
    background: "white",
  },
  noBorder: {
    border: "none",
    width: "100%",
    height: "40px",
  },
}));

/** *
 * Author
 * Nargel Velasco - Tech Team
 * @param {String} value - component target value
 * @param {String} name - component target name
 * @param {Function} onChange - component event function
 * @param {Function} readOnly - component readonly state
 *
 *
 */
export default function CustomDatePicker({
  disabled,
  value,
  name,
  onChange,
  readOnly,
  label,
  noDefault,
  isError,
  errorMsg,
  source,
  background,
}) {
  const classes = useStyles();
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          inputVariant="outlined"
          id="date-picker-dialog"
          format="MM/dd/yyyy"
          label={
            label ? (
              <label hmtlFor="" style={{ fontSize: "10pt" }}>
                {label}
              </label>
            ) : (
              ""
            )
          }
          value={noDefault && !value ? null : value || new Date()}
          name={name}
          emptyLabel="Provide Date"
          error={isError || false}
          helperText={
            isError ? (
              <label hmtlFor="" style={{ fontSize: "10pt" }}>
                {errorMsg}
              </label>
            ) : (
              ""
            )
          }
          disabled={disabled || false}
          readOnly={readOnly || false}
          onChange={(event) => onChange(event, name, source)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          InputProps={{
            style: {
              fontSize: 14,
              height: 40,
              background: background || "",
              cursor: disabled ? "not-allowed" : "",
            },
          }}
        />
      </MuiPickersUtilsProvider>
    </form>
  );
}

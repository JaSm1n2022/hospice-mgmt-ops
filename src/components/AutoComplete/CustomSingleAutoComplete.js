import React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Tooltip } from "@material-ui/core";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  inputRoot: {
    margin: "0",
    height: (props) => props.height || "40px",
    width: "100%",
    background: (props) => (props.disabled ? "#e9ecef" : "white"),
    "&&& input": {
      fontSize: "10pt",
      border: "none",
      paddingTop: 2,
    },
  },
  textFieldInput: {
    marginTop: theme.spacing(0),
  },
}));
/** *
 * Author
 * Nargel Velasco - Tech Team
 * @param {String} value - Component target value
 * @param {Array} searchList - The dropdown items.
 * @param {function} onSelectHandler - Component event function
 *
 * chipProps is always hidden to true
 */
export default function CustomSingleAutoComplete(props) {
  const {
    tooltiptext,
    tooltipPlacement,
    value,
    options,
    name,
    onSelectHandler,
    onChangeHandler,
    isError,
    errorMsg,
    source,
    disabled,
    placeholder,
  } = props;
  console.log("[Options]", options);
  const classes = useStyles(props);
  const body = (
    <Autocomplete
      classes={classes}
      ChipProps={{ hidden: true }}
      id="checkboxes-auto-custom"
      options={options || []}
      value={value}
      disabled={disabled || false}
      onChange={(e, item) => {
        if (item && item.value) {
          onSelectHandler(item, source);
        }
      }}
      onInputChange={(event, newInputValue) => {
        if (!newInputValue) {
          onChangeHandler({ target: { name, value: newInputValue } }, source);
        }
      }}
      getOptionLabel={(option) => option.label}
      renderOption={(option, state) => {
        return (
          <Grid
            container
            wrap="wrap"
            spacing={2}
            style={{ borderTop: "1px solid grey" }}
          >
            <Grid item xs zeroMinWidth>
              <Typography wrap>{option.label || option.value}</Typography>
            </Grid>
            <Grid item></Grid>
          </Grid>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
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
          name={name}
          variant="outlined"
          margin="dense"
          fullWidth
          type="text"
          placeholder={placeholder || "Select"}
          label={placeholder || undefined}
          className={classes.textFieldInput}
          style={{ border: "none !important" }}
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              // Do code here
              ev.preventDefault();
            }
          }}
          InputLabelProps={{
            style: {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              width: "100%",
              fontSize: "10pt",
              color: "black",
            },
          }}
        />
      )}
    />
  );
  return (
    <React.Fragment>
      {tooltiptext ? (
        <Tooltip
          placement={tooltipPlacement || "bottom-start"}
          title={
            <label style={{ fontSize: "12px", paddingTop: "3px" }}>
              {tooltiptext}
            </label>
          }
        >
          {body}
        </Tooltip>
      ) : (
        <>{body}</>
      )}
    </React.Fragment>
  );
}

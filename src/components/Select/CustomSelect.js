import React, { lazy, Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import Select from "@material-ui/core/Select";
import { InputLabel, Tooltip } from "@material-ui/core";
import PropTypes, { any } from "prop-types";
const CircleIcon = lazy(() =>
  import(/* webpackChunkName: 'iconLens' */ "@material-ui/icons/Lens")
);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 0,
    width: "100%",
  },
  quantityRoot: {
    border: "0",
    margin: 0,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  root: {
    height: "40px",
    width: "100%",
    fontSize: "10pt",
    borderBottom: "0px solid white",
    background: "white",
  },
  rootRule: {
    height: "34px",
    width: "100%",
    fontSize: "10pt",
    borderBottom: "0px solid white",
    background: "white",
    color: "black",
  },
}));
/** *
 * Author
 * Nargel Velasco - Tech Team
 * @param {String} variant - variant value (outlined,filled,standard)
 * @param {Boolean} isError - flag to indicate that component field is in error state
 * @param {String} errorMsg - Error message if isError is true
 * @param {String} name - target component name
 * @param {String} value - target component value
 * @param {String} root - set className
 * @param {Object} source - item object
 * @param {Array} options - Items dropdown
 * * @param {Function} onChange - Component onChange function
 *
 *
 */
export default function CustomSelect({
  tooltiptext,
  tooltipPlacement,
  disabled,
  placeholder,
  label,
  variant,
  onChange,
  name,
  isError,
  root,
  value,
  source,
  options,
  errorMsg,
}) {
  const classes = useStyles();
  const body = (
    <Select
      inputProps={{ style: { fontSize: "10pt" } }} // font size of input text
      InputLabelProps={{ style: { fontSize: "10pt" } }} // font size of input label
      labelId="simple-select-filled-label"
      id={name}
      placeholder={value || placeholder}
      label={label}
      name={name}
      margin="dense"
      disabled={disabled || false}
      className={root && root === "minmax" ? classes.rootRule : classes.root}
      value={value || label || "Select"}
      source={source}
      onChange={(event) => onChange(event, source)}
    >
      <MenuItem disabled value="Select">
        Select
      </MenuItem>

      {options &&
        options.length > 0 &&
        options.map((c, i) => {
          return (
            <MenuItem key={`reg-sel-${i}`} value={c.value}>
              <div style={{ display: "inline-flex", gap: 4 }}>
                {name === "status" && c.value !== "All" && (
                  <span className="material-icon">
                    &nbsp;&nbsp;
                    <Suspense fallback="Loading...">
                      <CircleIcon
                        style={{ fill: c.value === "Active" ? "green" : "red" }}
                      />
                    </Suspense>
                  </span>
                )}

                <label htmlFor="" style={{ fontSize: "10pt" }}>
                  {c.description || c.name}
                </label>
              </div>
            </MenuItem>
          );
        })}
    </Select>
  );
  return (
    <div>
      <FormControl
        variant={variant || "outlined"}
        className={classes.quantityRoot}
      >
        {label && (
          <InputLabel id="demo-simple-select-outlined-label">
            <h4>{label}</h4>
          </InputLabel>
        )}

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
        {isError && (
          <FormHelperText style={{ color: "red" }}>{errorMsg}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
CustomSelect.propTypes = {
  tooltiptext: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  onChange: PropTypes.node,
  name: PropTypes.string,
  isError: PropTypes.bool,
  root: PropTypes.any,
  value: PropTypes.node,
  source: PropTypes.node,
  options: PropTypes.node,
  errorMsg: PropTypes.bool,
};

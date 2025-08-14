import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
      width: "100%",
      height: (props) => (props.height ? props.height : "40px"),
    },
  },
  inputRoot: {
    width: "100%",
    height: "40px",
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
 * @param {Function} onChange - Component onChange function
 * @param {String} variant - outlined/filled/standard
 * @param {String} type - number/text/search and default is text
 * @param {String} name - target component name
 * @param {String} value - target component value
 * @param {Boolean} isError - flag to indicate if component is in error state
 * @param {Boolean} errorMsg - Error message
 * @param {Boolean} readonly - Flag to indicate if component is in readonly state
 * @param {String} placeholder - Placeholder text
 * @param {String} border - set border
 * @param {Object} source - item object
 * @param {Object} background - set background color
 *
 */

export default function CustomTextField(props) {
  const {
    tooltiptext,
    tooltipPlacement,
    id,
    source,
    onChange,
    variant,
    label,
    isError,
    type,
    value,
    errorMsg,
    readonly,
    name,
    placeholder,
    border,
    background,
    disabled,
    size,
    height,
  } = props;
  const classes = useStyles(props);
  let colorBkg = background || "";
  colorBkg = disabled ? "#e9ecef" : colorBkg;
  const topLabel = label || placeholder;
  const body = (
    <TextField
      error={isError || false}
      id={id || "txt-fld"}
      disabled={disabled || false}
      type={type || "text"}
      label={
        isError ? (
          <span>{label}</span>
        ) : topLabel ? (
          <label hmtlFor="" style={{ fontSize: "10pt" }}>
            {topLabel}
          </label>
        ) : (
          ""
        )
      }
      defaultValue={value}
      helperText={
        isError ? (
          <label hmtlFor="" style={{ fontSize: "10pt" }}>
            {errorMsg}
          </label>
        ) : (
          ""
        )
      }
      classes={classes.inputRoot}
      readOnly={readonly || false}
      onKeyPress={(ev) => {
        if (ev.key === "Enter") {
          // Do code here
          ev.preventDefault();
        }
      }}
      onChange={(e) => onChange(e, source)}
      name={name}
      value={value}
      margin="dense"
      placeholder={placeholder}
      variant={variant || "outlined"}
      InputProps={{
        style: {
          fontSize: size || 14,
          height: height || 40,
          marginLeft: "0",
          marginRight: "0",

          background: colorBkg,
        },
        readOnly: readonly || false,
        classes: {
          notchedOutline: border && border === "none" ? classes.noBorder : "",
        },
      }}
    />
  );
  return (
    <form className={classes.root} noValidate autoComplete="off">
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
    </form>
  );
}

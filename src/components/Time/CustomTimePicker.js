import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
      width: "100%",
      height: "40px",
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

export default function CustomTimePicker(props) {
  const {
    id,
    source,
    onChange,
    variant,
    label,
    isError,
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
    noDefault,
  } = props;
  let colorBkg = background || "";
  colorBkg = disabled ? "#e9ecef" : colorBkg;
  //  let topLabel = label || '';
  const topLabel = noDefault && !value ? null : label || "";

  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        error={isError || false}
        id={id || "txt-fld"}
        disabled={disabled || false}
        type="time"
        label={label}
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
        readonly={readonly || false}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            // Do code here
            ev.preventDefault();
          }
        }}
        onChange={(e) => onChange(e, source)}
        name={name}
        value={value}
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

          classes: {
            notchedOutline: border && border === "none" ? classes.noBorder : "",
          },
        }}
      />
    </form>
  );
}

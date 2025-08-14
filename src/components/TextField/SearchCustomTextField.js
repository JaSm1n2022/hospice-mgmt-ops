import React, { lazy, Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Tooltip } from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";

const SearchIcon = lazy(() =>
  import(/* webpackChunkName: 'SearchIcon' */ "@material-ui/icons/Search")
);

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

export default function SearchCustomTextField({
  id,
  source,
  isAllowEnterKey,
  onImport,
  onChange,
  onPressEnterKeyHandler,
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
}) {
  const classes = useStyles();
  let colorBkg = background || "";
  colorBkg = disabled ? "#e9ecef" : colorBkg;
  const topLabel = label || placeholder;

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        error={isError || false}
        id={id || "txt-fld"}
        disabled={disabled || false}
        type={type || "text"}
        margin="dense"
        label={
          isError ? (
            "Error"
          ) : (
            <label hmtlFor="" style={{ fontSize: "10pt" }}>
              {topLabel}
            </label>
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
            ev.preventDefault();
            // Do code here
            if (isAllowEnterKey) {
              onPressEnterKeyHandler(value);
            }
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
            color: "rgba(0, 0, 0, 0.6)",
          },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title={
                  <h6 style={{ color: "lightblue" }}>
                    <span>Enter keyword to search</span>
                  </h6>
                }
              >
                <Suspense fallback="Loading...">
                  <div style={{ display: "inline-flex", gap: 2 }}>
                    <SearchIcon
                      style={{
                        fontSize: 24,
                        cursor: isAllowEnterKey ? "pointer" : "",
                      }}
                      onClick={() =>
                        isAllowEnterKey ? onPressEnterKeyHandler(value) : null
                      }
                    />
                    <Clear
                      style={{
                        fontSize: 24,
                        cursor: "pointer",
                      }}
                      onClick={() => onPressEnterKeyHandler("", "clear")}
                    />
                  </div>
                </Suspense>
              </Tooltip>
            </InputAdornment>
          ),

          classes: {
            notchedOutline: border && border === "none" ? classes.noBorder : "",
          },
        }}
      />
    </form>
  );
}

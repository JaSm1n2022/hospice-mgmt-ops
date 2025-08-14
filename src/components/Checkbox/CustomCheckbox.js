import React, { lazy, Suspense } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Tooltip } from "@material-ui/core";

const CheckBoxOutlineBlank = lazy(() =>
  import(
    /* webpackChunkName: 'iconCheckBoxOutlineBlank' */ "@material-ui/icons/CheckBoxOutlineBlank"
  )
);
const CheckBoxIcon = lazy(() =>
  import(/* webpackChunkName: 'iconCheckBox' */ "@material-ui/icons/CheckBox")
);

const useStyles = makeStyles((theme) => ({
  tickSize: {
    transform: "scale(1)",
  },
}));
export default function CustomCheckbox({
  tooltiptext,
  tooltipPlacement,
  name,
  isChecked,
  onChange,
  label,
  size,
  disabled,
  source,
}) {
  const classes = useStyles();
  const body = (
    <Checkbox
      icon={<CheckBoxOutlineBlank />}
      checkedIcon={<CheckBoxIcon />}
      name={name}
      onChange={(e) => onChange(e, source)}
      checked={!!isChecked}
      style={{ paddingBottom: 0, paddingTop: 0 }}
      className={classes.tickSize}
      disabled={disabled || false}
      color="primary"
    />
  );
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Suspense fallback="Loading...">
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
          </Suspense>
        }
        label={
          <Typography style={{ fontSize: "11pt", color: "black" }}>
            {label}
          </Typography>
        }
      />
    </FormGroup>
  );
}

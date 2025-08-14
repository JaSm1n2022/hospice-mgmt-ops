import React, { useState } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0),
      width: '100%',
      height: '40px',
    },
  },
  inputRoot: {
    width: '100%',
    height: '40px',
  },
  noBorder: {
    border: 'none',
    width: '100%',
    height: '40px',
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
export default function CustomizeDatePicker({
  disabled,
  value,
  name,
  onChange,
  readOnly,
  label,
  noDefault,
  isError,
  errorMsg,
  background,
}) {
  const classes = useStyles();
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const dateInputHandler = (value, name) => {
    switch (name) {
      case 'to':
        setTo(value);
        return;
      case 'from':
        setFrom(value);

      default:
    }
  };
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          inputVariant="outlined"
          id="date-picker-dialog"
          format="MM/dd/yyyy"
          label={
            label ? (
              <label hmtlFor="" style={{ fontSize: '10pt' }}>
                {label}
              </label>
            ) : (
              ''
            )
          }
          value={noDefault && !value ? null : value || new Date()}
          name={name}
          emptyLabel="Provide Date"
          error={isError || false}
          helperText={
            isError ? (
              <label hmtlFor="" style={{ fontSize: '10pt' }}>
                {errorMsg}
              </label>
            ) : (
              ''
            )
          }
          disabled={disabled || false}
          readOnly={readOnly || false}
          onChange={(event) => onChange(event, name)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          InputProps={{
            style: {
              fontSize: 14,
              height: 40,
              background: background || '',
              cursor: disabled ? 'not-allowed' : '',
            },
          }}
        />
      </MuiPickersUtilsProvider>
    </form>
  );
}

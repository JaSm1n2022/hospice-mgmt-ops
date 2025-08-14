import React, { lazy, Suspense } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import SortUtil from "utils/sortUtil";

const CheckBoxOutlineBlank = lazy(() =>
  import(
    /* webpackChunkName: 'iconAddCircleOutlined' */ "@material-ui/icons/CheckBoxOutlineBlank"
  )
);
const CheckboxOnly = lazy(() =>
  import(
    /* webpackChunkName: 'iconRemoveCircleOutline' */ "@material-ui/icons/CheckBox"
  )
);

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
 * Author Nargel Velasco - Tech Team
 * @param {Array} searchList - The dropdown items. Items must have value and selected attributes.
 * @param {function} onSelectHandler - Component event function
 *
 * chipProps is always hidden to true
 */

export default function CustomMultipleAutoComplete(props) {
  const {
    width,
    source,
    id,
    onChangeHandler,
    name,
    label,
    errorMsg,
    placeholder,
    isError,
    selected,
    searchList,
    disabled,
    selectHandler,
    selectAllHandler,
  } = props;

  const classes = useStyles(props);
  const filter = createFilterOptions();
  const [mainOption, setMainOption] = React.useState(false);
  const [list, setList] = React.useState(searchList);

  const selectAllItemHandler = () => {
    setMainOption(!mainOption);
    selectAllHandler(!mainOption, searchList, source);
  };
  const reSortBySelection = (optionList) => {
    SortUtil.sortBySelectedAndName(optionList);
    selectHandler(optionList, source);
  };
  if (!searchList.find((s) => s.selected) && mainOption) {
    console.log("[Find me]", searchList, mainOption);
    setMainOption(false);
  }
  return (
    <Autocomplete
      multiple
      classes={classes}
      disabled={disabled || false}
      // limitTags={1}
      renderTags={(value, getTagProps) => {
        const numTags = value.length;
        const numValue = value
          .slice(0, 1)
          .map((option, _) => option.value)
          .join(",");
        return (
          <Typography variant="body2">
            <Chip
              key={numValue}
              label={numValue}
              size="small"
              style={{ width: numTags > 1 ? "85px" : "110px" }}
            />
            {numTags > 1 && ` +${numTags - 1}`}
          </Typography>
        );
      }}
      value={selected}
      ChipProps={{ size: "small" }}
      id={id}
      options={searchList || []}
      disableCloseOnSelect
      onChange={() => {
        if (searchList.find((s) => !s.selected)) {
          setMainOption(false);
        }
        reSortBySelection(searchList);
      }}
      onInputChange={(event, newInputValue, reason) => {
        console.log("[reason]", reason);
        if (reason === "clear") {
          onChangeHandler(
            { target: { name, value: newInputValue } },
            searchList,
            reason,
            source
          );
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        return [
          {
            id: "SELECT-ALL",
            value: "select-all",
            category:
              searchList && searchList.length ? searchList[0].category : "ALL",
          },
          ...filtered,
        ];
      }}
      getOptionLabel={(option) => option.value}
      renderOption={(option, i) => {
        return (
          <>
            {option.id === "SELECT-ALL" ? (
              <Grid
                container
                wrap="wrap"
                spacing={2}
                onClick={() => selectAllItemHandler()}
              >
                <Grid item xs zeroMinWidth>
                  <Typography wrap>Select ALL</Typography>
                </Grid>
                <Grid item>
                  {!mainOption || !searchList.find((s) => s.selected) ? (
                    <Suspense fallback="Loading...">
                      <CheckBoxOutlineBlank style={{ fontSize: "16pt" }} />
                    </Suspense>
                  ) : (
                    <Suspense fallback="Loading...">
                      <CheckboxOnly style={{ fontSize: "16pt" }} />
                    </Suspense>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                wrap="wrap"
                spacing={2}
                style={{ borderTop: "1px solid grey" }}
                onClick={() => (option.selected = !option.selected)}
              >
                <Grid item xs zeroMinWidth>
                  <Typography wrap>{option.value}</Typography>
                </Grid>
                <Grid item>
                  {!option.selected ? (
                    <Suspense fallback="Loading...">
                      <CheckBoxOutlineBlank style={{ fontSize: "16pt" }} />
                    </Suspense>
                  ) : (
                    <Suspense fallback="Loading...">
                      <CheckboxOnly style={{ fontSize: "16pt" }} />
                    </Suspense>
                  )}
                </Grid>
              </Grid>
            )}
          </>
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
          placeholder={placeholder || ""}
          label={label}
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
}

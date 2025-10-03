import { Button, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { DATE_TYPE_SELECTION } from "utils/constants";
import CustomDateComplete from "components/AutoComplete/CustomDateComplete";
import DateRangeModal from "components/Modal/DateRangeModal";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import Helper from "utils/helper";
import { DEFAULT_ITEM } from "utils/constants";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

let dateOptions = [];
let lastDateType = "";
DATE_TYPE_SELECTION.forEach((c) => {
  dateOptions.push({ ...c, category: "date" });
});

const FilterTable = (props) => {
  const [keywordValue, setKeywordValue] = useState("");
  const [dateSelected, setDateSelected] = useState(
    dateOptions.find((d) => d.value === "thisMonth")
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isDateCustom, setIsDateCustom] = useState(false);

  useEffect(() => {
    const dates = Helper.formatDateRangeByCriteriaV2(
      props.dateRangeSelection || "thisMonth"
    );
    if (props.dateRangeSelection) {
      setDateSelected(
        dateOptions.find((d) => d.value === props.dateRangeSelection)
      );
    }
    setDateFrom(dates.from);
    setDateTo(dates.to);
  }, []);

  const inputHandler = ({ target }) => {
    switch (target.name) {
      case "keywordValue":
        setKeywordValue(target.value);
        return;
      default:
        return;
    }
  };
  const autoCompleteInputHander = (item) => {
    if (item.category === "date") {
      let data = {
        from: "",
        to: "",
      };
      if (item.value !== "custom") {
        data = Helper.formatDateRangeByCriteriaV2(item.value);
        console.log("[item data]", data);
      } else {
        data = Helper.formatDateRangeByCriteriaV2("last7Days");
      }
      setDateFrom(data.from);
      setDateTo(data.to);
      setIsDateCustom(item.value === "custom" || item.dateRange ? true : false);
      setDateSelected(item);
      if (item.value !== "custom") {
        props.filterByDateHandler({ from: data.from, to: data.to });
      }
    }
  };

  const onPressEnterKeyHandler = (val) => {
    console.log("[What is my key]", val);
    props.filterRecordHandler(val);
    setKeywordValue(val);
  };

  const onClearHandler = (name) => {
    if (name === "dateType") {
      lastDateType = "";
      setDateSelected(DEFAULT_ITEM);
      setDateFrom("");
      setDateTo("");
    }
  };

  const closeDateModalHandler = () => {
    setIsDateCustom(false);
    setDateSelected(dateOptions.find((e) => e.value === lastDateType));
  };
  const addDateHandler = (from, to) => {
    const dt = `${moment(from || new Date()).format("YYYY-MM-DD")} - ${moment(
      to || new Date()
    ).format("YYYY-MM-DD")}`;

    const options = dateOptions.filter((f) => !f.dateRange);
    const etaValue = {
      name: dt,
      value: dt,
      dateRange: dt,
      from,
      to,
      id: uuidv4(),
      label: dt,
      category: "etdDateType",
      disabled: true,
    };
    options.push(etaValue);
    dateOptions = options;
    setIsDateCustom(false);
    setDateSelected(etaValue);
    const _sfrom = from
      ? moment(new Date(from)).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
    const _sTo = to
      ? moment(new Date(to)).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
    setDateFrom(_sfrom);
    setDateTo(_sTo);
    props.filterByDateHandler({ from: _sfrom, to: _sTo });
  };
  /*
  const clearFilterHandler = () => {
    setKeywordValue("");

    setDateSelected(DEFAULT_ITEM);
  };
  const applyFilterHandler = () => {
    props.filterRecordHandler(keywordValue);
  };
  */
  console.log("[Dates]", dateOptions);
  return (
    <React.Fragment>
      <GridContainer sx={{ pt: 1 }} style={{ paddingTop: 10 }}>
        {!props.isNoDate && (
          <GridItem md={3} sm={6} xs={12}>
            <CustomDateComplete
              value={dateSelected || DEFAULT_ITEM}
              name="dateType"
              placeholder={
                dateSelected && dateSelected.name
                  ? `Date : ${dateFrom} to ${dateTo}`
                  : "Date"
              }
              onSelectHandler={autoCompleteInputHander}
              onClearHandler={onClearHandler}
              options={dateOptions || [DEFAULT_ITEM]}
            ></CustomDateComplete>
          </GridItem>
        )}
        {!props.isNoDate && isDateCustom && (
          <GridItem md={3} sm={6} xs={12}>
            <DateRangeModal
              description={`Created`}
              dateFrom={dateFrom}
              dateTo={dateTo}
              isOpen={isDateCustom}
              noHandler={closeDateModalHandler}
              yesHandler={addDateHandler}
            />
          </GridItem>
        )}

        <GridItem md={props.search || 3} sm={6} xs={12}>
          <SearchCustomTextField
            background={"white"}
            onChange={inputHandler}
            placeholder={"Search Item"}
            label={"Search Item"}
            name={"keywordValue"}
            onPressEnterKeyHandler={onPressEnterKeyHandler}
            isAllowEnterKey={true}
            value={keywordValue}
          />
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
};
export default FilterTable;

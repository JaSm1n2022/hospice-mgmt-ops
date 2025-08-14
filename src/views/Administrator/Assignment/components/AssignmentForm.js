import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Button, Card, Grid, Modal, Typography } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";
import CustomMultipleAutoComplete from "components/AutoComplete/CustomMultipleAutoComplete";
import { DAY_OF_WEEK } from "utils/constants";

let categoryList = [];
let uoms = [];
QUANTITY_UOM.forEach((item, index) => {
  uoms.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "uom",
  });
});
SUPPLY_CATEGORY.forEach((item, index) => {
  categoryList.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "category",
  });
});
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;
  const right = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  padding0: {
    padding: 0,
  },
  media: {
    height: 200,
  },
  paper: {
    position: "absolute",
    width: "70%",
    height: "50%",
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));
const cnaWeekOptions = [];
const rnWeekOptions = [];
const lpnWeekOptions = [];
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "cnaWeek";
  cnaWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "lpnWeek";
  lpnWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "rnWeek";
  rnWeekOptions.push({ ...d });
});
const PATIENT_ERROR_MSG = "Patient is required.";
const CNA_ERROR_MSG = "CNA is required.";
const RN_ERROR_MSG = "RN is required.";
const LPN_ERROR_MSG = "LPN is required.";

const CNA_VISIT_ERROR_MSG = "CNA visit frequency is required.";
const CNA_VISIT_TYPE_ERROR_MSG = "CNA visit type is required.";
const CNA_WEEK_ERROR_MSG = "CNA weekday is required.";

const RN_VISIT_ERROR_MSG = "RN visit is required.";
const RN_WEEK_ERROR_MSG = "RN weekday is required.";
const RN_VISIT_TYPE_ERROR_MSG = "RN visit type is required.";

const LPN_WEEK_ERROR_MSG = "LPN weekday is required.";
const LPN_VISIT_ERROR_MSG = "LPN visit is required.";
const LPN_VISIT_TYPE_ERROR_MSG = "LPN visit type is required.";
const cnaVisitTypeOptions = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "cnaVisitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "cnaVisitType",
  },
];
const rnVisitTypeOptions = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "rnVisitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "rnVisitType",
  },
];

const lpnVisitTypeOptions = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "lpnVisitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "lpnVisitType",
  },
];
const general = [
  {
    id: "patient",
    component: "singlecomplete",
    placeholder: "Patient *",
    label: "Patient *",
    name: "patient",
    isMandatory: true,
    errorMsg: PATIENT_ERROR_MSG,
    cols: 6,
  },
  {
    id: "location",
    component: "textfield",
    placeholder: "Location",
    disabled: true,
    label: "Location",
    name: "location",
    isMandatory: false,
    cols: 6,
  },
  {
    id: "cna",
    component: "singlecomplete",
    placeholder: "Assigned CNA *",
    label: "Assigned CNA *",
    name: "cna",
    errorMsg: CNA_ERROR_MSG,
    isMandatory: true,
    cols: 3,
  },
  {
    id: "cnaFreqVisit",
    component: "textfield",
    placeholder: "CNA # of Visit *",
    label: "CNA # of Visit *",
    name: "cnaFreqVisit",
    isMandatory: true,
    errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "cnaVisitType",
    component: "singlecomplete",
    placeholder: "CNA Visit Type",
    label: "CNA Visit Type",
    name: "cnaVisitType",
    errorMsg: CNA_VISIT_TYPE_ERROR_MSG,
    isMandatory: true,
    cols: 3,
    options: [...cnaVisitTypeOptions],
  },
  {
    id: "cnaWeek",
    component: "multiplecomplete",
    placeholder: "CNA Weekday *",
    label: "CNA Weekday *",
    name: "cnaWeek",
    isMandatory: true,
    errorMsg: CNA_WEEK_ERROR_MSG,
    cols: 3,
    options: [...cnaWeekOptions],
  },
  {
    id: "cnaTime",
    component: "textfield",
    placeholder: "CNA Time",
    label: "CNA Time *",
    name: "cnaTime",
    isMandatory: false,
    // errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "rn",
    component: "singlecomplete",
    placeholder: "Assigned RN *",
    label: "Assigned RN *",
    errorMsg: RN_ERROR_MSG,
    isMandatory: true,
    name: "rn",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "rnFreqVisit",
    component: "textfield",
    placeholder: "RN # of Visit *",
    label: "RN # of Visit *",
    isMandatory: true,
    name: "rnFreqVisit",
    errorMsg: RN_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "rnVisitType",
    component: "singlecomplete",
    placeholder: "RN Visit Type",
    label: "RN Visit Type",
    name: "rnVisitType",
    errorMsg: RN_VISIT_TYPE_ERROR_MSG,
    isMandatory: true,
    cols: 3,
    options: [...rnVisitTypeOptions],
  },
  {
    id: "rnWeek",
    component: "multiplecomplete",
    placeholder: "RN Weekday *",
    label: "RN Weekday *",
    name: "rnWeek",
    isMandatory: true,
    options: [...rnWeekOptions],
    errorMsg: RN_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "rnTime",
    component: "textfield",
    placeholder: "RN Time",
    label: "RN Time *",
    name: "rnTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "lpn",
    component: "singlecomplete",
    placeholder: "Assigned LPN *",
    label: "Assigned LPN *",
    errorMsg: LPN_ERROR_MSG,
    isMandatory: true,
    name: "lpn",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "lpnFreqVisit",
    component: "textfield",
    placeholder: "LPN # of Visit *",
    label: "LPN # of Visit *",
    isMandatory: true,
    name: "lpnFreqVisit",
    errorMsg: LPN_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "lpnVisitType",
    component: "singlecomplete",
    placeholder: "LPN Visit Type",
    label: "LPN Visit Type",
    name: "lpnVisitType",
    errorMsg: LPN_VISIT_TYPE_ERROR_MSG,
    isMandatory: true,
    cols: 3,
    options: [...lpnVisitTypeOptions],
  },
  {
    id: "lpnWeek",
    component: "multiplecomplete",
    placeholder: "LPN Weekday *",
    label: "LPN Weekday *",
    name: "lpnWeek",
    isMandatory: true,
    options: [...lpnWeekOptions],
    errorMsg: LPN_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "lpnTime",
    component: "textfield",
    placeholder: "LPN Time",
    label: "LPN Time *",
    name: "lpnTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
];
let patientInfo = {};
let cnaInfo = {};
let rnInfo = {};
let lpnInfo = {};
function AssignmentForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const { isOpen } = props;
  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    fm.patient = DEFAULT_ITEM;
    fm.location = "-";
    fm.cnaWeek = [];
    fm.rnWeek = [];
    setGeneralForm(fm);
    setComponents(general);
  }, []);
  useEffect(() => {
    const temp = components.length ? [...components] : [...general];
    patientInfo = {};
    cnaInfo = {};
    rnInfo = {};
    lpnInfo = {};
    console.log(
      "[TEMP PATIENTLIST]",
      temp,
      props.patientList,
      props.employeeList
    );
    if (temp && props.patientList && props.patientList.length) {
      const finalFormat = [...props.patientList];
      finalFormat.forEach((f) => {
        f.name = f.patientCd;
        f.value = f.patientCd;
        f.id = f.id;
        f.label = f.patientCd;
        f.category = "patient";
      });

      patientInfo = temp.find((t) => t.name === "patient");
      patientInfo.options = finalFormat;
    }
    if (temp && props.employeeList && props.employeeList.length) {
      const cnaList = [...props.employeeList].filter((f) =>
        ["Certified Nurse Assistant", "CNA"].includes(f.position)
      );
      const rnList = [...props.employeeList].filter((f) =>
        ["Director of Nurse", "RN", "CM", "Case Manager"].includes(f.position)
      );
      const lpnList = [...props.employeeList].filter((f) =>
        ["LPN"].includes(f.position)
      );
      const mswList = [...props.employeeList].filter((f) =>
        ["MSW"].includes(f.position)
      );
      const chaplainList = [...props.employeeList].filter((f) =>
        ["Chaplain"].includes(f.position)
      );
      const volunteerList = [...props.employeeList].filter((f) =>
        ["Volunteer"].includes(f.position)
      );
      cnaList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;
        f.category = "cna";
      });
      rnList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;

        f.category = "rn";
      });
      lpnList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;

        f.category = "lpn";
      });
      mswList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;

        f.category = "msw";
      });
      chaplainList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;

        f.category = "chaplain";
      });
      volunteerList.forEach((f) => {
        f.value = f.name;
        f.label = f.name;

        f.category = "chaplain";
      });
      cnaInfo = temp.find((t) => "cna" === t.name);

      cnaInfo.options = cnaList;
      rnInfo = temp.find((t) => ["rn"].includes(t.name));
      rnInfo.options = rnList;
      lpnInfo = temp.find((t) => "lpn" === t.name);
      lpnInfo.options = lpnList;
    }
    if (props.item) {
      console.log("[items]", props.item);

      const generalFm = { ...props.item };
      const cnaWeek = [];
      generalFm.cnaWeek.split(",").forEach((g) => {
        cnaWeek.push([...cnaWeekOptions].find((c) => c.name === g));
      });
      const rnWeek = [];
      generalFm.rnWeek.split(",").forEach((g) => {
        rnWeek.push([...rnWeekOptions].find((c) => c.name === g));
      });
      cnaWeek.forEach((c) => (c.selected = true));
      rnWeek.forEach((r) => (r.selected = true));
      const currentPatient = patientInfo.options
        ? patientInfo.options.find((o) => o.patientCd === generalFm.patientCd)
        : DEFAULT_ITEM;
      generalFm.patient = currentPatient;
      generalFm.location = currentPatient.name
        ? `${currentPatient.careType} - ${currentPatient.locationCd}`
        : "";
      generalFm.cnaWeek = cnaWeek;
      generalFm.rnWeek = rnWeek;
      generalFm.cna = cnaInfo.options
        ? cnaInfo.options.find((o) => o.name === generalFm.cnaName)
        : DEFAULT_ITEM;
      generalFm.rn = rnInfo.options
        ? rnInfo.options.find((o) => o.name === generalFm.rnName)
        : DEFAULT_ITEM;
      generalFm.lpn = lpnInfo.options
        ? lpnInfo.options.find((o) => o.name === generalFm.lpnName)
        : DEFAULT_ITEM;
      generalFm.lpnVisitType = lpnVisitTypeOptions.find(
        (l) => l.name === generalFm.lpnFreqVisitType
      );
      generalFm.cnaVisitType = cnaVisitTypeOptions.find(
        (l) => l.name === generalFm.cnaFreqVisitType
      );
      generalFm.rnVisitType = rnVisitTypeOptions.find(
        (l) => l.name === generalFm.rnFreqVisitType
      );

      setGeneralForm(generalFm);
    }
    setComponents(temp);
  }, [props.patientList, props.employeeList, props.item]);

  const validateComponentHandler = (source, isValid, component) => {
    console.log("[Validate]", component, source, isValid);
    if (
      component.component === "singlecomplete" &&
      component.isMandatory &&
      (!source[component.name] ||
        (source[component.name] && !source[component.name].name))
    ) {
      isValid = false;
      component.isError = true;
    } else if (
      component.component === "multiplecomplete" &&
      component.isMandatory &&
      (!source[component.name] ||
        (source[component.name] && source[component.name].length === 0))
    ) {
      isValid = false;
      component.isError = true;
    } else if (
      component.component === "textfield" &&
      component.isMandatory &&
      !source[component.name]
    ) {
      isValid = false;
      component.isError = true;
    }
    return isValid;
  };

  const validateFormHandler = () => {
    console.log("[General Form payload]", generalForm, props.mode);
    const componentList = [...components];
    let isValid = true;
    componentList.forEach((component) => {
      component.isError = false;
      isValid = validateComponentHandler(generalForm, isValid, component);
    });

    if (isValid) {
      console.log("[GENERAL FORM]", generalForm);
      props.createAssignmentHandler(generalForm, props.mode);
    } else {
      setComponents(componentList);
    }
  };

  const inputGeneralHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    if (target.value) {
      setErrorHandler(target.name, false);
    }
    setGeneralForm(source);
  };
  const setErrorHandler = (key, isError) => {
    const temp = [...components];
    const comp = temp.find((c) => c.name === key);
    if (comp.isMandatory) {
      comp.isError = isError;
    }
    setComponents(temp);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    setErrorHandler(item.category, false);
    if (item.category === "patient") {
      src.location = `${item.careType} - ${item.locationCd}`;
      src.patient = item;
    } else if (item.category === "cna") {
      src.cna = item;
    } else if (item.category === "rn") {
      src.rn = item;
    } else if (item.category === "lpn") {
      src.lpn = item;
    } else if (item.category === "cnaVisitType") {
      src.cnaVisitType = item;
    } else if (item.category === "rnVisitType") {
      src.rnVisitType = item;
    } else if (item.category === "lpnVisitType") {
      src.lpnVisitType = item;
    }
    setGeneralForm(src);
  };
  const onChangeGeneralInputHandler = (e) => {
    const src = { ...generalForm };
    if (!e.target.value) {
      src[e.target.name] = { name: "", label: "" };
      setGeneralForm(src);
      setErrorHandler(e.target.name, true);
    }
  };

  const dateInputHandler = (name, value) => {
    const src = { ...generalForm };
    src[name] = value;
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View IDT";
    } else if (props.mode === "edit") {
      return "Edit IDT";
    } else {
      return "Create IDT";
    }
  };
  console.log("[general form]", generalForm, components);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const selectAllHandler = (isAll, options) => {
    const temp = { ...generalForm };
    options.forEach((option) => {
      option.selected = isAll;
    });
    temp[options[0].category] = options;
    setGeneralForm(temp);
    setErrorHandler(options[0].category, false);
  };
  const onChangeInputHandler = (e, source, reason) => {
    const src = { ...generalForm };
    if (!e.target.value) {
      if (source && reason === "clear") {
        source.forEach((s) => (s.selected = false));
        src[e.target.name] = source;
        setGeneralForm(src);
        setErrorHandler(e.target.name, true);
      }
    }
  };
  const addItemHandler = (source) => {
    // for items it is not needed for this handler
    const src = { ...generalForm };
    const selectedItems =
      source && source.length ? source.filter((s) => s.selected) : [];
    const items = selectedItems && selectedItems.length ? selectedItems : [];
    src[source[0].category] = items;
    setGeneralForm(src);
    setErrorHandler(source[0].category, false);
  };
  const disabledComponentHandler = (src) => {
    console.log(
      "[Patient]",
      src,
      generalForm,
      JSON.stringify(generalForm) !== "{}"
    );
    if (src && src.name === "patient" && props.mode !== "create") {
      return true;
    }
    if (src && src.name == "patient") {
      return false;
    }
    if (src && src.name === "location") {
      return true;
    }
    if (
      src &&
      src.name &&
      src.name !== "patient" &&
      JSON.stringify(generalForm) !== "{}" &&
      (!generalForm.patient ||
        (generalForm.patient && !generalForm.patient.name))
    ) {
      console.log("[Patient here]");
      return true;
    }
    return false;
  };
  console.log("[General Form]", generalForm);
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="assignment"
      aria-describedby="assignmentmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

        <Grid xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              <Grid
                style={{ paddingTop: 10 }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={12} />
                {components.map((item) => {
                  return (
                    <Grid
                      item
                      xs={item.cols ? item.cols : 3}
                      style={{ paddingBottom: 2 }}
                    >
                      {item.component === "textfield" ? (
                        <React.Fragment>
                          <CustomTextField
                            {...item}
                            value={generalForm[item.name]}
                            disabled={disabledComponentHandler(item)}
                            onChange={inputGeneralHandler}
                          />
                        </React.Fragment>
                      ) : item.component === "datepicker" ? (
                        <React.Fragment>
                          <CustomDatePicker
                            {...item}
                            value={generalForm[item.name]}
                            onChange={dateInputHandler}
                            disabled={disabledComponentHandler(item)}
                          />
                        </React.Fragment>
                      ) : item.component === "singlecomplete" ? (
                        <React.Fragment>
                          <CustomSingleAutoComplete
                            {...item}
                            searchList={item.options || []}
                            options={item.options || []}
                            value={generalForm[item.name]}
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={onChangeGeneralInputHandler}
                            disabled={disabledComponentHandler(item)}
                          />
                        </React.Fragment>
                      ) : item.component === "multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "select" ? (
                        <React.Fragment>
                          <CustomSelect
                            {...item}
                            onChange={inputGeneralHandler}
                            value={generalForm[item.name]}
                            disabled={disabledComponentHandler(item)}
                          />
                        </React.Fragment>
                      ) : null}
                    </Grid>
                  );
                })}
              </Grid>
              <div style={{ paddingTop: 10 }}>
                <Button
                  disabled={
                    !generalForm.patient ||
                    (generalForm.patient && !generalForm.patient.name)
                  }
                  variant="contained"
                  color={
                    !generalForm.patient ||
                    (generalForm.patient && !generalForm.patient.name)
                      ? "default"
                      : "primary"
                  }
                  onClick={() => validateFormHandler()}
                >
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
          <br />
        </Grid>
      </div>
    </Modal>
  );
}
export default AssignmentForm;

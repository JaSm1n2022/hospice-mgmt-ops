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
import { AddOutlined, DeleteOutlined } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";
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
    width: "95%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    overFlowY: "auto",
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
const mswWeekOptions = [];
const chaplainWeekOptions = [];
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "cnaWeek";
  cnaWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "lpnWeek";
  lpnWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "mswWeek";
  mswWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "chaplainWeek";
  chaplainWeekOptions.push({ ...d });
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

const MSW_WEEK_ERROR_MSG = "MSW weekday is required.";
const MSW_VISIT_ERROR_MSG = "MSW visit is required.";
const MSW_VISIT_TYPE_ERROR_MSG = "MSW visit type is required.";

const CHAPLAIN_WEEK_ERROR_MSG = "Chaplain weekday is required.";
const CHAPLAIN_VISIT_ERROR_MSG = "Chaplain visit is required.";
const CHAPLAIN_VISIT_TYPE_ERROR_MSG = "Chaplain visit type is required.";
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
const mswVisitTypeOptions = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "mswVisitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "mswVisitType",
  },
];
const chaplainVisitTypeOptions = [
  {
    name: "Week",
    value: "Week",
    description: "Week",
    label: "Week",
    category: "chaplainVisitType",
  },
  {
    name: "Month",
    value: "Month",
    description: "Month",
    label: "Month",
    category: "chaplainVisitType",
  },
];
const initCnaId = uuidv4();
const cnaForm = [
  {
    id: "cna-action",
    component: "cna-action",
    placeholder: "Assigned CNA",
    label: "Assigned CNA",
    name: "cna-action",
    errorMsg: CNA_ERROR_MSG,
    cols: 1,
    uuid: initCnaId,
  },
  {
    id: "cna",
    component: "cna-singlecomplete",
    placeholder: "Assigned CNA",
    label: "Assigned CNA",
    name: "cna",
    errorMsg: CNA_ERROR_MSG,
    cols: 3,
    uuid: initCnaId,
  },
  {
    id: "cnaFreqVisit",
    component: "cna-textfield",
    placeholder: "CNA # of Visit",
    label: "CNA # of Visit",
    name: "cnaFreqVisit",

    errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
    uuid: initCnaId,
  },
  {
    id: "cnaVisitType",
    component: "cna-singlecomplete",
    placeholder: "CNA Visit Type",
    label: "CNA Visit Type",
    name: "cnaVisitType",
    errorMsg: CNA_VISIT_TYPE_ERROR_MSG,

    cols: 3,
    options: [...cnaVisitTypeOptions],
    uuid: initCnaId,
  },
  {
    id: "cnaWeek",
    component: "cna-multiplecomplete",
    placeholder: "CNA Weekday",
    label: "CNA Weekday",
    name: "cnaWeek",

    errorMsg: CNA_WEEK_ERROR_MSG,
    cols: 3,
    options: [...cnaWeekOptions],
    uuid: initCnaId,
  },
  {
    id: "cnaTime",
    component: "cna-textfield",
    placeholder: "CNA Time",
    label: "CNA Time",
    name: "cnaTime",
    isMandatory: false,
    // errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
    uuid: initCnaId,
  },
];

const general = [
  {
    id: "patient",
    component: "patientsinglecomplete",
    placeholder: "Patient *",
    label: "Patient *",
    name: "patient",
    isMandatory: true,
    errorMsg: PATIENT_ERROR_MSG,
    cols: 4,
  },
  {
    id: "location",
    component: "patienttextfield",
    placeholder: "Location",
    disabled: true,
    label: "Location",
    name: "location",
    isMandatory: false,
    cols: 4,
  },
  ...cnaForm,
  {
    id: "rn-action",
    component: "rn-action",
    name: "Action",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 1,
  },
  {
    id: "rn",
    component: "rn-singlecomplete",
    placeholder: "Assigned RN",
    label: "Assigned RN",
    errorMsg: RN_ERROR_MSG,

    name: "rn",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "rnFreqVisit",
    component: "rn-textfield",
    placeholder: "RN # of Visit",
    label: "RN # of Visit",

    name: "rnFreqVisit",
    errorMsg: RN_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "rnVisitType",
    component: "rn-singlecomplete",
    placeholder: "RN Visit Type",
    label: "RN Visit Type",
    name: "rnVisitType",
    errorMsg: RN_VISIT_TYPE_ERROR_MSG,

    cols: 3,
    options: [...rnVisitTypeOptions],
  },
  {
    id: "rnWeek",
    component: "rn-multiplecomplete",
    placeholder: "RN Weekday",
    label: "RN Weekday",
    name: "rnWeek",

    options: [...rnWeekOptions],
    errorMsg: RN_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "rnTime",
    component: "rn-textfield",
    placeholder: "RN Time",
    label: "RN Time",
    name: "rnTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "lpn-action",
    component: "lpn-action",
    name: "Action",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 1,
  },
  {
    id: "lpn",
    component: "lpn-singlecomplete",
    placeholder: "Assigned LPN",
    label: "Assigned LPN",
    errorMsg: LPN_ERROR_MSG,
    isMandatory: true,
    name: "lpn",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "lpnFreqVisit",
    component: "lpn-textfield",
    placeholder: "LPN # of Visit",
    label: "LPN # of Visit",
    isMandatory: true,
    name: "lpnFreqVisit",
    errorMsg: LPN_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "lpnVisitType",
    component: "lpn-singlecomplete",
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
    component: "lpn-multiplecomplete",
    placeholder: "LPN Weekday",
    label: "LPN Weekday",
    name: "lpnWeek",
    isMandatory: true,
    options: [...lpnWeekOptions],
    errorMsg: LPN_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "lpnTime",
    component: "lpn-textfield",
    placeholder: "LPN Time",
    label: "LPN Time",
    name: "lpnTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "msw-action",
    component: "msw-action",
    name: "Action",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 1,
  },
  {
    id: "msw",
    component: "msw-singlecomplete",
    placeholder: "Assigned MSW",
    label: "Assigned MSW",
    errorMsg: "",

    name: "msw",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "mswFreqVisit",
    component: "msw-textfield",
    placeholder: "MSW # of Visit",
    label: "MSW # of Visit",

    name: "mswFreqVisit",
    errorMsg: MSW_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "mswVisitType",
    component: "msw-singlecomplete",
    placeholder: "MSW Visit Type",
    label: "MSW Visit Type",
    name: "mswVisitType",
    errorMsg: MSW_VISIT_TYPE_ERROR_MSG,

    cols: 3,
    options: [...mswVisitTypeOptions],
  },
  {
    id: "mswWeek",
    component: "msw-multiplecomplete",
    placeholder: "MSW Weekday",
    label: "MSW Weekday",
    name: "mswWeek",

    options: [...mswWeekOptions],
    errorMsg: MSW_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "mswTime",
    component: "msw-textfield",
    placeholder: "MSW Time",
    label: "MSW Time",
    name: "mswTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "chaplain-action",
    component: "chaplain-action",
    name: "Action",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 1,
  },

  {
    id: "chaplain",
    component: "chaplain-singlecomplete",
    placeholder: "Assigned Chaplain",
    label: "Assigned Chaplain",
    errorMsg: "",

    name: "chaplain",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 3,
  },
  {
    id: "chaplainFreqVisit",
    component: "chaplain-textfield",
    placeholder: "Chaplain # of Visit",
    label: "Chaplain # of Visit",

    name: "chaplainFreqVisit",
    errorMsg: CHAPLAIN_VISIT_ERROR_MSG,

    cols: 3,
  },
  {
    id: "chaplainVisitType",
    component: "chaplain-singlecomplete",
    placeholder: "Chaplain Visit Type",
    label: "Chaplain Visit Type",
    name: "chaplainVisitType",
    errorMsg: CHAPLAIN_VISIT_TYPE_ERROR_MSG,

    cols: 3,
    options: [...chaplainVisitTypeOptions],
  },
  {
    id: "chaplainWeek",
    component: "chaplain-multiplecomplete",
    placeholder: "Chaplain Weekday",
    label: "Chaplain Weekday",
    name: "chaplainWeek",

    options: [...chaplainWeekOptions],
    errorMsg: CHAPLAIN_WEEK_ERROR_MSG,
    cols: 3,
  },
  {
    id: "chaplainTime",
    component: "chaplain-textfield",
    placeholder: "Chaplain Time",
    label: "Chaplain Time",
    name: "chaplainTime",
    isMandatory: false,
    //  errorMsg: CNA_VISIT_ERROR_MSG,
    cols: 3,
  },
];
let patientInfo = {};
let cnaInfo = {};
let rnInfo = {};
let lpnInfo = {};
let mswInfo = {};
let chaplainInfo = {};
function IDTForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const { isOpen } = props;
  useEffect(() => {
    const fm = {};
    console.log("[GENERAL]", general);
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
    mswInfo = {};
    chaplainInfo = {};

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
        [
          "Director of Nurse",
          "RN",
          "CM",
          "Case Manager",
          "Registered Nurse",
        ].includes(f.position)
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

      mswInfo = temp.find((t) => "msw" === t.name);
      mswInfo.options = mswList;
      chaplainInfo = temp.find((t) => "chaplain" === t.name);
      chaplainInfo.options = chaplainList;
    }

    if (props.item) {
      console.log("[items]", props.item);

      const generalFm = { ...props.item };

      const currentPatient = patientInfo.options
        ? patientInfo.options.find((o) => o.patientCd === generalFm.patientCd)
        : DEFAULT_ITEM;
      generalFm.patient = currentPatient;
      generalFm.location = currentPatient.name
        ? `${currentPatient.careType} - ${currentPatient.locationCd}`
        : "";

      //CNA
      const cnaWeek = [];
      if (generalFm.cnaWeek) {
        generalFm.cnaWeek?.split(",").forEach((g) => {
          cnaWeek.push([...cnaWeekOptions].find((c) => c.name === g));
        });
      }
      console.log("[CNA WEEK]", cnaWeek);
      if (cnaWeek?.length) {
        cnaWeek.forEach((c) => (c.selected = true));
      }
      generalFm.cnaWeek = cnaWeek;
      generalFm.cna = cnaInfo.options
        ? cnaInfo.options.find((o) => o.name === generalFm.cnaName)
        : DEFAULT_ITEM;
      generalFm.cnaVisitType = cnaVisitTypeOptions.find(
        (l) => l.name === generalFm.cnaFreqVisitType
      );
      // RN
      const rnWeek = [];
      if (generalFm.rnWeek) {
        generalFm.rnWeek?.split(",").forEach((g) => {
          rnWeek.push([...rnWeekOptions].find((c) => c.name === g));
        });
      }
      console.log("[CNA WEEK]", rnWeek, rnWeek.length);
      if (rnWeek?.length) {
        rnWeek.forEach((r) => (r.selected = true));
      }
      generalFm.rnWeek = rnWeek;
      generalFm.rn = rnInfo.options
        ? rnInfo.options.find((o) => o.name === generalFm.rnName)
        : DEFAULT_ITEM;
      generalFm.rnVisitType = rnVisitTypeOptions.find(
        (l) => l.name === generalFm.rnFreqVisitType
      );

      // LP
      const lpnWeek = [];
      if (generalFm.lpnWeek) {
        generalFm.lpnWeek?.split(",").forEach((g) => {
          lpnWeek.push([...lpnWeekOptions].find((c) => c.name === g));
        });
      }
      if (lpnWeek?.length) {
        lpnWeek.forEach((r) => (r.selected = true));
      }
      generalFm.lpnWeek = lpnWeek;
      generalFm.lpn = lpnInfo.options
        ? lpnInfo.options.find((o) => o.name === generalFm.lpnName)
        : DEFAULT_ITEM;
      generalFm.lpnVisitType = lpnVisitTypeOptions.find(
        (l) => l.name === generalFm.lpnFreqVisitType
      );

      // MSW
      const mswWeek = [];
      if (generalFm.mswWeek) {
        generalFm.mswWeek?.split(",").forEach((g) => {
          mswWeek.push([...mswWeekOptions].find((c) => c.name === g));
        });
      }
      if (mswWeek?.length) {
        mswWeek.forEach((r) => (r.selected = true));
      }
      generalFm.mswWeek = mswWeek;
      generalFm.msw = mswInfo.options
        ? mswInfo.options.find((o) => o.name === generalFm.mswName)
        : DEFAULT_ITEM;
      generalFm.mswVisitType = mswVisitTypeOptions.find(
        (l) => l.name === generalFm.mswFreqVisitType
      );

      // CHAPLAIN
      const chaplainWeek = [];
      if (generalFm.chaplainWeek) {
        generalFm.chaplainWeek?.split(",").forEach((g) => {
          chaplainWeek.push([...chaplainWeekOptions].find((c) => c.name === g));
        });
      }
      if (chaplainWeek?.length) {
        chaplainWeek.forEach((r) => (r.selected = true));
      }
      generalFm.chaplainWeek = chaplainWeek;
      generalFm.chaplain = chaplainInfo.options
        ? chaplainInfo.options.find((o) => o.name === generalFm.chaplainName)
        : DEFAULT_ITEM;
      generalFm.chaplainVisitType = chaplainVisitTypeOptions.find(
        (l) => l.name === generalFm.chaplainFreqVisitType
      );

      setGeneralForm(generalFm);
    }
    setComponents(temp);
  }, [props.patientList, props.employeeList, props.item]);

  const createTemplateHandler = (mode) => {
    const uuid = uuidv4();
    console.log("[CNA FORM NEW UUID]", uuid);
    if (mode === "cna") {
      const newForm = [];
      [...cnaForm].forEach((c) => {
        const o = { ...c };
        console.log("[CNA FORM O NEW UUID]", o);
        o.uuid = uuid;
        newForm.push(o);
      });
      console.log("[CNA FORM]", newForm);
      return newForm;
    }
  };
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
    } else if (item.category === "msw") {
      src.msw = item;
    } else if (item.category === "chaplain") {
      src.chaplain = item;
    } else if (item.category === "mswVisitType") {
      src.mswVisitType = item;
    } else if (item.category === "chaplainVisitType") {
      src.chaplainVisitType = item;
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
  const addHandler = (form) => {
    const cmps = [...components];
    cmps.push(...form);
    setComponents(cmps);
  };
  const deleteHandler = (item) => {
    console.log("[ITEM]", item);
    const cmps = [...components].filter(
      (f) => f.uuid?.toString() !== item?.uuid
    );

    setComponents(cmps);
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

        <Grid xs={12} sm={12} md={12} style={{ padding: 0 }}>
          <Card plain>
            <CardBody>
              <Grid
                container
                spacing={1}
                direction="row"
                style={{ padding: 0 }}
              >
                {components.map((item) => {
                  return (
                    <Grid
                      item
                      xs={4}
                      style={{
                        display:
                          item.component === "patientsinglecomplete" ||
                          item.component === "patienttextfield"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "patientsinglecomplete" ? (
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
                      ) : item.component === "patienttextfield" ? (
                        <React.Fragment>
                          <CustomTextField
                            {...item}
                            value={generalForm[item.name]}
                            disabled={disabledComponentHandler(item)}
                            onChange={inputGeneralHandler}
                          />
                        </React.Fragment>
                      ) : null}
                    </Grid>
                  );
                })}

                <Grid item xs={12}>
                  <Typography variant="h6">
                    Certified Nursing Assistant (CNA)
                  </Typography>
                </Grid>

                {components?.map((item, indx) => {
                  return (
                    <Grid
                      item
                      xs={item.component === "cna-action" ? 2 : 2}
                      style={{
                        display:
                          item.component === "cna-action" ||
                          item.component === "cna-textfield" ||
                          item.component === "cna-singlecomplete" ||
                          item.component === "cna-multiplecomplete"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "cna-action" ? (
                        <div style={{ display: "inline-flex", gap: 10 }}>
                          <AddOutlined
                            style={{ color: "blue" }}
                            onClick={() =>
                              addHandler(createTemplateHandler("cna"))
                            }
                          />
                          <DeleteOutlined
                            style={{ color: "red" }}
                            onClick={() => deleteHandler(item)}
                          />
                        </div>
                      ) : item.component === "cna-textfield" ? (
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
                        />
                      ) : item.component === "cna-datepicker" ? (
                        <CustomDatePicker
                          {...item}
                          value={generalForm[item.name]}
                          onChange={dateInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "cna-singlecomplete" ? (
                        <CustomSingleAutoComplete
                          {...item}
                          searchList={item.options || []}
                          options={item.options || []}
                          value={generalForm[item.name]}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "cna-multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "cna-select" ? (
                        <CustomSelect
                          {...item}
                          onChange={inputGeneralHandler}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : null}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Typography variant="h6">Case Manager</Typography>
                </Grid>

                {components?.map((item) => {
                  return (
                    <Grid
                      item
                      xs={item.component === "rn-action" ? 2 : 2}
                      style={{
                        display:
                          item.component === "rn-textfield" ||
                          item.component === "rn-singlecomplete" ||
                          item.component === "rn-multiplecomplete" ||
                          item.component === "rn-action"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "rn-action" ? (
                        <div style={{ display: "inline-flex", gap: 10 }}>
                          <AddOutlined style={{ color: "blue" }} />
                          <DeleteOutlined style={{ color: "red" }} />
                        </div>
                      ) : item.component === "rn-textfield" ? (
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
                        />
                      ) : item.component === "rn-singlecomplete" ? (
                        <CustomSingleAutoComplete
                          {...item}
                          searchList={item.options || []}
                          options={item.options || []}
                          value={generalForm[item.name]}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "rn-multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : null}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Licensed Practical Nurse (LPN)
                  </Typography>
                </Grid>

                {components?.map((item) => {
                  return (
                    <Grid
                      item
                      xs={2}
                      style={{
                        display:
                          item.component === "lpn-textfield" ||
                          item.component === "lpn-singlecomplete" ||
                          item.component === "lpn-multiplecomplete"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "lpn-textfield" ? (
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
                        />
                      ) : item.component === "lpn-singlecomplete" ? (
                        <CustomSingleAutoComplete
                          {...item}
                          searchList={item.options || []}
                          options={item.options || []}
                          value={generalForm[item.name]}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "lpn-multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : null}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Master of Social Work (MSW)
                  </Typography>
                </Grid>

                {components?.map((item) => {
                  return (
                    <Grid
                      item
                      xs={2}
                      style={{
                        display:
                          item.component === "msw-textfield" ||
                          item.component === "msw-singlecomplete" ||
                          item.component === "msw-multiplecomplete"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "msw-textfield" ? (
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
                        />
                      ) : item.component === "msw-singlecomplete" ? (
                        <CustomSingleAutoComplete
                          {...item}
                          searchList={item.options || []}
                          options={item.options || []}
                          value={generalForm[item.name]}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "msw-multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : null}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Spiritual Coordinator/Chaplain
                  </Typography>
                </Grid>

                {components?.map((item) => {
                  return (
                    <Grid
                      item
                      xs={2}
                      style={{
                        display:
                          item.component === "chaplain-textfield" ||
                          item.component === "chaplain-singlecomplete" ||
                          item.component === "chaplain-multiplecomplete"
                            ? ""
                            : "none",
                      }}
                    >
                      {item.component === "chaplain-textfield" ? (
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
                        />
                      ) : item.component === "chaplain-singlecomplete" ? (
                        <CustomSingleAutoComplete
                          {...item}
                          searchList={item.options || []}
                          options={item.options || []}
                          value={generalForm[item.name]}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : item.component === "chaplain-multiplecomplete" ? (
                        <CustomMultipleAutoComplete
                          {...item}
                          onChangeHandler={onChangeInputHandler}
                          selected={generalForm[item.name]}
                          selectAllHandler={selectAllHandler}
                          selectHandler={addItemHandler}
                          searchList={item.options || []}
                          disabled={disabledComponentHandler(item)}
                        />
                      ) : null}
                    </Grid>
                  );
                })}
              </Grid>
              <div style={{ paddingTop: 10, paddingBottom: 10 }}>
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
export default IDTForm;

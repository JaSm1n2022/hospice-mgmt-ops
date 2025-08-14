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
import moment from "moment";

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
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "cnaWeek";
  cnaWeekOptions.push({ ...d });
});
[...DAY_OF_WEEK].forEach((d) => {
  d.category = "rnWeek";
  rnWeekOptions.push({ ...d });
});
const PATIENT_ERROR_MSG = "Patient is required.";
const REFERRAL_ERROR_MSG = "Referral is required.";

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
    id: "referral",
    component: "textfield",
    placeholder: "Referral",
    label: "Referral",
    name: "referral",
    isMandatory: false,
    errorMsg: PATIENT_ERROR_MSG,
    cols: 6,
  },
  {
    id: "eligibility",
    component: "datepicker",
    placeholder: "Eligibility",
    label: "Eligibility",
    name: "eligibility",
    noDefault: true,
    cols: 3,
  },
  {
    id: "eval",
    component: "datepicker",
    placeholder: "Eval",
    label: "Eval",
    name: "eval",
    noDefault: true,
    cols: 3,
  },
  {
    id: "hp",
    component: "datepicker",
    placeholder: "H & P",
    label: "H & P",
    name: "hp",
    noDefault: true,
    cols: 3,
  },
  {
    id: "assessment",
    component: "datepicker",
    placeholder: "Assessment",
    label: "Assessment",
    noDefault: true,
    name: "assessment",
    cols: 3,
  },
  {
    id: "intake",
    component: "datepicker",
    placeholder: "Intake",
    label: "Intake",
    name: "intake",
    noDefault: true,
    cols: 3,
  },
  {
    id: "medRecord",
    component: "datepicker",
    placeholder: "Medical Record",
    label: "Medical Record",
    name: "medRecord",
    noDefault: true,
    cols: 3,
  },
  {
    id: "soc",
    component: "datepicker",
    placeholder: "SOC",
    label: "SOC",
    name: "soc",
    noDefault: true,
    cols: 3,
  },
  {
    id: "polst",
    component: "datepicker",
    placeholder: "POLST",
    label: "POLST",
    name: "polst",
    noDefault: true,
    cols: 3,
  },
  {
    id: "noe",
    component: "datepicker",
    placeholder: "NOE",
    label: "NOE",
    name: "noe",
    noDefault: true,
    cols: 3,
  },
  {
    id: "cti",
    component: "datepicker",
    placeholder: "CTI",
    label: "CTI",
    name: "cti",
    noDefault: true,
    cols: 3,
  },
];
let patientInfo = {};
let cnaInfo = {};
let rnInfo = {};
function AdmittanceForm(props) {
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
    console.log("[TEMP]", temp, props.patientList);
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
      generalFm.eval = generalFm.eval
        ? moment(new Date(generalFm.eval)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.hp = generalFm.hp
        ? moment(new Date(generalFm.hp)).utc().format("YYYY-MM-DD")
        : "";

      generalFm.eligibility = generalFm.eligibility
        ? moment(new Date(generalFm.eligibility)).utc().format("YYYY-MM-DD")
        : "";

      generalFm.intake = generalFm.intake
        ? moment(new Date(generalFm.intake)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.soc = generalFm.soc
        ? moment(new Date(generalFm.soc)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.noe = generalFm.noe
        ? moment(new Date(generalFm.noe)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.polst = generalFm.polst
        ? moment(new Date(generalFm.polst)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.assessment = generalFm.assessment
        ? moment(new Date(generalFm.assessment)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.cti = generalFm.cti
        ? moment(new Date(generalFm.cti)).utc().format("YYYY-MM-DD")
        : "";
      generalFm.medRecord = generalFm.medRecord
        ? moment(new Date(generalFm.medRecord)).utc().format("YYYY-MM-DD")
        : "";
      setGeneralForm(generalFm);
    }
    setComponents(temp);
  }, [props.patientList, props.item]);

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
      props.createAdmittanceHandler(generalForm, props.mode);
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

  const dateInputHandler = (value, name) => {
    const src = { ...generalForm };
    src[name] = value;
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Admittance";
    } else if (props.mode === "edit") {
      return "Edit Admittance";
    } else {
      return "Create Admittance";
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
      aria-labelledby="admittance"
      aria-describedby="admittancemodal"
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
                      xs={12}
                      md={item.cols ? item.cols : 3}
                      sm={12}
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
export default AdmittanceForm;

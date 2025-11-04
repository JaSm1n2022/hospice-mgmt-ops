import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Button,
  CardContent,
  Grid,
  Modal,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { useTheme } from "@material-ui/core";
import moment, { fn } from "moment";
import { CARE_TYPE } from "utils/constants";
import { PATIENT_STATUS } from "utils/constants";
import { INSURANCE } from "utils/constants";
import { DISCHARGE_REASON } from "utils/constants";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";
import CardHeader from "components/Card/CardHeader";
import { Clear } from "@material-ui/icons";

let categoryList = [];
let uoms = [];
const eocDischargeList = [];
const priorDischargeList = [];
DISCHARGE_REASON.forEach((item) => {
  priorDischargeList.push({ ...item, category: "discharge" });
  eocDischargeList.push({ ...item, category: "eocDischarge" });
});
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
    height: "85%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    elevation: 2,
  },
  scrollableContent: {
    flex: 1,
    overflow: "auto",
    padding: theme.spacing(2, 4, 3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
  sectionHeader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#e91e63",
    marginBottom: theme.spacing(1),
  },
  sectionDivider: {
    marginBottom: theme.spacing(2),
    backgroundColor: "#e91e63",
    height: 2,
  },
}));
let generatedPatientId = "";
function PatientForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [searchItem, setSearchItem] = useState(DEFAULT_ITEM);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [patientIdentity, setPatientIdentity] = useState("");
  const [patientIdentityError, setPatientIdentityError] = useState("");
  const { isOpen } = props;

  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    const general = [
      {
        id: "status",
        component: "singlecomplete",
        placeholder: "Status",
        label: "Status",
        name: "status",
        options: PATIENT_STATUS,
        hide: props.mode && props.mode === "create" ? true : false,
        cols: 12,
      },
      // PROFILE SECTION
      {
        id: "profileHeader",
        component: "sectionheader",
        label: "Patient Profile",
        cols: 12,
      },
      {
        id: "ln",
        component: "textfield",
        placeholder: "Last Name",
        label: "Last Name*",
        name: "ln",
        cols: 6,
      },
      {
        id: "fn",
        component: "textfield",
        placeholder: "Initial Name",
        label: "Initial Name*",
        name: "fn",
        cols: 6,
      },
      {
        id: "phone",
        component: "textfield",
        placeholder: "Contact Phone",
        label: "Phone",
        name: "phone",
        cols: 6,
      },
      {
        id: "contactPerson",
        component: "textfield",
        placeholder: "Contact Person",
        label: "Contact Person",
        name: "contactPerson",
        cols: 6,
      },
      {
        id: "address",
        component: "textfield",
        placeholder: "Address",
        label: "Address",
        name: "address",
        cols: 8,
      },
      {
        id: "location",
        component: "singlecomplete",
        placeholder: "Location",
        label: "Location",
        name: "location",
        cols: 4,
      },
      // PRIOR HOSPICE SECTION
      {
        id: "priorHospiceHeader",
        component: "sectionheader",
        label: "Prior Hospice Information",
        cols: 12,
      },
      {
        id: "isPriorHospice",
        component: "checkbox",
        placeholder: "Has Prior Hospice Care",
        label: "Has Prior Hospice Care",
        name: "isPriorHospice",
        cols: 12,
      },
      {
        id: "priorHospiceDischarge",
        component: "singlecomplete",
        placeholder: "Prior Hospice Discharge Reason",
        label: "Prior Hospice Discharge Reason",
        name: "priorHospiceDischarge",
        options: [...priorDischargeList],
        cols: 6,
      },
      {
        id: "priorHospiceDischargeDt",
        component: "datepicker",
        placeholder: "Prior Hospice Discharge Date",
        label: "Prior Hospice Discharge Date",
        name: "priorHospiceDischargeDt",
        cols: 6,
      },
      {
        id: "priorDayCare",
        component: "textfield",
        type: "number",
        placeholder: "Prior Hospice # Daycare",
        label: "Prior Hospice # Daycare",
        name: "priorDayCare",
        hide: false,
        cols: 6,
      },
      {
        id: "priorBenefitsPeriod",
        component: "textfield",
        type: "number",
        placeholder: "Max Benefit Period",
        label: "Max Benefits Period",
        name: "priorBenefitsPeriod",
        hide: false,
        value: "1",
        cols: 6,
      },
      // ADMISSION SECTION
      {
        id: "admissionHeader",
        component: "sectionheader",
        label: "Admission Information",
        cols: 12,
      },
      {
        id: "soc",
        component: "datepicker",
        placeholder: "SOC (Start of Care)",
        label: "SOC (Start of Care)*",
        name: "soc",
        cols: 4,
      },
      {
        id: "numberOfBenefits",
        component: "textfield",
        type: "number",
        placeholder: "Admitted Benefits Period",
        label: "Admitted Benefits Period",
        name: "numberOfBenefits",
        hide: false,
        value: 1,
        cols: 4,
      },
      {
        id: "insurance",
        component: "singlecomplete",
        placeholder: "Insurance",
        label: "Insurance",
        name: "insurance",
        hide: false,
        options: [...INSURANCE],
        cols: 4,
      },
      {
        id: "capeligible",
        component: "capeligible",
        placeholder: "Cap Eligibility",
        label: "Eligible for Cap?",
        name: "capeligible",
        hide: false,
        cols: 12,
      },
      // EOC/DISCHARGE SECTION
      {
        id: "eocHeader",
        component: "sectionheader",
        label: "EOC / Discharge Information",
        cols: 12,
      },
      {
        id: "eoc",
        component: "datepicker",
        placeholder: "EOC (End of Care)",
        label: "EOC (End of Care)",
        name: "eoc",
        cols: 6,
      },
      {
        id: "eocDischarge",
        component: "singlecomplete",
        placeholder: "EOC Discharge Reason",
        label: "EOC Discharge Reason",
        name: "eocDischarge",
        options: [...eocDischargeList],
        cols: 6,
      },
    ];
    setComponents(general);

    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    if (props.item) {
      console.log("[items]", props.item);
      console.log("[LocationList]", props.locationList);
      const fm = { ...props.item };
      fm.isPriorHospice = fm.is_prior_hospice;
      fm.priorDayCare = fm.prior_day_care || undefined;
      fm.numberOfBenefits = fm.admitted_benefits_period || undefined;
      if (fm.prior_hospice_discharge_dt) {
        fm.priorHospiceDischargeDt = fm.prior_hospice_discharge_dt;
      }
      fm.priorBenefitsPeriod = fm.prior_benefits_period || undefined;
      fm.eocDischarge = fm.eoc_discharge
        ? eocDischargeList.find((f) => f.name === fm.eoc_discharge)
        : DEFAULT_ITEM;
      fm.priorHospiceDischarge = fm.prior_hospice_discharge
        ? priorDischargeList.find((f) => f.name === fm.prior_hospice_discharge)
        : DEFAULT_ITEM;
      fm.careType = CARE_TYPE.find((a) => a.value === fm.careType);
      fm.location = props.locationList.find(
        (loc) => loc.locationCd === props.item.locationCd
      );
      fm.status =
        PATIENT_STATUS.find(
          (p) => p.value?.toLowerCase() === fm.status?.toLowerCase()
        ) || PATIENT_STATUS.find((p) => p.value === "Active");
      setIsSubmitDisabled(false);
      fm.insurance = [...INSURANCE].find(
        (p) => p.name === props.item.insurance
      );

      fm.location.value = fm.location?.name;
      fm.location.label = fm.location?.name;
      setPatientIdentity(fm.patientCd);
      setGeneralForm(fm);
    }
  }, [props.item]);
  useEffect(() => {
    console.log("[LocationList]", props.locationList);
    const arr = [];
    props.locationList.forEach((loc) => {
      arr.push({
        ...loc,
        value: loc.name,
        label: loc.name,
        category: "location",
      });
    });
    setLocations(arr);
  }, [props.locationList]);
  const dischargeDaysHandler = (src) => {
    const start = moment(moment(new Date(src.soc)).format("YYYY-MM-DD 00:00"));
    const end = moment(
      moment(new Date(src.priorHospiceDischargeDt)).format("YYYY-MM-DD 00:00")
    );
    const diff = moment.duration(start.diff(end));

    const diffDays = Math.floor(diff.asDays());
    console.log("[DISCHARGE DAYS HANDLER]", src, diffDays);
    if (diffDays >= 61) {
      return 1;
    }
    return src.numberOfBenefits;
  };
  const validateFormHandler = () => {
    const tempList = [...components];
    console.log("[tempList]", tempList, generalForm);
    let isValid = true;
    tempList.forEach((temp) => {
      temp.isError = false;
      temp.errorMsg = "";
      if (["ln", "fn", "soc"].includes(temp.name) && !generalForm[temp.name]) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
      if (temp.name === "location" && !generalForm[temp.name]?.name) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
      if (
        temp.name === "numberOfBenefits" &&
        generalForm.soc &&
        (!generalForm.numberOfBenefits || generalForm.numberOfBenefits === 0)
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }

      if (
        temp.name === "priorHospiceDischarge" &&
        generalForm.isPriorHospice &&
        !generalForm.priorHospiceDischarge?.name
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }
      if (
        temp.name === "priorHospiceDischargeDt" &&
        generalForm.isPriorHospice &&
        !generalForm.priorHospiceDischargeDt
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }
      if (
        temp.name === "priorBenefitsPeriod" &&
        generalForm.isPriorHospice &&
        !generalForm.priorBenefitsPeriod
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }
      if (
        temp.name === "priorDayCare" &&
        generalForm.priorHospiceDischarge?.name ===
          "Transfer another hospice" &&
        (!generalForm.priorDayCare || generalForm.priorDayCare === 0)
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }

      if (
        temp.name === "eocDischarge" &&
        generalForm.eoc &&
        !generalForm.eocDischarge?.name
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }
      if (temp.name === "insurance" && !generalForm.insurance?.name) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required`;
      }
    });

    if (!patientIdentity) {
      isValid = false;
      setPatientIdentityError("Patient Code is required. Use Suggested id.");
    } else {
      setPatientIdentityError("");
    }
    if (!isValid) {
      setComponents(tempList);
    } else {
      generalForm.patientCd = patientIdentity;
      generalForm.is_eligible_cap =
        checkCapEligibility() === "YES" ? true : false;
      props.createPatientHandler(generalForm, props.mode);
    }
  };
  const inputIdentityHandler = ({ target }) => {
    setPatientIdentity(target.value);
  };
  const inputGeneralHandler = ({ target }, src) => {
    console.log("[Target]", target, generalForm, target.type, target.checked);
    const source = { ...generalForm };
    source[target.name] =
      target.type === "checkbox" ? target.checked : target.value;
    console.log("[source]", source);

    if (target.type !== "checkbox") {
      const tempList = [...components];
      const currentItem = tempList.find((s) => s.name === target.name);
      if (currentItem && target.value) {
        currentItem.isError = false;
      } else if (currentItem && !target.value) {
        currentItem.isError = true;
        currentItem.errorMsg = `${currentItem.label} is required.`;
      }
      setComponents(tempList);
    }

    console.log("[SOURCE]", source);
    setGeneralForm(source);
  };

  const autoCompleteGeneralInputHander = (item, source) => {
    const src = { ...generalForm };
    const temp = [...components];
    const found = temp.find((t) => t.name === source.name);
    if (found) {
      found.isError = false;
      found.errorMsg = "";
    }
    console.log("[src autocomplete]", src, item, source);
    if (item.category === "location") {
      src.location = item;
    } else if (item.category === "patientStatus") {
      src.status = item;
    } else if (item.category === "insurance") {
      src.insurance = item;
    } else if (item.category === "discharge") {
      src.priorHospiceDischarge = item;
    } else if (item.category === "eocDischarge") {
      src.eocDischarge = item;
    }
    setComponents(temp);

    setGeneralForm(src);
  };

  const onChangeGeneralInputHandler = (e) => {
    const src = { ...generalForm };
    if (!e.target.value) {
      src[e.target.name] = { name: "", label: "" };
      setGeneralForm(src);
    }
  };

  const dateInputHandler = (value, name) => {
    const src = { ...generalForm };
    src[name] = moment(new Date(value)).format("YYYY-MM-DD HH:mm");
    const temp = [...components];
    const found = temp.find((t) => t.name === name);
    found.isError = false;
    found.errorMsg = "";
    setComponents(temp);

    if (src.soc && src.isPriorHospice && src.priorHospiceDischargeDt) {
      src.numberOfBenefits = dischargeDaysHandler(src);
    }
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Patient";
    } else if (props.mode === "edit") {
      return "Edit Patient";
    } else {
      return "Create Patient";
    }
  };
  console.log("[general form]", generalForm);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const disabledComponentHandler = (src) => {
    console.log("[Disabled Me]", src);
    if (src && src.name == "ln") {
      return false;
    }

    if (
      src &&
      src.name === "priorHospiceDischarge" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.isPriorHospice
    ) {
      return true;
    }
    if (
      src &&
      src.name === "priorHospiceDischargeDt" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.isPriorHospice
    ) {
      return true;
    }
    if (
      src &&
      src.name === "priorBenefitsPeriod" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.isPriorHospice
    ) {
      return true;
    }
    if (
      src &&
      src.name === "priorDayCare" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.isPriorHospice
    ) {
      return true;
    }
    if (
      src &&
      src.name === "eoc" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.soc
    ) {
      return true;
    }
    if (
      src &&
      src.name === "eocDischarge" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.eoc
    ) {
      return true;
    }
    if (
      src &&
      src.name &&
      src.name !== "ln" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.ln
    ) {
      return true;
    }
    return false;
  };
  const isSubmitButtonDisabled = () => {
    return (
      JSON.stringify(generalForm) === "{}" ||
      !generalForm.fn ||
      !generalForm.ln ||
      !generalForm.soc
    );
  };
  const createPatientIdHandler = () => {
    console.log("[General Form]", generalForm);
    generatedPatientId = "";
    if (generalForm.fn && generalForm.ln && generalForm.soc) {
      if (generalForm.ln.length < 5) {
        generatedPatientId += generalForm.ln.toUpperCase();
      } else {
        generatedPatientId += generalForm.ln.substring(
          0,
          generalForm.ln.length - 2
        );
      }
      if (generalForm.fn.length < 3) {
        generatedPatientId += `-${generalForm.fn}`;
      } else {
        generatedPatientId += `-${generalForm.fn.substring(
          0,
          generalForm.fn.length - 2
        )}`;
      }
      generatedPatientId += `.${moment(new Date(generalForm.soc)).format(
        "YYYYMMDD"
      )}`;
    }
    generatedPatientId = generatedPatientId.toUpperCase();
    return generatedPatientId;
  };
  const footerActions = [
    {
      title: props.distribution ? "Apply" : "Save",
      type: "primary",
      event: "submit",
      callback: () => {
        validateFormHandler();
      },
    },

    {
      title: "Cancel",
      type: "default",
      event: "cancel",
      callback: () => {
        console.log("[Cancel me]");
        clearModalHandler();
      },
    },
  ];

  const checkCapEligibility = () => {
    console.log("[CHECK ELIGIBIILITY]", generalForm);
    if (!generalForm.insurance?.name) {
      // must have insurance
      return "NO";
    }
    if (
      generalForm.insurance &&
      generalForm.insurance?.name !== "Traditional Medicare" // must be traditional medicare
    ) {
      // only traditional Medicare
      return "NO";
    }
    if (
      generalForm.numberOfBenefits &&
      parseInt(generalForm.numberOfBenefits || 0, 10) >= 3 // admitted must not be equal or greater than 3
    ) {
      return "NO";
    }

    if (
      generalForm.isPriorHospice &&
      parseInt(generalForm.priorBenefitsPeriod || 0, 10) >= 3 // previous max benefits cannot be more or equal to 3
    ) {
      return "NO";
    }
    if (
      !generalForm.isPriorHospice &&
      generalForm.numberOfBenefits &&
      parseInt(generalForm.numberOfBenefits || 0, 10) <= 2 // number of benefits must be equal or less 2 with no prior hospice
    ) {
      return "YES";
    }
    if (
      generalForm.isPriorHospice &&
      parseInt(generalForm.priorBenefitsPeriod || 0, 10) <= 2 &&
      generalForm.numberOfBenefits &&
      parseInt(generalForm.numberOfBenefits || 0, 10) <= 2
    ) {
      return "YES";
    }
    return "TBD";
  };
  console.log("[General FormX]", generalForm, patientIdentity);
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="form"
      aria-describedby="formModal"
    >
      <div style={modalStyle} className={classes.paper}>
        <CardHeader color="rose">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ flex: "0 0 98%" }}>
              <Typography variant="h6">{titleHandler()}</Typography>
            </div>
            <div style={{ flex: "0 0 2%" }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={clearModalHandler}
              />
            </div>
          </div>
        </CardHeader>

        <div className={classes.scrollableContent}>
          <Card plain>
            <CardBody>
            <Grid container spacing={1} direction="row">
              {components.map((item) => {
                return (
                  <Grid
                    item
                    key={item.id}
                    xs={item.cols ? item.cols : 3}
                    style={{
                      paddingBottom: 2,
                      display: item.hide ? "none" : "",
                    }}
                  >
                    {item.component === "sectionheader" ? (
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionTitle}>
                          {item.label}
                        </Typography>
                        <Divider className={classes.sectionDivider} />
                      </Box>
                    ) : item.component === "textfield" ? (
                      <React.Fragment>
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          onChange={inputGeneralHandler}
                          isError={item.isError}
                          errorMsg={item.isError ? item.errorMsg : ""}
                          disabled={disabledComponentHandler(item)}
                        />
                        {item.isError && <br />}
                      </React.Fragment>
                    ) : item.component === "datepicker" ? (
                      <React.Fragment>
                        <CustomDatePicker
                          {...item}
                          noDefault={true}
                          value={generalForm[item.name]}
                          onChange={dateInputHandler}
                          isError={item.isError}
                          errorMsg={item.isError ? item.errorMsg : ""}
                          disabled={disabledComponentHandler(item)}
                        />
                      </React.Fragment>
                    ) : item.component === "grid" ? (
                      <React.Fragment>
                        <Grid md={12} />
                      </React.Fragment>
                    ) : item.component === "singlecomplete" ? (
                      <React.Fragment>
                        <CustomSingleAutoComplete
                          {...item}
                          value={
                            item.name === "priorHospiceDischarge" &&
                            !generalForm.isPriorHospice
                              ? DEFAULT_ITEM
                              : generalForm[item.name]
                          }
                          options={
                            item.name === "location" ? locations : item.options
                          }
                          isError={item.isError}
                          errorMsg={item.isError ? item.errorMsg : ""}
                          onSelectHandler={autoCompleteGeneralInputHander}
                          source={item}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      </React.Fragment>
                    ) : item.component === "checkbox" ? (
                      <React.Fragment>
                        <CustomCheckbox
                          {...item}
                          isChecked={generalForm[item.name]}
                          onChange={inputGeneralHandler}
                          disabled={disabledComponentHandler(item)}
                        />
                      </React.Fragment>
                    ) : item.component === "capeligible" ? (
                      <React.Fragment>
                        <Box
                          style={{
                            padding: "12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <Typography variant="body1" style={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: 700,
                              marginTop: "8px",
                              color:
                                checkCapEligibility() === "YES"
                                  ? "#43a047"
                                  : checkCapEligibility() === "NO"
                                  ? "#e53935"
                                  : "#ff9800",
                            }}
                          >
                            {checkCapEligibility()}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    ) : item.component === "select" ? (
                      <React.Fragment>
                        <CustomSelect
                          {...item}
                          onChange={inputGeneralHandler}
                          isError={item.isError}
                          errorMsg={item.isError ? item.errorMsg : ""}
                          value={generalForm[item.name]}
                        />
                      </React.Fragment>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ paddingTop: 10 }}>
              <Grid direction="row" container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body">
                    Suggested Patient ID : {createPatientIdHandler()}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: 8 }}>
                  <CustomTextField
                    value={patientIdentity}
                    name={patientIdentity}
                    onChange={inputIdentityHandler}
                    placeholder={"Create Identity"}
                  />
                  <div>
                    <Typography variant="body" style={{ color: "red" }}>
                      {patientIdentityError}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </CardBody>
        </Card>
        </div>

        {props.mode && props.mode === "view" ? null : (
          <ModalFooter
            actions={footerActions}
            isSubmitDisabled={isSubmitButtonDisabled()}
          />
        )}
      </div>
    </Modal>
  );
}
export default PatientForm;

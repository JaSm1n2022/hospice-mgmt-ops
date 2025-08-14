import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Button,
  Card,
  Grid,
  Modal,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import { v4 as uuidv4 } from "uuid";
import HeaderModal from "components/Modal/HeaderModal";
import { useTheme } from "@material-ui/core";
import CustomMultipleAutoComplete from "components/AutoComplete/CustomMultipleAutoComplete";
import { DAY_OF_WEEK } from "utils/constants";
import { SERVICE_TYPE } from "utils/constants";

import CustomTimePicker from "components/Time/CustomTimePicker";
import Delete from "@material-ui/icons/Delete";
import { Add } from "@material-ui/icons";
import moment from "moment";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import TOAST from "modules/toastManager";

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
    minWidth: "80%",
    maxWidth: "100%",
    minHeight: "50%",
    maxHeight: "100%",
    overflow: "auto",
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
const VENDOR_ERROR_MSG = "Vendor is required.";

const APPOINTMENT_ERROR_MSG = "Appointment is required.";

const locationTypeData = [
  {
    name: "Residence",
    value: "Residence",
    label: "Residence",
    description: "Residence",
    id: "Residence",
    category: "pickupType",
  },
  {
    name: "Group Home",
    value: "Group Home",
    label: "Group Home",
    description: "Group Home",
    id: "Group Home",
    category: "pickupType",
  },
  {
    name: "Facility",
    value: "Facility",
    label: "Facility",
    description: "Facility",
    id: "Facility",
    category: "pickupType",
  },
  {
    name: "Other",
    value: "Other",
    label: "Other",
    description: "Other",
    id: "Other",
    category: "pickupType",
  },
  {
    name: "Residence",
    value: "Residence",
    label: "Residence",
    description: "Residence",
    id: "Residence",
    category: "destinationType",
  },
  {
    name: "Group Home",
    value: "Group Home",
    label: "Group Home",
    description: "Group Home",
    id: "Group Home",
    category: "destinationType",
  },
  {
    name: "Facility",
    value: "Facility",
    label: "Facility",
    description: "Facility",
    id: "Facility",
    category: "destinationType",
  },
  {
    name: "Other",
    value: "Other",
    label: "Other",
    description: "Other",
    id: "Other",
    category: "destinationType",
  },
];
const storyData = [
  {
    name: "Single",
    value: "Single",
    label: "Single",
    category: "pickupStory",
    id: "Single",
  },
  {
    name: "Two",
    value: "Two",
    label: "Two",
    category: "pickupStory",
    id: "Two",
  },
  {
    name: "Single",
    value: "Single",
    label: "Single",
    category: "destinationStory",
    id: "Single",
  },
  {
    name: "Two",
    value: "Two",
    label: "Two",
    category: "destinationStory",
    id: "Two",
  },
];

const stairsData = [
  {
    name: "1",
    value: "1",
    label: "1",
    category: "pickupStairs",
    id: "1",
  },
  {
    name: "2",
    value: "2",
    label: "2",
    category: "pickupStairs",
    id: "2",
  },
  {
    name: "3",
    value: "3",
    label: "3",
    category: "pickupStairs",
    id: "3",
  },
  {
    name: "4",
    value: "4",
    label: "4",
    category: "pickupStairs",
    id: "4",
  },
  {
    name: "1",
    value: "1",
    label: "1",
    category: "destinationStairs",
    id: "1",
  },
  {
    name: "2",
    value: "2",
    label: "2",
    category: "destinationStairs",
    id: "2",
  },
  {
    name: "3",
    value: "3",
    label: "3",
    category: "destinationStairs",
    id: "3",
  },
  {
    name: "4",
    value: "4",
    label: "4",
    category: "destinationStairs",
    id: "4",
  },
];

const patientDataJson = {
  fullCodeDNR: [
    {
      name: "Full Code",
      label: "Full Code",
      value: "Full Code",
      id: "Full Code",
      category: "fullCodeDNR",
    },
    {
      name: "DNR",
      label: "DNR",
      value: "DNR",
      id: "DNR",
      category: "fullCodeDNR",
    },
  ],
  covidTest: [
    {
      name: "Negative",
      label: "Negative",
      value: "Negative",
      id: "Negative",
      category: "covidTest",
    },
    {
      name: "Positive",
      label: "Positive",
      value: "Positive",
      id: "Positive",
      category: "covidTest",
    },
  ],
  oxygenRequired: [
    {
      name: "Yes",
      label: "Yes",
      value: "Yes",
      id: "Yes",
      category: "oxygenRequired",
    },
    {
      name: "No",
      label: "No",
      value: "No",
      id: "No",
      category: "oxygenRequired",
    },
  ],
  rideAlong: [
    {
      name: "Yes",
      label: "Yes",
      value: "Yes",
      id: "Yes",
      category: "rideAlong",
    },
    { name: "No", label: "No", value: "No", id: "No", category: "rideAlong" },
  ],
  modeOfTransfer: [
    {
      name: "WheelChair",
      label: "WheelChair",
      value: "WheelChair",
      id: "WheelChair",
      category: "modeOfTransfer",
    },
    {
      name: "Stretcher",
      label: "Stretcher",
      value: "Stretcher",
      id: "Stretcher",
      category: "modeOfTransfer",
    },
  ],
};

const general = [
  {
    id: "patient",
    component: "singlecomplete",
    placeholder: "Patient *",
    label: "Patient *",
    name: "patient",
    isMandatory: true,
    errorMsg: PATIENT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "vendor",
    component: "singlecomplete",
    placeholder: "Vendor *",
    label: "Vendor *",
    name: "vendor",
    isMandatory: true,
    errorMsg: VENDOR_ERROR_MSG,
    cols: 3,
  },

  {
    id: "appointmentDt",
    component: "datepicker",
    placeholder: "Appointment Date *",
    label: "Appointment Date*",
    name: "appointmentDt",
    isMandatory: true,
    noDefault: true,
    errorMsg: APPOINTMENT_ERROR_MSG,
    cols: 3,
  },
  {
    id: "appointmentTm",
    component: "timepicker",
    placeholder: "Appointment Time *",
    label: "Appointment Time*",
    name: "appointmentTm",
    cols: 3,
    isMandatory: true,
  },
];
let patientInfo = {};
let vendorInfo = {};
let locationInfo = {};
const locJson = {
  address: "",
  room: "",
  phone: "",
  story: {},
  stairs: {},
  gate: "",
  reservation: "",
};
function TransportationForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [newList, setNewList] = useState("");
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState([]);
  const [notes, setNotes] = useState("");
  const [pickup, setPickup] = useState(locJson);
  const [destination, setDestination] = useState(locJson);
  const [patientData, setPatientData] = useState({
    id: undefined,
    weight: "",
    height: "",
    fullCodeDNR: DEFAULT_ITEM,
    modeOfTransfer: DEFAULT_ITEM,
    covidTest: DEFAULT_ITEM,
    mrn: "",
    oxygenRequired: DEFAULT_ITEM,
    rideAlong: DEFAULT_ITEM,
  });
  const { isOpen } = props;
  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    fm.notes = "";
    fm.patient = DEFAULT_ITEM;
    fm.appointmentTm = "08:00";

    setGeneralForm(fm);
    setComponents(general);
  }, []);
  useEffect(() => {
    const temp = components.length ? [...components] : [...general];
    patientInfo = {};
    vendorInfo = {};
    locationInfo = {};
    console.log("[TEMP]", temp, props.patientList, props.vendorList);
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

    if (temp && props.vendorList && props.vendorList.length) {
      const finalFormat = [
        ...props.vendorList.filter(
          (f) => f.categoryType?.toLowerCase() === "transportation"
        ),
      ];
      finalFormat.forEach((f) => {
        f.name = f.name;
        f.value = f.name;
        f.id = f.id;
        f.label = f.name;
        f.category = "vendor";
      });

      vendorInfo = temp.find((t) => t.name === "vendor");
      vendorInfo.options = finalFormat;
    }
    if (temp && props.locationList && props.locationList.length) {
      const finalFormat = [...props.locationList];
      finalFormat.forEach((f) => {
        f.name = f.name;
        f.value = f.name;
        f.id = f.id;
        f.label = f.name;
        f.category = "location";
      });

      locationInfo = temp.find((t) => t.name === "location");
      locationInfo.options = finalFormat;
    }
    if (props.item) {
      console.log("[items]", props.item, patientInfo, vendorInfo, locationInfo);

      const generalFm = { ...props.item };
      generalFm.patient = patientInfo.options.find(
        (f) => f.id === generalFm.patient.id
      );
      generalFm.vendor = vendorInfo.options.find(
        (v) => v.id === generalFm.vendor.id
      );
      generalFm.appointmentDt = new Date(generalFm.appointment);
      generalFm.appointmentTm = moment(new Date(generalFm.appointment)).format(
        "HH:mm"
      );
      generalFm.notes = generalFm.notes;
      const pickupInfo = { ...props.item.pickup };
      pickupInfo.stairs =
        stairsData.find(
          (s) =>
            s.value &&
            s.category === "pickupStairs" &&
            s.value === pickupInfo.stairs
        ) || DEFAULT_ITEM;
      pickupInfo.story =
        storyData.find(
          (s) =>
            s.value &&
            s.category === "pickupStory" &&
            s.value === pickupInfo.story
        ) || DEFAULT_ITEM;
      pickupInfo.locType =
        locationTypeData.find(
          (s) =>
            s.value &&
            s.category === "pickupType" &&
            s.value === pickupInfo.locType
        ) || DEFAULT_ITEM;
      const destinationInfo = { ...props.item.destination };
      destinationInfo.locType =
        locationTypeData.find(
          (s) =>
            s.value &&
            s.category === "destinationType" &&
            s.value === destinationInfo.locType
        ) || DEFAULT_ITEM;
      destinationInfo.stairs =
        stairsData.find(
          (s) =>
            s.value &&
            s.category === "destinationStairs" &&
            s.value === destinationInfo.stairs
        ) || DEFAULT_ITEM;
      destinationInfo.story =
        storyData.find(
          (s) =>
            s.value &&
            s.category === "destinationStory" &&
            s.value === destinationInfo.story
        ) || DEFAULT_ITEM;
      const patientDataInfo = { ...props.item.patient };
      patientDataInfo.covidTest = patientDataJson.covidTest.find(
        (c) => c.value === patientDataInfo.covidTest
      );
      patientDataInfo.oxygenRequired = patientDataJson.oxygenRequired.find(
        (c) => c.value === patientDataInfo.oxygenRequired
      );
      patientDataInfo.fullCodeDNR = patientDataJson.fullCodeDNR.find(
        (c) => c.value === patientDataInfo.fullCodeDNR
      );
      patientDataInfo.rideAlong = patientDataJson.rideAlong.find(
        (c) => c.value === patientDataInfo.rideAlong
      );
      patientDataInfo.modeOfTransfer = patientDataJson.modeOfTransfer.find(
        (c) => c.value === patientDataInfo.modeOfTransfer
      );
      setPatientData(patientDataInfo);
      setDestination(destinationInfo);
      setPickup(pickupInfo);
      setNotes(generalFm.notes);
      setGeneralForm(generalFm);
    }

    setComponents(temp);
  }, [props.patientList, props.vendorList, props.locationList, props.item]);

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
    } else if (
      component.component === "datepicker" &&
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

    //pickup information
    generalForm.pickup = pickup;
    generalForm.destination = destination;
    generalForm.patientData = patientData;
    generalForm.notes = notes;
    if (isValid) {
      console.log("[General Form Validate]", generalForm);
      props.createTransportationHandler(generalForm, props.mode);
    } else {
      TOAST.error("Missing Field(s)");
      setComponents(componentList);
    }
  };

  const inputGeneralHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    if (target.name === "newList") {
      setNewList(target.value);
      return;
    }
    if (target.name === "notes") {
      setNotes(target.value);
    }
    source[target.name] = target.value;

    if (target.value) {
      setErrorHandler(target.name, false);
    }
    setGeneralForm(source);
  };
  const setErrorHandler = (key, isError) => {
    const temp = [...components];
    const comp = temp.find((c) => c.name === key);
    if (comp) {
      if (comp.isMandatory) {
        comp.isError = isError;
      }
      setComponents(temp);
    }
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    setErrorHandler(item.category, false);
    if (
      [
        "fullCodeDNR",
        "modeOfTransfer",
        "covidTest",
        "oxygenRequired",
        "rideAlong",
      ].includes(item.category)
    ) {
      const temp = { ...patientData };
      temp[item.category] = item;
      setPatientData(temp);
    } else if (item.category === "pickupStairs") {
      const temp = { ...pickup };
      temp.stairs = item;
      setPickup(temp);
    } else if (item.category === "destinationStairs") {
      const temp = { ...destination };
      temp.stairs = item;
      setDestination(temp);
    } else if (item.category === "pickupType") {
      const temp = { ...pickup };
      temp.locType = item;
      setPickup(temp);
    } else if (item.category === "destinationType") {
      const temp = { ...destination };
      temp.locType = item;
      setDestination(temp);
    } else if (item.category === "pickupStory") {
      const temp = { ...pickup };
      temp.story = item;
      setPickup(temp);
    } else if (item.category === "destinationStory") {
      const temp = { ...destination };
      temp.story = item;
      setDestination(temp);
    } else if (item.category === "patient") {
      src.location = `${item.careType} - ${item.locationCd}`;
      src.patient = item;
    } else if (item.category === "vendor") {
      src.vendor = item;
    } else if (item.category === "service") {
      src.service = item;
    } else if (item.category === "location") {
      src.location = item;
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
    setErrorHandler(name, false);
  };
  const timeInputHandler = ({ target }) => {
    console.log("[TARGET]", target.name, target.value);
    const src = { ...generalForm };
    src[target.name] = target.value;
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Transportation";
    } else if (props.mode === "edit") {
      return "Edit Transportation";
    } else {
      return "Create Transportation";
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
  const pickupInputHandler = ({ target }) => {
    const temp = { ...pickup };
    if (target.name === "pickupStory" && !target.value) {
      temp.story = DEFAULT_ITEM;
    } else if (target.name === "pickupStairs" && !target.value) {
      temp.stairs = DEFAULT_ITEM;
    } else if (target.name === "pickupType" && !target.value) {
      temp.type = DEFAULT_ITEM;
    } else {
      temp[target.name] = target.value;
    }
    setPickup(temp);
  };
  const patientDataInputHandler = ({ target }) => {
    const temp = { ...patientData };
    if (
      [
        "fullCodeDNR",
        "modeOfTransfer",
        "covidTest",
        "oxygenRequired",
        "rideAlong",
      ].includes(target.name)
    ) {
      temp[target.name] = DEFAULT_ITEM;
    } else {
      temp[target.name] = target.value;
    }
    setPatientData(temp);
  };
  const destinationInputHandler = ({ target }) => {
    const temp = { ...destination };
    if (target.name === "destinationStory" && !target.value) {
      temp.story = DEFAULT_ITEM;
    } else if (target.name === "destinationStairs" && !target.value) {
      temp.stairs = DEFAULT_ITEM;
    } else if (target.name === "destinationType" && !target.value) {
      temp.type = DEFAULT_ITEM;
    } else {
      temp[target.name] = target.value;
    }
    setDestination(temp);
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
    if (src && src.name === "patient" && props.mode !== "create") {
      return true;
    }
    if (src && src.name == "patient") {
      return false;
    }

    if (
      src &&
      src.name &&
      src.name !== "patient" &&
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
      aria-labelledby="transportation"
      aria-describedby="transportationmodal"
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
                      ) : item.component === "timepicker" ? (
                        <React.Fragment>
                          <CustomTimePicker
                            {...item}
                            value={generalForm[item.name]}
                            onChange={timeInputHandler}
                            disabled={disabledComponentHandler(item)}
                          />
                        </React.Fragment>
                      ) : item.component === "singlecomplete" ? (
                        <React.Fragment>
                          <CustomSingleAutoComplete
                            {...item}
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
                <Grid item xs={12} md={12} sm={12}>
                  <Typography variant="body">Transfer Information</Typography>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={6} sm={12}>
                      <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} md={12} sm={12}>
                          <Typography variant="body2">
                            Pick-up Location
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Location Name *"
                            placeholder="Location Name *"
                            name="locName"
                            value={pickup.locName}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomSingleAutoComplete
                            label="Location Type"
                            placeholder="Location Type"
                            name="locType"
                            value={pickup.locType || DEFAULT_ITEM}
                            options={
                              locationTypeData.filter(
                                (p) => p.category === "pickupType"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <CustomTextField
                            label="Address *"
                            placeholder="Address *"
                            name="address"
                            value={pickup.address}
                            onChange={pickupInputHandler}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Contact Person"
                            placeholder="Contact Person"
                            name="contactPerson"
                            value={pickup.contactPerson}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Phone"
                            placeholder="Phone"
                            name="phone"
                            value={pickup.phone}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomTextField
                            label="Room #"
                            placeholder="Room #"
                            name="room"
                            value={pickup.room}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomSingleAutoComplete
                            label="Story"
                            placeholder="Story"
                            name="pickupStory"
                            value={pickup.story || DEFAULT_ITEM}
                            options={
                              storyData.filter(
                                (p) => p.category === "pickupStory"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomSingleAutoComplete
                            label="Stairs"
                            placeholder="Stairs"
                            name="pickupStairs"
                            value={pickup.stairs || DEFAULT_ITEM}
                            options={
                              stairsData.filter(
                                (p) => p.category === "pickupStairs"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomTextField
                            label="Gate Code"
                            placeholder="Gate Code"
                            name="gate"
                            value={pickup.gate}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Reservation #"
                            placeholder="Reservation #"
                            name="reservation"
                            value={pickup.reservation}
                            onChange={pickupInputHandler}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} md={12} sm={12}>
                          <Typography variant="body2">
                            Destination Location
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Location Name *"
                            placeholder="Location Name *"
                            name="locName"
                            value={destination.locName}
                            onChange={destinationInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomSingleAutoComplete
                            label="Location Type"
                            placeholder="Location Type"
                            name="locType"
                            value={destination.locType || DEFAULT_ITEM}
                            options={
                              locationTypeData.filter(
                                (p) => p.category === "destinationType"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={destinationInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <CustomTextField
                            label="Address *"
                            placeholder="Address *"
                            name="address"
                            value={destination.address}
                            onChange={destinationInputHandler}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Contact Person"
                            placeholder="Contact Person"
                            name="contactPerson"
                            value={destination.contactPerson}
                            onChange={destinationInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Phone"
                            placeholder="Phone"
                            name="phone"
                            value={destination.phone}
                            onChange={destinationInputHandler}
                          />
                        </Grid>

                        <Grid item xs={12} md={3} sm={12}>
                          <CustomTextField
                            label="Room #"
                            placeholder="Room #"
                            name="room"
                            value={destination.room}
                            onChange={destinationInputHandler}
                          />
                        </Grid>

                        <Grid item xs={12} md={3} sm={12}>
                          <CustomSingleAutoComplete
                            label="Story"
                            placeholder="Story"
                            name="destinationStory"
                            value={destination.story || DEFAULT_ITEM}
                            options={
                              storyData.filter(
                                (p) => p.category === "destinationStory"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={destinationInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomSingleAutoComplete
                            label="Stairs"
                            placeholder="Stairs"
                            name="destinationStairs"
                            value={destination.stairs || DEFAULT_ITEM}
                            options={
                              stairsData.filter(
                                (p) => p.category === "destinationStairs"
                              ) || []
                            }
                            onSelectHandler={autoCompleteGeneralInputHander}
                            onChangeHandler={destinationInputHandler}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                          <CustomTextField
                            label="Gate Code"
                            placeholder="Gate Code"
                            name="gate"
                            value={destination.gate}
                            onChange={destinationInputHandler}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} sm={12}>
                          <CustomTextField
                            label="Reservation #"
                            placeholder="Reservation #"
                            name="reservation"
                            value={destination.reservation}
                            onChange={destinationInputHandler}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <Typography variant="body">
                    Patient Information and needs during transfer
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomTextField
                        label="Patient Weight"
                        placeholder="Patient Weight"
                        name="weight"
                        value={patientData.weight}
                        onChange={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomTextField
                        label="Patient Height"
                        placeholder="Patient Height"
                        name="height"
                        value={patientData.height}
                        onChange={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomSingleAutoComplete
                        label="Full code or DNR"
                        placeholder="Full code or DNR"
                        name="fullCodeDNR"
                        value={patientData.fullCodeDNR || DEFAULT_ITEM}
                        options={patientDataJson.fullCodeDNR || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={patientDataInputHandler}
                      />
                    </Grid>

                    <Grid item xs={12} md={3} sm={12}>
                      <CustomSingleAutoComplete
                        label="Mode of Transfer"
                        placeholder="Mode of Transfer"
                        name="modeOfTransfer"
                        value={patientData.modeOfTransfer || DEFAULT_ITEM}
                        options={patientDataJson.modeOfTransfer || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={patientDataInputHandler}
                      />
                    </Grid>

                    <Grid item xs={12} md={3} sm={12}>
                      <CustomSingleAutoComplete
                        label="Covid Test Result"
                        placeholder="Covid Test Result"
                        name="covidTest"
                        value={patientData.covidTest || DEFAULT_ITEM}
                        options={patientDataJson.covidTest || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomTextField
                        label="MRN"
                        placeholder="MRN"
                        name="mrn"
                        value={patientData.mrn}
                        onChange={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomSingleAutoComplete
                        label="Oxygen Required"
                        placeholder="Oxygen Required"
                        name="oxygenRequired"
                        value={patientData.oxygenRequired || DEFAULT_ITEM}
                        options={patientDataJson.oxygenRequired || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sm={12}>
                      <CustomSingleAutoComplete
                        label="Ride Along"
                        placeholder="Ride Along"
                        name="rideAlong"
                        value={patientData.rideAlong || DEFAULT_ITEM}
                        options={patientDataJson.rideAlong || []}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={patientDataInputHandler}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography variant="body">
                        Location Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} sm={12}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={2}
                        name="notes"
                        value={notes}
                        variant="contained"
                        placeholder="Notes"
                        style={{ width: "100%" }}
                        className="form-control"
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div align="right">
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
export default TransportationForm;

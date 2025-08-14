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
import { DME_EQUIPMENT } from "utils/constants";
import CustomTimePicker from "components/Time/CustomTimePicker";
import Delete from "@material-ui/icons/Delete";
import { Add } from "@material-ui/icons";
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
    minWidth: "90%",
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
const LOCATION_ERROR_MSG = "Location is required.";
const SERVICE_ERROR_MSG = "Service is required.";
const APPOINTMENT_ERROR_MSG = "Appointment is required.";

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
    id: "vendor",
    component: "singlecomplete",
    placeholder: "Vendor *",
    label: "Vendor *",
    name: "vendor",
    isMandatory: true,
    errorMsg: VENDOR_ERROR_MSG,
    cols: 6,
  },

  {
    id: "location",
    component: "singlecomplete",
    placeholder: "Location *",
    label: "Location *",
    name: "location",
    isMandatory: true,
    errorMsg: LOCATION_ERROR_MSG,
    cols: 6,
  },
  {
    id: "note",
    component: "textarea",
    placeholder: "Notes",
    label: "Notes",
    name: "Notes",
    isMandatory: false,

    cols: 6,
  },
];
let patientInfo = {};
let vendorInfo = {};
let locationInfo = {};

function DmeForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [newList, setNewList] = useState("");
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState([]);
  const [notes, setNotes] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);

  const { isOpen } = props;
  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    fm.notes = "";
    fm.patient = DEFAULT_ITEM;
    fm.appointmentTm = "08:00";
    fm.checklist = [...DME_EQUIPMENT];

    setGeneralForm(fm);
    setComponents(general);
  }, []);
  useEffect(() => {
    const temp = components.length ? [...components] : [...general];
    patientInfo = {};
    vendorInfo = {};
    locationInfo = {};
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

    if (temp && props.vendorList && props.vendorList.length) {
      const finalFormat = [...props.vendorList];
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
      generalFm.location = locationInfo.options.find(
        (l) => l.id === generalFm.location.id
      );
      generalFm.service = [...SERVICE_TYPE].find(
        (s) => s.name === generalFm.serviceType
      );
      if (generalFm && generalFm.equipment) {
        if (Array.isArray(generalFm.equipment)) {
          const arr = [];
          generalFm.equipment.forEach((e) => {
            arr.push({ value: e.trim(), id: uuidv4() });
          });
          generalFm.checklist = arr;
        }
      }

      generalFm.appointmentDt = new Date(generalFm.appointment);
      generalFm.appointmentTm = moment(new Date(generalFm.appointment)).format(
        "HH:mm"
      );
      generalFm.notes = generalFm.notes;
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
      const finalOrders = [];
      generalForm.checklist.forEach((e) => {
        if (e.value) {
          finalOrders.push(e.value.trim());
        }
      });
      generalForm.checklist = finalOrders;
      console.log("[General Form Validate]", generalForm);
      props.createEquipmentHandler(generalForm, props.mode);
    } else {
      setComponents(componentList);
    }
  };
  const inputSourceGeneralHandler = ({ target }, source) => {
    const temp = { ...generalForm };
    console.log("[Temp]", temp.checklist, source);
    const src = temp.checklist.find(
      (t) => t.id.toString() === source.id.toString()
    );

    src.value = target.value;
    setGeneralForm(temp);
  };
  const sourceInputHandler = ({ target }, source) => {
    source[target.name] = target.value;
    setIsRefresh(!isRefresh);
  };
  const inputGeneralHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    if (target.name === "newList") {
      setNewList(target.value);
      return;
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
    if (item.category === "patient") {
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
  };
  const dateSourceInputHandler = (value, name, source) => {
    console.log("[value]", value, name, source);
    source[name] = value;
    setIsRefresh(!isRefresh);
  };
  const timeInputHandler = ({ target }) => {
    console.log("[TARGET]", target.name, target.value);
    const src = { ...generalForm };
    src[target.name] = target.value;
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Equipment";
    } else if (props.mode === "edit") {
      return "Edit Equipment";
    } else {
      return "Create Equipment";
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

  const addToChecklistHandler = () => {
    const fm = { ...generalForm };
    const list = fm.checklist;
    list.push({
      name: newList,
      id: uuidv4(),
    });
    setGeneralForm(fm);
  };
  const deleteFromChecklistHandler = (item) => {
    const fm = { ...generalForm };
    const list = fm.checklist.filter(
      (f) => f.id.toString() !== item.id.toString()
    );
    fm.checklist = list;
    setGeneralForm(fm);
  };
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="equipment"
      aria-describedby="equipmentmodal"
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
                            onChange={dateSourceInputHandler}
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
                      ) : (
                        <TextareaAutosize
                          {...item}
                          aria-label="empty textarea"
                          minRows={2}
                          name="notes"
                          value={generalForm[item.name]}
                          style={{ width: "100%" }}
                          className="form-control"
                          onChange={inputGeneralHandler}
                        />
                      )}
                    </Grid>
                  );
                })}
                {generalForm.patient && generalForm.patient.name ? (
                  <Grid container direction="row" spacing={1}>
                    <Grid items xs={12} md={12} sm={12}>
                      <Grid container direction="row" spacing={1}>
                        <Grid item xs={12}>
                          <Typography variant="h6" style={{ paddingTop: 8 }}>
                            Orders
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          {generalForm.checklist &&
                            generalForm.checklist.map((mItem, indx) => (
                              <Grid
                                container
                                direction="row"
                                spacing={2}
                                id={indx}
                                justifyContent="flex-start"
                              >
                                <Grid>
                                  <div
                                    style={{
                                      paddingTop: 12,
                                      paddingLeft: 10,
                                      display: "inline-flex",
                                    }}
                                  >
                                    <Typography variant="h5">
                                      {indx + 1}.
                                    </Typography>
                                    <div style={{ paddingTop: 4 }}>
                                      <Delete
                                        style={{ color: "red" }}
                                        onClick={() =>
                                          deleteFromChecklistHandler(mItem)
                                        }
                                      />
                                    </div>
                                  </div>
                                </Grid>
                                <Grid item xs={12} md={3} sm={10}>
                                  <CustomTextField
                                    label="Description"
                                    placeholder="Description"
                                    name="description"
                                    value={mItem.description}
                                    source={mItem}
                                    onChange={inputSourceGeneralHandler}
                                  />
                                </Grid>
                                <Grid item xs={12} md={2} sm={10}>
                                  <CustomDatePicker
                                    noDefault={true}
                                    name={"delivery"}
                                    source={mItem}
                                    value={mItem.delivery}
                                    onChange={dateSourceInputHandler}
                                    label={"Delivery"}
                                  />
                                </Grid>
                                <Grid item xs={12} md={2} sm={10}>
                                  <CustomTimePicker
                                    source={mItem}
                                    name="deliveryTimeCalled"
                                    value={mItem.deliveryTimeCalled}
                                    onChange={sourceInputHandler}
                                  />
                                </Grid>
                                <Grid item xs={12} md={2} sm={10}>
                                  <CustomDatePicker
                                    source={mItem}
                                    noDefault={true}
                                    name={"pickup"}
                                    value={mItem.pickup}
                                    onChange={dateSourceInputHandler}
                                    label={"Pickup"}
                                  />
                                </Grid>
                                <Grid item xs={12} md={2} sm={10}>
                                  <CustomTimePicker
                                    source={mItem}
                                    name="pickupTimeCalled"
                                    value={mItem.pickupTimeCalled}
                                    onChange={sourceInputHandler}
                                  />
                                </Grid>
                              </Grid>
                            ))}
                          <Grid
                            item
                            xs={12}
                            md={12}
                            sm={12}
                            style={{ paddingTop: 8 }}
                          >
                            <Grid container direction="row" spacing={2}>
                              <Grid item xs={12} md={6} sm={12}>
                                <Button
                                  onClick={() => addToChecklistHandler()}
                                  variant="contained"
                                  style={{
                                    border: "solid 1px #2196f3",
                                    color: "white",
                                    background: "#2196f3",
                                    fontFamily: "Roboto",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.71,
                                    letterSpacing: "0.4px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                  }}
                                  component="span"
                                  startIcon={<Add />}
                                >
                                  ADD ITEM
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/*
                    <Grid item xs={12} md={6} sm={12}>
                      <Grid container direction="row" spacing={1}>
                        <Grid item xs={12}>
                          <Typography variant="h6" style={{ paddingTop: 8 }}>
                            Notes
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <TextareaAutosize
                            aria-label="empty textarea"
                            minRows={2}
                            name="notes"
                            value={generalForm.notes}
                            style={{ width: "100%" }}
                            className="form-control"
                            onChange={inputGeneralHandler}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" style={{ paddingTop: 8 }}>
                            Notes
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <TextareaAutosize
                            aria-label="empty textarea"
                            minRows={2}
                            name="notes"
                            value={generalForm.notes}
                            style={{ width: "100%" }}
                            className="form-control"
                            onChange={inputGeneralHandler}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" style={{ paddingTop: 8 }}>
                            Notes
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <TextareaAutosize
                            aria-label="empty textarea"
                            minRows={2}
                            name="notes"
                            value={generalForm.notes}
                            style={{ width: "100%" }}
                            className="form-control"
                            onChange={inputGeneralHandler}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    */}
                  </Grid>
                ) : null}
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
export default DmeForm;

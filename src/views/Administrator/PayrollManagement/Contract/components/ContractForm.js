import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Card, Grid, Modal, Typography } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import CardText from "components/Card/CardText";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { useTheme } from "@material-ui/core";
import { EMPLOYEE_SERVICE_TYPE } from "utils/constants";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import { RATE_TYPE } from "utils/constants";
import Table from "components/Table/Table.js";
import CardHeader from "components/Card/CardHeader.js";

import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
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
    right: `${left}%`,
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
    minWidth: "50%",
    maxWidth: "100%",
    minHeight: "50%",
    maxHeight: "100%",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
    elevation: 2,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));
const general = [
  {
    id: "employee",
    component: "singlecomplete",
    placeholder: "Employee",
    label: "Employee",
    name: "employee",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    disabled: false,
    cols: 6,
  },
  {
    id: "title",
    component: "textfield",
    placeholder: "Title",
    label: "Title",
    name: "title",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    disabled: true,
    cols: 6,
  },
  {
    id: "serviceType",
    component: "singlecomplete",
    placeholder: "Service Type",
    label: "Service Type",
    name: "serviceType",
    disabled: true,
    cols: 6,
    options: [...EMPLOYEE_SERVICE_TYPE],
  },
  {
    id: "patient",
    component: "singlecomplete",
    placeholder: "Client",
    label: "Client",
    name: "patient",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    disabled: true,
    cols: 6,
  },
  {
    id: "serviceRateType",
    component: "singlecomplete",
    placeholder: "Rate Type",
    label: "Rate Type",
    name: "serviceRateType",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    disabled: true,
    options: RATE_TYPE,
    cols: 6,
  },
  {
    id: "serviceRate",
    component: "textfield",
    placeholder: "Rate",
    label: "Rate",
    name: "serviceRate",
    type: "number",
    cols: 6,
    disabled: true,
  },

  {
    id: "comments",
    component: "textfield",
    placeholder: "Comments",
    label: "Comments",
    name: "comments",
    type: "text",
    cols: 12,
    disabled: true,
  },
];
function ContractForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [maxReimbursement, setMaxReimbursement] = useState(0);
  const [mileageRate, setMileageRate] = useState(0);
  const [isMileageRate, setIsMileageRate] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  useEffect(() => {
    const fm = {};
    fm.title = "-";
    fm.created_at = new Date();

    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    if (props.item) {
      console.log(
        "[items]",
        props.item,
        EMPLOYEE_SERVICE_TYPE,
        props.patientList
      );

      const generalFm = { ...props.item };
      setMaxReimbursement(generalFm.maxReimbursement || 0);
      setMileageRate(generalFm.mileageRate || 0);
      setIsMileageRate(generalFm.isMileageRate || false);
      generalFm.serviceType =
        [...EMPLOYEE_SERVICE_TYPE].find(
          (a) => a.value === generalFm.serviceType
        ) || DEFAULT_ITEM;
      generalFm.employee =
        props.employeeList?.find(
          (a) => parseInt(a.id, 10) === parseInt(generalFm.employeeId, 10)
        ) || DEFAULT_ITEM;
      generalFm.patient =
        props.patientList?.find(
          (a) => parseInt(a.id, 10) === parseInt(generalFm.patientId, 10)
        ) || DEFAULT_ITEM;
      generalFm.title = generalFm.employee.position;

      setIsSubmitDisabled(false);
      general.forEach((g) => {
        g.disabled = false;
      });
      setGeneralForm(generalFm);
    }
  }, [props.item]);
  useEffect(() => {
    const list = [];
    console.log("[General]", props.employeeList);
    // const employeeForm = general.find((g) => g.name === "employee");
    props.employeeList.forEach((c, indx) => {
      c.label = c.name;
      c.description = c.name;
      c.value = c.name;
      c.category = "employee";

      list.push({ ...c });
    });
    general.forEach((c) => {
      if (c.name === "employee") {
        c.options = list;
      }
    });
    console.log("[General]", general);
    setIsRefresh(!isRefresh);
  }, [props.employeeList]);
  useEffect(() => {
    const list = [];
    console.log("[General]", props.patientList);
    // const employeeForm = general.find((g) => g.name === "employee");
    props.patientList.forEach((c) => {
      c.name = c.patientCd;
      c.label = c.name;
      c.description = c.name;
      c.value = c.name;
      c.category = "patient";

      list.push({ ...c });
    });
    general.forEach((c) => {
      if (c.name === "patient") {
        c.options = list;
      }
    });
    console.log("[General]", general);
    setIsRefresh(!isRefresh);
  }, [props.patientList]);
  const validateFormHandler = () => {
    console.log("[General FormX]", generalForm);
    props.createContractHandler(generalForm, props.mode);
  };

  const onChangeMileageRateHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const src = { ...generalForm };

    if (target.name === "isMileageRate") {
      src.isMileageRate = target.checked;
      setIsMileageRate(target.checked);
    } else if (target.name === "mileageRate") {
      src.mileageRate = target.value;
      setMileageRate(target.value);
    } else if (target.name === "maxReimbursement") {
      src.maxReimbursement = target.value;
      setMaxReimbursement(target.value);
    }
    setGeneralForm(src);
  };

  const inputGeneralHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    setGeneralForm(source);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);
    if (item.category === "employee") {
      src["employee"] = item;
      src["title"] = item.position;
      if (item?.name) {
        const st = general.find((s) => s.name === "serviceType");
        console.log("[ST]", st);
        st.disabled = false;
      }
    } else if (item.category === "patient") {
      src["patient"] = item;
    } else if (item.category === "serviceType") {
      src["serviceType"] = item;
      if (item?.name) {
        const p = general.find((s) => s.name === "patient");
        p.disabled = false;
        const rt = general.find((s) => s.name === "serviceRateType");
        rt.disabled = false;
        const c = general.find((s) => s.name === "comments");
        c.disabled = false;
      }
    } else if (item.category === "rateType") {
      src["serviceRateType"] = item;
      if (item?.name) {
        const r = general.find((s) => s.name === "serviceRate");
        r.disabled = false;
        if (item?.name === "Salaried" || item?.name === "Hourly") {
          r.placeholder = "Rate/hr";
          r.label = "Rate/hr";
        } else if (item?.name === "Per Visit") {
          r.placeholder = "Rate/Visit";
          r.label = "Rate/Visit";
        } else {
          r.placeholder = "Rate";
          r.label = "Rate";
        }
      }
    }

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
    src[name] = value;
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Contract";
    } else if (props.mode === "edit") {
      return "Edit Contract";
    } else {
      return "Create Contract";
    }
  };
  console.log("[general form]", generalForm);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  console.log("[General]", general);

  return (
    <Modal
      open={isOpen}
      onClose={true}
      // onClose={clearModalHandler}
      aria-labelledby="contract"
      aria-describedby="contractmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <GridContainer spacing={2}>
          <GridItem xs={12} sm={12} md={12}>
            <HeaderModal
              title={titleHandler()}
              onClose={clearModalHandler}
              color="rose"
            />
          </GridItem>
          {general.map((item) => {
            return (
              <GridItem item xs={12} md={item.cols ? item.cols : 3} sm={12}>
                {item.component === "textfield" ? (
                  <React.Fragment>
                    <CustomTextField
                      {...item}
                      value={generalForm[item.name]}
                      onChange={inputGeneralHandler}
                    />
                  </React.Fragment>
                ) : item.component === "datepicker" ? (
                  <React.Fragment>
                    <CustomDatePicker
                      {...item}
                      value={generalForm[item.name]}
                      onChange={dateInputHandler}
                    />
                  </React.Fragment>
                ) : item.component === "singlecomplete" ? (
                  <React.Fragment>
                    <CustomSingleAutoComplete
                      {...item}
                      value={generalForm[item.name]}
                      onSelectHandler={autoCompleteGeneralInputHander}
                      onChangeHandler={onChangeGeneralInputHandler}
                    />
                  </React.Fragment>
                ) : item.component === "select" ? (
                  <React.Fragment>
                    <CustomSelect
                      {...item}
                      onChange={inputGeneralHandler}
                      value={generalForm[item.name]}
                    />
                  </React.Fragment>
                ) : null}
              </GridItem>
            );
          })}
          <GridItem item xs={12}>
            <div style={{ paddingBottom: 10, paddingTop: 10 }}>
              <CustomCheckbox
                label="Allow Mileage Rate?"
                isChecked={isMileageRate}
                name={"isMileageRate"}
                onChange={onChangeMileageRateHandler}
              />
            </div>
          </GridItem>
          {isMileageRate && (
            <GridItem item xs={3}>
              <CustomTextField
                type="number"
                placeholder="Rate per mile"
                name={"mileageRate"}
                value={mileageRate}
                onChange={onChangeMileageRateHandler}
              />
            </GridItem>
          )}
          {isMileageRate && (
            <GridItem item xs={4}>
              <CustomTextField
                type="number"
                name={"maxReimbursement"}
                value={maxReimbursement}
                placeholder="Max Reimbursement e.q $25"
                onChange={onChangeMileageRateHandler}
              />
            </GridItem>
          )}
        </GridContainer>
        <div style={{ paddingTop: 10 }}>
          <Button
            color="info"
            round
            className={classes.marginRight}
            onClick={() => validateFormHandler()}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default ContractForm;

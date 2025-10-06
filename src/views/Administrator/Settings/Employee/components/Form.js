import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Grid, Modal, Typography } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";

import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { useTheme } from "@material-ui/core";
import { EMPLOYEE_TYPE } from "utils/constants";
import { EMPLOYEE_POSITION } from "utils/constants";
import CardHeader from "components/Card/CardHeader";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";
import { Clear } from "@material-ui/icons";
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
    width: "50%",
    height: "50%",
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
    id: "employeeType",
    component: "singlecomplete",
    placeholder: "Employment Type",
    label: "Employment Type",
    name: "employeeType",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: DEFAULT_ITEM,
    cols: 4,
    options: EMPLOYEE_TYPE,
  },
  /*
  {
    id: "employeeName",
    component: "textfield",
    placeholder: "Name *",
    label: "Name *",
    name: "name",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 8,
  },
  */
  {
    id: "fn",
    component: "textfield",
    placeholder: "First Name *",
    label: "First Name *",
    name: "fn",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
  {
    id: "ln",
    component: "textfield",
    placeholder: "Last Name *",
    label: "Last Name *",
    name: "ln",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
  {
    id: "position",
    component: "singlecomplete",
    placeholder: "Position *",
    label: "Position *",
    name: "position",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: DEFAULT_ITEM,
    cols: 4,
    options: EMPLOYEE_POSITION,
  },

  {
    id: "email",
    component: "textfield",
    placeholder: "Email",
    label: "Email",
    name: "email",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
  {
    id: "phone",
    component: "textfield",
    placeholder: "Phone",
    label: "Phone",
    name: "phone",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
  {
    id: "phone",
    component: "textfield",
    placeholder: "Employee ID",
    label: "Employee",
    name: "employeeId",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
];

function EmployeeForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [searchItem, setSearchItem] = useState(DEFAULT_ITEM);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState(general);
  const [locations, setLocations] = [];
  const { isOpen } = props;

  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    if (props.item) {
      console.log("[items]", props.item);

      const generalFm = { ...props.item };
      generalFm.employeeType = EMPLOYEE_TYPE.find(
        (c) => c.value === generalFm.employeeType
      );
      generalFm.position = EMPLOYEE_POSITION.find(
        (c) => c.value === generalFm.position
      );
      setIsSubmitDisabled(false);
      setGeneralForm(generalFm);
    }
  }, [props.item]);
  const clearModalHandler = () => {
    props.closeFormModalHandler();
  };
  const validateFormHandler = () => {
    const tempList = [...components];
    console.log("[tempList]", tempList);
    let isValid = true;
    tempList.forEach((temp) => {
      if (["fn"].includes(temp.name) && !generalForm[temp.name]) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
      if (["ln"].includes(temp.name) && !generalForm[temp.name]) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
      if (
        (temp.name === "position" &&
          generalForm[temp.name] &&
          !generalForm[temp.name].name) ||
        (temp.name === "position" && !generalForm[temp.name])
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
    });
    if (!isValid) {
      setComponents(tempList);
    } else {
      props.createEmployeeHandler(generalForm, props.mode);
    }
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
        clearModalHandler();
      },
    },
  ];

  const inputGeneralHandler = ({ target }, src) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    console.log("[source]", source);
    const tempList = [...components];
    const currentItem = tempList.find((s) => s.name === target.name);
    currentItem.isError = false;
    currentItem.errorMsg = "";

    if (["ln", "fn"].includes(target.name) && !target.value) {
      currentItem.isError = true;
      currentItem.errorMsg = `${currentItem.label} is required.`;

      setComponents(tempList);
    }
    setGeneralForm(source);
  };

  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src autocomplete]", src, item);
    if (item.category === "employee") {
      src["employeeType"] = item;
    } else if (item.category === "position") {
      src["position"] = item;
      const tempList = [...components];
      const posObj = tempList.find((c) => c.name === "position");
      posObj.isError = false;
      posObj.errorMsg = "";
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
      return "View Employee";
    } else if (props.mode === "edit") {
      return "Edit Employee";
    } else {
      return "Create Employee";
    }
  };
  console.log("[general form]", generalForm);

  const disabledComponentHandler = (src) => {
    console.log("[SRC]", src, generalForm);
    if (
      src &&
      src.name &&
      src.name !== "employeeType" &&
      JSON.stringify(generalForm) !== "{}" &&
      generalForm.employeeType &&
      !generalForm.employeeType.name
    ) {
      return true;
    } else if (
      src &&
      src.name &&
      src.name !== "employeeType" &&
      !generalForm.employeeType
    ) {
      return true;
    }
    return false;
  };
  const isSubmitButtonDisabled = () => {
    return (
      JSON.stringify(generalForm) === "{}" ||
      !generalForm.employeeType ||
      (generalForm.employeeType && !generalForm.employeeType.name)
    );
  };
  console.log("[General]", generalForm);

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
              <Typography variant="h6">Create Employee</Typography>
            </div>
            <div style={{ flex: "0 0 2%" }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={clearModalHandler}
              />
            </div>
          </div>
        </CardHeader>

        <Card plain>
          <CardBody>
            <Grid container spacing={1} direction="row">
              {components.map((item) => {
                return (
                  <Grid
                    item
                    key={item.id}
                    xs={item.cols ? item.cols : 3}
                    style={{ paddingBottom: 2 }}
                  >
                    {item.component === "textfield" ? (
                      <React.Fragment>
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          onChange={inputGeneralHandler}
                          isError={item.isError}
                          errorMsg={item.errorMsg}
                          disabled={disabledComponentHandler(item)}
                        />
                        {item.isError && <br />}
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
                          disabled={disabledComponentHandler(item)}
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
                  </Grid>
                );
              })}
            </Grid>
          </CardBody>
        </Card>
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
export default EmployeeForm;

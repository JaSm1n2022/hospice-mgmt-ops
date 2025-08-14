import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";

import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Button, Card, CardContent, Grid, Modal } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";

import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";

import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";

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
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
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
const general = [
  {
    id: "categoryType",
    component: "singlecomplete",
    placeholder: "Vendor Type",
    label: "Vendor Type",
    name: "categoryType",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: DEFAULT_ITEM,
    cols: 4,
  },
  {
    id: "vendorName",
    component: "textfield",
    placeholder: "Name *",
    label: "Name *",
    name: "name",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 8,
  },
  {
    id: "vendorCd",
    component: "textfield",
    placeholder: "Account Code *",
    label: "Account Code *",
    name: "vendorCd",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
  {
    id: "address",
    component: "textfield",
    placeholder: "Address",
    label: "Address",
    name: "address",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 8,
  },
  {
    id: "contactPerson",
    component: "textfield",
    placeholder: "Contact Person",
    label: "Contact Person",
    name: "contactPerson",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },

  {
    id: "website",
    component: "textfield",
    placeholder: "Website",
    label: "Website",
    name: "website",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 8,
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
    id: "fax",
    component: "textfield",
    placeholder: "Fax",
    label: "Fax",
    name: "fax",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 4,
  },
];

function VendorForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState(general);
  const { isOpen } = props;

  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    const temp = [...general];
    const categoryObj = temp.find((t) => t.name === "categoryType");
    categoryObj.options = props.categoryList || [];
    setComponents(temp);
    setGeneralForm(fm);
  }, []);

  useEffect(() => {
    if (props.item) {
      console.log("[items]", props.item);
      const temp = [...general];
      const generalFm = { ...props.item };
      const categoryObj = temp.find((t) => t.name === "categoryType");
      categoryObj.options = props.categoryList || [];
      if (props.item) {
        generalFm.categoryType = categoryObj.options.find(
          (a) => props.item.categoryType === a.name
        );
      }
      setIsSubmitDisabled(false);
      setComponents(temp);
      setGeneralForm(generalFm);
    }
  }, [props.item, props.categoryList]);
  const validateFormHandler = () => {
    const tempList = [...components];
    console.log("[tempList]", tempList);
    let isValid = true;
    tempList.forEach((temp) => {
      if (["name", "vendorCd"].includes(temp.name) && !generalForm[temp.name]) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
    });
    if (!isValid) {
      setComponents(tempList);
    } else {
      props.createVendorHandler(generalForm, props.mode);
    }
  };

  const inputGeneralHandler = ({ target }, src) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    console.log("[source]", source);
    const tempList = [...components];
    const currentItem = tempList.find((s) => s.name === target.name);
    currentItem.isError = false;
    currentItem.errorMsg = "";

    if (["name", "vendorCd"].includes(target.name) && !target.value) {
      currentItem.isError = true;
      currentItem.errorMsg = `${currentItem.label} is required.`;

      setComponents(tempList);
    }
    setGeneralForm(source);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src input]", src, item);
    if (item.category === "category") {
      src["categoryType"] = item;
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
      return "View Vendor";
    } else if (props.mode === "edit") {
      return "Edit Vendor";
    } else {
      return "Create Vendor";
    }
  };
  console.log("[general form]", generalForm);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const disabledComponentHandler = (src) => {
    console.log("[SRC]", src, generalForm);
    if (
      src &&
      src.name &&
      JSON.stringify(generalForm) !== "{}" &&
      generalForm.categoryType &&
      !generalForm.categoryType.name
    ) {
      return true;
    } else if (!generalForm.categoryType) {
      return true;
    }
    return false;
  };
  const isSubmitButtonDisabled = () => {
    console.log("[General category]", generalForm);
    return (
      JSON.stringify(generalForm) === "{}" ||
      !generalForm.categoryType ||
      (generalForm.categoryType && !generalForm.categoryType.name)
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={clearModalHandler}
      aria-labelledby="vendor"
      aria-describedby="vendormodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

          <CardContent>
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
            <div style={{ paddingTop: 10 }}>
              <Button
                disabled={isSubmitButtonDisabled()}
                variant="contained"
                color={isSubmitButtonDisabled() ? "default" : "primary"}
                onClick={() => validateFormHandler()}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

export default VendorForm;

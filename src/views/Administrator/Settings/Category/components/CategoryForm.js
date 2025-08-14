import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  TextareaAutosize,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";

let categoryList = [];

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
    id: "name",
    component: "textfield",
    placeholder: "Category Name",
    label: "Category Name",
    name: "name",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: "",
    cols: 10,
  },
  {
    id: "description",
    component: "textarea",
    placeholder: "Category Description",
    label: "Category Description",
    name: "description",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: "",
    cols: 10,
  },
];

function CategoryForm(props) {
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
      setIsSubmitDisabled(false);
      setGeneralForm(generalFm);
    }
  }, [props.item]);

  const validateFormHandler = () => {
    const tempList = [...components];
    console.log("[tempList]", tempList);
    let isValid = true;
    tempList.forEach((temp) => {
      if (["name"].includes(temp.name) && !generalForm[temp.name]) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
    });
    if (!isValid) {
      setComponents(tempList);
    } else {
      props.createCategoryHandler(generalForm, props.mode);
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

    if (["name"].includes(target.name) && !target.value) {
      currentItem.isError = true;
      currentItem.errorMsg = `${currentItem.label} is required.`;

      setComponents(tempList);
    }
    setGeneralForm(source);
  };

  const autoCompleteGeneralInputHander = () => {};

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
      return "View Category";
    } else if (props.mode === "edit") {
      return "Edit Category";
    } else {
      return "Create Category";
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
      src.name !== "name" &&
      JSON.stringify(generalForm) !== "{}" &&
      !generalForm.name
    ) {
      return true;
    }
    return false;
  };
  const isSubmitButtonDisabled = () => {
    return JSON.stringify(generalForm) === "{}" || !generalForm.name;
  };
  console.log("[General]", generalForm);

  return (
    <Modal
      open={isOpen}
      onClose={clearModalHandler}
      aria-labelledby="category"
      aria-describedby="categorymodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

          <CardContent>
            <Grid container spacing={1} direction="row" spacing={2}>
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
                    ) : item.component === "textarea" ? (
                      <React.Fragment>
                        <TextareaAutosize
                          {...item}
                          aria-label="empty textarea"
                          minRows={4}
                          value={generalForm[item.name]}
                          variant="contained"
                          style={{ width: "100%" }}
                          className="form-control"
                          disabled={disabledComponentHandler(item)}
                          onChange={inputGeneralHandler}
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
export default CategoryForm;

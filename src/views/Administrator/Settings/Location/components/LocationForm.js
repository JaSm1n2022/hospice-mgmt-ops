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
  Typography,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";
import { LOCATION_TYPE } from "utils/constants";

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
    id: "locationType",
    component: "singlecomplete",
    placeholder: "Location Type",
    label: "Location Type",
    name: "locationType",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    value: DEFAULT_ITEM,
    cols: 4,
    options: LOCATION_TYPE,
  },
  {
    id: "locationName",
    component: "textfield",
    placeholder: "Name *",
    label: "Name *",
    name: "name",
    //disabled: props.mode && props.mode === 'view' ? true : false,

    cols: 8,
  },
  {
    id: "locationCd",
    component: "textfield",
    placeholder: "Account Code *",
    label: "Account Code *",
    name: "locationCd",
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

function LocationForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [searchItem, setSearchItem] = useState(DEFAULT_ITEM);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [components, setComponents] = useState(general);
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
      generalFm.locationType = LOCATION_TYPE.find(
        (c) => c.name === generalFm.locationType
      );
      setIsSubmitDisabled(false);
      setGeneralForm(generalFm);
    }
  }, [props.item]);
  const validateFormHandler = () => {
    const tempList = [...components];
    console.log("[tempList]", tempList);
    let isValid = true;
    tempList.forEach((temp) => {
      if (
        ["name", "locationCd"].includes(temp.name) &&
        !generalForm[temp.name]
      ) {
        isValid = false;
        temp.isError = true;
        temp.errorMsg = `${temp.label} is required.`;
      }
    });
    if (!isValid) {
      setComponents(tempList);
    } else {
      props.createLocationHandler(generalForm, props.mode);
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

    if (["name", "locationCd"].includes(target.name) && !target.value) {
      currentItem.isError = true;
      currentItem.errorMsg = `${currentItem.label} is required.`;

      setComponents(tempList);
    }
    setGeneralForm(source);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);
    if (item.category === "location") {
      src["locationType"] = item;
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
      return "View Location";
    } else if (props.mode === "edit") {
      return "Edit Location";
    } else {
      return "Create Location";
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
      generalForm.locationType &&
      !generalForm.locationType.name
    ) {
      return true;
    } else if (!generalForm.locationType) {
      return true;
    }
    return false;
  };
  const isSubmitButtonDisabled = () => {
    return (
      JSON.stringify(generalForm) === "{}" ||
      !generalForm.locationType ||
      (generalForm.locationType && !generalForm.locationType.name)
    );
  };
  console.log("[General]", generalForm);
  return (
    <Modal
      open={isOpen}
      onClose={clearModalHandler}
      aria-labelledby="location"
      aria-describedby="locationmodal"
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
export default LocationForm;

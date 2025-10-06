import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Tooltip,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import styles from "./subCategory.module.css";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core";
import ReactModal from "react-modal";

import CustomTextField from "components/TextField/CustomTextField";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";

import HeaderModal from "components/Modal/HeaderModal";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Clear } from "@material-ui/icons";

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
function SubCategoryForm(props) {
  const classes = useStyles();
  const [generalForm, setGeneralForm] = useState({});
  const [detailForm, setDetailForm] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  const [general, setGeneral] = React.useState([
    {
      id: "category",
      component: "singlecomplete",
      placeholder: "Category",
      label: "Category",
      name: "category",
      options: [],
    },
  ]);

  const details = [
    {
      id: "name",
      component: "textfield",
      placeholder: "Name",
      label: "Name",
      name: "name",
    },
    {
      id: "description",
      component: "textfield",
      placeholder: "Description",
      label: "Description",
      name: "description",
    },
  ];
  useEffect(() => {
    const temp = [...general];
    const dArray = [];
    console.log("[props.item]", props.item);
    const categoryObj = temp.find((t) => t.name === "category");
    categoryObj.options = props.categoryList || [];
    if (props.item) {
      const genForm = { ...props.item };
      genForm.category = categoryObj.options.find(
        (a) => props.item.category_name === a.name
      );
      for (let i = 0; i < 1; i++) {
        dArray.push({
          id: props.item?.id || genForm.id,

          name: props.item?.item_name,
          description: props.item?.item_description,
        });
      }
      setDetailForm(dArray);

      setGeneralForm(genForm);
    }
    setGeneral(temp);
  }, [props.item && props.categoryList]);

  const validateFormHandler = () => {
    console.log("[Print Handler]", generalForm, detailForm);
    const payload = {
      general: generalForm,
      details: detailForm,
    };
    props.createSubCategoryHandler(payload, props.mode);
  };
  const footerActions = [
    {
      title: props.subCategory ? "Apply" : "Save",
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
  const inputGeneralHandler = ({ target }) => {
    console.log("[Target General]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    setGeneralForm(source);
  };
  const inputDetailHandler = ({ target }, source) => {
    source[target.name] = target.value;

    setIsRefresh(!isRefresh);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);

    if (item.category === "category") {
      src.category = item;
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

  const addItemHandler = () => {
    const records = [...detailForm];
    records.push({
      id: uuidv4(),
    });
    setDetailForm(records);
  };
  if (detailForm && detailForm.length === 0) {
    addItemHandler();
  }
  const deleteItemHandler = (indx) => {
    const fm = [...detailForm];
    fm.splice(indx, 1);

    setDetailForm(fm);
  };
  const dateInputHandler = (value, name) => {
    console.log("[Date INput]", name, value);
    const src = { ...generalForm };
    src[name] = moment(new Date(value)).format("YYYY-MM-DD HH:mm");
    console.log("[src Date]", src, new Date(value), value);
    setGeneralForm(src);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Sub Category";
    } else if (props.mode === "edit") {
      return "Edit Sub Category";
    } else {
      return "Create Sub Category";
    }
  };

  const clearModalHandler = () => {
    props.closeFormModalHandler();
  };
  console.log("[General Form]", generalForm);
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
              <Typography variant="h6">Create SubCategory</Typography>
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
              {general.map((item) => {
                return (
                  <Grid item xs={12} md={3} sm={12}>
                    {item.component === "textfield" ? (
                      <React.Fragment>
                        <CustomTextField
                          {...item}
                          value={generalForm[item.name]}
                          onChange={inputGeneralHandler}
                        />
                      </React.Fragment>
                    ) : item.component === "datepicker" ? (
                      <CustomDatePicker
                        {...item}
                        value={generalForm[item.name]}
                        onChange={dateInputHandler}
                      />
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
                        <RegularSelect
                          {...item}
                          onChange={inputGeneralHandler}
                          value={generalForm[item.value]}
                        />
                      </React.Fragment>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ paddingTop: 20 }}>
              <Typography variant="h6">Items</Typography>
            </div>
            {detailForm.map((item, index) => {
              return (
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  style={{ paddingBottom: 12 }}
                  key={`contr-${index}`}
                >
                  <Grid item xs={12} md={1} sm={12}>
                    <div style={{ display: "inline-flex", gap: 10 }}>
                      <Avatar className={classes.small}>{index + 1}</Avatar>
                      <div style={{ paddingTop: 4 }}>
                        <Tooltip title={"Delete Item"}>
                          <DeleteIcon
                            style={{
                              color: "#F62100",
                              fontSize: "24px",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteItemHandler(index)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={3} sm={12}>
                    <CustomTextField
                      source={item}
                      {...details.find((d) => d.id === "name")}
                      value={item["name"] || ""}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={12}>
                    <CustomTextField
                      source={item}
                      {...details.find((d) => d.id === "description")}
                      value={item["description"] || ""}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                </Grid>
              );
            })}

            <div
              style={{
                paddingTop: 4,
                display: props.mode && props.mode === "edit" ? "none" : "",
              }}
            >
              <Button
                disabled={props.mode && props.mode === "view" ? true : false}
                variant="outlined"
                color="primary"
                style={{ fontSize: 14 }}
                onClick={() => addItemHandler()}
              >
                Add Item
              </Button>
            </div>
          </CardBody>
        </Card>
        {props.mode && props.mode === "view" ? null : (
          <ModalFooter actions={footerActions} />
        )}
      </div>
    </Modal>
  );
}

export default SubCategoryForm;

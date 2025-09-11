import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { Button, Grid, Modal, Typography } from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";
import CardHeader from "components/Card/CardHeader";
import { useTheme } from "@material-ui/core";
import { AddAlertOutlined, Clear } from "@material-ui/icons";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";

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

const ITEM_ERROR =
  "This item already exists in the record. Please use the Edit function to update the product information";
function StockForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [searchItem, setSearchItem] = useState(DEFAULT_ITEM);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState(ITEM_ERROR);
  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  const general = [
    {
      id: "category",
      component: "textfield",
      placeholder: "Category",
      label: "Category",
      name: "category",
      //disabled: props.mode && props.mode === 'view' ? true : false,
      disabled: true,
      cols: 3,
    },
    {
      id: "subCategory",
      component: "textfield",
      placeholder: "Sub Category",
      label: "Sub Category",
      name: "subCategory",
      //disabled: props.mode && props.mode === 'view' ? true : false,
      disabled: true,
      cols: 3,
    },
    {
      id: "item",
      component: "textfield",
      placeholder: "Item",
      label: "Item",
      name: "item",
      //disabled: props.mode && props.mode === 'view' ? true : false,
      disabled: true,
      cols: 3,
    },
    {
      id: "description",
      component: "textfield",
      placeholder: "Description",
      label: "Description",
      name: "description",
      disabled: true,
      cols: 6,
    },
    {
      id: "size",
      component: "textfield",
      placeholder: "Size",
      label: "Size",
      name: "size",

      disabled: true,
    },
    {
      id: "dimension",
      component: "textfield",
      placeholder: "Dimension",
      label: "Dimension",
      name: "dimension",

      disabled: true,
    },
    {
      id: "info",
      component: "textfield",
      placeholder: "Additional Info",
      label: "Additional Info",
      name: "info",
      cols: 6,

      disabled: true,
    },
    {
      id: "vendor",
      component: "textfield",
      placeholder: "Vendor",
      label: "Vendor",
      name: "vendor",
      disabled: true,
      cols: 6,
    },
    {
      id: "manufacturer",
      component: "textfield",
      placeholder: "Manufacturer",
      label: "Manufacturer",
      name: "manufacturer",
      disabled: true,
      cols: 6,
    },
    {
      id: "qtyOnHand",
      component: "textfield",
      placeholder: "Quantity On Hand",
      label: "Qty on Hand",
      name: "qtyOnHand",
      type: "number",
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 3,
    },
    {
      id: "comments",
      component: "textfield",
      placeholder: "Comments",
      label: "Comments",
      name: "comments",
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 9,
    },
  ];

  useEffect(() => {
    const fm = {};
    fm.created_at = new Date();
    fm.item = "-";
    fm.description = "-";
    fm.size = "-";
    fm.category = "-";
    fm.subCategory = "-";
    fm.dimension = "-";
    fm.info = "-";
    fm.vendor = "-";
    fm.manufacturer = "-";
    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    if (props.item) {
      console.log("[items]", props.item);

      const generalFm = { ...props.item };
      generalFm.info = generalFm.additional_info;
      generalFm.incomingQty = generalFm.incoming_qty;
      generalFm.projectedQty = generalFm.projected_qty;
      generalFm.qtyOnHand = generalFm.qty_on_hand;
      generalFm.projectedDate = generalFm.incoming_order_at;
      setIsSubmitDisabled(false);
      setGeneralForm(generalFm);
    }
  }, [props.item]);
  const validateFormHandler = () => {
    if (!searchItem?.name || isExistingItem) {
      if (!searchItem) {
        setSnackbarMsg("Please select One");
      } else {
        setSnackbarMsg(ITEM_ERROR);
      }
      setIsExistingItem(true);
    } else {
      props.createStockHandler(generalForm, props.mode);
    }
  };

  const inputSearchHandler = (e) => {
    if (!e.target.value) {
      setSearchItem(DEFAULT_ITEM);
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
        console.log("[Cancel me]");
        clearModalHandler();
      },
    },
  ];
  const autoCompleteInputSearchHandler = (item) => {
    console.log(
      "[Item]",
      item,
      props.dataSource,
      props.dataSource.find((data) => data.productId === item.id)
    );
    if (props.dataSource.find((data) => data.productId === item.id)) {
      // TOAST.error(
      // "Item already in existing record. Please use Edit function to update stock product information"
      //);
      setIsSubmitDisabled(true);
      setSnackbarMsg(ITEM_ERROR);
      setIsExistingItem(true);
      return;
    }
    setIsExistingItem(false);

    setIsSubmitDisabled(false);
    setSearchItem(item);
    const fm = { ...item };
    fm.item = fm.item;
    fm.description = fm.description;
    fm.size = fm.size;
    fm.dimension = fm.dimension;
    fm.productId = fm.id;
    fm.vendor = fm.vendor;
    fm.manufacturer = fm.manufacturer;
    fm.info = `${fm.qty} ${fm.qty_uom} is ${fm.count} pcs distributed by ${
      fm.qty_distribution || 1
    } ${fm.unit_distribution}`;

    setGeneralForm(fm);
    setIsSubmitDisabled(false);
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
    if (item.category === "category") {
      src["category"] = item;
      src["categoryName"] = item.name;
    }
    if (item.category === "uom") {
      src["qtyUom"] = item;
      src["uom"] = item.name;
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
      return "View Stock";
    } else if (props.mode === "edit") {
      return "Edit Stock";
    } else {
      return "Create Stock";
    }
  };
  console.log("[general form]", generalForm);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const doNothing = (e, reason) => {
    console.log("[E]", e, reason);
  };
  return (
    <Modal
      open={isOpen}
      onClose={true}
      // onClose={clearModalHandler}
      aria-labelledby="stock"
      aria-describedby="stockmodal"
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
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {titleHandler()}
              </Typography>
            </div>
            <div style={{ flex: "0 0 2%" }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={() => clearModalHandler()}
              />
            </div>
          </div>
        </CardHeader>

        <Card plain>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <GridContainer container spacing={1} direction="row">
                  <GridItem item xs={12} md={10} sm={12}>
                    <CustomSingleAutoComplete
                      placeholder={"Search Item"}
                      label={"Search Item"}
                      name={"searchItem"}
                      options={props.productList || []}
                      disabled={
                        props.mode &&
                        (props.mode === "view" || props.mode === "edit")
                          ? true
                          : false
                      }
                      value={searchItem || DEFAULT_ITEM}
                      onSelectHandler={autoCompleteInputSearchHandler}
                      onChangeHandler={inputSearchHandler}
                    />
                    {isExistingItem && (
                      <SnackbarContent
                        message={snackbarMsg}
                        height={12}
                        color={"rose"}
                        //item.stockStatus.indexOf("In Stock") !== -1
                        //? "info"
                        //: "rose"

                        icon={AddAlertOutlined}
                      />
                    )}
                  </GridItem>

                  {general.map((item) => {
                    return (
                      <GridItem
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
                </GridContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
        <ModalFooter
          actions={footerActions}
          isSubmitDisabled={isSubmitDisabled}
        />
      </div>
    </Modal>
  );
}
export default StockForm;

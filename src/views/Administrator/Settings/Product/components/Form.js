import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";
import moment from "moment";
import { Grid, Modal, Typography } from "@material-ui/core";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CustomTextField from "components/TextField/CustomTextField";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CustomSelect from "components/Select/CustomSelect";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";
import { STATUS_ACTIVE_OPTIONS } from "utils/constants";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_VENDOR } from "utils/constants";
import { Clear } from "@material-ui/icons";

let uoms = [];
let units = [];
let vendors = [];
let manufacturers = [];
let status = [];
STATUS_ACTIVE_OPTIONS.forEach((item, index) => {
  status.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "status",
  });
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
QUANTITY_UOM.forEach((item, index) => {
  units.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "unit",
  });
});
[...SUPPLY_VENDOR].forEach((item, index) => {
  vendors.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "vendor",
  });
});
[...SUPPLY_VENDOR].forEach((item, index) => {
  manufacturers.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "manufacturer",
  });
});
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
function ProductForm(props) {
  const [generalForm, setGeneralForm] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const { isOpen, onClose } = props;

  const [general, setGeneral] = useState([
    {
      id: "category",
      component: "singlecomplete",
      placeholder: "Item Category",
      label: "Item Category",
      name: "category",

      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 5,
    },

    {
      id: "description",
      component: "textfield",
      placeholder: "Description",
      label: "Description",
      name: "description",
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 5,
    },
    {
      id: "item",
      component: "textfield",
      placeholder: "Item #",
      label: "Item #",
      name: "item",
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 2,
    },
    {
      id: "qty",
      component: "textfield",
      placeholder: "qty",
      label: "Qty",
      name: "qty",
      type: "number",
      disabled: props.mode && props.mode === "view" ? true : false,
    },

    {
      id: "qtyUom",
      component: "singlecomplete",
      placeholder: "Qty Uom",
      label: "Qty Uom",
      name: "qtyUom",
      options: uoms,
      disabled: props.mode && props.mode === "view" ? true : false,
    },

    {
      id: "count",
      component: "textfield",
      placeholder: "Count/Pcs",
      label: "Count/Pcs",
      name: "count",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "cartonItemQty",
      component: "textfield",
      placeholder: "Carton Qty Item",
      label: "Carton Qty Item",
      name: "cartonItemQty",
      type: "number",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "size",
      component: "textfield",
      placeholder: "Size",
      label: "Size",
      name: "size",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "flavor",
      component: "textfield",
      placeholder: "Flavor/Color",
      label: "Flavor/Color",
      name: "flavor",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "dimension",
      component: "textfield",
      placeholder: "Dimension",
      label: "Dimension",
      name: "dimension",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "unitPrice",
      component: "textfield",
      placeholder: "Unit Price",
      label: "Unit Price",
      name: "unitPrice",
      disabled: props.mode && props.mode === "view" ? true : false,
      type: "number",
    },
    {
      id: "pricePerPcs",
      component: "textfield",
      placeholder: "Price Per Pcs",
      label: "Price Per Pcs",
      name: "pricePerPcs",
      disabled: true,
      type: "number",
    },
    {
      id: "vendor",
      component: "singlecomplete",
      placeholder: "Vendor",
      label: "Vendor",
      name: "vendor",
      disabled: props.mode && props.mode === "view" ? true : false,
      options: vendors,
      cols: 3,
    },
    {
      id: "manufacturer",
      component: "singlecomplete",
      placeholder: "Manufacturer",
      label: "Manufacturer",
      name: "manufacturer",
      disabled: props.mode && props.mode === "view" ? true : false,
      options: manufacturers,
      cols: 3,
    },
    {
      id: "shortDescription",
      component: "textfield",
      placeholder: "Short Description",
      label: "Short Description",
      name: "shortDescription",
      cols: 3,
    },
    {
      id: "unitQtyUom",
      component: "textfield",
      placeholder: "Qty Distribution",
      label: "Qty Distribution",
      name: "unitQtyUom",
      type: "number",
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 3,
    },
    {
      id: "unitUom",
      component: "singlecomplete",
      placeholder: "Unit Distribution",
      label: "Unit Distribution",
      name: "unitUom",
      options: [...units],
      disabled: props.mode && props.mode === "view" ? true : false,
      cols: 3,
    },

    {
      id: "status",
      component: "singlecomplete",
      placeholder: "Status",
      label: "Status",
      name: "status",
      options: [...status],
      disabled: props.mode && props.mode === "view" ? true : false,
    },
  ]);

  useEffect(() => {
    console.log("[effects 1]");
    const fm = {};
    fm.created_at = new Date();
    fm.pricePerPcs = 0.0;
    fm.status = status.find((s) => s.name === "Active");
    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    console.log("[PROPS123]", props);
    const obj = [...general];
    const cat = obj.find((o) => o.name === "vendor");
    cat.options = props.vendorList;
    const man = obj.find((o) => o.name === "manufacturer");
    man.options = props.manufacturerList;
    setGeneral(obj);
  }, [props.vendorList, props.manufacturerList]);

  useEffect(() => {
    const obj = [...general];
    const cat = obj.find((o) => o.name === "category");
    cat.options = props.subCategoryList;
    setGeneral(obj);
  }, [props.subCategoryList]);

  useEffect(() => {
    if (props.item) {
      console.log("[effects 2]", props.item, props.subCategoryList);

      const generalFm = { ...props.item };
      generalFm.status = generalFm.status
        ? status.find((s) => s.name && s.name.toLowerCase() === "active")
        : status.find((s) => s.name && s.name.toLowerCase() === "inactive");
      generalFm.created_at = moment(new Date(generalFm.created_at))
        .utc()
        .format("YYYY-MM-DD");
      generalFm.category = props.subCategoryList.find(
        (cat) => cat.id === generalFm.subCategory_id
      );
      generalFm.qtyUom = uoms.find((cat) => cat.name === generalFm.qty_uom);
      generalFm.vendor = props.vendorList.find(
        (v) => v.name === generalFm.vendor
      );
      generalFm.manufacturer = props.manufacturerList.find(
        (v) => v.name === generalFm.manufacturer
      );
      generalFm.pricePerPcs = generalFm.price_per_pcs || 0.0;
      generalFm.unitPrice = generalFm.unit_price || 0.0;
      generalFm.unitQtyUom = generalFm.qty_distribution || 1;

      generalFm.unitUom = units.find(
        (cat) => cat.name === generalFm.unit_distribution
      );
      generalFm.shortDescription = generalFm.short_description;
      generalFm.cartonItemQty = generalFm.carton_item_qty || 1;

      setGeneralForm(generalFm);
    }
  }, [props.item]);
  const validateFormHandler = () => {
    props.createProductHandler(generalForm, props.mode);
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
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const inputGeneralHandler = ({ target }) => {
    const source = { ...generalForm };
    source[target.name] = target.value;
    if (target.name === "count" || target.name === "unitPrice") {
      source.pricePerPcs = parseFloat(
        parseFloat(source.unitPrice) / parseInt(source.count || 1, 10)
      ).toFixed(2);
    }
    setGeneralForm(source);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);
    if (item.category === "status") {
      src.status = item;
    }
    if (item.category === "subcategory") {
      src["category"] = item;
      src["categoryName"] = item.name;
    }
    if (item.category === "vendor") {
      src["vendor"] = item;
      src["vendorName"] = item.name;
    }
    if (item.category === "manufacturer") {
      src["manufacturer"] = item;
      src["manufacturerName"] = item.name;
    }
    if (item.category === "uom") {
      src["qtyUom"] = item;
      src["uom"] = item.name;
    }
    if (item.category === "unit") {
      src["unitUom"] = item;
      src["unit"] = item.name;
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
      return "View Product/Item";
    } else if (props.mode === "edit") {
      return "Edit Product/Item";
    } else {
      return "Create Product/Item";
    }
  };

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
              <Typography variant="h6">Create Product</Typography>
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
            <Grid
              container
              spacing={1}
              direction="row"
              style={{ paddingTop: 10 }}
            >
              {general.map((item) => {
                return (
                  <Grid item xs={item.cols ? item.cols : 3}>
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
                  </Grid>
                );
              })}
            </Grid>
          </CardBody>
        </Card>
        {props.mode && props.mode === "view" ? null : (
          <ModalFooter actions={footerActions} />
        )}
      </div>
    </Modal>
  );
}
export default ProductForm;

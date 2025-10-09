import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Grid,
  Tooltip,
  Typography,
  Divider,
  Modal,
} from "@material-ui/core";
import moment from "moment";
import styles from "./distribution.module.css";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core";
import ReactModal from "react-modal";
import { SUPPLY_STATUS } from "utils/constants";
import { HOSPICE_FACILITIES } from "utils/constants";
import { DIVINE_EMPLOYEES } from "utils/constants";
import { DIVINE_PATIENT_LIST } from "utils/constants";
import { QUANTITY_UOM } from "utils/constants";
import CustomTextField from "components/TextField/CustomTextField";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CustomSelect from "components/Select/CustomSelect";
import HeaderModal from "components/Modal/HeaderModal";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import FooterModal from "components/Modal/FooterModal";
import ModalFooter from "components/Modal/ModalFooter/ModalFooter";
import ModalHeader from "components/Modal/ModalHeader/ModalHeader";
import { DEFAULT_ITEM } from "utils/constants";
import GridContainer from "components/Grid/GridContainer";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import { AddAlertOutlined } from "@material-ui/icons";

let uoms = [];
let patients = [];
let employees = [];
let facilities = [];
let statuses = [];
let originalOrderQty = 0;
SUPPLY_STATUS.forEach((item, index) => {
  statuses.push({
    ...item,
    id: index,
    name: item,
    value: item,
    label: item,
    category: "status",
  });
});
HOSPICE_FACILITIES.forEach((item, index) => {
  facilities.push({
    ...item,
    id: index,
    name: item,
    value: item,
    label: item,
    category: "facility",
  });
});
DIVINE_EMPLOYEES.forEach((item, index) => {
  employees.push({
    ...item,
    id: index,
    name: item.name,
    value: item.name,
    label: item.name,
    category: "employee",
  });
});

DIVINE_PATIENT_LIST.forEach((item, index) => {
  patients.push({
    ...item,
    id: index,
    name: item,
    value: item,
    label: item,
    category: "patient",
  });
});

QUANTITY_UOM.forEach((item, index) => {
  uoms.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "uoms",
  });
});

function getModalStyle() {
  const top = 25;
  const left = 25;
  const right = 25;
  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
    height: "80%",
    width: "95%",
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
    width: "98%",
    height: "95%",
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

function DistributionForm(props) {
  console.log("[Distribution]", props);
  const classes = useStyles();
  const [generalForm, setGeneralForm] = useState({});
  const [detailForm, setDetailForm] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isPrintForm, setIsPrintFrom] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const { isOpen } = props;

  const general = [
    {
      id: "orderDt",
      component: "datepicker",
      placeholder: "Requested Date",
      label: "Requested Date",
      name: "orderDt",
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "patient",
      component: "singlecomplete",
      placeholder: "Patient Name",
      label: "Patient Name",
      name: "patient",
      options: [...props.patientList],
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "facility",
      component: "textfield",
      placeholder: "Facility/POS",
      label: "Facility/POS",
      name: "facility",
      disabled: true,
      value: "-",
    },

    {
      id: "requestor",
      component: "singlecomplete",
      placeholder: "Requestor",
      label: "Requestor",
      name: "requestor",
      options: [...props.employeeList],
      disabled: props.mode && props.mode === "view" ? true : false,
    },
    {
      id: "position",
      component: "textfield",
      placeholder: "Title",
      label: "Title",
      name: "position",
      value: "-",
      disabled: true,
    },
    {
      id: "caregiver",
      component: "textfield",
      placeholder: "Patient Caregiver",
      label: "Patient Caregiver",
      name: "caregiver",
      disabled: props.mode && props.mode === "view" ? true : false,
    },

    {
      id: "status",
      component: "singlecomplete",
      placeholder: "Status",
      label: "Status",
      name: "status",
      options: statuses,
      disabled: props.mode && props.mode === "view" ? true : false,
    },
  ];

  const details = [
    {
      id: "search",
      component: "singlecomplete",
      placeholder: "Search Item",
      label: "Search Item",
      name: "search",

      options: [...props.productList],
    },
    {
      id: "description",
      component: "textfield",
      placeholder: "Description",
      label: "Description",
      name: "description",
    },
    {
      id: "size",
      component: "textfield",
      placeholder: "Size",
      label: "Size",
      name: "size",
    },
    {
      id: "flavor",
      component: "textfield",
      placeholder: "Flavor/Color",
      label: "Flavor/Color",
      name: "flavor",
    },
    {
      id: "orderQty",
      component: "textfield",
      placeholder: "Order Qty in Pcs",
      label: "Order Qty in Pcs",
      name: "orderQty",
      type: "number",
    },
    {
      id: "price_per_pcs",
      component: "textfield",
      placeholder: "Price Per Pcs",
      label: "Price Per Pcs",
      name: "price_per_pcs",
      type: "number",
    },
    {
      id: "unitDistribution",
      component: "textfield",
      placeholder: "Unit",
      label: "Unit",
      name: "unitDistribution",
    },
    {
      id: "vendor",
      component: "textfield",
      placeholder: "Vendor",
      label: "Vendor",
      name: "vendor",
      type: "text",
      value: "-",
    },
    {
      id: "comments",
      component: "textfield",
      placeholder: "Comments",
      label: "Comments",
      name: "comments",
      type: "text",
      value: "",
    },
  ];
  useEffect(() => {
    console.log("[props distribution form]", props);
    const fm = {};
    fm.orderDt = new Date();
    fm.position = "-";
    fm.facility = "-";
    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    console.log("[Props Distribution]", props);
    if (props.generalInfo && props.module === "multiple") {
      console.log("[Props Distribution2]", props.generalInfo);
      const gen = { ...props.generalInfo };
      gen.patientCd = gen.patient?.patientCd;
      gen.patientId = gen.patient?.id;
      gen.requestorName = gen.requestor?.name;
      gen.requestorId = gen.requestor?.id;
      gen.facility = gen.patient
        ? `${gen.patient?.careType}-${gen.patient?.locationCd}`
        : "";
      gen.position = gen.requestor?.position;
      gen.orderDt = new Date();
      setGeneralForm(gen);
      setDetailForm(props.detailInfo);
    } else if (props.item) {
      console.log("[items]", props.item);
      const generalFm = { ...props.item };
      generalFm.orderDt = `${generalFm.order_at} 00:00`;
      if (props.mode === "edit") {
        originalOrderQty = generalFm.order_qty;
      }

      generalFm.patientCd = generalFm.patient?.patientCd;
      generalFm.patientId = generalFm.patient?.id;
      generalFm.requestorName = generalFm.requestor?.name;
      generalFm.facility = generalFm.patient
        ? `${generalFm.patient.careType}-${generalFm.patient.locationCd}`
        : "";
      generalFm.position = generalFm.requestor?.position;
      const detailFm = generalFm.details ? generalFm.details : [generalFm];
      detailFm.forEach((e) => {
        e.unitDistribution = e.unit_uom
          ? e.unit_uom
          : e.search.unitDistribution || e.search.unit_distribution;
      });
      console.log("[Detail]", detailFm);
      setGeneralForm(generalFm);
      setDetailForm(detailFm);
    }
  }, [props.item, props.generalInfo]);
  const printHandler = () => {
    props.printPatientOrdersHandler(generalForm, detailForm);

    console.log("[Print Handler]", generalForm, detailForm);
  };
  const validateFormHandler = () => {
    if (!generalForm.patientCd) {
      TOAST.error("Patient Name is required");
      return;
    }
    if (!generalForm.requestorName) {
      TOAST.error("Requestor is required");
      return;
    }
    if (!generalForm.facility) {
      TOAST.error("location is required");
      return;
    }

    console.log("[Print Handler]", generalForm, detailForm);
    props.createDistributionHandler(generalForm, detailForm, props.mode);
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
      title: props.distribution ? "Print Supplies" : "Print Supplies",
      type: "primary",
      event: "print",
      callback: () => {
        console.log("[Call me]");
        printHandler();
      },
    },
    {
      title: "Cancel",
      type: "default",
      event: "cancel",
      callback: () => {
        console.log("[Cancel me]");
        props.onClose();
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
    console.log(
      "[source input val]",
      originalOrderQty,
      target,
      source,
      props.stockList
    );
    source[target.name] = target.value;

    if (target.name === "orderQty") {
      let val = parseInt(target.value || 0, 10);
      if (props.mode === "edit") {
        val = val - originalOrderQty;
      }
      console.log("[source input val2]", val);
      const findProduct = props.stockList.find(
        (stock) => stock.productId === source.productId
      );

      const qtyOnHand = findProduct ? findProduct.qty_on_hand || 0 : 0;

      const calc = parseInt(qtyOnHand || 0, 10) - parseInt(val, 10);
      source.adjustedQty = val;
      source.qtyOnHand = qtyOnHand || 0;
      if (val > 0) {
        if (calc >= 0) {
          source.stockStatus = `Qty On Hand : ${qtyOnHand || 0} ( In Stock )`;
        } else {
          source.stockStatus = `Qty On Hand: ${
            qtyOnHand || 0
          }  ( Out of Stock)`;
        }
      }
    }
    setIsRefresh(!isRefresh);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);

    if (item.categoryType === "employee") {
      src.requestor = item;

      src.position = item.position;
      src.requestorName = item.name;
      src.requestorId = item.id;
    } else if (item.categoryType === "patient") {
      src.patient = item;
      src.patientCd = item.patientCd;
      src.patientId = item.id;
      src.facility = `${item.careType}-${item.locationCd}`;
    } else if (item.category === "status") {
      src.status = item;
      src.statusName = item.name;
    }

    setGeneralForm(src);
  };

  const autoCompleteDetailInputHander = (item, source) => {
    source.search = item;
    console.log("[item]", item);
    source.description = `${item.description}  / ${item.additional_info}`;
    source.productId = item.productId;
    source.category = item.category;
    source.categoryId = item.category_id;
    source.subCategory = item.subCategory;
    source.shortDescription = item.shortDescription || item.short_description;
    source.subCategoryId = item.subCategory_id;
    source.vendor = item.vendor || "-";
    const productInfo = props.productList.find(
      (product) => product.id === item.productId
    );
    if (productInfo) {
      source.size = productInfo.size;
      source.flavor = productInfo.flavor;
      source.shortDescription = productInfo.short_description;
      source.unitDistribution = productInfo.unit_distribution;
      source.price_per_pcs = productInfo.price_per_pcs;
      source.search.shortDescription = productInfo.short_description;
      source.search.unitDistribution = productInfo.unit_distribution;
      source.search.category = productInfo.category;
      source.search.subCategory = productInfo.subCategory;
      source.search.vendor = productInfo.vendor;
      source.search.size = productInfo.size;
    }
    setIsRefresh(!isRefresh);
  };
  const onChangeGeneralInputHandler = (e) => {
    const src = { ...generalForm };
    if (!e.target.value) {
      src[e.target.name] = { name: "", label: "" };
      setGeneralForm(src);
    }
  };
  const onChangeDetailInputHandler = (e, source) => {
    if (!e.target.value) {
      source[e.target.name] = undefined;
      setIsRefresh(!isRefresh);
    }
  };
  const addItemHandler = () => {
    const records = [...detailForm];
    records.push({
      id: uuidv4(),
      description: "-",
      orderQty: 0,
      price_per_pcs: 0,
      stockQty: 0,
      unitDistribution: "-",
      status: "",
      comments: "",
      productId: "",
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
      return "View Distribution Record";
    } else if (props.mode === "edit") {
      return "Edit Distribution Record";
    } else {
      return "Create Distribution Record";
    }
  };
  const closePrintFormHandler = () => {
    setIsPrintFrom(false);
  };
  const clearModalHandler = () => {
    props.closeFormModalHandler();
  };

  console.log("[general form]", generalForm, detailForm);

  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 200000,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
        },
        content: {
          position: "absolute",
          top: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          right: "0",
          left: "0",
          overflow: "none",
          WebkitOverflowScrolling: "touch",
          border: "none",
          padding: "0px",
          background: "none",
        },
      }}
      isOpen={isOpen}
      onRequestClose={clearModalHandler}
      ariaHideApp={false}
    >
      <div className={styles.form}>
        <HeaderModal title={titleHandler()} onClose={clearModalHandler} />
        <div className={styles.content}>
          <GridContainer
            style={{ paddingTop: 10, paddingLeft: 24, paddingRight: 24 }}
          >
            <Typography variant="h6">General Information</Typography>
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
            <br />
            <Typography variant="h6">Supplies</Typography>
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
                  <Grid item xs={12} md={4} sm={12}>
                    <CustomSingleAutoComplete
                      disabled={
                        (props.mode && props.mode === "view") ||
                        props.mode === "edit"
                          ? true
                          : false
                      }
                      source={item}
                      {...details.find((d) => d.id === "search")}
                      value={item["search"]}
                      onSelectHandler={autoCompleteDetailInputHander}
                      onChangeHandler={onChangeDetailInputHandler}
                      options={[...props.stockList]}
                    />
                  </Grid>
                  <Grid item xs={12} md={3} sm={12}>
                    <CustomTextField
                      disabled={true}
                      source={item}
                      {...details.find((d) => d.id === "description")}
                      value={item["description"] || "-"}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={true}
                      source={item}
                      {...details.find((d) => d.id === "size")}
                      value={item["size"] || "-"}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={true}
                      source={item}
                      {...details.find((d) => d.id === "flavor")}
                      value={item["flavor"] || "-"}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={
                        props.mode && props.mode === "view" ? true : false
                      }
                      source={item}
                      {...details.find((d) => d.id === "orderQty")}
                      value={item["orderQty"]}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={
                        props.mode && props.mode === "view" ? true : false
                      }
                      source={item}
                      {...details.find((d) => d.id === "price_per_pcs")}
                      value={item["price_per_pcs"]}
                      onChange={inputDetailHandler}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={true}
                      source={item}
                      {...details.find((d) => d.id === "unitDistribution")}
                      value={item["unitDistribution"]}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={true}
                      source={item}
                      {...details.find((d) => d.id === "vendor")}
                      value={item["vendor"] || "-"}
                    />
                  </Grid>

                  <Grid item xs={12} md={2} sm={12}>
                    <CustomTextField
                      disabled={false}
                      source={item}
                      {...details.find((d) => d.id === "comments")}
                      value={item["comments"] || ""}
                      onChange={inputDetailHandler}
                    />
                  </Grid>

                  {item.stockStatus && item.orderQty > 0 && (
                    <Grid item xs={12} md={4} sm={12}>
                      <SnackbarContent
                        message={item.stockStatus}
                        height={12}
                        color={
                          item.stockStatus.indexOf("In Stock") !== -1
                            ? "info"
                            : "rose"
                        }
                        icon={
                          item.stockStatus.indexOf("In Stock") !== -1
                            ? undefined
                            : AddAlertOutlined
                        }
                      />
                    </Grid>
                  )}
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
          </GridContainer>
        </div>

        {props.mode && props.mode === "view" ? null : (
          <ModalFooter actions={footerActions} />
        )}
      </div>
      {isPrintForm && (
        <PrintForm
          isOpen={isPrintForm}
          generalForm={generalForm}
          closePrintForm={closePrintFormHandler}
          detailForm={detailForm}
        />
      )}
    </ReactModal>
  );
}
export default DistributionForm;

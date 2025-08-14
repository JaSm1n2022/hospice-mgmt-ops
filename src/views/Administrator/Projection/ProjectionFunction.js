import { Avatar, Button, makeStyles, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import CustomTextField from "components/TextField/CustomTextField";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchProduct } from "store/actions/productAction";
import { productListStateSelector } from "store/selectors/productSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { ACTION_STATUSES } from "utils/constants";
import { OTHER_EXPENSE_BUDGET } from "utils/constants";
import { UTILITIES_EXPENSE_BUDGET } from "utils/constants";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ITEM } from "utils/constants";
import { attemptToCreateOverhead } from "store/actions/overheadAction";
import { overheadCreateStateSelector } from "store/selectors/overheadSelector";
import { resetCreateOverheadState } from "store/actions/overheadAction";
import OverheadDocument from "views/Document/OverheadDocument";
import { MONTH } from "utils/constants";
import { YEAR } from "utils/constants";
import TOAST from "modules/toastManager";
import { overheadListStateSelector } from "store/selectors/overheadSelector";
import { attemptToFetchOverhead } from "store/actions/overheadAction";
import { resetFetchOverheadState } from "store/actions/overheadAction";
import HospiceTable from "components/Table/HospiceTable";
import ProjectionHandler from "./handler/ProjectionHandler";
import ActionsFunction from "components/Actions/ActionsFunction";
import { overheadUpdateStateSelector } from "store/selectors/overheadSelector";
import { attemptToUpdateOverhead } from "store/actions/overheadAction";
import { resetUpdateOverheadState } from "store/actions/overheadAction";
import { overheadDeleteStateSelector } from "store/selectors/overheadSelector";
import { attemptToDeleteOverhead } from "store/actions/overheadAction";
import { resetDeleteOverheadState } from "store/actions/overheadAction";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
let userProfile = {};
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};
let mode = "list";
let productList = [];
let originalSource = [];
let officeSupplyList = [];
let medicalSupplyList = [];
const TAX_PCT = 0.08;
let overheadOfficeSupplies = [];
let overheadMedicalSupplies = [];
let overheadEmployeeCost = [];
let officeExpense = 0.0;
let medicalExpense = 0.0;
let employeeExpense = 0.0;
let grandTotal = 0.0;
let currentOverhead = undefined;
const useStyles = makeStyles(styles);
let utilitiesBudget = [];

[...UTILITIES_EXPENSE_BUDGET].forEach((f) => {
  utilitiesBudget.push({ ...f });
});
let otherBudget = [];
[...OTHER_EXPENSE_BUDGET].forEach((s) => {
  otherBudget.push({ ...s });
});
const tempOfficeObject = {
  item: DEFAULT_ITEM,
  productId: "",
  unitPrice: 0.0,
  unitTotal: 0.0,
  qty: 0,
  qtyUom: "",
  size: "",
  vendor: "",
  estimatedTax: 0.0,
  grandTotal: 0.0,
};
const tempMedicalObject = {
  item: DEFAULT_ITEM,
  productId: "",
  unitPrice: 0.0,
  unitTotal: 0.0,
  qty: 0,
  qtyUom: "",
  size: "",
  vendor: "",
  estimatedTax: 0.0,
  grandTotal: 0.0,
};
function ProjectFunction(props) {
  const classes = useStyles();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isOverheadDocument, setIsOverheadDocument] = useState(false);
  const [printData, setPrintData] = useState({});
  const [monthPeriod, setMonthPeriod] = useState(DEFAULT_ITEM);
  const [yearPeriod, setYearPeriod] = useState(DEFAULT_ITEM);
  const [isCreateCollection, setIsCreateCollection] = useState(true);
  const [isUpdateCollection, setIsUpdateCollection] = useState(true);
  const [isDeleteCollection, setIsDeleteCollection] = useState(true);
  const [isEmployeeCollection, setIsEmployeeCollection] = useState(true);
  const [total, setTotal] = useState(0.0);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(ProjectionHandler.columns(true));
  const [isListCollection, setIsListCollection] = useState(true);
  const [item, setItem] = useState(undefined);
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  useEffect(() => {
    if (
      !isCreateCollection &&
      props.createOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      mode = "list";
      props.resetCreateOverhead();
      setIsCreateCollection(true);
      props.listOverhead({ companyId: userProfile.companyId });
      clearHandler();
    }
    if (
      !isUpdateCollection &&
      props.updateOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      mode = "list";
      props.resetUpdateOverhead();
      setIsUpdateCollection(true);
      props.listOverhead({ companyId: userProfile.companyId });
      clearHandler();
    }

    if (
      !isListCollection &&
      props.listOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListOverhead();
      setIsListCollection(true);
    }

    if (
      !isDeleteCollection &&
      props.deleteOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeleteOverhead();
      props.listOverhead({ companyId: userProfile.companyId });
      setIsDeleteCollection(true);
    }
    if (
      !isDeleteCollection &&
      props.deleteOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeleteOverhead();
      props.listOverhead({ companyId: userProfile.companyId });
      setIsDeleteCollection(true);
    }
    if (
      !isEmployeeCollection &&
      props.employees.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListEmployees();
      setIsEmployeeCollection();
    }
  }, [
    isCreateCollection,
    isListCollection,
    isUpdateCollection,
    isDeleteCollection,
  ]);

  useEffect(() => {
    mode = "list";
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listProducts({ companyId: userProfile.companyId });
      props.listOverhead({ companyId: userProfile.companyId });
      props.listEmployees({ companyId: userProfile.companyId });
      overheadOfficeSupplies = [];
      overheadOfficeSupplies.push({
        id: uuidv4(),
        ...tempOfficeObject,
      });
      overheadMedicalSupplies = [];
      overheadMedicalSupplies.push({
        id: uuidv4(),
        ...tempMedicalObject,
      });
    }
  }, []);
  const createOverheadHandler = () => {
    mode = "create";
    setItem(undefined);
    setIsRefresh(!isRefresh);
  };
  const totalHandler = () => {
    let tempTotal = 0.0;
    medicalExpense = 0.0;
    officeExpense = 0.0;
    employeeExpense = 0.0;
    utilitiesBudget.forEach((u) => {
      tempTotal += parseFloat(u.total);
    });
    otherBudget.forEach((u2) => {
      tempTotal += parseFloat(u2.total);
    });
    overheadOfficeSupplies.forEach((o) => {
      officeExpense += parseFloat(o.grandTotal);
      tempTotal += parseFloat(o.grandTotal);
    });
    overheadMedicalSupplies.forEach((o) => {
      medicalExpense += parseFloat(o.grandTotal);

      tempTotal += parseFloat(o.grandTotal);
    });
    overheadEmployeeCost.forEach((o) => {
      tempTotal += parseFloat(o.total);
      employeeExpense += parseFloat(o.total);
    });
    const empEx = otherBudget.find((o) => o.name === "employee");
    empEx.total = parseFloat(employeeExpense).toFixed(2);
    setTotal(tempTotal);
  };
  const inputDetailHandler = ({ target }, source) => {
    source[target.name] = target.value;
    source.total = target.value;
    totalHandler();
  };

  const inputSuppliesDetailHandler = ({ target }, source) => {
    console.log("[Source]", target.name, target.value, source);
    source[target.name] = target.value;

    source.unitTotal = parseFloat(
      parseFloat(source.unitPrice) * parseInt(source.qty)
    ).toFixed(2);
    source.estimatedTax = parseFloat(source.unitTotal * TAX_PCT).toFixed(2);
    source.grandTotal = parseFloat(
      parseFloat(source.estimatedTax) + parseFloat(source.unitTotal)
    ).toFixed(2);
    totalHandler();
  };
  const inputEmployeeDetailHandler = ({ target }, source) => {
    console.log("[Source]", target.name, target.value, source);
    source[target.name] = parseFloat(target.value || 0.0);

    source.total = parseFloat(
      parseFloat(source.rate) * parseInt(source.freqVisit)
    ).toFixed(2);
    setIsRefresh(!isRefresh);
    // totalHandler();
  };
  if (props.products && props.products.status === ACTION_STATUSES.SUCCEED) {
    productList = [...props.products.data];
    productList.forEach((item) => {
      item.name = item.description.toUpperCase();
      item.value = item.description.toUpperCase();
      item.label = item.description.toUpperCase();
      item.categoryType = "description";
    });
    officeSupplyList = productList.filter(
      (p) => p.category && p.category.toLowerCase() === "office"
    );
    officeSupplyList.forEach((o) => {
      o.categoryType = "office";
    });
    medicalSupplyList = productList.filter(
      (p) => p.category && p.category.toLowerCase() !== "office"
    );

    props.resetListProducts();
  }
  if (
    isEmployeeCollection &&
    props.employees &&
    props.employees.status === ACTION_STATUSES.SUCCEED
  ) {
    const data = props.employees.data;
    overheadEmployeeCost = [];
    data.forEach((d) => {
      d.category = "employee";
      d.label = d.name;
      d.rate = 0.0;
      d.freqVisit = 0;
      d.total = 0;
      d.value = d.value;
      overheadEmployeeCost.push(d);
    });
    setIsEmployeeCollection(false);
  }
  const autoCompleteDetailInputHander = (item, source) => {
    source.item = item;
    source.productId = item.id;
    source.unitPrice = item.unit_price || 0.0;
    source.qty = item.qty || 0.0;
    source.qtyUom = item.qty_uom || "";
    source.vendor = item.vendor || "";
    source.size = item.size || "";
    source.vendor = item.vendor || "";
    source.shortDescription = item.short_description;
    source.unitTotal = parseFloat(
      parseFloat(source.unitPrice) * parseInt(source.qty)
    ).toFixed(2);
    source.estimatedTax = parseFloat(source.unitTotal * TAX_PCT).toFixed(2);
    source.grandTotal = parseFloat(
      parseFloat(source.estimatedTax) + parseFloat(source.unitTotal)
    ).toFixed(2);

    totalHandler();
  };

  const autoCompleteGeneralnputHander = (item) => {
    if (item.category === "month") {
      setMonthPeriod(item);
    } else if (item.category === "year") {
      setYearPeriod(item);
    }
  };
  const onChangeDetailInputHandler = (e, source) => {
    if (!e.target.value) {
      source[e.target.name] = undefined;
      setIsRefresh(!isRefresh);
    }
  };
  const onChangeGeneralInputHandler = (e) => {
    if (!e.target.value && e.target.name === "month") {
      setMonthPeriod(DEFAULT_ITEM);
    } else if (!e.target.value && e.target.name === "year") {
      setYearPeriod(DEFAULT_ITEM);
    }
  };
  const addOfficeSupplyHandler = () => {
    overheadOfficeSupplies.push({
      id: uuidv4(),

      ...tempOfficeObject,
    });
    setIsRefresh(!isRefresh);
  };
  const addMedicalSupplyHandler = () => {
    overheadMedicalSupplies.push({
      id: uuidv4(),

      ...tempMedicalObject,
    });
    setIsRefresh(!isRefresh);
  };
  const deleteOfficeSupplyHandler = (indx) => {
    overheadOfficeSupplies.splice(indx, 1);
    setIsRefresh(!isRefresh);
  };
  const deleteMedicalSupplyHandler = (indx) => {
    overheadMedicalSupplies.splice(indx, 1);
    setIsRefresh(!isRefresh);
  };
  const clearHandler = () => {
    console.log("[Clear]", UTILITIES_EXPENSE_BUDGET);
    utilitiesBudget = [];

    [...UTILITIES_EXPENSE_BUDGET].forEach((f) => {
      utilitiesBudget.push({ ...f });
    });
    otherBudget = [];
    [...OTHER_EXPENSE_BUDGET].forEach((s) => {
      otherBudget.push({ ...s });
    });
    medicalExpense = 0.0;
    officeExpense = 0.0;
    employeeExpense = 0.0;
    overheadOfficeSupplies = [];
    overheadMedicalSupplies = [];
    overheadOfficeSupplies.push({
      id: uuidv4(),

      ...tempOfficeObject,
    });
    overheadMedicalSupplies.push({
      id: uuidv4(),

      ...tempMedicalObject,
    });

    setPrintData({});
    setTotal(0.0);
    setMonthPeriod(DEFAULT_ITEM);
    setYearPeriod(DEFAULT_ITEM);
  };
  const saveHandler = () => {
    let isError = false;
    if (!monthPeriod || !monthPeriod.value) {
      TOAST.error("Month Period is required.");
      isError = true;
    }
    if (!yearPeriod || !yearPeriod.value) {
      TOAST.error("Year Period is required.");
      isError = true;
    }

    overheadOfficeSupplies.map((m) => {
      if (!m.productId) {
        TOAST.error("Office item is required.");
        isError = true;
      }
    });
    overheadMedicalSupplies.map((m) => {
      if (!m.productId) {
        TOAST.error("Medical item is required.");
        isError = true;
      }
    });
    if (!isError) {
      const payload = {
        utilities_expense: utilitiesBudget.map((m) => ({
          name: m.name,
          total: m.total,
        })),
        month: monthPeriod.value,
        year: yearPeriod.value,
        total,
        other_expense: otherBudget.map((m) => ({
          name: m.name,
          total: m.total,
        })),
        supplies_expense: [
          { name: "office", total: officeExpense || 0.0 },
          { name: "medical", total: medicalExpense || 0.0 },
        ],
        office_details: overheadOfficeSupplies.map((m) => ({
          productId: m.productId,
          qty: m.qty,
          unitPrice: m.unitPrice,
          grandTotal: m.grandTotal,
          total: m.unitTotal,
          estimatedTax: m.estimatedTax,
          shortDescription: m.shortDescription,
          qtyUom: m.qtyUom,
        })),
        medical_details: overheadMedicalSupplies.map((m) => ({
          productId: m.productId,
          qty: m.qty,
          unitPrice: m.unitPrice,
          grandTotal: m.grandTotal,
          total: m.unitTotal,
          estimatedTax: m.estimatedTax,
          shortDescription: m.shortDescription,
          qtyUom: m.qtyUom,
        })),
        companyId: userProfile.companyId,
        created_at: new Date(),
      };
      payload.updatedUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
      if (mode === "create") {
        payload.createdUser = {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        };
      } else {
        payload.id = item.id;
      }
      if (mode === "create") {
        props.createOverhead(payload);
      } else {
        props.updateOverhead(payload);
      }
      console.log("[Save Handler]", payload);
    }
  };
  if (
    isCreateCollection &&
    props.createOverheadState &&
    props.createOverheadState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Successfully Saved");
    setIsCreateCollection(false);
  }
  if (
    isUpdateCollection &&
    props.updateOverheadState &&
    props.updateOverheadState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Successfully Saved");
    setIsUpdateCollection(false);
  }
  console.log("[Product List1]", productList);
  console.log("[Product List2]", officeSupplyList);
  console.log("[Product List3]", medicalSupplyList);
  const printHandler = () => {
    console.log(
      "[OverHeadOfficeSupplies",
      overheadOfficeSupplies,
      officeSupplyList
    );
    const payload = {
      utilitiesExpense: utilitiesBudget.map((m) => ({
        name: m.label || m.name,
        total: m.total || 0.0,
      })),
      month: monthPeriod.value,
      year: yearPeriod.value,
      total: total || 0.0,
      otherOperationExpense: otherBudget.map((m) => ({
        name: m.label || m.name,
        total: m.total || 0.0,
      })),
      suppliesExpense: [
        { name: "office", total: officeExpense },
        { name: "medical", total: medicalExpense },
      ],
      officeDetails: overheadOfficeSupplies.map((m) => ({
        productId: m.productId,
        qty: m.qty || 1,
        unitPrice: m.unitPrice,
        grandTotal: m.grandTotal || 0.0,
        total: m.unitTotal || 0.0,
        shortDescription: m.shortDescription,
        vendor: m.vendor,
        qtyUom: m.qtyUom || "",
      })),
      medicalDetails: overheadMedicalSupplies.map((m) => ({
        productId: m.productId,
        qty: m.qty,
        unitPrice: m.unitPrice || 0.0,
        grandTotal: m.grandTotal || 0.0,
        total: m.unitTotal || 0.0,
        shortDescription: m.shortDescription,
        vendor: m.vendor,

        qtyUom: m.qtyUom || "",
      })),
    };
    setPrintData(payload);

    setIsOverheadDocument(true);
  };
  const closePrintModalHandler = () => {
    setIsOverheadDocument(false);
  };
  const cancelHandler = () => {
    mode = "list";
    clearHandler();
    setItem(undefined);
    setIsRefresh(!isRefresh);
  };
  const createFormHandler = (data) => {
    let gTotal = 0.0;
    console.log("[Data]", data);
    mode = "edit";

    const currentUtilities = data.utilities_expense;
    const currentOthers = data.other_expense;
    utilitiesBudget = [];

    [...UTILITIES_EXPENSE_BUDGET].forEach((f) => {
      const cat = currentUtilities.find((c) => c.name === f.name);
      if (cat) {
        f.total = parseFloat(cat.total || 0.0);
      }
      gTotal += parseFloat(f.total || 0.0);
      utilitiesBudget.push({ ...f });
    });
    otherBudget = [];
    [...OTHER_EXPENSE_BUDGET].forEach((f) => {
      const cat = currentOthers.find((c) => c.name === f.name);
      if (cat) {
        f.total = parseFloat(cat.total || 0.0);
      }
      gTotal += parseFloat(f.total || 0.0);
      otherBudget.push({ ...f });
    });
    medicalExpense = 0.0;
    officeExpense = 0.0;

    overheadOfficeSupplies = [];
    data.office_details.forEach((d) => {
      const product = officeSupplyList.find((i) => i.id === d.productId);
      overheadOfficeSupplies.push({
        id: uuidv4(),
        ...tempOfficeObject,
        item: product,
        productId: product.id,
        vendor: product.vendor,
        qty: d.qty,
        qtyUom: d.qtyUom,
        shortDescription: product.short_description,

        unitPrice: d.unitPrice,
        unitTotal: d.total,
        grandTotal: d.grandTotal,
        estimatedTax: d.estimatedTax,
      });
      officeExpense += parseFloat(d.grandTotal || 0.0);
    });

    overheadMedicalSupplies = [];
    data.medical_details.forEach((d) => {
      const product = medicalSupplyList.find((i) => i.id === d.productId);
      overheadMedicalSupplies.push({
        id: uuidv4(),
        ...tempMedicalObject,
        item: product,
        productId: product.id,
        vendor: product.vendor,
        qty: d.qty,
        qtyUom: d.qtyUom,
        unitPrice: d.unitPrice,
        shortDescription: product.short_description,
        unitTotal: d.total,
        grandTotal: d.grandTotal,
        estimatedTax: d.estimatedTax,
      });
      medicalExpense += parseFloat(d.grandTotal || 0.0);
    });

    gTotal += parseFloat(medicalExpense || 0.0);
    gTotal += parseFloat(officeExpense || 0.0);

    setTotal(gTotal);
    setItem(data);
    setMonthPeriod(MONTH.find((m) => m.value === data.month));
    setYearPeriod(YEAR.find((m) => m.value === data.year));
  };
  const deleteRecordItemHandler = (id) => {
    console.log("[delete overhead id]", id);
    props.deleteOverhead(id);
  };

  if (
    isDeleteCollection &&
    props.deleteOverheadState &&
    props.deleteOverheadState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("overhead successfully deleted.");
    setIsDeleteCollection(false);
  }

  if (
    isListCollection &&
    props.listOverheadState &&
    props.listOverheadState.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.listOverheadState.data;
    if (source && source.length) {
      source = ProjectionHandler.mapData(source, null);
    }

    const cols = ProjectionHandler.columns(true).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              data={{ ...cellProps.data }}
            />
          ),
        };
      } else {
        return {
          ...col,
          editable: () => false,
        };
      }
    });
    setColumns(cols);
    originalSource = [...source];
    setDataSource(source);
    setIsListCollection(false);
  }
  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    }
    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];

    setDataSource(dtSource);
  };
  const titleHandler = () => {
    if (mode === "create") {
      return "Create Overhead";
    } else if (mode === "edit") {
      return "Edit Overhead";
    } else {
      return "History";
    }
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `overhead_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
      import(/* webpackChunkName: 'json2xls' */ "json2xls")
        .then((json2xls) => {
          // let fileName = fname + '_' + new Date().getTime();
          const xls =
            typeof json2xls === "function"
              ? json2xls(excel)
              : json2xls.default(excel);
          const buffer = Buffer.from(xls, "binary");
          // let buffer = Buffer.from(excelBuffer);
          const data = new Blob([buffer], { type: fileType });
          FileSaver.saveAs(data, fileName + fileExtension);
        })
        .catch((err) => {
          // Handle failure
          console.log(err);
        });
    }
  };

  return (
    <div>
      <GridContainer>
        <Card>
          <CardHeader color="primary">
            <Grid container>
              <h4 className={classes.cardTitleWhite}>Overhead Budget</h4>
            </Grid>
          </CardHeader>
          <CardBody>
            <Grid
              container
              style={{
                paddingBottom: 10,
              }}
            >
              <Typography variant="h6">{titleHandler()}</Typography>
            </Grid>
            <Grid
              container
              justify="flex-end"
              style={{
                paddingBottom: 10,
                display: mode === "list" ? "" : "none",
              }}
            >
              {isAddGroupButtons && (
                <div
                  style={{ display: "inline-flex", gap: 10, paddingRight: 10 }}
                >
                  <Button
                    onClick={() => exportToExcelHandler()}
                    variant="outlined"
                    style={{
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
                  >
                    {" "}
                    Export Excel{" "}
                  </Button>
                </div>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => createOverheadHandler()}
              >
                Create Overhead
              </Button>
            </Grid>
            {mode === "list" ? (
              <Grid container>
                <HospiceTable
                  columns={columns}
                  main={true}
                  grandTotal={grandTotal}
                  dataSource={dataSource}
                  height={400}
                  onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                />
              </Grid>
            ) : (
              <Grid container>
                <Grid container justifyContent="space-between" spacing={24}>
                  <div>
                    <Typography variant="body1">Period</Typography>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <div style={{ width: "150px" }}>
                        <CustomSingleAutoComplete
                          name="month"
                          label="Month"
                          placeholder="Month"
                          value={monthPeriod}
                          options={MONTH || [DEFAULT_ITEM]}
                          onSelectHandler={autoCompleteGeneralnputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={mode === "edit"}
                        />
                      </div>

                      <div style={{ width: "150px" }}>
                        <CustomSingleAutoComplete
                          name="year"
                          label="Year"
                          placeholder="Year"
                          value={yearPeriod}
                          options={YEAR || [DEFAULT_ITEM]}
                          onSelectHandler={autoCompleteGeneralnputHander}
                          onChangeHandler={onChangeGeneralInputHandler}
                          disabled={mode === "edit"}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography variant="h6" style={{ color: "blue" }}>
                    {`TOTAL :$${new Intl.NumberFormat("en-US", {}).format(
                      parseFloat(total || 0.0).toFixed(2)
                    )}`}
                  </Typography>
                </Grid>
                <Grid container spacing={4} style={{ paddingTop: 20 }}>
                  {/* Utilities */}
                  <Grid item xs={12} md={3}>
                    <Grid item xs={12} md={12}>
                      <Typography variant="h6">UTILITIES EXPENSE</Typography>
                    </Grid>
                    {utilitiesBudget.map((m, indx) => {
                      return (
                        <Grid key={indx} item xs={12} md={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              {m.label.toUpperCase()}
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <CustomTextField
                                type="number"
                                name={m.name}
                                value={m[m.name] || m.total}
                                source={m}
                                onChange={inputDetailHandler}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                  {/* Other */}
                  <Grid item xs={12} md={6}>
                    <Grid item xs={12} md={12}>
                      <Typography variant="h6">OTHER EXPENSES</Typography>
                    </Grid>
                    <Grid container spacing={1}>
                      {otherBudget.map((u, indx2) => {
                        return (
                          <Grid item xs={12} md={6} key={indx2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                {u.label}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <CustomTextField
                                  type="number"
                                  source={u}
                                  name={u.name}
                                  value={u[u.name] || u.total}
                                  onChange={inputDetailHandler}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  {/* Other */}
                  <Grid item xs={12} md={3}>
                    <Grid item xs={12} md={12}>
                      <Typography variant="h6">SUPPLIES EXPENSES</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          OFFICE
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <CustomTextField
                            value={parseFloat(officeExpense || 0.0).toFixed(2)}
                            readonly={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          MEDICAL
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <CustomTextField
                            value={parseFloat(medicalExpense || 0.0).toFixed(2)}
                            readonly={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={4}
                  style={{ paddingTop: 40, paddingLeft: 12 }}
                >
                  {/* EMPLOYEE COST */}
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6">EMPLOYEE RATES/COST</Typography>
                    {overheadEmployeeCost.map((src, indx) => {
                      return (
                        <Grid item xs={12} md={12} key={indx}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={1}>
                              <div style={{ display: "inline-flex", gap: 2 }}>
                                <Avatar style={{ width: 24, height: 24 }}>
                                  {indx + 1}
                                </Avatar>
                                <Delete style={{ color: "red" }} />
                              </div>
                            </Grid>

                            <Grid item xs={12} md={11}>
                              <CustomTextField
                                source={src}
                                name="employeeName"
                                label="Select Item"
                                value={src.name}
                                disabled={true}
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="rate"
                                label="Rate"
                                type="number"
                                onChange={inputEmployeeDetailHandler}
                                value={src.rate}
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="freqVisit"
                                label="Per Visit/Hr"
                                type="number"
                                onChange={inputEmployeeDetailHandler}
                                value={src.freqVisit}
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="total"
                                label="Total"
                                type="number"
                                value={src.total}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* SUPPLIES */}
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6">OFFICE SUPPLIES</Typography>
                    {overheadOfficeSupplies.map((src, indx) => {
                      return (
                        <Grid item xs={12} md={12} key={indx}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={1}>
                              <div style={{ display: "inline-flex", gap: 2 }}>
                                <Avatar style={{ width: 24, height: 24 }}>
                                  {indx + 1}
                                </Avatar>
                                <Delete
                                  onClick={() =>
                                    deleteOfficeSupplyHandler(indx)
                                  }
                                  style={{ color: "red" }}
                                />
                              </div>
                            </Grid>

                            <Grid item xs={12} md={11}>
                              <CustomSingleAutoComplete
                                source={src}
                                name="product"
                                label="Select Item"
                                value={src.item}
                                options={officeSupplyList || [DEFAULT_ITEM]}
                                onSelectHandler={autoCompleteDetailInputHander}
                                onChangeHandler={onChangeDetailInputHandler}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="vendor"
                                label="Vendor"
                                value={src.vendor}
                                readonly={true}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="qty"
                                label="Qty"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                                value={src.qty}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="unitPrice"
                                label="Unit Price"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                value={src.unitPrice}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="unitTotal"
                                label="Total"
                                type="number"
                                value={src.unitTotal}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="estimatedTax"
                                label="Estimated Tax"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                value={src.estimatedTax}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="grandTotal"
                                label="Grand Total"
                                type="number"
                                readonly={true}
                                value={src.grandTotal}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                    <div style={{ paddingTop: 10 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addOfficeSupplyHandler()}
                      >
                        Add More Item
                      </Button>
                    </div>
                  </Grid>

                  {/* MEDICAL SUPPLIES */}
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6">
                      MEDICAL/INCONTINENCE SUPPLIES
                    </Typography>
                    {overheadMedicalSupplies.map((src, indx) => {
                      return (
                        <Grid item xs={12} md={12} key={indx}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={1}>
                              <div style={{ display: "inline-flex", gap: 2 }}>
                                <Avatar style={{ width: 24, height: 24 }}>
                                  {indx + 1}
                                </Avatar>
                                <Delete
                                  onClick={() =>
                                    deleteMedicalSupplyHandler(indx)
                                  }
                                  style={{ color: "red" }}
                                />
                              </div>
                            </Grid>
                            <Grid item xs={12} md={11}>
                              <CustomSingleAutoComplete
                                source={src}
                                name="product"
                                label="Select Item"
                                value={src.item}
                                options={medicalSupplyList || [DEFAULT_ITEM]}
                                onSelectHandler={autoCompleteDetailInputHander}
                                onChangeHandler={onChangeDetailInputHandler}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="vendor"
                                label="Vendor"
                                value={src.vendor}
                                readonly={true}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="qty"
                                label="Qty"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                                value={src.qty}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="unitPrice"
                                label="Unit Price"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                value={src.unitPrice}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="unitTotal"
                                label="Total"
                                type="number"
                                value={src.unitTotal}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="estimatedTax"
                                label="Estimated Tax"
                                type="number"
                                onChange={inputSuppliesDetailHandler}
                                value={src.estimatedTax}
                                disabled={
                                  !src.item || (src.item && !src.item.name)
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <CustomTextField
                                source={src}
                                name="grandTotal"
                                label="Grand Total"
                                type="number"
                                readonly={true}
                                value={src.grandTotal}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                    <div style={{ paddingTop: 10 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addMedicalSupplyHandler()}
                      >
                        Add More Item
                      </Button>
                    </div>
                  </Grid>
                </Grid>

                <Grid>
                  <div
                    style={{ display: "inline-flex", gap: 10, paddingTop: 20 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveHandler()}
                    >
                      {mode === "edit" ? "Update" : "Save"}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => cancelHandler()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => printHandler()}
                    >
                      Print
                    </Button>
                  </div>
                </Grid>
                {isOverheadDocument && (
                  <OverheadDocument
                    isOpen={isOverheadDocument}
                    printData={printData}
                    closePrintModalHandler={closePrintModalHandler}
                  />
                )}
              </Grid>
            )}
          </CardBody>
        </Card>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  profileState: profileListStateSelector(store),
  createOverheadState: overheadCreateStateSelector(store),
  updateOverheadState: overheadUpdateStateSelector(store),
  listOverheadState: overheadListStateSelector(store),
  deleteOverheadState: overheadDeleteStateSelector(store),
  employees: employeeListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  listOverhead: (data) => dispatch(attemptToFetchOverhead(data)),
  resetListOverhead: () => dispatch(resetFetchOverheadState()),
  resetListProducts: () => dispatch(resetFetchProductState()),
  createOverhead: (data) => dispatch(attemptToCreateOverhead(data)),
  resetCreateOverhead: () => dispatch(resetCreateOverheadState()),
  updateOverhead: (data) => dispatch(attemptToUpdateOverhead(data)),
  resetUpdateOverhead: () => dispatch(resetUpdateOverheadState()),
  deleteOverhead: (data) => dispatch(attemptToDeleteOverhead(data)),
  resetDeleteOverhead: () => dispatch(resetDeleteOverheadState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProjectFunction);

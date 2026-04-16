import {
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import DistributionHandler from "./handler/DistributionHandler";

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { useState } from "react";
import * as FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Form from "./components/Form";
import TemplateForm from "./components/TemplateForm";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button.js";
// import PrintForm from "./components/PrintForm"; // Removed - now using direct PDF generation
import { productListStateSelector } from "store/selectors/productSelector";
import { stockListStateSelector } from "store/selectors/stockSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { templateListStateSelector } from "store/selectors/templateSelector";
import { categoryListStateSelector } from "store/selectors/categorySelector";
import { distributionListStateSelector } from "store/selectors/distributionSelector";
import { distributionCreateStateSelector } from "store/selectors/distributionSelector";
import { distributionUpdateStateSelector } from "store/selectors/distributionSelector";
import { templateUpdateStateSelector } from "store/selectors/templateSelector";
import { distributionDeleteStateSelector } from "store/selectors/distributionSelector";
import { stockUpdateStateSelector } from "store/selectors/stockSelector";
import { templateCreateStateSelector } from "store/selectors/templateSelector";
import { templateDeleteStateSelector } from "store/selectors/templateSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchStock } from "store/actions/stockAction";
import { resetFetchStockState } from "store/actions/stockAction";
import { attemptToFetchCategory } from "store/actions/categoryAction";
import { resetFetchCategoryState } from "store/actions/categoryAction";
import { attemptToFetchDistribution } from "store/actions/distributionAction";
import { resetFetchDistributionState } from "store/actions/distributionAction";
import { attemptToCreateDistribution } from "store/actions/distributionAction";
import { resetCreateDistributionState } from "store/actions/distributionAction";
import { attemptToUpdateDistribution } from "store/actions/distributionAction";
import { resetUpdateDistributionState } from "store/actions/distributionAction";
import { attemptToDeleteDistribution } from "store/actions/distributionAction";
import { resetDeleteDistributionState } from "store/actions/distributionAction";
import { attemptToUpdateStock } from "store/actions/stockAction";
import { resetUpdateStockState } from "store/actions/stockAction";
import { attemptToCreateTemplate } from "store/actions/templateAction";
import { resetCreateTemplateState } from "store/actions/templateAction";
import { attemptToFetchTemplate } from "store/actions/templateAction";
import { resetFetchTemplateState } from "store/actions/templateAction";
import { attemptToUpdateTemplate } from "store/actions/templateAction";
import { resetUpdateTemplateState } from "store/actions/templateAction";
import { attemptToDeleteTemplate } from "store/actions/templateAction";
import { resetDeleteTemplateState } from "store/actions/templateAction";
import HospiceTable from "components/Table/HospiceTable";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";
import ActionsFunction from "components/Actions/ActionsFunction";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { SUPPLY_STATUS } from "utils/constants";
import { LIMIT_ITEM_PRINT } from "utils/constants";
import TOAST from "modules/toastManager";
import FilterTable from "components/Table/FilterTable";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CopyIcon from "@material-ui/icons/FileCopy";
import PrintIcon from "@material-ui/icons/Print";
import UploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import { profileListStateSelector } from "store/selectors/profileSelector";
import nanoid8 from "utils/nanoid8";
import Snackbar from "components/Snackbar/Snackbar.js";
import {
  AddAlert,
  CalendarToday,
  CloudCircleOutlined,
  CloudUpload,
  FontDownload,
  Image,
  Print,
  Settings,
} from "@material-ui/icons";
import { proofListStateSelector } from "store/selectors/proofSelector";
import { attemptToFetchProof } from "store/actions/proofAction";
import { resetFetchProofState } from "store/actions/proofAction";
import DialogProof from "components/Dialog/DialogProof";
import DialogFunction from "components/Actions/DialogFunction";
import DistributionCalendarModal from "./components/DistributionCalendarModal";
import { SupaContext } from "App";
import { handleExport } from "utils/XlsxHelper";
import { pdf } from "@react-pdf/renderer";
import PrintOrdersPdfDocument from "./components/PrintOrdersPdfDocument";
let productList = [];
let stockList = [];
let patientList = [];
let employeeList = [];
let templateList = [];
let categoryList = [];

let isProductListDone = false;
let isStockListDone = false;
let isDistributionListDone = false;
let isPatientListDone = false;
let isEmployeeListDone = false;
let isTemplateListDone = false;
let isCategoryListDone = false;
let isAllFetchDone = false;
let mainGeneral = {};
let mainDetails = [];
let proofItem = undefined;
let grandTotal = 0.0;
let forStockUpdates = [];
let originalSource = undefined;
let multiPatients = [];
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

const useStyles = makeStyles(styles);
const Distribution = (props) => {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [templateAnchorEl, setTemplateAnchorEl] = React.useState(null);
  const [isPrintForm, setIsPrintForm] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfDialogData, setPdfDialogData] = useState({
    patientName: "",
    location: "",
    datePickup: moment().format("YYYY-MM-DD"),
    generalForm: null,
    detailForm: null,
  });
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(DistributionHandler.columns());
  const [isFormModal, setIsFormModal] = useState(false);
  const [isTemplateFormModal, setIsTemplateFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [module, setModule] = useState("single");
  const [message, setMessage] = useState("");
  const [tc, setTC] = useState(false);
  const [color, setColor] = useState("success");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [isDistributionsCollection, setIsDistributionsCollection] = useState(
    true
  );
  const [isProofCollection, setIsProofCollection] = useState(true);
  const [
    isCreateDistributionCollection,
    setIsCreateDistributionCollection,
  ] = useState(true);
  const [
    isUpdateDistributionCollection,
    setIsUpdateDistributionCollection,
  ] = useState(true);
  const [
    isDeleteDistributionCollection,
    setIsDeleteDistributionCollection,
  ] = useState(true);
  const [generalForm, setGeneralForm] = useState(undefined);
  const [detailForm, setDetailForm] = useState([]);
  const [isCreateTemplateCollection, setIsCreateTemplateCollection] = useState(
    true
  );
  const [isUpdateTemplateCollection, setIsUpdateTemplateCollection] = useState(
    true
  );
  const [isDeleteTemplateCollection, setIsDeleteTemplateCollection] = useState(
    true
  );
  const [isShowProof, setIsShowProof] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPrintOrdersDialogOpen, setIsPrintOrdersDialogOpen] = useState(false);
  const [printOrdersPatientName, setPrintOrdersPatientName] = useState("");
  const [printOrdersLocation, setPrintOrdersLocation] = useState("");
  const [printOrdersDatePickup, setPrintOrdersDatePickup] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [printOrdersRequestor, setPrintOrdersRequestor] = useState(null);
  const showNotification = (place, color, msg) => {
    setMessage(msg);
    switch (place) {
      case "tc":
        if (!tc) {
          setTC(true);
          setColor(color);
          setTimeout(function () {
            setTC(false);
          }, 6000);
        }
        break;
      default:
        break;
    }
  };
  const createFormHandler = (data, mode) => {
    console.log("[data]", data);
    setMode(mode || "create");
    setModule("single");
    if (mode === "edit") {
      //setItem(data);
      data.distributionId = data.id;
      data.patient = patientList.find((p) => p.id === data.patient_id);
      if (data.requestor_id) {
        data.requestor = employeeList.find((e) => e.id === data.requestor_id);
      } else if (data.requestor) {
        data.requestor = employeeList.find(
          (e) => e.name && e.name.toUpperCase() === data.requestor.toUpperCase()
        );
      }
      data.requestorName = data.requestor;
      const prod = productList.find((p) => p.id === data.productId);

      data.details = [
        {
          search: { ...prod },
          ...prod,
          orderQty: data.order_qty,
          comments: data.comments,
          productId: data.productId,
          unitDistribution:
            data.unit_distribution || data.unitDistribution || data.unit_uom,
          distributionId: data.id,
        },
      ];
      setItem(data);
    } else {
      setItem(data);
    }

    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };
  const closeTemplateFormModalHandler = () => {
    setIsTemplateFormModal(false);
  };

  useEffect(() => {
    console.log("list Distributions");
    console.log("[UUID]", nanoid8());
    if (context.userProfile?.companyId) {
      const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
      setDateFrom(dates.from);
      setDateTo(dates.to);
      props.listProducts({ companyId: context.userProfile?.companyId });
      props.listStocks({ companyId: context.userProfile?.companyId });
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listDistributions({
        from: dates.from,
        to: dates.to,
        companyId: context.userProfile?.companyId,
      });
      props.listEmployees({ companyId: context.userProfile?.companyId });
      props.listTemplates({ companyId: context.userProfile?.companyId });
      props.listCategories({ companyId: context.userProfile?.companyId });
    }
  }, []);

  useEffect(() => {
    if (
      !isDistributionsCollection &&
      props.distributions &&
      props.distributions.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListDistributions();

      setIsDistributionsCollection(true);
    }

    if (
      !isCreateDistributionCollection &&
      props.createDistributionState &&
      props.createDistributionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateDistribution();

      setIsCreateDistributionCollection(true);
    }
    if (
      !isUpdateDistributionCollection &&
      props.updateDistributionState &&
      props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateDistribution();

      setIsUpdateDistributionCollection(true);
    }
    if (
      !isDeleteDistributionCollection &&
      props.deleteDistributionState &&
      props.deleteDistributionState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteDistribution();
      setIsDeleteDistributionCollection(true);
    }
    if (
      !isCreateTemplateCollection &&
      props.createTemplateState &&
      props.createTemplateState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateTemplate();

      setIsCreateTemplateCollection(true);
    }
    if (
      !isUpdateTemplateCollection &&
      props.updateTemplateState &&
      props.updateTemplateState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateTemplate();

      setIsUpdateTemplateCollection(true);
    }
    if (
      !isDeleteTemplateCollection &&
      props.deleteTemplateState &&
      props.deleteTemplateState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeleteTemplate();
      setIsDeleteTemplateCollection(true);
    }
    if (
      !isProofCollection &&
      props.proofs &&
      props.proofs.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[PROPS]", props.proofs, dataSource);
      if (props.proofs?.data?.length) {
        proofItem = {
          deliverySignature: props.proofs.data.find(
            (d) => d.category === "delivery_signature"
          )
            ? props.proofs.data.find((d) => d.category === "delivery_signature")
                .image_based
            : undefined,
          deliveryPhoto: props.proofs.data.find(
            (d) => d.category === "delivery_photo"
          )
            ? props.proofs.data.find((d) => d.category === "delivery_photo")
                .image_based
            : undefined,
          pickupSignature: props.proofs.data.find(
            (d) => d.category === "pickup_signature"
          )
            ? props.proofs.data.find((d) => d.category === "pickup_signature")
                .image_based
            : undefined,
          pickupPhoto: props.proofs.data.find(
            (d) => d.category === "pickup_photo"
          )
            ? props.proofs.data.find((d) => d.category === "pickup_photo")
                .image_based
            : undefined,
        };
        const data = dataSource.find(
          (d) =>
            d?.record_id.toString() ===
            props.proofs.data[0].record_id.toString()
        );

        proofItem.requestor = data?.requestor;
        proofItem.recordId = props.proofs.data[0].record_id;
        //  proofItem.requestor = requestor;
        setIsShowProof(true);
      }
      props.resetFetchProof();
      setIsProofCollection(true);
    }
  }, [
    isUpdateTemplateCollection,
    isCreateTemplateCollection,
    isDeleteTemplateCollection,
    isDistributionsCollection,
    isCreateDistributionCollection,
    isUpdateDistributionCollection,
    isDeleteDistributionCollection,
    isProofCollection,
  ]);

  const grandTotalHandler = (data) => {
    grandTotal = 0.0;
    data.forEach((e) => {
      grandTotal = parseFloat(
        parseFloat(grandTotal) + parseFloat(e.estimated_total_amt)
      ).toFixed(2);
    });
  };
  const showProofHandler = (data) => {
    console.log("[ID]", data);
    props.fetchProof({
      id: data.record_id,
      companyId: context.userProfile?.companyId,
    });
  };
  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    patientList = [...props.patients.data];
    patientList.forEach((item) => {
      if (item.patientCd) {
        item.name = item.patientCd.toUpperCase();
        item.value = item.patientCd.toUpperCase();
        item.label = item.patientCd.toUpperCase();
        item.categoryType = "patient";
      }
    });
    isPatientListDone = true;
    props.resetListPatients();
  }

  if (props.templates && props.templates.status === ACTION_STATUSES.SUCCEED) {
    templateList = [...props.templates.data];
    templateList.forEach((item) => {
      item.name = item.name.toUpperCase();
      item.value = item.name.toUpperCase();
      item.label = item.name.toUpperCase();
      item.categoryType = "template";
    });
    isTemplateListDone = true;
    props.resetListTemplates();
  }
  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    employeeList = [...props.employees.data];
    employeeList.forEach((item) => {
      item.name = item.name.toUpperCase();
      item.value = item.name.toUpperCase();
      item.label = item.name.toUpperCase();
      item.categoryType = "employee";
    });
    isEmployeeListDone = true;
    props.resetListEmployees();
  }
  if (props.categories && props.categories.status === ACTION_STATUSES.SUCCEED) {
    categoryList = [...props.categories.data];
    categoryList.forEach((item) => {
      item.name = item.name.toUpperCase();
      item.value = item.name.toUpperCase();
      item.label = item.name.toUpperCase();
      item.categoryType = "category";
    });
    isCategoryListDone = true;
    props.resetListCategories();
  }
  if (props.products && props.products.status === ACTION_STATUSES.SUCCEED) {
    productList = [...props.products.data];
    productList.forEach((item) => {
      item.name = item.description.toUpperCase();
      item.value = item.description.toUpperCase();
      item.label = item.description.toUpperCase();
      item.categoryType = "description";
    });
    isProductListDone = true;
    props.resetListProducts();
  }
  console.log("[props.Stocks]", props.stocks);
  if (props.stocks && props.stocks.status === ACTION_STATUSES.SUCCEED) {
    stockList = [...props.stocks.data];
    stockList.forEach((item) => {
      item.name = `${item.description.toUpperCase()} (${item.vendor})`;
      item.value = item.name;
      item.label = item.name;
      item.categoryType = "stock";
    });
    isStockListDone = true;
    props.resetListStocks();
  }
  console.log(
    "[props.distributions]",
    props.distributions,
    isProductListDone,
    productList
  );
  if (props.proofs && props.proofs.status === ACTION_STATUSES.SUCCEED) {
    console.log("[Proofs]", props.proofs);
    props.resetFetchProof();
  }
  if (
    isProductListDone &&
    isDistributionsCollection &&
    props.distributions &&
    props.distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.distributions.data;
    console.log("[DISTRIBUTION]", source);
    for (const src of source) {
      const prodDetails = productList.find((pr) => pr.id === src.productId);
      if (prodDetails) {
        src.shortDescription = prodDetails.short_description;
        src.size = prodDetails.size;
        src.flavor = prodDetails.flavor;
        src.vendor = prodDetails.vendor;
      }
    }
    if (source && source.length) {
      source = DistributionHandler.mapData(source);
    }

    const cols = DistributionHandler.columns().map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              disabled={
                cellProps.data.order_status &&
                cellProps.data.order_status.toLowerCase() !== "order"
                  ? false
                  : false
              }
              createFormHandler={createFormHandler}
              data={{ ...cellProps.data }}
            />
          ),
        };
      } else if (col.name === "record_id") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <DialogFunction
              currentItem={{ ...cellProps.data }}
              showProofHandler={showProofHandler}
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
    grandTotalHandler(source);
    setDataSource(source);
    isDistributionListDone = true;
    setIsDistributionsCollection(false);
  }
  console.log(
    "[Is Create Distribution Collection]",
    props.createDistributionState
  );
  if (
    isCreateDistributionCollection &&
    props.createDistributionState &&
    props.createDistributionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateDistributionCollection(false);

    // Removed auto-print - user can click "Print Supplies" button if needed
    console.log("Update Stock", forStockUpdates);
    showNotification("tc", "success", "Distribution successfully created.");

    props.updateStock(forStockUpdates);

    props.listDistributions({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile?.companyId,
    });
  }
  if (
    isProofCollection &&
    props.proofs &&
    props.proofs.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsProofCollection(false);
  }
  if (
    isUpdateDistributionCollection &&
    props.updateDistributionState &&
    props.updateDistributionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdateDistributionCollection(false);
    showNotification("tc", "success", "Distribution successfully updated.");

    props.updateStock(forStockUpdates);
    props.listDistributions({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile?.companyId,
    });
  }
  console.log(
    "[isDeleteDistribution]",
    isDeleteDistributionCollection,
    props.deleteDistributionState
  );
  if (
    isDeleteDistributionCollection &&
    props.deleteDistributionState &&
    props.deleteDistributionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsDeleteDistributionCollection(false);
    console.log("[delete distribution stock]", forStockUpdates);
    showNotification("tc", "success", "Distribution successfully deleted.");
    props.updateStock(forStockUpdates);

    props.listDistributions({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile?.companyId,
    });
  }
  if (
    props.updateStockState &&
    props.updateStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    props.listStocks({ companyId: context.userProfile?.companyId });
    props.resetUpdateStock();
  }
  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);

    props.listDistributions({
      from: dates.from,
      to: dates.to,
      companyId: context.userProfile?.companyId,
    });
  };

  const deleteRecordItemHandler = (id, data) => {
    forStockUpdates = [];
    console.log("[delete Distribution id]", id, data);
    const stock = stockList.find((s) => s.productId === data.productId);
    if (stock) {
      console.log("[delete distribution stock", stock);

      forStockUpdates.push({
        id: stock.id,
        companyId: context.userProfile?.companyId,
        qty_on_hand: Math.abs(
          parseInt(stock.qty_on_hand || 0, 10) + parseInt(data.order_qty, 10)
        ),
      });
    }
    // console.log("[ForStockUpdtes]", forStockUpdates);
    props.deleteDistribution(id);
  };

  const createMultiDistributionHandler = () => {
    const finalPayload = [];
    forStockUpdates = [];
    const groupId = uuidv4();
    console.log("[MULTI PATIENTS]", multiPatients);
    for (const multi of multiPatients) {
      const { general, details } = multi;
      const recordId = `${general.requestorName.substring(0, 2)}-${nanoid8()}`;
      for (const payload of details) {
        const params = {
          created_at: new Date(),
          description: payload.description,
          short_description: payload.shortDescription,
          productId: payload.productId,
          price_per_pcs: payload.price_per_pcs,
          category: payload.category,
          estimated_total_amt: parseFloat(
            parseFloat(payload.price_per_pcs) * parseInt(payload.orderQty, 10)
          ).toFixed(2),
          order_status: general.statusName,
          order_qty: payload.orderQty,
          order_at: general.orderDt,
          comments: general.comments,
          patientCd:
            general.patientCd || general.patient?.patientCd || undefined,

          delivery_location: general.facility,
          requestor: general.requestorName,
          requestor_id: general.requestorId,
          patient_caregiver: general.caregiver,
          patient_id: general.patientId || 0,
          stock_status: payload.stockStatus,
          group_id: groupId,
          companyId: context.userProfile.companyId,
          record_id: recordId.toUpperCase(),
          unit_uom: payload.unitDistribution,
        };

        const stock = stockList.find((s) => s.productId === payload.productId);
        if (stock) {
          let qty = parseInt(payload.orderQty, 10);
          const balance = parseInt(stock.qty_on_hand, 10) - parseInt(qty, 10);
          forStockUpdates.push({
            id: stock.id,
            companyId: context.userProfile?.companyId,
            qty_on_hand: balance < 1 ? 0 : balance,
          });
        }
        console.log("[params]", params);
        finalPayload.push(params);
      }
    }
    dataSource.forEach((e) => (e.isChecked = false));
    console.log("[final payload]", finalPayload, forStockUpdates);
    props.createDistribution(finalPayload);
  };
  const manageTemplateHandler = (general, details, mode) => {
    if (details && details.length) {
      const params = {
        created_at: new Date(),
        name: general.templateName,
        details: {
          products: [...details].map((map) => ({
            productId: map.productId,
            qty: parseInt(map.orderQty || 0, 10),
          })),
        },
      };
      if (general.templateId) {
        params.id = general.templateId;
      }

      params.companyId = context.userProfile?.companyId;
      params.updatedUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };

      console.log("[params[", params);
      if (general.templateId) {
        props.updateTemplate(params);
      } else {
        params.created_at = new Date();
        params.createdUser = {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        };
        props.createTemplate(params);
      }
    }
  };
  const openPdfDialogHandler = (generalForm, detailForm) => {
    setPdfDialogData({
      patientName: generalForm.patientCd || generalForm.patientName || "",
      location: generalForm.facility || "",
      datePickup: moment().format("YYYY-MM-DD"),
      generalForm: generalForm,
      detailForm: detailForm,
    });
    setIsPdfDialogOpen(true);
  };

  const createDistributionHandler = (general, details, mode) => {
    multiPatients = [];
    mainGeneral = general;
    mainDetails = details;
    console.log("[Create Distribution Handler]", general, details, mode);

    const finalPayload = [];
    forStockUpdates = [];
    const groupId = uuidv4();
    const recordId = `${general.requestorName.substring(0, 2)}-${nanoid8()}`;
    for (const payload of details) {
      const params = {
        created_at: new Date(),
        description: payload.description,
        short_description:
          payload.short_description || payload.shortDescription,
        productId: payload.productId,
        price_per_pcs: payload.price_per_pcs,
        category: payload.category,
        subCategory: payload.subCategory,
        category_id: payload.category_id || payload.categoryId,
        subCategory_id: payload.subCategory_id || payload.subCategoryId,
        estimated_total_amt: parseFloat(
          parseFloat(payload.price_per_pcs) * parseInt(payload.orderQty, 10)
        ).toFixed(2),
        order_status: general.statusName,
        order_qty: payload.orderQty,
        order_at: general.orderDt,
        comments: payload.comments,
        patientCd: general.patientCd,
        delivery_location: general.facility,
        requestor: general.requestorName,
        requestor_id: general.requestorId || general.requestor_id,
        requestor_position: general.position,
        patient_caregiver: general.caregiver,
        patient_id: general.patientId || 0,
        stock_status: payload.stockStatus,
        group_id: groupId,
        unit_uom: payload.unitDistribution,
      };
      if (mode === "edit" && payload.distributionId) {
        params.id = payload.distributionId;
      }
      const stock = stockList.find((s) => s.productId === payload.productId);
      if (stock) {
        let qty = parseInt(payload.orderQty, 10);
        if (mode === "edit") {
          qty = parseInt(payload.adjustedQty, 10);
        }
        const balance = parseInt(stock.qty_on_hand, 10) - parseInt(qty, 10);
        forStockUpdates.push({
          id: stock.id,
          companyId: context.userProfile?.companyId,
          qty_on_hand: balance < 1 ? 0 : balance,
        });
      }
      console.log("[params]", params);
      params.companyId = context.userProfile?.companyId;
      params.updatedUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };

      if (mode === "create") {
        params.created_at = new Date();
        params.createdUser = {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        };
        params.record_id = recordId.toUpperCase();
      }
      finalPayload.push(params);
    }

    singlePrintProcessHandler(general, details);

    console.log("[For Stock Updates]", forStockUpdates);
    if (mode === "create") {
      console.log("[final payload]", finalPayload);
      props.createDistribution(finalPayload);
    } else if (mode === "edit") {
      console.log("[Final Payload]", finalPayload);
      props.updateDistribution(finalPayload);
    }
    setIsFormModal(false);
  };
  console.log(
    "[Is Create Distribution Collection]",
    props.createDistributionState
  );

  const filterRecordHandler = (keyword, categoryFilter = selectedCategoryFilter) => {
    console.log("[Keyword]", keyword, "[Category Filter]", categoryFilter);
    let temp = [...originalSource];

    // Filter by keyword
    if (keyword) {
      temp = temp.filter(
        (data) =>
          data.description.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1 ||
          data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          data.requestor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    }

    // Filter by category
    if (categoryFilter) {
      temp = temp.filter(
        (data) =>
          data.category &&
          data.category.toLowerCase() === categoryFilter.name.toLowerCase()
      );
    }

    grandTotalHandler(temp);
    setDataSource(temp);
  };

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoryFilter(category);
    filterRecordHandler("", category);
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    const dtSource = [...dataSource];
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
    grandTotalHandler(dtSource);
    setDataSource(dtSource);
  };

  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `distribution_list_batch_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
    }
  };
  const closePrintFormHandler = () => {
    dataSource.forEach((data) => (data.isChecked = false));
    props.listDistributions({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile?.companyId,
    });
    setIsAddGroupButtons(false);
    setIsPrintForm(false);
  };
  const changeStatusHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeChangeStatusMenuHandler = () => {
    setAnchorEl(null);
  };

  const templateHandler = (event) => {
    setTemplateAnchorEl(event.currentTarget);
  };
  const closeTemplateMenuHandler = () => {
    setTemplateAnchorEl(null);
  };

  const updateStatusHandler = (status) => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    console.log("[selected Data Status]", selectedData, status);
    const forUpdateStatus = [];
    selectedData.forEach((sel) => {
      forUpdateStatus.push({
        id: sel.id,
        order_status: status,
        companyId: context.userProfile?.companyId,
      });
    });
    props.updateDistribution(forUpdateStatus);
    setAnchorEl(null);
  };
  const deleteTemplateHandler = (id) => {
    console.log("[Delete Template]", id);
    props.deleteTemplate(id);
  };
  const createOrderHandler = () => {
    setModule("multiple");
    const selectedData = dataSource.filter((r) => r.isChecked);
    console.log("[Selected Data]", selectedData);
    const generalData = {};
    const detailsData = [];
    selectedData.forEach((ea, indx) => {
      generalData.patient = patientList.find((p) => p.id === ea.patient_id);
      if (ea.requestor_id) {
        generalData.requestor = employeeList.find(
          (e) => e.id === ea.requestor_id
        );
      } else if (ea.requestor) {
        generalData.requestor = employeeList.find(
          (e) => e.name && e.name.toUpperCase() === ea.requestor.toUpperCase()
        );
      }
      generalData.requestorName = ea.requestor;
      const prod = productList.find((p) => p.id === ea.productId);

      detailsData.push({
        search: { ...prod },
        ...prod,
        orderQty: ea.order_qty,
        comments: ea.comments,
        productId: ea.productId,
        unitDistribution:
          prod.unit_distribution || prod.unitDistribution || ea.unit_uom,
      });
    });
    setGeneralForm(generalData);
    setDetailForm(detailsData);
    setMode("create");
    setIsFormModal(true);
  };
  console.log(
    "[DONE]",
    isTemplateListDone,
    isTemplateListDone,
    isEmployeeListDone,
    isStockListDone,
    isPatientListDone,
    isProductListDone,
    isDistributionListDone,
    isCategoryListDone
  );
  if (
    isTemplateListDone &&
    isEmployeeListDone &&
    isStockListDone &&
    isPatientListDone &&
    isProductListDone &&
    isDistributionListDone &&
    isCategoryListDone
  ) {
    isAllFetchDone = true;
  }
  const singlePrintProcessHandler = (general, details) => {
    console.log("[Single Print]", general, details);
    multiPatients = [];
    let generalData = {};
    let detailsData = [];
    let maxCnt = 1;
    for (const ea of details) {
      if (maxCnt % (LIMIT_ITEM_PRINT + 1) === 0) {
        multiPatients.push({
          general: generalData,
          details: detailsData,
        });
        generalData = {};
        detailsData = [];
      }
      generalData.patient = general.patient;
      generalData.patientName = general.patientName;
      generalData.facility = general.patient
        ? general.patient.place_of_service
        : "";
      generalData.requestor = general.requestor;
      generalData.requestorName = ea.requestorName;
      const prod = productList.find((p) => p.id === ea.productId);
      detailsData.push({
        search: { ...prod },
        ...prod,
        orderQty: ea.orderQty || ea.order_qty,
        comments: ea.commemnts,
        productId: ea.productId,
        unitDistribution:
          prod.unit_distribution || prod.unitDistribution || ea.unit_uom,
      });
      maxCnt++;
    }
    multiPatients.push({
      general: generalData,
      details: detailsData,
    });
  };
  const printPatientOrdersHandler = async (general, details) => {
    try {
      setIsFormModal(false);

      // Map details to the format expected by PrintOrdersPdfDocument
      const selectedData = details.map((item) => ({
        productId: item.productId || item.product?.id,
        order_qty: item.orderQty || item.order_qty,
        comments: item.comments || "",
        unit_uom: item.unitUom || item.unit_uom,
        requestor: general.requestorName || general.requestor?.name || "",
        requestor_id: general.requestorId || general.requestor?.id,
        delivery_location: general.facility || "",
        patient_id: general.patientId || general.patient?.id,
      }));

      // Load logo
      let logoBase64 = null;
      try {
        const logoUrl =
          "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
        logoBase64 = await Helper.getImageBase64(logoUrl);
      } catch (logoError) {
        console.error("Failed to load logo:", logoError);
      }

      // Generate PDF
      const doc = (
        <PrintOrdersPdfDocument
          patientName={general.patientCd || general.patientName || ""}
          selectedData={selectedData}
          productList={productList}
          location={general.facility || ""}
          datePickup={moment().format("YYYY-MM-DD")}
          logoBase64={logoBase64}
          employeeList={employeeList}
        />
      );

      const asPdf = pdf(doc);
      const pdfBlob = await asPdf.toBlob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      showNotification("tc", "success", "PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification(
        "tc",
        "danger",
        "Failed to generate PDF. Please try again."
      );
    }
  };
  const printAllOrdersHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    console.log("[Selected Data]", selectedData);

    multiPatients = [];
    let patientIds = selectedData.map((map) => map.patient_id);
    console.log("[patientIds]", patientIds);
    patientIds = Array.from(new Set(patientIds));
    console.log("[patientIds2]", patientIds);
    for (const pId of patientIds) {
      const patientData = selectedData.filter((sel) => sel.patient_id === pId);
      let generalData = {};
      let detailsData = [];
      let maxCnt = 1;
      for (const ea of patientData) {
        if (maxCnt % (LIMIT_ITEM_PRINT + 1) === 0) {
          multiPatients.push({
            general: generalData,
            details: detailsData,
          });
          generalData = {};
          detailsData = [];
        }
        generalData.patient = patientList.find((p) => p.id === ea.patient_id);
        generalData.patientName = generalData.patient
          ? generalData.patient.name
          : "";
        generalData.facility = generalData.patient
          ? generalData.patient.place_of_service
          : "";
        if (ea.requestor_id) {
          generalData.requestor = employeeList.find(
            (e) => e.id === ea.requestor_id
          );
        } else if (ea.requestor) {
          generalData.requestor = employeeList.find(
            (e) => e.name && e.name.toUpperCase() === ea.requestor.toUpperCase()
          );
        }
        generalData.requestorName = ea.requestor;
        const prod = productList.find((p) => p.id === ea.productId);
        detailsData.push({
          search: { ...prod },
          ...prod,
          orderQty: ea.order_qty,
          productId: ea.productId,
          comments: ea.comments,
          unitDistribution:
            prod.unit_distribution || prod.unitDistribution || ea.unit_uom,
        });
        maxCnt++;
      }
      multiPatients.push({
        general: generalData,
        details: detailsData,
      });
    }

    // Removed - printAllOrdersHandler is deprecated, use Print Orders button instead
  };
  const copyAllHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    console.log("[Selected Data]", selectedData);

    multiPatients = [];
    let patientIds = selectedData.map((map) => map.patient_id);
    console.log("[patientIds]", patientIds);
    patientIds = Array.from(new Set(patientIds));
    console.log("[patientIds2]", patientIds);
    for (const pId of patientIds) {
      const patientStatus = patientList.find((patient) => patient.id === pId);
      if (patientStatus.status === "Active") {
        // only active patient to be distributed
        const patientData = selectedData.filter(
          (sel) => sel.patient_id === pId
        );
        let generalData = {};
        let detailsData = [];

        for (const ea of patientData) {
          generalData.patient = patientList.find((p) => p.id === ea.patient_id);
          generalData.patientId = ea.patient_id;
          generalData.patientName = generalData.patient
            ? generalData.patient.name
            : "";
          generalData.facility = generalData.patient
            ? generalData.patient.place_of_service
            : "";
          if (ea.requestor_id) {
            generalData.requestorId = ea.requestor_id;
            generalData.requestor = employeeList.find(
              (e) => e.id === ea.requestor_id
            );
          } else if (ea.requestor) {
            generalData.requestor = employeeList.find(
              (e) =>
                e.name && e.name.toUpperCase() === ea.requestor.toUpperCase()
            );
            generalData.requestorId = generalData.requestor.id;
          }
          generalData.orderDt = new Date();
          generalData.requestorName = ea.requestor;
          const prod = productList.find((p) => p.id === ea.productId);
          detailsData.push({
            search: { ...prod },
            ...prod,
            orderQty: ea.order_qty,
            comments: ea.comments,
            productId: ea.productId,
            unitDistribution:
              prod.unit_distribution || prod.unitDistribution || ea.unit_uom,
          });
        }
        multiPatients.push({
          general: generalData,
          details: detailsData,
        });
      }
    }
    createMultiDistributionHandler();
  };
  const useTemplateHandler = (details) => {
    console.log("[Use Template handler]", details);
    setModule("multiple");
    const generalData = {};
    const detailsData = [];
    details.forEach((ea) => {
      generalData.patient = {
        name: "-",
        value: "-",
        place_of_service: "-",
      };
      generalData.requestor = { title: "-", name: "-", position: "-" };
      generalData.requestorName = "";
      const prod = productList.find((p) => p.id === ea.productId);

      detailsData.push({
        search: { ...prod },
        ...prod,
        orderQty: parseInt(ea.orderQty || 0, 10),
        comments: ea.comments,
        productId: ea.productId,
        unitDistribution:
          prod.unit_distribution || prod.unitDistribution || ea.unit_uom,
      });
    });
    setGeneralForm(generalData);
    setDetailForm(detailsData);
    setMode("create");
    setIsTemplateFormModal(false);
    setIsFormModal(true);
  };
  const addEditTemplateHandler = () => {
    setTemplateAnchorEl(undefined);
    setIsTemplateFormModal(true);
  };
  if (
    isCreateTemplateCollection &&
    props.createTemplateState &&
    props.createTemplateState.status === ACTION_STATUSES.SUCCEED
  ) {
    isTemplateListDone = false;
    setIsCreateTemplateCollection(false);
    props.listTemplates({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateTemplateCollection &&
    props.updateTemplateState &&
    props.updateTemplateState.status === ACTION_STATUSES.SUCCEED
  ) {
    isTemplateListDone = false;
    setIsUpdateTemplateCollection(false);
    props.listTemplates({ companyId: context.userProfile?.companyId });
  }
  if (
    isDeleteTemplateCollection &&
    props.deleteTemplateState &&
    props.deleteTemplateState.status === ACTION_STATUSES.SUCCEED
  ) {
    isTemplateListDone = false;
    setIsDeleteTemplateCollection(false);
    props.listTemplates({ companyId: context.userProfile?.companyId });
  }
  const onCloseProofHandler = () => {
    setIsShowProof(false);
  };

  const handlePrintOrdersClick = () => {
    // Get selected data to populate defaults
    const selectedData = dataSource.filter((r) => r.isChecked);

    if (selectedData && selectedData.length > 0) {
      const firstItem = selectedData[0];

      // Default patient name from patient_id
      const patient = patientList.find((p) => p.id === firstItem.patient_id);

      if (patient) {
        const patientName = patient.cd || patient.name || "";
        const location =
          patient.careType ||
          patient.place_of_service ||
          patient.placeOfService ||
          firstItem.delivery_location ||
          "";

        setPrintOrdersPatientName(patientName);
        setPrintOrdersLocation(location);
      }

      // Set requestor from first selected item
      if (firstItem.requestor_id) {
        const requestorEmployee = employeeList.find((e) => e.id === firstItem.requestor_id);
        if (requestorEmployee) {
          setPrintOrdersRequestor({
            ...requestorEmployee,
            label: requestorEmployee.name || "",
            value: requestorEmployee.name || "",
            categoryType: "employee"
          });
        }
      } else if (firstItem.requestor) {
        // Fallback: try to find by name if ID not available
        const requestorEmployee = employeeList.find((e) => e.name === firstItem.requestor);
        if (requestorEmployee) {
          setPrintOrdersRequestor({
            ...requestorEmployee,
            label: requestorEmployee.name || "",
            value: requestorEmployee.name || "",
            categoryType: "employee"
          });
        }
      } else {
        // If no requestor in first item, default to current user
        const currentUser = employeeList.find((e) => e.id === context.userProfile?.id);
        if (currentUser) {
          setPrintOrdersRequestor({
            ...currentUser,
            label: currentUser.name || "",
            value: currentUser.name || "",
            categoryType: "employee"
          });
        }
      }
    }

    setIsPrintOrdersDialogOpen(true);
  };

  const handlePrintOrdersCancel = () => {
    setIsPrintOrdersDialogOpen(false);
    setPrintOrdersPatientName("");
    setPrintOrdersLocation("");
    setPrintOrdersDatePickup(moment().format("YYYY-MM-DD"));
    setPrintOrdersRequestor(null);
  };

  const handlePrintOrdersGenerate = async () => {
    if (!printOrdersPatientName.trim()) {
      showNotification("tc", "warning", "Please enter patient name");
      return;
    }

    if (!printOrdersRequestor) {
      showNotification("tc", "warning", "Please select a requestor");
      return;
    }

    try {
      const selectedData = dataSource.filter((r) => r.isChecked);

      if (!selectedData || selectedData.length === 0) {
        showNotification("tc", "warning", "Please select at least one item");
        return;
      }

      // Update requestor for all selected records
      const updatePromises = selectedData.map((record) => {
        return props.updateDistribution({
          id: record.id,
          requestor: printOrdersRequestor.name,
          requestor_id: printOrdersRequestor.id,
          requestor_position: printOrdersRequestor.position,
          companyId: context.userProfile?.companyId,
        });
      });

      await Promise.all(updatePromises);

      // Refresh the distribution list to show updated requestor
      props.listDistributions({ companyId: context.userProfile?.companyId });

      // Update selected data with new requestor for PDF generation
      const updatedSelectedData = selectedData.map((record) => ({
        ...record,
        requestor: printOrdersRequestor.name,
        requestor_id: printOrdersRequestor.id,
        requestor_position: printOrdersRequestor.position,
      }));

      setIsPrintOrdersDialogOpen(false);

      // Fetch and convert logo to base64 using Helper
      let logoBase64 = null;
      try {
        const logoUrl =
          "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
        logoBase64 = await Helper.getImageBase64(logoUrl); // Returns full data URI
        console.log(
          "Logo loaded successfully:",
          logoBase64 ? logoBase64.substring(0, 50) + "..." : "Failed"
        );
      } catch (logoError) {
        console.error("Failed to load logo:", logoError);
      }

      const doc = (
        <PrintOrdersPdfDocument
          patientName={printOrdersPatientName}
          selectedData={updatedSelectedData}
          productList={productList}
          location={printOrdersLocation}
          datePickup={printOrdersDatePickup}
          logoBase64={logoBase64}
          employeeList={employeeList}
        />
      );

      const asPdf = pdf(doc);
      const pdfBlob = await asPdf.toBlob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      setPrintOrdersPatientName("");
      setPrintOrdersLocation("");
      setPrintOrdersDatePickup(moment().format("YYYY-MM-DD"));
      setPrintOrdersRequestor(null);
      showNotification("tc", "success", "PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification(
        "tc",
        "danger",
        "Failed to generate PDF. Please try again."
      );
    }
  };

  console.log("[Create Template]", props.createTemplateState);
  return (
    <React.Fragment>
      {!isAllFetchDone && (
        <div align="center" style={{ paddingTop: "100px" }}>
          <br />
          <CircularProgress />
          &nbsp;<span>Loading</span>...
        </div>
      )}
      {isAllFetchDone && (
        <GridContainer>
          {tc && (
            <div style={{ paddingTop: 10 }}>
              <Snackbar
                place="tc"
                color={color}
                icon={AddAlert}
                message={message}
                open={tc}
                closeNotification={() => setTC(false)}
                close
              />
            </div>
          )}
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="rose">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* Left side: Select */}
                  <div style={{ flex: "0 0 90%" }}>
                    <h4 className={classes.cardTitleWhite}>
                      Distribution Management
                    </h4>
                  </div>
                  <div align="right" style={{ flex: "0 0 10%" }}>
                    <h4
                      className={classes.cardTitleWhite}
                    >{`$${grandTotal}`}</h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ paddingLeft: 20 }}>
                  <GridItem md={9} sm={12} xs={12}>
                    <FilterTable
                      filterRecordHandler={filterRecordHandler}
                      filterByDateHandler={filterByDateHandler}
                    />
                  </GridItem>
                  <GridItem md={3} sm={12} xs={12}>
                    <CustomSingleAutoComplete
                      id="category-filter"
                      placeholder="Filter by Category"
                      label="Filter by Category"
                      name="categoryFilter"
                      options={categoryList}
                      value={selectedCategoryFilter}
                      onSelectHandler={handleCategoryFilterChange}
                      onChangeHandler={(e) => {
                        if (!e.target.value) {
                          setSelectedCategoryFilter(null);
                          filterRecordHandler("", null);
                        }
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ paddingLeft: 20, paddingTop: 10 }}>
                  <GridItem md={12} sm={12} xs={12}>
                    <Button
                      variant="contained"
                      color="rose"
                      startIcon={<CalendarToday />}
                      onClick={() => setIsCalendarModalOpen(true)}
                    >
                      Calendar View - Medical/Incontinence
                    </Button>
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ paddingLeft: 14 }}>
                  <GridItem md={12} sm={12} xs={12}>
                    <Button
                      color="info"
                      className={classes.marginRight}
                      onClick={() => createFormHandler()}
                    >
                      <AddIcon className={classes.icons} /> Add Distribution
                    </Button>

                    <Button
                      onClick={() => addEditTemplateHandler()}
                      color="success"
                      className={classes.marginRight}
                    >
                      <Settings className={classes.icons} /> Manage Template
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={templateAnchorEl}
                      keepMounted
                      open={Boolean(templateAnchorEl)}
                      onClose={closeTemplateMenuHandler}
                    >
                      <MenuItem onClick={() => addEditTemplateHandler()}>
                        Add/Edit Template
                      </MenuItem>
                      <MenuItem>Use Template</MenuItem>
                    </Menu>
                    {isAddGroupButtons && (
                      <>
                        <Button
                          color="success"
                          onClick={() => exportToExcelHandler()}
                          className={classes.marginRight}
                        >
                          <UploadIcon className={classes.icons} /> Export Excel
                        </Button>

                        <Tooltip title={"Limit to 16 records"}>
                          <Button
                            onClick={() => createOrderHandler()}
                            color="success"
                            className={classes.marginRight}
                          >
                            <AddIcon className={classes.icons} /> Add Multiple
                            Orders
                          </Button>
                        </Tooltip>
                        {/* not needed 
                        <Tooltip title={"Reprint"}>
                          <Button
                            onClick={() => createOrderHandler()}
                            color="success"
                            className={classes.marginRight}
                          >
                            <PrintIcon className={classes.icons} /> Print All
                          </Button>
                        </Tooltip>
                      */}
                        <Tooltip title={"Generate PDF with patient name"}>
                          <Button
                            onClick={handlePrintOrdersClick}
                            color="success"
                            className={classes.marginRight}
                          >
                            <PrintIcon className={classes.icons} /> Print Orders
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Create same data"}>
                          <Button
                            onClick={() => copyAllHandler()}
                            color="success"
                            className={classes.marginRight}
                          >
                            <CopyIcon className={classes.icons} /> Copy Data
                          </Button>
                        </Tooltip>
                        <Button
                          onClick={(e) => changeStatusHandler(e)}
                          color="success"
                          className={classes.marginRight}
                        >
                          <EditIcon className={classes.icons} /> Change Status
                        </Button>

                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={closeChangeStatusMenuHandler}
                        >
                          {SUPPLY_STATUS.map((map) => {
                            return (
                              <MenuItem
                                onClick={() => updateStatusHandler(map)}
                              >
                                {map}
                              </MenuItem>
                            );
                          })}
                        </Menu>
                      </>
                    )}
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ paddingLeft: 16, paddingRight: 20 }}>
                  <GridItem md={12} sm={12} xs={12}>
                    <HospiceTable
                      main={true}
                      height={400}
                      onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                      columns={columns}
                      dataSource={dataSource}
                    />
                  </GridItem>
                </GridContainer>
                {isShowProof && (
                  <DialogProof
                    open={isShowProof}
                    onClose={onCloseProofHandler}
                    currentItem={proofItem}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}

      {isFormModal && (
        <Form
          module={module}
          printPatientOrdersHandler={printPatientOrdersHandler}
          filterRecordHandler={filterRecordHandler}
          generalInfo={generalForm}
          detailInfo={detailForm}
          employeeList={employeeList}
          patientList={patientList}
          productList={productList}
          stockList={stockList}
          categoryList={categoryList}
          createDistributionHandler={createDistributionHandler}
          openPdfDialogHandler={openPdfDialogHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
          onClose={closeFormModalHandler}
        />
      )}
      {isTemplateFormModal && (
        <TemplateForm
          useTemplateHandler={useTemplateHandler}
          deleteTemplateHandler={deleteTemplateHandler}
          templateList={templateList}
          manageTemplateHandler={manageTemplateHandler}
          filterRecordHandler={filterRecordHandler}
          generalInfo={generalForm}
          detailInfo={detailForm}
          employeeList={employeeList}
          patientList={patientList}
          productList={productList}
          stockList={stockList}
          createDistributionHandler={createDistributionHandler}
          mode={mode}
          isOpen={isTemplateFormModal}
          isEdit={false}
          item={item}
          onClose={closeTemplateFormModalHandler}
        />
      )}
      {/* PrintForm removed - now using direct PDF generation */}

      {/* Calendar Modal */}
      <DistributionCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        distributions={dataSource}
      />

      {/* Print Orders Dialog */}
      <Dialog
        open={isPrintOrdersDialogOpen}
        onClose={handlePrintOrdersCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Details for Print Orders</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                label="Patient Name"
                type="text"
                value={printOrdersPatientName}
                onChange={(e) => setPrintOrdersPatientName(e.target.value)}
                fullWidth
                autoFocus
                placeholder="Enter patient name"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                type="text"
                value={printOrdersLocation}
                onChange={(e) => setPrintOrdersLocation(e.target.value)}
                fullWidth
                placeholder="Enter location/facility"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Pickup"
                type="date"
                value={printOrdersDatePickup}
                onChange={(e) => setPrintOrdersDatePickup(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSingleAutoComplete
                name="requestor"
                placeholder="Requestor"
                label="Requestor (Required)"
                value={printOrdersRequestor}
                onSelectHandler={(item) => {
                  setPrintOrdersRequestor(item);
                }}
                onChangeHandler={(e) => {
                  if (!e.target.value) {
                    setPrintOrdersRequestor(null);
                  }
                }}
                options={employeeList.map(emp => ({
                  ...emp,
                  label: emp.name || "",
                  value: emp.name || "",
                  categoryType: "employee"
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrintOrdersCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePrintOrdersGenerate}
            color="primary"
            variant="contained"
            startIcon={<PrintIcon />}
          >
            Generate PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Dialog for Form Save/Print Supplies */}
      <Dialog
        open={isPdfDialogOpen}
        onClose={() => setIsPdfDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate PDF</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                label="Patient Name"
                type="text"
                value={pdfDialogData.patientName}
                onChange={(e) =>
                  setPdfDialogData({ ...pdfDialogData, patientName: e.target.value })
                }
                fullWidth
                autoFocus
                placeholder="Enter patient name"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                type="text"
                value={pdfDialogData.location}
                onChange={(e) =>
                  setPdfDialogData({ ...pdfDialogData, location: e.target.value })
                }
                fullWidth
                placeholder="Enter location/facility"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date Pickup"
                type="date"
                value={pdfDialogData.datePickup}
                onChange={(e) =>
                  setPdfDialogData({ ...pdfDialogData, datePickup: e.target.value })
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPdfDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!pdfDialogData.patientName.trim()) {
                TOAST.error("Please enter patient name");
                return;
              }

              try {
                setIsPdfDialogOpen(false);

                const general = pdfDialogData.generalForm || {};
                const details = pdfDialogData.detailForm || [];

                // Map details to the format expected by PrintOrdersPdfDocument
                const selectedData = details.map((item) => ({
                  productId: item.productId || item.product?.id,
                  order_qty: item.orderQty || item.order_qty,
                  comments: item.comments || "",
                  unit_uom: item.unitUom || item.unit_uom,
                  requestor: general.requestorName || general.requestor?.name || "",
                  requestor_id: general.requestorId || general.requestor?.id,
                  delivery_location: general.facility || "",
                  patient_id: general.patientId || general.patient?.id,
                }));

                // Load logo
                let logoBase64 = null;
                try {
                  const logoUrl =
                    "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
                  logoBase64 = await Helper.getImageBase64(logoUrl);
                } catch (logoError) {
                  console.error("Failed to load logo:", logoError);
                }

                // Generate PDF
                const doc = (
                  <PrintOrdersPdfDocument
                    patientName={pdfDialogData.patientName}
                    selectedData={selectedData}
                    productList={productList}
                    location={pdfDialogData.location}
                    datePickup={pdfDialogData.datePickup}
                    logoBase64={logoBase64}
                    employeeList={employeeList}
                  />
                );

                const asPdf = pdf(doc);
                const pdfBlob = await asPdf.toBlob();
                const url = URL.createObjectURL(pdfBlob);
                window.open(url, "_blank");

                TOAST.success("PDF generated successfully");
              } catch (error) {
                console.error("Error generating PDF:", error);
                TOAST.error("Failed to generate PDF");
              }
            }}
            color="primary"
            variant="contained"
            startIcon={<PrintIcon />}
          >
            Generate PDF
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  stocks: stockListStateSelector(store),
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  templates: templateListStateSelector(store),
  categories: categoryListStateSelector(store),
  distributions: distributionListStateSelector(store),
  createDistributionState: distributionCreateStateSelector(store),
  updateDistributionState: distributionUpdateStateSelector(store),
  updateTemplateState: templateUpdateStateSelector(store),
  deleteDistributionState: distributionDeleteStateSelector(store),
  updateStockState: stockUpdateStateSelector(store),
  createTemplateState: templateCreateStateSelector(store),
  deleteTemplateState: templateDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
  proofs: proofListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  listStocks: (data) => dispatch(attemptToFetchStock(data)),
  resetListStocks: () => dispatch(resetFetchStockState()),
  listCategories: (data) => dispatch(attemptToFetchCategory(data)),
  resetListCategories: () => dispatch(resetFetchCategoryState()),
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistributions: () => dispatch(resetFetchDistributionState()),
  createDistribution: (data) => dispatch(attemptToCreateDistribution(data)),
  resetCreateDistribution: () => dispatch(resetCreateDistributionState()),
  updateDistribution: (data) => dispatch(attemptToUpdateDistribution(data)),
  resetUpdateDistribution: () => dispatch(resetUpdateDistributionState()),
  deleteDistribution: (data) => dispatch(attemptToDeleteDistribution(data)),
  resetDeleteDistribution: () => dispatch(resetDeleteDistributionState()),
  updateStock: (data) => dispatch(attemptToUpdateStock(data)),
  resetUpdateStock: () => dispatch(resetUpdateStockState()),
  createTemplate: (data) => dispatch(attemptToCreateTemplate(data)),
  resetCreateTemplate: () => dispatch(resetCreateTemplateState()),
  listTemplates: (data) => dispatch(attemptToFetchTemplate(data)),
  resetListTemplates: () => dispatch(resetFetchTemplateState()),
  updateTemplate: (data) => dispatch(attemptToUpdateTemplate(data)),
  resetUpdateTemplate: () => dispatch(resetUpdateTemplateState()),
  deleteTemplate: (data) => dispatch(attemptToDeleteTemplate(data)),
  resetDeleteTemplate: () => dispatch(resetDeleteTemplateState()),
  fetchProof: (data) => dispatch(attemptToFetchProof(data)),
  resetFetchProof: () => dispatch(resetFetchProofState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Distribution);

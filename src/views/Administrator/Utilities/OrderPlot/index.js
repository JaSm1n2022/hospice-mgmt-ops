import {
  CircularProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Card, Grid } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CardBody from "components/Card/CardBody";

import CustomDatePicker from "components/Date/CustomDatePicker";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { resetFetchDistributionState } from "store/actions/distributionAction";
import { attemptToFetchDistribution } from "store/actions/distributionAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { setFetchProductFailure } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchStockState } from "store/actions/stockAction";
import { attemptToFetchStock } from "store/actions/stockAction";
import { resetFetchTransactionState } from "store/actions/transactionAction";
import { attemptToFetchTransaction } from "store/actions/transactionAction";
import { distributionListStateSelector } from "store/selectors/distributionSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { productListStateSelector } from "store/selectors/productSelector";
import { stockListStateSelector } from "store/selectors/stockSelector";
import { transactionListStateSelector } from "store/selectors/transactionSelector";

import { DEFAULT_ITEM } from "utils/constants";
import { DATE_TYPE_SELECTION } from "utils/constants";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";
import SupplyPlot from "../components/SupplyPlot";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { el } from "date-fns/locale";
import { PRODUCT_CATEGORIES } from "utils/constants";

const productCategories = [...PRODUCT_CATEGORIES];

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  small: {
    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));

let isDistributionListDone = false;
let isPatientListDone = false;
let isTransactionDone = false;
let isProductListDone = false;
let isStockListDone = false;
let patientList = [];
let stockList = [];
let patientOptions = [];
let distributionList = [];
let numberActive = 0;
let numberInactive = 0;
let patientCnaList = [];
let userProfile = {};

let transactionDashboard = {
  name: "Invoice",
  expenses: 0,
  series: [0, 0],
  client: 0,
  office: 0,
};
let patientGrandTotal = 0.0;
let patientSupplyPlot = {};
let supplyPlot = [];
let patientDashboard = [
  {
    name: "",
    totalAmt: 0.0,
    series: [],
  },
];
let providerDashboard = [
  {
    name: "Provider",
    expenses: 0,
    series: [0, 0, 0],
    amazon: 0,
    medline: 0,
    mckesson: 0,
    other: 0,
  },
];
let productList = [];
let dateOptions = [];
let lastDateType = "";
let estimatedSupplyGrandTotal = {
  brief: parseFloat(0.0),
  underpad: parseFloat(0.0),
  underwear: parseFloat(0.0),
  glove: parseFloat(0.0),
  wipe: parseFloat(0.0),
  ensureVanilla: parseFloat(0.0),
  ensureChocolate: parseFloat(0.0),
  ensureStrawberry: parseFloat(0.0),
};

let plotSummary = {
  brief: [],
  underpad: [],
  underwear: [],
  glove: [],
  wipe: [],
  ensureVanilla: [],
  ensureChocolate: [],
  ensureStrawberry: [],
};

let unusedPlotSummary = {
  brief: [],
  underpad: [],
  underwear: [],
  glove: [],
  wipe: [],
  ensureVanilla: [],
  ensureChocolate: [],
  ensureStrawberry: [],
};
let transactionType = {
  amazon: 0,
  medline: 0,
  mckesson: 0,
  walmart: 0,
  others: 0,
};
let cardTransaction = [
  { 4344: { ...transactionType } },
  { 1937: { ...transactionType } },
];
let requestorDaily = [];
DATE_TYPE_SELECTION.forEach((c) => {
  dateOptions.push({ ...c, category: "date" });
});

const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
const OrderPlot = (props) => {
  const {
    listStocks,
    resetListStocks,
    stocks,
    listTransactions,
    listProducts,
    resetListProducts,
    products,
    resetlistTransactions,
    transactions,
    listPatients,
    listDistributions,
    resetListPatients,
    resetListDistribution,
    patients,
    distributions,
  } = props;
  const classes = useStyles();
  const [value, setValue] = useState("one");
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isDistributionCollection, setIsDistributionCollection] = useState(
    true
  );
  const [isTransactionCollection, setIsTransactionCollection] = useState(true);
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [dateFrom, setDateFrom] = useState(dates.from);
  const [dateTo, setDateTo] = useState(dates.to);
  const [dateSelected, setDateSelected] = useState(
    dateOptions.find((d) => d.value === "thisMonth")
  );
  const [isDateCustom, setIsDateCustom] = useState(false);
  const [plotView, setPlotView] = useState(undefined);
  const [isRefresh, setIsRefresh] = useState(false);
  const [product, setProduct] = useState(DEFAULT_ITEM);
  useEffect(() => {
    isDistributionListDone = false;
    isPatientListDone = false;
    isTransactionDone = false;
    isProductListDone = false;
    isStockListDone = false;
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      listStocks({ companyId: userProfile.companyId });
      listProducts({ companyId: userProfile.companyId });
      listPatients({ companyId: userProfile.companyId });
      listDistributions({
        from: dates.from,
        to: dates.to,
        companyId: userProfile.companyId,
      });
      isTransactionDone = true; // not needed
    }
    //  listTransactions({ from: dates.from, to: dates.to });
  }, []);

  useEffect(() => {
    if (!isPatientCollection && patients.status === ACTION_STATUSES.SUCCEED) {
      resetListPatients();
      setIsPatientCollection(true);
    }
    if (
      !isDistributionCollection &&
      distributions.status === ACTION_STATUSES.SUCCEED
    ) {
      resetListDistribution();
      setIsDistributionCollection(true);
    }
  }, [isPatientCollection, isDistributionCollection]);

  const sortByProductId = (data, attr) => {
    console.log("[data]", data);
    data.sort((a, b) => {
      const _a = a[attr] ? parseInt(a[attr]) : 0;
      const _b = b[attr] ? parseInt(b[attr]) : 0;
      if (_a < _b) {
        return -1;
      } else if (_a > _b) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log("[new Data]", data);
    return data;
  };
  const sortByName = (items) => {
    console.log("[items to sort]", items);
    items.sort((a, b) => {
      const tempA = a.name ? a.name.toUpperCase() : "";
      const tempB = b.name ? b.name.toUpperCase() : "";
      if (tempA < tempB) {
        return -1;
      }
      if (tempA > tempB) {
        return 1;
      }
      return 0;
    });
    console.log("[return me]", items);
    return items;
  };
  const sortByPatientStatus = (items) => {
    console.log("[items to sort]", items);
    items.sort((a, b) => {
      const tempA = !a.status ? "ACTIVE" : a.status.toUpperCase();
      const tempB = !b.status ? "ACTIVE" : b.status.toUpperCase();
      if (tempA < tempB) {
        return -1;
      }
      if (tempA > tempB) {
        return 1;
      }
      return 0;
    });
    console.log("[return me]", items);
    return items;
  };
  const setPatientProductHandler = (
    patient,
    briefs,
    underpads,
    underwears,
    wipes,
    gloves,
    ensureVanillas,
    ensureChocolates,
    ensureStrawberries
  ) => {
    console.log("[Patient Underpads]", underpads);
    const temp = {
      patientName: patient.patientCd,
      brief: {
        patientName: patient.patientCd,
        productId: briefs && briefs.length ? briefs[0].productId : "",
        product:
          briefs && briefs.length
            ? briefs[0].shortDescription || briefs[0].description
            : "",
        qty: briefs && briefs.length ? briefs[0].order_qty : 0,
        vendor: "",
        size: "",
      },
      underpad: {
        patientName: patient.patientCd,
        productId: underpads && underpads.length ? underpads[0].productId : "",
        product: underpads && underpads.length ? underpads[0].description : "",
        qty: underpads && underpads.length ? underpads[0].order_qty : 0,
        vendor: "",
        size: "",
      },
      underwear: {
        patientName: patient.patientCd,
        productId:
          underwears && underwears.length ? underwears[0].productId : "",
        product:
          underwears && underwears.length ? underwears[0].description : "",
        qty: underwears && underwears.length ? underwears[0].order_qty : 0,
        vendor: "",
        size: "",
      },
      wipe: {
        patientName: patient.patientCd,
        productId: wipes && wipes.length ? wipes[0].productId : "",
        product: wipes && wipes.length ? wipes[0].description : "",
        qty: wipes && wipes.length ? wipes[0].order_qty : 0,
        vendor: "",
        size: "",
      },
      glove: {
        patientName: patient.patientCd,
        productId: gloves && gloves.length ? gloves[0].productId : "",
        product: gloves && gloves.length ? gloves[0].description : "",
        qty: gloves && gloves.length ? gloves[0].order_qty : 0,
        vendor: "",
        size: "",
      },
      ensureVanilla: {
        patientName: patient.patientCd,
        productId:
          ensureVanillas && ensureVanillas.length
            ? ensureVanillas[0].productId
            : "",
        product:
          ensureVanillas && ensureVanillas.length
            ? ensureVanillas[0].description
            : "",
        qty:
          ensureVanillas && ensureVanillas.length
            ? ensureVanillas[0].order_qty
            : 0,
        vendor: "",
        size: "",
      },
      ensureChocolate: {
        patientName: patient.patientCd,
        productId:
          ensureChocolates && ensureChocolates.length
            ? ensureChocolates[0].productId
            : "",
        product:
          ensureChocolates && ensureChocolates.length
            ? ensureChocolates[0].description
            : "",
        qty:
          ensureChocolates && ensureChocolates.length
            ? ensureChocolates[0].order_qty
            : 0,
        vendor: "",
        size: "",
      },
      ensureStrawberry: {
        patientName: patient.patientCd,
        productId:
          ensureStrawberries && ensureStrawberries.length
            ? ensureStrawberries[0].productId
            : "",
        product:
          ensureStrawberries && ensureStrawberries.length
            ? ensureStrawberries[0].description
            : "",
        qty:
          ensureStrawberries && ensureStrawberries.length
            ? ensureStrawberries[0].order_qty
            : 0,
        vendor: "",
        size: "",
      },
    };
    if (
      temp.brief.productId &&
      [...productList].find((p) => p.id === temp.brief.productId)
    ) {
      const item = [...productList].find((p) => p.id === temp.brief.productId);
      temp.brief.vendor = item.vendor;
      temp.brief.size = item.size;

      temp.brief.unitPrice = item.unit_price;
      temp.brief.cnt = item.count;
      temp.brief.unitDist = item.unit_distribution;
      temp.brief.threshold = 40;
      const cna = briefs && briefs.length ? briefs[0] : {};
      temp.brief.requestor = cna.requestor;

      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.brief.threshold = 60;
      }
    }

    if (
      temp.underpad.productId &&
      [...productList].find((p) => p.id === temp.underpad.productId)
    ) {
      const item = [...productList].find(
        (p) => p.id === temp.underpad.productId
      );
      temp.underpad.vendor = item.vendor;
      temp.underpad.size = item.size;
      temp.underpad.unitPrice = item.unit_price;
      temp.underpad.cnt = item.count;
      temp.underpad.unitDist = item.unit_distribution;
      temp.underpad.threshold = 20; //item.count;
      const cna = underpads && underpads.length ? underpads[0] : [];
      temp.underpad.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.underpad.threshold = 30;
      }
    }

    if (
      temp.underwear.productId &&
      [...productList].find((p) => p.id === temp.underwear.productId)
    ) {
      const item = [...productList].find(
        (p) => p.id === temp.underwear.productId
      );
      temp.underwear.vendor = item.vendor;
      temp.underwear.size = item.size;
      temp.underwear.unitPrice = item.unit_price;
      temp.underwear.cnt = item.count;
      temp.underwear.unitDist = item.unit_distribution;
      temp.underwear.threshold = 40; //item.count;
      const cna = underwears && underwears.length ? underwears[0] : [];
      temp.underwear.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.underwear.threshold = 60;
      }
    }

    if (
      temp.wipe.productId &&
      [...productList].find((p) => p.id === temp.wipe.productId)
    ) {
      const item = [...productList].find((p) => p.id === temp.wipe.productId);
      temp.wipe.vendor = item.vendor;
      temp.wipe.size = item.size;
      temp.wipe.unitPrice = item.unit_price;
      temp.wipe.cnt = item.count;
      temp.wipe.unitDist = item.unit_distribution;
      temp.wipe.threshold = 2;
      const cna = wipes && wipes.length ? wipes[0] : [];
      temp.wipe.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.wipe.threshold = 3;
      }
    }
    if (
      temp.glove.productId &&
      [...productList].find((p) => p.id === temp.glove.productId)
    ) {
      const item = [...productList].find((p) => p.id === temp.glove.productId);
      temp.glove.vendor = item.vendor;
      temp.glove.size = item.size;
      temp.glove.unitPrice = item.unit_price;
      temp.glove.cnt = item.count;
      temp.glove.unitDist = item.unit_distribution;
      temp.glove.threshold = 1;
      const cna = gloves && gloves.length ? gloves[0] : [];
      temp.glove.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.glove.threshold = 2;
      }
    }
    if (
      temp.ensureVanilla.productId &&
      [...productList].find((p) => p.id === temp.ensureVanilla.productId)
    ) {
      const item = [...productList].find(
        (p) => p.id === temp.ensureVanilla.productId
      );
      temp.ensureVanilla.vendor = item.vendor;
      temp.ensureVanilla.size = item.size;
      temp.ensureVanilla.unitPrice = item.unit_price;
      temp.ensureVanilla.cnt = item.count;
      temp.ensureVanilla.unitDist = item.unit_distribution;
      temp.ensureVanilla.threshold = 7;
      const cna =
        ensureVanillas && ensureVanillas.length ? ensureVanillas[0] : [];
      temp.ensureVanilla.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.ensureVanilla.threshold = 7;
      }
    }

    if (
      temp.ensureChocolate.productId &&
      [...productList].find((p) => p.id === temp.ensureChocolate.productId)
    ) {
      const item = [...productList].find(
        (p) => p.id === temp.ensureChocolate.productId
      );
      temp.ensureChocolate.vendor = item.vendor;
      temp.ensureChocolate.size = item.size;
      temp.ensureChocolate.unitPrice = item.unit_price;
      temp.ensureChocolate.cnt = item.count;
      temp.ensureChocolate.unitDist = item.unit_distribution;
      temp.ensureChocolate.threshold = 7;
      const cna =
        ensureChocolates && ensureChocolates.length ? ensureChocolates[0] : [];
      temp.ensureChocolate.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.ensureChocolate.threshold = 7;
      }
    }

    if (
      temp.ensureStrawberry.productId &&
      [...productList].find((p) => p.id === temp.ensureStrawberry.productId)
    ) {
      const item = [...productList].find(
        (p) => p.id === temp.ensureStrawberry.productId
      );
      temp.ensureStrawberry.vendor = item.vendor;
      temp.ensureStrawberry.size = item.size;
      temp.ensureStrawberry.unitPrice = item.unit_price;
      temp.ensureStrawberry.cnt = item.count;
      temp.ensureStrawberry.unitDist = item.unit_distribution;
      temp.ensureStrawberry.threshold = 7;
      const cna =
        ensureStrawberries && ensureStrawberries.length
          ? ensureStrawberries[0]
          : [];
      temp.ensureStrawberry.requestor = cna.requestor;
      if (
        cna &&
        cna.requestor &&
        requestorDaily.includes(cna.requestor.toLowerCase())
      ) {
        temp.ensureStrawberry.threshold = 7;
      }
    }

    supplyPlot.push(temp);
  };
  const plotHandler = (source) => {
    console.log("[plots supplu]", supplyPlot);
    const newPlot = [];
    const plots = supplyPlot.map((map) => map[source]);
    console.log("[plots]", plots);
    for (const plot of plots) {
      if (plot.productId) {
        const tempStock = [...stockList];
        let currentStock = tempStock.find(
          (stk) => stk.productId === plot.productId
        );

        if (currentStock) {
          plot.currentStock =
            tempStock.find((stk) => stk.productId === plot.productId)
              .qty_on_hand || 0;
          plot.order = plot.threshold || plot.qty;
        } else {
          plot.currentStock = 0;
          plot.order = plot.threshold || plot.qty;
        }
        plot.newThreshold = plot.threshold;
        plot.uuid = uuidv4();
        newPlot.push(plot);
      }
    }
    console.log("[new Plot]", source, newPlot);
    //one by one
    //make data
    const ids = newPlot.map((m) => m.productId);
    const uIds = Array.from(new Set(ids));

    patientSupplyPlot[source] = newPlot;
    const adjustment = [];
    uIds.forEach((u) => {
      const sel = patientSupplyPlot[source].filter((n) => n.productId === u);

      sel.forEach((s, indx) => {
        s.itemNbr = indx;
        adjustment.push(s);
      });
    });
    patientSupplyPlot[source] = adjustment;
    uIds.forEach((u) => {
      const sel = patientSupplyPlot[source].filter((n) => n.productId === u);
      console.log(
        "[estimatedSupplyGrandTotal [sel]]",
        sel[0].product,
        source,
        sel[0].currentStock
      );
      let orders = 0;
      const stock = sel[0].currentStock;
      sel.forEach((e) => {
        orders += parseInt(e.order || 0);
      });

      if (orders > 0) {
        console.log(
          "[estimatedSupplyGrandTotal]",
          estimatedSupplyGrandTotal[source],
          source
        );
        const forOrder = parseInt(orders) - parseInt(stock);
        let cartonCnt =
          Math.ceil(parseFloat(forOrder / sel[0].cnt)) === 0
            ? 1
            : Math.ceil(parseFloat(forOrder / sel[0].cnt));
        cartonCnt = forOrder < 0 ? 0 : cartonCnt;
        estimatedSupplyGrandTotal[source] =
          parseFloat(estimatedSupplyGrandTotal[source]) +
          parseInt(cartonCnt) * sel[0].unitPrice;

        plotSummary[source].push({
          ...sel[0],
          stock,
          total: orders,
          carton: cartonCnt,
          amt: parseInt(cartonCnt) * sel[0].unitPrice,
        });
      }
    });
    const stocks = stockList.filter(
      (s) => s.category && s.category.toLowerCase() === source
    );
    stocks.forEach((b) => {
      if (!uIds.find((u) => u === b.productId)) {
        const pr = [...productList].find((p) => p.id === b.productId);
        if (pr) {
          const temp = {
            product: pr.description,
            shortDescription: pr.short_description,
            vendor: pr.vendor,
            size: pr.size,
            qty: b.qty_on_hand,
          };
          if (b.qty_on_hand > 0) {
            unusedPlotSummary[source].push(temp);
          }
        }
      }
    });
    setIsRefresh(!isRefresh);
  };

  if (props.stocks && props.stocks.status === ACTION_STATUSES.SUCCEED) {
    stockList = [...props.stocks.data];

    isStockListDone = true;
    props.resetListStocks();
  }
  console.log("[Products[", products);
  if (products && products.status === ACTION_STATUSES.SUCCEED) {
    productList = [...products.data];
    isProductListDone = true;
    resetListProducts();
  }
  if (
    isPatientCollection &&
    patients &&
    patients.status === ACTION_STATUSES.SUCCEED
  ) {
    console.log("[Dashboard Patient List]", patients);
    setIsPatientCollection(false);
    isPatientListDone = true;
    patientList = patients.data || [];
    patientCnaList = [];
    patientList.forEach((p) => {
      if (!patientCnaList.find((c) => c.name === p.name)) {
        patientCnaList.push({
          label: p.patientCd,
          value: p.patientCd,
          name: p.patientCd,
          category: "patient",
        });
      }
      if (!patientCnaList.find((c) => c.name === p.assigned_cna)) {
        patientCnaList.push({
          label: p.assigned_cna,
          value: p.assigned_cna,
          name: p.assigned_cna,
          category: "patient",
        });
      }
    });
    patientCnaList = sortByName(patientCnaList);
    patientList = sortByPatientStatus(patientList);
    numberInactive = patientList.filter(
      (p) => p.status && p.status.toLowerCase() === "inactive"
    ).length;
    numberActive = patientList.length - numberInactive;
  }
  if (
    stockList.length === 0 &&
    productList.length === 0 &&
    patientList.length === 0 &&
    isDistributionCollection &&
    distributions &&
    distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    isDistributionListDone = true;
    setIsDistributionCollection(false);
  } else if (
    stockList.length &&
    productList.length &&
    patientList.length &&
    isDistributionCollection &&
    distributions &&
    distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    isDistributionListDone = true;
    setIsDistributionCollection(false);
    patientGrandTotal = 0.0;

    distributionList = distributions.data || [];
    console.log("[Patient Data]", patientList);
    console.log("[Patient Data2]", distributionList);

    patientDashboard = [];

    supplyPlot = [];
    patientSupplyPlot = {
      brief: [],
      underpad: [],
      wipe: [],
      glove: [],
      underwear: [],
      ensureVanilla: [],
      ensureChocolate: [],
      ensureStrawberry: [],
    };
    estimatedSupplyGrandTotal = {
      brief: parseFloat(0.0),
      underpad: parseFloat(0.0),
      underwear: parseFloat(0.0),
      glove: parseFloat(0.0),
      wipe: parseFloat(0.0),
      ensureVanilla: parseFloat(0.0),
      ensureChocolate: parseFloat(0.0),
      ensureStrawberry: parseFloat(0.0),
    };

    plotSummary = {
      brief: [],
      underpad: [],
      underwear: [],
      glove: [],
      wipe: [],
      ensureVanilla: [],
      ensureChocolate: [],
      ensureStrawberry: [],
    };

    unusedPlotSummary = {
      brief: [],
      underpad: [],
      underwear: [],
      glove: [],
      wipe: [],
      ensureVanilla: [],
      ensureChocolate: [],
      ensureStrawberry: [],
    };
    for (const patient of patientList) {
      let estimatedAmt = 0.0;
      patient.label = patient.patientCd;
      patient.value = patient.patientCd;
      patient.category = "patient";

      const supplies = distributionList.filter(
        (dist) => dist.patient_id === patient.id
      );
      console.log("[Supplies]", supplies);
      supplies.forEach((supply) => {
        estimatedAmt += parseFloat(supply.estimated_total_amt);
      });
      const seriesList = {
        brief: 0,
        underwear: 0,
        underpad: 0,
        lotion: 0,
        nutrition: 0,
        other: 0,
      };

      const nutritions = supplies.filter((supply) =>
        ["Diabetic Shake", "Nutrition Shake"].includes(supply.category)
      );

      const ensureVanillas = supplies.filter(
        (supply) =>
          ["Diabetic Shake", "Nutrition Shake"].includes(supply.category) &&
          supply.description.indexOf("Ensure") !== -1 &&
          supply.description.indexOf("Vanilla") !== -1
      );
      const ensureChocolates = supplies.filter(
        (supply) =>
          ["Diabetic Shake", "Nutrition Shake"].includes(supply.category) &&
          supply.description.indexOf("Ensure") !== -1 &&
          supply.description.indexOf("Chocolate") !== -1
      );
      const ensureStrawberries = supplies.filter(
        (supply) =>
          ["Diabetic Shake", "Nutrition Shake"].includes(supply.category) &&
          supply.description.indexOf("Ensure") !== -1 &&
          supply.description.indexOf("Strawberry") !== -1
      );

      const briefs = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "adult diapers and briefs"
      );
      console.log("[Briefs]", briefs);
      const wipes = supplies.filter(
        (supply) => supply.subCategory?.toLowerCase() === "wipes"
      );
      const gloves = supplies.filter(
        (supply) => supply.subCategory?.toLowerCase() === "gloves"
      );
      const underwears = supplies.filter(
        (supply) => supply.subCategory?.toLowerCase() === "pull-up underwear"
      );
      const underpads = supplies.filter(
        (supply) => supply.subCategory?.toLowerCase() === "underpads"
      );
      const lotions = supplies.filter((supply) =>
        ["Lotion", "Cleanser", "Ointment", "Cream"].includes(supply.category)
      );

      if (briefs && briefs.length) {
        briefs.forEach((item) => {
          seriesList.brief = parseFloat(
            parseFloat(seriesList.brief) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);
          console.log(
            "productList]",
            productList,
            item,
            item.productId,
            [...productList].find((p) => p.id === 251)
          );
          const temp = [...productList].find((p) => p.id === item.productId);

          if (temp) {
            item.shortDescription = temp.short_description || "";
            console.log("[Found temp]", item);
          }
        });
      }
      if (underwears && underwears.length) {
        underwears.forEach((item) => {
          seriesList.underwear = parseFloat(
            parseFloat(seriesList.underwear) +
              parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (underpads && underpads.length) {
        underpads.forEach((item) => {
          seriesList.underpad = parseFloat(
            parseFloat(seriesList.underpad) +
              parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (lotions && lotions.length) {
        lotions.forEach((item) => {
          seriesList.lotion = parseFloat(
            parseFloat(seriesList.lotion) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (nutritions && nutritions.length) {
        nutritions.forEach((item) => {
          seriesList.nutrition = parseFloat(
            parseFloat(seriesList.nutrition) +
              parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      patientGrandTotal += estimatedAmt;
      if (
        estimatedAmt > 0 &&
        patient &&
        patient.patientCd &&
        patient.patientCd.indexOf("C/O") === -1
      ) {
        patientDashboard.push({
          status: patient.status,
          soc: moment(patient.soc_at).format("YYYY-MM-DD"),
          eoc:
            patient?.status?.toLowerCase() === "inactive"
              ? moment(patient.eoc_at).format("YYYY-MM-DD")
              : "",
          cna: patient.assigned_cna,
          name: patient.patientCd,
          label: patient.patientCd,
          value: patient.patientCd,
          category: "patient",
          estimatedAmt,
          series: [
            parseFloat(seriesList.underpad),
            parseFloat(seriesList.brief),
            parseFloat(seriesList.underwear),
            parseFloat(seriesList.lotion),
            parseFloat(seriesList.nutrition),
            parseFloat(seriesList.other),
          ],
        });
      }
      if (
        (patient.status.toLowerCase() === "inactive" &&
          patient.patientCd.indexOf("C/O") !== -1) ||
        patient.status.toLowerCase() !== "inactive"
      ) {
        console.log("[Briefs]", briefs);
        setPatientProductHandler(
          patient,
          briefs,
          underpads,
          underwears,
          wipes,
          gloves,
          ensureVanillas,
          ensureChocolates,
          ensureStrawberries
        );
      }
    }

    plotHandler("brief");
    plotHandler("underpad");
    plotHandler("underwear");
    plotHandler("wipe");
    plotHandler("glove");
    plotHandler("ensureVanilla");
    plotHandler("ensureChocolate");
    plotHandler("ensureStrawberry");
    console.log("[Plot Supply]", patientSupplyPlot.brief);
    patientSupplyPlot.brief = sortByProductId(
      patientSupplyPlot.brief,
      "productId"
    );
    patientSupplyPlot.underpad = sortByProductId(
      patientSupplyPlot.underpad,
      "productId"
    );
    patientSupplyPlot.underwear = sortByProductId(
      patientSupplyPlot.underwear,
      "productId"
    );
    patientSupplyPlot.wipe = sortByProductId(
      patientSupplyPlot.wipe,
      "productId"
    );
    patientSupplyPlot.glove = sortByProductId(
      patientSupplyPlot.glove,
      "productId"
    );
    patientSupplyPlot.ensureVanilla = sortByProductId(
      patientSupplyPlot.ensureVanilla,
      "productId"
    );
    patientSupplyPlot.ensureChocolate = sortByProductId(
      patientSupplyPlot.ensureChocolate,
      "productId"
    );
    patientSupplyPlot.ensureStrawberry = sortByProductId(
      patientSupplyPlot.ensureStrawberry,
      "productId"
    );
    patientOptions = [...patientDashboard];
    setIsRefresh(!isRefresh);

    //listTransactions();
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const inputGeneralHandler = ({ target }) => {
    if (target.name === "patient" && !target.value) {
      patientDashboard = [...patientOptions];
      patientDashboard.forEach((e) => {
        patientGrandTotal += e.estimatedAmt;
      });
      setPatient(DEFAULT_ITEM);
    }
  };
  const autoCompleteGeneralInputHander = (item) => {
    console.log("[Item]", item);
    if (item.category === "product") {
      setProduct(item);
      setPlotView(item.value);
    }
    if (item.category === "patient") {
      const temp = [...patientOptions];
      const found = temp.filter(
        (t) => t.name === item.name || t.cna === item.name
      );
      console.log("[temp]", temp, found, item);
      patientDashboard = found;
      patientGrandTotal = 0;
      patientDashboard.forEach((e) => {
        patientGrandTotal += e.estimatedAmt;
      });
      setPatient(item);
    }
  };
  console.log("[series]", patientDashboard);

  console.log(
    "[Plot List]",
    patientList,
    patientCnaList,
    stockList,
    productList
  );
  console.log(
    "[Done]",
    isDistributionListDone,
    isPatientListDone,
    isTransactionDone,
    isProductListDone,
    isStockListDone
  );

  const dateInputHandler = (value, name) => {
    console.log("[Date Input value]", value, name);
    if (name === "dateFrom") {
      setDateFrom(value);
      setIsDistributionCollection(true);
      listDistributions({
        from: moment(new Date(value)).utc().format("YYYY-MM-DD"),
        to: moment(new Date(dateTo)).utc().format("YYYY-MM-DD"),
        companyId: userProfile.companyId,
      });
    } else if (name === "dateTo") {
      setDateTo(value);
      setIsDistributionCollection(true);
      listDistributions({
        from: moment(new Date(dateFrom)).utc().format("YYYY-MM-DD"),
        to: moment(new Date(value)).utc().format("YYYY-MM-DD"),
        companyId: userProfile.companyId,
      });
    }
  };
  const onChangeGeneralInputHandler = ({ target }) => {
    if (target.name === "product" && !target.value) {
      setFetchProductFailure();
    }
  };
  console.log(
    "[Date From/To]",
    dateFrom,
    dateTo,
    isDistributionListDone,
    isPatientListDone,
    isTransactionDone,
    isProductListDone,
    isStockListDone
  );
  console.log(
    "[patientSupplyPlot]",
    isProductListDone,
    isStockListDone,
    isTransactionDone,
    isDistributionListDone,
    isPatientListDone,
    patientSupplyPlot.brief
  );
  return (
    <>
      <div>
        {!isDistributionListDone ||
        !isPatientListDone ||
        !isTransactionDone ||
        !isProductListDone ||
        !isStockListDone ? (
          <div align="center" style={{ paddingTop: "100px" }}>
            <br />
            <CircularProgress />
            &nbsp;<span>Loading</span>...
          </div>
        ) : productList.length ? (
          <Card plain>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDatePicker
                    label="From"
                    placeholder="From"
                    value={dateFrom}
                    name="dateFrom"
                    onChange={dateInputHandler}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDatePicker
                    label="To"
                    placeholder="To"
                    value={dateTo}
                    name="dateTo"
                    onChange={dateInputHandler}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomSingleAutoComplete
                    label="Products"
                    placeholder="Products"
                    name="product"
                    onSelectHandler={autoCompleteGeneralInputHander}
                    onChangeHandler={onChangeGeneralInputHandler}
                    value={product}
                    options={productCategories || [DEFAULT_ITEM]}
                  />
                </GridItem>
                {plotView && (
                  <SupplyPlot
                    title={plotView.toUpperCase()}
                    patientPlot={patientSupplyPlot[plotView]}
                    estimatedGrandTotal={estimatedSupplyGrandTotal[plotView]}
                    unusedSummary={unusedPlotSummary[plotView]}
                    summary={plotSummary[plotView]}
                  />
                )}
              </GridContainer>
            </CardBody>
          </Card>
        ) : null}
      </div>
    </>
  );
};
const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  distributions: distributionListStateSelector(store),
  transactions: transactionListStateSelector(store),
  products: productListStateSelector(store),
  stocks: stockListStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistribution: () => dispatch(resetFetchDistributionState()),
  listTransactions: (data) => dispatch(attemptToFetchTransaction(data)),
  resetlistTransactions: () => dispatch(resetFetchTransactionState()),
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  listStocks: (data) => dispatch(attemptToFetchStock(data)),
  resetListStocks: () => dispatch(resetFetchStockState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPlot);

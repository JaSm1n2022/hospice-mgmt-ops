import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CardBody from "components/Card/CardBody";

import CustomDatePicker from "components/Date/CustomDatePicker";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { SupaContext } from "App";
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
import PrintReport from "../components/PrintReport";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { attemptToFetchAssignment } from "store/actions/assignmentAction";
import { resetFetchAssignmentState } from "store/actions/assignmentAction";
import { assignmentListStateSelector } from "store/selectors/assignmentSelector";
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
let isAssignmentListDone = false;
let patientList = [];
let stockList = [];
let patientOptions = [];
let distributionList = [];
let numberActive = 0;
let numberInactive = 0;
let patientCnaList = [];
let userProfile = {};

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
let assignmentList = [];
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

let transactionType = {
  amazon: 0,
  medline: 0,
  mckesson: 0,
  walmart: 0,
  others: 0,
};

let requestorDaily = [];
DATE_TYPE_SELECTION.forEach((c) => {
  dateOptions.push({ ...c, category: "date" });
});

const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
const PatientSupplies = (props) => {
  const {
    listStocks,

    listProducts,
    resetListProducts,
    products,
    listPatients,
    listDistributions,
    resetListPatients,
    resetListDistribution,
    patients,
    distributions,
    assignments,
    resetListAssignments,
    listAssignments,
  } = props;
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isDistributionCollection, setIsDistributionCollection] = useState(
    true
  );
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [dateFrom, setDateFrom] = useState(dates.from);
  const [dateTo, setDateTo] = useState(dates.to);
  const [isRefresh, setIsRefresh] = useState(false);
  useEffect(() => {
    if (context.userProfile?.companyId) {
      const companyId = context.userProfile.companyId;
      listStocks({ companyId });
      listProducts({ companyId });
      listPatients({ companyId });
      listDistributions({
        from: dates.from,
        to: dates.to,
        companyId,
      });
      listAssignments({ companyId });
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
  if (assignments && assignments.status === ACTION_STATUSES.SUCCEED) {
    assignmentList = [...assignments.data];
    isAssignmentListDone = true;
    resetListAssignments();
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
    console.log("[Distribution Data]", distributions.data, patientList);
    distributionList = distributions.data || [];

    patientDashboard = [];

    supplyPlot = [];
    patientSupplyPlot = {
      brief: [],
      underpad: [],
      wipe: [],
      glove: [],
      underwear: [],
      wound: [],
      catheter: [],
      other: [],
    };
    estimatedSupplyGrandTotal = {
      brief: parseFloat(0.0),
      underpad: parseFloat(0.0),
      underwear: parseFloat(0.0),
      glove: parseFloat(0.0),
      wipe: parseFloat(0.0),
      wound: parseFloat(0.0),
      catheter: parseFloat(0.0),
      other: parseFloat(0.0),
    };

    for (const patient of patientList) {
      let estimatedAmt = 0.0;
      patient.label = patient.patientCd;
      patient.value = patient.patientCd;
      patient.category = "patient";

      const supplies = distributionList.filter(
        (dist) =>
          dist.patient_id === patient.id &&
          dist.category.toLowerCase() === "medical/incontinence"
      );
      console.log("[Supplies]", supplies);
      supplies.forEach((supply) => {
        if ("medical/incontinence" === supply.category?.toLowerCase()) {
          estimatedAmt += parseFloat(supply.estimated_total_amt);
        }
      });
      const seriesList = {
        brief: 0,
        underwear: 0,
        underpad: 0,
        wipe: 0,
        catheter: 0,
        wound: 0,
        glove: 0,
        other: 0,
      };
      const others = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() !== "adult diapers and briefs" &&
          supply.subCategory?.toLowerCase() !== "pull-up underwear" &&
          supply.subCategory?.toLowerCase() !== "wipes" &&
          supply.subCategory?.toLowerCase() !== "gloves" &&
          supply.subCategory?.toLowerCase() !== "underpads" &&
          supply.subCategory?.toLowerCase() !== "catheters" &&
          supply.subCategory?.toLowerCase() !== "wound care products"
      );

      console.log("[OTHERS]", others);
      console.log("[OTHERS]", others);
      const briefs = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "adult diapers and briefs" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );
      const underwears = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "pull-up underwear" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );
      const underpads = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "underpads" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );
      const wipes = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "wipes" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );

      const gloves = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "gloves" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );
      const catheters = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "catheters" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );
      const wounds = supplies.filter(
        (supply) =>
          supply.subCategory?.toLowerCase() === "wound care products" &&
          supply.category?.toLowerCase() === "medical/incontinence"
      );

      if (others && others.length) {
        others.forEach((item) => {
          seriesList.other = parseFloat(
            parseFloat(seriesList.other) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (briefs && briefs.length) {
        briefs.forEach((item) => {
          seriesList.brief = parseFloat(
            parseFloat(seriesList.brief) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);

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
      if (wounds && wounds.length) {
        wounds.forEach((item) => {
          seriesList.wound = parseFloat(
            parseFloat(seriesList.wound) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (wipes && wipes.length) {
        wipes.forEach((item) => {
          seriesList.wipe = parseFloat(
            parseFloat(seriesList.wipe) + parseFloat(item.estimated_total_amt)
          ).toFixed(2);
        });
      }
      if (gloves && gloves.length) {
        gloves.forEach((item) => {
          seriesList.glove = parseFloat(
            parseFloat(seriesList.glove) + parseFloat(item.estimated_total_amt)
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
      if (catheters && catheters.length) {
        catheters.forEach((item) => {
          seriesList.catheter = parseFloat(
            parseFloat(seriesList.catheter) +
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
        console.log("[BRIEFS]", seriesList, patient.patientCd);
        patientDashboard.push({
          status: patient.status,
          soc: moment(patient.soc_at || patient.soc).format("YYYY-MM-DD"),
          eoc:
            patient?.status?.toLowerCase() === "inactive"
              ? moment(patient.eoc_at || patient.eoc).format("YYYY-MM-DD")
              : "",
          cna: assignmentList?.find((p) => p.patientCd === patient.patientCd)
            ? assignmentList?.find((p) => p.patientCd === patient.patientCd)
                .cnaName
            : "",
          rn: assignmentList?.find((p) => p.patientCd === patient.patientCd)
            ? assignmentList?.find((p) => p.patientCd === patient.patientCd)
                .rnName
            : "",
          lpn: assignmentList?.find((p) => p.patientCd === patient.patientCd)
            ? assignmentList?.find((p) => p.patientCd === patient.patientCd)
                .lpnName
            : "",
          name: patient.patientCd,
          label: patient.patientCd,
          value: patient.patientCd,
          category: "patient",
          estimatedAmt,
          series: [
            parseFloat(seriesList.underpad),
            parseFloat(seriesList.brief),
            parseFloat(seriesList.underwear),
            parseFloat(seriesList.wipe),
            parseFloat(seriesList.glove),
            parseFloat(seriesList.catheter),
            parseFloat(seriesList.wound),
            parseFloat(seriesList.other),
          ],
        });
      }
    }
    patientOptions = [...patientDashboard];

    setIsRefresh(!isRefresh);
  }

  const autoCompleteGeneralInputHander = (item) => {
    console.log("[Item]", item);

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
        from: moment(new Date(value)).format("YYYY-MM-DD"),
        to: moment(new Date(dateTo)).format("YYYY-MM-DD"),
        companyId: context.userProfile?.companyId,
      });
    } else if (name === "dateTo") {
      setDateTo(value);
      setIsDistributionCollection(true);
      listDistributions({
        from: moment(new Date(dateFrom)).format("YYYY-MM-DD"),
        to: moment(new Date(value)).format("YYYY-MM-DD"),
        companyId: context.userProfile?.companyId,
      });
    }
  };
  const onChangeGeneralInputHandler = ({ target }) => {
    if (target.name === "patient" && !target.value) {
      const temp = [...patientOptions];

      patientDashboard = temp;
      patientGrandTotal = 0;
      patientDashboard.forEach((e) => {
        patientGrandTotal += e.estimatedAmt;
      });

      setPatient(DEFAULT_ITEM);
    }
  };
  console.log("[Patient Dashboard", assignmentList, patientDashboard);
  return (
    <>
      <div>
        {!isDistributionListDone ||
        !isPatientListDone ||
        !isTransactionDone ||
        !isProductListDone ||
        !isAssignmentListDone ||
        !isStockListDone ? (
          <div align="center" style={{ paddingTop: "100px" }}>
            <br />
            <CircularProgress />
            &nbsp;<span>Loading</span>...
          </div>
        ) : patientList.length ? (
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
                    label="Patients"
                    placeholder="Patients"
                    name="patient"
                    onSelectHandler={autoCompleteGeneralInputHander}
                    onChangeHandler={onChangeGeneralInputHandler}
                    value={patient}
                    options={patientOptions || [DEFAULT_ITEM]}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div align="center" style={{ paddingTop: 20 }}>
                    <Typography variant="h5">{`Patients Incontinence/Medical Metrics Report From ${moment(
                      new Date(dateFrom)
                    ).format("YYYY-MM-DD")} To ${moment(
                      new Date(dateTo)
                    ).format("YYYY-MM-DD")}`}</Typography>
                    <Typography variant="body">
                      {`Active Patients: ${numberActive} / InActive Patients: ${numberInactive}`}
                    </Typography>

                    <Typography
                      variant="h6"
                      style={{ color: "blue", fontWeight: "bold" }}
                    >
                      Grand Total :{" "}
                      {`$${parseFloat(patientGrandTotal || 0.0).toFixed(2)}`}
                      <Typography
                        variant="bold2"
                        style={{ color: "gray", fontWeight: "bold" }}
                      >
                        &nbsp;(excluding tax & shipping)
                      </Typography>
                    </Typography>
                    {patientDashboard.length === 0 && (
                      <Typography variant="body2" style={{ color: "red" }}>
                        No record found. Please verify date range data.
                      </Typography>
                    )}
                  </div>
                  <PrintReport
                    source={"clientExpensesReport"}
                    clientExpensesAmt={`$${parseFloat(
                      patientGrandTotal || 0.0
                    ).toFixed(2)}`}
                    patientDashboard={patientDashboard}
                    numberActive={numberActive}
                    numberInactive={numberInactive}
                    dateFrom={moment(dateFrom).utc().format("YYYY-MM-DD")}
                    dateTo={moment(dateTo).utc().format("YYYY-MM-DD")}
                  />
                </GridItem>
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
  assignments: assignmentListStateSelector(store),
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
  listAssignments: (data) => dispatch(attemptToFetchAssignment(data)),
  resetListAssignments: () => dispatch(resetFetchAssignmentState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientSupplies);

import {
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useContext } from "react";
import Button from "components/CustomButtons/Button.js";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import AddIcon from "@material-ui/icons/Add";

import { useState } from "react";
import * as FileSaver from "file-saver";

import TransactionForm from "./components/TransactionForm";
import { connect } from "react-redux";
import Helper from "utils/helper";
import { ACTION_STATUSES } from "utils/constants";
import TransactionHandler from "./handler/TransactionHandler";
import { SUPPLY_STATUS } from "utils/constants";
import HospiceTable from "components/Table/HospiceTable";
import { productListStateSelector } from "store/selectors/productSelector";
import { transactionListStateSelector } from "store/selectors/transactionSelector";
import { transactionCreateStateSelector } from "store/selectors/transactionSelector";
import { transactionUpdateStateSelector } from "store/selectors/transactionSelector";
import { transactionDeleteStateSelector } from "store/selectors/transactionSelector";
import { stockListStateSelector } from "store/selectors/stockSelector";
import { stockUpdateStateSelector } from "store/selectors/stockSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchTransaction } from "store/actions/transactionAction";
import { resetFetchTransactionState } from "store/actions/transactionAction";
import { attemptToCreateTransaction } from "store/actions/transactionAction";
import { resetCreateTransactionState } from "store/actions/transactionAction";
import { attemptToUpdateTransaction } from "store/actions/transactionAction";
import { resetUpdateTransactionState } from "store/actions/transactionAction";
import { attemptToDeleteTransaction } from "store/actions/transactionAction";
import { resetDeleteTransactionState } from "store/actions/transactionAction";
import { attemptToFetchStock } from "store/actions/stockAction";
import { resetFetchStockState } from "store/actions/stockAction";
import { attemptToUpdateStock } from "store/actions/stockAction";
import { resetUpdateStockState } from "store/actions/stockAction";
import ActionsFunction from "components/Actions/ActionsFunction";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core/styles";
import { ImportExport } from "@material-ui/icons";
import moment from "moment";
import FilterTable from "components/Table/FilterTable";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
let productList = [];
let stockList = [];
let originalSource = [];
let grandTotal = 0.0;
let isFetchAllDone = false;
let isProductDone = false;
let isStockDone = false;
let isTransactionDone = false;
let isUpdateStockDone = true;
let isUpdateTransactionDone = true;

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
const TransactionFunction = (props) => {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(TransactionHandler.columns());
  const [isTransactionsCollection, setIsTransactionsCollection] = useState(
    true
  );
  const [
    isCreateTransactionCollection,
    setIsCreateTransactionCollection,
  ] = useState(true);
  const [
    isUpdateTransactionCollection,
    setIsUpdateTransactionCollection,
  ] = useState(true);
  const [
    isDeleteTransactionCollection,
    setIsDeleteTransactionCollection,
  ] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [deliveredItems, setDeliveredItems] = useState(false);
  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isTransactionsCollection &&
      props.transactions &&
      props.transactions.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetlistTransactions();

      setIsTransactionsCollection(true);
    }

    if (
      !isCreateTransactionCollection &&
      props.createTransactionState &&
      props.createTransactionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateTransaction();

      setIsCreateTransactionCollection(true);
      if (deliveredItems?.length) {
        addToStockHandler(deliveredItems);
      }
    }
    if (
      !isUpdateTransactionCollection &&
      props.updateTransactionState &&
      props.updateTransactionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateTransaction();

      setIsUpdateTransactionCollection(true);
    }
    if (
      !isDeleteTransactionCollection &&
      props.deleteTransactionState &&
      props.deleteTransactionState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteTransaction();
      setIsDeleteTransactionCollection(true);
    }
  }, [
    isTransactionsCollection,
    isCreateTransactionCollection,
    isUpdateTransactionCollection,
    isDeleteTransactionCollection,
  ]);
  useEffect(() => {
    if (context.userProfile?.companyId) {
      const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
      setDateFrom(dates.from);
      setDateTo(dates.to);
      console.log("[dates]", dates);
      props.listProducts({ companyId: context.userProfile?.companyId });
      props.listStocks({ companyId: context.userProfile?.companyId });

      props.listTransactions({
        from: dates.from,
        to: dates.to,
        companyId: context.userProfile?.companyId,
      });
    }
  }, []);

  if (props.products && props.products.status === ACTION_STATUSES.SUCCEED) {
    console.log("[transaction products]", props.products.data);
    isProductDone = true;
    productList = [];
    productList = props.products.data;
    //productList = productList.filter(p => p.status);
    productList.forEach((item) => {
      item.name = `${item.description}/${item.vendor}`;
      item.value = `${item.description}`;
      item.label = `${item.description}/${item.vendor}`;
      item.categoryType = "description";
    });

    props.resetListProducts();
  }

  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);
    isTransactionDone = false;

    props.listTransactions({
      from: dates.from,
      to: dates.to,
      companyId: context.userProfile?.companyId,
    });
  };
  console.log("[props.transactions]", props.transactions);
  if (props.stocks && props.stocks.status === ACTION_STATUSES.SUCCEED) {
    if (props.stocks.data && props.stocks.data.length) {
      stockList = [...props.stocks.data];
    }
    isStockDone = true;
    props.resetListStocks();
  }
  if (
    isTransactionsCollection &&
    props.transactions &&
    props.transactions.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    isTransactionDone = true;
    let source = props.transactions.data;
    if (source && source.length) {
      source = TransactionHandler.mapData(source);
      const grands = source.map((map) => map.grand_total);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = TransactionHandler.columns().map((col, index) => {
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
    setDataSource(source);
    originalSource = [...source];
    setIsTransactionsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete transaction id]", id);
    props.deleteTransaction(id);
  };
  const createTransactionHandler = (general, details, mode) => {
    console.log("[Create Transaction]", general, details);
    const finalPayload = [];
    const dItems = [];
    for (const detail of details) {
      const params = {
        ordered_at: moment(general.orderedDt).format("YYYY-MM-DD 00:00:00"),
        order_number: general.orderNumber,
        description: detail.description,
        category: detail.category,
        subCategory: detail.subCategory,
        category_id: detail.categoryId || detail.category_id,
        subCategory_id: detail.subCategoryId || detail.subCategory_id,
        item: detail.item,
        size: detail.size,
        dimension: detail.dimension,
        qty: detail.qty,
        qty_uom: detail.qty_uom,
        unit_piece: detail.count,
        total_pcs: detail.count * detail.qty,
        unit_price: detail.unit_price,
        total_price: detail.totalPrice,
        price_per_pcs: detail.price_per_pcs,
        vendor: detail.vendor,
        status: general.status ? general.status.name : "",
        product_id: detail.productInfo ? detail.productInfo.id : undefined,
        expected_delivery_at: general.expectedDeliveryDt,
        payment_method: general.paymentMethod ? general.paymentMethod.name : "",
        payment_info: general.paymentInfo,
        payment_transaction_at: general.paymentDt,
        grand_total: detail.grandTotal,
        companyId: context.userProfile?.companyId,
        updatedUser: {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        },
      };

      if (mode === "edit") {
        params.id = general.id;
      }
      if (mode === "create") {
        params.created_at = new Date();
        params.createdUser = {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        };
      }
      if (params.status?.toLowerCase() === "delivered") {
        dItems.push({
          total_pcs: params.total_pcs,
          product_id: params.product_id,
          qty: params.qty,
        });
      }
      finalPayload.push(params);
    }

    if (mode === "create") {
      setDeliveredItems(dItems);
      props.createTransaction(finalPayload);
    } else if (mode === "edit") {
      props.updateTransaction(finalPayload);
    }

    console.log("[params]", finalPayload);
    setIsFormModal(false);
  };
  const changeStatusHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeChangeStatusMenuHandler = () => {
    setAnchorEl(null);
  };
  //for delivered status only
  const addToStockHandler = (data) => {
    const forUpdateStatus = [];
    const forStockUpdates = [];

    data.forEach((sel) => {
      console.log("[selMe]", sel);
      const stock = stockList.find((s) => s.productId === sel.product_id);
      const product = productList.find((prod) => prod.id === sel.product_id);
      console.log("[stocks]", stock);
      let qty = parseInt(sel.qty, 10);
      let realQty = qty * parseInt(product.count || 1);

      forStockUpdates.push({
        id: stock.id,
        qty_on_hand: Math.abs(
          parseInt(stock.qty_on_hand, 10) + parseInt(realQty, 10)
        ),
      });
    });
    setAnchorEl(null);
    console.log("[forUpdateStatus]", forUpdateStatus, forStockUpdates);

    if (forStockUpdates.length) {
      isUpdateStockDone = false;
      props.updateStock(forStockUpdates);
    }
  };
  const updateStatusHandler = (stat) => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    console.log("[selected Data Status]", selectedData, stat);
    const forUpdateStatus = [];
    const forStockUpdates = [];

    selectedData.forEach((sel) => {
      console.log("[selMe]", sel);
      if (
        stockList &&
        stockList.length &&
        sel.product_id &&
        stat.toLowerCase() === "delivered" &&
        stat !== sel.status
      ) {
        const stock = stockList.find((s) => s.productId === sel.product_id);
        const product = productList.find((prod) => prod.id === sel.product_id);
        console.log("[stocks]", stock);
        let qty = parseInt(sel.qty, 10);
        let realQty = qty * parseInt(product.count || 1);

        forStockUpdates.push({
          id: stock.id,
          qty_on_hand: Math.abs(
            parseInt(stock.qty_on_hand, 10) + parseInt(realQty, 10)
          ),
        });
      }
      forUpdateStatus.push({
        id: sel.id,
        status: stat,
      });
    });
    setAnchorEl(null);
    console.log("[forUpdateStatus]", forUpdateStatus, forStockUpdates);

    if (forStockUpdates.length) {
      isUpdateStockDone = false;
      props.updateStock(forStockUpdates);
    }
    isUpdateTransactionDone = false;
    props.updateTransaction(forUpdateStatus);
  };
  console.log(
    "[Is Create Transaction Collection]",
    props.createTransactionState
  );
  if (
    isCreateTransactionCollection &&
    props.createTransactionState &&
    props.createTransactionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateTransactionCollection(false);
    isTransactionDone = false;

    props.listTransactions({
      from: dateFrom,
      to: dateTo,
      companyId: userProfile.companyId,
    });
  }
  if (
    isUpdateTransactionCollection &&
    props.updateTransactionState &&
    props.updateTransactionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdateTransactionCollection(false);
    isUpdateTransactionDone = true;
    isTransactionDone = false;
    props.listTransactions({
      from: dateFrom,
      to: dateTo,
      companyId: userProfile.companyId,
    });
  }
  console.log(
    "[isDeleteTransaction]",
    isDeleteTransactionCollection,
    props.deleteTransactionState
  );
  if (
    isDeleteTransactionCollection &&
    props.deleteTransactionState &&
    props.deleteTransactionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsDeleteTransactionCollection(false);
    isTransactionDone = false;
    props.listTransactions({
      from: dateFrom,
      to: dateTo,
      companyId: userProfile.companyId,
    });
  }
  if (
    props.updateStockState &&
    props.updateStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    isUpdateStockDone = true;
    props.resetUpdateStock();
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
      grandTotal = 0.0;
      const grands = [...originalSource].map((map) => map.grand_total);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    } else {
      const temp = [...originalSource];

      const found = temp.filter(
        (data) =>
          (data.description &&
            data.description.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.order_number &&
            data.order_number.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.payment_info &&
            data.payment_info.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.vendor &&
            data.vendor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.category &&
            data.category.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
      );

      grandTotal = 0.0;
      const grands = found.map((map) => map.grand_total);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
      setDataSource(found);
    }
  };
  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
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
    setDataSource(dtSource);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `transaction_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
    }
  };

  if (
    !isTransactionDone ||
    !isProductDone ||
    !isStockDone ||
    !isUpdateStockDone ||
    !isUpdateTransactionDone
  ) {
    isFetchAllDone = false;
  } else {
    isFetchAllDone = true;
  }

  return (
    <React.Fragment>
      {!isFetchAllDone && (
        <div>
          <CircularProgress size={20} />
          Loading...
        </div>
      )}
      <GridContainer>
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
                    Transaction Management
                  </h4>
                </div>
                <div align="right" style={{ flex: "0 0 10%" }}>
                  <h4 className={classes.cardTitleWhite}>{`$${parseFloat(
                    grandTotal
                  ).toFixed(2)}`}</h4>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer alignItems="center" style={{ paddingLeft: 12 }}>
                <Grid item xs={12} md={6}>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <Button
                      color="info"
                      className={classes.marginRight}
                      onClick={() => createFormHandler()}
                    >
                      <AddIcon className={classes.icons} /> Add Transaction
                    </Button>

                    {isAddGroupButtons && (
                      <>
                        <Button
                          color="success"
                          className={classes.marginRight}
                          onClick={() => exportToExcelHandler()}
                        >
                          <ImportExport className={classes.icons} /> Export
                          Excel
                        </Button>
                        <Button
                          color="success"
                          className={classes.marginRight}
                          onClick={() => changeStatusHandler()}
                        >
                          <rrowDownwardIcon className={classes.icons} /> Change
                          Status Excel
                        </Button>
                      </>
                    )}

                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={closeChangeStatusMenuHandler}
                    >
                      {SUPPLY_STATUS.map((map) => {
                        return (
                          <MenuItem onClick={() => updateStatusHandler(map)}>
                            {map}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 20,
                  }}
                >
                  <FilterTable
                    filterRecordHandler={filterRecordHandler}
                    filterByDateHandler={filterByDateHandler}
                    search={6}
                  />
                </Grid>
              </GridContainer>
              <GridContainer>
                <Grid item xs={12}>
                  <HospiceTable
                    main={true}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                    columns={columns}
                    dataSource={dataSource}
                  />
                </Grid>
              </GridContainer>

              {isFormModal && (
                <TransactionForm
                  productList={productList}
                  createTransactionHandler={createTransactionHandler}
                  mode={mode}
                  isOpen={isFormModal}
                  isEdit={false}
                  item={item}
                  onClose={closeFormModalHandler}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  transactions: transactionListStateSelector(store),
  createTransactionState: transactionCreateStateSelector(store),
  updateTransactionState: transactionUpdateStateSelector(store),
  deleteTransactionState: transactionDeleteStateSelector(store),
  stocks: stockListStateSelector(store),
  updateStockState: stockUpdateStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  listTransactions: (data) => dispatch(attemptToFetchTransaction(data)),
  resetlistTransactions: () => dispatch(resetFetchTransactionState()),
  createTransaction: (data) => dispatch(attemptToCreateTransaction(data)),
  resetCreateTransaction: () => dispatch(resetCreateTransactionState()),
  updateTransaction: (data) => dispatch(attemptToUpdateTransaction(data)),
  resetUpdateTransaction: () => dispatch(resetUpdateTransactionState()),
  deleteTransaction: (data) => dispatch(attemptToDeleteTransaction(data)),
  resetDeleteTransaction: () => dispatch(resetDeleteTransactionState()),
  listStocks: (data) => dispatch(attemptToFetchStock(data)),
  resetListStocks: () => dispatch(resetFetchStockState()),
  updateStock: (data) => dispatch(attemptToUpdateStock(data)),
  resetUpdateStock: () => dispatch(resetUpdateStockState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionFunction);

import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { v4 as uuidv4 } from "uuid";
import StockRoomHandler from "./components/StockRoomHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { stockListStateSelector } from "store/selectors/stockSelector";
import { stockCreateStateSelector } from "store/selectors/stockSelector";
import { stockDeleteStateSelector } from "store/selectors/stockSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchStock } from "store/actions/stockAction";
import { resetFetchStockState } from "store/actions/stockAction";
import { attemptToCreateStock } from "store/actions/stockAction";
import { resetCreateStockState } from "store/actions/stockAction";
import { resetUpdateStockState } from "store/actions/stockAction";
import { attemptToDeleteStock } from "store/actions/stockAction";
import { resetDeleteStockState } from "store/actions/stockAction";
import { stockUpdateStateSelector } from "store/selectors/stockSelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import StockForm from "./components/StockForm";
import { attemptToUpdateStock } from "store/actions/stockAction";
import TOAST from "modules/toastManager";
import { profileListStateSelector } from "store/selectors/profileSelector";
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
let productList = [];
let grandTotal = 0.0;
let originalSource = undefined;
let userProfile = {};
let isProductListDone = false;
let isStockListDone = false;
function StockRoomFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(StockRoomHandler.columns(main));
  const [isStocksCollection, setIsStocksCollection] = useState(true);
  const [isCreateStockCollection, setIsCreateStockCollection] = useState(true);
  const [isUpdateStockCollection, setIsUpdateStockCollection] = useState(true);
  const [isDeleteStockCollection, setIsDeleteStockCollection] = useState(true);
  const [isProductCollection, setIsProductCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");

  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    console.log(
      "[useEffect]",
      isDeleteStockCollection,
      props.deleteStockState.status
    );

    if (
      !isStocksCollection &&
      props.stocks &&
      props.stocks.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListStocks();

      setIsStocksCollection(true);
    }

    if (
      !isCreateStockCollection &&
      props.createStockState &&
      props.createStockState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateStock();

      setIsCreateStockCollection(true);
    }
    if (
      !isUpdateStockCollection &&
      props.updateStockState &&
      props.updateStockState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateStock();

      setIsUpdateStockCollection(true);
    }
    if (
      !isDeleteStockCollection &&
      props.deleteStockState &&
      props.deleteStockState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteStock();
      setIsDeleteStockCollection(true);
    }
    if (
      !isProductCollection &&
      props.products &&
      props.products.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetListProducts();
      setIsProductCollection(true);
    }
  }, [
    isProductCollection,
    isStocksCollection,
    isCreateStockCollection,
    isUpdateStockCollection,
    isDeleteStockCollection,
  ]);
  useEffect(() => {
    console.log("list stocks");
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listProducts({ companyId: userProfile.companyId });
      props.listStocks({ companyId: userProfile.companyId });
    }
  }, []);

  if (
    isProductCollection &&
    props.products &&
    props.products.status === ACTION_STATUSES.SUCCEED
  ) {
    productList = [...props.products.data];
    productList = productList.filter((f) => f.status === true);
    productList.forEach((item) => {
      item.name = `${item.description}-${item.vendor}`;
      item.value = item.name;
      item.label = item.name;
      item.categoryType = "description";
    });
    setIsProductCollection(false);
    isProductListDone = true;
  }
  console.log("[props.Stocks]", props.stocks);
  const sortByWorth = (items) => {
    items.sort((a, b) => {
      const tempA = !a.worth ? 0 : parseFloat(a.worth);
      const tempB = !b.worth ? 0 : parseFloat(b.worth);
      if (tempA > tempB) {
        return -1;
      }
      if (tempA < tempB) {
        return 1;
      }
      return 0;
    });

    console.log("[return me]", items);
    return items;
  };
  if (
    isProductListDone &&
    isStocksCollection &&
    props.stocks &&
    props.stocks.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.stocks.data;
    if (source && source.length) {
      source = StockRoomHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = StockRoomHandler.columns(main).map((col, index) => {
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
    source = sortByWorth(source);
    setDataSource(source);
    isStockListDone = true;
    setIsStocksCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete stock id]", id);
    props.deleteStock(id);
  };
  const createStockHandler = (payload, mode) => {
    console.log("[Create Stock Handler]", payload, mode);
    const params = {
      item: payload.item,
      dimension: payload.dimension,
      size: payload.size,
      description: payload.description,
      qty_on_hand: payload.qtyOnHand,
      incoming_qty: payload.incomingQty,
      projected_qty: payload.projectedQty,
      incoming_order_at: payload.projectedDate,
      productId: payload.productId,
      category: payload.category,
      category_id: payload.category_id,
      subCategory_id: payload.subCategory_id,
      subCategory: payload.subCategory,
      additional_info: payload.info,
      comments: payload.comments,
      vendor: payload.vendor,
      manufacturer: payload.manufacturer,
      companyId: userProfile.companyId,
      updatedUser: {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      },
    };
    if (mode === "create") {
      params.created_at = new Date();
      params.createdUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };
      props.createStock(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateStock(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Stock Collection]", props.createStockState);
  if (
    isCreateStockCollection &&
    props.createStockState &&
    props.createStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateStockCollection(false);
    TOAST.ok("Stock successfully created.");
    props.listStocks({ companyId: userProfile.companyId });
  }
  if (
    isUpdateStockCollection &&
    props.updateStockState &&
    props.updateStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Stock successfully updated.");
    setIsUpdateStockCollection(false);
    props.listStocks({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteStock]",
    isDeleteStockCollection,
    props.deleteStockState
  );
  if (
    isDeleteStockCollection &&
    props.deleteStockState &&
    props.deleteStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Stock successfully deleted.");
    setIsDeleteStockCollection(false);

    props.listStocks({ companyId: userProfile.companyId });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      grandTotal = 0.0;
      const grands = [...originalSource].map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
      originalSource = sortByWorth(originalSource);
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Tempt]", temp);
      let found = temp.filter(
        (data) =>
          data.description.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1 ||
          data.category.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          data.subCategory.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1 ||
          (data.vendor &&
            data.vendor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
      );
      grandTotal = 0.0;
      const grands = found.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
      found = sortByWorth(found);
      setDataSource(found);
    }
  };

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
    dtSource = sortByWorth(dtSource);
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
    let fileName = `stock_list_batch_${new Date().getTime()}`;

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
  const onPressEnterKeyHandler = (value) => {
    filterRecordHandler(value);
    setKeywordValue(value);
  };
  const inputHandler = (e) => {
    if (e.target.name === "keywordValue") {
      setKeywordValue(e.target.value);
      filterRecordHandler(e.target.value);
    }
  };
  return (
    <>
      {!isProductListDone || !isStockListDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : main ? (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <Grid container justifyContent="space-between">
                  <h4 className={classes.cardTitleWhite}>
                    Stock Room Management
                  </h4>
                  <h4 className={classes.cardTitleWhite}>{`$${parseFloat(
                    grandTotal || 0
                  ).toFixed(2)}`}</h4>
                </Grid>
              </CardHeader>
              <CardBody>
                <Grid
                  container
                  justifyContent="space-between"
                  style={{ paddingBottom: 4 }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      gap: 10,
                    }}
                  >
                    <Button
                      onClick={() => createFormHandler()}
                      variant="contained"
                      style={{
                        border: "solid 1px #2196f3",
                        color: "white",
                        background: "#2196f3",
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
                      startIcon={<AddIcon />}
                    >
                      ADD STOCK
                    </Button>
                    {isAddGroupButtons && (
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
                        startIcon={<ImportExport />}
                      >
                        {" "}
                        Export Excel{" "}
                      </Button>
                    )}
                  </div>

                  <SearchCustomTextField
                    background={"white"}
                    onChange={inputHandler}
                    placeholder={"Search Item"}
                    label={"Search Item"}
                    name={"keywordValue"}
                    onPressEnterKeyHandler={onPressEnterKeyHandler}
                    isAllowEnterKey={true}
                    value={keywordValue}
                  />
                </Grid>
                <HospiceTable
                  columns={columns}
                  main={true}
                  grandTotal={grandTotal}
                  dataSource={dataSource}
                  height={400}
                  onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                />
                ;
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      ) : (
        <div>
          <Grid style={{ paddingBottom: 2 }} container>
            <Grid md={4} xs={12} sm={6}>
              <SearchCustomTextField
                background={"white"}
                onChange={inputHandler}
                placeholder={"Search Item"}
                label={"Search Item"}
                name={"keywordValue"}
                onPressEnterKeyHandler={onPressEnterKeyHandler}
                isAllowEnterKey={true}
                value={keywordValue}
              />
            </Grid>
          </Grid>
          <HospiceTable
            main={false}
            columns={columns}
            dataSource={dataSource}
            height={300}
          />
        </div>
      )}
      {isFormModal && (
        <StockForm
          filterRecordHandler={filterRecordHandler}
          productList={productList}
          dataSource={dataSource}
          createStockHandler={createStockHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}

StockRoomFunction.defaultProps = {
  main: false,
};
StockRoomFunction.propTypes = {
  main: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  stocks: stockListStateSelector(store),
  createStockState: stockCreateStateSelector(store),
  updateStockState: stockUpdateStateSelector(store),
  deleteStockState: stockDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  listStocks: (data) => dispatch(attemptToFetchStock(data)),
  resetListStocks: () => dispatch(resetFetchStockState()),
  createStock: (data) => dispatch(attemptToCreateStock(data)),
  resetCreateStock: () => dispatch(resetCreateStockState()),
  updateStock: (data) => dispatch(attemptToUpdateStock(data)),
  resetUpdateStock: () => dispatch(resetUpdateStockState()),
  deleteStock: (data) => dispatch(attemptToDeleteStock(data)),
  resetDeleteStock: () => dispatch(resetDeleteStockState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockRoomFunction);

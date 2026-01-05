import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useContext } from "react";
import ProductHandler from "./handler/ProductHandler";

import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import Button from "components/CustomButtons/Button.js";
import Form from "./components/Form";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import FilterTable from "components/Table/FilterTable";
import HospiceTable from "components/Table/HospiceTable";
import { productListStateSelector } from "store/selectors/productSelector";
import { productCreateStateSelector } from "store/selectors/productSelector";
import { productUpdateStateSelector } from "store/selectors/productSelector";
import { productDeleteStateSelector } from "store/selectors/productSelector";
import { stockCreateStateSelector } from "store/selectors/stockSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToCreateProduct } from "store/actions/productAction";
import { resetCreateProductState } from "store/actions/productAction";
import { attemptToUpdateProduct } from "store/actions/productAction";
import { resetUpdateProductState } from "store/actions/productAction";
import { attemptToDeleteProduct } from "store/actions/productAction";
import { resetDeleteProductState } from "store/actions/productAction";
import { attemptToCreateStock } from "store/actions/stockAction";
import { resetCreateStockState } from "store/actions/stockAction";
import { ACTION_STATUSES } from "utils/constants";
import Helper from "utils/helper";
import { ImportExport } from "@material-ui/icons";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { resetFetchVendorState } from "store/actions/vendorAction";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { vendorListStateSelector } from "store/selectors/vendorSelector";
import { subCategoryListStateSelector } from "store/selectors/subCategorySelector";
import { attemptToFetchSubCategory } from "store/actions/subCategoryAction";
import { resetFetchSubCategoryState } from "store/actions/subCategoryAction";
import { SupaContext } from "App";
import Snackbar from "components/Snackbar/Snackbar.js";
let originalSource = [];
let forCreateStock = undefined;
let grandTotal = 0;
let isListDone = false;
let isVendorListDone = false;
let isProductListDone = false;
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

const ProductFunction = (props) => {
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const context = useContext(SupaContext);
  const [isProductsCollection, setIsProductsCollection] = useState(true);
  const [isCreateProductCollection, setIsCreateProductCollection] = useState(
    true
  );
  const [isUpdateProductCollection, setIsUpdateProductCollection] = useState(
    true
  );
  const [isDeleteProductCollection, setIsDeleteProductCollection] = useState(
    true
  );
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const [isSubCategoryCollection, setIsSubCategoryCollection] = useState(true);
  const [isVendorCollection, setIsVendorCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    //setIsFormModal(true);
    if (context.userProfile?.companyId) {
      props.listSubCategories({ companyId: context.userProfile?.companyId });
      props.listVendors({ companyId: context.userProfile?.companyId });
    }
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isVendorCollection &&
      props.vendors?.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListVendors();
      const arr = [];
      const arr2 = [];
      props.vendors.data.forEach((a) => {
        arr.push({
          ...a,
          label: a.name,
          description: a.name,
          value: a.name,
          category: "vendor",
        });
        arr2.push({
          ...a,
          label: a.name,
          description: a.name,
          value: a.name,
          category: "manufacturer",
        });
      });

      console.log("[ARR]", arr, arr2);
      setVendorList(arr);
      setManufacturerList(arr2);
      setIsVendorCollection(true);
    }
    if (
      !isSubCategoryCollection &&
      props.subCategories?.status === ACTION_STATUSES.SUCCEED
    ) {
      const arr = props.subCategories.data;
      arr.forEach((a) => {
        a.name = `${a.category_name} - ${a.item_name}`;
        a.label = a.name;
        a.description = a.name;
        a.value = a.name;
        a.category = "subcategory";
      });
      setSubCategoryList(arr);
      props.resetListSubCategories();
      setIsSubCategoryCollection(true);
      setIsFormModal(true);
    }
    if (
      !isProductsCollection &&
      props.products &&
      props.products.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListProducts();
      setIsProductsCollection(true);
    }

    if (
      !isCreateProductCollection &&
      props.createProductState &&
      props.createProductState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateProduct();
      setIsCreateProductCollection(true);
    }
    if (
      !isUpdateProductCollection &&
      props.updateProductState &&
      props.updateProductState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateProduct();
      setIsUpdateProductCollection(true);

      if (
        !isDeleteProductCollection &&
        props.deleteProductState &&
        props.deleteProductState.status === ACTION_STATUSES.SUCCEED
      ) {
        props.resetDeleteProduct();
        setIsDeleteProductCollection(true);
      }
    }
  }, [
    isProductsCollection,
    isCreateProductCollection,
    isUpdateProductCollection,
    isDeleteProductCollection,
    isSubCategoryCollection,
    isVendorCollection,
  ]);
  useEffect(() => {
    if (context.userProfile?.companyId) {
      isProductListDone = false;
      props.listProducts({ companyId: context.userProfile?.companyId });
    }
  }, []);

  console.log("[props.Products]", props.products);
  if (
    isProductsCollection &&
    props.products &&
    props.products.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    isProductListDone = true;
    let source = props.products.data;
    if (source && source.length) {
      source = ProductHandler.mapData(source);
      const grands = source.map((map) => map.grand_total);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = ProductHandler.columns().map((col, index) => {
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
    setIsProductsCollection(false);
  }
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
  const deleteRecordItemHandler = (id) => {
    props.deleteProduct(id);
  };
  const createProductHandler = (payload, mode) => {
    console.log("[Create Product Handler]", payload, mode);
    const params = {
      category: payload?.category?.category_name,
      category_id: payload?.category?.category_id,
      subCategory: payload?.category?.item_name,
      subCategory_id: payload?.category?.id,
      qty_uom: payload.uom,
      qty: payload.qty,
      size: payload.size,
      flavor: payload.flavor,
      dimension: payload.dimension,
      item: payload.item,
      description: payload.description,
      unit_price: payload.unitPrice,
      price_per_pcs: payload.pricePerPcs,
      vendor: payload.vendor?.name,
      manufacturer: payload.manufacturer?.name,
      vendorId: payload.vendor?.id,
      manufacturerId: payload.manufacturer?.id,
      count: payload.count,
      unit_distribution: payload.unit,
      qty_distribution: payload.unitQtyUom,
      short_description: payload.shortDescription,
      status: payload.status && payload.status.name === "Active" ? true : false,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    if (mode === "create") {
      params.created_at = new Date();
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };

      forCreateStock = {
        created_at: new Date(),
        item: payload.item,
        dimension: payload.dimension,
        size: payload.size,
        description: payload.description,
        qty_on_hand: 0,
        incoming_qty: 0,
        projected_qty: 0,
        incoming_order_at: new Date(),
        category: payload.categoryName,
        additional_info: "",
        comments: "",
        vendor: payload.vendorName,
        manufacturer: payload.manufacturerName,
      };
      props.createProduct(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateProduct(params);
    }
    setIsFormModal(false);
  };
  console.log("[Is Create Product Collection]", props.createProductState);
  if (
    props.createStockState &&
    props.createStockState.status === ACTION_STATUSES.SUCCEED
  ) {
    props.resetCreateStock();
  }

  if (
    isCreateProductCollection &&
    props.createProductState &&
    props.createProductState.status === ACTION_STATUSES.SUCCEED
  ) {
    console.log("[Product Id]", props.createProductState.data, forCreateStock);
    setIsCreateProductCollection(false);
    showNotification("tc", "success", "Product successfully created.");
    props.listProducts({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateProductCollection &&
    props.updateProductState &&
    props.updateProductState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdateProductCollection(false);
    showNotification("tc", "success", "Product successfully updated.");
    props.listProducts({ companyId: context.userProfile?.companyId });
  }
  if (
    isDeleteProductCollection &&
    props.deleteProductState &&
    props.deleteProductState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsDeleteProductCollection(false);
    isListDone = false;
    showNotification("tc", "success", "Vendor successfully deleted.");
    props.listProducts({ companyId: context.userProfile?.companyId });
  }
  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Keyword 1]", temp, keyword);
      const found = temp.filter(
        (data) =>
          (data.description &&
            data.description.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.item &&
            data.item.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.category &&
            data.category.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.subCategory &&
            data.subCategory.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.vendor &&
            data.vendor.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.manufacturer &&
            data.manufacturer.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1)
      );
      console.log("[Keyword 2]", found);

      setDataSource(found);
    }
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
    let fileName = `product_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
    }
  };
  if (
    isVendorCollection &&
    props.vendors &&
    props.vendors.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsVendorCollection(false);
  }
  if (
    isSubCategoryCollection &&
    props.subCategories?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsSubCategoryCollection(false);
  }
  isListDone = isProductListDone;
  return (
    <React.Fragment>
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
      {!isListDone ? (
        <div>
          <CircularProgress size={20}>Loading...</CircularProgress>
        </div>
      ) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="rose">
                <Grid container justifyContent="space-between">
                  <h4 className={classes.cardTitleWhite}>Product</h4>
                </Grid>
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
                        <AddIcon className={classes.icons} /> Add Product
                      </Button>

                      {isAddGroupButtons && (
                        <Button
                          color="success"
                          className={classes.marginRight}
                          onClick={() => exportToExcelHandler()}
                        >
                          <ImportExport className={classes.icons} /> Export
                          Excel
                        </Button>
                      )}
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
                      isNoDate={true}
                      main={false}
                      search={12}
                    />
                  </Grid>
                </GridContainer>

                <Grid item xs={12}>
                  <HospiceTable
                    main={true}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                    columns={columns}
                    dataSource={dataSource}
                  />
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}

      {isFormModal && (
        <Form
          createProductHandler={createProductHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          subCategoryList={subCategoryList}
          vendorList={vendorList}
          manufacturerList={manufacturerList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  createProductState: productCreateStateSelector(store),
  updateProductState: productUpdateStateSelector(store),
  deleteProductState: productDeleteStateSelector(store),
  createStockState: stockCreateStateSelector(store),
  vendors: vendorListStateSelector(store),
  profileState: profileListStateSelector(store),
  subCategories: subCategoryListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listSubCategories: (data) => dispatch(attemptToFetchSubCategory(data)),
  resetListSubCategories: () => dispatch(resetFetchSubCategoryState()),

  listVendors: (data) => dispatch(attemptToFetchVendor(data)),
  resetListVendors: () => dispatch(resetFetchVendorState()),
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  createProduct: (data) => dispatch(attemptToCreateProduct(data)),
  resetCreateProduct: () => dispatch(resetCreateProductState()),
  updateProduct: (data) => dispatch(attemptToUpdateProduct(data)),
  resetUpdateProduct: () => dispatch(resetUpdateProductState()),
  deleteProduct: (data) => dispatch(attemptToDeleteProduct(data)),
  resetDeleteProduct: () => dispatch(resetDeleteProductState()),
  createStock: (data) => dispatch(attemptToCreateStock(data)),
  resetCreateStock: () => dispatch(resetCreateStockState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductFunction);

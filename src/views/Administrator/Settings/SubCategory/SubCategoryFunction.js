import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import SubCategoryHandler from "./handler/SubCategoryHandler";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Button from "components/CustomButtons/Button.js";
import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import SubCategoryForm from "./components/Form";
import { attemptToUpdateSubCategory } from "store/actions/subCategoryAction";
import TOAST from "modules/toastManager";
import { subCategoryListStateSelector } from "store/selectors/subCategorySelector";
import { subCategoryCreateStateSelector } from "store/selectors/subCategorySelector";
import { subCategoryUpdateStateSelector } from "store/selectors/subCategorySelector";
import { subCategoryDeleteStateSelector } from "store/selectors/subCategorySelector";
import { attemptToFetchSubCategory } from "store/actions/subCategoryAction";
import { resetFetchSubCategoryState } from "store/actions/subCategoryAction";
import { attemptToCreateSubCategory } from "store/actions/subCategoryAction";
import { resetCreateSubCategoryState } from "store/actions/subCategoryAction";
import { resetUpdateSubCategoryState } from "store/actions/subCategoryAction";
import { attemptToDeleteSubCategory } from "store/actions/subCategoryAction";
import { resetDeleteSubCategoryState } from "store/actions/subCategoryAction";
import FilterTable from "components/Table/FilterTable";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { categoryListStateSelector } from "store/selectors/categorySelector";
import { attemptToFetchCategory } from "store/actions/categoryAction";
import { resetFetchCategoryState } from "store/actions/categoryAction";
import { SupaContext } from "App";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar";
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
function SubCategoryFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(SubCategoryHandler.columns(true));
  const [isSubCategoriesCollection, setIsSubCategoriesCollection] = useState(
    true
  );
  const [
    isCreateSubCategoryCollection,
    setIsCreateSubCategoryCollection,
  ] = useState(true);
  const [
    isUpdateSubCategoryCollection,
    setIsUpdateSubCategoryCollection,
  ] = useState(true);
  const [
    isDeleteSubCategoryCollection,
    setIsDeleteSubCategoryCollection,
  ] = useState(true);
  const [isProductCollection, setIsProductCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");
  const [isCategoryCollection, setIsCategoryCollection] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");

    if (context.userProfile?.companyId) {
      props.listCategories({ companyId: context.userProfile?.companyId });
    }
    //   setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isCategoryCollection &&
      props.categories?.status === ACTION_STATUSES.SUCCEED
    ) {
      const arr = props.categories.data;
      arr.forEach((a) => {
        a.label = a.name;
        a.description = a.name;
        a.value = a.name;
        a.category = "category";
      });
      setCategoryList(arr);
      props.resetListCategories();
      setIsCategoryCollection(true);
      setIsFormModal(true);
    }
    if (
      !isSubCategoriesCollection &&
      props.subCategories &&
      props.subCategories.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListSubCategories();
      setIsSubCategoriesCollection(true);
    }

    if (
      !isCreateSubCategoryCollection &&
      props.createSubCategoryState &&
      props.createSubCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateSubCategory();

      setIsCreateSubCategoryCollection(true);
    }
    if (
      !isUpdateSubCategoryCollection &&
      props.updateSubCategoryState &&
      props.updateSubCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateSubCategory();

      setIsUpdateSubCategoryCollection(true);
    }
    if (
      !isDeleteSubCategoryCollection &&
      props.deleteSubCategoryState &&
      props.deleteSubCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteSubCategory();
      setIsDeleteSubCategoryCollection(true);
    }
  }, [
    isDeleteSubCategoryCollection,
    isUpdateSubCategoryCollection,
    isCreateSubCategoryCollection,
    isSubCategoriesCollection,
    isCategoryCollection,
  ]);
  useEffect(() => {
    console.log("list SubCategories");
    if (context.userProfile?.companyId) {
      props.listSubCategories({ companyId: context.userProfile?.companyId });
    }
  }, []);
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
    isSubCategoriesCollection &&
    props.subCategories &&
    props.subCategories.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.subCategories.data;
    if (source && source.length) {
      source = SubCategoryHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = SubCategoryHandler.columns(true).map((col, index) => {
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
    setIsSubCategoriesCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete SubCategory id]", id);
    props.deleteSubCategory(id);
  };
  const createSubCategoryHandler = (payload, mode) => {
    console.log("[Create SubCategory Handler]", payload, mode);
    const { details, general } = payload;
    const rqst = [];
    for (let i = 0; i < details.length; i++) {
      console.log("[Details]", details[i]);
      const params = {
        category_name: general?.category?.name,
        category_id: general?.category?.id,
        item_name: details[i].name,
        item_description: details[i].description,
        companyId: context.userProfile?.companyId,
        updatedUser: {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        },
      };
      if (mode === "create") {
        params.createdUser = {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        };
      } else if (mode === "edit") {
        params.id = details[i].id || general.id;
      }
      rqst.push(params);
    }

    console.log("[RQT]", rqst);

    if (mode === "create") {
      props.createSubCategory(rqst);
    } else if (mode === "edit") {
      props.updateSubCategory(rqst);
    }
    closeFormModalHandler();
  };
  console.log(
    "[Is Create SubCategory Collection]",
    props.createSubCategoryState
  );
  if (
    isCreateSubCategoryCollection &&
    props.createSubCategoryState &&
    props.createSubCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateSubCategoryCollection(false);

    showNotification("tc", "success", "SubCategory successfully created.");
    props.listSubCategories({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateSubCategoryCollection &&
    props.updateSubCategoryState &&
    props.updateSubCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "SubCategory successfully updated.");
    setIsUpdateSubCategoryCollection(false);
    props.listSubCategories({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeleteSubCategory]",
    isDeleteSubCategoryCollection,
    props.deleteSubCategoryState
  );
  if (
    isDeleteSubCategoryCollection &&
    props.deleteSubCategoryState &&
    props.deleteSubCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "SubCategory successfully deleted.");
    setIsDeleteSubCategoryCollection(false);

    props.listSubCategories({ companyId: context.userProfile?.companyId });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Tempt]", temp);
      let found = temp.filter(
        (data) =>
          data.item_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          data.category_name?.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1 ||
          data.item_description.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1
      );

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
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `subcategory_list_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
    }
  };
  console.log("[Props Categories]", props.categories);
  if (
    isCategoryCollection &&
    props.categories?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCategoryCollection(false);
  }
  return (
    <>
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose">
              <Grid container justifyContent="space-between">
                <h4 className={classes.cardTitleWhite}>Sub Category</h4>
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
                      <AddIcon className={classes.icons} /> Add SubCategory
                    </Button>

                    {isAddGroupButtons && (
                      <Button
                        color="success"
                        className={classes.marginRight}
                        onClick={() => exportToExcelHandler()}
                      >
                        <ImportExport className={classes.icons} /> Export Excel
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
      {isFormModal && (
        <SubCategoryForm
          filterRecordHandler={filterRecordHandler}
          categoryList={categoryList}
          dataSource={dataSource}
          createSubCategoryHandler={createSubCategoryHandler}
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

const mapStateToProps = (store) => ({
  categories: categoryListStateSelector(store),
  subCategories: subCategoryListStateSelector(store),
  createSubCategoryState: subCategoryCreateStateSelector(store),
  updateSubCategoryState: subCategoryUpdateStateSelector(store),
  deleteSubCategoryState: subCategoryDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listCategories: (data) => dispatch(attemptToFetchCategory(data)),
  resetListCategories: () => dispatch(resetFetchCategoryState()),
  listSubCategories: (data) => dispatch(attemptToFetchSubCategory(data)),
  resetListSubCategories: () => dispatch(resetFetchSubCategoryState()),
  createSubCategory: (data) => dispatch(attemptToCreateSubCategory(data)),
  resetCreateSubCategory: () => dispatch(resetCreateSubCategoryState()),
  updateSubCategory: (data) => dispatch(attemptToUpdateSubCategory(data)),
  resetUpdateSubCategory: () => dispatch(resetUpdateSubCategoryState()),
  deleteSubCategory: (data) => dispatch(attemptToDeleteSubCategory(data)),
  resetDeleteSubCategory: () => dispatch(resetDeleteSubCategoryState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubCategoryFunction);

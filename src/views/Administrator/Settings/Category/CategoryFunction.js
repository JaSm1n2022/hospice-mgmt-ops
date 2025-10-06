import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import CategoryHandler from "./handler/CategoryHandler";
import { connect } from "react-redux";

import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";

import CategoryForm from "./components/Form";
import { attemptToUpdateCategory } from "store/actions/categoryAction";
import { categoryListStateSelector } from "store/selectors/categorySelector";
import { categoryCreateStateSelector } from "store/selectors/categorySelector";
import { categoryUpdateStateSelector } from "store/selectors/categorySelector";
import { categoryDeleteStateSelector } from "store/selectors/categorySelector";
import { attemptToFetchCategory } from "store/actions/categoryAction";
import { resetFetchCategoryState } from "store/actions/categoryAction";
import { attemptToCreateCategory } from "store/actions/categoryAction";
import { resetCreateCategoryState } from "store/actions/categoryAction";
import { resetUpdateCategoryState } from "store/actions/categoryAction";
import { attemptToDeleteCategory } from "store/actions/categoryAction";
import { resetDeleteCategoryState } from "store/actions/categoryAction";
import FilterTable from "components/Table/FilterTable";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { SupaContext } from "App";
import { handleExport } from "utils/XlsxHelper";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";
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
function CategoryFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [dataSource, setDataSource] = useState([]);
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const [columns, setColumns] = useState(CategoryHandler.columns(true));
  const [isCategoriesCollection, setIsCategoriesCollection] = useState(true);
  const [isCreateCategoryCollection, setIsCreateCategoryCollection] = useState(
    true
  );
  const [isUpdateCategoryCollection, setIsUpdateCategoryCollection] = useState(
    true
  );
  const [isDeleteCategoryCollection, setIsDeleteCategoryCollection] = useState(
    true
  );
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
    if (
      !isCategoriesCollection &&
      props.categories &&
      props.categories.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListCategories();
      setIsCategoriesCollection(true);
    }

    if (
      !isCreateCategoryCollection &&
      props.createCategoryState &&
      props.createCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateCategory();

      setIsCreateCategoryCollection(true);
    }
    if (
      !isUpdateCategoryCollection &&
      props.updateCategoryState &&
      props.updateCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateCategory();

      setIsUpdateCategoryCollection(true);
    }
    if (
      !isDeleteCategoryCollection &&
      props.deleteCategoryState &&
      props.deleteCategoryState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteCategory();
      setIsDeleteCategoryCollection(true);
    }
  }, [
    isDeleteCategoryCollection,
    isUpdateCategoryCollection,
    isCreateCategoryCollection,
    isCategoriesCollection,
  ]);
  useEffect(() => {
    console.log("list Categories");
    if (context.userProfile?.companyId) {
      props.listCategories({ companyId: context.userProfile?.companyId });
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
    isCategoriesCollection &&
    props.categories &&
    props.categories.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.categories.data;
    if (source && source.length) {
      source = CategoryHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = CategoryHandler.columns(true).map((col, index) => {
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
    setIsCategoriesCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Category id]", id);
    props.deleteCategory(id);
  };
  const createCategoryHandler = (payload, mode) => {
    console.log("[Create Category Handler]", payload, mode);
    const params = {
      name: payload.name,
      description: payload.description,

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
      props.createCategory(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateCategory(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Category Collection]", props.createCategoryState);
  if (
    isCreateCategoryCollection &&
    props.createCategoryState &&
    props.createCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateCategoryCollection(false);

    showNotification("tc", "success", "Category successfully created.");
    props.listCategories({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateCategoryCollection &&
    props.updateCategoryState &&
    props.updateCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Category successfully updated.");
    setIsUpdateCategoryCollection(false);
    props.listCategories({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeleteCategory]",
    isDeleteCategoryCollection,
    props.deleteCategoryState
  );
  if (
    isDeleteCategoryCollection &&
    props.deleteCategoryState &&
    props.deleteCategoryState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Category successfully deleted.");
    setIsDeleteCategoryCollection(false);

    props.listCategories({ companyId: context.userProfile?.companyId });
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
          data.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          (data.address &&
            data.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
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
    let fileName = `category_list_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
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
                <h4 className={classes.cardTitleWhite}>Category</h4>
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
                      <AddIcon className={classes.icons} /> Add Category
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
        <CategoryForm
          filterRecordHandler={filterRecordHandler}
          productList={productList}
          dataSource={dataSource}
          createCategoryHandler={createCategoryHandler}
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
  createCategoryState: categoryCreateStateSelector(store),
  updateCategoryState: categoryUpdateStateSelector(store),
  deleteCategoryState: categoryDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listCategories: (data) => dispatch(attemptToFetchCategory(data)),
  resetListCategories: () => dispatch(resetFetchCategoryState()),
  createCategory: (data) => dispatch(attemptToCreateCategory(data)),
  resetCreateCategory: () => dispatch(resetCreateCategoryState()),
  updateCategory: (data) => dispatch(attemptToUpdateCategory(data)),
  resetUpdateCategory: () => dispatch(resetUpdateCategoryState()),
  deleteCategory: (data) => dispatch(attemptToDeleteCategory(data)),
  resetDeleteCategory: () => dispatch(resetDeleteCategoryState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFunction);

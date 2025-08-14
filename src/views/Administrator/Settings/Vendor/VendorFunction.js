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

import VendorHandler from "./handler/VendorHandler";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";

import { attemptToUpdateVendor } from "store/actions/vendorAction";
import TOAST from "modules/toastManager";
import { vendorListStateSelector } from "store/selectors/vendorSelector";
import { vendorCreateStateSelector } from "store/selectors/vendorSelector";
import { vendorUpdateStateSelector } from "store/selectors/vendorSelector";
import { vendorDeleteStateSelector } from "store/selectors/vendorSelector";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { resetFetchVendorState } from "store/actions/vendorAction";
import { attemptToCreateVendor } from "store/actions/vendorAction";
import { resetCreateVendorState } from "store/actions/vendorAction";
import { resetUpdateVendorState } from "store/actions/vendorAction";
import { attemptToDeleteVendor } from "store/actions/vendorAction";
import { resetDeleteVendorState } from "store/actions/vendorAction";
import FilterTable from "components/Table/FilterTable";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { categoryListStateSelector } from "store/selectors/categorySelector";
import { attemptToFetchCategory } from "store/actions/categoryAction";
import { resetFetchCategoryState } from "store/actions/categoryAction";
import VendorForm from "./components/VendorForm";
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
let userProfile = {};
let originalSource = undefined;
function VendorFunction(props) {
  const classes = useStyles();

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(VendorHandler.columns(true));
  const [isVendorsCollection, setIsVendorsCollection] = useState(true);
  const [isCreateVendorCollection, setIsCreateVendorCollection] = useState(
    true
  );
  const [isUpdateVendorCollection, setIsUpdateVendorCollection] = useState(
    true
  );
  const [isDeleteVendorCollection, setIsDeleteVendorCollection] = useState(
    true
  );
  const [isCategoryCollection, setIsCategoryCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      console.log("[List Categories]");
      props.listCategories({ companyId: userProfile.companyId });
    }
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
      !isVendorsCollection &&
      props.vendors &&
      props.vendors.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListVendors();
      setIsVendorsCollection(true);
    }

    if (
      !isCreateVendorCollection &&
      props.createVendorState &&
      props.createVendorState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateVendor();

      setIsCreateVendorCollection(true);
    }
    if (
      !isUpdateVendorCollection &&
      props.updateVendorState &&
      props.updateVendorState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateVendor();

      setIsUpdateVendorCollection(true);
    }
    if (
      !isDeleteVendorCollection &&
      props.deleteVendorState &&
      props.deleteVendorState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteVendor();
      setIsDeleteVendorCollection(true);
    }
  }, [
    isDeleteVendorCollection,
    isUpdateVendorCollection,
    isCreateVendorCollection,
    isVendorsCollection,
    isCategoryCollection,
  ]);
  useEffect(() => {
    console.log("list Vendors");
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listVendors({ companyId: userProfile.companyId });
    }
  }, []);

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
    isVendorsCollection &&
    props.vendors &&
    props.vendors.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.vendors.data;
    if (source && source.length) {
      source = VendorHandler.mapData(source, productList);
    }

    const cols = VendorHandler.columns(true).map((col, index) => {
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
    setIsVendorsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Vendor id]", id);
    props.deleteVendor(id);
  };
  const createVendorHandler = (payload, mode) => {
    console.log("[Create Vendor Handler]", payload, mode);
    const params = {
      address: payload.address,
      contactPerson: payload.contactPerson,

      fax: payload.fax,
      contactPerson: payload.contactPerson,
      phone: payload.phone,
      vendorCd: payload.vendorCd,
      categoryId: payload.categoryType?.id,
      name: payload.name,
      categoryType: payload.categoryType.name,
      website: payload.website || "",

      companyId: userProfile.companyId,
      updatedUser: {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      },
    };
    if (mode === "create") {
      params.createdAt = new Date();
      params.createdUser = {
        name: userProfile.name,
        userId: userProfile.id,
        date: new Date(),
      };

      props.createVendor(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateVendor(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Vendor Collection]", props.createVendorState);
  if (
    isCreateVendorCollection &&
    props.createVendorState &&
    props.createVendorState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateVendorCollection(false);
    TOAST.ok("Vendor successfully created.");
    props.listVendors({ companyId: userProfile.companyId });
  }
  if (
    isUpdateVendorCollection &&
    props.updateVendorState &&
    props.updateVendorState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Vendor successfully updated.");
    setIsUpdateVendorCollection(false);
    props.listVendors({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteVendor]",
    isDeleteVendorCollection,
    props.deleteVendorState
  );
  if (
    isDeleteVendorCollection &&
    props.deleteVendorState &&
    props.deleteVendorState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Vendor successfully deleted.");
    setIsDeleteVendorCollection(false);

    props.listVendors({ companyId: userProfile.companyId });
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
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `Vendor_list_batch_${new Date().getTime()}`;

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
  if (
    isCategoryCollection &&
    props.categories?.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCategoryCollection(false);
  }
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <Grid container justifyContent="space-between">
                <h4 className={classes.cardTitleWhite}>Vendor Setup</h4>
              </Grid>
            </CardHeader>
            <CardBody>
              <Grid
                container
                justifyContent="space-between"
                style={{ paddingBottom: 4 }}
              >
                <div
                  style={{ display: "inline-flex", gap: 10, paddingTop: 10 }}
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
                    ADD VENDOR
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
                <div>
                  <FilterTable
                    filterRecordHandler={filterRecordHandler}
                    isNoDate={true}
                    main={false}
                  />
                </div>
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
      {isFormModal && (
        <VendorForm
          filterRecordHandler={filterRecordHandler}
          categoryList={categoryList}
          dataSource={dataSource}
          createVendorHandler={createVendorHandler}
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
  vendors: vendorListStateSelector(store),
  createVendorState: vendorCreateStateSelector(store),
  updateVendorState: vendorUpdateStateSelector(store),
  deleteVendorState: vendorDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listCategories: (data) => dispatch(attemptToFetchCategory(data)),
  resetListCategories: () => dispatch(resetFetchCategoryState()),
  listVendors: (data) => dispatch(attemptToFetchVendor(data)),
  resetListVendors: () => dispatch(resetFetchVendorState()),
  createVendor: (data) => dispatch(attemptToCreateVendor(data)),
  resetCreateVendor: () => dispatch(resetCreateVendorState()),
  updateVendor: (data) => dispatch(attemptToUpdateVendor(data)),
  resetUpdateVendor: () => dispatch(resetUpdateVendorState()),
  deleteVendor: (data) => dispatch(attemptToDeleteVendor(data)),
  resetDeleteVendor: () => dispatch(resetDeleteVendorState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VendorFunction);

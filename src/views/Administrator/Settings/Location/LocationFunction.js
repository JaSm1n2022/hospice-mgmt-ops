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

import LocationHandler from "./handler/LocationHandler";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Button, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport, StayPrimaryLandscapeOutlined } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import LocationForm from "./components/LocationForm";
import { attemptToUpdateLocation } from "store/actions/locationAction";
import TOAST from "modules/toastManager";
import { locationListStateSelector } from "store/selectors/locationSelector";
import { locationCreateStateSelector } from "store/selectors/locationSelector";
import { locationUpdateStateSelector } from "store/selectors/locationSelector";
import { locationDeleteStateSelector } from "store/selectors/locationSelector";
import { attemptToFetchLocation } from "store/actions/locationAction";
import { resetFetchLocationState } from "store/actions/locationAction";
import { attemptToCreateLocation } from "store/actions/locationAction";
import { resetCreateLocationState } from "store/actions/locationAction";
import { resetUpdateLocationState } from "store/actions/locationAction";
import { attemptToDeleteLocation } from "store/actions/locationAction";
import { resetDeleteLocationState } from "store/actions/locationAction";
import FilterTable from "components/Table/FilterTable";
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
function LocationFunction(props) {
  const classes = useStyles();

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(LocationHandler.columns(true));
  const [isLocationsCollection, setIsLocationsCollection] = useState(true);
  const [isCreateLocationCollection, setIsCreateLocationCollection] = useState(
    true
  );
  const [isUpdateLocationCollection, setIsUpdateLocationCollection] = useState(
    true
  );
  const [isDeleteLocationCollection, setIsDeleteLocationCollection] = useState(
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
      !isLocationsCollection &&
      props.locations &&
      props.locations.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListLocations();
      setIsLocationsCollection(true);
    }

    if (
      !isCreateLocationCollection &&
      props.createLocationState &&
      props.createLocationState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateLocation();

      setIsCreateLocationCollection(true);
    }
    if (
      !isUpdateLocationCollection &&
      props.updateLocationState &&
      props.updateLocationState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateLocation();

      setIsUpdateLocationCollection(true);
    }
    if (
      !isDeleteLocationCollection &&
      props.deleteLocationState &&
      props.deleteLocationState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteLocation();
      setIsDeleteLocationCollection(true);
    }
  }, [
    isDeleteLocationCollection,
    isUpdateLocationCollection,
    isCreateLocationCollection,
    isLocationsCollection,
  ]);
  useEffect(() => {
    console.log("list Locations");
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listLocations({ companyId: userProfile.companyId });
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
    isLocationsCollection &&
    props.locations &&
    props.locations.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.locations.data;
    if (source && source.length) {
      source = LocationHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = LocationHandler.columns(true).map((col, index) => {
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
    setIsLocationsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Location id]", id);
    props.deleteLocation(id);
  };
  const createLocationHandler = (payload, mode) => {
    console.log("[Create Location Handler]", payload, mode);
    const params = {
      address: payload.address,
      contactPerson: payload.contactPerson,

      fax: payload.fax,
      contactPerson: payload.contactPerson,
      phone: payload.phone,
      locationCd: payload.locationCd,
      name: payload.name,
      locationType: payload.locationType.name,

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
      props.createLocation(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateLocation(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Location Collection]", props.createLocationState);
  if (
    isCreateLocationCollection &&
    props.createLocationState &&
    props.createLocationState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateLocationCollection(false);
    TOAST.ok("Location successfully created.");
    props.listLocations({ companyId: userProfile.companyId });
  }
  if (
    isUpdateLocationCollection &&
    props.updateLocationState &&
    props.updateLocationState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Location successfully updated.");
    setIsUpdateLocationCollection(false);
    props.listLocations({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteLocation]",
    isDeleteLocationCollection,
    props.deleteLocationState
  );
  if (
    isDeleteLocationCollection &&
    props.deleteLocationState &&
    props.deleteLocationState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Location successfully deleted.");
    setIsDeleteLocationCollection(false);

    props.listLocations({ companyId: userProfile.companyId });
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
    let fileName = `Location_list_batch_${new Date().getTime()}`;

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
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <Grid container justifyContent="space-between">
                <h4 className={classes.cardTitleWhite}>Location Setup</h4>
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
                    ADD Location
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
        <LocationForm
          filterRecordHandler={filterRecordHandler}
          productList={productList}
          dataSource={dataSource}
          createLocationHandler={createLocationHandler}
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
  locations: locationListStateSelector(store),
  createLocationState: locationCreateStateSelector(store),
  updateLocationState: locationUpdateStateSelector(store),
  deleteLocationState: locationDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listLocations: (data) => dispatch(attemptToFetchLocation(data)),
  resetListLocations: () => dispatch(resetFetchLocationState()),
  createLocation: (data) => dispatch(attemptToCreateLocation(data)),
  resetCreateLocation: () => dispatch(resetCreateLocationState()),
  updateLocation: (data) => dispatch(attemptToUpdateLocation(data)),
  resetUpdateLocation: () => dispatch(resetUpdateLocationState()),
  deleteLocation: (data) => dispatch(attemptToDeleteLocation(data)),
  resetDeleteLocation: () => dispatch(resetDeleteLocationState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationFunction);

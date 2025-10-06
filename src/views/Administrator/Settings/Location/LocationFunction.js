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

import LocationHandler from "./handler/LocationHandler";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button.js";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Grid, Typography } from "@material-ui/core";
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
import { handleExport } from "utils/XlsxHelper";
import { SupaContext } from "App";
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

function LocationFunction(props) {
  const classes = useStyles();
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const context = useContext(SupaContext);
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
    if (context.userProfile?.companyId) {
      props.listLocations({ companyId: context.userProfile?.companyId });
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

      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    if (mode === "create") {
      params.createdAt = new Date();
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
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
    showNotification("tc", "success", "Location successfully created.");
    props.listLocations({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateLocationCollection &&
    props.updateLocationState &&
    props.updateLocationState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Location successfully updated.");
    setIsUpdateLocationCollection(false);
    props.listLocations({ companyId: context.userProfile?.companyId });
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
    showNotification("tc", "success", "Location successfully deleted.");
    setIsDeleteLocationCollection(false);

    props.listLocations({ companyId: context.userProfile?.companyId });
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
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `location_list_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
    }
  };
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose">
              <Grid container justifyContent="space-between">
                <h4 className={classes.cardTitleWhite}>Location Setup</h4>
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
                      <AddIcon className={classes.icons} /> Add Location
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

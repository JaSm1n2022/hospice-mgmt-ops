import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import EquipmentHandler from "./components/EquipmentHandler";
import { connect } from "react-redux";
import { productListStateSelector } from "store/selectors/productSelector";
import { equipmentListStateSelector } from "store/selectors/equipmentSelector";
import { equipmentCreateStateSelector } from "store/selectors/equipmentSelector";
import { equipmentDeleteStateSelector } from "store/selectors/equipmentSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { attemptToFetchEquipment } from "store/actions/equipmentAction";
import { resetFetchEquipmentState } from "store/actions/equipmentAction";
import { attemptToCreateEquipment } from "store/actions/equipmentAction";
import { resetCreateEquipmentState } from "store/actions/equipmentAction";
import { resetUpdateEquipmentState } from "store/actions/equipmentAction";
import { attemptToDeleteEquipment } from "store/actions/equipmentAction";
import { resetDeleteEquipmentState } from "store/actions/equipmentAction";
import { equipmentUpdateStateSelector } from "store/selectors/equipmentSelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress, Grid, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { SupaContext } from "App";
import HospiceTable from "components/Table/HospiceTable";
import { CheckCircle, HelpOutline, ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import EquipmentForm from "./components/EquipmentForm";
import { attemptToUpdateEquipment } from "store/actions/equipmentAction";
import TOAST from "modules/toastManager";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { v4 as uuidv4 } from "uuid";
import { vendorListStateSelector } from "store/selectors/vendorSelector";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { resetFetchVendorState } from "store/actions/vendorAction";
import { attemptToFetchLocation } from "store/actions/locationAction";
import { resetFetchLocationState } from "store/actions/locationAction";
import { locationListStateSelector } from "store/selectors/locationSelector";
import moment from "moment";
import { profileListStateSelector } from "store/selectors/profileSelector";
import DmeOrderDocument from "views/Administrator/Document/DmeOrderDocument";
import { handleExport } from "utils/XlsxHelper";
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
let patientList = [];
let vendorList = [];
let locationList = [];
let isProcessDone = true;
let isPatientListDone = true;
let isEquipmentListDone = true;
let isVendorDone = true;
let isLocationDone = true;

function EquipmentFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [isPrint, setIsPrint] = useState(false);
  const [printData, setPrintData] = useState(false);
  const [columns, setColumns] = useState(EquipmentHandler.columns(main));
  const [isEquipmentsCollection, setIsEquipmentsCollection] = useState(true);
  const [isLocationCollection, setIsLocationCollection] = useState(true);
  const [
    isCreateEquipmentCollection,
    setIsCreateEquipmentCollection,
  ] = useState(true);
  const [
    isUpdateEquipmentCollection,
    setIsUpdateEquipmentCollection,
  ] = useState(true);
  const [
    isDeleteEquipmentCollection,
    setIsDeleteEquipmentCollection,
  ] = useState(true);
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
      isDeleteEquipmentCollection,
      props.deleteEquipmentState.status
    );

    if (
      !isEquipmentsCollection &&
      props.equipments &&
      props.equipments.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListEquipments();

      setIsEquipmentsCollection(true);
    }

    if (
      !isCreateEquipmentCollection &&
      props.createEquipmentState &&
      props.createEquipmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateEquipment();

      setIsCreateEquipmentCollection(true);
    }
    if (
      !isUpdateEquipmentCollection &&
      props.updateEquipmentState &&
      props.updateEquipmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateEquipment();

      setIsUpdateEquipmentCollection(true);
    }
    if (
      !isDeleteEquipmentCollection &&
      props.deleteEquipmentState &&
      props.deleteEquipmentState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteEquipment();
      setIsDeleteEquipmentCollection(true);
    }
    if (
      !isLocationCollection &&
      props.locations &&
      props.locations.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetListLocations();
      setIsLocationCollection(true);
    }
  }, [
    isEquipmentsCollection,
    isLocationCollection,
    isCreateEquipmentCollection,
    isUpdateEquipmentCollection,
    isDeleteEquipmentCollection,
  ]);
  useEffect(() => {
    console.log("list equipments", props.main);
    isEquipmentListDone = false;

    if (context.userProfile?.companyId) {
      props.listEquipments({ companyId: context.userProfile?.companyId });
    }
  }, []);
  useEffect(() => {
    console.log("[Props.main]", props.main);
    if (props.main) {
      isPatientListDone = false;
      isVendorDone = false;
      isLocationDone = false;
      console.log("[List Patients]");
      if (context.userProfile?.companyId) {
        props.listPatients({ companyId: context.userProfile?.companyId });
        props.listLocations({ companyId: context.userProfile?.companyId });
        props.listVendors({ companyId: context.userProfile?.companyId });
      }
    } else {
      isPatientListDone = true;
    }
  }, [props.main]);
  console.log("[props.Equipments]", props.equipments, props.patients);

  const printHandler = (item) => {
    console.log("[Item]", item);
    setPrintData(item);
    setIsPrint(true);
  };
  const closePrintModalHandler = () => {
    setIsPrint(false);
  };
  if (
    isEquipmentsCollection &&
    props.equipments &&
    props.equipments.status === ACTION_STATUSES.SUCCEED
  ) {
    isEquipmentListDone = true;
    grandTotal = 0.0;
    let source = props.equipments.data;
    if (source && source.length) {
      source = EquipmentHandler.mapData(source, productList);
    }

    const cols = EquipmentHandler.columns(main).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              printHandler={printHandler}
              data={{ ...cellProps.data }}
              isPrintFunction={true}
            />
          ),
        };
      }
      if (["patientCd"].includes(col.name)) {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <div style={{ display: "inline-flex", gap: 2 }}>
              {cellProps.data[col.name]}
            </div>
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
    // source = sortByWorth(source);
    setDataSource(source);
    setIsEquipmentsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Equipment id]", id);
    props.deleteEquipment(id);
  };
  const createEquipmentHandler = (payload, mode) => {
    console.log("[Create Equipment Handler]", payload, mode);
    const params = {
      patient: {
        id: payload.patient.id,
        code: payload.patient.patientCd,
      },
      serviceLocation: payload.serviceLocation,
      serviceType: payload.serviceType.value,

      vendor: {
        name: payload.vendor.name,
        id: payload.vendor.id,
      },

      deliveryNotes: payload.deliveryNotes,
      details: payload.checklist.filter((c) => c.description),
      contactNo: payload.contactNo,
      contactName: payload.contactName,
      pickupNotes: payload.pickupNotes,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };
    if (payload.deliveryDt) {
      params.deliveryDt = `${moment(payload.deliveryDt)
        .utc()
        .format("YYYY-MM-DD")}T${payload.deliveryTm}:00.000Z`;
    }
    if (payload.pickupDt) {
      params.pickupDt = `${moment(payload.pickupDt)
        .utc()
        .format("YYYY-MM-DD")}T${payload.pickupTm}:00.000Z`;
    }
    console.log("[Params]", params);
    if (mode === "create") {
      params.created_at = new Date();
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };
      props.createEquipment(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateEquipment(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Equipment Collection]", props.createEquipmentState);
  if (
    isCreateEquipmentCollection &&
    props.createEquipmentState &&
    props.createEquipmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    isEquipmentListDone = true;
    setIsCreateEquipmentCollection(false);
    closeFormModalHandler();
    TOAST.ok("Equipment successfully created.");
    props.listEquipments({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateEquipmentCollection &&
    props.updateEquipmentState &&
    props.updateEquipmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Equipment successfully updated.");
    setIsUpdateEquipmentCollection(false);
    props.listEquipments({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeleteEquipment]",
    isDeleteEquipmentCollection,
    props.deleteEquipmentState
  );
  if (
    isDeleteEquipmentCollection &&
    props.deleteEquipmentState &&
    props.deleteEquipmentState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Equipment successfully deleted.");
    setIsDeleteEquipmentCollection(false);

    props.listEquipments({ companyId: context.userProfile?.companyId });
  }

  if (
    props.main &&
    props.patients &&
    props.patients.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;
    patientList = props.patients.data;
    console.log("[props.patients.data]", props.patients.data);
    props.resetListPatients();
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
          (data.patientCd &&
            data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.vendorName &&
            data.vendorName.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.equipmentList &&
            data.equipmentList.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1)
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
    //  dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `dme_list_batch_${new Date().getTime()}`;

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

  if (
    props.main &&
    props.vendors &&
    props.vendors.status === ACTION_STATUSES.SUCCEED
  ) {
    isVendorDone = true;
    vendorList = props.vendors.data;
    props.resetListVendors();
  }
  if (
    props.main &&
    isLocationCollection &&
    props.locations &&
    props.locations.status === ACTION_STATUSES.SUCCEED
  ) {
    isLocationDone = true;
    locationList = props.locations.data;
    setIsLocationCollection(false);
    //   props.resetListVendors();
  }
  console.log("[done equipment]", isPatientListDone, isEquipmentListDone);
  isProcessDone = isPatientListDone && isEquipmentListDone && isVendorDone;

  return (
    <>
      {!isProcessDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <div>
          {main ? (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="success">
                    <Grid container justifyContent="space-between">
                      <h4 className={classes.cardTitleWhite}>
                        Equipment Management
                      </h4>
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
                          color="info"
                          size={"sm"}
                          className={classes.marginRight}
                          onClick={() => createFormHandler()}
                        >
                          <AddIcon className={classes.icons} /> Add DME
                        </Button>

                        {isAddGroupButtons && (
                          <Button
                            size={"sm"}
                            color="success"
                            className={classes.marginRight}
                            onClick={() => exportToExcelHandler()}
                          >
                            <ImportExport className={classes.icons} /> Export
                            Excel
                          </Button>
                        )}
                        <div style={{ paddingTop: 4, width: "300px" }}>
                          <SearchCustomTextField
                            background={"white"}
                            onChange={inputHandler}
                            placeholder={"Search Item"}
                            label={"Search Item"}
                            name={"keywordValue"}
                            height={36}
                            onPressEnterKeyHandler={onPressEnterKeyHandler}
                            isAllowEnterKey={true}
                            value={keywordValue}
                          />
                        </div>
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
          {isPrint && (
            <DmeOrderDocument
              isOpen={isPrint}
              printData={printData}
              closePrintModalHandler={closePrintModalHandler}
            />
          )}
        </div>
      )}
      {isFormModal && (
        <EquipmentForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createEquipmentHandler={createEquipmentHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          item={item}
          vendorList={vendorList}
          locationList={locationList}
          patientList={patientList}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  locations: locationListStateSelector(store),
  patients: patientListStateSelector(store),
  vendors: vendorListStateSelector(store),
  equipments: equipmentListStateSelector(store),
  createEquipmentState: equipmentCreateStateSelector(store),
  updateEquipmentState: equipmentUpdateStateSelector(store),
  deleteEquipmentState: equipmentDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listLocations: (data) => dispatch(attemptToFetchLocation(data)),
  resetListLocations: () => dispatch(resetFetchLocationState()),
  listVendors: (data) => dispatch(attemptToFetchVendor(data)),
  resetListVendors: () => dispatch(resetFetchVendorState()),
  listEquipments: (data) => dispatch(attemptToFetchEquipment(data)),
  resetListEquipments: () => dispatch(resetFetchEquipmentState()),
  createEquipment: (data) => dispatch(attemptToCreateEquipment(data)),
  resetCreateEquipment: () => dispatch(resetCreateEquipmentState()),
  updateEquipment: (data) => dispatch(attemptToUpdateEquipment(data)),
  resetUpdateEquipment: () => dispatch(resetUpdateEquipmentState()),
  deleteEquipment: (data) => dispatch(attemptToDeleteEquipment(data)),
  resetDeleteEquipment: () => dispatch(resetDeleteEquipmentState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentFunction);

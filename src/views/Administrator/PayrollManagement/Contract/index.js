import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import ContractHandler from "./components/ContractHandler";
import { connect } from "react-redux";
import { contractListStateSelector } from "store/selectors/contractSelector";
import { contractCreateStateSelector } from "store/selectors/contractSelector";
import { contractDeleteStateSelector } from "store/selectors/contractSelector";

import { attemptToFetchContract } from "store/actions/contractAction";
import { resetFetchContractState } from "store/actions/contractAction";
import { attemptToCreateContract } from "store/actions/contractAction";
import { resetCreateContractState } from "store/actions/contractAction";
import { resetUpdateContractState } from "store/actions/contractAction";
import { attemptToDeleteContract } from "store/actions/contractAction";
import { resetDeleteContractState } from "store/actions/contractAction";
import { contractUpdateStateSelector } from "store/selectors/contractSelector";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import ContractForm from "./components/ContractForm";
import { attemptToUpdateContract } from "store/actions/contractAction";
import TOAST from "modules/toastManager";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { exportToXlsx } from "utils/XlsxHelper";
import { SupaContext } from "App";
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
let employeeList = [];
let patientList = [];

let originalSource = undefined;

let isContractListDone = false;
let isEmployeeListDone = false;
let isPatientListDone = false;
let isLoadingDone = false;
function ContractFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(ContractHandler.columns(main));
  const [isContractsCollection, setIsContractsCollection] = useState(true);
  const [isCreateContractCollection, setIsCreateContractCollection] = useState(
    true
  );
  const [isUpdateContractCollection, setIsUpdateContractCollection] = useState(
    true
  );
  const [isDeleteContractCollection, setIsDeleteContractCollection] = useState(
    true
  );
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
      isDeleteContractCollection,
      props.deleteContractState.status
    );

    if (
      !isContractsCollection &&
      props.contracts &&
      props.contracts.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListContracts();

      setIsContractsCollection(true);
    }

    if (
      !isCreateContractCollection &&
      props.createContractState &&
      props.createContractState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateContract();

      setIsCreateContractCollection(true);
    }
    if (
      !isUpdateContractCollection &&
      props.updateContractState &&
      props.updateContractState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateContract();

      setIsUpdateContractCollection(true);
    }
    if (
      !isDeleteContractCollection &&
      props.deleteContractState &&
      props.deleteContractState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteContract();
      setIsDeleteContractCollection(true);
    }
  }, [
    isContractsCollection,
    isCreateContractCollection,
    isUpdateContractCollection,
    isDeleteContractCollection,
  ]);
  useEffect(() => {
    console.log("list contracts");
    isContractListDone = false;
    isLoadingDone = false;
    isEmployeeListDone = false;
    isPatientListDone = false;
    if (context.userProfile?.companyId) {
      props.listEmployees({ companyId: context.userProfile?.companyId });
      props.listContracts({ companyId: context.userProfile?.companyId });
      props.listPatients({ companyId: context.userProfile?.companyId });
    }
  }, []);

  if (props.employees && props.employees.status === ACTION_STATUSES.SUCCEED) {
    isEmployeeListDone = true;
    employeeList = props.employees.data;

    props.resetListEmployees();
  }
  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    isPatientListDone = true;
    patientList = props.patients.data;
    props.resetListPatients();
  }
  if (
    isContractsCollection &&
    props.contracts &&
    props.contracts.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.contracts.data;
    if (source && source.length) {
      source = ContractHandler.mapData(source);
    }

    const cols = ContractHandler.columns(main).map((col, index) => {
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
    isContractListDone = true;
    setIsContractsCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete contract id]", id);
    props.deleteContract(id);
  };
  const createContractHandler = (payload, mode) => {
    console.log("[Create Contract Handler]", payload, mode);
    const params = {
      companyId: context.userProfile?.companyId,
      employeeId: payload.employee?.id,
      employeeName: payload.employee?.name,
      employeeTitle: payload.employee?.position,
      employeeType: payload.employee?.employeeType,
      patientId: payload.patient?.id || "",
      patientCd: payload.patient?.patientCd || "",
      serviceType: payload.serviceType?.value,
      serviceCd: payload.serviceType?.code,
      serviceRate: payload.serviceRate,
      serviceRateType: payload.rateType?.name,
      comments: payload.comments,
      isMileageRate: payload.isMileageRate || false,
      maxReimbursement: payload.maxReimbursement || 0,
      mileageRate: payload.mileageRate || 0,
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
      props.createContract(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateContract(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Contract Collection]", props.createContractState);
  if (
    isCreateContractCollection &&
    props.createContractState &&
    props.createContractState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateContractCollection(false);
    TOAST.ok("Contract successfully created.");
    props.listContracts({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateContractCollection &&
    props.updateContractState &&
    props.updateContractState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Contract successfully updated.");
    setIsUpdateContractCollection(false);
    props.listContracts({ companyId: context.userProfile?.companyId });
  }
  console.log(
    "[isDeleteContract]",
    isDeleteContractCollection,
    props.deleteContractState
  );
  if (
    isDeleteContractCollection &&
    props.deleteContractState &&
    props.deleteContractState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Contract successfully deleted.");
    setIsDeleteContractCollection(false);

    props.listContracts({ companyId: context.userProfile?.companyId });
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword, originalSource);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      console.log("[Tempt]", temp);
      let found = temp.filter(
        (data) =>
          data.employeeName?.toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1 ||
          (data.patientCd &&
            data.patientCd?.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.serviceType &&
            data.serviceType?.toLowerCase().indexOf(keyword.toLowerCase()) !==
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
    setDataSource(dtSource);
  };

  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `contract_list_batch_${new Date().getTime()}`;

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
  isLoadingDone = isContractListDone && isEmployeeListDone && isPatientListDone;
  return (
    <>
      {!isLoadingDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="warning">
                <Grid container justifyContent="space-between">
                  <h4 className={classes.cardTitleWhite}>
                    Contract Management
                  </h4>
                </Grid>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} md={12}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: 10,
                      }}
                    >
                      <Button
                        color="info"
                        className={classes.marginRight}
                        onClick={() => createFormHandler()}
                      >
                        <AddIcon className={classes.icons} /> Add Contract
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
                  </GridItem>
                  <GridItem xs={12}>
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
                  </GridItem>
                </GridContainer>
                <div style={{ paddingTop: 8 }}>
                  <HospiceTable
                    columns={columns}
                    main={true}
                    dataSource={dataSource}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                  />
                </div>
                ;
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
      {isFormModal && isLoadingDone && (
        <ContractForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createContractHandler={createContractHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          employeeList={employeeList}
          patientList={patientList}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}

ContractFunction.defaultProps = {
  main: false,
};
ContractFunction.propTypes = {
  main: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  contracts: contractListStateSelector(store),
  createContractState: contractCreateStateSelector(store),
  updateContractState: contractUpdateStateSelector(store),
  deleteContractState: contractDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),

  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),

  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
  createContract: (data) => dispatch(attemptToCreateContract(data)),
  resetCreateContract: () => dispatch(resetCreateContractState()),
  updateContract: (data) => dispatch(attemptToUpdateContract(data)),
  resetUpdateContract: () => dispatch(resetUpdateContractState()),
  deleteContract: (data) => dispatch(attemptToDeleteContract(data)),
  resetDeleteContract: () => dispatch(resetDeleteContractState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractFunction);

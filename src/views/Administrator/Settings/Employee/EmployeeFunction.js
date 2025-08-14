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

import EmployeeHandler from "./handler/EmployeeHandler";
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
import EmployeeForm from "./components/EmployeeForm";
import { attemptToUpdateEmployee } from "store/actions/employeeAction";
import TOAST from "modules/toastManager";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { employeeCreateStateSelector } from "store/selectors/employeeSelector";
import { employeeUpdateStateSelector } from "store/selectors/employeeSelector";
import { employeeDeleteStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToCreateEmployee } from "store/actions/employeeAction";
import { resetCreateEmployeeState } from "store/actions/employeeAction";
import { resetUpdateEmployeeState } from "store/actions/employeeAction";
import { attemptToDeleteEmployee } from "store/actions/employeeAction";
import { resetDeleteEmployeeState } from "store/actions/employeeAction";
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
let userProfile = {};
let originalSource = undefined;
function EmployeeFunction(props) {
  const classes = useStyles();

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(EmployeeHandler.columns(true));
  const [isEmployeesCollection, setIsEmployeesCollection] = useState(true);
  const [isCreateEmployeeCollection, setIsCreateEmployeeCollection] = useState(
    true
  );
  const [isUpdateEmployeeCollection, setIsUpdateEmployeeCollection] = useState(
    true
  );
  const [isDeleteEmployeeCollection, setIsDeleteEmployeeCollection] = useState(
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
      !isEmployeesCollection &&
      props.employees &&
      props.employees.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListEmployees();
      setIsEmployeesCollection(true);
    }

    if (
      !isCreateEmployeeCollection &&
      props.createEmployeeState &&
      props.createEmployeeState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateEmployee();

      setIsCreateEmployeeCollection(true);
    }
    if (
      !isUpdateEmployeeCollection &&
      props.updateEmployeeState &&
      props.updateEmployeeState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateEmployee();

      setIsUpdateEmployeeCollection(true);
    }
    if (
      !isDeleteEmployeeCollection &&
      props.deleteEmployeeState &&
      props.deleteEmployeeState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeleteEmployee();
      setIsDeleteEmployeeCollection(true);
    }
  }, [
    isDeleteEmployeeCollection,
    isUpdateEmployeeCollection,
    isCreateEmployeeCollection,
    isEmployeesCollection,
  ]);
  useEffect(() => {
    console.log("list Employees");
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listEmployees({ companyId: userProfile.companyId });
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
    isEmployeesCollection &&
    props.employees &&
    props.employees.status === ACTION_STATUSES.SUCCEED
  ) {
    grandTotal = 0.0;
    let source = props.employees.data;
    if (source && source.length) {
      source = EmployeeHandler.mapData(source, productList);
      const grands = source.map((map) => map.worth);
      grands.forEach((g) => {
        grandTotal += parseFloat(g) || 0.0;
      });
    }

    const cols = EmployeeHandler.columns(true).map((col, index) => {
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
    setIsEmployeesCollection(false);
  }
  const deleteRecordItemHandler = (id) => {
    console.log("[delete Employee id]", id);
    props.deleteEmployee(id);
  };
  const createEmployeeHandler = (payload, mode) => {
    console.log("[Create Employee Handler]", payload, mode);
    const params = {
      email: payload.email,
      employeeId: payload.employeeId,
      phone: payload.phone,
      employeeType: payload.employeeType.value,
      name: `${payload.fn} ${payload.ln}`,
      fn: payload.fn,
      ln: payload.ln,
      position: payload.position.value,

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
      props.createEmployee(params);
    } else if (mode === "edit") {
      params.id = payload.id;
      props.updateEmployee(params);
    }
    closeFormModalHandler();
  };
  console.log("[Is Create Employee Collection]", props.createEmployeeState);
  if (
    isCreateEmployeeCollection &&
    props.createEmployeeState &&
    props.createEmployeeState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreateEmployeeCollection(false);
    TOAST.ok("Employee successfully created.");
    props.listEmployees({ companyId: userProfile.companyId });
  }
  if (
    isUpdateEmployeeCollection &&
    props.updateEmployeeState &&
    props.updateEmployeeState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Employee successfully updated.");
    setIsUpdateEmployeeCollection(false);
    props.listEmployees({ companyId: userProfile.companyId });
  }
  console.log(
    "[isDeleteEmployee]",
    isDeleteEmployeeCollection,
    props.deleteEmployeeState
  );
  if (
    isDeleteEmployeeCollection &&
    props.deleteEmployeeState &&
    props.deleteEmployeeState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Employee successfully deleted.");
    setIsDeleteEmployeeCollection(false);

    props.listEmployees({ companyId: userProfile.companyId });
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
    let fileName = `Employee_list_batch_${new Date().getTime()}`;

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
                <h4 className={classes.cardTitleWhite}>Employee Setup</h4>
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
                    ADD Employee
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
        <EmployeeForm
          filterRecordHandler={filterRecordHandler}
          productList={productList}
          dataSource={dataSource}
          createEmployeeHandler={createEmployeeHandler}
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
  employees: employeeListStateSelector(store),
  createEmployeeState: employeeCreateStateSelector(store),
  updateEmployeeState: employeeUpdateStateSelector(store),
  deleteEmployeeState: employeeDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  createEmployee: (data) => dispatch(attemptToCreateEmployee(data)),
  resetCreateEmployee: () => dispatch(resetCreateEmployeeState()),
  updateEmployee: (data) => dispatch(attemptToUpdateEmployee(data)),
  resetUpdateEmployee: () => dispatch(resetUpdateEmployeeState()),
  deleteEmployee: (data) => dispatch(attemptToDeleteEmployee(data)),
  resetDeleteEmployee: () => dispatch(resetDeleteEmployeeState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeFunction);

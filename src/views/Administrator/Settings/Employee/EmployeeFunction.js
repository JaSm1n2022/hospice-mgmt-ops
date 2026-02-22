import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";

import EmployeeHandler from "./handler/EmployeeHandler";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";

import EmployeeForm from "./components/Form";
import { attemptToUpdateEmployee } from "store/actions/employeeAction";
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
import { SupaContext } from "App";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";
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
function EmployeeFunction(props) {
  const classes = useStyles();
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const context = useContext(SupaContext);
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
      !isEmployeesCollection &&
      props.employees &&
      props.employees.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[Are You resetting me]");
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
    if (context.userProfile?.companyId) {
      props.listEmployees({ companyId: context.userProfile?.companyId });
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
      status: payload.status?.value || "Active",

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
    showNotification("tc", "success", "Employee successfully created.");
    props.listEmployees({ companyId: context.userProfile?.companyId });
  }
  if (
    isUpdateEmployeeCollection &&
    props.updateEmployeeState &&
    props.updateEmployeeState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Employee successfully updated.");
    setIsUpdateEmployeeCollection(false);
    props.listEmployees({ companyId: context.userProfile?.companyId });
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
    showNotification("tc", "success", "Employee successfully deleted.");
    setIsDeleteEmployeeCollection(false);

    props.listEmployees({ companyId: context.userProfile?.companyId });
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
    let fileName = `employee_list_${new Date().getTime()}`;

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
                <h4 className={classes.cardTitleWhite}>Employee</h4>
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
                      <AddIcon className={classes.icons} /> Add Employee
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

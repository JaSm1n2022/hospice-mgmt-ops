import React, { useContext, useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { QUANTITY_UOM } from "utils/constants";
import { v4 as uuidv4 } from "uuid";
import { SUPPLY_CATEGORY } from "utils/constants";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { DEFAULT_ITEM } from "utils/constants";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSelect from "components/Select/CustomSelect";
import TOAST from "modules/toastManager";
import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";
import { EMPLOYEE_SERVICE_TYPE } from "utils/constants";
import Delete from "@material-ui/icons/Delete";
import { DeleteOutlined, ImportExport } from "@material-ui/icons";
import { EMPLOYEE_PAYMENT_TYPE } from "utils/constants";
import moment from "moment";
import { connect } from "react-redux";
import { attemptToFetchPayday } from "store/actions/paydayAction";
import { resetFetchPaydayState } from "store/actions/paydayAction";
import { paydayListStateSelector } from "store/selectors/paydaySelector";
import { ACTION_STATUSES } from "utils/constants";
import { SupaContext } from "App";

let categoryList = [];
let uoms = [];
let employees = [];
let patients = [];
QUANTITY_UOM.forEach((item, index) => {
  uoms.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "uom",
  });
});
SUPPLY_CATEGORY.forEach((item, index) => {
  categoryList.push({
    id: index,
    name: item,
    value: item,
    label: item,
    category: "category",
  });
});
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;
  const right = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 700,
  },
  padding0: {
    padding: 0,
  },
  media: {
    height: 500,
  },
  paper: {
    position: "absolute",
    minWidth: "90%",
    maxWidth: "100%",
    minHeight: "90%",
    maxHeight: "100%",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
    elevation: 2,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));
const general = [
  {
    id: "counter",
    component: "counter",

    cols: 1,
  },
  {
    id: "patient",
    component: "singlecomplete",
    placeholder: "Client",
    label: "Client",
    name: "patient",
    //disabled: props.mode && props.mode === 'view' ? true : false,
    disabled: false,
    cols: 2,
  },

  {
    id: "serviceType",
    component: "singlecomplete",
    placeholder: "Service Type",
    label: "Service Type",
    name: "serviceType",
    disabled: false,
    cols: 3,
    options: [...EMPLOYEE_SERVICE_TYPE],
  },

  {
    id: "rate",
    component: "textfield",
    placeholder: "Rate",
    label: "Rate",
    name: "serviceRate",
    type: "number",
    cols: 2,
    disabled: false,
  },
  {
    id: "count",
    component: "textfield",
    placeholder: "No. of Services",
    label: "No. of Services",
    name: "count",
    type: "number",
    cols: 2,
    disabled: false,
  },
  {
    id: "totalRate",
    component: "textfield",
    placeholder: "Total Rate",
    label: "Total Rate",
    name: "totalRate",
    type: "number",
    cols: 2,
    disabled: false,
  },
  {
    id: "deduction",
    component: "textfield",
    placeholder: "deduction",
    label: "Deduction",
    name: "deduction",
    type: "number",
    cols: 2,
    disabled: false,
  },
  {
    id: "amount",
    component: "textfield",
    placeholder: "Pay Amount",
    label: "Pay Amount",
    name: "amount",
    type: "number",
    cols: 2,
    disabled: false,
  },
  {
    id: "comments",
    component: "textfield",
    placeholder: "Comments",
    label: "Comments",
    name: "comments",
    type: "text",
    cols: 2,
    disabled: false,
  },
];
let start = undefined;
let end = undefined;
function PayrollForm(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [detailForm, setDetailForm] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [period, setPeriod] = useState({ start: "", end: "" });
  const [isPeriodCollection, setIsPeriodCollection] = useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  useEffect(() => {
    const fm = {};
    fm.title = "-";
    fm.created_at = new Date();

    setGeneralForm(fm);
  }, []);
  useEffect(() => {
    if (
      !isPeriodCollection &&
      props.paydays?.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[went here]");
      if (props.paydays.data?.length) {
        setPeriod({
          start: props.paydays.data[0]?.start_period,
          end: props.paydays.data[0]?.end_period,
        });
      } else {
        setPeriod({
          start: moment(generalForm["payDate"]).format("YYYY-MM-DD"),
          end: moment(generalForm["payDate"]).format("YYYY-MM-DD"),
        });
      }
      props.resetListPaydays();
      setIsPeriodCollection(true);
    }
  }, [isPeriodCollection]);
  useEffect(() => {
    if (props.item) {
      console.log(
        "[items]",
        props.item,
        EMPLOYEE_SERVICE_TYPE,
        props.patientList
      );

      const generalFm = { ...props.item };
      generalFm.payDate = new Date(`${generalFm.payDate} 15:00`);
      generalFm.serviceType =
        [...EMPLOYEE_SERVICE_TYPE].find(
          (a) => a.value === generalFm.serviceType
        ) || DEFAULT_ITEM;
      generalFm.employee =
        props.employeeList?.find(
          (a) => parseInt(a.id, 10) === parseInt(generalFm.employeeId, 10)
        ) || DEFAULT_ITEM;
      generalFm.patient =
        props.patientList?.find(
          (a) => parseInt(a.id, 10) === parseInt(generalFm.patientId, 10)
        ) || DEFAULT_ITEM;
      generalFm.title = generalFm.employee.position;
      setPeriod({
        start: generalFm.start_period,
        end: generalFm.end_period,
      });
      setGeneralForm(generalFm);
      const detailFm = { ...props.item };
      const arr = [];
      let dosList = [];
      if (detailFm.dos?.length) {
        detailFm.dos.forEach((d, indx) => {
          dosList.push({
            id: indx,
            dos: new Date(`${d} 17:00`),
          });
        });
      }
      arr.push({
        id: detailFm.id,
        patient:
          props.patientList.find((p) => p.id === detailFm.patientId) ||
          DEFAULT_ITEM,
        serviceType:
          [...EMPLOYEE_SERVICE_TYPE].find(
            (p) => p.value === detailFm.serviceType
          ) || DEFAULT_ITEM,

        serviceRate: detailFm.serviceRate || 0.0,
        noOfService: detailFm.noOfService || 0.0,
        dateOfServices: dosList,
        totalRate: detailFm.totalRate || 0.0,
        deduction: detailFm.deduction || 0.0,
        payAmount: detailFm.payAmount || 0.0,
        comments: detailFm.comments || "",
        paymentInfo: detailFm.paymentInfo || "",
        paymentType:
          [...EMPLOYEE_PAYMENT_TYPE].find(
            (e) => e.value === detailFm.paymentType
          ) || DEFAULT_ITEM,
      });
      setDetailForm(arr);
    }
  }, [props.item]);
  useEffect(() => {
    employees = [];
    console.log("[General]", props.employeeList);
    // const employeeForm = general.find((g) => g.name === "employee");
    props.employeeList.forEach((c, indx) => {
      c.label = c.name;
      c.description = c.name;
      c.value = c.name;
      c.category = "employee";

      employees.push({ ...c });
    });

    setIsRefresh(!isRefresh);
  }, [props.employeeList]);
  useEffect(() => {
    patients = [];

    // const employeeForm = general.find((g) => g.name === "employee");
    props.patientList.forEach((c) => {
      c.name = c.patientCd;
      c.label = c.name;
      c.description = c.name;
      c.value = c.name;
      c.category = "patient";

      patients.push({ ...c });
    });

    setIsRefresh(!isRefresh);
  }, [props.patientList]);
  const validateFormHandler = () => {
    console.log("[General FormX]", generalForm, detailForm);
    generalForm.start_period = period.start;
    generalForm.end_period = period.end;
    const payload = {
      general: generalForm,
      details: detailForm,
    };
    console.log("[Payload]", payload);
    props.createPayrollHandler(payload, props.mode);
  };

  const inputGeneralHandler = ({ target }) => {
    console.log("[Target]", target, generalForm);
    const source = { ...generalForm };
    source[target.name] = target.value;
    setGeneralForm(source);
  };
  const addItemHandler = () => {
    const records = [...detailForm];
    records.push({
      id: uuidv4(),
      patient: DEFAULT_ITEM,
      serviceType: DEFAULT_ITEM,
      paymentType: DEFAULT_ITEM,
      serviceRate: 0,
      noOfService: 0,
      totalRate: 0,
      deduction: 0,
      payAmount: 0,
      comments: "",
      paymentInfo: "",
    });
    setDetailForm(records);
  };
  const autoCompleteGeneralInputHander = (item) => {
    const src = { ...generalForm };
    console.log("[src]", src, item);
    if (item.category === "employee") {
      src["employee"] = item;
      src["title"] = item.position;
      src["employeeType"] = item.employeeType;
    } else if (item.category === "patient") {
      src["patient"] = item;
    } else if (item.category === "serviceType") {
      src["serviceType"] = item;
    }
    setGeneralForm(src);
  };
  const onChangeGeneralInputHandler = (e) => {
    const src = { ...generalForm };
    if (!e.target.value) {
      src[e.target.name] = { name: "", label: "" };
      if (e.target.name === "employee") {
        src.title = "-";
        src.employeeType = "-";
      }
      setGeneralForm(src);
    }
  };
  const deleteItemHandler = (indx) => {
    const fm = [...detailForm];
    fm.splice(indx, 1);

    setDetailForm(fm);
  };
  const dateInputHandler = (value, name) => {
    const src = { ...generalForm };
    src[name] = value;
    if (name === "payDate") {
      props.listPaydays({
        companyId: context.userProfile?.companyId,
        payday: moment(value).format("YYYY-MM-DD"),
      });
    }
    setGeneralForm(src);
  };
  const dateDetailsInputHandler = (value, name, source) => {
    console.log("[Details]", value, name, source);
    source[name] = value;
    console.log(
      "[DIFF]",
      new Date(moment(value).format("YYYY-MM-DD 17:00")),
      new Date(`${period?.end} 17:00`)
    );
    if (
      new Date(moment(value).format("YYYY-MM-DD 17:00")) >
      new Date(`${period?.end} 17:00`)
    ) {
      TOAST.error(
        "The entered date is later than the specified pay period. Please adjust your date accordingly."
      );
    }
    setIsRefresh(!isRefresh);
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Payroll";
    } else if (props.mode === "edit") {
      return "Edit Payroll";
    } else {
      return "Create Payroll";
    }
  };
  console.log("[general form]", generalForm);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  console.log("[General]", generalForm);

  if (detailForm?.length === 0) {
    addItemHandler();
  }

  const onChangeDetailInputHandler = (e, source) => {
    if (!e.target.value) {
      source[e.target.name] = undefined;
      setIsRefresh(!isRefresh);
    }
  };
  const totalPayCheckHandler = () => {
    let total = 0;
    if (detailForm.length) {
      detailForm.forEach((g) => {
        total += parseFloat(g.payAmount, 2);
      });
      return parseFloat(total, 2);
    }
    return 0.0;
  };
  const getPayAmountHandler = (source) => {
    console.log("[Source2]", source);
    source.payAmount = parseFloat(
      parseFloat(source.totalRate || 0.0, 2) -
        parseFloat(source.deduction || 0.0),
      2
    );
  };
  const getTotalRateHandler = (source) => {
    console.log("[SourceRate]", source);

    source.totalRate = parseFloat(
      parseFloat(source.serviceRate || 0.0) *
        parseFloat(source.noOfService || 0.0),
      2
    );

    getPayAmountHandler(source);
  };
  const getRateHandler = (source) => {
    console.log(
      "[Contracts]",
      props.contractList,
      generalForm.employee?.id,
      source
    );
    source.serviceRate = 0.0;
    if (!source.patient?.name && source.serviceType?.name) {
      console.log;
      const empContract = props.contractList.find(
        (c) =>
          !c.patientCd &&
          generalForm.employee?.id === c.employeeId &&
          c.serviceType === source.serviceType?.name
      );
      if (empContract) {
        source.serviceRate = empContract.serviceRate;
      }
      console.log("[EmpContract]", empContract);
    } else if (source.patient?.name && source.serviceType?.name) {
      const empContract = props.contractList.find(
        (c) =>
          c.patientCd === source.patient.name &&
          generalForm.employee?.id === c.employeeId &&
          c.serviceType === source.serviceType?.name
      );
      if (empContract) {
        source.serviceRate = empContract.serviceRate;
      } else {
        const empContract2 = props.contractList.find(
          (c) =>
            !c.patientCd &&
            generalForm.employee?.id === c.employeeId &&
            c.serviceType === source.serviceType?.name
        );
        if (empContract2) {
          source.serviceRate = empContract2.serviceRate;
        }
      }
    }
    getTotalRateHandler(source);
  };
  const autoCompleteDetailInputHander = (item, source) => {
    console.log("[item]", item, source, patients);
    if (item.category === "patient") {
      source.patient = item;
      getRateHandler(source);
    } else if (item.category === "serviceType") {
      source.serviceType = item;
      getRateHandler(source);
    } else if (item.category === "paymentType") {
      source.paymentType = item;
    }

    setIsRefresh(!isRefresh);
  };
  const inputDetailHandler = ({ target }, source) => {
    console.log("[Source]", source);
    source[target.name] = target.value;
    if (target.name === "noOfService") {
      const temp = [...(source.dateOfServices || [])];
      let numberOfService = parseInt(target.value || 0, 10);
      if (parseInt(numberOfService) > temp.length) {
        numberOfService = numberOfService - temp.length;
        for (let i = 0; i < numberOfService; i++) {
          temp.push({
            id: parseInt(temp.length) + parseInt(i),
            dos: undefined,
            source: source,
          });
        }
      } else {
        TOAST.error(
          "Please remove some DOS since the number doesn't match the current number of services."
        );
      }
      source.dateOfServices = temp;
    }
    getTotalRateHandler(source);
    setIsRefresh(!isRefresh);
  };
  const disabledHandler = () => {
    console.log("[DisabledHandler", generalForm);
    if (!generalForm?.employee?.name || !generalForm.payDate) {
      return true;
    }
    return false;
  };
  console.log("[Props]", props.paydays, isPeriodCollection);
  if (isPeriodCollection && props.paydays?.status === ACTION_STATUSES.SUCCEED) {
    setIsPeriodCollection(false);
  }
  console.log("[EDIT]", generalForm, detailForm);
  return (
    <Modal
      open={isOpen}
      onClose={true}
      // onClose={clearModalHandler}
      aria-labelledby="payroll"
      aria-describedby="payrollmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

        <Grid xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              <Grid
                style={{ paddingTop: 10 }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={12}>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={3}>
                      <CustomDatePicker
                        name="payDate"
                        noDefault={true}
                        label="Pay Date"
                        value={generalForm["payDate"]}
                        onChange={dateInputHandler}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomSingleAutoComplete
                        name={"employee"}
                        label="Employee"
                        placeholder="Employee"
                        options={employees || [DEFAULT_ITEM]}
                        value={generalForm["employee"]}
                        onSelectHandler={autoCompleteGeneralInputHander}
                        onChangeHandler={onChangeGeneralInputHandler}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomTextField
                        name={"employeeType"}
                        label="Employee Type"
                        placeholder="EmployeeType"
                        value={generalForm["employeeType"] || "-"}
                        readonly
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomTextField
                        name={"title"}
                        label="title"
                        readonly
                        placeholder="Title"
                        value={generalForm["title"] || "-"}
                        onChange={inputGeneralHandler}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {generalForm["payDate"] && (
                <Typography variant="h6">
                  {`Services Pay Period from ${
                    period.start ||
                    moment(generalForm["payDate"]).utc().format("YYYY-MM-DD") ||
                    ""
                  } to ${
                    period.end ||
                    moment(generalForm["payDate"]).utc().format("YYYY-MM-DD") ||
                    ""
                  }`}
                </Typography>
              )}
              {detailForm.map((item, index) => {
                return (
                  <>
                    <div style={{ paddingBottom: 10 }} />
                    <Paper
                      elevation={1}
                      style={{
                        paddingTop: 8,
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: 8,
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        style={{
                          width: "100%",
                        }}
                        spacing={1}
                      >
                        <Grid
                          item
                          xs={12}
                          md={1}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <div style={{ display: "inline-flex", gap: 10 }}>
                            <Avatar className={classes.small}>
                              {index + 1}
                            </Avatar>
                            <div style={{ paddingTop: 4 }}>
                              <Tooltip title={"Delete Item"}>
                                <Delete
                                  style={{
                                    color: "#F62100",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => deleteItemHandler(index)}
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomSingleAutoComplete
                            label="Service"
                            placeholder="Service"
                            name="serviceType"
                            value={item["serviceType"]}
                            source={item}
                            options={[...EMPLOYEE_SERVICE_TYPE]}
                            onSelectHandler={autoCompleteDetailInputHander}
                            onChangeHandler={onChangeDetailInputHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomSingleAutoComplete
                            label="Patients"
                            placeholder="Patients"
                            name="patient"
                            options={[...patients]}
                            value={item["patient"] || DEFAULT_ITEM}
                            source={item}
                            onSelectHandler={autoCompleteDetailInputHander}
                            onChangeHandler={onChangeDetailInputHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="serviceRate"
                            placeholder="Rate"
                            label="Rate"
                            type="number"
                            source={item}
                            value={item["serviceRate"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="noOfService"
                            placeholder="No. of Service"
                            label="No. of Service"
                            type="number"
                            source={item}
                            value={item["noOfService"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="totalRate"
                            placeholder="Total Rate"
                            label="Total Rate"
                            type="number"
                            source={item}
                            value={item["totalRate"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="deduction"
                            placeholder="Deduction"
                            label="Deduction"
                            type="number"
                            source={item}
                            value={item["deduction"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="payAmount"
                            placeholder="Pay Amount"
                            label="Pay Amount"
                            type="number"
                            source={item}
                            value={item["payAmount"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomSingleAutoComplete
                            label="paymentType"
                            placeholder="Payment Type"
                            name="paymentType"
                            options={[...EMPLOYEE_PAYMENT_TYPE]}
                            value={item["paymentType"] || DEFAULT_ITEM}
                            source={item}
                            onSelectHandler={autoCompleteDetailInputHander}
                            onChangeHandler={onChangeDetailInputHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="paymentInfo"
                            placeholder="Payment Info"
                            label="Payment Info"
                            type="text"
                            source={item}
                            value={item["paymentInfo"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2}
                          sm={12}
                          style={{ paddingBottom: 2 }}
                        >
                          <CustomTextField
                            name="comments"
                            placeholder="Comments"
                            label="Comments"
                            type="text"
                            source={item}
                            value={item["comments"]}
                            onChange={inputDetailHandler}
                            disabled={disabledHandler()}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Grid container direction="row" spacing={1}>
                            {item.dateOfServices?.length > 0
                              ? item.dateOfServices.map((m, isIndex) => {
                                  return (
                                    <>
                                      <Grid item xs={12} md={2} sm={12}>
                                        <div
                                          style={{
                                            display: "inline-flex",
                                            gap: 1,
                                          }}
                                        >
                                          <Typography>{isIndex + 1}</Typography>
                                          <DeleteOutlined
                                            style={{ color: "red" }}
                                          />
                                          <CustomDatePicker
                                            name="dos"
                                            noDefault={true}
                                            value={m.dos}
                                            label="DOS"
                                            source={m}
                                            onChange={dateDetailsInputHandler}
                                          />
                                        </div>
                                      </Grid>
                                    </>
                                  );
                                })
                              : null}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </>
                );
              })}
              <div style={{ paddingBottom: 4, paddingTop: 10 }}>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => addItemHandler()}
                >
                  Add Item
                </Button>
              </div>
              <Divider
                variant="fullWidth"
                style={{
                  height: ".03em",
                  border: "solid 1px rgba(0, 0, 0, 0.12)",
                }}
                orientation="horizontal"
                flexItem
              />
              <div style={{ paddingTop: 10, display: "inline-flex", gap: 20 }}>
                <Typography
                  style={{ fontWeight: "bold", color: "blue" }}
                  variant="h6"
                >
                  PAY CHECK:${totalPayCheckHandler()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateFormHandler()}
                >
                  Submit Payroll
                </Button>
              </div>
            </CardBody>
          </Card>
          <br />
        </Grid>
      </div>
    </Modal>
  );
}
const mapStateToProps = (store) => ({
  paydays: paydayListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPaydays: (data) => dispatch(attemptToFetchPayday(data)),
  resetListPaydays: () => dispatch(resetFetchPaydayState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayrollForm);

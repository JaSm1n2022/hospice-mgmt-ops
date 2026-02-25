import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { v4 as uuidv4 } from "uuid";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import PayrollHandler from "./components/PayrollHandler";
import { connect } from "react-redux";
import { payrollListStateSelector } from "store/selectors/payrollSelector";
import { payrollCreateStateSelector } from "store/selectors/payrollSelector";
import { payrollDeleteStateSelector } from "store/selectors/payrollSelector";

import { attemptToFetchPayroll } from "store/actions/payrollAction";
import { resetFetchPayrollState } from "store/actions/payrollAction";
import { attemptToCreatePayroll } from "store/actions/payrollAction";
import { resetCreatePayrollState } from "store/actions/payrollAction";
import { resetUpdatePayrollState } from "store/actions/payrollAction";
import { attemptToDeletePayroll } from "store/actions/payrollAction";
import { resetDeletePayrollState } from "store/actions/payrollAction";
import { payrollUpdateStateSelector } from "store/selectors/payrollSelector";
import nanoid8 from "utils/nanoid8";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import UploadIcon from "@material-ui/icons/CloudUpload";

import HospiceTable from "components/Table/HospiceTable";
import { AddAlert, ArrowDownward, ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";
import SearchCustomTextField from "components/TextField/SearchCustomTextField";
import PayrollForm from "./components/PayrollForm";
import { attemptToUpdatePayroll } from "store/actions/payrollAction";
import TOAST from "modules/toastManager";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { contractListStateSelector } from "store/selectors/contractSelector";
import { attemptToFetchContract } from "store/actions/contractAction";
import { resetFetchContractState } from "store/actions/contractAction";
import FilterTable from "components/Table/FilterTable";
import moment from "moment";
import PaycheckDocument from "views/Administrator/Document/PaycheckDocument";
import PayrollPaymentDocument from "views/Administrator/Document/PayrollPaymentDocument";
import PayrollReceivedDocument from "views/Administrator/Document/PayrollReceivedDocument";
import PatientPayrollPaymentDocument from "views/Administrator/Document/PatientPayrollDocument";
import { EMPLOYEE_POSITION } from "utils/constants";
import { attemptToFetchProduct } from "store/actions/productAction";
import { resetFetchProductState } from "store/actions/productAction";
import { productListStateSelector } from "store/selectors/productSelector";
import { attemptToCreateDistribution } from "store/actions/distributionAction";
import { resetCreateDistributionState } from "store/actions/distributionAction";
import { distributionCreateStateSelector } from "store/selectors/distributionSelector";
import { attemptToCreateTransaction } from "store/actions/transactionAction";
import { resetCreateTransactionState } from "store/actions/transactionAction";
import { transactionCreateStateSelector } from "store/selectors/transactionSelector";
import { SupaContext } from "App";
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
let employeeList = [];
let patientList = [];
let contractList = [];
let payrollProductList = [];

let originalSource = undefined;

let isPayrollListDone = false;
let isEmployeeListDone = false;
let isPatientListDone = false;
let isContractListDone = false;
let isPayrollProductListDone = false;
let isLoadingDone = false;

function PayrollFunction(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const { main } = props;
  const [message, setMessage] = useState("");
  const [tc, setTC] = useState(false);
  const [color, setColor] = useState("success");

  const [dataSource, setDataSource] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [isPaycheckDocument, setIsPaycheckDocument] = useState(false);
  const [isPaymentDocument, setIsPaymentDocument] = useState(false);
  const [isPatientPaymentDocument, setIsPatientPaymentDocument] = useState(
    false
  );
  const [isPayrollReceivedDocument, setIsPayrollReceivedDocument] = useState(
    false
  );
  const [printData, setPrintData] = useState({});
  const [columns, setColumns] = useState(PayrollHandler.columns());
  const [isPayrollsCollection, setIsPayrollsCollection] = useState(true);
  const [isCreatePayrollCollection, setIsCreatePayrollCollection] = useState(
    true
  );
  const [isUpdatePayrollCollection, setIsUpdatePayrollCollection] = useState(
    true
  );
  const [isDeletePayrollCollection, setIsDeletePayrollCollection] = useState(
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
      isDeletePayrollCollection,
      props.deletePayrollState.status
    );

    if (
      !isPayrollsCollection &&
      props.payrolls &&
      props.payrolls.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListPayrolls();

      setIsPayrollsCollection(true);
    }

    if (
      !isCreatePayrollCollection &&
      props.createPayrollState &&
      props.createPayrollState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreatePayroll();

      setIsCreatePayrollCollection(true);
    }
    if (
      !isUpdatePayrollCollection &&
      props.updatePayrollState &&
      props.updatePayrollState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdatePayroll();

      setIsUpdatePayrollCollection(true);
    }
    if (
      !isDeletePayrollCollection &&
      props.deletePayrollState &&
      props.deletePayrollState.status === ACTION_STATUSES.SUCCEED
    ) {
      console.log("[change me to true]");
      props.resetDeletePayroll();
      setIsDeletePayrollCollection(true);
    }
  }, [
    isPayrollsCollection,
    isCreatePayrollCollection,
    isUpdatePayrollCollection,
    isDeletePayrollCollection,
  ]);
  useEffect(() => {
    console.log("list payrolls");
    isPayrollListDone = false;
    isLoadingDone = false;
    isEmployeeListDone = false;
    isPatientListDone = false;
    isPayrollProductListDone = false;
    if (context.userProfile?.companyId) {
      const dates = Helper.formatDateRangeByCriteriaV2("thisMonth");
      setDateFrom(dates.from);
      setDateTo(dates.to);

      props.listPayrolls({
        from: dates.from,
        to: dates.to,
        companyId: context.userProfile?.companyId,
      });
      props.listProducts({
        companyId: context.userProfile?.companyId,
        category: "Payroll",
      });
      props.listEmployees({ companyId: context.userProfile?.companyId });
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listContracts({ companyId: context.userProfile?.companyId });
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
  if (props.contracts && props.contracts.status === ACTION_STATUSES.SUCCEED) {
    isContractListDone = true;
    contractList = props.contracts.data;
    props.resetListContracts();
  }
  if (props.products?.status === ACTION_STATUSES.SUCCEED) {
    payrollProductList = props.products?.data || [];
    isPayrollProductListDone = true;
    props.resetListProducts();
  }
  if (
    isPayrollsCollection &&
    props.payrolls &&
    props.payrolls.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.payrolls.data;
    if (source && source.length) {
      source = PayrollHandler.mapData(source);
    }

    const cols = PayrollHandler.columns().map((col, index) => {
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
    isPayrollListDone = true;
    setIsPayrollsCollection(false);
  }

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
  const deleteRecordItemHandler = (id) => {
    console.log("[delete payroll id]", id);
    props.deletePayroll(id);
  };
  const createPayrollHandler = (payload, mode) => {
    const finalPayload = [];

    for (const param of payload.details) {
      const params = {
        companyId: context.userProfile.companyId,
        employeeId: payload.general?.employee.id,
        employeeName: payload.general?.employee?.name,
        employeeTitle: payload.general?.employee?.position,
        employeeType: payload.general?.employee?.employeeType,
        patientId: param.patient?.id || undefined,
        patientCd: param.patient?.patientCd || "",
        serviceType: param.serviceType?.value,
        serviceCd: param.serviceType?.code,
        paymentType: param.paymentType.value,
        serviceRate: param.serviceRate,
        totalRate: param.totalRate,
        noOfService: param.noOfService,
        deduction: param.deduction,
        comments: param.comments || "",
        paymentInfo: param.paymentInfo || "TBD",
        payAmount: param.payAmount,
        start_period: payload.general?.start_period,
        end_period: payload.general?.end_period,
        payDate: new Date(
          `${moment(payload.general?.payDate).format("YYYY-MM-DD")} 08:00`
        ),
        updatedUser: {
          name: context.userProfile.name,
          userId: context.userProfile.id,
          date: new Date(),
        },
      };
      if (param.dateOfServices?.length) {
        params.dos = param.dateOfServices.map((m) =>
          moment(m.dos).format("YYYY-MM-DD")
        );
      }
      if (mode === "create") {
        params.created_at = new Date();
        params.createdUser = {
          name: context.userProfile.name,
          userId: context.userProfile.id,
          date: new Date(),
        };
      } else if (mode === "edit") {
        params.id = payload.general?.id;
      }
      finalPayload.push(params);
    }

    if (mode === "edit") {
      console.log("[EDIT]", finalPayload);
      props.updatePayroll(finalPayload);
    } else {
      props.createPayroll(finalPayload);
    }

    closeFormModalHandler();
  };
  console.log("[Is Create Payroll Collection]", props.createPayrollState);
  if (
    isCreatePayrollCollection &&
    props.createPayrollState &&
    props.createPayrollState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreatePayrollCollection(false);
    showNotification("tc", "success", "Payroll successfully created.");

    props.listPayrolls({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile.companyId,
    });
  }
  if (
    isUpdatePayrollCollection &&
    props.updatePayrollState &&
    props.updatePayrollState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Payroll successfully updated.");
    setIsUpdatePayrollCollection(false);
    props.listPayrolls({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile.companyId,
    });
  }
  console.log(
    "[isDeletePayroll]",
    isDeletePayrollCollection,
    props.deletePayrollState
  );
  if (
    isDeletePayrollCollection &&
    props.deletePayrollState &&
    props.deletePayrollState.status === ACTION_STATUSES.SUCCEED
  ) {
    showNotification("tc", "success", "Payroll successfully deleted.");
    setIsDeletePayrollCollection(false);

    props.listPayrolls({
      from: dateFrom,
      to: dateTo,
      companyId: context.userProfile.companyId,
    });
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
            data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1) ||
          (data.serviceType &&
            data.serviceType.toLowerCase().indexOf(keyword.toLowerCase()) !==
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
  const sortByEmployee = (items) => {
    console.log("[items to sort]", items);
    items.sort((a, b) => {
      const tempA = a.employeeName;
      const tempB = b.employeeName;
      if (tempA < tempB) {
        return -1;
      }
      if (tempA > tempB) {
        return 1;
      }
      return 0;
    });
    console.log("[return me]", items);
    return items;
  };
  const computeGrandTotalHandler = () => {
    if (dataSource.length) {
      console.log("[Data Source]", dataSource);
      let total = 0.0;
      const payAmounts = dataSource.map((d) => d.totalRate);
      payAmounts.forEach((p) => {
        total += parseFloat(p);
      });
      return parseFloat(total, 2);
    } else {
      return 0.0;
    }
  };
  const createExcelHandler = (excelData, customizeHeaders) => {
    const headers = customizeHeaders || columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `payroll_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
    }
  };
  const closePrintModalHandler = () => {
    setIsPaycheckDocument(false);
    setIsPaymentDocument(false);
    setIsPayrollReceivedDocument(false);
    setIsPatientPaymentDocument(false);
  };

  const formatEmployeeReportHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    const uniqueEmployee = Array.from(
      new Set(selectedData.map((m) => m.employeeName))
    );
    console.log("[Unique Employee]", uniqueEmployee);
    const data = [];
    uniqueEmployee.forEach((u) => {
      const employeeData = selectedData.filter((s) => s.employeeName === u);
      let totalRate = 0.0;
      let totalDeduction = 0.0;
      let totalPayment = 0.0;
      let startPeriod = "";
      let payday = "";
      let endPeriod = "";
      employeeData.forEach((ed) => {
        if (ed.totalRate) {
          totalRate += parseFloat(ed.totalRate, 2);
        }
        if (ed.deduction) {
          totalDeduction += parseFloat(ed.deduction, 2);
        }
        if (ed.payAmount) {
          totalPayment += parseFloat(ed.payAmount, 2);
        }
        startPeriod = ed.start_period;
        endPeriod = ed.end_period;
        payday = ed.payDate;
      });
      const jsonObj = {
        employee: {
          name: u,
          totalRate,
          totalDeduction,
          totalPayment,
          start_period: startPeriod,
          end_period: endPeriod,
          payDate: payday,
          details: employeeData,
        },
      };
      data.push(jsonObj);
    });
    console.log("[Pdf Data]", data);
    return data;
  };
  const customExportPdfHandler = () => {
    setPrintData(formatEmployeeReportHandler());
    setIsPaycheckDocument(true);
    setAnchorEl(null);
    //sconsole.log("[New Excel Data]", newExcelData);
    // createExcelHandler(newExcelData);
  };

  const paymentPdfHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    const uniqueEmployee = Array.from(
      new Set(selectedData.map((m) => m.employeeName))
    );
    console.log("[Unique Employee]", uniqueEmployee);
    const newPdfData = [];
    uniqueEmployee.forEach((u) => {
      const employeeData = selectedData.filter((s) => s.employeeName === u);
      const payDates = Array.from(new Set(employeeData.map((p) => p.payDate)));
      console.log("[Employee Data]", employeeData);
      const position = EMPLOYEE_POSITION.find(
        (a) => a.name === employeeData[0].employeeTitle
      );
      console.log("Flow 1]", u, payDates);
      payDates.forEach((p) => {
        const paymentInfos = selectedData.filter(
          (s) => s.employeeName === u && s.payDate === p
        );
        const uniquePaymentInfo = Array.from(
          new Set(paymentInfos.map((p) => p.paymentInfo))
        );
        console.log("Flow 2]", p, uniquePaymentInfo);
        let totalAmount = 0.0;

        uniquePaymentInfo.forEach((i) => {
          const singleData = selectedData.filter(
            (s) =>
              s.employeeName === u && s.payDate === p && s.paymentInfo === i
          );
          singleData.forEach((d) => {
            totalAmount += parseFloat(d.totalRate);
          });
          const jsonObj = {
            payDate: p,
            employee: `${u} (${position?.alias || "-"})`,
            amount: parseFloat(totalAmount, 2),
            paymentType: singleData[0].paymentType,
            paymentInfo: i,
          };
          newPdfData.push(jsonObj);
        });
      });
    });
    setPrintData(newPdfData);
    setIsPaymentDocument(true);
    setAnchorEl(null);
  };
  const patientPaymentPdfHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    const uniquePatient = Array.from(
      new Set(selectedData.map((m) => m.patientCd))
    );
    console.log("[Unique Patient]", uniquePatient);
    const newPdfData = [];
    uniquePatient.forEach((u) => {
      if (u) {
        const patientData = selectedData.filter((s) => s.patientCd === u);
        console.log("[Patient Data]", patientData);

        const uniqueEmployeeTitle = Array.from(
          new Set(patientData.map((p) => p.employeeTitle))
        );
        uniqueEmployeeTitle.forEach((p) => {
          let totalAmount = 0.0;
          const tempData = patientData.filter(
            (x) => x.employeeTitle === p && x.patientCd === u
          );
          tempData.forEach((p) => {
            totalAmount += parseFloat(p.totalRate);
          });
          const jsonObj = {
            patient: u,
            payRange: `${dateFrom} to ${dateTo}`,
            amount: parseFloat(totalAmount, 2),
            service: p,
          };
          newPdfData.push(jsonObj);
        });
      }
    });
    setPrintData(newPdfData);
    setIsPatientPaymentDocument(true);
    setAnchorEl(null);
  };
  const payrollReceivedPdfHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    const uniqueEmployee = Array.from(
      new Set(selectedData.map((m) => m.employeeName))
    );

    const newPdfData = [];
    uniqueEmployee.forEach((u) => {
      const employeeData = selectedData.filter((s) => s.employeeName === u);
      const jsonObj = {
        employee: u,
        payDate: employeeData[0].payDate,
        startPeriod: employeeData[0].start_period,
        endPeriod: employeeData[0].end_period,
        position: employeeData[0]?.employeeTitle,
      };
      newPdfData.push(jsonObj);
    });
    setPrintData(newPdfData);
    setIsPayrollReceivedDocument(true);
    setAnchorEl(null);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    createExcelHandler(sortByEmployee(excelData));
  };

  const filterByDateHandler = (dates) => {
    setDateTo(dates.to);
    setDateFrom(dates.from);

    props.listPayrolls({
      from: dates.from,
      to: dates.to,
      companyId: context.userProfile.companyId,
    });
  };
  const changeReportHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeChangeReportMenuHandler = () => {
    setAnchorEl(null);
  };
  const uploadToTransactionHandler = () => {
    const data = formatEmployeeReportHandler();

    console.log("[Data]", data);
    const transactionData = [];
    const payrollIds = [];
    data.forEach((d) => {
      d.employee?.details?.forEach((dd) => {
        const currentCategory = payrollProductList.find(
          (f) => f.subCategory === dd.employeeTitle
        );
        console.log("[Current Category]", currentCategory);
        const isTransaction = dd.isTransaction || false;
        payrollIds.push(dd.id);
        const obj = {
          ordered_at: dd.payDate ? `${dd.payDate}T17:00:00.000Z` : new Date(),
          order_number: `${dd.employeeName} ${dd.paymentInfo}`,
          description: currentCategory?.description,
          category: currentCategory.category,
          subCategory: currentCategory.subCategory,
          category_id: currentCategory.category_id,
          subCategory_id: currentCategory.subCategory_id,
          item: currentCategory.item,
          size: "N/A",
          dimension: "N/A",
          qty: 1,
          qty_uom: "Fixed",
          unit_piece: 1,
          total_pcs: 1,
          unit_price: 1,
          total_price: parseFloat(dd.totalRate || 0).toFixed(2),
          price_per_pcs: parseFloat(dd.totalRate || 0).toFixed(2),
          vendor: currentCategory.vendor,
          status: "Delivered",
          product_id: currentCategory?.id,
          expected_delivery_at: dd.payDate
            ? `${dd.payDate}T17:00:00.000Z`
            : new Date(),
          payment_method: dd.paymentType,
          payment_info: dd.paymentInfo,
          payment_transaction_at: dd.payDate
            ? `${dd.payDate}T17:00:00.000Z`
            : new Date(),
          grand_total: parseFloat(dd.totalRate || 0).toFixed(2),
          companyId: context.userProfile.companyId,
          comments: dd.dos?.length
            ? `${dd.dos.toString()}${dd.comments ? `/${dd.comments}` : ""}`
            : dd.comments,

          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
          createdUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
        };

        if (!isTransaction) {
          console.log("[OBJECT]", obj);
          transactionData.push(obj);
        }
      });
    });
    if (transactionData?.length) {
      props.createTransaction(transactionData);
    }
    if (payrollIds?.length) {
      const payrollUpdateData = [];
      payrollIds.forEach((p) => {
        payrollUpdateData.push({
          isTransaction: true,
          id: p,
          companyId: context.userProfile.companyId,
          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
        });
      });
      props.updatePayroll(payrollUpdateData);
    }
  };

  const uploadToDistributionHandler = () => {
    const data = formatEmployeeReportHandler();

    console.log("[uploadToDistributionHandler]", data, payrollProductList);
    const distributionData = [];
    const payrollIds = [];
    data.forEach((d) => {
      d.employee?.details?.forEach((dd) => {
        const currentCategory = payrollProductList.find(
          (f) => f.subCategory === dd.employeeTitle
        );

        console.log(
          "[Current Category]",
          currentCategory,
          payrollProductList,
          d
        );
        const isDistributed = dd.isDistributed || false;
        payrollIds.push(dd.id);
        const obj = {
          created_at: new Date(),

          description: currentCategory?.description,
          short_description: currentCategory?.short_description,
          productId: currentCategory?.id,
          price_per_pcs: dd.totalRate,
          category: currentCategory.category,
          subCategory: currentCategory.subCategory,
          category_id: currentCategory.category_id,
          subCategory_id: currentCategory.subCategory_id,
          estimated_total_amt: dd.totalRate,
          order_status: "Delivered",
          order_qty: 1,
          order_at: dd.payDate ? `${dd.payDate}T17:00:00.000Z` : new Date(),
          comments: dd.dos?.length
            ? `${dd.dos.toString()}${dd.comments ? `/${dd.comments}` : ""}`
            : dd.comments,
          patientCd: dd.patientCd,
          delivery_location: "N/A",
          requestor: dd.employeeName,
          requestor_id: dd.employeeId,
          patient_id: dd.patientId,
          stock_status: 0,
          group_id: uuidv4(),
          unit_uom: "Fixed",
          companyId: context.userProfile.companyId,
          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
          createdUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
          record_id: `${currentCategory.item}-${nanoid8()}`,
        };
        if (obj.patientCd && !isDistributed) {
          distributionData.push(obj);
        }
      });
    });
    if (distributionData?.length) {
      props.createDistribution(distributionData);
    }
    if (payrollIds?.length) {
      const payrollUpdateData = [];
      payrollIds.forEach((p) => {
        payrollUpdateData.push({
          isDistributed: true,
          id: p,
          companyId: context.userProfile.companyId,
          updatedUser: {
            name: context.userProfile.name,
            userId: context.userProfile.id,
            date: new Date(),
          },
        });
      });
      props.updatePayroll(payrollUpdateData);
    }
  };
  if (props.createDistributionState?.status === ACTION_STATUSES.SUCCEED) {
    TOAST.ok("Distribution Sucessfully Saved.");
    props.resetCreateDistribution();
  }
  if (props.createTransactionState?.status === ACTION_STATUSES.SUCCEED) {
    TOAST.ok("Transaction Sucessfully Saved.");
    props.resetCreateTransaction();
  }
  isLoadingDone =
    isPayrollListDone &&
    isEmployeeListDone &&
    isPatientListDone &&
    isPayrollProductListDone;
  return (
    <>
      {!isLoadingDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <GridContainer>
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
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="rose">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* Left side: Select */}
                  <div style={{ flex: "0 0 90%" }}>
                    <h4 className={classes.cardTitleWhite}>
                      Paycheck Management
                    </h4>
                  </div>
                  <div align="right" style={{ flex: "0 0 10%" }}>
                    <h4 className={classes.cardTitleWhite}>
                      {" "}
                      {`$${new Intl.NumberFormat("en-US", {}).format(
                        parseFloat(computeGrandTotalHandler()).toFixed(2)
                      )}`}
                    </h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ paddingLeft: 20 }}>
                  <GridItem md={12} sm={12} xs={12}>
                    <FilterTable
                      filterRecordHandler={filterRecordHandler}
                      filterByDateHandler={filterByDateHandler}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ paddingLeft: 14 }}>
                  <GridItem md={12} sm={12} xs={12}>
                    <Button
                      color="info"
                      className={classes.marginRight}
                      onClick={() => createFormHandler()}
                    >
                      <AddIcon className={classes.icons} /> Add Payroll
                    </Button>

                    {isAddGroupButtons && (
                      <>
                        <Button
                          color="success"
                          onClick={() => exportToExcelHandler()}
                          className={classes.marginRight}
                        >
                          <UploadIcon className={classes.icons} /> Export Excel
                        </Button>

                        <Button
                          color="success"
                          onClick={() => uploadToTransactionHandler()}
                          className={classes.marginRight}
                        >
                          <UploadIcon className={classes.icons} /> Upload to
                          Transaction
                        </Button>
                        <Button
                          color="success"
                          onClick={() => uploadToDistributionHandler()}
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
                          Upload to Distribution{" "}
                        </Button>

                        <Button
                          onClick={changeReportHandler}
                          variant="outlined"
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          component="span"
                          endIcon={<ArrowDownward />}
                        >
                          Select Report
                        </Button>

                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={closeChangeReportMenuHandler}
                        >
                          <MenuItem onClick={() => customExportPdfHandler()}>
                            Employee Paycheck Copy
                          </MenuItem>
                          <MenuItem onClick={() => patientPaymentPdfHandler()}>
                            Client Payment
                          </MenuItem>
                          <MenuItem onClick={() => paymentPdfHandler()}>
                            Total Payment
                          </MenuItem>
                          <MenuItem onClick={() => payrollReceivedPdfHandler()}>
                            Client Signature
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </GridItem>
                  <HospiceTable
                    columns={columns}
                    main={true}
                    dataSource={dataSource}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                  />
                  ;
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
      {isFormModal && isLoadingDone && (
        <PayrollForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createPayrollHandler={createPayrollHandler}
          mode={mode}
          isOpen={isFormModal}
          isEdit={false}
          userProfile={context.userProfile}
          employeeList={employeeList}
          patientList={patientList}
          contractList={contractList}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
      {isPaycheckDocument && (
        <PaycheckDocument
          isOpen={isPaycheckDocument}
          printData={printData}
          closePrintModalHandler={closePrintModalHandler}
        />
      )}
      {isPaymentDocument && (
        <PayrollPaymentDocument
          isOpen={isPaymentDocument}
          printData={printData}
          closePrintModalHandler={closePrintModalHandler}
        />
      )}
      {isPatientPaymentDocument && (
        <PatientPayrollPaymentDocument
          isOpen={isPatientPaymentDocument}
          printData={printData}
          closePrintModalHandler={closePrintModalHandler}
        />
      )}
      {isPayrollReceivedDocument && (
        <PayrollReceivedDocument
          isOpen={isPayrollReceivedDocument}
          printData={printData}
          closePrintModalHandler={closePrintModalHandler}
        />
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  products: productListStateSelector(store),
  patients: patientListStateSelector(store),
  employees: employeeListStateSelector(store),
  payrolls: payrollListStateSelector(store),
  createDistributionState: distributionCreateStateSelector(store),
  createPayrollState: payrollCreateStateSelector(store),
  updatePayrollState: payrollUpdateStateSelector(store),
  deletePayrollState: payrollDeleteStateSelector(store),
  profileState: profileListStateSelector(store),
  contracts: contractListStateSelector(store),
  createTransactionState: transactionCreateStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listProducts: (data) => dispatch(attemptToFetchProduct(data)),
  resetListProducts: () => dispatch(resetFetchProductState()),
  createTransaction: (data) => dispatch(attemptToCreateTransaction(data)),
  resetCreateTransaction: () => dispatch(resetCreateTransactionState()),

  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
  listContracts: (data) => dispatch(attemptToFetchContract(data)),
  resetListContracts: () => dispatch(resetFetchContractState()),
  listEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployees: () => dispatch(resetFetchEmployeeState()),
  listPayrolls: (data) => dispatch(attemptToFetchPayroll(data)),
  resetListPayrolls: () => dispatch(resetFetchPayrollState()),
  createPayroll: (data) => dispatch(attemptToCreatePayroll(data)),
  resetCreatePayroll: () => dispatch(resetCreatePayrollState()),
  updatePayroll: (data) => dispatch(attemptToUpdatePayroll(data)),
  resetUpdatePayroll: () => dispatch(resetUpdatePayrollState()),
  deletePayroll: (data) => dispatch(attemptToDeletePayroll(data)),
  resetDeletePayroll: () => dispatch(resetDeletePayrollState()),
  createDistribution: (data) => dispatch(attemptToCreateDistribution(data)),
  resetCreateDistribution: () => dispatch(resetCreateDistributionState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayrollFunction);

import moment from "moment";

class PayrollHandler {
  static columns() {
    return [
      { width: 92, name: "actions", header: "Actions", visible: true },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "payDate",
        header: "Pay Date",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "start_period",
        header: "Start Period",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "end_period",
        header: "End Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeName",
        header: "Employee Name",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "employeeType",
        header: "Employee Type",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "employeeTitle",
        header: "Employee Position",
      },

      { defaultFlex: 1, minWidth: 120, name: "patientCd", header: "Client" },

      {
        defaultFlex: 1,
        minWidth: 120,
        name: "serviceType",
        header: "Service/Visit Type",
      },

      {
        defaultFlex: 1,
        minWidth: 120,
        name: "serviceCd",
        header: "Service Code",
      },

      {
        defaultFlex: 1,
        minWidth: 120,
        name: "serviceRate",
        header: "Service Rate",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "noOfService",
        header: "No of Services",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "totalRate",
        header: "Total Rate",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "deduction",
        header: "Total Deduction",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "payAmount",
        header: "Pay Amount",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "paymentType",
        header: "Payment Type",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "paymentInfo",
        header: "paymentInfo",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "comments",
        header: "Comments",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      item.payDate = moment(item.payDate).format("YYYY-MM-DD");

      item.created_at = moment(item.created_at).format("YYYY-MM-DD");
    });

    return items;
  }
}
export default PayrollHandler;

import moment from "moment";

class ContractHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: true },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeName",
        header: "Employee",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeType",
        header: "Employee Type",
      },
      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "serviceType",
        header: "Service/Visit Type",
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
        name: "  serviceRateType",
        header: "Rate Type",
      },

      {
        defaultFlex: 1,
        minWidth: 120,
        name: "comments",
        header: "Comments",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "mileageRate",
        header: "Mileage Rate",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "maxReimbursement",
        header: "Max Reimbursement",
      },
    ];
  }
  static mapData(items, products) {
    items.forEach((item) => {
      if (!item.patientCd) {
        if (item.employeeTitle?.toLowerCase() === "office manager") {
          item.patientCd = "Not Applicable";
        } else {
          item.patientCd = "ALL";
        }
      }
      item.created_at = moment(item.created_at).format("YYYY-MM-DD");
    });

    return items;
  }
}
export default ContractHandler;

import moment from "moment";

class MethodHandler {
  static allTransactionsColumns() {
    return [
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "category",
        header: "Payment Type",
      },
      { defaultFlex: 1, minWidth: 120, name: "office", header: "Office" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "medicalIncontinence",
        header: "Incontinence",
      },
      { defaultFlex: 1, minWidth: 100, name: "dme", header: "DME" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "transportation",
        header: "Transportation",
      },
      { defaultFlex: 1, minWidth: 120, name: "pharmacy", header: "Pharmacy" },
      { defaultFlex: 1, minWidth: 120, name: "payroll", header: "Payroll" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "services",
        header: "Services",
      },
      { defaultFlex: 1, minWidth: 120, name: "utilities", header: "Utilities" },
      { defaultFlex: 1, minWidth: 120, name: "marketing", header: "Marketing" },
    ];
  }
  static allTransactionsData(items) {
    return items;
  }
}
export default MethodHandler;

import moment from "moment";

class ProjectionHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "period",
        header: "Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "utilitiesExpense",
        header: "Utilities Expense",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "medicalExpense",
        header: "Medical Expense",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "officeExpense",
        header: "Office Expense",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "otherExpense",
        header: "Other/Operational Expense",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "grandTotal",
        header: "Overhead Total",
      },
    ];
  }
  static mapData(items, lang) {
    console.log("[MAP DATA]", items);
    items.forEach((item) => {
      item.otherOperationalExpense = 0.0;

      let medicalExpense = 0.0;
      let utilitiesExpense = 0.0;
      let officeExpense = 0.0;
      let otherExpense = 0.0;
      item.office_details.forEach((o) => {
        officeExpense += parseFloat(o.grandTotal || 0.0);
      });
      item.medical_details.forEach((o) => {
        medicalExpense += parseFloat(o.grandTotal || 0.0);
      });
      item.utilities_expense.forEach((o) => {
        utilitiesExpense += parseFloat(o.total || 0.0);
      });
      item.other_expense.forEach((o) => {
        otherExpense += parseFloat(o.total || 0.0);
      });

      item.officeExpense = `$${new Intl.NumberFormat("en-US", {}).format(
        parseFloat(officeExpense || 0.0).toFixed(2)
      )}`;
      item.medicalExpense = `$${new Intl.NumberFormat("en-US", {}).format(
        parseFloat(medicalExpense || 0.0).toFixed(2)
      )}`;
      item.utilitiesExpense = `$${new Intl.NumberFormat("en-US", {}).format(
        parseFloat(utilitiesExpense || 0.0).toFixed(2)
      )}`;
      item.otherExpense = `$${new Intl.NumberFormat("en-US", {}).format(
        parseFloat(otherExpense || 0.0).toFixed(2)
      )}`;
      item.period = `${item.month.toUpperCase()} ${item.year}`;
      item.grandTotal = `$${new Intl.NumberFormat("en-US", {}).format(
        parseFloat(item.total || 0.0).toFixed(2)
      )}`;
    });
    return items;
  }
}
export default ProjectionHandler;

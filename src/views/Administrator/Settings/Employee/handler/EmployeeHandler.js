import moment from "moment";

class EmployeeHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeType",
        header: "Type",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "name",
        header: "Name",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "position",
        header: "Position",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "phone",
        header: "Phone",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "email",
        header: "Email",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeId",
        header: "Employee ID",
      },
    ];
  }
  static mapData(items) {
    return items;
  }
}
export default EmployeeHandler;

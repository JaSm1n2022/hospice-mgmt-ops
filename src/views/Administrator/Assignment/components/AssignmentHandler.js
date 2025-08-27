import moment from "moment";

class AssignmentHandler {
  static columns(isCreate) {
    return [
      {
        width: 100,
        visible: isCreate ? true : false,
        name: "action",
        header: "Actions",
      },
      {
        width: 100,
        visible: isCreate ? false : true,
        name: "patientCd",
        header: "Patient",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "disciplinePosition",
        header: "Discipline",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "disciplineName",
        header: "Name",
      },

      {
        defaultFlex: 1,
        minWidth: 100,
        name: "frequencyVisit",
        header: "Frequency",
      },
      {
        defaultFlex: 1,
        minWidth: 160,
        name: "dayOfTheWeek",
        header: "Day of Week",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "timeOfVisit",
        header: "Time",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log("[ITEM]", item);
      item.dayOfTheWeek = item.dayOfTheWeek?.join(",");
      item.frequencyVisit = item.frequencyVisit
        ? `${item.frequencyVisit}/${item.visitType}`
        : "N/A";
    });
    return items;
  }
}
export default AssignmentHandler;

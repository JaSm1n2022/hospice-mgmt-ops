import moment from "moment";

class TrainingHandler {
  static columns() {
    return [
      { width: 140, name: "actions", header: "Actions" },
      { defaultFlex: 1, minWidth: 200, name: "fullName", header: "Name" },
      { defaultFlex: 1, minWidth: 200, name: "position", header: "Position" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "topic",
        header: "Topic",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "code",
        header: "Code",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "expirationDt",
        header: "Due Date",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "attendanceDt",
        header: "Attendance",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "completedDt",
        header: "Completed",
      },
      { defaultFlex: 1, minWidth: 120, name: "score", header: "Score %" },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      item.score = item.quiz?.scorePct;
      item.attendanceDt = item.attendanceDt
        ? moment(item.attendanceDt).format("YYYY-MM-DD HH:mm")
        : "";
      item.completedDt = item.completedDt
        ? moment(item.completedDt).format("YYYY-MM-DD HH:mm")
        : "";
      item.eventDt = moment(item.expirationDt).format("YYYY-MM-DD");
      item.expirationDt = moment(item.expirationDt).format("YYYY-MM-DD HH:mm");
    });
    return items;
  }
}
export default TrainingHandler;

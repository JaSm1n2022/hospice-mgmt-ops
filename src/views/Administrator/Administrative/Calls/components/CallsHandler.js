import moment from "moment";

class CallsHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "callerNumber",
        header: "Caller Number",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "callerName",
        header: "Caller Name",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "logdate",
        header: "Log Date",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "reason",
        header: "Reason Called",
      },
      { defaultFlex: 1, minWidth: 200, name: "response", header: "Response" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "notes",
        header: "Additional Info",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "reportedBy",
        header: "Reported By",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log(item);
      item.callerNumber = item.caller.phone;
      item.callerName = item.caller.name;
      item.reportedBy = item.reported.name;
      item.logdate = moment(item.calledDt).utc().format("YYYY-MM-DD HH:mm");
    });
    return items;
  }
}
export default CallsHandler;

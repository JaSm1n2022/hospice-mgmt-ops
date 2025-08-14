import moment from "moment";

class TasksHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "assignedDate",
        header: "Assigned Date",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "assignedName",
        header: "Assigned Name",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "description",
        header: "Description",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "notes",
        header: "Comments",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "taskStatus",
        header: "Status",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "todoDt",
        header: "ToDo Date",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "inProcessDt",
        header: "In Process Date",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "endDt",
        header: "Completed Date",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log(item);

      if (item.completedDt) {
        item.endDt = moment(item.completedDt).format("YYYY-MM-DD HH:mm");
      }
      item.assignedDate = moment(item.assignedDt).format("YYYY-MM-DD HH:mm");
      item.taskStatus = item.status;
      item.assignedName = item.assignee.name;
      if (item.inProcessDt) {
        item.inProcessDt = moment(item.inProcessDt).format("YYYY-MM-DD HH:mm");
      }
      if (item.todoDt) {
        item.todoDt = moment(item.todoDt).format("YYYY-MM-DD HH:mm");
      }
    });
    return items;
  }
}
export default TasksHandler;

const sampleData = [
  {
    reported: "2023-01-10 10AM",
    assignee: "John Doe",
    task: "Staff Meeting",
    status: "In process",
    comments: "set 10AM",
  },
  {
    reported: "2023-01-10 10AM",
    assignee: "John Doe",
    task: "Staff Meeting",
    status: "In process",
    comments: "set 10AM",
  },
  {
    reported: "2023-01-10 10AM",
    assignee: "John Doe",
    task: "Staff Meeting",
    status: "In process",
    comments: "set 10AM",
  },
  {
    reported: "2023-01-10 10AM",
    assignee: "John Doe",
    task: "Staff Meeting",
    status: "In process",
    comments: "set 10AM",
  },
  {
    reported: "2023-01-10 10AM",
    assignee: "John Doe",
    task: "Staff Meeting",
    status: "In process",
    comments: "set 10AM",
  },
];
class OfficeTaskHandler {
  static columns() {
    return [
      { defaultFlex: 1, minWidth: 140, name: "reported", header: "Date" },
      { defaultFlex: 1, minWidth: 140, name: "assignee", header: "Assignee" },
      { defaultFlex: 1, minWidth: 300, name: "task", header: "Task" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "status",
        header: "Status",
      },
      {
        defaultFlex: 1,
        minWidth: 400,
        name: "comments",
        header: "Comments",
      },
    ];
  }

  static mapData(items) {
    return items || sampleData;
  }
}

export default OfficeTaskHandler;

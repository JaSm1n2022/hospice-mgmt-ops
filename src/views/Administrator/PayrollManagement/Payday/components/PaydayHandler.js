import moment from "moment";

class PaydayHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: true },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "payday",
        header: "Pay Day",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "start_period",
        header: "Start Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "end_period",
        header: "End Period",
      },
    ];
  }
  static mapData(items, products) {
    items.forEach((item) => {});

    return items;
  }
}
export default PaydayHandler;

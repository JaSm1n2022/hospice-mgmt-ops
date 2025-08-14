import moment from "moment";

class KeyHandler {
  static keys() {
    return [
      { defaultFlex: 1, minWidth: 200, name: "key", header: "Generated Keys" },
    ];
  }
  static columns(main) {
    return [
      { width: 120, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "key", header: "Generated Key" },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "count",
        header: "Total Downloads",
      },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },
    ];
  }
  static mapData(items) {
    /*
    items.forEach((item) => {
      console.log(item);
      item.appointment = moment(item.appointment)
        .utc()
        .format("YYYY-MM-DD HH:mm");
      item.patientCd = item.patient.code;
      item.vendorName = item.vendor.name;
      item.pickupInfo = `${item.pickup.address}`;
      item.destinationInfo = `${item.destination.address}`;
    });
    */
    return items;
  }
}
export default KeyHandler;

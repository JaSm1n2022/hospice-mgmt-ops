import moment from "moment";

class TransportationHandler {
  static columns(main) {
    return [
      { width: 120, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },

      { defaultFlex: 1, minWidth: 200, name: "vendorName", header: "Vendor" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "appointment",
        header: "Appointment",
      },
      { defaultFlex: 1, minWidth: 200, name: "pickupInfo", header: "Pickup" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "destinationInfo",
        header: "Destination",
      },
    ];
  }
  static mapData(items) {
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
    return items;
  }
}
export default TransportationHandler;

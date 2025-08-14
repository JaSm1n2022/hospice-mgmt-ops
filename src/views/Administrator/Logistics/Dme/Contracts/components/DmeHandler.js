import moment from "moment";

class DmeHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },

      { defaultFlex: 1, minWidth: 200, name: "vendorName", header: "Vendor" },
      { defaultFlex: 1, minWidth: 200, name: "serviceType", header: "Service" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "appointment",
        header: "Appointment",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "locationName",
        header: "Location",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "equipmentList",
        header: "Equipment",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log(item);
      item.appointment = moment(item.appointment)
        .utc()
        .format("YYYY-MM-DD HH:mm");
      item.equipmentList = item.equipment.join(",");
      item.patientCd = item.patient ? item.patient.code : "";
      item.vendorName = item.vendor ? item.vendor.name : "";
      item.locationName = item.location ? item.location.name : "";
    });
    return items;
  }
}
export default DmeHandler;

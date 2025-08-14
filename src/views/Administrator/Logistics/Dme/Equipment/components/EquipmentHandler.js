import moment from "moment";

class EquipmentHandler {
  static columns(main) {
    return [
      { width: 120, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },

      { defaultFlex: 1, minWidth: 200, name: "vendorName", header: "Vendor" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "serviceType",
        header: "Service Type",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "serviceLocation",
        header: "Service Location",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "deliveryDt",
        header: "Delivery Date",
      },

      {
        defaultFlex: 1,
        minWidth: 500,
        name: "equipmentList",
        header: "Equipment",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log(item);
      item.patientCd = item.patient?.code;
      item.vendorName = item.vendor?.name;
      item.serviceType = item.serviceType;
      item.deliveryDt = moment(item.deliveryDt).format("YYYY-MM-DD HH:mm");
      item.equipmentList = item.details.map((m) => m.description).toString();
    });
    return items;
  }
}
export default EquipmentHandler;

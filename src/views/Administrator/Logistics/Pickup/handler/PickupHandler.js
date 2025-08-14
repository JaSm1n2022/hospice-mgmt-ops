import moment from "moment";

class PickupHandler {
  static columns() {
    return [
      { defaultFlex: 1, minWidth: 200, name: "record_id", header: "Order ID" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "patientCd",
        header: "Patient ID",
      },
      {
        defaultFlex: 1,
        minWidth: 280,
        name: "shortDescription",
        header: "Short Description",
      },
      { defaultFlex: 1, minWidth: 100, name: "category", header: "Category" },

      {
        defaultFlex: 1,
        minWidth: 100,
        name: "units",
        header: "Units",
      },
      {
        defaultFlex: 1,
        minWidth: 100,
        name: "size",
        header: "Size",
      },
    ];
  }
  static mapData(items, lang) {
    console.log("[Pickup Handler Map Data]", items);
    items.forEach((item) => {
      item.units = `${item.order_qty} ${item.unit_uom}`;
    });
    return items;
  }
}

export default PickupHandler;

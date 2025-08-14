import moment from "moment";

class VendorHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "categoryType",
        header: "Type",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "name",
        header: "Name",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "vendorCd",
        header: "Account #",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "address",
        header: "Address",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "contactPerson",
        header: "Contact Person",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "phone",
        header: "Phone",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "fax",
        header: "Fax",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "website",
        header: "Website",
      },
    ];
  }
  static mapData(items) {
    return items;
  }
}
export default VendorHandler;

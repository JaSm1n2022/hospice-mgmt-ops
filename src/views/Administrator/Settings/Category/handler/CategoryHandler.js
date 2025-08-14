import moment from "moment";

class CategoryHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        width: 300,
        name: "name",
        header: "Name",
      },
      {
        defaultFlex: 1,
        minWidth: 500,
        name: "description",
        header: "Description",
      },
    ];
  }
  static mapData(items) {
    return items;
  }
}
export default CategoryHandler;

import moment from "moment";

class SubCategoryHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "category_name",
        header: "Category",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "item_name",
        header: "Sub Category",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "item_description",
        header: "Description",
      },
    ];
  }
  static mapData(items) {
    return items;
  }
}
export default SubCategoryHandler;

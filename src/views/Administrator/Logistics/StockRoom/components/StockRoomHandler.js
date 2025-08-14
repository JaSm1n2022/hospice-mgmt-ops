import moment from "moment";

class StockRoomHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 320,
        name: "description",
        header: "Description",
      },
      { defaultFlex: 1, minWidth: 200, name: "vendor", header: "Vendor" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "manufacturer",
        header: "Manufacturer",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "qty_on_hand",
        header: "In stock",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "worth",
        type: "number",
        header: "Product Worth",
      },
      { defaultFlex: 1, minWidth: 120, name: "category", header: "Category" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "subCategory",
        header: "Sub Category",
      },
      { defaultFlex: 1, minWidth: 200, name: "item", header: "Item" },
      { defaultFlex: 1, minWidth: 200, name: "size", header: "Size" },
      { defaultFlex: 1, minWidth: 200, name: "dimension", header: "Dimension" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "additional_info",
        header: "Additional Info",
      },
      { defaultFlex: 1, minWidth: 200, name: "comments", header: "Comments" },
    ];
  }
  static mapData(items, products) {
    items.forEach((item) => {
      item.created_at = moment(item.created_at).format("YYYY-MM-DD");
      console.log("[item.productId]", item.productId, products);
      const productInfo = products.find((p) => p.id === item.productId);
      if (productInfo) {
        item.worth = parseFloat(
          productInfo.price_per_pcs * item.qty_on_hand
        ).toFixed(2);
      }
    });

    return items;
  }
}
export default StockRoomHandler;

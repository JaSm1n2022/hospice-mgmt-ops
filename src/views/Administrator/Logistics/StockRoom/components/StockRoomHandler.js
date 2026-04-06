import moment from "moment";
import React from "react";
import { Tooltip } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";

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
        render: ({ value, data }) => this.renderStockWithAlert(value, data),
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

  static getThresholdByCategory(category, subCategory) {
    const cat = category?.toLowerCase() || "";
    const subCat = subCategory?.toLowerCase() || "";

    // Based on OrderPlot threshold logic
    if (subCat === "adult diapers and briefs") {
      return 40; // Can be 60 for daily requestors
    } else if (subCat === "underpads") {
      return 20; // Can be 30 for daily requestors
    } else if (subCat === "pull-up underwear") {
      return 40; // Can be 60 for daily requestors
    } else if (subCat === "wipes") {
      return 2; // Can be 3 for daily requestors
    } else if (subCat === "gloves") {
      return 1; // Can be 2 for daily requestors
    } else if (cat === "nutrition shake" || cat === "diabetic shake") {
      return 7;
    }

    // Default threshold for other categories
    return 10;
  }

  static renderStockWithAlert(value, data) {
    const threshold = this.getThresholdByCategory(data.category, data.subCategory);
    const stockQty = parseInt(value) || 0;
    const isBelowThreshold = stockQty < threshold;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{value || 0}</span>
        {isBelowThreshold && (
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                <strong>Low Stock Alert!</strong>
                <br />
                Current: {stockQty}
                <br />
                Threshold: {threshold}
                <br />
                Need: {threshold - stockQty} more
              </div>
            }
            arrow
          >
            <WarningIcon
              style={{
                color: "#f44336",
                fontSize: "20px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        )}
      </div>
    );
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

      // Add threshold for each item
      item.threshold = this.getThresholdByCategory(item.category, item.subCategory);
    });

    return items;
  }
}
export default StockRoomHandler;

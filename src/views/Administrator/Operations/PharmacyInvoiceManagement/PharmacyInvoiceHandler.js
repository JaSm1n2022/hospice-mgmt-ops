export default class PharmacyInvoiceHandler {
  static columns(main) {
    const allColumns = [
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "invoice_dt",
        header: "Invoice Date",
        render: ({ value }) => {
          if (!value) return "";
          const date = new Date(value);
          return date.toLocaleDateString("en-US");
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "patientCd",
        header: "Client Code",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "vendor",
        header: "Vendor",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "invoice_amt",
        header: "Amount",
        type: "number",
        render: ({ value }) => {
          if (value == null) return "$0.00";
          return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "createdBy",
        header: "Created By",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "createdAt",
        header: "Created At",
        render: ({ value }) => {
          if (!value) return "";
          const date = new Date(value);
          return date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        },
      },
    ];

    return allColumns;
  }

  static mapData(items) {
    if (!items || !Array.isArray(items)) return [];

    items.forEach((item) => {
      item.createdBy = item.createdUser?.name || "";
      item.createdAt = item.created_at || item.createdUser?.date;
    });

    return items;
  }
}

import moment from "moment";

const PharmacyInvoiceHandler = {
  columns: () => {
    return [
      {
        title: "",
        field: "isChecked",
        type: "checkbox",
        width: "5%",
      },
      {
        title: "Client Code",
        field: "patientCd",
        width: "12%",
      },
      {
        title: "Client Name",
        field: "patientName",
        width: "15%",
      },
      {
        title: "Rx Number",
        field: "rxNumber",
        width: "10%",
      },
      {
        title: "Description",
        field: "description",
        width: "20%",
      },
      {
        title: "Rx Date",
        field: "rxDate",
        width: "10%",
        render: (rowData) => {
          return rowData.rxDate
            ? moment(rowData.rxDate).format("MM/DD/YYYY")
            : "N/A";
        },
      },
      {
        title: "Qty",
        field: "qty",
        width: "8%",
      },
      {
        title: "Price",
        field: "price",
        width: "10%",
        render: (rowData) => {
          return rowData.price ? `$${parseFloat(rowData.price).toFixed(2)}` : "$0.00";
        },
      },
      {
        title: "Tax",
        field: "tax",
        width: "8%",
        render: (rowData) => {
          return rowData.tax ? `$${parseFloat(rowData.tax).toFixed(2)}` : "$0.00";
        },
      },
      {
        title: "Total",
        field: "total",
        width: "10%",
        render: (rowData) => {
          return rowData.total ? `$${parseFloat(rowData.total).toFixed(2)}` : "$0.00";
        },
      },
      {
        title: "Invoice Date",
        field: "invoice_dt",
        width: "12%",
        render: (rowData) => {
          return rowData.invoice_dt
            ? moment(rowData.invoice_dt).format("MM/DD/YYYY")
            : "N/A";
        },
      },
      {
        title: "Created By",
        field: "createdBy",
        width: "12%",
      },
    ];
  },

  mapData: (data, patientList) => {
    if (!data || !Array.isArray(data)) return [];

    // Create patient lookup map
    const patientMap = {};
    if (patientList && Array.isArray(patientList)) {
      patientList.forEach(patient => {
        patientMap[patient.patientCd] = patient;
      });
    }

    return data.map((item) => {
      const patient = patientMap[item.patientCd];
      const patientName = patient
        ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
        : item.patientName || 'Unknown';

      return {
        id: item.id,
        patientCd: item.patientCd || "N/A",
        patientName: patientName,
        rxNumber: item.rxNumber || "N/A",
        description: item.description || "N/A",
        rxDate: item.rx_date || null,
        qty: item.qty || "0",
        price: item.price || "0.00",
        tax: item.tax || "0.00",
        total: item.total || "0.00",
        invoice_dt: item.invoice_dt || null,
        createdBy: item.createdUser?.name || "N/A",
        isChecked: false,
      };
    });
  },

  prepareExcelData: (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => ({
      "Client Code": item.patientCd,
      "Client Name": item.patientName,
      "Rx Number": item.rxNumber,
      "Description": item.description,
      "Rx Date": item.rxDate ? moment(item.rxDate).format("MM/DD/YYYY") : "N/A",
      "Qty": item.qty,
      "Price": item.price,
      "Tax": item.tax,
      "Total": item.total,
      "Invoice Date": item.invoice_dt
        ? moment(item.invoice_dt).format("MM/DD/YYYY")
        : "N/A",
      "Created By": item.createdBy,
    }));
  },
};

export default PharmacyInvoiceHandler;

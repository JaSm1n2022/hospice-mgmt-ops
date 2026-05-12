import moment from "moment";

export default class DmeInvoiceHandler {
  static columns() {
    return [
      { width: 94, name: "actions", header: "Actions" },
      { defaultFlex: 1, minWidth: 150, name: "invoice_dt", header: "Invoice Date" },
      { defaultFlex: 1, minWidth: 180, name: "patientCd", header: "Patient Code" },
      { defaultFlex: 1, minWidth: 200, name: "patientName", header: "Patient Name" },
      { defaultFlex: 1, minWidth: 300, name: "equipments", header: "Equipment" },
      { defaultFlex: 1, minWidth: 150, name: "invoice_amt", header: "Invoice Amount", type: "number" },
      { defaultFlex: 1, minWidth: 150, name: "createdBy", header: "Created By" },
      { defaultFlex: 1, minWidth: 180, name: "createdDate", header: "Created Date" },
    ];
  }

  static mapData(items, patientList) {
    // Create patient lookup map
    const patientMap = {};
    if (Array.isArray(patientList)) {
      patientList.forEach(patient => {
        patientMap[patient.patientCd] = patient;
      });
    }

    return items.map((item) => {
      const patient = patientMap[item.patientCd];

      return {
        ...item,
        patientName: patient
          ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
          : item.patientCd,
        invoice_dt: item.invoice_dt
          ? moment(item.invoice_dt).format("MM/DD/YYYY")
          : "-",
        equipments: Array.isArray(item.equipments)
          ? item.equipments.join(", ")
          : item.equipments || "-",
        invoice_amt: item.invoice_amt
          ? `$${parseFloat(item.invoice_amt).toFixed(2)}`
          : "$0.00",
        createdBy: item.createdUser?.name || "-",
        createdDate: item.createdUser?.date
          ? moment(item.createdUser.date).format("MM/DD/YYYY HH:mm")
          : "-",
        isChecked: false,
      };
    });
  }

  static prepareExcelData(items) {
    return items.map(item => ({
      "Invoice Date": item.invoice_dt,
      "Patient Code": item.patientCd,
      "Patient Name": item.patientName,
      "Equipment": item.equipments,
      "Invoice Amount": item.invoice_amt,
      "Created By": item.createdBy,
      "Created Date": item.createdDate,
    }));
  }
}

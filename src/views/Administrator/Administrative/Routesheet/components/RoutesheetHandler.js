import moment from "moment";

class RoutesheetHandler {
  static columns() {
    return [
      { width: 92, name: "actions", header: "Actions" },
      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "service",
        header: "Service Type",
      },
      // { defaultFlex: 1, minWidth: 120, name: "dos", header: "DOS" },
      { defaultFlex: 1, minWidth: 120, name: "timeIn", header: "Time In" },
      { defaultFlex: 1, minWidth: 120, name: "timeOut", header: "Time Out" },
      { defaultFlex: 1, minWidth: 100, name: "duration", header: "Duration" },
      { defaultFlex: 1, minWidth: 200, name: "requestor", header: "Employee" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "requestorTitle",
        header: "Position",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "signature",
        header: "Signature",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "mileage",
        header: "Mileage",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "mileageRate",
        header: "Mileage Rate",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "mileageCost",
        header: "Mileage Cost",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "mileageMaxReimbursement",
        header: "Mileage Maximum Reibursement",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "totalMileageReimbursement",
        header: "Total Mileage Reimbursement",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "serviceRate",
        header: "Service Rate",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "estimatedPayment",
        header: "Estimated Payment",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "approvedPayment",
        header: "Approved Payment",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "comments",
        header: "Comments",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "status",
        header: "Status",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      item.signature = item.signature_based;
      item.totalAmount = parseFloat(
        parseFloat(item.serviceRate) +
          parseFloat(item.totalMileageReimbursement)
      ).toFixed(2);
      item.timeIn = moment(new Date(item.dosStart)).format("YYYY-MM-DD HH:mm");
      item.timeOut = moment(new Date(item.dosEnd)).format("YYYY-MM-DD HH:mm");

      // Calculate duration
      if (item.dosStart && item.dosEnd) {
        const start = moment(new Date(item.dosStart));
        const end = moment(new Date(item.dosEnd));
        const durationMinutes = end.diff(start, "minutes");
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        item.duration = `${hours}h ${minutes}m`;
      } else {
        item.duration = "";
      }
    });

    return items;
  }
}
export default RoutesheetHandler;

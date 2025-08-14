import moment from "moment";

class AssignmentHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "patientLocation",
        header: "Location",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "cnaName",
        header: "Assigned CNA",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "cnaFreqVisitUnit",
        type: "number",
        header: "CNA Visit",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "cnaWeek",

        header: "CNA Weekday",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "cnaTime",

        header: "CNA Time",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "rnName",
        header: "Assigned RN",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "rnFreqVisitUnit",
        type: "number",
        header: "RN Visit",
      },

      {
        defaultFlex: 1,
        minWidth: 180,
        name: "rnWeek",

        header: "RN Weekday",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "rnTime",

        header: "RN Time",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "lpnName",
        header: "Assigned LPN",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "lpnFreqVisitUnit",
        type: "number",
        header: "LPN Visit",
      },

      {
        defaultFlex: 1,
        minWidth: 180,
        name: "lpnWeek",

        header: "LPN Weekday",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "lpnTime",

        header: "LPN Time",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "mswName",
        header: "Assigned MSW",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "mswFreqVisitUnit",
        type: "number",
        header: "MSW Visit",
      },

      {
        defaultFlex: 1,
        minWidth: 180,
        name: "mswWeek",

        header: "MSW Weekday",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "mswTime",

        header: "MSW Time",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "chaplainName",
        header: "Assigned Chaplain",
      },
      {
        defaultFlex: 1,
        minWidth: 140,
        name: "chaplainFreqVisitUnit",
        type: "number",
        header: "Chaplain Visit",
      },

      {
        defaultFlex: 1,
        minWidth: 180,
        name: "chaplainWeek",

        header: "Chaplain Weekday",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "chaplainTime",

        header: "Chaplain Time",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log("[ITEM]", item);
      item.rnWeek = item.rnWeek?.length ? item.rnWeek?.join(",") : "";
      item.mswWeek = item.mswWeek?.length ? item.mswWeek?.join(",") : "";
      item.cnaWeek = item.cnaWeek?.length ? item.cnaWeek?.join(",") : "";
      item.lpnWeek =
        item.lpnWeek && item.lpnWeek?.length ? item.lpnWeek?.join(",") : "";
      item.mswWeek = item.mswWeek?.length ? item.mswWeek?.join(",") : "";
      item.chaplainWeek = item.chaplainWeek?.length
        ? item.chaplainWeek?.join(",")
        : "";
      item.lpnFreqVisitUnit = `${item.lpnFreqVisit}/${item.lpnFreqVisitType}`;
      item.mswFreqVisitUnit = `${item.mswFreqVisit}/${item.mswFreqVisitType}`;
      item.chaplainFreqVisitUnit = `${item.chaplainFreqVisit}/${item.chaplainFreqVisitType}`;
      item.cnaFreqVisitUnit = `${item.cnaFreqVisit}/${item.cnaFreqVisitType}`;
      item.rnFreqVisitUnit = `${item.rnFreqVisit}/${item.rnFreqVisitType}`;
    });
    return items;
  }
}
export default AssignmentHandler;

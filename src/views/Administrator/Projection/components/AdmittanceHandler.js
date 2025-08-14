import moment from "moment";

class AdmittanceHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },

      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client" },
      { defaultFlex: 1, minWidth: 200, name: "referral", header: "Referral" },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "eligibility",
        header: "Eligibility",
      },

      {
        defaultFlex: 1,
        minWidth: 120,
        name: "eval",
        header: "Eval",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "hp",
        header: "H & P",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "assessment",

        header: "Assessment",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "intake",

        header: "Intake",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "medRecord",

        header: "Medical Record",
      },

      {
        defaultFlex: 1,
        minWidth: 180,
        name: "soc",

        header: "SOC",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "polst",

        header: "POLST",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "noe",

        header: "NOE",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "cti",

        header: "CTI",
      },
    ];
  }
  static mapData(items) {
    items.forEach((item) => {
      console.log(item);
      item.isDone =
        item.referral &&
        item.eligibility &&
        item.eval &&
        item.hp &&
        item.assessment &&
        item.intake &&
        item.medRecord &&
        item.soc &&
        item.polst &&
        item.noe &&
        item.cti;
    });
    return items;
  }
}
export default AdmittanceHandler;

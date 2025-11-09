import moment from "moment";

class PatientHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "patientCd",
        header: "Patient",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "status",
        header: "Status",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "careType",
        header: "Care Type",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "locationCd",
        header: "Location",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "insurance",
        header: "Insurance",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "admitted_benefits_period",
        header: "Admitted Benefits",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "state",
        header: "State",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "county",
        header: "County",
      },
    ];
  }
  static mapData(items) {
    return items;
  }
}
export default PatientHandler;

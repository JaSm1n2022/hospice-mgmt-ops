import moment from "moment";
import BenefitPeriodCalculator from "utils/BenefitPeriodCalculator";
import React from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { Warning } from "@material-ui/icons";

class PatientHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        width: 60,
        name: "alert",
        header: "Alert",
        render: ({ data }) => {
          // Show alert icon if patient has EOC (non-death) but no post-discharge days
          const hasEoc = data.eoc;
          const hasPostDischargeDays = data.new_hospice_care_day && parseInt(data.new_hospice_care_day, 10) > 0;
          const eocDischarge = data.eoc_discharge;
          const isDeathDischarge = eocDischarge === "Death Discharge" ||
                                   (eocDischarge && eocDischarge.toLowerCase().includes("death"));

          const shouldShowAlert = hasEoc && !hasPostDischargeDays && eocDischarge && !isDeathDischarge;

          if (!shouldShowAlert) return null;

          return (
            <Tooltip
              title="⚠️ Patient discharged (non-death). Please review the Post-Discharge (EOC) number of care days. Verify eligibility and update the patient's post-discharge total days in the patient profile."
              arrow
            >
              <IconButton size="small" style={{ color: "#c62828" }}>
                <Warning />
              </IconButton>
            </Tooltip>
          );
        },
      },
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
        name: "current_benefits",
        header: "Current Benefits",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "eoc_discharge",
        header: "EOC Discharge",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "new_hospice_dod",
        header: "Date of Death",
        render: ({ value }) => {
          if (!value) return "";
          return moment(value).format("MM/DD/YYYY");
        },
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
    // Compute current benefits for all patients using the reusable calculator
    return BenefitPeriodCalculator.batchCalculateCurrentBenefits(items);
  }
}
export default PatientHandler;

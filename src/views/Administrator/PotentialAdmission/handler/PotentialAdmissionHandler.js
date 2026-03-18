import moment from "moment";
import React from "react";

class PotentialAdmissionHandler {
  static columns(main) {
    return [
      { width: 160, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 300,
        name: "patientCd",
        header: "Patient Code",
        render: ({ value, data }) => {
          let icon = null;

          // Check if admission_decision is null or empty - show pending icon
          if (!data.admission_decision || data.admission_decision === "") {
            icon = (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                P
              </span>
            );
          }
          // Check admission_decision
          else if (data.admission_decision === "Non-Admit") {
            icon = "❌"; // X icon for non-admit
          }
          // Check if admitted to hospice
          else if (data.admission_decision === "Admit to Hospice") {
            icon = "✅"; // Check icon for admitted
          }
          // Check if pending/further evaluation and received_pre_admission_dt is passed 30 days
          else if (
            data.admission_decision === "Pending / Further Evaluation" &&
            data.received_pre_admission_dt
          ) {
            const receivedDate = moment(data.received_pre_admission_dt);
            const daysDiff = moment().diff(receivedDate, "days");
            if (daysDiff > 30) {
              icon = (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  E
                </span>
              );
            }
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{value}</span>
              {icon && <span style={{ fontSize: "14px" }}>{icon}</span>}
            </div>
          );
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "eligibility_dt",
        header: "Eligibility Date",
        render: ({ value }) => {
          return value ? moment(value).format("MM/DD/YYYY") : "";
        },
      },
      {
        width: 80,
        name: "age",
        header: "Age",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "current_location",
        header: "Current Location",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "hospice_status",
        header: "Hospice Status",
        render: ({ value }) => {
          if (!value) return "";
          return value === "no_prior_hospice"
            ? "No Prior Hospice"
            : value.charAt(0).toUpperCase() + value.slice(1);
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "referral",
        header: "Referral",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "received_hp_dt",
        header: "Received HP Date",
        render: ({ value }) => {
          return value ? moment(value).format("MM/DD/YYYY") : "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "admission_dt",
        header: "Admission Date",
        render: ({ value }) => {
          return value ? moment(value).format("MM/DD/YYYY") : "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 300,
        name: "pre_admission_prognosis",
        header: "Pre-Admission Prognosis",
      },
      {
        defaultFlex: 1,
        minWidth: 300,
        name: "hp_prognosis",
        header: "HP Prognosis",
      },
      {
        defaultFlex: 1,
        minWidth: 300,
        name: "md_prognosis",
        header: "MD Prognosis",
      },
      {
        width: 150,
        name: "current_hospice_benefits",
        header: "Current Hospice Benefits",
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "admission_cost",
        header: "Admission Cost",
        render: ({ value }) => {
          return value ? `$${parseFloat(value).toFixed(2)}` : "$0.00";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "admission_decision",
        header: "Admission Decision",
        render: ({ value }) => {
          return value || "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "eval_dt",
        header: "Evaluation Date",
        render: ({ value }) => {
          return value ? moment(value).format("MM/DD/YYYY") : "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "eval_staff",
        header: "Assigned NP",
        render: ({ value }) => {
          return value || "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "admission_nurse",
        header: "Admission Nurse",
        render: ({ value }) => {
          return value || "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "medical_director",
        header: "Medical Director",
        render: ({ value }) => {
          return value || "";
        },
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "comments",
        header: "Comments",
      },
    ];
  }

  static mapData(items) {
    return items;
  }
}

export default PotentialAdmissionHandler;

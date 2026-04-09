import moment from "moment";
import React from "react";
import { Tooltip } from "@material-ui/core";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@material-ui/icons";

class PatientOnboardingHandler {
  static columns(main) {
    return [
      { width: 180, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 300,
        name: "patientCd",
        header: "Patient Code",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "admissionStatus",
        header: "Admission",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "assessmentStatus",
        header: "Assessment",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "treatmentOrderStatus",
        header: "Treatment Order",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "physicianStatus",
        header: "Physician",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "idgNotesStatus",
        header: "IDG Notes",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "skilledNursingNotesStatus",
        header: "Skilled Nursing Notes",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "haNotesStatus",
        header: "HA Notes",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "volunteerNotesStatus",
        header: "Volunteer Notes",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "miscellaneousStatus",
        header: "Miscellaneous",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "dischargeStatus",
        header: "Discharge",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "bereavementStatus",
        header: "Bereavement",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "complianceStatus",
        header: "Compliance",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "pocStatus",
        header: "POC",
        render: ({ value }) => this.renderGroupStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 120,
        name: "overallProgress",
        header: "Progress",
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "lastUpdated",
        header: "Last Updated",
        render: ({ value }) => {
          return value ? moment(value).format("MM/DD/YYYY") : "N/A";
        },
      },
    ];
  }

  static renderGroupStatus(status) {
    if (!status) return "N/A";

    const { completed, total, incompleteItems } = status;

    const hasIncomplete = completed < total;
    const statusText =
      completed === total ? `✓ ${completed}/${total}` : `${completed}/${total}`;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{statusText}</span>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Red triangle for incomplete items */}
          {hasIncomplete && incompleteItems && incompleteItems.length > 0 && (
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  <strong style={{ fontSize: "15px" }}>
                    Incomplete Items:
                  </strong>
                  <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                    {incompleteItems.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
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

          {/* Green checkmark for complete */}
          {!hasIncomplete && (
            <CheckCircleIcon style={{ color: "#4caf50", fontSize: "20px" }} />
          )}
        </div>
      </div>
    );
  }

  static mapData(items) {
    return items.map((item) => {
      return {
        ...item,
        id: item.id || item.patientId,
        patientCd: item.patientCd || "N/A",
        overallProgress: item.overallProgress || "0%",
      };
    });
  }

  static calculateGroupStatus(checklistData, groupItems) {
    // Only count mandatory items
    const mandatoryItems = groupItems.filter(
      (item) => item.mandatory !== false
    );

    if (!checklistData) {
      return {
        completed: 0,
        total: mandatoryItems.length,
        incompleteItems: mandatoryItems.map((item) =>
          this.getItemLabel(item.key)
        ),
      };
    }

    let completed = 0;
    const incompleteItems = [];

    groupItems.forEach((item) => {
      const itemData = checklistData[item.key];
      const itemLabel = this.getItemLabel(item.key);

      // Skip non-mandatory items from completion calculation
      if (item.mandatory === false) {
        return;
      }

      if (item.type === "boolean") {
        if (itemData && itemData.checked) {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "booleanWithDate") {
        if (itemData && itemData.checked && itemData.date) {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "date") {
        if (itemData) {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "text") {
        if (itemData && itemData.trim() !== "") {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "array") {
        // For arrays like POC, consider complete if at least one entry exists
        if (itemData && Array.isArray(itemData) && itemData.length > 0) {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "select") {
        // For select fields (Y/N/NA), only "Y" and "NA" are considered complete
        // "N" (No) is NOT counted as complete - it's a missing item
        if (itemData && (itemData === "Y" || itemData === "NA")) {
          completed++;
        } else {
          incompleteItems.push(itemLabel);
        }
      } else if (item.type === "selectWithDate") {
        // For selectWithDate fields, complete if:
        // - value is "Y" and date exists
        // - value is "NA" (no date needed)
        // "N" (No) is NOT counted as complete - it's a missing item
        if (itemData && itemData.value) {
          if (itemData.value === "Y" && itemData.date) {
            completed++;
          } else if (itemData.value === "NA") {
            completed++;
          } else {
            incompleteItems.push(itemLabel);
          }
        } else {
          incompleteItems.push(itemLabel);
        }
      }
    });

    return {
      completed,
      total: mandatoryItems.length,
      incompleteItems,
    };
  }

  static getItemLabel(key) {
    const labels = {
      // Admission
      demographicSheet: "Demographic Sheet",
      hospiceEvalOrder: "Hospice Eval Order",
      informedConsent: "Informed Consent",
      electionOfHospice: "Election of Hospice",
      polstrDnr: "Polstr/DNR",
      changeOfHospice: "Change of Hospice",
      poaAdvanceDirective: "POA/Advance Directive",
      billOfRights: "Bill of Rights",
      telehealthConsent: "Telehealth Consent",
      patientNotification: "Patient Notification",

      // Assessment
      nursing: "Nursing",
      spiritual: "Spiritual",
      psychosocial: "Psychosocial",

      // Treatment Order
      treatmentOrder: "Treatment Order",

      // Physician
      cti: "CTI",
      order: "Order",
      f2fVisit: "F2F Visit",
      referral: "Referral",

      // IDG Notes
      idgDate: "IDG Notes Date",
      idgCreatedUser: "IDG Created User",
      date: "Date",
      createdUser: "Created User",
      remarks: "Remarks",

      // Skilled Nursing Notes
      skilledNursingDate: "Skilled Nursing Date",
      skilledNursingCreatedUser: "Skilled Nursing Created User",

      // HA Notes
      haDate: "HA Notes Date",
      haCreatedUser: "HA Created User",

      // Miscellaneous
      medicalRecords: "Medical Records",
      dpoa: "DPOA",
      hp: "HP (History & Physical)",
      eligibility: "Eligibility",
      insuranceCard: "Insurance Card",
      id: "ID",
      dme: "DME",
      transportation: "Transportation",

      // Discharge
      dischargeDate: "Discharge Date",
      dischargeReason: "Discharge Reason",
      dischargeDocumentation: "Discharge Documentation",

      // Bereavement
      recordOfDeath: "Record of Death",
      drugDisposalRefusalForm: "Drug Disposal/Refusal Form",
      sympathyCard: "Sympathy Card",
      lettersOfBereavement: "Letters of Bereavement",

      // Compliance
      hopeAdmission: "HOPE Admission",
      hopeHuv1: "HOPE HUV 1",
      hopeHuv2: "HOPE HUV 2",
      hopeDischarge: "HOPE Discharge",
      lcdEligibility: "LCD Eligibility",

      // Plan of Care
      poc: "Plan of Care",
    };
    return labels[key] || key;
  }
}

export default PatientOnboardingHandler;

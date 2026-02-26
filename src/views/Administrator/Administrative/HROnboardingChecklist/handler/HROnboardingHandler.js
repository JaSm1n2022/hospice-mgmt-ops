import moment from "moment";
import React from "react";
import { Tooltip } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";

class HROnboardingHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions", visible: main },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "employeeName",
        header: "Employee Name",
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section1Status",
        header: "S1: Application",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section2Status",
        header: "S2: License/Creds",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section3Status",
        header: "S3: Employment",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section4Status",
        header: "S4: Policies",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section5Status",
        header: "S5: Training",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section6Status",
        header: "S6: Health/BG",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section7Status",
        header: "S7: NABS Check",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 180,
        name: "section8Status",
        header: "S8: Tax Forms",
        render: ({ value }) => this.renderSectionStatus(value),
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

  static renderSectionStatus(status) {
    if (!status) return "N/A";

    const { completed, total, hasExpired, incompleteItems, expiredItems } = status;

    const hasIncomplete = completed < total;
    const statusText = completed === total ? `✓ ${completed}/${total}` : `${completed}/${total}`;

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span>{statusText}</span>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Red triangle for incomplete items */}
          {hasIncomplete && incompleteItems && incompleteItems.length > 0 && (
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  <strong style={{ fontSize: "15px" }}>Incomplete Items:</strong>
                  <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                    {incompleteItems.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              }
              arrow
            >
              <WarningIcon style={{ color: "#f44336", fontSize: "20px", cursor: "pointer" }} />
            </Tooltip>
          )}

          {/* Orange circle with 'E' for expired items */}
          {hasExpired && expiredItems && expiredItems.length > 0 && (
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  <strong style={{ fontSize: "15px" }}>Expired Items:</strong>
                  <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                    {expiredItems.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              }
              arrow
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#ff9800",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                E
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  static mapData(items) {
    return items.map((item) => {
      return {
        ...item,
        id: item.id || item.employeeId,
        employeeName: item.employeeName || "N/A",
        overallProgress: item.overallProgress || "0%",
      };
    });
  }

  static calculateSectionStatus(checklistData, sectionItems) {
    if (!checklistData) {
      return {
        completed: 0,
        total: sectionItems.length,
        hasExpired: false,
        incompleteItems: sectionItems.map(item => this.getItemLabel(item.key)),
        expiredItems: []
      };
    }

    let completed = 0;
    let hasExpired = false;
    const incompleteItems = [];
    const expiredItems = [];

    sectionItems.forEach((item) => {
      const itemData = checklistData[item.key];
      const itemLabel = this.getItemLabel(item.key);

      if (itemData && itemData.checked) {
        completed++;

        // Check if expired
        if (item.hasExpiration && itemData.expirationDate) {
          const isExpired = moment(itemData.expirationDate).isBefore(
            moment(),
            "day"
          );
          if (isExpired) {
            hasExpired = true;
            expiredItems.push(itemLabel);
          }
        }
      } else {
        incompleteItems.push(itemLabel);
      }
    });

    return {
      completed,
      total: sectionItems.length,
      hasExpired,
      incompleteItems,
      expiredItems,
    };
  }

  static getItemLabel(key) {
    const labels = {
      applicationForm: "Application Form",
      resume: "Resume",
      licenseVerification: "License Verification",
      diploma: "Diploma",
      pli: "PLI",
      ssc: "SSC",
      cprCard: "CPR Card",
      driversLicense: "Driver's License",
      autoInsurance: "Auto Insurance",
      jobDescription: "Job Description",
      offerLetter: "Offer Letter",
      orientation: "Orientation",
      competency: "Competency",
      performanceEvaluations: "Performance Evaluations",
      confidentiality: "Confidentiality",
      eSig: "E-Signature",
      fieldPractices: "Field Practices",
      handbook: "Handbook",
      compliance: "Compliance",
      policies: "Policies",
      ppe: "PPE",
      hipaa: "HIPAA",
      inServicesHire: "In-Services (Hire)",
      inServicesAnnual: "In-Services (Annual)",
      ceus: "CEUs",
      physicalExam: "Physical Exam",
      hepatitisB: "Hepatitis B",
      tbCxr: "TB CXR",
      tbQuestionnaire: "TB Questionnaire",
      criminalHistory: "Criminal History",
      backgroundCheck: "Background Check",
      formI9: "Form I-9",
      w4W9: "W4/W9",
    };
    return labels[key] || key;
  }
}

export default HROnboardingHandler;

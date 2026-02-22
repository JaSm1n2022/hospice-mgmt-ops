import moment from "moment";

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
        minWidth: 150,
        name: "section1Status",
        header: "S1: Application",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section2Status",
        header: "S2: License/Creds",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section3Status",
        header: "S3: Employment",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section4Status",
        header: "S4: Policies",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section5Status",
        header: "S5: Training",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section6Status",
        header: "S6: Health/BG",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
        name: "section7Status",
        header: "S7: NABS Check",
        render: ({ value }) => this.renderSectionStatus(value),
      },
      {
        defaultFlex: 1,
        minWidth: 150,
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

    const { completed, total, hasExpired } = status;

    if (hasExpired) {
      return `⚠️ ${completed}/${total}`;
    }

    if (completed === total) {
      return `✓ ${completed}/${total}`;
    }

    return `${completed}/${total}`;
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
      return { completed: 0, total: sectionItems.length, hasExpired: false };
    }

    let completed = 0;
    let hasExpired = false;

    sectionItems.forEach((item) => {
      const itemData = checklistData[item.key];
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
          }
        }
      }
    });

    return {
      completed,
      total: sectionItems.length,
      hasExpired,
    };
  }
}

export default HROnboardingHandler;

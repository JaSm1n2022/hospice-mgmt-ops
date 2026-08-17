import React from "react";
import moment from "moment";

const SchedulerHandler = {
  columns: (main) => {
    return [
      {
        title: "Client Code",
        name: "patientCd",
        type: "text",
        editable: () => false,
        width: 150,
      },
      {
        title: "Scheduled Date",
        name: "scheduled_dt",
        type: "date",
        editable: () => false,
        width: 150,
        render: (cellProps) => {
          return cellProps.value
            ? moment(cellProps.value).format("MM/DD/YYYY")
            : "";
        },
      },
      {
        title: "Service Type",
        name: "service_type",
        type: "text",
        editable: () => false,
        width: 180,
      },
      {
        title: "Discipline",
        name: "discipline",
        type: "text",
        editable: () => false,
        width: 200,
        render: (cellProps) => {
          if (Array.isArray(cellProps.value)) {
            return cellProps.value.join(", ");
          }
          return cellProps.value || "";
        },
      },
      {
        title: "Threshold Days",
        name: "threshold_days",
        type: "number",
        editable: () => false,
        width: 130,
      },
      {
        title: "Created By",
        name: "createdUser",
        type: "text",
        editable: () => false,
        width: 150,
        render: (cellProps) => {
          return cellProps.value?.name || "";
        },
      },
      {
        title: "Created Date",
        name: "created_at",
        type: "date",
        editable: () => false,
        width: 150,
        render: (cellProps) => {
          return cellProps.value
            ? moment(cellProps.value).format("MM/DD/YYYY")
            : "";
        },
      },
      {
        title: "Actions",
        name: "actions",
        type: "text",
        editable: () => false,
        width: 100,
      },
    ];
  },
  mapData: (source) => {
    return source.map((item) => ({
      ...item,
      id: item.id,
      patientCd: item.patientCd || "",
      scheduled_dt: item.scheduled_dt || "",
      service_type: item.service_type || "",
      discipline: item.discipline || [],
      threshold_days: item.threshold_days || 0,
      createdUser: item.createdUser || {},
      updatedUser: item.updatedUser || {},
      created_at: item.created_at || "",
      updated_at: item.updated_at || "",
      isChecked: false,
    }));
  },
};

export default SchedulerHandler;

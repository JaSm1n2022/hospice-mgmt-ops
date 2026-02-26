import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { Edit, Delete, Print } from "@material-ui/icons";

function ChecklistActionsFunction({
  data,
  createFormHandler,
  deleteRecordItemHandler,
  printChecklistHandler,
  isNoDeleteEnabled,
}) {
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {/* Edit Button */}
      <Tooltip title="Edit Checklist" arrow>
        <IconButton
          size="small"
          color="primary"
          onClick={() => createFormHandler(data, "edit")}
        >
          <Edit style={{ fontSize: "20px" }} />
        </IconButton>
      </Tooltip>

      {/* Print Button */}
      <Tooltip title="Print Document" arrow>
        <IconButton
          size="small"
          style={{ color: "#4caf50" }}
          onClick={() => printChecklistHandler(data)}
        >
          <Print style={{ fontSize: "20px" }} />
        </IconButton>
      </Tooltip>

      {/* Delete Button */}
      {!isNoDeleteEnabled && (
        <Tooltip title="Delete Checklist" arrow>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => deleteRecordItemHandler(data)}
          >
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

export default ChecklistActionsFunction;

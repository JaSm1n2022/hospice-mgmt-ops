import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Print from "@material-ui/icons/Print";

export default function ChecklistActionsFunction(props) {
  const { data, isNoDeleteEnabled } = props;

  return (
    <div className="actions-right">
      <Tooltip
        id="tooltip-top"
        title="Edit Checklist"
        placement="top"
        classes={{ tooltip: "tooltip" }}
      >
        <IconButton
          aria-label="Edit"
          className="actionButton"
          onClick={() => props.createFormHandler(data, "edit")}
        >
          <Edit className="editIcon" />
        </IconButton>
      </Tooltip>
      <Tooltip
        id="tooltip-top-start"
        title="Print Checklist"
        placement="top"
        classes={{ tooltip: "tooltip" }}
      >
        <IconButton
          aria-label="Print"
          className="actionButton"
          onClick={() => props.printChecklistHandler(data)}
        >
          <Print className="printIcon" />
        </IconButton>
      </Tooltip>
      {isNoDeleteEnabled ? (
        <span />
      ) : (
        <Tooltip
          id="tooltip-top-start"
          title="Delete Checklist"
          placement="top"
          classes={{ tooltip: "tooltip" }}
        >
          <IconButton
            aria-label="Close"
            className="actionButton"
            onClick={() => props.deleteRecordItemHandler(data)}
          >
            <Close className="closeIcon" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

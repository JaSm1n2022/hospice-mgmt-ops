import React from "react";
import PropTypes from "prop-types";

import styles from "./ModalFooter.module.css";
import DefaultButton from "components/CustomButtons/Button.js";

// A footer containing actions and optional pretext to be displayed at
// the bottom of a modal.

const ModalFooter = (props) => {
  const { actions, isSubmitDisabled, templateType } = props;
  const colorHandler = (title, event) => {
    if (event?.toLowerCase() === "submit") {
      return "info";
    } else if (title?.toLowerCase() === "save") {
      return "info";
    } else if (title?.toLowerCase() === "print supplies") {
      return "info";
    } else if (title?.toLowerCase() === "cancel") {
      return "rose";
    }
  };
  const renderActions = () => {
    if (actions !== null && actions.length > 0) {
      return actions.map((action, i) => {
        return (
          <DefaultButton
            key={`btnFooter-${i}`}
            type={action.type}
            onClick={() => action.callback()}
            color={
              action.type === "secondary" ||
              (isSubmitDisabled && action.event !== "cancel")
                ? "default"
                : colorHandler(action.title, action.event)
            }
            disabled={
              action.event === "submit" && isSubmitDisabled ? true : false
            }
            variant="contained"
          >
            {templateType &&
            templateType === "edit" &&
            action.event === "submit"
              ? "Update"
              : action.title}
          </DefaultButton>
        );
      });
    }
  };

  return (
    <div className={styles.modalFooter}>
      <div></div>
      <div className={styles.actionContainer}>{renderActions()}</div>
    </div>
  );
};

export default ModalFooter;

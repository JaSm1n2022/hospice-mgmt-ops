import React from "react";
import PropTypes from "prop-types";

import styles from "./ModalHeader.module.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Clear from "@material-ui/icons/Clear";
import { Button, Typography } from "@material-ui/core";
// A header, containing a title and cancel button, to be displayed
// at the top of a modal.

const ModalHeader = ({ title, onClose, isBack, onBack, ...props }) => {
  return (
    <div {...props} className={styles.modalHeader}>
      <div style={{ display: "inline-flex" }}>
        <Typography
          className={isBack ? styles.onBack : styles.title}
          variant="h5"
          onClick={() => (isBack ? onBack() : null)}
        >
          {isBack ? <ArrowBackIcon style={{ fontSize: "16pt" }} /> : null}{" "}
          {title}
        </Typography>
      </div>
      <Button onClick={onClose} className={styles.closeButton}>
        <Clear />
      </Button>
    </div>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  isBack: PropTypes.bool,
};

export default ModalHeader;

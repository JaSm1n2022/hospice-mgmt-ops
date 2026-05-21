import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Backdrop, Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    width: "90%",
    height: "90%",
    outline: "none",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
}));

function InvoiceExtractorModal({ isOpen, onClose, iframeRef }) {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <div className={classes.paper}>
          <iframe
            ref={iframeRef}
            src="/pharmacy_mapping.html"
            className={classes.iframe}
            title="Pharmacy Invoice Extractor"
          />
        </div>
      </Fade>
    </Modal>
  );
}

export default InvoiceExtractorModal;

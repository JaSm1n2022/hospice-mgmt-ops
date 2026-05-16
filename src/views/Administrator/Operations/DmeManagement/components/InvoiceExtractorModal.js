import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, IconButton } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  card: {
    width: "95%",
    maxWidth: "1400px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    paddingBottom: theme.spacing(1),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },
  cardBody: {
    flex: 1,
    overflow: "hidden",
    padding: 0,
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    minHeight: "700px",
  },
}));

export default function InvoiceExtractorModal(props) {
  const { isOpen, onClose, iframeRef, patientList, onSubmit } = props;
  const classes = useStyles();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={classes.modal}
      aria-labelledby="invoice-extractor-modal"
    >
      <Card className={classes.card}>
        <CardHeader
          color="rose"
          className={classes.cardHeader}
        >
          <h4 style={{ margin: 0 }}>Invoice Section Extractor</h4>
          <IconButton
            className={classes.closeButton}
            onClick={onClose}
            size="small"
          >
            <Close />
          </IconButton>
        </CardHeader>
        <CardBody className={classes.cardBody}>
          <iframe
            ref={iframeRef}
            src="/patient_mapping.html"
            className={classes.iframe}
            title="Client Equipment Mapping"
          />
        </CardBody>
      </Card>
    </Modal>
  );
}

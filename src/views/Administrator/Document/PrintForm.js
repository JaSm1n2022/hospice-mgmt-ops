import { Modal } from "@material-ui/core";
import HeaderModal from "components/Modal/HeaderModal";
import React from "react";
import { makeStyles } from "@material-ui/core";
import PrintComponent from "./PrintComponent";
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  padding0: {
    padding: 0,
  },
  media: {
    height: 200,
  },
  paper: {
    position: "absolute",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
    elevation: 2,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));

function PrintForm(props) {
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closePrintForm();
  };
  return (
    <Modal
      open={isOpen}
      onClose={clearModalHandler}
      aria-labelledby="stock"
      aria-describedby="stockmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={"Print"} onClose={clearModalHandler} />

        <PrintComponent
          multiPatients={props.multiPatients}
          details={props.detailForm}
          general={props.generalForm}
        />
      </div>
    </Modal>
  );
}

export default PrintForm;

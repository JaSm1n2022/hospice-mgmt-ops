import React, { useState } from "react";
import Button from "components/CustomButtons/Button.js";
import { useEffect } from "react";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import styles from "../../../../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(styles);
export default function ActionsFunction(props) {
  const classes = useStyles();
  const [isRowForDelete, setIsRowForDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  useEffect(() => {
    if (props.data) {
      // console.log('[CurrentItem]', currentItem);
      console.log("[PROPS DATA]", props.data);
      setCurrentItem(props.data);
    }
  }, [props.data]);
  const openEditModalHandler = () => {
    props.createFormHandler(currentItem, "edit");
  };
  const printRecordHandler = () => {
    props.printHandler(currentItem);
  };
  const deleteRecordHandler = () => {
    setIsRowForDelete(true);
  };
  const noDeleteHandler = () => {
    setIsRowForDelete(false);
  };
  const deleteRowHandler = (mode) => {
    if (mode === "Delete") {
      props.onDelete(currentItem);
    } else if (mode === "Edit") {
      props.onEdit(currentItem);
    }
  };
  const fillButtons = [
    { color: "info", icon: Edit, mode: "Edit" },
    { color: "danger", icon: Close, mode: "Delete" },
  ].map((prop, key) => {
    return (
      <Button
        color={prop.color}
        className={classes.actionButton}
        key={key}
        onClick={() => deleteRowHandler(prop.mode)}
      >
        <prop.icon className={classes.icon} />
      </Button>
    );
  });
  return <React.Fragment>{currentItem ? fillButtons : null}</React.Fragment>;
}

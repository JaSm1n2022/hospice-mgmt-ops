import { Button } from "@material-ui/core";

import React, { useState } from "react";

import YesNoModal from "components/Modal/YesNoModal";
import { Delete, Edit, Print } from "@material-ui/icons";
import { useEffect } from "react";

export default function DialogFunction(props) {
  const [isRowForDelete, setIsRowForDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  useEffect(() => {
    if (props.data) {
      // console.log('[CurrentItem]', currentItem);

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
  const deleteRowHandler = () => {
    setIsRowForDelete(false);

    props.deleteRecordItemHandler(currentItem.id, currentItem);
  };

  return (
    <React.Fragment>
      {currentItem ? (
        <div style={{ display: "inline-flex", gap: 10 }}>
          <Edit
            style={{ color: "#2196f3", cursor: "pointer" }}
            onClick={() => openEditModalHandler()}
          />
          <Delete
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => deleteRecordHandler()}
          />
          {props.isPrintFunction && (
            <Print
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => printRecordHandler()}
            />
          )}
        </div>
      ) : null}
      {isRowForDelete && (
        <YesNoModal
          description={"Do you wish to delete this record"}
          isOpen={isRowForDelete}
          noHandler={noDeleteHandler}
          yesHandler={deleteRowHandler}
        />
      )}
    </React.Fragment>
  );
}

import { Button, Grid, Typography } from "@material-ui/core";

import React, { useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import YesNoModal from "components/Modal/YesNoModal";
import { CheckCircle, Delete, Edit, Image } from "@material-ui/icons";
import { useEffect } from "react";

export default function DialogFunction(props) {
  const [currentItem, setCurrentItem] = useState(undefined);
  useEffect(() => {
    setCurrentItem(props.currentItem);
  }, [props.currentItem]);
  return (
    <React.Fragment>
      {currentItem ? (
        <Grid
          container
          wrap
          spacing={24}
          justifyContent="space-between"
          style={{
            display:
              currentItem.record_id &&
              ((currentItem.actualPickupDt &&
                currentItem.actualPickupDt !== "-") ||
                (currentItem.actualDeliveredDt &&
                  currentItem.actualDeliveredDt !== "-"))
                ? ""
                : "none",
          }}
        >
          <Typography>{currentItem.record_id}</Typography>
          <Image
            style={{ fontSize: 24, color: "blue" }}
            onClick={() => props.showProofHandler(currentItem)}
          />
        </Grid>
      ) : null}
    </React.Fragment>
  );
}

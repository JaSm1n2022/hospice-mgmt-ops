import React from "react";
import { Close } from "@material-ui/icons";
import { Grid, Modal, Paper, Typography } from "@material-ui/core";
import Proof from "./Proof";

export default function PhotoModal(props) {
  const { isOpen } = props;

  const body = (
    <Paper
      elevation={2}
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        width: !props.isMobile ? "50%" : "100%",
      }}
    >
      <div style={{ paddingRight: 20, paddingLeft: 20, paddingTop: 20 }}>
        <Grid container justify="space-between">
          <Typography variant="body1">Photo</Typography>
          <Close onClick={props.closePhotoHandler} />
        </Grid>

        <Proof
          isMobile={props.isMobile}
          closePhotoHandler={props.closePhotoHandler}
          onUsePhotoHandler={props.onUsePhotoHandler}
        />
      </div>
    </Paper>
  );

  return (
    <div>
      <Modal
        open={!!isOpen}
        onClose={props.closePhotoHandler}
        aria-labelledby="yn-modal"
        aria-describedby="yes-or-no"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {body}
      </Modal>
    </div>
  );
}

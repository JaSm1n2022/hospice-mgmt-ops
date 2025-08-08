import { Close } from "@mui/icons-material";
import { Grid, Modal, Paper, Typography } from "@mui/material";
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
        //    height: props.isMobile ? "50%" : "40%",
      }}
    >
      <div style={{ paddingRight: 20, paddingLeft: 20, paddingTop: 20 }}>
        <Grid container justifyContent="space-between">
          <Typography variant="body">Photo</Typography>
          <Close onClick={() => props.closePhotoHandler()} />
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
        fullWidth={true}
        open={isOpen ? true : false}
        onClose={props.onClosePhotoHandler}
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

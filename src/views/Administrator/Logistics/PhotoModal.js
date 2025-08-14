import { Grid, Modal, Paper, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Proof from "./Proof";

export default function PhotoModal(props) {
  const { isOpen } = props;

  const body = (
    <Paper elevation={2} style={{ width: "100%", height: "90%" }}>
      <div style={{ paddingRight: 20, paddingLeft: 20, paddingTop: 20 }}>
        <Grid container justifyContent="space-between">
          <Typography variant="body">Photo</Typography>
          <Close onClick={() => props.closePhotoHandler()} />
        </Grid>

        <Proof
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
        }}
      >
        {body}
      </Modal>
    </div>
  );
}

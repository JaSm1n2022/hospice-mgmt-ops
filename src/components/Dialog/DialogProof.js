/* eslint-disable react/jsx-props-no-spreading */
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Grid, makeStyles, Paper } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>

      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    align: "left",
  },
}))(MuiDialogActions);

export default function DialogProof(props) {
  const classes = useStyles();
  console.log("[Props Dialog]", props.currentItem);
  return (
    <div>
      <Dialog aria-labelledby="customized-dialog-title" open={props.open}>
        <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
          Document Photos
        </DialogTitle>
        <div style={{ paddingLeft: 14 }}>
          <Typography variant="h6">
            {props?.currentItem?.requestor} / {props.currentItem?.recordId}
          </Typography>
        </div>
        <DialogContent dividers>
          {props.currentItem ? (
            <Grid container direction="row">
              {props?.currentItem.pickupPhoto && (
                <Grid item xs={4}>
                  <div className={classes.root} style={{ width: "100%" }}>
                    <Paper elevation={2} style={{ width: "100%" }}>
                      <div style={{ paddingBottom: 4 }}>
                        <Typography variant="body" style={{ paddingLeft: 10 }}>
                          Pickup Photo
                        </Typography>
                      </div>
                      <img
                        src={props.currentItem.pickupPhoto}
                        height={100}
                        width={"100%"}
                      />
                    </Paper>
                  </div>
                </Grid>
              )}
              {props?.currentItem.pickupSignature && (
                <Grid item xs={4}>
                  <div className={classes.root} style={{ width: "100%" }}>
                    <Paper elevation={2} style={{ width: "100%" }}>
                      <div style={{ paddingBottom: 4 }}>
                        <Typography variant="body" style={{ paddingLeft: 10 }}>
                          Pickup Signature
                        </Typography>
                      </div>
                      <img
                        src={props.currentItem.pickupSignature}
                        height={100}
                        width={"100%"}
                      />
                    </Paper>
                  </div>
                </Grid>
              )}
              {props?.currentItem.deliveryPhoto && (
                <Grid item xs={4}>
                  <div className={classes.root} style={{ width: "100%" }}>
                    <Paper elevation={2} style={{ width: "100%" }}>
                      <div style={{ paddingBottom: 4 }}>
                        <Typography variant="body" style={{ paddingLeft: 10 }}>
                          Delivery Photo
                        </Typography>
                      </div>
                      <img
                        src={props.currentItem.deliveryPhoto}
                        height={100}
                        width={"100%"}
                      />
                    </Paper>
                  </div>
                </Grid>
              )}
              {props?.currentItem.deliverySignature && (
                <Grid item xs={4}>
                  <div className={classes.root} style={{ width: "100%" }}>
                    <Paper elevation={2} style={{ width: "100%" }}>
                      <div style={{ paddingBottom: 4 }}>
                        <Typography variant="body" style={{ paddingLeft: 10 }}>
                          Delivery Signature
                        </Typography>
                      </div>
                      <img
                        src={props.currentItem.deliverySignature}
                        height={100}
                        width={"100%"}
                      />
                    </Paper>
                  </div>
                </Grid>
              )}
            </Grid>
          ) : (
            <div width={{ style: "500px" }}>No Document Photo Found!</div>
          )}
        </DialogContent>

        {/*
        <DialogActions>
          <Typography variant="h6">
            Total : {props?.currentItem?.accessorialChargeAmtSell || ''} {props?.currentItem?.currency || ''}{' '}
          </Typography>
        </DialogActions>
        */}
      </Dialog>
    </div>
  );
}

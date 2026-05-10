import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography, Modal, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "90%",
    maxWidth: "500px",
    padding: theme.spacing(4),
    outline: "none",
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  message: {
    marginBottom: theme.spacing(3),
    lineHeight: 1.6,
    fontSize: "15px",
  },
  button: {
    minWidth: "160px",
    padding: theme.spacing(1.5, 3),
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  urlBox: {
    backgroundColor: "#f9f9f9",
    padding: theme.spacing(1.5),
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
    marginTop: theme.spacing(1),
  },
  urlLabel: {
    fontSize: "12px",
    color: "#666",
    marginBottom: theme.spacing(0.5),
  },
  url: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#1976d2",
    wordBreak: "break-all",
    userSelect: "all",
  },
}));

/**
 * Modal to inform discipline users about the new system
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onContinue - Handler when user clicks continue
 */
export default function DisciplineSystemModal(props) {
  const { isOpen, onContinue } = props;
  const classes = useStyles();
  const newSystemUrl = "https://myroutecare.netlify.app";

  const body = (
    <Paper elevation={3} className={classes.paper}>
      <Typography variant="h5" className={classes.title}>
        System Update
      </Typography>
      <Typography variant="body1" className={classes.message}>
        A new system is now in place for discipline management. Click below to
        proceed to the new platform.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onContinue}
        className={classes.button}
        fullWidth
      >
        Continue
      </Button>
      <Box className={classes.urlBox}>
        <Typography className={classes.urlLabel}>
          New System URL (for reference):
        </Typography>
        <Typography className={classes.url}>{newSystemUrl}</Typography>
      </Box>
    </Paper>
  );

  return (
    <Modal
      open={isOpen}
      aria-labelledby="discipline-system-modal"
      aria-describedby="discipline-system-notification"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      disableBackdropClick
      disableEscapeKeyDown
    >
      {body}
    </Modal>
  );
}

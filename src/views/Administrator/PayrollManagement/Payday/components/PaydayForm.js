import React, { useEffect, useState } from "react";
import { QUANTITY_UOM } from "utils/constants";
import { SUPPLY_CATEGORY } from "utils/constants";
import { Button, Card, Grid, Modal } from "@material-ui/core";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";

import HeaderModal from "components/Modal/HeaderModal";

import { useTheme } from "@material-ui/core";
import moment from "moment";

function getModalStyle() {
  const top = 50;
  const left = 50;
  const right = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${left}%`,
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
    minWidth: "50%",
    maxWidth: "100%",
    minHeight: "50%",
    maxHeight: "100%",
    overflow: "auto",
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

function PaydayForm(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [generalForm, setGeneralForm] = useState({});
  const [payday, setPayday] = useState(undefined);
  const [startPeriod, setStartPeriod] = useState(undefined);
  const [endPeriod, setEndPeriod] = useState(undefined);
  const [modalStyle] = React.useState(getModalStyle);
  const { isOpen } = props;

  useEffect(() => {}, []);
  useEffect(() => {
    if (props.item) {
      console.log(
        "[props item]",
        props.item,
        new Date(`${props.item.payday} 17:00`),
        moment(new Date(`${props.item.payday} 17:00`))
          .utc()
          .format("YYYY-MM-DD")
      );
      setPayday(new Date(`${props.item.payday} 17:00`));
      setStartPeriod(new Date(`${props.item.start_period} 17:00`));
      setEndPeriod(new Date(`${props.item.end_period} 17:00`));
    }
  }, [props.item]);

  const validateFormHandler = () => {
    props.createPaydayHandler({ payday, startPeriod, endPeriod }, props.mode);
  };

  const dateInputHandler = (value, name) => {
    if (name === "payday") {
      setPayday(value);
    } else if (name === "startPeriod") {
      setStartPeriod(value);
    } else if (name === "endPeriod") {
      setEndPeriod(value);
    }
  };
  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Payday Period";
    } else if (props.mode === "edit") {
      return "Edit Payday Period";
    } else {
      return "Create Payday Period";
    }
  };

  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };

  return (
    <Modal
      open={isOpen}
      onClose={true}
      // onClose={clearModalHandler}
      aria-labelledby="contract"
      aria-describedby="contractmodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

        <Grid xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              <Grid
                style={{ paddingTop: 10 }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={12} md={4} sm={12} style={{ paddingBottom: 2 }}>
                  <CustomDatePicker
                    name="payday"
                    value={payday}
                    noDefault={true}
                    label="Payday"
                    onChange={dateInputHandler}
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={12} style={{ paddingBottom: 2 }}>
                  <CustomDatePicker
                    name="startPeriod"
                    noDefault={true}
                    value={startPeriod}
                    label="Start Period"
                    onChange={dateInputHandler}
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={12} style={{ paddingBottom: 2 }}>
                  <CustomDatePicker
                    name="endPeriod"
                    noDefault={true}
                    value={endPeriod}
                    label="End Period"
                    onChange={dateInputHandler}
                  />
                </Grid>
              </Grid>
              <div style={{ paddingTop: 10 }}>
                <Button
                  variant="contained"
                  onClick={() => validateFormHandler()}
                >
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
          <br />
        </Grid>
      </div>
    </Modal>
  );
}
export default PaydayForm;

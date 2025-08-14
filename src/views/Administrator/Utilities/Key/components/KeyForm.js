import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { Button, Card, Grid, Modal, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core";

import HeaderModal from "components/Modal/HeaderModal";
import { SettingsCellOutlined } from "@material-ui/icons";
import KeyHandler from "./KeyHandler";
import HospiceTable from "components/Table/HospiceTable";
import { proofUpdateStateSelector } from "store/selectors/proofSelector";

function getModalStyle() {
  const top = 50;
  const left = 50;
  const right = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
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
    minWidth: "80%",
    maxWidth: "100%",
    minHeight: "50%",
    maxHeight: "100%",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),

    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));
let originalSource = [];
function KeyForm(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [count, setCount] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const { isOpen } = props;
  const [cols, setCols] = useState(KeyHandler.keys());

  useEffect(() => {}, []);
  const clearModalHandler = () => {
    console.log("[Clear Me]");

    props.closeFormModalHandler();
  };
  const inputHandler = ({ target }) => {
    setCount(target.value);
  };
  const generateKeys = (charset, len) => {
    let text = "";
    for (let i = 0; i < len; i += 1)
      text = `${text}${charset.charAt(
        Math.floor(Math.random() * charset.length)
      )}`;

    return text;
  };

  const createId = () => {
    //  const translator = short(short.constants.flickrBase58, {
    //  consistentLength: false
    // });
    // translator.new(); // mhvXdrZT4jP5T8vBxuvm75

    const uId = generateKeys(
      uuidv4()
        .toString()
        .replace(/[^A-Za-z0-9]/g, ""),
      8
    ).toUpperCase();
    return uId;
  };
  const createGenerateKeyHandler = () => {
    console.log("[Create Generate Key Handler]");
    const ids = [];
    const len = parseInt(count || 1, 10);
    for (let i = 0; i < len; i++) {
      ids.push({ id: `key-${i}`, key: createId() });
    }
    originalSource = [...ids];
    setDataSource(ids);
  };
  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    }
    // setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];
    //  dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const saveKeysHandler = () => {
    const selectedKeys = dataSource?.filter((f) => f.isChecked);
    props.savePrintKeysHandler(selectedKeys);
  };
  console.log("[KEYS]", dataSource);
  return (
    <Modal
      open={isOpen}
      onClose={true}
      aria-labelledby="key"
      aria-describedby="keymodal"
    >
      <div style={modalStyle} className={classes.paper}>
        <HeaderModal title={"Generate Keys"} onClose={clearModalHandler} />

        <Grid xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              <Grid
                style={{ paddingTop: 10 }}
                container
                spacing={1}
                direction="row"
              >
                <div style={{ display: "inline-flex", gap: 10 }}>
                  <CustomTextField
                    type="number"
                    onChange={inputHandler}
                    value={count}
                    label="No of keys to generate"
                    placeholder="No. of keys to generate"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => createGenerateKeyHandler()}
                  >
                    Generate
                  </Button>
                </div>
              </Grid>
            </CardBody>
          </Card>
          <br />
          <Grid item xs={12} md={12} style={{ paddingBottom: 4 }}>
            {dataSource?.length > 0 &&
              dataSource.find((d) => d.selected || d.isChecked) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveKeysHandler()}
                >
                  Save & Print
                </Button>
              )}
          </Grid>

          <HospiceTable
            main={true}
            onCheckboxSelectionHandler={onCheckboxSelectionHandler}
            columns={cols}
            dataSource={dataSource || []}
          />
        </Grid>
      </div>
    </Modal>
  );
}
export default KeyForm;

import React, { useContext, useRef, useState } from "react";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
// react component plugin for creating beatiful tags on an input
import TagsInput from "react-tagsinput";
// plugin that creates slider
import Slider from "nouislider";

// @material-ui/core components
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import NavPills from "components/NavPills/NavPills.js";
// @material-ui/icons
import Today from "@material-ui/icons/Today";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AvTimer from "@material-ui/icons/AvTimer";
import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";
import Instruction from "components/Instruction/Instruction.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import ImageUpload from "components/CustomUpload/ImageUpload.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import styles from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import styles2 from "../../../assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import dayjs from "dayjs";
import noticeModal1 from "assets/img/card-1.jpeg";
import noticeModal2 from "assets/img/card-2.jpeg";
import { SupaContext } from "App.js";
import {
  AssignmentIndOutlined,
  ClearOutlined,
  DriveEta,
  EventOutlined,
  Favorite,
  Gesture,
} from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import ReactSignatureCanvas from "react-signature-canvas";
import { Tooltip } from "@material-ui/core";
const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Routesheet() {
  const [simpleSelect, setSimpleSelect] = useState("");
  const sigCanvas = useRef();
  const context = useContext(SupaContext);
  const [noticeModal, setNoticeModal] = React.useState(false);
  const [mileage, setMileage] = useState(0);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [clientService, setClientService] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isSignRequired, setIsSignRequired] = useState(false);
  const [isMileageRate, setIsMileageRate] = useState(false);
  const [isAssignmentCollection, setIsAssignmentCollection] = useState(true);
  const [isPatientCollection, setIsPatientCollection] = useState(true);
  const [isContractCollection, setIsContractCollection] = useState(true);
  const [isRoutesheetCollection, setIsRoutesheetCollection] = useState(true);
  const [contractRate, setContractRate] = useState(undefined);
  const [isClientError, setIsClientError] = useState(false);
  const [dos, setDos] = useState(dayjs(new Date()));
  const [timeIn, setTimeIn] = useState(dayjs(new Date()));
  const [timeOut, setTimeOut] = useState(dayjs(new Date()).add(1, "hour"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [otherService, setOtherService] = useState("");
  const [otherServiceError, setOtherServiceError] = useState({
    isError: false,
    message: "",
  });

  const [patientInfo, setPatientInfo] = useState(undefined);
  const classes = useStyles();
  const classes2 = useStyles2();

  const handleSimple = (event) => {
    setSimpleSelect(event.target.value);
  };
  const onBeginHandler = () => {};
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <AssignmentIndOutlined />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Service Route Sheet</h4>
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={6} md={12} lg={12}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="simple-select"
                  className={classes.selectLabel}
                >
                  Select Service
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu,
                  }}
                  classes={{
                    select: classes.select,
                  }}
                  value={simpleSelect}
                  onChange={handleSimple}
                  inputProps={{
                    name: "simpleSelect",
                    id: "simple-select",
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose City
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="2"
                  >
                    Paris
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="3"
                  >
                    Bucharest
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="4"
                  >
                    Rome
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="5"
                  >
                    New York
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="6"
                  >
                    Miami
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="7"
                  >
                    Piatra Neamt
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="8"
                  >
                    Paris
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="9"
                  >
                    Bucharest
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="10"
                  >
                    Rome
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="11"
                  >
                    New York
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="12"
                  >
                    Miami
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="13"
                  >
                    Piatra Neamt
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="14"
                  >
                    Paris
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="15"
                  >
                    Bucharest
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="16"
                  >
                    Rome
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="17"
                  >
                    New York
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="18"
                  >
                    Miami
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="19"
                  >
                    Piatra Neamt
                  </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6} md={12} lg={12}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Left side: Select */}
                <div style={{ flex: "0 0 95%" }}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="simple-select"
                      className={classes.selectLabel}
                    >
                      Select Client
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={simpleSelect}
                      onChange={handleSimple}
                      inputProps={{
                        name: "simpleSelect",
                        id: "simple-select",
                      }}
                    >
                      {/* ...MenuItems... */}
                    </Select>
                  </FormControl>
                </div>

                {/* Right side: Clear Icon */}
                <div style={{ flex: "0 0 5%", textAlign: "right" }}>
                  <Tooltip title="View Client Information">
                    <Button
                      justIcon
                      round
                      color="twitter"
                      onClick={() => setNoticeModal(true)}
                    >
                      <i className={"fas fa-info"} />
                    </Button>
                  </Tooltip>
                  <Dialog
                    classes={{
                      paper: classes2.modal,
                    }}
                    open={noticeModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setNoticeModal(false)}
                    aria-labelledby="notice-modal-slide-title"
                    aria-describedby="notice-modal-slide-description"
                  >
                    <DialogTitle
                      id="notice-modal-slide-title"
                      disableTypography
                      className={classes2.modalHeader}
                    >
                      <Button
                        justIcon
                        className={classes2.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="transparent"
                        onClick={() => setNoticeModal(false)}
                      >
                        <Close className={classes2.modalClose} />
                      </Button>
                      <div align="center">
                        <h4 className={classes2.modalTitle}>Robert,J</h4>
                      </div>
                    </DialogTitle>
                    <DialogContent id="notice-modal-slide-description">
                      <Card>
                        <CardBody>
                          <NavPills
                            color="warning"
                            tabs={[
                              {
                                tabButton: "Client Info",
                                tabContent: (
                                  <span>
                                    <p>
                                      <strong>Address :</strong>
                                      115 Stivali Street
                                    </p>

                                    <p>
                                      <strong>Contact Person :</strong>
                                      Narge Velasco
                                    </p>

                                    <p>
                                      <strong>Contact Number :</strong>
                                      925-8767917
                                    </p>
                                  </span>
                                ),
                              },
                              {
                                tabButton: "Service Info",
                                tabContent: (
                                  <span>
                                    <p>
                                      <strong>Visit Frequency: </strong>
                                      3x/Week
                                    </p>

                                    <p>
                                      <strong>Day :</strong>
                                      Mon,Tue,Wed
                                    </p>
                                    <p>
                                      <strong>Time :</strong>
                                      Open
                                    </p>
                                  </span>
                                ),
                              },
                              {
                                tabButton: "Contracted Rate",
                                tabContent: (
                                  <span>
                                    <p>
                                      <strong>Service Rate: </strong>
                                      $30/visit
                                    </p>
                                    <p>
                                      <strong>Mileage Rate: </strong>
                                      $.50/mile
                                    </p>
                                  </span>
                                ),
                              },
                            ]}
                          />
                        </CardBody>
                      </Card>
                    </DialogContent>
                    <DialogActions
                      className={
                        classes2.modalFooter + " " + classes2.modalFooterCenter
                      }
                    >
                      <Button
                        onClick={() => setNoticeModal(false)}
                        color="info"
                        round
                      >
                        Sounds Good
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <Card>
                    <CardHeader color="success" icon>
                      <CardIcon color="success">
                        <EventOutlined />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Date of Service</h4>
                    </CardHeader>
                    <CardBody>
                      <FormControl fullWidth>
                        <Datetime
                          timeFormat={false}
                          inputProps={{ placeholder: "Date Here" }}
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Card>
                    <CardHeader color="success" icon>
                      <CardIcon color="success">
                        <AvTimer />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Time In</h4>
                    </CardHeader>
                    <CardBody>
                      <FormControl fullWidth>
                        <Datetime
                          dateFormat={false}
                          inputProps={{ placeholder: "Time In here" }}
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Card>
                    <CardHeader color="success" icon>
                      <CardIcon color="success">
                        <AvTimer />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Time Out</h4>
                    </CardHeader>
                    <CardBody>
                      <FormControl fullWidth>
                        <Datetime
                          dateFormat={false}
                          inputProps={{ placeholder: "Time Out Here" }}
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="danger" icon>
                  <CardIcon color="danger">
                    <DriveEta />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Log Mileage</h4>
                </CardHeader>
                <CardBody>
                  <FormControl fullWidth>
                    <CustomInput
                      id="mileage"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        placeholder: "mileage here",
                      }}
                    />
                  </FormControl>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="info" icon>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: "0 0 90%" }}>
                      <div style={{ display: "inline-flex" }}>
                        <CardIcon color="info">
                          <Gesture />
                        </CardIcon>

                        <h4 className={classes.cardIconTitle}>Signature</h4>
                      </div>
                    </div>
                    <Tooltip title="Clear Signature">
                      <ClearOutlined style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardBody>
                  <ReactSignatureCanvas
                    penColor="green"
                    onBegin={(e) => onBeginHandler(e)}
                    ref={(ref) => {
                      sigCanvas.current = ref;
                    }}
                    canvasProps={{
                      height: 80,
                      width: 500,
                      background: "white",
                      className: "sigCanvas",
                    }}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={5}>
              <Button color="primary" round className={classes.marginRight}>
                <Favorite className={classes.icons} /> Submit
              </Button>
            </GridItem>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

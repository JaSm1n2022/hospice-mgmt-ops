import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import Admin from "@material-ui/icons/BusinessCenterOutlined";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
import Face from "@material-ui/icons/Face";
import AutoAwesomeIcon from "@material-ui/icons/MailOutlineOutlined";
import Work from "@material-ui/icons/Work";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";
import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
const useStyles = makeStyles(styles);

export default function RegisterPage() {
  const [checked, setChecked] = React.useState([]);
  const [classicModal, setClassicModal] = React.useState(false);
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const TermsAndConditions = () => {
    return (
      <div
        style={{
          maxHeight: "600px",
          overflowY: "auto",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        <h2>Terms and Conditions for Registration</h2>
        <h3>Terms and Conditions</h3>

        <p>
          <strong>
            By registering for and using this system, you acknowledge and agree
            to the following:
          </strong>
        </p>

        <h4>Purpose of the System</h4>
        <p>
          This system is designed exclusively for internal company use to manage
          hospice supplies inventory, facilitate company budgeting and expense
          tracking, and streamline administrative processes. It is intended for
          authorized personnel only, such as office managers, payroll staff, and
          logistics administrators.
        </p>

        <h4>No Patient Information Stored</h4>
        <p>
          This system does not store or process any patient-specific
          information, including but not limited to full names, dates of birth
          (DOB), social security numbers, medical records, or protected health
          information (PHI). It is strictly for non-clinical, administrative
          functions.
        </p>

        <h4>Data Usage and Security</h4>
        <p>
          All uploaded and stored documents are securely saved within the
          system’s database. Your usage of this system must comply with company
          policies on data handling and confidentiality. Any unauthorized
          access, sharing, or misuse of data is strictly prohibited and may
          result in disciplinary action.
        </p>

        <h4>User Responsibility</h4>
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activity conducted under your account. You
          must report any unauthorized use or security breach to the system
          administrator immediately.
        </p>

        <h4>System Access and Usage</h4>
        <p>
          The system is provided "as is" and is intended to support internal
          administrative workflows, including generating reports in PDF and
          Excel formats. Access may be suspended or revoked if terms are
          violated.
        </p>

        <h4>Modifications and Updates</h4>
        <p>
          The company reserves the right to update or modify these Terms and
          Conditions at any time. Continued use of the system after such changes
          constitutes your acceptance of the updated terms.
        </p>
      </div>
    );
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card className={classes.cardSignup}>
            <h2 className={classes.cardTitle}>Register</h2>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={5}>
                  <InfoArea
                    title="Operations Management"
                    description="This system is designed specifically for managing hospice supplies inventory and
                    facilitating comprehensive company budgeting and expense tracking. It does not store
                    any patient-specific information such as date of birth (DOB), full names, social security
                    number, or medical details. The purpose of this system is to streamline administrative
                    functions for the office manager, payroll personnel, and logistics administrator by
                    digitizing document processes and storing them securely in the database. This enables
                    easy generation of reports in PDF and Excel formats."
                    icon={Admin}
                    iconColor="rose"
                  />
                  <InfoArea
                    title=" Magic Link authentication"
                    description="For your security and convenience, this system uses Magic Link authentication. Upon registration, you will receive a secure login link via email. This ensures password-free access while maintaining the confidentiality of administrative data stored in the system."
                    icon={AutoAwesomeIcon}
                    iconColor="info"
                  ></InfoArea>
                </GridItem>
                <GridItem xs={12} sm={8} md={5}>
                  <div className={classes.center} style={{ display: "none" }}>
                    <Button justIcon round color="twitter">
                      <i className="fab fa-twitter" />
                    </Button>
                    {` `}
                    <Button justIcon round color="dribbble">
                      <i className="fab fa-dribbble" />
                    </Button>
                    {` `}
                    <Button justIcon round color="facebook">
                      <i className="fab fa-facebook-f" />
                    </Button>
                    {` `}
                    <h4 className={classes.socialTitle}>or be classical</h4>
                  </div>
                  <form className={classes.form}>
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Work className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: "Company ID",
                      }}
                    />
                    {/*
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: "Name...",
                      }}
                    />
                    */}
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: "Email...",
                      }}
                    />
                    {/*
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        placeholder: "Password...",
                      }}
                    />
                    */}
                    <FormControlLabel
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(1)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      }
                      label={
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          I agree to the
                          <Button
                            onClick={() => setClassicModal(true)}
                            variant="contained"
                            color="info"
                            style={{
                              borderRadius: "20px",
                              fontSize: "10pt",
                              textTransform: "none",
                              padding: "4px 12px",
                              minWidth: "unset", // prevents full-width look
                            }}
                          >
                            Terms and Conditions
                          </Button>
                        </span>
                      }
                    />

                    <div className={classes.center}>
                      <Button round color="primary">
                        Get started
                      </Button>
                    </div>
                  </form>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={classicModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setClassicModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => setClassicModal(false)}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Terms And Conditions</h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          {TermsAndConditions()}
        </DialogContent>
        <DialogActions className={classes.modalFooter}>
          <Button onClick={() => setClassicModal(false)} color="danger" simple>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

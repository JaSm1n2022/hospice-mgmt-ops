import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import TOAST from "../../modules/toastManager";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { supabaseClient } from "config/SupabaseClient";
import SnackbarContent from "components/Snackbar/SnackbarContent";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [color, setColor] = React.useState("rose");
  const [loginEmailState, setloginEmailState] = React.useState("");
  const [tc, setTC] = React.useState(false);
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const handleLogin = async () => {
    try {
      if (loginEmailState === "error") {
        setColor("rose");
        setMessage("Invalid email address.");
        showNotification("tc");
        return;
      }
      const { error } = await supabaseClient.auth.signInWithOtp({ email });
      if (error) throw error;
      setColor("success");
      setMessage(
        "We’ve emailed you a magic link. Give it a click and you’re in!"
      );
      showNotification("tc");
    } catch (error) {
      setColor("rose");
      setMessage(
        "Oops! We couldn’t sign you in. Please verify your email address or reach out to support."
      );
      showNotification("tc");
    } finally {
      const user = supabaseClient.auth.getUser();
      if (user) {
        console.log("user->>>", user);
      }
    }
  };

  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  const showNotification = (place) => {
    switch (place) {
      case "tc":
        if (!tc) {
          setTC(true);
          setTimeout(function () {
            setTC(false);
          }, 6000);
        }
        break;
      default:
        break;
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
                {/*
                <div className={classes.socialLine}>
                  {[
                    "fab fa-facebook-square",
                    "fab fa-twitter",
                    "fab fa-google-plus",
                  ].map((prop, key) => {
                    return (
                      <Button
                        color="transparent"
                        justIcon
                        key={key}
                        className={classes.customButtonClass}
                      >
                        <i className={prop} />
                      </Button>
                    );
                  })}
                </div>
                */}
              </CardHeader>
              <CardBody>
                {tc && (
                  <div style={{ paddingTop: 10 }}>
                    <SnackbarContent
                      message={message}
                      close
                      color={color}
                      icon={AddAlert}
                    />
                  </div>
                )}
                <span>
                  <strong>Secure Magic Link Login:</strong> Enter your email and
                  we'll send you a one-time secure login link. No password
                  needed.
                </span>
                {/*
                <CustomInput
                  labelText="First Name.."
                  id="firstname"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
                */}
                <form>
                  <CustomInput
                    success={loginEmailState === "success"}
                    error={loginEmailState === "error"}
                    labelText="Email Address *"
                    id="loginemail"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyEmail(event.target.value)) {
                          setloginEmailState("success");
                        } else {
                          setloginEmailState("error");
                        }
                        setEmail(event.target.value);
                      },
                      type: "email",
                    }}
                  />

                  <div className={classes.formCategory}>
                    <small>*</small> Required fields
                  </div>
                  <div className={classes.center}>
                    <Button color="rose" onClick={handleLogin}>
                      Login
                    </Button>
                  </div>
                </form>
                {/*
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                  }}
                />
                */}
              </CardBody>
              {/*
              <CardFooter className={classes.justifyContentCenter}>
                <Button
                  color="rose"
                  simple
                  size="lg"
                  block
                  onChange={() => handleLogin()}
                >
                  Let{"'"}s Go
                </Button>
              </CardFooter>
             */}
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}

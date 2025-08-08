import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "../../assets/jss/material-dashboard-pro-react/layouts/authStyle.js";
import styles2 from "../../assets/jss/material-dashboard-pro-react/views/errorPageStyles.js";
import { supabaseClient } from "config/SupabaseClient";
import login from "assets/img/login.jpeg";
import Button from "components/CustomButtons/Button.js";
const useStyles = makeStyles(styles);

const useStyles2 = makeStyles(styles2);
export default function RolPage() {
  const wrapper = React.createRef();
  React.useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  });
  const logout = async () => {
    console.log("[LOG ME OUT]");

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Optional: Clear your app state if you're using Redux, context, etc.

      console.log("User signed out.");
      window.location.href = "/";
    }
  };
  const classes = useStyles();
  const classes2 = useStyles2();
  return (
    <div
      className={classes.wrapper}
      ref={wrapper}
      style={{ backgroundImage: "url(" + login + ")" }}
    >
      <div style={{ alignItems: "center" }}>
        <GridContainer>
          <GridItem md={12}>
            <div align="center" style={{ paddingTop: 200 }}>
              <h1 style={{ color: "white", fontWeight: "bold" }}>
                PERMISSION DENIED
              </h1>
              <h4 style={{ color: "white", fontWeight: "bold" }}>
                You do not have permission to access this site. Please contact
                your administrator.
              </h4>
              <Button onClick={() => logout()} color="danger">
                EXIT
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

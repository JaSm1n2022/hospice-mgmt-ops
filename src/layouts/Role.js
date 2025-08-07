import React, { useState } from "react";

import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { supabaseClient } from "config/SupabaseClient";
import { ExitToApp, ExitToAppOutlined } from "@material-ui/icons";

const Role = () => {
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
  console.log("[ROLE CALLED]");

  return (
    <>
      <div align="center" style={{ paddingTop: 50, background: "#56764c" }}>
        <Grid
          container
          direction="row"
          spacing={2}
          align="center"
          justify="center"
          alignItems="center"
        >
          <Grid item md={12} sm={12} style={{ paddingTop: 10 }}>
            <Typography style={{ color: "white" }}>
              You do not have permission to access this site. Please contact
              your administrator.
            </Typography>
            <div style={{ paddingTop: 10 }}>
              <div style={{ display: "inline-flex", gap: 8, color: "black" }}>
                <Button
                  variant="contained"
                  primary="secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => logout()}
                  startIcon={<ExitToAppOutlined />}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Role;

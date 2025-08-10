import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  item: {
    ...theme.typography.body2,
    textAlign: "left",
    paddingLeft: 4,
    color: theme.palette.text.secondary,
    height: 40,
    lineHeight: "40px",
  },
}));

const lightTheme = createMuiTheme({ palette: { mode: "light" } });

export default function Pod(props) {
  const classes = useStyles();

  return (
    <div
      style={{
        maxHeight: props.isMobile ? "300px" : "400px",
        overflow: "auto",
        width: "100%",
      }}
      align="left"
    >
      <Grid container spacing={2}>
        {props.dataSource?.map((item, index) => (
          <Grid item xs={props.isMobile ? 12 : 6} key={index}>
            <ThemeProvider theme={lightTheme}>
              <Box
                style={{
                  borderRadius: 8,
                  backgroundColor: "#56764c",
                  display: "grid",
                  paddingLeft: 8,
                  paddingRight: 8,
                  gridTemplateColumns: "1fr",
                }}
              >
                <Paper
                  elevation={1}
                  className={classes.item}
                  style={{ height: 50, overflow: "auto" }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      gap: 1,
                      overflow: "auto",
                    }}
                    align="left"
                  >
                    <Typography variant="body2">
                      {index + 1}. {item.short_description || item.description}{" "}
                      / {item.order_qty} {item.unit_uom}
                    </Typography>
                  </div>
                </Paper>
              </Box>
            </ThemeProvider>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

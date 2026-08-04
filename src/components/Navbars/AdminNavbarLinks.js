import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import { Typography } from "@material-ui/core";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import { supabaseClient } from "config/SupabaseClient";

const storageUtil = require("utils/storageUtil");

const useStyles = makeStyles(styles);

// Generate app version based on current date/time (YYMMDD-HHMM format)
const getAppVersion = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
};

export default function HeaderLinks(props) {
  const [openNotification, setOpenNotification] = React.useState(null);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const logout = async () => {
    try {
      // Close the profile dropdown
      setOpenProfile(null);

      // Clear localStorage
      storageUtil.removeToken();
      storageUtil.removeUser();
      storageUtil.removeExpirationDt();
      storageUtil.removeUserId();
      storageUtil.removeDExist();

      // Try to get a session first
      const { data } = await supabaseClient.auth.getSession();

      if (data.session) {
        // Prefer global to revoke tokens across devices
        const { error } = await supabaseClient.auth.signOut({ scope: "global" });
        if (error) {
          // Fallback to local if the server rejects (e.g., token already invalid)
          await supabaseClient.auth.signOut({ scope: "local" });
        }
      } else {
        // No session in memory: just clear local state
        await supabaseClient.auth.signOut({ scope: "local" });
      }

      // Clear all supabase local storage items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // Force redirect to login
      window.location.replace("/auth/login-page");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear storage and redirect
      localStorage.clear();
      window.location.replace("/auth/login-page");
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const classes = useStyles();
  const { rtlActive } = props;
  const searchButton =
    classes.top +
    " " +
    classes.searchButton +
    " " +
    classNames({
      [classes.searchRTL]: rtlActive,
    });
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive,
  });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive,
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true,
  });
  return (
    <div className={wrapper}>
      {/* Hidden: Search input and button */}
      {/* Hidden: Dashboard icon */}
      {/* Hidden: Notifications/Badge icon */}

      <div className={managerClasses}>
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-owns={openProfile ? "profile-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : "",
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <Hidden mdUp implementation="css">
            <span onClick={handleClickProfile} className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : "Profile"}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem disabled style={{ opacity: 1, cursor: 'default', padding: '8px 16px' }}>
                      <div style={{ width: '100%' }}>
                        <Typography variant="caption" style={{ fontSize: '11px', color: '#999', display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                          APP VERSION
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '12px', color: '#666', display: 'block' }}>
                          App v{getAppVersion()}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: '12px', color: '#666', display: 'block' }}>
                          React v{React.version}
                        </Typography>
                      </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout} className={dropdownItem}>
                      {rtlActive ? "الخروج" : "Log out"}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

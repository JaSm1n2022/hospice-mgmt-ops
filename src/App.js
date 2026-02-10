import React, { useEffect, useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  ToastProvider,
  DefaultToastContainer,
} from "react-toast-notifications";
import { connect } from "react-redux";

import Admin from "layouts/Admin.js";
import Discipline from "layouts/Discipline";
import Role from "views/Pages/RolePage";
import AuthLayout from "layouts/Auth.js";

import { supabaseClient } from "./config/SupabaseClient";
import { ACTION_STATUSES } from "utils/constants";

import "assets/css/material-dashboard-pro-react.css?v=1.10.0";
import { profileListStateSelector } from "store/selectors/profileSelector";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchProfile } from "store/actions/profileAction";
import { resetFetchProfileState } from "store/actions/profileAction";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { resetFetchEmployeeState } from "store/actions/employeeAction";

export const CustomToastContainer = (props) => (
  <DefaultToastContainer {...props} style={{ zIndex: 9999 }} />
);

export const SupaContext = createContext();

function App({
  profileState,
  employeeState,
  fetchProfile,
  resetProfiles,
  listEmployee,
  resetListEmployee,
}) {
  const [session, setSession] = useState(null);
  const [signedIn, setSignedIn] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 1024
  );

  const [userProfile, setUserProfile] = useState(undefined);
  const [employeeProfile, setEmployeeProfile] = useState(undefined);

  // Initialize session and auth listener
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setSession(data.session);
      setSignedIn(!!data.session);
    };

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setSignedIn(!!newSession);
        if (newSession?.user?.email) {
          fetchProfile({ email: newSession.user.email });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }

    if (typeof window !== "undefined") {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      // remove event listener when the component is unmounted to not cause any memory leaks
      // otherwise the event listener will continue to be active
      window.removeEventListener("resize", handleResize);
    };
    // add `isMobile` state variable as a dependency so that
    // it is called every time the window is resized
  }, [isMobile]);

  // Fetch profile and employee info
  useEffect(() => {
    if (profileState.status === ACTION_STATUSES.SUCCEED && !userProfile) {
      resetProfiles();

      const profile = profileState?.data?.[0];
      setUserProfile(profile);
      if (profile) {
        console.log("[EMPLOYEE MUST]", profile);
        listEmployee({
          email: profile.username,
          companyId: profile.companyId,
        });
      } else {
        setSignedIn(false);
      }
    }
  }, [profileState, userProfile, listEmployee, resetProfiles]);

  useEffect(() => {
    if (employeeState.status === ACTION_STATUSES.SUCCEED && !employeeProfile) {
      const employee = employeeState?.data?.[0];
      setEmployeeProfile(employee);
      resetListEmployee();
    }
  }, [employeeState, employeeProfile, resetListEmployee]);

  // Determine routes based on user role
  console.log(
    "[SIGN IN]",
    signedIn,
    session,
    userProfile,
    employeeState,
    employeeProfile
  );
  const renderRoutes = () => {
    if (!signedIn || !session) {
      return (
        <Switch>
          <Route path="/auth" component={AuthLayout} />
          <Redirect from="/" to="/auth" />
        </Switch>
      );
    }

    // For admin: only require userProfile, employee profile is optional
    // For clinician: require both userProfile and employeeProfile
    if (userProfile?.companyId) {
      if (userProfile.role === "admin") {
        return (
          <Switch>
            <Route path="/admin" component={Admin} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        );
      } else if (userProfile.role === "clinician" && employeeProfile?.id) {
        return (
          <Switch>
            <Route path="/discipline" component={Discipline} />
            <Redirect from="/" to="/discipline/dashboard" />
          </Switch>
        );
      } else if (userProfile.role === "clinician" && !employeeProfile?.id) {
        // Clinician needs employee profile, keep waiting
        return (
          <Switch>
            <Route path="/auth" component={AuthLayout} />
            <Redirect from="/" to="/auth" />
          </Switch>
        );
      } else {
        return (
          <Switch>
            <Route path="/role" component={Role} />
            <Redirect from="/" to="/role" />
          </Switch>
        );
      }
    }

    return (
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Redirect from="/" to="/auth" />
      </Switch>
    );
  };

  return (
    <ToastProvider components={{ ToastContainer: CustomToastContainer }}>
      <SupaContext.Provider value={{ userProfile, employeeProfile, isMobile }}>
        {renderRoutes()}
      </SupaContext.Provider>
    </ToastProvider>
  );
}

const mapStateToProps = (store) => ({
  profileState: profileListStateSelector(store),
  employeeState: employeeListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  fetchProfile: (data) => dispatch(attemptToFetchProfile(data)),
  resetProfiles: () => dispatch(resetFetchProfileState()),
  listEmployee: (data) => dispatch(attemptToFetchEmployee(data)),
  resetListEmployee: () => dispatch(resetFetchEmployeeState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

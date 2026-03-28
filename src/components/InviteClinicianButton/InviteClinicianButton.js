import React, { useState } from "react";
import PropTypes from "prop-types";
import { supabaseClient } from "config/SupabaseClient";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import Button from "components/CustomButtons/Button.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

const styles = {
  inviteButton: {
    marginLeft: "5px",
  },
};

const useStyles = makeStyles(styles);

/**
 * InviteClinicianButton Component
 *
 * A button component that invites a clinician user via Supabase Edge Function
 *
 * @param {string} email - Employee's email address
 * @param {string} name - Employee's full name
 * @param {string} companyId - Company ID to associate with the clinician
 * @param {function} onSuccess - Optional callback function after successful invitation
 * @param {function} onError - Optional callback function on error
 */
function InviteClinicianButton({ email, name, companyId, onSuccess, onError }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("success");

  const showNotification = (message, color = "success") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setNotification(true);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification(false);
    }, 4000);
  };

  const handleInviteClinician = async () => {
    // Validation
    if (!email || !name || !companyId) {
      showNotification("Missing required information: email, name, or company ID", "danger");
      return;
    }

    setLoading(true);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabaseClient.functions.invoke(
        "invite-clinician",
        {
          body: {
            email: email,
            name: name,
            companyId: companyId,
          },
        }
      );

      if (error) {
        throw error;
      }

      // Check if there's an error in the response data
      if (data?.error) {
        throw new Error(data.error);
      }

      // Success
      showNotification(
        `Invitation sent successfully to ${email}!`,
        "success"
      );

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }

    } catch (error) {
      console.error("Error inviting clinician:", error);

      const errorMessage = error.message || "Failed to send invitation. Please try again.";
      showNotification(errorMessage, "danger");

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="info"
        size="sm"
        round
        className={classes.inviteButton}
        onClick={handleInviteClinician}
        disabled={loading}
      >
        {loading ? (
          <>
            <CircularProgress size={16} color="inherit" />
            <span style={{ marginLeft: 8 }}>Sending...</span>
          </>
        ) : (
          "Invite Clinician"
        )}
      </Button>

      <Snackbar
        place="tc"
        color={notificationColor}
        icon={AddAlert}
        message={notificationMessage}
        open={notification}
        closeNotification={() => setNotification(false)}
        close
      />
    </>
  );
}

InviteClinicianButton.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default InviteClinicianButton;

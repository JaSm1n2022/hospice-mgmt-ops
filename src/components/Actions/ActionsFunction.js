import { Button, CircularProgress } from "@material-ui/core";

import React, { useState } from "react";

import YesNoModal from "components/Modal/YesNoModal";
import { Delete, Edit, Print, Mail } from "@material-ui/icons";
import { useEffect } from "react";
import { supabaseClient } from "config/SupabaseClient";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";

export default function DialogFunction(props) {
  const [isRowForDelete, setIsRowForDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("success");

  useEffect(() => {
    if (props.data) {
      // console.log('[CurrentItem]', currentItem);

      setCurrentItem(props.data);
    }
  }, [props.data]);
  const showNotification = (message, color = "success") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setNotification(true);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification(false);
    }, 4000);
  };

  const openEditModalHandler = () => {
    props.createFormHandler(currentItem, "edit");
  };
  const printRecordHandler = () => {
    props.printHandler(currentItem);
  };
  const deleteRecordHandler = () => {
    setIsRowForDelete(true);
  };
  const noDeleteHandler = () => {
    setIsRowForDelete(false);
  };
  const deleteRowHandler = () => {
    setIsRowForDelete(false);

    props.deleteRecordItemHandler(currentItem.id, currentItem);
  };

  const handleInviteClinician = async () => {
    // Validation
    if (!currentItem?.email || !currentItem?.name || !currentItem?.companyId) {
      showNotification(
        "Missing required information: email, name, or company ID",
        "danger"
      );
      return;
    }

    setInviteLoading(true);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabaseClient.functions.invoke(
        "invite-clinician",
        {
          body: {
            email: currentItem.email,
            name: currentItem.name,
            companyId: currentItem.companyId,
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
        `Invitation sent successfully to ${currentItem.email}!`,
        "success"
      );
    } catch (error) {
      console.error("Error inviting clinician:", error);

      const errorMessage =
        error.message || "Failed to send invitation. Please try again.";
      showNotification(errorMessage, "danger");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <React.Fragment>
      {currentItem ? (
        <div style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
          <Edit
            style={{ color: "#2196f3", cursor: "pointer" }}
            onClick={() => openEditModalHandler()}
          />
          <Delete
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => deleteRecordHandler()}
          />
          {props.showInviteButton && (
            inviteLoading ? (
              <CircularProgress size={20} style={{ color: "#4caf50" }} />
            ) : (
              <Mail
                style={{ color: "#4caf50", cursor: "pointer" }}
                onClick={() => handleInviteClinician()}
              />
            )
          )}
          {props.isPrintFunction && (
            <Print
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => printRecordHandler()}
            />
          )}
        </div>
      ) : null}
      {isRowForDelete && (
        <YesNoModal
          description={"Do you wish to delete this record"}
          isOpen={isRowForDelete}
          noHandler={noDeleteHandler}
          yesHandler={deleteRowHandler}
        />
      )}
      <Snackbar
        place="tc"
        color={notificationColor}
        icon={AddAlert}
        message={notificationMessage}
        open={notification}
        closeNotification={() => setNotification(false)}
        close
      />
    </React.Fragment>
  );
}

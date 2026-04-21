import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

// Core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// Redux actions and selectors
import { attemptToFetchPatient } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

// Context
import { SupaContext } from "../../../../App";

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  iframeContainer: {
    width: "100%",
    minHeight: "800px",
    border: "none",
    borderRadius: "8px",
  },
}));

function DmeManagement() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const iframeRef = useRef(null);
  const context = useContext(SupaContext);

  // Get companyId from context (matches VisitTracker pattern)
  const companyId = context?.userProfile?.companyId;

  // Fetch patient list from Redux
  const patientListState = useSelector(patientListStateSelector);
  const patientList = patientListState?.data || [];

  useEffect(() => {
    // Fetch patients when component mounts and companyId is available
    if (companyId) {
      dispatch(attemptToFetchPatient({ companyId }));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    // Send patient list to iframe when it loads and when patient data changes
    const iframe = iframeRef.current;

    if (iframe && patientList.length > 0) {
      const sendPatientData = () => {
        try {
          // Format patient data for the iframe
          const patientCodes = patientList.map(patient => ({
            code: patient.patientCd,
            name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
            fullData: patient
          }));

          // Send data to iframe via postMessage
          iframe.contentWindow.postMessage({
            type: 'PATIENT_DATA',
            patientCodes: patientCodes
          }, '*');

          console.log('✓ Sent', patientCodes.length, 'patients to iframe');
        } catch (error) {
          console.error('Error sending patient data to iframe:', error);
        }
      };

      // Wait for iframe to load
      iframe.addEventListener('load', sendPatientData);

      // Also try sending immediately in case iframe is already loaded
      if (iframe.contentWindow) {
        sendPatientData();
      }

      return () => {
        iframe.removeEventListener('load', sendPatientData);
      };
    }
  }, [patientList]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitle}>DME Management - Patient Mapping</h4>
          </CardHeader>
          <CardBody>
            <iframe
              ref={iframeRef}
              src="/patient_mapping.html"
              className={classes.iframeContainer}
              title="Patient Equipment Mapping"
              style={{ width: "100%", minHeight: "800px", border: "none" }}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default DmeManagement;

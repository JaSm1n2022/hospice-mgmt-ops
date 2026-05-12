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
import { attemptToCreateDmeInvoice } from "store/actions/dmeInvoiceAction";
import { dmeInvoiceCreateStateSelector } from "store/selectors/dmeInvoiceSelector";

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

  // Get DME invoice create state to monitor submit status
  const dmeInvoiceCreateState = useSelector(dmeInvoiceCreateStateSelector);

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
          // Filter patients based on DME equipment and EOC status
          const now = new Date();
          const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

          const filteredPatients = patientList.filter(patient => {
            // Exclude patients with no DME equipment
            const hasDme = patient.dme && Array.isArray(patient.dme) && patient.dme.length > 0;
            if (!hasDme) {
              return false;
            }

            // Include patient if they don't have an EOC date (still active)
            if (!patient.eoc_dt) {
              return true;
            }

            // Parse EOC date
            const eocDate = new Date(patient.eoc_dt);

            // Exclude patients who have been EOC for more than 60 days
            return eocDate >= sixtyDaysAgo;
          });

          // Format patient data for the iframe
          const patientCodes = filteredPatients.map(patient => ({
            code: patient.patientCd,
            name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
            fullData: patient
          }));

          // Send data to iframe via postMessage
          iframe.contentWindow.postMessage({
            type: 'PATIENT_DATA',
            patientCodes: patientCodes
          }, '*');

          console.log('✓ Sent', patientCodes.length, 'patients to iframe (filtered from', patientList.length, 'total)');
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

  useEffect(() => {
    // Listen for submit message from iframe
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'SUBMIT_DME_INVOICE') {
        console.log('Received DME Invoice submit:', event.data);

        const { invoice_dt, items } = event.data.data;

        // Dispatch action to create DME invoice
        dispatch(attemptToCreateDmeInvoice({
          invoice_dt,
          items,
          companyId,
          userProfile: context.userProfile,
        }));
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, companyId, context.userProfile]);

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

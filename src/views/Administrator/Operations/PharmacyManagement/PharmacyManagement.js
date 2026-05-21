import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

// Material UI
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import GetAppIcon from "@material-ui/icons/GetApp";

// Core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import HospiceTable from "components/Table/HospiceTable.js";
import FilterTable from "components/Table/FilterTable.js";

// Custom components
import InvoiceExtractorModal from "./components/InvoiceExtractorModal";
import PharmacyInvoiceHandler from "./handler/PharmacyInvoiceHandler";

// Redux actions and selectors
import { attemptToFetchPatient } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import {
  attemptToCreatePharmacyInvoice,
  attemptToFetchPharmacyInvoice
} from "store/actions/pharmacyInvoiceAction";
import {
  pharmacyInvoiceCreateStateSelector,
  pharmacyInvoiceListStateSelector
} from "store/selectors/pharmacyInvoiceSelector";

// Utilities
import { handleExport } from "utils/XlsxHelper";

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
  filterSection: {
    marginBottom: "20px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
}));

function PharmacyManagement() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const context = useContext(SupaContext);
  const iframeRef = useRef(null);

  // Get companyId from context
  const companyId = context?.userProfile?.companyId;

  // Redux state
  const patientListState = useSelector(patientListStateSelector);
  const pharmacyInvoiceListState = useSelector(pharmacyInvoiceListStateSelector);
  const pharmacyInvoiceCreateState = useSelector(pharmacyInvoiceCreateStateSelector);

  // Local state
  const [patientList, setPatientList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [originalSource, setOriginalSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isExtractorModalOpen, setIsExtractorModalOpen] = useState(false);
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Initialize columns
  useEffect(() => {
    setColumns(PharmacyInvoiceHandler.columns());
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (companyId) {
      dispatch(attemptToFetchPatient({ companyId }));

      // Fetch invoices for the current month by default
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const from = moment(firstDay).format("YYYY-MM-DD");
      const to = moment(lastDay).format("YYYY-MM-DD");

      setDateFrom(from);
      setDateTo(to);

      dispatch(attemptToFetchPharmacyInvoice({ companyId, from, to }));
    }
  }, [dispatch, companyId]);

  // Update patient list when Redux state changes
  useEffect(() => {
    if (patientListState?.data && Array.isArray(patientListState.data)) {
      setPatientList(patientListState.data);
    }
  }, [patientListState]);

  // Map invoice data when it changes
  useEffect(() => {
    if (pharmacyInvoiceListState?.data && Array.isArray(pharmacyInvoiceListState.data)) {
      const mapped = PharmacyInvoiceHandler.mapData(pharmacyInvoiceListState.data, patientList);
      setDataSource(mapped);
      setOriginalSource(mapped);
    }
  }, [pharmacyInvoiceListState, patientList]);

  // Refresh data when invoice is created successfully
  useEffect(() => {
    if (pharmacyInvoiceCreateState?.status === "SUCCEED") {
      // Close modal and refresh data
      setIsExtractorModalOpen(false);

      if (companyId && dateFrom && dateTo) {
        dispatch(attemptToFetchPharmacyInvoice({ companyId, from: dateFrom, to: dateTo }));
      }
    }
  }, [pharmacyInvoiceCreateState, dispatch, companyId, dateFrom, dateTo]);

  // Send patient data to iframe when modal is open
  useEffect(() => {
    if (isExtractorModalOpen && iframeRef.current) {
      const sendPatientData = () => {
        try {
          if (patientList.length === 0) {
            return;
          }

          // Format patient data for the iframe
          const patientCodes = patientList.map(patient => ({
            code: patient.patientCd,
            name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
            fullData: patient
          }));

          // Send data to iframe via postMessage
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'PATIENT_DATA',
              patientCodes: patientCodes
            }, '*');
          }
        } catch (error) {
          console.error('Error sending patient data to iframe:', error);
        }
      };

      // Wait for iframe to load
      const iframe = iframeRef.current;
      iframe.addEventListener('load', sendPatientData);

      // Also try sending immediately in case iframe is already loaded
      setTimeout(sendPatientData, 500);
      setTimeout(sendPatientData, 1000);
      setTimeout(sendPatientData, 2000);

      return () => {
        iframe.removeEventListener('load', sendPatientData);
      };
    }
  }, [isExtractorModalOpen, patientList]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Handle submit invoice
      if (event.data && event.data.type === 'SUBMIT_PHARMACY_INVOICE') {
        console.log('Received Pharmacy Invoice submit:', event.data);

        const { invoice_dt, items } = event.data.data;

        // Dispatch action to create pharmacy invoice
        dispatch(attemptToCreatePharmacyInvoice({
          invoice_dt,
          items,
          companyId,
          userProfile: context.userProfile,
        }));
      }

      // Handle request for patient data
      if (event.data && event.data.type === 'REQUEST_PATIENT_DATA') {
        if (patientList.length === 0) {
          return;
        }

        // Format patient data
        const patientCodes = patientList.map(patient => ({
          code: patient.patientCd,
          name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
          fullData: patient
        }));

        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'PATIENT_DATA',
            patientCodes: patientCodes
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, companyId, context.userProfile, patientList]);

  // Calculate grand total
  const grandTotal = dataSource.reduce((sum, item) => {
    const total = parseFloat(item.total) || 0;
    return sum + total;
  }, 0);

  const handleOpenExtractor = () => {
    setIsExtractorModalOpen(true);
  };

  const handleCloseExtractor = () => {
    setIsExtractorModalOpen(false);
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    const dtSource = [...dataSource];

    if (isAll) {
      // Select/deselect all
      dtSource.forEach((item) => {
        item.isChecked = isAll;
      });
    } else if (!isAll && data && data.length > 0) {
      // Toggle single item
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && data.length === 0) {
      // Deselect all
      dtSource.forEach((item) => {
        item.isChecked = isAll;
      });
    }

    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    setDataSource(dtSource);
  };

  const exportToExcelHandler = () => {
    const selectedData = dataSource.filter((r) => r.isChecked);
    const excelData = PharmacyInvoiceHandler.prepareExcelData(selectedData);
    const fileName = `pharmacy_invoices_${moment().format("YYYY-MM-DD_HHmmss")}`;

    if (excelData && excelData.length) {
      handleExport(excelData, fileName);
    }
  };

  const filterRecordHandler = (keyword) => {
    let temp = [...originalSource];

    if (keyword) {
      temp = temp.filter((data) =>
        (data.patientCd && data.patientCd.toLowerCase().includes(keyword.toLowerCase())) ||
        (data.patientName && data.patientName.toLowerCase().includes(keyword.toLowerCase())) ||
        (data.rxNumber && data.rxNumber.toLowerCase().includes(keyword.toLowerCase())) ||
        (data.description && data.description.toLowerCase().includes(keyword.toLowerCase())) ||
        (data.createdBy && data.createdBy.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

    setDataSource(temp);
  };

  const filterByDateHandler = (from, to) => {
    setDateFrom(from);
    setDateTo(to);

    if (companyId && from && to) {
      dispatch(attemptToFetchPharmacyInvoice({ companyId, from, to }));
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitle}>
              Pharmacy Invoice Management
              <span style={{ float: "right", fontSize: "16px" }}>
                Grand Total: ${grandTotal.toFixed(2)}
              </span>
            </h4>
          </CardHeader>
          <CardBody>
            {/* Filter Section */}
            <GridContainer className={classes.filterSection}>
              <GridItem md={12} sm={12} xs={12}>
                <FilterTable
                  filterRecordHandler={filterRecordHandler}
                  filterByDateHandler={filterByDateHandler}
                />
              </GridItem>
            </GridContainer>

            {/* Action Buttons */}
            <div className={classes.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenExtractor}
              >
                Upload Invoice PDF
              </Button>

              {isAddGroupButtons && (
                <Tooltip title="Export selected invoices to Excel">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<GetAppIcon />}
                    onClick={exportToExcelHandler}
                  >
                    Export to Excel
                  </Button>
                </Tooltip>
              )}
            </div>

            {/* Table */}
            <GridContainer>
              <GridItem xs={12}>
                <HospiceTable
                  main={true}
                  height={600}
                  onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                  columns={columns}
                  dataSource={dataSource}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>

      {/* Invoice Extractor Modal */}
      <InvoiceExtractorModal
        isOpen={isExtractorModalOpen}
        onClose={handleCloseExtractor}
        iframeRef={iframeRef}
      />
    </GridContainer>
  );
}

export default PharmacyManagement;

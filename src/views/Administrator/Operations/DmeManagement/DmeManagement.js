import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// Material UI
import {
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";

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
import DmeInvoiceHandler from "./handler/DmeInvoiceHandler";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";

// Redux actions and selectors
import { attemptToFetchPatient } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
import {
  attemptToCreateDmeInvoice,
  attemptToFetchDmeInvoice,
} from "store/actions/dmeInvoiceAction";
import {
  dmeInvoiceCreateStateSelector,
  dmeInvoiceListStateSelector,
} from "store/selectors/dmeInvoiceSelector";
import { attemptToFetchVendor } from "store/actions/vendorAction";
import { vendorListStateSelector } from "store/selectors/vendorSelector";
import {
  attemptToCreateDistribution,
  resetCreateDistributionState,
} from "store/actions/distributionAction";
import { distributionCreateStateSelector } from "store/selectors/distributionSelector";
import { attemptToFetchProduct } from "store/actions/productAction";
import { productListStateSelector } from "store/selectors/productSelector";

// Utilities
import { handleExport } from "utils/XlsxHelper";
import nanoid8 from "utils/nanoid8";
import TOAST from "modules/toastManager";

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
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  filterSection: {
    marginBottom: "20px",
  },
}));

function DmeManagement() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const iframeRef = useRef(null);
  const context = useContext(SupaContext);

  // Get companyId from context
  const companyId = context?.userProfile?.companyId;

  // Redux state
  const patientListState = useSelector(patientListStateSelector);
  const dmeInvoiceListState = useSelector(dmeInvoiceListStateSelector);
  const dmeInvoiceCreateState = useSelector(dmeInvoiceCreateStateSelector);
  const vendorListState = useSelector(vendorListStateSelector);
  const distributionCreateState = useSelector(distributionCreateStateSelector);
  const productListState = useSelector(productListStateSelector);

  // Local state
  const [patientList, setPatientList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [originalSource, setOriginalSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isExtractorModalOpen, setIsExtractorModalOpen] = useState(false);
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);
  const [distributionDate, setDistributionDate] = useState(new Date());
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Initialize columns
  useEffect(() => {
    setColumns(DmeInvoiceHandler.columns());
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (companyId) {
      dispatch(attemptToFetchPatient({ companyId }));
      dispatch(attemptToFetchVendor({ companyId }));
      dispatch(attemptToFetchProduct({ companyId }));

      // Fetch invoices for the current month by default
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const from = moment(firstDay).format("YYYY-MM-DD");
      const to = moment(lastDay).format("YYYY-MM-DD");

      setDateFrom(from);
      setDateTo(to);

      dispatch(attemptToFetchDmeInvoice({ companyId, from, to }));
    }
  }, [dispatch, companyId]);

  // Update patient list when Redux state changes
  useEffect(() => {
    if (patientListState?.data && Array.isArray(patientListState.data)) {
      setPatientList(patientListState.data);
    }
  }, [patientListState]);

  // Update vendor list when Redux state changes
  useEffect(() => {
    if (vendorListState?.data && Array.isArray(vendorListState.data)) {
      // Filter only DME vendors
      const dmeVendors = vendorListState.data.filter(
        (vendor) =>
          vendor.categoryType === "DME" || vendor.category_type === "DME"
      );
      setVendorList(dmeVendors);
    }
  }, [vendorListState]);

  // Update product list when Redux state changes
  useEffect(() => {
    if (productListState?.data && Array.isArray(productListState.data)) {
      setProductList(productListState.data);
    }
  }, [productListState]);

  // Map invoice data when it changes
  useEffect(() => {
    if (dmeInvoiceListState?.data && Array.isArray(dmeInvoiceListState.data)) {
      const mapped = DmeInvoiceHandler.mapData(
        dmeInvoiceListState.data,
        patientList
      );
      setDataSource(mapped);
      setOriginalSource(mapped);
    }
  }, [dmeInvoiceListState, patientList]);

  // Refresh data when invoice is created successfully
  useEffect(() => {
    if (dmeInvoiceCreateState?.status === "SUCCEED") {
      // Close modal and refresh data
      setIsExtractorModalOpen(false);

      if (companyId && dateFrom && dateTo) {
        dispatch(
          attemptToFetchDmeInvoice({ companyId, from: dateFrom, to: dateTo })
        );
      }
    }
  }, [dmeInvoiceCreateState, dispatch, companyId, dateFrom, dateTo]);

  // Handle distribution creation success
  useEffect(() => {
    console.log("Distribution Create State:", distributionCreateState);

    if (distributionCreateState?.status === "SUCCEED") {
      console.log("Distribution created successfully!");
      TOAST.success("Distribution created successfully!");

      // Close modal and reset form
      setIsDistributionModalOpen(false);
      setSelectedVendor(null);
      setDistributionDate(new Date());

      // Refresh invoice data
      if (companyId && dateFrom && dateTo) {
        dispatch(
          attemptToFetchDmeInvoice({ companyId, from: dateFrom, to: dateTo })
        );
      }

      // Reset distribution state
      dispatch(resetCreateDistributionState());
    } else if (distributionCreateState?.status === "FAILED") {
      console.log(
        "Distribution creation failed:",
        distributionCreateState?.error
      );
      TOAST.error("Failed to create distribution. Please try again.");

      // Reset distribution state
      dispatch(resetCreateDistributionState());
    }
  }, [distributionCreateState, dispatch, companyId, dateFrom, dateTo]);

  // Send patient data to iframe when modal is open
  useEffect(() => {
    if (isExtractorModalOpen && iframeRef.current) {
      const sendPatientData = () => {
        try {
          if (patientList.length === 0) {
            return;
          }

          // Filter patients based on DME equipment and EOC status
          const now = new Date();
          const sixtyDaysAgo = new Date(
            now.getTime() - 60 * 24 * 60 * 60 * 1000
          );

          const filteredPatients = patientList.filter((patient) => {
            // Exclude patients with no DME equipment
            const hasDme =
              patient.dme &&
              Array.isArray(patient.dme) &&
              patient.dme.length > 0;
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
          const patientCodes = filteredPatients.map((patient) => ({
            code: patient.patientCd,
            name: `${patient.first_name || ""} ${
              patient.last_name || ""
            }`.trim(),
            fullData: patient,
          }));

          // Send data to iframe via postMessage
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: "PATIENT_DATA",
                patientCodes: patientCodes,
              },
              "*"
            );
          }
        } catch (error) {
          console.error("Error sending patient data to iframe:", error);
        }
      };

      // Wait for iframe to load
      const iframe = iframeRef.current;
      iframe.addEventListener("load", sendPatientData);

      // Also try sending immediately in case iframe is already loaded
      setTimeout(sendPatientData, 500);

      // Additional retry attempts to ensure data is sent
      setTimeout(sendPatientData, 1000);
      setTimeout(sendPatientData, 2000);

      return () => {
        iframe.removeEventListener("load", sendPatientData);
      };
    }
  }, [isExtractorModalOpen, patientList]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Handle submit invoice
      if (event.data && event.data.type === "SUBMIT_DME_INVOICE") {
        console.log("Received DME Invoice submit:", event.data);

        const { invoice_dt, items } = event.data.data;

        // Dispatch action to create DME invoice
        dispatch(
          attemptToCreateDmeInvoice({
            invoice_dt,
            items,
            companyId,
            userProfile: context.userProfile,
          })
        );
      }

      // Handle close modal request
      if (event.data && event.data.type === "CLOSE_INVOICE_MODAL") {
        console.log("Closing invoice extractor modal");
        setIsExtractorModalOpen(false);
      }

      // Handle request for patient data
      if (event.data && event.data.type === "REQUEST_PATIENT_DATA") {
        if (patientList.length === 0) {
          return;
        }

        // Filter and send patient data
        const now = new Date();
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const filteredPatients = patientList.filter((patient) => {
          // const hasDme = patient.dme && Array.isArray(patient.dme) && patient.dme.length > 0;
          // if (!hasDme) return false;
          if (!patient.eoc) return true;
          const eocDate = new Date(patient.eoc);
          return eocDate >= sixtyDaysAgo;
        });

        const patientCodes = filteredPatients.map((patient) => ({
          code: patient.patientCd,
          name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
          fullData: patient,
        }));

        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "PATIENT_DATA",
              patientCodes: patientCodes,
            },
            "*"
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, companyId, context.userProfile, patientList]);

  // Handlers
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
    const excelData = DmeInvoiceHandler.prepareExcelData(selectedData);
    const fileName = `dme_invoices_${moment().format("YYYY-MM-DD_HHmmss")}`;

    if (excelData && excelData.length) {
      handleExport(excelData, fileName);
    }
  };

  const handleOpenDistributionModal = () => {
    setIsDistributionModalOpen(true);
  };

  const handleCloseDistributionModal = () => {
    setIsDistributionModalOpen(false);
    setSelectedVendor(null);
    setDistributionDate(new Date());
  };

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorChange = (e) => {
    if (!e.target.value) {
      setSelectedVendor(null);
    }
  };

  const handleDistributionDateChange = (date) => {
    setDistributionDate(date);
  };

  const handleCreateDistribution = () => {
    if (!selectedVendor) {
      TOAST.error("Please select a vendor");
      return;
    }

    const selectedInvoices = dataSource.filter((r) => r.isChecked);
    if (selectedInvoices.length === 0) {
      TOAST.error("Please select at least one invoice");
      return;
    }

    // Find product by vendor name
    const vendorProduct = productList.find(
      (product) =>
        product.vendor &&
        product.vendor.toLowerCase() === selectedVendor.name.toLowerCase()
    );

    if (!vendorProduct) {
      TOAST.error(`No product found for vendor: ${selectedVendor.name}`);
      return;
    }

    // Prepare distribution payload based on selected invoices
    const groupId = uuidv4();
    const distributionPayload = [];

    selectedInvoices.forEach((invoice) => {
      // Parse and clean the invoice amount (remove $ and commas)
      const cleanAmount = invoice.invoice_amt
        ? parseFloat(invoice.invoice_amt.toString().replace(/[$,]/g, ""))
        : 0;

      // Find patient ID from patientCd
      const patient = patientList.find(
        (p) => p.patientCd === invoice.patientCd
      );
      const patientId = patient ? patient.id : null;

      const params = {
        created_at: new Date(),
        description: `${selectedVendor.name} Invoice`,
        short_description: `${selectedVendor.name} Invoice`,
        productId: vendorProduct.id,
        price_per_pcs: cleanAmount.toFixed(2),
        category: "DME",
        subCategory: "Invoice",
        category_id: 2,
        subCategory_id: 95,
        estimated_total_amt: cleanAmount.toFixed(2),
        order_qty: "1",
        order_at: moment(distributionDate).format("YYYY-MM-DD HH:mm"),
        comments: `DME Invoice - ${selectedVendor.name}`,
        patientCd: invoice.patientCd,
        delivery_location: "Home-HOME",
        requestor: context.userProfile?.name,
        requestor_id: context.userProfile?.employeeId,
        requestor_position: context.userProfile?.position || "Staff",
        patient_id: patientId,
        stock_status: null,
        group_id: groupId,
        unit_uom: "Pcs",
        companyId: companyId,
        createdUser: {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        },
        updatedUser: {
          name: context.userProfile?.name,
          userId: context.userProfile?.id,
          date: new Date(),
        },
      };

      distributionPayload.push(params);
    });

    console.log("Distribution Payload:", distributionPayload);
    dispatch(attemptToCreateDistribution(distributionPayload));
  };

  const filterRecordHandler = (keyword) => {
    let temp = [...originalSource];

    if (keyword) {
      temp = temp.filter(
        (data) =>
          (data.patientCd &&
            data.patientCd.toLowerCase().includes(keyword.toLowerCase())) ||
          (data.patientName &&
            data.patientName.toLowerCase().includes(keyword.toLowerCase())) ||
          (data.equipments &&
            data.equipments.toLowerCase().includes(keyword.toLowerCase())) ||
          (data.createdBy &&
            data.createdBy.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

    setDataSource(temp);
  };

  const filterByDateHandler = (dates) => {
    if (dates.from && dates.to && companyId) {
      setDateFrom(dates.from);
      setDateTo(dates.to);
      dispatch(
        attemptToFetchDmeInvoice({
          companyId,
          from: dates.from,
          to: dates.to,
        })
      );
    }
  };

  // Calculate grand total
  const grandTotal = dataSource.reduce((sum, item) => {
    const amount = parseFloat(item.invoice_amt?.replace(/[$,]/g, "") || 0);
    return sum + amount;
  }, 0);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitle}>
              DME Invoice Management
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
                <>
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

                  <Tooltip title="Create distribution for selected invoices">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LocalShippingIcon />}
                      onClick={handleOpenDistributionModal}
                    >
                      Create Distribution
                    </Button>
                  </Tooltip>
                </>
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
        patientList={patientList}
      />

      {/* Create Distribution Modal */}
      <Dialog
        open={isDistributionModalOpen}
        onClose={handleCloseDistributionModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Distribution</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <CustomDatePicker
              label="Distribution Date"
              name="distributionDate"
              value={distributionDate}
              onChange={handleDistributionDateChange}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <CustomSingleAutoComplete
              label="Select Vendor (DME)"
              placeholder="Select Vendor"
              name="vendor"
              value={selectedVendor}
              options={vendorList.map((vendor, index) => ({
                ...vendor,
                id: vendor.id || index,
                label: vendor.name,
                value: vendor.name,
                categoryType: "vendor",
              }))}
              onSelectHandler={handleVendorSelect}
              onChangeHandler={handleVendorChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDistributionModal} color="default">
            Cancel
          </Button>
          <Button
            onClick={handleCreateDistribution}
            color="primary"
            variant="contained"
          >
            Create Distribution
          </Button>
        </DialogActions>
      </Dialog>
    </GridContainer>
  );
}

export default DmeManagement;

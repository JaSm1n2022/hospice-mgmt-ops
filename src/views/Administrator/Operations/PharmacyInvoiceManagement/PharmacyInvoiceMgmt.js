import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from 'pdfjs-dist';

// Material UI
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import Tooltip from "@material-ui/core/Tooltip";

// Core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import CustomDatePicker from "components/Date/CustomDatePicker";
import HospiceTable from "components/Table/HospiceTable";
import PharmacyInvoiceHandler from "./PharmacyInvoiceHandler";

// Redux actions and selectors
import { attemptToFetchPatient } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";
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
import TOAST from "modules/toastManager";
import { supabaseClient } from "config/SupabaseClient";
import { handleExport } from "utils/XlsxHelper";

// Context
import { SupaContext } from "../../../../App";

// PDF.js worker configuration
// Using a fixed version that we know exists
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  uploadSection: {
    marginBottom: "20px",
    padding: "20px",
    border: "2px dashed #ddd",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#fafafa",
  },
  alert: {
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  alertSuccess: {
    backgroundColor: "#e8f5e9",
    color: "#388e3c",
    borderLeft: "4px solid #388e3c",
  },
  alertError: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
    borderLeft: "4px solid #d32f2f",
  },
  alertWarning: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderLeft: "4px solid #ffc107",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#fafafa",
    },
  },
  warningRow: {
    backgroundColor: "#fff3cd",
  },
  summarySection: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  summaryItem: {
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "4px",
    borderLeft: "4px solid #e91e63",
  },
  summaryLabel: {
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px",
  },
  summaryValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  modalField: {
    marginTop: "16px",
    marginBottom: "16px",
  },
}));

// Regex patterns for parsing
const RX_LINE_RE =
  /^\s*(\d{2}\/\d{2}\/\d{4})\s+Rx\s+(\d+)(?:--|\s+)(.+?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$/;

const RX_COLLISION_RE =
  /^\s*(\d{2}\/\d{2}\/\d{4})\s+Rx\s+(\d+)(?:--|\s+)(.+?\D)(\d+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$/;

const SUBTOTAL_RE =
  /^\s*([A-Z][A-Z' \-]+,\s*[A-Z][A-Z' \-]+)\s*\(\s*\)\s*:\s*Sub-Total\s*:\s*([\d.]+)\s*$/;

const PLEASE_PAY_RE = /Please\s+Pay\s*-->\s*:\s*([\d.]+)/i;

// Helper functions
function normalizeName(s) {
  return (s || '').toUpperCase().replace(/[\s,.()]+/g, '');
}

function suggestPatientCode(invoiceName, patients) {
  const target = normalizeName(invoiceName);

  // Exact match first
  const exact = patients.find((p) => normalizeName(`${p.last_name}, ${p.first_name}`) === target);
  if (exact) return { patientCd: exact.patientCd, matchType: 'exact', matchCount: 1 };

  // Fall back to last-name match
  const lastName = (invoiceName.split(',')[0] || '').trim();
  if (lastName) {
    const targetLast = normalizeName(lastName);
    const lastNameMatches = patients.filter((p) =>
      normalizeName(p.last_name) === targetLast
    );
    if (lastNameMatches.length === 1) {
      return { patientCd: lastNameMatches[0].patientCd, matchType: 'lastName', matchCount: 1 };
    } else if (lastNameMatches.length > 1) {
      return { patientCd: lastNameMatches[0].patientCd, matchType: 'lastName', matchCount: lastNameMatches.length };
    }
  }

  // Try first 3 characters of last name against patientCd
  if (lastName && lastName.length >= 3) {
    const first3Chars = normalizeName(lastName.substring(0, 3));

    // Match against first 3 characters of patientCd (client code)
    const patientCdMatches = patients.filter((p) => {
      const normalizedPatientCd = normalizeName(p.patientCd || '');
      return normalizedPatientCd.startsWith(first3Chars);
    });

    if (patientCdMatches.length === 1) {
      return { patientCd: patientCdMatches[0].patientCd, matchType: 'partial', matchCount: 1 };
    } else if (patientCdMatches.length > 1) {
      return { patientCd: patientCdMatches[0].patientCd, matchType: 'partial', matchCount: patientCdMatches.length };
    }

    // Also try matching against last name as fallback
    const lastNameMatches = patients.filter((p) =>
      normalizeName(p.last_name).startsWith(first3Chars)
    );
    if (lastNameMatches.length === 1) {
      return { patientCd: lastNameMatches[0].patientCd, matchType: 'partial', matchCount: 1 };
    } else if (lastNameMatches.length > 1) {
      return { patientCd: lastNameMatches[0].patientCd, matchType: 'partial', matchCount: lastNameMatches.length };
    }
  }

  return { patientCd: '', matchType: 'none', matchCount: 0 };
}

function formatCurrency(n) {
  return n == null
    ? ''
    : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// PDF text extraction
async function extractTextLines(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allLines = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Group items by y-coordinate
    const lineMap = new Map();
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push({ x: item.transform[4], width: item.width, text: item.str });
    }

    // Sort lines and insert spaces
    const ys = [...lineMap.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const items = lineMap.get(y).sort((a, b) => a.x - b.x);
      let line = '';
      let cursorX = null;
      for (const item of items) {
        if (cursorX !== null) {
          const gap = item.x - cursorX;
          const spaces = Math.max(1, Math.round(gap / 3));
          line += ' '.repeat(spaces);
        }
        line += item.text;
        cursorX = item.x + (item.width || item.text.length * 3);
      }
      allLines.push(line);
    }
  }
  return allLines;
}

// Invoice parsing
function parseInvoice(lines) {
  const patients = [];
  let pending = [];
  let lastItem = null;
  let grandTotal = null;
  let invoiceDate = null;

  // Extract invoice date
  const fullText = lines.join('\n');
  const dateMatch = fullText.match(/Invoice Date[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
  if (dateMatch) {
    invoiceDate = dateMatch[1];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    const sub = line.match(SUBTOTAL_RE);
    if (sub) {
      const name = sub[1].replace(/\s+/g, ' ').trim();
      const subtotal = parseFloat(sub[2]);
      const computedTotal = pending.reduce((s, li) => s + li.total, 0);
      patients.push({
        name,
        subtotal,
        rxCount: pending.length,
        computedTotal: Math.round(computedTotal * 100) / 100,
        lineItems: pending,
      });
      pending = [];
      lastItem = null;
      continue;
    }

    const pay = line.match(PLEASE_PAY_RE);
    if (pay) {
      grandTotal = parseFloat(pay[1]);
      continue;
    }

    const rx = line.match(RX_LINE_RE) || line.match(RX_COLLISION_RE);
    if (rx) {
      const item = {
        date: rx[1],
        rxNumber: rx[2],
        description: rx[3].trim(),
        qty: parseFloat(rx[4]),
        price: parseFloat(rx[5]),
        tax: parseFloat(rx[6]),
        total: parseFloat(rx[7]),
      };
      pending.push(item);
      lastItem = item;
      continue;
    }

    if (lastItem && line.trim() === 'ONC') {
      lastItem.description = lastItem.description.endsWith(' C')
        ? lastItem.description.slice(0, -2) + ' CONC'
        : lastItem.description + ' CONC';
    }
  }

  return { patients, grandTotal, invoiceDate };
}

function PharmacyInvoiceMgmt() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const context = useContext(SupaContext);

  const companyId = context?.userProfile?.companyId;

  // Redux state
  const patientListState = useSelector(patientListStateSelector);
  const vendorListState = useSelector(vendorListStateSelector);
  const distributionCreateState = useSelector(distributionCreateStateSelector);
  const productListState = useSelector(productListStateSelector);

  // Local state
  const [patientList, setPatientList] = useState([]);
  const [filteredPatientList, setFilteredPatientList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [grandTotal, setGrandTotal] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Invoices table state
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [columns, setColumns] = useState(PharmacyInvoiceHandler.columns(true));
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);

  // Distribution modal state
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);
  const [distributionDate, setDistributionDate] = useState(new Date());
  const [distributionVendor, setDistributionVendor] = useState(null);

  // Fetch patients, vendors, and products
  useEffect(() => {
    if (companyId) {
      dispatch(attemptToFetchPatient({ companyId }));
      dispatch(attemptToFetchVendor({ companyId }));
      dispatch(attemptToFetchProduct({ companyId }));
    }
  }, [dispatch, companyId]);

  // Update patient list and filter
  useEffect(() => {
    if (patientListState?.data && Array.isArray(patientListState.data)) {
      setPatientList(patientListState.data);

      // Filter patients similar to DME management
      const now = new Date();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const filtered = patientListState.data.filter((patient) => {
        // Include patient if they don't have an EOC date (still active)
        if (!patient.eoc_dt) {
          return true;
        }

        // Parse EOC date
        const eocDate = new Date(patient.eoc_dt);

        // Exclude patients who have been EOC for more than 60 days
        return eocDate >= sixtyDaysAgo;
      });

      setFilteredPatientList(filtered);
    }
  }, [patientListState]);

  // Update vendor list
  useEffect(() => {
    if (vendorListState?.data && Array.isArray(vendorListState.data)) {
      // Filter only Pharmacy vendors
      const pharmacyVendors = vendorListState.data.filter(
        (vendor) =>
          vendor.categoryType === "Pharmacy" || vendor.category_type === "Pharmacy"
      );
      setVendorList(pharmacyVendors);
    }
  }, [vendorListState]);

  // Update product list
  useEffect(() => {
    if (productListState?.data && Array.isArray(productListState.data)) {
      setProductList(productListState.data);
    }
  }, [productListState]);

  // Handle distribution creation success/failure
  useEffect(() => {
    console.log("Distribution Create State:", distributionCreateState);

    if (distributionCreateState?.status === "SUCCEED") {
      console.log("Distribution created successfully!");
      TOAST.ok("Distribution created successfully!");

      // Close modal and reset form
      setIsDistributionModalOpen(false);
      setDistributionVendor(null);
      setDistributionDate(new Date());

      // Deselect all invoices
      setIsAddGroupButtons(false);

      // Refresh invoice data and return to table view
      fetchInvoices();

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
  }, [distributionCreateState, dispatch]);

  // Fetch invoices from database
  const fetchInvoices = async () => {
    if (!companyId) return;

    setInvoicesLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("pharmacy_invoices")
        .select("*")
        .eq("companyId", companyId)
        .order("invoice_dt", { ascending: false });

      if (error) throw error;

      const mappedData = PharmacyInvoiceHandler.mapData(data || []);
      setInvoices(mappedData);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      TOAST.error("Failed to load invoices");
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Load invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, [companyId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setRows([]);
    setGrandTotal(null);
    setInvoiceDate('');
    setFileName('');
    setError(null);
    setSelectedVendor(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRows([]);
    setGrandTotal(null);
    setInvoiceDate('');
    setFileName('');
    setError(null);
    setSelectedVendor(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      const lines = await extractTextLines(file);
      const { patients: extracted, grandTotal: gt, invoiceDate: invDate } = parseInvoice(lines);

      if (extracted.length === 0) {
        throw new Error(
          'No patient blocks found. Is this the standard 986 LTC Pharmacy invoice format?',
        );
      }

      setRows(
        extracted.map((p) => {
          const matchResult = suggestPatientCode(p.name, filteredPatientList);
          return {
            patientCd: matchResult.patientCd,
            patientName: p.name,
            rxCount: p.rxCount,
            total: p.subtotal,
            computedTotal: p.computedTotal,
            reconciles: Math.abs(p.subtotal - p.computedTotal) < 0.01,
            lineItems: p.lineItems,
            matchType: matchResult.matchType,
            matchCount: matchResult.matchCount,
          };
        }),
      );
      setGrandTotal(gt);
      setInvoiceDate(invDate || moment().format("MM/DD/YYYY"));
    } catch (err) {
      setError(err.message);
      setRows([]);
      setGrandTotal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorChange = (e) => {
    if (!e.target.value) {
      setSelectedVendor(null);
    }
  };

  const handlePatientCodeChange = (rowIndex, selectedPatient) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].patientCd = selectedPatient ? selectedPatient.patientCd : '';
    setRows(updatedRows);
  };

  const handlePatientCodeClear = (rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].patientCd = '';
    setRows(updatedRows);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    const updatedInvoices = [...invoices];

    if (isAll) {
      // Select/deselect all
      updatedInvoices.forEach((item) => {
        item.isChecked = isAll;
      });
    } else if (!isAll && data && data.length > 0) {
      // Select/deselect single item
      updatedInvoices.forEach((item) => {
        if (item.id && item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      // Deselect all
      updatedInvoices.forEach((item) => {
        item.isChecked = false;
      });
    }

    // Update state to show/hide action buttons
    setIsAddGroupButtons(updatedInvoices.find((f) => f.isChecked));
    setInvoices(updatedInvoices);
  };

  const exportToExcelHandler = () => {
    const selectedData = invoices.filter((r) => r.isChecked);

    if (selectedData.length === 0) {
      TOAST.error("Please select at least one invoice to export");
      return;
    }

    // Prepare data for Excel export
    const excelData = selectedData.map(item => ({
      "Invoice Date": item.invoice_dt ? new Date(item.invoice_dt).toLocaleDateString("en-US") : "",
      "Client Code": item.patientCd || "",
      "Vendor": item.vendor || "",
      "Invoice Amount": item.invoice_amt || 0,
      "Created By": item.createdBy || "",
      "Created Date": item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US") : "",
    }));

    const fileName = `pharmacy_invoices_${moment().format("YYYY-MM-DD_HHmmss")}`;
    handleExport(excelData, fileName);
  };

  const createDistributionHandler = () => {
    const selectedData = invoices.filter((r) => r.isChecked);

    if (selectedData.length === 0) {
      TOAST.error("Please select at least one invoice to create distribution");
      return;
    }

    // Open distribution modal
    setIsDistributionModalOpen(true);
  };

  const handleOpenDistributionModal = () => {
    setIsDistributionModalOpen(true);
  };

  const handleCloseDistributionModal = () => {
    setIsDistributionModalOpen(false);
    setDistributionVendor(null);
    setDistributionDate(new Date());
  };

  const handleDistributionVendorSelect = (vendor) => {
    setDistributionVendor(vendor);
  };

  const handleDistributionVendorChange = (e) => {
    if (!e.target.value) {
      setDistributionVendor(null);
    }
  };

  const handleDistributionDateChange = (date) => {
    setDistributionDate(date);
  };

  const handleCreateDistribution = () => {
    if (!distributionVendor) {
      TOAST.error("Please select a vendor");
      return;
    }

    const selectedInvoices = invoices.filter((r) => r.isChecked);
    if (selectedInvoices.length === 0) {
      TOAST.error("Please select at least one invoice");
      return;
    }

    // Find product by vendor name
    const vendorProduct = productList.find(
      (product) =>
        product.vendor &&
        product.vendor.toLowerCase() === distributionVendor.name.toLowerCase()
    );

    if (!vendorProduct) {
      TOAST.error(`No product found for vendor: ${distributionVendor.name}`);
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
        description: `${distributionVendor.name} Invoice`,
        short_description: `${distributionVendor.name} Invoice`,
        productId: vendorProduct.id,
        price_per_pcs: cleanAmount.toFixed(2),
        category: "Pharmacy",
        subCategory: "Invoice",
        category_id: 2,
        subCategory_id: 95,
        estimated_total_amt: cleanAmount.toFixed(2),
        order_qty: "1",
        order_at: moment(distributionDate).format("YYYY-MM-DD HH:mm"),
        comments: `Pharmacy Invoice - ${distributionVendor.name}`,
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

  const handleSubmit = async () => {
    if (!selectedVendor) {
      TOAST.error("Please select a vendor");
      return;
    }

    const missing = rows.filter((r) => !r.patientCd);
    if (missing.length > 0) {
      TOAST.error(
        `Client Code is required for: ${missing.map((m) => m.patientName).join(', ')}`
      );
      return;
    }

    setSubmitting(true);

    try {
      // Convert invoice date to YYYY-MM-DD format
      const formattedDate = moment(invoiceDate, "MM/DD/YYYY").toISOString();

      // Group items by patient and create records
      const records = rows.map(row => {
        // Find patient ID from patientCd - use filteredPatientList for consistency
        const patient = filteredPatientList.find((p) => p.patientCd === row.patientCd);
        const patientId = patient ? patient.id : null;

        return {
          companyId: companyId,
          invoice_dt: formattedDate,
          patientCd: row.patientCd,
          patientId: patientId,
          invoice_amt: row.total,
          vendor: selectedVendor.name,
          vendor_id: selectedVendor.id,
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
      });

      // Insert records into Supabase
      const { error } = await supabaseClient
        .from("pharmacy_invoices")
        .insert(records);

      if (error) {
        throw error;
      }

      TOAST.ok("Pharmacy invoices created successfully!");

      // Refresh the invoices table
      await fetchInvoices();

      // Close modal and reset state
      handleCloseModal();
    } catch (err) {
      console.error("Error creating invoices:", err);
      TOAST.error(`Failed to create invoices: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const totalsSum = rows.reduce((s, r) => s + (Number(r.total) || 0), 0);
  const grandTotalReconciles =
    grandTotal != null && Math.abs(totalsSum - grandTotal) < 0.01;

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose">
            <Grid container justifyContent="space-between">
              <h4 className={classes.cardTitleWhite}>Pharmacy Management</h4>
            </Grid>
          </CardHeader>
          <CardBody>
            <Grid
              container
              justifyContent="space-between"
              style={{ paddingBottom: 4 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  gap: 10,
                }}
              >
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  style={{
                    border: "solid 1px #e91e63",
                    color: "white",
                    background: "#e91e63",
                    fontFamily: "Roboto",
                    fontSize: "12px",
                    fontWeight: 500,
                    fontStretch: "normal",
                    fontStyle: "normal",
                    lineHeight: 1.71,
                    letterSpacing: "0.4px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  component="span"
                  startIcon={<AddIcon />}
                >
                  ADD Invoice
                </Button>

                {isAddGroupButtons && (
                  <>
                    <Tooltip title="Export selected invoices to Excel">
                      <Button
                        onClick={exportToExcelHandler}
                        variant="outlined"
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          fontWeight: 500,
                          fontStretch: "normal",
                          fontStyle: "normal",
                          lineHeight: 1.71,
                          letterSpacing: "0.4px",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        component="span"
                        startIcon={<GetAppIcon />}
                      >
                        Export to Excel
                      </Button>
                    </Tooltip>

                    <Tooltip title="Create distribution for selected invoices">
                      <Button
                        onClick={createDistributionHandler}
                        variant="outlined"
                        style={{
                          fontFamily: "Roboto",
                          fontSize: "12px",
                          fontWeight: 500,
                          fontStretch: "normal",
                          fontStyle: "normal",
                          lineHeight: 1.71,
                          letterSpacing: "0.4px",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "#e91e63",
                          borderColor: "#e91e63",
                        }}
                        component="span"
                        startIcon={<LocalShippingIcon />}
                      >
                        Create Distribution
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
            </Grid>

            {invoicesLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress />
                <div>Loading invoices...</div>
              </div>
            ) : (
              <HospiceTable
                columns={columns}
                main={true}
                dataSource={invoices}
                height={400}
                onCheckboxSelectionHandler={onCheckboxSelectionHandler}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>

      {/* Upload Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Upload Pharmacy Invoice</DialogTitle>
        <DialogContent>
          {/* Upload Section */}
          <div className={classes.uploadSection}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              style={{ display: "none" }}
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={loading}
              >
                Choose PDF
              </Button>
            </label>
            <span style={{ marginLeft: "10px", color: "#666" }}>
              {fileName || 'No file selected'}
            </span>
            {loading && (
              <div style={{ marginTop: "10px", color: "#1976d2" }}>
                <CircularProgress size={20} style={{ marginRight: "10px" }} />
                Extracting invoice...
              </div>
            )}
            <p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
              Upload a 986 Long Term Care Pharmacy PDF invoice. Patient totals will be extracted and matched to your patient list.
            </p>
          </div>

          {/* Errors */}
          {error && (
            <div className={`${classes.alert} ${classes.alertError}`}>
              {error}
            </div>
          )}

          {/* Reconciliation warning */}
          {rows.length > 0 && !grandTotalReconciles && grandTotal != null && (
            <div className={`${classes.alert} ${classes.alertWarning}`}>
              <strong>Heads up:</strong> Sum of patient totals ({formatCurrency(totalsSum)})
              doesn't match the invoice grand total ({formatCurrency(grandTotal)}). Verify
              the extraction before submitting.
            </div>
          )}

          {/* Results */}
          {rows.length > 0 && (
            <>
              {/* Summary */}
              <div className={classes.summarySection}>
                <h3>Invoice Summary</h3>
                <div className={classes.summaryGrid}>
                  <div className={classes.summaryItem}>
                    <span className={classes.summaryLabel}>Invoice Date</span>
                    <span className={classes.summaryValue}>{invoiceDate || 'N/A'}</span>
                  </div>
                  <div className={classes.summaryItem}>
                    <span className={classes.summaryLabel}>Total Clients</span>
                    <span className={classes.summaryValue}>{rows.length}</span>
                  </div>
                  <div className={classes.summaryItem}>
                    <span className={classes.summaryLabel}>Total Prescriptions</span>
                    <span className={classes.summaryValue}>
                      {rows.reduce((s, r) => s + r.rxCount, 0)}
                    </span>
                  </div>
                  <div className={classes.summaryItem}>
                    <span className={classes.summaryLabel}>Grand Total</span>
                    <span className={classes.summaryValue}>
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th className={classes.tableHeader}>Client Code</th>
                    <th className={classes.tableHeader}>Client Name</th>
                    <th className={classes.tableHeader} style={{ textAlign: "center" }}>Rx Count</th>
                    <th className={classes.tableHeader} style={{ textAlign: "right" }}>Total</th>
                    <th className={classes.tableHeader} style={{ textAlign: "center", width: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    // Format patient list for autocomplete
                    const patientOptions = filteredPatientList.map((p) => ({
                      name: p.patientCd,
                      value: p.patientCd,
                      label: p.patientCd,
                      patientCd: p.patientCd,
                      id: p.id,
                    }));

                    // Find currently selected patient
                    const selectedPatient = patientOptions.find((p) => p.patientCd === r.patientCd);

                    return (
                      <tr
                        key={i}
                        className={r.reconciles ? classes.tableRow : `${classes.tableRow} ${classes.warningRow}`}
                      >
                        <td className={classes.tableCell} style={{ padding: "8px" }}>
                          <CustomSingleAutoComplete
                            placeholder="Select Client"
                            options={patientOptions}
                            value={selectedPatient || null}
                            onSelectHandler={(selectedItem) => handlePatientCodeChange(i, selectedItem)}
                            onChangeHandler={(e) => {
                              if (!e.target.value) {
                                handlePatientCodeClear(i);
                              }
                            }}
                            name={`patientCd_${i}`}
                          />
                        </td>
                        <td className={classes.tableCell}>
                          {r.patientName}
                          {!r.reconciles && (
                            <span
                              style={{ marginLeft: "8px", color: "#856404" }}
                              title={`Stated subtotal ${formatCurrency(r.total)} differs from sum of line items ${formatCurrency(r.computedTotal)}`}
                            >
                              ⚠
                            </span>
                          )}
                          {r.matchCount > 1 && (
                            <div style={{ fontSize: "11px", color: "#d9534f", marginTop: "4px", fontStyle: "italic" }}>
                              ⚠ {r.matchCount} matches found - please verify selection
                            </div>
                          )}
                          {r.matchType === 'none' && (
                            <div style={{ fontSize: "11px", color: "#d9534f", marginTop: "4px", fontStyle: "italic" }}>
                              ⚠ No match found - please select client manually
                            </div>
                          )}
                        </td>
                        <td className={classes.tableCell} style={{ textAlign: "center" }}>
                          {r.rxCount}
                        </td>
                        <td className={classes.tableCell} style={{ textAlign: "right" }}>
                          {formatCurrency(r.total)}
                        </td>
                        <td className={classes.tableCell} style={{ textAlign: "center", padding: "4px" }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRow(i)}
                            style={{ color: "#f44336" }}
                            title="Delete this row"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <td colSpan={2} className={classes.tableCell} style={{ fontWeight: "600" }}>
                      Total
                    </td>
                    <td className={classes.tableCell} style={{ textAlign: "center", fontWeight: "600" }}>
                      {rows.reduce((s, r) => s + r.rxCount, 0)}
                    </td>
                    <td className={classes.tableCell} style={{ textAlign: "right", fontWeight: "600" }}>
                      {formatCurrency(totalsSum)}
                    </td>
                    <td className={classes.tableCell}></td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px", justifyContent: "space-between" }}>
          <Button onClick={handleCloseModal} color="default">
            Cancel
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, justifyContent: "flex-end" }}>
            {rows.length > 0 && (
              <>
                <div style={{ minWidth: "250px" }}>
                  <CustomSingleAutoComplete
                    label="Select Vendor (Pharmacy) *"
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
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={submitting || !selectedVendor}
                >
                  {submitting ? 'Submitting...' : 'Save to Database'}
                </Button>
              </>
            )}
          </div>
        </DialogActions>
      </Dialog>

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
              label="Select Vendor (Pharmacy)"
              placeholder="Select Vendor"
              name="vendor"
              value={distributionVendor}
              options={vendorList.map((vendor, index) => ({
                ...vendor,
                id: vendor.id || index,
                label: vendor.name,
                value: vendor.name,
                categoryType: "vendor",
              }))}
              onSelectHandler={handleDistributionVendorSelect}
              onChangeHandler={handleDistributionVendorChange}
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

export default PharmacyInvoiceMgmt;

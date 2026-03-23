import React, { useState, useEffect, useContext } from "react";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  CloudUpload,
  CheckCircle,
  Cancel,
  AttachMoney,
  Receipt,
  Category as CategoryIcon,
} from "@material-ui/icons";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import HospiceTable from "components/Table/HospiceTable";
import { SupaContext } from "App";
import { supabaseClient } from "config/SupabaseClient";
import { extractInvoiceData, categorizeItem } from "utils/claudeApi";
import TOAST from "modules/toastManager";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  uploadBox: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    "&:hover": {
      borderColor: "#4caf50",
      backgroundColor: "#f5f5f5",
    },
  },
  statCard: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
  categoryButton: {
    margin: "5px",
  },
  selectedCategory: {
    backgroundColor: "#4caf50",
    color: "white",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
}));

const FinancialRecords = () => {
  const classes = useStyles();
  const context = useContext(SupaContext);

  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    pending: 0,
    confirmed: 0,
  });

  // Filter State
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchRecords();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [records]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("[Fetch Categories Error]", error);
      TOAST.error("Failed to load categories");
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("financial_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("[Fetch Records Error]", error);
      TOAST.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const recordsArray = records || [];
    const total = recordsArray.length;
    const totalAmount = recordsArray.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
    const pending = recordsArray.filter((r) => r.status === "pending").length;
    const confirmed = recordsArray.filter((r) => r.status === "confirmed").length;

    setStats({ total, totalAmount, pending, confirmed });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      TOAST.error("Please upload a PDF or image file (JPG, PNG)");
      return;
    }

    try {
      setUploading(true);
      setProcessing(true);

      // Step 1: Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from("invoices")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from("invoices")
        .getPublicUrl(fileName);

      const invoiceUrl = urlData.publicUrl;

      // Step 2: Extract data using Claude AI
      TOAST.info("Extracting invoice data...");
      const extractedData = await extractInvoiceData(file);

      // Step 3: Categorize using Claude AI
      TOAST.info("Categorizing item...");
      const categorization = await categorizeItem(
        extractedData.item,
        extractedData.vendor,
        categories
      );

      // Step 4: Prepare record for review
      const record = {
        ...extractedData,
        ai_category: categorization.category,
        ai_reason: categorization.reason,
        invoice_url: invoiceUrl,
        status: "pending",
      };

      setCurrentRecord(record);
      setSelectedCategory(categorization.category);
      setReviewModalOpen(true);
      TOAST.success("Invoice processed successfully!");
    } catch (error) {
      console.error("[Upload Error]", error);
      TOAST.error("Failed to process invoice: " + error.message);
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleConfirmRecord = async () => {
    try {
      const recordToSave = {
        ...currentRecord,
        confirmed_category: selectedCategory,
        status: selectedCategory === currentRecord.ai_category ? "confirmed" : "overridden",
        companyId: context.userProfile?.companyId,
        createdUser: context.userProfile?.id,
        updatedUser: context.userProfile?.id,
      };

      const { data, error } = await supabaseClient
        .from("financial_records")
        .insert([recordToSave])
        .select();

      if (error) throw error;

      TOAST.success("Record saved successfully!");
      setReviewModalOpen(false);
      setCurrentRecord(null);
      setSelectedCategory(null);
      fetchRecords();
    } catch (error) {
      console.error("[Save Record Error]", error);
      TOAST.error("Failed to save record");
    }
  };

  const columns = [
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => value || "-",
    },
    {
      Header: "Order #",
      accessor: "order_no",
      Cell: ({ value }) => value || "-",
    },
    {
      Header: "Item",
      accessor: "item",
    },
    {
      Header: "Vendor",
      accessor: "vendor",
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ value }) => `$${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      Header: "Category",
      accessor: "confirmed_category",
      Cell: ({ value, row }) => (
        <Chip
          label={value || row.original.ai_category || "Uncategorized"}
          color={row.original.status === "confirmed" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => {
        const colors = {
          pending: "default",
          confirmed: "primary",
          overridden: "secondary",
        };
        return <Chip label={value} color={colors[value] || "default"} size="small" />;
      },
    },
  ];

  const filteredRecords = (records || []).filter((record) => {
    if (statusFilter !== "all" && record.status !== statusFilter) return false;
    if (categoryFilter && record.confirmed_category !== categoryFilter) return false;
    return true;
  });

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitleWhite}>Financial Records - AI Invoice Tracker</h4>
          </CardHeader>
          <CardBody>
            {/* Stats Bar */}
            <Grid container spacing={2} style={{ marginBottom: "20px" }}>
              <Grid item xs={12} md={3}>
                <Card className={classes.statCard}>
                  <Receipt style={{ fontSize: 40, color: "#2196f3" }} />
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2">Total Records</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className={classes.statCard}>
                  <AttachMoney style={{ fontSize: 40, color: "#4caf50" }} />
                  <Typography variant="h4">${stats.totalAmount.toFixed(2)}</Typography>
                  <Typography variant="body2">Total Amount</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className={classes.statCard}>
                  <CategoryIcon style={{ fontSize: 40, color: "#ff9800" }} />
                  <Typography variant="h4">{stats.pending}</Typography>
                  <Typography variant="body2">Pending Review</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className={classes.statCard}>
                  <CheckCircle style={{ fontSize: 40, color: "#4caf50" }} />
                  <Typography variant="h4">{stats.confirmed}</Typography>
                  <Typography variant="body2">Confirmed</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Upload Section */}
            <Box mb={3}>
              <input
                accept="application/pdf,image/*"
                style={{ display: "none" }}
                id="invoice-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="invoice-upload">
                <div className={classes.uploadBox}>
                  {uploading ? (
                    <>
                      <CircularProgress />
                      <Typography variant="body1" style={{ marginTop: 10 }}>
                        {processing ? "Processing invoice with AI..." : "Uploading..."}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUpload style={{ fontSize: 60, color: "#ccc" }} />
                      <Typography variant="h6">Upload Invoice</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Drag & drop or click to upload PDF or image
                      </Typography>
                    </>
                  )}
                </div>
              </label>
            </Box>

            {/* Filters */}
            <Box mb={2}>
              <Button
                color={statusFilter === "all" ? "primary" : "default"}
                onClick={() => setStatusFilter("all")}
                style={{ marginRight: 10 }}
              >
                All
              </Button>
              <Button
                color={statusFilter === "pending" ? "primary" : "default"}
                onClick={() => setStatusFilter("pending")}
                style={{ marginRight: 10 }}
              >
                Pending
              </Button>
              <Button
                color={statusFilter === "confirmed" ? "primary" : "default"}
                onClick={() => setStatusFilter("confirmed")}
                style={{ marginRight: 10 }}
              >
                Confirmed
              </Button>
              <Button
                color={statusFilter === "overridden" ? "primary" : "default"}
                onClick={() => setStatusFilter("overridden")}
              >
                Overridden
              </Button>
            </Box>

            {/* Table */}
            {loading ? (
              <div align="center" style={{ padding: "40px" }}>
                <CircularProgress />
              </div>
            ) : (
              <HospiceTable columns={columns} dataSource={filteredRecords} />
            )}
          </CardBody>
        </Card>
      </GridItem>

      {/* Review Modal */}
      <Dialog
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review Invoice Data</DialogTitle>
        <DialogContent>
          {currentRecord && (
            <Grid container spacing={2} style={{ marginTop: 10 }}>
              <Grid item xs={6}>
                <TextField
                  label="Date"
                  value={currentRecord.date}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, date: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Order Number"
                  value={currentRecord.order_no}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, order_no: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="PO Number"
                  value={currentRecord.po_no}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, po_no: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Vendor"
                  value={currentRecord.vendor}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, vendor: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Item"
                  value={currentRecord.item}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, item: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Subtotal"
                  type="number"
                  value={currentRecord.subtotal}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, subtotal: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Tax"
                  type="number"
                  value={currentRecord.tax}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, tax: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Total"
                  type="number"
                  value={currentRecord.total}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, total: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Payment Method"
                  value={currentRecord.payment_method}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, payment_method: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Paid By"
                  value={currentRecord.paid_by}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, paid_by: e.target.value })
                  }
                  fullWidth
                />
              </Grid>

              {/* AI Category Suggestion */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginTop: 20 }}>
                  AI Suggested Category: <strong>{currentRecord.ai_category}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentRecord.ai_reason}
                </Typography>
              </Grid>

              {/* Category Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                  Select Category:
                </Typography>
                <Box mt={1}>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      className={`${classes.categoryButton} ${
                        selectedCategory === cat.name ? classes.selectedCategory : ""
                      }`}
                      onClick={() => setSelectedCategory(cat.name)}
                      color={selectedCategory === cat.name ? "primary" : "default"}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewModalOpen(false)} color="default">
            Cancel
          </Button>
          <Button onClick={handleConfirmRecord} color="primary" variant="contained">
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>
    </GridContainer>
  );
};

export default FinancialRecords;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@material-ui/core";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Close, Print } from "@material-ui/icons";
import { pdf } from "@react-pdf/renderer";
import DistributionCalendarPrintDocument from "./DistributionCalendarPrintDocument";

const localizer = momentLocalizer(moment);

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
  },
  title: {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: 500,
    margin: 0,
  },
  closeButton: {
    color: "#fff",
    padding: 4,
  },
  calendarContainer: {
    height: "70vh",
    padding: "20px",
  },
  legend: {
    display: "flex",
    gap: "20px",
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
  },
  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
  },
}));

const DistributionCalendarModal = ({ isOpen, onClose, distributions }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(
    moment().format("YYYY-MM-DD")
  );

  const handlePrintClick = () => {
    setDateRangeDialogOpen(true);
  };

  const handleDateRangeCancel = () => {
    setDateRangeDialogOpen(false);
  };

  const handlePrintSummary = async () => {
    try {
      setDateRangeDialogOpen(false);

      const doc = (
        <DistributionCalendarPrintDocument
          distributions={distributions}
          startDate={startDate}
          endDate={endDate}
        />
      );
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Generate calendar events grouped by patient and order date
  const generateCalendarEvents = () => {
    const events = [];

    if (!distributions || distributions.length === 0) {
      return events;
    }

    // Filter by Medical/Incontinence category only
    const filteredDistributions = distributions.filter((dist) => {
      const category = dist.category || "";
      const subCategory = dist.subCategory || "";

      // Check if it's Medical/Incontinence or just Incontinence
      return (
        category.toLowerCase().includes("medical") ||
        category.toLowerCase().includes("incontinence") ||
        subCategory.toLowerCase().includes("incontinence")
      );
    });

    // Group distributions by patient and order date
    const groupedByPatientAndDate = {};

    filteredDistributions.forEach((dist) => {
      const orderDate = moment(dist.order_at).format("YYYY-MM-DD");
      const patientCd = dist.patientCd || "N/A";
      const key = `${patientCd}-${orderDate}`;

      if (!groupedByPatientAndDate[key]) {
        groupedByPatientAndDate[key] = {
          patientCd: patientCd,
          orderDate: orderDate,
          items: [],
          totalAmount: 0,
          orderStatus: dist.order_status,
        };
      }

      groupedByPatientAndDate[key].items.push({
        description: dist.shortDescription || dist.description,
        qty: dist.order_qty,
        amount: dist.estimated_total_amt,
        vendor: dist.vendor,
        comments: dist.comments,
      });

      groupedByPatientAndDate[key].totalAmount += parseFloat(dist.estimated_total_amt || 0);
    });

    // Create calendar events from grouped data
    Object.values(groupedByPatientAndDate).forEach((group) => {
      const orderMoment = moment(group.orderDate);

      // Determine color based on order status
      let color = "default";
      const status = group.orderStatus?.toLowerCase() || "";

      if (status.includes("delivered")) {
        color = "delivered";
      } else if (status.includes("in transit") || status.includes("transit")) {
        color = "transit";
      } else if (status.includes("order") || status.includes("pending")) {
        color = "ordered";
      } else if (status.includes("cancelled")) {
        color = "cancelled";
      }

      events.push({
        title: `${group.patientCd} - ${group.items.length} item(s) - $${group.totalAmount.toFixed(2)}`,
        start: orderMoment.toDate(),
        end: orderMoment.toDate(),
        allDay: true,
        resource: {
          patientCd: group.patientCd,
          orderDate: group.orderDate,
          items: group.items,
          itemCount: group.items.length,
          totalAmount: group.totalAmount,
          orderStatus: group.orderStatus,
        },
        color: color,
      });
    });

    return events;
  };

  const events = generateCalendarEvents();

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#3174ad";

    switch (event.color) {
      case "delivered":
        backgroundColor = "#4caf50";
        borderColor = "#388e3c";
        break;
      case "transit":
        backgroundColor = "#ff9800";
        borderColor = "#f57c00";
        break;
      case "ordered":
        backgroundColor = "#2196f3";
        borderColor = "#1976d2";
        break;
      case "cancelled":
        backgroundColor = "#f44336";
        borderColor = "#d32f2f";
        break;
      default:
        backgroundColor = "#9e9e9e";
        borderColor = "#757575";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: "white",
        borderRadius: "4px",
        border: "none",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event) => {
    const resource = event.resource;

    let itemsList = resource.items.map((item, index) =>
      `${index + 1}. ${item.description} - Qty: ${item.qty} - $${item.amount}`
    ).join('\n');

    const message = `Patient: ${resource.patientCd}
Order Date: ${moment(resource.orderDate).format("MMM DD, YYYY")}
Order Status: ${resource.orderStatus || "N/A"}
Total Items: ${resource.itemCount}
Total Amount: $${resource.totalAmount.toFixed(2)}

Items:
${itemsList}`;

    alert(message);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const statusCounts = {};
    const patientCounts = {};
    let totalAmount = 0;

    // Filter by Medical/Incontinence category only
    const filteredDistributions = distributions.filter((dist) => {
      const category = dist.category || "";
      const subCategory = dist.subCategory || "";

      // Check if it's Medical/Incontinence or just Incontinence
      return (
        category.toLowerCase().includes("medical") ||
        category.toLowerCase().includes("incontinence") ||
        subCategory.toLowerCase().includes("incontinence")
      );
    });

    filteredDistributions.forEach((dist) => {
      const status = dist.order_status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const patient = dist.patientCd || "N/A";
      patientCounts[patient] = (patientCounts[patient] || 0) + 1;

      totalAmount += parseFloat(dist.estimated_total_amt || 0);
    });

    return {
      statusCounts,
      patientCounts,
      totalAmount,
      totalOrders: distributions.length,
      uniquePatients: Object.keys(patientCounts).length,
    };
  };

  const summary = calculateSummary();

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div style={modalStyle} className={classes.paper}>
          <Card>
            <CardHeader color="rose">
              <div className={classes.cardHeader}>
                <h4 className={classes.title}>
                  Distribution Calendar - Medical/Incontinence Only
                </h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      backgroundColor: "#fff",
                      color: "#e91e63",
                    }}
                    startIcon={<Print />}
                    onClick={handlePrintClick}
                  >
                    Print Summary
                  </Button>
                  <IconButton className={classes.closeButton} onClick={onClose}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            </CardHeader>

            <div className={classes.legend}>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#4caf50" }}
                />
                <span>Delivered</span>
              </div>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#ff9800" }}
                />
                <span>In Transit</span>
              </div>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#2196f3" }}
                />
                <span>Ordered</span>
              </div>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#f44336" }}
                />
                <span>Cancelled</span>
              </div>
              <div className={classes.legendItem}>
                <strong>Total Orders:</strong> {summary.totalOrders}
              </div>
              <div className={classes.legendItem}>
                <strong>Unique Patients:</strong> {summary.uniquePatients}
              </div>
              <div className={classes.legendItem}>
                <strong>Total Amount:</strong> ${summary.totalAmount.toFixed(2)}
              </div>
              <div className={classes.legendItem}>
                <strong>Events:</strong> {events.length}
              </div>
            </div>

            <CardBody>
              <div className={classes.calendarContainer}>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  defaultView="month"
                  views={["month", "week", "day", "agenda"]}
                  defaultDate={new Date()}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  popup
                  tooltipAccessor={(event) =>
                    `${event.resource.patientCd} - ${event.resource.itemCount} items`
                  }
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </Modal>

      {/* Date Range Dialog - Outside Modal */}
      <Dialog
        open={dateRangeDialogOpen}
        onClose={handleDateRangeCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Date Range for Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateRangeCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePrintSummary}
            color="primary"
            variant="contained"
            startIcon={<Print />}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DistributionCalendarModal;

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
import RecertificationCalendarPrintDocument from "./RecertificationCalendarPrintDocument";

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

const RecertificationCalendarModal = ({ isOpen, onClose, patients }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(
    moment().add(1, "year").format("YYYY-MM-DD")
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
        <RecertificationCalendarPrintDocument
          patients={patients}
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

  // Generate calendar events for ALL active patients
  const generateCalendarEvents = () => {
    const events = [];
    const today = moment();
    const oneYearFromNow = moment().add(1, "year");

    // Include ALL patients
    patients.forEach((patient) => {
      const recertifications = patient.recertifications || [];

      recertifications.forEach((recert) => {
        const dueDate = moment(recert.dueDate);

        // Only include recertifications within the next year
        if (dueDate.isBetween(today, oneYearFromNow, null, "[]")) {
          // The recert.benefitPeriod is the CURRENT period
          // The recertification due is to certify for the NEXT period (benefitPeriod + 1)
          const currentBP = recert.benefitPeriod;
          const certifyingForBP = currentBP + 1;

          // Cert #2 is when currently in BP 1, certifying for BP 2
          const isCert2 = currentBP === 1;
          // F2F is required when certifying for BP 3 or higher (currently in BP 2+)
          const isF2F = certifyingForBP >= 3;

          // Determine event color based on status
          let color = "default";
          if (recert.status === "urgent") {
            color = "urgent";
          } else if (recert.status === "upcoming") {
            color = "upcoming";
          } else if (recert.status === "scheduled") {
            color = "scheduled";
          }

          // Add labels based on benefit period
          let benefitLabel = "";
          if (isCert2) {
            benefitLabel = " [Cert #2 is due]";
          } else if (isF2F) {
            benefitLabel = ` [F2F Required - BP ${certifyingForBP}]`;
          }

          events.push({
            title: `${patient.patientCd} - Current BP ${currentBP}${benefitLabel}`,
            start: dueDate.toDate(),
            end: dueDate.toDate(),
            allDay: true,
            resource: {
              patientCd: patient.patientCd,
              patientName: patient.patientName,
              currentBP: currentBP,
              certifyingForBP: certifyingForBP,
              benefitPeriod: recert.benefitPeriod,
              daysInPeriod: recert.daysInPeriod,
              status: recert.status,
              isF2F: isF2F,
              isCert2: isCert2,
            },
            color: color,
          });
        }
      });
    });

    return events;
  };

  const events = generateCalendarEvents();

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#3174ad";

    switch (event.color) {
      case "urgent":
        backgroundColor = "#f44336";
        borderColor = "#d32f2f";
        break;
      case "upcoming":
        backgroundColor = "#ff9800";
        borderColor = "#f57c00";
        break;
      case "scheduled":
        backgroundColor = "#4caf50";
        borderColor = "#388e3c";
        break;
      default:
        backgroundColor = "#3174ad";
        borderColor = "#3174ad";
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
    let certType = "";
    if (resource.isCert2) {
      certType = "Certification #2 is due";
    } else if (resource.isF2F) {
      certType = `F2F Required for BP ${resource.certifyingForBP}`;
    } else {
      certType = "Regular Recertification";
    }

    const message = `Patient: ${resource.patientName || resource.patientCd}
Patient ID: ${resource.patientCd}
Current Benefit Period: ${resource.currentBP}
Certifying For: BP ${resource.certifyingForBP}
Type: ${certType}
Period Length: ${resource.daysInPeriod} days
Due Date: ${moment(event.start).format("MMM DD, YYYY")}
Status: ${resource.status.toUpperCase()}`;

    alert(message);
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div style={modalStyle} className={classes.paper}>
          <Card>
            <CardHeader color="primary">
              <div className={classes.cardHeader}>
                <h4 className={classes.title}>
                  Recertification Calendar - All Active Patients
                </h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      backgroundColor: "#fff",
                      color: "#00acc1",
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
                  style={{ backgroundColor: "#f44336" }}
                />
                <span>Urgent (7 days or less)</span>
              </div>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#ff9800" }}
                />
                <span>Upcoming (8-14 days)</span>
              </div>
              <div className={classes.legendItem}>
                <div
                  className={classes.legendColor}
                  style={{ backgroundColor: "#4caf50" }}
                />
                <span>Scheduled (15+ days)</span>
              </div>
              <div className={classes.legendItem}>
                <strong>Total Patients:</strong> {patients.length}
              </div>
              <div className={classes.legendItem}>
                <strong>Total Events:</strong> {events.length}
              </div>
              <div className={classes.legendItem}>
                <strong>Cert #2:</strong> {events.filter(e => e.resource.isCert2).length}
              </div>
              <div className={classes.legendItem}>
                <strong>F2F Required:</strong> {events.filter(e => e.resource.isF2F).length}
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
                    `${event.resource.patientCd} - Benefit ${event.resource.benefitPeriod}`
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

export default RecertificationCalendarModal;

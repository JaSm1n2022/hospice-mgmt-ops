import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Typography, Chip, Divider } from "@material-ui/core";
import {
  Person,
  CalendarToday,
  Event,
  AccessTime,
  CheckCircle,
  Warning,
} from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: "20px",
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
  },
  cardHeader: {
    padding: "12px 15px",
    marginBottom: "0",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 500,
    margin: 0,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardBody: {
    padding: "15px",
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    fontSize: "0.875rem",
  },
  label: {
    fontWeight: 500,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  value: {
    fontWeight: 400,
    color: "#333",
  },
  icon: {
    fontSize: "1rem",
    color: "#666",
  },
  benefitChip: {
    height: "24px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  statusChip: {
    height: "24px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  divider: {
    margin: "10px 0",
  },
  timelineSection: {
    marginTop: "15px",
  },
  sectionTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#555",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  recertBlock: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    marginBottom: "8px",
    borderLeft: "4px solid",
  },
  urgentBlock: {
    borderLeftColor: "#f44336",
    backgroundColor: "#ffebee",
  },
  upcomingBlock: {
    borderLeftColor: "#ff9800",
    backgroundColor: "#fff3e0",
  },
  scheduledBlock: {
    borderLeftColor: "#4caf50",
    backgroundColor: "#e8f5e9",
  },
  completedBlock: {
    borderLeftColor: "#9e9e9e",
    backgroundColor: "#f5f5f5",
  },
}));

const RecertificationTimelineCard = ({ data }) => {
  const classes = useStyles();

  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return "secondary";
      case "upcoming":
        return "primary";
      case "scheduled":
        return "default";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status, daysUntil) => {
    if (status === "completed") return "Completed";
    if (status === "urgent") return `DUE IN ${daysUntil} DAYS`;
    if (status === "upcoming") return `${daysUntil} days`;
    return `${daysUntil} days`;
  };

  const getBlockClass = (status) => {
    switch (status) {
      case "urgent":
        return `${classes.recertBlock} ${classes.urgentBlock}`;
      case "upcoming":
        return `${classes.recertBlock} ${classes.upcomingBlock}`;
      case "scheduled":
        return `${classes.recertBlock} ${classes.scheduledBlock}`;
      case "completed":
        return `${classes.recertBlock} ${classes.completedBlock}`;
      default:
        return classes.recertBlock;
    }
  };

  const currentRecert = data.currentRecertification;

  return (
    <Card className={classes.card}>
      <CardHeader color="info" className={classes.cardHeader}>
        <h4 className={classes.cardTitle}>
          <Person style={{ fontSize: "1.2rem" }} />
          {data.patientName || data.patientCd}
        </h4>
      </CardHeader>
      <CardBody className={classes.cardBody}>
        <div className={classes.dataRow}>
          <span className={classes.label}>
            <Person className={classes.icon} />
            Patient ID:
          </span>
          <span className={classes.value}>{data.patientCd}</span>
        </div>

        <div className={classes.dataRow}>
          <span className={classes.label}>
            <CalendarToday className={classes.icon} />
            SOC Date:
          </span>
          <span className={classes.value}>
            {moment(data.socDate).format("MMM DD, YYYY")}
          </span>
        </div>

        <div className={classes.dataRow}>
          <span className={classes.label}>
            <Event className={classes.icon} />
            Admitted Benefit:
          </span>
          <Chip
            label={`Benefit ${data.admittedBenefitsPeriod}`}
            color="default"
            size="small"
            className={classes.benefitChip}
          />
        </div>

        {currentRecert && (
          <div className={classes.dataRow}>
            <span className={classes.label}>
              <Event className={classes.icon} />
              Current Benefit:
            </span>
            <Chip
              label={`Benefit ${currentRecert.benefitPeriod}`}
              color="primary"
              size="small"
              className={classes.benefitChip}
            />
          </div>
        )}

        <Divider className={classes.divider} />

        {currentRecert && (
          <>
            <Typography className={classes.sectionTitle}>
              <AccessTime className={classes.icon} />
              Current Period Details
            </Typography>

            <div className={getBlockClass(currentRecert.status)}>
              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Start Date:</span>
                <span className={classes.value}>
                  {moment(currentRecert.startDate).format("MMM DD, YYYY")}
                </span>
              </div>

              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Recert Due Date:</span>
                <span className={classes.value}>
                  {moment(currentRecert.dueDate).format("MMM DD, YYYY")}
                </span>
              </div>

              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Period Length:</span>
                <span className={classes.value}>
                  {currentRecert.daysInPeriod} days
                </span>
              </div>

              <div
                className={classes.dataRow}
                style={{ padding: "8px 0 4px 0" }}
              >
                <span className={classes.label}>
                  Days Before Next Benefit Period:
                </span>
                <Chip
                  label={getStatusLabel(
                    currentRecert.status,
                    data.daysUntilNextRecert
                  )}
                  color={getStatusColor(currentRecert.status)}
                  size="small"
                  className={classes.statusChip}
                  icon={
                    currentRecert.status === "urgent" ? (
                      <Warning />
                    ) : currentRecert.status === "completed" ? (
                      <CheckCircle />
                    ) : null
                  }
                />
              </div>

              <div
                style={{
                  padding: "8px",
                  marginTop: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  color: "#555",
                  fontStyle: "italic",
                }}
              >
                💡 Start recert as early as 15 days before the benefit period
                ends
              </div>
            </div>

            <Divider className={classes.divider} />

            <Typography className={classes.sectionTitle}>
              <Event className={classes.icon} />
              Next Benefit Period
            </Typography>

            <div
              style={{
                padding: "10px",
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
                borderLeft: "4px solid #2196f3",
              }}
            >
              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Next Benefit:</span>
                <Chip
                  label={`Benefit ${currentRecert.benefitPeriod + 1}`}
                  color="primary"
                  size="small"
                  className={classes.benefitChip}
                />
              </div>

              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Will Start:</span>
                <span className={classes.value}>
                  {moment(currentRecert.dueDate)
                    .add(1, "days")
                    .format("MMM DD, YYYY")}
                </span>
              </div>

              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Next Recert Due:</span>
                <span className={classes.value}>
                  {moment(currentRecert.dueDate)
                    .add(61, "days")
                    .format("MMM DD, YYYY")}
                </span>
              </div>

              <div className={classes.dataRow} style={{ padding: "4px 0" }}>
                <span className={classes.label}>Period Length:</span>
                <span className={classes.value}>60 days</span>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default RecertificationTimelineCard;

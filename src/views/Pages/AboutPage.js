import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import Accordion from "components/Accordion/Accordion.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "views/Components/Typography";
const useStyles = makeStyles(styles);

export default function AboutPage() {
  const [checked, setChecked] = React.useState([]);
  const [classicModal, setClassicModal] = React.useState(false);
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const classes = useStyles();
  const pickupManagement = () => {
    return (
      <span>
        <p>
          <strong>The Pickup Management</strong> tool is used to record the
          pickup event of supplies. The recipient will be prompted to
          electronically sign, and all data will be securely stored digitally.
        </p>
      </span>
    );
  };
  const deliveryManagement = () => {
    return (
      <span>
        <p>
          <strong>The Delivery Management</strong> feature oversees the
          transportation of supplies from the office to the patient's location.
          This tool includes the capability to capture photos as proof of
          delivery and obtain required signatures using mobile devices or
          computers, with all data digitally stored
        </p>
      </span>
    );
  };
  const callManagement = () => {
    return (
      <span>
        <p>
          <strong>The Call Management</strong> feature monitors incoming calls
          and records our responses and interactions. It is crucial to track all
          conversations and document everything that transpires during these
          calls for accurate record-keeping and follow-up.
        </p>
      </span>
    );
  };
  const onboarding = () => {
    return (
      <span>
        <p>
          The <strong>Onboarding Checklist</strong> feature monitors the
          progress of each client’s onboarding process by tracking the
          completion status of required tasks. To ensure a successful
          onboarding, all items on the checklist must be completed. If any item
          remains unfinished, an alert icon will appear in the report, notifying
          the administrator of outstanding actions that need attention.
        </p>
      </span>
    );
  };
  const idt = () => {
    return (
      <span>
        The clinician assignment feature assists in monitoring the current
        schedules of staff assigned to patients and aids in strategizing future
        assignments for patients, especially those requiring specific timing. By
        utilizing this feature, you can easily assess staff availability through
        generated reports
      </span>
    );
  };
  const metrics = () => {
    return (
      <span>
        <p>
          This metric report provides a comprehensive analysis of
          patient-related expenditures to support financial oversight and
          optimize resource allocation in hospice care operations. The metrics
          outlined below offer detailed insights into the distribution and
          tracking of expenses across various patient care components.
        </p>

        <h5 style={{ fontWeight: "bold" }}>Patient Supplies Metric</h5>
        <p>
          This report presents the distribution of incontinence supplies
          provided to patients, categorized by percentile. It enables
          administrators to assess supply utilization patterns and ensure
          equitable distribution aligned with patient needs.
        </p>

        <h5 style={{ fontWeight: "bold" }}>Patient Full Expenses Metric</h5>
        <p>
          This report captures the full spectrum of expenses incurred per
          patient, including pharmacy, transportation, durable medical equipment
          (DME), incontinence supplies, and professional services such as
          nursing, social work, and chaplaincy. The data is broken down by
          percentile, offering a comparative view of patient cost profiles.
        </p>

        <h5 style={{ fontWeight: "bold" }}>Patient Distribution Category</h5>
        <p>
          Similar to the Full Expenses Metric, this report outlines all incurred
          costs but details them by actual dollar amount rather than percentile.
          It provides a granular view of how funds are allocated across various
          service categories and supports accurate budgeting and cost
          management.
        </p>

        <h5 style={{ fontWeight: "bold" }}>Payment Method Tracking</h5>
        <p>
          This feature monitors the methods used to process payments, including
          credit card, check, and cash transactions. It enhances transparency in
          financial operations and helps ensure proper documentation of all
          disbursements.
        </p>

        <p>
          Collectively, these reports are designed to aid in evaluating spending
          efficiency, identifying outliers, and ensuring that patient care
          remains both cost-effective and compliant with operational standards.
        </p>
      </span>
    );
  };
  const orderPlotTool = () => {
    return (
      <span>
        The ordering tool generates a report detailing the quantity needed for a
        specific product intended for ordering from our supply vendor. This tool
        calculates your order estimate based on the last threshold distributed
        to your patients and compares it with our current stock to determine if
        new orders are necessary. This tool contains a list of products that you
        intend to include in the report for plotting and ordering purposes. Some
        examples of these products include diapers, underwear, under pads,
        wipes, and nutritional supplements like Ensure.
      </span>
    );
  };
  const utilityTool = () => {
    return (
      <span>
        This system is equipped with various utility tools designed to offer
        quick insights into product distribution per patient, track payment
        methods used for purchases, facilitate accurate ordering of incontinence
        supplies, and visually represent product distribution percentages
        through charts. Additionally, it includes features such as scheduling
        staff based on patient care plans and numerous other functionalities
      </span>
    );
  };
  const reportingTool = () => {
    return (
      <span>
        The reporting tool is a standout feature of this system, serving as a
        vital tool for tracking expenses, conducting month-to-month comparisons,
        and performing overhead analysis. Reports can be generated by specific
        categories such as pharmacy expenses, transportation costs, incontinence
        supplies, service fees or subscription fees, payroll, and more. This
        versatile tool enables users to gain insights into expenditure patterns
        and make informed financial decisions based on detailed category
        breakdowns.
        <div>
          <h5 style={{ fontWeight: "bold" }}>YTD Transaction Report</h5>
          <p>
            All transactions are recorded upon purchase and reported for
            reimbursement, covering all payable expenses related to operational
            concerns.
          </p>

          <h5 style={{ fontWeight: "bold" }}>
            YTD Medical/Incontinence Report
          </h5>
          <p>
            Transactions are specifically focused on expenses related to medical
            and incontinence supplies.
          </p>

          <h5 style={{ fontWeight: "bold" }}>YTD DME Report</h5>
          <p>
            Transactions are specifically focused on expenses related to DME.
          </p>

          <h5 style={{ fontWeight: "bold" }}>YTD Transportation Report</h5>
          <p>
            Transactions are specifically focused on expenses related to
            transportation.
          </p>

          <h5 style={{ fontWeight: "bold" }}>YTD Services Report</h5>
          <p>
            Transactions are specifically focused on expenses related to service
            subscriptions, such as government business renewal fees and EHR
            software fees.
          </p>

          <h5 style={{ fontWeight: "bold" }}>YTD Utilities Report</h5>
          <p>
            Transactions are specifically focused on expenses related to
            utilities, such as NV Energy, internet phones, etc.
          </p>

          <h5 style={{ fontWeight: "bold" }}>YTD Payroll Report</h5>
          <p>Transactions are specifically focused on payroll expenses.</p>
        </div>
      </span>
    );
  };
  const payroll = () => {
    return (
      <span>
        Payroll management involves the comprehensive process of calculating
        employee hours, issuing payments, withholding taxes, and maintaining
        financial documentation for your business. Additionally, this system
        provides detailed reports on employee services rendered to each patient,
        ensuring transparency in how payments are determined. This payroll
        management system includes a contract creation feature that allows users
        to generate contracts for each employee, which can also be specified by
        patient if needed. The contract function simplifies the computation of
        employee rates and total pay for services rendered, ensuring accurate
        and efficient payroll processing.
      </span>
    );
  };
  const transportation = () => {
    return (
      <span>
        The Transportation Management System oversees the scheduling of patient
        pickups and transports to their destinations. Its primary function is to
        record transportation details for patients and store this information
        within the system. It can then automatically generate a PDF form that
        can be easily uploaded to the Electronic Health Record (EHR) system
        portal.
      </span>
    );
  };
  const dme = () => {
    return (
      <span>
        DME Management, or Durable Medical Equipment Management, involves
        overseeing the appropriate use, maintenance, and replacement of durable
        medical equipment (DME) for patients. The primary function of this
        system is to record equipment orders based on patient needs and store
        this information within the system. It can then automatically generate a
        PDF form that can be easily uploaded to Hospice MD port
      </span>
    );
  };
  const distribution = () => {
    return (
      <span>
        Distribution management involves overseeing the entire process of goods
        from production to the final user, encompassing activities such as
        packaging, inventory control, and delivery. Within this system, there is
        a feature to generate a packing list for our hospice aide to track the
        distribution intended for patients. The system includes a user-friendly
        create and edit form where operators can select products and quantities,
        automatically updating the inventory accordingly. The form additionally
        incorporates fields for specifying the individuals responsible for
        taking and receiving the items. Users can export records and apply date
        range filters for more targeted retrieval of data.
      </span>
    );
  };
  const transaction = () => {
    return (
      <span>
        Transaction management is a system that efficiently records orders and
        payments, ensuring that all expense reports are accurately documented
        for generating profit and loss reports. Additionally, the system
        categorizes expenses, enabling individuals to conduct comprehensive
        comparisons or breakdowns of expense reports. Users can export records
        and apply date range filters for more targeted retrieval of data.
      </span>
    );
  };
  const stockroom = () => {
    return (
      <span>
        Effective stockroom management enables businesses to track product
        locations accurately, maintain item counts, optimize space for new
        orders, and minimize clutterinduced stress. Even in limited spaces,
        implementing organized retail stockroom strategies can revolutionize
        day-to-day operations. This system automates inventory creation and
        adjusts item quantities automatically upon distribution. Stockroom
        management includes features for adding and editing items through a
        user-friendly form interface.
      </span>
    );
  };
  const dashboard = () => {
    return (
      <span>
        Dashboard reporting involves visually representing your company's key
        performance indicators (KPIs). By utilizing data from various reports,
        dashboard visuals present charts and graphs that offer a quick overview
        of your company's performance. This includes metrics like available
        stockroom items, active patient count, total payable transactions, staff
        assignment schedules, admission process checklists, and a snapshot of
        current task items.
      </span>
    );
  };
  const taskManagement = () => {
    return (
      <span>
        <p>
          <strong>The Tasks Management</strong> feature logs office tasks and
          manages to-do items. Once actions are taken, this feature allows users
          to edit the status of tasks to mark them as done.
        </p>
      </span>
    );
  };
  const introduction = () => {
    return (
      <span>
        This system is designed specifically for managing hospice supplies
        inventory and facilitating comprehensive company budgeting and expense
        tracking. It does not store any patient-specific information such as
        date of birth (DOB), full names, social security number, or medical
        details. The purpose of this system is to streamline administrative
        functions for the office manager, payroll personnel, and logistics
        administrator by digitizing document processes and storing them securely
        in the database. This enables easy generation of reports in PDF and
        Excel formats.
        <p></p>
        <p>
          The system offers extensive configurations that enable users to
          customize functionality according to their specific needs. This
          includes setting up vendors, products, internal patient identifiers,
          facilities, and employees. Additionally, the system provides various
          reports on year-to-date (YTD) expenses, allowing for report grouping
          by category. It also includes features for monitoring daily tasks and
          call logs. Furthermore, there are additional functions that will be
          elaborated on in this portfolio.
        </p>{" "}
        <p>
          Access to the system is facilitated through a magic link sent to
          users, and access restrictions are determined by the user's role or
          privileges set by the super user account
        </p>
        <div>
          <strong>System Requirements:</strong>
          <ul>
            <li>Compatible with Windows and Mac operating systems</li>
            <li>
              Web browser compatibility includes Chrome (highly recommended) and
              other available browsers
            </li>
            <li>
              Requires Excel software for spreadsheet functionality and PDF
              viewer for document access
            </li>
          </ul>
        </div>
      </span>
    );
  };
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader>
              <h4 className={classes.cardTitle} style={{ fontWeight: "bold" }}>
                About Hospice Management System
              </h4>
            </CardHeader>
            <CardBody>
              <Accordion
                active={0}
                collapses={[
                  {
                    title: "INTRODUCTION",
                    content: introduction(),
                  },
                  {
                    title: "DASHBOARD",
                    content: dashboard(),
                  },
                  {
                    title: "STOCK ROOM MANAGEMENT",
                    content: stockroom(),
                  },
                  {
                    title: "DISTRIBUTION MANAGEMENT",
                    content: distribution(),
                  },
                  {
                    title: "TRANSACTION MANAGEMENT",
                    content: transaction(),
                  },
                  {
                    title: "DME MANAGEMENT",
                    content: dme(),
                  },
                  {
                    title: "TRANSPORTATION MANAGEMENT",
                    content: transportation(),
                  },
                  {
                    title: "PAYROLL MANAGEMENT",
                    content: payroll(),
                  },
                  {
                    title: "THE REPORTING TOOL: A Comprehensive Overview",
                    content: reportingTool(),
                  },
                  {
                    title: "UTILITY TOOL",
                    content: utilityTool(),
                  },
                  {
                    title: "ORDER PLOT TOOL",
                    content: orderPlotTool(),
                  },
                  {
                    title: "METRICS",
                    content: metrics(),
                  },
                  {
                    title: "IDT ASSIGNMENTS",
                    content: idt(),
                  },
                  {
                    title: "ONBOARDING CHECKLIST",
                    content: onboarding(),
                  },
                  {
                    title: "CALLS MANAGEMENT",
                    content: callManagement(),
                  },
                  {
                    title: "TASKS MANAGEMENT",
                    content: taskManagement(),
                  },
                  {
                    title: "DELIVERY MANAGEMENT",
                    content: deliveryManagement(),
                  },
                  {
                    title: "PICKUP MANAGEMENT",
                    content: pickupManagement(),
                  },
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

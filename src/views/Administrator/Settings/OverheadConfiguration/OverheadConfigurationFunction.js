import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import OverheadConfigurationHandler from "./handler/OverheadConfigurationHandler";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import HospiceTable from "components/Table/HospiceTable";

import OverheadForm from "./components/Form";
import {
  attemptToFetchOverhead,
  resetFetchOverheadState,
  attemptToCreateOverhead,
  resetCreateOverheadState,
  attemptToUpdateOverhead,
  resetUpdateOverheadState,
} from "store/actions/overheadAction";
import {
  overheadListStateSelector,
  overheadCreateStateSelector,
  overheadUpdateStateSelector,
} from "store/selectors/overheadSelector";
import { SupaContext } from "App";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
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
};

const useStyles = makeStyles(styles);

// Default constants to initialize overhead configuration
const DEFAULT_CONSTANTS = [
  {
    key: "MEDICAL_SUPPLY_RATE",
    value: 250.0,
    label: "Medical Supply Rate",
    description: "Monthly cost per patient for medical supplies",
    category: "Patient Care",
  },
  {
    key: "PHARMACY_RATE",
    value: 200.0,
    label: "Pharmacy Rate",
    description: "Monthly pharmacy cost per patient (ADC)",
    category: "Patient Care",
  },
  {
    key: "DME_DAILY_RATE",
    value: 4.75,
    label: "DME Daily Rate",
    description: "Daily rate for Durable Medical Equipment",
    category: "Patient Care",
  },
  {
    key: "PAYROLL_TAX_RATE",
    value: 0.076,
    label: "Payroll Tax Rate",
    description: "Payroll tax percentage (7.6%)",
    category: "Payroll",
  },
  {
    key: "BILLING_FEE_RATE",
    value: 0.03,
    label: "Billing Fee Rate",
    description: "Billing fee percentage (3%)",
    category: "Billing",
  },
  {
    key: "BILLING_FEE_MINIMUM",
    value: 500.0,
    label: "Billing Fee Minimum",
    description: "Minimum billing fee amount",
    category: "Billing",
  },
  {
    key: "MARKETING_PER_SOC",
    value: 2500.0,
    label: "Marketing per SOC",
    description: "Marketing cost per Start of Care patient",
    category: "Marketing",
  },
  {
    key: "TRANSPORTATION_PER_SOC",
    value: 165.0,
    label: "Transportation per SOC",
    description: "Transportation cost per Start of Care patient",
    category: "Operations",
  },
  {
    key: "ONCALL_WEEKDAY_HOURS",
    value: 75.0,
    label: "On-Call Weekday Hours",
    description: "On-call hours per week for weekdays",
    category: "Staffing",
  },
  {
    key: "ONCALL_WEEKEND_HOURS",
    value: 48.0,
    label: "On-Call Weekend Hours",
    description: "On-call hours per weekend (2 days)",
    category: "Staffing",
  },
  {
    key: "ONCALL_WEEKDAY_RATE",
    value: 3.0,
    label: "On-Call Weekday Rate",
    description: "Hourly rate for on-call staff on weekdays ($3/hr)",
    category: "Staffing",
  },
  {
    key: "ONCALL_WEEKEND_RATE",
    value: 4.0,
    label: "On-Call Weekend Rate",
    description: "Hourly rate for on-call staff on weekends ($4/hr)",
    category: "Staffing",
  },
  {
    key: "POTENTIAL_ADMISSION",
    value: 500.0,
    label: "Potential Admission",
    description: "A patient that were not admitted but services were done (e.g. NP evaluation, nurse admission, supplies, DME, etc)",
    category: "Operations",
  },
  {
    key: "RENT_OFFICE",
    value: 1065.0,
    label: "Office Rent",
    description: "Monthly office rent expense",
    category: "Office Expenses",
  },
  {
    key: "UTILITIES",
    value: 100.0,
    label: "Utilities",
    description: "Monthly utilities expense",
    category: "Office Expenses",
  },
  {
    key: "OFFICE_SUPPLIES",
    value: 300.0,
    label: "Office Supplies",
    description: "Monthly office supplies expense",
    category: "Office Expenses",
  },
  {
    key: "LIABILITY_INSURANCE",
    value: 300.0,
    label: "Liability Insurance",
    description: "Monthly liability insurance cost",
    category: "Insurance",
  },
  {
    key: "SOFTWARE_EHR",
    value: 217.0,
    label: "Software/EHR",
    description: "Monthly software and EHR costs",
    category: "Technology",
  },
  {
    key: "BUSINESS_EXPENSES",
    value: 4000.0,
    label: "Business Expenses",
    description: "General business expenses",
    category: "General",
  },
  {
    key: "COMMUNICATION_EXPENSE",
    value: 100.0,
    label: "Communication Expense",
    description: "Monthly communication costs",
    category: "Office Expenses",
  },
  {
    key: "OTHER_OVERHEAD",
    value: 500.0,
    label: "Other Overhead",
    description: "Miscellaneous overhead expenses",
    category: "General",
  },
];

function OverheadConfigurationFunction(props) {
  const classes = useStyles();
  const [tc, setTC] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const context = useContext(SupaContext);

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(
    OverheadConfigurationHandler.columns(true)
  );
  const [overheadRecord, setOverheadRecord] = useState(null);
  const [isOverheadCollection, setIsOverheadCollection] = useState(true);
  const [isCreateOverheadCollection, setIsCreateOverheadCollection] =
    useState(true);
  const [isUpdateOverheadCollection, setIsUpdateOverheadCollection] =
    useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [mode, setMode] = useState("edit");
  const [keywordValue, setKeywordValue] = useState("");

  const showNotification = (place, color, msg) => {
    setMessage(msg);
    switch (place) {
      case "tc":
        if (!tc) {
          setTC(true);
          setColor(color);
          setTimeout(function () {
            setTC(false);
          }, 6000);
        }
        break;
      default:
        break;
    }
  };

  const createFormHandler = (data, mode) => {
    setSelectedItem(data);
    setMode(mode || "edit");
    setIsFormModal(true);
  };

  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  // Handle status changes
  useEffect(() => {
    // Fetch completed
    if (
      !isOverheadCollection &&
      props.overhead &&
      props.overhead.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListOverhead();
      setIsOverheadCollection(true);
    }

    // Create completed
    if (
      !isCreateOverheadCollection &&
      props.createOverheadState &&
      props.createOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateOverhead();
      setIsCreateOverheadCollection(true);
      showNotification("tc", "success", "Overhead configuration created successfully");
      // Refetch after create
      if (context.userProfile?.companyId) {
        props.listOverhead({ companyId: context.userProfile?.companyId });
      }
    }

    // Update completed
    if (
      !isUpdateOverheadCollection &&
      props.updateOverheadState &&
      props.updateOverheadState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateOverhead();
      setIsUpdateOverheadCollection(true);
      showNotification("tc", "success", "Overhead configuration updated successfully");
      // Refetch after update
      if (context.userProfile?.companyId) {
        props.listOverhead({ companyId: context.userProfile?.companyId });
      }
    }
  }, [
    isOverheadCollection,
    isCreateOverheadCollection,
    isUpdateOverheadCollection,
  ]);

  // Initial fetch
  useEffect(() => {
    if (context.userProfile?.companyId) {
      props.listOverhead({ companyId: context.userProfile?.companyId });
    }
  }, []);

  // Process fetched data
  if (
    isOverheadCollection &&
    props.overhead &&
    props.overhead.status === ACTION_STATUSES.SUCCEED
  ) {
    const fetchedData = props.overhead.data;

    if (fetchedData && fetchedData.length > 0) {
      // Overhead record exists
      const record = fetchedData[0];
      setOverheadRecord(record);

      // Map constants to table data
      const constants = record.constants || [];
      const mappedData = OverheadConfigurationHandler.mapData(constants);

      // Add actions to columns
      const cols = OverheadConfigurationHandler.columns(true).map((col) => {
        if (col.name === "actions") {
          return {
            ...col,
            editable: () => false,
            render: (cellProps) => (
              <ActionsFunction
                deleteRecordItemHandler={() => {}}
                createFormHandler={createFormHandler}
                data={{ ...cellProps.data }}
                isNoDeleteEnabled={true}
              />
            ),
          };
        } else {
          return {
            ...col,
            editable: () => false,
          };
        }
      });

      setColumns(cols);
      setDataSource(mappedData);
      setIsOverheadCollection(false);
    } else {
      // No overhead record exists, create one with defaults
      console.log("[Creating default overhead configuration]");
      const payload = {
        companyId: context.userProfile?.companyId,
        constants: DEFAULT_CONSTANTS,
        createdUser: context.userProfile?.username || context.userProfile?.email,
      };
      props.createOverhead(payload);
      setIsOverheadCollection(false);
    }
  }

  // Update constant value
  const updateConstantHandler = (updatedConstant) => {
    if (!overheadRecord) return;

    // Update the constants array
    const updatedConstants = overheadRecord.constants.map((constant) =>
      constant.key === updatedConstant.key
        ? { ...constant, value: updatedConstant.value }
        : constant
    );

    // Prepare update payload
    const payload = {
      id: overheadRecord.id,
      constants: updatedConstants,
      updatedUser: context.userProfile?.username || context.userProfile?.email,
    };

    props.updateOverhead(payload);
  };

  // Handle search/filter
  const handleSearch = (value) => {
    setKeywordValue(value);
    if (!overheadRecord) return;

    const constants = overheadRecord.constants || [];
    let filtered = constants;

    if (value && value.trim()) {
      const searchTerm = value.toLowerCase();
      filtered = constants.filter(
        (item) =>
          item.label?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm)
      );
    }

    const mappedData = OverheadConfigurationHandler.mapData(filtered);
    setDataSource(mappedData);
  };

  return (
    <>
      <Snackbar
        place="tc"
        color={color}
        icon={AddAlert}
        message={message}
        open={tc}
        closeNotification={() => setTC(false)}
        close
      />
      <OverheadForm
        open={isFormModal}
        onClose={closeFormModalHandler}
        onSubmit={updateConstantHandler}
        item={selectedItem}
        mode={mode}
      />
      <div style={{ marginTop: "10px" }}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Overhead Configuration
                </h4>
                <p className={classes.cardCategoryWhite}>
                  Manage overhead constants for forecast calculations
                </p>
              </CardHeader>
              <CardBody>
                <HospiceTable
                  keywordValue={keywordValue}
                  setKeywordValue={handleSearch}
                  columns={columns}
                  dataSource={dataSource}
                  pageSize={20}
                  title="Overhead Constants"
                  isNoAddEnabled={true}
                  isNoDeleteEnabled={true}
                  isNoCheckBoxEnabled={true}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}

const mapStateToProps = (store) => ({
  overhead: overheadListStateSelector(store),
  createOverheadState: overheadCreateStateSelector(store),
  updateOverheadState: overheadUpdateStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listOverhead: (data) => dispatch(attemptToFetchOverhead(data)),
  resetListOverhead: () => dispatch(resetFetchOverheadState()),
  createOverhead: (data) => dispatch(attemptToCreateOverhead(data)),
  resetCreateOverhead: () => dispatch(resetCreateOverheadState()),
  updateOverhead: (data) => dispatch(attemptToUpdateOverhead(data)),
  resetUpdateOverhead: () => dispatch(resetUpdateOverheadState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverheadConfigurationFunction);

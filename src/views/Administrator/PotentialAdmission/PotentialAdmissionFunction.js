import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import PotentialAdmissionHandler from "./handler/PotentialAdmissionHandler";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button.js";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport, Print } from "@material-ui/icons";
import Helper from "utils/helper";
import PotentialAdmissionForm from "./components/PotentialAdmissionForm";
import { pdf } from "@react-pdf/renderer";
import PotentialAdmissionPrintDocument from "./components/PotentialAdmissionPrintDocument";
import PotentialAdmissionBatchPrintDocument from "./components/PotentialAdmissionBatchPrintDocument";
import { potentialAdmissionListStateSelector } from "store/selectors/potentialAdmissionSelector";
import { potentialAdmissionCreateStateSelector } from "store/selectors/potentialAdmissionSelector";
import { potentialAdmissionUpdateStateSelector } from "store/selectors/potentialAdmissionSelector";
import { potentialAdmissionDeleteStateSelector } from "store/selectors/potentialAdmissionSelector";
import { attemptToFetchPotentialAdmission } from "store/actions/potentialAdmissionAction";
import { resetFetchPotentialAdmissionState } from "store/actions/potentialAdmissionAction";
import { attemptToCreatePotentialAdmission } from "store/actions/potentialAdmissionAction";
import { resetCreatePotentialAdmissionState } from "store/actions/potentialAdmissionAction";
import { resetUpdatePotentialAdmissionState } from "store/actions/potentialAdmissionAction";
import { attemptToDeletePotentialAdmission } from "store/actions/potentialAdmissionAction";
import { resetDeletePotentialAdmissionState } from "store/actions/potentialAdmissionAction";
import { attemptToUpdatePotentialAdmission } from "store/actions/potentialAdmissionAction";
import FilterTable from "components/Table/FilterTable";
import { handleExport } from "utils/XlsxHelper";
import { SupaContext } from "App";

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
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
let originalSource = undefined;

function PotentialAdmissionFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(PotentialAdmissionHandler.columns(true));
  const [isPotentialAdmissionsCollection, setIsPotentialAdmissionsCollection] = useState(true);
  const [isCreatePotentialAdmissionCollection, setIsCreatePotentialAdmissionCollection] = useState(true);
  const [isUpdatePotentialAdmissionCollection, setIsUpdatePotentialAdmissionCollection] = useState(true);
  const [isDeletePotentialAdmissionCollection, setIsDeletePotentialAdmissionCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [keywordValue, setKeywordValue] = useState("");

  const createFormHandler = (data, mode) => {
    console.log("createFormHandler called - data:", data, "mode:", mode);
    setItem(data || undefined);
    setMode(mode || "create");
    console.log("Setting mode to:", mode || "create");
    setIsFormModal(true);
  };

  const closeFormModalHandler = () => {
    setIsFormModal(false);
    // Reset mode and item when closing to prevent stale state
    setMode("create");
    setItem(undefined);
  };

  useEffect(() => {
    if (
      !isPotentialAdmissionsCollection &&
      props.potentialAdmissions &&
      props.potentialAdmissions.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListPotentialAdmissions();
      setIsPotentialAdmissionsCollection(true);
    }

    if (
      !isCreatePotentialAdmissionCollection &&
      props.createPotentialAdmissionState &&
      props.createPotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreatePotentialAdmission();
      setIsCreatePotentialAdmissionCollection(true);
    }

    if (
      !isUpdatePotentialAdmissionCollection &&
      props.updatePotentialAdmissionState &&
      props.updatePotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdatePotentialAdmission();
      setIsUpdatePotentialAdmissionCollection(true);
    }

    if (
      !isDeletePotentialAdmissionCollection &&
      props.deletePotentialAdmissionState &&
      props.deletePotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeletePotentialAdmission();
      setIsDeletePotentialAdmissionCollection(true);
    }
  }, [
    isDeletePotentialAdmissionCollection,
    isUpdatePotentialAdmissionCollection,
    isCreatePotentialAdmissionCollection,
    isPotentialAdmissionsCollection,
  ]);

  useEffect(() => {
    if (context.userProfile?.companyId) {
      props.listPotentialAdmissions({ companyId: context.userProfile?.companyId });
    }
  }, []);

  const sortByDate = (items) => {
    items.sort((a, b) => {
      const dateA = a.received_hp_dt ? new Date(a.received_hp_dt) : new Date(0);
      const dateB = b.received_hp_dt ? new Date(b.received_hp_dt) : new Date(0);
      return dateB - dateA; // Most recent first
    });
    return items;
  };

  if (
    isPotentialAdmissionsCollection &&
    props.potentialAdmissions &&
    props.potentialAdmissions.status === ACTION_STATUSES.SUCCEED
  ) {
    let source = props.potentialAdmissions.data;
    if (source && source.length) {
      source = PotentialAdmissionHandler.mapData(source);
    }

    const cols = PotentialAdmissionHandler.columns(true).map((col, index) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              printHandler={printAdmissionHandler}
              isPrintFunction={true}
              data={{ ...cellProps.data }}
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
    originalSource = [...source];
    source = sortByDate(source);
    setDataSource(source);
    setIsPotentialAdmissionsCollection(false);
  }

  if (
    isPotentialAdmissionsCollection &&
    props.potentialAdmissions &&
    props.potentialAdmissions.status === ACTION_STATUSES.FAILED
  ) {
    setIsPotentialAdmissionsCollection(false);
  }

  const deleteRecordItemHandler = (id) => {
    props.deletePotentialAdmission(id);
  };

  const createPotentialAdmissionHandler = (payload, mode) => {
    console.log("=== createPotentialAdmissionHandler START ===");
    console.log("Mode value is: " + mode);
    console.log("Mode type is: " + typeof mode);
    console.log("Payload id is: " + (payload.id || "NO ID - NEW RECORD"));
    console.log("Checking mode conditions...");

    // Helper function to format dates as YYYY-MM-DD (date-only, no timezone shift)
    const formatDateOnly = (date) => {
      if (!date) return null;
      // If it's already a string in YYYY-MM-DD format, return as-is
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Convert to YYYY-MM-DD format using local timezone
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const params = {
      received_hp_dt: formatDateOnly(payload.received_hp_dt),
      emailed_hp_to_pre_admission_dt: formatDateOnly(payload.emailed_hp_to_pre_admission_dt),
      received_pre_admission_dt: formatDateOnly(payload.received_pre_admission_dt),
      pre_admission_prognosis: payload.pre_admission_prognosis,
      forwarded_pre_admission_dt: formatDateOnly(payload.forwarded_pre_admission_dt),
      hp_prognosis: payload.hp_prognosis,
      md_prognosis: payload.md_prognosis,
      admission_dt: formatDateOnly(payload.admission_dt),
      admission_cost: payload.admission_cost,
      referral: payload.referral,
      patientCd: payload.patientCd,
      eligibility_dt: formatDateOnly(payload.eligibility_dt),
      age: payload.age,
      current_location: payload.current_location,
      hospice_status: payload.hospice_status,
      current_hospice_benefits: payload.current_hospice_benefits,
      admission_decision: payload.admission_decision,
      eval_dt: formatDateOnly(payload.eval_dt),
      eval_staff: payload.eval_staff,
      admission_nurse: payload.admission_nurse,
      comments: payload.comments,
      companyId: context.userProfile?.companyId,
      updatedUser: {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      },
    };

    console.log("Checking if mode === 'create':", mode === "create");
    console.log("Checking if mode === 'edit':", mode === "edit");

    if (mode === "create") {
      console.log("CALLING CREATE ACTION NOW");
      params.createdUser = {
        name: context.userProfile?.name,
        userId: context.userProfile?.id,
        date: new Date(),
      };
      console.log("About to dispatch createPotentialAdmission");
      props.createPotentialAdmission(params);
      console.log("Dispatched createPotentialAdmission");
    } else if (mode === "edit") {
      console.log("CALLING UPDATE ACTION NOW - Mode is EDIT");
      console.log("Payload id for update:", payload.id);
      if (!payload.id) {
        console.error("ERROR: Cannot update without an ID!");
      }
      params.id = payload.id;
      console.log("About to dispatch updatePotentialAdmission with params:", params);
      props.updatePotentialAdmission(params);
      console.log("Dispatched updatePotentialAdmission");
    } else {
      console.log("ERROR: Unknown mode - " + mode);
    }
    console.log("Closing form modal");
    closeFormModalHandler();
    console.log("=== createPotentialAdmissionHandler END ===");
  };

  if (
    isCreatePotentialAdmissionCollection &&
    props.createPotentialAdmissionState &&
    props.createPotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsCreatePotentialAdmissionCollection(false);
    props.listPotentialAdmissions({ companyId: context.userProfile?.companyId });
  }

  if (
    isCreatePotentialAdmissionCollection &&
    props.createPotentialAdmissionState &&
    props.createPotentialAdmissionState.status === ACTION_STATUSES.FAILED
  ) {
    setIsCreatePotentialAdmissionCollection(false);
  }

  if (
    isUpdatePotentialAdmissionCollection &&
    props.updatePotentialAdmissionState &&
    props.updatePotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsUpdatePotentialAdmissionCollection(false);
    props.listPotentialAdmissions({ companyId: context.userProfile?.companyId });
  }

  if (
    isUpdatePotentialAdmissionCollection &&
    props.updatePotentialAdmissionState &&
    props.updatePotentialAdmissionState.status === ACTION_STATUSES.FAILED
  ) {
    console.log("UPDATE FAILED STATE DETECTED - This might be the issue!");
    console.log("updatePotentialAdmissionState:", props.updatePotentialAdmissionState);
    setIsUpdatePotentialAdmissionCollection(false);
  }

  if (
    isDeletePotentialAdmissionCollection &&
    props.deletePotentialAdmissionState &&
    props.deletePotentialAdmissionState.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsDeletePotentialAdmissionCollection(false);
    props.listPotentialAdmissions({ companyId: context.userProfile?.companyId });
  }

  if (
    isDeletePotentialAdmissionCollection &&
    props.deletePotentialAdmissionState &&
    props.deletePotentialAdmissionState.status === ACTION_STATUSES.FAILED
  ) {
    setIsDeletePotentialAdmissionCollection(false);
  }

  const filterRecordHandler = (keyword) => {
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];
      let found = temp.filter(
        (data) =>
          (data.patientCd &&
            data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.referral &&
            data.referral.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
      );
      setDataSource(found);
    }
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll;
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll;
      });
    }
    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];
    dtSource = sortByDate(dtSource);
    setDataSource(dtSource);
  };

  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const excel = Helper.formatExcelReport(columns, excelData);
    let fileName = `potential_admission_list_${new Date().getTime()}`;

    if (excel && excel.length) {
      handleExport(excel, fileName);
    }
  };

  // Print individual admission
  const printAdmissionHandler = async (admission) => {
    try {
      console.log("Printing admission data:", admission);
      const doc = <PotentialAdmissionPrintDocument admissionData={admission} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.error("Full error:", error.stack);
      TOAST.error("Failed to generate PDF. Please try again.");
    }
  };

  // Print batch report for selected admissions
  const printBatchReportHandler = async () => {
    try {
      const selectedAdmissions = dataSource.filter((r) => r.isChecked);
      if (!selectedAdmissions || selectedAdmissions.length === 0) {
        return;
      }
      const doc = <PotentialAdmissionBatchPrintDocument admissionsData={selectedAdmissions} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating batch PDF:", error);
    }
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose">
              <Grid container justifyContent="space-between">
                <h4 className={classes.cardTitleWhite}>Potential Admission</h4>
              </Grid>
            </CardHeader>
            <CardBody>
              <GridContainer alignItems="center" style={{ paddingLeft: 12 }}>
                <Grid item xs={12} md={6}>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <Button
                      color="info"
                      className={classes.marginRight}
                      onClick={() => createFormHandler()}
                    >
                      <AddIcon className={classes.icons} /> Add Potential Admission
                    </Button>

                    {isAddGroupButtons && (
                      <>
                        <Button
                          color="success"
                          className={classes.marginRight}
                          onClick={() => exportToExcelHandler()}
                        >
                          <ImportExport className={classes.icons} /> Export Excel
                        </Button>
                        <Button
                          color="info"
                          className={classes.marginRight}
                          onClick={() => printBatchReportHandler()}
                        >
                          <Print className={classes.icons} /> Print Report
                        </Button>
                      </>
                    )}
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 20,
                  }}
                >
                  <FilterTable
                    filterRecordHandler={filterRecordHandler}
                    isNoDate={true}
                    main={false}
                    search={12}
                  />
                </Grid>
              </GridContainer>
              <HospiceTable
                columns={columns}
                main={true}
                dataSource={dataSource}
                height={400}
                onCheckboxSelectionHandler={onCheckboxSelectionHandler}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {isFormModal && (
        <PotentialAdmissionForm
          createPotentialAdmissionHandler={createPotentialAdmissionHandler}
          mode={mode}
          isOpen={isFormModal}
          item={item}
          closeFormModalHandler={closeFormModalHandler}
          context={context}
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  potentialAdmissions: potentialAdmissionListStateSelector(store),
  createPotentialAdmissionState: potentialAdmissionCreateStateSelector(store),
  updatePotentialAdmissionState: potentialAdmissionUpdateStateSelector(store),
  deletePotentialAdmissionState: potentialAdmissionDeleteStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPotentialAdmissions: (data) => dispatch(attemptToFetchPotentialAdmission(data)),
  resetListPotentialAdmissions: () => dispatch(resetFetchPotentialAdmissionState()),
  createPotentialAdmission: (data) => dispatch(attemptToCreatePotentialAdmission(data)),
  resetCreatePotentialAdmission: () => dispatch(resetCreatePotentialAdmissionState()),
  updatePotentialAdmission: (data) => dispatch(attemptToUpdatePotentialAdmission(data)),
  resetUpdatePotentialAdmission: () => dispatch(resetUpdatePotentialAdmissionState()),
  deletePotentialAdmission: (data) => dispatch(attemptToDeletePotentialAdmission(data)),
  resetDeletePotentialAdmission: () => dispatch(resetDeletePotentialAdmissionState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PotentialAdmissionFunction);

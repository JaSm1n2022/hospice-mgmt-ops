import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { SupaContext } from "App";
import SchedulerHandler from "./components/SchedulerHandler";
import { connect } from "react-redux";
import ActionsFunction from "components/Actions/ActionsFunction";
import { ACTION_STATUSES } from "utils/constants";
import { CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HospiceTable from "components/Table/HospiceTable";
import TOAST from "modules/toastManager";
import moment from "moment";
import SchedulerForm from "./components/SchedulerForm";
import { schedulerListStateSelector } from "store/selectors/schedulerSelector";
import { schedulerCreateStateSelector } from "store/selectors/schedulerSelector";
import { schedulerUpdateStateSelector } from "store/selectors/schedulerSelector";
import { schedulerDeleteStateSelector } from "store/selectors/schedulerSelector";
import { attemptToFetchScheduler } from "store/actions/schedulerAction";
import { resetFetchSchedulerState } from "store/actions/schedulerAction";
import { attemptToCreateScheduler } from "store/actions/schedulerAction";
import { resetCreateSchedulerState } from "store/actions/schedulerAction";
import { attemptToUpdateScheduler } from "store/actions/schedulerAction";
import { resetUpdateSchedulerState } from "store/actions/schedulerAction";
import { attemptToDeleteScheduler } from "store/actions/schedulerAction";
import { resetDeleteSchedulerState } from "store/actions/schedulerAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

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
let patientList = [];
let isSchedulerListDone = true;
let isPatientDone = true;

function SchedulerFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(SchedulerHandler.columns(main));
  const [isSchedulerCollection, setIsSchedulerCollection] = useState(true);
  const [isCreateSchedulerCollection, setIsCreateSchedulerCollection] = useState(true);
  const [isUpdateSchedulerCollection, setIsUpdateSchedulerCollection] = useState(true);
  const [isDeleteSchedulerCollection, setIsDeleteSchedulerCollection] = useState(true);
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [keywordValue, setKeywordValue] = useState("");

  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };

  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    if (
      !isSchedulerCollection &&
      props.scheduler &&
      props.scheduler.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetListSchedulers();
      setIsSchedulerCollection(true);
    }

    if (
      !isCreateSchedulerCollection &&
      props.createSchedulerState &&
      props.createSchedulerState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetCreateScheduler();
      setIsCreateSchedulerCollection(true);
    }

    if (
      !isUpdateSchedulerCollection &&
      props.updateSchedulerState &&
      props.updateSchedulerState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetUpdateScheduler();
      setIsUpdateSchedulerCollection(true);
    }

    if (
      !isDeleteSchedulerCollection &&
      props.deleteSchedulerState &&
      props.deleteSchedulerState.status === ACTION_STATUSES.SUCCEED
    ) {
      props.resetDeleteScheduler();
      setIsDeleteSchedulerCollection(true);
    }
  }, [
    isSchedulerCollection,
    isCreateSchedulerCollection,
    isUpdateSchedulerCollection,
    isDeleteSchedulerCollection,
  ]);

  useEffect(() => {
    isSchedulerListDone = false;
    isPatientDone = false;
    setIsSchedulerCollection(true);
    if (context.userProfile?.companyId) {
      props.listSchedulers({ companyId: context.userProfile.companyId });
      props.listPatients({ companyId: context.userProfile.companyId });
    }
  }, []);

  if (
    isSchedulerCollection &&
    props.scheduler &&
    props.scheduler.status === ACTION_STATUSES.SUCCEED
  ) {
    isSchedulerListDone = true;
    let source = props.scheduler.data;
    if (source && source.length) {
      source = SchedulerHandler.mapData(source);
    }

    const cols = SchedulerHandler.columns(main).map((col) => {
      if (col.name === "actions") {
        return {
          ...col,
          editable: () => false,
          render: (cellProps) => (
            <ActionsFunction
              deleteRecordItemHandler={deleteRecordItemHandler}
              createFormHandler={createFormHandler}
              data={{ ...cellProps.data }}
            />
          ),
        };
      }
      return {
        ...col,
        editable: () => false,
      };
    });

    originalSource = [...source];
    setDataSource(source);
    setColumns(cols);
    setIsSchedulerCollection(false);
  }

  const deleteRecordItemHandler = (id) => {
    console.log("[delete Scheduler id]", id);
    props.deleteScheduler(id);
  };

  const createSchedulerHandler = (payload, mode) => {
    if (mode === "create") {
      props.createScheduler(payload);
    } else if (mode === "edit") {
      props.updateScheduler(payload);
    }
    closeFormModalHandler();
  };

  if (
    isCreateSchedulerCollection &&
    props.createSchedulerState &&
    props.createSchedulerState.status === ACTION_STATUSES.SUCCEED
  ) {
    isSchedulerListDone = true;
    setIsCreateSchedulerCollection(false);
    closeFormModalHandler();
    TOAST.ok("Schedule successfully created.");
    props.listSchedulers({
      companyId: context.userProfile.companyId,
    });
  }

  if (
    isUpdateSchedulerCollection &&
    props.updateSchedulerState &&
    props.updateSchedulerState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Schedule successfully updated.");
    setIsUpdateSchedulerCollection(false);
    props.listSchedulers({
      companyId: context.userProfile.companyId,
    });
  }

  if (
    isDeleteSchedulerCollection &&
    props.deleteSchedulerState &&
    props.deleteSchedulerState.status === ACTION_STATUSES.SUCCEED
  ) {
    TOAST.ok("Schedule successfully deleted.");
    setIsDeleteSchedulerCollection(false);
    props.listSchedulers({
      companyId: context.userProfile.companyId,
    });
  }

  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    isPatientDone = true;
    const ps = props.patients.data;
    ps.forEach((p) => {
      p.name = p.patientCd;
      p.value = p.name;
      p.label = p.name;
      p.description = p.name;
      p.category = "patient";
    });
    patientList = ps;
    props.resetListPatients();
  }

  const filterRecordHandler = (keyword) => {
    if (!originalSource || !Array.isArray(originalSource)) {
      return;
    }

    let filtered = [...originalSource];

    if (keyword) {
      filtered = filtered.filter(
        (data) =>
          (data.patientCd &&
            data.patientCd.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) ||
          (data.service_type &&
            data.service_type.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
      );
    }

    setDataSource(filtered);
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
    originalSource = [...dtSource];
    setDataSource(dtSource);
  };

  const isProcessDone = isSchedulerListDone && isPatientDone;

  return (
    <>
      {!isProcessDone ? (
        <div>
          <CircularProgress />
          Loading...
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="rose">
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: "0 0 100%" }}>
                      <h4 className={classes.cardTitleWhite}>
                        Scheduler Management
                      </h4>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <GridContainer style={{ paddingLeft: 14 }}>
                    <GridItem md={12} sm={12} xs={12}>
                      <Button
                        color="info"
                        className={classes.marginRight}
                        onClick={() => createFormHandler()}
                      >
                        <AddIcon className={classes.icons} /> Add Schedule
                      </Button>
                    </GridItem>
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
        </div>
      )}
      {isFormModal && (
        <SchedulerForm
          filterRecordHandler={filterRecordHandler}
          dataSource={dataSource}
          createSchedulerHandler={createSchedulerHandler}
          mode={mode}
          isOpen={isFormModal}
          item={item}
          patientList={patientList}
          userProfile={context.userProfile}
          closeFormModalHandler={closeFormModalHandler}
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  scheduler: schedulerListStateSelector(store),
  createSchedulerState: schedulerCreateStateSelector(store),
  updateSchedulerState: schedulerUpdateStateSelector(store),
  deleteSchedulerState: schedulerDeleteStateSelector(store),
  patients: patientListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listSchedulers: (data) => dispatch(attemptToFetchScheduler(data)),
  resetListSchedulers: () => dispatch(resetFetchSchedulerState()),
  createScheduler: (data) => dispatch(attemptToCreateScheduler(data)),
  resetCreateScheduler: () => dispatch(resetCreateSchedulerState()),
  updateScheduler: (data) => dispatch(attemptToUpdateScheduler(data)),
  resetUpdateScheduler: () => dispatch(resetUpdateSchedulerState()),
  deleteScheduler: (data) => dispatch(attemptToDeleteScheduler(data)),
  resetDeleteScheduler: () => dispatch(resetDeleteSchedulerState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerFunction);

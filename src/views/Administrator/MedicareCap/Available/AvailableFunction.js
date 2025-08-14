import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import AvailableHandler from "./components/AvailableHandler";
import { connect } from "react-redux";

import { ACTION_STATUSES } from "utils/constants";
import { Button, CircularProgress, Grid } from "@material-ui/core";

import HospiceTable from "components/Table/HospiceTable";
import { ImportExport } from "@material-ui/icons";
import Helper from "utils/helper";
import * as FileSaver from "file-saver";

import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";

import FilterTable from "components/Table/FilterTable";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";

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

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;
let userProfile = {};
let originalSource = [];
function AvailableFunction(props) {
  const classes = useStyles();
  const { main } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(AvailableHandler.columns(true));
  const [isFormModal, setIsFormModal] = useState(false);
  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("create");
  const [isAddGroupButtons, setIsAddGroupButtons] = useState(false);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [keywordValue, setKeywordValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const createFormHandler = (data, mode) => {
    setItem(data);
    setMode(mode || "create");
    setIsFormModal(true);
  };
  const closeFormModalHandler = () => {
    setIsFormModal(false);
  };

  useEffect(() => {
    console.log("list calls", props.main);
    isPatientListDone = false;
    if (
      props.profileState &&
      props.profileState.data &&
      props.profileState.data.length
    ) {
      userProfile = props.profileState.data[0];
      props.listPatients({
        companyId: userProfile.companyId,
      });
    }
  }, []);

  if (
    isPatientsCollection &&
    props.patients?.status === ACTION_STATUSES.SUCCEED
  ) {
    isPatientListDone = true;

    let source = props.patients.data;
    if (source && source.length) {
      source = AvailableHandler.mapData(source);
    }

    const cols = AvailableHandler.columns(true).map((col, index) => {
      return {
        ...col,
        editable: () => false,
      };
    });
    setColumns(cols);
    originalSource = [...source];
    // source = sortByWorth(source);
    setDataSource(source);
    setIsPatientsCollection(false);
  }

  const filterRecordHandler = (keyword) => {
    console.log("[Keyword]", keyword);
    if (!keyword) {
      setDataSource([...originalSource]);
    } else {
      const temp = [...originalSource];

      let found = temp.filter(
        (data) =>
          data.clientName &&
          data.clientName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );

      setDataSource(found);
    }
  };

  const onCheckboxSelectionHandler = (data, isAll, itemIsChecked) => {
    console.log("[data ALl]", data, isAll, itemIsChecked);
    let dtSource = [...dataSource];
    if (isAll) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    } else if (!isAll && data && data.length > 0) {
      dtSource.forEach((item) => {
        if (item.id.toString() === data[0].toString()) {
          item.isChecked = itemIsChecked;
        }
      });
    } else if (!isAll && Array.isArray(data) && data.length === 0) {
      dtSource.forEach((item) => {
        item.isChecked = isAll; // reset
      });
    }
    setIsAddGroupButtons(dtSource.find((f) => f.isChecked));
    originalSource = [...dtSource];
    //  dtSource = sortByWorth(dtSource);
    setDataSource(dtSource);
  };
  const exportToExcelHandler = () => {
    const excelData = dataSource.filter((r) => r.isChecked);
    const headers = columns;
    const excel = Helper.formatExcelReport(headers, excelData);
    console.log("headers", excel);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let fileName = `cap_list_batch_${new Date().getTime()}`;

    if (excelData && excelData.length) {
      import(/* webpackChunkName: 'json2xls' */ "json2xls")
        .then((json2xls) => {
          // let fileName = fname + '_' + new Date().getTime();
          const xls =
            typeof json2xls === "function"
              ? json2xls(excel)
              : json2xls.default(excel);
          const buffer = Buffer.from(xls, "binary");
          // let buffer = Buffer.from(excelBuffer);
          const data = new Blob([buffer], { type: fileType });
          FileSaver.saveAs(data, fileName + fileExtension);
        })
        .catch((err) => {
          // Handle failure
          console.log(err);
        });
    }
  };
  const onPressEnterKeyHandler = (value) => {
    filterRecordHandler(value);
    setKeywordValue(value);
  };
  const inputHandler = (e) => {
    if (e.target.name === "keywordValue") {
      setKeywordValue(e.target.value);
      filterRecordHandler(e.target.value);
    }
  };

  isProcessDone = isPatientListDone;

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
                <CardHeader color="success">
                  <Grid container justifyContent="space-between">
                    <h4 className={classes.cardTitleWhite}>
                      Medicare Cap Management
                    </h4>
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
                      {isAddGroupButtons && (
                        <Button
                          onClick={() => exportToExcelHandler()}
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
                          startIcon={<ImportExport />}
                        >
                          {" "}
                          Export Excel{" "}
                        </Button>
                      )}
                    </div>
                    <div>
                      <FilterTable
                        dateRangeSelection={"thisWeek"}
                        filterRecordHandler={filterRecordHandler}
                      />
                    </div>
                    {/*
                      <SearchCustomTextField
                        background={"white"}
                        onChange={inputHandler}
                        placeholder={"Search Item"}
                        label={"Search Item"}
                        name={"keywordValue"}
                        onPressEnterKeyHandler={onPressEnterKeyHandler}
                        isAllowEnterKey={true}
                        value={keywordValue}
                      />
                      */}
                  </Grid>
                  <HospiceTable
                    columns={columns}
                    main={true}
                    dataSource={dataSource}
                    height={400}
                    onCheckboxSelectionHandler={onCheckboxSelectionHandler}
                  />
                  ;
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      )}
    </>
  );
}
const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvailableFunction);

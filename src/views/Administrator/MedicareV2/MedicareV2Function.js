import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import MedicareHandler from "./components/MedicareHandler";
import MedicareCard from "./components/MedicareCard";
import SummaryStats from "./components/SummaryStats";
import { connect } from "react-redux";

import { ACTION_STATUSES } from "utils/constants";
import {
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";

import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";

import { patientListStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";
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
  searchField: {
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "4px",
  },
};

const useStyles = makeStyles(styles);

let patientList = [];
let isProcessDone = true;
let isPatientListDone = true;

let originalSource = [];

function MedicareV2Function(props) {
  const context = useContext(SupaContext);
  const classes = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [keywordValue, setKeywordValue] = useState("");

  useEffect(() => {
    console.log("Medicare V2 - loading patient data");
    isPatientListDone = false;
    if (context.userProfile?.companyId) {
      props.listPatients({
        companyId: context.userProfile?.companyId,
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
      source = MedicareHandler.mapData(source);
    }

    originalSource = [...source];
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

  const inputHandler = (e) => {
    const value = e.target.value;
    setKeywordValue(value);
    filterRecordHandler(value);
  };

  isProcessDone = isPatientListDone;

  return (
    <>
      {!isProcessDone ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
          <div style={{ marginTop: "20px" }}>Loading Medicare Cap Data...</div>
        </div>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <Grid container justifyContent="space-between">
                    <h4 className={classes.cardTitleWhite}>
                      Medicare Cap Management - Dashboard
                    </h4>
                  </Grid>
                </CardHeader>
                <CardBody>
                  {/* Summary Statistics */}
                  <GridContainer
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GridItem md={12} sm={12} xs={12}>
                      <SummaryStats data={originalSource} />
                    </GridItem>
                  </GridContainer>

                  {/* Search Field */}
                  <GridContainer
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GridItem md={12} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by patient name..."
                        value={keywordValue}
                        onChange={inputHandler}
                        className={classes.searchField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  {/* Patient Cards */}
                  <GridContainer spacing={3} style={{ padding: "0 20px" }}>
                    {dataSource && dataSource.length > 0 ? (
                      dataSource.map((patient, index) => (
                        <GridItem key={index} xs={12} sm={6} md={4} lg={3}>
                          <MedicareCard data={patient} />
                        </GridItem>
                      ))
                    ) : (
                      <GridItem xs={12}>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#999",
                          }}
                        >
                          No patient data found
                        </div>
                      </GridItem>
                    )}
                  </GridContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicareV2Function);

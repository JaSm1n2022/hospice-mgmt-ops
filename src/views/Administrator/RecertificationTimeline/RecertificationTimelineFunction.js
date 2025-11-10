import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RecertificationTimelineHandler from "./components/RecertificationTimelineHandler";
import RecertificationTimelineCard from "./components/RecertificationTimelineCard";
import { connect } from "react-redux";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { CircularProgress, TextField, Grid, Button } from "@material-ui/core";

import { SupaContext } from "App";
import { ACTION_STATUSES } from "utils/constants";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { patientListStateSelector } from "store/selectors/patientSelector";

const styles = {
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  cardCategory: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
};

const useStyles = makeStyles(styles);

let isPatientListDone = true;
let originalDataSource = [];

function RecertificationTimelineFunction(props) {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [dataSource, setDataSource] = useState([]);
  const [isPatientsCollection, setIsPatientsCollection] = useState(true);
  const [patientIdFilter, setPatientIdFilter] = useState("");
  const [daysFilter, setDaysFilter] = useState("");

  useEffect(() => {
    console.log("Recertification Timeline - loading patient data");
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
      // Filter only active patients
      source = source.filter((p) => p.status === "Active");
      source = RecertificationTimelineHandler.mapData(source);
      originalDataSource = [...source];
      setDataSource(source);
      setIsPatientsCollection(false);
    }
  }

  const applyFilters = () => {
    let filteredData = [...originalDataSource];

    // Filter by patient ID
    if (patientIdFilter.trim()) {
      filteredData = filteredData.filter((patient) =>
        patient.patientCd
          ?.toLowerCase()
          .includes(patientIdFilter.toLowerCase().trim())
      );
    }

    // Filter by days until next recertification
    if (daysFilter.trim() && !isNaN(daysFilter)) {
      const daysNumber = parseInt(daysFilter);
      filteredData = filteredData.filter((patient) => {
        return (
          patient.daysUntilNextRecert !== null &&
          patient.daysUntilNextRecert <= daysNumber
        );
      });
    }

    setDataSource(filteredData);
  };

  const clearFilters = () => {
    setPatientIdFilter("");
    setDaysFilter("");
    setDataSource([...originalDataSource]);
  };

  return (
    <>
      {!isPatientListDone ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitle}>Recertification Timeline</h4>
                <p className={classes.cardCategory}>
                  View scheduled recertification dates for all active patients
                </p>
              </CardHeader>
              <CardBody>
                {/* Filter Section */}
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  style={{ marginBottom: 20, paddingLeft: 12, paddingRight: 12 }}
                >
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      fullWidth
                      label="Search Patient ID"
                      variant="outlined"
                      size="small"
                      value={patientIdFilter}
                      onChange={(e) => setPatientIdFilter(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          applyFilters();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      fullWidth
                      label="Days Until Recert (Max)"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={daysFilter}
                      onChange={(e) => setDaysFilter(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          applyFilters();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={applyFilters}
                      style={{ marginRight: 8 }}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>

                {dataSource.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    {originalDataSource.length === 0
                      ? "No active patients found"
                      : "No patients match the current filters"}
                  </div>
                ) : (
                  <GridContainer>
                    {dataSource.map((patient, index) => (
                      <GridItem xs={12} sm={12} md={6} lg={4} key={index}>
                        <RecertificationTimelineCard data={patient} />
                      </GridItem>
                    ))}
                  </GridContainer>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecertificationTimelineFunction);

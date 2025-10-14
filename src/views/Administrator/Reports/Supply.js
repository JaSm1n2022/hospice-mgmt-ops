import { makeStyles } from "@material-ui/core";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { SupaContext } from "App";
import CustomSingleAutoComplete from "components/AutoComplete/CustomSingleAutoComplete";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetFetchDistributionState } from "store/actions/distributionAction";
import { attemptToFetchDistribution } from "store/actions/distributionAction";
import { resetFetchPatientState } from "store/actions/patientAction";
import { attemptToFetchPatient } from "store/actions/patientAction";
import { distributionListStateSelector } from "store/selectors/distributionSelector";
import { patientListStateSelector } from "store/selectors/patientSelector";
import { profileListStateSelector } from "store/selectors/profileSelector";

import { ACTION_STATUSES } from "utils/constants";
import { DEFAULT_ITEM } from "utils/constants";
import Helper from "utils/helper";
import ReportChart from "./Chart/ReportChart";

let numberOfMonth = 0;
let numberOfProcess = 1;
let data = [];
let patientList = [];

let grandTotal = 0.0;
let recipientTotal = 0.0;
const YTD_LIST = Helper.getDaysInMonth();
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "black",
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
    color: "black",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "black",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};
const useStyles = makeStyles(styles);
const Supply = (props) => {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [isProcessCollection, setIsProcessCollection] = useState(true);
  const [patient, setPatient] = useState(DEFAULT_ITEM);
  const [summary, setSummary] = useState([]);
  const [recipient, setRecipient] = useState([]);
  useEffect(() => {
    if (context.userProfile?.companyId) {
      data = [];
      numberOfProcess = 0;
      numberOfMonth = YTD_LIST.length;
      console.log("Year to call1", numberOfMonth, YTD_LIST[numberOfProcess]);
      props.listPatients({ companyId: context.userProfile?.companyId });
      props.listDistributions({
        from: YTD_LIST[numberOfProcess].from,
        to: YTD_LIST[numberOfProcess].to,
        companyId: context.userProfile?.companyId,
      });
    }
    //start with 2022
  }, []);
  useEffect(() => {
    if (
      !isProcessCollection &&
      props.distributions.status === ACTION_STATUSES.SUCCEED
    ) {
      const record = props.distributions?.data?.filter(
        (f) => f.category?.toLowerCase() === "medical/incontinence"
      );
      console.log("[Recrd", record);
      data.push({
        numberOfRecord: record.length,
        data: [...record],
        query: YTD_LIST[numberOfProcess],
      });
      numberOfProcess += 1;
      props.resetListDistributions();

      if (numberOfProcess < numberOfMonth) {
        setIsProcessCollection(true);
        console.log("Year to call2", YTD_LIST[numberOfProcess]);
        props.listDistributions({
          from: YTD_LIST[numberOfProcess].from,
          to: YTD_LIST[numberOfProcess].to,
          companyId: context.userProfile?.companyId,
        });
      } else {
        console.log("[Final Data]", data);
        grandTotal = 0.0;
        const recs = [];
        for (const d of data) {
          const amts = d.data.map((map) => map.estimated_total_amt);
          let patients = d.data.map((map) => map.patient_id);
          patients = Array.from(new Set(patients));
          let grand = 0.0;
          amts.forEach((a) => {
            grand += parseFloat(a || 0.0);
          });
          grandTotal += grand;
          recs.push({
            range: `${d.query.from} to ${d.query.to}`,
            cnt: d.data.length,
            patientCnt: patients.length,
            total: parseFloat(grand | 0.0).toFixed(2),
          });
        }
        setSummary(recs);
      }
    }
  }, [isProcessCollection]);

  const autoCompleteGeneralInputHander = (item) => {
    setPatient(item);
    viewPatientHandler(item.id);
  };
  const onChangeGeneralInputHandler = (e) => {
    if (!e.target.value) {
      setPatient(DEFAULT_ITEM);
    }
  };
  if (
    isProcessCollection &&
    props.distributions &&
    props.distributions.status === ACTION_STATUSES.SUCCEED
  ) {
    setIsProcessCollection(false);
  }

  if (props.patients && props.patients.status === ACTION_STATUSES.SUCCEED) {
    patientList = props.patients.data || [];
    patientList.forEach((p) => {
      p.label = p.patientCd;
      p.value = p.patientCd;
      p.category = "patient";
    });
  }

  const viewPatientHandler = (pId) => {
    console.log("[patient id]", patient);
    const id = pId || patient.id;
    const inds = [];
    recipientTotal = 0.0;
    data.forEach((d) => {
      let grand = 0;
      const rec = d.data.filter((f) => f.patient_id === id);
      for (const r of rec) {
        grand += parseFloat(r.estimated_total_amt || 0.0);
      }
      recipientTotal += grand;
      inds.push({
        range: `${d.query.from} to ${d.query.to}`,
        cnt: rec.length,
        total: parseFloat(grand | 0.0).toFixed(2),
      });
    });
    setRecipient(inds);
  };
  console.log("[report data]", data);
  console.log("[Inds]", recipient, patient);

  return (
    <React.Fragment>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left side: Select */}
        <div style={{ flex: "0 0 90%" }}>
          <h4>Patients/Staff Distribution Report</h4>
        </div>
        <div align="right" style={{ flex: "0 0 10%" }}>
          <h4>{`$${new Intl.NumberFormat("en-US", {}).format(
            parseFloat(grandTotal)
          )}`}</h4>
        </div>
      </div>
      <Grid justifyContent="space-between" container style={{ padding: 10 }}>
        <Typography variant="body1" color="textSecondary">
          *** This report includes medical and incontinence items provided to
          patients or staff. ***
        </Typography>
      </Grid>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date Range</TableCell>
            <TableCell>Number Of Records/Items</TableCell>
            <TableCell>Number Of Recipients (Patient/Staff)</TableCell>
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary && summary.length
            ? summary.map((m) => {
                return (
                  <TableRow key={m.range}>
                    <TableCell component="th" scope="row">
                      {m.range}
                    </TableCell>
                    <TableCell>{m.cnt}</TableCell>
                    <TableCell>{m.patientCnt}</TableCell>
                    <TableCell>{`$${m.total}`}</TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
      <div style={{ paddingTop: 10 }}>
        <Typography variant="h6">Graph Presentation</Typography>
        <ReportChart data={summary} />
      </div>
      <Grid container style={{ paddingTop: 20 }} spacing={2} direction="row">
        <Grid item xs={12}>
          <Typography variant="h6">{`View Recipient History (${patientList.length} records)`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="bold2" color="textSecondary">
            *** Recipients are patients/staff ***
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomSingleAutoComplete
            name="patient"
            value={patient || DEFAULT_ITEM}
            options={patientList || []}
            placeholder="Select Recipient"
            onSelectHandler={autoCompleteGeneralInputHander}
            onChangeHandler={onChangeGeneralInputHandler}
          />
        </Grid>

        <Grid item xs={2} style={{ display: "none" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => viewPatientHandler()}
          >
            View
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: patient && patient.id ? "" : "none" }}
        >
          <Typography variant="h6">
            {patient.patientCd ? patient.patientCd.toUpperCase() : ""}
          </Typography>
          <Typography variant="h6" style={{ color: "blue" }}>{`$${parseFloat(
            recipientTotal || 0.0
          ).toFixed(2)}`}</Typography>
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: patient && patient.id ? "" : "none" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date Range</TableCell>
                <TableCell>Number Of Records/Items</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipient && recipient.length
                ? recipient.map((m) => {
                    return (
                      <TableRow key={m.range}>
                        <TableCell component="th" scope="row">
                          {m.range}
                        </TableCell>
                        <TableCell>{m.cnt}</TableCell>
                        <TableCell>{`$${m.total}`}</TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
          <div style={{ paddingTop: 10 }}>
            <Typography variant="h6">Graph Presentation</Typography>
            <ReportChart data={recipient} />
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
const mapStateToProps = (store) => ({
  patients: patientListStateSelector(store),
  distributions: distributionListStateSelector(store),
  profileState: profileListStateSelector(store),
});
const mapDispatchToProps = (dispatch) => ({
  listDistributions: (data) => dispatch(attemptToFetchDistribution(data)),
  resetListDistributions: () => dispatch(resetFetchDistributionState()),
  listPatients: (data) => dispatch(attemptToFetchPatient(data)),
  resetListPatients: () => dispatch(resetFetchPatientState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Supply);

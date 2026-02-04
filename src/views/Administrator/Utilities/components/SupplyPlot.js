import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import CustomTextField from "components/TextField/CustomTextField";
import React, { useEffect, useState } from "react";

const SupplyPlot = (props) => {
  const [patientPlot, setPatientPlot] = useState([]);
  const [originalPatientPlot, setOriginalPatientPlot] = useState([]);
  const [originalSummary, setOriginalSummary] = useState([]);
  const [originalEstimatedAmt, setOriginalEstimatedAmt] = useState(0.0);
  const [summary, setSummary] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [estimatedGrandTotal, setEstimatedGrandTotal] = useState(0.0);
  useEffect(() => {
    const tempPlot = [];
    console.log(
      "[Supply]",
      props.patientPlot,
      props.summary,
      props.unusedSummary
    );
    [...(props.patientPlot || [])].forEach((p) => {
      tempPlot.push({ ...p });
    });
    const tempSummary = [];
    [...(props.summary || [])].forEach((p) => {
      tempSummary.push({ ...p });
    });

    setPatientPlot([...(props.patientPlot || [])]);
    setSummary([...(props.summary || [])]);
    setEstimatedGrandTotal(props.estimatedGrandTotal);
    setOriginalEstimatedAmt(props.estimatedGrandTotal);
    setOriginalPatientPlot(tempPlot);
    setOriginalSummary(tempSummary);
  }, [props]);

  const resetPlotHandler = () => {
    const tempPlot = [];
    [...originalPatientPlot].forEach((p) => {
      tempPlot.push({ ...p });
    });
    const tempSummary = [];
    [...originalSummary].forEach((p) => {
      tempSummary.push({ ...p });
    });
    setPatientPlot(tempPlot);
    setSummary(tempSummary);
    let estimate = 0.0;
    [...originalSummary].forEach((o) => {
      estimate = parseFloat(estimate) + parseFloat(o.amt);
    });
    setEstimatedGrandTotal(estimate);
    setIsRefresh(!isRefresh);
  };
  const inputSourceHandler = (e, source) => {
    console.log("[Source]", source, patientPlot);
    const tempPatientPlot = [...patientPlot];
    const currentItem = tempPatientPlot.find(
      (u) => u.uuid.toString() === source.uuid.toString()
    );

    const tempSummary = [...summary].find(
      (s) => s.productId === source.productId
    );
    const val = !e.target.value ? 0 : parseInt(e.target.value);
    const patientPlotByProduct = tempPatientPlot.filter(
      (t) => t.itemNbr !== source.itemNbr && t.productId === source.productId
    );

    const summaryOfOthers = [...summary].filter(
      (t) => t.productId !== source.productId
    );

    console.log("[source1]", patientPlotByProduct, summaryOfOthers);
    let newAmount = 0;
    summaryOfOthers.forEach((p) => {
      newAmount = parseFloat(newAmount) + parseFloat(p.amt);
    });

    let newTotalOrder = parseInt(val);
    if (patientPlotByProduct && patientPlotByProduct.length) {
      patientPlotByProduct.forEach((p) => {
        newTotalOrder = parseInt(newTotalOrder) + parseInt(p.newThreshold);
      });
    }
    console.log("[source2]", newTotalOrder);
    tempSummary.total = newTotalOrder;
    const forOrder = parseInt(newTotalOrder) - parseInt(tempSummary.stock);
    let cartonCnt = Math.ceil(forOrder / (tempSummary.cartonItemQty || 1));
    cartonCnt = forOrder <= 0 ? 0 : cartonCnt <= 0 ? 1 : cartonCnt;
    tempSummary.carton = cartonCnt;

    tempSummary.amt = parseInt(cartonCnt) * tempSummary.unitPrice;
    newAmount = parseFloat(tempSummary.amt) + parseFloat(newAmount);

    // const temp = [...summary];

    currentItem.newThreshold = e.target.value;
    console.log("[Source 1]", currentItem);
    setPatientPlot(tempPatientPlot);
    setEstimatedGrandTotal(newAmount);

    /*
    console.log("[source]", source, summary);
    const tempSummary = [...summary].find(
      (s) => s.productId === source.productId
    );
    const val = !e.target.value ? 0 : parseInt(e.target.value);
    const tempPatientPlot = [...patientPlot];
    const patientPlotByProduct = tempPatientPlot.filter(
      (t) => t.itemNbr !== source.itemNbr && t.productId === source.productId
    );
    const summaryOfOthers = [...summary].filter(
      (t) => t.productId !== source.productId
    );

    console.log("[source1]", patientPlotByProduct, summaryOfOthers);
    let newAmount = 0;
    summaryOfOthers.forEach((p) => {
      newAmount = parseFloat(newAmount) + parseFloat(p.amt);
    });

    let newTotalOrder = parseInt(val);
    if (patientPlotByProduct && patientPlotByProduct.length) {
      patientPlotByProduct.forEach((p) => {
        newTotalOrder = parseInt(newTotalOrder) + parseInt(p.newThreshold);
      });
    }
    console.log("[source2]", newTotalOrder);
    tempSummary.total = newTotalOrder;
    const forOrder = parseInt(newTotalOrder) - parseInt(tempSummary.stock);
    let cartonCnt = Math.ceil(forOrder / (tempSummary.cartonItemQty || 1));
    cartonCnt = forOrder <= 0 ? 0 : cartonCnt <= 0 ? 1 : cartonCnt;
    tempSummary.carton = cartonCnt;

    tempSummary.amt = parseInt(cartonCnt) * tempSummary.unitPrice;
    newAmount = parseFloat(tempSummary.amt) + parseFloat(newAmount);

    // const temp = [...summary];

    source[e.target.name] = val;
    setEstimatedGrandTotal(newAmount);
    setIsRefresh(!isRefresh);
    */
  };
  console.log("[originalPatientPlot]", originalPatientPlot);
  return (
    <React.Fragment>
      <Grid container direction="row">
        <Typography variant="h5">{`${props.title.toUpperCase()} PLOT`}</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Requestor</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Last Order</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>New Threshold</TableCell>
              <TableCell style={{ display: "none" }}>Current Stock</TableCell>
              <TableCell style={{ display: "none" }}>Balance</TableCell>
              <TableCell style={{ display: "none" }}>Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientPlot &&
              patientPlot.length &&
              patientPlot.map((map, indx) => {
                return (
                  <TableRow key={`patient${indx}`}>
                    <TableCell component="th" scope="row">
                      {map.patientName}
                    </TableCell>
                    <TableCell>{map.requestor}</TableCell>
                    <TableCell>{map.shortDescription || map.product}</TableCell>
                    <TableCell>{map.vendor}</TableCell>
                    <TableCell>{map.size}</TableCell>
                    <TableCell>{map.qty}</TableCell>
                    <TableCell>{map.threshold}</TableCell>
                    <TableCell>
                      <CustomTextField
                        source={map}
                        name={"newThreshold"}
                        type={"number"}
                        value={map.newThreshold}
                        onChange={inputSourceHandler}
                      />
                    </TableCell>
                    <TableCell style={{ display: "none" }}>
                      {map.currentStock}
                    </TableCell>
                    <TableCell style={{ display: "none" }}>
                      {map.balance}
                    </TableCell>
                    <TableCell style={{ display: "none" }}>
                      {map.order || 0}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        container
        justifyContent="space-between"
        style={{ paddingTop: 8, paddingRight: 8 }}
      >
        <Typography></Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => resetPlotHandler()}
        >
          Reset
        </Button>
      </Grid>
      <br />
      <Grid container direction="row">
        <Typography variant="h5">{`${props.title.toUpperCase()} SUMMARY`}</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Threshold Order</TableCell>
              <TableCell>In Stock</TableCell>
              <TableCell>To Order (qty)</TableCell>
              <TableCell>Carton Needed</TableCell>
              <TableCell>Estimated Amt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary &&
              summary.length &&
              summary.map((map, indx) => {
                return (
                  <TableRow key={`sumary${indx}`}>
                    <TableCell>{map.product}</TableCell>
                    <TableCell>{map.vendor}</TableCell>
                    <TableCell>{map.size}</TableCell>
                    <TableCell>{map.total}</TableCell>
                    <TableCell>{map.stock}</TableCell>
                    <TableCell>
                      {parseInt(map.total) - parseInt(map.stock)}
                    </TableCell>
                    <TableCell>{map.carton}</TableCell>
                    <TableCell>{`$${parseFloat(map.amt || 0.0).toFixed(
                      2
                    )}`}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Grid>
      <Typography variant="h5">
        Estimated Grand Amt (no tax/shipping) :{" "}
        {`$${parseFloat(estimatedGrandTotal || 0.0).toFixed(2)}`}
      </Typography>
      <br />
      <Grid container direction="row" style={{ paddingTop: 20 }}>
        <Typography variant="h5">{`UNUSED ${props.title.toUpperCase()} SIMILAR ITEMS`}</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Qty On Hand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.unusedSummary && props.unusedSummary.length
              ? props.unusedSummary.map((map) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {map.shortDescription || map.product}
                      </TableCell>
                      <TableCell>{map.vendor}</TableCell>
                      <TableCell>{map.size}</TableCell>
                      <TableCell>{map.qty}</TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </Grid>
    </React.Fragment>
  );
};
export default SupplyPlot;

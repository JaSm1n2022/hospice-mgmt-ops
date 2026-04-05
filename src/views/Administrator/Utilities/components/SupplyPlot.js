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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Print as PrintIcon } from "@material-ui/icons";
import CustomTextField from "components/TextField/CustomTextField";
import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// PDF Document Component
const SupplyPlotPDF = ({ title, patientPlot, summary, unusedSummary, estimatedGrandTotal, suppliesFrequency }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 10,
    },
    header: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#667eea",
      textAlign: "center",
    },
    subHeader: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 8,
      color: "#333",
      borderBottom: "2px solid #667eea",
      paddingBottom: 5,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 5,
      fontSize: 9,
    },
    infoLabel: {
      fontWeight: "bold",
      width: 120,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#667eea",
      color: "white",
      padding: 5,
      fontWeight: "bold",
      fontSize: 8,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #ddd",
      padding: 5,
      fontSize: 8,
    },
    tableRowAlt: {
      flexDirection: "row",
      borderBottom: "1px solid #ddd",
      padding: 5,
      fontSize: 8,
      backgroundColor: "#f9f9f9",
    },
    col1: { width: "15%" },
    col2: { width: "12%" },
    col3: { width: "15%" },
    col4: { width: "12%" },
    col5: { width: "12%" },
    col6: { width: "10%" },
    col7: { width: "12%" },
    col8: { width: "12%" },
    summaryCol1: { width: "25%" },
    summaryCol2: { width: "15%" },
    summaryCol3: { width: "10%" },
    summaryCol4: { width: "12%" },
    summaryCol5: { width: "10%" },
    summaryCol6: { width: "10%" },
    summaryCol7: { width: "10%" },
    summaryCol8: { width: "13%" },
    totalRow: {
      marginTop: 15,
      padding: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
    },
    totalText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#667eea",
    },
  });

  const frequencyMultiplier = suppliesFrequency === "1month" ? 2 : 1;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.header}>{title.toUpperCase()} PLOT REPORT</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Generated:</Text>
          <Text>{moment().format("MM/DD/YYYY hh:mm A")}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Supplies Frequency:</Text>
          <Text>{suppliesFrequency === "1month" ? "1 Month" : "2 Weeks"}</Text>
        </View>

        {/* Main Plot Table */}
        <Text style={styles.subHeader}>{title.toUpperCase()} PLOT</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Patient Name</Text>
          <Text style={styles.col2}>Requestor</Text>
          <Text style={styles.col3}>Product</Text>
          <Text style={styles.col4}>Vendor</Text>
          <Text style={styles.col5}>Size</Text>
          <Text style={styles.col6}>Last Order</Text>
          <Text style={styles.col7}>Threshold</Text>
          <Text style={styles.col8}>New Threshold</Text>
        </View>
        {patientPlot && patientPlot.map((item, index) => (
          <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt} wrap={false}>
            <Text style={styles.col1}>{item.patientName || ""}</Text>
            <Text style={styles.col2}>{item.requestor || ""}</Text>
            <Text style={styles.col3}>{item.shortDescription || item.product || ""}</Text>
            <Text style={styles.col4}>{item.vendor || ""}</Text>
            <Text style={styles.col5}>{item.size || ""}</Text>
            <Text style={styles.col6}>{item.qty || 0}</Text>
            <Text style={styles.col7}>{item.threshold || 0}</Text>
            <Text style={styles.col8}>{item.newThreshold || 0}</Text>
          </View>
        ))}

        {/* Summary Table */}
        <Text style={styles.subHeader}>{title.toUpperCase()} SUMMARY</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.summaryCol1}>Product</Text>
          <Text style={styles.summaryCol2}>Vendor</Text>
          <Text style={styles.summaryCol3}>Size</Text>
          <Text style={styles.summaryCol4}>Threshold Order</Text>
          <Text style={styles.summaryCol5}>In Stock</Text>
          <Text style={styles.summaryCol6}>To Order</Text>
          <Text style={styles.summaryCol7}>Carton</Text>
          <Text style={styles.summaryCol8}>Estimated Amt</Text>
        </View>
        {summary && summary.map((item, index) => {
          const adjustedThreshold = item.total * frequencyMultiplier;
          return (
            <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt} wrap={false}>
              <Text style={styles.summaryCol1}>{item.product || ""}</Text>
              <Text style={styles.summaryCol2}>{item.vendor || ""}</Text>
              <Text style={styles.summaryCol3}>{item.size || ""}</Text>
              <Text style={styles.summaryCol4}>
                {item.total}{suppliesFrequency === "1month" ? ` (x2=${adjustedThreshold})` : ""}
              </Text>
              <Text style={styles.summaryCol5}>{item.stock || 0}</Text>
              <Text style={styles.summaryCol6}>{parseInt(adjustedThreshold) - parseInt(item.stock || 0)}</Text>
              <Text style={styles.summaryCol7}>{item.carton || 0}</Text>
              <Text style={styles.summaryCol8}>${parseFloat(item.amt || 0).toFixed(2)}</Text>
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>
            Estimated Grand Total (no tax/shipping): ${parseFloat(estimatedGrandTotal || 0).toFixed(2)}
          </Text>
        </View>

        {/* Unused Similar Items */}
        {unusedSummary && unusedSummary.length > 0 && (
          <>
            <Text style={styles.subHeader}>UNUSED {title.toUpperCase()} SIMILAR ITEMS</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.summaryCol1, { width: "40%" }]}>Product</Text>
              <Text style={[styles.summaryCol2, { width: "25%" }]}>Vendor</Text>
              <Text style={[styles.summaryCol3, { width: "15%" }]}>Size</Text>
              <Text style={[styles.summaryCol4, { width: "20%" }]}>Qty On Hand</Text>
            </View>
            {unusedSummary.map((item, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt} wrap={false}>
                <Text style={[styles.summaryCol1, { width: "40%" }]}>{item.shortDescription || item.product || ""}</Text>
                <Text style={[styles.summaryCol2, { width: "25%" }]}>{item.vendor || ""}</Text>
                <Text style={[styles.summaryCol3, { width: "15%" }]}>{item.size || ""}</Text>
                <Text style={[styles.summaryCol4, { width: "20%" }]}>{item.qty || 0}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};

const SupplyPlot = (props) => {
  const [patientPlot, setPatientPlot] = useState([]);
  const [originalPatientPlot, setOriginalPatientPlot] = useState([]);
  const [originalSummary, setOriginalSummary] = useState([]);
  const [originalEstimatedAmt, setOriginalEstimatedAmt] = useState(0.0);
  const [summary, setSummary] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [estimatedGrandTotal, setEstimatedGrandTotal] = useState(0.0);
  const [suppliesFrequency, setSuppliesFrequency] = useState("2weeks");
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
    recalculateSummary(tempPlot, tempSummary);
  };

  const recalculateSummary = (plotData, summaryData) => {
    const frequencyMultiplier = suppliesFrequency === "1month" ? 2 : 1;
    let estimate = 0.0;

    summaryData.forEach((s) => {
      const adjustedTotal = s.total * frequencyMultiplier;
      const forOrder = parseInt(adjustedTotal) - parseInt(s.stock);
      let cartonCnt = Math.ceil(forOrder / (s.cartonItemQty || 1));
      cartonCnt = forOrder <= 0 ? 0 : cartonCnt <= 0 ? 1 : cartonCnt;
      s.carton = cartonCnt;
      s.amt = parseInt(cartonCnt) * s.unitPrice;
      estimate = parseFloat(estimate) + parseFloat(s.amt);
    });

    setEstimatedGrandTotal(estimate);
    setIsRefresh(!isRefresh);
  };

  const handleFrequencyChange = (event) => {
    const newFrequency = event.target.value;
    setSuppliesFrequency(newFrequency);

    // Recalculate summary with new frequency
    const tempSummary = [...summary];
    recalculateSummary(patientPlot, tempSummary);
    setSummary(tempSummary);
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

    // Apply frequency multiplier for carton calculation
    const frequencyMultiplier = suppliesFrequency === "1month" ? 2 : 1;
    const adjustedTotal = newTotalOrder * frequencyMultiplier;
    const forOrder = parseInt(adjustedTotal) - parseInt(tempSummary.stock);
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
      <Grid container direction="row" alignItems="center" spacing={2} style={{ marginBottom: 16 }}>
        <Grid item>
          <Typography variant="h5">{`${props.title.toUpperCase()} PLOT`}</Typography>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
            <InputLabel>Supplies Frequency</InputLabel>
            <Select
              value={suppliesFrequency}
              onChange={handleFrequencyChange}
              label="Supplies Frequency"
            >
              <MenuItem value="2weeks">2 Weeks</MenuItem>
              <MenuItem value="1month">1 Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container direction="row">
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
        <PDFDownloadLink
          document={
            <SupplyPlotPDF
              title={props.title}
              patientPlot={patientPlot}
              summary={summary}
              unusedSummary={props.unusedSummary}
              estimatedGrandTotal={estimatedGrandTotal}
              suppliesFrequency={suppliesFrequency}
            />
          }
          fileName={`${props.title.toUpperCase()}_Plot_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`}
          style={{ textDecoration: "none" }}
        >
          {({ loading }) => (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PrintIcon />}
              disabled={loading}
            >
              {loading ? "Generating PDF..." : "Print PDF"}
            </Button>
          )}
        </PDFDownloadLink>

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
                const frequencyMultiplier = suppliesFrequency === "1month" ? 2 : 1;
                const adjustedThreshold = map.total * frequencyMultiplier;
                return (
                  <TableRow key={`sumary${indx}`}>
                    <TableCell>{map.product}</TableCell>
                    <TableCell>{map.vendor}</TableCell>
                    <TableCell>{map.size}</TableCell>
                    <TableCell>
                      {map.total}
                      {suppliesFrequency === "1month" && ` (x2 = ${adjustedThreshold})`}
                    </TableCell>
                    <TableCell>{map.stock}</TableCell>
                    <TableCell>
                      {parseInt(adjustedThreshold) - parseInt(map.stock)}
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

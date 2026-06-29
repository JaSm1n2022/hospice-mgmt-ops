import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  makeStyles,
  Button,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    overflowX: "auto",
    marginTop: 20,
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    borderRight: "1px solid #ddd",
    minWidth: 60,
    textAlign: "center",
    padding: "8px 4px",
    fontSize: "0.75rem",
  },
  groupHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#667eea",
    color: "white",
    borderRight: "2px solid #333",
    textAlign: "center",
    padding: "8px 4px",
    fontSize: "0.85rem",
  },
  patientCell: {
    fontWeight: 500,
    backgroundColor: "#fafafa",
    borderRight: "2px solid #ddd",
    minWidth: 200,
    width: "15%",
    position: "sticky",
    left: 0,
    zIndex: 1,
  },
  checkCell: {
    textAlign: "center",
    borderRight: "1px solid #ddd",
    padding: "8px",
    minWidth: 50,
  },
  checkCellActive: {
    textAlign: "center",
    borderRight: "1px solid #ddd",
    padding: "8px",
    minWidth: 50,
    backgroundColor: "#4caf50",
  },
  checkBox: {
    width: "20px",
    height: "20px",
    backgroundColor: "#4caf50",
    margin: "0 auto",
    borderRadius: "3px",
  },
}));

const COLUMN_GROUPS = [
  {
    name: "Brief",
    columns: [
      { key: "briefSM", label: "SM" },
      { key: "briefMD", label: "MD" },
      { key: "briefLG", label: "LG" },
      { key: "briefXL", label: "XL" },
      { key: "brief2XL", label: "2XL" },
      { key: "brief3XL", label: "3XL" },
    ],
  },
  {
    name: "Underwear",
    columns: [
      { key: "underwearSM", label: "SM" },
      { key: "underwearMD", label: "MD" },
      { key: "underwearLG", label: "LG" },
      { key: "underwearXL", label: "XL" },
    ],
  },
  {
    name: "Gloves",
    columns: [
      { key: "glovesSM", label: "SM" },
      { key: "glovesMD", label: "MD" },
      { key: "glovesLG", label: "LG" },
      { key: "glovesXL", label: "XL" },
    ],
  },
  {
    name: "Wipe",
    columns: [
      { key: "wipe48", label: "48" },
      { key: "wipe96", label: "96" },
    ],
  },
  {
    name: "Ensure",
    columns: [
      { key: "ensureVanilla", label: "Vanilla" },
      { key: "ensureChocolate", label: "Dark Choc" },
    ],
  },
];

// PDF Document Component
const SupplyMatrixPDF = ({ matrixData, dateFrom, dateTo }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 7,
      orientation: "landscape",
    },
    header: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    dateInfo: {
      fontSize: 9,
      marginBottom: 10,
      textAlign: "center",
    },
    table: {
      display: "table",
      width: "auto",
      marginTop: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #ddd",
    },
    tableHeaderRow: {
      flexDirection: "row",
      backgroundColor: "#667eea",
      color: "white",
      fontWeight: "bold",
    },
    tableGroupHeaderRow: {
      flexDirection: "row",
      backgroundColor: "#8899f7",
      color: "white",
      fontWeight: "bold",
    },
    patientCell: {
      width: "15%",
      padding: 4,
      borderRight: "2px solid #333",
      fontSize: 7,
    },
    groupHeaderCell: {
      padding: 4,
      borderRight: "2px solid #333",
      textAlign: "center",
      fontSize: 8,
    },
    checkCell: {
      width: "4%",
      padding: 4,
      textAlign: "center",
      borderRight: "1px solid #ddd",
      fontSize: 9,
    },
    checkCellActive: {
      width: "4%",
      padding: 4,
      textAlign: "center",
      borderRight: "1px solid #ddd",
      fontSize: 9,
      backgroundColor: "#4caf50",
    },
    columnHeaderCell: {
      width: "4%",
      padding: 4,
      textAlign: "center",
      borderRight: "1px solid #ddd",
      fontSize: 6,
    },
  });

  const getGroupWidth = (group) => {
    return `${group.columns.length * 4}%`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.header}>PATIENT SUPPLY MATRIX</Text>
        <Text style={styles.dateInfo}>
          Date Range: {dateFrom} to {dateTo} | Generated: {moment().format("MM/DD/YYYY hh:mm A")}
        </Text>

        <View style={styles.table}>
          {/* Group Headers */}
          <View style={styles.tableGroupHeaderRow}>
            <Text style={[styles.patientCell, styles.groupHeaderCell]}>Patient</Text>
            {COLUMN_GROUPS.map((group) => (
              <Text
                key={group.name}
                style={[styles.groupHeaderCell, { width: getGroupWidth(group) }]}
              >
                {group.name}
              </Text>
            ))}
          </View>

          {/* Column Headers */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.patientCell}></Text>
            {COLUMN_GROUPS.map((group) =>
              group.columns.map((col) => (
                <Text key={col.key} style={styles.columnHeaderCell}>
                  {col.label}
                </Text>
              ))
            )}
          </View>

          {/* Data Rows */}
          {matrixData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.patientCell}>{row.patientName}</Text>
              {COLUMN_GROUPS.map((group) =>
                group.columns.map((col) => (
                  <Text key={col.key} style={row[col.key] ? styles.checkCellActive : styles.checkCell}>
                    {row[col.key] ? " " : ""}
                  </Text>
                ))
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

const SupplyMatrix = ({ patientList, distributionList, productList, dateFrom, dateTo }) => {
  const classes = useStyles();
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    if (patientList && distributionList && productList) {
      buildMatrix();
    }
  }, [patientList, distributionList, productList]);

  const buildMatrix = () => {
    const matrix = [];

    // Filter active patients only
    const activePatients = patientList.filter(
      (p) => !p.status || p.status.toLowerCase() !== "inactive" || p.patientCd.indexOf("C/O") !== -1
    );

    activePatients.forEach((patient) => {
      const patientDistributions = distributionList.filter(
        (dist) => dist.patient_id === patient.id
      );

      const row = {
        patientName: patient.patientCd,
        briefSM: false,
        briefMD: false,
        briefLG: false,
        briefXL: false,
        brief2XL: false,
        brief3XL: false,
        underwearSM: false,
        underwearMD: false,
        underwearLG: false,
        underwearXL: false,
        glovesSM: false,
        glovesMD: false,
        glovesLG: false,
        glovesXL: false,
        wipe48: false,
        wipe96: false,
        ensureVanilla: false,
        ensureChocolate: false,
      };

      patientDistributions.forEach((dist) => {
        const product = productList.find((p) => p.id === dist.productId);
        if (!product) return;

        const size = product.size ? product.size.toUpperCase() : "";
        const subCategory = dist.subCategory ? dist.subCategory.toLowerCase() : "";
        const category = dist.category ? dist.category.toLowerCase() : "";
        const description = dist.description ? dist.description.toLowerCase() : "";

        // Check Briefs
        if (subCategory === "adult diapers and briefs") {
          if (size.includes("3XL")) {
            row.brief3XL = true;
          } else if (size.includes("2XL")) {
            row.brief2XL = true;
          } else if (size.includes("XL")) {
            row.briefXL = true;
          } else if (size.includes("LG") || size.includes("LARGE")) {
            row.briefLG = true;
          } else if (size.includes("MD") || size.includes("MEDIUM")) {
            row.briefMD = true;
          } else if (size.includes("SM") || size.includes("SMALL")) {
            row.briefSM = true;
          }
        }

        // Check Underwear
        if (subCategory === "pull-up underwear") {
          if (size.includes("SM") || size.includes("SMALL")) {
            row.underwearSM = true;
          } else if (size.includes("MD") || size.includes("MEDIUM")) {
            row.underwearMD = true;
          } else if (size.includes("LG") || size.includes("LARGE")) {
            row.underwearLG = true;
          } else if (size.includes("XL")) {
            row.underwearXL = true;
          }
        }

        // Check Gloves
        if (subCategory === "gloves") {
          if (size.includes("SM") || size.includes("SMALL")) {
            row.glovesSM = true;
          } else if (size.includes("MD") || size.includes("MEDIUM")) {
            row.glovesMD = true;
          } else if (size.includes("LG") || size.includes("LARGE")) {
            row.glovesLG = true;
          } else if (size.includes("XL")) {
            row.glovesXL = true;
          }
        }

        // Check Wipes
        if (subCategory === "wipes") {
          const productDesc = product.description ? product.description.toLowerCase() : "";
          if (productDesc.includes("96 count") || productDesc.includes("96count")) {
            row.wipe96 = true;
          } else if (productDesc.includes("48 count") || productDesc.includes("48count")) {
            row.wipe48 = true;
          }
        }

        // Check Ensure
        if (subCategory === "nutritional supplements") {
          const productDesc = product.description ? product.description.toLowerCase() : "";
          if (productDesc.includes("ensure original vanilla")) {
            row.ensureVanilla = true;
          } else if (productDesc.includes("ensure nutritional shake dark chocolate")) {
            row.ensureChocolate = true;
          }
        }
      });

      matrix.push(row);
    });

    setMatrixData(matrix);
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 20, marginBottom: 10 }}>
        <Grid item>
          <Typography variant="h5">PATIENT SUPPLY MATRIX</Typography>
        </Grid>
        {matrixData.length > 0 && (
          <Grid item>
            <PDFDownloadLink
              document={
                <SupplyMatrixPDF
                  matrixData={matrixData}
                  dateFrom={dateFrom || "N/A"}
                  dateTo={dateTo || "N/A"}
                />
              }
              fileName={`Patient_Supply_Matrix_${moment().format("YYYY-MM-DD_HHmmss")}.pdf`}
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
          </Grid>
        )}
      </Grid>
      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
        Shows which product sizes each patient uses based on the selected date range.
      </Typography>
      <div className={classes.tableContainer}>
        <Table size="small">
          <TableHead>
            {/* Group Headers Row */}
            <TableRow>
              <TableCell className={classes.patientCell} rowSpan={2}>
                Patient
              </TableCell>
              {COLUMN_GROUPS.map((group) => (
                <TableCell
                  key={group.name}
                  className={classes.groupHeaderCell}
                  colSpan={group.columns.length}
                >
                  {group.name}
                </TableCell>
              ))}
            </TableRow>
            {/* Individual Column Headers Row */}
            <TableRow>
              {COLUMN_GROUPS.map((group) =>
                group.columns.map((col) => (
                  <TableCell key={col.key} className={classes.headerCell}>
                    {col.label}
                  </TableCell>
                ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {matrixData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className={classes.patientCell}>
                  {row.patientName}
                </TableCell>
                {COLUMN_GROUPS.map((group) =>
                  group.columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={row[col.key] ? classes.checkCellActive : classes.checkCell}
                    >
                      {row[col.key] && <div className={classes.checkBox}></div>}
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {matrixData.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: 20 }}>
          No patient data available for the selected date range.
        </Typography>
      )}
    </React.Fragment>
  );
};

export default SupplyMatrix;

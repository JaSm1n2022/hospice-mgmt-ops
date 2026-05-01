import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Card,
  CardHeader,
  CardBody,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SupaContext } from "App";
import { supabaseClient } from "config/SupabaseClient";
import moment from "moment";
import PrintIcon from "@material-ui/icons/Print";
import { pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import MonthlySalaryDocument from "../Document/MonthlySalaryDocument";

const useStyles = makeStyles((theme) => ({
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
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "20px",
  },
  totalRow: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  monthCell: {
    minWidth: "80px",
    textAlign: "right",
  },
  titleCell: {
    fontWeight: "500",
    minWidth: "150px",
  },
}));

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlySalary = () => {
  const classes = useStyles();
  const context = useContext(SupaContext);
  const [selectedYear, setSelectedYear] = useState(moment().year().toString());
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState(Array(12).fill(0));
  const [grandTotal, setGrandTotal] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeMonthlyTotals, setEmployeeMonthlyTotals] = useState(Array(12).fill(0));
  const [employeeGrandTotal, setEmployeeGrandTotal] = useState(0);
  const [printLoading, setPrintLoading] = useState(false);

  const fetchPayrollData = async () => {
    if (!context.userProfile?.companyId || !selectedYear) {
      return;
    }

    setLoading(true);
    try {
      // Fetch all payroll records for the selected year
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      const { data, error } = await supabaseClient
        .from("payrolls")
        .select("*")
        .gte("payDate", `${startDate} 00:00`)
        .lte("payDate", `${endDate} 23:59`)
        .eq("companyId", context.userProfile.companyId);

      if (error) {
        console.error("Error fetching payroll data:", error);
        setLoading(false);
        return;
      }

      // Group by employeeTitle and month
      const groupedByTitle = {};
      const monthTotals = Array(12).fill(0);
      let total = 0;

      // Group by employeeName and month
      const groupedByName = {};
      const empMonthTotals = Array(12).fill(0);
      let empTotal = 0;

      data.forEach((record) => {
        const title = record.employeeTitle || "Unspecified";
        const name = record.employeeName || "Unspecified";
        const monthIndex = moment(record.payDate).month(); // 0-11
        const amount = parseFloat(record.totalRate || 0);

        // Group by title
        if (!groupedByTitle[title]) {
          groupedByTitle[title] = {
            title,
            months: Array(12).fill(0),
            total: 0,
          };
        }
        groupedByTitle[title].months[monthIndex] += amount;
        groupedByTitle[title].total += amount;
        monthTotals[monthIndex] += amount;
        total += amount;

        // Group by name
        if (!groupedByName[name]) {
          groupedByName[name] = {
            name,
            months: Array(12).fill(0),
            total: 0,
          };
        }
        groupedByName[name].months[monthIndex] += amount;
        groupedByName[name].total += amount;
        empMonthTotals[monthIndex] += amount;
        empTotal += amount;
      });

      // Convert to array and sort by title
      const summaryArray = Object.values(groupedByTitle).sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      // Convert to array and sort by name
      const employeeArray = Object.values(groupedByName).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setSummaryData(summaryArray);
      setMonthlyTotals(monthTotals);
      setGrandTotal(total);
      setEmployeeData(employeeArray);
      setEmployeeMonthlyTotals(empMonthTotals);
      setEmployeeGrandTotal(empTotal);
    } catch (error) {
      console.error("Error processing payroll data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleGenerateReport = () => {
    fetchPayrollData();
  };

  const handlePrintPDF = async () => {
    setPrintLoading(true);
    try {
      const blob = await pdf(
        <MonthlySalaryDocument
          year={selectedYear}
          summaryData={summaryData}
          monthlyTotals={monthlyTotals}
          grandTotal={grandTotal}
          employeeData={employeeData}
          employeeMonthlyTotals={employeeMonthlyTotals}
          employeeGrandTotal={employeeGrandTotal}
          generatedDate={moment().format("MMMM DD, YYYY")}
        />
      ).toBlob();
      FileSaver.saveAs(blob, `Monthly_Salary_Report_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setPrintLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <React.Fragment>
      <div className={classes.filterContainer}>
        <Typography variant="h6">Monthly Salary Report</Typography>
        <TextField
          label="Year"
          type="number"
          value={selectedYear}
          onChange={handleYearChange}
          variant="outlined"
          size="small"
          inputProps={{ min: 2000, max: 2100 }}
          style={{ width: "120px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Report"}
        </Button>
        {summaryData.length > 0 && (
          <Button
            variant="contained"
            color="default"
            startIcon={<PrintIcon />}
            onClick={handlePrintPDF}
            disabled={printLoading}
          >
            {printLoading ? <CircularProgress size={24} /> : "Export PDF"}
          </Button>
        )}
      </div>

      <Grid container style={{ padding: 10 }}>
        <Typography variant="body2" color="textSecondary">
          Summary of total payroll by employee title, broken down by month for
          the selected year.
        </Typography>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && summaryData.length > 0 && (
        <div className={classes.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.titleCell}>
                  Employee Title
                </TableCell>
                {MONTHS.map((month) => (
                  <TableCell key={month} className={classes.monthCell}>
                    {month}
                  </TableCell>
                ))}
                <TableCell className={classes.monthCell}>
                  <strong>Total (YTD)</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row) => (
                <TableRow key={row.title}>
                  <TableCell className={classes.titleCell}>
                    {row.title}
                  </TableCell>
                  {row.months.map((amount, idx) => (
                    <TableCell key={idx} className={classes.monthCell}>
                      {amount > 0 ? formatCurrency(amount) : "-"}
                    </TableCell>
                  ))}
                  <TableCell className={classes.monthCell}>
                    <strong>{formatCurrency(row.total)}</strong>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className={classes.totalRow}>
                <TableCell className={classes.titleCell}>
                  <strong>Monthly Totals</strong>
                </TableCell>
                {monthlyTotals.map((amount, idx) => (
                  <TableCell key={idx} className={classes.monthCell}>
                    <strong>
                      {amount > 0 ? formatCurrency(amount) : "-"}
                    </strong>
                  </TableCell>
                ))}
                <TableCell className={classes.monthCell}>
                  <strong>{formatCurrency(grandTotal)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && employeeData.length > 0 && (
        <>
          <Grid container style={{ padding: 10, marginTop: 40 }}>
            <Typography variant="h6">
              By Employee Name
            </Typography>
          </Grid>
          <Grid container style={{ padding: 10 }}>
            <Typography variant="body2" color="textSecondary">
              Summary of total payroll by employee name, broken down by month for
              the selected year.
            </Typography>
          </Grid>
          <div className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.titleCell}>
                    Employee Name
                  </TableCell>
                  {MONTHS.map((month) => (
                    <TableCell key={month} className={classes.monthCell}>
                      {month}
                    </TableCell>
                  ))}
                  <TableCell className={classes.monthCell}>
                    <strong>Total (YTD)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className={classes.titleCell}>
                      {row.name}
                    </TableCell>
                    {row.months.map((amount, idx) => (
                      <TableCell key={idx} className={classes.monthCell}>
                        {amount > 0 ? formatCurrency(amount) : "-"}
                      </TableCell>
                    ))}
                    <TableCell className={classes.monthCell}>
                      <strong>{formatCurrency(row.total)}</strong>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={classes.totalRow}>
                  <TableCell className={classes.titleCell}>
                    <strong>Monthly Totals</strong>
                  </TableCell>
                  {employeeMonthlyTotals.map((amount, idx) => (
                    <TableCell key={idx} className={classes.monthCell}>
                      <strong>
                        {amount > 0 ? formatCurrency(amount) : "-"}
                      </strong>
                    </TableCell>
                  ))}
                  <TableCell className={classes.monthCell}>
                    <strong>{formatCurrency(employeeGrandTotal)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {!loading && summaryData.length === 0 && selectedYear && (
        <Box p={4}>
          <Typography variant="body1" color="textSecondary" align="center">
            No payroll data found for {selectedYear}. Please select a different
            year or generate the report.
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
};

export default MonthlySalary;

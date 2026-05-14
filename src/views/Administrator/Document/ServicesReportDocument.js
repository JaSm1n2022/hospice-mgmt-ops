import { makeStyles } from "@material-ui/core";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Canvas,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import HeaderModal from "components/Modal/HeaderModal";
import docStyles from "./document.module.css";
import logo from "assets/img/headerdoc.png";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    margin: "auto",
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    minWidth: 600,
    backgroundColor: "white",
    border: "2px solid #000",
    overflowX: "auto",
  },
}));

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    padding: 30,
  },
  spaceHeader: {
    marginTop: 4,
  },
  spaceHeaderMargin20: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableHeader: {
    backgroundColor: "#4a90e2",
    color: "white",
    fontWeight: "bold",
    borderBottom: "2px solid #000",
  },
  tableCell: {
    fontSize: 10,
    padding: 8,
    flex: 1,
    textAlign: "left",
  },
  tableCellCenter: {
    fontSize: 10,
    padding: 8,
    flex: 1,
    textAlign: "center",
  },
  tableCellRight: {
    fontSize: 10,
    padding: 8,
    flex: 1,
    textAlign: "right",
  },
  totalRow: {
    backgroundColor: "#e8f4f8",
    fontWeight: "bold",
    borderTop: "2px solid #000",
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: 250,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 11,
    marginBottom: 5,
  },
});

// Chart component using Canvas
const BarChart = ({ data, maxValue }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const barWidth = Math.min(80, chartWidth / data.length - 20);
  const colors = ["#4a90e2", "#50c878", "#ff6b6b", "#ffd93d", "#a78bfa", "#fb923c", "#ec4899", "#06b6d4"];

  return (
    <Canvas
      style={{ width: chartWidth, height: chartHeight }}
      paint={(painter, availableWidth, availableHeight) => {
        const actualWidth = availableWidth;
        const actualHeight = availableHeight;
        const padding = 40;
        const chartAreaHeight = actualHeight - padding * 2;
        const barSpacing = actualWidth / data.length;

        // Draw axes
        painter
          .moveTo(padding, padding)
          .lineTo(padding, actualHeight - padding)
          .lineTo(actualWidth - padding, actualHeight - padding)
          .stroke("#000");

        // Draw bars
        data.forEach((item, index) => {
          const barHeight = (item.total / maxValue) * chartAreaHeight;
          const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
          const y = actualHeight - padding - barHeight;

          // Draw bar
          painter
            .rect(x, y, barWidth, barHeight)
            .fill(colors[index % colors.length]);

          // Draw value on top of bar
          painter
            .fontSize(8)
            .fillColor("#000")
            .text(
              `$${new Intl.NumberFormat("en-US").format(item.total.toFixed(0))}`,
              x,
              y - 15,
              {
                width: barWidth,
                align: "center",
              }
            );

          // Draw label
          const label = item.serviceType.length > 12
            ? item.serviceType.substring(0, 12) + "..."
            : item.serviceType;
          painter
            .fontSize(7)
            .fillColor("#000")
            .text(label, x, actualHeight - padding + 5, {
              width: barWidth,
              align: "center",
            });
        });
      }}
    />
  );
};

// Create Document Component
export default function ServicesReportDocument(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [reportData, setReportData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [dateRange, setDateRange] = useState("");
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    if (props.reportData && props.reportData.length > 0) {
      // Sort by total descending
      const sorted = [...props.reportData].sort((a, b) => b.total - a.total);
      setReportData(sorted);

      // Calculate grand total
      const total = sorted.reduce((sum, item) => sum + item.total, 0);
      setGrandTotal(total);

      setDateRange(props.dateRange || "");
    }
  }, [props.reportData, props.dateRange]);

  const handleClose = () => {
    props.closePrintModalHandler();
  };

  const maxValue = reportData.length > 0
    ? Math.max(...reportData.map(item => item.total))
    : 0;

  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
        },
        content: {
          position: "absolute",
          top: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          right: "0",
          left: "0",
          overflow: "none",
          WebkitOverflowScrolling: "touch",
          border: "none",
          padding: "0px",
          background: "none",
        },
      }}
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
    >
      <div className={docStyles.form}>
        <HeaderModal title={"Services Report"} onClose={handleClose} />
        <div className={docStyles.content}>
          {reportData && reportData.length > 0 ? (
            <PDFViewer style={styles.viewer}>
              <Document>
                <Page size="A4" style={styles.page} orientation="portrait">
                  {/* Header with Logo */}
                  <View style={styles.spaceHeader} />
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      src={logo}
                      style={{ height: "60px", width: "540px" }}
                    />
                  </View>

                  {/* Title */}
                  <View style={styles.spaceHeaderMargin20}>
                    <Text style={styles.title}>Services Report</Text>
                  </View>
                  {dateRange && (
                    <View style={styles.spaceHeaderMargin20}>
                      <Text style={styles.subtitle}>
                        Period: {dateRange}
                      </Text>
                    </View>
                  )}

                  {/* Summary Box */}
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>
                      Total Services: {reportData.length}
                    </Text>
                    <Text style={styles.summaryText}>
                      Total Amount: ${new Intl.NumberFormat("en-US").format(grandTotal.toFixed(2))}
                    </Text>
                    <Text style={styles.summaryText}>
                      Average per Service: ${new Intl.NumberFormat("en-US").format((grandTotal / reportData.length).toFixed(2))}
                    </Text>
                  </View>

                  {/* Bar Chart */}
                  <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>
                      Pay Amount by Service Type
                    </Text>
                    <BarChart data={reportData} maxValue={maxValue} />
                  </View>

                  {/* Summary Table */}
                  <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>#</Text>
                      <Text style={[styles.tableCell, { flex: 2 }]}>
                        Service Type
                      </Text>
                      <Text style={[styles.tableCellCenter, { flex: 1 }]}>
                        Count
                      </Text>
                      <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                        Total Pay Amount
                      </Text>
                      <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                        Percentage
                      </Text>
                    </View>

                    {/* Table Rows */}
                    {reportData.map((item, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>
                          {index + 1}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                          {item.serviceType}
                        </Text>
                        <Text style={[styles.tableCellCenter, { flex: 1 }]}>
                          {item.count}
                        </Text>
                        <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                          ${new Intl.NumberFormat("en-US").format(item.total.toFixed(2))}
                        </Text>
                        <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                          {((item.total / grandTotal) * 100).toFixed(1)}%
                        </Text>
                      </View>
                    ))}

                    {/* Total Row */}
                    <View style={[styles.tableRow, styles.totalRow]}>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}></Text>
                      <Text style={[styles.tableCell, { flex: 2 }]}>
                        TOTAL
                      </Text>
                      <Text style={[styles.tableCellCenter, { flex: 1 }]}>
                        {reportData.reduce((sum, item) => sum + item.count, 0)}
                      </Text>
                      <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                        ${new Intl.NumberFormat("en-US").format(grandTotal.toFixed(2))}
                      </Text>
                      <Text style={[styles.tableCellRight, { flex: 1.5 }]}>
                        100.0%
                      </Text>
                    </View>
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          ) : (
            <div>
              <span>No Record</span>
            </div>
          )}
        </div>
      </div>
    </ReactModal>
  );
}

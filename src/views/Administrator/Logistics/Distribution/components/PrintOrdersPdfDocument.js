import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

// Embedded logo as base64

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  copyLabel: {
    fontSize: 8,
    textAlign: "right",
    marginTop: 10,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    backgroundColor: "#f0f0f0",
    minHeight: 30,
    alignItems: "center",
    fontWeight: "bold",
  },
  tableColNumber: {
    width: "8%",
    padding: 5,
    fontSize: 9,
  },
  tableColDescription: {
    width: "72%",
    padding: 5,
    fontSize: 9,
  },
  tableColUnits: {
    width: "20%",
    padding: 5,
    fontSize: 9,
  },
  // Admin columns
  tableColCategory: {
    width: "15%",
    padding: 5,
    fontSize: 9,
  },
  tableColDescriptionAdmin: {
    width: "35%",
    padding: 5,
    fontSize: 9,
  },
  tableColUnitsAdmin: {
    width: "15%",
    padding: 5,
    fontSize: 9,
  },
  tableColSize: {
    width: "15%",
    padding: 5,
    fontSize: 9,
  },
  tableColVendor: {
    width: "12%",
    padding: 5,
    fontSize: 9,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginBottom: 5,
    paddingTop: 30,
  },
  signatureLabel: {
    fontSize: 9,
  },
});

const LIMIT_ITEM_PRINT = 15;

const unitDistributionHandler = (qty, unit) => {
  if (unit && unit === "Pcs" && qty < 2) {
    return `${qty} Pc`;
  }
  return `${qty} ${unit}`;
};

const vendorHandler = (vendor) => {
  if (!vendor) return "";
  const v = vendor.toLowerCase();
  if (v === "amazon") return "AMZ";
  if (v === "medline") return "MDL";
  if (v === "mckesson") return "MKS";
  if (v === "walmart") return "WLM";
  return "OTH";
};

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const PrintOrdersPdfDocument = ({
  patientName,
  selectedData,
  productList,
  location,
  datePickup,
  logoBase64, // Base64 data URI for the logo
  employeeList, // Add employeeList to look up requestor position
}) => {
  // Process the selected data to extract details
  const processedDetails = selectedData.map((item) => {
    const prod = productList.find((p) => p.id === item.productId);
    return {
      search: prod || {},
      ...prod,
      orderQty: item.order_qty,
      comments: item.comments,
      productId: item.productId,
      unitDistribution:
        prod?.unit_distribution || prod?.unitDistribution || item.unit_uom,
      subCategory:
        item.subCategory ||
        item.sub_category ||
        prod?.subCategory ||
        prod?.sub_category ||
        "",
    };
  });

  // Get general info from first item
  const firstItem = selectedData[0] || {};
  const facility = location || firstItem.delivery_location || "";

  // Get requestor name and position
  let requestorName = "";
  let requestorPosition = "";

  // First, try to find employee by requestor_id
  if (firstItem.requestor_id && employeeList) {
    const employee = employeeList.find((e) => e.id === firstItem.requestor_id);

    if (employee) {
      requestorName = employee.name || firstItem.requestor || "";
      requestorPosition = employee.position || "";
    }
  }

  // If no employee found by ID, fallback to requestor field
  if (!requestorName) {
    if (typeof firstItem.requestor === "object" && firstItem.requestor !== null) {
      // requestor is an employee object
      requestorName = firstItem.requestor.name || "";
      requestorPosition = firstItem.requestor.position || "";
    } else if (typeof firstItem.requestor === "string") {
      // requestor is just a string name
      requestorName = firstItem.requestor;
      requestorPosition = firstItem.requestor_position || "";
    }
  }

  const datePrepared = moment().format("YYYY-MM-DD");
  const datePickupFormatted = datePickup || moment().format("YYYY-MM-DD");

  // Split items into chunks of 15
  const chunks = [];
  for (let i = 0; i < processedDetails.length; i += LIMIT_ITEM_PRINT) {
    chunks.push(processedDetails.slice(i, i + LIMIT_ITEM_PRINT));
  }

  // If no items, create at least one empty chunk
  if (chunks.length === 0) {
    chunks.push([]);
  }

  // Helper function to prepare table data for a chunk
  const prepareTableData = (chunk, startIndex = 0) => {
    const tableData = [];
    for (let i = 0; i < LIMIT_ITEM_PRINT; i++) {
      const detail = chunk[i];
      if (detail && detail.search) {
        tableData.push({
          cnt: startIndex + i + 1,
          category: truncateText(detail.subCategory || "", 12),
          description:
            detail.search.short_description ||
            detail.search.shortDescription ||
            "",
          units: unitDistributionHandler(
            detail.orderQty,
            detail.search.unit_distribution ||
              detail.search.unitDistribution ||
              detail.unitDistribution
          ),
          size: detail.search.size || "",
          vendor: vendorHandler(detail.search.vendor),
          comments: detail.comments || "",
        });
      } else {
        tableData.push({
          cnt: startIndex + i + 1,
          category: "",
          description: "",
          units: "",
          size: "",
          vendor: "",
          comments: "",
        });
      }
    }
    return tableData;
  };

  return (
    <Document>
      {chunks.map((chunk, chunkIndex) => {
        const startIndex = chunkIndex * LIMIT_ITEM_PRINT;
        const tableData = prepareTableData(chunk, startIndex);

        return (
          <React.Fragment key={`chunk-${chunkIndex}`}>
            {/* CNA Copy for this chunk */}
            <Page size="A4" style={styles.page}>
              <View
                style={{
                  marginBottom: 15,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  cache={false}
                  src={logoBase64}
                  style={{ width: 800, height: 80 }}
                />
              </View>

              <Text style={styles.header}>SUPPLIES DELIVERY RECORDS</Text>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <View style={{ width: "50%" }}>
                    <Text style={styles.infoLabel}>
                      Patient Name: {patientName}
                    </Text>
                  </View>
                  <View style={{ width: "50%", alignItems: "flex-end" }}>
                    <Text style={styles.infoLabel}>
                      Date Prepared: {datePrepared}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={{ width: "50%" }}>
                    <Text style={styles.infoValue}>
                      Facility/POS: {facility}
                    </Text>
                  </View>
                  <View style={{ width: "50%", alignItems: "flex-end" }}>
                    <Text style={styles.infoLabel}>
                      Date Pickup: {datePickupFormatted}
                    </Text>
                  </View>
                </View>
              </View>

              {/* CNA Table - Simple columns */}
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={styles.tableColNumber}>#</Text>
                  <Text style={styles.tableColDescription}>Description</Text>
                  <Text style={styles.tableColUnits}>Units</Text>
                </View>
                {tableData.map((row, index) => (
                  <View
                    key={`cna-row-${chunkIndex}-${index}`}
                    style={styles.tableRow}
                  >
                    <Text style={styles.tableColNumber}>{row.cnt}</Text>
                    <Text style={styles.tableColDescription}>
                      {row.description}
                    </Text>
                    <Text style={styles.tableColUnits}>{row.units}</Text>
                  </View>
                ))}
              </View>

              {/* Signature Section */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureLabel}>
                    {requestorName}
                    {requestorPosition ? ` (${requestorPosition})` : ""}
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Name and Title</Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>

                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>
                    Name of Patient/Caregiver
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>
              </View>

              <Text style={styles.copyLabel}>CNA Copy</Text>
            </Page>

            {/* Admin Copy for this chunk */}
            <Page size="A4" style={styles.page}>
              <View
                style={{
                  marginBottom: 15,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  cache={false}
                  src={logoBase64}
                  style={{ width: 800, height: 80 }}
                />
              </View>

              <Text style={styles.header}>SUPPLIES DELIVERY RECORDS</Text>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <View style={{ width: "50%" }}>
                    <Text style={styles.infoLabel}>
                      Patient Name: {patientName}
                    </Text>
                  </View>
                  <View style={{ width: "50%", alignItems: "flex-end" }}>
                    <Text style={styles.infoLabel}>
                      Date Prepared: {datePrepared}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={{ width: "50%" }}>
                    <Text style={styles.infoValue}>
                      Facility/POS: {facility}
                    </Text>
                  </View>
                  <View style={{ width: "50%", alignItems: "flex-end" }}>
                    <Text style={styles.infoLabel}>
                      Date Pickup: {datePickupFormatted}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Admin Table - Full detailed columns */}
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={styles.tableColNumber}>#</Text>
                  <Text style={styles.tableColCategory}>Sub Category</Text>
                  <Text style={styles.tableColDescriptionAdmin}>
                    Description
                  </Text>
                  <Text style={styles.tableColUnitsAdmin}>Units</Text>
                  <Text style={styles.tableColSize}>Size</Text>
                  <Text style={styles.tableColVendor}>Vendor</Text>
                </View>
                {tableData.map((row, index) => {
                  const descWithComments =
                    row.comments && row.description
                      ? `${row.description} (note: ${row.comments})`
                      : row.description;
                  return (
                    <View
                      key={`admin-row-${chunkIndex}-${index}`}
                      style={styles.tableRow}
                    >
                      <Text style={styles.tableColNumber}>{row.cnt}</Text>
                      <Text style={styles.tableColCategory}>
                        {row.category}
                      </Text>
                      <Text style={styles.tableColDescriptionAdmin}>
                        {descWithComments}
                      </Text>
                      <Text style={styles.tableColUnitsAdmin}>{row.units}</Text>
                      <Text style={styles.tableColSize}>{row.size}</Text>
                      <Text style={styles.tableColVendor}>{row.vendor}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Signature Section */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureLabel}>
                    {requestorName}
                    {requestorPosition ? ` (${requestorPosition})` : ""}
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Name and Title</Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>

                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>
                    Name of Patient/Caregiver
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>
              </View>

              <Text style={styles.copyLabel}>Admin Copy</Text>
            </Page>
          </React.Fragment>
        );
      })}
    </Document>
  );
};

export default PrintOrdersPdfDocument;

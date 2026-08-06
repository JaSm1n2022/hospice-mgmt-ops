import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
  },
  mainHeader: {
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
  },
  summarySection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    borderTop: "2px solid #4caf50",
    borderBottom: "2px solid #4caf50",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4caf50",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    flex: 1,
    color: "#333",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 11,
    flex: 1,
    fontWeight: "bold",
    color: "#000",
  },
  patientSection: {
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 15,
    borderTop: "1px solid #ccc",
  },
  patientHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottom: "2px solid #333",
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
    borderBottom: "1px solid #999",
    paddingBottom: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 10,
  },
  label: {
    fontSize: 10,
    flex: 1,
    color: "#333",
  },
  value: {
    fontSize: 10,
    flex: 1,
    fontWeight: "bold",
    color: "#000",
  },
  projectionRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 10,
    backgroundColor: "#f0f8ff",
  },
  projectionLabel: {
    fontSize: 10,
    flex: 1,
    color: "#0066cc",
    fontWeight: "bold",
  },
  projectionValue: {
    fontSize: 10,
    flex: 1,
    fontWeight: "bold",
    color: "#0066cc",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
  },
  warningText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
  positiveText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
});

const FiscalYearProjectionDocument = ({ patientsData, summary }) => {
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    const numValue = parseFloat(value);
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Sort patients by available cap (descending) - positive cap first, then negative
  const sortedPatientsData = [...(patientsData || [])].sort((a, b) => {
    const aAvailableCap = parseFloat(a.projectedTotalAvailableCap || 0);
    const bAvailableCap = parseFloat(b.projectedTotalAvailableCap || 0);
    return bAvailableCap - aAvailableCap; // Descending order
  });

  // Get death discharge patients for summary page
  const deathDischargePatients = (patientsData || []).filter((p) => p.isDeathDischarge);

  // Get patients with available cap (positive) - excluding death discharges as they have their own page
  const patientsWithAvailableCap = sortedPatientsData.filter((p) => {
    const availableCap = parseFloat(p.projectedTotalAvailableCap || 0);
    return availableCap > 0 && !p.isDeathDischarge;
  });

  // Get patients exceeding cap (negative)
  const patientsExceedingCap = sortedPatientsData.filter((p) => {
    const availableCap = parseFloat(p.projectedTotalAvailableCap || 0);
    return availableCap < 0;
  });

  // Get EOC patients (non-death) - ONLY those with NEGATIVE available cap (exceeding)
  const eocNonDeathPatients = (patientsData || []).filter((p) => {
    if (!p.eoc || p.eoc === "N/A") return false;
    if (p.eoc_discharge === "Death Discharge") return false;

    const totalAvailableCap = parseFloat(p.availableCapFirstPeriod || 0) +
                               parseFloat(p.availableCapSecondPeriod || 0);

    // ONLY include patients with NEGATIVE available cap
    return totalAvailableCap < 0;
  });

  const renderPatientsWithAvailableCapSummary = () => {
    if (!patientsWithAvailableCap || patientsWithAvailableCap.length === 0) {
      return null;
    }

    const totalAvailableCap = patientsWithAvailableCap.reduce(
      (sum, p) => sum + parseFloat(p.projectedTotalAvailableCap || 0),
      0
    );

    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Active Patients - Available Cap Summary</Text>
          <Text style={styles.generatedText}>
            Projected to Fiscal Year End: {summary?.fiscalYearEnd || "N/A"}
          </Text>
          <Text style={styles.generatedText}>
            Total Active Patients with Available Cap: {patientsWithAvailableCap.length}
          </Text>
          <Text style={styles.generatedText}>
            Total Projected Available Cap: {formatCurrency(totalAvailableCap)}
          </Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
            These active patients are projected to have available cap by the fiscal year end (09/30).
            This cap can be used for additional services or offset other patients' costs.
          </Text>
        </View>

        {/* Table Header */}
        <View style={{
          flexDirection: "row",
          borderBottom: "2px solid #333",
          paddingBottom: 8,
          marginBottom: 8,
          backgroundColor: "#f5f5f5",
          padding: 6
        }}>
          <Text style={{ flex: 1.2, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            Patient ID
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            SOC
          </Text>
          <Text style={{ flex: 0.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Current Days
          </Text>
          <Text style={{ flex: 0.8, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Proj. Days by 09/30
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Proj. Used Cap
          </Text>
          <Text style={{ flex: 1.1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Proj. Available Cap
          </Text>
        </View>

        {/* Table Rows */}
        {patientsWithAvailableCap.map((patient, index) => (
          <View
            key={patient.id || index}
            style={{
              flexDirection: "row",
              borderBottom: "1px solid #ddd",
              paddingVertical: 6,
              paddingHorizontal: 6,
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
            }}
          >
            <Text style={{ flex: 1.2, fontSize: 9, color: "#333" }}>
              {patient.patientCd || "N/A"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
              {patient.soc || "N/A"}
            </Text>
            <Text style={{ flex: 0.7, fontSize: 9, color: "#333", textAlign: "right" }}>
              {patient.totalDayCare || "0"}
            </Text>
            <Text style={{ flex: 0.8, fontSize: 9, color: "#333", textAlign: "right" }}>
              {patient.projectedTotalDays || "0"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#666", textAlign: "right" }}>
              {formatCurrency(patient.projectedTotalClaim)}
            </Text>
            <Text style={{ flex: 1.1, fontSize: 9, color: "#4caf50", fontWeight: "bold", textAlign: "right" }}>
              {formatCurrency(patient.projectedTotalAvailableCap)}
            </Text>
          </View>
        ))}

        {/* Summary Row */}
        <View style={{
          flexDirection: "row",
          borderTop: "2px solid #4caf50",
          paddingTop: 8,
          marginTop: 8,
          paddingHorizontal: 6,
          backgroundColor: "#f0f8ff"
        }}>
          <Text style={{ flex: 3.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right", paddingRight: 10 }}>
            TOTAL ({patientsWithAvailableCap.length} patients):
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#666", textAlign: "right", paddingRight: 10 }}>
            {formatCurrency(
              patientsWithAvailableCap.reduce((sum, p) => sum + parseFloat(p.projectedTotalClaim || 0), 0)
            )}
          </Text>
          <Text style={{ flex: 1.1, fontSize: 11, fontWeight: "bold", color: "#4caf50", textAlign: "right" }}>
            {formatCurrency(totalAvailableCap)}
          </Text>
        </View>

        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f8ff", borderLeft: "4px solid #4caf50" }}>
          <Text style={{ fontSize: 10, color: "#333", marginBottom: 4, fontWeight: "bold" }}>
            Positive Outlook:
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • These patients are staying within their allocated cap limits
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Available cap can support additional services if needed
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Helps offset costs from patients who may exceed their individual caps
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Active Patients with Available Cap - Projected to fiscal year end with positive cap balance.
          </Text>
        </View>
      </Page>
    );
  };

  const renderPatientsExceedingCapSummary = () => {
    if (!patientsExceedingCap || patientsExceedingCap.length === 0) {
      return null;
    }

    const totalExceedingAmount = patientsExceedingCap.reduce(
      (sum, p) => sum + parseFloat(p.projectedTotalAvailableCap || 0),
      0
    );

    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Patients Projected to Exceed Cap</Text>
          <Text style={styles.generatedText}>
            Projected to Fiscal Year End: {summary?.fiscalYearEnd || "N/A"}
          </Text>
          <Text style={styles.generatedText}>
            Total Patients Exceeding Cap: {patientsExceedingCap.length}
          </Text>
          <Text style={styles.generatedText}>
            Total Cap Deficit: {formatCurrency(totalExceedingAmount)}
          </Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 10, padding: 10, backgroundColor: "#fff3cd", borderLeft: "4px solid #ff6600" }}>
          <Text style={{ fontSize: 11, color: "#ff6600", marginBottom: 6, fontWeight: "bold" }}>
            ⚠ WARNING: These patients are projected to exceed their allocated cap
          </Text>
          <Text style={{ fontSize: 9, color: "#666" }}>
            Review these cases for potential interventions or plan adjustments before fiscal year end.
          </Text>
        </View>

        {/* Table Header */}
        <View style={{
          flexDirection: "row",
          borderBottom: "2px solid #333",
          paddingBottom: 8,
          marginBottom: 8,
          backgroundColor: "#f5f5f5",
          padding: 6
        }}>
          <Text style={{ flex: 1.2, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            Patient ID
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            SOC
          </Text>
          <Text style={{ flex: 0.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Current Days
          </Text>
          <Text style={{ flex: 0.8, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Proj. Days by 09/30
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Proj. Used Cap
          </Text>
          <Text style={{ flex: 1.1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Cap Deficit
          </Text>
        </View>

        {/* Table Rows */}
        {patientsExceedingCap.map((patient, index) => (
          <View
            key={patient.id || index}
            style={{
              flexDirection: "row",
              borderBottom: "1px solid #ddd",
              paddingVertical: 6,
              paddingHorizontal: 6,
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
            }}
          >
            <Text style={{ flex: 1.2, fontSize: 9, color: "#333" }}>
              {patient.patientCd || "N/A"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
              {patient.soc || "N/A"}
            </Text>
            <Text style={{ flex: 0.7, fontSize: 9, color: "#333", textAlign: "right" }}>
              {patient.totalDayCare || "0"}
            </Text>
            <Text style={{ flex: 0.8, fontSize: 9, color: "#333", textAlign: "right" }}>
              {patient.projectedTotalDays || "0"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#666", textAlign: "right" }}>
              {formatCurrency(patient.projectedTotalClaim)}
            </Text>
            <Text style={{ flex: 1.1, fontSize: 9, color: "#ff6600", fontWeight: "bold", textAlign: "right" }}>
              {formatCurrency(patient.projectedTotalAvailableCap)}
            </Text>
          </View>
        ))}

        {/* Summary Row */}
        <View style={{
          flexDirection: "row",
          borderTop: "2px solid #ff6600",
          paddingTop: 8,
          marginTop: 8,
          paddingHorizontal: 6,
          backgroundColor: "#fff3cd"
        }}>
          <Text style={{ flex: 3.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right", paddingRight: 10 }}>
            TOTAL ({patientsExceedingCap.length} patients):
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#666", textAlign: "right", paddingRight: 10 }}>
            {formatCurrency(
              patientsExceedingCap.reduce((sum, p) => sum + parseFloat(p.projectedTotalClaim || 0), 0)
            )}
          </Text>
          <Text style={{ flex: 1.1, fontSize: 11, fontWeight: "bold", color: "#ff6600", textAlign: "right" }}>
            {formatCurrency(totalExceedingAmount)}
          </Text>
        </View>

        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f5f5f5", borderLeft: "4px solid #ff6600" }}>
          <Text style={{ fontSize: 10, color: "#333", marginBottom: 4, fontWeight: "bold" }}>
            Recommended Actions:
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Review care plans for opportunities to optimize service delivery
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Consider discharge planning discussions where appropriate
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Monitor closely to prevent further cap overages
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Ensure aggregate cap pool has sufficient available cap to cover deficits
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Patients Exceeding Cap - Projected to exceed allocated cap by fiscal year end. Requires attention.
          </Text>
        </View>
      </Page>
    );
  };

  const renderEocNonDeathSummary = () => {
    if (!eocNonDeathPatients || eocNonDeathPatients.length === 0) {
      return null;
    }

    const totalAvailableCap = eocNonDeathPatients.reduce(
      (sum, p) =>
        sum +
        parseFloat(p.availableCapFirstPeriod || 0) +
        parseFloat(p.availableCapSecondPeriod || 0),
      0
    );

    const isCapAvailable = totalAvailableCap >= 0;

    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>EOC (Non-Death) Patients - Available Cap Summary</Text>
          <Text style={styles.generatedText}>
            Fiscal Year: {summary?.fiscalYearEnd || "N/A"}
          </Text>
          <Text style={styles.generatedText}>
            Total EOC (Non-Death) Patients: {eocNonDeathPatients.length}
          </Text>
          <Text style={styles.generatedText}>
            Total Available Cap: {formatCurrency(totalAvailableCap)}
          </Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
            These patients were discharged for reasons other than death (e.g., revocation, transfer, improvement).
            Their available cap (positive or negative) is included in the aggregate cap calculation.
          </Text>
        </View>

        {/* Table Header */}
        <View style={{
          flexDirection: "row",
          borderBottom: "2px solid #333",
          paddingBottom: 8,
          marginBottom: 8,
          backgroundColor: "#f5f5f5",
          padding: 6
        }}>
          <Text style={{ flex: 1.2, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            Patient ID
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            SOC
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            EOC
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            Discharge Type
          </Text>
          <Text style={{ flex: 0.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Days
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Used Cap
          </Text>
          <Text style={{ flex: 1.1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Available Cap
          </Text>
        </View>

        {/* Table Rows */}
        {eocNonDeathPatients.map((patient, index) => {
          const patientAvailableCap = parseFloat(patient.availableCapFirstPeriod || 0) +
                                       parseFloat(patient.availableCapSecondPeriod || 0);
          const isPositive = patientAvailableCap >= 0;

          return (
            <View
              key={patient.id || index}
              style={{
                flexDirection: "row",
                borderBottom: "1px solid #ddd",
                paddingVertical: 6,
                paddingHorizontal: 6,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
              }}
            >
              <Text style={{ flex: 1.2, fontSize: 9, color: "#333" }}>
                {patient.patientCd || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
                {patient.soc || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
                {patient.eoc || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 8, color: "#666" }}>
                {patient.eoc_discharge || "N/A"}
              </Text>
              <Text style={{ flex: 0.7, fontSize: 9, color: "#333", textAlign: "right" }}>
                {patient.totalDayCare || "0"}
              </Text>
              <Text style={{ flex: 1, fontSize: 9, color: "#666", textAlign: "right" }}>
                {formatCurrency(patient.totalClaim)}
              </Text>
              <Text style={{ flex: 1.1, fontSize: 9, color: isPositive ? "#4caf50" : "#ff6600", fontWeight: "bold", textAlign: "right" }}>
                {formatCurrency(patientAvailableCap)}
              </Text>
            </View>
          );
        })}

        {/* Summary Row */}
        <View style={{
          flexDirection: "row",
          borderTop: isCapAvailable ? "2px solid #4caf50" : "2px solid #ff6600",
          paddingTop: 8,
          marginTop: 8,
          paddingHorizontal: 6,
          backgroundColor: isCapAvailable ? "#f0f8ff" : "#fff3cd"
        }}>
          <Text style={{ flex: 4.9, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right", paddingRight: 10 }}>
            TOTAL ({eocNonDeathPatients.length} patients):
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#666", textAlign: "right", paddingRight: 10 }}>
            {formatCurrency(
              eocNonDeathPatients.reduce((sum, p) => sum + parseFloat(p.totalClaim || 0), 0)
            )}
          </Text>
          <Text style={{ flex: 1.1, fontSize: 11, fontWeight: "bold", color: isCapAvailable ? "#4caf50" : "#ff6600", textAlign: "right" }}>
            {formatCurrency(totalAvailableCap)}
          </Text>
        </View>

        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f5f5f5", borderLeft: "4px solid #666" }}>
          <Text style={{ fontSize: 10, color: "#333", marginBottom: 4, fontWeight: "bold" }}>
            About EOC (Non-Death) Patients:
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • These patients were discharged but not due to death
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Discharge reasons may include: revocation, transfer, improvement, or other
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • Their available cap (positive or negative) is part of the aggregate cap pool
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • {isCapAvailable
                ? "Positive total indicates net contribution to aggregate cap pool"
                : "Negative total indicates net deficit from aggregate cap pool"}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            EOC (Non-Death) Summary - Patients discharged for reasons other than death within the fiscal year.
          </Text>
        </View>
      </Page>
    );
  };

  const renderDeathDischargeSummary = () => {
    if (!deathDischargePatients || deathDischargePatients.length === 0) {
      return null;
    }

    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Death Discharge Patients - Available Cap Summary</Text>
          <Text style={styles.generatedText}>
            Fiscal Year: {summary?.fiscalYearEnd || "N/A"}
          </Text>
          <Text style={styles.generatedText}>
            Total Death Discharge Patients with Available Cap: {deathDischargePatients.length}
          </Text>
          <Text style={styles.generatedText}>
            Total Available Cap Ready to Use: {formatCurrency(summary?.deathDischargeAvailableCap || 0)}
          </Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
            These patients were discharged due to death within the fiscal year and have available cap
            that can be used by other patients in the aggregate cap pool.
          </Text>
        </View>

        {/* Table Header */}
        <View style={{
          flexDirection: "row",
          borderBottom: "2px solid #333",
          paddingBottom: 8,
          marginBottom: 8,
          backgroundColor: "#f5f5f5",
          padding: 6
        }}>
          <Text style={{ flex: 1.2, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            Patient ID
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            SOC
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333" }}>
            EOC (Death)
          </Text>
          <Text style={{ flex: 0.7, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Days
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Used Cap
          </Text>
          <Text style={{ flex: 1.1, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right" }}>
            Available Cap
          </Text>
        </View>

        {/* Table Rows */}
        {deathDischargePatients.map((patient, index) => (
          <View
            key={patient.id || index}
            style={{
              flexDirection: "row",
              borderBottom: "1px solid #ddd",
              paddingVertical: 6,
              paddingHorizontal: 6,
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
            }}
          >
            <Text style={{ flex: 1.2, fontSize: 9, color: "#333" }}>
              {patient.patientCd || "N/A"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
              {patient.soc || "N/A"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#333" }}>
              {patient.eoc || "N/A"}
            </Text>
            <Text style={{ flex: 0.7, fontSize: 9, color: "#333", textAlign: "right" }}>
              {patient.totalDayCare || "0"}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: "#666", textAlign: "right" }}>
              {formatCurrency(patient.totalClaim)}
            </Text>
            <Text style={{ flex: 1.1, fontSize: 9, color: "#4caf50", fontWeight: "bold", textAlign: "right" }}>
              {formatCurrency(patient.projectedTotalAvailableCap)}
            </Text>
          </View>
        ))}

        {/* Summary Row */}
        <View style={{
          flexDirection: "row",
          borderTop: "2px solid #4caf50",
          paddingTop: 8,
          marginTop: 8,
          paddingHorizontal: 6,
          backgroundColor: "#f0f8ff"
        }}>
          <Text style={{ flex: 3.9, fontSize: 10, fontWeight: "bold", color: "#333", textAlign: "right", paddingRight: 10 }}>
            TOTAL ({deathDischargePatients.length} patients):
          </Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", color: "#666", textAlign: "right", paddingRight: 10 }}>
            {formatCurrency(
              deathDischargePatients.reduce((sum, p) => sum + parseFloat(p.totalClaim || 0), 0)
            )}
          </Text>
          <Text style={{ flex: 1.1, fontSize: 11, fontWeight: "bold", color: "#4caf50", textAlign: "right" }}>
            {formatCurrency(summary?.deathDischargeAvailableCap || 0)}
          </Text>
        </View>

        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f5f5f5", borderLeft: "4px solid #4caf50" }}>
          <Text style={{ fontSize: 10, color: "#333", marginBottom: 4, fontWeight: "bold" }}>
            How to Use This Available Cap:
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • This available cap is part of the aggregate cap pool for the fiscal year
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • It can be used to offset costs for other active patients in the same fiscal year
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginBottom: 3 }}>
            • The total projected available cap includes this amount plus projected available cap from active patients
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Death Discharge Summary - Patients discharged due to death within FY with available cap ready to use.
          </Text>
        </View>
      </Page>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;

    const totalAvailableCap = parseFloat(summary.totalProjectedAvailableCap || 0);
    const isCapAvailable = totalAvailableCap >= 0;

    return (
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Fiscal Year Projection Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fiscal Year End Date:</Text>
          <Text style={styles.summaryValue}>{summary.fiscalYearEnd}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Active Patients (Projected to FY End):</Text>
          <Text style={styles.summaryValue}>{summary.totalActivePatients || 0}</Text>
        </View>
        {summary.totalEocNonDeathPatients > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>EOC (Non-Death) Patients:</Text>
            <Text style={styles.summaryValue}>{summary.totalEocNonDeathPatients}</Text>
          </View>
        )}
        {summary.totalDeathDischargePatients > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Death Discharge w/ Available Cap:</Text>
            <Text style={styles.summaryValue}>{summary.totalDeathDischargePatients}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Patients Included:</Text>
          <Text style={styles.summaryValue}>{summary.totalPatients || summary.totalActivePatients || 0}</Text>
        </View>

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #999" }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Used Cap by {summary.fiscalYearEnd}:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedUsedCap || summary.totalProjectedUsedCap)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Allowed Cap:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedAllowedCap || summary.totalProjectedAllowedCap)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active - Projected Available Cap:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.activeProjectedAvailableCap || (parseFloat(summary.totalProjectedAllowedCap || 0) - parseFloat(summary.totalProjectedUsedCap || 0)).toFixed(2))}
            </Text>
          </View>
          {summary.totalEocNonDeathPatients > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>EOC (Non-Death) - Available Cap:</Text>
              <Text style={[styles.summaryValue, parseFloat(summary.eocNonDeathAvailableCap || 0) >= 0 ? styles.positiveText : styles.warningText]}>
                {formatCurrency(summary.eocNonDeathAvailableCap || 0)}
              </Text>
            </View>
          )}
          {summary.totalDeathDischargePatients > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Death Discharge - Available Cap Ready to Use:</Text>
              <Text style={[styles.summaryValue, styles.positiveText]}>
                {formatCurrency(summary.deathDischargeAvailableCap)}
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "2px solid #4caf50" }}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { fontWeight: "bold", fontSize: 12 }]}>
              TOTAL Projected Available Cap (FY {summary.fiscalYearEnd}):
            </Text>
            <Text style={[styles.summaryValue, { fontSize: 12 }, isCapAvailable ? styles.positiveText : styles.warningText]}>
              {formatCurrency(summary.totalProjectedAvailableCap)}
            </Text>
          </View>
        </View>

        {!isCapAvailable && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.warningText}>
              WARNING: Projected to exceed cap by fiscal year end!
            </Text>
          </View>
        )}

        <View style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #ccc" }}>
          <Text style={{ fontSize: 9, color: "#666", fontStyle: "italic" }}>
            Note: Patients below are sorted by projected available cap (highest to lowest).
          </Text>
        </View>
      </View>
    );
  };

  const renderPatient = (patient, index, allPatients) => {
    const isCapAvailable = parseFloat(patient.projectedTotalAvailableCap || 0) >= 0;
    const isDeathDischarge = patient.isDeathDischarge || false;

    // Check if this is the first patient with negative cap (transition point)
    const prevPatient = index > 0 ? allPatients[index - 1] : null;
    const prevCapAvailable = prevPatient ? parseFloat(prevPatient.projectedTotalAvailableCap || 0) >= 0 : true;
    const isTransitionToNegative = !isCapAvailable && prevCapAvailable;

    return (
      <React.Fragment key={patient.id || index}>
        {isTransitionToNegative && (
          <View style={{
            marginTop: 20,
            marginBottom: 10,
            padding: 10,
            backgroundColor: "#fff3cd",
            borderLeft: "4px solid #ff6600"
          }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#ff6600" }}>
              ⚠ PATIENTS PROJECTED TO EXCEED CAP BELOW
            </Text>
          </View>
        )}
        <View style={styles.patientSection} break={isTransitionToNegative ? false : (index > 0)}>
          <Text style={styles.patientHeader}>
            Patient: {patient.patientCd || "N/A"} {isDeathDischarge && "(Death Discharge - Available Cap)"}
          </Text>

        {/* Current Status */}
        <Text style={styles.sectionTitle}>Current Status (as of today)</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Client #:</Text>
          <Text style={styles.value}>{patient.patientCd || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>SOC (Start of Care):</Text>
          <Text style={styles.value}>{patient.soc || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Insurance:</Text>
          <Text style={styles.value}>{patient.insurance || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Accumulated Days:</Text>
          <Text style={styles.value}>{patient.totalDayCare || "0"} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Used Cap:</Text>
          <Text style={styles.value}>{formatCurrency(patient.totalClaim)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Available Cap:</Text>
          <Text style={styles.value}>
            {formatCurrency(
              parseFloat(patient.availableCapFirstPeriod || 0) +
                parseFloat(patient.availableCapSecondPeriod || 0)
            )}
          </Text>
        </View>

        {/* Fiscal Year Projection */}
        <Text style={styles.sectionTitle}>
          {isDeathDischarge
            ? `Available Cap (Already Discharged - ${patient.eoc})`
            : `Projection to Fiscal Year End (${patient.fiscalYearEnd})`}
        </Text>
        {!isDeathDischarge && (
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Remaining Days to FY End:</Text>
            <Text style={styles.projectionValue}>
              {patient.remainingDaysToFYEnd || "0"} days
            </Text>
          </View>
        )}
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Projected Total Days by FY End:</Text>
          <Text style={styles.projectionValue}>
            {patient.projectedTotalDays || "0"} days
          </Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Projected Total Claim by FY End:</Text>
          <Text style={styles.projectionValue}>
            {formatCurrency(patient.projectedTotalClaim)}
          </Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Projected Additional Claim:</Text>
          <Text style={styles.projectionValue}>
            {formatCurrency(patient.projectedAdditionalClaim)}
          </Text>
        </View>

        {/* First FY Projection */}
        {patient.projectedFirstPeriodDays > 0 && (
          <>
            <Text style={styles.sectionTitle}>First Fiscal Year Projection</Text>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected First FY Days:</Text>
              <Text style={styles.projectionValue}>
                {patient.projectedFirstPeriodDays || "0"} days
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Used Cap First FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedUsedCapFirstPeriod)}
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Allowed Cap First FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedAllowedCapFirstPeriod)}
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Available Cap First FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedAvailableCapFirstPeriod)}
              </Text>
            </View>
          </>
        )}

        {/* Second FY Projection */}
        {patient.projectedSecondPeriodDays > 0 && (
          <>
            <Text style={styles.sectionTitle}>Second Fiscal Year Projection</Text>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Second FY Days:</Text>
              <Text style={styles.projectionValue}>
                {patient.projectedSecondPeriodDays || "0"} days
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Used Cap Second FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedUsedCapSecondPeriod)}
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Allowed Cap Second FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedAllowedCapSecondPeriod)}
              </Text>
            </View>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>Projected Available Cap Second FY:</Text>
              <Text style={styles.projectionValue}>
                {formatCurrency(patient.projectedAvailableCapSecondPeriod)}
              </Text>
            </View>
          </>
        )}

        {/* Total Projection Summary */}
        <Text style={styles.sectionTitle}>Overall Projection Summary</Text>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Total Projected Available Cap by FY End:</Text>
          <Text style={[styles.projectionValue, isCapAvailable ? styles.positiveText : styles.warningText]}>
            {formatCurrency(patient.projectedTotalAvailableCap)}
          </Text>
        </View>
        {!isCapAvailable && (
          <View style={styles.row}>
            <Text style={styles.warningText}>
              WARNING: This patient is projected to exceed cap!
            </Text>
          </View>
        )}
        </View>
      </React.Fragment>
    );
  };

  return (
    <Document>
      {/* Page 1 - Main Summary Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Medicare Cap - Fiscal Year Projection</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
          <Text style={styles.generatedText}>
            Total Patients Analyzed: {patientsData?.length || 0}
            {summary && summary.totalActivePatients > 0 && ` (${summary.totalActivePatients} Active`}
            {summary && summary.totalDeathDischargePatients > 0 && `, ${summary.totalDeathDischargePatients} Death Discharge)`}
            {summary && summary.totalActivePatients > 0 && summary.totalDeathDischargePatients === 0 && `)` }
          </Text>
        </View>

        {renderSummary()}

        <View style={styles.footer}>
          <Text>
            Medicare Cap Fiscal Year Projection - Summary overview and detailed breakdowns follow.
          </Text>
        </View>
      </Page>

      {/* Summary Tables - Right After Page 1 */}
      {renderPatientsWithAvailableCapSummary()}
      {renderPatientsExceedingCapSummary()}
      {renderEocNonDeathSummary()}
      {renderDeathDischargeSummary()}

      {/* Individual Patient Details - Starts on New Page */}
      {sortedPatientsData && sortedPatientsData.length > 0 && (
        <>
          <Page size="A4" style={styles.page}>
            <View style={styles.mainHeader}>
              <Text style={styles.mainTitle}>Individual Patient Details</Text>
              <Text style={styles.generatedText}>
                Total Patients: {sortedPatientsData.length}
              </Text>
              <Text style={styles.generatedText}>
                Sorted by Projected Available Cap (Highest to Lowest)
              </Text>
            </View>

            <View style={{ marginTop: 15, marginBottom: 10, padding: 10, backgroundColor: "#f5f5f5", borderLeft: "4px solid #666" }}>
              <Text style={{ fontSize: 10, color: "#333" }}>
                This section provides detailed projections for each patient. Patients are sorted from highest
                to lowest available cap to easily identify strong performers vs. those at risk.
              </Text>
            </View>

            {sortedPatientsData.map((patient, index) => renderPatient(patient, index, sortedPatientsData))}

            <View style={styles.footer}>
              <Text>
                Individual Patient Details - Complete breakdown for each patient sorted by available cap.
              </Text>
            </View>
          </Page>
        </>
      )}
    </Document>
  );
};

export default FiscalYearProjectionDocument;

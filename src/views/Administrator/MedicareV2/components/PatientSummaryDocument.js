import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// Create styles - NO background colors as requested
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
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 5,
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
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
    textAlign: "right",
  },
  positiveValue: {
    color: "#43a047",
  },
  negativeValue: {
    color: "#e53935",
  },
  infoBox: {
    border: "1px solid #999",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 3,
    fontSize: 9,
    color: "#666",
  },
  warningBox: {
    border: "1px solid #ef5350",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 3,
    fontSize: 9,
    color: "#c62828",
  },
  successBox: {
    border: "1px solid #43a047",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 3,
    fontSize: 9,
    color: "#2e7d32",
  },
  benefitChip: {
    fontSize: 9,
    padding: "3px 8px",
    border: "1px solid #2196F3",
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
    display: "inline-block",
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    paddingLeft: 10,
  },
  divider: {
    borderBottom: "1px solid #ddd",
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 9,
    color: "#666",
  },
});

const PatientSummaryDocument = ({ patientData }) => {
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date || date === "N/A") return "N/A";
    return date;
  };

  const isActive = !patientData.eoc || patientData.eoc === "N/A";
  const statusText = isActive ? "Active" : "Inactive";

  // Determine fiscal year
  const getFiscalYear = () => {
    if (!patientData.soc) return null;
    const socDate = new Date(`${patientData.soc} 17:00`);
    const fy2024Start = new Date("2023-10-01 17:00");
    const fy2024End = new Date("2024-09-30 17:00");
    const fy2025Start = new Date("2024-10-01 17:00");
    const fy2025End = new Date("2025-09-30 17:00");
    const fy2026Start = new Date("2025-10-01 17:00");
    const fy2026End = new Date("2026-09-30 17:00");

    if (socDate >= fy2024Start && socDate <= fy2024End) return "FY2024";
    else if (socDate >= fy2025Start && socDate <= fy2025End) return "FY2025";
    else if (socDate >= fy2026Start && socDate <= fy2026End) return "FY2026";
    return null;
  };

  const fiscalYear = getFiscalYear();

  const getBenefitLabels = () => {
    const admittedBenefit = patientData.benefitCount || 1;
    return {
      first: `Benefit Period ${admittedBenefit}`,
      second: `Benefit Period ${admittedBenefit + 1}`,
      third: `Benefit Period ${admittedBenefit + 2}`,
      fourth: `Benefit Period ${admittedBenefit + 3}`,
    };
  };

  const benefitLabels = getBenefitLabels();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Medicare Cap - Patient Summary</Text>
          <Text style={styles.patientName}>
            {patientData.clientName || "N/A"} (Patient # {patientData.patientCd || "N/A"})
          </Text>
          <Text style={styles.generatedText}>
            Status: {statusText} | Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        {/* Care Period */}
        <Text style={styles.sectionTitle}>Care Period</Text>
        <View style={styles.row}>
          <Text style={styles.label}>SOC (Start of Care):</Text>
          <Text style={styles.value}>{formatDate(patientData.soc)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>EOC (End of Care):</Text>
          <Text style={styles.value}>{formatDate(patientData.eoc)}</Text>
        </View>
        {patientData.eoc && (
          <View style={styles.row}>
            <Text style={styles.label}>Discharge Reason:</Text>
            <Text style={styles.value}>{patientData.eoc_discharge}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Insurance:</Text>
          <Text style={styles.value}>{patientData.insurance || "N/A"}</Text>
        </View>

        {patientData.hasPriorHospice && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Prior Hospice:</Text>
              <Text style={styles.value}>Yes</Text>
            </View>
            {patientData.priorDayCare > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Prior Total Day Care:</Text>
                <Text style={styles.value}>{patientData.priorDayCare} days</Text>
              </View>
            )}
          </>
        )}

        <View style={styles.divider} />

        {/* Benefits Admitted */}
        <Text style={styles.sectionTitle}>
          Benefits Admitted (Benefit Period {patientData.benefitCount || 0})
        </Text>
        <View style={styles.benefitsContainer}>
          {patientData.first90Benefit && (
            <Text style={styles.benefitChip}>
              {benefitLabels.first}: {patientData.first90Benefit} days
            </Text>
          )}
          {patientData.second90Benefit && (
            <Text style={styles.benefitChip}>
              {benefitLabels.second}: {patientData.second90Benefit} days
            </Text>
          )}
          {patientData.third60Benefit && (
            <Text style={styles.benefitChip}>
              {benefitLabels.third}: {patientData.third60Benefit} days
            </Text>
          )}
          {patientData.fourth60Benefit && (
            <Text style={styles.benefitChip}>
              {benefitLabels.fourth}: {patientData.fourth60Benefit} days
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Fiscal Year Cap */}
        {fiscalYear && (
          <>
            <Text style={styles.sectionTitle}>
              Fiscal Year Cap (Admitted in{" "}
              {fiscalYear === "FY2024" ? "FY 2024" : fiscalYear === "FY2025" ? "FY 2025" : "FY 2026"})
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>
                {fiscalYear === "FY2024" ? "FY 2024 Cap:" : fiscalYear === "FY2025" ? "FY 2025 Cap:" : "FY 2026 Cap:"}
              </Text>
              <Text style={styles.value}>{formatCurrency(patientData.firstPeriodCap)}</Text>
            </View>
            {patientData.secondPeriodDays > 0 && patientData.secondPeriodCap && (
              <View style={styles.row}>
                <Text style={styles.label}>
                  {fiscalYear === "FY2024"
                    ? "FY 2025 Cap (Continued):"
                    : fiscalYear === "FY2025"
                    ? "FY 2026 Cap (Continued):"
                    : "FY 2027 Cap (Continued):"}
                </Text>
                <Text style={styles.value}>{formatCurrency(patientData.secondPeriodCap)}</Text>
              </View>
            )}
            {patientData.hasPriorHospice && patientData.priorDayCare > 0 && (
              <View style={styles.infoBox}>
                <Text>
                  ℹ️ FY cap apportioned including prior hospice days ({patientData.priorDayCare} days)
                </Text>
              </View>
            )}

            <View style={styles.divider} />
          </>
        )}

        {/* Previous Hospice Agency */}
        {patientData.hasPriorHospice && patientData.priorDayCare > 0 && (
          <>
            <Text style={styles.sectionTitle}>Previous Hospice Agency</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Prior Days:</Text>
              <Text style={styles.value}>{patientData.priorDayCare} days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Allowed Cap (Apportioned):</Text>
              <Text style={styles.value}>{formatCurrency(patientData.priorHospiceAllowedCap)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Used Cap:</Text>
              <Text style={styles.value}>{formatCurrency(patientData.priorHospiceUsedCap)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Available Cap:</Text>
              <Text
                style={[
                  styles.value,
                  parseFloat(patientData.priorHospiceAvailableCap || 0) >= 0
                    ? styles.positiveValue
                    : styles.negativeValue,
                ]}
              >
                {formatCurrency(patientData.priorHospiceAvailableCap)}
              </Text>
            </View>
            {parseFloat(patientData.priorHospiceAvailableCap || 0) > 0 ? (
              <View style={styles.successBox}>
                <Text>✓ Available cap included in total (transfer patient)</Text>
              </View>
            ) : (
              <View style={styles.infoBox}>
                <Text>ℹ️ No available cap to transfer (negative cap set to zero)</Text>
              </View>
            )}

            <View style={styles.divider} />
          </>
        )}

        {/* Utilization Summary */}
        <Text style={styles.sectionTitle}>Utilization Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total # of Day Care:</Text>
          <Text style={styles.value}>{patientData.totalDayCare || 0} days</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Claim:</Text>
          <Text style={styles.value}>{formatCurrency(patientData.totalClaim)}</Text>
        </View>

        <View style={styles.divider} />

        {/* First FY Period Breakdown */}
        {fiscalYear && (
          <>
            <Text style={styles.sectionTitle}>
              {fiscalYear === "FY2024"
                ? "FY 2024 Breakdown"
                : fiscalYear === "FY2025"
                ? "FY 2025 Breakdown"
                : "FY 2026 Breakdown"}
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Accumulated Days:</Text>
              <Text style={styles.value}>{patientData.firstPeriodDays || 0} days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Used Cap:</Text>
              <Text style={styles.value}>{formatCurrency(patientData.usedCapFirstPeriod)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Allowed Cap (Apportioned):</Text>
              <Text style={styles.value}>{formatCurrency(patientData.allowedCapFirstPeriod)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Available Cap:</Text>
              <Text
                style={[
                  styles.value,
                  parseFloat(patientData.availableCapFirstPeriod || 0) >= 0
                    ? styles.positiveValue
                    : styles.negativeValue,
                ]}
              >
                {formatCurrency(patientData.availableCapFirstPeriod)}
              </Text>
            </View>
          </>
        )}

        {/* Second FY Period Breakdown */}
        {fiscalYear && patientData.secondPeriodDays > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>
              {fiscalYear === "FY2024"
                ? "FY 2025 Breakdown (Continued)"
                : fiscalYear === "FY2025"
                ? "FY 2026 Breakdown (Continued)"
                : "FY 2027 Breakdown (Continued)"}
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Accumulated Days:</Text>
              <Text style={styles.value}>{patientData.secondPeriodDays || 0} days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Used Cap:</Text>
              <Text style={styles.value}>{formatCurrency(patientData.usedCapSecondPeriod)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Allowed Cap (Apportioned):</Text>
              <Text style={styles.value}>{formatCurrency(patientData.allowedCapSecondPeriod)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Available Cap:</Text>
              <Text
                style={[
                  styles.value,
                  parseFloat(patientData.availableCapSecondPeriod || 0) >= 0
                    ? styles.positiveValue
                    : styles.negativeValue,
                ]}
              >
                {formatCurrency(patientData.availableCapSecondPeriod)}
              </Text>
            </View>
          </>
        )}

        {/* POST-DISCHARGE */}
        {patientData.postDischargeDays > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>POST-DISCHARGE (EOC)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Post-Discharge Days:</Text>
              <Text style={styles.value}>{patientData.postDischargeDays} days</Text>
            </View>
            {patientData.new_hospice_dod && (
              <View style={styles.row}>
                <Text style={styles.label}>Date of Death:</Text>
                <Text style={styles.value}>{moment(patientData.new_hospice_dod).format("MM/DD/YYYY")}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Allowed Cap (Apportioned):</Text>
              <Text style={styles.value}>{formatCurrency(patientData.postDischargeAllowedCap)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Used Cap:</Text>
              <Text style={styles.value}>{formatCurrency(patientData.postDischargeUsedCap)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Available Cap:</Text>
              <Text
                style={[
                  styles.value,
                  parseFloat(patientData.postDischargeAvailableCap || 0) >= 0
                    ? styles.positiveValue
                    : styles.negativeValue,
                ]}
              >
                {formatCurrency(patientData.postDischargeAvailableCap)}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text>ℹ️ Not included in total used cap, revenue, or available cap</Text>
            </View>
          </>
        )}

        {/* Warning for non-death discharge */}
        {patientData.eoc &&
          !patientData.postDischargeDays &&
          patientData.eoc_discharge &&
          patientData.eoc_discharge !== "Death Discharge" &&
          !patientData.eoc_discharge.toLowerCase().includes("death") && (
            <View style={styles.warningBox}>
              <Text>
                ⚠️ Patient discharged (non-death). Please review the Post-Discharge (EOC) number of care days.
                Verify eligibility and update the patient's post-discharge total days in the patient profile.
              </Text>
            </View>
          )}

        {/* Apportionment complete statement */}
        {(() => {
          if (patientData.new_hospice_dod) {
            return (
              <View style={styles.successBox}>
                <Text>
                  ✓ The patient passed away on {moment(patientData.new_hospice_dod).format("MM/DD/YYYY")}, so
                  apportionment is now complete.
                </Text>
              </View>
            );
          }

          if (
            patientData.eoc &&
            patientData.eoc_discharge &&
            (patientData.eoc_discharge === "Death Discharge" ||
              patientData.eoc_discharge.toLowerCase().includes("death"))
          ) {
            return (
              <View style={styles.successBox}>
                <Text>
                  ✓ The patient passed away on {moment(patientData.eoc).format("MM/DD/YYYY")}, so apportionment is
                  now complete.
                </Text>
              </View>
            );
          }

          return null;
        })()}

        <View style={styles.footer}>
          <Text>Medicare Cap - Patient Summary Report</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PatientSummaryDocument;

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
  generatedText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#e91e63",
    borderBottom: "2px solid #e91e63",
    paddingBottom: 5,
  },
  summaryBox: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  summaryText: {
    fontSize: 10,
    marginBottom: 5,
    color: "#333",
  },
  table: {
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #333",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  columnHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
  },
  columnCell: {
    fontSize: 9,
    color: "#333",
  },
  col1: { width: "25%" },
  col2: { width: "20%" },
  col3: { width: "20%" },
  col4: { width: "35%" },
  emptyText: {
    fontSize: 9,
    color: "#999",
    fontStyle: "italic",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
});

const isDeathDischarge = (patient) => {
  const reason = patient.eoc_discharge;
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return reason === "Death Discharge" || lower.includes("death");
};

const computeADC = (inScope, yearStart, yearEnd) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);

  if (periodEnd.isBefore(yearStart, "day")) {
    return { adc: 0, isYTD: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(yearStart, "days") + 1;
  let totalPatientDays = 0;

  inScope.forEach((patient) => {
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;
    const effStart = moment.max(soc, yearStart);
    const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

    if (effEnd.isSameOrAfter(effStart, "day")) {
      totalPatientDays += effEnd.diff(effStart, "days") + 1;
    }
  });

  const adc = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  const isYTD = periodEnd.isBefore(yearEnd, "day");

  return { adc, isYTD, periodEnd };
};

const ADCDocument = ({ patientsData, logoBase64, selectedYear }) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");

  const inScope = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(yearEnd)) return false;
    if (eoc && eoc.isBefore(yearStart)) return false;

    return true;
  });

  const activePatients = inScope.filter((p) => !p.eoc);
  const deathDischargePatients = inScope.filter((p) => p.eoc && isDeathDischarge(p));
  const liveDischargePatients = inScope.filter((p) => p.eoc && !isDeathDischarge(p));
  const { adc, isYTD, periodEnd } = computeADC(inScope, yearStart, yearEnd);
  const coverageLabel = `${yearStart.format("MMMM YYYY")} - ${periodEnd.format("MMMM YYYY")}`;

  const renderTable = (title, patients) => (
    <>
      <Text style={styles.sectionTitle}>{title} ({patients.length})</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, styles.col1]}>Client</Text>
          <Text style={[styles.columnHeader, styles.col2]}>SOC</Text>
          <Text style={[styles.columnHeader, styles.col3]}>EOC</Text>
          <Text style={[styles.columnHeader, styles.col4]}>Discharge Reason</Text>
        </View>
        {patients.length === 0 ? (
          <Text style={styles.emptyText}>No clients in this category for {year}.</Text>
        ) : (
          patients.map((patient, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              wrap={false}
            >
              <Text style={[styles.columnCell, styles.col1]}>
                {patient.patientCd ? patient.patientCd.split(".")[0] : "N/A"}
              </Text>
              <Text style={[styles.columnCell, styles.col2]}>
                {patient.soc ? moment(patient.soc).format("MM/DD/YYYY") : "N/A"}
              </Text>
              <Text style={[styles.columnCell, styles.col3]}>
                {patient.eoc ? moment(patient.eoc).format("MM/DD/YYYY") : "Active"}
              </Text>
              <Text style={[styles.columnCell, styles.col4]}>
                {patient.eoc_discharge || (patient.eoc ? "N/A" : "—")}
              </Text>
            </View>
          ))
        )}
      </View>
    </>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoBase64 && (
            <Image cache={false} src={logoBase64} style={styles.logo} />
          )}
          <Text style={styles.mainTitle}>ADC Report</Text>
          <Text style={styles.subTitle}>Fiscal Year: {year}</Text>
          <Text style={styles.generatedText}>
            Generated: {moment().format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Coverage: {coverageLabel}</Text>
          <Text style={styles.summaryText}>
            {isYTD ? "Year-to-Date ADC" : "Average Daily Census (ADC)"}: {Math.round(adc)}
          </Text>
          <Text style={styles.summaryText}>Total Clients On Service ({year}): {inScope.length}</Text>
          <Text style={styles.summaryText}>Active Patients: {activePatients.length}</Text>
          <Text style={styles.summaryText}>Death Discharge: {deathDischargePatients.length}</Text>
          <Text style={styles.summaryText}>Live Discharge: {liveDischargePatients.length}</Text>
        </View>

        {renderTable("Active Patients (SOC, no EOC)", activePatients)}
        {renderTable("Death Discharge", deathDischargePatients)}
        {renderTable("Live Discharge (Revocation / Non-Death)", liveDischargePatients)}

        <View style={styles.footer}>
          <Text>
            ADC Report — Includes clients on service at any point during {year} (SOC on or before 12/31/{year}, and no EOC or EOC on or after 01/01/{year}).
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ADCDocument;

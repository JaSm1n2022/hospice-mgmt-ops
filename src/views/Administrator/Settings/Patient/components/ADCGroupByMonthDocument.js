import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 24,
  },
  header: {
    marginHorizontal: -24,
    marginTop: -24,
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: 80,
    marginBottom: 10,
    objectFit: "cover",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
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
  coverageText: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  table: {
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4caf50",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
  },
  tableRowHighlight: {
    flexDirection: "row",
    backgroundColor: "#c8e6c9",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
  },
  columnHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  categoryHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    paddingLeft: 5,
  },
  columnCell: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
  },
  categoryCell: {
    fontSize: 9,
    color: "#333",
    textAlign: "left",
    paddingLeft: 5,
    fontWeight: "bold",
  },
  totalCell: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  colCategory: { width: "13%" },
  colMonth: { width: "6.69%" },
  colTotal: { width: "6.75%" },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
});

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const matchesReason = (reason, keywords) => {
  if (!reason) return false;
  const lower = reason.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

const buildMonthlyCounts = (patientsData, year) => {
  const soc = new Array(12).fill(0);
  const deathDischarge = new Array(12).fill(0);
  const revocation = new Array(12).fill(0);
  const liveDischarge = new Array(12).fill(0);
  const transfer = new Array(12).fill(0);

  (patientsData || []).forEach((patient) => {
    if (patient.soc) {
      const socDate = moment(patient.soc);
      if (socDate.year() === year) {
        soc[socDate.month()]++;
      }
    }

    if (patient.eoc) {
      const eocDate = moment(patient.eoc);
      if (eocDate.year() === year) {
        const reason = patient.eoc_discharge;
        const monthIdx = eocDate.month();

        if (matchesReason(reason, ["death"])) {
          deathDischarge[monthIdx]++;
        } else if (matchesReason(reason, ["revocation"])) {
          revocation[monthIdx]++;
        } else if (matchesReason(reason, ["transfer"])) {
          transfer[monthIdx]++;
        } else if (
          matchesReason(reason, [
            "extended prognosis",
            "travel outside of service area",
            "discharge for cause",
          ])
        ) {
          liveDischarge[monthIdx]++;
        }
      }
    }
  });

  return { soc, deathDischarge, revocation, liveDischarge, transfer };
};

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const computeADC = (patientsData, yearStart, yearEnd) => {
  const today = moment().endOf("day");
  const periodEnd = moment.min(yearEnd, today);

  if (periodEnd.isBefore(yearStart, "day")) {
    return { adc: 0, isYTD: false, periodEnd };
  }

  const daysInPeriod = periodEnd.diff(yearStart, "days") + 1;
  let totalPatientDays = 0;

  (patientsData || []).forEach((patient) => {
    if (!patient.soc) return;
    const soc = moment(patient.soc);
    const eoc = patient.eoc ? moment(patient.eoc) : null;

    if (soc.isAfter(yearEnd)) return;
    if (eoc && eoc.isBefore(yearStart)) return;

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

const computeMonthlyADC = (patientsData, year) => {
  const today = moment().endOf("day");
  const adcByMonth = new Array(12).fill(0);

  for (let m = 0; m < 12; m++) {
    const monthStart = moment([year, m, 1]).startOf("day");
    const monthEnd = moment(monthStart).endOf("month");
    const periodEnd = moment.min(monthEnd, today);

    if (periodEnd.isBefore(monthStart, "day")) {
      adcByMonth[m] = 0;
      continue;
    }

    const daysInPeriod = periodEnd.diff(monthStart, "days") + 1;
    let totalPatientDays = 0;

    (patientsData || []).forEach((patient) => {
      if (!patient.soc) return;
      const soc = moment(patient.soc);
      const eoc = patient.eoc ? moment(patient.eoc) : null;

      if (soc.isAfter(monthEnd)) return;
      if (eoc && eoc.isBefore(monthStart)) return;

      const effStart = moment.max(soc, monthStart);
      const effEnd = eoc ? moment.min(eoc, periodEnd) : periodEnd;

      if (effEnd.isSameOrAfter(effStart, "day")) {
        totalPatientDays += effEnd.diff(effStart, "days") + 1;
      }
    });

    adcByMonth[m] = daysInPeriod > 0 ? totalPatientDays / daysInPeriod : 0;
  }

  return adcByMonth;
};

const ADCGroupByMonthDocument = ({ patientsData, logoBase64, selectedYear }) => {
  const year = parseInt(selectedYear, 10);
  const yearStart = moment(`${year}-01-01`).startOf("day");
  const yearEnd = moment(`${year}-12-31`).endOf("day");
  const { soc, deathDischarge, revocation, liveDischarge, transfer } = buildMonthlyCounts(
    patientsData,
    year
  );
  const { adc, isYTD, periodEnd } = computeADC(patientsData, yearStart, yearEnd);
  const adcByMonth = computeMonthlyADC(patientsData, year);
  const coverageLabel = `${yearStart.format("MMMM YYYY")} - ${periodEnd.format("MMMM YYYY")}`;

  const rows = [
    { label: "Admission", values: soc },
    { label: "Death Discharge", values: deathDischarge },
    { label: "Revocation", values: revocation },
    { label: "Live Discharge", values: liveDischarge },
    { label: "Transfer", values: transfer },
    { label: "ADC", values: adcByMonth, isDecimal: true, total: adc },
  ];

  const activePatients = (patientsData || []).filter((patient) => {
    if (!patient.soc) return false;
    const socDate = moment(patient.soc);
    return socDate.year() === year && !patient.eoc;
  }).length;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          {logoBase64 && (
            <Image cache={false} src={logoBase64} style={styles.logo} />
          )}
          <Text style={styles.mainTitle}>Census Group By Month</Text>
          <Text style={styles.subTitle}>Year: {year}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.coverageText}>Coverage: {coverageLabel}</Text>
          <Text style={styles.summaryText}>
            {isYTD ? "Year-to-Date ADC" : "Average Daily Census (ADC)"}: {Math.round(adc)}
          </Text>
          <Text style={styles.summaryText}>Total Admission: {sumArray(soc)}</Text>
          <Text style={styles.summaryText}>Total Death Discharge: {sumArray(deathDischarge)}</Text>
          <Text style={styles.summaryText}>Total Revocation: {sumArray(revocation)}</Text>
          <Text style={styles.summaryText}>Total Live Discharge: {sumArray(liveDischarge)}</Text>
          <Text style={styles.summaryText}>Total Transfer: {sumArray(transfer)}</Text>
          <Text style={styles.summaryText}>Active Patients: {activePatients}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.categoryHeader, styles.colCategory]}>Category</Text>
            {MONTHS.map((m) => (
              <Text key={m} style={[styles.columnHeader, styles.colMonth]}>
                {m}
              </Text>
            ))}
            <Text style={[styles.columnHeader, styles.colTotal]}>Total</Text>
          </View>

          {rows.map((row, index) => (
            <View
              key={row.label}
              style={
                row.label === "ADC"
                  ? styles.tableRowHighlight
                  : index % 2 === 0
                  ? styles.tableRow
                  : styles.tableRowAlt
              }
            >
              <Text style={[styles.categoryCell, styles.colCategory]}>
                {row.label}
              </Text>
              {row.values.map((val, idx) => (
                <Text key={idx} style={[styles.columnCell, styles.colMonth]}>
                  {row.isDecimal ? Math.round(val) : val}
                </Text>
              ))}
              <Text style={[styles.totalCell, styles.colTotal]}>
                {row.isDecimal
                  ? Math.round(row.total !== undefined ? row.total : sumArray(row.values))
                  : sumArray(row.values)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>
            Census Group By Month — Admission: clients admitted that month (regardless of EOC). Death Discharge: EOC discharge reason contains "death". Revocation: EOC discharge reason contains "revocation". Live Discharge: Extended Prognosis, Travel outside of service area, or Discharge for cause. Transfer: EOC discharge reason contains "transfer" (e.g. Transfer another hospice). ADC: Average Daily Census for that month.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ADCGroupByMonthDocument;

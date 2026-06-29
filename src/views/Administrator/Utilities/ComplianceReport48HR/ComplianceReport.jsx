import React, { useState, useCallback, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { PieChart, Pie, Cell } from "recharts";
import { Upload, FileSpreadsheet, AlertCircle, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Paper, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// ---------------------------------------------------------------- CONFIG
const EXCLUDED_VISIT_TYPES = new Set([
  "PHYSICIANS ORDER",
  "CERTIFICATION MD",
  "IDG",
  "CERTIFICATION REF",
  "COMMUNICATION LOG",
]);
const COMPLIANCE_LIMIT_DAYS = 2; // within 48 hrs = 2 calendar days or fewer
const REPORT_PERIOD = "June 1 – June 29, 2026";

const NAVY = "#1F3864";
const GREEN = "#548235";
const RED = "#C00000";

// Material-UI styles
const useStyles = makeStyles((theme) => ({
  dropZone: {
    display: "block",
    width: "100%",
    border: "3px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#f8fafc",
    minHeight: "200px",
    "&:hover": {
      borderColor: NAVY,
      backgroundColor: "#f1f5f9",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(31, 56, 100, 0.1)",
    },
  },
  dropZoneActive: {
    borderColor: GREEN,
    backgroundColor: "#f0fdf4",
    transform: "scale(1.02)",
    boxShadow: "0 8px 24px rgba(84, 130, 53, 0.2)",
  },
  pdfButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    backgroundColor: NAVY,
    color: "white",
    padding: "10px 24px",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#2E4A7C",
    },
  },
  pdfContent: {
    backgroundColor: "white",
    padding: "20px 30px",
    borderRadius: "8px",
    maxWidth: "100%",
    width: "100%",
  },
  statCard: {
    padding: theme.spacing(3),
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    },
  },
  table: {
    "& thead": {
      backgroundColor: "#D9E2F3",
    },
    "& tbody tr:nth-child(even)": {
      backgroundColor: "#f8fafc",
    },
    "& tbody tr:hover": {
      backgroundColor: "#e0e7ff",
    },
  },
}));

// ---------------------------------------------------------------- HELPERS
// Source dates look like "06/29/26 - Mon" — keep the date part, parse MM/DD/YY.
function parseLogDate(value) {
  if (value == null) return null;
  const text = String(value).split(" - ")[0].trim();
  const m = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let [, mm, dd, yy] = m;
  let year = parseInt(yy, 10);
  if (year < 100) year += 2000;
  return new Date(year, parseInt(mm, 10) - 1, parseInt(dd, 10));
}

function cleanAuthor(name) {
  return String(name).replace(/\s+,/, ",").trim();
}

function compColor(cp) {
  return cp >= 80 ? GREEN : cp >= 50 ? NAVY : RED;
}

// ---------------------------------------------------------------- ANALYSIS
function analyze(rows) {
  const records = [];
  for (const row of rows) {
    const visitType = String(row["VISIT TYPE"] ?? "").trim();
    if (EXCLUDED_VISIT_TYPES.has(visitType)) continue;
    const vd = parseLogDate(row["VISIT DATE"]);
    const ad = parseLogDate(row["ACTION DATE"]);
    if (!vd || !ad) continue;
    const lag = Math.round((ad - vd) / 86400000);
    records.push({
      author: cleanAuthor(row["AUTHOR OF NOTE"]),
      nonCompliant: lag > COMPLIANCE_LIMIT_DAYS,
    });
  }

  const total = records.length;
  const nc = records.filter((r) => r.nonCompliant).length;

  const map = new Map();
  for (const r of records) {
    const a = map.get(r.author) || { author: r.author, total: 0, nonCompliant: 0 };
    a.total += 1;
    if (r.nonCompliant) a.nonCompliant += 1;
    map.set(r.author, a);
  }
  const authors = [...map.values()]
    .map((a) => ({
      ...a,
      compliant: a.total - a.nonCompliant,
      compPct: Math.round((1000 * (a.total - a.nonCompliant)) / a.total) / 10,
    }))
    .sort((x, y) => y.compPct - x.compPct || y.total - x.total);

  return {
    total,
    nonCompliant: nc,
    compliant: total - nc,
    compPct: total ? Math.round((1000 * (total - nc)) / total) / 10 : 0,
    ncPct: total ? Math.round((1000 * nc) / total) / 10 : 0,
    authors,
  };
}

// ---------------------------------------------------------------- UI PIECES
function StatCard({ value, label, color, classes }) {
  return (
    <Paper
      className={classes.statCard}
      elevation={3}
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
        border: `2px solid ${color}30`,
      }}
    >
      <Box style={{
        fontSize: "3rem",
        fontWeight: "bold",
        color,
        marginBottom: "12px",
        textShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        {value}
      </Box>
      <Box style={{
        fontSize: "0.875rem",
        color: "#475569",
        fontWeight: 600,
        letterSpacing: "0.5px"
      }}>
        {label}
      </Box>
    </Paper>
  );
}

function AuthorDonut({ a }) {
  const data = [
    { name: "Compliant", value: a.compliant, fill: GREEN },
    { name: "Over 48h", value: a.nonCompliant, fill: RED },
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    // We'll use absolute positioning overlay instead
    return null;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <p style={{
        marginBottom: "12px",
        textAlign: "center",
        fontSize: "1rem",
        fontWeight: 700,
        color: NAVY,
        minHeight: "40px",
        display: "flex",
        alignItems: "center"
      }}>
        {a.author}
      </p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            cx={110}
            cy={110}
            innerRadius={70}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            stroke="#fff"
            strokeWidth={4}
            label={renderCustomLabel}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
        </PieChart>
        {/* Centered text overlay */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none"
        }}>
          <div style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: compColor(a.compPct),
            lineHeight: 1,
            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}>
            {a.compPct}%
          </div>
          <div style={{
            fontSize: "11px",
            color: "#64748b",
            marginTop: "6px",
            fontWeight: "500",
            letterSpacing: "0.5px"
          }}>
            compliant
          </div>
        </div>
      </div>
      <p style={{
        marginTop: "12px",
        fontSize: "0.875rem",
        color: "#475569",
        textAlign: "center",
        fontWeight: 500
      }}>
        <span style={{ color: GREEN, fontWeight: 600 }}>{a.compliant}</span> within 48h
        <br />
        <span style={{ color: RED, fontWeight: 600 }}>{a.nonCompliant}</span> over 48h
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- MAIN
export default function ComplianceReport() {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = pdfRef.current;

      // Store original styles
      const originalMaxWidth = element.style.maxWidth;
      const originalWidth = element.style.width;

      // Temporarily expand to full width for PDF capture
      element.style.maxWidth = "210mm";
      element.style.width = "210mm";

      // Wait for reflow
      await new Promise(resolve => setTimeout(resolve, 50));

      // Find all sections that should be on separate pages
      const sections = element.querySelectorAll('[data-pdf-section]');
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      let isFirstPage = true;

      for (const section of sections) {
        const canvas = await html2canvas(section, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: section.scrollWidth,
          height: section.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Minimal margins
        const margin = 5;
        const availableWidth = pdfWidth - (margin * 2);

        // Calculate to fit width
        const ratio = availableWidth / imgWidth;
        const scaledHeight = imgHeight * ratio;

        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Add image at full width - each section gets its own page
        pdf.addImage(imgData, "PNG", margin, margin, availableWidth, scaledHeight);
      }

      // Restore original styles
      element.style.maxWidth = originalMaxWidth;
      element.style.width = originalWidth;

      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`48HR_Compliance_Report_${dateStr}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");

      // Restore styles on error
      if (pdfRef.current) {
        pdfRef.current.style.maxWidth = "";
        pdfRef.current.style.width = "";
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (!rows.length || !("VISIT TYPE" in rows[0])) {
          throw new Error(
            "Couldn't find the expected columns. The first sheet needs headers including VISIT TYPE, VISIT DATE, ACTION DATE, and AUTHOR OF NOTE."
          );
        }
        setSummary(analyze(rows));
        setFileName(file.name);
      } catch (err) {
        setError(err.message || "Could not read this file.");
        setSummary(null);
      }
    };
    reader.onerror = () => setError("Could not read this file.");
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const tableRows = useMemo(() => summary?.authors ?? [], [summary]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      {/* Upload Section */}
      <Box mb={4}>
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={onDrop}
          className={`${classes.dropZone} ${isDragging ? classes.dropZoneActive : ''}`}
          style={{
            display: "block",
            width: "100%",
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%"
          }}>
            <Upload
              style={{
                width: "48px",
                height: "48px",
                color: isDragging ? GREEN : "#94a3b8",
                marginBottom: "16px",
                transition: "all 0.3s ease"
              }}
            />
            <div style={{ fontSize: "1.125rem", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
              {isDragging ? "Drop your file here!" : "Drag & Drop Submission Report"}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "12px" }}>
              or click to browse for .xlsx or .xls files
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>
              Processed securely in your browser — no upload to server
            </div>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {fileName && (
          <Box mt={2} display="flex" alignItems="center" gap={1} style={{ color: "#475569", fontSize: "0.875rem" }}>
            <FileSpreadsheet style={{ width: "16px", height: "16px", color: GREEN }} />
            <span style={{ fontWeight: 500 }}>{fileName}</span>
          </Box>
        )}
      </Box>

      {error && (
        <Paper elevation={2} style={{
          marginTop: "16px",
          padding: "16px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <AlertCircle style={{ width: "20px", height: "20px", color: RED, flexShrink: 0, marginTop: "2px" }} />
          <span style={{ color: "#991b1b", fontSize: "0.875rem" }}>{error}</span>
        </Paper>
      )}

      {summary && (
        <>
          {/* PDF Download Button */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
            <Button
              variant="contained"
              className={classes.pdfButton}
              startIcon={isGeneratingPDF ? <CircularProgress size={18} color="inherit" /> : <Download style={{ width: "20px", height: "20px" }} />}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
            </Button>
          </Box>

          {/* PDF Content */}
          <div ref={pdfRef} className={classes.pdfContent}>
            {/* Page 1: Summary + Top 5 */}
            <div data-pdf-section="page1" style={{ paddingBottom: "100px" }}>
              {/* Header */}
              <Box
                mb={4}
                pb={3}
                style={{
                  borderBottom: `4px solid ${NAVY}`,
                  background: `linear-gradient(to right, ${NAVY}05, transparent)`
                }}
              >
              <Box style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: NAVY,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
                HaloesTouch Hospice Inc.
              </Box>
              <Box style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginTop: "4px"
              }}>
                QAPI / Compliance Report
              </Box>
              <Box mt={2} style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: NAVY,
                lineHeight: 1.2
              }}>
                48-Hour Note Timeliness
              </Box>
              <Box style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#475569",
                marginTop: "4px"
              }}>
                Compliance Report
              </Box>
              <Box mt={2} style={{
                fontSize: "0.875rem",
                color: "#64748b",
                padding: "8px 12px",
                backgroundColor: "#f8fafc",
                borderLeft: `3px solid ${GREEN}`,
                borderRadius: "4px"
              }}>
                <div><strong>Reporting Period:</strong> {REPORT_PERIOD}</div>
                <div style={{ marginTop: "4px", fontSize: "0.75rem", fontStyle: "italic" }}>
                  Scope: Clinical visit notes only. Excludes physician orders, certifications, IDG, and communication logs.
                </div>
              </Box>
            </Box>

            {/* Overall summary */}
            <Box mt={4} mb={4}>
              <h2 style={{
                marginBottom: "20px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: NAVY,
                borderBottom: `2px solid ${NAVY}20`,
                paddingBottom: "8px"
              }}>
                Overall Summary
              </h2>
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4} mb={3}>
                <StatCard value={summary.total} label="Note actions reviewed" color={NAVY} classes={classes} />
                <StatCard value={`${summary.compPct}%`} label="Compliant (≤ 48 hrs)" color={GREEN} classes={classes} />
                <StatCard value={`${summary.ncPct}%`} label="Non-compliant (> 48 hrs)" color={RED} classes={classes} />
              </Box>
              <Paper elevation={0} style={{
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderLeft: `4px solid ${NAVY}`,
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#1e293b"
              }}>
                Of <strong>{summary.total}</strong> clinical note actions,{" "}
                <strong style={{ color: GREEN, fontSize: "1.1rem" }}>
                  {summary.compliant} ({summary.compPct}%)
                </strong>{" "}
                were completed within 48 hours and are <strong style={{ color: GREEN }}>compliant</strong>.
                <br />
                The remaining{" "}
                <strong style={{ color: RED, fontSize: "1.1rem" }}>
                  {summary.nonCompliant} ({summary.ncPct}%)
                </strong>{" "}
                exceeded 48 hours and are <strong style={{ color: RED }}>non-compliant</strong>.
              </Paper>
            </Box>

            {/* Top compliance */}
            <Box mt={5} mb={4}>
              <h2 style={{
                marginBottom: "20px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: NAVY,
                borderBottom: `2px solid ${NAVY}20`,
                paddingBottom: "8px"
              }}>
                🏆 Top 5 Compliance Authors
              </h2>
              <RankTable
                rows={tableRows.slice(0, 5)}
                showRank
                classes={classes}
              />
            </Box>
            </div>

            {/* Page 2: Full Compliance Table */}
            <div data-pdf-section="page2" style={{ paddingBottom: "100px" }}>
              <Box mt={3} mb={4}>
                <h2 style={{
                  marginBottom: "20px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: NAVY,
                  borderBottom: `2px solid ${NAVY}20`,
                  paddingBottom: "8px"
                }}>
                  📊 Compliance by Author - Detailed Breakdown
                </h2>
                <RankTable rows={tableRows} totals={summary} classes={classes} />
              </Box>
            </div>

            {/* Page 3: Visual Charts */}
            <div data-pdf-section="page3" style={{ paddingBottom: "150px", minHeight: "200px" }}>
            <Box mt={5} mb={8} style={{ paddingTop: "0" }}>
              <h2 style={{
                marginBottom: "16px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: NAVY,
                borderBottom: `2px solid ${NAVY}20`,
                paddingBottom: "8px"
              }}>
                📈 Visual Compliance Dashboard
              </h2>
              <Paper elevation={0} style={{
                padding: "12px 16px",
                marginBottom: "24px",
                backgroundColor: "#eff6ff",
                borderLeft: `4px solid ${NAVY}`,
                fontSize: "0.875rem",
                color: "#475569"
              }}>
                <strong>Legend:</strong>{" "}
                <span style={{ color: GREEN, fontWeight: 600 }}>● Green</span> = Compliant (≤ 48 hrs) |{" "}
                <span style={{ color: RED, fontWeight: 600 }}>● Red</span> = Non-compliant (&gt; 48 hrs)
                <br />
                <span style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                  The percentage shown in the center represents each author's compliance rate
                </span>
              </Paper>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={3}
                style={{
                  backgroundColor: "#fafafa",
                  padding: "24px",
                  paddingBottom: "100px",
                  borderRadius: "8px"
                }}
              >
                {summary.authors.map((a) => (
                  <AuthorDonut key={a.author} a={a} />
                ))}
              </Box>
            </Box>
            </div>
          </div>
        </>
      )}

      {/* PDF Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

function RankTable({ rows, showRank = false, totals = null, classes }) {
  return (
    <Paper elevation={3} style={{ overflow: "auto", border: "1px solid #e2e8f0" }}>
      <table className={classes.table} style={{ width: "100%", borderCollapse: "collapse", fontSize: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: NAVY, color: "white" }}>
            {showRank && <Th style={{ width: "80px", textAlign: "center", color: "white", borderColor: NAVY }}>Rank</Th>}
            <Th style={{ color: "white", borderColor: NAVY }}>Author of Note</Th>
            <Th style={{ textAlign: "center", color: "white", borderColor: NAVY }}>Total Actions</Th>
            <Th style={{ textAlign: "center", color: "white", borderColor: NAVY }}>Within 48 hrs</Th>
            {!showRank && <Th style={{ textAlign: "center", color: "white", borderColor: NAVY }}>&gt;48 hrs</Th>}
            <Th style={{ textAlign: "center", color: "white", borderColor: NAVY }}>% Compliant</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a, i) => (
            <tr key={a.author} style={{
              backgroundColor: i % 2 === 0 ? "white" : "#f8fafc",
            }}>
              {showRank && (
                <Td style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: i === 0 ? "#BF9000" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : NAVY
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </Td>
              )}
              <Td style={{ fontWeight: 500, color: "#1e293b" }}>{a.author}</Td>
              <Td style={{ textAlign: "center", fontWeight: 500 }}>{a.total}</Td>
              <Td style={{ textAlign: "center", fontWeight: 500, color: GREEN }}>{a.compliant}</Td>
              {!showRank && <Td style={{ textAlign: "center", fontWeight: 500, color: RED }}>{a.nonCompliant}</Td>}
              <Td style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
                color: compColor(a.compPct),
                backgroundColor: `${compColor(a.compPct)}10`
              }}>
                {a.compPct}%
              </Td>
            </tr>
          ))}
          {totals && (
            <tr style={{ backgroundColor: NAVY, color: "white", fontWeight: "bold" }}>
              <Td style={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}>ALL AUTHORS</Td>
              <Td style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>{totals.total}</Td>
              <Td style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>{totals.compliant}</Td>
              <Td style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>{totals.nonCompliant}</Td>
              <Td style={{ textAlign: "center", fontWeight: "bold", color: "white", fontSize: "1rem" }}>
                {totals.compPct}%
              </Td>
            </tr>
          )}
        </tbody>
      </table>
    </Paper>
  );
}

function Th({ children, style }) {
  return (
    <th style={{
      border: "1px solid #cbd5e1",
      padding: "16px 18px",
      textAlign: "left",
      fontSize: "0.9rem",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      ...style
    }}>
      {children}
    </th>
  );
}
function Td({ children, style }) {
  return (
    <td style={{
      border: "1px solid #e2e8f0",
      padding: "14px 18px",
      fontSize: "0.95rem",
      ...style
    }}>
      {children}
    </td>
  );
}

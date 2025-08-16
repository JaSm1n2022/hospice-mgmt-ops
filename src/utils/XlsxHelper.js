// utils/exportToXlsx.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
export function handleExport(excelData, fname) {
  exportToXlsx({
    rows: excelData, // was excel / excelData in your code
    fileName: `${fname}_${Date.now()}`,
  });
}
export function exportToXlsx({
  rows, // your excelData array of objects
  fileName, // e.g. "patients"
  sheetName = "Sheet1",
}) {
  if (!rows || !rows.length) return;

  // 1) Build worksheet from JSON
  const ws = XLSX.utils.json_to_sheet(rows);

  // (optional) auto-size a bit
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((r) => String(r?.[key] ?? "").length),
      10
    ),
  }));
  ws["!cols"] = colWidths;

  // 2) Create workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 3) Write to ArrayBuffer (no Buffer, no fs)
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  // 4) Save
  const blob = new Blob([excelBuffer], { type: fileType });
  saveAs(blob, `${fileName}${fileExtension}`);
}

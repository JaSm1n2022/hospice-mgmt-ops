import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point pdfjs worker at a CDN so you don't need bundler config.
// If you prefer to bundle the worker yourself, swap this for the local path.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ---------------------------------------------------------------------------
// Parsing logic — ported from extract_pharmacy_invoice.py
// ---------------------------------------------------------------------------

const RX_LINE_RE =
  /^\s*(\d{2}\/\d{2}\/\d{4})\s+Rx\s+(\d+)(?:--|\s+)(.+?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$/;

// Fallback for the wrap case where a long description (e.g. MORPHINE SULF
// 100 MG/5 ML (20MG/ML) CONC) collides with the qty column.
const RX_COLLISION_RE =
  /^\s*(\d{2}\/\d{2}\/\d{4})\s+Rx\s+(\d+)(?:--|\s+)(.+?\D)(\d+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$/;

const SUBTOTAL_RE =
  /^\s*([A-Z][A-Z' \-]+,\s*[A-Z][A-Z' \-]+)\s*\(\s*\)\s*:\s*Sub-Total\s*:\s*([\d.]+)\s*$/;

const PLEASE_PAY_RE = /Please\s+Pay\s*-->\s*:\s*([\d.]+)/i;

async function extractTextLines(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allLines = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Group items by y-coordinate (with a small tolerance band)
    const lineMap = new Map();
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push({ x: item.transform[4], width: item.width, text: item.str });
    }

    // Sort lines top→bottom, then items left→right within each line.
    // Insert proportional spaces between items so column alignment survives.
    const ys = [...lineMap.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const items = lineMap.get(y).sort((a, b) => a.x - b.x);
      let line = '';
      let cursorX = null;
      for (const item of items) {
        if (cursorX !== null) {
          const gap = item.x - cursorX;
          const spaces = Math.max(1, Math.round(gap / 3));
          line += ' '.repeat(spaces);
        }
        line += item.text;
        cursorX = item.x + (item.width || item.text.length * 3);
      }
      allLines.push(line);
    }
  }
  return allLines;
}

function parseInvoice(lines) {
  const patients = [];
  let pending = [];
  let lastItem = null;
  let grandTotal = null;

  for (const raw of lines) {
    const line = raw.trimEnd();

    const sub = line.match(SUBTOTAL_RE);
    if (sub) {
      const name = sub[1].replace(/\s+/g, ' ').trim();
      const subtotal = parseFloat(sub[2]);
      const computedTotal = pending.reduce((s, li) => s + li.total, 0);
      patients.push({
        name,
        subtotal,
        rxCount: pending.length,
        computedTotal: Math.round(computedTotal * 100) / 100,
        lineItems: pending,
      });
      pending = [];
      lastItem = null;
      continue;
    }

    const pay = line.match(PLEASE_PAY_RE);
    if (pay) {
      grandTotal = parseFloat(pay[1]);
      continue;
    }

    const rx = line.match(RX_LINE_RE) || line.match(RX_COLLISION_RE);
    if (rx) {
      const item = {
        date: rx[1],
        rxNumber: rx[2],
        description: rx[3].trim(),
        qty: parseFloat(rx[4]),
        price: parseFloat(rx[5]),
        tax: parseFloat(rx[6]),
        total: parseFloat(rx[7]),
      };
      pending.push(item);
      lastItem = item;
      continue;
    }

    if (lastItem && line.trim() === 'ONC') {
      lastItem.description = lastItem.description.endsWith(' C')
        ? lastItem.description.slice(0, -2) + ' CONC'
        : lastItem.description + ' CONC';
    }
  }

  return { patients, grandTotal };
}

// ---------------------------------------------------------------------------
// API integration points — REPLACE with your real endpoints
// ---------------------------------------------------------------------------

// TODO: Replace with your patients-table API call.
// Expected shape: [{ code: string, name: string }, ...]
// `name` should match the format on the invoice (e.g. "TAYLOR, ROGER")
// for auto-matching to work; the regex normalizes case/whitespace.
async function fetchPatientsFromApi() {
  // Example with fetch:
  //   const res = await fetch('/api/patients');
  //   if (!res.ok) throw new Error('Failed to load patients');
  //   return res.json();
  //
  // Stub data for now — remove this once your endpoint is wired up:
  return [
    { code: 'P001', name: 'CANEVALE, ALEXANDER' },
    { code: 'P002', name: 'GANTZ, JOYCE' },
    { code: 'P003', name: 'GARCIA, ROBERTO' },
    { code: 'P004', name: 'GOLDBERG, CHARLES' },
    { code: 'P005', name: 'HALLER, CATHERINE' },
    { code: 'P006', name: 'KUEHN, JEANNETTE' },
    { code: 'P007', name: 'MOSS, LINDA' },
    { code: 'P008', name: 'NUTLEY, FRANCES' },
    { code: 'P009', name: 'ROSE, SHEP' },
    { code: 'P010', name: 'ROSTA, MIKLOS' },
    { code: 'P011', name: 'SCHROCK, CALVIN' },
    { code: 'P012', name: 'SHROCK, CALVIN' },
    { code: 'P013', name: 'SLIGHT, JOHN' },
    { code: 'P014', name: 'TAYLOR, ROGER' },
  ];
}

// TODO: Replace with your real submit endpoint.
async function submitToApi(payload) {
  // Example:
  //   const res = await fetch('/api/pharmacy-charges', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!res.ok) throw new Error('Submit failed');
  //   return res.json();
  console.log('Submit payload:', payload);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeName(s) {
  return (s || '').toUpperCase().replace(/[\s,.()]+/g, '');
}

function suggestPatientCode(invoiceName, patients) {
  const target = normalizeName(invoiceName);
  // Exact match first
  const exact = patients.find((p) => normalizeName(p.name) === target);
  if (exact) return exact.code;
  // Fall back to last-name match (everything before the comma)
  const lastName = (invoiceName.split(',')[0] || '').trim();
  if (lastName) {
    const targetLast = normalizeName(lastName);
    const candidate = patients.find((p) =>
      normalizeName((p.name.split(',')[0] || '').trim()) === targetLast,
    );
    if (candidate) return candidate.code;
  }
  return '';
}

function formatCurrency(n) {
  return n == null
    ? ''
    : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PharmacyInvoiceUploader() {
  const [patients, setPatients] = useState([]);
  const [rows, setRows] = useState([]);
  const [grandTotal, setGrandTotal] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPatientsFromApi()
      .then(setPatients)
      .catch((e) => setError(`Could not load patients list: ${e.message}`));
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setError(null);
    setSubmitResult(null);
    try {
      const lines = await extractTextLines(file);
      const { patients: extracted, grandTotal: gt } = parseInvoice(lines);
      if (extracted.length === 0) {
        throw new Error(
          'No patient blocks found. Is this the standard 986 LTC Pharmacy invoice format?',
        );
      }
      setRows(
        extracted.map((p) => ({
          patientCd: suggestPatientCode(p.name, patients),
          patientName: p.name,
          rxCount: p.rxCount,
          total: p.subtotal,
          computedTotal: p.computedTotal,
          reconciles: Math.abs(p.subtotal - p.computedTotal) < 0.01,
        })),
      );
      setGrandTotal(gt);
    } catch (err) {
      setError(err.message);
      setRows([]);
      setGrandTotal(null);
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };

  const reset = () => {
    setRows([]);
    setGrandTotal(null);
    setFileName('');
    setError(null);
    setSubmitResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitResult(null);
    setError(null);
    try {
      const missing = rows.filter((r) => !r.patientCd);
      if (missing.length > 0) {
        throw new Error(
          `Patient Cd is required for: ${missing.map((m) => m.patientName).join(', ')}`,
        );
      }
      const payload = {
        sourceFile: fileName,
        grandTotal,
        rows: rows.map((r) => ({
          patientCd: r.patientCd,
          patientName: r.patientName,
          rxCount: r.rxCount,
          total: r.total,
        })),
      };
      const result = await submitToApi(payload);
      setSubmitResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalsSum = rows.reduce((s, r) => s + (Number(r.total) || 0), 0);
  const grandTotalReconciles =
    grandTotal != null && Math.abs(totalsSum - grandTotal) < 0.01;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">
        Pharmacy Invoice Upload
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Upload a 986 Long Term Care Pharmacy PDF invoice. Patient totals will be
        extracted and matched to your patient list.
      </p>

      {/* Upload */}
      <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Choose PDF
            </label>
            <input
              id="pdf-upload"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="hidden"
            />
            <span className="ml-3 text-sm text-gray-600">
              {fileName || 'No file selected'}
            </span>
          </div>
          {rows.length > 0 && (
            <button
              onClick={reset}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
        {loading && (
          <div className="mt-3 text-sm text-blue-700">Extracting invoice…</div>
        )}
      </div>

      {/* Errors */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {submitResult && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Submitted successfully.
        </div>
      )}

      {/* Reconciliation warning */}
      {rows.length > 0 && !grandTotalReconciles && grandTotal != null && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Heads up:</strong> Sum of patient totals ({formatCurrency(totalsSum)})
          doesn't match the invoice grand total ({formatCurrency(grandTotal)}). Verify
          the extraction before submitting.
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Patient Cd
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rx Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((r, i) => (
                  <tr key={i} className={r.reconciles ? '' : 'bg-amber-50'}>
                    <td className="px-4 py-2">
                      <select
                        value={r.patientCd}
                        onChange={(e) => updateRow(i, 'patientCd', e.target.value)}
                        className={`w-full rounded-md border px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          r.patientCd ? 'border-gray-300' : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <option value="">— Select —</option>
                        {patients.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.code} — {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {r.patientName}
                      {!r.reconciles && (
                        <span
                          className="ml-2 text-xs text-amber-700"
                          title={`Stated subtotal ${formatCurrency(
                            r.total,
                          )} differs from sum of line items ${formatCurrency(
                            r.computedTotal,
                          )}`}
                        >
                          ⚠
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-sm text-gray-900">
                      {r.rxCount}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-900">
                      {formatCurrency(r.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-right text-sm font-medium text-gray-700"
                  >
                    Total
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                    {rows.reduce((s, r) => s + r.rxCount, 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(totalsSum)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

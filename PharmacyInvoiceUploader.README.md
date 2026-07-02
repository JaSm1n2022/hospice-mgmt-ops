# PharmacyInvoiceUploader — Setup

A React component that uploads a pharmacy invoice PDF, extracts patient
totals client-side, and presents an editable table for review and submission.

## 1. Install the one dependency

In your React project root:

```bash
npm install pdfjs-dist
```

That's the only new package. Tailwind classes are used for styling — if
your project isn't on Tailwind, replace the `className` strings with your
own CSS.

## 2. Drop the file into your components folder

Copy `PharmacyInvoiceUploader.jsx` into something like
`src/components/PharmacyInvoiceUploader.jsx`.

## 3. Use it in a page or route

```jsx
import PharmacyInvoiceUploader from './components/PharmacyInvoiceUploader';

export default function PharmacyPage() {
  return <PharmacyInvoiceUploader />;
}
```

## 4. Wire up your API (two spots)

Open `PharmacyInvoiceUploader.jsx` and find the two `TODO` blocks:

### `fetchPatientsFromApi()`
Replace the stub array with a call to your patients endpoint. The
component expects `[{ code, name }, ...]` where `name` is formatted like
`"TAYLOR, ROGER"` (last comma first, uppercase). If your API returns
different field names, just map them after the fetch:

```js
async function fetchPatientsFromApi() {
  const res = await fetch('/api/patients');
  const data = await res.json();
  return data.map(p => ({
    code: p.patient_cd,           // ← rename to match your schema
    name: `${p.last_name}, ${p.first_name}`.toUpperCase(),
  }));
}
```

### `submitToApi(payload)`
Replace the `console.log` with your real submit endpoint. The payload
shape is:

```json
{
  "sourceFile": "pharmacyApril.pdf",
  "grandTotal": 1919.90,
  "rows": [
    { "patientCd": "P014", "patientName": "TAYLOR, ROGER", "rxCount": 26, "total": 628.92 }
  ]
}
```

## How auto-matching works

When the PDF is extracted, the component normalizes each patient name
(uppercase, strip spaces/commas/dots) and looks for an exact match in
your patients list, falling back to last-name match. If neither finds a
hit, the dropdown is left blank and shown with a red border — the user
must pick before they can submit.

## Reconciliation checks

Two automatic checks happen before submit:

1. **Per-row**: each patient's stated subtotal is compared to the sum of
   their line items. Any mismatch shows a ⚠ next to the patient name and
   highlights the row amber.
2. **Whole invoice**: the sum of all patient totals is compared to the
   "Please Pay" grand total on the invoice. A mismatch shows a banner
   above the table.

Submit is still allowed if there are mismatches (the user might be
correcting numbers intentionally), but Patient Cd is required for every
row — that's a hard block.

## Known limitation

Client-side PDF text extraction uses pdfjs-dist, which is slightly less
precise than the server-side `pdftotext -layout` approach. If a future
invoice has a layout the regex can't handle, you'll see "No patient
blocks found" or rows with `⚠` flags. In that case, fall back to the
Python script (`extract_pharmacy_invoice.py`) and update both files'
regex patterns to match.

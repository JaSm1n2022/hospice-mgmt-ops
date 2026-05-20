# 986 Long Term Care Pharmacy — Invoice Processing

This project extracts per-patient prescription data from monthly invoices
from **986 Long Term Care Pharmacy #8017** (account #38630, billed to
Haloes Touch Hospice). Invoices arrive as PDFs, one per month.

## Project layout

```
.
├── CLAUDE.md                       ← this file
├── extract_pharmacy_invoice.py     ← the extractor script
├── invoices/                       ← drop new PDFs here
│   ├── pharmacyApril.pdf
│   └── pharmacyMay.pdf
└── extracted/                      ← script writes outputs here
    ├── pharmacyApril_summary.csv
    ├── pharmacyApril_detail.csv
    └── pharmacyApril_data.json
```

## When the user uploads or mentions a new invoice PDF

Run the extractor and report results. Do not re-implement the parsing
logic from scratch — the script is already tuned for this invoice format.

```bash
python extract_pharmacy_invoice.py invoices/<filename>.pdf --out-dir ./extracted/
```

Then:

1. Show the reconciliation table that the script prints to stdout.
2. Flag any patient row marked `!!` (computed total ≠ stated subtotal).
3. Confirm the grand total matches the "Please Pay" line on the invoice.
4. Point the user to the three output files in `./extracted/`.

If the user asks for a different format (Excel, summary email, chart,
totals by drug class), work from `<stem>_data.json` — it has the full
structured data including every line item.

## Invoice format notes

- Each patient's section ends with a summary line in this exact form:
  `PATIENT,NAME() : Sub-Total : 234.23`
- Rx rows follow the pattern:
  `MM/DD/YYYY  Rx <num>--<DESCRIPTION>   <qty>  <price>  <tax>  <total>`
- Some Rx rows use a space instead of `--` between Rx number and
  description (rare — the regex handles both).
- Page headers repeat on every page (pharmacy address, account info,
  column titles). The script skips these via the `NOISE_PREFIXES` list.
- **Known wrap edge case:** when a description is very long (e.g.
  `MORPHINE SULF 100 MG/5 ML (20MG/ML) CONC`), it collides with the
  qty column and the word `CONC` wraps to the next line as `ONC`. The
  script has a fallback regex (`RX_COLLISION_RE`) and a continuation
  merge for the bare `ONC` line. Don't break these.

## If extraction fails or numbers don't reconcile

Don't modify the script blindly. Walk through this in order:

1. Inspect the raw extracted text first:
   ```bash
   pdftotext -layout invoices/<filename>.pdf /tmp/raw.txt
   less /tmp/raw.txt
   ```
2. Identify which patient block or row didn't parse correctly.
3. Compare against the regex patterns at the top of
   `extract_pharmacy_invoice.py` (`RX_LINE_RE`, `RX_COLLISION_RE`,
   `SUBTOTAL_RE`).
4. If a new layout quirk appears, propose a regex change and test
   against ALL previously processed invoices to confirm nothing
   regresses — every patient subtotal must still reconcile.
5. Update the "Known wrap edge case" section above if a new edge case
   is added.

## Validation rule (non-negotiable)

After every extraction, both must be true:

- Every patient's `computed_total` equals the printed `subtotal`
  (tolerance: $0.01).
- The sum of all patient subtotals equals the invoice's grand total
  on the "Please Pay -->" line.

If either fails, surface it loudly. Do not present results as final
until both checks pass.

## Output files (per invoice)

| File | Purpose |
|------|---------|
| `<stem>_summary.csv` | One row per patient: name, Rx count, subtotal, computed total, match status |
| `<stem>_detail.csv`  | One row per prescription: patient, date, Rx #, description, qty, price, tax, total |
| `<stem>_data.json`   | Full structured data including invoice header (account, period, invoice number) |

## What NOT to do

- Don't read the PDF directly and re-parse in chat — always use the script.
- Don't trust extracted numbers without running the reconciliation check.
- Don't merge "Schrock, Calvin" and "Shrock, Calvin" automatically —
  they appear as separate patient records on the invoice and may or may
  not be the same person. Flag it for the user to confirm.
- Don't strip the `()` from patient names silently — the empty parens
  are part of the invoice's format and the regex relies on them.

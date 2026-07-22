# Build Spec — Reliant Medical Supply June 2026 Invoice (by-patient HTML table)

## Goal
Generate a single self-contained HTML file that renders a by-patient table of the
Reliant Medical Supply **June 2026** DME invoice for Haloes Touch Hospice Inc.

**Output file:** `reliant_june2026_by_patient.html`

## Table structure
Three columns, in this order:

| Column | Content | Alignment |
|---|---|---|
| Patient | Full name, bold, no wrap | left |
| Equipment Description | Semicolon-separated **pure equipment** only — durable medical equipment items. **No** daily rate, consumables/supplies (cannulas, tubing), refills, or service-action words (SWAP, REFILL). | left |
| Total | Patient line-item total, currency `$#,##0.00` | right, tabular numerals |

- A **`<tfoot>`** row spanning the first two columns labeled `Sub-Total`, with `$2,325.00` in the Total column.
- No other columns. No per-line breakdown.

## Styling requirements
- Font: **Arial, Helvetica, sans-serif** throughout.
- Header row: background `#1F3864` (navy), white text, left-aligned (Total header right-aligned).
- Body font size 13px; cell padding `8px 10px`; borders `1px solid #cfd6e4`; `vertical-align:top`.
- Zebra striping: even rows background `#f4f6fb`.
- Footer row: background `#D9E1F2`, bold.
- Title `<h1>` in navy `#1F3864`; subtitle line in grey `#555`.
- Use the HTML entity `&#8322;` (or the character `₂`) for the subscript 2 in "O₂"; escape `&` as `&amp;`.
- Fully self-contained: inline `<style>`, no external assets, no scripts.

## Header text
- H1: `Reliant Medical Supply — Invoice: June 2026`
- Subtitle: `Haloes Touch Hospice Inc. · by patient`

## Data (pure equipment only)

| Patient | Equipment Description | Total |
|---|---|---|
| Alexander Canevale | Half rails; nebulizer full kit; 5L O₂ concentrator full kit; E-tank w/ cart | $142.50 |
| Catherine Haller | FE hospital bed w/ half rails; APP pump & pad; overbed table; 5L O₂ concentrator full kit; front wheeled walker; nebulizer full kit; etank reg cart | $142.50 |
| Charles Goldberg | FE hospital bed; 18" std wheelchair; overbed table; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart | $142.50 |
| Darlene Grider | FE hospital bed w/ half rails; overbed table; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart; low airloss mattress | $163.00 |
| George Keller | FE hospital bed w/ full rails; APP pump & pad; overbed table; 5L O₂ concentrator full kit; front wheeled walker; fall mat | $142.50 |
| Harry Johns | 18" std wheelchair | $35.00 |
| Jeannette Kuehn | 15" std wheelchair; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart; overbed table; front wheeled walker; 18" std wheelchair | $142.50 |
| John Slight | FE hospital bed; 5L O₂ concentrator full kit; 18" std wheelchair; nebulizer full kit; etank reg cart | $142.50 |
| Joyce Gantz | Overbed table; 18" std wheelchair; shower chair | $142.50 |
| Linda Moss | FE hospital bed; overbed table; APP pump & pad | $142.50 |
| Martha Amour | FE hospital bed; overbed table; 5L O₂ concentrator full kit; nebulizer full kit; etank reg cart; 18" std wheelchair; bed tab alarm | $157.50 |
| Miklos Rosta | 18" std wheelchair; mattress; Mickey Mouse rails; fall mat; bed tab alarm | $157.50 |
| Patrick Sunne | BARI FE hospital bed w/ HR; overbed table; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart; 20" std wheelchair; BARI rollator; BARI shower chair | $65.00 |
| Roberto Garcia | FE hospital bed w/ half rails; shower bench; transfer bench; 18" std wheelchair; low airloss mattress; trapeze bar; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart; front wheeled walker; electric Hoyer lift w/ sling | $310.00 |
| Shep Rose | Suction machine; 5L O₂ concentrator full kit; overbed table; APP pump & pad; 18" reclining wheelchair w/ ELRs; nebulizer full kit; fall mat | $222.50 |
| Vilaipon Gray | Overbed table; 5L O₂ concentrator full kit; nebulizer full kit; E-tank w/ cart; shower chair; 18" std wheelchair; 3-in-1 commode | $74.50 |
| **Sub-Total** | | **$2,325.00** |

## Reference implementation
Emit exactly this structure (styling condensed here — apply the full spec above):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Reliant Medical Supply — June 2026 by Patient</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color:#1a1a1a; margin:24px; }
  h1 { color:#1F3864; font-size:18px; margin:0 0 2px; }
  .sub { color:#555; font-size:12px; margin:0 0 16px; }
  table { border-collapse:collapse; width:100%; font-size:13px; }
  th, td { border:1px solid #cfd6e4; padding:8px 10px; vertical-align:top; }
  th { background:#1F3864; color:#fff; text-align:left; }
  th.total, td.total { text-align:right; }
  td.total { white-space:nowrap; font-variant-numeric:tabular-nums; }
  tr:nth-child(even) td { background:#f4f6fb; }
  .patient { font-weight:bold; white-space:nowrap; }
  tfoot td { font-weight:bold; background:#D9E1F2; }
</style>
</head>
<body>
<h1>Reliant Medical Supply — Invoice: June 2026</h1>
<p class="sub">Haloes Touch Hospice Inc. &middot; by patient</p>
<table>
  <thead>
    <tr><th>Patient</th><th>Equipment Description</th><th class="total">Total</th></tr>
  </thead>
  <tbody>
    <!-- one <tr> per patient row from the data table above:
         <tr><td class="patient">NAME</td><td>EQUIPMENT</td><td class="total">$X.XX</td></tr> -->
  </tbody>
  <tfoot>
    <tr><td colspan="2">Sub-Total</td><td class="total">$2,325.00</td></tr>
  </tfoot>
</table>
</body>
</html>
```

## Validation
- 16 patient rows + 1 sub-total row.
- Equipment Description contains durable equipment only — no "Daily rate", no cannulas/tubing, no refills, no SWAP/REFILL service words.
- Total column values sum to `$2,325.00` (matches the invoice-stated sub-total).

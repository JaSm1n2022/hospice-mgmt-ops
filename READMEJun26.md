# Reliant Invoice → by-patient table (VS / agent instructions)

`extract_reliant.py` reads a Reliant Medical Supply monthly DME invoice **PDF**
and produces the by-patient table (pure equipment + patient total). It parses
the PDF directly — do **not** ask the agent to re-key the data by hand.

## Run it

```bash
pip install pdfplumber
python extract_reliant.py Reliant_JUN_26.pdf --out ./out --period "June 2026"
```

Outputs land in `./out`:

| File | What it is |
|---|---|
| `Reliant_JUN_26_by_patient.html` | the rendered table (open in a browser) |
| `Reliant_JUN_26_by_patient.json` | patient / status / equipment[] / total |
| `Reliant_JUN_26_line_items.csv`  | full raw grid, every line, for auditing |

The console prints a summary and the sub-total. **Check that the printed
sub-total equals the invoice's stated Sub-Total** — if it doesn't, the layout
shifted (see below).

## How the extraction works (so the agent can adapt it)

The invoice is a fixed-width grid; every word has an (x, y) coordinate.

1. **Columns** — each word is assigned to a column by its left x-edge. The
   ranges in `BANDS` come straight from the header row (`PATIENT NAME`,
   `EQUIPMENT DESCRIPTION`, `TOTAL`, …).
2. **Rows** — words within ~3px of the same y are one visual row.
3. **Patient start** — a row whose Equipment cell is exactly `Daily Rate`
   **and** whose Patient cell begins with an UPPER-CASE name. The name is the
   leading capitalised words up to the first token containing a digit (the
   street number). A `Daily Rate` with no name is an in-record relocation, not
   a new patient.
4. **Following rows** belong to that patient until the next start:
   a lone `R`/`GH` = account status; a `$` in the Total column = added to the
   patient total; other Equipment text = an equipment line.
5. **Pure equipment** — daily rate, refills, cannulas, tubing, "new location"
   and qty-0 (not-on-service) lines are dropped; `SWAP:`/`REFILL:` prefixes are
   stripped. Edit `DROP_EQUIP` to change what counts as equipment.
6. Footer `Sub-Total` / `TOTAL AMT` rows are ignored because they carry no
   Equipment text (money is only counted on real line items).

## If a future month doesn't parse cleanly

- **Totals wrong / patients merged:** the column x-positions moved. Re-read the
  header row once and adjust the numbers in `BANDS`.
- **A name is missed:** confirm that patient has a `Daily Rate` anchor row.
- **Text split oddly (e.g. "5L" separated):** widen the relevant band, or add a
  re-attach rule like the existing `5L` handling in `group_patients`.

## Known source-fidelity notes (June 2026)

These are printed that way **on the invoice** and are passed through verbatim:
`5L Oxygen Concentrator Full Ki` (Gray), `Trapeeze Bar` (Garcia). The word
"Electric" on Garcia's Hoyer line prints outside the Equipment column, so the
item reads `Hoyer Lift w Select Sling`.

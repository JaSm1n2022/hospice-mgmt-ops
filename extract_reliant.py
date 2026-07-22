#!/usr/bin/env python3
"""
extract_reliant.py
------------------
Extract the Reliant Medical Supply monthly DME invoice (PDF) into structured
data and render a by-patient HTML table (pure equipment + patient total).

Usage:
    python extract_reliant.py Reliant_JUN_26.pdf
    python extract_reliant.py Reliant_JUN_26.pdf --out out_dir --period "June 2026"

Outputs (into --out, else next to the PDF):
    <stem>_line_items.csv   full line-item detail (raw grid)
    <stem>_by_patient.json  one record per patient (equipment list + total)
    <stem>_by_patient.html  rendered by-patient table

Requires: pdfplumber   ->   pip install pdfplumber

HOW IT WORKS
------------
The invoice is a fixed-width grid. Each printed word carries an (x, y) position.
1. Words are bucketed into COLUMNS by their left x-edge (see BANDS).
2. Words are bucketed into ROWS by their y-position (3px tolerance).
3. A new PATIENT begins on any row whose Equipment cell == "Daily Rate"
   (every patient has exactly one such anchor row). The patient NAME is the
   leading UPPER-CASE tokens in the Patient column, up to the first token that
   contains a digit (the start of the street address).
4. Rows after an anchor belong to that patient until the next anchor:
      - a lone "R"/"GH" in the Patient column  -> account status
      - any $ value in the Total column        -> added to the patient total
      - a non-empty Equipment cell             -> an equipment / charge line
5. Rows before the first anchor (customer block + column header, page 1 only)
   are ignored automatically.
"""
import sys, os, csv, json, html, argparse, re

# COLUMN BANDS: (name, x0_min, x0_max) taken from the header row positions.
BANDS = [
    ("inv",       0,   60),
    ("patient",   60,  200),
    ("address",   200, 330),
    ("delivery",  330, 430),
    ("equipment", 430, 570),
    ("qty",       570, 615),
    ("pickup",    615, 675),
    ("rate",      675, 715),
    ("total",     715, 900),
]
def band_of(x0):
    for name, lo, hi in BANDS:
        if lo <= x0 < hi:
            return name
    return "total" if x0 >= 715 else "inv"

STATUS_CODES = {"R", "GH", "GD", "G", "GHS"}
MONEY   = re.compile(r"^\$?[\d,]+\.\d{2}$")
HASDIGIT = re.compile(r"\d")
def money(s): return float(s.replace("$", "").replace(",", ""))

# equipment lines that are NOT durable equipment (dropped from the pure list)
DROP_EQUIP = re.compile(
    r"daily rate|refill|cannula|tubing|unbilled|new location|nuloc", re.I)
STRIP_PREFIX = re.compile(r"^(swap:?|refill:?)\s*", re.I)

# ---------------------------------------------------------------- parse grid
def parse_rows(pdf_path):
    import pdfplumber
    rows = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            buckets = {}
            for w in page.extract_words():
                key = round(w["top"] / 3.0) * 3
                buckets.setdefault(key, []).append(w)
            for top in sorted(buckets):
                cells = {n: [] for n, _, _ in BANDS}
                for w in sorted(buckets[top], key=lambda z: z["x0"]):
                    cells[band_of(w["x0"])].append(w["text"])
                row = {k: " ".join(v).strip() for k, v in cells.items()}
                if any(row.values()):
                    rows.append(row)
    return rows

def split_name(patient_cell):
    """Leading UPPER-CASE tokens up to the first token containing a digit."""
    name_toks, rest = [], []
    hit_addr = False
    for tok in patient_cell.split():
        if not hit_addr and not HASDIGIT.search(tok) and tok.upper() == tok:
            name_toks.append(tok)
        else:
            hit_addr = True
            rest.append(tok)
    return " ".join(name_toks).title(), " ".join(rest)

# ------------------------------------------------------------- group patients
def group_patients(rows):
    patients, cur = [], None
    for row in rows:
        eq = row["equipment"].strip()

        # "5L" for oxygen concentrators lands in the date column -> reattach
        deliv = row["delivery"].split()
        if deliv and deliv[-1] == "5L" and eq:
            eq = "5L " + eq

        # anchor: start of a new patient. A "Daily Rate" row only starts a NEW
        # patient if the Patient column carries an UPPER-CASE name; a "Daily
        # Rate" with no name is an in-record relocation (same patient).
        if eq == "Daily Rate":
            name, addr_tail = split_name(row["patient"])
            if name:
                cur = {"patient": name,
                       "address": (addr_tail + " " + row["address"]).strip(),
                       "status": "", "equipment": [], "total": 0.0}
                patients.append(cur)
                if MONEY.match(row["total"]):
                    cur["total"] += money(row["total"])
                continue
        if cur is None:
            continue

        # status letter alone in the patient column
        if row["patient"] in STATUS_CODES and not eq:
            cur["status"] = row["patient"]

        # count $ only on genuine line items (rows with equipment text); this
        # excludes the invoice footer Sub-Total / TOTAL AMT rows.
        if eq and MONEY.match(row["total"]):
            cur["total"] += money(row["total"])

        if eq and not DROP_EQUIP.search(eq):
            if row["qty"].strip() == "0":     # not on service this cycle
                continue
            item = STRIP_PREFIX.sub("", eq).strip()
            if item:
                cur["equipment"].append(item)

    # de-dupe equipment, preserve order
    for p in patients:
        seen, clean = set(), []
        for e in p["equipment"]:
            k = e.lower()
            if k not in seen:
                seen.add(k); clean.append(e)
        p["equipment"] = clean
    return patients

# ------------------------------------------------------------------- render
HTML_TMPL = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Reliant Medical Supply — by Patient</title>
<style>
 body{{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;margin:24px;}}
 h1{{color:#1F3864;font-size:18px;margin:0 0 2px;}}
 .sub{{color:#555;font-size:12px;margin:0 0 16px;}}
 table{{border-collapse:collapse;width:100%;font-size:13px;}}
 th,td{{border:1px solid #cfd6e4;padding:8px 10px;vertical-align:top;}}
 th{{background:#1F3864;color:#fff;text-align:left;}}
 th.total,td.total{{text-align:right;}}
 td.total{{white-space:nowrap;font-variant-numeric:tabular-nums;}}
 tr:nth-child(even) td{{background:#f4f6fb;}}
 .patient{{font-weight:bold;white-space:nowrap;}}
 tfoot td{{font-weight:bold;background:#D9E1F2;}}
</style></head><body>
<h1>Reliant Medical Supply — Invoice: {period}</h1>
<p class="sub">Haloes Touch Hospice Inc. &middot; by patient</p>
<table><thead>
<tr><th>Patient</th><th>Equipment Description</th><th class="total">Total</th></tr>
</thead><tbody>
{rows}
</tbody><tfoot>
<tr><td colspan="2">Sub-Total</td><td class="total">${subtotal:,.2f}</td></tr>
</tfoot></table></body></html>
"""
def render_html(patients, period, subtotal):
    trs = []
    for p in patients:
        eq = html.escape("; ".join(p["equipment"]))
        trs.append(f'<tr><td class="patient">{html.escape(p["patient"])}</td>'
                   f'<td>{eq}</td><td class="total">${p["total"]:,.2f}</td></tr>')
    return HTML_TMPL.format(period=period, rows="\n".join(trs), subtotal=subtotal)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--out", default=None)
    ap.add_argument("--period", default="June 2026")
    args = ap.parse_args()

    rows = parse_rows(args.pdf)
    patients = group_patients(rows)
    subtotal = sum(p["total"] for p in patients)

    stem = os.path.splitext(os.path.basename(args.pdf))[0]
    outdir = args.out or os.path.dirname(os.path.abspath(args.pdf))
    os.makedirs(outdir, exist_ok=True)

    with open(os.path.join(outdir, f"{stem}_line_items.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow([n for n, _, _ in BANDS])
        for r in rows: w.writerow([r[n] for n, _, _ in BANDS])

    with open(os.path.join(outdir, f"{stem}_by_patient.json"), "w") as f:
        json.dump([{"patient": p["patient"], "status": p["status"],
                    "address": p["address"], "equipment": p["equipment"],
                    "total": round(p["total"], 2)} for p in patients], f, indent=2)

    with open(os.path.join(outdir, f"{stem}_by_patient.html"), "w") as f:
        f.write(render_html(patients, args.period, subtotal))

    print(f"patients: {len(patients)}   sub-total: ${subtotal:,.2f}\n")
    for p in patients:
        print(f"  {p['patient']:<20} {p['status']:<3} ${p['total']:>8,.2f}  | "
              f"{'; '.join(p['equipment'])}")

if __name__ == "__main__":
    main()

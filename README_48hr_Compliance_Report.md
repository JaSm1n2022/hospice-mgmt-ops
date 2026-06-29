# 48-Hour Note Timeliness — Compliance Report Generator

Generates the HaloesTouch Hospice **48-hour note timeliness** compliance report directly from the HospiceMD Submission Report Excel export. Reading one `.xlsx` file produces:

1. A formatted Word report (`*_48hr_compliance_report.docx`)
2. A per-author compliance pie-chart grid (`*_pie_charts.png`), embedded in the report

---

## 1. What it measures

Each row in the export is a logged note action with a **Visit Date** and an **Action Date**. Timeliness is the gap between them:

```
lag (days) = Action Date − Visit Date
```

A note action is **compliant** when it is completed within 48 hours of the visit, treated as **2 calendar days or fewer**. A gap of **3 or more days is non-compliant**.

> The source log records dates only (no clock times), so the interval is computed in whole calendar days.

---

## 2. Inclusion / exclusion criteria

Scope is limited to clinical visit notes. The following `VISIT TYPE` values are **excluded**:

| Excluded VISIT TYPE |
|---|
| `PHYSICIANS ORDER` |
| `CERTIFICATION MD` |
| `IDG` |
| `CERTIFICATION REF` |
| `COMMUNICATION LOG` |

Everything else is included (e.g. `HA VISIT NOTES`, `VISIT NOTES`, `NURSING - *`, `PSYCHOSOCIAL - *`, `SPIRITUAL - *`, `BEREAVEMENT ASSESSMENT`, `INCIDENT/OCCURENCE`).

**Note status is *not* used as a filter** — every action row of an included visit type counts, regardless of whether it is `Note Created`, `QA Required`, `Electronically Signed`, etc.

To change scope, edit the `EXCLUDED_VISIT_TYPES` set at the top of the script.

---

## 3. Expected input format

First worksheet, with these columns (header row exactly as exported):

| Column | Example | Used for |
|---|---|---|
| `PATIENT` | `Goldberg, Charles` | — |
| `VISIT TYPE` | `HA VISIT NOTES` | inclusion filter |
| `VISIT DATE` | `06/28/26 - Sun` | timeliness start |
| `AUTHOR OF NOTE` | `Budde, Annaliza (HA)` | grouping |
| `NOTE STATUS` | `Electronically Signed, ...` | not filtered |
| `ACTION DATE` | `06/28/26 - Sun` | timeliness end |
| `PERFORMED BY` | `Budde, Annaliza (HA)` | — |

Dates arrive as `MM/DD/YY - DayAbbrev`; the parser keeps the date portion before `" - "`.

---

## 4. Output

- **Overall summary** — total actions, compliant %, non-compliant %.
- **Top Compliance Authors** — top 5 by on-time rate.
- **Compliance by Author** — every author ranked high→low, with a totals row. The `% Compliant` cell is colored green (≥80%), navy (50–79%), or red (<50%).
- **Visual** — donut per author (green = compliant, red = non-compliant) with the compliance rate in the center.

---

## 5. Setup (VS Code)

Requires Python 3.9+ and LibreOffice (only if you also want a PDF; the script itself does not need it).

```bash
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install pandas openpyxl python-docx matplotlib
```

Run:

```bash
python generate_compliance_report.py "SubmissionReport_HaloesTouch_Hospice_Inc__6_01_2026_6_29_2026.xlsx"
```

If no path is given it defaults to `SubmissionReport.xlsx` in the current folder. Output files are named after the input file's stem.

---

## 6. Reference implementation

Save as `generate_compliance_report.py`. This is the exact, verified logic used to produce the report.

```python
"""48-Hour Note Timeliness Compliance Report generator."""
import sys
from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL

# ---------------------------------------------------------------- CONFIG
EXCLUDED_VISIT_TYPES = {
    "PHYSICIANS ORDER", "CERTIFICATION MD", "IDG",
    "CERTIFICATION REF", "COMMUNICATION LOG",
}
COMPLIANCE_LIMIT_DAYS = 2          # within 48 hours = 2 calendar days or fewer
REPORT_PERIOD = "June 1 - June 29, 2026"
NAVY, GREEN, RED, GOLD = "1F3864", "548235", "C00000", "BF9000"

# ---------------------------------------------------------------- HELPERS
def parse_log_date(value):
    """Source dates look like '06/29/26 - Mon'. Keep the date part only."""
    text = str(value).split(" - ")[0].strip()
    return pd.to_datetime(text, format="%m/%d/%y", errors="coerce")

def clean_author(name):
    return str(name).replace(" ,", ",").strip()

# ---------------------------------------------------------------- ANALYSIS
def analyze(xlsx_path):
    df = pd.read_excel(xlsx_path)
    df = df[~df["VISIT TYPE"].isin(EXCLUDED_VISIT_TYPES)].copy()
    df["visit_date"] = df["VISIT DATE"].apply(parse_log_date)
    df["action_date"] = df["ACTION DATE"].apply(parse_log_date)
    df = df.dropna(subset=["visit_date", "action_date"]).copy()
    df["lag_days"] = (df["action_date"] - df["visit_date"]).dt.days
    df["non_compliant"] = df["lag_days"] > COMPLIANCE_LIMIT_DAYS

    total = len(df)
    nc = int(df["non_compliant"].sum())

    by_author = (
        df.groupby("AUTHOR OF NOTE")
          .agg(total=("non_compliant", "size"),
               non_compliant=("non_compliant", "sum"))
          .reset_index()
    )
    by_author["non_compliant"] = by_author["non_compliant"].astype(int)
    by_author["compliant"] = by_author["total"] - by_author["non_compliant"]
    by_author["comp_pct"] = (by_author["compliant"] / by_author["total"] * 100).round(1)
    by_author["author"] = by_author["AUTHOR OF NOTE"].apply(clean_author)
    by_author = by_author.sort_values(["comp_pct", "total"], ascending=[False, False])

    return {
        "total": total, "non_compliant": nc, "compliant": total - nc,
        "comp_pct": round((total - nc) / total * 100, 1),
        "nc_pct": round(nc / total * 100, 1),
        "authors": by_author.reset_index(drop=True),
    }

# ---------------------------------------------------------------- CHART
def build_chart(authors, summary, out_png):
    import math
    cols = 4
    rows = math.ceil(len(authors) / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(cols * 3.1, rows * 3.3))
    fig.patch.set_facecolor("white")
    axes = axes.flatten()
    for i, a in authors.iterrows():
        ax = axes[i]
        ax.pie([a.compliant, a.non_compliant], colors=["#" + GREEN, "#" + RED],
               startangle=90, counterclock=False,
               wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))
        cp = a.comp_pct
        color = "#" + (GREEN if cp >= 80 else NAVY if cp >= 50 else RED)
        ax.text(0, 0.08, f"{cp:.0f}%", ha="center", va="center",
                fontsize=19, fontweight="bold", color=color)
        ax.text(0, -0.20, "compliant", ha="center", va="center", fontsize=8, color="#7f7f7f")
        ax.set_title(a.author, fontsize=11, fontweight="bold", color="#" + NAVY, pad=8)
        ax.text(0.5, -0.16, f"{a.compliant} within 48h  \u00b7  {a.non_compliant} over",
                transform=ax.transAxes, ha="center", va="top", fontsize=8.5, color="#404040")
        ax.set_aspect("equal")
    for j in range(len(authors), len(axes)):
        axes[j].axis("off")
    fig.suptitle("48-Hour Note Timeliness by Author \u2014 Compliance Rate",
                 fontsize=16, fontweight="bold", color="#" + NAVY, y=0.995)
    fig.text(0.5, 0.965,
             f"HaloesTouch Hospice Inc.  |  {REPORT_PERIOD}  |  "
             f"Overall compliance {summary['comp_pct']:.1f}% "
             f"({summary['compliant']} of {summary['total']} note actions within 48 hrs)",
             ha="center", fontsize=10, color="#595959")
    fig.legend(handles=[Patch(facecolor="#" + GREEN, label="Compliant (\u2264 48 hrs)"),
                        Patch(facecolor="#" + RED, label="Non-compliant (> 48 hrs)")],
               loc="lower center", ncol=2, frameon=False, fontsize=11,
               bbox_to_anchor=(0.5, 0.005))
    plt.tight_layout(rect=[0, 0.04, 1, 0.95])
    plt.savefig(out_png, dpi=170, facecolor="white", bbox_inches="tight")
    plt.close(fig)

# ---------------------------------------------------------------- DOCX
def shade_cell(cell, hex_fill):
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear")
    sh.set(qn("w:fill"), hex_fill)
    cell._tc.get_or_add_tcPr().append(sh)

def set_run(run, size=11, bold=False, color="000000"):
    run.font.name = "Arial"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = RGBColor.from_string(color)

def add_heading(doc, text):
    p = doc.add_paragraph()
    set_run(p.add_run(text), size=13, bold=True, color=NAVY)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(7)

def fill_table(table, headers, rows, col_color=None):
    table.style = "Table Grid"
    hdr = table.rows[0].cells
    for j, h in enumerate(headers):
        hdr[j].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        shade_cell(hdr[j], "D9E2F3")
        run = hdr[j].paragraphs[0].add_run(h)
        set_run(run, size=9, bold=True)
        if j > 0:
            hdr[j].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r, row in enumerate(rows):
        cells = table.add_row().cells
        stripe = "F2F2F2" if r % 2 else "FFFFFF"
        for j, val in enumerate(row):
            shade_cell(cells[j], stripe)
            run = cells[j].paragraphs[0].add_run(str(val))
            color = col_color(j, val, row) if col_color else "000000"
            set_run(run, size=9, bold=(j == len(row) - 1), color=color)
            if j > 0:
                cells[j].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

def build_report(summary, chart_png, out_docx):
    authors = summary["authors"]
    doc = Document()
    doc.styles["Normal"].font.name = "Arial"
    doc.styles["Normal"].font.size = Pt(11)

    title = doc.add_paragraph()
    set_run(title.add_run("48-Hour Note Timeliness \u2014 Compliance Report"),
            size=18, bold=True, color=NAVY)
    sub = doc.add_paragraph()
    set_run(sub.add_run(f"Reporting period: {REPORT_PERIOD}"), size=9, color="595959")
    note = doc.add_paragraph()
    r = note.add_run("Scope: clinical visit notes only. Physician orders, certifications, "
                     "IDG, and communication logs are excluded.")
    set_run(r, size=9, color="595959"); r.font.italic = True

    add_heading(doc, "Overall Summary")
    p = doc.add_paragraph()
    set_run(p.add_run(f"Of {summary['total']} clinical note actions, "), size=11)
    set_run(p.add_run(f"{summary['compliant']} ({summary['comp_pct']:.1f}%) "
                      "were completed within 48 hours"), size=11, bold=True, color=GREEN)
    set_run(p.add_run(" and are compliant. The remaining "), size=11)
    set_run(p.add_run(f"{summary['non_compliant']} ({summary['nc_pct']:.1f}%) exceeded 48 hours"),
            size=11, bold=True, color=RED)
    set_run(p.add_run(" and are non-compliant."), size=11)

    add_heading(doc, "Top Compliance Authors")
    top = authors.head(5)
    t = doc.add_table(rows=1, cols=5)
    fill_table(t, ["Rank", "Author", "Actions", "Within 48 hrs", "% Compliant"],
               [[i + 1, a.author, a.total, a.compliant, f"{a.comp_pct:.1f}%"]
                for i, a in top.iterrows()],
               col_color=lambda j, v, row: GREEN if j == 4 else "000000")

    add_heading(doc, "Compliance by Author")
    t2 = doc.add_table(rows=1, cols=5)
    body = [[a.author, a.total, a.compliant, a.non_compliant, f"{a.comp_pct:.1f}%"]
            for _, a in authors.iterrows()]
    def pct_color(j, v, row):
        if j != 4:
            return "000000"
        cp = float(str(v).rstrip("%"))
        return GREEN if cp >= 80 else NAVY if cp >= 50 else RED
    fill_table(t2, ["Author of Note", "Total Actions", "Within 48 hrs", ">48 hrs", "% Compliant"],
               body, col_color=pct_color)
    total_cells = t2.add_row().cells
    for j, val in enumerate(["ALL AUTHORS", summary["total"], summary["compliant"],
                             summary["non_compliant"], f"{summary['comp_pct']:.1f}%"]):
        shade_cell(total_cells[j], "D9E2F3")
        run = total_cells[j].paragraphs[0].add_run(str(val))
        set_run(run, size=9, bold=True, color=(GREEN if j == 4 else "000000"))
        if j > 0:
            total_cells[j].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_page_break()
    add_heading(doc, "Compliance by Author \u2014 Visual")
    doc.add_picture(chart_png, width=Inches(6.0))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.save(out_docx)

# ---------------------------------------------------------------- MAIN
def main(xlsx_path):
    stem = Path(xlsx_path).stem
    chart_png = f"{stem}_pie_charts.png"
    out_docx = f"{stem}_48hr_compliance_report.docx"
    summary = analyze(xlsx_path)
    build_chart(summary["authors"], summary, chart_png)
    build_report(summary, chart_png, out_docx)
    print(f"Overall compliance: {summary['comp_pct']:.1f}% "
          f"({summary['compliant']}/{summary['total']})")
    print(f"Report : {out_docx}")
    print(f"Chart  : {chart_png}")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "SubmissionReport.xlsx")
```

---

## 7. Adjusting the logic

| To change... | Edit |
|---|---|
| Which visit types are excluded | `EXCLUDED_VISIT_TYPES` |
| The 48-hour threshold (e.g. count day-2 as late) | `COMPLIANCE_LIMIT_DAYS` (set to `1` for a stricter <48h rule) |
| Reporting period label | `REPORT_PERIOD` |
| Color thresholds (green/navy/red) | the `comp_pct` conditions in `build_chart` / `pct_color` |
| Number of top performers shown | `authors.head(5)` |

---

## 8. Verification

Run against the June 1–29, 2026 export, the expected result is:

```
Overall compliance: 48.2% (404/838)
```

with **Budde, Annaliza (HA)** and **Radford, Elvira (RN)** at 100%. If your numbers differ, check that the column headers match Section 3 and that no extra visit types slipped through the filter.

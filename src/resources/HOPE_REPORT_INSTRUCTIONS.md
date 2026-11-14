# HOPE Report PDF: Instructions for Claude Code

Generate the **Haloes Touch Hospice Inc. HOPE Tracking Report** as a PDF with Python + ReportLab.
`hope_report.py` is the working reference implementation. Change it; don't rewrite it from scratch.
The current output is approved. Keep the layout, colors and section order unless the user asks for a change.

---

## 1. Project layout

```
hope-report/
├── HOPE_REPORT_INSTRUCTIONS.md   ← this file
├── hope_report.py                ← reference generator (ReportLab)
├── assets/
│   └── hthlogo.png               ← company logo (REQUIRED)
├── data/
│   └── patients.json             ← input data (see §6)
└── output/                       ← generated PDFs
```

Setup: `pip install reportlab pillow` (add `--break-system-packages` if pip refuses).

---

## 2. Logo: required on every page

- **File:** `assets/hthlogo.png` (gold tree-of-hands mark, RGBA, white background).
- The path can be overridden with the env var `HTH_LOGO`. Always resolve it relative to the script's folder, not the current working directory.
- **Placement:** top-left of the light green header band on **every page**, drawn in the `onPage` callback, not in the story.
  - White circle, radius **19 pt**, outline `#5A9A68` at 1.2 pt.
  - Logo centered in the circle at about **28 × 27 pt**, using `preserveAspectRatio=True, mask="auto"`.
  - The company name text starts **48 pt** to the right of the left margin, so it clears the circle.
- **Never** stretch, recolor, crop, rotate or add effects to the logo.
- **Never** write the name as "HaloesTouch". It is always **"Haloes Touch Hospice Inc."** (two words).
- If the logo file is missing, fall back to "HT" text in the circle and **print a warning**. Don't fail silently.
- The current PNG is small (92 × 89 px). If the user supplies a higher-resolution or SVG version, swap it in at the same size and position.

---

## 3. Brand and page setup

| Token | Hex | Use |
|---|---|---|
| GREEN | `#2E6B3F` | Titles, table headers, primary text accents |
| GREEN_MID | `#5A9A68` | Header underline, HUV window headers, progress bar |
| GREEN_LIGHT | `#DDEFD9` | Header band, phase card headers, "Completed" chip |
| GREEN_PALE | `#F3F9F1` | Patient strip, label columns, signature area |
| INK | `#22302A` | Body text |
| MUTED | `#6B7B72` | Labels, captions, footer |
| LINE | `#C9DCC6` | Borders and grid lines |
| AMBER / bg | `#C98A12` / `#FDF3DE` | "Due Soon" |
| BLUE / bg | `#3B6EA5` / `#E6EEF8` | "Upcoming" / "Pending" |
| RED / bg | `#B23B3B` / `#F9E4E4` | "Overdue" / "Rejected" |

- **Page:** US Letter **landscape**, 0.55 in side margins. Light backgrounds only; never use dark fills for page areas.
- **Fonts:** Helvetica family (built-in). Don't use Unicode subscript or superscript glyphs, or symbol glyphs such as ■ or ●; they render as boxes.
- **Header band** (62 pt tall, `GREEN_LIGHT`, 2 pt `GREEN_MID` rule underneath):
  - Left side: the logo, then "Haloes Touch Hospice Inc." and the address 11500 S. Eastern Ave., Ste. 150, Henderson, NV 89052.
  - Right side: "HOPE Tracking Report" with the subtitle "Hospice Outcomes & Patient Evaluation".
- **Footer:**
  - Left: "CONFIDENTIAL — Contains PHI. For internal QAPI use only." Add "• Mock data for layout review" only when the data is mock.
  - Right: "Page N".

---

## 4. Report sections (in this order)

1. **Title:** "HOPE Report", with the subtitle line underneath it.
2. **Patient strip:** six cells: Patient, MRN, Primary Dx, Level of Care, Case Manager, Report Date.
3. **HOPE Progress Board:** a 9-column timeline table.

   | Col | Header | Sub-label | Target date rule |
   |---|---|---|---|
   | 1 | Admit | Admit Date | admit |
   | 2 | Day 2 | SFV Due | admit + 2 |
   | 3 | Day 5 | Comprehensive Assessment | admit + 5 |
   | 4 | Day 6-12 | HUV1 Window | admit + 6 → admit + 12 (shown `MM/DD-MM/DD`) |
   | 5 | Day 13 | SFV Due | admit + 13 |
   | 6 | Day 15 | HUV1 Completed | admit + 15 |
   | 7 | Day 16-22 | HUV2 Window | admit + 16 → admit + 22 |
   | 8 | Day 28 | SFV Due | admit + 28 |
   | 9 | Day 30 | HUV2 Completed | admit + 30 |

   - **Rows:** Target Date, Actual Date, Status (rounded chip).
   - **Colors:** the header row is `GREEN`; the two window columns are `GREEN_MID`.
   - **Underneath the table:** "X of 9 milestones complete (NN%)", a progress bar, and a color-word legend.
   - **Day counting:** the admit date is **Day 0**. Make this a single constant (`DAY_OFFSET = 0`) so it can be changed to 1 if the agency counts the admit date as Day 1.
4. **Actual Visit Record:** four equal-width cards side by side.
   - **Admission** (tag HOPE-A): Admit Date, Symptoms (Impact), SFV Visit
   - **HUV1** (tag Day 6-15): HUV Visit, Symptoms (Impact), SFV1 Visit
   - **HUV2** (tag Day 16-30): HUV Visit, Symptoms (Impact), SFV2 Visit
   - **Discharge** (tag HOPE-D): Discharge Date, Reason
5. **iQIES Submission:** a table with the columns Record, Accepted Date and Result (chip). The rows are Admission, HUV1, HUV2 and Discharge.
6. **iQIES Exceptions & Corrective Actions:** placed beside section 5, with three label/value rows:
   - Issue Affected / Reasons
   - Root Cause
   - Action / Owner

   When there is no value, show an underlined blank line so the field can be filled in by hand.
7. **Review & Approval:** three blocks: **Prepared By**, **Administrator**, **DPCS**.
   - Each block has a signature/printed-name line and a **separate** date line, with a gap between the two lines.
   - Wrap the section in `KeepTogether` so it never splits across pages.

---

## 5. Status logic

Evaluate status against `report_date` (default: today).

| Condition | Status |
|---|---|
| Actual date present | **Completed** |
| No actual date, and report_date > target (or window end) | **Overdue** |
| No actual date, and target is within 7 days | **Due Soon** |
| Otherwise | **Upcoming** |

The iQIES Result values are Accepted, Accepted w/ Warning, Rejected, Pending and N/A. Use the matching chip colors from §3.

If a patient is discharged before a milestone's target date, show "N/A" for that milestone and use a grey chip.

---

## 6. Input data (`data/patients.json`)

```json
[
  {
    "patient": "Doe, Jane", "mrn": "HT-000123",
    "primary_dx": "G30.1 Alzheimer's, late onset",
    "level_of_care": "Routine Home Care", "case_manager": "RN Name",
    "admit_date": "2026-10-20", "report_date": "2026-11-12",
    "actuals": {
      "sfv_day2": "2026-10-21", "comprehensive": "2026-10-24",
      "huv1": "2026-10-29", "sfv_day13": "2026-10-31",
      "huv1_completed": "2026-10-29", "huv2": "2026-11-08",
      "sfv_day28": null, "huv2_completed": null
    },
    "admission": { "symptoms": "Pain — moderate; Dyspnea — mild", "sfv_visit": "2026-10-21", "sfv_note": "completed by RN" },
    "huv1": { "visit": "2026-10-29", "symptoms": "...", "sfv_visit": "2026-10-31" },
    "huv2": { "visit": "2026-11-08", "symptoms": "...", "sfv_visit": null },
    "discharge": { "date": null, "reason": null },
    "iqies": {
      "admission": { "accepted": "2026-10-28", "result": "Accepted" },
      "huv1": { "accepted": "2026-11-05", "result": "Accepted w/ Warning" },
      "huv2": { "accepted": null, "result": "Pending" },
      "discharge": { "accepted": null, "result": "N/A" }
    },
    "exceptions": { "issue": "", "root_cause": "", "action_owner": "" }
  }
]
```

- Accept the same fields from CSV or Excel if the user provides those instead.
- Show missing values as "—". Exception fields stay as blank write-in lines.
- Display dates as `MM/DD/YYYY`.

---

## 7. Commands

```bash
# one PDF per patient → output/HOPE_<MRN>_<admitYYYYMMDD>.pdf
python hope_report.py --data data/patients.json --out output/

# mock/layout preview
python hope_report.py --mock --out output/
```

Add argparse for `--data`, `--out` and `--mock` if they are missing. Keep `HTH_LOGO` and `HOPE_OUT` as env-var overrides.

---

## 8. Verify before handing off

1. Render each page to PNG (`pdftoppm -png -r 80 file.pdf preview`) and inspect it visually.
2. Check that:
   - The logo shows on **every** page, crisp and not distorted.
   - No text overlaps or is clipped in the board headers, chips or signature blocks.
   - The status chips match the §5 logic for the report date.
   - The Review & Approval section is not split across pages.
3. Never commit real patient PDFs or PHI data files to git. Add `output/` and `data/*.json` to `.gitignore`. Mock data is fine.

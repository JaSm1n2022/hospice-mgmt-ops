# Roster Button: HSP1-2A Clinical Staff Roster PDF

## 1. Goal

Add a **"Roster"** button to the existing HR / onboarding screen. Clicking it generates one PDF (US Letter, landscape) with four sections, each starting on a new page:

| Page | Title | Who is included |
|---|---|---|
| 1 | Clinical Employees (Core Services) | Active W-2 clinical staff: DPCS, RN, LPN, MSW, Chaplain |
| 2 | Contracted Clinical Staff | Active direct-care contractors: Medical Director, NP, PT/OT/SLP, Dietitian |
| 3 | Hospice Aides | Active CNAs / hospice aides |
| 4 | Volunteers | Active volunteers |

The PDF must match the design of the existing "HSP1-2A Clinical Staff Roster" deck (light green header, dark green titles, Poppins font). This is the document handed to the ACHC surveyor, so accuracy and consistency matter more than anything else.

**Rules that apply to every page:**

- **Active only.** Include staff whose `status === 'active'` as of the report date. Separated staff never appear.
- **No sensitive data.** Never print SSN, date of birth, home address, driver's license number, or bank details.
- **Names must match.** Print names exactly as they appear on the license and in HospiceMD signatures. The system must not re-format them.
- **Overflow.** If a section has more rows than fit on one page, it continues onto the next page. The header bar, section title, and table header row repeat on each continuation page.

Use the existing dependency `@react-pdf/renderer` (v2.3). No new packages are needed.

---

## 2. Design tokens

Use these exact values so the PDF matches the deck.

```js
// src/views/Roster/rosterTheme.js
export const C = {
  headerBg:     '#E3F1E3', // top header bar
  headerBorder: '#9FD09F', // line under header bar
  brandDark:    '#1B5E20', // "Haloes Touch", page titles
  brandMid:     '#2E7D32', // "Hospice Inc."
  kicker:       '#4C8C4F', // small uppercase label above title
  text:         '#1F2A24', // body text
  muted:        '#6A7A6D', // footer, sample/helper text
  tableHeadBg:  '#F1F8F1',
  tableHeadTx:  '#2E5A31',
  tableBorder:  '#CFE3CF', // outer border, header underline
  rowBorder:    '#E4EFE4', // row and cell dividers
  noteBg:       '#F1F8F1',
  noteBar:      '#66BB6A', // left bar on note boxes
  pillBorder:   '#9FBFA0',
  // status flags
  expiredTx:    '#B71C1C', expiredBg: '#FDECEA',
  dueSoonTx:    '#8A5300', dueSoonBg: '#FFF4E0',
  missingTx:    '#B71C1C',
};

export const PAGE = { size: 'LETTER', orientation: 'landscape' }; // 792 x 612 pt
export const MARGIN_X = 32;   // ~0.45 in
export const DUE_SOON_DAYS = 60;
```

**Font:** Poppins (Regular 400, Medium 500, SemiBold 600, Bold 700). Put the `.ttf` files in `src/assets/fonts/` and register them once:

```js
import { Font } from '@react-pdf/renderer';
import PoppinsRegular from 'assets/fonts/Poppins-Regular.ttf';
import PoppinsMedium from 'assets/fonts/Poppins-Medium.ttf';
import PoppinsSemiBold from 'assets/fonts/Poppins-SemiBold.ttf';
import PoppinsBold from 'assets/fonts/Poppins-Bold.ttf';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: PoppinsRegular, fontWeight: 400 },
    { src: PoppinsMedium, fontWeight: 500 },
    { src: PoppinsSemiBold, fontWeight: 600 },
    { src: PoppinsBold, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]); // stop names breaking mid-word
```

`file-loader` is already installed, so the `.ttf` imports resolve to URLs. If fonts fail to load, fall back to `Helvetica`; never ship a PDF with missing glyphs.

---

## 3. Page layout (same on all four sections)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Haloes Touch Hospice Inc.                          ( ACHC · HSP1-2A )│ ← header bar, fixed
├──────────────────────────────────────────────────────────────────────┤
│ CLINICAL STAFF ROSTER · SECTION A                                    │ ← kicker
│ Clinical Employees (Core Services)                                   │ ← title
│ Lead sentence (one line)                                             │
│ As of: 11/20/2026   Prepared by: ______   Reviewed by (Admin): _____ │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ table header row (repeats on overflow pages)                     │ │
│ │ data rows …                                                      │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ ▌ Footnote box for this section                                      │
│ Legend: ■ Expired  ■ Due within 60 days  MISSING = required, blank   │
├──────────────────────────────────────────────────────────────────────┤
│ HSP1-2A Clinical Staff Roster · Internal use        Page 1 of 4      │ ← footer, fixed
└──────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Header bar | Height 44pt, full width, bg `headerBg`, 1.5pt bottom border `headerBorder`, horizontal padding `MARGIN_X`. Left side: **"Haloes Touch"** (Bold 700, `brandDark`) + " Hospice Inc." (Regular, `brandMid`), 14pt. Right side: pill "ACHC · HSP1-2A", 7.5pt, white bg, 1pt `pillBorder`, border radius 10, padding 3×10. |
| Kicker | 7.5pt, Medium, `kicker`, uppercase, letterSpacing 1.5. Text: `CLINICAL STAFF ROSTER · SECTION A` (B, C, D). |
| Title | 22pt, Bold, `brandDark`, margin top 2, bottom 4. |
| Lead | 9.5pt, `text`, one sentence (see section 6). |
| As-of line | 8.5pt, `text`. As of = report date (MM/DD/YYYY). Prepared by / Reviewed by stay as blank lines for wet signatures. |
| Table | Full width, 1pt `tableBorder` outer border. Header cells: bg `tableHeadBg`, SemiBold 7.5pt, `tableHeadTx`, padding 4. Body cells: Regular 7.5pt, `text`, padding 4, min row height 22pt, 0.5pt `rowBorder` right and bottom dividers. |
| Footnote box | bg `noteBg`, 3pt left border `noteBar`, padding 6×10, 8pt, margin top 8. |
| Legend | 7pt, `muted`, small colored squares matching the flag colors. |
| Footer | Fixed at bottom, 0.5pt top border `tableBorder`, 7pt `muted`. Left: "HSP1-2A Clinical Staff Roster · Internal use". Right: `Page {pageNumber} of {totalPages}` using the react-pdf `render` prop. |

**Dates:** always `MM/DD/YYYY` (use `date-fns` `format(date, 'MM/dd/yyyy')`). "Next due" columns may show `MM/YYYY`.

**react-pdf v2 notes:**
- `gap` is not supported in v2. Use `marginRight` / `marginBottom` instead.
- Use percentage widths on cells (`width: '12%'`). Widths in each table must add up to 100%.
- Put `wrap={false}` on each table row so a row never splits across pages.
- Put `fixed` on the header bar, footer, and the block containing kicker + title + as-of + table header row, so they repeat on continuation pages.

---

## 4. Status flags (cell coloring)

Every date column that expires or comes due gets a status, computed against the report date (`asOf`):

```js
// src/views/Roster/rosterStatus.js
import { differenceInCalendarDays, addMonths } from 'date-fns';

export function flag(date, asOf, dueSoonDays = 60) {
  if (!date) return 'missing';
  const d = differenceInCalendarDays(new Date(date), asOf);
  if (d < 0) return 'expired';
  if (d <= dueSoonDays) return 'dueSoon';
  return 'ok';
}

// Annual items stored as "last done" date: due 12 months later
export const nextAnnual = (lastDate) => (lastDate ? addMonths(new Date(lastDate), 12) : null);
```

| Status | Cell style | Cell text |
|---|---|---|
| `ok` | normal | the date |
| `dueSoon` | bg `dueSoonBg`, text `dueSoonTx`, SemiBold | the date |
| `expired` | bg `expiredBg`, text `expiredTx`, SemiBold | the date |
| `missing` (required item) | text `missingTx`, SemiBold | `MISSING` |
| not applicable | `muted` | `N/A` |

A column marked **"Flag"** in section 5 uses this logic. Completed-date columns with no expiry (e.g., Initial competency) only show `MISSING` when blank.

---

## 5. Columns and field mapping

Field names below are the **normalized** names the PDF component expects. Write one adapter (`buildRosterModel`, section 7) that maps your existing database fields into this shape; don't change the PDF components to fit the database.

### Page 1: Clinical Employees (Core Services)

**Include:** `status = active` AND `employmentType = 'W-2'` AND `category = 'clinical_employee'` (DPCS, RN, LPN, MSW, Chaplain, and any clinical QA nurse).
**Sort:** by role order DPCS → RN → LPN → MSW → Chaplain, then last name.

| # | Column header | Field | Width | Flag | Notes |
|---|---|---|---|---|---|
| 1 | Name & credentials | `displayName` + `, ` + `credentials` | 13% | | e.g., "Jane Doe, RN" |
| 2 | Discipline / position | `position` | 11% | | |
| 3 | Employment type | `employmentType` + schedule | 9% | | Print "W-2 Employee – Per Diem" / "W-2 Employee – Full-Time" |
| 4 | Hire date | `hireDate` | 7% | | |
| 5 | License # | `license.number` | 8% | | Chaplain: `N/A` |
| 6 | License exp. | `license.expirationDate` | 7.5% | Yes | Chaplain: `N/A` |
| 7 | Verified | `license.verifiedDate` | 7.5% | | `MISSING` if blank and license required |
| 8 | Initial comp. | `competency.initialDate` | 7.5% | | `MISSING` if blank |
| 9 | Last annual comp. | `competency.lastAnnualDate` | 7.5% | | Blank allowed if hired < 12 months ago (show "—") |
| 10 | Next due | `nextAnnual(lastAnnual ?? initial)` | 6.5% | Yes | Format `MM/YYYY` |
| 11 | CPR exp. | `cpr.expirationDate` | 7% | Yes | |
| 12 | File | `fileLocation` | 5.5% | | Default "HSP4" |

**Footnote:** "Core services (nursing, medical social services, spiritual counseling) must be provided by Haloes Touch employees. License verification is the date of the primary-source check on the state board website; the printout is in each personnel file. Chaplain: no state license; ordination/credentials are on file."

### Page 2: Contracted Clinical Staff

**Include:** `status = active` AND `employmentType = 'Contractor'` AND `category = 'contractor'`. Administrative contractors are excluded.
**Sort:** Medical Director first, then NP, then therapy, then dietitian, then last name.

| # | Column header | Field | Width | Flag | Notes |
|---|---|---|---|---|---|
| 1 | Name & credentials | `displayName`, `credentials` | 14% | | |
| 2 | Service | `service` | 11% | | e.g., "Medical Director", "Nurse Practitioner", "Dietitian". Never print just "Contractor" |
| 3 | Company / individual | `contractParty` | 11% | | Company name, or "Individual" |
| 4 | Contract date | `contract.effectiveDate` | 9% | | `MISSING` if blank |
| 5 | Contract exp. | `contract.expirationDate` | 9% | Yes | If auto-renewing, print "Auto-renew" |
| 6 | License # | `license.number` | 9% | | |
| 7 | License exp. | `license.expirationDate` | 9% | Yes | |
| 8 | Verified | `license.verifiedDate` | 9% | | |
| 9 | Orientation | `orientationDate` | 10% | | |
| 10 | File | `fileLocation` | 9% | | Default "HSP1" (contract log) |

**Footnote:** "Non-core and physician services may be contracted, but Haloes Touch keeps professional and administrative responsibility for them. Each contract is listed in the contract log (HSP1); licenses are verified the same way as for employees."

### Page 3: Hospice Aides

**Include:** `status = active` AND `category = 'aide'` (position "Certified Nurse Assistant" / "Hospice Aide").
**Sort:** last name.

| # | Column header | Field | Width | Flag | Notes |
|---|---|---|---|---|---|
| 1 | Name | `displayName`, `credentials` | 13% | | |
| 2 | Employment type | `employmentType` + schedule | 10% | | |
| 3 | Hire date | `hireDate` | 8% | | |
| 4 | Certification # | `certification.number` | 10% | | |
| 5 | Cert. exp. | `certification.expirationDate` | 8% | Yes | An expired aide certification is the most serious flag in the report |
| 6 | Verified | `certification.verifiedDate` | 8% | | |
| 7 | Competency evaluation | `competency.initialDate` | 11% | | Must be before first independent visit |
| 8 | In-service hrs (last 12 mo.) | `inserviceHours12mo` | 11% | | Print `"9.5 / 12"`. Red if < 12 **and** hired ≥ 12 months ago |
| 9 | Annual on-site supervision | `supervision.lastAnnualDate` | 12% | Yes* | *Flag on `nextAnnual(date)`; "—" if hired < 12 months ago |
| 10 | File | `fileLocation` | 9% | | Default "HSP4" |

**Footnote:** "Aides are checked under the aide standards: competency evaluation before independent care, at least 12 hours of in-service in each 12-month period, and annual on-site supervision while giving care. The 14-day supervisory visits are per patient and are shown in the chart samples, not here."

### Page 4: Volunteers

**Include:** `status = active` AND `category = 'volunteer'`.
**Sort:** role (patient care first), then last name.

| # | Column header | Field | Width | Flag | Notes |
|---|---|---|---|---|---|
| 1 | Name | `displayName` | 12% | | |
| 2 | Volunteer role | `volunteerRole` | 13% | | "Patient care" or "Administrative support" (+ optional detail) |
| 3 | Start date | `startDate` | 8% | | |
| 4 | Orientation & training | `orientationDate` | 10% | | `MISSING` if blank; required before patient contact |
| 5 | Background check | `backgroundCheckDate` | 10% | | |
| 6 | Health screening | `healthScreeningDate` | 9% | | Per policy (TB, etc.) |
| 7 | Confidentiality / HIPAA | `confidentialityDate` | 10% | | |
| 8 | Annual in-service | `lastInserviceDate` | 9% | Yes* | *Flag on `nextAnnual(date)` |
| 9 | Supervisor | `supervisorName` | 10% | | |
| 10 | Hours (period) | `hoursInPeriod` | 9% | | One decimal |

**Below the table**, if patient-care hours are available, print a summary box:

```
Volunteer hours (MM/DD/YYYY – MM/DD/YYYY): 120.0   |   Patient care hours: 2,000.0   |   Volunteer %: 6.0%  (requirement: ≥ 5%)
```

Show the percentage in red if below 5%. If patient-care hours aren't available, omit the box (don't print a fake number). Default period: the 12 months ending on the report date; make it a parameter.

**Empty state:** if there are no active volunteers, still print this page with one full-width row in red text: **"No active volunteers as of MM/DD/YYYY."** Never drop the page. An empty Section D is a finding the team needs to see.

**Footnote:** "Volunteers are neither employees nor contractors. The surveyor checks that each volunteer was screened, trained before working with patients or families, and supervised. Hours are kept in a separate hours log; volunteer hours must equal at least 5% of total patient care hours."

### Excluded from the roster

Administrative staff with no direct patient care (CEO, Administrator, Administrative Manager, Office Staff, Community Liaison) are **not** printed. They remain on the separate Personnel List. A person can be put back in by setting their `category` explicitly.

---

## 6. Lead sentences (under each title)

| Page | Lead |
|---|---|
| 1 | "Active Haloes Touch employees providing core services. Every clinician is a W-2 employee with a current, verified license and current competency." |
| 2 | "Active contracted clinical staff. Haloes Touch keeps responsibility for contracted services, so licenses are verified here too." |
| 3 | "Active hospice aides, with certification, competency, in-service hours, and annual supervision." |
| 4 | "Active volunteers, with screening, training, supervision, and hours for the period." |

---

## 7. Data model (adapter output)

`buildRosterModel(rawEmployees, { asOf, volunteerPeriod, patientCareHours })` returns:

```js
{
  asOf: Date,
  sections: {
    clinicalEmployees: RosterPerson[],
    contractors:       RosterPerson[],
    aides:             RosterPerson[],
    volunteers:        RosterPerson[],
  },
  volunteerSummary: { periodStart, periodEnd, volunteerHours, patientCareHours, percent } | null,
}

// RosterPerson (only fields needed for that section are required)
{
  id, displayName, credentials, position, category, // 'clinical_employee' | 'contractor' | 'aide' | 'volunteer' | 'admin'
  employmentType, schedule,                          // 'W-2' | 'Contractor' ; 'Full-Time' | 'Per Diem'
  hireDate, status, fileLocation,
  license:       { number, expirationDate, verifiedDate, verifiedBy } | null,
  certification: { number, expirationDate, verifiedDate } | null,
  competency:    { initialDate, lastAnnualDate } ,
  cpr:           { expirationDate } | null,
  contract:      { effectiveDate, expirationDate, autoRenew } | null,
  service, contractParty, orientationDate,
  inserviceHours12mo, supervision: { lastAnnualDate },
  volunteerRole, startDate, backgroundCheckDate, healthScreeningDate,
  confidentialityDate, lastInserviceDate, supervisorName, hoursInPeriod,
}
```

**Mapping from the existing onboarding checklist** (adjust names to your schema):

| Onboarding item | Roster field |
|---|---|
| License Verification (exp) | `license.expirationDate` (or `certification.expirationDate` for CNAs) |
| License Verification (new: number, verified-on, verified-by) | `license.number`, `.verifiedDate`, `.verifiedBy` |
| CPR Card (exp) | `cpr.expirationDate` |
| Competency Assessment (new: initial date, last annual date) | `competency.*` |
| Orientation (date) | `orientationDate` |
| In-Services (Annual) (new: hours + date) | `inserviceHours12mo`, `lastInserviceDate` |
| W-4 vs W-9 (split) or new Employment Type field | `employmentType` |
| Position / Discipline | `position`, used to derive `category` if not set explicitly |

**Category derivation** (only when `category` is not stored):

```js
const ROLE_ORDER = ['DPCS', 'RN', 'LPN', 'MSW', 'Chaplain'];
function deriveCategory(p) {
  if (p.isVolunteer) return 'volunteer';
  if (/nurse assistant|cna|hospice aide/i.test(p.position)) return 'aide';
  if (p.employmentType === 'Contractor' && p.isDirectCare) return 'contractor';
  if (/case manager|rn|lpn|msw|social work|chaplain|patient care services|clinician qa/i.test(p.position)) return 'clinical_employee';
  return 'admin';
}
```

Prefer an explicit `category` field on the employee record; the regex is only a fallback.

---

## 8. Component structure

```
src/views/Roster/
  RosterButton.js        // MUI button + click handler
  RosterDocument.js      // <Document> with the 4 section <Page>s
  RosterPage.js          // shared page frame: header bar, title block, footer
  RosterTable.js         // generic table: columns[] + rows[] → header row + data rows
  rosterColumns.js       // column definitions for the 4 sections (section 5)
  buildRosterModel.js    // adapter: raw data → model (section 7)
  rosterStatus.js        // flag() and nextAnnual() (section 4)
  rosterTheme.js         // colors, sizes, font registration (section 2)
```

**Column definition shape** (drives both header and cells):

```js
// rosterColumns.js
export const clinicalEmployeeColumns = [
  { header: 'Name & credentials', width: '13%', value: (p) => `${p.displayName}${p.credentials ? ', ' + p.credentials : ''}` },
  { header: 'Discipline / position', width: '11%', value: (p) => p.position },
  { header: 'Employment type', width: '9%', value: (p) => `W-2 Employee – ${p.schedule}` },
  { header: 'Hire date', width: '7%', date: (p) => p.hireDate },
  { header: 'License #', width: '8%', value: (p) => (p.license ? p.license.number : 'N/A') },
  { header: 'License exp.', width: '7.5%', date: (p) => p.license?.expirationDate, flag: true, na: (p) => !p.license },
  // … remaining columns per section 5
];
```

`RosterTable` renders `value` as plain text, and `date` through `format()` + `flag()` when `flag: true`, or `MISSING` when required and blank.

**Document:**

```jsx
// RosterDocument.js
import { Document } from '@react-pdf/renderer';

export default function RosterDocument({ model }) {
  const { asOf, sections, volunteerSummary } = model;
  return (
    <Document title={`HSP1-2A Clinical Staff Roster – ${fmt(asOf)}`} author="Haloes Touch Hospice Inc.">
      <RosterPage section="A" title="Clinical Employees (Core Services)" lead={LEADS.A} asOf={asOf}
                  columns={clinicalEmployeeColumns} rows={sections.clinicalEmployees} footnote={NOTES.A} />
      <RosterPage section="B" title="Contracted Clinical Staff" lead={LEADS.B} asOf={asOf}
                  columns={contractorColumns} rows={sections.contractors} footnote={NOTES.B} />
      <RosterPage section="C" title="Hospice Aides" lead={LEADS.C} asOf={asOf}
                  columns={aideColumns} rows={sections.aides} footnote={NOTES.C} />
      <RosterPage section="D" title="Volunteers" lead={LEADS.D} asOf={asOf}
                  columns={volunteerColumns} rows={sections.volunteers} footnote={NOTES.D}
                  emptyText={`No active volunteers as of ${fmt(asOf)}.`} summary={volunteerSummary} />
    </Document>
  );
}
```

Each `RosterPage` is one react-pdf `<Page size="LETTER" orientation="landscape">`, so every section starts on a new page.

**Button:**

```jsx
// RosterButton.js
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export default function RosterButton({ fetchEmployees, fetchVolunteerHours }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      const asOf = new Date();
      const raw = await fetchEmployees();                 // existing Supabase query
      const hours = fetchVolunteerHours ? await fetchVolunteerHours(asOf) : null;
      const model = buildRosterModel(raw, { asOf, ...hours });
      const blob = await pdf(<RosterDocument model={model} />).toBlob();
      saveAs(blob, `HSP1-2A_Clinical_Staff_Roster_${format(asOf, 'yyyy-MM-dd')}.pdf`);
    } catch (e) {
      console.error('Roster generation failed', e);
      // show the app's existing toast: "Could not generate roster. Please try again."
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick} disabled={busy}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <AssignmentInd />}>
      Roster
    </Button>
  );
}
```

Optional: instead of downloading, open a preview with `window.open(URL.createObjectURL(blob))` so the user can check it before printing.

---

## 9. Acceptance checklist

- [ ] The button label reads **"Roster"** and is disabled with a spinner while generating.
- [ ] The PDF is US Letter landscape, with four sections in order A → D, each starting on a new page.
- [ ] Only active staff appear. A separated employee never shows up, even with complete data.
- [ ] Admin roles (CEO, Administrator, Administrative Manager, Office Staff, Community Liaison) are excluded.
- [ ] Header bar, title block, table header, and footer repeat on overflow pages; rows never split.
- [ ] "Page X of Y" is correct across the whole document.
- [ ] Expired dates are red, dates within 60 days are amber, and required blanks print `MISSING`.
- [ ] Chaplain shows `N/A` for license number and expiration, not `MISSING`.
- [ ] Contractors never show "Contractor" as their service; a blank service prints `MISSING`.
- [ ] The Volunteers page prints even when empty, with the red "No active volunteers" row.
- [ ] No SSN, DOB, address, or driver's license number anywhere in the PDF.
- [ ] Names print exactly as stored (no auto-capitalization or reordering).
- [ ] Fonts are Poppins; colors match section 2.
- [ ] Filename: `HSP1-2A_Clinical_Staff_Roster_YYYY-MM-DD.pdf`.

**Test data to try:** one person per section; a section with 25+ rows (overflow); an expired aide certification; a chaplain; a contractor with a blank service; zero volunteers; a person with status "separated".

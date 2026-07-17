# QA Monitoring — Excel Import → Review Modal → `qa_monitoring`

Feature spec for the QA Monitoring import flow. Stack assumed: React + Vite + TypeScript + Supabase, SheetJS (`xlsx`) for parsing.

---

## 1. Goal

1. User uploads an Excel file.
2. Parsed rows open in a **modal** as an editable table.
3. Each row gets two extra **listbox (select) columns** the user fills in:
   - **PatientCd** — sourced from the `patients` table.
   - **Discipline** — sourced from the `employees` table (CNA, RN, MSW, Chaplain).
4. **Save/Submit** inserts the mapped rows into `qa_monitoring`.

---

## 2. Decisions to confirm before building

These change the schema mapping, so lock them down first.

**D1 — What does "Discipline" store?**
`qa_monitoring` has both `disciplineId` (bigint) and `discipline_name` (text). Two readings of "Discipline is from employees":
- **(a) Discipline category** — the listbox lists the four roles (CNA / RN / MSW / Chaplain). Sets `discipline_name`. `disciplineId` = the lookup/role id if one exists, otherwise `null`.
- **(b) Specific clinician** — the listbox lists employees filtered to those roles. Sets `disciplineId` = `employees.id` and `discipline_name` = the employee's role (or name).

This spec assumes **(a)** and notes where (b) differs. Change if wrong.

**D2 — PatientCd selection fills two columns.**
Selecting a patient should set **both** `patientCd` (text) and `patientId` (bigint) from the same `patients` row. The listbox displays `patientCd` (+ name), value carries the id.

**D3 — What are the actual Excel headers?**
The mapping table in §6 is a template. Replace the left column with your real headers. Everything else stands.

**D4 — Session-derived fields.**
`companyId`, `createdUser`, `reviewerId`, `reviewer_name` should come from the current auth/session, not the Excel or the modal. Confirm where you read the logged-in user from.

---

## 3. Data sources

| Source | Used for | Notes |
|---|---|---|
| Excel file | Base row data | First sheet → JSON |
| `patients` | PatientCd listbox | Select id + patientCd (+ name) |
| `employees` | Discipline listbox | Filter to CNA/RN/MSW/Chaplain |
| Auth/session | `companyId`, `createdUser`, `reviewerId`, `reviewer_name` | Set at save time |

---

## 4. UI flow

```
[Upload button] → parse Excel → open <QaImportModal>
  QaImportModal
    ├─ Table: one row per Excel row
    │    ├─ ...parsed Excel columns (read-only)
    │    ├─ PatientCd   <select>  (from patients)
    │    └─ Discipline  <select>  (CNA / RN / MSW / Chaplain)
    ├─ [Cancel]
    └─ [Save]  → transform rows → supabase insert → close + toast
```

Validation: block Save until every row has PatientCd and Discipline set (or allow partial and skip incomplete rows — pick one and note it).

---

## 5. Reference data loading

```ts
// Patients for the PatientCd listbox
const { data: patients } = await supabase
  .from('patients')
  .select('id, patientCd, firstName, lastName')
  .order('patientCd');

// Discipline options
// (a) fixed categories:
const DISCIPLINES = ['CNA', 'RN', 'MSW', 'Chaplain'] as const;

// (b) if you need employees instead, filter by role/discipline column:
// const { data: employees } = await supabase
//   .from('employees')
//   .select('id, firstName, lastName, discipline')
//   .in('discipline', ['CNA', 'RN', 'MSW', 'Chaplain']);
```

> camelCase columns (`patientCd`, `companyId`, etc.) work as-is in supabase-js selects/inserts — no quoting needed. Quoting only matters in raw SQL.

---

## 6. Column mapping (Excel → grid → `qa_monitoring`)

Replace the **Excel column** entries with your real headers.

| `qa_monitoring` column | Type | Source | Notes |
|---|---|---|---|
| `id` | bigint | — | auto |
| `created_at` | timestamptz | — | default `now()` |
| `companyId` | uuid | session | current company |
| `createdUser` | json | session | `{ id, name }` of current user |
| `updatedUser` | json | — | null on insert |
| `qa_type` | text | Excel or constant | e.g. fixed `"LCD"` / from a `Type` column |
| `patientCd` | text | **PatientCd listbox** | from selected patient |
| `patientId` | bigint | **PatientCd listbox** | from selected patient |
| `disciplineId` | bigint | **Discipline listbox** | (a) null/lookup id · (b) employee id |
| `discipline_name` | text | **Discipline listbox** | role name |
| `qa_status` | text | Excel or default | e.g. default `"Pending"` |
| `qa_date` | timestamp | Excel `Date` | ISO string |
| `reviewerId` | bigint | session | current user id |
| `reviewer_name` | text | session | current user name |
| `comments` | text[] | Excel `Comments` | wrap single value in array |
| `qa_source_dt` | date | Excel `Source Date` | `YYYY-MM-DD` |
| `completed_dt` | date | Excel or null | usually null on import |
| `isLcdCompliance` | boolean | Excel | coerce yes/true/1 → true |
| `recertNumber` | bigint | Excel `Recert #` | parse int |

---

## 7. Implementation sketch

### 7.1 Parse Excel

```ts
import * as XLSX from 'xlsx';

async function parseWorkbook(file: File) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
}
```

### 7.2 Row model in the modal

```ts
type ImportRow = {
  excel: Record<string, unknown>;   // original parsed row
  patientId: number | null;
  patientCd: string | null;
  disciplineId: number | null;      // per D1
  disciplineName: string | null;
};
```

### 7.3 Listbox cells

```tsx
// PatientCd
<select
  value={row.patientId ?? ''}
  onChange={(e) => {
    const p = patients.find(x => x.id === Number(e.target.value));
    updateRow(i, { patientId: p?.id ?? null, patientCd: p?.patientCd ?? null });
  }}
>
  <option value="">— select —</option>
  {patients.map(p => (
    <option key={p.id} value={p.id}>
      {p.patientCd} — {p.lastName}, {p.firstName}
    </option>
  ))}
</select>

// Discipline (variant a)
<select
  value={row.disciplineName ?? ''}
  onChange={(e) => updateRow(i, { disciplineName: e.target.value || null })}
>
  <option value="">— select —</option>
  {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
</select>
```

> Do not use an HTML `<form>` wrapper if this ever runs inside a Claude artifact preview; plain `onClick`/`onChange` handlers only. In your real Vite app a `<form>` is fine.

### 7.4 Transform → payload

```ts
function toPayload(rows: ImportRow[], session: Session) {
  return rows.map(r => ({
    companyId: session.companyId,
    createdUser: { id: session.userId, name: session.userName },
    qa_type: (r.excel['Type'] as string) ?? 'LCD',
    patientCd: r.patientCd,
    patientId: r.patientId,
    disciplineId: r.disciplineId,          // null under variant (a) unless you have a lookup
    discipline_name: r.disciplineName,
    qa_status: (r.excel['Status'] as string) ?? 'Pending',
    qa_date: asIso(r.excel['Date']),
    reviewerId: session.userId,
    reviewer_name: session.userName,
    comments: toArray(r.excel['Comments']),        // string[] or null
    qa_source_dt: asDate(r.excel['Source Date']),  // 'YYYY-MM-DD'
    completed_dt: null,
    isLcdCompliance: asBool(r.excel['LCD']),
    recertNumber: asInt(r.excel['Recert #']),
  }));
}

const toArray  = (v: unknown) => (v == null || v === '' ? null : [String(v)]);
const asBool   = (v: unknown) => ['true','yes','1','y'].includes(String(v).toLowerCase());
const asInt    = (v: unknown) => (v == null || v === '' ? null : Number.parseInt(String(v), 10));
const asDate   = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0,10) : (v ? String(v) : null));
const asIso    = (v: unknown) => (v instanceof Date ? v.toISOString() : (v ? String(v) : null));
```

### 7.5 Save

```ts
async function save(rows: ImportRow[], session: Session) {
  const payload = toPayload(rows, session);
  const { data, error } = await supabase
    .from('qa_monitoring')
    .insert(payload)
    .select();
  if (error) throw error;
  return data;
}
```

---

## 8. Gotchas

- **camelCase columns**: fine in supabase-js object keys as shown. If you ever hand-write SQL for this, quote them: `"patientCd"`, `"companyId"`, `"isLcdCompliance"`, `"recertNumber"`.
- **`comments` is `text[]`**: send a JS array (or `null`), never a bare string.
- **Dates vs timestamps**: `qa_date` is `timestamp` (send ISO datetime), `qa_source_dt` / `completed_dt` are `date` (send `YYYY-MM-DD`).
- **Excel dates**: read with `cellDates: true` so you get `Date` objects instead of serial numbers.
- **RLS**: confirm the insert policy on `qa_monitoring` allows the current user's `companyId`, or the insert will silently fail with an RLS error.
- **Batch insert**: a single `.insert([...])` handles all rows in one round trip; wrap in try/catch and surface partial-failure clearly.

---

## 9. Open items to fill in
- [ ] Resolve **D1** (discipline = category vs clinician).
- [ ] Provide real Excel headers → finalize §6.
- [ ] Confirm session shape for `companyId` / user (D4).
- [ ] Decide: block Save on incomplete rows, or skip them.

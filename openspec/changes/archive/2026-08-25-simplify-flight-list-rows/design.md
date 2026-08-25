## Context

See proposal.md — Why.

Four routes render flights as a list today, through two near-duplicate component pairs:

| Route | Table | Row |
| --- | --- | --- |
| `/flights`, `/current-flights`, `/finished-flights` | `FlightListTable` | `FlightListElement` |
| `/flight-history` | `FlightHistoryListTable` | `FlightHistoryListElement` |

Both wrap flowbite's `<Table>` in a `rounded-2xl overflow-x-auto` box, both hold their own pagination and loading overlay, and both scatter per-cell links into the row. `FlightListTable` reads paging from `useFlightList`; `FlightHistoryListTable` fetches and pages on its own.

The repo already has one responsive-list precedent: `AircraftListTable.tsx:33` renders `AircraftListCard` below `md` and a `<Table>` at `md` and up. Four layouts were compared at real widths before this change was written; the comparison and the reasoning behind picking a single grid row live at <https://claude.ai/code/artifact/e8e62c47-cf08-406a-816d-c711c3071a22>.

## Goals / Non-Goals

**Goals:**

- One row component, one DOM, no breakpoint-specific duplicate rendering.
- The row is a real `<Link>`, so navigation needs no click handler.
- Columns stay aligned down the list at every width.
- The mode-specific part of the row is a slot, so a new list means a new trailing cell, not a new table.

**Non-Goals:**

- Migrating `AircraftListTable`, `TravelLogTable`, or the rotation lists. They keep their current shape.
- Changing what the lists fetch, how they page, or any API contract.
- Preserving the shortcuts this removes (airport link, aircraft link). They exist on the flight detail page.

## Decisions

### Grid rows instead of `<table>`

The row is a `<Link>` with `display: grid`, inside `<ul>`/`<li>`, named by an `aria-label` so the four cells are announced as one flight.

A `<tr>` cannot be wrapped in an anchor, so keeping flowbite's `<Table>` would force row navigation through `onClick` + `useNavigate` — which silently breaks cmd-click, middle-click and "copy link address". Since whole-row navigation is a requirement, the table has to go.

*Alternatives considered.* Keeping the table and hiding columns below `sm` was the smallest diff but cannot deliver a real link. Table-on-desktop plus cards-on-mobile matches `AircraftListTable`, but doubles the components rendering the same data and drops phone density from about eleven flights per screen to five. Cards everywhere loses the column alignment that makes a list of flights scannable.

*Cost accepted.* The rows lose `<table>` row/column association. Requirement "Accessible row naming" is the compensation: list semantics plus an `aria-label` per row ("AAL4905, BOS to PHL, block 3:18, air 2:45").

### Column widths come from the trailing column, not the row

```
block   mobile  88px 76px auto 1fr 20px
        sm     112px 100px minmax(150px,240px) 1fr 34px

status  mobile  88px 76px 1fr 20px          (badge stacks onto row 2)
        sm     112px 100px minmax(150px,240px) 1fr 34px
```

Widths were set from measured text, not estimates. The mobile date column is 88 px because the widest string the format can produce is `01JAN 2025` (73 px at `text-xs`), not `19AUG`; sizing it to the common case wraps every non-current-year row. Route is capped rather than greedy so the trailing value sits next to it instead of drifting to the far right, and the slack column before the chevron absorbs the rest.

**The status badge does not fit inline on a phone.** The widest status ("Boarding in progress") renders at 160 px, and date + callsign + route + 160 px + chevron exceeds the ~351 px available at a 390 px viewport. Rather than truncate a status or shrink the IATA codes the brief asked to enlarge, the status variant drops to a four-column row on mobile and stacks the badge on a second line, returning to a single row at `sm`. This is done with `order` and `col-span` classes carried on the trailing column descriptor, so it is still one component and one DOM.

Because the cells are no longer always direct grid children — the trailing cell is wrapped so it can carry those classes — every cell root sets `block` explicitly. Without it the wrapped cell stays inline and inflates the row from 58 px to 86 px.

### The trailing column is a slot

`FlightListRow` takes a `FlightListTrailingColumn` descriptor: header, render, accessible label, and the layout classes that column implies. Two exist: `blockTimeColumn` (finished) and `statusColumn` (upcoming, current). Adding a list means adding a descriptor.

*Alternative considered.* A `variant="history" | "live"` prop on the row. Rejected — it puts every list's concerns inside the shared component and grows a conditional per list.

### Durations

`formatDuration` gives `1h 45m` and `getTimeDifferenceInHours` gives `01:47`; the spec wants `1:47`. Add `formatClockDuration(minutes)` to `app/shared/lib/time.ts` — unpadded hours, colon, zero-padded minutes — rather than bending either existing formatter, both of which have callers depending on their current output.

### Finished lists read the actual timesheet

`isFilledSchedule(flight.timesheet.actual)` already guards this in `FlightHistoryListElement`. The same guard moves into the date and block-time cells: actual when complete, otherwise the scheduled fallback for the date and a placeholder for the durations.

### Emergency

The status cell renders the flight status through the existing `FlightStatusBadge`, and an emergency through a themed `<Badge color="failure">` — replacing the hand-rolled `rounded-md bg-red-600` chip in `FlightListElement.tsx:88`. Two badges stack inside the trailing cell rather than claiming a fifth column.

## Risks / Trade-offs

- **Screen readers lose table semantics.** → `<ul>`/`<li>` plus a visually hidden per-row label naming callsign, route and trailing value. Verified by reading a row with VoiceOver before the change is called done.
- **Removing the airport and aircraft links removes real shortcuts on `/current-flights`.** → Both targets remain one click further on, from the flight overview. Accepted deliberately: nested anchors inside a row-level anchor are invalid, and the row link is the requirement.
- **Callsign replaces flight number everywhere at once.** → It is a display change on lists only; the flight number stays on detail pages. Both fields already come back on the flight response, so nothing can go missing.
- **Two list patterns now coexist** — grid rows here, table-plus-cards in `AircraftListTable`. → Accepted for this change; a follow-up can migrate the aircraft list once the row proves itself.
- **Long city pairs could overflow the flexible Route column.** → The city line truncates with an ellipsis and is hidden below `sm` anyway.

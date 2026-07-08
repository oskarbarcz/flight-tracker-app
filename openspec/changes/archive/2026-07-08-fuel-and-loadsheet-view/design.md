## Context

The live OpenAPI spec (`http://localhost/api-json`) now defines a `FuelBreakdown` object and adds a nullable `fuel` field to the `Loadsheet` schema, present on both the preliminary and final loadsheets. `FuelBreakdown` carries ~18 figures in tons: required `block`, `taxi`, `trip`, `alternate`, `reserve`, `contingencyType` (a nullable rule label such as "5% of trip"), `contingencyAmount`, `mel`, `atc`, `wxx`, `extra`, `tankering`; and optional `etops`, `minTakeoff`, `planTakeoff`, `planLanding`, `averageFuelFlow`, `maxTanks`. `fuel.block` equals the existing `blockFuel`.

The app currently surfaces only `blockFuel` as a single number in three loadsheet render sites, each of which re-implements the same row/stat markup:
- **Operators** — `LoadsheetCard` on the flight overview and on the dedicated "Loadsheet" tab (`FlightLoadsheetRoute`, two cards side by side; operators can edit the preliminary).
- **Pilots (live)** — the map "Documents" overlay (`DocumentsOverlay`, a narrow panel with a single preliminary/final switch).
- **Pilots (history)** — `LoadsheetSummaryCard` inside the history Overview tab.

This is a frontend-only repo; the backend is a separate project. The `fuel` breakdown is produced upstream (SimBrief/planning) and is read-only — it is absent from the preliminary edit schema (`updatePreliminaryLoadsheetSchema`, only `blockFuel`) and from the final loadsheet the pilot files at finish-boarding. The three tab hosts differ mechanically: operator flight-detail tabs are **route-based** (`FlightTabs` + `FlightLayout`), while both pilot dashboards use **state/enum-based** tabs (`FlightDataTabs`, `HistoryDataTabs`).

## Goals / Non-Goals

**Goals:**
- Present the planned fuel breakdown the way an OFP does — an additive ladder that builds to block fuel — so the operational relationships (margin over minimum, tank fill) are legible at a glance.
- Ship one shared fuel display and one shared fuel-and-loadsheet layout, reused unchanged across the operator tab and both pilot tabs.
- Give the fuel column and the loadsheet column independent preliminary/final switches.
- Keep the operator's preliminary edit flow intact; keep every pilot surface read-only.
- Degrade cleanly for older or partial data (fuel `null`, optional subtotals missing).

**Non-Goals:**
- No backend changes and no new dependencies.
- No fuel fields in any edit form; the breakdown stays read-only.
- No client-side recomputation or validation of fuel sums.
- No changes to the in-flight map "Documents" overlay (possible follow-up).
- No refactor of the other loadsheet render sites' existing block-fuel display beyond what the shared components naturally replace.

## Decisions

**Fuel ladder (over a flat stat grid or headline+table).** The breakdown is rendered as a single-column additive ladder — trip → +contingency (with rule) → +alternate → +final reserve = **minimum takeoff**; + collapsed discretionary additions = **planned takeoff**; + taxi = **block** (emphasised headline); then **planned landing** and a tank gauge, with average fuel flow as a caption. This is the format dispatchers and pilots already read, communicates the build-up a grid cannot, and fits a narrow one-third column and the pilot tabs without reflowing. Alternatives considered: a *grouped stat-block grid* (matches the existing `LoadsheetCard` style but is bulky and loses the additive story) and a *headline + expandable detail table* (good for tight spaces but hides the very figures this change exists to show). The ladder wins on "professional" and on fitting the 1/3 column.

**Display, don't compute.** The ladder renders the figures the API provides and does not derive or cross-check subtotals. The spec's per-field examples are illustrative and not internally consistent, and contingency rules/rounding make client recomputation unreliable. Subtotal lines (`minTakeoff`, `planTakeoff`, `planLanding`) and `averageFuelFlow`/`maxTanks` are optional in the schema, so each is rendered only when present; the ladder still reads correctly when they are absent.

**Collapse zero discretionary additions.** `mel`, `atc`, `wxx`, `etops`, `tankering`, and often `extra` are commonly zero. Rendering every one clutters the ladder, so zero additions are omitted individually and the ladder steps straight from minimum takeoff to planned takeoff (with any non-zero additions listed between). This keeps a real plan readable while still exposing anything non-standard.

**Two shared components.** A `FuelPlan` component renders a single `FuelBreakdown` as the ladder + gauge (or an "unavailable" state for `null`). A `FuelAndLoadsheetPanel` composes the whole tab: the 1/3 fuel column, the 2/3 loadsheet column, and the two independent variant switches. The panel takes `preliminary`, `final`, and an optional edit affordance, so all three hosts render identical structure. The loadsheet column reuses the existing souls/weights rendering; to avoid a fourth copy of that markup it is extracted into a small shared `LoadsheetFigures` component that `FuelAndLoadsheetPanel` consumes. The pre-existing duplication in `LoadsheetCard`/`LoadsheetSummaryCard`/`DocumentsOverlay` is left untouched (out of scope).

**Independent per-column switch state.** Each column owns its own `useState<Variant>` (`"preliminary" | "final"`), defaulting to `final ? "final" : "preliminary"`, with the absent variant's tab disabled — mirroring the existing `DocumentsOverlay` `VariantTab` pattern, promoted into the shared panel. Independence falls out of separate state and directly satisfies the requirement that fuel and load switch separately (e.g. preliminary fuel next to final load).

**Preliminary edit stays on the loadsheet column (operator only).** `FlightLoadsheetRoute` keeps owning the edit modal and revalidation; it passes an `onEditPreliminary` callback (and the "can edit" condition, `status === Created`) into the panel. The panel shows the edit action only when the loadsheet switch is on Preliminary and the callback is provided — so the operator flow is preserved and the pilot tabs (which pass no callback) are read-only by construction. This matches the memory guidance that reused components hide actions the audience shouldn't have.

**Type-only model change.** Add a `FuelBreakdown` type and `fuel: FuelBreakdown | null` to the `Loadsheet` type (`model.ts`) and to `ApiLoadsheetResponse` (`request.ts`). The `Flight` constructor already assigns `loadsheets.preliminary`/`.final` straight from the response, so `fuel` flows through with no parsing change. `contingencyType` is declared in the spec as a nullable `object` but its example and semantics are a string rule label, so it is typed `string | null` on the frontend; this discrepancy is noted for verification against real API payloads during apply.

**Placement per host.** Operators: rename the `FlightTabs` entry title "Loadsheet" → "Fuel & loadsheet" (path stays `loadsheet`, so routing/links are unchanged) and render `FuelAndLoadsheetPanel` from `FlightLoadsheetRoute`. Pilots: add a `FuelAndLoad` enum member + `TabItem` to `FlightDataTabs` (live) and `HistoryDataTabs` (history), and render the panel from the respective dashboards. The tab is titled "Fuel & load" on the pilot side per the requested naming.

## Risks / Trade-offs

- **Frontend `contingencyType` typing may not match real payloads** (spec says `object`, example is a string). → Type as `string | null`, render defensively (skip the label if not a string), and verify against a live SimBrief-sourced flight during apply.
- **Manual (non-SimBrief) flights will have `fuel: null`.** → The unavailable state is a first-class path; the loadsheet column still renders fully, so these flights lose nothing they have today.
- **Collapsing zero additions could hide a figure a user expected to see.** → Only genuinely zero additions are hidden; any non-zero addition is always listed, and the planned-takeoff subtotal still reflects them.
- **Two independent switches add UI that could confuse.** → Default both to the most complete variant (final) and disable unavailable options, so the common case needs no interaction; independence only matters when a user deliberately compares variants.
- **Three tab hosts use two different tab mechanisms.** → Only the host wiring differs; the shared `FuelAndLoadsheetPanel` is identical across all three, keeping behavior consistent and limiting host-specific code to tab registration.

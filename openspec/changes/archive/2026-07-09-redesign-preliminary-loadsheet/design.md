## Context

The loadsheet edit form (`app/features/flight/components/Forms/UpdateLoadsheetForm.tsx`) is a flat Formik form with two groups — souls (pilots, relief pilots, cabin crew, passengers) and weights (zero-fuel weight, cargo, payload, block fuel) — validated by `updatePreliminaryLoadsheetSchema` (Yup) and mapped through `FlatLoadsheetFormData` ⇆ `Loadsheet` (`form-types.ts`). The **same** form and schema are reused by `UpdatePreliminaryLoadsheetModal` (operator, editable while the flight is `Created`) and `UpdateFinalLoadsheetModal` (pilot, at finish-boarding). This is a frontend-only repo; the backend is a separate project.

The live API `Loadsheet` persists only `flightCrew`, `passengers`, `cargo`, `payload`, `zeroFuelWeight`, `blockFuel` (plus the read-only `fuel` breakdown). It exposes **no** dry-operating / take-off / landing weights and **no** structural limits; the aircraft/airframe model carries only an ICAO `weightCategory`. The just-shipped fuel work established a house pattern for a professional additive **ladder** (`FuelPlan`) and shared display components under `components/FuelAndLoadsheet/`.

## Goals / Non-Goals

**Goals:**
- Replace the flat weight grid with a clear operational **weight build-up** (dry operating → payload → zero-fuel → take-off → landing), matching the fuel-ladder idiom.
- Capture the missing operational weights (dry operating, take-off, landing) and the structural limits (max zero-fuel, max take-off, max landing).
- Validate operational weights against their limits with clear, non-blocking-vs-blocking treatment, and keep the existing field checks.
- Improve entry UX (grouping, units, live-computed context) without changing who may edit.
- Keep one shared form for the operator preliminary and pilot final flows.

**Non-Goals:**
- No backend work in this repo (the API DTO change is a documented dependency, not part of this change).
- No centre-of-gravity / trim / balance computation — weights only.
- No change to the fuel breakdown or the fuel ladder.
- No new role/permission changes.

## Decisions

**New weights are operator-entered and persisted (over derived-only).** Per direction, the form is built as if the backend already persists the new fields, so dry operating weight, take-off weight, landing weight and the three limits are real inputs included in the submitted `Loadsheet`. Take-off and landing weight are *entered* (authoritative) rather than purely computed, because the required fuel figures (`planTakeoff`, `trip`) live in the read-only fuel breakdown, which is `null` on manually-created flights — the exact flights an operator fills by hand. The form still shows a **computed suggestion/context** where fuel data exists, but the entered value wins. Alternative considered: fully derived take-off/landing weight — rejected because it breaks for manual flights and can't be persisted independently.

**Backend persistence is a hard external dependency, flagged not hidden.** The current API strips unknown properties, so until `flight-tracker-api`'s `Loadsheet` DTO gains these fields, the new weights will not round-trip (they submit, but read back as absent). This change ships the FE ahead of the BE per direction; the proposal and tasks call out the required API contract (`dryOperatingWeight`, `takeoffWeight`, `landingWeight`, `maxZeroFuelWeight`, `maxTakeoffWeight`, `maxLandingWeight`, all `number` tons, on `Loadsheet`). Verification of persistence is deferred until the BE lands; FE verification covers layout, computation, validation and submit payload.

**Limit checks are warnings, field checks are errors.** Non-negative / positive / max-3-decimals stay as Yup validation that blocks submit (unchanged behaviour). Over-limit conditions (ZFW > MZFW, TOW > MTOW, LDW > MLW) and the zero-fuel-vs-build-up mismatch are surfaced as **inline warnings** computed from live Formik values, not hard submit blocks — a preliminary loadsheet may legitimately be edited toward a valid state, and limits themselves are operator-entered and may be provisional. Alternative considered: hard-blocking over-limit submits — rejected as too rigid for a preliminary, provisional document.

**Reuse the ladder idiom for the weight build-up.** The weights render as a labelled build-up (headings Souls · Weights · Limits) echoing `FuelPlan`, with subtotal emphasis on zero-fuel, take-off and landing weights and the limit shown alongside each with its warning state. This keeps the redesigned form visually consistent with the Fuel & load view it sits beside.

**Extend the shared form, not fork it.** Because both modals already share `UpdateLoadsheetForm` + `updatePreliminaryLoadsheetSchema`, the redesign extends those in place so operator and pilot flows stay in sync with no duplication. The form stays presentation-only (Formik context supplies values); the modals are unchanged.

**Type extension mirrors the fuel work.** `Loadsheet` (`model.ts`) and `ApiLoadsheetResponse` (`request.ts`) gain the six optional `number` fields; `FlatLoadsheetFormData` and its two mappers carry them; the `Flight` constructor still passes loadsheets through unchanged. New fields are optional so existing loadsheets (and the current API response) remain valid.

**Display reuse.** The saved weights appear read-only in `LoadsheetFigures` (already shared by the Fuel & load panel), gated on presence, so nothing new is needed on the display side beyond additional rows.

## Risks / Trade-offs

- **Values won't persist until the API changes.** → Documented dependency; FE is explicitly built ahead per direction. The submit payload is verifiable now; round-trip persistence is verified once the BE DTO lands.
- **Operators must enter more fields (10+ weights/limits).** → Grouping, units, live build-up context and sensible defaults/pre-fill keep it manageable; limits change rarely and could later be sourced from the aircraft once the API exposes them.
- **Entered take-off/landing weight can drift from the fuel-implied values.** → The form shows the computed context beside the entered field so discrepancies are visible; not hard-enforced because manual flights lack the fuel breakdown.
- **New optional fields could read as "always present" downstream.** → Typed optional and every render/derivation guards on presence, matching how the fuel breakdown is handled.

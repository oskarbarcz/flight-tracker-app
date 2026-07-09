## Why

The loadsheet edit form is a flat two-column grid of raw number inputs (souls; then zero-fuel weight, cargo, payload, block fuel). It gives operators no sense of how the weights build up, no guard rails against structurally impossible figures, and omits the operational weights a dispatcher actually reasons about — dry operating weight, take-off weight, landing weight, and the aircraft's max structural limits. This change is a complete redesign of the form around a clear weight build-up, adds those missing weights, and validates entries against their limits.

## What Changes

- **Redesign the loadsheet edit form** (`UpdateLoadsheetForm`) around a **weight build-up** that mirrors the fuel-ladder style already shipped: Dry operating weight → + payload → **Zero-fuel weight** → + take-off fuel → **Take-off weight** → − trip → **Landing weight**, with clear grouping, units, and live-updating computed context.
- **Add new weight fields** to the loadsheet (entered and persisted): `dryOperatingWeight`, `takeoffWeight`, `landingWeight`, and the structural limits `maxZeroFuelWeight`, `maxTakeoffWeight`, `maxLandingWeight`.
- **Validation & limits**: each operational weight is checked against its structural limit (zero-fuel ≤ max zero-fuel, take-off ≤ max take-off, landing ≤ max landing) with an inline over-limit warning; keep the existing non-negative / decimal-precision / range checks and add consistency hints (e.g. zero-fuel weight ≈ dry operating weight + payload).
- **Better input UX**: logical grouping (Souls · Weights · Limits), consistent `[t]` units, and computed read-only context so operators see the resulting build-up as they type.
- The redesigned form is **shared** by the operator *preliminary* modal and the pilot *final* loadsheet modal (both render `UpdateLoadsheetForm` and use `updatePreliminaryLoadsheetSchema`), so both entry points get the new layout and fields.
- Surface the new weights read-only in the existing loadsheet display (`LoadsheetFigures`) so saved values are visible in the Fuel & load view.

**BREAKING / dependency:** the new weight fields are **not yet in the backend** `Loadsheet` DTO (confirmed against the live spec). Per direction, the frontend is built *as if the backend already persists them*; until the separate `flight-tracker-api` repo adds these fields, the values will not round-trip (the API strips unknown properties). This proposal notes the required API contract change; no backend work happens in this repo.

No changes to who may edit (operators edit preliminary while `Created`; pilots fill final at finish-boarding).

## Capabilities

### New Capabilities
- `preliminary-loadsheet-form`: The redesigned loadsheet entry form — a grouped weight build-up with new operational and structural-limit weights, live-computed context, and limit-aware validation — shared by the operator preliminary and pilot final loadsheet flows, with the new weights also surfaced read-only in the loadsheet display.

### Modified Capabilities
<!-- None: the loadsheet-display change is covered as a requirement of the new capability to avoid reopening the archived fuel-and-loadsheet-view spec. -->


## Impact

- **Model / types** (`app/features/flight/`): extend the `Loadsheet` type (`model.ts`) and `ApiLoadsheetResponse` (`request.ts`) with `dryOperatingWeight`, `takeoffWeight`, `landingWeight`, `maxZeroFuelWeight`, `maxTakeoffWeight`, `maxLandingWeight`.
- **Form plumbing**: `FlatLoadsheetFormData` + `flatLoadsheetToLoadsheet` / `loadsheetToFlatLoadsheet` (`form-types.ts`) gain the new fields; `updatePreliminaryLoadsheetSchema` (`schema.ts`) gains their validation and the limit checks.
- **Form UI**: complete rewrite of `UpdateLoadsheetForm.tsx`; both `UpdatePreliminaryLoadsheetModal` and `UpdateFinalLoadsheetModal` consume it unchanged.
- **Display**: `LoadsheetFigures` (and by extension the Fuel & load panel) shows the new weights.
- **API**: consumes/sends an extended `Loadsheet`; **requires** a matching DTO change in `flight-tracker-api` before values persist.
- **Dependencies**: none added; reuses Formik/Yup, the managed form blocks, and existing layout primitives.

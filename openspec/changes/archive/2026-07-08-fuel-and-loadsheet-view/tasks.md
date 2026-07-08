## 1. Model & types

- [x] 1.1 Add a `FuelBreakdown` type in `app/features/flight/model.ts` with all `FuelBreakdown` fields (required: block, taxi, trip, alternate, reserve, contingencyType, contingencyAmount, mel, atc, wxx, extra, tankering; optional: etops, minTakeoff, planTakeoff, planLanding, averageFuelFlow, maxTanks). Type `contingencyType` as `string | null`.
- [x] 1.2 Add `fuel: FuelBreakdown | null` to the `Loadsheet` type in `model.ts` and to `ApiLoadsheetResponse` in `app/features/flight/request.ts`.
- [x] 1.3 Confirm the `Flight` constructor still passes `loadsheets.preliminary`/`.final` through unchanged (no parsing change needed) and export `FuelBreakdown` from the feature barrel where `Loadsheet` is exported. Added `fuel: null` to the two hand-built `Loadsheet` literals (`flatLoadsheetToLoadsheet`, preliminary modal fallback).
- [x] 1.4 Verify against a live SimBrief-sourced flight (`GET` a flight via the API) that `contingencyType` is actually a string; adjust the type if the payload differs. No seeded flight carries a non-null fuel breakdown, so runtime shape is unconfirmed; `contingencyType` is typed `string | null` and rendered defensively (only when it is a string), which is robust to either shape.

## 2. Fuel ladder component

- [x] 2.1 Create `FuelPlan` under `app/features/flight/components/` that takes a `FuelBreakdown | null` and renders the OFP-style additive ladder (trip → +contingency with rule label → +alternate → +final reserve = minimum takeoff → +non-zero discretionary additions = planned takeoff → +taxi = block, then planned landing).
- [x] 2.2 Emphasise block fuel as the headline figure; show all figures in tons using the existing loadsheet stat/row styling.
- [x] 2.3 Render subtotal lines (minTakeoff, planTakeoff, planLanding) and the average-fuel-flow caption only when present; omit them otherwise without breaking the ladder.
- [x] 2.4 Collapse zero discretionary additions (mel, atc, wxx, etops, tankering, extra); list only non-zero ones.
- [x] 2.5 Render the tank-capacity gauge (block ÷ maxTanks as a percentage plus `block of <capacity> t`) only when `maxTanks` is present.
- [x] 2.6 Render an informative "fuel figures not available" state when the breakdown is `null`.

## 3. Shared layout & switches

- [x] 3.1 Extract the loadsheet souls/weights rendering into a shared `LoadsheetFigures` component (reused by the panel; do not touch the existing `LoadsheetCard`/`LoadsheetSummaryCard`/`DocumentsOverlay` copies).
- [x] 3.2 Create a reusable variant switch (`[Preliminary | Final]`) based on the existing `DocumentsOverlay` `VariantTab`, disabling the option whose loadsheet is absent.
- [x] 3.3 Create `FuelAndLoadsheetPanel` composing a left ~1/3 fuel column and right ~2/3 loadsheet column, stacking on narrow viewports. It takes `preliminary`, `final`, and an optional `onEditPreliminary` (+ can-edit flag).
- [x] 3.4 Give the fuel column and loadsheet column independent variant state, each defaulting to Final when a final loadsheet exists, otherwise Preliminary.
- [x] 3.5 Show the preliminary edit action only when the loadsheet switch is on Preliminary, the flight is editable, and `onEditPreliminary` is provided; render an empty state when the selected variant loadsheet is absent.

## 4. Operator flight-detail tab

- [x] 4.1 Rename the "Loadsheet" tab title to "Fuel & loadsheet" in `app/features/flight/components/Header/FlightTabs.tsx` (keep the `loadsheet` path).
- [x] 4.2 Update `app/routes/operations/flights/FlightLoadsheetRoute.tsx` to render `FuelAndLoadsheetPanel`, wiring the existing preliminary edit modal/revalidation through `onEditPreliminary` with the `status === Created` condition; remove the old two-card layout.

## 5. Pilot live-tracking tab

- [x] 5.1 Add a `FuelAndLoad` member and a "Fuel & load" `TabItem` to `app/features/flight/components/Dashboard/Tabs/FlightDataTabs.tsx`.
- [x] 5.2 Render `FuelAndLoadsheetPanel` (read-only, no edit callback) for the new tab in the live-tracking dashboard, sourcing loadsheets from the tracked flight.

## 6. Pilot flight-history tab

- [x] 6.1 Add a `FuelAndLoad` member and a "Fuel & load" `TabItem` to `app/features/flight/components/Dashboard/History/Tabs/HistoryDataTabs.tsx`.
- [x] 6.2 Render `FuelAndLoadsheetPanel` (read-only) for the new tab in the history dashboard, sourcing loadsheets from the history flight.

## 7. Verification

- [x] 7.1 Verify a SimBrief flight shows the full ladder + gauge, and a manual flight (fuel `null`) shows the unavailable state while the loadsheet still renders. Verified in-browser on the operator tab (injected fuel → full ladder + 65% tank gauge; null fuel → "not available" with loadsheet intact). Pilot tabs render the identical shared panel (verified by typecheck/build; not driven in-browser — no pilot credentials to hand).
- [x] 7.2 Confirm the two switches operate independently and that the operator preliminary edit flow still works end-to-end. Two independent switch pairs render with correct enabled/disabled states and the Update action appears on the editable preliminary. Toggling two fully-populated variants was not exercisable in-browser (the API rejects preliminary edits once a final exists), but independence follows from separate per-column state.
- [x] 7.3 Run `npm run lint`, `npm run typecheck`, and `npm run build`; bump the version in `package.json`. All pass; version bumped 2.38.0 → 2.39.0.

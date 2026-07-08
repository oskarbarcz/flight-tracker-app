## Why

The backend now returns a full planned **fuel breakdown** on every loadsheet (trip, contingency, alternate, reserve, taxi, extra, MEL/ATC/weather/ETOPS additions, tankering, planned takeoff/landing, average fuel flow, tank capacity), but the app still shows only a single `blockFuel` number. Pilots and operators lose the operational picture — how the block fuel is built up, how much margin exists over minimum, and how full the tanks are. Surfacing these figures the way a real operational flight plan (OFP) presents them makes the app materially more useful for flight planning and dispatch.

## What Changes

- Extend the frontend loadsheet model with the new read-only **`fuel`** breakdown (nullable) that the API already returns on both the preliminary and final loadsheets. `fuel.block` mirrors the existing `blockFuel`.
- Add a shared, professional **fuel ladder** display — an OFP-style additive build-up (trip → +contingency → +alternate → +reserve = minimum takeoff → +extra/other = planned takeoff → +taxi = **block**, with planned landing and a **tank-capacity gauge**). Zero-value discretionary lines are collapsed to keep it clean.
- Add a shared **Fuel & loadsheet** layout: fuel figures in a left **1/3** column and the loadsheet (souls + weights) in the right **2/3**, with **independent `[Preliminary | Final]` switches** on the fuel column and the loadsheet column (a variant with no data is disabled).
- **Operators** — rename the flight-detail **"Loadsheet"** tab to **"Fuel & loadsheet"** and replace the side-by-side preliminary/final cards with the new layout. The operator's edit-preliminary affordance is preserved (shown on the loadsheet side when the switch is on Preliminary and the flight is editable).
- **Pilots (live tracking)** — add a **"Fuel & load"** tab to the tracking dashboard, showing the same layout (read-only).
- **Pilots (flight history)** — add a **"Fuel & load"** tab to the history dashboard, showing the same layout (read-only).
- The fuel breakdown is **read-only** and sourced upstream (SimBrief/planning); it is **not** added to the preliminary/final edit forms. No form or validation changes.

No backend changes. No breaking changes. The in-flight map "Documents" loadsheet overlay is left unchanged (noted as a possible follow-up).

## Capabilities

### New Capabilities
- `fuel-and-loadsheet-view`: A shared display that presents a loadsheet's planned fuel breakdown as an OFP-style ladder alongside the loadsheet figures, with independent preliminary/final switches, surfaced to operators (flight-detail tab) and pilots (live-tracking and flight-history tabs).

### Modified Capabilities
<!-- None: openspec/specs/ is empty; no existing spec-level behavior changes. -->

## Impact

- **Model / types** (`app/features/flight/`): add a `FuelBreakdown` type and `fuel: FuelBreakdown | null` to the `Loadsheet` type (`model.ts`) and `ApiLoadsheetResponse` (`request.ts`). The `Flight` constructor already passes loadsheets through, so parsing is a type-level extension.
- **New shared components** (`app/features/flight/components/`): a `FuelPlan` ladder component and a `FuelAndLoadsheetPanel` layout (1/3 fuel + 2/3 loadsheet with two independent variant switches), reusing the existing loadsheet stat/row styling.
- **Operators**: `FlightTabs.tsx` (tab title rename) and `FlightLoadsheetRoute.tsx` (swap to the new panel, keep the preliminary edit flow).
- **Pilots**: `FlightDataTabs.tsx` + tracking dashboard, and `HistoryDataTabs.tsx` + history dashboard (new "Fuel & load" tab each).
- **API**: consumes the existing `fuel` field on `Loadsheet` (confirmed in the live OpenAPI spec at `http://localhost/api-json`); no contract change.
- **Dependencies**: none added; reuses Flowbite/Tailwind and existing icons (`react-icons/fa6`).

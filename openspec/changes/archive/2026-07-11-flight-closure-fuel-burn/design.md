## Context

Flight closing is the terminal step of the pilot tracking status machine. Today `FlightStatus.OffboardingFinished` renders `CloseFlightButton`, which calls `useTrackedFlight().close()` → `FlightService.close(id)` → `POST /api/v1/flight/{id}/close` with no body, then reloads. `CloseFlightButton` already establishes the button-guard precedent: it disables and wraps itself in a `Tooltip` when `activeEmergency` is set.

The backend contract is already ahead of the frontend:
- `CloseFlightRequest` accepts `{ actualFuelBurned: number | null }` — "Actual fuel burned during the flight in tons".
- `GetFlightResponse` returns `actualFuelBurned` (number, nullable, tons) — "captured when the flight is closed; null until then. The planned-vs-actual delta is derived against the loadsheet `fuel.trip`."
- `GetDelayRequestResponse.isSettled` is documented as the close gate: "The flight can only be closed once this is true" (≥1 report, every report accepted, minutes fully allocated).

The tracked-flight context already loads `delayRequest` on every `loadFlight()` and the tracking dashboard already computes `hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled`. So both required inputs are in hand; no new fetches are needed.

Established patterns to follow: modal-on-action is `FinishBoardingButton` (local `showModal` state) → `UpdateFinalLoadsheetModal` → `Form` (`app/shared/ui/Form`) with `Managed*Block` fields + a Yup schema in `flight/schema.ts` + a `form-types.ts` mapper → a `useTrackedFlight` callback. Tonnage validation uses the existing `nonNegativeTons`/`maxThreeDecimals` helpers in `flight/schema.ts`.

## Goals / Non-Goals

**Goals:**
- Capture a required actual-fuel-burned tonnage at close via a form, submitted on the existing close endpoint.
- Give the pilot planned trip fuel as reference plus a live delta, honoring "trust the numbers / visible derivation."
- Prevent the pilot from clicking Close while a delay request is unsettled, with an explanatory tooltip, matching the backend gate exactly so the button never enables into a guaranteed rejection.
- Reuse existing form blocks, schema helpers, modal/button patterns, and the tracked-flight context.

**Non-Goals:**
- No change to the backend contract (already supports both fields).
- No new fuel breakdown, no editing of the loadsheet `fuel` figures — actual burn is a single scalar, separate from loadsheets.
- No change to who can close, to the arm-then-act padlock flow, or to any earlier status transition.
- Not rendering the planned-vs-actual delta anywhere outside the close form in this change (history/detail surfacing of `actualFuelBurned` can be a later change).

## Decisions

**1. Close becomes a form-gated action, modeled on `FinishBoardingButton`.**
`CloseFlightButton` gains local `showModal` state. Clicking Close (when enabled) opens a new `CloseFlightModal` wrapping a new `CloseFlightForm`; the actual close request fires only on form submit. Rationale: this is the exact pattern already used for the final-loadsheet capture on boarding finish, so it reuses `Form`, `ManagedFloatingInputBlock`, `FormSubmit`, and `handleFormikApiError`. Alternative considered — a bare `window`-style prompt or inline field — rejected as inconsistent with the app's modal-driven capture flows.

**2. `close` carries an `actualFuelBurned` payload end to end.**
`FlightService.close(id, actualFuelBurned: number)` sends `{ actualFuelBurned }` as the JSON body. `useTrackedFlight`'s `close` callback and context type change from `() => Promise<void>` to `(actualFuelBurned: number) => Promise<void>`. Rationale: single scalar, no wrapper type needed; keeps the service method aligned with `CloseFlightRequest`. The value is rounded with the loadsheet precision guard (`Math.round(v * 1000) / 1000`) before sending, per the API's ≤3-decimal tonnage rule.

**3. Required, positive, ≤3-decimal validation via a dedicated schema.**
Add `closeFlightSchema` to `flight/schema.ts` reusing the existing `maxThreeDecimals` test — `actualFuelBurned` is `required` and strictly positive (`.moreThan(0)`), not merely non-negative, since a closed flight burned fuel. A `FlatCloseFlightFormData` type + mapper lives in `form-types.ts`. Rationale: mirrors how loadsheet forms are validated and mapped; keeps the field-level error contract consistent.

**4. Planned reference from the final loadsheet with graceful absence.**
The form reads `flight.loadsheets.final?.fuel?.trip` for the planned trip fuel, shows it read-only in tons, and computes `actual − plannedTrip` live from the Formik value. When `final` or its `fuel` is null the reference and delta are omitted and entry still works. Rationale: the API states the delta is derived against `fuel.trip`; final (actual) loadsheet is the operative plan at close. Alternative — preliminary loadsheet — rejected because final supersedes it by the time of closing.

**5. Delay guard uses `isSettled`, composed with the emergency guard.**
`CloseFlightButton` pulls `delayRequest` from `useTrackedFlight()` and computes `hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled` (the same expression the dashboard already uses). The button's `disabled` becomes `disabled || Boolean(activeEmergency) || hasUnsettledDelay`, and it must not open the modal while blocked. Tooltip precedence: emergency message first (existing), else the delay message when only the delay blocks. Rationale: `isSettled` is the documented backend close gate and is strictly broader than "unallocated minutes" (it also blocks allocated-but-not-yet-accepted reports), so the button never enables into a rejected request.

## Risks / Trade-offs

- [Pilot cannot self-clear an unsettled delay — settlement requires Operations to accept reports] → The tooltip states the blocker plainly; the existing Delays tab already surfaces the delay state, so the pilot has a path to see what is outstanding. This matches real ops division of duties and is not made worse by this change.
- [`actualFuelBurned` typed as `object` (nullable) in the OpenAPI schema rather than `number`] → Treat it as `number` on the wire (the description and example `51.2` confirm intent); send a rounded number, parse a number on the response. Low risk; verified against the response schema which types it as `number`.
- [Guard drift — dashboard computes `hasUnsettledDelay` separately from the button] → Compute the same expression at the button from the context's `delayRequest`; both derive from one source (`isSettled`), so they cannot disagree. A shared helper is optional and not required for correctness.
- [Required field is a behavior change — close was previously bodyless/one-click] → Intended per product decision; the backend already accepts (and expects) the value, and the field is validated before submit so no partial state is sent.

## Migration Plan

Frontend-only, no data migration. Ship as one PR: model field → service payload → context callback → schema/form-types → form/modal → button guard. Rollback is a straight revert; the backend keeps accepting bodyless closes historically but the UI always sends a value going forward. Version bump in `package.json` before merge per repo policy.

## Open Questions

None outstanding — fuel field is required and the delay guard is `isSettled`, both confirmed with the user; the backend contract for both fields is verified against the live OpenAPI spec.

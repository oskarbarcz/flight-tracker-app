## Why

Closing a flight is currently a bare one-click action that records nothing about how the flight actually consumed fuel, so the planned-vs-actual fuel delta the API is ready to derive can never be captured. At the same time the close button can be pressed while a departure delay is still unallocated, which the backend rejects — the pilot only discovers this as a failed request. Both gaps sit at the very last, irreversible step of the flight lifecycle.

## What Changes

- Closing a flight opens a form (modal) in which the pilot enters the **actual fuel burned** for the flight, a single tonnage figure. The figure is **required** and validated as a positive value with at most three decimals (the loadsheet tonnage rule).
- The form shows the planned trip fuel from the final loadsheet as reference and a live planned-vs-actual delta, so the pilot can sanity-check the number before committing.
- On submit, the close request sends `actualFuelBurned` (in tons) to `POST /api/v1/flight/{id}/close`; the flight model gains a read-only `actualFuelBurned` field parsed from the flight response.
- The **Close** button is disabled whenever the flight has a delay request that is not settled (`delayRequest` exists and `isSettled` is false), matching the backend gate. A disabled Close button shows an informational tooltip directing the pilot to settle the delay first. This composes with the existing active-emergency guard.

## Capabilities

### New Capabilities
- `flight-closure`: The pilot-facing close-flight action — capturing actual fuel burned through a required form on close, and gating the close action on delay settlement (and the existing emergency guard).

### Modified Capabilities
<!-- No existing capability's requirements change; flight closure was not previously specified. -->

## Impact

- **API service** (`app/features/flight/service.ts`): `close(id)` gains an `actualFuelBurned` payload argument, sending the `CloseFlightRequest` body.
- **Flight model** (`app/features/flight/model.ts`): parse and expose read-only `actualFuelBurned` (nullable) from `ApiFlightResponse`.
- **Tracked-flight context** (`app/features/flight/hooks/useTrackedFlight.tsx`): `close` callback accepts the payload.
- **Close button + new close form** (`app/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/CloseFlightButton.tsx` and a new close-flight modal/form under `components/Forms` + `components/Modal`): add the delay-settlement guard/tooltip and the fuel-burn form, following the existing `FinishBoardingButton` → modal → `useTrackedFlight` callback pattern.
- **Validation** (`app/features/flight/schema.ts`) and form types (`app/features/flight/form-types.ts`): new close-flight schema and form-data mapper.
- No changes to the backend contract (already supports `CloseFlightRequest.actualFuelBurned` and the `isSettled` close gate).

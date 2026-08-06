## Why

Flight rotation will be reimplemented from scratch in a completely different way. The current implementation no longer reflects the intended direction, so keeping it adds maintenance cost, dead navigation, and confusing surfaces (an operator landing tab, a pilot dashboard box, flight-event types) that would collide with the redesign. Removing it now gives the new design a clean slate.

## What Changes

- **BREAKING** Remove the entire rotation feature module (`Rotation`/`RotationFlight`/`Pilot` model, `createRotationSchema` validator, `RotationService`).
- Remove all rotation routes: operator rotations list, create, and edit (`operators/:operatorId/rotations{,/new,/:rotationId/edit}`).
- Remove `rotationService` from the `useApi()` service context.
- Remove rotation-only operator UI: rotation list table/controls, empty state, remove/pick-flight modals, rotation-flights input block, pilot-license input block, and their leg/pilot preview helpers.
- Remove the pilot dashboard `CurrentRotationBox`.
- Remove rotation references from the `Flight` model (`rotationId`) and the `ApiFlightResponse`/`CreateFlightRequest` request shapes.
- Remove the `flight.added-to-rotation` / `flight.removed-from-rotation` flight-event types and their i18n labels.
- Repoint operator navigation (tabs + operator card) away from the removed rotations route, and drop rotation-only request types (`CreateRotationRequest`, `EditRotationRequest`, `GetRotationResponse`).
- Update docs and landing marketing copy that mention rotations.

## Capabilities

### New Capabilities
<!-- None. This is a removal ahead of a future re-design, which will introduce its own capability spec. -->

### Modified Capabilities
- `flight-rotation`: The rotation capability is retired in full. No OpenSpec spec previously described it, so this change captures its behavior as `REMOVED` requirements in `specs/flight-rotation/spec.md` to record what is being taken out and why, with migration pointing at the forthcoming re-design.

## Impact

- **Deleted feature module**: `app/features/rotation/` (index, model, schema, service).
- **Deleted routes**: `app/routes/operations/operators/rotations/` (Create/Edit/List route components) and their entries in `app/routes.ts`.
- **Deleted components**: operator `RotationFlightsInputBlock`, `PilotLicenseInputBlock`, `RemoveRotationModal`, `PickFlightModal`, `RotationListEmptyState`, `RotationControls`, `RotationListTable`, and preview helpers (`LegPreview`, `PilotInputPreview`); flight `CurrentRotationBox`.
- **Edited API layer**: `app/shared/api/useApi.tsx` (drop `RotationService` import/type/instance).
- **Edited flight domain**: `app/features/flight/model.ts` (drop `rotationId`, two `FlightEventType` members), `app/features/flight/request.ts` (drop `rotationId`), `app/features/flight/i18n.ts` (drop two event labels).
- **Edited operator domain**: `app/features/operator/request.ts` (drop rotation request/response types + import), `OperatorTabs.tsx`, `OperatorCard.tsx`.
- **Edited pilot dashboard**: `app/routes/pilot/PilotDashboardRoute.tsx`.
- **Edited docs/copy**: `CLAUDE.md`, `PRODUCT.md`, `docs/DESIGN_SYSTEM.md`, and landing sections (`HowItWorksSection`, `LandingHero`, `OperatorDeepDiveSection`).
- **No API contract or persistence change** in this repo (backend is a separate repo); the frontend simply stops sending/reading `rotationId` and stops calling rotation endpoints. No tests reference rotation.

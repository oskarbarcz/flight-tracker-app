## Why

Operations users can register and edit aircraft, but the form only captures airframe, registration, SELCAL, and livery. Two fleet attributes the API already models — a home **base airport** and an **ETOPS certification threshold** — cannot be set from the UI, so they stay empty or must be populated out-of-band. At the same time, SELCAL is enforced as mandatory in the form even though not every aircraft has one assigned, blocking otherwise-valid registrations.

## What Changes

- Add a **base airport** field to the add and edit aircraft forms — a searchable, clearable airport picker that submits `baseAirportId` (nullable) in the create/update payload. Edit pre-fills from the aircraft's current `baseAirport`.
- Add an **ETOPS threshold** field — a select constrained to the API's documented values (`60`, `75`, `90`, `120`, `180` minutes) plus a "Not ETOPS-certified" option that submits `null` for `etopsThresholdMinutes`.
- Make **SELCAL optional**: drop the required validation rule; keep the `XX-XX` format check only when a value is present.
- Surface the new ETOPS threshold on the aircraft details view alongside the existing base-airport card.
- **BREAKING (contract dependency, not FE)**: relies on the backend `CreateAircraftRequest` / `UpdateAircraftRequest` accepting a new `baseAirportId` and relaxing `selcal` to optional. These backend changes are being made in parallel; the FE ships against that extended contract.

## Capabilities

### New Capabilities
- `aircraft-registration-form`: the operator-facing form for registering a new aircraft and editing an existing one — which fields it captures, their validation rules, how they map to the create/update API payload, and how the details view reflects them.

### Modified Capabilities
<!-- None: no existing spec defines the aircraft registration/edit form. -->

## Impact

- **Forms/routes**: `app/routes/operations/operators/aircraft/CreateAircraftRoute.tsx`, `EditAircraftRoute.tsx` (loaders now fetch airports; actions forward the new field keys; forms render the new inputs).
- **Validation**: `app/features/aircraft/schema.ts` (selcal optional; add `baseAirportId`, `etopsThresholdMinutes`).
- **Request types**: `app/features/operator/request.ts` (`CreateAircraftRequest` / `EditAircraftRequest` gain `baseAirportId` and `etopsThresholdMinutes`; `selcal` optional).
- **Model / details view**: `app/features/aircraft/model.ts` (add `etopsThresholdMinutes`); aircraft details components render the ETOPS value.
- **Reused components**: `AdvancedSelect` + `airportSelectOptions` (airport picker), managed form blocks — no new primitives required.
- **API contract**: depends on backend `CreateAircraftRequest` / `UpdateAircraftRequest` accepting `baseAirportId` and treating `selcal` as optional (`localhost/api-json`).

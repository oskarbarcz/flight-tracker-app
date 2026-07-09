## 1. Model & types

- [x] 1.1 Add optional `dryOperatingWeight`, `takeoffWeight`, `landingWeight`, `maxZeroFuelWeight`, `maxTakeoffWeight`, `maxLandingWeight` (all `number`, tons) to the `Loadsheet` type in `app/features/flight/model.ts`.
- [x] 1.2 Add the same fields to `ApiLoadsheetResponse` in `app/features/flight/request.ts`; confirm the `Flight` constructor still passes loadsheets through unchanged.

## 2. Form plumbing

- [x] 2.1 Extend `FlatLoadsheetFormData` and both mappers (`flatLoadsheetToLoadsheet`, `loadsheetToFlatLoadsheet`) in `app/features/flight/form-types.ts` with the six new fields (mapper defaults missing values to 0).
- [x] 2.2 Extend `updatePreliminaryLoadsheetSchema` in `app/features/flight/schema.ts` with non-negative / max-3-decimal validation for each new weight and limit (via a shared `requiredWeight` helper).

## 3. Form redesign

- [x] 3.1 Rewrite `UpdateLoadsheetForm.tsx` as a grouped layout: Souls, then a Weights build-up (dry operating → payload → zero-fuel → take-off → landing) with `t` units, then a Limits group (max zero-fuel / take-off / landing).
- [x] 3.2 Show a live-computed weight build-up panel from current Formik values (`useFormikContext`), including the suggested zero-fuel = dry operating + payload.
- [x] 3.3 Keep the redesigned form presentation-only so `UpdatePreliminaryLoadsheetModal` and `UpdateFinalLoadsheetModal` consume it unchanged.

## 4. Validation & limit warnings

- [x] 4.1 Add inline over-limit warnings computed from live values: zero-fuel > max zero-fuel, take-off > max take-off, landing > max landing, each naming the offending weight (amber badge "over max X t").
- [x] 4.2 Add a consistency hint when zero-fuel weight differs materially from dry operating weight + payload.
- [x] 4.3 Confirm field-level errors still block submit while warnings do not (verified: "At least 1 pilot is required" blocks; over-limit is a non-blocking warning).

## 5. Display

- [x] 5.1 Show the new operational weights (dry operating, take-off, landing) read-only in `LoadsheetFigures`, gated on presence, so saved values appear in the Fuel & load view.

## 6. Verification

- [x] 6.1 In the running app, opened the preliminary loadsheet editor on LH450 and confirmed the redesigned layout (Souls / Weights / Limits), the live build-up, the over-limit warning ("over max 240.0 t" on take-off), the consistency hint ("≠ dry operating + payload"), and that field errors block submit.
- [x] 6.2 The form is the shared `UpdateLoadsheetForm`, so the pilot final flow renders identically; the submit payload includes the new fields via `flatLoadsheetToLoadsheet` (verified by code — not exercised end-to-end in-browser since it needs a pilot at finish-boarding).
- [x] 6.3 Persisted round-trip is blocked until `flight-tracker-api` adds the new `Loadsheet` fields (`dryOperatingWeight`, `takeoffWeight`, `landingWeight`, `maxZeroFuelWeight`, `maxTakeoffWeight`, `maxLandingWeight` — `number`, tons); documented in the proposal/design for the backend team.
- [x] 6.4 Ran `npm run lint`, `npm run typecheck`, `npm run build` (all pass); bumped `package.json` to 2.41.0.

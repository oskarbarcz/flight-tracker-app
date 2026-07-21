## Context

The add/edit aircraft forms are Formik forms inlined in the route files `CreateAircraftRoute.tsx` and `EditAircraftRoute.tsx` (under `app/routes/operations/operators/aircraft/`). Both convert Formik values to `FormData`, then `clientAction` reads a fixed key list via `getFormData<...>(form, ["type", "selcal", "registration", "livery"])` and calls `AircraftService.createNew` / `.update`. Validation is a single Yup schema (`app/features/aircraft/schema.ts`) typed against `CreateAircraftRequest` (`app/features/operator/request.ts`).

The read model already exposes `baseAirport` (`GetAircraftResponse.baseAirport`, nullable) and a details card renders it. The live `localhost/api-json` contract exposes `etopsThresholdMinutes` on both `CreateAircraftRequest` and `UpdateAircraftRequest` (nullable enum `60|75|90|120|180`) but does **not** yet include `baseAirportId` on either request, and still marks `selcal` required. Per product decision, the backend is being extended in parallel to accept `baseAirportId` and relax `selcal`; the FE ships against that target contract.

A reusable, Formik-integrated airport picker already exists (`AdvancedSelect` + `airportSelectOptions`), used by the flight route form and the aircraft reposition modal, including a `required={false}` clearable variant used for optional ETOPS entry/exit airports. No new UI primitives are needed.

## Goals / Non-Goals

**Goals:**
- Capture base airport and ETOPS threshold on both add and edit forms, mapping to `baseAirportId` (nullable) and `etopsThresholdMinutes` (nullable number).
- Make SELCAL optional while preserving the `XX-XX` format check when a value is present.
- Reuse existing form primitives (`AdvancedSelect`, `airportSelectOptions`, managed form blocks) rather than introduce new ones.
- Surface the ETOPS threshold on the aircraft details view.

**Non-Goals:**
- No changes to the reposition flow or the "last airport" concept.
- No free-form ETOPS input — values are constrained to the documented enum.
- No backend implementation (contract dependency only).
- No new airport-management surfaces; airports come from the existing `AirportService.fetchAll()`.

## Decisions

- **Reuse `AdvancedSelect` for base airport, `required={false}`.** It already provides search, portal dropdown, and a clear button when not required — matching the nullable, optional semantics. Alternative (a bespoke select) was rejected: it would duplicate the reposition/flight-route pattern and diverge on styling.
- **Load airports in each route's `clientLoader`.** Both loaders currently fetch only airframes; add `airportService.fetchAll()` and build options with `airportSelectOptions`. This keeps the picker data-driven and consistent with the reposition modal.
- **Model ETOPS as a managed select over a fixed option list**, with a "Not ETOPS-certified" option whose value maps to `null`. Because `FormData`/`getFormData` yields strings, the empty/none selection and the numeric strings are normalized in `clientAction` before calling the service: `"" → null`, otherwise `Number(value)`. Alternative (numeric input) was rejected — the API only accepts the five enum values.
- **Add the new keys to the `getFormData(...)` list and to `CreateAircraftRequest`.** `EditAircraftRequest` stays an alias. Add `baseAirportId: string | null` and `etopsThresholdMinutes: number | null` to the request type; make `selcal` optional (`selcal?: string`).
- **SELCAL validation** becomes `string().optional()` with the format enforced via `.matches(/^[A-Z]{2}-[A-Z]{2}$/, { message: "SELCAL must be in format XX-XX", excludeEmptyString: true })`, mirroring how optional-but-formatted fields are handled elsewhere.
- **Base airport / ETOPS validation.** `baseAirportId` follows the optional-airport pattern (`string().defined().default("")` in Formik, normalized to `null` on submit). `etopsThresholdMinutes` is validated as an optional member of the allowed set.
- **Edit pre-fill.** `initialValues` derive `baseAirportId` from `aircraft.baseAirport?.id ?? ""` and `etopsThresholdMinutes` from the aircraft's value (add `etopsThresholdMinutes` to the `Aircraft` model, which the read contract already returns).

## Risks / Trade-offs

- **Backend contract not yet live for `baseAirportId` / optional `selcal`** → Ship FE against the target contract; coordinate merge with the backend change. Until the backend accepts `baseAirportId`, submitting it may be ignored or 400. Mitigation: land backend first (or same window); the GitHub issue tracks the dependency.
- **String→number/null coercion for `etopsThresholdMinutes`** → A missed coercion would send `"180"` or `""` instead of `180` / `null`. Mitigation: normalize centrally in `clientAction`, and validate the enum in Yup so bad values never reach the service.
- **Airport list size** → `AirportService.fetchAll()` returns the full airport library; the picker already handles this via keyword search and `maxResults`, as in the reposition modal, so no pagination is introduced.

## Migration Plan

- No data migration. Deploy alongside (or after) the backend contract change that adds `baseAirportId` and relaxes `selcal`. Rollback is a straight revert of the FE change; no persisted state depends on it.

## Open Questions

- None outstanding. Base airport and SELCAL contract direction resolved with the user (build FE to send `baseAirportId`; make SELCAL FE-optional).

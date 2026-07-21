## 1. Request types and model

- [x] 1.1 In `app/features/operator/request.ts`, add `baseAirportId: string | null` and `etopsThresholdMinutes: number | null` to `CreateAircraftRequest`, and make `selcal` optional (`selcal?: string`); `EditAircraftRequest` stays an alias
- [x] 1.2 In `app/features/aircraft/model.ts`, add `etopsThresholdMinutes: number | null` to the `Aircraft` type (base airport already exists on the model)

## 2. Validation schema

- [x] 2.1 In `app/features/aircraft/schema.ts`, make `selcal` optional: replace `.required(...)` with `.defined().default("")` (empty allowed) and keep the `XX-XX` format check via `.matches(/^[A-Z]{2}-[A-Z]{2}$/, { message: "SELCAL must be in format XX-XX", excludeEmptyString: true })`
- [x] 2.2 Add `baseAirportId` to the schema following the optional-airport pattern (`string().defined().default("")`)
- [x] 2.3 Add `etopsThresholdMinutes` to the schema as a defined string constrained via `.oneOf` to the `notEtopsCertified` sentinel (`"none"`) plus the allowed minute strings from `etopsThresholdMinutesOptions` (`60`, `75`, `90`, `120`, `180`)
- [x] 2.4 Type the schema/form with a dedicated `AircraftFormValues` (all-string fields) rather than `CreateAircraftRequest`; `clientAction` maps `AircraftFormValues` to the typed `CreateAircraftRequest` payload (string→number/null normalization). Reason: the payload now has `number | null`, which cannot be the Formik/select value type

## 3. Add aircraft form (CreateAircraftRoute.tsx)

- [x] 3.1 Extend `clientLoader` to also fetch airports via `new AirportService().fetchAll()` and build options with `airportSelectOptions`
- [x] 3.2 Add `baseAirportId: ""` and `etopsThresholdMinutes: notEtopsCertified` (`"none"`) to `initialValues`
- [x] 3.3 Render an `<AdvancedSelect field="baseAirportId" required={false}>` base airport picker using the built options
- [x] 3.4 Render an ETOPS threshold selector (`ManagedSelectBlock`, `required={false}`) using the shared `etopsThresholdSelectOptions` ("Not ETOPS-certified" first, then `60`, `75`, `90`, `120`, `180`)
- [x] 3.5 In `clientAction`, add `"baseAirportId"` and `"etopsThresholdMinutes"` to the `getFormData(...)` key list, and normalize before calling the service: empty `baseAirportId` → `null`; `etopsThresholdMinutes` `"none" → null` else `Number(value)`

## 4. Edit aircraft form (EditAircraftRoute.tsx)

- [x] 4.1 Extend `clientLoader` to also fetch airports and build options
- [x] 4.2 Pre-fill `initialValues` with `baseAirportId: aircraft.baseAirport?.id ?? ""` and `etopsThresholdMinutes: aircraft.etopsThresholdMinutes?.toString() ?? notEtopsCertified`
- [x] 4.3 Render the base airport picker and ETOPS threshold selector (same as add form)
- [x] 4.4 In `clientAction`, add the new keys to `getFormData(...)` and apply the same null/number normalization as the add form

## 5. Aircraft details view

- [x] 5.1 Display `etopsThresholdMinutes` on the aircraft details view as an "ETOPS threshold" row in `AircraftTechnicalStatusCard` (prop passed from both `AircraftDetailsRoute` and the pilot `AircraftHistoryDetailsRoute`), showing `<n> minutes` when set and "Not ETOPS-certified" when `null`

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npm run typecheck` clean
- [x] 6.2 Manually verified against the running app (backend contract now live): create with base airport + ETOPS 180 + empty SELCAL → `POST` 201 with `{selcal:null, baseAirportId:<FRA>, etopsThresholdMinutes:180}`; edit pre-fills base airport/ETOPS; clearing base airport + "Not ETOPS-certified" → `PATCH` 200 with `{baseAirportId:null, etopsThresholdMinutes:null}`; invalid SELCAL rejected client-side; details view shows ETOPS row and SELCAL placeholder

## 7. SELCAL empty-value display (follow-up)

- [x] 7.1 `Aircraft.selcal` typed `string | null` (backend now returns nullable SELCAL)
- [x] 7.2 Render an em-dash `—` placeholder wherever SELCAL is displayed so a null value doesn't break layout: fleet table (`AircraftListTable`), details header (`AircraftDetailsHeader`), tracking box (`FlightInfoBox`), map drawer (`FlightDetailsDrawer`), operator leg preview (`LegPreview`)

## 8. Aircraft form UX + fleet table (follow-up)

- [x] 8.1 Switch aircraft form text inputs (registration, SELCAL, livery) from `InputBlock` to `ManagedFloatingInputBlock` (floating labels); SELCAL `required={false}` (no star), registration & livery required (red `*`)
- [x] 8.2 Extend `ManagedFloatingInputBlock` with an optional `errors` prop so server-side field violations still show inline (merged with the client error); wire it from both routes via a `serverErrors(name)` helper
- [x] 8.3 Fleet table: merge cruise speed + service ceiling + performance class & code into one "Performance" column (`Weight · Code` bold over `Mach · ceiling` muted)
- [x] 8.4 Fleet table: add a "Base" column rendering the standard airport chip (`AircraftAirportRow`: shape avatar + `IATA | name` + city/country); loader now fetches airports to resolve `baseAirport.id` → full `Airport` (for the shape), empty state `—` when unset

## 9. Optional livery (follow-up)

- [x] 9.1 Make `livery` optional, mirroring the contract: schema `.defined().default("")` with `max(100)` and a min-2-when-present test; no `*`, `required={false}` on both forms
- [x] 9.2 `livery` is optional but non-nullable (backend fills `<operator> <year>` default when OMITTED, response always a string): `CreateAircraftRequest.livery?: string`, `Aircraft.livery` stays `string`; actions send `values.livery || undefined` (omit when empty); no `—` placeholder needed for livery
- [x] 9.3 Verified end-to-end: `POST` with base airport + no livery → 201, response `livery: "Condor 2026"` (backend default), `selcal: null`, `etops: null`

## 10. Base airport required on create (backend constraint)

- [x] 10.1 Discovered via BE check: `CreateAircraftRequest.required` includes `baseAirportId` and validation rejects `null` ("baseAirportId must be a UUID") — base airport is REQUIRED on create even though the doc marks it nullable; `UpdateAircraftRequest` allows null (clearing on edit is fine)
- [x] 10.2 Base airport is mandatory everywhere (product decision): single `aircraftSchema` with `baseAirportId: string().required("Base airport is required")`, used by both forms
- [x] 10.3 Both create & edit forms render the base airport `AdvancedSelect` as required (red `*`, not clearable); empty submit is blocked client-side ("Base airport is required") — no 400. Edit pre-fills the current base and cannot be cleared. Verified in the browser on both forms

## 11. Form redesign: sections + expanded selects (follow-up)

- [x] 11.1 Group both aircraft forms into two `Container` sections with `ContainerTitle` eyebrows: "Identification" (airframe, registration, SELCAL) and "Lifecycle" (base airport, livery name, ETOPS threshold)
- [x] 11.2 Add optional `clearable` prop to `AdvancedSelect` (defaults to `!required`) so a field can be non-clearable without showing a required star
- [x] 11.3 Convert Airframe and ETOPS threshold from native `ManagedSelectBlock` to the rich `AdvancedSelect` combobox, matching base airport. New option builders `airframeSelectOptions` (aircraft-thumbnail avatar, name + type, searchable) and `etopsThresholdSelectOptions` (clock avatar); ETOPS uses `required={false} clearable={false}` since "Not ETOPS-certified" is the explicit empty option
- [x] 11.4 Verified in the browser: airframe search (e.g. "777" → B777 variants with thumbnails), selected chip shows thumbnail + name + type, ETOPS dropdown shows clock options; no console errors, lint + typecheck clean

## 12. Per-section save (like create-a-flight)

- [x] 12.1 Reuse the shared `FormSection` (own Formik + Save/Edit affordance) pattern from the flight form. New `app/features/aircraft/form.ts`: `AircraftFormData` (per-section values + `isIdentitySubmitted`/`isLifecycleSubmitted`), `initAircraftFormData(aircraft?)`, `aircraftFormDataToRequest`, `aircraftRequestError`
- [x] 12.2 Split schema into `aircraftIdentitySchema` + `aircraftLifecycleSchema`; new section components `AircraftIdentificationFormSection` + `AircraftLifecycleFormSection` (build their own airframe/airport options; ETOPS uses the shared clock options); moved option builders into `~/features/aircraft/components/Form/`
- [x] 12.3 Routes hold `formData` state, per-section `onSubmit` commits + marks submitted; a `FormSubmit` bar is disabled with "Save all sections first." until both sections are saved, then creates/updates via `aircraftService` (direct call, replacing the old clientAction) and navigates. Errors surface via `FormSubmit` (violation message or general)
- [x] 12.4 Create: sections start editable, must be saved before the final "Create new aircraft" enables. Edit: sections start collapsed (Edit buttons) pre-filled, "Save changes" ready immediately
- [x] 12.5 Verified end-to-end: create with only airframe+registration+base saved → `POST` 201 (`livery` omitted → "Condor 2026" default); section Save→Edit collapse, final button gating, and edit pre-fill all confirmed in the browser; no console errors, lint + typecheck clean
- [x] 12.6 `AdvancedSelect` selected-value button now has a disabled style (`opacity-50 cursor-not-allowed`, no hover) matching the disabled flowbite text inputs, so collapsed/read-only sections read uniformly disabled. Verified on the edit form (airframe/base/ETOPS dimmed to match registration/livery)

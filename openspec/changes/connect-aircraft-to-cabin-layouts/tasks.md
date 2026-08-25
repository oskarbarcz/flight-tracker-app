## 1. Cabin layout slice scaffolding

- [x] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Create `app/features/cabin-layout/` with `model.ts`, `service.ts`, `i18n.ts` and `index.ts`
- [x] 1.3 Define the catalogue types in `model.ts`: `CabinLayout` (`variant` and `retiredAt` nullable, `sourceSlugs` an array carrying two entries for a merged deck pair), `CabinLayoutSuggestion` extending it with `match`, `CabinLayoutList` with `items`/`total`/`limit`/`offset`, and `AircraftCabinLayout` with nullable `variant` and `revision` plus `retired` and `mismatched`
- [x] 1.4 Define the enums in `model.ts`: `CabinClass` (`first`, `business`, `premium_economy`, `economy`), `Deck` (`main`, `upper`) and `LayoutMatch` (`exact`, `airline`, `aircraft_type`)
- [x] 1.5 Implement `CabinLayoutService` on `AbstractAuthorizedApiService` with `list({ airlineIata, aircraftIata, retired, limit, offset })` and `fetchById(id)`, omitting absent filters from the query string rather than sending empty values
- [x] 1.6 Add `i18n.ts` translating `CabinClass`, `Deck` and `LayoutMatch`, wired through `toHuman`
- [x] 1.7 Register `cabinLayoutService` in `ApiProvider` and the `ApiServices` type in `app/shared/api/useApi.tsx`

## 2. Aircraft and airframe model changes

- [x] 2.1 Add `iataType: string | null` and `serviceType: AirframeServiceType` to `Airframe` in `app/features/airframe/model.ts`, with the enum covering `passenger`, `cargo` and `both`
- [x] 2.2 Add `cabinLayout: AircraftCabinLayout | null` to `Aircraft` in `app/features/aircraft/model.ts`
- [x] 2.3 Add `fetchCabinLayoutSuggestions(operatorId, aircraftId)`, `assignCabinLayout(operatorId, aircraftId, cabinLayout)` sending `PUT` with a `{ cabinLayout }` body, and `removeCabinLayout(operatorId, aircraftId)` sending `DELETE`, to `AircraftService`
- [x] 2.4 Add `lib/mismatchReason.ts` deriving from an aircraft and its layout which of the airline or the aircraft type disagrees, so the caution can name it instead of stating a bare mismatch

## 3. The cabin layout card

- [x] 3.1 Build `AircraftCabinLayoutCard` in `app/features/aircraft/components/AircraftDetails/` using `Container` with a `CardHeader`, matching `AircraftTechnicalStatusCard`
- [x] 3.2 Render the assigned state: layout identifier, airline and aircraft type, variant where present, and the revision — distinguishing a null revision as "seat map not yet read" rather than showing nothing
- [x] 3.3 Render the mismatch caution naming the specific disagreement, and the retired marker, each carrying a word or icon rather than colour alone
- [x] 3.4 Render the empty state on `bg-gray-50`, stating that flights on this aircraft generate no passenger manifest
- [x] 3.5 Add Assign, Change and Remove actions, with Remove behind a confirmation that names the same consequence
- [x] 3.6 Mount the card in the right-hand column of `AircraftDetailsRoute`, revalidating after every assignment change and reporting failures through `useToast` without leaving stale state on screen

## 4. The assignment modal

- [x] 4.1 Build `AssignCabinLayoutModal` with the shared chrome — `Modal`, `ModalTitle`, `ModalActions` — following `RepositionAircraftModal`
- [x] 4.2 Load suggestions on open and render them grouped under headings by `match`, strongest group first, naming the basis of each match
- [x] 4.3 Mark retired candidates and keep them selectable; do not filter out candidates that would be mismatched
- [x] 4.4 Render the empty-suggestions state, and the distinct state where the airframe reports no IATA type code, explaining that no match on aircraft type is possible
- [x] 4.5 Build the catalogue browse tier: an airline IATA code field and an aircraft IATA type code field prefilled from the aircraft, validated to the lengths the API accepts, over a paged `CabinLayoutService.list` with the match count reported
- [x] 4.6 Render both tiers as the same grouped, selectable list so that they visibly choose the same thing
- [x] 4.7 Mark the currently assigned layout in both tiers, and disable confirming when the selection has not changed
- [x] 4.8 Keep focus order coherent across the two tiers and return focus to the invoking control on close

## 5. Fleet coverage

- [x] 5.1 Add a compact cabin coverage indicator to `AircraftListTable` reading from the `cabinLayout` already present on the fleet response, with no additional request
- [x] 5.2 Distinguish assigned, mismatched and absent by shape or text as well as colour
- [x] 5.3 Drop the indicator first at narrow breakpoints rather than letting the table scroll

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 6.2 Verify against the live API as operations: assign from an exact suggestion on KLM's PH-BXA, assign from an airline-only suggestion on a Lufthansa A330-900, replace, and remove
- [x] 6.3 Verify the seeded Lufthansa fleet renders five mismatched aircraft and two without a layout, and that the mismatch caution names the aircraft type rather than the airline
- [x] 6.4 Verify the catalogue browse pages correctly and that an airline code shorter than two characters is not sent to the API
- [x] 6.5 Verify a failed assignment leaves the card reporting the layout the server actually holds
- [x] 6.6 Check contrast, focus order and non-colour encoding of both flags in light and dark against WCAG 2.1 AA
- [x] 6.7 Run `npm run build`

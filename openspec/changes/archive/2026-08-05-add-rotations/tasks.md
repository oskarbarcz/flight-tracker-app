## 1. Data layer — rotation feature module

- [x] 1.1 Create `app/features/rotation/request.ts` with DTO types matching the API: `RotationUser`, `LegAirport`, `LegFlight`, `RotationLeg`, `ApiRotationResponse` (status enum `draft|ready|in_progress|finished`), `CreateRotationRequest` (`name`, `pilotId`), `AddLegRequest` (`flightNumber`, `departureId`, `arrivalId`, `offBlockTime`, `onBlockTime`), `UpdateLegRequest` (all optional)
- [x] 1.2 Create `app/features/rotation/model.ts`: `RotationStatus` enum + `Rotation`/`RotationLeg` domain classes parsing the response (dates → `Date`), with getters `isDraft`, `isReady`, `activeLeg(currentFlightId?)`, `nextLeg`, `completedLegs`, `progress`, `legStatus(leg)` → `done|active|upcoming`, `canMarkReady` (≥ 2 legs forming a continuous non-overlapping chain), and `legsWithoutFlight`
- [x] 1.3 Create `app/features/rotation/schema.ts`: Yup `createRotationSchema` (name 3–50, `pilotId` uuid) and `legSchema` (flightNumber/departureId/arrivalId required, departure ≠ arrival, `onBlockTime` after `offBlockTime`)
- [x] 1.4 Create `app/features/rotation/i18n.ts`: rotation status labels; wire into the global `toHuman` in `app/i18n/translate.ts` mirroring the flight status pattern
- [x] 1.5 Create `app/features/rotation/service.ts`: `RotationService extends AbstractAuthorizedApiService` with `create(operatorId, body)`, `listForOperator(operatorId)`, `fetchById(rotationId)`, `addLeg(rotationId, body)`, `updateLeg(rotationId, legId, body)`, `removeLeg(rotationId, legId)`, `attachFlight(rotationId, legId, flightId)`, `detachFlight(rotationId, legId)`, `markReady(rotationId)`, and `fetchMine()` (`GET /api/v1/user/me/rotations`) — each returning the parsed `Rotation`(s)
- [x] 1.6 Create `app/features/rotation/index.ts` barrel re-exporting `model`, `schema`, `service`, `i18n` (NOT `request`)
- [x] 1.7 Register `rotationService` in `app/shared/api/useApi.tsx` (import, `ApiServices` field, `useMemo` instance)
- [x] 1.8 `npm run typecheck` passes for the new module

## 2. Operations — rotations list

- [x] 2.1 Add a "Rotations" tab beside "Fleet" in `app/features/operator/components/Table/Tabs/OperatorTabs.tsx`
- [x] 2.2 Create the rotations list route component (rows: name, pilot, leg count, status) rendered under the operator layout; register in `app/routes.ts`
- [x] 2.3 Create a rotations list empty state (invite to create the first rotation), using `bg-gray-50` for the placeholder
- [x] 2.4 Add a "New rotation" action that opens the builder in create mode

## 3. Operations — rotation builder/detail page

- [x] 3.1 Create the builder route (create + edit unified) with a `useReducer`/state holding one `Rotation` and a `replace(rotation)` applied after every successful mutation; the page renders a **plan phase** (`draft`) or **crew phase** (`ready`/`in_progress`/`finished`) by status; register in `app/routes.ts`
- [x] 3.2 Metadata section: rotation name + pilot-by-license input (revive the `PilotLicenseInputBlock` pattern using `userService.fetchUserByLicenseId`, storing the resolved user id as `pilotId`); Formik + `createRotationSchema`; create via `rotationService.create` then load the returned rotation
- [x] 3.3 Legs list rendered in API order — each row shows flight number, `departure → arrival`, off/on-block times (single-space `<Date> <Time>`), computed block time, and (crew phase) attached-flight status or an "Attach" action
- [x] 3.4 Plan phase — add-leg form (`legSchema`, departure ≠ arrival, off-block < on-block) defaulting departure to the previous leg's arrival → `addLeg`; edit-leg → `updateLeg` (changed fields only); remove-leg with confirm → `removeLeg`; all disabled outside `draft`
- [x] 3.5 "Mark ready ▸" action → `markReady`, enabled only when the local rotation has ≥ 2 legs forming a continuous non-overlapping chain (mirror `assertChainContinuous`), with a hint when not satisfied
- [x] 3.6 Crew phase — leg-scoped flight picker modal (evolution of the removed `PickFlightModal`) listing only the operator's `Created` flights matching the leg (flight number + departure + arrival) and unattached → `attachFlight`; detach action (only while flight is `Created`) → `detachFlight`; show attachment progress ("N of M legs have a flight")
- [x] 3.7 On any mutation rejection (HTTP 409 or 422), show an error toast carrying the server message and refetch the rotation; never leave partial local state
- [ ] 3.8 Verify light + dark styling and WCAG 2.1 AA on the builder in both phases

## 4. Model — close the `canceled` gap

- [x] 4.1 Add `Canceled = "canceled"` to `RotationStatus` (`app/features/rotation/model.ts`); add `canceledBy: RotationUserResponse | null`, `cancellationReason: string | null`, `canceledAt: string | null` to `ApiRotationResponse` (`request.ts`) and their parsed counterparts to the `Rotation` class, plus an `isCanceled` getter
- [x] 4.2 Add a "Canceled" label to `app/features/rotation/i18n.ts` and the matching option to `RotationStatusFilter.tsx`; confirm `RotationStatusBadge` renders it
- [x] 4.3 Add `firstLeg`, `lastLeg`, and `totalBlockTime` getters to `Rotation` for the list/detail summaries (legs sorted by off-block time, matching `hasContinuousChain`)
- [x] 4.4 Confirm `isActive` still excludes `canceled` and `nextLeg`/`legStatus` are unaffected; `npm run typecheck` passes

## 5. Shared components — make them persona-agnostic

- [x] 5.1 Make `RotationLegItem`'s `canEdit`, `canAttach`, `onEdit`, `onRemove`, `onAttach`, `onDetach` props optional so omitting them yields a read-only row, plus an `action` slot for a caller-supplied per-leg control; ops call site in `RotationLegsEditor` keeps passing all of them
- [x] 5.2 Add an optional `activeLegId` prop to `RotationRouteRibbon`; when present its `legState` highlights that leg instead of requiring `status === InProgress`; ops behaviour unchanged when absent
- [x] 5.3 Verify the ops builder still renders Edit/Remove/Attach/Detach correctly in both draft and crew phases (regression check for 5.1) — verified in-browser as an Operations user: draft phase shows Edit/Remove/Mark ready plus per-leg Edit/Remove; crew phase shows the frozen leg set with "Attach flight" on the unattached leg and no Detach on the `checked_in` one. Flight numbers stay dark and unlinked on the ops side (`linkFlightNumber` defaults to `false`)

## 6. Pilot — data hooks

- [x] 6.1 Create `useAssignedRotations` hook in `app/features/rotation/hooks/`: `rotationService.fetchMine()`, drop `draft`, expose `{ active, completed, loading, refresh }` where active = `ready`/`in_progress` and completed = `finished`/`canceled`
- [x] 6.2 Create `useCurrentRotation` hook deriving the single active rotation (prefer `in_progress`, else the `ready` rotation whose first leg starts earliest); expose `{ rotation, loading }`
- [x] 6.3 Re-fetch on `currentFlight?.id` change so the card and list advance when a leg's flight closes, via a new `useOnCurrentFlightChange(handler)` hook in `app/features/flight/hooks/` that `useAssignedRotations` calls (keeps the flight dependency out of the rotation hook and satisfies Biome's `useExhaustiveDependencies` without a suppression comment)

## 7. Pilot — rotations list

- [x] 7.1 Register `route("rotations", "routes/pilot/rotations/PilotRotationsRoute.tsx")` under `PilotLayout` in `app/routes.ts`
- [x] 7.2 Build the list route: Active and Completed groups, each card showing name, `RotationStatusBadge`, the full route chain (`Rotation.routeStops` → `RotationRouteChain`, not just first→last: pilot-visible rotations are chain-validated so the chain never has gaps), leg count, flown `n/m`, and first off-block date (single-space `<Date> <Time>`); whole card links to detail. `RotationTmi` is deliberately omitted from rows — it renders *today's* day-of-year, so it would repeat identically on every row; it stays on the detail header where it means the current TMI
- [x] 7.3 Empty state when the pilot has no non-`draft` rotations, using `bg-gray-50` for the placeholder
- [x] 7.4 Loading skeleton; `usePageTitle`
- [x] 7.5 Add a "Rotations" `SidebarElement` (icon `FaArrowsSpin`, href `/rotations`, selected on `path.startsWith("/rotations")`) to the first `SidebarSection` of `CabinCrewSidebarItems.tsx`, beside Home

## 8. Pilot — rotation detail

- [x] 8.1 Register `route("rotations/:rotationId", "routes/pilot/rotations/PilotRotationDetailsRoute.tsx")` under `PilotLayout`
- [x] 8.2 `clientLoader`: `rotationService.fetchById(rotationId)` + `airportService.fetchAll()` (for the ribbon) + the operator for the carrier line
- [x] 8.3 Guard rendering: show a "not assigned to you" state when `rotation.pilotId !== user.id`, and a "not yet released" state when the rotation is `draft`
- [x] 8.4 Header: "ROTATION" eyebrow, name as `h1`, `RotationStatusBadge`, `RotationTmi`, carrier (operator name as headline, code as muted subtitle); metrics row with total block time, leg count, flown `n/m`
- [x] 8.5 `RotationRouteRibbon` with `currentFlightId` from `useCurrentFlight()`, plus `RotationMap`
- [x] 8.6 Read-only legs list via `RotationLegItem` with no action props, each leg with a link to `/flight-history/{flightId}` when its flight is `Closed`, `/track/{flightId}` otherwise, and an "awaiting flight" treatment when no flight is attached
- [x] 8.7 Cancellation banner on a `canceled` rotation: reason, who canceled, when
- [x] 8.8 Loading skeleton and not-found state; `usePageTitle`

## 9. Pilot — dashboard card

- [x] 9.1 Create `CurrentRotationBox` in `app/features/rotation/components/` using shared `Container`/`ContainerTitle` primitives (icon `FaArrowsSpin`, title "Current rotation"): rotation name, status, compact leg strip (done / active / upcoming) with flight numbers + IATA pairs, and progress as flown `n` of `m` legs
- [x] 9.2 Active/next leg with an attached flight deep-links to `/track/{flightId}`; a next leg without a flight shows as awaiting its flight with no link
- [x] 9.3 Footer link to the rotation's detail page
- [x] 9.4 Create `CurrentRotationBoxLoader` mirroring the other Main box loaders
- [x] 9.5 Wire into the right-hand column of `app/routes/pilot/PilotDashboardRoute.tsx` (above `CurrentLocationBox`) — additive; existing current/next/last boxes and the next-flight logic at `:41` unchanged; render nothing when no active rotation resolves
- [x] 9.6 Verify the card advances when the tracked leg's flight closes (task 6.3 wiring)

## 10. Pilot — accessibility and theming

- [x] 10.1 Verify light + dark styling and WCAG 2.1 AA on the card, list, and detail page — measured contrast in-browser in both themes; fixed three AA failures I had introduced ("Awaiting flight" and the `/n` denominator were `gray-400` at 2.54:1; route-chain arrows at 1.47:1) and `RotationLegItem`'s directional arrow (2.54:1, pre-existing). Remaining sub-AA text is all pre-existing shared components: `ContainerTitle`'s indigo eyebrow (3.85:1) and the flowbite `color="indigo"` primary button (3.85:1, identical on the untouched "Manage"/"New travel" buttons) — both the committed brand accent; plus `RotationRouteRibbon`'s decorative `|` divider and leaflet's own attribution
- [x] 10.2 Verify keyboard reachability and focus-visible rings on every link/row across the three pilot surfaces
- [x] 10.3 Verify mobile layout at 390×844 — ribbon stacks vertically, legs and cards readable, `BottomNav` untouched. Changed the rotation-name headings from `truncate` to `break-words`: the name encodes the trip date and was being cut off on mobile

## 11. Finalize

- [x] 11.1 `npm run lint` (Biome) and `npm run typecheck` pass; no code comments anywhere
- [x] 11.2 Manual smoke test against local API/app (prod build) — used the seeded `in_progress` (leg 1 attached + `checked_in` = the pilot's current flight, leg 2 unattached) and `finished` rotations. Confirmed: card renders in the dashboard's right column with the active leg resolved from the current flight and a Track button, leg 2 as "Awaiting flight", Flown 0/2, and a working link to detail; list groups them under Active/Completed; detail shows the full itinerary, ribbon, map, turnaround, and Debrief links on the finished rotation's closed legs
- [x] 11.3 Verify the pilot cannot see a `draft` rotation (list and direct link) and cannot open another pilot's rotation by id — both guard states confirmed in-browser with throwaway rotations (since deleted)
- [x] 11.4 Bump `package.json` version (CI version check)
- [ ] 11.5 Run `/opsx:archive` after implementation is complete and merged

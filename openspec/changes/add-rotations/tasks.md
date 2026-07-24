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

## 4. Pilot — current rotation card (BLOCKED until `GET /user/me/rotations` ships)

- [ ] 4.1 Create `useCurrentRotation` hook: `rotationService.fetchMine()` (`GET /user/me/rotations`), pick the active rotation (prefer `in_progress`, else earliest-starting `ready`); expose `{ rotation, loading }`
- [ ] 4.2 Create `CurrentRotationBox` in `app/features/flight/components/Dashboard/Main/Box/` (or a rotation components dir) using shared `Container`/`ContainerTitle` primitives: leg strip with done ● / active ◉ / upcoming ○, flight numbers + routes, overall progress
- [ ] 4.3 Active/next leg with an attached flight deep-links to `/track/{flightId}`; when the tracked leg's flight closes, the card advances to the next unflown leg
- [ ] 4.4 Create the card's loader/skeleton mirroring the other Main box loaders
- [ ] 4.5 Wire into `app/routes/pilot/PilotDashboardRoute.tsx` — additive, existing current/next/last boxes unchanged; render nothing when no rotation resolves
- [ ] 4.6 Verify light + dark styling and WCAG 2.1 AA on the card

## 5. Finalize

- [x] 5.1 `npm run lint` (Biome) and `npm run typecheck` pass; no code comments anywhere
- [ ] 5.2 Manual smoke test against local API/app (prod build): create a rotation, plan ≥ 2 chained legs, mark ready, attach a matching `Created` flight to each leg; sign in as the assigned pilot and confirm the card appears, shows progress, and deep-links into tracking
- [ ] 5.3 Bump `package.json` version (CI version check)
- [ ] 5.4 Run `/opsx:archive` after implementation is complete and merged

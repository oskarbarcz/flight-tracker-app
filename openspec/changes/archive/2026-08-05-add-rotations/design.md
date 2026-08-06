## Context

The API added a rotation hierarchy — `Operator → Rotation → Leg → (optional) Flight` — with a server-enforced lifecycle (`draft → ready → in_progress → finished`). The previous flat rotation feature was fully removed in `remove-rotations` (#233), so this is a clean rebuild against a richer contract.

Two personas consume it: **Operations** (planner) and the **pilot** (the single playable flying character, login role `UserRole.CabinCrew`; the `app/routes/pilot/` tree is guarded by `allowOnly={UserRole.CabinCrew}`). There is no separate "cabin crew" persona.

Key contract facts that constrain the design:
- Every mutation returns the **full updated `Rotation`** aggregate.
- `GET` rotation endpoints are **public** (no JWT); mutations require JWT. Rejections come as **409** (conflict: legs frozen, flight already attached, rotation not active, leg locked, finished-immutable) or **422** (validation: invalid leg, broken chain, flight not attachable, not readyable). Both carry a human message that should be surfaced.
- `Rotation` links to exactly one `pilotId` (always a user with role `CabinCrew`). `Flight` has **no** back-reference to rotation/leg. `User` has no `operatorId`; the pilot's rotations are reached through a new `GET /user/me/rotations` endpoint (being added).
- **Two editing phases (verified against the backend commands):**
  - `draft` — add/edit/remove legs; **flights cannot be attached yet**. A leg requires departure ≠ arrival and off-block < on-block.
  - `ready`/`in_progress` — the leg set is **frozen** (add/remove → 409); flights are attached/detached. An attachable flight must be the same operator, status `Created`, unattached elsewhere, and match the leg's flight number + departure + arrival (no time check). A flight is detachable only while still `Created`.
- **Mark-ready preconditions:** ≥ 2 legs forming a continuous, non-overlapping chain (each leg departs from the previous leg's arrival). Enforced server-side; mirrored client-side to gate the action.
- **Lifecycle beyond `ready` is event-driven on the backend:** `ready → in_progress` on the first **pilot check-in** to a leg's flight; `in_progress → finished` when the **last leg's flight is closed**. No frontend action exists for these.
- A leg is an *intent to fly* (plan); the attached flight is the *record of the actual operation*. Leg requests carry **no** `sequence` field; the API orders `legs[]` by off-block time.

## Goals / Non-Goals

**Goals:**
- A `rotation` feature module mirroring existing feature conventions, with a `Rotation` domain class that centralizes sequence logic (active/next leg, progress, readiness).
- An Operations single builder/detail page: metadata + inline legs + per-leg flight attach/detach + a "Mark ready" gate.
- An additive pilot dashboard `CurrentRotationBox` that appears only when a rotation is detectable and links into existing flight tracking.
- A read-only pilot rotations list and detail page, reusing the ops presentational components rather than forking them.
- Graceful 409 handling via toasts, with local state left intact.

**Non-Goals:**
- Re-adding `Flight.rotationId` or any flight → rotation back-reference.
- New `FlightEventType` members or socket events (unless the API emits them).
- Drag-and-drop leg reordering.
- Creating flights from within the builder (flight creation stays in "Plan new flight").
- New status-progression machinery on the pilot side — tracking reuses the existing `useTrackedFlight` state machine.
- Building the `GET /user/me/rotations` endpoint itself — that is backend work in the separate API repo; this change only consumes it (it has since shipped).
- Any pilot-side action that changes rotation status — `ready → in_progress → finished` is backend-driven from flight events.
- Any pilot-side mutation at all: no attach/detach, no mark-ready, no cancel, no leg editing. The pilot surface is read-only.
- The Operations *cancel rotation* action (`POST /rotation/{id}/cancel`) and rotation deletion UI — only reading the resulting `canceled` state is in scope.
- Changing the pilot dashboard's next-flight logic to derive from the rotation — the naive `first Ready flight` guess stays.
- A rotations entry in the mobile `BottomNav`.

## Decisions

### 1. Rotation state is a single client-side aggregate replaced on every mutation

Because each mutation returns the whole `Rotation`, the builder holds one rotation object and replaces it wholesale on every successful call — no optimistic patching, no re-stitching legs. **Why:** it matches the contract exactly, eliminates a class of merge bugs, and keeps the builder a thin reducer over `{ rotation, replace(rotation) }`. **Alternative considered:** optimistic local mutation with reconciliation — rejected as needless complexity given the API already returns the source of truth.

### 2. Domain logic lives in a `Rotation` model class, not components

`model.ts` exposes a `Rotation` class parsing the API response into `Date`s and providing getters: `isReady`, `isDraft`, `activeLeg` (leg whose attached `flight.id` matches the pilot's current flight, else the next unflown leg by time), `nextLeg`, `completedLegs`, `progress` (fraction complete), and `legStatus(leg)` → `done | active | upcoming`. **Why:** the same sequence logic is needed by both the Ops builder and the pilot card; keeping it in the model avoids duplicated, drifting logic in JSX. Follows the existing `Flight` class pattern.

### 3. Pilot rotation discovery uses a dedicated `me/rotations` endpoint

The card fetches the pilot's rotations from a new **`GET /api/v1/user/me/rotations`** endpoint (a backend dependency being added alongside this work), then picks the active one client-side: prefer `in_progress`, else the `ready` rotation whose first leg starts earliest. Encapsulated in a `useCurrentRotation` hook so the card stays declarative. **Why this shape:** `User` carries no `operatorId`, so a "my rotations" endpoint is the clean anchor — one call, always correct, and it can surface a `ready` rotation before any flight exists. **Alternatives considered and rejected:** deriving the rotation on the frontend by enumerating operators (`GET /operator` → each operator's rotations → filter `pilotId`) — it works but costs O(operators × rotations) public list calls per dashboard load and can't be trusted to be complete; the stakeholder confirmed the endpoint will be added, so we code against it. The pilot-card tasks are **blocked** on that endpoint; the Operations tasks are not.

### 4. Operations UX: one builder/detail page with two status-driven phases

A rotations list route plus a single builder route (create + edit unified). The page adapts to the rotation's status rather than exposing every action always:

- **Plan phase (`draft`)** — edit metadata and manage legs. New legs default their departure to the previous leg's arrival to steer toward a valid chain; client validation mirrors `assertLegValid` (departure ≠ arrival, off-block < on-block). "Mark ready ▸" is enabled only when there are ≥ 2 legs forming a continuous, non-overlapping chain, with a hint when not. No flight attachment here (the API forbids it in `draft`).
- **Crew phase (`ready`/`in_progress`)** — legs are read-only; each leg exposes Attach/Detach. The leg-scoped picker lists only the operator's `Created` flights matching the leg's number + departure + arrival and not attached elsewhere. The page surfaces attachment progress ("2 of 3 legs have a flight") because every leg needs a flight to be flown. `finished` is fully read-only.

The pilot is chosen by **license ID** using the existing `userService.fetchUserByLicenseId` pattern (the removed `PilotLicenseInputBlock`), not a global user dropdown — it needs no new listing endpoint and matches how the app already resolves pilots. **Why the single page:** the aggregate-replacement model (Decision 1) makes one reactive page natural; a wizard would fragment one aggregate across steps for no benefit. Placed as a "Rotations" tab beside "Fleet" on the operator layout, where the removed feature used to live.

### 5. Card is additive; existing dashboard boxes are untouched

`CurrentRotationBox` (+ a loader mirroring the other Main box loaders) slots into `PilotDashboardRoute`'s right-hand column — the slot the removed placeholder box occupied — alongside the current/next/last flight boxes. **Why:** the stakeholder chose the lower-risk "card alongside flights" option; the naive `flights.filter(status === Ready)[0]` next-flight logic (`PilotDashboardRoute.tsx:41`) stays as-is for now and the card can supersede it later.

### 6. The pilot surface is three read-only views over one fetch

The pilot gets a dashboard card, a `/rotations` list, and a `/rotations/:rotationId` detail page — all read-only, with **no** mutating action anywhere. Operations owns every state change; the pilot flies what was planned.

- **List and card share one call.** `useAssignedRotations()` wraps `rotationService.fetchMine()` and returns every assigned rotation; `useCurrentRotation()` derives the single active one from it (prefer `in_progress`, else the `ready` rotation whose first leg starts earliest). **Why not `?status=` per view:** the endpoint's filter takes one status, so the "active = ready ∪ in_progress" rule would need two calls, and the list needs the unfiltered set anyway. One fetch, client-side partitioning.
- **Detail re-fetches by id** via the existing public `GET /api/v1/rotation/{rotationId}` in a `clientLoader`, alongside `airportService.fetchAll()` (the route ribbon needs full airports for shape/city/country) and the operator for the carrier line. **Why not pass the rotation through router state:** the page must survive a direct link or refresh.
- **Ownership guard on detail.** The GET is public, so the route compares `rotation.pilotId` with the signed-in user and renders a "not assigned to you" state on mismatch. A `draft` rotation gets the same treatment — not yet released to the pilot (Decision 8).

**Why a full list + detail rather than just the card:** a rotation is a multi-day duty assignment; a dashboard tile can show *where you are in it* but not *what the trip is*. The pilot needs the whole itinerary — every leg's times, block time, and whether a flight has been attached yet — before the first leg, and needs the completed rotations afterwards. The card is the "right now" view; the detail page is the trip sheet.

### 7. Pilot views reuse the ops rotation components, made persona-agnostic

Rather than fork presentational components, two of them lose their ops coupling:

- `RotationLegItem` — `canEdit`, `canAttach`, `onEdit`, `onRemove`, `onAttach`, `onDetach` become **optional**; omitting them yields a read-only leg row. The pilot passes none of them and adds its own per-leg link into tracking/history.
- `RotationRouteRibbon` — gains an optional `activeLegId`. Its private `legState` currently marks a leg active only when `rotation.status === RotationStatus.InProgress`, which is right for the planner but wrong for the pilot, who needs the leg they are *actually flying* lit up. With `activeLegId` present the ribbon highlights that leg; without it, ops behaviour is unchanged. **Why an id rather than a `currentFlightId`:** the ribbon should not decide what "active" means. The pilot pages resolve it from the model — `rotation.activeLeg(currentFlight?.id ?? null)?.id` — which also fixes the case where the pilot has no current flight at all, where a `currentFlightId`-shaped prop would have fallen back to the planner rule and highlighted nothing.

`RotationStatusBadge`, `RotationTmi`, `RotationCaptainCard` (its `onEdit` is already optional), and `RotationMap` are already presentational and are reused as-is. **Why:** the leg strip, ribbon, and map are the same information for both personas; duplicating them would guarantee drift, and the model already centralizes the sequence logic (Decision 2).

### 8. Drafts are invisible to the pilot; canceled is a first-class terminal state

The pilot surface admits `ready`, `in_progress`, `finished`, and `canceled` only. A `draft` has mutable legs and no attached flights — showing it would advertise a trip that may be rewritten or deleted. This is the "role-appropriate surfaces" principle: the planner sees work in progress, the pilot sees commitments.

The live API has a fifth status, `canceled`, plus `canceledBy` / `cancellationReason` / `canceledAt` fields and a `POST /rotation/{id}/cancel` endpoint — none of which the frontend model knows about. The `RotationStatus` enum, `ApiRotationResponse`, and `Rotation` are extended to carry them, and the pilot detail page shows the cancellation reason and who canceled it. **Scope line:** reading a canceled rotation is in; the ops *cancel action* is not — that is a separate change. Without the enum member, a canceled rotation would reach the pilot as an unrecognized status, badge and grouping included.

The list groups into **Active** (`ready`, `in_progress`) and **Completed** (`finished`, `canceled`) rather than exposing a five-way status filter like the ops list — the pilot's question is "what am I flying" versus "what have I flown", not "which planning stage is this in".

### 9. "Next leg to fly" is the first unflown leg, whether or not it has a flight

`Rotation.nextLeg` is the first leg that is not `Closed`, which includes legs Operations has not yet attached a flight to. The pilot surface keeps that definition — the leg *is* next in the itinerary — but gates the action on attachment: a leg with an attached flight gets a link into tracking, a leg without one reads as awaiting its flight. **Why:** the alternative (skipping unattached legs when picking "next") would silently reorder the pilot's trip around an Operations gap, hiding exactly the thing they need to notice.

Per-leg links are status-directed: a `Closed` leg's flight goes to `/flight-history/{flightId}`, anything else to `/track/{flightId}`.

### 10. The card advances off the existing flight-event plumbing

`useCurrentFlight()` is already socket-driven, so the card takes `currentFlight?.id` as its `currentFlightId` and re-fetches the pilot's rotations when that id changes. **Why:** closing a leg's flight changes the current flight, which is precisely the moment the rotation's progress moves; no new socket subscription or `FlightEventType` member is needed. **Alternative rejected:** polling `me/rotations` on an interval — cost with no gain, since the trigger is already observable.

### 11. Sidebar gets "Rotations"; the mobile bottom nav does not

A top-level "Rotations" entry (icon `FaArrowsSpin`, matching the established rotation icon) joins "Home" in the first `SidebarSection` of `CabinCrewSidebarItems`. Not under "Library" — that section is retrospective (flight history, aircraft history, travel log), and a rotation is forward-looking duty. `BottomNav` keeps its four items (Home, Track, Airports, Profile); a fifth would crowd it, and on mobile the dashboard card is the entry point into the detail page.

## Risks / Trade-offs

- ~~**Pilot card depends on `GET /user/me/rotations` shipping first**~~ → **Resolved.** The endpoint is live and `fetchMine()` is already written against it; the Operations builder landed independently as planned.
- **Relaxing `RotationLegItem`'s required action props risks a silent ops regression** → The props become optional, but the ops call site keeps passing all of them; verify the builder's draft and crew phases still render Edit/Remove/Attach/Detach after the change.
- **A pilot can reach another pilot's rotation by id** (public GET) → Guard the detail route on `pilotId`, and accept that this is presentation, not access control; nothing secret is exposed that the API did not already publish.
- **Legs with no attached flight look broken to the pilot** → Render them explicitly as awaiting their flight rather than as an empty row, so the pilot reads it as an Operations gap and not a bug.
- **Leg ordering is implicit (by time)** → Do not promise reordering; surface times clearly so the resulting order is predictable to the planner.
- **Attach can be rejected server-side (leg/flight mismatch)** → Pre-filter the picker to matching flights so rejection is the rare edge; on rejection, toast and refetch rather than trusting stale local state.
- **409 races (two planners, or a pilot advancing a rotation)** → On 409, toast and refetch the rotation rather than trusting stale local state; never partially apply.
- **`GET` endpoints are public** → Fine for read, but the builder's mutations and `me/rotations` rely on JWT; ensure the service extends `AbstractAuthorizedApiService` so auth/refresh is handled.

## Migration Plan

Additive only — no destructive changes and no persistence in this repo (backend is separate). Rollback = revert the change; nothing else consumes the new module. The `Flight` contract is unchanged, so no cross-feature migration is needed. Bump `package.json` version before merge (CI-enforced).

## Open Questions

- ~~Exact contract of `GET /api/v1/user/me/rotations`~~ — **resolved against the live spec**: returns `Rotation[]` across all statuses, with an optional `?status=` query filter (one status). The frontend fetches unfiltered and partitions client-side.
- The backend actually permits limited leg edits after `ready` (non-airport fields, if the leg's flight has not checked in, with chain re-validation). This design deliberately keeps the frontend simpler — legs are read-only once `ready` — which is a strict subset of what the API allows and will not trip 409s. Revisit only if planners need post-ready leg tweaks.
- Does the pilot need a notification when Operations attaches the last missing flight, or cancels a rotation they were assigned? Out of scope here; the surface reflects state on load and on flight-event-driven refresh only.
- Should a `finished` rotation link its legs into `/flight-history/{flightId}` for legs whose flights were never flown but the rotation closed anyway? Coding against: link only `Closed` flights to history, everything else to `/track`.

Resolved during design: times are **not** part of the attach match (flight number + departure + arrival only); lifecycle beyond `ready` is backend event-driven; `draft` forbids attachment; `ready` freezes legs.

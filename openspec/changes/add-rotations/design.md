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
- Graceful 409 handling via toasts, with local state left intact.

**Non-Goals:**
- Re-adding `Flight.rotationId` or any flight → rotation back-reference.
- New `FlightEventType` members or socket events (unless the API emits them).
- Drag-and-drop leg reordering.
- Creating flights from within the builder (flight creation stays in "Plan new flight").
- New status-progression machinery on the pilot side — tracking reuses the existing `useTrackedFlight` state machine.
- Building the `GET /user/me/rotations` endpoint itself — that is backend work in the separate API repo; this change only consumes it.
- Any pilot-side action that changes rotation status — `ready → in_progress → finished` is backend-driven from flight events.

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

`CurrentRotationBox` (+ a loader mirroring the other Main box loaders) slots into `PilotDashboardRoute` alongside the current/next/last flight boxes. **Why:** the stakeholder chose the lower-risk "card alongside flights" option; the naive "next flight" logic stays as-is for now and the card can supersede it later.

## Risks / Trade-offs

- **Pilot card depends on `GET /user/me/rotations` shipping first** → Sequence the work so the Operations builder (which needs no new endpoint) lands independently; the pilot-card tasks stay blocked until the endpoint is available, and can be verified against it in isolation.
- **Leg ordering is implicit (by time)** → Do not promise reordering; surface times clearly so the resulting order is predictable to the planner.
- **Attach can be rejected server-side (leg/flight mismatch)** → Pre-filter the picker to matching flights so rejection is the rare edge; on rejection, toast and refetch rather than trusting stale local state.
- **409 races (two planners, or a pilot advancing a rotation)** → On 409, toast and refetch the rotation rather than trusting stale local state; never partially apply.
- **`GET` endpoints are public** → Fine for read, but the builder's mutations and `me/rotations` rely on JWT; ensure the service extends `AbstractAuthorizedApiService` so auth/refresh is handled.

## Migration Plan

Additive only — no destructive changes and no persistence in this repo (backend is separate). Rollback = revert the change; nothing else consumes the new module. The `Flight` contract is unchanged, so no cross-feature migration is needed. Bump `package.json` version before merge (CI-enforced).

## Open Questions

- Exact contract of `GET /api/v1/user/me/rotations` (not yet built): path, and whether it returns all statuses or only active. Coding against: returns the current user's rotations across statuses; the frontend filters to `ready`/`in_progress` for the card, prefers `in_progress`. The stakeholder suggested it may return only the pilot's current rotation(s) — either shape works for the card. Confirm when built.
- The backend actually permits limited leg edits after `ready` (non-airport fields, if the leg's flight has not checked in, with chain re-validation). This design deliberately keeps the frontend simpler — legs are read-only once `ready` — which is a strict subset of what the API allows and will not trip 409s. Revisit only if planners need post-ready leg tweaks.

Resolved during design: times are **not** part of the attach match (flight number + departure + arrival only); lifecycle beyond `ready` is backend event-driven; `draft` forbids attachment; `ready` freezes legs.

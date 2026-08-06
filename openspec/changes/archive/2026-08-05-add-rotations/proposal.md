## Why

The API now exposes a proper rotation hierarchy — `Operator → Rotation → Leg → (optional) Flight` with a `draft → ready → in_progress → finished` lifecycle. This is the clean-slate re-design the earlier removal (`remove-rotations`, #233) was clearing the way for. It gives Operations a way to plan a pilot's multi-leg trip as one assignment, and gives the pilot an ordered sequence to fly — replacing today's naive "next flight = first `ready` flight" guess on the dashboard with a real itinerary.

## What Changes

- Add a new `rotation` feature module (`Rotation`/`RotationLeg` domain model with sequence helpers, `RotationService`, Yup schemas, request DTOs, i18n) and register `rotationService` in the `useApi()` context.
- **Operations** — restore a "Rotations" surface for an operator: a rotations list plus a single builder/detail page with two status-driven phases. In `draft`, create/edit the rotation and plan its legs (a leg is an *intent to fly*: flight number, route, times). "Mark ready" (requires ≥ 2 legs forming a continuous chain) freezes the legs and opens the crew phase, where a matching real flight is attached to each leg. Attach/detach is only possible once `ready`/`in_progress`; the attached flight must be a `Created` flight of the same operator matching the leg's number + route (API-enforced), so the picker offers only those. Add a "Rotations" tab alongside "Fleet" on the operator layout.
- **Pilot** (login role `CabinCrew`, the single playable flying character) — add a read-only rotations surface in three parts: an additive `CurrentRotationBox` on the dashboard that renders only when the pilot has an active rotation (`ready` or `in_progress`); a "Rotations" list route showing the pilot's assigned rotations split into active and completed; and a rotation detail route with the full itinerary (route ribbon, per-leg times and block time, attached-flight status, map) that deep-links each flyable leg into tracking. The pilot has **no** mutating actions anywhere on this surface. Existing current/next/last flight boxes are untouched; the surface only reflects progress — it does not change the existing "next flight" logic.
- Surface lifecycle-guard conflicts (HTTP 409) from rotation mutations as toasts.
- Add the `canceled` rotation status (present in the live API, missing from the frontend model) so the pilot surface renders canceled rotations instead of falling through to an unlabelled state.

## Capabilities

### New Capabilities
- `flight-rotation`: Operations planning of a pilot's rotation (create, plan legs, attach/detach flights, mark ready) and the pilot's read-only rotation progress view on the dashboard, backed by the new rotation API and its lifecycle.

### Modified Capabilities
<!-- None. The pilot dashboard box is additive and does not change existing flight-view requirements; no existing spec's requirements change. -->

## Impact

- **New feature module**: `app/features/rotation/` (`model.ts`, `service.ts`, `schema.ts`, `request.ts`, `i18n.ts`, `index.ts`, `components/`), following existing feature conventions (`app/features/flight`, `app/features/operator`).
- **API layer**: `app/shared/api/useApi.tsx` gains `rotationService` (import + `ApiServices` field + `useMemo` instance). Consumes new endpoints under `/api/v1/operator/{operatorId}/rotation` and `/api/v1/rotation/{rotationId}` (create, list, get, add/update/remove leg, attach/detach flight, mark ready). Every mutation returns the full `Rotation` aggregate. The pilot surface consumes **`GET /api/v1/user/me/rotations`** (`rotationService.fetchMine()`, already written but with zero callers) plus the existing public `GET /api/v1/rotation/{rotationId}` for detail — **no new endpoints needed**.
- **Model gap closed**: `RotationStatus` gains `Canceled`, and `ApiRotationResponse`/`Rotation` gain `canceledBy`, `cancellationReason`, `canceledAt` to match the live contract. The ops-side `RotationStatusFilter` gains the matching option. Rotation cancellation itself (`POST /api/v1/rotation/{rotationId}/cancel`) stays out of scope — only reading a canceled rotation is covered.
- **Pilot selection**: the create form resolves the pilot by license ID via the existing `userService.fetchUserByLicenseId` (reviving the removed `PilotLicenseInputBlock` pattern) — no new user-listing endpoint. Only `CabinCrew` users have a license, so this inherently restricts the choice.
- **Operations routes/UI**: new rotation list + builder routes registered in `app/routes.ts` under the operations/operator layout; a "Rotations" tab in `app/features/operator/components/Table/Tabs/OperatorTabs.tsx`; a leg-scoped flight-picker modal (evolution of the prior removed `PickFlightModal`).
- **Pilot routes/UI**: two new routes under `PilotLayout` in `app/routes.ts` (`rotations`, `rotations/:rotationId`); a "Rotations" entry in `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx`; `app/routes/pilot/PilotDashboardRoute.tsx` gains `CurrentRotationBox` + loader in its right-hand column (where the removed placeholder box lived).
- **Shared rotation components become persona-agnostic**: `RotationLegItem`'s action props (`canEdit`, `canAttach`, `onEdit`, `onRemove`, `onAttach`, `onDetach`) become optional so the pilot renders it read-only; `RotationRouteRibbon` accepts an optional `activeLegId` so the leg the pilot is actually flying is highlighted (today it only highlights when the rotation is `in_progress`).
- **No change to the `Flight` contract**: `GetFlightResponse` is not touched and `Flight.rotationId` is NOT re-added — the link stays one-directional (`Rotation → Leg → flight`). No new `FlightEventType` members unless the API emits them.

## Assumptions / constraints

- **Pilot-side rotation discovery uses a dedicated endpoint — now shipped.** `GET /api/v1/user/me/rotations` exists in the live API (verified against `/api-json`), returns `Rotation[]`, and accepts an optional `?status=` filter. The earlier blocker on the pilot work is cleared. The card picks the active rotation client-side (prefer `in_progress`, else the earliest-starting `ready`) rather than relying on the query filter, so one fetch serves both the card and the list.
- **Pilots do not see `draft` rotations.** A draft is an unfinished plan whose legs can still change and which has no flights attached; surfacing it as "your rotation" would promise work that may never exist. The pilot list and detail therefore admit only `ready`, `in_progress`, `finished`, and `canceled`.
- **Detail reads are ownership-checked client-side.** `GET /api/v1/rotation/{rotationId}` is public, so the pilot detail route compares `rotation.pilotId` against the signed-in user and renders a "not assigned to you" state instead of the itinerary on a mismatch. This is a UX guard, not a security boundary — the data was already public.
- **Rotation lifecycle beyond `ready` is backend-driven.** `ready → in_progress → finished` transitions happen on the backend from flight events; there are no frontend endpoints or actions for them. The frontend only triggers `draft → ready` and otherwise reflects server state.
- **Legs are editable only while `draft`** (working assumption). Once a rotation is `ready` or later, the builder disables mutating actions and treats any HTTP 409 as the authoritative backstop rather than hard-coding a client-side state matrix.
- **Legs are not explicitly reorderable** — no `sequence` field on the leg requests; the API orders `legs[]` by off-block time. The builder renders legs in API order; re-sequencing is done by editing times, not drag-and-drop.
- Flight creation stays in the existing "Plan new flight" flow; the rotation builder only links existing flights, and only ones matching the leg (flight number + departure + arrival).
- Repo conventions apply: named exports only, no code comments, Biome formatting, `~/` alias, WCAG 2.1 AA in light and dark. `package.json` version bump required before merge (CI-enforced).

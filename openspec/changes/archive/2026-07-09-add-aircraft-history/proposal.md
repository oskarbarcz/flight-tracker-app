## Why

Cabin crew have no way to see which aircraft they have flown. The backend already exposes the data (`GET /api/v1/user/me/aircraft`), but nothing in the app surfaces it. Adding an "Aircraft history" view gives cabin crew a personal, browsable record of the machines they have operated.

## What Changes

- Add an **"Aircraft history"** item to the CabinCrew sidebar, visible only to the CabinCrew role.
- Add a new page at `/aircraft-history` that lists every aircraft the signed-in user has flown as a **table** (airframe thumbnail + registration, type, route, operator, livery, and a "View" action). The route (departure → arrival + flight number) comes from the entry's nested `flight` object — no extra lookup.
- Each row's "View" links to a **single aircraft view** at `/aircraft-history/{aircraftId}`.
- Add a CabinCrew-accessible, read-only **single aircraft view** showing the aircraft's airframe specs, identity, base airport, current status, and technical status.
- Across **all CabinCrew screens** (flight history list/detail, dashboard, live tracking, aircraft history table), aircraft registrations become **clickable** and navigate to the single aircraft view (`/aircraft-history/{aircraftId}`).
- One row per flown flight (as returned by the API — the same aircraft may appear more than once); not deduplicated.
- **Client-side pagination** since the endpoint returns the full list at once; the page must handle hundreds of entries.
- Add a frontend service method and type to consume the existing `GET /api/v1/user/me/aircraft` endpoint; the single view reuses the existing `GET /api/v1/operator/{operatorId}/aircraft/{aircraftId}` endpoint (accessible to CabinCrew), with the operator resolved from the user's own flown list.

No backend changes. No breaking changes.

## Capabilities

### New Capabilities
- `aircraft-history`: A CabinCrew-only view listing the aircraft the current user has flown, presented as a paginated table, with each row linking to a read-only single aircraft view.

### Modified Capabilities
<!-- None: no existing spec-level behavior changes. -->

## Impact

- **New frontend code**: `UserAircraftEntry` type + `fetchFlownByCurrentUser()` on `AircraftService` (`app/features/aircraft/`); card-grid components under `app/features/aircraft/components/UserAircraftHistory/`; route component `app/routes/pilot/history/AircraftHistoryListRoute.tsx`.
- **Modified**: `app/routes.ts` (new `/aircraft-history` route under `PilotLayout`); `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` (new sidebar item).
- **API**: consumes existing `GET /api/v1/user/me/aircraft` (no contract change).
- **Dependencies**: none added; reuses Flowbite `Pagination`/`Spinner`, `AircraftIcon`, and shared layout/hook utilities.

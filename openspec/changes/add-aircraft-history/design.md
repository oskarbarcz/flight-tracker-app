## Context

The backend already exposes `GET /api/v1/user/me/aircraft` (confirmed in the live OpenAPI spec). It returns a plain JSON array of `UserAircraftEntry` — `{ id, registration, airframe, livery, operator, flight }`, where `flight` is `{ id, flightNumber, departureAirport {id, iataCode}, arrivalAirport {id, iataCode} }` — with **one entry per flown flight** (the same aircraft can repeat), and **no pagination params, no `X-Total-Count` header, and no date field**. The nested `flight` lets the table render the route (e.g. JFK → FRA) and flight number without any extra lookup. This is a frontend-only repo; the backend lives in a separate project. The app already has established patterns for user-scoped lists (Flight history, Travel log), client-side paged views (`OperatorList`, `AircraftFlightHistoryCard`), airframe thumbnails (`AircraftIcon`), and role-gated sidebar items (`CabinCrewSidebarItems`).

## Goals / Non-Goals

**Goals:**
- Give CabinCrew a browsable, paginated **table** of the aircraft they have flown.
- Let CabinCrew open each aircraft in a read-only **single aircraft view**.
- Reuse existing UI/service patterns; add no new infrastructure or dependencies.
- Keep the list responsive with hundreds of entries.

**Non-Goals:**
- No backend changes (no server-side pagination, filtering, or new fields).
- No deduplication or aggregation of entries by aircraft; no "times flown" counts.
- No sorting controls or chronological ordering (the list endpoint provides no date field).
- No edit/reposition/operator actions on the single aircraft view (read-only for CabinCrew).
- No aircraft flight-history list on the single view (would require operator-only links).
- Not available to Operations or Admin roles.

## Decisions

**Table layout (over a card grid).** First implemented as a card grid, but with only a few entries it read as sparse/empty, so it was switched to a Flowbite table consistent with Flight history / Travel log. Columns: Aircraft (thumbnail + registration + airframe name), Type (ICAO type code), Operator (carrier name primary, IATA code as muted subtitle), Livery, and a "View" action. Row components mirror the `FlightHistoryListTable` + `FlightHistoryListElement` pattern under `components/Table/`.

**Client-side pagination (over server-side).** The list endpoint returns the full array with no paging support and no total-count header. Adding real server-side paging would require a coordinated change in the separate backend repo, which is out of scope. Fetching the full list once and slicing it in the browser is sufficient for a few hundred small entries and matches existing client-paged views (`OperatorList`, `AircraftFlightHistoryCard`). Page state is kept in the `page` URL search param (mirroring `FlightHistoryListTable`) so pages are shareable and survive back/forward. `PAGE_SIZE = 12`. Alternative considered: server-side paging via `X-Total-Count` like `FlightService.fetchAllFlights` — deferred as a possible future follow-up if the dataset grows to thousands.

**One row per flown flight (over dedupe by aircraft).** The API returns per-flight entries, each with a nested `flight` (id, number, route) and no date. Kept as returned (not deduped); each row shows the flight's route and its "View" opens the aircraft. Alternative considered: distinct-aircraft-with-count — rejected to avoid client-side aggregation and to keep the row meaning stable with the spec.

**Single aircraft view scoped to the user's own list.** `/aircraft-history/:id` (under `PilotLayout`, CabinCrew only) resolves the aircraft's operator by looking it up in the user's own `fetchFlownByCurrentUser()` result, then calls the existing `GET /operator/{operatorId}/aircraft/{aircraftId}` (accessible to CabinCrew, verified live). This keeps a clean `/:id` URL and naturally authorizes: a user can only open aircraft that appear in their history (others fall to a "not in your history" state). Alternatives considered: a URL carrying the operator id (leaks operator structure) or a user-scoped single endpoint (does not exist).

**Read-only single view, reusing existing detail cards.** Reuses `AircraftDetailsHeader` (with `editUrl` made optional so the operator-only edit button is hidden), plus `AircraftTechnicalStatusCard`. The operator-only `AircraftFlightHistoryCard` is deliberately excluded (it links to operator routes CabinCrew cannot open). Base airport and current status use a new `AircraftAirportRow` that replicates the **alternate-airports list** format (`OptionAvatarFrame` + `AirportShape` boundary polygon, then `IATA | name` and city/country); the airport `shape` polygon is fetched per airport via `airportService.fetchById` (also accessible to CabinCrew).

**Role-aware `AircraftRegistrationLink` for clickable registrations.** A shared component renders the registration as a `Link` to `/aircraft-history/{aircraftId}` for CabinCrew and as plain `span` text otherwise, so components shared with Operations (dashboard boxes, tracking) stay correct without per-call role branches. Applied to every CabinCrew reg render site: flight history list (`FlightHistoryListElement`), flight history detail (`AircraftSummaryCard`), dashboard (`CurrentFlightBox`, `LastFlightBox`), live tracking (`FlightInfoBox`), and the aircraft history table. The aircraft's own detail-page title is left as plain text (self-link). The single view resolves the operator from the user's flown list (`fetchFlownByCurrentUser`); on production, aircraft shown in a user's history appear in that list (a mock-data gap where they don't is acceptable and yields the "not in your history" state).

**Service method on `AircraftService` (over `UserService`).** The returned data is aircraft-domain, so `fetchFlownByCurrentUser()` lives on `AircraftService` and the `UserAircraftEntry` type in the aircraft model — mirroring how `TravelService` owns `/user/{id}/travel` by domain rather than by URL prefix. Reuses the existing `aircraftService` singleton from `useApi()`.

## Risks / Trade-offs

- **Very large lists (thousands) load fully into memory.** → Acceptable for the expected "hundreds" scale; if it grows, migrate to server-side paging (the `FlightService.fetchAllFlights` + `X-Total-Count` pattern already exists to copy).
- **No chronological ordering.** The list endpoint provides no date, so rows appear in server order. → Accepted per Non-Goals; ordering can be added later if the API exposes a date.
- **Single view issues up to four requests** (user list → aircraft → base + last airport). → Acceptable; airports are fetched in parallel and the list is small. The user-list lookup doubles as the authorization check.
- **Reuses operator-scoped endpoints from a CabinCrew context.** → Verified accessible (200) for the CabinCrew role; the view is strictly read-only and hides all operator actions.

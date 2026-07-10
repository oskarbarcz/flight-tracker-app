## Context

The CabinCrew sidebar is a custom `<aside>` (desktop) / Flowbite `Drawer` (mobile) rendered from `app/shared/ui/Sidebar/Sidebar.tsx`, with the item set chosen by role. The CabinCrew items live in `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` and are built from `SidebarElement` (`{ isSelected, label, href, icon, badge? }`). That file already renders a **dynamic, data-driven sub-list** — the pinned airports under the "Airports" item — which is the direct precedent for a data-driven current-flight block.

The current flight is resolved by `useCurrentFlight()` (`app/features/flight/hooks/useCurrentFlight.ts`), which reads `user.currentFlightId` from `useAuth()` and calls `flightService.fetchById(...)`, returning `{ currentFlight: Flight | null, loading: boolean }`. The `Flight` model exposes everything the block needs: `flightNumber`, `status` (a `FlightStatus` enum), `departureAirport`/`destinationAirport` (with `.iataCode`), `airports: AirportOnFlight[]` (each a full `Airport` with `.id`, `.iataCode`, `.type`), and `aircraft` (`.id`, `.registration`).

Two reusable link conventions already exist: `AircraftRegistrationLink` (role-gates CabinCrew to `/aircraft-history/{aircraftId}`) and the `/airports-library/{airportId}` URL used across the airport library. The dashboard's `CurrentFlightBox` and the tracking `FlightInfoBox` are the closest visual precedents for a flight summary.

The airport library page (`app/routes/pilot/airports/AirportLibraryRoute.tsx`) currently renders a search box followed by a single "Custom pins" `<section>` that delegates to `PinnedAirportTiles`. The tile markup lives inline inside `PinnedAirportTiles` (a `Link` with `AirportShape`/`OptionAvatarFrame` avatar, IATA-led title, and city/country subtitle) — it is not yet a shared component. Each flight-plan airport is an `AirportOnFlight` (a full `Airport` with `.id`, `.iataCode`, `.name`, `.city`, `.country`, `.shape`, plus a `type: AirportOnFlightType`), so it carries everything a tile needs plus the flight-relative role.

## Goals / Non-Goals

**Goals:**
- Add a Current flight block below Home in the CabinCrew sidebar showing flight number, status label, `departure → destination` IATA, and aircraft registration.
- Provide one airport link per flight-plan airport (`/airports-library/{airportId}`) and one aircraft link (`/aircraft-history/{aircraftId}`).
- Reuse existing data (`useCurrentFlight`), link components (`AircraftRegistrationLink`, library URLs), and sidebar styling (`SidebarElement`).
- Define quiet empty and loading states.
- Add a Current flight section to the `/airports-library` page (above Custom pins) that tiles every flight-plan airport, and give the shared airport tile an optional flight-relative type badge.

**Non-Goals:**
- No changes to Operations/Admin sidebars.
- No new API endpoints or `Flight` model changes.
- No changes to the airport preview (`/airports-library/{airportId}`) or aircraft-history destinations themselves.
- No live map, timesheet, loadsheet, or emergency detail in the sidebar (those remain on `/track/{id}`).
- No type badge on Custom-pin tiles (a pinned airport has no flight-relative role).
- No pin/unpin affordance on Current flight tiles (they are flight-derived, not user-managed pins).

## Decisions

### Component lives in the flight feature, composed into the sidebar item file
Create `CurrentFlightNav` under `app/features/flight/components/Sidebar/` and render it inside `CabinCrewSidebarItems.tsx` between the Home item and the rest. Rationale: flight-specific data/logic belongs in the flight feature; the sidebar file stays a thin composition, matching how pinned airports are handled. Alternative — inlining all logic in `CabinCrewSidebarItems.tsx` — was rejected because it would bloat a file that is meant to be a menu manifest.

### Data via `useCurrentFlight()`
Consume the existing hook rather than re-fetching. It already owns the `currentFlightId → fetchById` resolution and the loading flag. Alternative — a new sidebar-specific fetch — was rejected as duplicated logic and a second source of truth.

### "Phase" is the human-readable flight status
The `Flight` model has **no `phase` field**; `FlightPhase` is only a server-side query filter for `fetchAllFlights`. The per-flight signal is `flight.status` (`FlightStatus`). Render the label via the existing humanizer `toHuman.flight.status.short(flight.status)` — the same source `CurrentFlightBox` uses for its status pill — so the sidebar label stays consistent with the dashboard. This is the intended meaning of "phase" in the request.

### Airport sub-links reuse the library URL and are typed
Iterate `flight.airports` and render each as a link to `/airports-library/{airport.id}`, labeled by IATA. Order them departure → alternates → destination and lean on `AirportOnFlightType` to group/label (e.g. a small type hint for alternates) so the list reads like a flight plan, not an arbitrary set. Alternative — linking only departure/destination — was rejected because the request explicitly asks for *all* flight-plan airports.

### Flight identity opens the tracking dashboard
The block's identity area (flight number, status label, route) is a single navigation target to `/track/{flightId}` — the established "open current flight" action used by `CurrentFlightBox`'s Manage button. The airport and aircraft links are separate, nested targets. Implement this as a `Link` wrapping the identity header, with the airport/aircraft links rendered as sibling elements (not descendants of that `Link`) so a click on a sub-link is not captured by the header navigation. Alternative — making the whole block including sub-links a single `/track` target — was rejected because it would swallow the airport/aircraft links the request specifically asks for.

### Aircraft link reuses `AircraftRegistrationLink`
Use `<AircraftRegistrationLink aircraftId={flight.aircraft.id} registration={flight.aircraft.registration} />`, which already resolves to `/aircraft-history/{aircraftId}` for CabinCrew. Rationale: single source of role gating and URL shape; avoids a hand-built URL drifting from the canonical one.

### Sub-links use `SidebarElement`-consistent styling
The block header (number, status, route, registration) is a small custom layout; the airport and aircraft entries render with the same visual language as `SidebarElement` (or reuse it directly) so the block feels native to the sidebar rather than a foreign card. The pinned-airports sub-list is the styling reference.

### Empty and loading states are quiet
When `loading`, show a light skeleton placeholder. When `currentFlight` is `null`, show a single quiet muted line (e.g. "No current flight") with no sub-links — using the project's `bg-gray-50` empty-state convention if a surface is needed. Rationale: the sidebar must not imply a flight that does not exist, and must not flash an empty state while resolving.

### Airport library: extract a shared `AirportTile`, add an optional type badge
Lift the inline tile markup from `PinnedAirportTiles` into a shared `AirportTile` (`app/features/airport/components/Library/AirportTile.tsx`) that takes the airport data and an optional `type?: AirportOnFlightType`. When `type` is set it renders a small badge; when absent it renders exactly today's tile. `PinnedAirportTiles` then renders `AirportTile` with the pin/unpin control layered on top (no `type`), and the new section renders it with `type`. Rationale: the request asks for "standard airport tiles" in the new section — reuse guarantees they stay visually identical and keeps the type badge in one place. Alternative — duplicating the tile markup — was rejected as drift-prone. The unpin button is kept as a decoration owned by `PinnedAirportTiles` (not baked into `AirportTile`), since Current flight tiles must not be unpinnable.

### Current flight section is its own component, composed into the route
Add `CurrentFlightAirportTiles` (`app/features/airport/components/Library/CurrentFlightAirportTiles.tsx`) consuming `useCurrentFlight()`. It renders nothing when there is no current flight (returns `null`), a light loader while resolving, and otherwise a tile grid — identical grid classes to `PinnedAirportTiles` — of `AirportTile`s built from `flight.airports`, ordered departure → alternates → destination. `AirportLibraryRoute` wraps it in a `<section>` titled "Current flight" placed above the "Custom pins" section, and conditionally renders that whole `<section>` only when the component would show tiles. Rationale: matches how Custom pins is composed today (route owns the `<h2>` + `<section>`, component owns the grid) and keeps the "hidden when no flight" rule in one place.

### Type labels come from a humanizer over `AirportOnFlightType`
Map `AirportOnFlightType` (`Departure`, `Destination`, `DestinationAlternate`, `EnrouteAlternate`, `EtopsEntry`, `EtopsExit`) to human labels via the project's `toHuman` humanizer, adding an `airport.onFlightType` entry if one does not already exist. Rationale: keeps label text consistent with the rest of the app and out of the component. Alternative — a local label map in the tile — was rejected to avoid a second source of truth for these labels.

## Risks / Trade-offs

- **Extra fetch on every authenticated page** → `useCurrentFlight` fetches the flight by id whenever the sidebar mounts. Mitigation: the hook already exists and is used on the dashboard; if this becomes a concern, caching belongs in the hook/service, not the sidebar. Out of scope here.
- **Status label semantics** → mapping "phase" to `FlightStatus` (not `FlightPhase`) could surprise a reader expecting the four-value phase. Mitigation: documented above; the short status label is the same one the dashboard already shows, so it is consistent for the pilot.
- **Sidebar vertical space** → listing every flight-plan airport plus the aircraft link can grow tall on flights with several alternates. Mitigation: keep entries compact (IATA-led) and follow the always-visible pinned-airports precedent (no collapse), revisiting only if real flights prove it too long.
- **Mobile drawer** → the block renders in both desktop `<aside>` and mobile `Drawer`. Mitigation: it is composed once in `CabinCrewSidebarItems.tsx`, which both surfaces render, so there is no divergence.
- **Duplicate current-flight fetch on `/airports-library`** → both the sidebar block and the new section call `useCurrentFlight()`, so the library page resolves the current flight twice. Mitigation: acceptable for now (small `fetchById`); if it matters, add caching inside the hook/service — out of scope here.
- **`AirportOnFlight` shape completeness** → the shared tile reads `.shape` (for `AirportShape`); confirm `flight.airports[]` carries `shape` like the pinned snapshot does. Mitigation: verify at apply time; fall back to a neutral avatar if absent.

## Open Questions

- Should airport entries show a small type hint (e.g. "ALT" for alternates) or list IATA codes only?

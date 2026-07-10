## Why

The pilot (CabinCrew) sidebar treats the current flight like any other destination: it is reachable only by returning Home and finding the dashboard card, or by remembering the `/track/{id}` URL. The current flight is the pilot's primary context for an entire duty, yet nothing in the navigation reflects it. We want the sidebar to keep the active flight — its identity, where it is going, and the jump-off points a pilot reaches for most — one glance and one click away.

## What Changes

### Sidebar — Current flight block

- Add a **Current flight** navigation block to the CabinCrew sidebar, positioned directly below **Home** and above the existing items.
- The block is richer than a plain menu item. When the pilot has a current flight it shows:
  - flight number
  - current flight status label ("phase")
  - departure IATA → destination IATA
  - aircraft registration
- The block exposes clickable navigation links:
  - **Airports** — one link per airport in the flight plan (departure, destination, alternates), each opening that airport in the airport library at `/airports-library/{airportId}`.
  - **Aircraft** — a link to the current flight's aircraft page (`/aircraft-history/{aircraftId}`).
- When the pilot has no current flight, the block collapses to a quiet empty state (no flight identity, no sub-links) so the sidebar stays honest.
- Reuse existing building blocks: `useCurrentFlight()` for data, `AircraftRegistrationLink` for the aircraft link, the `/airports-library/{airportId}` pattern for airport links, and `SidebarElement` styling conventions.

### Airport library — Current flight section

- Add a new **Current flight** section to the airport library page (`/airports-library`), positioned **first**, above the existing **Custom pins** section.
- The section is shown whenever the pilot has a current flight and renders a standard airport tile for **every airport in the flight plan** (departure, destination, and alternates), each opening that airport's preview at `/airports-library/{airportId}`.
- When the pilot has no current flight, the section is not shown at all (it does not render an empty state — the Custom pins section keeps its own).
- **Add flight-relative type to the airport tile**: the standard tile gains an optional type badge (departure, destination, or the specific alternate type) shown for tiles rendered in the Current flight section. Custom-pin tiles are unaffected (no flight-relative type).

## Capabilities

### New Capabilities

- `current-flight-nav`: A CabinCrew sidebar block that surfaces the pilot's current flight (number, status label, route, aircraft registration) and provides direct navigation into each flight-plan airport and the flight's aircraft, with a defined empty state when no flight is active.

### Modified Capabilities

- `airport-library`: The `/airports-library` page gains a Current flight section (shown when a current flight is set) above Custom pins, and the airport tile gains an optional flight-relative type badge. The `aircraft-history` capability is consumed as a link target but its requirements are unchanged.

## Impact

- **UI (new)**: A current-flight sidebar block component under `app/features/flight/`, composed into `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` below the Home entry. A Current flight section on `app/routes/pilot/airports/AirportLibraryRoute.tsx`, above the Custom pins section.
- **UI (refactor)**: Extract the inline tile markup in `app/features/airport/components/Library/PinnedAirportTiles.tsx` into a shared `AirportTile` component with an optional type badge, reused by both the Custom pins and Current flight sections.
- **Data**: Consumes `useCurrentFlight()` (`app/features/flight/hooks/useCurrentFlight.ts`) and the `Flight` model (`flightNumber`, `status`, `departureAirport`/`destinationAirport`, `airports[]` with `AirportOnFlightType`, `aircraft`). No API changes.
- **Reuse**: `AircraftRegistrationLink`, `/airports-library/{airportId}` links, `toHuman.flight.status.short(...)` for the status label, `AirportShape`/`OptionAvatarFrame` and the existing tile styling, `SidebarElement` visual language.
- **No breaking changes**; additive to the CabinCrew sidebar and the CabinCrew airport library page only. Other roles are untouched.

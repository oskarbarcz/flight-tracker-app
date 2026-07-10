## Why

Cabin crew have no way to look up an airport and study its layout, facilities, or current weather. The operations side already has a rich airport detail experience, but it is edit-oriented and gated to the Operations role, so cabin crew cannot reach it. Giving cabin crew a read-only "Airports library" — a search page plus a per-airport preview — lets them browse any airport, keep a personal set of pinned airports, and read live METAR/TAF, all from data the backend already exposes.

## What Changes

- Add an **"Airports"** collapsible item to the CabinCrew sidebar. It links to the search page and expands to list the user's pinned airports as sub-links. (Today's `SidebarElement` is flat-only; a collapsible variant is added.)
- Add a CabinCrew-only **airport search page** at `/airports-library`: a centered search box that matches on name, IATA code, and ICAO code. Each result row's default action is **View** (navigates to the preview); a **pin** toggle is revealed on hover/focus. Below the search box, the user's **pinned airports** render as tiles.
- **Pinning is browser-local** (localStorage). A lightweight snapshot (`id`, `iataCode`, `icaoCode`, `name`, `city`, `shape`) is stored per pin so tiles and the sidebar render instantly without waiting on a fetch.
- Add a CabinCrew-only, read-only **airport preview** at `/airports-library/:id`: a **persistent map on the left** and **URL-synced tabs on the right** — details, parking positions, terminals, gates, runways, weather. Switching tabs never remounts the map; it stays in place and **filters which overlays it shows to the active tab** (all layers for details and weather; only parking / terminals / gates / runways for their respective tabs).
- Add a frontend **weather service + model** consuming the existing `GET /api/v1/airport/{airportId}/weather` endpoint, which returns raw METAR/TAF strings, their last-update timestamps, and a `watch` flag. The weather tab renders the raw reports with timestamps and a watch indicator, and an empty state when no report is available (most airports return `null`).

No backend changes. No breaking changes. The operations airport pages are untouched.

## Capabilities

### New Capabilities
- `airport-library`: A CabinCrew-only airport search page with browser-local pinning, and a read-only per-airport preview whose persistent map filters overlays to the active tab (details, parking positions, terminals, gates, runways, weather).

### Modified Capabilities
<!-- None: no existing spec-level behavior changes. -->

## Impact

- **New frontend code**:
  - `AirportWeather` type + weather service method (either `AirportService.fetchWeather()` or a small `AirportWeatherService`) in `app/features/airport/`.
  - Pinning hook/model backed by `useLocalStorage` (e.g. `app/features/airport/lib/usePinnedAirports.ts`) storing lightweight airport snapshots.
  - Search page components (search box reusing the existing keyword match/rank logic, result rows with view + pin, pinned tiles) and a collapsible sidebar element.
  - Preview layout with a persistent map, URL-synced tabs, and read-only detail/list/weather panels under `app/features/airport/components/`.
  - Route components under `app/routes/pilot/` (search, preview layout, per-tab children).
- **Modified**:
  - `app/routes.ts` — new `/airports-library` and `/airports-library/:id/*` routes under `PilotLayout`.
  - `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` — new collapsible "Airports" item.
  - `AirportLocationMap` — add a `visibleLayers` prop so overlays can be filtered per tab while bounds stay computed from all geo (ops usage unchanged).
  - Read-only reuse of `AirportDetailsCard` (hide the Edit button) and the parking/terminal/gate/runway list components (hide add/edit/remove actions).
- **API**: consumes existing `GET /api/v1/airport`, `GET /api/v1/airport/{id}`, the four per-airport geo endpoints (`runway`, `terminal`, `parking-position`, `gate`), and `GET /api/v1/airport/{airportId}/weather` — no contract change.
- **Dependencies**: none added; reuses Leaflet/react-leaflet map stack, Flowbite UI, `useLocalStorage`, and existing airport services.

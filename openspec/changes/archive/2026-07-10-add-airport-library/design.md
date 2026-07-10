## Context

This is a frontend-only repo; the backend lives in a separate project and is not changed. The app already has almost every ingredient:

- `AirportService.fetchAll()` returns the full airport list (seed data has ~10 airports), and `fetchById(id)` returns one. There is no search endpoint — matching is done client-side.
- `AdvancedSelect` contains reusable keyword match (`matchesQuery`) and ranking (`matchRank`) helpers, and `airportSelectOptions` already models airports as `{ keywords: [iata, icao, city, name], title, subtitle, avatar }`. `AdvancedSelect` itself is a Formik single-select and is **not** reused for the search box (which needs per-row actions).
- `AirportLocationMap` renders the full airport canvas — shape polygon, terminal polygons, parking markers, gate markers, runway lines, and a label — with a fullscreen control. It computes bounds from all supplied geo.
- The four per-airport geo services (`RunwayService`, `TerminalService`, `ParkingPositionService`, `GateService`) each expose `fetchAll(airportId)`. Operations already renders read/edit lists for each (`ParkingPositionList`, etc.).
- `GET /api/v1/airport/{airportId}/weather` exists. Verified against the live API: `metar` and `taf` are **raw strings** (the OpenAPI schema mislabels them as `object`), alongside `metarLastUpdate`, `tafLastUpdate` (ISO timestamps), and `watch` (boolean). Most airports return `metar: null` / `taf: null`.
- `useLocalStorage<T>(key, initial)` is a ready hook for browser-local state.
- Role gating: `PilotLayout` is `allowOnly={UserRole.CabinCrew}` (despite the "pilot" name) and already hosts the other CabinCrew pages. `OperationsLayout` is `allowOnly={UserRole.Operations}` and owns the existing `/airports*` routes.
- The CabinCrew sidebar (`CabinCrewSidebarItems`) is a flat list of `SidebarElement` links; there is no collapsible element yet.

## Goals / Non-Goals

**Goals:**
- Give CabinCrew a fast way to find an airport by name / IATA / ICAO and open a read-only preview.
- Let CabinCrew keep a personal, browser-local set of pinned airports, surfaced both as tiles on the search page and as expandable entries in the sidebar.
- Present the preview as a persistent map beside URL-synced tabs, where the map filters its overlays to the active tab and the viewport stays put.
- Surface live METAR/TAF with timestamps and a watch indicator, with a clean empty state.
- Reuse existing services, map, and detail/list components; add no new dependencies.

**Non-Goals:**
- No backend changes (no server-side search, no new fields, no parsed/decoded METAR).
- No editing of airports or any geo (parking, terminals, gates, runways) — the whole feature is read-only for CabinCrew.
- No cross-device sync of pins (browser-local only).
- Not available to Operations or Admin, and it does not alter the existing Operations `/airports*` pages.
- No map viewport re-fit on tab change (the map "stays in place"); only overlay visibility toggles.

## Decisions

**Distinct route namespace `/airports-library` (over reusing `/airports`).** Operations already registers `route("airports", …)` and its children under a sibling layout of the same `AppLayout`. Two routes cannot resolve the same path by role guard, so the CabinCrew feature gets its own namespace: `/airports-library` (search) and `/airports-library/:id/*` (preview), under `PilotLayout`. This avoids any static route collision and keeps the two experiences cleanly separated.

**Persistent map in a parent layout; URL-synced nested-route tabs.** The preview is a parent layout route (`/airports-library/:id`) that renders the map plus the tab bar plus `<Outlet/>`; each tab is a child route (`details`, `parking-positions`, `terminals`, `gates`, `runways`, `weather`), so the URL reflects the active tab and is deep-linkable, while React Router keeps the parent — and therefore the map — mounted across tab switches. This mirrors the familiar Operations `AirportLayout` structure, except the map moves up into the parent so it never remounts.

**Map as a shared canvas that filters overlays by tab (viewport fixed).** `AirportLocationMap` gains a `visibleLayers` prop. Bounds are always computed from **all** geo so the viewport is stable and never re-fits; only the overlay components render conditionally. Mapping: `details` and `weather` → all layers; `parking-positions` → parking markers only; `terminals` → terminal polygons only; `gates` → gate markers only; `runways` → runway lines only. The parent reads the active tab from the URL and passes the corresponding `visibleLayers`. The existing Operations usage passes no `visibleLayers` (defaults to all) and is unchanged.

**Geo loaded once in the parent; weather is the only lazy fetch.** Because `details` and `weather` show all overlays — including on a direct deep-link to `/airports-library/:id/weather` — the map needs every geo layer available whenever those tabs are open. Loading each geo layer only on its own tab would make overlays flicker in and out as the user navigates. So the parent route's loader fetches `airport + runways + terminals + gates + parkingPositions` once (cheap at this scale) and this data powers both the persistent map and the parking/terminals/gates/runways list tabs with zero extra fetch on tab switch. **Weather** genuinely varies per airport and is `null` for most, so it is fetched in the `weather` child route's own loader (fired only when that tab opens). This honors "URL-synced tabs, lazy per tab" as far as the shared-canvas map allows: geo tabs are instant, weather is lazy.

**Search box is a new component reusing the match/rank helpers.** The search page needs a result dropdown where each row has a default **View** action plus a hover/focus-revealed **pin** toggle — behavior `AdvancedSelect` (a Formik single-select) does not provide. A new, self-contained search component reuses `matchesQuery` / `matchRank` (extracted or imported) and the `{ keywords, title, subtitle, avatar }` option shape from `airportSelectOptions`, matching on IATA / ICAO / name (and city, already in the keyword set). The full airport list is fetched once and filtered in the browser.

**Browser-local pins store a lightweight snapshot (over IDs only).** Pinned airports persist in `localStorage` via `useLocalStorage` as an array of `{ id, iataCode, icaoCode, name, city, shape }`. Storing the snapshot (rather than just IDs) lets the tiles and the sidebar render immediately without waiting on — or re-triggering — the airport list fetch. The trade-off is that a snapshot can go slightly stale if an airport is renamed; opening the preview (which fetches fresh) reconciles it, and the dataset changes rarely. A dedicated `usePinnedAirports()` hook wraps the storage and exposes `pin`, `unpin`, `isPinned`, and the list.

**Read-only reuse of existing detail/list components.** The details tab reuses `AirportDetailsCard` with its Edit button hidden (make the edit affordance optional, as was done for `AircraftDetailsHeader` in the aircraft-history change). The parking / terminal / gate / runway tabs reuse the existing list components (`ParkingPositionList` and siblings) with their add/edit/remove actions hidden, so CabinCrew sees the same data presentation without mutation controls. Where an existing list component cannot cleanly hide its actions, its presentational core is extracted and shared.

**Weather rendered as raw reports (over decoding).** METAR and TAF are shown as their raw report strings (monospace), each with a "last updated" timestamp, plus a `watch` indicator when `watch` is true. When a report is `null`, an empty state is shown for that report. Decoding/parsing METAR into human-readable fields is a possible future enhancement, not part of this change.

**Collapsible sidebar element for pinned airports.** A new collapsible variant of the sidebar item renders an "Airports" entry that links to `/airports-library` and expands to show the pinned airports (each linking to its preview). It reads pins from `usePinnedAirports()` so the sidebar and the search-page tiles stay in sync. The existing flat `SidebarElement` is left intact for the other items.

## Risks / Trade-offs

- **Pinned snapshots can go stale** (e.g. airport renamed). → Accepted; opening the preview fetches fresh data, and airport metadata rarely changes. Only a lightweight snapshot is stored, so staleness is cosmetic.
- **Parent loads all geo even for the details/weather tabs.** → Accepted and intended: the shared-canvas map needs all overlays for those tabs, and the dataset is tiny; this makes geo-tab switches instant.
- **`AirportLocationMap` gains a `visibleLayers` prop used by two callers.** → Kept backward-compatible: absent prop = show all, so the Operations overview is unaffected.
- **Reusing Operations list components in a read-only context.** → Actions are hidden via optional props or an extracted presentational core; no Operations route or behavior changes.
- **Most airports have no weather.** → The weather tab has a first-class empty state; the `watch` flag and timestamps are only shown when present.

## 1. Data layer

- [x] 1.1 Add an `AirportWeather` type to `app/features/airport/model.tsx` (`metar: string | null`, `metarLastUpdate: string`, `taf: string | null`, `tafLastUpdate: string`, `watch: boolean`)
- [x] 1.2 Add `fetchWeather(airportId): Promise<AirportWeather>` to `AirportService` in `app/features/airport/service.ts`, calling `GET /api/v1/airport/{airportId}/weather` via `fetchWithAuth`
- [x] 1.3 Confirm the new type is re-exported from `app/features/airport/index.ts`

## 2. Pinning

- [x] 2.1 Define a `PinnedAirport` snapshot type (`id`, `iataCode`, `icaoCode`, `name`, `city`, `country`, `shape`)
- [x] 2.2 Create `usePinnedAirports()` (`app/features/airport/lib/usePinnedAirports.tsx`) backed by `useLocalStorage` (via a `PinnedAirportsProvider` in `AppLayout` so sidebar and pages share live state), exposing the pinned list plus `pin(airport)`, `unpin(id)`, and `isPinned(id)`
- [x] 2.3 Ensure snapshots are derived from an `Airport` so pinning from search stores exactly the fields tiles/sidebar need

## 3. Search page

- [x] 3.1 Extract the keyword match/rank helpers to `app/shared/lib/keywordSearch.ts` (`matchesKeywords`, `keywordRank`); refactor `AdvancedSelect` to use them; add `searchAirports` in `app/features/airport/lib/searchAirports.ts`
- [x] 3.2 Build a search box + results dropdown component matching airports on name/IATA/ICAO (`AirportSearchBox`)
- [x] 3.3 Result row: default "View" action navigates to `/airports-library/{airportId}`; a pin toggle is revealed on hover/focus and calls `pin`/`unpin` without navigating
- [x] 3.4 Render pinned airports as tiles below the search box (`PinnedAirportTiles`, using `AirportShape` for the avatar), each opening the preview; show an empty state (`bg-gray-50`) when there are no pins
- [x] 3.5 Create `app/routes/pilot/airports/AirportLibraryRoute.tsx` (search page): `usePageTitle`, fetch the airport list once via `AirportService().fetchAll()`, render the search box + tiles

## 4. Preview layout (persistent map + URL-synced tabs)

- [x] 4.1 Add a `visibleLayers` prop to `AirportLocationMap`: bounds still computed from all geo (stable viewport), but shape/terminals/parking/gates/runways overlays rendered conditionally; default (absent prop) shows all so the Operations overview is unchanged
- [x] 4.2 Create `app/routes/pilot/airports/AirportPreviewLayout.tsx` (`/airports-library/:id`): `clientLoader` fetches `airport + runways + terminals + parkingPositions + gates` in parallel; render `AirportHeader`, the persistent map (with `visibleLayers` derived from the active tab in the URL), the tab bar, and `<Outlet/>` (geo passed to children via Outlet context)
- [x] 4.3 Map the active tab → `visibleLayers` (in `airportPreviewTabs.ts`): details/weather = all; parking-positions = parking; terminals = terminals; gates = gates; runways = runways
- [x] 4.4 Build a read-only tab bar (`AirportPreviewTabs`: details, parking positions, terminals, gates, runways, weather) that navigates between child routes and reflects the active tab

## 5. Preview tab panels (read-only)

- [x] 5.1 Details tab child route (`AirportDetailsTab`): reuse `AirportDetailsCard` with `readOnly` (Edit button hidden)
- [x] 5.2 Parking positions tab child route (`AirportParkingTab`): `ParkingPositionList` with `readOnly`; `PreviewEmptyState` when none
- [x] 5.3 Terminals tab child route (`AirportTerminalsTab`): `TerminalList` read-only; empty state when none
- [x] 5.4 Gates tab child route (`AirportGatesTab`): `GateList` read-only; empty state when none
- [x] 5.5 Runways tab child route (`AirportRunwaysTab`): `RunwayList` read-only; empty state when none
- [x] 5.6 Weather tab child route (`AirportWeatherTab`): own `clientLoader` calling `fetchWeather`; `AirportWeatherPanel` renders raw METAR and TAF with last-update timestamps, an informational "updates automatically" indicator when `watch` is true (not a warning), and an empty state when both reports are null

## 6. Routing and navigation

- [x] 6.1 Register under `PilotLayout` in `app/routes.ts`: `route("airports-library", …)` (search) and a `route("airports-library/:id", AirportPreviewLayout)` with child routes for details (index), parking-positions, terminals, gates, runways, weather
- [x] 6.2 Add the "Airports" `SidebarElement` to `CabinCrewSidebarItems.tsx` linking to `/airports-library` (`isSelected` when path starts with `/airports-library`)
- [x] 6.3 Render pinned airports (from `usePinnedAirports()`) as always-visible sub-links beneath the "Airports" item — never hidden behind a collapse control

## 7. Verification

- [x] 7.1 `npm run typecheck`, `npm run lint`, and `npm run build` pass clean (only pre-existing warnings in `utilities.css` + an operations gate route remain)
- [x] 7.2 As a CabinCrew user, confirmed the "Airports" sidebar item appears (CabinCrew), links to `/airports-library`, and expands to show pinned airports
- [x] 7.3 Confirmed search matches by name ("war"→Warsaw), IATA, and ICAO ("eddf"→Frankfurt); a result's View navigates to the preview; the pin toggle pins/unpins without navigating
- [x] 7.4 Confirmed pins persist across reload and render as tiles (empty state shown when none)
- [x] 7.5 Confirmed the preview map stays mounted and fixed while switching tabs, and overlays filter per tab (all for weather; only parking markers on the parking tab)
- [x] 7.6 Confirmed the read-only parking list renders with no edit/add/remove actions; details tab has no Edit button; empty states render for geo tabs with no records
- [x] 7.7 Confirmed the weather tab fetches on open, renders raw METAR/TAF with UTC timestamps and the watch indicator (WAW/EPWA, watch=true), and shows the empty state for an airport with null weather (JFK)
- [x] 7.8 Confirmed the Operations airport overview is unaffected: map shows all layers and the Edit button is present (backward-compatible defaults)

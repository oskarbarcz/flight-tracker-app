## 1. Component scaffold

- [x] 1.1 Create `CurrentFlightNav` component under `app/features/flight/components/Sidebar/` (named export, no default export, no comments)
- [x] 1.2 Wire it to `useCurrentFlight()` and branch on `loading`, `currentFlight === null`, and the loaded case

## 2. Flight identity header

- [x] 2.1 Render the flight number from `flight.flightNumber`
- [x] 2.2 Render the status label ("phase") via `toHuman.flight.status.short(flight.status)`
- [x] 2.3 Render `departure → destination` using `flight.departureAirport.iataCode` and `flight.destinationAirport.iataCode`
- [x] 2.4 Render the aircraft registration from `flight.aircraft.registration`
- [x] 2.5 Wrap the identity header (flight number, status label, route) in a `Link` to `/track/{flight.id}` so clicking it opens the tracking dashboard

## 3. Navigation links

- [x] 3.1 Render one airport link per `flight.airports` entry to `/airports-library/{airport.id}`, labeled by IATA and ordered departure → alternates → destination (use `AirportOnFlightType` for grouping/labels)
- [x] 3.2 Render the aircraft link with `<AircraftRegistrationLink aircraftId={flight.aircraft.id} registration={flight.aircraft.registration} />`
- [x] 3.3 Style airport and aircraft entries consistently with `SidebarElement` (reuse it or match its visual language), using the pinned-airports sub-list as reference
- [x] 3.4 Render airport/aircraft links as siblings of the identity `Link` (not descendants) so clicking a sub-link does not trigger `/track` navigation

## 4. Empty and loading states

- [x] 4.1 Render a quiet empty state (no flight identity, no links) when `currentFlight` is `null`, using the `bg-gray-50` empty-state convention if a surface is needed
- [x] 4.2 Render a light skeleton placeholder while `loading` is true (no empty state flash, no partial data)

## 5. Sidebar composition

- [x] 5.1 Insert `<CurrentFlightNav />` in `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` directly below the Home item and above the remaining items
- [x] 5.2 Confirm the block renders in both the desktop `<aside>` and the mobile `Drawer` (both consume `CabinCrewSidebarItems`) and does not appear for Operations/Admin sidebars

## 6. Airport library — shared tile with type badge

- [x] 6.1 Extract the inline tile markup from `PinnedAirportTiles.tsx` into a shared `AirportTile` component (`app/features/airport/components/Library/AirportTile.tsx`) taking the airport data and an optional `type?: AirportOnFlightType`
- [x] 6.2 Render a small type badge in `AirportTile` when `type` is set, using a `toHuman` humanizer for `AirportOnFlightType` (add `airport.onFlightType` if it does not exist); render exactly today's tile when `type` is absent
- [x] 6.3 Update `PinnedAirportTiles.tsx` to render `AirportTile` (no `type`) with the existing unpin control layered on top, keeping current visuals and the empty state unchanged

## 7. Airport library — Current flight section

- [x] 7.1 Create `CurrentFlightAirportTiles` (`app/features/airport/components/Library/CurrentFlightAirportTiles.tsx`) consuming `useCurrentFlight()`
- [x] 7.2 Return `null` when there is no current flight; show a light loader while resolving
- [x] 7.3 Render a tile grid (same grid classes as `PinnedAirportTiles`) of `AirportTile`s from `flight.airports`, each linking to `/airports-library/{airport.id}`, passing `type`, ordered departure → alternates → destination
- [x] 7.4 In `AirportLibraryRoute.tsx`, add a "Current flight" `<section>` (matching the Custom pins `<h2>`/`<section>` pattern) above the Custom pins section, rendered only when a current flight is set

## 8. Verification

- [x] 8.1 Run `npm run lint` and `npm run typecheck` and resolve any issues
- [x] 8.2 Manually verify the sidebar as a CabinCrew user: active flight shows identity + airport links + aircraft link; clicking the identity opens `/track/{id}`; airport/aircraft links navigate to their own destinations; no-current-flight shows the empty state; loading shows the placeholder
- [x] 8.3 Manually verify `/airports-library`: with a current flight, a "Current flight" section appears first with a tile per flight-plan airport (departure/destination/alternates) each showing its type badge and opening the preview; Custom-pin tiles show no type badge; with no current flight the section is absent and Custom pins renders as before

## 1. Data layer

- [x] 1.1 Add `UserAircraftEntryOperator` and `UserAircraftEntry` types to `app/features/aircraft/model.ts` (`id`, `registration`, `airframe: Airframe`, `livery`, `operator`, `flightId`)
- [x] 1.2 Add `fetchFlownByCurrentUser(): Promise<UserAircraftEntry[]>` to `AircraftService` in `app/features/aircraft/service.ts`, calling `GET /api/v1/user/me/aircraft` via `fetchWithAuth`
- [x] 1.3 Confirm the new type is re-exported from `app/features/aircraft/index.ts` (via the existing `./model` export)
- [x] 1.4 Update `UserAircraftEntry` for the API change: replace flat `flightId` with nested `flight` (`id`, `flightNumber`, `departureAirport {id, iataCode}`, `arrivalAirport {id, iataCode}`); add `UserAircraftEntryAirport`/`UserAircraftEntryFlight`

## 2. List UI (table)

- [x] 2.1 Create `app/features/aircraft/components/Table/UserAircraftHistoryElement.tsx`: a table row (Aircraft = thumbnail + registration + airframe name, Type, Operator = carrier name primary + IATA code muted, Livery, and a "View" `Link` to `/aircraft-history/{aircraftId}`)
- [x] 2.2 Create `app/features/aircraft/components/Table/UserAircraftHistoryTable.tsx`: fetch via `useApi().aircraftService.fetchFlownByCurrentUser()` in a `useEffect` with a `cancelled` guard; manage `entries`/`loading` state
- [x] 2.3 Render a Flowbite `Table` (mirroring `FlightHistoryListTable`) of `UserAircraftHistoryElement` rows
- [x] 2.6 Add a "Route" column showing `departureAirport.iataCode → arrivalAirport.iataCode` (with flight number) from the entry's nested `flight`
- [x] 2.4 Add client-side pagination: `PAGE_SIZE = 12`, current page from `useSearchParams` `page`, slice entries per page, render Flowbite `Pagination` only when `totalPages > 1`, write `page` back to search params on change
- [x] 2.5 Add a loading overlay (`Spinner color="indigo"`) and an empty state (`bg-gray-50`) message "You haven't flown any aircraft yet."

## 3. Single aircraft view

- [x] 3.1 Make `editUrl` optional in `AircraftDetailsHeader` and hide the edit button when absent (read-only reuse for CabinCrew)
- [x] 3.2 Create `AircraftAirportRow` replicating the alternate-airports format (`OptionAvatarFrame` + `AirportShape` + `IATA | name` + city/country)
- [x] 3.3 Create `AircraftBaseAirportSummaryCard` and update `AircraftStatusSummaryCard` (state badge + last-airport row + parking) to use `AircraftAirportRow`
- [x] 3.4 Create `app/routes/pilot/history/AircraftHistoryDetailsRoute.tsx`: resolve operator from the user's flown list, fetch aircraft via `fetchById`, fetch base + last airports via `airportService.fetchById`, render header + base/status/technical cards; loading + not-found states
- [x] 3.5 Register `route("aircraft-history/:id", "routes/pilot/history/AircraftHistoryDetailsRoute.tsx")` under `PilotLayout`
- [x] 3.6 Current status card: cruise label reads "In cruise to:", and the "Updated …" line is pinned to the bottom of the tile (`mt-auto`, `h-full`)

## 4. Route and navigation

- [x] 4.1 Create `app/routes/pilot/history/AircraftHistoryListRoute.tsx` (`usePageTitle("Aircraft history")`, `SectionHeader`, `TransparentContainer` wrapping `UserAircraftHistoryTable`)
- [x] 4.2 Register `route("aircraft-history", "routes/pilot/history/AircraftHistoryListRoute.tsx")` under the `PilotLayout` block in `app/routes.ts`
- [x] 4.3 Add an "Aircraft history" `SidebarElement` to `app/shared/ui/Sidebar/Items/CabinCrewSidebarItems.tsx` (`href="/aircraft-history"`, `isSelected={path.startsWith("/aircraft-history")}`, `LuPlane` icon)

## 5. Clickable aircraft registration (all CabinCrew screens)

- [x] 5.1 Create role-aware `AircraftRegistrationLink` (`app/features/aircraft/components/Aircraft/`): `Link` to `/aircraft-history/{aircraftId}` for CabinCrew, plain `span` otherwise
- [x] 5.2 Use it wherever a registration is shown on CabinCrew screens: `FlightHistoryListElement`, `AircraftSummaryCard`, `CurrentFlightBox`, `LastFlightBox`, `FlightInfoBox`, and the aircraft history table (`UserAircraftHistoryElement`)

## 6. Verification

- [x] 6.1 `npm run typecheck` and `npm run lint` pass clean
- [x] 6.2 As a CabinCrew user (backend v2.28.0), confirm the sidebar item appears only for CabinCrew, the table renders, pagination works past page 1 (verified with temporarily lowered `PAGE_SIZE` → `?page=2`), and a row's "View" navigates to `/aircraft-history/{aircraftId}`
- [x] 6.3 Confirm the single aircraft view renders (header, airframe specs, base airport + current status via the airport-shape chip, technical status) with no operator actions, and the not-found state renders
- [x] 6.4 Confirm the empty state renders for a user with no flown aircraft (empty-state UI confirmed; identical code path for a genuine `200 []`)
- [x] 6.5 Confirm a clickable registration on the flight history list navigates to the aircraft view (verified: N718AN → `/aircraft-history/6c48d613…`)

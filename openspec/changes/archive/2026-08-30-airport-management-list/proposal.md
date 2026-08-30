# Airport management list

## Why

The Operations airports page is a single unbounded table filtered only by continent, defaulting to
Europe, with no search at all. It is already hard to reach a known airport and it degrades with
every row added.

It degrades quickly, because rows are now added without anyone asking. A SimBrief import calls
`ImportAirportByIcaoCommand` for the origin, the destination and every alternate, so any ICAO the
database has not seen is created on the spot from SkyLink — name, city, country, timezone and a
point location, with `shape: null` and no runways, terminals, parking stands or gates. Those
airports are created at `low` data quality, and only one thing moves them off it: an OpenStreetMap
enrichment push that writes at least one change grades the airport `flagship`. Until someone runs
that, they stay low — and nobody can see the backlog, so it grows unattended.

## What Changes

- The airports list stops fetching per continent. It loads every airport once and filters in the
  browser, so "low quality everywhere" — the view an administrator actually wants — is expressible
  at all. Continent becomes one filter among several rather than the shape of the request.
- The list opens on the airports that need work. Data-quality chips above the list carry their own
  counts and toggle the filter, with `low` active on load, following the state strip already built
  for `/postcards`.
- Free-text search over airport name, IATA, ICAO and city, reusing the existing `searchAirports`.
  Typing in it clears the quality filter and searches every airport, so the triage default can
  never hide the airport someone is looking for. Clearing the box restores the default.
- A country filter, and continent as a client-side pill row carrying counts.
- The Flowbite `Table` is replaced by the row list the flight lists use: a bordered container, a
  header sharing the rows' grid template, whole-row navigation as a real link, a swappable trailing
  column, an overlaid loading state and footer pagination.
- Each row shows the airport's outline in a leading avatar frame, its IATA over its ICAO, its name
  over city and country, and a trailing column carrying the data-quality badge. An airport with no
  outline is visibly empty in that frame, which is exactly the state a SimBrief import leaves.
- The trailing cell carries an **Enrich** action that opens the existing OpenStreetMap enrichment
  modal over the list, so an administrator works the backlog down without leaving the page or
  losing their position. Clicking anywhere else in the row still opens the airport.
- Pagination is client-side, because the airport list endpoint offers no paging.
- The `dataQuality` filter is sent to the API, which has always accepted it — `AirportListFilters`
  carries it and `airports.repository.findAll` passes it into the query. Only the frontend service
  ignored it.
- Antarctica is added to the frontend `Continent` enum and its translation. The API's enum has
  carried `antarctica` all along and the SimBrief import assigns it from `Antarctica/*` timezones,
  so those airports exist and are currently unreachable in an interface that only ever asks for one
  of six continents.
- **Refactor**: `FlightList`, `FlightListHeader`, `FlightListRow` and `FlightListTrailingColumn` are
  extracted from `app/features/flight/components/List/` into a shared, record-agnostic list under
  `app/shared/ui/List/`, and the flight lists are ported onto it. The flight rows' appearance and
  behaviour do not change.

## Capabilities

### New Capabilities

- `airport-management-list`: Lets Operations reach any airport quickly and see, at a glance, which
  airports arrived without proper data — then enrich them from the list itself.

### Modified Capabilities

None. Extracting the shared list is a refactor: every requirement in `flight-list-row` continues to
hold unchanged, and that spec is the acceptance bar for the port.

## Impact

- **New shared component** `app/shared/ui/List/` — a record-agnostic row list, its header, its row
  and the trailing-column contract, lifted from the flight list.
- **Ported** `app/features/flight/components/List/` onto the shared list. `FlightsListRoute`,
  `CurrentFlightsRoute`, `FinishedFlightsRoute` and `PilotFlightHistoryList` must render and behave
  exactly as before; `flight-list-row` is the checklist.
- **New** `app/features/airport/components/List/` — the airport row, its cells and its trailing
  columns.
- **Rewritten** `routes/operations/airports/AirportsListRoute.tsx` — filter state in the URL,
  a single unfiltered fetch, client-side filtering, grouping-free flat list.
- **Retired** `AirportListTable`, `ContinentFilterTabs` and `airportListContext`'s continent-bearing
  helpers, once nothing else uses them.
- **Changed** `AirportService.fetchAll` — its filter type gains `dataQuality`.
- **Changed** `app/features/airport/model.tsx` and `i18n.ts` — `Continent.Antarctica` and its label.
- **Reuses** `searchAirports`, `AirportShape`, `OptionAvatarFrame`, `DataQualityBadge`,
  `EnrichAirportDataModal`, `FilterInput`, `CountryFlag`, and the chip and pill patterns from
  `PostcardAttentionStrip` and `ContinentSelector`.
- **API endpoints consumed**: `GET /api/v1/airport` (with `continent` and `dataQuality`),
  `GET /api/v1/airport/{id}/enrich`, `POST /api/v1/airport/{id}/enrich`. No API change is required.

### Known API limits this change works within

These are recorded so the design does not promise what the data cannot support:

- **The airport has no creation timestamp.** "Recently imported" cannot be expressed or sorted on.
  `dataQuality: low` is the only available proxy for "arrived unattended", which also holds every
  airport that was low before SimBrief imports existed.
- **The list endpoint returns no runway, terminal, gate or parking counts.** `shape === null` is the
  only completeness fact derivable in the list, so it is the only one the row states.
- **`dataQuality` moves automatically in one direction only.** An enrichment push that writes at
  least one change grades the airport `flagship`, whatever it held before; a push that writes
  nothing leaves the grade alone, and `high` is only ever set by hand on the airport form. Working
  the backlog down through the enrichment flow therefore keeps the triage view honest by itself.
- **The list endpoint offers no paging.** Every airport is fetched in one request; only rendering is
  paginated. If the database grows past the point where that is acceptable, paging is API work.

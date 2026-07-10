# Airport library

## Purpose

Give CabinCrew a read-only way to look up any airport and study its layout, facilities, and current weather. A CabinCrew-only search page at `/airports-library` matches airports by name, IATA, and ICAO code; a per-airport preview at `/airports-library/{airportId}` pairs a persistent map with URL-synced tabs for details, parking positions, terminals, gates, runways, and weather. Users keep a personal, browser-local set of pinned airports surfaced in the sidebar and on the search page, all sourced from data the backend already exposes.

## Requirements

### Requirement: CabinCrew navigation entry with pinned airports

The system SHALL present an "Airports database" navigation item in the sidebar to signed-in users with the CabinCrew role, and SHALL NOT present it to other roles. The item SHALL link to the airport search page at `/airports-library` and SHALL be rendered in its selected state when the current path is exactly `/airports-library`. The user's pinned airports SHALL be listed in a dedicated "Pinned" section of the sidebar at all times (never hidden behind a collapse control), each linking to that airport's preview at `/airports-library/{airportId}`.

#### Scenario: CabinCrew sees the entry

- **WHEN** a CabinCrew user views the sidebar
- **THEN** an "Airports database" item is shown that links to `/airports-library`

#### Scenario: Non-CabinCrew does not see the entry

- **WHEN** an Operations or Admin user views the sidebar
- **THEN** the "Airports database" item is not shown

#### Scenario: Pinned airports always listed

- **WHEN** a CabinCrew user with one or more pinned airports views the sidebar
- **THEN** each pinned airport is listed in the "Pinned" section as a link to `/airports-library/{airportId}`, without requiring any expand action

#### Scenario: Active state reflects the current route

- **WHEN** the current path is exactly `/airports-library`
- **THEN** the "Airports database" navigation item is rendered in its selected state

### Requirement: Airport search

The system SHALL provide, at `/airports-library`, a CabinCrew-only search box that matches airports by name, IATA code, and ICAO code against the full airport list retrieved from `GET /api/v1/airport`. Matching SHALL be performed on the client. Matching airports SHALL be shown as a result list.

#### Scenario: Searching by IATA code

- **WHEN** a CabinCrew user types an IATA code fragment into the search box
- **THEN** airports whose IATA code matches are shown in the result list

#### Scenario: Searching by ICAO code

- **WHEN** a CabinCrew user types an ICAO code fragment
- **THEN** airports whose ICAO code matches are shown in the result list

#### Scenario: Searching by name

- **WHEN** a CabinCrew user types part of an airport name
- **THEN** airports whose name matches are shown in the result list

### Requirement: Search result actions

Each search result row SHALL default to a "View" action that navigates to that airport's preview at `/airports-library/{airportId}`, and SHALL reveal a "pin" toggle on hover or keyboard focus. Activating the pin toggle SHALL add the airport to, or remove it from, the user's pinned set without navigating away.

#### Scenario: Viewing an airport from a result

- **WHEN** a user activates a result row (its default View action)
- **THEN** the app navigates to `/airports-library/{airportId}` for that airport

#### Scenario: Pin toggle revealed on hover or focus

- **WHEN** a user hovers or focuses a result row
- **THEN** a pin toggle is shown for that row

#### Scenario: Pinning from a result

- **WHEN** a user activates the pin toggle on an unpinned airport
- **THEN** the airport is added to the pinned set and the row remains in place (no navigation)

#### Scenario: Unpinning from a result

- **WHEN** a user activates the pin toggle on an already-pinned airport
- **THEN** the airport is removed from the pinned set

### Requirement: Browser-local pinned airports

The system SHALL persist the user's pinned airports in browser local storage, storing a lightweight snapshot per pin (id, IATA code, ICAO code, name, city, country, and shape) sufficient to render tiles and sidebar entries without an additional fetch. Pins SHALL persist across reloads within the same browser and SHALL NOT be shared across devices.

#### Scenario: Pins survive a reload

- **WHEN** a user pins an airport and reloads the app
- **THEN** the airport remains pinned and its tile and sidebar entry render immediately

#### Scenario: Pinned tiles on the search page

- **WHEN** a CabinCrew user opens `/airports-library` with one or more pinned airports
- **THEN** the pinned airports are shown as tiles below the search box, each opening the airport's preview

#### Scenario: No pinned airports

- **WHEN** a CabinCrew user has no pinned airports
- **THEN** an empty state is shown in place of the tiles

### Requirement: Current flight section on the airport library

The airport library page at `/airports-library` SHALL present a "Current flight" section positioned first, above the "Custom pins" section, whenever the signed-in CabinCrew user has a current flight. The section SHALL render one standard airport tile for every airport in the current flight's plan — departure, destination, and every alternate — each opening that airport's preview at `/airports-library/{airportId}`. Tiles SHALL be ordered departure first, then alternates, then destination. When the user has no current flight, the section SHALL NOT be rendered and SHALL NOT show an empty state.

#### Scenario: Current flight section appears first with flight-plan airports

- **WHEN** a CabinCrew user with a current flight opens `/airports-library`
- **THEN** a "Current flight" section is shown above "Custom pins" containing one tile per flight-plan airport (departure, destination, alternates), each opening that airport's preview

#### Scenario: Section hidden when no current flight

- **WHEN** a CabinCrew user without a current flight opens `/airports-library`
- **THEN** no "Current flight" section is shown and the "Custom pins" section is shown as before

#### Scenario: Section is independent of pinned airports

- **WHEN** a CabinCrew user with a current flight has no pinned airports
- **THEN** the "Current flight" section still shows the flight-plan airport tiles and the "Custom pins" section shows its own empty state

### Requirement: Airport tile shows flight-relative type

The standard airport tile SHALL support an optional flight-relative type badge indicating the airport's role on a flight — departure, destination, or the specific alternate type (destination alternate, enroute alternate, ETOPS entry, ETOPS exit). Tiles rendered in the Current flight section SHALL show this badge with a human-readable label for each airport's type. Tiles rendered in the Custom pins section SHALL NOT show a type badge, since a pinned airport has no flight-relative role.

#### Scenario: Type badge in the Current flight section

- **WHEN** a CabinCrew user views the Current flight section
- **THEN** each tile shows a human-readable type badge for that airport's role on the flight (departure, destination, or the specific alternate type)

#### Scenario: No type badge on custom pins

- **WHEN** a CabinCrew user views the Custom pins section
- **THEN** the tiles show no flight-relative type badge

### Requirement: Airport preview with persistent map and tabs

The system SHALL provide a read-only airport preview at `/airports-library/{airportId}`, accessible to CabinCrew only, showing a map on the left and tabs on the right for details, parking positions, terminals, gates, runways, and weather. The active tab SHALL be reflected in the URL. Switching tabs SHALL NOT remount the map, and the map viewport SHALL remain fixed across tab changes.

#### Scenario: Opening the preview

- **WHEN** a CabinCrew user opens `/airports-library/{airportId}`
- **THEN** the map is shown on the left and the tab set (details, parking positions, terminals, gates, runways, weather) is shown on the right

#### Scenario: Active tab reflected in the URL

- **WHEN** the user switches to another tab
- **THEN** the URL updates to reflect the selected tab and the tab is deep-linkable

#### Scenario: Map persists across tab switches

- **WHEN** the user switches between tabs
- **THEN** the map remains mounted in place and its viewport does not re-fit

#### Scenario: Read-only preview

- **WHEN** a CabinCrew user views any tab of the preview
- **THEN** no edit, add, or remove actions are shown for the airport or its parking positions, terminals, gates, or runways

### Requirement: Map overlays filtered by active tab

The map SHALL display overlays filtered to the active tab: all overlays (airport shape, terminals, parking positions, gates, runways) for the details and weather tabs; only parking positions for the parking positions tab; only terminals for the terminals tab; only gates for the gates tab; and only runways for the runways tab. The map bounds SHALL be computed from all airport geo so the viewport is identical regardless of the active tab.

#### Scenario: Details tab shows all overlays

- **WHEN** the details tab is active
- **THEN** the map shows the airport shape, terminals, parking positions, gates, and runways

#### Scenario: Parking positions tab shows only parking

- **WHEN** the parking positions tab is active
- **THEN** the map shows only the parking position overlays

#### Scenario: Terminals tab shows only terminals

- **WHEN** the terminals tab is active
- **THEN** the map shows only the terminal overlays

#### Scenario: Gates tab shows only gates

- **WHEN** the gates tab is active
- **THEN** the map shows only the gate overlays

#### Scenario: Runways tab shows only runways

- **WHEN** the runways tab is active
- **THEN** the map shows only the runway overlays

#### Scenario: Weather tab shows all overlays

- **WHEN** the weather tab is active
- **THEN** the map shows the airport shape, terminals, parking positions, gates, and runways

### Requirement: Preview tab content

Each tab SHALL show the corresponding airport data in the right-hand panel: the details tab SHALL show the airport's identity, geography, and time information; and the parking positions, terminals, gates, and runways tabs SHALL each list that airport's records for the respective type.

#### Scenario: Details tab content

- **WHEN** the details tab is active
- **THEN** the panel shows the airport's identity (IATA/ICAO), location (country, city, coordinates), and time zone information

#### Scenario: Geo list tab content

- **WHEN** the parking positions, terminals, gates, or runways tab is active
- **THEN** the panel lists that airport's records of the corresponding type, or an empty state when there are none

### Requirement: Weather tab

The weather tab SHALL retrieve the airport's latest weather from `GET /api/v1/airport/{airportId}/weather` and display the raw METAR and TAF reports with their last-update timestamps, and SHALL show an informational indicator when the airport's weather updates automatically (`watch` is true). When a report is not available, the tab SHALL show an empty state for that report. Weather SHALL be fetched when the weather tab is opened.

#### Scenario: Weather available

- **WHEN** the weather tab is opened for an airport whose endpoint returns METAR and/or TAF
- **THEN** the raw report text is shown for each available report along with its last-update timestamp

#### Scenario: Automatic weather updates

- **WHEN** the weather response has `watch` set to true
- **THEN** an informational indicator is shown stating that the airport's weather updates automatically (not styled as a warning)

#### Scenario: No weather available

- **WHEN** the endpoint returns a null METAR and null TAF
- **THEN** an empty state is shown instead of report text

#### Scenario: Weather fetched on tab open

- **WHEN** the user opens the preview on a non-weather tab
- **THEN** the weather endpoint is not called until the weather tab is opened

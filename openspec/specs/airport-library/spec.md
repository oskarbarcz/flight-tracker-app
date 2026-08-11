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

### Requirement: Weather reports

The preview SHALL retrieve every stored weather report of the airport from `GET /api/v1/airport/{airportId}/weather` across all sources and display the reports of one source at a time, one card per report, each showing the report's information type (ATIS, METAR or TAF), its content exactly as stored, and when it was last fetched. Reports SHALL be shown in a fixed order — METAR, then TAF, then ATIS — whatever order the endpoint returns them in, so the coded reports a pilot reads first stay in the same place from airport to airport. Coded reports SHALL be rendered in a monospace face; ATIS, being spoken text, SHALL be rendered as prose. Cards sharing a row SHALL share a height, so the grid reads as a row of reports rather than a ragged stack. A report the endpoint does not return SHALL have no card of its own, and an airport that holds no report at all SHALL yield a single empty state in place of the panel. Weather SHALL be loaded with the preview, and a failed weather request SHALL leave the rest of the preview usable.

#### Scenario: Reports available

- **WHEN** the preview is opened for an airport whose endpoint returns reports
- **THEN** each report of the shown source is presented with its information type, last-fetched time, and content

#### Scenario: ATIS is present

- **WHEN** the collection contains an ATIS report
- **THEN** its spoken text is shown as prose rather than in the monospace face used for METAR and TAF

#### Scenario: Reports arrive in another order

- **WHEN** the endpoint returns the ATIS before the METAR and TAF of the shown source
- **THEN** the cards are still presented as METAR, then TAF, then ATIS

#### Scenario: Only some information types are stored

- **WHEN** the endpoint returns a METAR but no TAF
- **THEN** a METAR card is shown and no TAF card is rendered

#### Scenario: No weather available

- **WHEN** the endpoint returns an empty collection
- **THEN** a single empty state is shown in place of the cards and no source switch is offered

#### Scenario: Weather request fails

- **WHEN** the weather request fails while the preview loads
- **THEN** the empty state is shown and the map, tabs, and airport details still render

### Requirement: Switching weather source in the preview

The preview SHALL let the reader switch which source's reports are shown, offering every known source — AviationWeather and Say Intentions — each named and carrying a mark of its nature: AviationWeather reports real-world observations, Say Intentions reports simulated ones. The switch SHALL open on the reader's own weather source preference and SHALL make clear which source is currently shown. Switching SHALL NOT issue another weather request, because the preview already holds every source's reports. A source the airport holds no report for SHALL remain selectable and SHALL show an empty state naming that source, so the reader can tell an absent report from an unasked question.

#### Scenario: The switch opens on the reader's preference

- **WHEN** a user whose preference is Say Intentions opens the preview of an airport that holds reports from both sources
- **THEN** the Say Intentions reports are shown and the switch marks Say Intentions as the current source

#### Scenario: Switching source

- **WHEN** the reader selects the other source
- **THEN** the cards are replaced by that source's reports without a further weather request, and the reader's stored preference is unchanged

#### Scenario: The selected source holds nothing

- **WHEN** the reader selects a source the airport holds no report for
- **THEN** an empty state naming that source is shown and the switch stays available

### Requirement: Weather source preference

The account page SHALL let a signed-in user of any role choose the provider their airport weather opens on, offering AviationWeather and Say Intentions, with the choice stored on their profile. The section SHALL name the currently stored choice and change it through a modal, alongside the other account settings. The modal SHALL open on the stored choice, present each provider with what it publishes, save only when the user confirms, and offer nothing to confirm while the stored choice is still selected. A saved change SHALL close the modal and be confirmed in the section; a failed save SHALL be reported in the modal, which stays open with the stored choice unchanged.

#### Scenario: Current choice is shown

- **WHEN** a signed-in user opens `/me/account`
- **THEN** an airport weather source section names their stored provider and offers to change it

#### Scenario: Changing the provider

- **WHEN** the user opens the modal, selects the other provider, and confirms
- **THEN** the choice is saved for their profile, the modal closes, the section confirms the change, and the choice persists across reloads

#### Scenario: Leaving the modal without confirming

- **WHEN** the user selects the other provider and cancels the modal
- **THEN** the stored choice is unchanged and the section still names it

#### Scenario: The change is applied to airport weather

- **WHEN** the user opens an airport preview after changing their provider
- **THEN** the preview opens on the newly chosen provider's reports

#### Scenario: Saving fails

- **WHEN** saving the choice fails
- **THEN** the failure is reported in the modal, the modal stays open, and the section still names the stored provider

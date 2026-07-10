# Current flight navigation

## Purpose

Keep the pilot's active flight present in the CabinCrew sidebar. A dedicated block directly below Home shows the current flight's identity (number, status label, departure → destination, aircraft registration) and offers one-click navigation into each flight-plan airport and into the flight's aircraft page. When no flight is active the block shows a quiet empty state so the sidebar never implies a flight that does not exist.

## Requirements

### Requirement: Current flight block placement and role scope

The system SHALL present a "Current flight" block in the sidebar to signed-in users with the CabinCrew role, positioned directly below the Home navigation item and above the other navigation items. The system SHALL NOT present this block to users of other roles.

#### Scenario: CabinCrew sees the block below Home

- **WHEN** a CabinCrew user views the sidebar
- **THEN** a "Current flight" block is shown immediately below the Home item and above the remaining navigation items

#### Scenario: Non-CabinCrew does not see the block

- **WHEN** an Operations or Admin user views the sidebar
- **THEN** no "Current flight" block is shown

### Requirement: Current flight identity display

When the CabinCrew user has a current flight, the block SHALL display that flight's identity using data from the current flight: the flight number, a human-readable current status label ("phase") derived from the flight status, the departure and destination cities presented as `departure → destination`, and the aircraft registration.

#### Scenario: Active flight identity is shown

- **WHEN** a CabinCrew user with a current flight views the sidebar
- **THEN** the block shows the flight number, the current status label, the departure and destination cities as `departure → destination`, and the aircraft registration

#### Scenario: Status label reflects the flight status

- **WHEN** the current flight's status changes to a new value
- **THEN** the block's status label reflects the human-readable form of the new status

### Requirement: Current flight identity opens the tracking dashboard

The flight identity area of the block (the flight number, status label, and route) SHALL act as a single navigation target that opens the current flight's tracking dashboard at `/track/{flightId}` for the current flight's id. This target SHALL be distinct from the airport and aircraft links, so clicking an airport or the aircraft does not trigger navigation to the tracking dashboard. When the current path is the tracking dashboard for this flight, the identity target SHALL be rendered in its selected state.

#### Scenario: Clicking the flight identity opens tracking

- **WHEN** a CabinCrew user with a current flight clicks the flight identity area
- **THEN** the app navigates to `/track/{flightId}` for the current flight

#### Scenario: Identity highlighted while on the tracking dashboard

- **WHEN** the current path is `/track/{flightId}` for the current flight
- **THEN** the flight identity target is shown in its selected state

#### Scenario: Airport and aircraft links do not open tracking

- **WHEN** the user clicks a flight-plan airport link or the aircraft link
- **THEN** the app navigates to that link's own destination and does not navigate to the tracking dashboard

### Requirement: Flight-plan airport navigation

The block SHALL provide, under the current flight, one navigation link per airport in the flight plan — including departure, destination, and any alternate airports carried on the flight. Each link SHALL open that airport in the airport library at `/airports-library/{airportId}` for the airport's id. Links SHALL be ordered departure first, then alternates, then destination.

#### Scenario: Each flight-plan airport is linkable

- **WHEN** a CabinCrew user with a current flight views the airport links
- **THEN** every airport on the flight plan (departure, destination, alternates) appears as a link to `/airports-library/{airportId}` for that airport's id

#### Scenario: Airport link navigates to the library

- **WHEN** the user clicks a flight-plan airport link
- **THEN** the app navigates to that airport's preview in the airport library

### Requirement: Current flight aircraft navigation

The block SHALL provide a link to the current flight's aircraft page at `/aircraft-history/{aircraftId}` for the flight's aircraft id, reusing the shared aircraft registration link behavior available to CabinCrew.

#### Scenario: Aircraft link navigates to the aircraft page

- **WHEN** a CabinCrew user with a current flight clicks the aircraft link
- **THEN** the app navigates to `/aircraft-history/{aircraftId}` for the current flight's aircraft

### Requirement: Empty state when no current flight

When the CabinCrew user has no current flight, the block SHALL show a quiet empty state and SHALL NOT render any flight identity, airport links, or aircraft link.

#### Scenario: No current flight

- **WHEN** a CabinCrew user without a current flight views the sidebar
- **THEN** the block shows a quiet empty state with no flight number, no airport links, and no aircraft link

### Requirement: Loading state

While the current flight is being resolved, the block SHALL show a non-jarring loading placeholder rather than an empty state or partial data.

#### Scenario: Current flight is loading

- **WHEN** the current flight data is still loading
- **THEN** the block shows a loading placeholder and does not show the empty state or partial flight data

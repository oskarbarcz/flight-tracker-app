# Aircraft history

## Purpose

Give CabinCrew a personal, browsable record of the aircraft they have flown: a CabinCrew-only paginated listing at `/aircraft-history` sourced from `GET /api/v1/user/me/aircraft`, with each row linking to a read-only single aircraft view, and aircraft registrations across CabinCrew screens made clickable to that view.

## Requirements

### Requirement: CabinCrew navigation entry

The system SHALL present an "Aircraft history" navigation item in the sidebar to signed-in users with the CabinCrew role, and SHALL NOT present it to other roles.

#### Scenario: CabinCrew sees the entry

- **WHEN** a CabinCrew user views the sidebar
- **THEN** an "Aircraft history" item is shown that links to `/aircraft-history`

#### Scenario: Non-CabinCrew does not see the entry

- **WHEN** an Operations or Admin user views the sidebar
- **THEN** the "Aircraft history" item is not shown

#### Scenario: Active state reflects the current route

- **WHEN** the current path starts with `/aircraft-history`
- **THEN** the "Aircraft history" navigation item is rendered in its selected state

### Requirement: Aircraft history listing

The system SHALL display, at `/aircraft-history`, the aircraft the signed-in user has flown, retrieved from `GET /api/v1/user/me/aircraft`, presented as a table. Each entry returned by the endpoint SHALL be shown as its own row (one row per flown flight, not deduplicated), with columns for the aircraft (thumbnail + registration + airframe name), type, route, operator, and livery.

#### Scenario: User has flown aircraft

- **WHEN** a CabinCrew user opens `/aircraft-history` and the endpoint returns one or more entries
- **THEN** the page renders one table row per entry showing the airframe thumbnail, registration, airframe name, type, route, operator, and livery

#### Scenario: Route column

- **WHEN** a row is rendered
- **THEN** the route column shows the flown flight's departure and arrival airport IATA codes (e.g. `JFK → FRA`) with the flight number

#### Scenario: Operator shown by name

- **WHEN** a row is rendered
- **THEN** the operator's carrier name is the primary label and its IATA code is a secondary/muted label

#### Scenario: Same aircraft flown more than once

- **WHEN** the endpoint returns multiple entries with the same registration
- **THEN** each entry is rendered as a separate row

### Requirement: Row opens the single aircraft view

Each row SHALL provide a "View" action linking to the single aircraft view at `/aircraft-history/{aircraftId}` using the entry's aircraft `id`.

#### Scenario: Navigating from a row

- **WHEN** a user activates a row's "View" action
- **THEN** the app navigates to `/aircraft-history/{aircraftId}` for that entry

### Requirement: Single aircraft view

The system SHALL provide a read-only single aircraft view at `/aircraft-history/{aircraftId}`, accessible to CabinCrew only, showing the aircraft's airframe specs, identity, base airport, current status, and technical status. It SHALL resolve the aircraft only from the signed-in user's own flown list, and SHALL NOT expose edit, reposition, or other operator actions. Base airport and current status SHALL display the airport using the shared airport-shape chip format (airframe-boundary avatar with IATA code and name).

#### Scenario: Opening an aircraft the user has flown

- **WHEN** a CabinCrew user opens `/aircraft-history/{aircraftId}` for an aircraft in their history
- **THEN** the view shows the registration, airframe specs, identity, base airport, current status, and technical status, with no edit or operator actions

#### Scenario: Opening an aircraft not in the user's history

- **WHEN** the requested aircraft id is not present in the user's flown list
- **THEN** the view shows a "not in your history" message instead of aircraft details

### Requirement: Aircraft registration links to the aircraft view

On CabinCrew screens, wherever an aircraft registration is displayed, it SHALL be a link to the single aircraft view at `/aircraft-history/{aircraftId}`. For non-CabinCrew roles the registration SHALL render as plain text.

#### Scenario: CabinCrew activates a registration

- **WHEN** a CabinCrew user activates an aircraft registration on any screen (flight history list, flight history detail, dashboard, live tracking, or the aircraft history table)
- **THEN** the app navigates to `/aircraft-history/{aircraftId}` for that aircraft

#### Scenario: Non-CabinCrew sees plain text

- **WHEN** a non-CabinCrew user views a screen that shows an aircraft registration
- **THEN** the registration is rendered as plain text, not a link

### Requirement: Client-side pagination

The system SHALL paginate the list on the client so the page remains usable with hundreds of entries, fetching the full list once and paging through it in the browser. The current page SHALL be reflected in the `page` URL search parameter.

#### Scenario: More entries than one page

- **WHEN** the number of entries exceeds the page size
- **THEN** pagination controls are shown and only the current page of rows is rendered

#### Scenario: Page reflected in the URL

- **WHEN** the user changes to another page
- **THEN** the `page` search parameter updates to the selected page number

#### Scenario: Entries fit on a single page

- **WHEN** the number of entries is within the page size
- **THEN** no pagination controls are shown

### Requirement: Loading and empty states

The system SHALL indicate loading while the list is being fetched and SHALL show an empty state when the user has flown no aircraft.

#### Scenario: Loading

- **WHEN** the list is being fetched
- **THEN** a loading indicator is shown

#### Scenario: No aircraft flown

- **WHEN** the endpoint returns an empty list
- **THEN** an empty-state message is shown instead of a table

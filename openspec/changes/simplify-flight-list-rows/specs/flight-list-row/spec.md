## Purpose

Defines the single row used by every flight list in the app — what each of its four columns shows, how it adapts between phone and desktop widths, where clicking it goes, and how it is announced to assistive technology. One contract so the upcoming, current, finished and pilot-history lists stay identical in shape while differing only in their trailing column.

## ADDED Requirements

### Requirement: Four-column row

Every flight list SHALL present each flight as a single row of four content columns, in order: Date, Flight, Route, and a trailing column. Each column SHALL carry at most two lines — a primary line stating the value and a secondary line qualifying it. The row SHALL NOT display the aircraft photograph, the airframe name, an explicit `View` action, or a Status column on lists whose flights are all finished.

#### Scenario: Row renders four columns

- **WHEN** a flight list renders a flight
- **THEN** the row shows a Date column, a Flight column, a Route column, and a trailing column, in that order

#### Scenario: Retired elements are absent

- **WHEN** a flight list renders a flight
- **THEN** no aircraft photograph, airframe name, or `View` link is shown in the row

### Requirement: Date column

The Date column SHALL show the flight's off-block date on its primary line in ICAO form (`19AUG`), including the four-digit year only when that year differs from the current year (`01JAN 2025`). Its secondary line SHALL show the off-block time in UTC (`06:20Z`).

#### Scenario: Current-year date omits the year

- **WHEN** a flight's off-block date falls in the current year
- **THEN** the primary line shows day and month only

#### Scenario: Other-year date includes the year

- **WHEN** a flight's off-block date falls in a year other than the current year
- **THEN** the primary line shows day, month and four-digit year

#### Scenario: Time is shown in UTC

- **WHEN** a flight row renders
- **THEN** the secondary line shows the off-block time in UTC, marked as Zulu

### Requirement: Flight column

The Flight column SHALL show the flight's callsign on its primary line and the operating aircraft's registration on its secondary line. The callsign SHALL be the visual anchor of the row, rendered larger and heavier than the surrounding text.

#### Scenario: Callsign leads the row

- **WHEN** a flight with callsign `AAL4905` on aircraft `N718AN` renders
- **THEN** the Flight column shows `AAL4905` as its primary line and `N718AN` as its secondary line

#### Scenario: Flight number is not used

- **WHEN** a flight whose flight number differs from its callsign renders
- **THEN** the Flight column shows the callsign, not the flight number

### Requirement: Route column

The Route column SHALL show the departure and destination IATA codes on its primary line, separated by a rightwards arrow (`FRA → MUC`). Its secondary line SHALL show the departure and destination **airport names**, separated by the same rightwards arrow (`Frankfurt Rhein/Main → Munich`).

#### Scenario: Route shows IATA codes over airport names

- **WHEN** a flight from Frankfurt to Munich renders
- **THEN** the primary line reads `FRA → MUC` and the secondary line reads the two airport names

### Requirement: Trailing column varies by flight phase

The trailing column SHALL show block and air time for lists of finished flights, and flight status for lists of upcoming or in-progress flights.

For finished flights the primary line SHALL show block time and the secondary line SHALL show air time prefixed with `air`, both in clock form (`1:47`, `air 1:27`) derived from the flight's **actual** timesheet — block time from off-block to on-block, air time from takeoff to arrival.

For upcoming and in-progress flights the trailing column SHALL show the flight's status, and SHALL additionally show an emergency indicator when the flight has an active emergency.

#### Scenario: Finished flight shows block over air time

- **WHEN** a finished flight went off-block at 17:45Z, took off at 18:00Z, arrived at 02:30Z and went on-block at 02:45Z
- **THEN** the trailing column shows `9:00` as its primary line and `air 8:30` as its secondary line

#### Scenario: Finished list uses actual times, not scheduled

- **WHEN** a finished flight's actual off-block time differs from its scheduled off-block time
- **THEN** the row's date, time and durations are derived from the actual timesheet

#### Scenario: Current flight shows status

- **WHEN** an in-progress flight renders
- **THEN** the trailing column shows the flight's status

#### Scenario: Emergency is visible in the list

- **WHEN** an in-progress flight has an active emergency
- **THEN** the row shows an emergency indicator alongside the status

#### Scenario: Durations without an actual timesheet

- **WHEN** a finished flight has no complete actual timesheet
- **THEN** the trailing column shows a placeholder rather than a computed duration

### Requirement: Responsive behaviour without horizontal scrolling

The row SHALL keep all four columns visible and vertically aligned across widths, from a 390 px viewport upwards, and the list SHALL NOT require horizontal scrolling to reach any column. Below the `sm` breakpoint the Route column's airport-name line SHALL be hidden; every other line SHALL remain visible.

#### Scenario: All columns reachable on a phone

- **WHEN** a flight list is viewed at a 390 px viewport width
- **THEN** all four columns are visible without horizontal scrolling

#### Scenario: Airport-name line hidden on narrow viewports

- **WHEN** a flight list is viewed below the `sm` breakpoint
- **THEN** the Route column shows the IATA codes and hides the airport names

#### Scenario: Columns align down the list

- **WHEN** a flight list renders several flights at any viewport width
- **THEN** each column starts at the same horizontal position on every row

### Requirement: Row navigation with in-row exceptions

The whole row SHALL act as a navigation target opening that flight's detail page — `/flights/{flightId}/overview` on Operations lists, `/flight-history/{flightId}` on the pilot history list — and SHALL do so as a real link, so opening in a new tab, copying the address and modified clicks all behave normally.

Within the row, the departure and destination IATA codes SHALL link to their airports and the aircraft registration SHALL link to that aircraft, each overriding the row target when clicked. These SHALL also be real links, and no link SHALL be nested inside another.

#### Scenario: Clicking the row opens the flight

- **WHEN** a user clicks any part of a row other than an airport code or the registration
- **THEN** the app navigates to that flight's detail page

#### Scenario: Clicking an airport code opens the airport

- **WHEN** a user clicks the departure or destination IATA code
- **THEN** the app navigates to that airport and not to the flight

#### Scenario: Clicking the registration opens the aircraft

- **WHEN** a user clicks the aircraft registration
- **THEN** the app navigates to that aircraft and not to the flight

#### Scenario: All three targets support standard link behaviour

- **WHEN** a user opens the row, an airport code or the registration in a new tab, or copies its address
- **THEN** the browser behaves as it does for any link

#### Scenario: Links are never nested

- **WHEN** a flight row renders
- **THEN** no anchor is a descendant of another anchor

#### Scenario: Targets differ by role

- **WHEN** the list is an Operations list
- **THEN** airport codes open `/airports/{id}` and the registration opens that operator's aircraft page
- **WHEN** the list is the pilot history list
- **THEN** airport codes open `/airports-library/{id}` and the registration opens `/aircraft-history/{id}`

### Requirement: Accessible row naming

The list SHALL be exposed as a list of items, and each row SHALL carry an accessible name that identifies the flight as a single unit — its callsign, route and trailing value — rather than leaving assistive technology to read four unlabelled fragments.

#### Scenario: Row announced as one flight

- **WHEN** a screen reader reaches a flight row
- **THEN** it announces the flight as a single named item covering callsign, route and the trailing value

#### Scenario: List exposed as a list

- **WHEN** a screen reader reaches a flight list
- **THEN** the rows are exposed as items of a list

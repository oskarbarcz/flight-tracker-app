## ADDED Requirements

### Requirement: Automatic arrival detection is available

During `in_cruise`, when the destination airport is mapped (its shape has at least three points) AND a `flight.live-position-received` event is present among the flight's events, the panel SHALL state that arrival will be reported automatically once the aircraft has landed and slowed inside the destination airport (ground speed below 50 knots) and that a manual report is optional, and SHALL show both satisfied conditions.

#### Scenario: Both conditions met

- **WHEN** a flight in `in_cruise` has a mapped destination airport and has received a live position
- **THEN** the panel states arrival will be reported automatically and can still be reported manually, showing "Destination airport mapped" and "ADS-B signal acquired" as satisfied

### Requirement: Automatic arrival detection is unavailable

During `in_cruise`, when the destination airport is not mapped OR no `flight.live-position-received` event is present, the panel SHALL state that arrival will NOT be reported automatically and that a manual report is required, and SHALL name each unmet condition. Meaning SHALL NOT be carried by colour alone.

#### Scenario: Destination airport not mapped

- **WHEN** a flight in `in_cruise` has a destination airport without a shape
- **THEN** the panel states manual arrival reporting is required and names "Destination airport not mapped" as the unmet condition

#### Scenario: No live position yet

- **WHEN** a flight in `in_cruise` has a mapped destination airport but no `flight.live-position-received` event
- **THEN** the panel states manual arrival reporting is required and names "Awaiting ADS-B signal" as the unmet condition, with the mapped-airport condition shown as satisfied

#### Scenario: Notice is cruise only

- **WHEN** a flight is in any status other than `in_cruise`
- **THEN** the panel shows no automatic-arrival notice

## MODIFIED Requirements

### Requirement: Manual phase advancement stays available under autolock

In every status except `created` and `closed` the panel SHALL present the phase-advancing action, including a manual "Report off-block" during `boarding_finished`, a manual "Report takeoff" during `taxiing_out`, and a manual "Report arrival" during `in_cruise` even when automatic detection is available. The action SHALL remain guarded by the autolock: it starts locked, arming requires an explicit unlock, and it re-locks automatically after 5 seconds without use.

#### Scenario: Action available in every actionable status

- **WHEN** a flight is in any status from `ready` through `offboarding_finished`
- **THEN** the panel shows the corresponding phase action guarded by the autolock

#### Scenario: Manual off-block stays available when auto is active

- **WHEN** a flight in `boarding_finished` has automatic off-block detection available
- **THEN** the panel still shows the manual "Report off-block" action, framed as optional by the automatic-off-block notice

#### Scenario: Manual takeoff stays available when auto is active

- **WHEN** a flight in `taxiing_out` has automatic takeoff detection available
- **THEN** the panel still shows the manual "Report takeoff" action, framed as optional by the automatic-takeoff notice

#### Scenario: Manual arrival stays available when auto is active

- **WHEN** a flight in `in_cruise` has automatic arrival detection available
- **THEN** the panel still shows the manual "Report arrival" action, framed as optional by the automatic-arrival notice

#### Scenario: No action before release or after close

- **WHEN** a flight has status `created` or `closed`
- **THEN** the panel shows no phase-advancing action

#### Scenario: Autolock re-locks after inactivity

- **WHEN** the pilot unlocks the action and does not use it within 5 seconds
- **THEN** the action re-locks automatically

### Requirement: Unsettled delay notice

When the flight has an unsettled delay (a delay request exists and is not settled), the panel SHALL surface a notice, escalating by phase to reflect that the delay must be settled before the flight can be closed: an informational neutral (gray) notice during `in_cruise`, and a warning (amber) notice during `taxiing_in`, `on_block`, `offboarding_started`, and `offboarding_finished`. The notice SHALL name the amount of delay awaiting settlement. The panel SHALL NOT show the notice before `in_cruise`, SHALL NOT show it once the delay is settled, and SHALL NOT use the sky/info tint reserved for the automatic-takeoff, automatic-off-block, and automatic-arrival notices.

#### Scenario: Informational notice in cruise

- **WHEN** a flight in `in_cruise` has an unsettled delay
- **THEN** the panel shows a neutral (gray) informational notice stating the delay must be settled before the flight can be closed

#### Scenario: Warning notice from taxi-in onward

- **WHEN** a flight in `taxiing_in`, `on_block`, `offboarding_started`, or `offboarding_finished` has an unsettled delay
- **THEN** the panel shows an amber warning notice to settle the delay before the flight can be closed

#### Scenario: Hidden before cruise

- **WHEN** a flight before `in_cruise` has an unsettled delay
- **THEN** the panel shows no delay notice

#### Scenario: No notice once settled

- **WHEN** the flight has no delay request, or its delay is settled
- **THEN** the panel shows no delay notice

## ADDED Requirements

### Requirement: Automatic off-block detection is available

During `boarding_finished`, when a `flight.live-position-received` event is present among the flight's events, the panel SHALL state that off-block will be reported automatically once the aircraft starts moving and that a manual report is optional, and SHALL show the satisfied condition. Automatic off-block detection SHALL depend on a received live position only; it SHALL NOT require the departure airport to be mapped, because detection is speed-based.

#### Scenario: Live position received

- **WHEN** a flight in `boarding_finished` has received a live position
- **THEN** the panel states off-block will be reported automatically once the aircraft starts moving and can still be reported manually, showing "ADS-B signal acquired" as satisfied

### Requirement: Automatic off-block detection is unavailable

During `boarding_finished`, when no `flight.live-position-received` event is present, the panel SHALL state that off-block will NOT be reported automatically and that a manual report is required, and SHALL name the unmet condition. Meaning SHALL NOT be carried by colour alone.

#### Scenario: No live position yet

- **WHEN** a flight in `boarding_finished` has no `flight.live-position-received` event
- **THEN** the panel states manual off-block reporting is required and names "Awaiting ADS-B signal" as the unmet condition

#### Scenario: Notice is boarding-finished only

- **WHEN** a flight is in any status other than `boarding_finished`
- **THEN** the panel shows no automatic-off-block notice

## MODIFIED Requirements

### Requirement: Automatic takeoff detection is available

During `taxiing_out`, when the departure airport is mapped (its shape has at least three points) AND a `flight.live-position-received` event is present among the flight's events, the panel SHALL state that takeoff will be reported automatically and that no user action is required, and SHALL show both satisfied conditions.

#### Scenario: Both conditions met

- **WHEN** a flight in `taxiing_out` has a mapped departure airport and has received a live position
- **THEN** the panel states takeoff will be reported automatically and no action is required, showing "Departure airport mapped" and "ADS-B signal acquired" as satisfied

### Requirement: Automatic takeoff detection is unavailable

During `taxiing_out`, when the departure airport is not mapped OR no `flight.live-position-received` event is present, the panel SHALL state that takeoff will NOT be reported automatically and that a manual report is required, and SHALL name each unmet condition. Meaning SHALL NOT be carried by colour alone.

#### Scenario: Departure airport not mapped

- **WHEN** a flight in `taxiing_out` has a departure airport without a shape
- **THEN** the panel states manual takeoff reporting is required and names "Departure airport not mapped" as the unmet condition

#### Scenario: No live position yet

- **WHEN** a flight in `taxiing_out` has a mapped departure airport but no `flight.live-position-received` event
- **THEN** the panel states manual takeoff reporting is required and names "Awaiting ADS-B signal" as the unmet condition, with the mapped-airport condition shown as satisfied

#### Scenario: Notice is taxi-out only

- **WHEN** a flight is in any status other than `taxiing_out`
- **THEN** the panel shows no automatic-takeoff notice

### Requirement: Manual phase advancement stays available under autolock

In every status except `created` and `closed` the panel SHALL present the phase-advancing action, including a manual "Report off-block" during `boarding_finished` and a manual "Report takeoff" during `taxiing_out` even when automatic detection is available. The action SHALL remain guarded by the autolock: it starts locked, arming requires an explicit unlock, and it re-locks automatically after 5 seconds without use.

#### Scenario: Action available in every actionable status

- **WHEN** a flight is in any status from `ready` through `offboarding_finished`
- **THEN** the panel shows the corresponding phase action guarded by the autolock

#### Scenario: Manual off-block stays available when auto is active

- **WHEN** a flight in `boarding_finished` has automatic off-block detection available
- **THEN** the panel still shows the manual "Report off-block" action, framed as optional by the automatic-off-block notice

#### Scenario: Manual takeoff stays available when auto is active

- **WHEN** a flight in `taxiing_out` has automatic takeoff detection available
- **THEN** the panel still shows the manual "Report takeoff" action, framed as optional by the automatic-takeoff notice

#### Scenario: No action before release or after close

- **WHEN** a flight has status `created` or `closed`
- **THEN** the panel shows no phase-advancing action

#### Scenario: Autolock re-locks after inactivity

- **WHEN** the pilot unlocks the action and does not use it within 5 seconds
- **THEN** the action re-locks automatically

### Requirement: Unsettled delay notice

When the flight has an unsettled delay (a delay request exists and is not settled), the panel SHALL surface a notice, escalating by phase to reflect that the delay must be settled before the flight can be closed: an informational neutral (gray) notice during `in_cruise`, and a warning (amber) notice during `taxiing_in`, `on_block`, `offboarding_started`, and `offboarding_finished`. The notice SHALL name the amount of delay awaiting settlement. The panel SHALL NOT show the notice before `in_cruise`, SHALL NOT show it once the delay is settled, and SHALL NOT use the sky/info tint reserved for the automatic-takeoff and automatic-off-block notices.

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

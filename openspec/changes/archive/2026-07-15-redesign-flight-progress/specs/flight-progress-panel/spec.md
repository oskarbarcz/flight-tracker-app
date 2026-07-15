## ADDED Requirements

### Requirement: Current phase is the panel hero

The Flight Progress panel SHALL present the current flight phase as its most prominent element, labelled once. The panel SHALL NOT repeat a second status title beneath its "Flight progress" heading.

#### Scenario: Phase named once, prominently

- **WHEN** the tracking dashboard shows a flight in any status
- **THEN** the panel displays the human-readable phase name (e.g. "Taxiing out") as the hero, with no redundant inner "Flight status" title

#### Scenario: Phase reserved from action colour

- **WHEN** the panel renders the phase name
- **THEN** the phase name is set in neutral ink, not the indigo reserved for action

### Requirement: Lifecycle progress indicator

The panel SHALL show where the flight is in its journey by mapping the current status to one of five macro-stages — Preparation, Taxi out, En route, Taxi in, Turnaround — and marking the current stage. Meaning SHALL NOT be carried by colour alone.

#### Scenario: Current stage marked

- **WHEN** a flight has status `taxiing_out`
- **THEN** the "Taxi out" stage is marked as current, earlier stages as completed, and later stages as upcoming

#### Scenario: Grouped statuses map to one stage

- **WHEN** a flight has status `ready`, `checked_in`, `boarding_started`, or `boarding_finished`
- **THEN** the "Preparation" stage is marked as current

### Requirement: Figures follow the data visual system

Every numeric figure in the panel (countdowns, scheduled times, derived times) SHALL be rendered in the monospace data font with tabular figures, left-aligned label to right-aligned value, and labelled with its unit (UTC times carry a `Z` suffix). The panel SHALL reuse the shared display primitives rather than bespoke centered blocks.

#### Scenario: Times are unit-labelled monospace

- **WHEN** the panel shows a scheduled or derived time
- **THEN** the time is set in the monospace data font with a `Z` UTC suffix

### Requirement: Per-phase counters

For each active status the panel SHALL show a single primary countdown to that phase's next milestone plus only the supporting figures relevant to that phase:

- `ready`, `checked_in`, `boarding_started`, `boarding_finished` → primary "time to off-block"; supporting "scheduled off-block".
- `taxiing_out` → primary "time to takeoff"; supporting "scheduled takeoff".
- `in_cruise` → primary "time to arrival"; supporting "estimated arrival" (derived from actual takeoff plus scheduled block time) and "scheduled arrival".
- `taxiing_in` → primary "time to on-block"; supporting "scheduled on-block".

#### Scenario: Taxi-out counter

- **WHEN** a flight has status `taxiing_out`
- **THEN** the panel shows a "time to takeoff" countdown and the scheduled takeoff time, and no unrelated counters

#### Scenario: Cruise counter shows scheduled arrival, not on-block

- **WHEN** a flight has status `in_cruise`
- **THEN** the "scheduled arrival" figure is the scheduled arrival time, and an "estimated arrival" figure is derived from the actual takeoff time plus the scheduled block time

### Requirement: On-time and overdue countdown treatment

A countdown SHALL render neutrally while the target is still in the future. Once the target time has passed, the countdown SHALL render as a negative, minus-signed value with a warning colour treatment; the leading minus sign is the non-colour cue, so meaning is not carried by colour alone. The panel SHALL NOT use the raw green/yellow/red urgency ramp, and SHALL NOT add a separate "overdue" badge (the signed value already conveys it).

#### Scenario: Overdue milestone

- **WHEN** the scheduled time for the current phase's milestone is in the past
- **THEN** the countdown shows a negative, minus-signed value in the warning colour, with no separate overdue badge

### Requirement: Arrival flight log

For statuses `on_block`, `offboarding_started`, and `offboarding_finished` the panel SHALL show the flight log — the four actual milestone times (off-block, takeoff, arrival, on-block) — plus the derived air time (arrival minus takeoff) and block time (on-block minus off-block).

#### Scenario: Flight log after arrival

- **WHEN** a flight has status `on_block`
- **THEN** the panel shows actual off-block, takeoff, arrival, and on-block times plus derived air time and block time

### Requirement: Automatic takeoff detection is available

During `taxiing_out`, when the departure airport is mapped (its shape has at least three points) AND a `flight.live-position-received` event is present among the flight's events, the panel SHALL state that takeoff will be reported automatically and that no user action is required, and SHALL show both satisfied conditions.

#### Scenario: Both conditions met

- **WHEN** a flight in `taxiing_out` has a mapped departure airport and has received a live position
- **THEN** the panel states takeoff will be reported automatically and no action is required, showing "Departure airport mapped" and "Live position acquired" as satisfied

### Requirement: Automatic takeoff detection is unavailable

During `taxiing_out`, when the departure airport is not mapped OR no `flight.live-position-received` event is present, the panel SHALL state that takeoff will NOT be reported automatically and that a manual report is required, and SHALL name each unmet condition. Meaning SHALL NOT be carried by colour alone.

#### Scenario: Departure airport not mapped

- **WHEN** a flight in `taxiing_out` has a departure airport without a shape
- **THEN** the panel states manual takeoff reporting is required and names "Departure airport not mapped" as the unmet condition

#### Scenario: No live position yet

- **WHEN** a flight in `taxiing_out` has a mapped departure airport but no `flight.live-position-received` event
- **THEN** the panel states manual takeoff reporting is required and names "Awaiting live position (ADS-B)" as the unmet condition, with the mapped-airport condition shown as satisfied

#### Scenario: Notice is taxi-out only

- **WHEN** a flight is in any status other than `taxiing_out`
- **THEN** the panel shows no automatic-takeoff notice

### Requirement: Manual phase advancement stays available under autolock

In every status except `created` and `closed` the panel SHALL present the phase-advancing action, including a manual "Report takeoff" during `taxiing_out` even when automatic detection is available. The action SHALL remain guarded by the autolock: it starts locked, arming requires an explicit unlock, and it re-locks automatically after 5 seconds without use.

#### Scenario: Action available in every actionable status

- **WHEN** a flight is in any status from `ready` through `offboarding_finished`
- **THEN** the panel shows the corresponding phase action guarded by the autolock

#### Scenario: Manual takeoff stays available when auto is active

- **WHEN** a flight in `taxiing_out` has automatic takeoff detection available
- **THEN** the panel still shows the manual "Report takeoff" action, framed as optional

#### Scenario: No action before release or after close

- **WHEN** a flight has status `created` or `closed`
- **THEN** the panel shows no phase-advancing action

#### Scenario: Autolock re-locks after inactivity

- **WHEN** the pilot unlocks the action and does not use it within 5 seconds
- **THEN** the action re-locks automatically

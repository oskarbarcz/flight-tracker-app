## Purpose

Lets a pilot answer three questions about the flight they are operating without leaving the
dashboard — am I on time, where in the flight am I, and are the load figures final yet — while
keeping the card a summary on a phone and spending its desktop width on data rather than whitespace.

## ADDED Requirements

### Requirement: The card answers at a glance on a phone

On a narrow viewport the current flight card SHALL present only the flight's identity, its route,
its status, the next significant time and one action. It SHALL NOT present load figures, alternates,
or a timesheet breakdown, because the card already reaches the fold on a phone and every one of
those belongs to the flight's own page, which the action reaches.

#### Scenario: Pilot opens the dashboard on a phone

- **WHEN** the dashboard renders below the `lg` breakpoint with a current flight
- **THEN** the card shows the operator's fin, the flight number, the aircraft registration, the
  status, the next significant time, both airport codes with their names and cities, a countdown and
  a single action
- **AND** it shows no load figures, no alternates and no per-event timesheet

#### Scenario: Registration reaches the aircraft

- **WHEN** a pilot taps the registration
- **THEN** the app opens that aircraft's history

### Requirement: The desktop card spends its width on a time axis

From the `lg` breakpoint the card occupies two grid columns, and the rail between the two airport
codes SHALL become a proportional time axis rather than a decorative bar. The axis SHALL pin the
four block events — off-block, takeoff, arrival, on-block — at positions true to the intervals
between them, each labelled with its time, so that taxi and airborne time read as distance without
the pilot subtracting anything.

The axis SHALL mark the aircraft's current position, and that mark SHALL be the only element on the
card carrying the accent colour, because it is the only thing on the card that is "here, now".

#### Scenario: Axis for a flight under way

- **WHEN** the card renders at or above `lg` for a flight with estimated times
- **THEN** the four block events appear along the axis at positions proportional to the real
  intervals between them
- **AND** each event states its time in a monospaced tabular figure
- **AND** the aircraft's present position is marked in the accent colour

#### Scenario: Axis degrades below the breakpoint

- **WHEN** the same card renders below `lg`
- **THEN** the axis reverts to a plain two-endpoint rail with no pinned labels

#### Scenario: Labels would collide

- **WHEN** the available width cannot separate four pinned labels
- **THEN** the card staggers them above and below the axis rather than overlapping or truncating them

### Requirement: Times state their own provenance and their delay

Where a time is known more precisely than the schedule, the card SHALL prefer the actual time, then
the estimated one, then the scheduled one, and SHALL make clear which of the three a figure is. Delay
SHALL be stated as a signed figure against the scheduled time, on arrival as well as departure.

Because `actual` fills in one event at a time, each event SHALL resolve its own provenance
independently; the card SHALL NOT require all four to be present.

#### Scenario: Flight is released but not checked in

- **WHEN** the flight's status is `created` or `ready`, so no estimated times exist
- **THEN** the card shows the scheduled times alone and states no delay
- **AND** it does not render empty or zeroed delay figures

#### Scenario: Flight is airborne with two events recorded

- **WHEN** actual off-block and takeoff times exist but arrival and on-block do not
- **THEN** the first two events show their actual times and the remaining two show estimates
- **AND** each states which it is

#### Scenario: Flight is arriving early

- **WHEN** an estimated arrival is earlier than the scheduled arrival
- **THEN** the card states the delta as a negative figure without a warning treatment

### Requirement: Desktop shows the load figures and whether they are final

From `lg` the card SHALL present the flight's passengers, cargo, crew and block fuel as a single row,
taken from the final loadsheet where one exists and the preliminary one otherwise. It SHALL state
which of the two it drew from, since a preliminary figure is not yet something a pilot can act on.

Where neither loadsheet exists the row SHALL be absent rather than showing zeroes.

#### Scenario: Only a preliminary loadsheet exists

- **WHEN** the card renders at or above `lg` and the flight has a preliminary loadsheet but no final one
- **THEN** the figures come from the preliminary loadsheet
- **AND** the card marks them as preliminary

#### Scenario: A final loadsheet exists

- **WHEN** a final loadsheet exists
- **THEN** the figures come from it and are marked final

#### Scenario: No loadsheet has been issued

- **WHEN** neither loadsheet exists
- **THEN** the figures row is absent

### Requirement: Alternates are reachable from the dashboard

From `lg` the card SHALL name the flight's destination alternate and any enroute alternates, and
SHALL state the aircraft's ETOPS threshold where the aircraft carries one. These airports arrive with
every flight and are currently named nowhere on the dashboard.

#### Scenario: Flight carries a destination alternate

- **WHEN** the card renders at or above `lg` and the flight's airports include a destination alternate
- **THEN** that airport's code appears, labelled as the alternate

#### Scenario: Flight carries no alternate

- **WHEN** the flight's airports contain only a departure and a destination
- **THEN** no alternate line appears

#### Scenario: Aircraft is ETOPS rated

- **WHEN** the aircraft carries an ETOPS threshold
- **THEN** the card states that threshold in minutes

### Requirement: The card stays a summary

The card SHALL NOT present the fuel breakdown, the passenger manifest, runway analysis, crew names,
parking stands or runways. Every desktop addition SHALL be expressible across the card's width; a
band that can only be added by making the card taller SHALL be left to the flight's own page.

#### Scenario: A pilot needs the fuel breakdown

- **WHEN** a pilot needs figures the card does not carry
- **THEN** the card's action reaches the flight's own page, which carries them

#### Scenario: The card is asked to grow

- **WHEN** a desktop addition cannot be laid out across the card's existing width
- **THEN** it is not added to the card

## ADDED Requirements

### Requirement: Live position received signal

The system SHALL treat a tracked flight as having received a live position when a `flight.live-position-received` event is present among that flight's events, whether the event arrived in the initial event history or was delivered live over the flight events stream. This event is emitted by the backend when it first observes the aircraft's live position.

#### Scenario: Event present in history

- **WHEN** the tracking dashboard loads a flight whose event history already contains a `flight.live-position-received` event
- **THEN** the flight is treated as having received a live position

#### Scenario: Event arrives live

- **WHEN** a `flight.live-position-received` event is delivered over the flight events stream for the tracked flight
- **THEN** the flight is treated as having received a live position without requiring a page reload

#### Scenario: No such event

- **WHEN** a tracked flight has no `flight.live-position-received` event among its events
- **THEN** the flight is not treated as having received a live position

### Requirement: ADSB polling requires a live position

On the tracking dashboard, the map SHALL poll the ADSB position feed only when the flight has received a live position AND the flight is in an active window (status `checked_in`, `boarding_started`, `boarding_finished`, `taxiing_out`, `in_cruise`, or `taxiing_in`). Polling the feed without a received live position is pointless (the feed returns nothing) and SHALL NOT occur.

#### Scenario: Live position starts polling during boarding

- **WHEN** a checked-in flight in a boarding status receives a live position
- **THEN** the map begins polling the ADSB position feed before the flight goes off-block

#### Scenario: No polling without a live position, even after off-block

- **WHEN** a flight has gone off-block (status `taxiing_out`) but has not received a live position
- **THEN** the map does not poll the ADSB position feed

#### Scenario: Polling stops after arrival

- **WHEN** a tracked flight advances to `on_block` or a later status
- **THEN** the map stops polling the ADSB position feed, even if a live position was received earlier

### Requirement: No polling before check-in

Regardless of any event received, the tracking dashboard map SHALL NOT poll the ADSB position feed while the flight is before check-in.

#### Scenario: Pre-check-in flight never polls

- **WHEN** a flight with status `created` or `ready` is shown on the tracking dashboard
- **THEN** the map does not poll the ADSB position feed, even if a live-position event is present

### Requirement: Continuous polling from early start onward

Polling that began after a live position SHALL continue without interruption as the flight advances through boarding into off-block, cruise, and taxi-in.

#### Scenario: No gap between early start and off-block

- **WHEN** a flight that started polling after a live position advances from a boarding status to `taxiing_out`
- **THEN** the map continues polling without a pause

### Requirement: Live-position event appears in the timeline

The flight event timeline SHALL display the `flight.live-position-received` event with a human-readable label.

#### Scenario: Event is labelled in the timeline

- **WHEN** a `flight.live-position-received` event is present for a tracked flight
- **THEN** the event appears in the flight event timeline with a human-readable label rather than a raw event key

### Requirement: ADSB status top bar on the tracking dashboard

The tracking dashboard map SHALL present a solid top bar across the top of the map. The left of the bar SHALL show an ADS-B status indicator; the right SHALL show the share controls (open public tracking map, copy tracking link) when the flight's tracking is not disabled. The status indicator SHALL express three states, each paired with a non-colour cue so meaning is not carried by colour alone:

- **ADS-B online** — green, shown when a live position is currently displayed on the map.
- **ADS-B offline (before off-block)** — gray, shown when no live position is displayed and the flight has not gone off-block.
- **ADS-B offline (after off-block)** — amber with a warning icon, shown when no live position is displayed and the flight has gone off-block.

#### Scenario: Online state

- **WHEN** the tracking dashboard is displaying a live position for the flight
- **THEN** the bar shows a green "ADS-B online" indicator

#### Scenario: Offline before off-block

- **WHEN** no live position is displayed and the flight has not gone off-block
- **THEN** the bar shows a gray "ADS-B offline" indicator

#### Scenario: Offline after off-block

- **WHEN** no live position is displayed and the flight has gone off-block
- **THEN** the bar shows an amber "ADS-B offline" indicator with a warning icon

#### Scenario: Share controls respect tracking visibility

- **WHEN** the flight's tracking is disabled
- **THEN** the share controls are not shown in the bar

### Requirement: History map reuses the top bar

The flight-history map SHALL present the same solid top bar, with the title "Historic flight path" on the left (in place of the live ADS-B status) and the share controls on the right. The history map SHALL NOT display the live telemetry overlay (altitude, ground speed, track, vertical rate).

#### Scenario: History map bar

- **WHEN** a completed flight's history map is shown
- **THEN** the map presents the top bar titled "Historic flight path" with the share controls on the right

#### Scenario: No live telemetry in history

- **WHEN** a completed flight's history map is shown
- **THEN** the altitude / ground-speed / track / vertical-rate telemetry overlay is not displayed

### Requirement: Other maps keep status-based tracking

The overview map (Operations) and the public flight map SHALL retain their existing polling rules and SHALL NOT depend on the live-position event. The overview map polls the ADSB feed based on flight status alone (in-flight statuses `taxiing_out`, `in_cruise`, `taxiing_in`).

#### Scenario: Overview map unaffected

- **WHEN** a flight is shown on the Operations overview map
- **THEN** the overview map polls the ADSB feed based on flight status as before, independent of any live-position event

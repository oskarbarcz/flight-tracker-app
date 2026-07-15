## Why

The Flight Progress panel on the pilot tracking dashboard is the pilot's primary situational readout and the control for advancing a flight through its lifecycle — yet it reads as off-brand next to the rest of the app: centered, traffic-light-coloured figures instead of the app's left-aligned, unit-labelled Roboto Mono data; a redundant inner "Flight status" title beneath the panel's own "Flight progress" heading; and a fixed set of counters that were never reconsidered per phase.

At the same time the backend now **auto-detects and reports takeoff** whenever the departure airport is mapped (has a shape) and ADS-B live position is being received. During taxi-out the manual "Report takeoff" action is therefore sometimes unnecessary — but the panel gives the pilot no sign of this, so they cannot tell whether they must act or can simply wait.

## What Changes

- **Redesign the Flight Progress panel** to the documented visual system: reuse the shared display primitives (`FieldLabel`, `StatBlock`, `MetaRow`, `BoxFooter`), set every figure in Roboto Mono `tabular-nums` with a labelled unit, and left-align content in a clear hierarchy instead of the current centered blocks.
- **Make the current flight phase the hero** of the panel and **remove the redundant inner title**, so the panel names the phase once and prominently.
- **Reconsider per-phase counters** — for each flight status, show only the figures a pilot acts on in that phase (a single primary countdown plus the scheduled/derived times that matter), specified phase-by-phase.
- **Replace the raw green/yellow/red countdown colours** with the semantic on-time / behind-schedule treatment (neutral by default, warning tint + a text/icon cue when overdue), so meaning is never carried by colour alone.
- **Add an automatic-takeoff notice in the Taxiing-out phase:**
  - When the departure airport is mapped **and** live position is being received → state that takeoff will be reported automatically and **no action is required**, and demote the manual action to optional.
  - When either condition is not met → state that takeoff will **not** be reported automatically and **manual action is required**, naming the missing condition (airport not mapped / awaiting live position).
- **Keep manual reporting available in every actionable phase**, including taxi-out even when auto-detection is active, and **preserve the autolock guard** (padlock unlock that re-locks after 5 s) on the phase-advancing action.

## Capabilities

### New Capabilities

- `flight-progress-panel`: the pilot tracking dashboard's Flight Progress panel — current-phase display, per-phase counters, the automatic-takeoff notice during taxi-out, and the autolock-guarded action control that advances the flight through its lifecycle.

### Modified Capabilities

<!-- None. The panel consumes the existing `flight.live-position-received` signal (live-position-tracking) and the `Airport.shape` field without changing their requirements. -->

## Impact

- **Components:** `FlightProgressBox` (rewrite), `FlightTimerBox` and the five `Timer/*` components (fold into the new per-phase metric layout), `ChangeFlightProgressButton` (autolock preserved; taxi-out gains optional/required framing).
- **Reused primitives:** `app/shared/ui/Display/{FieldLabel,StatBlock,MetaRow}`, `app/shared/ui/Layout/{Container,ContainerTitle,BoxFooter}`.
- **Data (existing, no backend change):** `Flight.status`, `Flight.timesheet.{scheduled,actual}`, `Flight.departureAirport.shape`, and the `flight.live-position-received` event from `useTrackedFlight().events`.
- **Scope:** pilot tracking dashboard only (`/track/:id` → Overview tab). No API, routing, or role-permission changes.

## Why

The Flight Progress panel already tells pilots whether takeoff (during taxi-out) and off-block (during boarding-finished) will be reported automatically or must be reported manually. Arrival is the next milestone the backend can auto-detect: it reports arrival automatically once the aircraft is inside the destination airport's mapped shape and its ground speed has dropped below 50 knots. Without a matching notice during cruise, pilots have no way to know whether they must report arrival themselves, so they either report redundantly or miss the report when automation is unavailable.

## What Changes

- Add an automatic arrival detection notice to the Flight Progress panel, shown during the `in_cruise` phase (the phase whose action is "Report arrival"), mirroring the existing automatic-takeoff and automatic-off-block notices.
- Automatic arrival detection is available when the destination airport is mapped (its shape has at least three points) AND a live position has been received. Both are required: the mapped shape defines the destination boundary, and the live position is what lets the backend see the aircraft cross into it and slow below 50 knots.
- When available, the notice states that arrival will be reported automatically once the aircraft has landed and slowed inside the destination airport, and that a manual report is optional, showing both satisfied conditions.
- When unavailable, the notice states that automatic detection is unavailable and a manual arrival report is required, naming each unmet condition ("Destination airport not mapped" and/or "Awaiting ADS-B signal"). Meaning is not carried by colour alone.
- The manual "Report arrival" action stays available under the autolock even when automatic detection is active.
- Reuses the shared `NoticePanel` / `NoticeCondition` primitives, the `hasLivePosition` helper, and a new `hasDestinationShape` helper (sibling to `hasDepartureShape`). The sky/info reserved-tint rule now also covers the arrival notice.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `flight-progress-panel`: Add requirements for the automatic arrival detection notice (available and unavailable states) during `in_cruise`, mirroring the existing automatic-takeoff requirements; extend the manual-advancement requirement to name arrival, and extend the reserved-tint note to cover the arrival notice.

## Impact

- `app/features/flight/components/Dashboard/Tracking/Progress/` — new `AutoArrivalNotice` component alongside `AutoTakeoffNotice` and `AutoOffBlockNotice`; new `hasDestinationShape` helper (in `autoTakeoff.ts`); reuses `hasLivePosition`, `NoticePanel`, and `NoticeCondition`.
- `app/features/flight/components/Dashboard/Tracking/Box/FlightProgressBox.tsx` — render the new notice in the panel.
- Spec: `openspec/specs/flight-progress-panel/spec.md`.
- No API, dependency, or data-model changes — the backend automation and the `flight.live-position-received` event already exist.

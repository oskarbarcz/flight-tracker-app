## Why

The Flight Progress panel already tells pilots during taxi-out whether takeoff will be reported automatically or must be reported manually. Off-block reporting now has the same backend automation — the backend reports off-block automatically once the aircraft's reported ground speed exceeds 3 knots — but only while a live position is being tracked. Without a matching notice during the boarding-finished phase, pilots have no way to know whether they must report off-block themselves, so they either report redundantly or miss the report when automation is unavailable.

## What Changes

- Add an automatic off-block detection notice to the Flight Progress panel, shown during the `boarding_finished` phase (the phase whose action is "Report off-block"), mirroring the existing automatic-takeoff notice shown during `taxiing_out`.
- When a live position has been received, the notice states that off-block will be reported automatically once the aircraft starts moving and that a manual report is optional, showing "ADS-B signal acquired" as the satisfied condition.
- When no live position has been received yet, the notice states that automatic detection is unavailable and a manual off-block report is required, naming the unmet condition "Awaiting ADS-B signal".
- Off-block auto-detection depends on a live position **only** — it does not require the departure airport to be mapped, because detection is purely speed-based (the backend's 3-knot threshold), unlike takeoff detection which needs the airport shape to determine airborne state.
- The manual "Report off-block" action stays available under the autolock even when automatic detection is active.
- The notice reuses the sky/info tint reserved for the automatic-takeoff notice; the reserved-tint rule already documented for the delay notice now covers off-block as well.
- The automatic-takeoff notice's condition labels are aligned to the shared ADS-B wording ("ADS-B signal acquired" / "Awaiting ADS-B signal") so the two notices read consistently. The label is latch-accurate (a live position has been received at least once) rather than a present-tense connectivity claim.
- The shared notice-panel shell (tone, icon, title, description, conditions) is extracted into a `NoticePanel` component reused by the takeoff, off-block, and delay notices.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `flight-progress-panel`: Add requirements for the automatic off-block detection notice (available and unavailable states) during `boarding_finished`, mirroring the existing automatic-takeoff requirements; note that the reserved sky/info tint now also covers the off-block notice.

## Impact

- `app/features/flight/components/Dashboard/Tracking/Progress/` — new `AutoOffBlockNotice` component alongside `AutoTakeoffNotice`; the shared `hasLivePosition` helper (in `autoTakeoff.ts`) is reused. New shared presentational primitives `NoticeCondition` and `NoticePanel`; `AutoTakeoffNotice` and `DelayNotice` are refactored onto them.
- `app/features/flight/components/Dashboard/Tracking/Box/FlightProgressBox.tsx` — render the new notice in the panel.
- Spec: `openspec/specs/flight-progress-panel/spec.md`.
- No API, dependency, or data-model changes — the backend automation and the `flight.live-position-received` event already exist.

## Context

The Flight Progress panel (`FlightProgressBox`) already renders `AutoTakeoffNotice` during `taxiing_out` and `AutoOffBlockNotice` during `boarding_finished`. Both read the tracked flight from `useTrackedFlight()`, evaluate their conditions, and render one of two states (sky/info "available" or amber "unavailable") through the shared `NoticePanel` + `NoticeCondition` primitives.

Arrival is now automated on the backend the same way: it reports arrival once the aircraft is inside the destination airport's mapped shape and its ground speed has dropped below 50 knots. Arrival is reported from the `in_cruise` status (its action is "Report arrival", advancing the flight to `taxiing_in`), so the notice belongs to that phase.

Unlike off-block (which needed only a live position, because that detection was purely speed-based), arrival detection is geometry-plus-speed: it needs the destination airport's shape to define the boundary and a live position to see the aircraft cross into it and slow. That makes arrival structurally identical to takeoff — two frontend preconditions: destination mapped and live position received.

## Goals / Non-Goals

**Goals:**
- Give pilots the same automatic-vs-manual clarity for arrival that they already have for takeoff and off-block, in the phase where the arrival action lives.
- Reuse the existing notice primitives, tones, and copy conventions so all three detection notices read as one system.

**Non-Goals:**
- No backend, API, or data-model work — the automation and the `flight.live-position-received` event already exist.
- No change to the takeoff or off-block notices, or to the arrival action button.
- No on-block (gate-arrival) detection — that is a separate milestone with different physics.

## Decisions

- **New component `AutoArrivalNotice`, sibling to `AutoTakeoffNotice`.** Rendered in `FlightProgressBox` alongside the other detection notices; they gate on mutually exclusive statuses (`in_cruise` vs `taxiing_out` vs `boarding_finished`), so at most one detection notice shows at a time. A separate component keeps each notice's copy and gating self-contained.
- **Two conditions, mirroring takeoff.** The component gates on `hasDestinationShape(flight) && hasLivePosition(events)`. When both hold it renders the `info` "Automatic arrival detection is active" state with two satisfied conditions ("Destination airport mapped", "ADS-B signal acquired"); otherwise the `warning` "Manual arrival report required" state naming each unmet condition. The `< 50 kt` / inside-shape checks are backend runtime detection, surfaced in the description copy — not frontend preconditions.
- **New `hasDestinationShape` helper.** Add it next to `hasDepartureShape` in `autoTakeoff.ts`, reading `flight.destinationAirport?.shape?.length >= 3`. Keeps the shape checks together and mirrors the departure helper exactly.
- **Reuse `NoticePanel` / `NoticeCondition`.** No new presentational scaffolding — the arrival notice is another caller of the shared panel with tone `info` / `warning`.
- **Copy.** Active: "Arrival will be reported automatically once the aircraft has landed and slowed inside the destination airport. You can still report arrival manually." Unavailable: "Automatic detection is unavailable, report arrival manually." Condition labels reuse the shared wording ("Destination airport mapped" / "Destination airport not mapped", "ADS-B signal acquired" / "Awaiting ADS-B signal"). The ADS-B label is latch-accurate, consistent with the takeoff and off-block notices.

## Risks / Trade-offs

- [The arrival notice (sky/info) and the delay notice (neutral gray) both render during `in_cruise`] → They are different tones and concerns and stack cleanly; the reserved-tint rule keeps the delay notice off the sky/info tint, so there is no visual collision.
- [Whether to name the "50 kt" threshold in the copy] → Following the off-block precedent, the visible copy stays qualitative ("landed and slowed inside the destination airport") and omits the exact figure, so there is nothing to drift; the threshold lives in the backend rule and this proposal's rationale only.

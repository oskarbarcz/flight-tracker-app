## Context

The Flight Progress panel (`FlightProgressBox`) renders `AutoTakeoffNotice` during `taxiing_out`. That component reads the tracked flight from `useTrackedFlight()`, evaluates two conditions — departure airport mapped (`hasDepartureShape`) and live position received (`hasLivePosition`) — and renders one of two states (sky/info "available" or amber "unavailable") built from a shared `Condition` row.

Off-block detection is now automated on the backend the same way: it reports off-block once the aircraft's reported ground speed exceeds 3 knots. That signal only flows while a live position is being tracked, so from the frontend the single gating condition is whether a `flight.live-position-received` event is present. Off-block is reported from the `boarding_finished` status (its action is "Report off-block", advancing the flight to `taxiing_out`), so the notice belongs to that phase.

## Goals / Non-Goals

**Goals:**
- Give pilots the same automatic-vs-manual clarity for off-block that they already have for takeoff, in the phase where the off-block action lives.
- Reuse the existing notice structure, colours, and copy conventions so the two notices read as one system.

**Non-Goals:**
- No backend, API, or data-model work — the automation and the `flight.live-position-received` event already exist.
- No change to the takeoff notice's behaviour or to the off-block action button.
- No new "departure airport mapped" gate — off-block detection is speed-based, not geometry-based.

## Decisions

- **New component `AutoOffBlockNotice`, sibling to `AutoTakeoffNotice`.** Rendered in `FlightProgressBox` immediately before `AutoTakeoffNotice`, so at most one shows at a time (they gate on mutually exclusive statuses: `boarding_finished` vs `taxiing_out`). A separate component keeps each notice's copy and gating self-contained, matching how the takeoff notice is already isolated. Alternative — parameterising one shared notice over a "milestone" prop — was rejected: the two differ in gating conditions (off-block has one, takeoff has two) and copy, so the abstraction would carry more branching than it removes.
- **Single condition: live position acquired.** The component gates only on `hasLivePosition(events)`. When true it renders the sky/info "Automatic off-block detection is active" state with a single satisfied `Condition`; when false it renders the amber "Manual off-block report required" state with the unmet `Awaiting live position (ADS-B)` condition. This deliberately omits the airport-shape check that takeoff needs.
- **Reuse `hasLivePosition` and extract the shared shell.** `hasLivePosition` already lives in `autoTakeoff.ts` and is generic. The presentational parts are extracted into two shared primitives: `NoticeCondition` (the icon + label condition row) and `NoticePanel` (the tone-driven shell: container/border/background, icon + bold title, description paragraph, and optional conditions wrapper). `AutoTakeoffNotice`, `AutoOffBlockNotice`, and `DelayNotice` all render through `NoticePanel` with a `tone` of `info` / `warning` / `neutral`, so the shell exists in one place instead of three near-identical copies.
- **Copy.** Active: "Off-block will be reported automatically once the aircraft starts moving. You can still report off-block manually." Unavailable: "Automatic detection is unavailable, report off-block manually." Condition labels use the shared ADS-B wording ("ADS-B signal acquired" / "Awaiting ADS-B signal"), and the takeoff notice's labels are aligned to match. The satisfied label is deliberately latch-accurate — a live position has been received at least once — rather than a present-tense connectivity claim, since `hasLivePosition` is monotonic and the map's own indicator carries the live/current ADS-B state.

## Risks / Trade-offs

- [Extracting the shared `Condition` row touches `AutoTakeoffNotice`] → Keep the extraction a pure move (same markup, same props); the takeoff notice's rendered output is unchanged, so no spec behaviour shifts.
- [Two info-tint notices could co-occur visually if statuses ever overlapped] → They cannot: `boarding_finished` and `taxiing_out` are distinct sequential statuses, and each notice returns `null` outside its own status.
- [Aligning the takeoff notice's condition labels touches a component outside the off-block scope] → The label change is a pure copy edit on the same branch; the takeoff requirements in the spec are updated in lockstep so spec and code stay consistent.

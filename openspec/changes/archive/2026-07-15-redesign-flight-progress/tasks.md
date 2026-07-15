## 1. Shared countdown foundation

- [x] 1.1 Add `useCountdown(targetTime)` hook (single 1 s interval, returns seconds remaining) under `Dashboard/Tracking/`, replacing the five duplicated timer effects
- [x] 1.2 Add `PhaseCountdown` presentational component: `{ label, targetTime }`, renders `formatTimeInterval` in Roboto Mono `tabular-nums` (no negative letter-spacing), neutral while positive, warning colour on the minus-signed value once negative (the `−` is the non-colour cue; no separate overdue badge)

## 2. Phase display components

- [x] 2.1 Add `LifecycleTrack` — 5-segment bar (Preparation / Taxi out / En route / Taxi in / Turnaround) mapping status → macro-stage; current = indigo, completed = filled gray, upcoming = light gray, with a non-colour cue
- [x] 2.2 Add `PhaseMetrics` — selects primary `PhaseCountdown` + supporting `MetaRow`s per status per the design table; use `schedule.arrivalTime` for scheduled arrival and derive estimated arrival from `actual.takeoffTime + timeDiff(schedule.takeoffTime, schedule.arrivalTime)`
- [x] 2.3 Extend `PhaseMetrics` with the `on_block`/offboarding flight-log ladder: actual off-block/takeoff/arrival/on-block plus derived air time and block time
- [x] 2.4 Handle the `created` phase: no countdown, muted "Not yet released by operations" line, scheduled off-block row, no action footer

## 3. Automatic-takeoff notice

- [x] 3.1 Add `AutoTakeoffNotice` deriving `isMapped` (`departureAirport.shape.length >= 3`) and `hasLivePosition` (`events.some(e => e.type === LivePositionReceived)`) from `useTrackedFlight()`
- [x] 3.2 Render the available state (info/sky tint, "no action required", both conditions checked) and the unavailable state (warning/amber tint, "manual report required", each unmet condition named with icon + word)
- [x] 3.3 Gate the notice to `taxiing_out` only

## 4. Action control

- [x] 4.1 Move `ChangeFlightProgressButton` (autolock padlock + `mapStatusToButton`) into a `BoxFooter`, preserving the locked-start / unlock-arms / 5 s auto-relock behaviour
- [x] 4.2 No footer caption in any phase (redundant with the button and the auto-takeoff notice); keep the action hidden for `created` and `closed`

## 5. Assemble and clean up

- [x] 5.1 Rewrite `FlightProgressBox` to compose Title → phase hero (FieldLabel "PHASE" + ink phase name) → `LifecycleTrack` → `PhaseMetrics` → `AutoTakeoffNotice` → footer, removing the redundant inner "Flight status" title
- [x] 5.2 Grep for importers of `FlightTimerBox` and `Timer/*`; delete `FlightTimerBox` and the five `Timer/*` components once only `FlightProgressBox` referenced them

## 6. Verify

- [x] 6.1 `npm run lint`, `npm run typecheck`, `npm run build` pass
- [x] 6.2 Walk each status on the tracking dashboard and confirm the correct counters, phase hero, and lifecycle stage
- [x] 6.3 Verify a `taxiing_out` flight shows the available notice with a mapped airport + live position, and the unavailable notice (correct unmet condition) otherwise; confirm manual "Report takeoff" stays available in both
- [x] 6.4 Check WCAG 2.1 AA contrast on both callout tints and the overdue treatment in light and dark themes

## Context

`FlightProgressBox` (`app/features/flight/components/Dashboard/Tracking/Box/FlightProgressBox.tsx`) is the pilot's control-and-readout panel on the tracking dashboard Overview tab. Today it renders:

- the `ContainerTitle` eyebrow "Flight progress",
- a second inner "Flight status" label with the status in bold indigo,
- `FlightTimerBox`, which delegates to one of five `Timer/*` components (`OffBlockTimer`, `TakeoffTimer`, `ArrivalTimer`, `OnBlockTimer`, `SummaryTimer`) — each a stack of **centered** figures at `text-4xl`/`text-2xl` in the proportional font, coloured with raw `text-green-500` / `text-yellow-500` / `text-red-500` urgency ramps,
- `ChangeFlightProgressButton`, a right-aligned padlock (autolock: unlock → auto re-locks after 5 s) plus the per-phase action button dispatched by `mapStatusToButton`.

Two forces drive the redesign. First, the panel is off-brand: centered, colour-ramped, proportional-font figures contradict the documented system (left-aligned, unit-labelled Roboto Mono `tabular-nums`, indigo reserved for action/selection, colour as signal not decoration) and the shared `Display`/`Layout` primitives the rest of the dashboard already uses. Second, the backend now **auto-reports takeoff** once the departure airport is mapped and ADS-B live position is being received; during taxi-out the manual report is then redundant, but the panel never tells the pilot that.

Constraints: frontend-only, no API or routing change; reuse existing primitives and helpers (`FieldLabel`, `StatBlock`, `MetaRow`, `BoxFooter`, `Container`, `ContainerTitle`, `secondsToNow`, `formatTimeInterval`, `timeDiff`, `FormattedIcaoTime`, `FormattedIcaoDate`); preserve the autolock guard; WCAG 2.1 AA in both themes.

## Goals / Non-Goals

**Goals:**

- Rebuild the panel on the documented visual system and shared primitives, so it reads as part of the dashboard.
- Make the current phase the panel's hero and remove the redundant inner title.
- Define, per flight status, the minimal set of figures a pilot acts on in that phase.
- Show, during taxi-out, whether takeoff will be auto-reported (no action required) or must be reported manually (action required), naming any unmet condition.
- Keep manual phase-advancement available in every actionable phase, guarded by the existing autolock.

**Non-Goals:**

- No backend, API, or event-model change. Auto-takeoff detection already exists server-side; the flight advances `taxiing_out → in_cruise` over the events stream when it fires, and the panel re-renders from that — the panel never calls a "confirm auto" endpoint.
- No new delay-management surface (the Delays tab and `TimeManagementBox` own that); the panel only shows an on-time / overdue cue on its countdown.
- No change to which statuses expose an action (still every status except `created` and `closed`).
- Not touching the Operations overview map, public map, or history map.

## Decisions

### Decision 1 — Panel anatomy

Five stacked zones inside the existing `Container padding="condensed"`:

```
┌ Container ─────────────────────────────────────────────┐
│ ▸ FLIGHT PROGRESS                        (ContainerTitle)│
│                                                          │
│ PHASE                                                    │  ← FieldLabel
│ Taxiing out                                              │  ← phase name, Inter 600, ink
│ ●───●───◍───○───○   Prep · Taxi · Air · Taxi · Turn      │  ← lifecycle track (5 segments)
│ ────────────────────────────────────────────────────────│  hairline
│ TIME TO TAKEOFF                                          │  ← primary metric (FieldLabel)
│ 00:12:34                                                 │  ← Roboto Mono, tabular, ~text-3xl
│ Scheduled takeoff                              12:45 Z   │  ← MetaRow (mono value)
│ ────────────────────────────────────────────────────────│  hairline (taxi-out only)
│ [ⓘ Automatic takeoff detection active — no action needed]│  ← auto-takeoff notice
│    ✓ Departure airport mapped   ✓ Live position acquired │
│ ────────────────────────────────────────────────────────│  BoxFooter (top border)
│ Takeoff auto-reported — manual optional     🔓  Report ↴ │  ← leading caption + autolock + action
└──────────────────────────────────────────────────────────┘
```

- **Title** — unchanged `ContainerTitle icon={FaGaugeHigh} title="Flight progress"`. Its indigo eyebrow is the committed brand signature and stays.
- **Phase hero** — `FieldLabel` "PHASE" over the status name from `toHuman.flight.status.standard(status)`, set in Inter 600 (~`text-xl`), **ink, not indigo**. The redundant inner "Flight status" label is removed; the panel names the phase once.
- **Lifecycle track** — a slim 5-segment bar mapping the 12 statuses to macro-stages (see Decision 3). Completed segments = filled gray, current = indigo, upcoming = light gray. Indigo here is the "current selection / progress" role, which the system explicitly sanctions.
- **Phase metrics** — one primary countdown (hero figure) plus the supporting scheduled/derived rows for that phase (Decision 2).
- **Auto-takeoff notice** — rendered only in `taxiing_out` (Decision 4).
- **Action footer** — `BoxFooter` carrying a requirement caption (`leading` slot) plus the autolock padlock and the phase action button (Decision 5).

### Decision 2 — Per-phase counters

For each status, show a single **primary countdown** (the next milestone the pilot is driving toward) and only the supporting figures relevant in that phase. Every figure is Roboto Mono `tabular-nums`, unit-labelled (`Z` for UTC times), left-aligned label / right-aligned value via `MetaRow`, or the large hero figure for the countdown.

| Status | Primary metric (hero) | Supporting figures | Action label |
|---|---|---|---|
| `created` | — (not released) | muted "Not yet released by operations" · Scheduled off-block | *(no action)* |
| `ready` | Time to off-block | Scheduled off-block | Check in for flight |
| `checked_in` | Time to off-block | Scheduled off-block | Start boarding |
| `boarding_started` | Time to off-block | Scheduled off-block | Fill loadsheet and finish boarding |
| `boarding_finished` | Time to off-block | Scheduled off-block | Report off-block |
| `taxiing_out` | Time to takeoff | Scheduled takeoff | Report takeoff |
| `in_cruise` | Time to arrival | Estimated arrival (actual takeoff + est. block) · Scheduled arrival | Report arrival |
| `taxiing_in` | Time to on-block | Scheduled on-block | Report on-block |
| `on_block` | — (flight log) | Actual off-block · takeoff · arrival · on-block; derived **air time** & **block time** | Start offboarding |
| `offboarding_started` | — (flight log) | same flight log | Finish offboarding |
| `offboarding_finished` | — (flight log) | same flight log | Close flight |

- **Countdown treatment:** neutral ink while positive; once negative, render the minus-signed value in a `warning` (amber) colour. The leading `−` is itself the non-colour cue, so meaning is never carried by colour alone — no separate "OVERDUE" badge is added (it would be redundant with the signed value). The raw green/yellow/red ramp is dropped. Figures carry no negative letter-spacing, so the monospace grid stays even.
- **Cruise correction:** the current `ArrivalTimer` mislabels `schedule.onBlockTime` as "scheduled arrival". The redesign uses `schedule.arrivalTime` for scheduled arrival and keeps the derived estimate (`actual.takeoffTime + timeDiff(schedule.takeoffTime, schedule.arrivalTime)`), with the derivation stated.
- **Arrival flight-log:** `on_block`/offboarding phases show the four actual milestone times as a vertical `MetaRow` ladder (mirroring the fuel build-up signature) plus two derived subtotals — air time (`arrival − takeoff`) and block time (`on-block − off-block`) — so the record is verifiable.

### Decision 3 — Lifecycle macro-stages

The 12-status enum is too granular for a compact track, so it collapses to five journey stages; the current status lights the matching segment:

| Stage | Statuses |
|---|---|
| Preparation | `created`, `ready`, `checked_in`, `boarding_started`, `boarding_finished` |
| Taxi out | `taxiing_out` |
| En route | `in_cruise` |
| Taxi in | `taxiing_in` |
| Turnaround | `on_block`, `offboarding_started`, `offboarding_finished`, `closed` |

*Alternative considered:* a per-milestone timeline (off-block → takeoff → arrival → on-block). Rejected as heavier and closer to "theater"; the 5-segment bar gives journey context quietly and the phase name already carries the precise status. The track is an enhancement — if it reads as noise in review, the fallback is the phase name alone with a muted stage caption.

### Decision 4 — Automatic-takeoff notice (taxi-out only)

Derive availability purely from existing data, reusing the established checks:

```ts
const isMapped = (flight.departureAirport?.shape?.length ?? 0) >= 3;           // AirportShape convention
const hasLivePosition = events.some(e => e.type === FlightEventType.LivePositionReceived); // MapBox convention
const autoTakeoffAvailable = flight.status === FlightStatus.TaxiingOut && isMapped && hasLivePosition;
```

- **Available** → an `info` (sky) callout: heading "Automatic takeoff detection active", body "Takeoff will be reported automatically once airborne — no action required.", and two satisfied conditions with check marks ("Departure airport mapped", "Live position acquired"). The manual action stays present but is framed as optional by this notice; no extra footer caption repeats it.
- **Unavailable** → a `warning` (amber) callout — consistent with the ADS-B "offline after off-block" amber already used on the map: heading "Manual takeoff report required", body "Automatic detection is unavailable — report takeoff once airborne.", listing the unmet condition(s): "Departure airport not mapped" and/or "Awaiting live position (ADS-B)"; a satisfied condition still shows a check.

Both callouts share one layout and pair colour with an icon and words. The notice appears **only** in `taxiing_out`; no other phase has auto-detection.

### Decision 5 — Action control & autolock

Keep `ChangeFlightProgressButton`'s behaviour (padlock starts locked; unlocking arms the action; a 5 s timeout re-locks) and its `mapStatusToButton` dispatch, but relocate it into the `BoxFooter`:

- The footer carries no caption in any phase — the controls simply right-align. A generic "Action required" is redundant with the action button, and the auto-takeoff "optional" framing already lives in the notice directly above the footer.
- The padlock + action button keep their current indigo-outline styling — the manual button is available in every actionable phase, taxi-out included, whether or not auto-detection is active. This honours "keep users reporting takeoff if they want."
- `created` renders no footer (as today); `closed` never reaches the panel (the route redirects to history).

### Decision 6 — Component structure

Replace `FlightTimerBox` and the five `Timer/*` components with a data-driven layout, reducing duplication (five near-identical countdown+interval components → one):

- `PhaseCountdown` — presentational hero figure: `{ label, targetTime }`, renders `formatTimeInterval` in mono with the overdue treatment.
- `useCountdown(targetTime)` — one shared 1 s-interval hook (replacing the five copies of the effect), honouring `prefers-reduced-motion` (it only updates text, so no motion concern).
- `PhaseMetrics` — selects the primary countdown + supporting `MetaRow`s per status (Decision 2 table), including the `on_block` flight-log ladder.
- `LifecycleTrack` — the 5-segment bar (Decision 3).
- `AutoTakeoffNotice` — the taxi-out callout (Decision 4).
- `FlightProgressBox` — composes Title → phase hero → `LifecycleTrack` → `PhaseMetrics` → `AutoTakeoffNotice` → footer.

Files live under the existing `Dashboard/Tracking/` tree; the old `Timer/*` files are removed once folded in.

## Risks / Trade-offs

- **[Auto-takeoff heuristic differs subtly from the backend's]** → The panel's "available" signal is a client-side approximation (shape present + a live-position event seen), not the server's exact detector. If the backend's condition diverges, the panel could say "no action required" while the server does not auto-report. *Mitigation:* the manual action is always present, so the pilot can still report; the notice is advisory, and the flight advancing over the events stream is the source of truth for the phase change.
- **[Lifecycle track reads as decoration]** → risks the "procedural realism, not theater" line. *Mitigation:* keep it a slim, quiet, colour-restrained bar (one indigo current segment); fallback to phase name + muted stage caption if reviewers object.
- **[Second indigo element on the panel]** → the track's current segment plus the action button are both indigo. *Mitigation:* both are sanctioned roles (progress/selection and action) and each is small; the phase name and figures stay neutral, keeping indigo ≤10% of the panel.
- **[Removing `Timer/*` touches shared imports]** → other code could import a timer directly. *Mitigation:* grep for importers before deletion; `FlightTimerBox` is only used by `FlightProgressBox`.
- **[Overdue tint contrast on tinted callouts]** → the muted-gray-on-tint trap called out in PRODUCT.md. *Mitigation:* use saturated semantic text on light tint per DESIGN.md and verify 4.5:1 in both themes.

## Migration Plan

1. Add `useCountdown`, `PhaseCountdown`, `LifecycleTrack`, `PhaseMetrics`, `AutoTakeoffNotice`.
2. Rewrite `FlightProgressBox` to compose them; move the autolock control into `BoxFooter`.
3. Delete `FlightTimerBox` and the five `Timer/*` components once no importer remains.
4. Verify `lint`, `typecheck`, `build`; walk each status on the tracking dashboard (including a taxi-out flight with and without a mapped departure airport / live position).

Rollback is a straight revert — the change is additive to data already loaded and touches no API or persisted state.

## Resolved Decisions

Confirmed against the approved visual proposal (`redesign-flight-progress.html`, 2026-07-15):

- **Lifecycle track ships in v1** — the quiet 5-segment bar with the current stage lit; no fallback needed.
- **Flight log includes the derived subtotals** — air time and block time are shown alongside the four actual milestone times ("show the derivation").
- **The manual takeoff button stays at full strength when auto-detection is active** — optionality is carried by the footer caption ("Takeoff auto-reported — manual optional"), not by restyling the button, so no per-phase button churn.

## Open Questions

- None outstanding; design approved for implementation.

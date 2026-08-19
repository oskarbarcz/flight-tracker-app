## Context

See proposal.md — Why. Five statistics endpoints are deployed and unconsumed. Two of them matter here:

- `/stats/periods` returns totals for `week`, `month` and `year`, each as `{current, previous, unlocked}`. It is fixed to those three spans, anchored on today, with no way to ask for a different week or an arbitrary range.
- `/stats/activity?from&to` returns a **sparse** list of `{day, flights, airborneMinutes, blockMinutes}` — days without flying are simply absent.

The spec requires stepping to arbitrary past spans, a custom range, and a per-bucket chart. `/stats/periods` cannot serve any of those. This tension is what the design has to resolve.

The app has no charting library and no date library. `app/shared/lib/time.ts` supplies `formatDuration`, `durationMinutes` and padding helpers; there is no `date-fns` or `dayjs`.

## Goals / Non-Goals

**Goals:**

- A single `activity` request serves every span the pilot can select, including stepping and custom ranges.
- Bucketing, span arithmetic and delta rules are pure functions in `lib/`, independent of React and of Recharts.
- The chart inherits the existing theme tokens so light and dark need no JavaScript.

**Non-Goals:**

- Caching or persisting the selected span across visits. The page opens on the current month every time.
- A shared date-range control for other features. The stepper is local to this panel until a second caller exists.
- Server-side aggregation. No API change is required to ship this, though one would simplify it — see Follow-up for the API.

## Decisions

### Each field has exactly one source

The page fetches one activity window — the pilot's first flight through today — and computes each span's `current`, `previous` and per-bucket series from it client-side.

Flights, air time and block time are read from `activity` for **every** span, including the three presets that `/stats/periods` could also answer. Serving them from `periods` on a preset and from `activity` once stepped would let "this month" change value depending on how the pilot navigated to it.

*Alternative — take all preset totals from `/stats/periods`:* rejected for exactly that reason, and because it cannot serve a stepped or custom span at all.

*Consequence, and the reason this needs saying:* `activity` carries only flights, airborne and block minutes. **Distance and fuel cannot be computed from it at all.**

So `/stats/periods` is called after all, but for those two fields only. The split is strict and it is what keeps the page coherent:

| Field | Source | Spans it can serve |
|---|---|---|
| flights, airborneMinutes, blockMinutes | `/stats/activity`, bucketed client-side | every span, including stepped and custom |
| distanceNm, fuelBurned | `/stats/periods` | the current week, month and year only |
| first visits: aircraft types | `/stats/aircraft-types`, via each type's `firstFlownAt` | every span |
| first visits: airports | `/stats/periods` &rarr; `unlocked.airports` | the current week, month and year only |

First visits split by kind. A type's `firstFlownAt` is already exact in `/stats/aircraft-types`, so "types first flown in this span" is a date comparison the client can do for **any** span. Airports have no equivalent: `unlocked.airports` is only in the `/stats/periods` payload, and nothing else carries a per-airport first-visit date — travel history is a positioning log, not a visit history, and returned one row for a seeded pilot with nine flights across seven airports. So the airports half states its limitation and the types half simply works.

No field is ever served two ways, so nothing can disagree with itself. Distance and fuel populate on the current week, month and year — the view the page opens on — and render as an em dash with a stated reason on any stepped or custom span. The tile stays in place either way, so the layout does not shift as the pilot navigates, and the limitation is visible rather than silent.

### Fetch the whole logbook window once

`records.firstFlightAt` from `/stats/summary` bounds the stepper anyway, so the page needs it before it can render controls. Given that, one `activity` request for the full range costs a single round trip and makes every subsequent span change instant and offline-free. A pilot with three years of daily flying yields at most ~1100 rows of four small numbers.

*Alternative — refetch per span:* rejected. It puts a network round trip behind every stepper click, and the dev server's double mount would double every one of them.

### Treat a missing day as zero, never as absent

Bucketing indexes the response into a `Record<string, ActivityDay>` keyed by `YYYY-MM-DD` and reads misses as zero. This is the single most likely defect in the change — the endpoint's sparseness is invisible in its OpenAPI shape.

### Recharts, with the theme supplied by CSS custom properties

Bars are Recharts `<Bar>` elements whose `fill` is a `var(--…)` reference to the existing token set, so a theme switch repaints without a re-render. Recharts renders SVG, which keeps the marks inspectable and lets the tooltip be a normal DOM node.

*Alternative — Chart.js:* rejected. Canvas cannot read CSS custom properties, so each theme change needs a manual redraw, and the marks are opaque to assistive technology against a WCAG 2.1 AA bar.

*Alternative — hand-rolled SVG:* viable and dependency-free, and what the design mockup used. Recharts was chosen for the axis, scale and tooltip machinery the later blocks will also need.

### Span arithmetic in UTC, on plain `Date`

All span maths uses `Date.UTC` and millisecond offsets. The API's `day` is a bare `YYYY-MM-DD` with no zone, and the app already renders times as `Z`. Constructing local-midnight dates would shift a day's flying across a boundary for any pilot west of UTC. No date library is introduced for what is addition and month-boundary lookup.

### Delta thresholds live beside the metric, not in the component

Each metric declares its own floor below which a percentage is withheld. The floors differ by measure — three flights is a thin baseline, three minutes of air time is noise — so a single global threshold cannot serve them. `lib/delta.ts` takes `(current, previous, floor, format)` and returns a discriminated result: `unchanged`, `percentage`, `absolute`, or `noBaseline`. The component renders the variant and never computes.

## Risks / Trade-offs

- **Distance and fuel are unavailable on stepped and custom spans** → The tile keeps its place and states why it is empty, so a pilot is never shown a figure computed from the wrong span. Tracked as an API follow-up below.
- **The sparse activity response reads as dense** → Bucketing goes through one lookup helper that defaults to zero, and its behaviour on an absent day is the first thing to verify against real data.
- **One large activity request on page open** → Bounded by `records.firstFlightAt` rather than an arbitrary early date, so it never fetches emptiness. Revisit only if a logbook grows past a few thousand days.
- **Recharts is a new dependency for one chart** → Accepted deliberately, on the expectation that the heatmap and the per-type table follow. If those land hand-rolled instead, this dependency is worth removing again.
- **Recharts ships its own d3 modules** → Import only the pieces used, and check the production bundle after wiring, since the app has no bundle budget enforcement to catch a regression.
- **A pilot with one closed flight** → Every span but one has an empty predecessor, so `noBaseline` and the sparse-baseline path are the normal case, not the edge. Both are specified.

## Migration Plan

Additive: a new route, a new feature slice, and one dependency. Nothing existing changes shape. `PilotStatsBox` loses its placeholder body and becomes a link into the page, which is a visual change to the dashboard with no data dependency.

`package.json` must be bumped before merge — `bin/check_version_is_free` fails the PR otherwise.

## Follow-up for the API

Adding `distanceNm` and `fuelBurned` to `ActivityDay` would let the client compute all four measures for every span from the one activity request, and would retire the `/stats/periods` call and the dashed tiles with it. Per-span **new airports** need more than that: either the visited airports on each activity day, or `from`/`to` accepted on `/stats/periods`. New aircraft types need nothing — they are already derivable. It is the smaller of the two possible API changes — the alternative is accepting `from`/`to` on `/stats/periods`. Not required for this change to ship.

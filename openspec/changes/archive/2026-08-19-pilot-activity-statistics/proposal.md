## Why

The API has shipped five pilot statistics endpoints and nothing consumes them. The one surface that promises this data — `PilotStatsBox` on the pilot dashboard — is a `TilePlaceholder` reading "Flight time, fuel and distance for the past month will summarise here." A pilot who has closed two hundred flights currently has no way to see what they have flown.

Statistics are also the payoff for the procedural work the app already asks of pilots. Every timesheet report and loadsheet a pilot fills in feeds these figures; leaving them unreadable makes the paperwork feel like an end in itself.

## What Changes

- Add a **`/stats` route** for pilots, reached from the sidebar, the profile page and the dashboard's stats tile.
- Add a **"Your activity" comparison panel** as the page's opening block. It shows exactly one span at a time — week, month or year — and animates between them.
- Let the pilot **choose which** week, month or year they are looking at, with a prev/next stepper bounded by the first logged flight at one end and the running period at the other, plus a "Back to now" escape.
- Add a **Custom span** alongside the three presets, revealing a compact from/to range that maps onto the activity endpoint's existing `from`/`to` parameters.
- Draw **block time as a bar chart** for the selected span: the chosen period against its predecessor on a single axis. Buckets are days for week and month, months for a year, and are chosen by span length for a custom range. Buckets that have not happened yet are marked as such rather than drawn as zero flying.
- Report **flights, air time, distance and fuel** as metric tiles with deltas against the previous period.
- Tell the truth about weak comparisons: a percentage is **replaced by an absolute change** when the previous period is too sparse to support one, a period with no predecessor in the logbook reports **"no earlier data"** instead of a fabricated delta, and the **elapsed-time bar appears only while the selected period is still running**.
- Scope **first visits** — the airports and aircraft types flown for the first time — to exactly the selected span, collapsed behind a fade preview whose "Show all" affordance appears only when the chips genuinely overflow. First visits, like distance and fuel, are only obtainable for the current week, month and year; elsewhere the section says so rather than reading as though nothing was visited.
- Retire the `PilotStatsBox` placeholder, replacing its empty state with a link into the new page.
- Add **Recharts** as a dependency for the bar chart.

- Add a **flying-activity heatmap** below the panel: one square per day for a whole calendar year, shaded by that day's block time, with a switcher for every year the pilot has flown and a monthly breakdown behind a disclosure. The current year runs up to today, with the remaining days left blank.

The remaining designed blocks — the per-aircraft-type table, records, network and fleet, and lifetime totals — are deliberately **out of scope here** and follow as separate changes as each passes design review. The route is built to receive them.

`GET /api/v1/user/me/stats` is the older endpoint and its `blockTime` field is already marked deprecated; `/stats/summary` returns a superset, so the legacy route stays unused.

## Capabilities

### New Capabilities

- `pilot-activity-statistics`: The `/stats` route and its "Your activity" panel — choosing and navigating a span, the block-time comparison chart and its bucketing, the metric tiles and their deltas, how weak or absent comparisons are reported, and first visits scoped to the span.

### Modified Capabilities

<!-- None. No existing spec describes the pilot dashboard's stats tile, so replacing its
     placeholder changes no documented requirement. -->

## Impact

- **Routes**: new `/stats` under `PilotLayout` in `app/routes.ts`, with a route module at `app/routes/pilot/stats/`.
- **Frontend code**: new `app/features/stats/` slice (`model.ts`, `service.ts`, `lib/`, `components/Activity/`, `components/Heatmap/`, `hooks/`, `index.ts`); `StatsService` registered in `app/shared/api/useApi.tsx`; navigation entries in `CabinCrewSidebarItems` and `MeRoute`; `PilotStatsBox` in `app/features/flight/components/Dashboard/Main/Box/` reduced to a link.
- **API**: consumes `GET /api/v1/user/me/stats/periods` and `GET /api/v1/user/me/stats/activity?from&to`. No API work — both are deployed. The chart's shape comes from bucketing the activity response client-side, because `/stats/periods` returns totals only; no new endpoint is required.
- **Dependencies**: adds `recharts`. `package.json` version must be bumped before merge, as `bin/check_version_is_free` enforces.
- **Data shape**: the activity response is a **sparse** list of days, so any absent date must be read as zero rather than assumed present. `mostFlownAircraftType`, `mostFlownAirline`, `geography.mostVisitedAirport`, `records.firstFlightAt` and `records.lastFlightAt` are nullable, and the first-flight date bounds the stepper — a pilot with no closed flights needs a real empty state for the whole page.
- **Accessibility**: the span control is a tablist, the stepper's bounds are communicated by disabled state, and the collapsed first-visits region must be inert while hidden. WCAG 2.1 AA in both themes, per `DESIGN.md`.

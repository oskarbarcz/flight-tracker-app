## 1. Dependency and slice scaffolding

- [x] 1.1 Install `recharts` and bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Create `app/features/stats/` with `model.ts`, `service.ts`, `index.ts`, `lib/` and `components/`
- [x] 1.3 Define the response types in `model.ts` mirroring the API: `LifetimeTotals`, `LifetimeRecords`, `GeographySummary`, `StatsSummary`, `PeriodTotals`, `PeriodComparison`, `PeriodStats`, `ActivityDay`, `AircraftTypeStat` — with `mostFlownAircraftType`, `mostFlownAirline`, `geography.mostVisitedAirport`, `records.firstFlightAt` and `records.lastFlightAt` all nullable
- [x] 1.4 Implement `StatsService` on `AbstractAuthorizedApiService` with `fetchSummary()`, `fetchPeriods()` and `fetchActivity(from, to)` serialising `from`/`to` as bare `YYYY-MM-DD`; do not add a method for the deprecated `/stats` route
- [x] 1.5 Register `statsService` in `ApiProvider` and the `ApiServices` type in `app/shared/api/useApi.tsx`

## 2. Span arithmetic and bucketing

- [x] 2.1 Add `lib/span.ts` with a `Span` type (`kind`, `from`, `to`, `prevFrom`, `prevTo`, `label`, `prevLabel`, `inProgress`) and constructors for week, month, year at an offset, plus a custom range whose predecessor is the equal-length stretch immediately before it
- [x] 2.2 Build every span in UTC via `Date.UTC` so a bare `YYYY-MM-DD` never shifts across a day boundary
- [x] 2.3 Add `earliestOffset(kind, firstFlightAt)` so the stepper can be bounded, and cap the later end at the span containing today
- [x] 2.4 Add `lib/activityIndex.ts` turning `ActivityDay[]` into a date-keyed lookup that returns zeroes for an absent day, and a `sumRange(from, to)` over it
- [x] 2.5 Add `lib/buckets.ts` producing chart buckets for a span: days for week and month, months for a year, and days/weeks/months chosen by length for a custom span; each bucket carries the selected and preceding values, the dates both describe, and whether it falls after today
- [x] 2.6 Add `lib/delta.ts` returning a discriminated result — `unchanged`, `percentage`, `absolute` or `noBaseline` — taking a per-measure floor below which a percentage is withheld, and reporting `noBaseline` when the preceding span ends before the first logged flight

## 3. Data loading

- [x] 3.1 Add `hooks/useStats.ts` fetching summary and periods once, then the activity window from `records.firstFlightAt` through today, exposing `loading`, `error` and the parsed data
- [x] 3.2 Return a distinct "no closed flights" state when `records.firstFlightAt` is null, so the page can render its empty state instead of an empty chart
- [x] 3.3 Skip the activity request entirely when there is no first flight

## 4. The "Your activity" panel

- [x] 4.1 Build `components/Activity/ActivityPanel.tsx` with a stable `ContainerTitle` reading "Your activity" and a separate subtitle naming the comparison, never restating the selection
- [x] 4.2 Build `components/Activity/SpanTabs.tsx` as a tablist for week/month/year with roving arrow-key focus, plus a separate Custom control that reveals a compact from/to range only while custom is selected
- [x] 4.3 Build `components/Activity/SpanStepper.tsx` with earlier/later buttons disabled at the logbook's start and at the present, a label naming the span, and a "Back to now" control that appears only when the span does not contain today; hide the whole stepper for a custom span
- [x] 4.4 Guard the custom range against an end date before its start by keeping the last valid span
- [x] 4.5 Build `components/Activity/ElapsedBar.tsx` and render it only while the selected span contains today
- [x] 4.6 Build `components/Activity/BlockTimeChart.tsx` on Recharts: one shared axis, the selected span dominant against the preceding span as a recessive bar, `fill` set from the existing CSS custom properties so a theme switch needs no re-render, buckets after today marked as not-yet-happened, and a tooltip naming both dates and both values
- [x] 4.7 Build `components/Activity/MetricTiles.tsx` for flights, air time, distance and fuel — flights and air time from the activity index for every span; distance and fuel from `/stats/periods` on the current week, month and year and an em dash with a stated reason elsewhere, keeping the tile in place so the layout never shifts
- [x] 4.8 Render each delta variant from `lib/delta.ts` with direction carried by an icon or word as well as colour, and state why a percentage was withheld when it was
- [x] 4.9 Build `components/Activity/FirstVisits.tsx` listing the airports and aircraft types first flown inside the selected span, attributed to that span, with the two kinds visually distinguishable and each kind counted
- [x] 4.10 Collapse first visits to a preview that fades into the surface, revealing the rest only when the content actually overflows, and mark the collapsed region `inert` and `aria-hidden` so hidden chips are unreachable

## 5. Route and navigation

- [x] 5.1 Add `app/routes/pilot/stats/PilotStatsRoute.tsx` as a default export calling `usePageTitle`, rendering a `SectionHeader` and the panel, and handling the loading, error and no-flights states
- [x] 5.2 Register `route("stats", ...)` under `PilotLayout` in `app/routes.ts`
- [x] 5.3 Add a Statistics entry to `CabinCrewSidebarItems` and to the pilot sections in `MeRoute`
- [x] 5.4 Replace the `PilotStatsBox` placeholder on the pilot dashboard with a link into `/stats`

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 6.2 Verify against the live API as a pilot with closed flights: stepping, the present and logbook bounds, custom ranges, and that each bucketing threshold picks the right granularity
- [x] 6.3 Verify a day absent from the activity response reads as zero rather than breaking a bucket
- [x] 6.4 Verify the sparse-baseline, `noBaseline` and unchanged delta paths, and that the elapsed bar is absent on a completed span
- [x] 6.5 Check contrast and focus order in light and dark against WCAG 2.1 AA, including the chart marks and the collapsed first-visits region
- [x] 6.6 Run `npm run build` and confirm Recharts has not regressed the bundle beyond what one chart justifies

## 7. Flying-activity heatmap

- [x] 7.1 Add `lib/heatmap.ts` building a calendar year of week-columns with a block-time level per day, month-label positions, and the list of years the pilot has flown
- [x] 7.2 Build `components/Heatmap/ActivityHeatmap.tsx`: the day grid, weekday and month labels, legend, and a hover readout that names the day rather than a per-cell tooltip
- [x] 7.3 Use a single-hue sequential ramp whose lightness is monotonic in both themes, verified against the rendered values rather than assumed
- [x] 7.4 Build `components/Heatmap/HeatmapPanel.tsx` with the monthly breakdown collapsed behind a disclosure
- [x] 7.5 Add a year switcher covering every logged year; the current year stops at today and leaves later days blank
- [x] 7.6 Mount below the activity panel on the stats route

# Tasks

## 1. Time resolution

- [x] 1.1 Add a `resolveBlockEvents` helper to `app/features/flight/lib/` returning the four block
  events, each with its resolved time, its provenance (`actual` / `estimated` / `scheduled`) and its
  signed delta against the scheduled time. Each event resolves independently, so a flight with two
  actual times returns two `actual` events and two `estimated` ones.
- [x] 1.2 Return no deltas when `estimated` is absent, rather than zeroes, so a `created` or `ready`
  flight renders scheduled times alone.
- [x] 1.3 Compute each event's axis position as a fraction of the off-block-to-on-block interval, so
  taxi and airborne time read as distance. Guard the degenerate case where the interval is zero.

## 2. The axis

- [x] 2.1 Extend `FlightProgressBar` into the time axis: accept the resolved events, pin each at its
  fraction, and label it with a monospaced tabular time. Keep the present-position mark as the only
  accent-coloured element.
- [x] 2.2 Render labels only from `lg` up; below that the component keeps today's two-endpoint rail
  with no pinned labels.
- [x] 2.3 Stagger labels above and below the axis so four of them never overlap at 1024px, where the
  card is narrowest above the breakpoint.
- [x] 2.4 State each event's provenance without relying on colour alone.

## 3. Desktop bands

- [x] 3.1 Add the figures row from `lg` up — passengers, cargo, crew, block fuel — sourced from the
  final loadsheet where present and the preliminary one otherwise, carrying the preliminary/final
  marker. Absent entirely when neither loadsheet exists.
- [x] 3.2 Add the alternates line from `lg` up using `airportsOfTypes` for destination and enroute
  alternates, plus `aircraft.etopsThresholdMinutes` where set. Absent when the flight carries neither.
- [x] 3.3 Confirm nothing added above appears below `lg`.

## 4. Verification

- [x] 4.1 Check the card at 375px against the current screenshots: identical content, no new height.
- [x] 4.2 Check at 1024px and 1440px: axis labels legible and non-overlapping, no horizontal overflow.
- [ ] 4.3 Walk the states — `ready` (no estimates), boarding, airborne with partial `actual`, early
  arrival, no loadsheet, no alternate — and confirm each renders as its scenario describes.
- [x] 4.4 Check both themes at both widths.
- [x] 4.5 `npm run lint`, `npm run typecheck`, `npm run build`.

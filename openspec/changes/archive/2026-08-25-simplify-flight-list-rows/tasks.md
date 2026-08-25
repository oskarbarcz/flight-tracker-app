## 1. Shared primitives

- [x] 1.1 Add `formatClockDuration(minutes)` to `app/shared/lib/time.ts` producing unpadded hours, colon, zero-padded minutes (`1:47`, `9:00`)
- [x] 1.2 Change `SectionHeader` from `text-gray-600` to `text-gray-800`

## 2. Row component

- [x] 2.1 Create `FlightListRow` in `app/features/flight/components/List/` — a `<Link>` whose grid template comes from the trailing column descriptor, taking `flight`, `to` and `trailingColumn`
- [x] 2.2 Give the row a visually hidden accessible label naming callsign, route and trailing value, and a trailing chevron
- [x] 2.3 Create `FlightListDateCell` — ICAO date over UTC off-block time, reading the actual timesheet when complete and the scheduled one otherwise
- [x] 2.4 Create `FlightListFlightCell` — callsign over aircraft registration
- [x] 2.5 Create `FlightListRouteCell` — `IATA → IATA` over `city → city`, city line `hidden sm:block` and truncating
- [x] 2.6 Create `FlightBlockTimeCell` — block time over `air <time>` from the actual timesheet, placeholder when it is incomplete
- [x] 2.7 Create `FlightStatusCell` — `FlightStatusBadge` plus a themed `<Badge color="failure">` when `hasActiveEmergency`
- [x] 2.9 Flag merged emergency-phase flights in `useFlightList` — the list endpoint omits `hasActiveEmergency`, so the badge never rendered
- [x] 2.8 Create `FlightListHeader` rendering the same grid template with the column labels

## 3. List container

- [x] 3.1 Create `FlightList` — `<ul>`/`<li>` wrapper, header, rounded hairline container, loading overlay and pagination, matching the current container chrome
- [x] 3.3 Put the row divider on the `<li>` — on the `<a>`, `last:border-b-0` matched every row and cancelled all dividers
- [x] 3.5 Drop the `TransparentContainer` wrapper — it draws the same `rounded-2xl border` shell, so nesting it around `FlightList` rendered a doubled border
- [x] 3.4 Match the header band and label tokens to `CardHeader` (`text-gray-500 dark:text-gray-400`) (`dark:bg-gray-800`, `dark:border-gray-700`)
- [x] 3.2 Accept a per-flight `to` resolver and a per-flight `trailing` renderer so Operations and pilot lists differ only by those two props

## 4. Wire up the routes

- [x] 4.1 Point `FlightListView` at `FlightList`, passing `/flights/{id}/overview` and the status cell
- [x] 4.2 Switch `/finished-flights` to the block-time cell via a `FlightListView` prop
- [x] 4.3 Replace `FlightHistoryListTable` usage in `FlightHistoryListRoute` with `FlightList`, passing `/flight-history/{id}` and the block-time cell, keeping its own fetching and paging
- [x] 4.4 Delete `FlightListTable`, `FlightListElement`, `FlightHistoryListTable`, `FlightHistoryListElement`

## 4b. Extensions

- [x] 4.5 Route second line shows the airport **name**, not the city
- [x] 4.6 Row navigation becomes an overlay `<Link>` so IATA codes and the registration keep their own links without nesting anchors
- [x] 4.7 Add `FlightListLinks` presets so airport and aircraft targets differ by role (Operations vs pilot)
- [x] 4.8 Add the operator tail fin (`OperatorFin`) to the Flight column, `sm` and up
- [x] 4.11 Preprocess the 149 fin thumbnails into `app/assets/operator/transparent/` — edge flood-fill removes the white background, trimmed to the fin, quantized PNG (4.1 MB JPG → 616 KB PNG)
- [x] 4.12 Point `OperatorFin` at the transparent set and drop `mix-blend-multiply` from its callers
- [x] 4.13 Render the fin borderless in the list and link it to the operator (`/operators/{id}/fleet`); no operator target on the pilot list
- [x] 4.14 Add `bin/make_transparent_fins.py` so the generated assets are reproducible
- [x] 4.9 Date primary line matches the other primary lines (`text-sm sm:text-base`)
- [x] 4.10 Rebuild the aircraft page's Flight history card on the same row, with reposition entries as `Reposition`-badged rows

## 5. Verify

- [x] 5.1 `npm run lint` and `npm run typecheck` pass
- [x] 5.2 At 390 px, each of the four lists shows all four columns with no horizontal scrolling
- [x] 5.3 A non-current-year row (`01JAN 2025`) does not wrap the date column at either breakpoint
- [x] 5.4 Row click, cmd-click and "copy link address" all work, and no nested links remain in a row
- [x] 5.5 `/current-flights` shows status on every row
- [x] 5.6 `/finished-flights` durations match the actual timesheet, not the scheduled one
- [x] 5.7 Each row carries a single accessible name covering callsign, route and trailing value (verified in the DOM; not yet read with VoiceOver)
- [x] 5.8 Emergency merge verified against live data: `hasActiveEmergency` is absent from the list payload, and replaying the merge over the real `emergency` + `ongoing` responses flags exactly DLH880 and AAL4918 out of 22 rows
- [x] 5.10 Card parity confirmed by computed style in both themes: same 1px border colour, 16px radius, surface and header band as `Container` + `CardHeader`
- [x] 5.12 Hit-test at 1440: empty row area → flight overview, `BOS` → airport, `N718AN` → aircraft, fin → operator fleet; zero nested anchors, overlay keeps its accessible name
- [x] 5.13 Aircraft history card at 390 and 1440: no horizontal scroll, no overflowing rows, no wrapped status badge
- [x] 5.9 Headless pass at 390 px and 1440 px: emergency badge renders on DLH880 and AAL4918; `/flight-history` as cabin crew shows 3 rows linking to `/flight-history/{id}`; no horizontal scroll and no nested anchors on any list

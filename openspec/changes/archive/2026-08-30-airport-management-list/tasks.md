# Tasks

## 1. Extract the shared record list

- [x] 1.1 Create `app/shared/ui/List/recordListLayout.ts` holding `RecordListLayout` — the grid template, the ordered header labels, and the responsive classes for the trailing cell, the chevron and the trailing header — lifted from `FlightListTrailingColumn` without the `Flight` type.
- [x] 1.2 Create `app/shared/ui/List/RecordList.tsx` — bordered container, overlaid loading state, `<ul>` of children, footer pagination shown only when `totalPages > 1`. Takes `layout`, `loading`, `page`, `totalPages`, `onPageChange` and children.
- [x] 1.3 Create `app/shared/ui/List/RecordListHeader.tsx` rendering the layout's labels against the layout's grid, `aria-hidden` as the flight header is.
- [x] 1.4 Create `app/shared/ui/List/RecordListRow.tsx` — the row grid, the absolute overlay link built from `href` and `label`, the chevron, and the trailing slot. Cells arrive as children and are not typed against any domain model.
- [x] 1.5 Port `app/features/flight/components/List/` onto the shared list: `FlightList` becomes a thin wrapper, `FlightListColumns` supplies `RecordListLayout` values for the status and block-time variants, and the four cells are unchanged.
- [x] 1.6 Verify every flight list against `openspec/specs/flight-list-row/spec.md` — upcoming, current, finished and pilot history; both trailing variants; the three in-row link exceptions and their role-dependent targets; 390 px without horizontal scrolling; row naming and list semantics. Nothing in this change proceeds until this passes.

## 2. Model and service groundwork

- [x] 2.1 Add `Continent.Antarctica` to `app/features/airport/model.tsx`, include it in `allContinents()`, and add its case to `translateContinent` in `app/features/airport/i18n.ts`.
- [x] 2.2 Give the airport slice its own continent options derived from `allContinents()` and `translateContinent`, and point `AirportFormFields` at them instead of importing `continentOptions` from `~/features/operator`. Leave the operator slice's own list alone.
- [x] 2.3 Add `dataQuality` to `AirportListFilters` in `app/features/airport/service.ts`, matching the API's `AirportListFilters`.
- [x] 2.4 Add `lib/filterAirports.ts` to the airport slice — pure filtering by quality, continent, country and free text, with the free text delegating to the existing `searchAirports`, and an `isFiltering` helper. Searching SHALL bypass the quality filter.
- [x] 2.5 Add a pure helper that summarises the database into per-quality counts and per-continent counts for the chips and the continent pills.

## 3. The airport row

- [x] 3.1 Add `app/features/airport/components/List/airportListLayout.ts` declaring the `RecordListLayout` for the airports list — three content columns, the trailing cell moving onto its own line below `sm`, and the outline frame visible at every width.
- [x] 3.2 Build `Cell/AirportIdentityCell.tsx` — `OptionAvatarFrame` holding `AirportShape`, IATA on the primary line, ICAO on the secondary, composed as `AirportSearchBox` already composes them.
- [x] 3.3 Give the frame its empty state: a dashed border and a muted glyph when `shape === null`, distinct from a frame holding an outline, and legible in both themes at WCAG 2.1 AA.
- [x] 3.4 Build `Cell/AirportLocationCell.tsx` — airport name on the primary line; `CountryFlag`, city, country and the airport's current local time via `FormattedTimezoneTime` on the secondary line.
- [x] 3.5 Build `Cell/AirportQualityCell.tsx` — `DataQualityBadge`, a muted `No outline` line when the airport has no shape, and the enrichment button lifted above the row's overlay link.
- [x] 3.6 Build `AirportListRow.tsx` over `RecordListRow`, with the row's href pointing at the airport's management page and an accessible name covering codes, name and data quality.

## 4. The list page

- [x] 4.1 Rewrite `routes/operations/airports/AirportsListRoute.tsx` to fetch every airport once on mount into state, with no continent in the request.
- [x] 4.2 Hold search, quality, continent and country in the URL via `useSearchParams` with `replace: true`, defaulting quality to low when the address carries no quality at all, and treating an explicitly emptied quality as "every airport".
- [x] 4.3 Build the quality chip strip above the list — one chip per quality carrying its own count and toggling it, modelled on `PostcardAttentionStrip`, each exposing whether it is active.
- [x] 4.4 Build the toolbar — a `FilterInput` searching name, IATA, ICAO and city, plus a country select and a Clear affordance, modelled on `PostcardToolbar`.
- [x] 4.5 Make the search override explicit: while the search holds text the quality filter is not applied, the page says so, and emptying the box restores the previous quality filter.
- [x] 4.6 Build the continent pill row over the per-continent counts, modelled on `ContinentSelector`, including Antarctica when the database holds an airport there.
- [x] 4.7 Sort the filtered airports by country name then IATA code, slice them at 25 rows a page, and feed `RecordList` the page, total pages and page setter.
- [x] 4.8 Add the counts line stating how many airports match and how many the database holds.
- [x] 4.9 Build the two empty states — no match with an offer to show every airport, and a cleared backlog stating that every airport is enriched.

## 5. Enrichment from the list

- [x] 5.1 Add an optional `onApplied` callback to `EnrichAirportDataModal`, called after a successful push, keeping the existing `useRevalidator` call so the airport management page is unaffected.
- [x] 5.2 Open the modal from the list route on `?enrich=<airportId>`, so the open modal survives a reload and the browser's back control closes it.
- [x] 5.3 Refresh the listed airports through `onApplied` without navigating, and confirm the administrator's scroll position and page survive it.
- [x] 5.4 Confirm abandoning the modal changes nothing in the list.

## 6. Retirement and verification

- [x] 6.1 Delete `AirportListTable`, `ContinentFilterTabs` and `AirportListEmptyState` once nothing references them, and trim `airportListContext` to what the create route still needs.
- [x] 6.2 Confirm `/airports?continent=europe` still lands on Europe, now alongside the quality default.
- [ ] 6.3 Walk the capability spec end to end against a build — triage default, search override, address round-trip, row anatomy, missing outline, enrichment in place, pagination, empty states, Antarctica, 390 px, screen-reader naming.
- [x] 6.4 Run `npm run lint`, `npm run typecheck` and `npm run build`.
- [x] 6.5 Bump the version in `package.json`, as `bin/check_version_is_free` requires before merge.

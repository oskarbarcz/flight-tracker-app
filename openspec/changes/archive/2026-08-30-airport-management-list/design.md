# Design

## Context

See `proposal.md` — Why. What shapes this design is what the airport list endpoint does and does
not offer.

`GET /api/v1/airport` accepts `continent` and `dataQuality`, and returns every matching airport in
one array. There is no paging, no sorting, no search, no total count and no per-airport counts of
runways, terminals, gates or parking stands. Each airport carries `id`, `icaoCode`, `iataCode`,
`name`, `city`, `country`, `timezone`, `continent`, `dataQuality`, `location` and `shape`.

Three facts drive the decisions below:

1. **`shape` is the only completeness fact in the payload**, and `ImportAirportByIcaoCommand` sets
   it to `null` for every SkyLink import. It is therefore both the cheapest and the most accurate
   signal the list can carry.
2. **`dataQuality` is raised by enrichment, and only by enrichment.** A push that writes at least
   one change grades the airport `flagship`; a push that writes nothing leaves the grade alone, and
   `high` is only ever set by hand. Enriching an airport therefore takes it out of the backlog on
   its own.
3. **The list is fetched whole or not at all.** Any filtering the page offers beyond `continent`
   and `dataQuality` happens in the browser regardless, so the only question is whether the request
   is narrowed at all.

The flight lists already solved the presentation problem this change needs. `FlightList` is a
bordered container holding a header that shares its rows' grid template, a `<ul>` of rows each
navigating via an absolute overlay link with nested links lifted above it, an overlaid loading
state that does not move the layout, and footer pagination. `FlightListTrailingColumn` carries a
column's header, renderer, accessible label, grid template and responsive `order`/`col-span`
classes together, which is why the same list serves the status and block-time variants.

## Goals / Non-Goals

**Goals**

- One page that serves both reaching a known airport and working the unenriched backlog down.
- Presentation shared with the flight lists rather than a second, drifting implementation.
- Bounded rendering, so the page's cost does not track the size of the database.
- Never claim completeness the payload cannot support.

**Non-Goals**

- The pilot airport library at `/airports-library`. Untouched.
- Per-airport enrichment mechanics. `EnrichAirportDataModal` and the OSM pull/push flow are reused
  as they are; only where the modal opens from changes.
- Server-side paging, sorting or search. All three are API work and none is required at the
  database's current size.
- Changing how `dataQuality` is graded. The API already grades `flagship` on a successful
  enrichment push; this change reads the grade and never writes it.

## Decisions

### The shared list takes children, not a generic record type

`app/shared/ui/List/` exposes `RecordList`, `RecordListHeader` and `RecordListRow` plus a
`RecordListLayout` type. The layout holds the grid template, the header labels in order and the
responsive classes for the trailing cell and chevron — everything the header and the rows must
agree on. `RecordListRow` takes an `href`, an accessible `label` and its cells as children; it owns
the overlay link, the z-layering and the chevron. Feature cells stay in their own slice.

Composition over a generic `<T>` with render props: the shared layer never learns what a `Flight`
or an `Airport` is, the cells stay where their domain knowledge lives, and nested links keep
working because the row only needs to know that its children may contain links, not which ones.

*Alternative considered:* `RecordList<T>` with `renderRow`, `rowHref` and `rowLabel` callbacks.
Fewer files, but it pushes every feature's cells through a prop signature that grows each time a
list wants something the last one did not, and it makes the shared component the place changes
accumulate.

### The airports list fetches once, unfiltered, and filters in the browser

`AirportsListRoute` requests every airport once on mount and holds them in state. Quality,
continent, country and search are applied client-side.

Sending `dataQuality=low` would be a smaller response, but it makes every filter change a network
round trip, and the quality counts shown on the chips need the whole database anyway — a chip that
cannot state how many high-quality airports exist is not a chip, it is a link. One fetch answers
every control on the page.

Filter state lives in the URL via `useSearchParams` with `replace: true`, as `/postcards` does.

*Alternative considered:* a `clientLoader` reading the search params. Rejected — React Router
re-runs a route's loader on every navigation, and `setSearchParams` is a navigation, so each
keystroke in the search box would refetch the database. Working around it with
`shouldRevalidate` is subtler than the state it replaces.

### Rendering is paginated at 25 rows; the fetch is not paginated at all

`RecordList` already takes `page`, `totalPages` and `onPageChange` as props and does not care where
they come from, so a slice of the filtered array feeds it unchanged. Rows are sorted by country
name, then IATA code, so flags cluster without needing country group headers.

This bounds the DOM but not the response. The response is bounded only by the size of the database,
and that is acceptable while an airport is a few hundred bytes of JSON. The threshold at which this
stops being true — and API paging becomes necessary — is recorded under Risks.

### The row states the missing outline, and nothing else about completeness

The Airport column leads with `OptionAvatarFrame` holding `AirportShape`, exactly as
`AirportSearchBox` already composes them. `AirportShape` returns `null` for a null shape, so the
frame renders empty; the design gives that empty frame a dashed border and a muted glyph so it
reads as *absent* rather than *broken*. The trailing column pairs the `DataQualityBadge` with a
muted `No outline` line when `shape === null`, mirroring how `FlightStatusCell` stacks an emergency
badge under a status badge.

Runway, terminal, gate and parking counts would be the better signal and the list payload does not
carry them. Fetching them per row is one request per airport, which is not a trade worth making for
a list. The row says what it knows.

### Airports need one trailing column, and that is fine

The trailing-column contract exists because the flight lists need two variants. The airports list
declares one — data quality with its enrichment action. Local time, which the retired table showed
in its own column, moves onto the Location column's secondary line after the city and country, so
the information survives the column count dropping from five to three. It is formatted once per
render and does not tick, as it does not tick today.

### Enrichment opens from the row over the list, keyed by the URL

The trailing cell's action sets `?enrich=<airportId>`, and the route renders
`EnrichAirportDataModal` for that airport when the parameter is present. This follows the
`?enrich=airport` convention the airport management page already uses, makes the open modal
survive a reload, and lets the browser's back control close it.

The button sits inside the row's grid but above the overlay link — the same `z-10` lift the flight
row gives its operator, aircraft and airport links. It is a button, not a link, so it never nests
inside the row's anchor.

`EnrichAirportDataModal` currently refreshes via `useRevalidator`, which does nothing for a route
without a loader. It gains an optional `onApplied` callback that the list route uses to refresh its
state; the airport management page keeps working unchanged.

### Antarctica joins the airport continent enum, not the operator's option list

`Continent` gains `Antarctica`, `allContinents()` includes it and `translateContinent` gains its
case — TypeScript's exhaustive switch makes the last one impossible to forget.

`continentOptions` lives in `app/features/operator/form.ts` and is hand-written; the airport form
imports it across slices, which is why an airport form and an airline form currently offer the same
six choices. This change gives the airport slice its own options derived from `allContinents()` and
`translateContinent`, so an airport can be placed in Antarctica by hand and an airline still cannot.
The operator list's own continent filter gains an Antarctica entry that will match nothing, which
is the same empty-option behaviour `/postcards` already renders for an empty continent.

## Risks / Trade-offs

**Porting the flight lists onto the shared component regresses them.** Four lists depend on it —
upcoming, current, finished and pilot history — across two roles and two sets of link targets.
→ `openspec/specs/flight-list-row/spec.md` is the acceptance checklist, and it is detailed enough
to be one: four columns, both trailing variants, the three in-row link exceptions, the role-
dependent targets, the 390 px behaviour and the accessible naming. Port first, verify against that
spec, then build the airport list on a component already proven unchanged.

**One unfiltered fetch grows with the database.** At a few thousand airports the response is
comfortably under a megabyte and parsing is not noticeable. There is no cliff, only a slope.
→ Rendering is already bounded, so the failure mode is a slow first paint rather than a slow page.
Revisit when the response passes roughly 5,000 airports; the fix is `page`/`limit` on
`GET /api/v1/airport` and it is API work, at which point the client-side filters become server-side
ones and the chips need a counts endpoint.

**An airport can be graded `high` by hand while still incomplete**, which removes it from the
backlog without anything having been enriched. Nothing stops that, and the grade is what the chips
filter on.
→ The outline frame is derived from the data, not the grade, so a wrongly-graded airport still
reads as incomplete wherever it is listed. The automatic path is sound: enrichment grades
`flagship` itself, so an administrator working the backlog through this page never has to remember
a follow-up step.

**Search that ignores the quality filter can surprise.** An administrator who has deliberately
narrowed to low quality and then searches gets results from outside that narrowing.
→ The page says so while a search is active, and emptying the box restores the previous filter.
The alternative — searching inside the filter — reproduces the exact "I know this airport exists
and cannot find it" problem this change exists to remove.

**Retiring the continent tabs changes a URL that people may have bookmarked.**
`/airports?continent=europe` currently means "the Europe tab".
→ The parameter keeps the same name and the same meaning, so an existing link still lands on
Europe; it now arrives alongside a quality filter that did not exist before. No redirect is needed.

## Open Questions

- **Page size.** 25 rows is a starting point chosen to fill a desktop viewport without scrolling
  past the pagination control. It can be tuned after the list exists without touching the specs.
- **Whether the empty-frame treatment reads correctly in dark mode.** The dashed border and muted
  glyph need checking against both themes at the WCAG 2.1 AA bar; the answer changes the styling,
  not the design.

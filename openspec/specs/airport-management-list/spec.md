# Airport management list

## Purpose

Give Operations one page that answers both questions the airport database raises: "where is the
airport I want" and "which airports arrived without proper data". Airports are created
automatically by SimBrief imports and land unenriched, so the page opens on that backlog, states
what each airport is missing, and lets an administrator enrich it without leaving the list.

## Requirements

### Requirement: The list covers the whole database

The airports list SHALL be drawn from every airport, not from one continent at a time. Continent
SHALL be a filter applied to that set rather than a condition of retrieving it, so a filter on data
quality returns matching airports worldwide.

#### Scenario: Low-quality airports are found across continents

- **WHEN** an administrator opens the airports list and the low-quality filter is active
- **THEN** the list reports low-quality airports on every continent, not only the one currently selected

#### Scenario: Continent narrows an existing result

- **WHEN** an administrator selects a continent
- **THEN** the list narrows to airports on that continent while every other filter stays applied

### Requirement: The list opens on the airports that need work

The page SHALL present one control per data quality — low, high and flagship — each stating how
many airports hold that quality and each toggling that quality in and out of the filter. On first
load, low SHALL be the only active one, so the page opens on the enrichment backlog rather than on
the whole database.

Every control SHALL behave alike, none SHALL be inert, and the counts SHALL describe the whole
database rather than the current page of results.

#### Scenario: Backlog is the default view

- **WHEN** an administrator opens the airports list without any filter in the address
- **THEN** only low-quality airports are listed, and the low control is shown as active

#### Scenario: Counts are always visible

- **WHEN** the airports list renders
- **THEN** each quality control states its own count, including qualities that are not currently active

#### Scenario: An administrator reveals the whole database

- **WHEN** an administrator deactivates every quality control
- **THEN** airports of every quality are listed

### Requirement: Searching reaches every airport

The page SHALL offer a free-text search matching an airport's name, IATA code, ICAO code or city.
While the search holds text, the data-quality filter SHALL NOT be applied and the page SHALL say
that it is searching every airport. Emptying the search SHALL restore the previous quality filter.

This overrides the default deliberately: an administrator looking for a known airport must never be
told it does not exist because it is already enriched.

#### Scenario: A high-quality airport is reachable from the default view

- **WHEN** an administrator opens the list with the low-quality default active and searches for an airport whose quality is high
- **THEN** that airport is listed

#### Scenario: The override is stated

- **WHEN** a search is active
- **THEN** the page states that the quality filter is not being applied

#### Scenario: Clearing the search restores triage

- **WHEN** an administrator empties the search box
- **THEN** the quality filter that was active before the search applies again

### Requirement: Filter state lives in the address

Search text, data-quality selection, continent and country SHALL be held in the page address, so a
filtered list can be linked to, revisited and reached again with the browser's back control.

#### Scenario: A filtered list is shareable

- **WHEN** an administrator copies the address of a filtered list and opens it again
- **THEN** the same filters are applied and the same airports are listed

#### Scenario: Back returns to the previous filter

- **WHEN** an administrator changes a filter and then uses the browser's back control
- **THEN** the previous filter is applied

### Requirement: Airport row

Each airport SHALL be presented as a single row of three content columns, in order: Airport,
Location, and a trailing column. Each column SHALL carry at most two lines — a primary line stating
the value and a secondary line qualifying it.

The Airport column SHALL lead with a frame holding the airport's outline, and show the IATA code on
its primary line and the ICAO code on its secondary line. The Location column SHALL show the
airport's name followed by its data-quality mark on its primary line, and its country flag, city,
country and current local time on its secondary line. The trailing column SHALL carry the
enrichment action.

The data-quality mark SHALL be the same symbol the quality filter controls use for that quality, so
one visual vocabulary covers filtering and reading. It SHALL name the grade on hover, and SHALL
expose it to assistive technology rather than relying on colour or shape alone.

#### Scenario: Row states identity and location

- **WHEN** the list renders Kraków–Balice
- **THEN** the Airport column shows `KRK` over `EPKK`, and the Location column shows `Kraków–Balice` over the Polish flag, `Kraków, Poland` and the current time in the airport's timezone

#### Scenario: Quality is marked on every row

- **WHEN** the list renders any airport
- **THEN** its name is followed by the mark for that airport's data quality, matching the symbol the quality filter control for that grade uses

#### Scenario: The mark names its grade

- **WHEN** a user hovers an airport's data-quality mark
- **THEN** the grade is named

#### Scenario: The grade is not conveyed by appearance alone

- **WHEN** a screen reader reaches an airport's data-quality mark
- **THEN** it announces the grade

### Requirement: A missing outline is visible

An airport whose outline has never been supplied SHALL render its frame as visibly empty and
distinct from an airport that has one. An airport that has an outline SHALL render it. The empty
frame SHALL announce itself to assistive technology, since its emptiness is otherwise a purely
visual signal.

The outline is the only completeness fact the airport list carries, and it is precisely the field a
SimBrief import leaves unset, so it is the signal that separates an unenriched airport from an
enriched one at a glance.

#### Scenario: An imported airport reads as unenriched

- **WHEN** the list renders an airport that has no outline
- **THEN** its frame is empty and distinct from a frame holding an outline

#### Scenario: The empty frame is announced

- **WHEN** a screen reader reaches an airport that has no outline
- **THEN** it announces that the outline is missing

#### Scenario: An enriched airport shows its outline

- **WHEN** the list renders an airport that has an outline
- **THEN** the frame draws that outline

#### Scenario: No other completeness is claimed

- **WHEN** the list renders any airport
- **THEN** it makes no statement about that airport's runways, terminals, gates or parking stands, which the list data does not carry

### Requirement: Enriching from the list

The trailing column SHALL carry an action that opens the OpenStreetMap enrichment for that airport
over the list. Applying an enrichment SHALL update the listed airport without navigating away and
without losing the administrator's place in the list, so a backlog can be worked down one row after
another.

#### Scenario: Enrichment opens in place

- **WHEN** an administrator activates the enrichment action on a row
- **THEN** the enrichment opens over the list and the address of the list is preserved

#### Scenario: The list reflects an applied enrichment

- **WHEN** an administrator applies an enrichment and closes it
- **THEN** the row reflects the airport's new state and the list is still scrolled where it was

#### Scenario: Abandoning enrichment changes nothing

- **WHEN** an administrator opens the enrichment and closes it without applying anything
- **THEN** the list is unchanged

### Requirement: Row navigation with in-row exceptions

The whole row SHALL act as a navigation target opening that airport's management page, and SHALL do
so as a real link, so opening in a new tab, copying the address and modified clicks all behave
normally. The enrichment action SHALL override the row target when activated, and SHALL NOT be
nested inside the row's link.

#### Scenario: Clicking the row opens the airport

- **WHEN** an administrator clicks any part of a row other than the enrichment action
- **THEN** the app navigates to that airport's management page

#### Scenario: Enrichment does not navigate

- **WHEN** an administrator activates the enrichment action
- **THEN** the enrichment opens and the app does not navigate to the airport

#### Scenario: The row supports standard link behaviour

- **WHEN** an administrator opens a row in a new tab or copies its address
- **THEN** the browser behaves as it does for any link

#### Scenario: Controls are never nested inside the row link

- **WHEN** a row renders
- **THEN** neither the enrichment action nor any other control is a descendant of the row's link

### Requirement: The rendered list is bounded

However many airports match the filters, the page SHALL render a bounded number of rows at a time
and offer pagination to reach the rest. The page SHALL state how many airports match and how many
exist in total, so the size of the backlog is legible without counting rows.

#### Scenario: A large result is paginated

- **WHEN** more airports match than one page holds
- **THEN** the list renders one page of rows and offers pagination to the rest

#### Scenario: Pagination is absent when unnecessary

- **WHEN** every matching airport fits on one page
- **THEN** no pagination is offered

#### Scenario: Totals are stated

- **WHEN** the list renders with any filter applied
- **THEN** the page states how many airports match and how many the database holds

### Requirement: Loading replaces nothing

While airports are being fetched the page SHALL keep its filters and its layout in place and
indicate loading over them, rather than replacing the list with a loading state that moves the
controls.

#### Scenario: Filters stay usable during a load

- **WHEN** the list is loading
- **THEN** the filter controls remain in place and do not move

### Requirement: Empty results are explained

When no airport matches, the page SHALL say why and offer a way out. When no airport matches
because the enrichment backlog is empty, it SHALL say so plainly rather than reporting an absence
of results.

#### Scenario: A filter matches nothing

- **WHEN** a combination of filters matches no airport
- **THEN** the page says nothing matches and offers to show every airport

#### Scenario: The backlog is clear

- **WHEN** the low-quality filter is the only one active and no airport is low quality
- **THEN** the page states that every airport is enriched, rather than that no results were found

### Requirement: Every airport is reachable

The list SHALL be able to present an airport on any continent the API can assign, including
Antarctica. No airport SHALL be unreachable because the interface does not recognise its continent.

#### Scenario: An Antarctic airport is listed

- **WHEN** the database holds an airport whose continent is Antarctica
- **THEN** that airport appears in the unfiltered list and Antarctica is offered as a continent filter

### Requirement: Responsive behaviour without horizontal scrolling

The list SHALL keep every column reachable from a 390 px viewport upwards without horizontal
scrolling. Below the `sm` breakpoint the trailing column MAY move onto its own line within the row;
the outline frame SHALL remain visible at every width, because it carries meaning rather than
decoration.

#### Scenario: All columns reachable on a phone

- **WHEN** the airports list is viewed at a 390 px viewport width
- **THEN** every column is reachable without horizontal scrolling

#### Scenario: The outline survives on narrow viewports

- **WHEN** the airports list is viewed below the `sm` breakpoint
- **THEN** each row still shows its outline frame

#### Scenario: Columns align down the list

- **WHEN** the list renders several airports at any viewport width
- **THEN** each column starts at the same horizontal position on every row

### Requirement: Accessible naming

The rows SHALL be exposed as items of a list, and each row SHALL carry an accessible name
identifying the airport as a single unit — its codes, its name and its data quality — rather than
leaving assistive technology to read unlabelled fragments. Each quality control SHALL expose
whether it is currently active.

#### Scenario: Row announced as one airport

- **WHEN** a screen reader reaches an airport row
- **THEN** it announces the airport as a single named item covering its codes, name and data quality

#### Scenario: List exposed as a list

- **WHEN** a screen reader reaches the airports list
- **THEN** the rows are exposed as items of a list

#### Scenario: Filter state is announced

- **WHEN** a screen reader reaches a data-quality control
- **THEN** it announces whether that quality is currently being filtered on

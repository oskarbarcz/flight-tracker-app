## Purpose

Gives a pilot a readable account of what they have actually flown, by letting them pick a span of time and compare it honestly against the span before it.

## ADDED Requirements

### Requirement: Pilots reach a statistics page

The app SHALL provide an authenticated statistics page for pilots, reachable from the pilot navigation. The page SHALL NOT be reachable by other roles.

#### Scenario: Pilot opens the page

- **WHEN** a signed-in pilot follows the statistics entry in the navigation
- **THEN** the statistics page opens and shows their own figures

#### Scenario: A non-pilot attempts to open the page

- **WHEN** a user whose role is not pilot requests the statistics path
- **THEN** the app refuses the route the same way it refuses other role-gated routes

#### Scenario: Pilot has never closed a flight

- **WHEN** a pilot with no closed flights opens the page
- **THEN** the page explains that statistics appear once a flight is closed
- **AND** it does NOT render zeroed figures, an empty chart, or a broken comparison

### Requirement: Pilot chooses the span being examined

The page SHALL offer week, month and year as spans, and SHALL present exactly one of them at a time. It SHALL additionally offer a custom span with a start and an end date. The custom span's date fields SHALL be visible only while the custom span is selected.

#### Scenario: Switching span

- **WHEN** the pilot selects a different span
- **THEN** only that span's figures are shown, replacing the previous span's

#### Scenario: Heading does not restate the selection

- **WHEN** any span is selected
- **THEN** the section keeps a stable heading naming the section itself
- **AND** the comparison being made is named separately from that heading

#### Scenario: Custom span selected

- **WHEN** the pilot selects the custom span
- **THEN** a start date and an end date field become available
- **AND** the span-stepping control is withdrawn, because a custom span has no next or previous

#### Scenario: Custom span given an end before its start

- **WHEN** the pilot sets an end date earlier than the start date
- **THEN** the page keeps the last valid span and does not report a negative or empty result

### Requirement: Pilot navigates between spans

For the week, month and year spans, the page SHALL let the pilot move to the preceding or following span of the same kind. Movement SHALL be bounded by the pilot's first logged flight at the earlier end and by the span containing today at the later end. When the pilot is not on the span containing today, the page SHALL offer a direct way back to it.

#### Scenario: Stepping back

- **WHEN** the pilot steps to an earlier span
- **THEN** every figure, the chart and the first visits all describe that earlier span

#### Scenario: Reaching the present

- **WHEN** the displayed span contains today
- **THEN** stepping further forward is unavailable

#### Scenario: Reaching the start of the logbook

- **WHEN** the displayed span is the earliest one containing a logged flight
- **THEN** stepping further back is unavailable

#### Scenario: Returning to the present

- **WHEN** the pilot is viewing a span that does not contain today
- **THEN** a control returns them to the span containing today
- **AND** that control is absent while they are already on it

### Requirement: Block time is charted against the preceding span

The page SHALL chart block time across the selected span, showing the selected span and the span immediately before it on a single shared scale, with the selected span visually dominant. Buckets SHALL be days for a week or a month, months for a year, and SHALL be chosen from the span's length for a custom span.

#### Scenario: Reading a bucket

- **WHEN** the pilot inspects one bucket
- **THEN** its block time for both the selected and the preceding span is available, each identified by the date it covers

#### Scenario: Buckets that have not happened

- **WHEN** the selected span extends past today
- **THEN** buckets after today are marked as not yet happened
- **AND** they are NOT presented as days with no flying

#### Scenario: A span with no flying at all

- **WHEN** neither the selected span nor its predecessor contains any flying
- **THEN** the chart still renders its scale and buckets without collapsing or dividing by zero

### Requirement: Totals for the span are reported with their change

The page SHALL report flights, air time, distance and fuel for the selected span, each accompanied by the same figure for the preceding span and the change between them. Every figure SHALL carry its unit.

#### Scenario: Reporting a change

- **WHEN** both the selected span and its predecessor carry enough activity to compare
- **THEN** each total shows the direction and size of its change as a percentage
- **AND** the direction is conveyed by more than colour alone

### Requirement: Weak and absent comparisons are reported honestly

The page SHALL NOT present a percentage change that a sparse baseline cannot support. When the preceding span's figure is below a threshold for that measure, the change SHALL be reported as an absolute difference instead. When the preceding span falls entirely before the pilot's first logged flight, the page SHALL report that there is no earlier data rather than any change.

#### Scenario: Baseline too sparse for a percentage

- **WHEN** the preceding span's figure is below the threshold for that measure
- **THEN** the change is stated as an absolute difference in that measure's own unit
- **AND** the page says why a percentage was withheld

#### Scenario: No preceding data exists

- **WHEN** the preceding span ends before the pilot's first logged flight
- **THEN** the page reports that there is no earlier data
- **AND** it shows no percentage and no absolute change for any measure

#### Scenario: Nothing changed

- **WHEN** a figure is identical across both spans
- **THEN** the page reports it as unchanged rather than as a zero-percent move

### Requirement: Elapsed progress is shown only while a span is running

When the selected span contains today it SHALL report how much of itself has elapsed, so a partial span is not mistaken for a complete one. A span that has already ended SHALL NOT report elapsed progress.

#### Scenario: Span still running

- **WHEN** the selected span contains today
- **THEN** the page reports how much of the span has elapsed

#### Scenario: Span already complete

- **WHEN** the selected span ended before today
- **THEN** no elapsed progress is shown, because the span is whole

### Requirement: First visits are scoped to the selected span

The page SHALL list the airports and aircraft types flown for the first time within the selected span, and SHALL state which span the list belongs to. Aircraft types SHALL be reported for every span. Where a kind of first visit cannot be obtained for the selected span, the page SHALL say so for that kind specifically, rather than withholding the whole section or implying nothing was visited. Airports and aircraft types SHALL be presented as separate groups, each reported as cards rather than bare codes, and every first-visited airport SHALL report the date of its first visit. The section SHALL always be collapsed to a blurred preview carrying a reveal control, whether or not it holds first visits, so that the section keeps one shape across every span. The revealed or collapsed state SHALL belong to the section rather than to the selected span, and SHALL survive a change of span.

#### Scenario: Span contains first visits

- **WHEN** the selected span contains airports or aircraft types flown for the first time
- **THEN** they are listed and attributed to that span
- **AND** the count of each kind is reported
- **AND** each airport reports the date it was first visited

#### Scenario: Span contains no first visits

- **WHEN** nothing was visited or flown for the first time in the selected span
- **THEN** the page says so plainly for that span

#### Scenario: More first visits than the preview holds

- **WHEN** the list is taller than its collapsed preview
- **THEN** the preview indicates that content continues
- **AND** a control reveals the remainder and can collapse it again

#### Scenario: One kind of first visit cannot be obtained

- **WHEN** a kind of first visit is unavailable for the selected span
- **THEN** the section still reports the kinds it can obtain
- **AND** it names the unavailable kind and why, rather than implying nothing was visited

#### Scenario: The reveal is offered whether or not the span holds first visits

- **WHEN** the selected span holds no first visits at all
- **THEN** the reveal control is still offered over the blurred preview
- **AND** revealing it shows the statement that nothing was flown for the first time

#### Scenario: The revealed state survives a change of span

- **WHEN** the section is revealed and the pilot selects a different span
- **THEN** the section stays revealed and reports the new span

#### Scenario: Collapsed content is not reachable

- **WHEN** the list is collapsed
- **THEN** the hidden entries are exposed to neither keyboard navigation nor assistive technology

### Requirement: Flying days are shown as a calendar year of daily squares

The page SHALL show one square per day for a whole calendar year, shaded in a single hue by that day's block time so denser flying reads darker. The shading SHALL move in one direction only, so more flying never reads lighter than less. A day with no flying SHALL be distinguishable from a day that has not happened. Inspecting a day SHALL report its date, flights and block time. The pilot SHALL be able to switch between every year in which they have flown.

#### Scenario: Reading a day

- **WHEN** the pilot inspects one square
- **THEN** its date, number of flights and block time are reported
- **AND** a day with no flying says so rather than showing nothing

#### Scenario: Days that have not happened

- **WHEN** the current year is shown
- **THEN** days up to and including today are shaded
- **AND** days later in the year are blank rather than shaded as days without flying

#### Scenario: Switching year

- **WHEN** the pilot selects a different year
- **THEN** that whole calendar year is shown, with its own totals and monthly breakdown
- **AND** only years in which the pilot has flown are offered

#### Scenario: Monthly totals behind the squares

- **WHEN** the pilot opens the monthly breakdown
- **THEN** each month in view reports its flights, block time, air time and number of days flown
- **AND** the breakdown is collapsed by default

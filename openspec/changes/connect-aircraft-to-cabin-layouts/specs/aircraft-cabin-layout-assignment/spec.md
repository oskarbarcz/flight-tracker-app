## Purpose

Lets operations record which AeroLOPA cabin a given aircraft actually flies, and makes the consequence of leaving that unrecorded visible rather than silent.

## ADDED Requirements

### Requirement: An aircraft reports whether it has a cabin layout

The aircraft details page SHALL report the cabin layout assigned to the aircraft, or state that none is assigned. Where a layout is assigned, the page SHALL name the layout, the airline and aircraft type it was drawn for, and the variant where the layout has one.

#### Scenario: An aircraft with an assigned layout

- **WHEN** operations opens an aircraft carrying an assigned cabin layout
- **THEN** the page names that layout, its airline and its aircraft type

#### Scenario: An aircraft with no assigned layout

- **WHEN** operations opens an aircraft with no cabin layout
- **THEN** the page states that none is assigned
- **AND** it states that flights on this aircraft are released without a passenger manifest

#### Scenario: A layout whose seat map has never been read

- **GIVEN** an aircraft assigned a layout reporting no revision
- **WHEN** operations opens the aircraft
- **THEN** the page distinguishes that state from an assigned layout that reports a revision
- **AND** it does NOT present the absent revision as an error

### Requirement: Operations assigns a layout from ranked suggestions

The app SHALL offer operations the ranked candidates the API suggests for an aircraft, grouped by how each was matched — on both the airline and the aircraft type, on the airline alone, or on the aircraft type alone — with the strongest group first. Choosing a candidate SHALL assign it to the aircraft.

#### Scenario: An exact candidate is offered first

- **GIVEN** an aircraft for which a layout matching both its operator and its aircraft type is catalogued
- **WHEN** operations opens the assignment control
- **THEN** that candidate appears above candidates matched on the airline or the type alone
- **AND** the basis of each match is named

#### Scenario: A candidate is assigned

- **WHEN** operations chooses a candidate
- **THEN** the aircraft is assigned that layout
- **AND** the page reports the new assignment without a reload

#### Scenario: No candidate matches

- **GIVEN** an aircraft whose operator and type match no catalogued layout
- **WHEN** operations opens the assignment control
- **THEN** the app states that nothing matches
- **AND** the full catalogue remains reachable

#### Scenario: The airframe has no IATA type code

- **GIVEN** an aircraft whose airframe reports no IATA aircraft type code
- **WHEN** operations opens the assignment control
- **THEN** the app explains that no layout can be matched on aircraft type
- **AND** it does NOT present the reduced list as the whole catalogue

### Requirement: Operations assigns a layout the suggestions do not name

The app SHALL let operations assign any catalogued layout, including one absent from the suggestions. Because the catalogue supports no free-text search, the app SHALL offer selection by airline IATA code and by aircraft IATA type code over the paged catalogue, and SHALL prefill those fields from the aircraft's own operator and type.

#### Scenario: Browsing beyond the suggestions

- **WHEN** operations chooses to look past the suggested candidates
- **THEN** the catalogue is offered filtered by airline code and aircraft type code
- **AND** the fields are prefilled from the aircraft

#### Scenario: A layout outside the suggestions is assigned

- **WHEN** operations assigns a layout that the suggestions did not name
- **THEN** the assignment succeeds

#### Scenario: The catalogue is paged

- **GIVEN** a filter matching more layouts than one page holds
- **WHEN** operations browses the catalogue
- **THEN** the remaining layouts are reachable
- **AND** the number of matching layouts is reported

### Requirement: A mismatched assignment is flagged and never refused

Where the API reports an assignment as mismatched, the app SHALL show it as a caution naming the disagreement, and SHALL NOT refuse the assignment, remove the candidate from the picker, or present the aircraft as misconfigured.

#### Scenario: A mismatched layout is shown

- **GIVEN** an aircraft assigned a layout whose airline or aircraft type differs from its own
- **WHEN** operations opens the aircraft
- **THEN** the page flags the assignment as mismatched
- **AND** it names which of the airline or the aircraft type disagrees

#### Scenario: A mismatched candidate stays selectable

- **WHEN** operations opens the assignment control
- **THEN** candidates that would be mismatched remain selectable

#### Scenario: A matching layout carries no caution

- **GIVEN** an aircraft assigned a layout matching both its airline and its aircraft type
- **WHEN** operations opens the aircraft
- **THEN** no mismatch caution is shown

### Requirement: A retired layout is marked wherever it appears

Where a layout has been withdrawn by the provider, the app SHALL mark it as retired on the aircraft and in the picker, and SHALL keep it readable and assignable, because an existing assignment survives retirement.

#### Scenario: An aircraft holds a retired layout

- **GIVEN** an aircraft assigned a layout the provider no longer publishes
- **WHEN** operations opens the aircraft
- **THEN** the layout is shown marked as retired
- **AND** the assignment is not presented as broken

#### Scenario: A retired candidate is marked

- **WHEN** the picker offers a retired layout
- **THEN** it is marked as retired

### Requirement: Operations removes an assignment

The app SHALL let operations remove the cabin layout assigned to an aircraft, and SHALL state before the removal takes effect that flights on the aircraft will afterwards be released without a manifest.

#### Scenario: An assignment is removed

- **GIVEN** an aircraft with an assigned layout
- **WHEN** operations removes the assignment and confirms
- **THEN** the aircraft reports no cabin layout

#### Scenario: Removal names its consequence

- **WHEN** operations begins removing an assignment
- **THEN** the app states that flights on the aircraft will be released without a passenger manifest

### Requirement: Operations replaces an assignment

The app SHALL let operations assign a different layout to an aircraft that already has one, without requiring the existing assignment to be removed first.

#### Scenario: A layout is replaced

- **GIVEN** an aircraft with an assigned layout
- **WHEN** operations assigns a different layout
- **THEN** the aircraft reports only the newly assigned layout

### Requirement: The fleet list reports cabin coverage

The fleet list SHALL report, for every aircraft, whether it carries a cabin layout and whether that layout is mismatched, so that gaps across a fleet are visible without opening each aircraft. The report SHALL NOT rely on colour alone.

#### Scenario: Coverage across a fleet

- **WHEN** operations opens an operator's fleet
- **THEN** each aircraft reports whether it carries a cabin layout

#### Scenario: A mismatch is visible from the fleet

- **GIVEN** a fleet in which some aircraft carry mismatched layouts
- **WHEN** operations opens that fleet
- **THEN** those aircraft are distinguishable from aircraft whose layouts match

### Requirement: Assignment failures are reported

The app SHALL report a failed assignment or removal to the reader and SHALL leave the displayed state matching the server's, rather than showing an assignment that did not take effect.

#### Scenario: The server refuses an assignment

- **WHEN** an assignment fails
- **THEN** the app reports the failure
- **AND** the aircraft continues to report the layout it actually holds

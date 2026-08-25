# Aircraft hold variant assignment

## Purpose

Lets operations record which cargo hold configuration a particular aircraft carries, and lets every role that may see the aircraft read the hold it will be loaded against.

## Requirements

### Requirement: An aircraft reports the hold it is loaded against

The app SHALL report, on the aircraft, the hold variant its load is planned against. Where a variant has been assigned to the aircraft, that variant SHALL be reported. Where none has been assigned and the aircraft's type is curated, the type's default variant SHALL be reported together with the fact that it is the default rather than an assignment. Where the aircraft's type carries no curated hold, the app SHALL state that.

#### Scenario: An aircraft with an assigned variant

- **GIVEN** an aircraft carrying a hold variant assignment
- **WHEN** its hold is read
- **THEN** the assigned variant is reported
- **AND** its hold is drawn

#### Scenario: An aircraft falling back to the default

- **GIVEN** an aircraft of a curated type carrying no assignment
- **WHEN** its hold is read
- **THEN** the type's default variant is reported
- **AND** the reader is told this is the default rather than an assignment

#### Scenario: An aircraft of an uncurated type

- **GIVEN** an aircraft whose type carries no curated hold
- **WHEN** its hold is read
- **THEN** the app states that no hold configuration is curated for the type
- **AND** offers no assignment

### Requirement: Operations can assign a hold variant to an aircraft

Operations SHALL be able to assign a hold variant to an aircraft, choosing only from the variants the catalogue reports for that aircraft's type. On success the aircraft SHALL report the newly assigned variant without the reader having to reload the page, and the outcome SHALL be confirmed.

#### Scenario: Assigning a variant

- **GIVEN** an aircraft of a curated type
- **WHEN** operations assigns one of the type's variants to it
- **THEN** the aircraft reports that variant
- **AND** the outcome is confirmed

#### Scenario: Only the type's variants are offered

- **WHEN** operations chooses a variant to assign
- **THEN** only variants the catalogue reports for that aircraft's type are offered

#### Scenario: The assignment is rejected

- **WHEN** an assignment is rejected by the API
- **THEN** the reason is reported
- **AND** the aircraft continues to report the variant it had

### Requirement: Operations can replace or remove an assignment

Operations SHALL be able to replace an aircraft's assigned variant with another, and to remove the assignment so that the aircraft falls back to its type's default. Removal SHALL be confirmed before it is carried out, and its effect SHALL be stated.

#### Scenario: Replacing an assignment

- **GIVEN** an aircraft carrying an assignment
- **WHEN** operations assigns a different variant
- **THEN** the aircraft reports the new variant

#### Scenario: Removing an assignment

- **GIVEN** an aircraft carrying an assignment
- **WHEN** operations removes it and confirms
- **THEN** the aircraft falls back to its type's default variant
- **AND** the reader is told that removal means falling back to the default

#### Scenario: Abandoning a removal

- **GIVEN** a removal awaiting confirmation
- **WHEN** operations abandons it
- **THEN** the assignment is unchanged

### Requirement: Roles that cannot assign read the hold without assignment controls

Where the aircraft is shown to a role that cannot change its hold, the app SHALL report the hold and draw it, and SHALL NOT present any control that assigns, replaces or removes a variant.

#### Scenario: Reading an aircraft's hold as a non-assigning role

- **WHEN** a role that cannot change the hold opens an aircraft
- **THEN** the hold variant is reported and drawn
- **AND** no assignment, replacement or removal control is present

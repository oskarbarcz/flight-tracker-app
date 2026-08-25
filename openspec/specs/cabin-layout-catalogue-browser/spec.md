# Cabin layout catalogue browser

## Purpose

Lets operations find a cabin layout, see what the provider knows about it, and keep the local catalogue in step with the provider.

## Requirements

### Requirement: Operations browses the catalogue

The app SHALL offer operations a list of catalogued cabin layouts, filtered by airline IATA code, by aircraft IATA type code and by whether a layout has been retired. Because the catalogue holds more layouts than one request returns, the list SHALL be paged and SHALL report how many layouts match the current filters.

#### Scenario: Listing layouts

- **WHEN** operations opens the catalogue
- **THEN** catalogued layouts are listed with their airline, aircraft type and variant

#### Scenario: Filtering by airline

- **WHEN** operations filters by an airline IATA code
- **THEN** only that airline's layouts are listed
- **AND** the number of matching layouts is reported

#### Scenario: Paging

- **GIVEN** filters matching more layouts than one page holds
- **WHEN** operations moves to the next page
- **THEN** the following layouts are listed

#### Scenario: A filter matching nothing

- **WHEN** operations applies filters matching no layout
- **THEN** the app states that nothing matches and offers to clear the filters

#### Scenario: Only operations reaches the catalogue

- **WHEN** a user who is not operations requests the catalogue
- **THEN** the app refuses the route as it refuses other role-gated routes

### Requirement: A layout reports what the provider knows

The app SHALL show, for a single layout, its identifier, airline, aircraft type and variant, the upstream identifiers it was assembled from, when it was first seen, whether it is retired, its current revision, the seats it holds broken down by cabin class, and the aircraft description, manufacturer, haul type and revision date the provider reports.

#### Scenario: Reading a layout

- **WHEN** operations opens a layout
- **THEN** its provider metadata and its seat counts by cabin class are reported
- **AND** its cabin is drawn

#### Scenario: A layout merged from two decks

- **GIVEN** a layout assembled from a main-deck and an upper-deck source
- **WHEN** operations opens it
- **THEN** both upstream identifiers are reported
- **AND** both decks are reachable

#### Scenario: A retired layout

- **WHEN** operations opens a layout the provider has withdrawn
- **THEN** it is marked as retired with the date it was retired
- **AND** it remains fully readable

#### Scenario: An unknown layout

- **WHEN** operations opens a layout identifier that is not catalogued
- **THEN** the app reports that the layout could not be found

### Requirement: Operations synchronises the catalogue

The app SHALL let operations synchronise the catalogue against the provider, and SHALL report afterwards how many layouts the provider reported, how many are catalogued, and how many were created, retired, restored and skipped.

#### Scenario: Running a synchronisation

- **WHEN** operations synchronises the catalogue
- **THEN** the app reports the counts the synchronisation returned

#### Scenario: A synchronisation that changed nothing

- **WHEN** a synchronisation creates, retires and restores nothing
- **THEN** the app says so plainly rather than reporting an empty result

#### Scenario: Entries the provider published unreadably

- **WHEN** a synchronisation reports skipped entries
- **THEN** the count of skipped entries is shown rather than omitted

#### Scenario: A synchronisation in progress

- **WHEN** a synchronisation is running
- **THEN** the app indicates it is running and prevents a second one being started

### Requirement: Operations refreshes a single layout

The app SHALL let operations re-read one layout's cabin from the provider, and SHALL report whether the cabin changed and which revision is in force afterwards.

#### Scenario: A refresh that finds a changed cabin

- **WHEN** operations refreshes a layout whose cabin has changed
- **THEN** the app reports that it changed and names the new revision
- **AND** the drawing shown is the new revision

#### Scenario: A refresh that finds no change

- **WHEN** operations refreshes a layout whose cabin is unchanged
- **THEN** the app reports that it is unchanged
- **AND** the revision in force is unchanged

#### Scenario: A refresh the provider cannot satisfy

- **WHEN** a refresh fails at the provider
- **THEN** the app reports the failure
- **AND** the layout continues to show the revision it held

### Requirement: A layout names the aircraft carrying it

The app SHALL let operations reach a layout from an aircraft assigned it, so that a cabin can be inspected from the aircraft that flies it.

#### Scenario: Opening a layout from an aircraft

- **GIVEN** an aircraft with an assigned cabin layout
- **WHEN** operations follows the layout from that aircraft
- **THEN** the layout opens with its cabin drawn

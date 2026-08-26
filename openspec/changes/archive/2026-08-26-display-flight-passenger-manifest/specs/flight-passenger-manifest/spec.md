## Purpose

Says who is aboard a flight, where they sit, and who did not turn up — as a list that always works and a cabin drawing that accompanies it when it can be trusted.

## ADDED Requirements

### Requirement: A seated flight reports its passengers

The app SHALL show the seated passenger manifest of a flight, listing every passenger with the seat they occupy, the deck that seat is on, its cabin class, the passenger's name, their booking reference and their status.

#### Scenario: Reading a manifest

- **WHEN** the reader opens the manifest of a flight whose passengers have been seated
- **THEN** every passenger is listed with seat, deck, cabin class, name, booking reference and status

#### Scenario: The list stands on its own

- **WHEN** the manifest is read without the cabin drawing available
- **THEN** the passenger list is complete and usable

#### Scenario: Passenger names are not anglicised

- **WHEN** passenger names contain characters outside the basic Latin alphabet
- **THEN** they are displayed and ordered correctly

### Requirement: The manifest reports which cabin it describes

The app SHALL report the cabin layout and the revision the flight was seated against, so that the reader knows the manifest describes the cabin as it was when the flight was seated.

#### Scenario: Naming the pinned revision

- **WHEN** the reader opens a manifest
- **THEN** the cabin layout and the revision it was seated against are reported

### Requirement: The occupied cabin is drawn when the geometry matches

The app SHALL draw the cabin with each seat shown as free, occupied, or held by a no-show, resolving occupancy by both the deck and the seat designator. Where the available cabin geometry is a different revision from the one the flight pinned, the app SHALL NOT draw the cabin and SHALL state why.

#### Scenario: Drawing an occupied cabin

- **GIVEN** a manifest whose pinned revision matches the available cabin geometry
- **WHEN** the reader opens it
- **THEN** each occupied seat is distinguishable from a free seat
- **AND** the number of occupied seats equals the number of passengers listed

#### Scenario: A seat is inspected

- **WHEN** the reader opens an occupied seat
- **THEN** the occupying passenger's name, booking reference and status are reported alongside the seat's own details

#### Scenario: The cabin has been redrawn since the flight was seated

- **GIVEN** a manifest pinned to a revision earlier than the available cabin geometry
- **WHEN** the reader opens it
- **THEN** the cabin is not drawn
- **AND** the app states that the cabin has been redrawn since the flight was seated
- **AND** the passenger list remains complete

#### Scenario: The cabin geometry cannot be loaded

- **WHEN** the cabin geometry fails to load
- **THEN** the passenger list is still shown

### Requirement: Passengers can be narrowed by status and by cabin

The app SHALL let the reader list only boarded passengers or only no-shows, and SHALL let the reader narrow the list to a cabin class. Any count the app reports SHALL name the basis it was counted on, because the counts the API returns describe only the passengers matching the active status.

#### Scenario: Listing only no-shows

- **WHEN** the reader filters to no-shows
- **THEN** only no-show passengers are listed

#### Scenario: Counts follow the filter

- **WHEN** a status filter is active
- **THEN** any reported count states that it counts only passengers of that status
- **AND** it is NOT presented as the flight's total

#### Scenario: Narrowing to a cabin

- **WHEN** the reader narrows to a cabin class
- **THEN** only passengers in that cabin are listed

#### Scenario: A filter matching nobody

- **WHEN** the active filters match no passenger
- **THEN** the app says so and offers to clear them

### Requirement: The manifest summarises the load

The app SHALL report how many passengers the manifest holds and how that divides across cabin classes.

#### Scenario: Reading the summary

- **WHEN** the reader opens a manifest
- **THEN** the passenger count and the count per cabin class are reported

### Requirement: No-shows keep their seat and their place in the list

The app SHALL show a no-show passenger as retained, holding the seat they were assigned, and SHALL NOT remove them from the manifest or present their seat as free.

#### Scenario: A no-show is listed

- **GIVEN** a flight whose boarding produced no-shows
- **WHEN** the reader opens the unfiltered manifest
- **THEN** the no-show passengers appear with the seat they were assigned
- **AND** their status distinguishes them from boarded passengers

#### Scenario: A no-show's seat is not free

- **WHEN** the cabin is drawn
- **THEN** a seat held by a no-show is distinguishable from both a free seat and an occupied one

### Requirement: A passenger's special service need is a fact of their record

Where a passenger travels with a special service request, the app SHALL report it in that passenger's own row and in the seat detail of the seat they occupy, naming what the code means rather than showing the code alone. The app SHALL NOT present special service requests as a headline, a hero figure, a summary statistic, a count in any heading, or a marker on the flight.

#### Scenario: A coded passenger is listed

- **GIVEN** a manifest containing passengers travelling with special service requests
- **WHEN** the reader opens it
- **THEN** each such passenger reports their requirement in their own row, in words rather than as a bare abbreviation

#### Scenario: Special service needs are not summarised

- **WHEN** the manifest is displayed
- **THEN** no heading, tile, badge or summary figure counts or highlights passengers by special service requirement

#### Scenario: Crew can find passengers needing assistance

- **WHEN** the reader narrows the list to passengers travelling with a special service request
- **THEN** only those passengers are listed

#### Scenario: A passenger with no special service need

- **WHEN** a passenger carries no special service request
- **THEN** their row reports nothing in place of one

### Requirement: An absent manifest says which kind of absence it is

The app SHALL distinguish a flight whose preliminary loadsheet has not been written, a flight whose aircraft carries no cabin layout, and a manifest the reader may not see, and SHALL respond to each differently.

#### Scenario: The preliminary loadsheet has not been written

- **GIVEN** a flight whose aircraft has a cabin layout and whose preliminary loadsheet has not been written
- **WHEN** the reader opens the manifest
- **THEN** the app states that the manifest is generated from the preliminary loadsheet

#### Scenario: The aircraft has no cabin layout

- **GIVEN** a flight whose aircraft carries no cabin layout
- **WHEN** the reader opens the manifest
- **THEN** the app states that the aircraft has no cabin layout and that this is why no manifest exists
- **AND** it offers a way to reach that aircraft

#### Scenario: The reader may not see this manifest

- **GIVEN** a released flight commanded by another pilot
- **WHEN** a pilot who does not command it opens the manifest
- **THEN** the app states that the manifest is available only to the flight's captain

#### Scenario: The absences are not conflated

- **WHEN** any of these states is reached
- **THEN** the app does NOT report an empty manifest
- **AND** it does NOT report a missing cabin layout for a flight that merely has no preliminary loadsheet yet

### Requirement: Operations reaches the manifest from the flight

The app SHALL offer operations the manifest of any flight from that flight's own navigation.

#### Scenario: Opening the manifest

- **WHEN** operations opens a flight
- **THEN** the manifest is reachable from the flight's navigation

### Requirement: A pilot reaches the manifest of the flight they command

The app SHALL offer a pilot the manifest of a flight they command, and SHALL NOT offer it for a flight they do not.

#### Scenario: A captain opens their manifest

- **GIVEN** a released flight the pilot commands
- **WHEN** the pilot opens it
- **THEN** the manifest is reachable and shows the same passengers operations sees

#### Scenario: A pilot who does not command the flight

- **GIVEN** a flight commanded by another pilot
- **WHEN** that pilot views the flight
- **THEN** no manifest entry point is offered

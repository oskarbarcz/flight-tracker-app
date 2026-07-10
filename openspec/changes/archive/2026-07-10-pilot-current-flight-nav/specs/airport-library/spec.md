## ADDED Requirements

### Requirement: Current flight section on the airport library

The airport library page at `/airports-library` SHALL present a "Current flight" section positioned first, above the "Custom pins" section, whenever the signed-in CabinCrew user has a current flight. The section SHALL render one standard airport tile for every airport in the current flight's plan — departure, destination, and every alternate — each opening that airport's preview at `/airports-library/{airportId}`. Tiles SHALL be ordered departure first, then alternates, then destination. When the user has no current flight, the section SHALL NOT be rendered and SHALL NOT show an empty state.

#### Scenario: Current flight section appears first with flight-plan airports

- **WHEN** a CabinCrew user with a current flight opens `/airports-library`
- **THEN** a "Current flight" section is shown above "Custom pins" containing one tile per flight-plan airport (departure, destination, alternates), each opening that airport's preview

#### Scenario: Section hidden when no current flight

- **WHEN** a CabinCrew user without a current flight opens `/airports-library`
- **THEN** no "Current flight" section is shown and the "Custom pins" section is shown as before

#### Scenario: Section is independent of pinned airports

- **WHEN** a CabinCrew user with a current flight has no pinned airports
- **THEN** the "Current flight" section still shows the flight-plan airport tiles and the "Custom pins" section shows its own empty state

### Requirement: Airport tile shows flight-relative type

The standard airport tile SHALL support an optional flight-relative type badge indicating the airport's role on a flight — departure, destination, or the specific alternate type (destination alternate, enroute alternate, ETOPS entry, ETOPS exit). Tiles rendered in the Current flight section SHALL show this badge with a human-readable label for each airport's type. Tiles rendered in the Custom pins section SHALL NOT show a type badge, since a pinned airport has no flight-relative role.

#### Scenario: Type badge in the Current flight section

- **WHEN** a CabinCrew user views the Current flight section
- **THEN** each tile shows a human-readable type badge for that airport's role on the flight (departure, destination, or the specific alternate type)

#### Scenario: No type badge on custom pins

- **WHEN** a CabinCrew user views the Custom pins section
- **THEN** the tiles show no flight-relative type badge

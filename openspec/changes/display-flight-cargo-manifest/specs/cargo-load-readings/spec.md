## Purpose

Draws a flight's load into the hold that was planned for it, so a reader can see where each unit sits, how full the hold is, and what is aboard that needs watching.

## ADDED Requirements

### Requirement: The load is drawn into the hold it was planned against

The app SHALL draw the load into the hold variant the manifest reports it was planned against, placing each unit at the position it occupies. Placement SHALL come from the hold geometry, unchanged by what fills it.

#### Scenario: A unit in its position

- **WHEN** a unit reporting a position is drawn
- **THEN** it appears at that position in the hold
- **AND** the position keeps the place the hold geometry gives it

#### Scenario: An empty position

- **WHEN** a position of the variant carries no unit
- **THEN** it is drawn as an empty position of the hold
- **AND** is distinguishable from a position carrying a unit

#### Scenario: Loose load

- **GIVEN** a unit that is loose rather than in a device
- **WHEN** the load is drawn
- **THEN** it is presented against its compartment rather than at a position

### Requirement: A load with no hold configuration is still shown

Where the manifest reports no hold variant, no unit reports a position, a compartment or a deck. The app SHALL present the units and their shipments as a list, SHALL state that the airframe type carries no curated hold data, and SHALL NOT draw an empty hold or report the load as unavailable.

#### Scenario: A positionless manifest

- **GIVEN** a manifest reporting no hold variant
- **WHEN** the load is shown
- **THEN** the units and their shipments are listed
- **AND** the app states that no hold configuration is curated for the airframe type

#### Scenario: No drawing is offered

- **WHEN** a positionless manifest is shown
- **THEN** no hold drawing and no reading switcher are presented

### Requirement: The hold can be read five ways

The app SHALL offer five readings of the loaded hold and SHALL make clear which is shown: by what the unit carries, by how much of a position's weight limit is used, by how much of a compartment's volume is used, by what hazard is aboard, and by cold chain. Changing the reading SHALL change appearance only, never placement.

#### Scenario: Switching reading

- **WHEN** the reader selects another reading
- **THEN** the appearance of the positions changes
- **AND** every position keeps the place it had

#### Scenario: Reading by content

- **WHEN** the hold is read by what the unit carries
- **THEN** cargo, baggage and mail are distinguished from one another

#### Scenario: Reading by weight

- **WHEN** the hold is read by weight
- **THEN** each occupied position reports its unit's weight against that position's limit
- **AND** a position carrying more than its limit is marked distinctly

#### Scenario: Reading by volume

- **WHEN** the hold is read by volume
- **THEN** the volume the contents occupy is presented against the compartment's usable volume

#### Scenario: Reading by hazard

- **WHEN** the hold is read by hazard
- **THEN** positions holding dangerous goods are distinguished from those that do not
- **AND** the hazard class is conveyed by text or marker as well as by any colour

#### Scenario: Reading by cold chain

- **WHEN** the hold is read by cold chain
- **THEN** positions holding temperature-controlled load are distinguished
- **AND** the risk level is conveyed by text or marker as well as by any colour

#### Scenario: A reading with nothing to show

- **GIVEN** a load carrying nothing a reading distinguishes
- **WHEN** that reading is selected
- **THEN** the app says the load carries none of what the reading shows
- **AND** the hold is still drawn

### Requirement: A unit reports what it is and what it carries

The app SHALL let a reader inspect a unit and read its device identifier and type, its position, compartment and deck, its tare weight, the weight and volume of its contents, what class of load it carries, and the shipments inside it. It SHALL mark, by marker and text, a unit carrying dangerous goods, a unit restricted to cargo aircraft, a refrigerated device, a unit holding premium cabin baggage, a unit that transfers intact, and a unit built for a point beyond this flight.

#### Scenario: Inspecting a unit

- **WHEN** the reader inspects a unit
- **THEN** its identifier, type, position, tare and contents are reported
- **AND** the shipments it holds are listed

#### Scenario: A refrigerated device

- **WHEN** a unit whose device type is refrigerated is drawn
- **THEN** it is marked as refrigerated

#### Scenario: A sealed transfer unit

- **WHEN** a unit that transfers intact to a point beyond this flight is drawn
- **THEN** it is marked as sealed
- **AND** the point it is built for is reported

#### Scenario: Markers carry text

- **WHEN** any unit marker is drawn
- **THEN** its meaning is available as text
- **AND** it is not conveyed by colour alone

#### Scenario: A unit holding baggage

- **WHEN** a unit whose contents are baggage is inspected
- **THEN** the number of bags it holds is reported
- **AND** no shipment list is presented for it

### Requirement: An offloaded unit is shown where it came from

Where a shipment was offloaded from a position, the app SHALL be able to show that position as vacated, distinct both from a position that was never filled and from one carrying load, and SHALL report the reason it was left behind.

#### Scenario: A vacated position

- **WHEN** the reader views what was offloaded
- **THEN** the position a shipment was pulled from is marked as vacated
- **AND** is distinguishable from a position that carried nothing

#### Scenario: The reason is carried

- **WHEN** a vacated position is inspected
- **THEN** the reason the shipment was left behind is reported

### Requirement: Compartment fill is drawn against its limits

The app SHALL draw, for each compartment, the weight it carries against its weight limit and the volume its contents occupy against its usable volume, and SHALL mark a compartment exceeding either.

#### Scenario: A compartment within its limits

- **WHEN** a compartment carrying load is drawn
- **THEN** its weight and volume are drawn against its limits

#### Scenario: A compartment over a limit

- **WHEN** a compartment carries more than its weight or volume limit
- **THEN** it is marked distinctly
- **AND** the breach is stated in text rather than shown only as a colour

### Requirement: The loaded hold has an accessible equivalent

The shipment ledger and the unit list SHALL together carry everything the loaded drawing conveys, ordered by deck, compartment and position, reachable and usable without a pointer.

#### Scenario: Reading the load without a pointer

- **WHEN** the reader moves through the load by keyboard
- **THEN** every unit and every shipment is reachable
- **AND** each reports what the drawing reports about it

#### Scenario: The list matches the drawing

- **GIVEN** a load drawn and listed
- **WHEN** the two are compared
- **THEN** they cover the same units
- **AND** neither carries information the other omits

# Cabin seat diagram

## Purpose

Draws a cabin as a schematic built from the provider's seat geometry, with every seat placed as something a reader can inspect, on any screen, with or without a pointer.

## Requirements

### Requirement: A deck is drawn from its own seat geometry

The app SHALL draw one deck at a time from the seats of that deck, placing each seat from its own coordinates and scaling the drawing uniformly. Seat coordinates SHALL NOT be interpreted against any other deck's geometry, and no asset of the provider's SHALL be requested to draw a cabin.

#### Scenario: Seats keep their positions

- **WHEN** a deck is drawn
- **THEN** each seat is placed from its own coordinates within that deck
- **AND** the seats keep their positions relative to one another as the container width changes

#### Scenario: A rotated seat

- **WHEN** a seat reports a rotation
- **THEN** the seat is drawn rotated by that amount about its own centre

#### Scenario: A rearward-facing seat

- **WHEN** a seat is reported as reversed
- **THEN** the drawing distinguishes it from a forward-facing seat

### Requirement: The drawing is schematic, and says so

The app SHALL spend the drawing's space on seats: it SHALL keep the true relative spacing of seats within a cabin, and MAY compress the structure holding no seats — the nose, the tail, and the space between cabins. Because the result is not to scale, the app SHALL NOT present it as a scale plan of the aircraft.

#### Scenario: A deck with empty nose and tail

- **GIVEN** a deck whose seats occupy only part of its length
- **WHEN** the deck is drawn
- **THEN** the space holding no seats is reduced rather than drawn at its full extent
- **AND** the seats of each cabin keep their spacing relative to one another

#### Scenario: Cabins are separated

- **WHEN** a deck holds more than one cabin
- **THEN** each cabin is visibly separated from the next
- **AND** each is named with the rows it covers

### Requirement: A seat stays large enough to use

The app SHALL draw seats at no smaller than a size a reader can distinguish and a pointer can hit, and SHALL let the drawing scroll horizontally rather than shrink below it.

#### Scenario: A narrow container

- **WHEN** the available width would draw seats below the usable minimum
- **THEN** the drawing is scrollable at the usable size instead of being shrunk to fit

#### Scenario: Two decks of different lengths

- **GIVEN** a layout whose decks hold very different numbers of seats
- **WHEN** both decks are drawn
- **THEN** they are drawn at the same scale as one another
- **AND** the shorter deck is not stretched to the width of the longer

### Requirement: A dual-deck layout is navigable deck by deck

Where a layout has more than one deck, the app SHALL let the reader move between decks and SHALL make clear which deck is shown. Each deck SHALL report how many seats it holds.

#### Scenario: Switching decks

- **GIVEN** a layout with a main and an upper deck
- **WHEN** the reader selects the upper deck
- **THEN** the upper deck's seats replace the main deck's

#### Scenario: A single-deck layout

- **WHEN** a layout has one deck
- **THEN** no deck switcher is offered

### Requirement: A seat's appearance encodes its condition

The app SHALL colour each seat from the active mode — cabin class or provider rating — and SHALL encode that meaning by something other than colour alone. A seat SHALL be distinguishable as blocked, as crew rest, or as not bookable where the provider reports it so.

#### Scenario: Seats coloured by cabin class

- **WHEN** the reader views a cabin by class
- **THEN** seats of each cabin class are distinguishable from one another
- **AND** a legend names each class shown

#### Scenario: An unrated seat is not treated as neutral

- **GIVEN** a layout in which most seats carry no provider rating
- **WHEN** the reader views the cabin by rating
- **THEN** unrated seats are drawn in a treatment distinct from every rating value
- **AND** they are NOT drawn as though rated in the middle of the range

#### Scenario: A blocked or crew-rest seat

- **WHEN** a seat is reported as blocked, as crew rest, or as not bookable
- **THEN** the drawing distinguishes it from an ordinary seat by a marker rather than by colour alone

#### Scenario: A legend naming only what is there

- **WHEN** a legend is shown for a deck
- **THEN** it names the states that deck actually holds
- **AND** omits those it does not

### Requirement: A seat can be inspected

The app SHALL let the reader open any seat and SHALL report its designator, its cabin class, its rating where the provider gives one, its window position where the provider gives one, and every comment the provider carries with that comment's sentiment and severity.

#### Scenario: Inspecting a seat

- **WHEN** the reader opens a seat
- **THEN** its designator and cabin class are reported
- **AND** its rating and window position are reported, or reported as unavailable

#### Scenario: A seat carrying comments

- **GIVEN** a seat the provider has commented on
- **WHEN** the reader opens that seat
- **THEN** every comment is shown
- **AND** each comment's severity and whether it is favourable or unfavourable is conveyed by more than colour

#### Scenario: Dismissing a seat

- **WHEN** the reader dismisses an opened seat
- **THEN** focus returns to that seat

### Requirement: The cabin is readable without the drawing

Wherever a cabin is presented for inspection, the app SHALL provide a seat table carrying the same per-seat information as the drawing, available to every reader rather than only to assistive technology, and SHALL label the drawing such that the table is identifiable as its equivalent. A surface that shows the drawing alone as a preview SHALL still make every seat reachable and self-describing, and SHALL offer a route to the full reading.

#### Scenario: Reading the cabin as a table

- **WHEN** the reader opens the seat table
- **THEN** every seat of the deck is listed with its designator, cabin class, rating, window position and comments

#### Scenario: Reaching every seat by keyboard

- **WHEN** the reader moves through the cabin using only a keyboard
- **THEN** every seat is reachable and can be opened
- **AND** the reading order follows the cabin rather than the order seats happen to appear in the data

#### Scenario: A preview showing only the drawing

- **GIVEN** a surface that shows a cabin as a preview beside other subject matter
- **WHEN** the reader opens it
- **THEN** every seat still reports its designator, cabin class, rating and window position on inspection
- **AND** the full reading of the cabin is reachable from that surface

### Requirement: The cabin describes itself

The app SHALL report the cabins the provider describes for the deck, naming each cabin, the rows it covers, and the pitch, width, recline and description the provider gives. Because a provider cabin description may disagree with the cabins the seats themselves report, the app SHALL derive every seat count from the seats and SHALL NOT present a provider description as a seating breakdown.

#### Scenario: Reading the cabin descriptions

- **WHEN** a deck is drawn
- **THEN** each cabin the provider describes is shown with its rows and dimensions

#### Scenario: A cabin the provider describes sparsely

- **WHEN** the provider omits a dimension for a cabin
- **THEN** that dimension is reported as unavailable rather than as a zero or an empty value

#### Scenario: Descriptions disagreeing with the seats

- **GIVEN** a deck whose provider descriptions report one cabin while its seats report two cabin classes
- **WHEN** the deck is drawn
- **THEN** the drawing and the seat counts follow the seats
- **AND** the provider's descriptions are presented as the provider's own account of the cabin

### Requirement: The cabin reports why it cannot be drawn

The app SHALL state that a cabin is being retrieved while a layout is read for the first time, and SHALL distinguish a layout that is not catalogued from a provider the app could not reach.

#### Scenario: A layout read for the first time

- **GIVEN** a layout whose seat data has never been fetched
- **WHEN** the reader opens it
- **THEN** the app states that the cabin is being retrieved from the provider

#### Scenario: The provider is unavailable

- **WHEN** the provider cannot be reached for a layout's cabin
- **THEN** the app reports that the provider is unavailable rather than that the layout does not exist

#### Scenario: The layout is not catalogued

- **WHEN** the cabin of an uncatalogued layout is requested
- **THEN** the app reports that the layout could not be found

### Requirement: The drawing stays legible in both themes

The app SHALL keep the drawing legible in both the light and the dark theme, and every seat treatment SHALL meet the contrast bar against the surface it is drawn on.

#### Scenario: Dark theme

- **WHEN** the reader views a cabin with the dark theme active
- **THEN** the drawing remains legible
- **AND** the seat treatments remain distinguishable from one another and from the cabin outline

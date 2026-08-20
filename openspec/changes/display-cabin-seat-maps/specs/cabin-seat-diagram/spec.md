## Purpose

Draws a cabin as the provider's own diagram with every seat placed over it as something a reader can inspect, on any screen, with or without a pointer.

## ADDED Requirements

### Requirement: A deck is drawn in its own coordinate space

The app SHALL draw one deck at a time, placing every seat according to the canvas of the deck it belongs to and scaling the drawing uniformly to the available width. Seat coordinates SHALL NOT be interpreted against any other deck's canvas.

#### Scenario: Seats sit over their drawing

- **WHEN** a deck is drawn
- **THEN** each seat is positioned at its own coordinates within that deck's canvas
- **AND** the seats remain aligned to the drawing as the container width changes

#### Scenario: A rotated seat

- **WHEN** a seat reports a rotation
- **THEN** the seat is drawn rotated by that amount about its own centre

#### Scenario: A rearward-facing seat

- **WHEN** a seat is reported as reversed
- **THEN** the drawing distinguishes it from a forward-facing seat

### Requirement: A dual-deck layout is navigable deck by deck

Where a layout has more than one deck, the app SHALL let the reader move between decks and SHALL make clear which deck is shown. Each deck SHALL report how many seats it holds.

#### Scenario: Switching decks

- **GIVEN** a layout with a main and an upper deck
- **WHEN** the reader selects the upper deck
- **THEN** the upper deck's drawing, canvas and seats replace the main deck's

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
- **THEN** the drawing distinguishes it from an ordinary seat

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

The app SHALL provide a seat table carrying the same per-seat information as the drawing, available to every reader rather than only to assistive technology. The drawing SHALL be labelled such that the table is identifiable as its equivalent.

#### Scenario: Reading the cabin as a table

- **WHEN** the reader opens the seat table
- **THEN** every seat of the deck is listed with its designator, cabin class, rating, window position and comments

#### Scenario: Reaching every seat by keyboard

- **WHEN** the reader moves through the cabin using only a keyboard
- **THEN** every seat is reachable and can be opened
- **AND** the reading order follows the cabin rather than the order seats happen to appear in the data

### Requirement: Empty structure is not drawn as cabin

The app SHALL default to a view cropped to the seats of the deck, and SHALL let the reader see the whole drawing including the parts holding no seats. The crop SHALL be evident rather than silent.

#### Scenario: Cropping to the seats

- **GIVEN** a deck whose drawing includes a nose and tail holding no seats
- **WHEN** the deck is drawn
- **THEN** the view is cropped to the seats with a margin
- **AND** the reader can restore the whole drawing

### Requirement: The cabin describes itself

The app SHALL report the cabins of the deck, naming each cabin, the rows it covers, its seat count, and the pitch, width, recline and description the provider gives.

#### Scenario: Reading the cabin descriptions

- **WHEN** a deck is drawn
- **THEN** each of its cabins is described with its rows, seat count and dimensions

#### Scenario: A cabin the provider describes sparsely

- **WHEN** the provider omits a dimension for a cabin
- **THEN** that dimension is reported as unavailable rather than as a zero or an empty value

### Requirement: The drawing degrades rather than collapses

The app SHALL reserve the drawing's space before its image loads so that nothing reflows, SHALL state that a cabin is being retrieved while a layout is read for the first time, and SHALL still place the seats when the provider's image cannot be loaded.

#### Scenario: A layout read for the first time

- **GIVEN** a layout whose seat data has never been fetched
- **WHEN** the reader opens it
- **THEN** the app states that the cabin is being retrieved from the provider

#### Scenario: The provider image fails

- **WHEN** the deck image cannot be loaded
- **THEN** the seats are still drawn in their positions
- **AND** the app reports that the cabin drawing is unavailable

#### Scenario: The image loads

- **WHEN** the deck image is loading
- **THEN** the space it will occupy is already reserved
- **AND** the surrounding page does not shift when it arrives

### Requirement: The drawing stays legible in both themes

The app SHALL present the provider's drawing on a surface it was drawn for, in both light and dark themes, and every seat treatment SHALL meet the contrast bar against that surface.

#### Scenario: Dark theme

- **WHEN** the reader views a cabin with the dark theme active
- **THEN** the drawing remains legible
- **AND** the seat treatments remain distinguishable from one another and from the drawing

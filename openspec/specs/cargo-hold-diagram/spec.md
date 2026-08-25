# Cargo hold diagram

## Purpose

Draws an aircraft's cargo hold as a plan view built from the curated hold geometry, so a reader can see where load goes, what each position takes, and what each compartment is able to carry.

## Requirements

### Requirement: A hold is drawn from its variant's own geometry

The app SHALL draw one variant at a time from that variant's own decks, compartments and positions. Compartments SHALL be drawn in the order the hold reports them, which runs from the nose, and positions SHALL be drawn in the order their compartment reports them, which also runs from nose to tail. The app SHALL NOT reorder either, and SHALL NOT interpret one variant's geometry against another's.

#### Scenario: Compartments read from the nose

- **WHEN** a variant is drawn
- **THEN** its compartments appear in the order the hold reports them
- **AND** the drawing reads nose to tail

#### Scenario: Positions keep their reported order

- **WHEN** a compartment holding positions is drawn
- **THEN** the positions appear in the order that compartment reports them
- **AND** no position is moved on account of its designator

#### Scenario: Switching variant redraws the hold

- **GIVEN** a type offering more than one variant
- **WHEN** the reader selects another variant
- **THEN** the drawing is rebuilt from that variant alone

### Requirement: A position occupies the width it accepts

A position that sits on one side of the hold SHALL be drawn occupying that side of the centreline, paired across it with the position of the same ordinal on the opposite side. A position that spans the fuselage SHALL be drawn occupying the full width. A position's footprint SHALL derive from the sides and bases it accepts rather than from any separately supplied dimension.

#### Scenario: A paired position

- **GIVEN** a compartment whose positions sit on the left and right of the centreline
- **WHEN** the compartment is drawn
- **THEN** each position is drawn on its own side
- **AND** the position of the same ordinal on the other side is drawn opposite it

#### Scenario: A full-width position

- **GIVEN** a compartment whose positions span the fuselage
- **WHEN** the compartment is drawn
- **THEN** each position is drawn across the full width of the hold

#### Scenario: A compartment does not mix the two

- **WHEN** a compartment is drawn
- **THEN** its positions are either all paired or all full-width
- **AND** the drawing does not have to reconcile both within one compartment

### Requirement: A compartment holding no positions is still a compartment

A loosely loaded compartment declares no positions. The app SHALL draw it as a compartment of the hold, at its place in the nose-to-tail order, reporting its limits and its capabilities, and SHALL NOT omit it, collapse it, or present it as an error or an absence.

#### Scenario: A bulk compartment alongside container compartments

- **GIVEN** a variant whose compartments include one that is loosely loaded
- **WHEN** the hold is drawn
- **THEN** the loosely loaded compartment appears in its place in the order
- **AND** it is distinguishable from a compartment holding positions

#### Scenario: A variant that is loose throughout

- **GIVEN** a variant declaring no positions in any compartment
- **WHEN** the hold is drawn
- **THEN** the drawing shows its compartments and their limits
- **AND** the reader is not told that anything is missing or unavailable

### Requirement: A multi-deck variant is navigable deck by deck

Where a variant has more than one deck, the app SHALL let the reader move between decks and SHALL make clear which deck is shown, presenting one deck at a time. Each deck SHALL report what it holds. Decks SHALL be drawn at the same scale as one another, so moving between them does not rescale the hold, and a shorter or lighter deck SHALL NOT be stretched to the extent of the other.

#### Scenario: Switching decks on a freighter

- **GIVEN** a variant with a main deck and a lower deck
- **WHEN** the reader selects the lower deck
- **THEN** the lower deck replaces the main deck in the drawing
- **AND** each deck reports how many positions or loose compartments it holds

#### Scenario: The scale does not move

- **GIVEN** a variant whose decks differ widely in what they carry
- **WHEN** the reader moves between them
- **THEN** both are drawn at the same scale as one another

#### Scenario: A single-deck variant

- **GIVEN** a variant with one deck
- **WHEN** the hold is drawn
- **THEN** no deck switching is presented

### Requirement: A deck is drawn to the width the aircraft actually has

The app SHALL derive an aircraft's drawn width from the across-extent of the widest unit load device base any of its positions accept, so an aircraft that takes pallets side by side is visibly wider than one that takes containers, and SHALL NOT draw every aircraft at one fixed width. Because the fuselage belongs to the airframe type rather than to a variant or a deck of it, the width SHALL be resolved once across every variant and every deck of the type, and SHALL NOT change when the reader switches variant or deck. Where no variant of the type declares positions anywhere, the app MAY estimate from the deck's volume.

#### Scenario: Switching deck does not resize the aircraft

- **GIVEN** a variant with a main deck and a lower deck
- **WHEN** the reader switches between them
- **THEN** the hold is drawn at the same width in both

#### Scenario: A narrowbody against a widebody

- **GIVEN** a narrowbody hold and a widebody hold
- **WHEN** each is drawn
- **THEN** the narrowbody is drawn narrower

#### Scenario: Switching variant does not resize the aircraft

- **GIVEN** a type offering one variant that declares positions and another that is loosely loaded throughout
- **WHEN** the reader switches between them
- **THEN** the hold is drawn at the same width in both

#### Scenario: A hold narrower than the space available

- **WHEN** the drawing is narrower than the container it sits in
- **THEN** it is centred rather than stretched to fill the width

### Requirement: A position stays large enough to use

The app SHALL draw positions at no smaller than a size a reader can distinguish and a pointer can hit, and SHALL let the drawing scroll horizontally rather than shrink below it.

#### Scenario: A narrow container

- **WHEN** the available width would draw positions below the usable minimum
- **THEN** the drawing scrolls at the usable size instead of shrinking to fit

#### Scenario: A hold with many positions

- **GIVEN** a variant whose deck holds a long run of positions
- **WHEN** the deck is drawn
- **THEN** the positions keep their spacing relative to one another
- **AND** the drawing scrolls rather than compressing them unequally

### Requirement: A position reports what it accepts

The app SHALL make a position's accepted unit load device bases, its accepted contours and its weight limit readable from the drawing, and SHALL name the device types that follow from that combination. Where positions further aft accept fewer contours than those forward of them, the drawing SHALL let that difference be read.

#### Scenario: Inspecting a position

- **WHEN** the reader inspects a position
- **THEN** its designator, its accepted bases, its accepted contours and its weight limit are reported
- **AND** the device types that fit it are named

#### Scenario: Positions that accept less

- **GIVEN** a compartment whose aft positions accept fewer contours than its forward positions
- **WHEN** the reader compares them
- **THEN** the difference in what they accept is apparent from the drawing

### Requirement: Compartment capability is reported by more than colour

The app SHALL report each compartment's weight limit, usable volume, whether it is heated, whether it is ventilated, and the side it is loaded from. Heating, ventilation and door side SHALL each carry a text or marker cue and SHALL NOT be encoded in colour alone.

#### Scenario: A heated and ventilated compartment

- **WHEN** a compartment that is heated and ventilated is drawn
- **THEN** both capabilities are reported in text or by marker
- **AND** neither is conveyed only by a difference in colour

#### Scenario: A compartment lacking a capability

- **WHEN** a compartment that is neither heated nor ventilated is drawn
- **THEN** the absence of each capability is stated rather than left to be inferred

#### Scenario: The loading door

- **WHEN** a compartment is drawn
- **THEN** the side it is loaded from is reported
- **AND** a compartment loaded through the nose is distinguished from one loaded from a side

### Requirement: Placement does not depend on appearance

The app SHALL determine where a position is drawn from the hold geometry alone. How a position is filled, marked or labelled SHALL be supplied to the drawing, so that a different reading of the same hold changes appearance without changing placement.

#### Scenario: The reference reading

- **WHEN** a hold is drawn with no load
- **THEN** each position is presented in terms of what it accepts
- **AND** every position of the variant is shown

#### Scenario: Another reading of the same hold

- **GIVEN** a hold drawn under one reading
- **WHEN** the same hold is drawn under a different reading
- **THEN** every position keeps the place it had
- **AND** only its appearance differs

### Requirement: Designators are normalised before they are used

Position designators SHALL be normalised on read so that a designator identifies the same position wherever it is reported. Normalisation SHALL compose a designator from its compartment number, its ordinal and its side, and SHALL leave a designator that already carries its compartment number unchanged.

#### Scenario: A designator reported without its compartment

- **GIVEN** a position whose reported designator omits its compartment number
- **WHEN** the designator is read
- **THEN** it is normalised to carry the compartment number

#### Scenario: A designator already carrying its compartment

- **GIVEN** a position whose reported designator already begins with its compartment number
- **WHEN** the designator is read
- **THEN** it is left unchanged

#### Scenario: Designators identify positions uniquely

- **WHEN** the designators of a variant are read
- **THEN** no two positions of that variant share a designator

### Requirement: The drawing has an accessible equivalent

The app SHALL present the same hold as an ordered table conveying, for every position, its designator, its deck, its compartment, its side, what it accepts and its weight limit, and conveying every compartment's limits and capabilities. The table SHALL be reachable and usable without a pointer, and SHALL carry everything the drawing conveys.

#### Scenario: Reading the hold without a pointer

- **WHEN** the reader moves through the hold by keyboard
- **THEN** every position and every compartment is reachable
- **AND** each reports what the drawing reports about it

#### Scenario: The table matches the drawing

- **GIVEN** a variant drawn and tabulated
- **WHEN** the two are compared
- **THEN** they cover the same positions and compartments
- **AND** neither carries information the other omits

### Requirement: An uncurated type is stated, not failed

Where the API curates no hold for an airframe type, the app SHALL say so plainly and SHALL NOT present it as an error, a loading state or an empty hold. The statement SHALL distinguish a type that is not curated from a request that failed.

#### Scenario: A type with no curated hold

- **WHEN** the reader opens a type the API curates no hold for
- **THEN** the app states that no hold configuration is curated for that type
- **AND** does not draw an empty hold

#### Scenario: A failed request

- **WHEN** the hold cannot be read because the request failed
- **THEN** the app distinguishes that from a type that is simply not curated

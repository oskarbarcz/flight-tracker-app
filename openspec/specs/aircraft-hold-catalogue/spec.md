# Aircraft hold catalogue

## Purpose

Lets operations find the airframe types the system curates a cargo hold for, compare what a type's variants differ in, and read what each compartment can carry and what each position accepts before a variant is assigned to a tail.

## Requirements

### Requirement: Operations can find the curated types

The app SHALL present the airframe types the API curates a hold for as a list reachable from the operations navigation. Each entry SHALL report the type, how many variants it offers, and enough of the hold's extent — its decks, its compartments and how many positions it holds — to tell one type from another without opening it.

#### Scenario: Browsing the catalogue

- **WHEN** operations opens the hold catalogue
- **THEN** every curated airframe type is listed
- **AND** each reports its variant count and the extent of its hold

#### Scenario: Opening a type

- **WHEN** operations selects a type from the list
- **THEN** that type's hold configuration is shown

#### Scenario: The catalogue cannot be read

- **WHEN** the catalogue request fails
- **THEN** the app says the catalogue could not be read
- **AND** does not present an empty catalogue as though no type were curated

### Requirement: A type's variants can be compared

Where a type offers more than one variant, the app SHALL let the reader move between them and SHALL make clear which is shown. It SHALL state which variant is the default and SHALL report what the variants differ in, given that variants of one type differ in the positions available rather than in the compartments themselves.

#### Scenario: Switching between variants

- **GIVEN** a type offering more than one variant
- **WHEN** the reader selects another variant
- **THEN** that variant's hold is shown
- **AND** the reader can tell which variant is displayed

#### Scenario: The default variant is identified

- **WHEN** a type's variants are shown
- **THEN** exactly one of them is identified as the default
- **AND** the reader is told the default is what an aircraft of the type uses when none is assigned to it

#### Scenario: A type offering one variant

- **GIVEN** a type offering a single variant
- **WHEN** the type is opened
- **THEN** its hold is shown without a variant choice being presented

### Requirement: A compartment reports what it can carry

For every compartment of the shown variant the app SHALL report its number, where it sits in the aircraft, whether it is loaded with devices or loosely, its weight limit, its usable volume, whether it is heated, whether it is ventilated, and the side it is loaded from.

#### Scenario: Reading a compartment

- **WHEN** the reader inspects a compartment
- **THEN** its position in the aircraft, its loading, its weight limit and its usable volume are reported
- **AND** its heating, its ventilation and its loading door are reported

#### Scenario: A compartment limit is not the sum of its positions

- **WHEN** a compartment holding positions is read
- **THEN** the compartment's own weight limit is reported alongside the limits of its positions
- **AND** the compartment limit is not presented as derived from them

### Requirement: A position reports the devices it accepts

For every position of the shown variant the app SHALL report its designator, its compartment, its side, the device bases and contours it accepts and its weight limit, and SHALL name which unit load device types that combination admits.

#### Scenario: Reading a position

- **WHEN** the reader inspects a position
- **THEN** its designator, compartment, side, accepted bases, accepted contours and weight limit are reported

#### Scenario: Naming the devices that fit

- **WHEN** a position's accepted bases and contours are known
- **THEN** the device types admitted by that combination are named
- **AND** a device type that the position does not admit is not named

#### Scenario: A loosely loaded compartment admits no positions

- **GIVEN** a compartment that is loaded loosely
- **WHEN** the reader inspects it
- **THEN** no positions are reported for it
- **AND** this is presented as how the compartment is loaded, not as missing data

### Requirement: Curated figures are attributed

Hold volumes and device counts follow published airframe figures where those exist, while per-compartment weights are derived because manufacturers do not publish them. The app SHALL NOT present derived figures as published ones.

#### Scenario: Reading compartment weights

- **WHEN** a compartment's weight limit is shown
- **THEN** the app does not present it as a published manufacturer figure

### Requirement: A type carrying no curated hold is reported plainly

Where the reader reaches a type the API curates no hold for, the app SHALL state that no hold configuration is curated for it, distinctly from a request that failed.

#### Scenario: An uncurated type

- **WHEN** the reader opens a type the API curates no hold for
- **THEN** the app states that no hold configuration is curated for that type

#### Scenario: A failed read

- **WHEN** the type's hold cannot be read because the request failed
- **THEN** the app distinguishes that from the type not being curated

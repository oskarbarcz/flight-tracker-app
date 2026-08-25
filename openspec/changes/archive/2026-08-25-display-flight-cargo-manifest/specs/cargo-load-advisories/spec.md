## Purpose

Turns the load into the three readings an operator actually acts on — whether anything aboard is incompatible with where it sits, whether temperature-controlled load will hold, and the order the hold comes off — each derived openly from what the manifest reports and none of them gating anything.

## ADDED Requirements

### Requirement: Advisories assert only what the manifest supports

The app SHALL derive load advisories only from fields the API supplies, and SHALL NOT encode a regulatory rule the API does not provide. Each advisory SHALL name the figures it was derived from. No advisory SHALL block, gate or prevent any action.

#### Scenario: An advisory names its basis

- **WHEN** an advisory is presented
- **THEN** the figures it was derived from are named
- **AND** the reader can see the values that produced it

#### Scenario: Advisories gate nothing

- **WHEN** any advisory is raised
- **THEN** no action available to the reader is prevented or disabled by it

#### Scenario: A clean load

- **WHEN** no advisory applies to a load
- **THEN** the app states that the checks it performs found nothing
- **AND** names the checks it performed, so silence is not mistaken for absence of checking

### Requirement: The load is checked against the compartments it sits in

The app SHALL raise an advisory when a compartment carries dry ice and is not ventilated, when a shipment of live animals sits in a compartment that is not both heated and ventilated, when a shipment restricted to cargo aircraft is aboard a flight carrying passengers, when a unit's weight exceeds the limit of the position it occupies, and when a compartment's load exceeds its weight or volume limit.

#### Scenario: Dry ice in an unventilated compartment

- **GIVEN** a compartment reporting dry ice whose configuration reports it is not ventilated
- **WHEN** the load is checked
- **THEN** an advisory reports the quantity of dry ice and that the compartment is not ventilated

#### Scenario: Dry ice in a ventilated compartment

- **GIVEN** a compartment reporting dry ice whose configuration reports it is ventilated
- **WHEN** the load is checked
- **THEN** no advisory is raised for it

#### Scenario: Live animals in a suitable compartment

- **GIVEN** a shipment of live animals in a compartment that is both heated and ventilated
- **WHEN** the load is checked
- **THEN** no advisory is raised for it

#### Scenario: Live animals in an unsuitable compartment

- **GIVEN** a shipment of live animals in a compartment that is not heated or not ventilated
- **WHEN** the load is checked
- **THEN** an advisory reports which capability the compartment lacks

#### Scenario: A cargo-aircraft-only shipment on a passenger flight

- **GIVEN** a flight whose service carries passengers
- **WHEN** a shipment aboard it is restricted to cargo aircraft
- **THEN** an advisory reports the shipment and the restriction

#### Scenario: A position over its limit

- **WHEN** a unit's contents and tare together exceed the weight limit of the position it occupies
- **THEN** an advisory reports the unit, the position and both figures

#### Scenario: Checks that cannot run

- **GIVEN** a manifest reporting no hold variant, so no unit reports a compartment
- **WHEN** the load is checked
- **THEN** the checks needing a compartment are reported as not applicable
- **AND** are not reported as passing

### Requirement: Temperature-controlled load is drawn as endurance against exposure

For each shipment needing temperature control the app SHALL present the regime it must be kept within, the solution carrying it, its endurance, the exposure across this flight and any onward leg, the resulting margin and the risk level, drawing endurance and exposure so the margin between them is visible. The app SHALL present the assessment as advisory and SHALL carry the API's own explanation of it.

#### Scenario: A temperature-controlled shipment

- **WHEN** a shipment needing temperature control is shown
- **THEN** its regime, solution, endurance, exposure and margin are reported
- **AND** endurance and exposure are drawn so the margin between them can be read

#### Scenario: The assessment is advisory

- **WHEN** a cold chain assessment is shown
- **THEN** it is presented as advisory
- **AND** the API's explanation of the assessment accompanies it

#### Scenario: The temperature band

- **WHEN** a regime with a temperature band is shown
- **THEN** the band and, where reported, the set point are presented with their unit

#### Scenario: A flight with no temperature-controlled load

- **WHEN** no shipment needs temperature control
- **THEN** no cold chain timeline is presented

### Requirement: The unload sequence is presented as derived

The app SHALL present an order in which the hold comes off, derived from whether a unit holds premium cabin baggage, what its shipments are doing on this flight, how long they have to connect, whether the unit transfers intact, and the point it is built for. It SHALL state that the order is derived and name the fields it was derived from, and SHALL group the order by the compartment and door each unit comes out of.

#### Scenario: Reading the sequence

- **WHEN** the unload sequence is shown
- **THEN** it states that it is derived
- **AND** names the fields it was derived from

#### Scenario: Premium baggage comes off first

- **GIVEN** a unit holding premium cabin baggage
- **WHEN** the sequence is derived
- **THEN** that unit is ordered before units not holding it

#### Scenario: A sealed transfer unit stays aboard

- **GIVEN** a unit that transfers intact to a point beyond this flight
- **WHEN** the sequence is derived
- **THEN** it is reported as remaining aboard rather than given a place in the unload order

#### Scenario: Tighter connections come off earlier

- **GIVEN** two units whose shipments continue beyond this flight with different times to connect
- **WHEN** the sequence is derived
- **THEN** the one with less time to connect is ordered first

#### Scenario: The door is carried

- **WHEN** the sequence is shown
- **THEN** each unit is grouped by the compartment it comes out of and the side that compartment is loaded from

#### Scenario: A sequence that cannot be derived

- **GIVEN** a manifest reporting no hold variant, so no unit reports a compartment or a door
- **WHEN** the sequence is shown
- **THEN** the units are ordered by the fields that are available
- **AND** the app states that compartment and door are unknown for this load

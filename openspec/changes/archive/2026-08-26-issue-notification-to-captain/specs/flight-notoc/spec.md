## Purpose

Presents the notification to captain a flight carries — what is aboard that the commander must know about, where it sits, and what to do if it goes wrong — as the immutable record of the load at the moment it was issued.

## ADDED Requirements

### Requirement: A notification is read only when one has been issued

The app SHALL resolve a flight to either a notification or a named reason there is none, and SHALL distinguish those reasons. It SHALL state, distinctly: that no notification has been issued because no preliminary loadsheet has been written; that the reader is not permitted to read this flight's notification; and that the request failed.

#### Scenario: A flight whose preliminary loadsheet has not been written

- **WHEN** the reader opens the notification of a flight whose preliminary loadsheet has not been written
- **THEN** the app states that the notification is issued from the preliminary loadsheet
- **AND** does not present an empty document

#### Scenario: A notification before the flight is released

- **GIVEN** a flight that has not been released and whose preliminary loadsheet has been written
- **WHEN** the reader opens its notification
- **THEN** the preliminary notification is shown
- **AND** the app does NOT withhold it pending release

#### Scenario: A flight the reader may not see

- **GIVEN** a reader whose role permits the notification only for a flight they captain
- **WHEN** they open another flight's notification
- **THEN** the app states they are not permitted to read it
- **AND** distinguishes that from no notification having been issued

#### Scenario: A failed read

- **WHEN** the notification cannot be read because the request failed
- **THEN** the app distinguishes that from no notification having been issued

### Requirement: A notification always says whether dangerous goods are aboard

Every notification carries a statement in words of whether dangerous goods are loaded. Where none are loaded the app SHALL present that statement prominently, so a clean hold is stated rather than left as an absence. Where dangerous goods are loaded the entries themselves carry that fact, and the app SHALL list them rather than repeat the statement above them.

#### Scenario: A flight carrying no dangerous goods

- **WHEN** a notification reporting no dangerous goods is shown
- **THEN** its statement that none are loaded is presented prominently
- **AND** the document is not presented as empty or unavailable

#### Scenario: A flight carrying dangerous goods

- **WHEN** a notification reporting dangerous goods is shown
- **THEN** the dangerous goods it reports are listed

### Requirement: The notification names the stage it records

A preliminary notification is issued from the preliminary loadsheet and reissued whenever it changes, until release freezes it; a final one is issued when boarding finishes. Each is an immutable record of the load at the moment it was issued. The app SHALL present the latest issued notification and SHALL make clear which stage it is and when it was issued. Because the commander reads it while finishing boarding — before the final one exists — the app offers no control for moving between stages.

#### Scenario: The stage is named

- **WHEN** a notification is shown
- **THEN** its stage and the time it was issued are stated

#### Scenario: Only a preliminary notification exists

- **WHEN** a flight carries only a preliminary notification
- **THEN** it is shown as the preliminary notification

#### Scenario: The document is immutable

- **WHEN** a notification of either stage is shown
- **THEN** no control is offered that would alter it

### Requirement: What changed between stages is reported

The final notification reports what changed since the preliminary one. Where such a report is present the app SHALL present it alongside the final document. Where it is absent — as on a preliminary notification — the app SHALL present no change report rather than an empty one.

#### Scenario: A final notification reporting changes

- **WHEN** a final notification carrying a change report is shown
- **THEN** what changed since the preliminary notification is presented with it

#### Scenario: A preliminary notification

- **WHEN** a preliminary notification is shown
- **THEN** no change report is presented

### Requirement: Every dangerous good reports its declaration and its position

For each dangerous good the app SHALL report the air waybill, the proper shipping name, the UN number, the hazard class, the subsidiary risk, the packing group, the number of packages, the net quantity per package, the airport it comes off at, whether it is restricted to cargo aircraft, and the hold position and compartment it occupies. Where the load is loose or the airframe type carries no curated hold data, no position is reported and the app SHALL present that as how the load sits rather than as missing data.

#### Scenario: A declared dangerous good

- **WHEN** a dangerous goods entry is shown
- **THEN** its waybill, proper shipping name, UN number, hazard class and packing group are reported
- **AND** its packages, net quantity per package and unloading airport are reported

#### Scenario: A positioned entry

- **WHEN** a dangerous goods entry reporting a position is shown
- **THEN** the position designator and compartment are reported

#### Scenario: An entry without a position

- **WHEN** a dangerous goods entry reports no position
- **THEN** the app presents the absence as loose load or as an uncurated airframe type
- **AND** does not report it as missing data

#### Scenario: A cargo-aircraft-only entry

- **WHEN** an entry restricted to cargo aircraft is shown
- **THEN** the restriction is stated in words

#### Scenario: Hazard is not carried by colour alone in the app

- **WHEN** a dangerous goods entry is shown on an in-app surface
- **THEN** its hazard class is conveyed in text
- **AND** no meaning is carried by colour alone

### Requirement: Every dangerous good carries its drill

Each dangerous good arrives with the emergency response drill derived from the published drill chart. The app SHALL present, for each, the emergency response code, the inherent risk, the risk to aircraft and occupants, the spill and fire procedure and the additional risks the drill letter adds. The app SHALL render the supplied text and SHALL NOT compose, summarise or paraphrase it.

#### Scenario: Reading a drill

- **WHEN** a dangerous goods entry's drill is shown
- **THEN** its emergency response code, inherent risk, risk to aircraft and occupants, and spill and fire procedure are presented
- **AND** the additional risks it reports are presented

#### Scenario: The text is the API's

- **WHEN** any drill text is presented
- **THEN** it is the text the API supplied, unaltered

#### Scenario: A drill with no additional risk

- **WHEN** a drill reports no risk beyond the drill itself
- **THEN** that is presented as the API states it rather than omitted

### Requirement: Special loads are reported with their handling codes

For each notifiable special load the app SHALL report the air waybill, the description, the handling codes that make it notifiable, its gross weight, its position and compartment where it has them, and the airport it comes off at. Where a heaviest piece is reported for a heavy or outsized load, the app SHALL present its weight and its dimensions with their units.

#### Scenario: A special load

- **WHEN** a special load is shown
- **THEN** its waybill, description, handling codes, gross weight and unloading airport are reported

#### Scenario: A heavy or outsized load

- **WHEN** a special load reporting a heaviest piece is shown
- **THEN** the weight and the dimensions of that piece are presented with their units

#### Scenario: A special load with no heaviest piece

- **WHEN** a special load reports no heaviest piece
- **THEN** no dimensions are presented for it

#### Scenario: Sensitive consignments are reported plainly

- **WHEN** a special load concerns human remains or another sensitive consignment
- **THEN** it appears as an ordinary row of the notification
- **AND** does not appear in a heading, a figure or a summary line

### Requirement: Cold chain assessments are carried as advisory

Where the notification reports cold chain assessments the app SHALL present, for each, the air waybill, the description, the regime, the risk, the margin in hours and the API's own explanation, and SHALL state that the assessment is advisory and gates nothing.

#### Scenario: A cold chain assessment

- **WHEN** a cold chain assessment is shown
- **THEN** its waybill, description, regime, risk and margin are reported
- **AND** the API's explanation accompanies it

#### Scenario: The assessment gates nothing

- **WHEN** a cold chain assessment is shown
- **THEN** it is presented as advisory
- **AND** no action available to the reader is prevented by it

### Requirement: The load summary reports the document's own figures

The app SHALL present the notification's load summary — the weight and dry ice in each compartment, the container, pallet and loose lot counts, the cargo, baggage and deadload weights, what continues beyond this flight and the tightest onward connection — using the document's own definitions. Where a figure of the same name is reported differently by the cargo manifest, the app SHALL NOT present the two as one quantity.

#### Scenario: Reading the summary

- **WHEN** the load summary is shown
- **THEN** each compartment's weight and dry ice are reported
- **AND** the container, pallet and loose lot counts and the cargo, baggage and deadload weights are reported

#### Scenario: Counts are not conflated

- **GIVEN** that the notification splits a load into containers and pallets while the cargo manifest counts units
- **WHEN** both surfaces are available for one flight
- **THEN** neither figure is presented as the other

#### Scenario: Nothing continues beyond

- **WHEN** no shipment continues beyond this flight
- **THEN** no onward connection is presented

### Requirement: Acknowledgement is reported, not requested

The preliminary notification is accepted by the pilot checking in and the final one by the request that finishes boarding, so there is no separate acknowledgement action. The app SHALL report who accepted the document and when where it has been accepted, and SHALL offer no control that acknowledges it. Where it has not been accepted the app SHALL report nothing, because the reader is performing that acceptance as they read.

#### Scenario: An accepted notification

- **WHEN** a notification reporting an acknowledging pilot and a time is shown
- **THEN** who accepted it and when are reported

#### Scenario: An unaccepted notification

- **WHEN** a notification reporting no acknowledgement is shown
- **THEN** no acknowledgement is reported for it

#### Scenario: No acknowledgement control

- **WHEN** any notification is shown
- **THEN** no control is offered that would acknowledge it

### Requirement: The notification is read where the commander accepts the load

The notification is the commander's pre-departure artifact, so the app SHALL present it within the flow that finishes boarding rather than as a surface of its own, and SHALL require the commander to confirm it there before boarding can be finished. It SHALL offer no control that acknowledges the notification separately.

#### Scenario: A pilot reads the notification while finishing boarding

- **WHEN** a pilot finishing boarding reaches the notification step
- **THEN** the notification of the flight they are operating is shown

#### Scenario: The notification must be confirmed

- **WHEN** the pilot has not confirmed the notification step
- **THEN** boarding cannot be finished

#### Scenario: A reader not entitled to the notification

- **WHEN** the notification cannot be read because the reader is not permitted to
- **THEN** the app states they are not permitted to read it

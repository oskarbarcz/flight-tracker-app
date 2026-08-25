# Flight cargo manifest

## Purpose

Reports what a flight is carrying below the floor — the weights it accounts for, the waybills that make them up, and how they reconcile — for every role permitted to see it.

## Requirements

### Requirement: A flight's manifest is read only when there is one to read

The app SHALL resolve a flight to either a manifest or a named reason there is none, and SHALL distinguish those reasons from one another. It SHALL state, distinctly: that the flight has not been released and so no manifest has been generated; that the flight carries no cargo; that the reader is not permitted to see this flight's manifest; and that the request failed.

#### Scenario: A flight before release

- **WHEN** the reader opens the cargo of a flight that has not been released
- **THEN** the app states that the manifest is generated when the flight is released
- **AND** does not present an empty manifest

#### Scenario: A flight the reader may not see

- **GIVEN** a reader whose role permits the manifest only for a flight they captain
- **WHEN** they open the cargo of another flight
- **THEN** the app states they are not permitted to read it
- **AND** distinguishes that from the flight having no manifest

#### Scenario: A failed read

- **WHEN** the manifest cannot be read because the request failed
- **THEN** the app distinguishes that from every other reason no manifest is shown

#### Scenario: A cargo flight is not treated as an absence

- **GIVEN** a flight whose service is cargo
- **WHEN** the reader opens its load
- **THEN** the manifest is shown
- **AND** the reader is not told that a cabin or passenger manifest is unavailable

### Requirement: The manifest reports what it accounts for

The app SHALL report the cargo weight the manifest accounts for with tare included, the number of units carrying cargo in devices, the number of loose lots, the number of shipments, the number carrying dangerous goods, the number restricted to cargo aircraft, the number continuing beyond this flight, the tightest onward connection among them, the baggage weight and bag count in the hold, and the worst cold chain risk aboard. Every weight SHALL carry its unit.

#### Scenario: Reading the figures

- **WHEN** a manifest is shown
- **THEN** each reported figure is presented with its unit
- **AND** a figure the manifest reports as absent is shown as absent rather than as zero

#### Scenario: Baggage is kept apart from cargo

- **WHEN** a manifest reporting baggage in the hold is shown
- **THEN** the baggage weight is presented separately from the cargo weight
- **AND** the app states whether the baggage figure was reconciled from the payload or derived from the passenger count

#### Scenario: No temperature-controlled load

- **WHEN** a manifest reports no worst cold chain risk
- **THEN** no cold chain risk is presented for the flight

### Requirement: The manifest reconciles, visibly

The app SHALL show that the units' contents and tare weights together account for the cargo weight reported, and that the compartment loads account for the same total. The derivation SHALL be visible rather than asserted, and where the figures do not reconcile the app SHALL say so rather than present a total it cannot support.

#### Scenario: A reconciling manifest

- **WHEN** a manifest is shown
- **THEN** the sum of the units' contents and the sum of their tare weights are presented against the reported cargo weight
- **AND** the compartment loads are presented against the same total

#### Scenario: A manifest that does not reconcile

- **WHEN** the sums do not equal the reported cargo weight
- **THEN** the app reports the discrepancy
- **AND** does not silently present the reported total as verified

### Requirement: Every shipment is readable as a waybill

The app SHALL present the shipments as a ledger, each entry identified by its air waybill number, and SHALL let a reader open one to read its commodity and description, its pieces, gross weight and volume, its handling codes, its shipper and consignee, the airport it was raised at and the one it is destined for, what it is doing on this flight, and where it continues to.

#### Scenario: Opening a waybill

- **WHEN** the reader opens a shipment
- **THEN** its waybill number, commodity, description, pieces, gross weight and volume are reported
- **AND** its shipper, consignee, origin and destination are reported

#### Scenario: A shipment continuing beyond this flight

- **GIVEN** a shipment that does not terminate at this flight's arrival
- **WHEN** it is read
- **THEN** the carrier and flight it continues on and the time available to connect are reported
- **AND** a connection below the minimum a transfer needs is marked as at risk

#### Scenario: A shipment terminating here

- **GIVEN** a shipment that terminates at this flight's arrival
- **WHEN** it is read
- **THEN** no onward carrier, flight or connection time is presented

#### Scenario: Handling codes are named

- **WHEN** a shipment carrying handling codes is read
- **THEN** each code is presented with its meaning
- **AND** a code the app does not recognise is presented as the code itself rather than omitted

### Requirement: The ledger can be narrowed

The app SHALL let the reader narrow the ledger by handling code, by dangerous goods hazard class, by what the shipment is doing on this flight, by whether it was loaded or offloaded, and by cold chain risk. It SHALL report how many shipments match, and SHALL offer to clear the filters when none do.

#### Scenario: Narrowing the ledger

- **WHEN** the reader applies a filter
- **THEN** only shipments matching it are listed
- **AND** the number matching is reported

#### Scenario: No shipment matches

- **WHEN** no shipment matches the filters
- **THEN** the app says so
- **AND** offers to clear the filters

### Requirement: A dangerous goods shipment reports its declaration

Where a shipment carries dangerous goods the app SHALL report its UN number, proper shipping name, hazard class, subsidiary risk, packing group, net quantity per package, emergency response code and whether it is restricted to cargo aircraft. Where the declaration carries a note on how it was derived, the app SHALL present it.

#### Scenario: Reading a declaration

- **WHEN** a shipment carrying dangerous goods is read
- **THEN** its UN number, proper shipping name, hazard class and packing group are reported
- **AND** its net quantity per package and emergency response code are reported

#### Scenario: A declaration with no subsidiary risk or packing group

- **WHEN** a declaration reports no subsidiary risk or no packing group
- **THEN** the absence is presented as absence rather than as an empty value

#### Scenario: A cargo-aircraft-only shipment

- **WHEN** a shipment restricted to cargo aircraft is listed
- **THEN** the restriction is marked in the ledger and not only inside the waybill

### Requirement: Compartment loads report against their limits

The app SHALL report, for each compartment carrying load, the weight it carries against the compartment's weight limit, the volume its contents occupy against the compartment's usable volume, and the dry ice it carries. Where the hold configuration is unknown, the app SHALL report the load without compartments rather than inventing them.

#### Scenario: A compartment carrying load

- **WHEN** a compartment's load is shown
- **THEN** its weight and volume are presented against the compartment's limits
- **AND** the dry ice it carries is reported

#### Scenario: Dry ice is always reported

- **WHEN** a compartment carries dry ice
- **THEN** the quantity is reported for that compartment specifically

#### Scenario: A load with no hold configuration

- **GIVEN** a manifest reporting no hold variant
- **WHEN** the load is shown
- **THEN** no compartment breakdown is presented
- **AND** the app states that the airframe type carries no curated hold data

### Requirement: What was left behind is reported

The app SHALL let the reader see the shipments that were offloaded, reporting for each why it was left behind and the position it had been loaded in. Where nothing was offloaded, the app SHALL say so rather than present an empty list.

#### Scenario: A flight with offloaded shipments

- **WHEN** the reader opens the offloaded shipments
- **THEN** each is listed with the reason it was left behind and the position it came out of

#### Scenario: A flight with nothing offloaded

- **WHEN** no shipment was offloaded
- **THEN** the app states that nothing was left behind

#### Scenario: Filtered figures are not mixed with unfiltered ones

- **GIVEN** that the API returns some totals unfiltered when a status filter is applied
- **WHEN** offloaded shipments are shown
- **THEN** totals that do not respect the filter are not presented alongside those that do
- **AND** units carrying no matching shipment are not listed

### Requirement: The manifest is a current-flight surface

The app SHALL present the cargo manifest on the operations flight file, on the pilot's tracking dashboard and to cabin crew for a flight they captain. It SHALL NOT add the manifest to the flight history surfaces.

#### Scenario: Operations reads a flight's cargo

- **WHEN** operations opens a flight's cargo
- **THEN** the manifest is shown

#### Scenario: A pilot reads their flight's cargo

- **WHEN** a pilot opens the cargo of the flight they are operating
- **THEN** the manifest is shown

#### Scenario: History is unchanged

- **WHEN** a reader opens a finished flight in the history surfaces
- **THEN** no cargo manifest tab is presented there

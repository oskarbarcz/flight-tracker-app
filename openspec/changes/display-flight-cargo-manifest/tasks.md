## 1. Slice, model and service

- [ ] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [ ] 1.2 Create the `app/features/cargo-manifest/` slice with `model.ts`, `service.ts`, `i18n.ts` and `index.ts`
- [ ] 1.3 Type `FlightCargoManifest`, `CargoUnitEntry`, `CargoShipmentEntry`, `CompartmentLoad`, `DangerousGoods` and `ColdChain` by hand against captured payloads, keeping every nullable primitive nullable despite the schema declaring it `type: object`
- [ ] 1.4 Model `dangerousGoods.sourceNote` as optional, since it appears on `CV2020`'s UN1845 entry and is absent from the schema
- [ ] 1.5 Add the enums `CargoUnitKind` (`uld`, `bulk_lot`), `UldType` (`AKE`, `AKH`, `RKN`, `PMC`, `PAG`, `AMA`, `RAP`), `ContentClass` (`cargo`, `baggage`, `mail`), `TransferRole`, `ShipmentStatus`, `OffloadReason`, `ColdChainRegime` (`CRT`, `COL`, `FRO`), `ColdChainRisk` and `BaggageSource`, and translate each in `i18n.ts`
- [ ] 1.6 Add a special handling code dictionary to `i18n.ts` seeded from the twelve codes observed — `ACT`, `AVI`, `BIG`, `CAO`, `COL`, `EAT`, `HEA`, `HUM`, `ICE`, `PIL`, `RFL`, `RLI` — falling back to the raw code through `toHuman` for anything unrecognised
- [ ] 1.7 Add a commodity dictionary to `i18n.ts` seeded from the eleven commodities observed, falling back to the raw slug
- [ ] 1.8 Add `CargoManifestService` with `fetchByFlightId(id)` and `fetchByFlightId(id, status)`, registering it in `useApi()`
- [ ] 1.9 Present human remains and other sensitive consignments as an ordinary manifest row, never in a heading, a figure or a summary line

## 2. Resolution and derivation

- [ ] 2.1 Add `hooks/useFlightCargo.ts` resolving a flight to a manifest or a named gap, mirroring `useFlightCabin`
- [ ] 2.2 Type the gap union as `not-released`, `no-hold-data`, `no-cargo`, `forbidden` and `failed`, treating `no-hold-data` as a ready state with a reduced view rather than an unavailable one
- [ ] 2.3 Fetch the hold configuration for the manifest's variant and join units to positions on the normalised designator
- [ ] 2.4 Add `lib/shipmentIndex.ts` flattening shipments once, each carrying a back-reference to its unit, position, compartment and deck
- [ ] 2.5 Add `lib/reconciliation.ts` recomputing the units' contents and tare against the reported cargo weight, and the compartment loads against the same total, reporting any discrepancy
- [ ] 2.6 Add `lib/advisories.ts` as a list of independent checks, each returning nothing or a finding carrying the values it derived from
- [ ] 2.7 Implement the dry ice check against compartment ventilation
- [ ] 2.8 Implement the live animal check against compartment heating and ventilation
- [ ] 2.9 Implement the cargo-aircraft-only check against the flight's service type
- [ ] 2.10 Implement the unit weight check against the position's weight limit, and the compartment weight and volume checks against the compartment's limits
- [ ] 2.11 Report a check that cannot run as not applicable, never as passing, when the manifest carries no hold variant
- [ ] 2.12 Add `lib/unloadSequence.ts` ordering by priority baggage, then local cargo, then transfers ascending by connection time, removing sealed beyond-units from the order, grouped by compartment and door
- [ ] 2.13 Add `lib/coldChain.ts` deriving the timeline geometry from endurance, exposure and margin

## 3. Figures and reconciliation

- [ ] 3.1 Build the manifest figures header reporting cargo weight, units, loose lots, shipments, dangerous goods, cargo-aircraft-only, transfers, tightest connection and worst cold chain risk, every weight unit-suffixed
- [ ] 3.2 Present baggage weight and bag count separately from cargo, stating whether the figure was reconciled or derived
- [ ] 3.3 Show a figure the manifest reports as absent as absent rather than as zero
- [ ] 3.4 Build the reconciliation strip presenting contents, tare, total and the compartment loads against the same total, in `Roboto Mono` with `tabular-nums` and rule-lined subtotals, following the fuel build-up
- [ ] 3.5 Report a discrepancy plainly where the sums do not equal the reported cargo weight

## 4. The loaded hold

- [ ] 4.1 Supply the load to the hold diagram's placement layer as a reading, without modifying the layer
- [ ] 4.2 Add the five readings — content class, weight saturation, volume saturation, hazard and cold chain — with a switcher stating which is shown
- [ ] 4.3 Keep every position in place across a change of reading
- [ ] 4.4 Draw an empty position distinctly from an occupied one, and a vacated position distinctly from both
- [ ] 4.5 Mark a unit carrying dangerous goods, restricted to cargo aircraft, refrigerated by device type, holding premium cabin baggage, sealed, or built for a point beyond, each by marker and text
- [ ] 4.6 Add the unit tooltip reporting identifier, type, position, compartment, deck, tare, contents, volume, content class and shipments
- [ ] 4.7 Report bag count and no shipment list for a unit whose contents are baggage
- [ ] 4.8 Present loose load against its compartment rather than at a position
- [ ] 4.9 Build the positionless view listing units and shipments, stating that the airframe type carries no curated hold data, with no drawing and no reading switcher
- [ ] 4.10 State when a selected reading has nothing to distinguish in the current load, and keep the hold drawn

## 5. Ledger, waybill and compartments

- [ ] 5.1 Build the shipment ledger from the shipment index, identified by air waybill number
- [ ] 5.2 Add filters on handling code, hazard class, transfer role, status and cold chain risk, reporting the match count and offering to clear when none match
- [ ] 5.3 Build the waybill card with commodity, description, pieces, gross weight, volume, handling codes, shipper, consignee, origin, destination and transfer role
- [ ] 5.4 Report onward carrier, onward flight and connection time only for a shipment continuing beyond this flight, marking a connection below the transfer minimum as at risk
- [ ] 5.5 Render the dangerous goods declaration with UN number, proper shipping name, hazard class, subsidiary risk, packing group, net quantity per package, emergency response code and the cargo aircraft restriction, using the semantic badges rather than hazard colours
- [ ] 5.6 Present an absent subsidiary risk or packing group as absent rather than as an empty value, and render `sourceNote` where present
- [ ] 5.7 Mark a cargo-aircraft-only shipment in the ledger, not only inside the waybill
- [ ] 5.8 Build the compartment load table reporting weight and volume against limits and the dry ice carried
- [ ] 5.9 Present the load without compartments where the manifest reports no hold variant

## 6. Derived panels

- [ ] 6.1 Build the advisories panel rendering findings, holding no rule knowledge itself
- [ ] 6.2 Name the figures each finding was derived from, and gate nothing on any of them
- [ ] 6.3 Build the clean state naming the checks performed, so silence is not mistaken for absence of checking
- [ ] 6.4 Build the cold chain timeline drawing endurance against exposure with the margin readable, carrying regime, solution, temperature band, set point, risk and the API's own explanation
- [ ] 6.5 Present the cold chain assessment as advisory throughout, and present no timeline where no shipment needs temperature control
- [ ] 6.6 Build the offload story from `?status=offloaded`, pruning units carrying no matching shipment and showing only figures that respect the filter
- [ ] 6.7 State that nothing was left behind where no shipment was offloaded
- [ ] 6.8 Build the unload sequence stating that it is derived and naming its inputs, reporting sealed beyond-units as remaining aboard
- [ ] 6.9 Order by the available fields and state that compartment and door are unknown where the manifest carries no hold variant

## 7. Surfaces

- [ ] 7.1 Add the cargo route to the operations flight file under `FlightLayout` in `app/routes.ts`
- [ ] 7.2 Add a cargo tab to `FlightDataTabs` and render it in `FlightTrackingDashboard`
- [ ] 7.3 Leave `HistoryDataTabs` untouched, since the passenger manifest is already current-flight-only
- [ ] 7.4 Present the manifest to cabin crew for a flight they captain, and the forbidden state otherwise
- [ ] 7.5 Ensure a cargo-service flight no longer reports its load as unavailable
- [ ] 7.6 Name the manifest's device figure "units", keeping it distinct from the notification's container and pallet split

## 8. Verification

- [ ] 8.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [ ] 8.2 Verify reconciliation on `AA4912`, where the units' contents and tare sum to 8 500 kg against a reported 8 500 and two compartment loads sum to the same
- [ ] 8.3 Verify reconciliation on `CV2020`, where gross 13 672 plus tare 1 228 is 14 900 against a reported 14 900 and three compartment loads sum to 14 900
- [ ] 8.4 Verify the loaded drawing on `CV2020`, a `b74f-nose` carrying three `AMA` units on the main deck at `6AL`, `6BL` and `6CL` and four `AKE` units on the lower deck, and confirm the main deck units place correctly through designator normalisation
- [ ] 8.5 Verify the dry ice advisory fires on `CV2020`, which carries 900 kg of dry ice in lower compartment 1 where the configuration reports `heated: false` and `ventilated: false`
- [ ] 8.6 Verify the live animal check passes on the same manifest, whose horses sit at `6AL` in main compartment 6, which is both heated and ventilated
- [ ] 8.7 Verify the cargo-aircraft-only advisory fires on `AA4912`, a passenger service reporting `cargoAircraftOnlyCount: 1` for UN3480 at position `11R`, although the schema states that count is always zero on a flight carrying passengers
- [ ] 8.8 Verify the position and compartment weight checks report as not applicable rather than passing on `AA2019` and `AA2021`, which report no hold variant
- [ ] 8.9 Verify the positionless view on `AA2019` and `AA2021`, each carrying a single loose lot with null deck, compartment and position, lists the load and states that no hold configuration is curated
- [ ] 8.10 Verify the cold chain timeline on `CV2020`'s vaccine shipment, at 100 h endurance against 11.5 h exposure for an 88.5 h margin at low risk, and confirm the API's explanation is rendered rather than paraphrased
- [ ] 8.11 Verify all five readings change appearance without moving any position, and that a reading with nothing to distinguish says so while keeping the hold drawn
- [ ] 8.12 Verify the offload view prunes units carrying no matching shipment and shows no unfiltered total, given that the API returns every unit and an unfiltered `cargoKg` and `containerCount` under `?status=offloaded`
- [ ] 8.13 Verify the ledger filters narrow correctly, report the match count and offer to clear when nothing matches
- [ ] 8.14 Verify each of the twelve observed handling codes renders with its meaning and that an unrecognised code renders as the code itself
- [ ] 8.15 Verify each gap state renders distinctly — before release, no cargo, forbidden and failed — and that a cargo-service flight is no longer told its load is unavailable
- [ ] 8.16 Verify human remains and other sensitive consignments appear only as manifest rows, never in a heading, figure or summary line
- [ ] 8.17 Record which contract paths remain unexercised by seeded data: no offloaded shipment, no baggage or mail unit, no transfer, and five of seven device types including every refrigerated one
- [ ] 8.18 Verify keyboard traversal reaches every unit and shipment, that the ledger carries what the drawing carries, and that dismissing a unit restores focus
- [ ] 8.19 Check contrast in light and dark against WCAG 2.1 AA for all five readings, including every marker against the position fill it sits on
- [ ] 8.20 Run `npm run build`

## 1. Slice, model and service

- [x] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Create the `app/features/cargo-hold/` slice with `model.ts`, `service.ts`, `i18n.ts` and `index.ts`
- [x] 1.3 Type `AircraftHoldLayout`, `HoldVariant`, `HoldDeck`, `HoldCompartment` and `HoldPosition` by hand against captured payloads, not from the schema, since roughly fifteen nullable primitives across the cargo schemas are declared `type: object`
- [x] 1.4 Add the enums `HoldDeckName` (`main`, `lower`), `CompartmentName` (`forward`, `aft`, `bulk`, `main`), `CompartmentLoading` (`uld`, `loose`), `DoorSide` (`left`, `right`, `nose`, `none`), `PositionSide` (`L`, `R`, `full`), `UldBase` (`K`, `A`, `M`) and `UldContour` (`E`, `H`, `N`, `G`, `C`, `P`, `A`), and translate each in `i18n.ts`
- [x] 1.5 Add `CargoHoldService` with `fetchCatalogue()` and `fetchByType(icaoCode)`, registering it in `useApi()`
- [x] 1.6 Normalise position designators in the service where the response becomes a model, composing compartment number, ordinal and side, and leaving a designator already beginning with its compartment number unchanged
- [x] 1.7 Add `assignHoldVariant(operatorId, aircraftId, variantId)` and `removeHoldVariant(operatorId, aircraftId)` to `AircraftService`
- [x] 1.8 Add `holdVariant` to the aircraft model as a nullable string, since `GetAircraftResponse` declares it `type: object`

## 2. Geometry and device codes

- [x] 2.1 Add `lib/uldCode.ts` parsing an IATA type code into family, base, contour and the refrigerated marker carried by the `R` prefix
- [x] 2.2 Add `lib/positionFit.ts` deriving the device types a position admits by crossing its accepted bases with its accepted contours, naming no type the position does not admit
- [x] 2.3 Add `lib/holdFrame.ts` sizing each compartment by its share of its deck's usable volume, so a compartment keeps its extent in every variant that reports it
- [x] 2.4 Split a compartment's extent equally among its ordinals, so relative position size follows from the variant's own density rather than from a dimension table
- [x] 2.5 Normalise each deck of a variant to one drawn length, aligning a freighter's decks so a lower compartment reads beneath the main-deck position above it
- [x] 2.6 Place a paired position on its side of the centreline opposite the position of the same ordinal, and a full-width position across the whole width
- [x] 2.7 Narrow the fuselage envelope at positions accepting a reduced contour set, comparing only within one base family so a change of loading is not read as a taper
- [x] 2.8 Read compartments and positions in the order the payload reports them, sorting neither

## 3. The hold diagram

- [x] 3.1 Build the deck renderer drawing one variant nose-left, compartments in reported order, at a scale measured from the container
- [x] 3.2 Hold positions above a usable hit size, scrolling horizontally rather than shrinking, and draw every deck of a variant at one scale
- [x] 3.3 Make the position a focusable control taking a resolved appearance — fill, marker and text alternative — knowing nothing about what fills it
- [x] 3.4 Supply the reference reading, presenting each position by what it accepts, and keep placement independent of it so a later reading changes appearance without changing placement
- [x] 3.5 Draw a loose compartment in its place in the order, distinguishable from a compartment holding positions, and never as an error or an absence
- [x] 3.6 Draw a freighter's main deck above its lower deck, both at one scale, and present no deck comparison for a single-deck variant
- [x] 3.7 Render each compartment's weight limit and usable volume, and its heating, ventilation and door side by text or marker, never by colour alone
- [x] 3.8 Add a compartment load bar rendering the compartment's own weight limit alongside its positions' limits, without presenting the compartment limit as their sum
- [x] 3.9 Add the position tooltip reporting designator, accepted bases, accepted contours, weight limit and the device types that fit
- [x] 3.10 Add the hold legend, keyed to the reference reading
- [x] 3.11 Render the uncurated-type state stating that no hold configuration is curated for the type, distinctly from a failed request

## 4. The accessible peer

- [x] 4.1 Build the position table carrying designator, deck, compartment, side, accepted bases, accepted contours and weight limit for every position, ordered by deck, compartment and position
- [x] 4.2 Carry every compartment's limits and capabilities in the table, including compartments holding no positions
- [x] 4.3 Make the whole hold reachable and usable by keyboard, restoring focus when a position detail is dismissed

## 5. Catalogue browser

- [x] 5.1 Add the catalogue list route under `OperationsLayout` in `app/routes.ts` and an entry in `OperationsSidebarItems`
- [x] 5.2 Build the list reporting each type, its variant count, its decks, its compartments and its position count, with an aircraft type filter
- [x] 5.3 Add the type detail route rendering the variant switcher, the diagram, the position table and the compartment capabilities
- [x] 5.4 Identify exactly one variant as the default and state that it is what an aircraft of the type uses when none is assigned, presenting no variant choice for a type offering one
- [x] 5.5 State that per-compartment weights are derived rather than published, and do not present them as manufacturer figures
- [x] 5.6 Render a not-found state for an uncurated type and a distinct state for a failed catalogue read
- [x] 5.7 Gate both routes to operations through `AuthGuard`

## 6. Hold variant assignment

- [x] 6.1 Add the hold layout tab to the aircraft detail route, reporting the assigned variant and drawing its hold
- [x] 6.2 Report the type default with the fact that it is a default rather than an assignment when an aircraft carries none, and state when the type carries no curated hold
- [x] 6.3 Add the assign modal offering only the variants the catalogue reports for that aircraft's type
- [x] 6.4 Refresh the aircraft on success so the newly assigned variant reads without a reload, and confirm the outcome through `useToast()`
- [x] 6.5 Report a rejected assignment and leave the aircraft reporting the variant it had
- [x] 6.6 Add the remove modal stating that removal means falling back to the type default, and leave the assignment unchanged when abandoned
- [x] 6.7 Surface the assigned variant and its diagram read-only in the aircraft library, with no assign, replace or remove control
- [x] 6.8 Link from the aircraft's hold surface to the catalogue entry for its type

## 7. Verification

- [x] 7.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 7.2 Verify the catalogue lists all 18 curated types across 23 variants, 88 compartments and 491 positions
- [x] 7.3 Verify designator normalisation on `b74f-nose`, whose catalogue reports `AL`, `AR`, `BL` while the flight manifest and the notification report `6AL`, `6BL`, `6CL` for the same positions, and confirm the rule is idempotent by applying it twice
- [x] 7.4 Verify no two positions of a variant share a designator after normalisation, across all 23 variants
- [x] 7.5 Verify footprint on `b77w-ld3`, whose 44 positions are all half-width pairs, against `b77w-mixed`, whose compartments 1 and 2 are full-width pallet positions and whose compartments 3 and 4 are paired containers
- [x] 7.5a Verify a compartment keeps its drawn extent across variants, since volume is invariant while position count is not: `B77W` lower compartment 1 is 51.6 m³ as 12 positions in `b77w-ld3` and as 4 in `b77w-mixed`, and `A320` lower compartment 1 is 13.3 m³ as 0 positions in `a320-bulk` and as 3 in `a320-cls`
- [x] 7.5c Verify the fuselage is drawn the same size across every variant of a type, resolving the width across all of them: `A319`, `A320`, `A321`, `B77W` and `B74F` each agree on every deck
- [x] 7.5b Verify the derived pallet-to-container ratio on `B77W` compartment 1, where 6 LD3 ordinals against 4 pallet ordinals gives 1.5 LD3 ordinals per pallet and so 3 LD3 per pallet at two abreast
- [x] 7.6 Verify every `L` position is drawn opposite the `R` of the same ordinal, and that no compartment mixes full-width with paired positions
- [x] 7.7 Verify the taper narrows at `b77w-ld3`'s aftmost pair `45L` and `45R`, at `b74f-nose`'s `6OL` and `6OR`, and at the single `7AP` on `b77f-side` and on `a30f-side`, which the comparison catches only because it is made per deck rather than per compartment
- [x] 7.8 Verify `b77w-mixed`'s two contour sets are not read as a taper, since they mark pallets forward and containers aft rather than a narrowing fuselage
- [x] 7.9 Verify the loose compartment renders in place on `b77w-ld3`, whose compartment 5 is a 2 170 kg bulk hold declaring no positions, and that the derived extent is never presented as a measurement
- [x] 7.10 Verify the all-loose variants render their compartments and limits without reporting anything missing, on B752, B738, A3ST, SH33 and A225, whose single main compartment is 250 000 kg over 1 300 m³ through a nose door
- [x] 7.11 Verify both decks draw at one scale on a freighter, checking `b74f-nose` where a 2 975 kg bulk hold sits against a 204 120 kg main deck, and across the other six multi-deck types A30F, B48F, B75F, B76F, B77F and MD1F
- [x] 7.12 Verify `b74f-nose` and `b74f-side` are distinguishable, since they hold 62 positions each and differ only in the loading door
- [x] 7.13 Verify the default variant is identified on all 18 types, and that the loosely loaded variant is the default where a type offers both, on `a320-bulk` over `a320-cls` and the same for A319 and A321
- [x] 7.14 Verify the device fit derivation names `AKE` for a K base accepting E, H and N, and record that only `AKE` and `AMA` appear in seeded loads so the other five types are contract-derived and unverified against data
- [x] 7.15 Verify a compartment's weight limit is reported alongside its positions' limits without being presented as their sum, on `b77w-ld3` compartment 1 at 19 056 kg over 12 positions of 1 588 kg
- [x] 7.16 Verify an uncurated type reports that no hold is curated for it, distinctly from a failed request
- [x] 7.17 Verify assignment, replacement and removal on an aircraft, that removal falls back to the type default, and that abandoning either modal leaves the assignment unchanged
- [x] 7.18 Verify the aircraft library shows the hold read-only with no assignment control present
- [x] 7.19 Verify keyboard traversal reaches every position and compartment, that the position table carries what the drawing carries, and that dismissing a position restores focus
- [x] 7.20 Check contrast in light and dark against WCAG 2.1 AA, including every position treatment against the compartment outline it sits in
- [x] 7.21 Run `npm run build`

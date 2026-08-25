## Why

The API now curates the cargo hold of 18 airframe types — 23 variants, 88 compartments, 491 ULD positions, each position carrying the ULD bases and contours it accepts and the weight it takes — and lets a hold variant be assigned to a tail. The app reads none of it. An aircraft's belly is, today, a single tonnage figure on the loadsheet.

The hold diagram is also the reusable half of this body of work. The flight cargo manifest is the same drawing with a load on top, and the notification to captain reports positions from the same designators, so settling the geometry here — its deck stacking, its compartment ordering, its position footprints and its mode contract — avoids drawing it twice.

The catalogue is the honest place to prove it. It has no load to reconcile, no release gate and no captain-only access to reason about, just a hold and its positions. Operations needs it anyway: assigning a variant to a tail is meaningless without somewhere to see what the variants differ in.

## What Changes

- Add a **`cargo-hold` feature slice** with the hold catalogue types, its service, its labels and the geometry that turns a variant into a drawing.
- Build the **hold diagram**: a proportional plan view reading nose-left, compartments in order from the nose, positions placed to their real footprint, and the decks of a freighter stacked main above lower at one scale.
- Encode a position's **appearance from what it accepts** — its ULD bases, its contours and its weight limit — behind a resolver contract a later change supplies a load to without touching the position or the deck renderer.
- Handle the **loosely loaded compartment** as a first-class case, not an edge: 5 of the 18 types declare no positions at all in any variant, and every widebody carries at least one bulk compartment.
- Mark each compartment's **capability** — heated, ventilated, door side, volume and weight limit — by marker and text, never by colour alone.
- Add an **accessible position table**, because a field of absolutely positioned tiles cannot alone meet the accessibility bar.
- Add a **ULD fit matrix** reporting which of the seven IATA type codes each position accepts, derived from its bases and contours.
- Add a **catalogue browser** for operations: a list of the curated types and a type detail page with a variant switcher, the diagram, the position table and the compartment capabilities.
- Add **hold variant assignment** on the aircraft detail page — assign, replace and remove — and surface the assigned variant read-only in the aircraft library.
- **Normalise freighter main-deck designators.** The catalogue omits the compartment prefix that the manifest and the notification both use; the drawing keys on the designator, so the normalisation belongs here, where the designator is first read.

The flight cargo manifest and the notification to captain are out of scope and follow as separate changes against the diagram built here.

## Capabilities

### New Capabilities

- `cargo-hold-diagram`: how a hold is drawn — deck stacking, compartment ordering, position placement and footprint, what a position's appearance encodes, the loosely loaded compartment, the accessible equivalent, and how the drawing behaves for an airframe type the API curates no hold for.
- `aircraft-hold-catalogue`: how operations finds a curated type, compares its variants, and reads a compartment's limits and capabilities and a position's accepted ULDs.
- `aircraft-hold-variant-assignment`: how a hold variant is assigned to a tail, replaced and removed, what the default variant means when none is assigned, and how the assignment reads for a role that cannot change it.

### Modified Capabilities

<!-- None. -->

## Impact

- **Frontend code**: a new `app/features/cargo-hold/` slice — `model.ts`, `service.ts`, `i18n.ts`, `lib/holdFrame.ts` for the geometry, `lib/uldCode.ts` for the IATA type code, `lib/positionFit.ts` for the accepted-ULD derivation, `components/HoldDiagram/` and `components/Catalogue/`.
- **Routes**: a catalogue list route and a type detail route under `OperationsLayout` in `app/routes.ts`, an entry in `OperationsSidebarItems`, and a hold layout tab on the aircraft detail route.
- **API**: consumes `GET /api/v1/cargo-hold`, `GET /api/v1/cargo-hold/{type}`, `PUT` and `DELETE /api/v1/operator/{operatorId}/aircraft/{aircraftId}/hold-variant`, and the `holdVariant` field on `GetAircraftResponse`. All deployed; no API work.
- **Coverage is partial and that is the normal case**: 18 types are curated against a fleet that carries more. An uncurated type answers 404, and an aircraft holding no assignment falls to its type's default variant. Both states are designed for, not treated as failures.
- **Designators do not join, verified live**: the catalogue reports freighter main-deck positions as `AL`, `AR`, `BL`, while `GET /flight/{id}/cargo-manifest` and `GET /flight/{id}/notoc` both report `6AL`, `6BL`, `6CL` for the same positions on `b74f-nose`. The manifest and the notification agree with each other and with the documented convention — compartment number, ordinal, side — so the catalogue is the wrong side. It affects all 9 freighter main-deck compartments across B77F, B74F (both variants), B48F, B76F, B75F, MD1F and A30F, 177 positions in total; every lower deck is correct. The normalisation prefixes the compartment number when a designator does not already start with it, so it is idempotent and survives a later API correction unchanged.
- **Geometry, verified live**: 491 positions carry `side` as `L` (209), `R` (209) or `full` (73). Side pairs with base exactly — every `L` and `R` position accepts a single half-width base (K on a widebody lower deck, M on a freighter main deck) and every `full` position spans the fuselage. Footprint therefore derives from the accepted base and needs no separate dimension.
- **Position order is physical**: positions arrive nose to tail within a compartment, and compartments are numbered from the nose, so the drawing reads the arrays in order and does not sort.
- **The taper is encoded in the contours**: all seven contours appear across the catalogue (`A`, `C`, `E`, `G`, `H`, `N`, `P`), and aft positions accept fewer than those further forward. A position's accepted set is the only account of the fuselage narrowing that the API gives.
- **Loose compartments declare zero positions**: B752, B738, A3ST, A225 and SH33 carry no positions in any variant, and every widebody carries a bulk compartment alongside its ULD compartments. The A225's single main compartment is 250 000 kg over 1 300 m³ with a nose door. A compartment drawn without positions is a routine case.
- **Freighters are the only multi-deck types**: A30F, B48F, B74F, B75F, B76F, B77F and MD1F carry a main deck above a lower deck. Both decks draw at one scale so a 2 170 kg bulk hold is not stretched to the width of a 204 120 kg main deck.
- **Exactly one variant per type is the default, verified across all 18**, and where a type offers both a loosely loaded and a containerised variant the loosely loaded one is the default — `a320-bulk` over `a320-cls`, and the same for A319 and A321. B74F is the case where two variants differ only in the loading door, `b74f-nose` and `b74f-side`, at 62 positions each.
- **The ULD type code carries meaning**: the second letter is the base and the third the contour, so `lib/uldCode.ts` derives a device's fit from its code alone. The `R` prefix marks a refrigerated container, which a later change reads for cold chain. Of the seven declared types only `AKE` and `AMA` appear in seeded loads, so the remaining five are implemented from the contract and unverified against data.
- **Weight limits are per position and per compartment**: a compartment's limit is not the sum of its positions — `b77w-ld3` compartment 1 takes 19 056 kg across 12 positions of 1 588 kg each, which sum to 19 056 kg, while compartment 3 takes 15 880 kg across 10 of the same. Both limits are reported and both are drawn.
- **Schema types are lossy**: `holdVariant` on `GetAircraftResponse` is declared `type: object` although it is a nullable string, one of roughly fifteen such fields across the cargo schemas. Models are hand-written against captured payloads rather than generated.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: WCAG 2.1 AA in both themes, including every position treatment against the compartment outline it sits in, and the position table as the diagram's accessible peer.

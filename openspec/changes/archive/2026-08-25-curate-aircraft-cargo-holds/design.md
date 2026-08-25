## Context

See proposal.md — Why. What shapes the approach is what the hold catalogue does and does not give.

It gives, per variant, an ordered tree of decks, compartments and positions. A compartment carries a weight limit, a usable volume, heating, ventilation and a door side. A position carries a designator, a side, the device bases and contours it accepts and a weight limit.

It gives **no longitudinal dimension of any kind** — no station numbers, no compartment lengths, no position pitch, no fuselage extent. Nothing in the payload says how long the hold is or where a compartment begins. The cabin diagram this work is modelled on had the opposite problem: `cabin-layout` supplies absolute seat coordinates on a canvas, so `cabinFrame.ts` places seats from data and compresses the empty structure between them. There is no equivalent here. Every longitudinal quantity in the hold drawing has to be derived, and the design's central question is what it is honest to derive it from.

Two further constraints come from the data as it stands. Freighter main-deck designators are reported without their compartment number while the flight manifest and the notification to captain both report them with it, so the same position is named two ways across three endpoints. And roughly fifteen nullable primitives across the cargo schemas are declared `type: object`, so models are hand-written against captured payloads rather than generated.

## Goals / Non-Goals

**Goals:**

- A plan view whose proportions mean something, so a main-deck pallet and a lower-deck container are not drawn the same size.
- Geometry that is derived from published standards or from the payload, never from taste.
- A placement layer that the flight cargo manifest can reuse unchanged, supplying a load without touching how positions are laid out.
- One reading of a designator across the catalogue, the manifest and the notification.

**Non-Goals:**

- A scale drawing of the aircraft. The transverse axis is faithful and the longitudinal axis is derived; the result is a proportional schematic and is not presented as a loading plan.
- Any interaction that loads, moves or removes a unit. The API exposes no such operation and this change adds no pretence of one.
- Interpreting a load. Occupancy, hazard, cold chain and every other reading of a filled hold belong to the flight cargo manifest change.
- Curating hold data ourselves for the types the API does not cover.

## Decisions

### Proportion comes from compartment volume, the one figure that is variant-invariant

Volume is the one figure that does not move. Verified across every type offering more than one variant — 21 compartments, no exceptions — a compartment's usable volume is identical in every variant that reports it, while its position count and its weight limit both change:

```
B77W lower cmp1   b77w-ld3    12 positions ( 6 LD3 ordinals)   51.6 m³   19 056 kg
                  b77w-mixed   4 positions ( 4 pallet ords)    51.6 m³   27 200 kg
A320 lower cmp1   a320-bulk    0 positions (loose)             13.3 m³    2 328 kg
                  a320-cls     3 positions                     13.3 m³    3 402 kg
```

So a compartment is sized by **its share of its deck's volume**, and its extent is split equally among its ordinals. Decks are presented one at a time behind a switcher, matching the cabin seat map, and drawn at one scale so moving between them does not rescale the hold.

- **Transverse** is exact, and it sets the drawn height of a deck. A position accepting a half-width base occupies one side of the centreline and pairs with its opposite number; a position accepting a full-width base spans the fuselage. The deck's width is the widest position's across-extent, taken from the published across-dimension of the base it accepts — a paired K position spans 2 × 1534 mm, a paired M position 2 × 2438 mm, a spanning pallet 3175 mm. Verified against the real aircraft it lands close: B77W 3.07 m against ~3.4 m, B74F main deck 4.88 m against ~5.7 m, A225 6.00 m against ~6.4 m, A320 2.01 m against ~1.9 m. Because the fuselage belongs to the **type** and not to the variant, the width is resolved once across every variant of the type and then applied to whichever variant is shown. Resolving it per variant produced a visibly different aircraft on `A319`, where `a319-bulk` declares no positions and fell to the volume heuristic at 1800 mm while `a319-cls` derived 1534 mm from its positions — the same aircraft drawn two sizes. A deck declaring no positions in any variant of the type has no base to read at all, and only then is its width estimated from the cube root of its volume, the one figure here that is a heuristic rather than a derivation.
- **Longitudinal** is volume share, then an equal split among ordinals.

Drawing every deck at one fixed height was the original mistake: it made a 747F main deck exactly as narrow as an A320's lower hold, and with the drawing always stretched to the container it put every aircraft at the same 12.7:1. Deck height now follows the base, and the drawn length is capped so the tallest deck never exceeds 11:1.

**Length is still not comparable between types.** The API gives no longitudinal dimension, and every model tried for deriving one — volume over cross-section, volume over width — mis-ranks some aircraft badly, because fuselage height is unknown and does not track width consistently. So a 787 and a 777 still draw at the same length even though their holds differ by eight metres. Within one aircraft the proportions are sound; across two aircraft only the widths are.

*Alternative considered, and implemented before it was falsified — the along-fuselage dimension of the accepted IATA base, summed over the ordinals.* It reads well until the same compartment appears in two variants: `b77w-ld3` cmp1 would draw at `6 × 1562 mm = 9.4 m` and `b77w-mixed` cmp1 at `4 × 3175 mm = 12.7 m`, so switching variant would change the length of the aircraft. Rejected on the data.

*Alternative considered — a uniform schematic grid*, every position an equal cell. Rejected because it draws a main-deck pallet and an LD3 the same size across different compartments, which is false in a way a reader of this product would notice.

What makes volume share trustworthy is that the relative position sizes fall out of it correctly rather than being asserted. B77W compartment 1 carries 6 LD3 ordinals in one variant and 4 pallet ordinals in the other, so a pallet ordinal is 1.5 LD3 ordinals; at two LD3s abreast that is **3 LD3 per pallet**, the real IATA equivalence, derived from the payload rather than from a table this app maintains.

It also removes three special cases. A loosely loaded compartment declares no positions but still reports a volume, so it needs no separate rule. A variant that is loose throughout needs no fallback. And no ULD dimension table is owned by this app at all, so nothing here can drift from a standard.

### The fuselage envelope narrows where positions accept fewer contours

The taper is in the data. Within one base family, a position accepting a reduced contour set is a position where the fuselage has closed in. It is always at the tail of the run and it is rare: 6 of 491 positions. `b77w-ld3` accepts E, H and N across its lower deck and only H at its aftmost pair `45L`/`45R`; `b74f-nose` accepts A and C across its main deck and only C at `6OL`/`6OR`; `b77f-side` and `a30f-side` each taper to a single `7AP`.

The comparison is made **per deck**, not per compartment. A position that sits alone in the aft compartment of a freighter — `7AP` on `b77f-side` and on `a30f-side` — has nothing within its own compartment to be reduced against, and comparing only within a compartment silently misses exactly the positions the taper is about.

The envelope narrows at exactly those positions. The comparison is only meaningful **within a base family** — `b77w-mixed` carries pallets forward and containers aft, so its two contour sets mark a change of loading, not a taper, and must not be read as one.

*Alternative considered — a fixed decorative nose and tail taper.* Rejected: it would be invented geometry decorating real data, which the product's anti-references rule out.

### Designators are normalised at the service boundary

Normalisation composes a designator from compartment number, ordinal and side, and leaves alone any designator that already begins with its compartment number. It runs where the catalogue response becomes a model, so no consumer — renderer, table, or the manifest change's join — ever sees an unnormalised designator.

Putting it in the renderer was the alternative. Rejected because the manifest change joins on designators outside the renderer entirely, and two independent normalisations would drift.

The rule is idempotent by construction, so it stays correct if the API is later corrected, and it is one function to delete when that happens.

### Placement and appearance are separate layers

The renderer decides *where* a position is drawn from geometry alone. *How* it is filled, marked and labelled is supplied to it. This change supplies one reading — what the position accepts — and the flight cargo manifest change supplies another, without touching placement.

This is the same contract the cabin seat diagram established for its modes, and the reason that change was scoped the way it was. Following it here is what makes the manifest change a matter of supplying a reading rather than redrawing a hold.

### Device fit is derived, not tabulated

Which of the seven declared device types a position accepts follows from crossing its accepted bases with its accepted contours against the type codes. Nothing hard-codes a position-to-device list. The same parser reads a device code the other way for the manifest change: base from the second letter, contour from the third, and the refrigerated marker from the `R` prefix.

Only `AKE` and `AMA` appear in seeded loads. The other five are implemented from the type-code contract and are unverified against data.

### Scale, minimum size and overflow follow the cabin diagram

A container-width observer, a basis and a minimum scale, positions held above a usable hit size, horizontal scrolling rather than shrinking, and all decks of a variant drawn at one scale. This is settled behaviour in `CabinDiagram` and there is no reason for the hold to differ. A freighter's 2 170 kg bulk hold and its 204 120 kg main deck therefore sit at the same scale, which is the point.

### The accessible peer is a real table

A field of absolutely positioned tiles cannot meet the accessibility bar by annotation alone. The position table is a genuine table carrying everything the drawing carries, ordered by deck, compartment and position, reachable without a pointer. It is also the only usable view of a 70-position freighter hold on a phone.

## Risks / Trade-offs

- **The longitudinal axis is derived, and a reader may take it for a scale plan.** → The drawing is never labelled a loading plan or a scale drawing; compartment extents carry their real weight and volume figures, which are the numbers that matter, and the derived length is never presented as a measurement.
- **Normalising each deck to one drawn length overstates a lower deck that is physically shorter than the main deck above it.** → The catalogue gives no fuselage extent for either, so no truer ratio is available; the decks are drawn aligned, which is the reading that helps a freighter operator, and no length figure is printed for either.
- **Volume share assumes a constant cross-section along a deck, which the taper contradicts slightly.** → The effect is confined to the aftmost positions, which the contour data already marks; the compartments carrying the taper are the smallest on the deck, so the distortion is small and it never changes which compartment is longer than which.
- **Designator normalisation compensates for an API defect in the frontend.** → Idempotent by construction, isolated to one function at the service boundary, documented in the proposal's Impact, and safe to delete without touching a consumer once the catalogue is corrected.
- **Five of seven device types and every non-`AKE`/`AMA` fit path are unverified against live data.** → Implemented from the published type-code contract, which is the same source the API curates from; flagged in the spec as contract-derived rather than data-verified.
- **Coverage is 18 types against a larger fleet, so the uncurated state will be seen often.** → It is a designed state with its own copy, distinct from a failed request, specified rather than left to a generic empty view.
- **Schema types are lossy, so a hand-written model can silently diverge from what the API sends.** → Models written against captured payloads rather than the schema, including the undocumented optional `sourceNote` observed on a manifest dangerous-goods entry.

## Migration Plan

Additive throughout. New routes, a new sidebar entry, a new tab on the aircraft detail page and a new feature slice; nothing existing changes behaviour. The only write is the hold variant assignment, which the API already exposes and which falls back to the type default when removed, so there is no state a rollback would strand. Reverting is removing the routes and the slice.

`package.json` must be bumped before merge for `bin/check_version_is_free`.

## Open Questions

- Whether the bulk compartment of a widebody deserves its own visual treatment beyond being drawn as a compartment without positions. It can be settled while building, changes no requirement and no task.

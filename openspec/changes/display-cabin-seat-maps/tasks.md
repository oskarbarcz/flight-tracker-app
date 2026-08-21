## 1. Seat map types and service

- [x] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Extend `app/features/cabin-layout/model.ts` with `CabinSeatMap`, `CabinSeatMapDeck`, `CabinSeatMapCanvas`, `CabinSeat`, `SeatComment` and `CabinDefinition`, keeping `rating`, `windowStatus` and `seatProduct` nullable
- [x] 1.3 Add the enums `SeatRating` (`green`, `yellow`, `red`) and `WindowStatus` (`great`, `average`, `poor`, `none`), and translate each in `i18n.ts`
- [x] 1.4 Add `CommentSentiment` (`good`, `neutral`, `bad`) and `CommentSeverity` (`minor`, `moderate`, `major`, nullable on a comment), type `SeatComment` against them, and translate both in `i18n.ts`
- [x] 1.5 Add `CabinLayoutSyncResult` and `CabinLayoutRefreshResult` to `model.ts`
- [x] 1.6 Add `fetchSeatMap(id)` to `CabinLayoutService`
- [x] 1.7 Add `sync()` and `refresh(id)` to `CabinLayoutService`
- [x] 1.8 Add `lib/seatIndex.ts` keying seats by deck and designator for the manifest's later join
- [x] 1.9 Add `lib/seatOrder.ts` ordering a deck's seats by cabin, then row, then letter, for keyboard traversal and the seat table

## 2. The deck renderer

- [x] 2.1 Build the deck renderer transposing the cabin to read nose-left, packing each cabin section at its own internal spacing and separating sections by a fixed gutter
- [x] 2.2 Read geometry from the deck's own seats and canvas, never from another deck's
- [x] 2.3 Apply `rotation` as a transform about the rect centre, unchanged, because the transposition is a proper rotation
- [x] 2.4 Hold seats above a usable minimum size, scrolling horizontally rather than shrinking, and draw both decks of a dual-deck layout at one scale
- [x] 2.5 Make the seat a focusable control taking a resolved appearance — fill, marker and text alternative — knowing nothing about cabin class, rating or occupancy
- [x] 2.6 Give `reversed` a distinct orientation marker
- [x] 2.7 Order keyboard traversal by cabin and row rather than by array order

## 3. Modes, legend and inspection

- [x] 3.1 Add `lib/seatAppearance.ts` with a cabin-class resolver and a rating resolver, giving unrated seats their own treatment rather than a mid-ramp fill
- [x] 3.2 Define the mode contract so a later change can supply an occupancy resolver without altering the seat or the deck renderer
- [x] 3.3 Encode blocked, crew-rest and unbookable seats by marker as well as colour
- [x] 3.4 Build `components/SeatMap/SeatLegend.tsx` naming only the states actually present on the deck, and a mode control switching between cabin class and rating
- [x] 3.5 Report a seat's designator, cabin, rating and window position on inspection, with an absent rating or window position reported as unavailable rather than as a blank
- [x] 3.6 Report every comment with its sentiment and severity conveyed by more than colour, and return focus to the seat on dismissal

## 4. Deck switching and the accessible view

- [x] 4.1 Build `components/SeatMap/DeckSwitcher.tsx` shown only for multi-deck layouts, naming each deck and its seat count
- [x] 4.2 Build `components/SeatMap/SeatTable.tsx` as a peer view listing every seat with designator, cabin, rating, window position and comments
- [x] 4.3 Give the drawing a figure role labelled such that the table is identifiable as its equivalent
- [x] 4.4 Build `components/SeatMap/CabinDescriptions.tsx` listing each cabin's rows, pitch, width, recline and description, reporting omitted dimensions as unavailable and deriving seat counts from the seats rather than from the description
- [x] 4.5 Compose the above into `components/SeatMap/SeatMap.tsx` as the single entry point taking a seat map and a mode, and reduce `AircraftSeatLayoutTab` to using it

## 5. Catalogue browser

- [x] 5.1 Add a catalogue list route under `OperationsLayout` in `app/routes.ts` and an entry in `OperationsSidebarItems`
- [x] 5.2 Build the list with airline, aircraft type and retired filters, server paging, the match count, and an empty state offering to clear the filters
- [x] 5.3 Validate the airline and aircraft type fields to the lengths the API accepts before sending them
- [x] 5.4 Add a layout detail route rendering the provider metadata, the seat counts by cabin class, both upstream identifiers where a deck pair was merged, the retired marker with its date, and the seat map
- [x] 5.5 Render a loading state on first read stating that the cabin is being retrieved from the provider, a not-found state for an uncatalogued identifier, and a distinct provider-unavailable state for a 502
- [x] 5.6 Gate both routes to operations through `AuthGuard`

## 6. Catalogue actions

- [x] 6.1 Add a catalogue refresh action reporting reported, catalogued, created, retired, restored and skipped counts, stating plainly when nothing changed
- [x] 6.2 Prevent a second catalogue refresh while one is running, and indicate that it is running
- [x] 6.3 Add a per-layout refresh action reporting whether the cabin changed and the revision in force, re-reading the drawing when it did
- [x] 6.4 Report a provider failure on either action and leave the displayed revision matching the server's
- [x] 6.5 Link to the catalogue layout from the aircraft's cabin layout surface

## 7. Verification

- [x] 7.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 7.2 Verify `lh-74h` renders both decks, each from its own geometry — 332 seats against 32 — that switching decks changes what is drawn, and that the upper deck is drawn at the main deck's scale rather than stretched
- [x] 7.3 Verify rotation renders correctly on `aa-77w`, whose seats span −30.7° to +32.8°, and on `lh-74h`, and record that no seeded layout exercises `reversed`
- [x] 7.4 Verify that `kl-738`'s 139 unrated seats are visibly distinct from every rating value in rating mode, and that its 124 seats without a window position report it as unavailable
- [x] 7.5 Verify `de-321` draws 36 business and 184 economy seats from the seats themselves while its single provider cabin description is presented as the provider's own account
- [x] 7.6 Confirm blocked, crew-rest and unbookable rendering against the contract, and record that all 1,074 seeded seats are bookable, unblocked and not crew rest
- [x] 7.7 Verify keyboard traversal reaches every seat in cabin order, that the seat table carries the same data, and that dismissing a seat restores focus
- [x] 7.8 Verify the catalogue lists every seeded layout, pages correctly, reports the match count, and that an airline code shorter than two characters is not sent to the API
- [x] 7.9 Verify `kl-77w` reports the provider as unavailable rather than as a missing layout, and that an uncatalogued identifier reports not found
- [x] 7.10 Verify the catalogue refresh and layout refresh actions report their outcome, that a second catalogue refresh cannot start while one runs, and that a refresh reporting no change leaves the revision alone
- [x] 7.11 Check contrast in light and dark against WCAG 2.1 AA, including every seat treatment against the cabin outline
- [x] 7.12 Run `npm run build`

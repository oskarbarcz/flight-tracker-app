## 1. Seat map types and service

- [ ] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [ ] 1.2 Extend `app/features/cabin-layout/model.ts` with `CabinSeatMap`, `CabinSeatMapDeck`, `CabinSeatMapCanvas`, `CabinSeat`, `SeatComment`, `CabinDefinition`, `CabinLayoutSyncResult` and `CabinLayoutRefreshResult`, keeping `rating`, `windowStatus` and `seatProduct` nullable
- [ ] 1.3 Add the enums `SeatRating` (`green`, `yellow`, `red`), `WindowStatus` (`great`, `average`, `poor`, `none`), `CommentSentiment` and `CommentSeverity`, and translate each in `i18n.ts`
- [ ] 1.4 Add `fetchSeatMap(id)`, `sync()` and `refresh(id)` to `CabinLayoutService`
- [ ] 1.5 Add `lib/seatBounds.ts` returning the bounding box of a deck's seats, and `lib/seatIndex.ts` keying seats by deck and designator for later joins

## 2. The deck renderer

- [ ] 2.1 Build `components/SeatMap/DeckCanvas.tsx` taking one deck, rendering a container at the deck's canvas aspect ratio with the provider image filling it, and positioning seats by percentage of `canvas.width` and `canvas.height` rather than by pixel arithmetic
- [ ] 2.2 Read geometry from the deck's `canvas`, never from the image's natural size, so a disagreeing image misaligns rather than breaks the drawing
- [ ] 2.3 Build `components/SeatMap/Seat.tsx` as a focusable control taking a resolved appearance — fill, outline, label and text alternative — and knowing nothing about cabin class, rating or occupancy
- [ ] 2.4 Apply `rotation` as a transform about the rect centre and give `reversed` a distinct orientation marker
- [ ] 2.5 Reserve the drawing's box before the image loads, render seats over an empty canvas when the image fails, and report the failure
- [ ] 2.6 Place the drawing on its own light plate in both themes and verify every seat treatment against that plate

## 3. Modes, legend and inspection

- [ ] 3.1 Add `lib/seatAppearance.ts` with a cabin-class resolver and a rating resolver, giving unrated seats their own treatment rather than a mid-ramp fill
- [ ] 3.2 Define the mode contract so a later change can supply an occupancy resolver without altering `Seat` or `DeckCanvas`
- [ ] 3.3 Encode blocked, crew-rest and unbookable seats by pattern or marker as well as colour
- [ ] 3.4 Build `components/SeatMap/SeatLegend.tsx` naming only the states actually present on the deck
- [ ] 3.5 Build `components/SeatMap/SeatDetail.tsx` reporting designator, cabin, rating, window position and every comment with its sentiment and severity conveyed by more than colour, returning focus to the seat on dismissal
- [ ] 3.6 Report an absent rating or window position as unavailable rather than as a blank

## 4. Deck switching, cropping and the accessible view

- [ ] 4.1 Build `components/SeatMap/DeckSwitcher.tsx` shown only for multi-deck layouts, naming each deck and its seat count
- [ ] 4.2 Default the view to the seat bounding box with a margin, and offer a visible control restoring the whole drawing
- [ ] 4.3 Build `components/SeatMap/SeatTable.tsx` as a peer view listing every seat with designator, cabin, rating, window position and comments
- [ ] 4.4 Give the drawing a figure role labelled such that the table is identifiable as its equivalent
- [ ] 4.5 Order keyboard traversal by cabin and row rather than by array order
- [ ] 4.6 Build `components/SeatMap/CabinDescriptions.tsx` listing each cabin's rows, seat count, pitch, width, recline and description, reporting omitted dimensions as unavailable
- [ ] 4.7 Compose the above into `components/SeatMap/SeatMap.tsx` as the single entry point taking a seat map and a mode

## 5. Catalogue browser

- [ ] 5.1 Add a catalogue list route under `OperationsLayout` in `app/routes.ts` and an entry in `OperationsSidebarItems`
- [ ] 5.2 Build the list with airline, aircraft type and retired filters, server paging, the match count, and an empty state offering to clear the filters
- [ ] 5.3 Validate the airline and aircraft type fields to the lengths the API accepts before sending them
- [ ] 5.4 Add a layout detail route rendering the provider metadata, the seat counts by cabin class, both upstream identifiers where a deck pair was merged, the retired marker with its date, and the seat map
- [ ] 5.5 Render a loading state on first read stating that the cabin is being retrieved from the provider, and a not-found state for an uncatalogued identifier
- [ ] 5.6 Gate both routes to operations through `AuthGuard`

## 6. Catalogue actions

- [ ] 6.1 Add a synchronise action reporting reported, catalogued, created, retired, restored and skipped counts, stating plainly when nothing changed
- [ ] 6.2 Prevent a second synchronisation while one is running, and indicate that it is running
- [ ] 6.3 Add a per-layout refresh action reporting whether the cabin changed and the revision in force, re-reading the drawing when it did
- [ ] 6.4 Report a provider failure on either action and leave the displayed revision matching the server's
- [ ] 6.5 Link to the layout from `AircraftCabinLayoutCard`

## 7. Verification

- [ ] 7.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [ ] 7.2 Verify seat placement against the live API on `kl-738`, whose canvas is 800×4213 and whose image measures 800×4213, and confirm the seats land over the drawn seats at several container widths
- [ ] 7.3 Verify `lh-74h` renders both decks, each against its own canvas — 800×5239 with 332 seats and 800×2507 with 32 — and that switching decks changes the coordinate space
- [ ] 7.4 Verify across layouts from more than one manufacturer that the image dimensions match the reported canvas, and record any layout where they do not
- [ ] 7.5 Verify that `kl-738`'s 139 unrated seats are visibly distinct from every rating value, and that its 124 seats without a window position report it as unavailable
- [ ] 7.6 Confirm rotation and reversed rendering against the contract, and record that no seeded layout exercises either
- [ ] 7.7 Verify the cropped default against the seeded bounding box, where seats span y 893.7 to 3886.1 of a 4213 canvas, and that restoring the full drawing works
- [ ] 7.8 Verify keyboard traversal reaches every seat in cabin order, that the seat table carries the same data, and that dismissing a seat restores focus
- [ ] 7.9 Verify the drawing degrades correctly with the provider image blocked
- [ ] 7.10 Check contrast in light and dark against WCAG 2.1 AA, including seat treatments against the drawing plate
- [ ] 7.11 Run `npm run build` and confirm no provider asset has entered the service worker precache

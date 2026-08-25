## Why

Assigning a cabin layout gave the aircraft a diagram of its cabin, but only one: a single view, coloured by cabin class, on one tab, with no way to read the cabin any other way and no way to reach a layout except through an aircraft that happens to carry it.

The diagram is also the reusable half of this whole body of work. The passenger manifest is the same drawing with occupancy on top, so finishing it here — with its modes, its accessible peer and its mode contract designed in — avoids rewriting it later.

The catalogue browser is the cheapest honest place to prove it. It has no manifest, no pinned revision and no captain-only access to reason about — just a layout and its seats — and operations needs it anyway to run the two catalogue actions the API exposes and to see what a layout actually looks like before assigning it to an aircraft.

## What Changes

- Complete the **`SeatMap` component** around the cabin diagram already drawn for the aircraft tab: a single entry point taking a seat map and a mode.
- Give the diagram **two modes** — colouring seats by cabin class or by AeroLOPA rating — behind a resolver contract a later change supplies occupancy to without touching the seat or the deck renderer.
- Support **dual-deck layouts** with a deck switcher, drawing both decks at one scale so a 32-seat upper deck is not stretched to the width of a 332-seat main deck.
- Mark **blocked, crew-rest and unbookable** seats, and **reversed** seats, by marker rather than by colour alone.
- Add an **accessible seat table**, because a field of absolutely positioned rotated targets cannot alone meet the accessibility bar.
- Add a **cabin description panel** carrying each cabin's rows, pitch, width, recline and description, presented as the provider's own account rather than as a seating breakdown.
- Add a **catalogue browser** for operations: a filtered, paged list and a layout detail page showing the seat map, the seat counts by class and the provider metadata.
- Add the two catalogue actions — **sync the catalogue** and **refresh a layout** — reporting what each actually did.

The passenger manifest is out of scope and follows as a separate change against the mode contract built here.

## Capabilities

### New Capabilities

- `cabin-seat-diagram`: how a cabin is drawn — the per-deck geometry, seat placement and rotation, what a seat's appearance encodes, the seat detail panel, the accessible equivalent, and how the drawing behaves while a cabin is unread or the provider is unreachable.
- `cabin-layout-catalogue-browser`: how operations finds a layout, reads what the provider knows about it, and runs the catalogue synchronisation and per-layout refresh.

### Modified Capabilities

<!-- None. -->

## Impact

- **Frontend code**: `app/features/cabin-layout/components/SeatMap/` gains the entry point, deck switcher, legend, seat detail, seat table and cabin descriptions around the existing `CabinDiagram`; a new `components/Catalogue/`; `lib/seatAppearance.ts`, `lib/seatOrder.ts` and `lib/seatIndex.ts`; `sync` and `refresh` on `CabinLayoutService`; the comment enums and their translators in the slice's `model.ts` and `i18n.ts`.
- **Routes**: a catalogue list route and a layout detail route under `OperationsLayout` in `app/routes.ts`, with an entry in `OperationsSidebarItems`.
- **API**: consumes `GET /api/v1/cabin-layout`, `GET /api/v1/cabin-layout/{id}`, `GET /api/v1/cabin-layout/{id}/seat-map`, `POST /api/v1/cabin-layout/sync` and `POST /api/v1/cabin-layout/{id}/refresh`. All deployed; no API work.
- **The drawing is ours**: the app draws the cabin from the seat geometry and requests none of the provider's `image`, `imageNeutral`, `svg` or `seatRects` assets. No third-party host is contacted, so nothing arises for the service worker precache.
- **Geometry, verified live**: the decks are extreme ribbons — 800×4213 for `kl-738`, and for `lh-74h` 800×5239 on the main deck against 800×2507 on the upper. The diagram transposes them to read nose-left and compresses the structure holding no seats; on `kl-738` the seats span y 893.7 to 3886.1 of 4213, so roughly a fifth of the source is empty.
- **Rotation is live, not theoretical**: `aa-77w` carries seat rotations from −30.7° to +32.8° and `lh-74h` from −19.8° to +20.4°. The transposition is a proper rotation, so the angle applies unchanged. `reversed` is false across all 1,074 seeded seats and stays implemented from the contract.
- **Data shape**: `rating`, `windowStatus` and `seatProduct` are nullable and an absent rating must not be read as neutral — 139 of `kl-738`'s 186 seats and 246 of `lh-74h`'s 332 carry no rating. Comment `severity` is nullable across `minor`, `moderate` and `major`; `sentiment` is `good`, `neutral` or `bad`. `seatProduct` is null on 1,046 of 1,074 seeded seats.
- **Cabin descriptions can disagree with the seats**: the contract states a seat's cabin may differ from the cabin descriptions, and `de-321` proves it — one description claiming 220 seats over rows 1 to 38, against seats reporting 36 business and 184 economy. Counts derive from the seats.
- **Blocked, crew rest and unbookable never occur** in the seeded catalogue: all 1,074 seats are bookable, unblocked and not crew rest. Implemented from the contract, unverified against data.
- **Failure states are distinct**: the seat map answers 502 when AeroLOPA is unavailable — `kl-77w` does so today — and 404 for an uncatalogued layout. They must not read the same.
- **Latency**: a layout's seat data is fetched from the provider on first read and stored, so the first open of an unread layout is a provider round trip, not a local read.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: WCAG 2.1 AA in both themes, including every seat treatment against the cabin outline it sits in.

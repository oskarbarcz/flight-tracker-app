## Why

Once an aircraft carries a cabin layout, nothing in the app can draw it. The API serves a complete seat map — every seat's geometry, class, rating, window position and advisory comments, grouped by deck — and the app has no component able to render a cabin at all.

The diagram is also the reusable half of this whole body of work. The passenger manifest is the same drawing with occupancy on top, so building it once here, with both modes designed in from the start, avoids rewriting it later.

The catalogue browser is the cheapest honest place to prove the diagram. It has no manifest, no pinned revision and no captain-only access to reason about — just a layout and its seats — and operations needs it anyway to run the two catalogue actions the API exposes and to see what a layout actually looks like before assigning it to an aircraft.

## What Changes

- Add a **`SeatMap` component** rendering one deck as the provider's cabin image with the seats overlaid as interactive targets, scaled to the container.
- Support **dual-deck layouts** with a deck switcher, because each deck carries its own canvas, its own image and its own coordinate space.
- Give the component **two modes from the outset** — a catalogue mode colouring seats by cabin class or AeroLOPA rating, and an occupancy mode a later change supplies passengers to.
- Add a **seat detail panel** reporting the designator, cabin, rating, window position and any advisory comments with their sentiment and severity.
- Add an **accessible seat table** carrying the same information, because a field of absolutely positioned rotated targets cannot alone meet the accessibility bar.
- Add a **cabin description panel** listing each cabin's rows, pitch, width, recline and description.
- Add a **catalogue browser** for operations: a filtered, paged list and a layout detail page showing the seat map, the seat counts by class and the provider metadata.
- Add the two catalogue actions — **sync the catalogue** and **refresh a layout** — reporting what each actually did.

The passenger manifest is out of scope and follows as a separate change against the occupancy mode built here.

## Capabilities

### New Capabilities

- `cabin-seat-diagram`: how a cabin is drawn — decks and their coordinate spaces, seat placement and rotation, what a seat's appearance encodes, the seat detail panel, the accessible equivalent, and how the drawing behaves while assets are loading or unavailable.
- `cabin-layout-catalogue-browser`: how operations finds a layout, reads what the provider knows about it, and runs the catalogue synchronisation and per-layout refresh.

### Modified Capabilities

<!-- None. -->

## Impact

- **Frontend code**: new `app/features/cabin-layout/components/SeatMap/` (deck renderer, seat targets, detail panel, legend, accessible table) and `components/Catalogue/`; `lib/` for the scaling and seat-index helpers; additions to `CabinLayoutService` for `fetchSeatMap`, `sync` and `refresh`; new enums and translators in the slice's `model.ts` and `i18n.ts`.
- **Routes**: a catalogue list route and a layout detail route under `OperationsLayout` in `app/routes.ts`, with an entry in `OperationsSidebarItems`.
- **API**: consumes `GET /api/v1/cabin-layout`, `GET /api/v1/cabin-layout/{id}`, `GET /api/v1/cabin-layout/{id}/seat-map`, `POST /api/v1/cabin-layout/sync` and `POST /api/v1/cabin-layout/{id}/refresh`. All deployed; no API work.
- **Geometry, verified live**: the deck image is exactly the canvas size — `kl-738.webp` is 800×4213 against a canvas of 800×4213 — so seats overlay the image under a single uniform scale with no further transform. Seats occupy only part of that canvas: on `kl-738`, x from 186.2 to 613.3 and y from 893.7 to 3886.1, leaving the nose and tail empty. Aspect ratios are extreme — 1:5.3 for `kl-738`, and for `lh-74h` 1:6.5 on the main deck (800×5239, 332 seats) beside 1:3.1 on the upper (800×2507, 32 seats).
- **External assets**: each deck carries `image`, `imageNeutral`, `svg` and `seatRects` URLs on `maptool.aerolopa.com` and a CloudFront bucket. Verified publicly reachable with no authentication, served `cache-control: public, max-age=3600` with a `?v=` cache-buster. They are third-party and must stay out of the service worker's precache, which is deliberately narrowed to js, css and html.
- **Data shape**: `rating`, `windowStatus` and `seatProduct` are nullable and an absent rating must not be read as neutral. On `kl-738`, 139 of 186 seats carry no rating and 124 carry no window status. `rotation` and `reversed` are zero and false throughout `kl-738`, so rotated seating cannot be verified against the seeded data and must be handled from the contract rather than from observation.
- **Latency**: a layout's seat data is fetched from the provider on first read and stored, so the first open of an unread layout is a provider round trip, not a local read.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: WCAG 2.1 AA in both themes. The provider images are drawn for a light background, so the dark theme needs a deliberate treatment rather than an inherited one.

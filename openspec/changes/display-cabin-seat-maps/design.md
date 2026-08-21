## Context

The API returns a cabin as a background image plus a list of rectangles positioned in that image's coordinate space. Both halves come from AeroLOPA: the drawing is theirs, the seat geometry is theirs, and the app's job is to place interactive targets over the drawing accurately and to say what each target means.

The drawings are unusually shaped. A narrowbody is a 1:5.3 ribbon; a 747-8's main deck is 1:6.5. Nothing else in the app has this aspect ratio, and the ordinary answer — fit it to the container — produces either a strip too small to touch or a page five screens tall.

## Goals / Non-Goals

**Goals**

- Place every seat exactly over its drawing, at any container width, on any deck.
- Make a seat's class, condition and — later — its occupant readable at a glance and precise on inspection.
- Be usable without a pointer and without sight of the image.
- Build one component that the manifest can reuse unchanged apart from what colours a seat.

**Non-Goals**

- Drawing the cabin ourselves. The provider's image is the drawing; we overlay it.
- Seat selection, booking or editing. Nothing in this system assigns a seat by hand.
- Rendering the provider's SVG or `seatRects` endpoints. The raster image plus the seat array the API already returns is sufficient, and avoids two more third-party round trips.
- Offline support for the cabin images.

## Decisions

### One uniform scale, because the image is exactly the canvas

`kl-738.webp` measures 800×4213 and its canvas is 800×4213. The seat coordinates are therefore image pixels. Rendering is a positioned container at the canvas aspect ratio, the image stretched to fill it, and each seat placed by percentage of canvas width and height. A single scale factor — `containerWidth / canvas.width` — governs everything, and no per-seat arithmetic is needed beyond turning coordinates into percentages.

This is verified for one layout, not assumed for all. The renderer reads `canvas` from the deck rather than the image's natural size, so a layout whose image disagrees is merely slightly misaligned rather than broken, and the mismatch is worth checking during verification.

### Crop to the seats by default

On `kl-738` the seats span y 893.7 to 3886.1 of 4213 — roughly a fifth of the drawing is empty nose and tail. Defaulting to a view cropped to the seat bounding box with a small margin removes that dead space, which materially improves the usable size of every seat. The full drawing stays available, because the nose and tail are how a reader orients themselves.

### The deck is the coordinate space, never the layout

Each deck carries its own canvas, its own image and its own seat list — `lh-74h` pairs an 800×5239 main deck with an 800×2507 upper deck. Seat coordinates are meaningless outside their deck. The renderer therefore takes a deck, never a layout, and the deck switcher lives above it. Designators are unique across decks, which is what later lets the manifest join on deck and designator together, but the two decks are never drawn in one coordinate space.

### What a seat encodes is a prop, not a branch inside the seat

A seat renders from a resolved appearance — fill, outline, label, and a text alternative — computed by whichever mode is active. Catalogue mode resolves it from cabin class or AeroLOPA rating; occupancy mode, in a later change, resolves it from a passenger. The seat component itself knows nothing about either. This is the whole reason the manifest will not require a rewrite.

### An absent rating is absent

139 of `kl-738`'s 186 seats have no rating and 124 have no window status. The spec is explicit that an absent rating must not be read as average or neutral, so the rating mode renders unrated seats in their own unrated treatment rather than mid-ramp. This matters because unrated is the majority case, and a mid-ramp fill would imply AeroLOPA had assessed the whole cabin.

### Rotation is handled from the contract, not from the data

Every seat in the seeded data has `rotation: 0` and `reversed: false`, so no seeded layout exercises rotation. Herringbone and staggered business cabins will. Rotation is applied as a CSS transform about the rect's centre and `reversed` flips the orientation indicator, both implemented to the contract and marked in verification as unproven against real data until a rotated layout is catalogued.

### The accessible view is a table, and it is not a fallback

A field of 364 absolutely positioned targets is not navigable in a meaningful order, and the drawing carries information only visually. The seat table is a peer view carrying every seat's designator, cabin, rating, window position and comments, available to everyone rather than hidden behind assistive technology. The diagram is labelled as a figure with the table as its accessible equivalent.

### The provider image is not ours to cache

The images are third-party, versioned by a query string and served with a one-hour cache lifetime. They stay out of the service worker precache, which was deliberately narrowed to js, css and html to keep large media out of the installable bundle. They load as ordinary images with a reserved aspect-ratio box so nothing reflows, and a deck whose image fails still renders its seats over an empty canvas rather than collapsing.

### Dark theme is a deliberate treatment

Both provider variants are drawn for a light background. Inheriting the dark surface would leave a bright rectangle in a dark page. The drawing sits on its own light plate in both themes, so the cabin always reads as a printed diagram rather than as a component that failed to theme. The seat overlay's own colours are themed normally and must clear contrast against the plate, not against the page.

## Risks / Trade-offs

- **The image and the canvas could disagree** on some layout, misplacing every seat. Mitigated by reading geometry from `canvas` and by checking a sample of layouts across manufacturers during verification.
- **First open of an unread layout is slow**, because the API fetches from AeroLOPA on demand. Mitigated with a real loading state that says a cabin is being retrieved, not a bare spinner.
- **Cropping can mislead.** A reader who does not notice the crop may misjudge where a seat sits in the aircraft. Mitigated by making the crop visible and reversible rather than silent.
- **Rotation is unverified.** Accepted: the contract is clear and the seeded catalogue cannot exercise it.

## Migration Plan

No migration. Both surfaces are new and additive.

## Follow-up for the API

`GET /cabin-layout/{id}/seat-map` returns the newest revision and takes no revision parameter. This change is unaffected — the catalogue only ever wants the newest — but the manifest pins a revision at release, and after a refresh there will be no way to fetch the geometry a flight was seated against. Worth resolving before a production refresh.

## Context

The API returns a cabin as a list of seat rectangles positioned in a per-deck coordinate space, alongside a set of AeroLOPA asset URLs — a raster of their own drawing, a neutral variant, an SVG and a seat-rect file. The seat geometry is enough to draw the cabin ourselves. The assets are not needed and are not used.

The provider's drawings are unusually shaped. A narrowbody is a 1:5.3 ribbon; a 747-8's main deck is 1:6.5. Nothing else in the app has that aspect ratio, and the ordinary answer — fit it to the container — produces either a strip too small to touch or a page five screens tall.

## Goals / Non-Goals

**Goals**

- Draw a cabin that fits a page at a size where every seat can be read and touched.
- Make a seat's class, condition and — later — its occupant readable at a glance and precise on inspection.
- Be usable without a pointer and without sight of the drawing.
- Build one component that the manifest can reuse unchanged apart from what colours a seat.

**Non-Goals**

- Reproducing AeroLOPA's drawing. The app draws its own schematic from the seat geometry.
- Loading any provider asset — `image`, `imageNeutral`, `svg` or `seatRects`. Nothing third-party is requested by the page.
- Scale fidelity. The schematic is a diagram of seating order, not a scale drawing of an aircraft.
- Seat selection, booking or editing. Nothing in this system assigns a seat by hand.

## Decisions

### Draw the cabin, do not overlay it

The provider's raster is a 1:5.3 ribbon drawn for a light background, versioned by query string, served from a third-party host. Overlaying it means either a strip 150px tall on a wide page or a page the reader scrolls for five screens; it also means a bright rectangle in a dark page, a load state, a failure state, and a third-party request from an installable app.

Drawing the cabin from the seat geometry removes all of that. The seat rectangles are the only input, they are already in the response, and they carry everything the drawing needs. The trade is scale fidelity, which the interface must therefore not claim.

### Transposed and gutter-compressed, because that is what makes it fit

Two transforms turn a 1:5.3 ribbon into something page-shaped.

The cabin is **transposed** — the provider's fore-aft axis becomes the horizontal, so the aircraft reads nose-left, tail-right, matching how an aircraft is drawn everywhere else in this app.

Empty structure is then **compressed**. On `kl-738` the seats span y 893.7 to 3886.1 of a 4213 canvas: a fifth of the drawing is nose and tail holding nothing. Galleys and lavatories between cabins are similarly empty. Each cabin section is packed at its own true internal spacing and separated by a fixed gutter of about one seat length, and the nose and tail become short caps rather than their drawn extent. Seats keep their real relative positions within a cabin; only the dead space between cabins is squeezed.

The result is a diagram whose space is spent almost entirely on seats. That is the point, and it is also why the drawing must not be read as a scale plan.

### Transposition preserves the rotation angle

Source coordinates map to rendered coordinates as `(x, y) → (y, C − x)` — a proper rotation, determinant +1, not a reflection. Angles therefore survive unchanged, so a seat's `rotation` is applied as a CSS rotation about its own centre with no correction. Had the transform been a mirror the sign would need flipping; it is worth stating because it is not obvious by inspection.

This matters more than the seeded `kl-738` suggested. Herringbone cabins are live in the catalogue: `aa-77w` carries rotations from −30.7° to +32.8° and `lh-74h` from −19.8° to +20.4°. `reversed` is false throughout every seeded layout and remains implemented from the contract alone.

### The minimum readable seat governs the width, not the container

A cabin narrower than about 12px per seat along the fuselage cannot be touched or read. The diagram therefore computes a minimum scale from the mean seat length and the tightest letter spacing, and scrolls horizontally when the container is narrower than that. A cramped-but-scrollable cabin beats an unusable one that fits.

Where a layout has two decks, both are measured against the wider deck's frame so that the upper deck is drawn at the same scale as the main deck rather than stretched to the same width. A 32-seat upper deck must look like a 32-seat upper deck.

### What a seat encodes is a prop, not a branch inside the seat

A seat renders from a resolved appearance — fill, marker, and a text alternative — computed by whichever mode is active. Catalogue mode resolves it from cabin class or AeroLOPA rating; occupancy mode, in a later change, resolves it from a passenger. The seat component itself knows nothing about any of them. This is the whole reason the manifest will not require a rewrite.

### An absent rating is absent

139 of `kl-738`'s 186 seats have no rating; 246 of `lh-74h`'s 332 do not. Unrated is the majority case in every seeded layout. Rendering it mid-ramp would imply AeroLOPA had assessed the whole cabin, so unrated seats take their own treatment, outside the rating ramp entirely.

### Per-seat cabin governs the drawing; the provider's cabin descriptions do not

The two disagree, and the contract says so: a seat's cabin "on a flexible cabin may disagree with the cabin descriptions". `de-321` proves it — one cabin description, `M`, claiming 220 seats over rows 1 to 38, while the seats themselves report 36 business and 184 economy.

The drawing and every count therefore derive from the per-seat `cabin`. The provider's cabin descriptions are presented as what they are: AeroLOPA's own prose about the cabin, with its rows, pitch, width and recline, and not as a seating breakdown.

### The accessible view is a table, and it is not a fallback

A field of 364 absolutely positioned rotated targets is not navigable in a meaningful order, and the drawing carries information only visually. The seat table is a peer view carrying every seat's designator, cabin, rating, window position and comments, available to everyone rather than hidden behind assistive technology. The diagram is labelled as a figure with the table as its equivalent.

The aircraft's cabin tab is the exception, and deliberately so: it is a preview beside the assignment controls, not the place a cabin is read in full. It draws the diagram alone and links to the catalogue entry one click away, where the cabin descriptions and the seat table live. Every seat there remains a focusable control naming its designator, cabin, rating and window position, so nothing is lost to assistive technology — only the convenience of the table, which the link restores.

### Blocked, crew rest and unbookable are implemented from the contract

No seeded layout carries a blocked seat, a crew-rest seat or an unbookable one — every one of the 1,074 seeded seats is bookable and unblocked. The markers are implemented from the contract and verified by construction, not by observation, and that is recorded rather than glossed.

## Risks / Trade-offs

- **The schematic is not a scale plan.** A reader may misjudge how far apart two cabins really are. Mitigated by compressing only the space between cabins, keeping true spacing within one, and labelling the drawing as schematic rather than implying survey accuracy.
- **First open of an unread layout is slow**, because the API fetches from AeroLOPA on demand. Mitigated with a loading state that says a cabin is being retrieved rather than a bare spinner.
- **The provider can be down.** `GET /cabin-layout/{id}/seat-map` answers 502 when AeroLOPA is unavailable — `kl-77w` does so today — which is a different thing from an uncatalogued layout's 404 and must not be reported as one.
- **Blocked, crew-rest and reversed are unverified against real data.** Accepted: the contract is clear and the seeded catalogue cannot exercise them.

## Migration Plan

No migration. The catalogue surfaces are new; the aircraft's cabin tab gains modes and peers around a diagram already in place.

## Follow-up for the API

`GET /cabin-layout/{id}/seat-map` returns the newest revision and takes no revision parameter. This change is unaffected — the catalogue only ever wants the newest — but the manifest pins a revision at release, and after a refresh there will be no way to fetch the geometry a flight was seated against. Worth resolving before a production refresh.

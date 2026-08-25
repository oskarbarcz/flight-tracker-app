## Why

The API generates a seated passenger manifest from the preliminary loadsheet, regenerating it on every update until the flight is released, then reconciles it against the final loadsheet when boarding finishes, and serves it at a dedicated endpoint. Nothing reads it. A flight can be planned, released, boarded, flown and closed while the app never once says who was on board or where they sat.

This is the payoff for the two changes before it. Assigning a cabin layout is only worth doing because a manifest follows; drawing a cabin is only worth doing because passengers sit in it.

The manifest is also the first surface in the app with a per-passenger record, and it carries special service codes — infants, wheelchair categories, unaccompanied minors, blind and deaf passengers. Read live, LH880 carries 21 such passengers among 178. How those are presented is a matter of judgement, not just layout, and the spec settles it here.

## What Changes

- Add a **manifest surface for operations** as a new tab on the flight, showing the cabin with its seats occupied and a passenger table beside it.
- Add an **occupancy mode** to the seat diagram, resolving each seat's appearance from the passenger occupying it.
- List passengers with **seat, deck, cabin, name, booking reference, status and special service code**, filterable by cabin and by status.
- Report the **pinned layout and revision**, because a manifest describes the cabin as it was when the flight was seated and not as it is now.
- Distinguish the **three reasons a manifest may be absent** — no preliminary loadsheet has been written yet, the aircraft carries no cabin layout, or the reader may not see it — each of which the API answers as a 404 or 403 with a different meaning.
- Show **no-shows** as retained passengers holding their seat, not as missing rows.
- Add a **manifest surface for the pilot** commanding the flight, reusing the same components under the access the API allows.
- Present **special service codes as a per-passenger fact** in the manifest row and on the seat, never as a headline, a hero figure or a summary statistic.

## Capabilities

### New Capabilities

- `flight-passenger-manifest`: how a flight's seated passengers are read — the occupied cabin, the passenger list and its filters, the pinned revision, no-shows, special service codes, and the distinct states in which no manifest exists.

### Modified Capabilities

<!-- None. `cabin-seat-diagram` is introduced by `display-cabin-seat-maps`, which is not
     yet archived; the occupancy mode it gains here is specified as part of
     `flight-passenger-manifest` rather than as a delta against an unpublished spec. -->

## Dependencies

Requires `connect-aircraft-to-cabin-layouts` for the slice and the assignment surface, and `display-cabin-seat-maps` for the seat diagram whose occupancy mode this change supplies. Neither is optional: without an assignment no manifest is ever generated, and without the diagram there is no cabin to fill.

## Impact

- **Frontend code**: new `app/features/flight/components/Manifest/` for the table, filters and summary; an occupancy resolver added to `app/features/cabin-layout/lib/seatAppearance.ts`; `fetchManifest(flightId, status)` on `FlightService`; manifest types and the `SsrCode` and `PassengerStatus` enums with their translators in the `cabin-layout` slice.
- **Routes**: a manifest route under the existing `FlightLayout` in `app/routes.ts` with an entry in `FlightTabs`; a pilot-facing entry point from the tracking dashboard.
- **API**: consumes `GET /api/v1/flight/{id}/manifest` with the optional `status` filter, alongside `GET /api/v1/cabin-layout/{id}/seat-map`. Deployed; no API work.
- **The join, verified live**: on LH880 the manifest's 178 passengers resolve to 178 unique `deck` plus `designator` pairs with **zero unmatched** against `lh-74h`'s 364 seats, leaving 186 free. The composite of deck and designator is the key; designator alone is not, even though the API guarantees designators are unique across decks.
- **Revision risk**: the manifest reports `cabinLayoutRevision`, but `GET /cabin-layout/{id}/seat-map` takes **no revision parameter** and returns only the newest. Today they agree — both revision 1 on LH880 — but after any refresh a seated flight would be drawn against geometry it was not seated on. The app must detect the disagreement and say so rather than draw a wrong cabin silently.
- **Data shape**: `passengerCount` and `passengersByCabin` are reported **on the filtered basis**, so they change with the status filter and cannot be treated as flight totals. `ssr` is nullable. Names are unicode — `Levent Büker`, `Herr Lennard Rink` — so no ASCII assumption may enter sorting or filtering.
- **The three absent-manifest states, verified live**: *"Flight has no manifest yet. It is generated from the preliminary loadsheet."*, *"Aircraft flying this flight has no cabin layout assigned, so the flight has no manifest."*, and a 403 for a pilot who does not command the flight.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: the passenger table is the primary reading of a manifest and must stand alone. WCAG 2.1 AA in both themes.

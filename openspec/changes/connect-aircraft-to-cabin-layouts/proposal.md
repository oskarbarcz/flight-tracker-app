## Why

The API has shipped a mirrored AeroLOPA cabin catalogue, immutable seat-map revisions and a hand-assignment endpoint, and nothing in the app consumes any of it. A search across `app/` for `cabinLayout`, `seatMap`, `manifest` or `passengersByCabin` returns three unrelated hits — the PWA web manifest and two landing-page strings.

Assignment is the gate on everything else. A flight only receives a passenger manifest if the aircraft flying it carries a cabin layout, and a flight whose aircraft has none is planned, released and boarded exactly as before, silently, generating nothing. Read live against the seeded API, `GET /flight/{id}/manifest` answers two of the three test flights with *"Aircraft flying this flight has no cabin layout assigned, so the flight has no manifest."* Today the app offers no way to discover that, and no way to fix it.

The seeded fleet also shows what unattended assignment looks like. Of Lufthansa's seven A330-900s, two carry no layout and five carry `lh-74h` — a 747-8 cabin. The API reports each of those five as `mismatched: true` and accepts them deliberately, because AeroLOPA covers neither every airline nor every type. Operations needs to see that state, not be protected from it.

## What Changes

- Add a **`cabin-layout` feature slice** holding the catalogue and seat-map types, the service, and the enum translators every later surface reuses.
- Extend **`Airframe`** with `iataType` and `serviceType`, and **`Aircraft`** with `cabinLayout`. Cabin layouts are keyed by IATA type code while aircraft are keyed by ICAO designator, so without `iataType` no aircraft can be matched to a layout at all.
- Add an **`AircraftCabinLayoutCard`** to the aircraft details page reporting the assigned layout, its revision, and whether it is retired or mismatched — and, when nothing is assigned, naming the consequence rather than just showing an absence.
- Add an **`AssignCabinLayoutModal`** built in **two tiers**: the ranked suggestions the API offers, then a filter-driven browse over the full catalogue for when the suggestions do not fit.
- Report **cabin coverage in the fleet list**, which costs no extra request because `cabinLayout` already rides on the fleet response.
- Let operations **remove** an assignment.

The seat diagram, the catalogue browser as a destination of its own, and the passenger manifest are deliberately out of scope and follow as separate changes. This change links to a seat map it does not yet draw.

## Capabilities

### New Capabilities

- `aircraft-cabin-layout-assignment`: how operations sees, assigns, replaces and removes the cabin layout of an aircraft — the ranked suggestions, the fallback browse, the mismatch and retirement flags, and what an aircraft without a layout tells the reader.

### Modified Capabilities

<!-- None. No existing spec describes the aircraft details page or the fleet list. -->

## Impact

- **Frontend code**: new `app/features/cabin-layout/` slice (`model.ts`, `service.ts`, `i18n.ts`, `index.ts`); `cabinLayoutService` registered in `app/shared/api/useApi.tsx`; new `AircraftCabinLayoutCard` and `AssignCabinLayoutModal` under `app/features/aircraft/components/AircraftDetails/`; a column in `AircraftListTable`; three new methods on `AircraftService`; `Airframe` and `Aircraft` in `app/features/airframe/model.ts` and `app/features/aircraft/model.ts`.
- **Routes**: none. The card and modal live inside the existing `AircraftDetailsRoute`.
- **API**: consumes `GET .../aircraft/{id}/cabin-layout/suggestions`, `PUT` and `DELETE .../aircraft/{id}/cabin-layout`, and `GET /api/v1/cabin-layout` for the fallback browse. All three are deployed; no API work.
- **API constraints that shape the UI**: the catalogue list accepts only exact-code filters — `airlineIata` is validated `@Length(2, 2)` and `aircraftIata` `@Length(2, 6)` — with **no free-text search**, and `limit` is capped at `@Max(200)` against a production catalogue of roughly 1566 layouts. The existing `AdvancedSelect` filters client-side over a preloaded array and therefore cannot back a full-catalogue picker; it can only serve a set already narrowed by airline or type.
- **Data shape**: `cabinLayout` is nullable. Within it, `variant` and `revision` are nullable, and `revision` is null until the seat map has been read for the first time, because versions are fetched lazily. `airframe.iataType` is null for airframes IATA publishes no code for, which reduces suggestions to airline matches only.
- **Versioning**: `package.json` must be bumped before merge, as `bin/check_version_is_free` enforces.
- **Accessibility**: the mismatch and retirement flags must not rely on colour alone, and the modal's two tiers need a coherent focus order. WCAG 2.1 AA in both themes, per `DESIGN.md`.

## Context

AeroLOPA keys cabin layouts by airline IATA code and aircraft IATA type code, and keeps no register of individual aircraft. There is therefore no correct automatic mapping from an aircraft to a cabin — the API says so explicitly, and makes assignment a judgement operations records by hand. This change builds the surface for that judgement.

Everything downstream depends on it: a flight seats a manifest from its preliminary loadsheet only if a layout is assigned, and pins that layout and revision when it is released.

## Goals / Non-Goals

**Goals**

- Make an aircraft's cabin state legible at both the fleet and the individual level.
- Make the common assignment one click, and the uncommon one possible.
- Show the two flags the API deliberately does not enforce — mismatch and retirement — without turning either into an error.

**Non-Goals**

- Drawing the cabin. The card links to a seat map that a later change builds.
- Browsing the catalogue as a destination in its own right.
- Bulk assignment across a fleet. The API has no endpoint for it, and the judgement is per-aircraft.
- Any automatic or inferred assignment.

## Decisions

### The picker has two tiers, because the catalogue cannot be searched

`GET /api/v1/cabin-layout` filters only by `airlineIata` (exactly two characters), `aircraftIata` (two to six) and `retired`. There is no free-text search and no partial matching, and `limit` is capped at 200 while production holds roughly 1566 layouts. A single search box over the catalogue is therefore not buildable.

Tier one is `GET .../cabin-layout/suggestions`, which returns a short ranked list — read live, KLM's PH-BXA returns two candidates and Lufthansa's D-AIMC returns one. Grouped under headings by the `match` field (`exact`, `airline`, `aircraft_type`), this resolves the normal case immediately.

Tier two is a browse: an airline-code field and a type-code field over the catalogue list, paged. It must always be reachable, because the API permits assigning any catalogued layout and the suggestion list is explicitly advisory.

### `AdvancedSelect` is not reused for tier two

`AdvancedSelect` takes a fully materialised `options` array and filters it client-side. That is correct for airports and airframes, which are small and fully loadable, and wrong here: the catalogue cannot be fetched in one request. Tier two is a paged list with its own filter fields. Tier one, being a handful of items already in memory, could use `AdvancedSelect`, but presenting the two tiers in visibly different idioms would obscure that they choose the same thing — so both are rendered as the same grouped, selectable list.

### A mismatch is a warning the reader resolves, not a validation error

The API returns `mismatched: true` when the layout's airline or type differs from the aircraft's, and accepts the assignment regardless. The card shows it as a caution with the specific disagreement spelled out — an A330-900 carrying a 747-8 cabin should say so — and the modal never filters mismatched candidates out. Blocking the assignment would contradict the API and remove the only cabin available to operators AeroLOPA does not cover.

### A null revision is a distinct state from an assigned revision

`revision` is null until the seat map has been read for the first time, because versions are fetched lazily. "Assigned, never fetched" and "assigned, revision 1" are different facts and read differently on the card. Neither is an error, and the card does not trigger a fetch to resolve it.

### Assignment stays out of the aircraft form

The API models assignment as its own `PUT`/`DELETE` rather than a field on aircraft create or edit. The app follows that: the card owns the action, and `AircraftIdentificationFormSection` and the edit route are untouched. Folding it into the form would imply an aircraft cannot be registered without a cabin, which is false, and would make removal a matter of clearing a field.

### Coverage in the fleet list is free

`cabinLayout` is present on `GET .../aircraft` as well as on the single read, verified live. A coverage column therefore costs no request and is the only place operations sees the whole fleet's cabin state at once — which is where the seeded Lufthansa fleet's five mismatches and two gaps actually become visible.

## Risks / Trade-offs

- **Tier two is a poor discovery tool.** Requiring an exact two-letter airline code is unfriendly, but it is the only filter the API offers. Mitigation: the aircraft's own operator and IATA type prefill the fields, so the browse opens on the most likely set rather than on nothing.
- **The suggestion list can be empty or misleading.** An airframe with no `iataType` can only ever match on airline. The modal states this rather than presenting a thin list as though the catalogue were sparse.
- **A coverage column adds width** to an already wide fleet table. It is rendered as a compact indicator rather than a text column, and is the first candidate to drop at narrow breakpoints.

## Migration Plan

No migration. Every field being added is already served by the deployed API, and every surface is additive. Aircraft with no layout keep working exactly as they do now.

## Follow-up for the API

`GET /cabin-layout/{id}/seat-map` accepts no revision parameter, so only the newest revision can ever be read. A flight pins `cabinLayoutRevision` at release, and once a layout is refreshed past that revision there is no way to fetch the geometry the flight was actually seated against. This does not affect this change — nothing here reads a seat map — but it will affect the manifest, and is worth raising before a refresh happens in production.

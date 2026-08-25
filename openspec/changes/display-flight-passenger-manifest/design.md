## Context

A manifest is two readings of one thing: a cabin with seats filled, and a list of people. Neither is sufficient. The cabin answers where, at a glance, and cannot be scanned, sorted or read aloud; the list answers who, precisely, and says nothing about the shape of the load. This change builds both over one fetch and keeps them in step.

It also lands the first per-passenger record in the app, including special service codes for infants, wheelchair users, unaccompanied minors, and blind and deaf passengers. That is the part most likely to be got wrong by treating an interesting field as an interesting statistic.

## Goals / Non-Goals

**Goals**

- Say who is on board, where they sit, and which of them did not turn up.
- Keep the drawing and the list describing exactly the same set at all times.
- Be honest about which cabin the manifest describes, including when the app cannot obtain it.
- Distinguish the three ways a manifest can be unavailable, because they call for three different responses from the reader.

**Non-Goals**

- Editing a manifest. Passengers are generated and reconciled by the API; nothing here writes.
- Seat assignment or reseating.
- Boarding progress. Reconciliation happens once, when boarding finishes.
- Manifests for flights whose aircraft has no cabin layout. There is nothing to show and the fix is an assignment, not a view.

## Decisions

### The passenger table is the primary reading

The cabin drawing is the more attractive of the two and the less capable. The table is sortable, filterable, readable without sight of the diagram, and works at any width; the drawing is a 1:6.5 ribbon. So the table carries the manifest and the drawing accompanies it. On narrow screens the drawing collapses first.

This also settles the accessibility question without a special path: the accessible reading of a manifest is the manifest.

### Occupancy is a third appearance resolver, not a new component

The seat diagram already resolves a seat's appearance from a mode. This change adds an occupancy resolver keyed by deck and designator, and changes nothing else about `Seat` or `DeckCanvas`. A seat is then free, occupied, or held by a no-show, with the passenger reaching the seat detail panel.

### The join key is deck plus designator

Verified against LH880: 178 passengers resolve to 178 unique deck-and-designator pairs with nothing unmatched among `lh-74h`'s 364 seats. The API does guarantee designators are unique across decks, so designator alone would work today — but the manifest reports a deck for every passenger precisely because seats belong to a deck, and joining on both is correct rather than incidentally sufficient.

### A revision disagreement is reported, never rendered through

The manifest pins `cabinLayoutRevision`; the seat-map endpoint serves only the newest revision and accepts no revision parameter. When the two disagree, the seats the manifest names may not exist in the geometry available, and drawing anyway would place passengers in the wrong seats or drop them silently.

So: compare the two, and when they differ, keep the passenger table — which is complete and correct on its own — and replace the drawing with a statement that the cabin has been redrawn since this flight was seated. This is the one case where showing less is the only correct answer, and it is why the table has to be the primary reading rather than a companion to the diagram.

### Filtered counts are labelled as filtered

`passengerCount` and `passengersByCabin` describe only the passengers matching the active status filter. Presenting them as flight totals would be wrong the moment a filter is applied. The summary therefore names what it is counting, and the unfiltered totals are what the reader sees by default.

### Status filtering goes to the server

The endpoint takes `status`, and the counts come back consistent with it. Filtering client-side would require recomputing `passengersByCabin` locally and would put two sources of the same number in the app. Cabin filtering, which the API does not offer, stays local and is applied to the list only — never to the summary counts, which would then disagree with the server.

### Special service codes are a row-level fact

Twenty-one of LH880's 178 passengers carry a code, among them two unaccompanied minors and one passenger needing full cabin wheelchair assistance. These are real categories of vulnerability, and they are not a metric, a highlight, or a way to make the screen interesting.

They appear in the passenger's own row, in the seat detail panel, and as a filter for crew who need to find them. They do not appear as a hero figure, a summary tile, a count in a header, or a badge on the flight. The code is shown with its meaning, not as a bare acronym, because the reader is not required to know IATA's abbreviations.

### No-shows keep their seat and their row

The API retains a no-show and records the seat they were assigned, and no boarded passenger occupies it. The app matches that: a no-show is a distinct seat state in the drawing and a distinct status in the table, never a removed row or an empty seat. Reconciliation is a change at the edges of a manifest, and the manifest should read that way.

### Three absent states, three different sentences

All three arrive as errors, and collapsing them would be actively misleading — telling operations the aircraft is uncatalogued when the flight merely has no loadsheet yet sends them to fix the wrong thing. No preliminary loadsheet is a matter of filling one in; no cabin layout is a matter of an assignment, and links to the aircraft; forbidden is a matter of access. Each says which.

The manifest is generated from the preliminary loadsheet and regenerated on every update to it, so an absent manifest on a flight that has a cabin layout means the loadsheet has not been written. Once the flight is released the preliminary loadsheet is frozen — the API refuses to update it — and the manifest it produced is what boarding later reconciles.

## Risks / Trade-offs

- **Two requests, two failure modes.** The manifest and the seat map are separate fetches. The table renders as soon as the manifest arrives and does not wait on the drawing; a failed seat map costs the drawing, not the manifest.
- **Cabin filtering is local while status filtering is remote.** A visible inconsistency in where filtering happens. Accepted, because the alternative is either a second source for the counts or fetching per cabin.
- **Large manifests.** 364 seats and several hundred rows are within reach of ordinary rendering, but the table should not gain per-row work that turns linear into quadratic.
- **The revision guard may fire often** once refreshes run in production, leaving flights without a drawing. That is the correct behaviour and an argument for the API follow-up, not for rendering anyway.

## Migration Plan

No migration. The surfaces are new, and flights whose aircraft carry no layout behave exactly as they do now.

## Follow-up for the API

Add a revision parameter to `GET /cabin-layout/{id}/seat-map`, or serve the pinned geometry from the manifest itself. Until then a refreshed layout permanently costs every already-seated flight its cabin drawing. This is the third change in a row to record the same gap, and it is now load-bearing.

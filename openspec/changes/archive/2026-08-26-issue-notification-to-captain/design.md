## Context

See proposal.md — Why.

`display-flight-cargo-manifest` has landed, so the special handling code and hazard vocabulary exist and the cargo slice conventions are settled. This change does not consume the hold diagram: the notification reports positions as designators in text, so there is no join and the hold catalogue's designator defect never reaches here.

Two things make this change different from the two before it. The notification is a **document**, not a screen — it has a real-world layout, a real-world purpose and a reader who may want it on paper. And one payload shape is still uncaptured: `FlightNotoc.changes` is a bare `type: object`, null on every preliminary notification by definition, and all four seeded notifications are preliminary. No final notification exists anywhere in the seeded data.

## Goals / Non-Goals

**Goals:**

- A document a pilot would recognise, and could print and put beside the yoke.
- Drill text rendered exactly as supplied, because it is emergency procedure.
- Hazard marks where they belong — on the facsimile — without leaking the standard's palette into the app.
- Two forms of one content, never two sources of truth.

**Non-Goals:**

- Acknowledging the document. Acceptance follows from checking in and from finishing boarding; there is no separate action and this change adds none.
- Composing, summarising or interpreting any drill.
- A server-rendered PDF. The API exposes none and the print path covers the need.
- Reconciling the notification's figures against the manifest's. They use different definitions and the design keeps them apart rather than resolving them.

## Decisions

### Capture the changes shape before modelling it

The first task takes a seeded flight through `POST /flight/{id}/finish-boarding` and captures the final notification. Nothing about the changes summary is modelled before that payload is in hand.

*Alternative considered — modelling it defensively from the field description* ("what changed since the preliminary document"). Rejected: a guessed shape here would produce a summary that renders nothing, or worse renders something misleading, on the one surface where being wrong matters most. The spec is written so the change report is presented when present and absent when not, which is true regardless of shape, but the renderer waits for the real thing.

This is a task, not a blocker. Two of the four seeded notifications sit on flights at `boarding_started`, so the capture is a single request away.

### One content model, two renderers

The panel and the document render the same resolved notification. Neither transforms the data differently; they differ in layout, in typography and in how hazard is presented. A test that the two carry the same entries is cheap and prevents the document quietly falling behind the panel as the slice grows.

*Alternative considered — the document as the only form*, with the panel dropped. Rejected: the document is the right thing to print and the wrong thing to scan inside a dashboard, and the tracking dashboard is where a pilot actually lives.

### Hazard colour is confined to the document, and never carries meaning alone

The in-app panel uses the semantic quartet already in the design system. The document carries true hazard marks in their standard colours, because there the app is reproducing a real form rather than designing a surface.

Both forms state the class number and the proper shipping name beside every mark. That is what makes the confinement safe: the mark is recognition, the text is the meaning. It also satisfies the monochrome case, which is not hypothetical — a printed notification that loses its meaning on a mono printer is worse than no document.

*Alternative considered — hazard diamonds everywhere.* Rejected against DESIGN.md's near-monochrome palette and the Signal-Not-Decoration rule; eight new hues on an app surface would compete with the one accent the system allows.

*Alternative considered — no diamonds at all.* Rejected because the facsimile is the distinctive artifact and a form without its hazard marks is not a facsimile.

### The print path is a stylesheet, not a second document

Printing is handled by print styles over the document form: navigation and controls suppressed, a light ground forced regardless of theme, and entries kept whole across page boundaries where the page allows. No separate print-only markup is built.

A second markup tree for print is a second thing to keep correct, and the divergence would be invisible until someone printed.

### Drill text is rendered, never processed

Each drill arrives with five fields of prose. They are rendered as supplied — no truncation, no summarisation, no reflowing into a shorter form for a narrow screen. Where space is tight the layout adapts around the text rather than the text being cut.

This is emergency procedure. The app has no standing to abridge it.

### The notification's counts stay the notification's

The document splits `CV2020`'s load into 4 containers and 3 pallets where the manifest counts 7 units. Both are correct under their own definitions. The document keeps its own split and its own labels, and no surface presents one as the other. No reconciliation is attempted, because there is nothing wrong to reconcile.

### Gap resolution follows the manifest's pattern

A discriminated state resolved to a notification or a named gap — not-issued, forbidden, failed — mirroring `useFlightCargo` and, behind it, `useFlightCabin`. The stage is a parameter of the read, defaulting to the latest issued.

`not-issued` carries a specific message: the notification is issued from the preliminary loadsheet, and the final one when boarding finishes. That is more useful than a generic absence, and it is what the API's own 404 says — verified live, a flight still in `created` carrying a preliminary loadsheet already has a notification, and one without a loadsheet has none.

## Risks / Trade-offs

- **`FlightNotoc.changes` is unmodelled until captured.** → First task of the change; the capture is one request against a seeded flight already at `boarding_started`. The spec holds regardless of shape.
- **The document may be mistaken for a legally valid notification.** → It is a simulation artifact in a simulation product; it carries the flight and stage it records and the moment it was issued, and it makes no claim of validity. The product's whole register is procedural realism, and this is the same claim every other document in it makes.
- **Hazard marks on paper, semantic badges on screen, is an inconsistency a reader may notice.** → It is a deliberate one, stated in the design and visible in the spec: the document is a reproduction, the panel is a surface. Both carry class number and shipping name, so neither depends on the mark.
- **Drill prose is long and the tracking dashboard is narrow.** → The drill is progressively disclosed in the panel and rendered whole in the document; it is never abridged in either.
- **Two renderers can drift.** → One resolved model, and a verification task comparing what the two forms carry.
- **Only preliminary notifications exist, so the stage switch is exercised on one side only.** → Capturing the final notification also exercises the switch, and it is the same task.

## Migration Plan

Additive. A new slice and two surfaces on existing routes; no new top-level route, no schema change, nothing written. The only state touched anywhere is the seeded flight advanced through finish-boarding to capture a payload, which is an ordinary operational transition on development data and affects no production behaviour.

`package.json` must be bumped before merge.

## Open Questions

- Whether the panel opens on the latest stage or on the final one specifically when both exist. It changes no requirement and no task, and is better settled once a real final notification is in hand.

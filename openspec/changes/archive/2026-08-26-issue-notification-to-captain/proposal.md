## Why

A commander is entitled to know what is in the hold before they accept the aircraft. In real operations that entitlement takes the form of a specific document — the notification to captain — handed over before departure, listing every dangerous good with its position and its emergency response drill, every special load, and the weight in each compartment. Freighter crews handle one every flight.

The API issues it. A preliminary notification from the preliminary loadsheet and a final one when boarding finishes, each an immutable record of the load at that moment, each carrying the drill chart text for every hazard aboard, the final one reporting what changed since the preliminary. Four seeded flights carry one today and the app shows none of them.

No product in flight simulation produces this document. It is the single most distinctive artifact in this body of work, and unlike the manifest — which is a screen — it is a thing a pilot should be able to print and put beside the yoke.

## What Changes

- Add a **`notoc` feature slice** with the notification types, its service and the labels for hazard classes, packing groups and regimes.
- Add a **`useFlightNotoc` hook** resolving a flight to a notification or to a named gap — not issued, forbidden, failed — and letting the reader choose a stage.
- Add the **in-app panel**: the statement, the dangerous goods, the special loads, the cold chain assessments and the load summary, in the app's own conventions and using the semantic badges rather than hazard colours.
- Add the **printable document**: a faithful facsimile of the form, laid out as the document is laid out, carrying true hazard diamonds in their standard colours, with a print stylesheet so it prints as a document rather than as a web page.
- Present the **drill for every dangerous good** — the emergency response code, the inherent risk, the risk to aircraft and occupants, the spill and fire procedure and the additional risks the drill letter adds.
- Report the **acknowledgement**: who accepted the document and when, given that acceptance happens through checking in and through finishing boarding rather than through a separate action.
- Let the reader move between the **preliminary and final stages**, and present **what changed** between them on the final one.
- Report the **load summary** — compartment weights and dry ice, container, pallet and loose lot counts, cargo, baggage and deadload weights, and what continues beyond — keeping the document's own container and pallet split distinct from the manifest's unit count.
- Surface it for the **pilot as a pre-departure artifact**, read-only for **operations**, and for **cabin crew only on a flight they captain**.

## Capabilities

### New Capabilities

- `flight-notoc`: how a flight's notification is read — its stages, the statement it always carries, the dangerous goods and their drills, the special loads, the cold chain assessments, the load summary, the acknowledgement, what changed between stages, and the states in which there is none to read.
- `notoc-document`: the printable facsimile — how the form is laid out, how hazard is presented on paper as against on screen, and how it behaves when printed.

### Modified Capabilities

<!-- None. -->

## Impact

- **Frontend code**: a new `app/features/notoc/` slice — `model.ts`, `service.ts`, `i18n.ts`, `hooks/useFlightNotoc.ts`, `lib/hazardLabel.ts` for the diamond, and components for the panel, the document, the drill card and the changes summary.
- **Routes**: a notification surface on the pilot's tracking dashboard and on the operations flight file. No new top-level route.
- **API**: consumes `GET /api/v1/flight/{id}/notoc` with and without `stage`. Deployed; no API work.
- **Depends on `display-flight-cargo-manifest`** for the special handling code and hazard labels and for the shared cargo vocabulary. It does not depend on the hold diagram: the notification reports positions as designators, not as a drawing.
- **One payload shape is still uncaptured**: `FlightNotoc.changes` is declared a bare `type: object`, is null on every preliminary notification by definition, and all four seeded notifications are preliminary. No final notification exists anywhere. The first task of this change is to take a seeded flight through finish-boarding and capture the shape before the changes summary is modelled.
- **The other two unknowns are now captured**: `NotocSpecialLoad.heaviestPiece` is `{ kg, lengthCm, widthCm, heightCm }` or null, observed on `CV2020`'s landing gear leg at 1 600 kg over 340 × 130 × 150 cm; the cold chain entry carries waybill, description, regime, risk, margin hours, explanation and the always-true advisory flag.
- **A clean flight still carries a document**: three of the four seeded notifications report no dangerous goods and carry the statement "No dangerous goods loaded." rather than an empty document. The statement is the point, not a fallback.
- **Acknowledgement is already present in the data**: `AA2018` and `AA2019` report an acknowledging pilot and a timestamp, `AA2021` and `CV2020` report neither. Both states occur and both are ordinary.
- **Positions match the manifest, not the catalogue**: the notification reports `6AL`, `6BL` and `6CL` on `CV2020`, agreeing with the cargo manifest and with the documented convention, and disagreeing with the hold catalogue. The designator is presented as text here, so no join is needed and the catalogue defect does not reach this change.
- **The document's counts are its own**: the notification splits `CV2020`'s load into 4 containers and 3 pallets where the manifest counts 7 units. The document keeps its own split and the two are never presented as the same figure.
- **Hazard colour is confined to the printed document**: the in-app panel uses the semantic quartet already in the design system, and the true hazard diamond colours appear only on the facsimile, where the form is a reproduction of a real document rather than an app surface.
- **Drill text is supplied, not composed**: every drill arrives with its emergency response code, inherent risk, risk to aircraft and occupants, spill and fire procedure and additional risks. The app renders it and writes none of it.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: WCAG 2.1 AA in both themes for the panel; the printed document is additionally checked for legibility in monochrome, since a hazard diamond that carries meaning only in colour is unreadable on a mono printer.

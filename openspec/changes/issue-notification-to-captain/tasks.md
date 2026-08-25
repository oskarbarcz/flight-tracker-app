## 1. Capture the missing payload

- [ ] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [ ] 1.2 Take a seeded cargo flight at `boarding_started` — `AA2018` or `AA2019` — through `POST /flight/{id}/finish-boarding` and capture the final notification
- [ ] 1.3 Record the observed shape of `FlightNotoc.changes`, which is declared a bare `type: object` and is null on every preliminary notification
- [ ] 1.4 Confirm on the captured payload whether the final notification's acknowledgement is populated by the request that finishes boarding

## 2. Slice, model and service

- [ ] 2.1 Create the `app/features/notoc/` slice with `model.ts`, `service.ts`, `i18n.ts` and `index.ts`
- [ ] 2.2 Type `FlightNotoc`, `NotocDocument`, `NotocDangerousGoods`, `NotocSpecialLoad`, `NotocColdChain`, `NotocLoadSummary`, `NotocCompartmentLoad` and `NotocDrill` by hand against captured payloads, keeping `acknowledgedById` and `acknowledgedAt` nullable despite the schema declaring them `type: object`
- [ ] 2.3 Type `heaviestPiece` as `{ kg, lengthCm, widthCm, heightCm }` or null, as observed on `CV2020`'s landing gear leg
- [ ] 2.4 Model `changes` against the shape captured in task 1.3
- [ ] 2.5 Add the enums `NotocStage` (`preliminary`, `final`) and `HazardClass` covering all fifteen values, and translate hazard class, subsidiary risk, packing group and regime in `i18n.ts`
- [ ] 2.6 Add `NotocService` with `fetchByFlightId(id)` and `fetchByFlightId(id, stage)`, registering it in `useApi()`
- [ ] 2.7 Add `hooks/useFlightNotoc.ts` resolving a flight to a notification or a named gap — `not-issued`, `forbidden`, `failed` — defaulting to the latest issued stage
- [ ] 2.8 Add `lib/hazardLabel.ts` returning the standard mark and colours for a hazard class, used only by the document form

## 3. The in-app panel

- [ ] 3.1 Build the panel presenting the statement prominently whether or not dangerous goods follow it
- [ ] 3.2 Render the dangerous goods entries with waybill, proper shipping name, UN number, hazard class, subsidiary risk, packing group, packages, net quantity per package, unloading airport, position and compartment
- [ ] 3.3 Use the semantic badges for hazard on the panel and introduce no hazard-standard colours there
- [ ] 3.4 State a cargo aircraft restriction in words
- [ ] 3.5 Present an entry reporting no position as loose load or as an uncurated airframe type, never as missing data
- [ ] 3.6 Build the drill card rendering emergency response code, inherent risk, risk to aircraft and occupants, spill and fire procedure and additional risks, exactly as supplied and never abridged
- [ ] 3.7 Progressively disclose the drill in the panel without truncating its text
- [ ] 3.8 Render the special loads with waybill, description, handling codes, gross weight, position, compartment and unloading airport
- [ ] 3.9 Render the heaviest piece with its weight and dimensions unit-suffixed where one is reported, and nothing where none is
- [ ] 3.10 Present human remains and other sensitive consignments as ordinary rows, never in a heading, figure or summary line
- [ ] 3.11 Render the cold chain assessments with waybill, description, regime, risk, margin and the API's own explanation, stated as advisory
- [ ] 3.12 Build the load summary with per-compartment weight and dry ice, the container, pallet and loose lot counts, the cargo, baggage and deadload weights, and what continues beyond
- [ ] 3.13 Label the summary's counts with the document's own terms, never as the manifest's unit count

## 4. Stages, acknowledgement and changes

- [ ] 4.1 Add the stage switch, defaulting to the latest issued and stating which stage is shown and when it was issued
- [ ] 4.2 State that the final notification is issued when boarding finishes where only a preliminary one exists
- [ ] 4.3 Offer no control that would alter a notification of either stage
- [ ] 4.4 Report who accepted the document and when where it has been accepted
- [ ] 4.5 State that it has not been accepted where it has not, explaining that acceptance follows from checking in or from finishing boarding, and offer no acknowledgement control
- [ ] 4.6 Build the changes summary from the captured shape, presenting it only alongside a final notification carrying one

## 5. The document form

- [ ] 5.1 Build the document form from the same resolved notification the panel renders, differing in layout and typography only
- [ ] 5.2 Add the document header carrying flight, stage, issue time and, where accepted, who accepted it and when, stating that it records the load at the moment it was issued
- [ ] 5.3 Render the standard hazard mark for each entry's class in its standard colours, with the class number and proper shipping name always beside it
- [ ] 5.4 Render the mark for a subsidiary risk alongside the primary one where reported
- [ ] 5.5 State every hazard class, subsidiary risk and cold chain risk in text so nothing depends on colour
- [ ] 5.6 Add the control moving between the panel and the document form
- [ ] 5.7 Render the document form for a notification reporting no dangerous goods, carrying the statement, the special loads, the assessments and the summary

## 6. Printing

- [ ] 6.1 Add print styles over the document form suppressing application navigation, sidebars and controls
- [ ] 6.2 Force a light ground when printing regardless of the theme in use
- [ ] 6.3 Keep a dangerous goods entry and its drill together across a page boundary where the page allows
- [ ] 6.4 Build no print-only markup, so the printed and on-screen documents cannot diverge

## 7. Surfaces

- [ ] 7.1 Present the notification to the pilot on the tracking dashboard as a pre-departure artifact
- [ ] 7.2 Present it read-only to operations on the flight file
- [ ] 7.3 Present it to cabin crew only for a flight they captain, and the forbidden state otherwise
- [ ] 7.4 Render the not-issued state stating that the notification is issued when the flight is released to the pilot

## 8. Verification

- [ ] 8.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [ ] 8.2 Verify `CV2020` renders three dangerous goods — UN1263 Paint class 3 at `11L`, UN3480 Lithium ion batteries class 9 at `11R` marked cargo aircraft only, and UN1845 Carbon dioxide solid class 9 at `12L` — each with its drill
- [ ] 8.3 Verify the drills render exactly as supplied for emergency response codes `3L`, `9F` and `9A`, with no truncation, summarisation or reflowing
- [ ] 8.4 Verify `CV2020`'s four special loads render with their handling codes — `AVI`/`HEA` horses at `6AL`, `HEA`/`BIG` landing gear at `6BL`, `HUM`/`HEA` human remains at `6CL`, and `PIL` vaccines at `31L`
- [ ] 8.5 Verify the heaviest piece renders for the three loads reporting one, including the landing gear leg at 1 600 kg over 340 × 130 × 150 cm, and nothing for the vaccines, which report none
- [ ] 8.6 Verify human remains appear only as an ordinary row and in no heading, figure or summary line
- [ ] 8.7 Verify `CV2020`'s cold chain assessment renders at low risk with an 88.5 h margin and the API's own explanation, stated as advisory
- [ ] 8.8 Verify the clean-flight statement renders prominently on `AA2018`, `AA2019` and `AA2021`, which report no dangerous goods, and that none is presented as an empty document
- [ ] 8.9 Verify the acknowledgement renders on `AA2018` and `AA2019`, which report an accepting pilot and a time, and the unaccepted state on `AA2021` and `CV2020`, which report neither
- [ ] 8.10 Verify no acknowledgement control is present on any notification
- [ ] 8.11 Verify the stage switch against the flight taken through finish-boarding in task 1.2, and that the changes summary renders on the final notification and not on the preliminary one
- [ ] 8.12 Verify the load summary reports `CV2020` as 4 containers and 3 pallets and that this is never presented as the manifest's count of 7 units
- [ ] 8.13 Verify the panel and the document form carry the same entries, drills, special loads, assessments and summary
- [ ] 8.14 Verify the document form carries the standard hazard mark for each class with the class number and proper shipping name always beside it, and that no hazard-standard colour appears on the in-app panel
- [ ] 8.15 Verify the printed output carries no application navigation or control, prints on a light ground from the dark theme, and keeps entries with their drills across page boundaries
- [ ] 8.16 Verify the document remains unambiguous rendered without colour, with every hazard class, subsidiary risk and cold chain risk identifiable from text
- [ ] 8.17 Verify each gap state renders distinctly — not issued, forbidden and failed
- [ ] 8.18 Verify keyboard traversal reaches every entry, drill, special load and assessment in both forms
- [ ] 8.19 Check contrast in light and dark against WCAG 2.1 AA for the panel, and legibility of the document in monochrome
- [ ] 8.20 Run `npm run build`

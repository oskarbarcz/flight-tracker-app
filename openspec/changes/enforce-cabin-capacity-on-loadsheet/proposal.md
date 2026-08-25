## Why

Assigning a cabin layout to an aircraft quietly changes what a loadsheet may say. Once a layout is assigned, the API rejects a preliminary loadsheet carrying more passengers than the cabin has seats — *"Cannot seat 200 passengers in a cabin of 186 seats."* — and rejects finishing boarding on the same grounds against the final loadsheet it is given. Both come back as an unprocessable response.

The app currently has no idea. The loadsheet route reports a bare "Failed to update preliminary loadsheet." and the boarding control reports a generic failure, so the first consequence of the previous three changes is that operations begins hitting a refusal the interface cannot explain. The form also gives no hint of the limit while there is still time to respect it.

The loadsheet has separately gained `passengersByCabin`, letting operations state the split across cabins rather than leaving the API to distribute passengers proportionally. That is the same subject — how many people fit where — and belongs in the same change.

## What Changes

- Show the **seat capacity of the pinned cabin** on the loadsheet form beside the passenger figure, so the limit is visible before it is breached.
- Report the **capacity refusal** wherever it arrives — on writing the preliminary loadsheet, on finishing boarding, and defensively on release — as what it is: passengers exceeding seats, with both numbers named, rather than as a generic failure.
- Add **`passengersByCabin`** to the preliminary loadsheet, letting operations state the split per cabin, with the API's proportional distribution remaining the default when it is left alone.
- Validate the **split against the total** before submitting, because the API requires the two to agree.
- Report what **reconciliation did** when boarding finishes, so a changed final count is visibly a change at the edges of the manifest rather than a silent regeneration.
- Leave every flight whose aircraft has **no cabin layout** exactly as it behaves today: no capacity, no limit, no split.

## Capabilities

### New Capabilities

- `loadsheet-cabin-capacity`: how the cabin's seat capacity constrains a loadsheet — where the limit is shown, how a refusal is explained, how the per-cabin split is stated and validated, and what happens for an aircraft with no cabin.

### Modified Capabilities

<!-- None. `fuel-and-loadsheet-view` and `preliminary-loadsheet-form` describe the fuel
     figures and the form's structure; neither states a requirement about passenger
     capacity, so nothing they specify changes. -->

## Dependencies

Requires `connect-aircraft-to-cabin-layouts`, because a capacity exists only where a layout is assigned. Reads the seat map introduced by `display-cabin-seat-maps` for the capacity figure. Independent of `display-flight-passenger-manifest`, though the reconciliation report is most useful beside it.

## Impact

- **Frontend code**: capacity display in `app/features/flight/components/Forms/LoadsheetLoadStep.tsx`; per-cabin fields in the preliminary loadsheet form and `UpdatePreliminaryLoadsheetModal`; error handling in `FlightLoadsheetRoute`, `FinishBoardingButton` and `FlightLayout`'s release handler; a reconciliation summary shown after boarding finishes.
- **Routes**: none.
- **API**: consumes `PATCH /flight/{id}/loadsheet/preliminary` with the added `passengersByCabin` field, and interprets the unprocessable responses from that endpoint and from `POST /flight/{id}/finish-boarding`. Verified live: the capacity check fires on the loadsheet write, so an over-capacity preliminary loadsheet can never be stored and release is never reached with one. No API work.
- **Data shape**: `passengersByCabin` is optional and nullable, keyed as the cabin layout names the cabins, and must sum to `passengers`. Omitting it is meaningful — it asks the API to distribute proportionally — so an empty object must not be sent in place of omission.
- **Capacity source**: total seats come from the layout's seat map. The figure is advisory in the form and the API remains the authority, so the form must not block a submission the server would have accepted.
- **Existing constraint**: loadsheet tonnage is rejected above three decimal places, which is already handled by rounding and is unaffected here.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: the capacity hint and any over-capacity warning must be associated with the passenger field rather than floating beside it, and must not rely on colour. WCAG 2.1 AA in both themes.

## Purpose

Makes the cabin's seat capacity visible while a loadsheet is being written, and explicable when it refuses one.

## ADDED Requirements

### Requirement: The loadsheet shows the cabin's seat capacity

Where the flight's aircraft carries a cabin layout, the loadsheet form SHALL report the number of seats that cabin holds alongside the passenger figure, and SHALL associate that report with the passenger field rather than presenting it separately.

#### Scenario: Capacity is shown

- **GIVEN** a flight whose aircraft carries a cabin layout
- **WHEN** operations edits the loadsheet
- **THEN** the seats the cabin holds are reported with the passenger field

#### Scenario: No cabin layout

- **GIVEN** a flight whose aircraft carries no cabin layout
- **WHEN** operations edits the loadsheet
- **THEN** no capacity is reported
- **AND** the form behaves as it does for any flight without a cabin

#### Scenario: The capacity cannot be obtained

- **WHEN** the cabin's seat count cannot be read
- **THEN** no capacity is reported
- **AND** the form remains usable

### Requirement: A passenger count above capacity is warned about, not blocked

The form SHALL warn when the passenger figure exceeds the reported capacity, and SHALL still allow the loadsheet to be submitted, because the server is the authority on whether the loadsheet may stand. The warning predicts the server's refusal; it does not replace it.

#### Scenario: Typing beyond capacity

- **WHEN** operations enters more passengers than the cabin has seats
- **THEN** the form warns that the figure exceeds the cabin's capacity
- **AND** the warning is conveyed by more than colour

#### Scenario: Submission is not prevented

- **WHEN** operations submits a loadsheet whose passenger figure exceeds the reported capacity
- **THEN** the form submits it
- **AND** the server's answer, not the form's warning, decides whether it is stored

### Requirement: A capacity refusal is explained

Where the server refuses a request because the passengers exceed the cabin's seats, the app SHALL report that as the reason, naming the passenger count, the seat count and the cabin layout imposing the limit, and SHALL direct the reader to the loadsheet. It SHALL recognise the refusal wherever it arrives rather than only on one surface.

#### Scenario: The preliminary loadsheet is refused

- **GIVEN** a flight whose aircraft carries a cabin layout
- **WHEN** operations submits a preliminary loadsheet reporting more passengers than that cabin has seats
- **THEN** the app reports that the passenger count exceeds the cabin's seats
- **AND** it names both figures
- **AND** the loadsheet is not shown as saved

#### Scenario: Finishing boarding is refused

- **GIVEN** a released flight whose final loadsheet reports more passengers than its pinned cabin has seats
- **WHEN** boarding is finished
- **THEN** the app reports that the final passenger count exceeds the cabin's seats
- **AND** boarding is not shown as finished

#### Scenario: An unrelated failure

- **WHEN** a request fails for a reason other than capacity
- **THEN** the app does NOT attribute it to capacity
- **AND** it reports that failure as it otherwise would

### Requirement: Operations may state the split across cabins

The preliminary loadsheet SHALL let operations state how the passengers divide across the cabins of the assigned layout. Leaving the split unstated SHALL omit it entirely, so that the server distributes passengers across cabins in proportion to their size.

#### Scenario: A split is stated

- **GIVEN** a flight whose aircraft carries a cabin layout
- **WHEN** operations states a passenger count for each cabin and submits
- **THEN** the loadsheet records that split

#### Scenario: A split is not stated

- **WHEN** operations submits a loadsheet without stating a split
- **THEN** no split is sent
- **AND** it is NOT sent as zeroes or as an empty split

#### Scenario: The cabins offered are the layout's own

- **WHEN** the split is offered
- **THEN** the cabins offered are those the assigned layout actually holds

#### Scenario: No cabin layout

- **GIVEN** a flight whose aircraft carries no cabin layout
- **WHEN** operations edits the preliminary loadsheet
- **THEN** no split is offered

### Requirement: A stated split must agree with the total

Where operations states a split, the form SHALL require the per-cabin figures to sum to the passenger total and SHALL report a disagreement before submitting.

#### Scenario: The split does not sum to the total

- **WHEN** the per-cabin figures do not sum to the passenger total
- **THEN** the form reports the disagreement and names both sums
- **AND** the loadsheet is not submitted

#### Scenario: The split agrees

- **WHEN** the per-cabin figures sum to the passenger total
- **THEN** the loadsheet submits

### Requirement: Reconciliation reports what it changed

Where finishing boarding reconciles the manifest against the final loadsheet, the app SHALL report how many passengers were added and how many became no-shows, so that the change is legible as an adjustment rather than a regeneration.

#### Scenario: The final count is lower

- **GIVEN** a released flight whose final loadsheet reports fewer passengers than its manifest holds
- **WHEN** boarding is finished
- **THEN** the app reports how many passengers became no-shows

#### Scenario: The final count is higher

- **GIVEN** a released flight whose final loadsheet reports more passengers than its manifest holds
- **WHEN** boarding is finished
- **THEN** the app reports how many passengers were added

#### Scenario: The count is unchanged

- **WHEN** boarding is finished with the same passenger count the manifest holds
- **THEN** the app does NOT report additions or no-shows

#### Scenario: A flight with no cabin layout

- **GIVEN** a flight whose aircraft carries no cabin layout
- **WHEN** boarding is finished
- **THEN** no reconciliation is reported

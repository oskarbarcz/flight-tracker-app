# Flight closure

## Purpose

Make the pilot-facing close-flight action the moment where the flight's actual fuel consumption is captured and where the last irreversible step is guarded. Closing a flight opens a form requiring the actual fuel burned (a single tonnage figure, validated with the loadsheet tonnage rule) and shows the planned trip fuel from the final loadsheet with a live planned-versus-actual delta. The close action is gated on delay settlement, composing with the existing active-emergency guard, and the flight model exposes the read-only `actualFuelBurned` value returned on the flight response.

## Requirements

### Requirement: Actual fuel burn capture on close

Closing a flight from the pilot tracking dashboard SHALL open a form rather than immediately closing the flight. The form SHALL require the pilot to enter the actual fuel burned for the flight as a single tonnage figure in tons. The value SHALL be validated as strictly positive with at most three decimal places (the loadsheet tonnage rule). The flight SHALL NOT be closed until a valid value is submitted. On submit, the value SHALL be sent as `actualFuelBurned` (in tons) to the close endpoint, and the dashboard SHALL navigate to the flight history once the flight status becomes `Closed`.

#### Scenario: Close opens the fuel-burn form

- **WHEN** the pilot activates the Close action on a flight that is otherwise closable
- **THEN** a form is shown asking for the actual fuel burned, and the flight is not yet closed

#### Scenario: Valid fuel burn closes the flight

- **WHEN** the pilot enters a positive tonnage with at most three decimals and submits the form
- **THEN** the close request is sent with `actualFuelBurned` set to that value and the flight is closed

#### Scenario: Missing or invalid fuel burn blocks submit

- **WHEN** the fuel-burn field is empty, not positive, or has more than three decimals
- **THEN** submit is blocked, a field-level validation error is shown, and no close request is sent

### Requirement: Planned-versus-actual reference on the close form

The close form SHALL display the planned trip fuel taken from the final loadsheet (`loadsheets.final.fuel.trip`) as read-only reference, in tons, and SHALL show a live delta between the entered actual fuel burned and that planned trip fuel as the pilot types. When the final loadsheet or its fuel breakdown is unavailable, the form SHALL still accept a fuel-burn entry and SHALL omit the reference and delta rather than blocking the pilot.

#### Scenario: Reference and live delta shown

- **WHEN** the final loadsheet carries a fuel breakdown and the pilot types a value into the fuel-burn field
- **THEN** the planned trip fuel is shown for reference and a live planned-versus-actual delta updates as the value changes

#### Scenario: Reference unavailable

- **WHEN** the final loadsheet or its `fuel` breakdown is absent
- **THEN** the form omits the planned reference and delta and still allows the pilot to enter and submit the fuel burned

### Requirement: Flight model exposes actual fuel burned

The flight model SHALL parse and expose the read-only `actualFuelBurned` value (in tons, nullable until the flight is closed) returned on the flight response.

#### Scenario: Closed flight carries actual fuel burned

- **WHEN** the API returns a flight whose `actualFuelBurned` is populated
- **THEN** the value is available on the flight model in tons

#### Scenario: Open flight has no actual fuel burned

- **WHEN** the API returns a flight whose `actualFuelBurned` is `null`
- **THEN** the flight model exposes it as absent and no derived delta is presented

### Requirement: Close blocked until delay is settled

The Close action SHALL be disabled whenever the flight has a delay request that is not settled — that is, when a delay request exists and its `isSettled` flag is false. When the Close action is disabled for this reason, an informational tooltip SHALL explain that the delay must be settled before the flight can be closed. When no delay request exists, or the delay request is settled, this guard SHALL NOT block closing. This guard SHALL compose with the existing active-emergency guard so that either unresolved condition disables Close.

#### Scenario: Unsettled delay disables Close

- **WHEN** the flight has a delay request whose `isSettled` is false
- **THEN** the Close button is disabled and a tooltip explains that the delay must be settled before closing

#### Scenario: Settled delay allows Close

- **WHEN** the flight's delay request is settled, or the flight has no delay request
- **THEN** the delay guard does not disable the Close button

#### Scenario: Guards compose

- **WHEN** the flight has both an active emergency and an unsettled delay
- **THEN** the Close button is disabled and remains disabled until both conditions are resolved

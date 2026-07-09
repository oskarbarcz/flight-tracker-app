# Preliminary loadsheet form

## Purpose

Present the loadsheet edit form as an operational weight build-up (dry operating → zero-fuel → take-off → landing) rather than a flat list, capturing new operational weights and structural limits with limit-aware validation, shared by both the operator preliminary and pilot final loadsheet flows, and surfacing the saved weights read-only in the loadsheet view.

## Requirements

### Requirement: Weight build-up layout

The loadsheet edit form SHALL present the weights as an operational build-up rather than a flat list: dry operating weight, plus payload, giving zero-fuel weight; plus take-off fuel, giving take-off weight; less trip fuel, giving landing weight. The form SHALL group fields under clear headings (Souls, Weights, Limits), label every weight with a `t` unit, and show the resulting build-up figures updating live as the operator types.

#### Scenario: Weights presented as a build-up

- **WHEN** an operator opens the loadsheet form
- **THEN** the weight fields are grouped and ordered as a build-up (dry operating → zero-fuel → take-off → landing) with `t` units

#### Scenario: Live-computed context

- **WHEN** the operator changes an input that feeds the build-up
- **THEN** the derived build-up figures update immediately without saving

### Requirement: New operational weight fields

The form SHALL capture and submit dry operating weight, take-off weight and landing weight in tons, in addition to the existing zero-fuel weight, cargo, payload and block fuel.

#### Scenario: Entering the new weights

- **WHEN** an operator fills dry operating weight, take-off weight and landing weight and saves
- **THEN** those values are included in the submitted loadsheet

#### Scenario: Editing an existing loadsheet

- **WHEN** a loadsheet that already carries the new weights is opened
- **THEN** the form is pre-filled with their saved values

### Requirement: Structural limit fields

The form SHALL capture maximum zero-fuel weight, maximum take-off weight and maximum landing weight in tons as the aircraft's structural limits.

#### Scenario: Entering limits

- **WHEN** an operator fills the maximum zero-fuel, take-off and landing weights and saves
- **THEN** those limits are included in the submitted loadsheet

### Requirement: Limit-aware validation

The form SHALL warn when an operational weight exceeds its structural limit: zero-fuel weight over maximum zero-fuel weight, take-off weight over maximum take-off weight, or landing weight over maximum landing weight. The warning SHALL identify which weight is over limit and SHALL NOT silently accept the value as valid.

#### Scenario: Over a structural limit

- **WHEN** the entered take-off weight exceeds the maximum take-off weight
- **THEN** an over-limit warning is shown against the take-off weight

#### Scenario: Within limits

- **WHEN** every operational weight is at or below its corresponding limit
- **THEN** no over-limit warning is shown

### Requirement: Input validation

The form SHALL keep the existing per-field validation — weights non-negative, positive where required, and at most three decimal places — and SHALL surface a consistency hint when zero-fuel weight differs materially from dry operating weight plus payload.

#### Scenario: Invalid number rejected

- **WHEN** a weight is negative or has more than three decimal places
- **THEN** the field shows a validation error and the form cannot be submitted

#### Scenario: Zero-fuel weight inconsistent with build-up

- **WHEN** zero-fuel weight does not match dry operating weight plus payload
- **THEN** a consistency hint is shown

### Requirement: Shared by preliminary and final flows

The redesigned form SHALL be used by both the operator preliminary loadsheet flow and the pilot final loadsheet flow, so both entry points present the same layout, fields and validation.

#### Scenario: Operator preliminary entry

- **WHEN** an operator opens the preliminary loadsheet editor on an editable flight
- **THEN** the redesigned form with the new weights and limits is shown

#### Scenario: Pilot final entry

- **WHEN** a pilot fills the final loadsheet at finish-boarding
- **THEN** the same redesigned form is shown

### Requirement: Saved weights shown in the loadsheet view

The loadsheet display SHALL show the new operational weights (dry operating, take-off, landing) read-only when present, so saved values are visible alongside the existing figures.

#### Scenario: Loadsheet carries the new weights

- **WHEN** a loadsheet with dry operating, take-off and landing weights is displayed
- **THEN** those weights are shown read-only in the loadsheet figures

#### Scenario: Loadsheet without the new weights

- **WHEN** a loadsheet does not carry the new weights
- **THEN** the display omits them and still renders the existing figures

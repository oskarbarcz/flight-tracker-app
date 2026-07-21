# Aircraft registration form

## Purpose

Define the operator-facing form for registering a new aircraft and editing an existing one: which fields it captures, their validation rules and required/optional status, how they map to the create/update API payload, the per-section save flow, and how the aircraft details view reflects the captured data.

## Requirements

### Requirement: Sectioned form with independent section saves

The add and edit aircraft forms SHALL be organized into two sections — **Identification** (airframe, registration, SELCAL) and **Lifecycle** (base airport, livery, ETOPS threshold) — each saved independently. The aircraft SHALL NOT be created or updated until every section has been saved.

#### Scenario: Final action gated until all sections are saved

- **WHEN** at least one section has not been saved
- **THEN** the final "Create new aircraft" / "Save changes" action is disabled and the form indicates the remaining sections must be saved first

#### Scenario: Saving all sections enables submission

- **WHEN** the operator has saved both the Identification and Lifecycle sections
- **THEN** the final create/update action becomes enabled and submits the aircraft

#### Scenario: Editing pre-fills sections as saved

- **WHEN** the operator opens the edit form for an existing aircraft
- **THEN** both sections are pre-filled with the aircraft's current values and shown as saved (read-only, each with an Edit affordance)

### Requirement: Airframe selection

The forms SHALL provide a searchable airframe selector limited to the curated airframe list. Airframe is required.

#### Scenario: Airframe is required

- **WHEN** the operator tries to save the Identification section without an airframe
- **THEN** validation fails and the section is not saved

### Requirement: Registration

Registration is required and SHALL be between 2 and 20 characters.

#### Scenario: Registration is required

- **WHEN** the operator tries to save the Identification section with an empty registration
- **THEN** validation fails and the section is not saved

### Requirement: Optional SELCAL

The forms SHALL treat SELCAL as optional. An empty SELCAL SHALL pass validation and be submitted as `null`. When a SELCAL value is provided, it SHALL be validated against the `XX-XX` format (two uppercase letters, a hyphen, two uppercase letters). Wherever a SELCAL value is displayed, an empty SELCAL SHALL render a placeholder rather than blank.

#### Scenario: Submitting without a SELCAL

- **WHEN** the operator leaves SELCAL empty and submits the form
- **THEN** validation passes and the request submits `selcal` as `null`

#### Scenario: Submitting an invalid SELCAL

- **WHEN** the operator enters a SELCAL that does not match the `XX-XX` format
- **THEN** validation fails with a format error and the section is not saved

#### Scenario: Submitting a valid SELCAL

- **WHEN** the operator enters a SELCAL matching the `XX-XX` format
- **THEN** validation passes and the value is submitted unchanged

### Requirement: Base airport selection

The forms SHALL provide a searchable base airport picker. Base airport is required; the selected airport's id SHALL be submitted as `baseAirportId`, and submission SHALL be prevented when no base airport is selected.

#### Scenario: Registering an aircraft with a base airport

- **WHEN** the operator selects an airport in the base airport picker, saves the Lifecycle section, and creates the aircraft
- **THEN** the create request includes `baseAirportId` set to the selected airport's id

#### Scenario: Base airport is required

- **WHEN** the operator tries to save the Lifecycle section without selecting a base airport
- **THEN** validation fails with "Base airport is required" and the section is not saved

#### Scenario: Editing pre-fills the current base airport

- **WHEN** the operator opens the edit form for an aircraft that has a base airport assigned
- **THEN** the base airport picker is pre-selected with that aircraft's current base airport

### Requirement: Optional livery

The forms SHALL treat livery as optional. When livery is left empty it SHALL be omitted from the request and the backend assigns a default name. When provided it SHALL be at most 100 characters.

#### Scenario: Submitting without a livery

- **WHEN** the operator leaves livery empty and creates the aircraft
- **THEN** the create request omits `livery` and the aircraft is created with a backend-assigned default livery

#### Scenario: Submitting a livery

- **WHEN** the operator enters a livery name
- **THEN** the request includes that livery value

### Requirement: ETOPS threshold selection

The forms SHALL provide a searchable ETOPS threshold selector limited to the values `60`, `75`, `90`, `120`, and `180` minutes, plus a "Not ETOPS-certified" option. The selected value SHALL be submitted as a numeric `etopsThresholdMinutes`; the "Not ETOPS-certified" option SHALL submit `null`. The field SHALL default to "Not ETOPS-certified" on the add form.

#### Scenario: Registering an ETOPS-certified aircraft

- **WHEN** the operator selects `180` in the ETOPS threshold selector and creates the aircraft
- **THEN** the create request includes `etopsThresholdMinutes` set to the number `180`

#### Scenario: Registering a non-ETOPS aircraft

- **WHEN** the operator leaves the ETOPS threshold selector on "Not ETOPS-certified" and creates the aircraft
- **THEN** the create request includes `etopsThresholdMinutes` set to `null`

#### Scenario: Only documented thresholds are offered

- **WHEN** the operator opens the ETOPS threshold selector
- **THEN** the only selectable minute values are `60`, `75`, `90`, `120`, and `180`, alongside the "Not ETOPS-certified" option

#### Scenario: Editing pre-fills the current threshold

- **WHEN** the operator opens the edit form for an aircraft with `etopsThresholdMinutes` of `120`
- **THEN** the ETOPS threshold selector is pre-selected with `120`

### Requirement: ETOPS threshold on aircraft details

The aircraft details view SHALL display the aircraft's ETOPS threshold. When `etopsThresholdMinutes` is `null`, the view SHALL indicate the aircraft is not ETOPS-certified.

#### Scenario: Certified aircraft

- **WHEN** the operator views details for an aircraft with `etopsThresholdMinutes` of `180`
- **THEN** the details view shows the ETOPS threshold as `180` minutes

#### Scenario: Non-certified aircraft

- **WHEN** the operator views details for an aircraft with `etopsThresholdMinutes` of `null`
- **THEN** the details view indicates the aircraft is not ETOPS-certified

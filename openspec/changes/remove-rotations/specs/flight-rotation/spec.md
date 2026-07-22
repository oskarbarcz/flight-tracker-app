## REMOVED Requirements

### Requirement: Operator rotation management
The system SHALL NOT provide any interface for managing operator rotations. Routes for listing, creating, and editing an operator's rotations are removed, along with the underlying rotation model, validation schema, and API service.

**Reason**: Flight rotation is being reimplemented from scratch in a fundamentally different way. The existing implementation does not match the intended direction and is removed to give the re-design a clean slate.
**Migration**: No replacement in this change. The forthcoming rotation re-design will introduce its own capability spec. Until then, no rotation management surface exists; operators manage their fleet directly.

#### Scenario: Rotation routes no longer exist
- **WHEN** a user navigates to `/operators/:operatorId/rotations`, `/operators/:operatorId/rotations/new`, or `/operators/:operatorId/rotations/:rotationId/edit`
- **THEN** no matching route is registered and no rotation list, create, or edit screen is rendered

#### Scenario: Operator navigation no longer targets rotations
- **WHEN** a user views the operator tabs or opens an operator card
- **THEN** no "Rotations" tab is shown and the operator card's default target is the operator fleet rather than a rotations route

### Requirement: Flight rotation association
The system SHALL NOT associate a flight with a rotation. The `Flight` model, the create-flight request, and the flight API response carry no `rotationId`.

**Reason**: Rotations are removed entirely; a flight can no longer belong to a rotation under the retired model.
**Migration**: The re-design will define how flights relate to the new rotation concept. No client code reads or sends `rotationId` after this change.

#### Scenario: Flight carries no rotation reference
- **WHEN** a flight is parsed from an API response or a create-flight request is built
- **THEN** no `rotationId` field is present or required on the flight

### Requirement: Flight rotation events
The system SHALL NOT recognize or display the `flight.added-to-rotation` and `flight.removed-from-rotation` flight-event types.

**Reason**: These events only had meaning within the retired rotation model.
**Migration**: The re-design will define its own events if needed. No i18n label or event-type member remains for rotation events.

#### Scenario: Rotation event types are absent
- **WHEN** the set of flight-event types and their labels is enumerated
- **THEN** neither `flight.added-to-rotation` nor `flight.removed-from-rotation` appears

### Requirement: Pilot current-rotation dashboard
The system SHALL NOT show a "current rotation" box on the pilot dashboard.

**Reason**: The box depended on the retired rotation model and would conflict with the re-design.
**Migration**: The re-design will decide what, if anything, replaces this surface on the pilot dashboard.

#### Scenario: Pilot dashboard omits the rotation box
- **WHEN** a pilot opens their dashboard
- **THEN** no current-rotation box is rendered

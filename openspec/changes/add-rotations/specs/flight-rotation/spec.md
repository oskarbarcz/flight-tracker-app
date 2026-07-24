## ADDED Requirements

### Requirement: Operations creates a rotation for an operator

Operations SHALL be able to create a rotation scoped to an operator by providing a name and the assigned pilot. The assigned pilot MUST be a user with role `CabinCrew`, chosen from a selector populated with such users. A newly created rotation MUST start in `draft` status with no legs.

#### Scenario: Create a rotation with valid data

- **WHEN** an Operations user submits a rotation name (3–50 characters) and selects a pilot (a `CabinCrew` user) for an operator
- **THEN** the system creates the rotation via `POST /api/v1/operator/{operatorId}/rotation`, the returned rotation has `status: draft` and an empty `legs` array, and the user is taken to that rotation's builder page

#### Scenario: Pilot is resolved by license ID

- **WHEN** the user enters a pilot license ID in the create form
- **THEN** the system resolves it via `userService.fetchUserByLicenseId`, shows the matched pilot's name for confirmation, and stores that user's id as `pilotId`; an unknown or malformed license surfaces an inline error and blocks submission

#### Scenario: Reject invalid rotation metadata

- **WHEN** the rotation name is shorter than 3 or longer than 50 characters, or no pilot is selected
- **THEN** the form MUST block submission and show inline validation errors, and no create request is sent

### Requirement: Operations lists an operator's rotations

Operations SHALL be able to view all rotations belonging to an operator, each showing its name, assigned pilot, leg count, and status.

#### Scenario: View the rotations list

- **WHEN** an Operations user opens the operator's Rotations tab
- **THEN** the system lists rotations from `GET /api/v1/operator/{operatorId}/rotation`, each row showing name, pilot, number of legs, and status

#### Scenario: Empty rotations list

- **WHEN** the operator has no rotations
- **THEN** the system shows an empty state inviting the user to create the first rotation

### Requirement: Operations plans rotation legs while the rotation is draft

Operations SHALL be able to add, edit, and remove legs only while the rotation is `draft`; once `ready` or later the leg set is frozen. Each leg captures a planned flight number, a departure and arrival airport (which MUST differ), and off-block and on-block times (off-block MUST precede on-block); block time is derived by the API and displayed. Legs MUST be presented in the order returned by the API (off-block time). A rotation is intended as a continuous chain (each leg departs from the previous leg's arrival, no time overlap); the builder SHALL guide the planner toward a valid chain (e.g. defaulting a new leg's departure to the previous leg's arrival).

#### Scenario: Add a leg to a draft rotation

- **WHEN** the user submits a flight number, departure airport, arrival airport (different from departure), off-block time, and on-block time on a `draft` rotation
- **THEN** the system calls `POST /api/v1/rotation/{rotationId}/leg` and replaces its local rotation state with the full rotation returned, showing the new leg with its computed block time

#### Scenario: Reject an invalid leg client-side

- **WHEN** departure equals arrival, on-block is not after off-block, or a required leg field is missing
- **THEN** the form MUST block submission and show validation errors, and no add-leg request is sent

#### Scenario: Edit a leg on a draft rotation

- **WHEN** the user changes one or more fields of an existing leg on a `draft` rotation and saves
- **THEN** the system calls `PATCH /api/v1/rotation/{rotationId}/leg/{legId}` with only the changed fields and replaces local state with the returned rotation

#### Scenario: Remove a leg from a draft rotation

- **WHEN** the user confirms removal of a leg on a `draft` rotation
- **THEN** the system calls `DELETE /api/v1/rotation/{rotationId}/leg/{legId}` and replaces local state with the returned rotation

#### Scenario: Leg editing is unavailable once frozen

- **WHEN** a rotation is `ready`, `in_progress`, or `finished`
- **THEN** the builder MUST NOT offer add/edit/remove leg actions (the API would reject them with a conflict)

### Requirement: Operations attaches and detaches a flight per leg once the rotation is active

Operations SHALL be able to link a flight to a leg, and unlink it, only while the rotation is `ready` or `in_progress` (not `draft`). A leg links to at most one flight. Because a leg is the intended plan and a flight is the actual operation, an attachable flight MUST belong to the rotation's operator, be in status `Created`, not already be attached to another leg, and match the leg's flight number, departure, and arrival (times are not checked). The picker MUST offer only such flights, and the API rejects anything else. A flight MUST only be detachable while it is still `Created`.

#### Scenario: Attach a matching flight to a leg

- **WHEN** on a `ready` or `in_progress` rotation the user selects a `Created` flight of the same operator whose flight number, departure, and arrival match the leg
- **THEN** the system calls `PUT /api/v1/rotation/{rotationId}/leg/{legId}/flight/{flightId}`, replaces local state with the returned rotation, and the leg now shows the attached flight and its status

#### Scenario: Only eligible flights are offered

- **WHEN** the leg-scoped flight picker is opened
- **THEN** it lists only the operator's `Created` flights whose flight number, departure, and arrival match the leg and that are not already attached to another leg

#### Scenario: Rejected ineligible attachment

- **WHEN** an attachment request is rejected by the API (mismatched route/number, wrong operator, non-`Created` flight, or already attached)
- **THEN** the system MUST show an error carrying the server's explanation, and MUST leave the locally displayed rotation unchanged

#### Scenario: Detach an unflown flight from a leg

- **WHEN** the user removes a still-`Created` flight from a leg on a `ready` or `in_progress` rotation
- **THEN** the system calls `DELETE /api/v1/rotation/{rotationId}/leg/{legId}/flight` and replaces local state with the returned rotation, and the leg shows no attached flight

#### Scenario: Attachment progress is visible after ready

- **WHEN** a rotation is `ready` or `in_progress` and one or more legs have no attached flight
- **THEN** the builder MUST indicate which legs still need a flight, since every leg requires an attached flight to be flown

### Requirement: Operations marks a rotation ready

Operations SHALL be able to advance a rotation from `draft` to `ready`, which freezes the leg set and opens flight attachment. The API allows this only when the rotation has at least two legs that form a valid continuous chain (each leg departs from the previous leg's arrival, off-block before on-block, no overlap). The builder SHALL only enable "Mark ready" once the local rotation satisfies these preconditions.

#### Scenario: Mark a valid draft rotation ready

- **WHEN** the user activates "Mark ready" on a `draft` rotation with at least two chained, non-overlapping legs
- **THEN** the system calls `POST /api/v1/rotation/{rotationId}/ready` and replaces local state with the returned rotation whose `status` is `ready`

#### Scenario: Mark ready is unavailable for an invalid plan

- **WHEN** a `draft` rotation has fewer than two legs, or its legs do not form a continuous non-overlapping chain
- **THEN** the "Mark ready" action MUST be disabled with a hint explaining what is missing, and no request is sent

#### Scenario: Server rejects an invalid ready transition

- **WHEN** a "Mark ready" request is rejected by the API (e.g. broken chain)
- **THEN** the system MUST show an error carrying the server's explanation and leave the locally displayed rotation unchanged

### Requirement: Rotation mutations surface server-side rejections

When a rotation mutation is rejected by a server-side guard — a lifecycle conflict (HTTP 409) or a validation error (HTTP 422) — the system SHALL inform the user with the server's message without corrupting local state.

#### Scenario: Conflict on a guarded mutation

- **WHEN** a rotation mutation responds with HTTP 409 (e.g. legs frozen, flight already attached, rotation not active, leg locked)
- **THEN** the system MUST show an error toast carrying the server's explanation, and MUST leave the locally displayed rotation unchanged

#### Scenario: Validation rejection on a mutation

- **WHEN** a rotation mutation responds with HTTP 422 (e.g. invalid leg, broken chain, flight not attachable, rotation not readyable)
- **THEN** the system MUST show an error toast carrying the server's explanation, and MUST leave the locally displayed rotation unchanged

### Requirement: Pilot sees their current rotation on the dashboard

The pilot dashboard SHALL show a rotation progress card when the pilot has an active rotation, and SHALL omit the card otherwise. The pilot's rotations are retrieved from `GET /api/v1/user/me/rotations`. The card is additive and MUST NOT replace or alter the existing current, next, or last flight boxes.

#### Scenario: An active rotation exists

- **WHEN** `GET /api/v1/user/me/rotations` returns a rotation with status `ready` or `in_progress`
- **THEN** the dashboard shows a `CurrentRotationBox` for it, preferring an `in_progress` rotation, otherwise the `ready` rotation whose first leg starts earliest

#### Scenario: No active rotation

- **WHEN** the pilot has no rotation with status `ready` or `in_progress`
- **THEN** the dashboard MUST NOT render the rotation card, and the rest of the dashboard renders unchanged

#### Scenario: Loading state

- **WHEN** the pilot's rotations are being fetched
- **THEN** the dashboard shows a skeleton loader in place of the card, consistent with the other dashboard box loaders

### Requirement: Pilot rotation card shows leg progress and links into tracking

The rotation card SHALL present the rotation's legs as an ordered strip distinguishing completed, active, and upcoming legs, and SHALL let the pilot open the active or next leg's flight in tracking.

#### Scenario: Active leg identified from the current flight

- **WHEN** the pilot's current flight matches a leg's attached flight
- **THEN** that leg is marked active, earlier legs are marked completed, later legs are marked upcoming, and the card shows the rotation's overall progress

#### Scenario: Deep-link into tracking

- **WHEN** the active or next leg has an attached flight and the pilot activates it
- **THEN** the system navigates to `/track/{flightId}` for that leg's flight

#### Scenario: Card advances after a leg completes

- **WHEN** a rotation-linked flight the pilot was tracking is completed (closed)
- **THEN** the card advances to present the next unflown leg as the leg to fly next

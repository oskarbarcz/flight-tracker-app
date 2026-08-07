# Flight rotation

## Purpose

Give Operations a way to plan a pilot's multi-leg trip as one assignment over the API's `Operator → Rotation → Leg → (optional) Flight` hierarchy and its `draft → ready → in_progress → finished` lifecycle, and give the pilot a read-only ordered itinerary to fly — a leg is the intended plan, an attached flight is the actual operation.

## Requirements

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

### Requirement: The pilot's rotation surface is read-only

The pilot SHALL have no action anywhere on the rotation surface that changes a rotation, its legs, or its flight attachments. All rotation state changes belong to Operations or to backend flight events.

#### Scenario: No mutating controls are offered to the pilot

- **WHEN** a pilot views the rotation card, the rotations list, or a rotation's detail page
- **THEN** the system MUST NOT offer add/edit/remove leg, attach/detach flight, mark-ready, cancel, or delete actions, and MUST NOT call any rotation mutation endpoint

### Requirement: Pilots see only released rotations

Rotations in `draft` SHALL NOT be presented to the pilot on any surface, because a draft's legs are still mutable and carry no attached flights. The pilot surface admits `ready`, `in_progress`, `finished`, and `canceled`.

#### Scenario: Draft rotations are excluded from the list

- **WHEN** `GET /api/v1/user/me/rotations` returns rotations including one in `draft` assigned to the pilot
- **THEN** the list MUST NOT show the `draft` rotation, and MUST show the pilot's `ready`, `in_progress`, `finished`, and `canceled` rotations

#### Scenario: Draft rotation opened directly by id

- **WHEN** the pilot navigates to the detail route for a `draft` rotation
- **THEN** the system MUST NOT render the itinerary, and MUST show a state explaining the rotation is not yet released

### Requirement: Canceled rotations are a recognized terminal state

The system SHALL model `canceled` as a rotation status alongside `draft`, `ready`, `in_progress`, and `finished`, and SHALL carry the cancellation metadata (`canceledBy`, `cancellationReason`, `canceledAt`) from the API. A canceled rotation is neither active nor finished.

#### Scenario: Canceled rotation is labelled and explained

- **WHEN** the pilot opens a `canceled` rotation's detail page
- **THEN** the system shows a canceled status label, the cancellation reason, and who canceled it, and MUST NOT present the rotation as flyable

#### Scenario: Canceled rotation is not the active rotation

- **WHEN** the pilot's only rotation is `canceled`
- **THEN** the dashboard MUST NOT render the rotation card, and the rotation appears among completed rotations in the list

### Requirement: Pilot lists their assigned rotations

The pilot SHALL be able to view the rotations assigned to them, retrieved from `GET /api/v1/user/me/rotations`, grouped into active (`ready`, `in_progress`) and completed (`finished`, `canceled`). Each entry identifies the rotation and summarizes its shape — name, status, route span, leg count, first off-block date, and how many legs have been flown — and opens that rotation's detail page.

#### Scenario: View assigned rotations

- **WHEN** the pilot opens the Rotations list
- **THEN** the system lists their non-`draft` rotations grouped into active and completed, each entry showing name, status, route span, leg count, first off-block date, and flown-leg count, and each entry linking to its detail page

#### Scenario: No assigned rotations

- **WHEN** the pilot has no rotation in `ready`, `in_progress`, `finished`, or `canceled`
- **THEN** the system shows an empty state explaining that assigned rotations will appear here

#### Scenario: Rotations list is reachable from navigation

- **WHEN** a pilot is signed in
- **THEN** the sidebar offers a Rotations entry linking to the list

### Requirement: Pilot views a rotation's full itinerary

The pilot SHALL be able to open one of their rotations and see its complete itinerary: the rotation's identity and status, its route across all legs, and for each leg the flight number, departure and arrival, off-block and on-block times, planned block time, and the state of the attached flight. Legs MUST be presented in the order returned by the API.

#### Scenario: View an assigned rotation's detail

- **WHEN** the pilot opens the detail page for a rotation assigned to them in `ready`, `in_progress`, `finished`, or `canceled`
- **THEN** the system shows the rotation name, status, operator, route across legs, and every leg with its flight number, `departure → arrival`, off-block and on-block times, planned block time, and attached-flight status

#### Scenario: Leg awaiting its flight

- **WHEN** a leg on the pilot's rotation has no attached flight
- **THEN** the leg MUST be shown as awaiting its flight rather than as an empty or broken row, and MUST offer no action to the pilot

#### Scenario: Rotation not assigned to this pilot

- **WHEN** the pilot navigates to the detail route for a rotation whose `pilotId` is not their own
- **THEN** the system MUST NOT render the itinerary, and MUST show a state explaining the rotation is not assigned to them

#### Scenario: Open a leg's flight from the itinerary

- **WHEN** a leg on the pilot's rotation has an attached flight and the pilot activates it
- **THEN** the system navigates to `/flight-history/{flightId}` if that flight is closed, and to `/track/{flightId}` otherwise

### Requirement: Pilot sees their current rotation on the dashboard

The pilot dashboard SHALL show a rotation progress card when the pilot has an active rotation, and SHALL omit the card otherwise. The pilot's rotations are retrieved from `GET /api/v1/user/me/rotations`. The card is additive and MUST NOT replace or alter the existing current, next, or last flight boxes, nor change how the dashboard picks the next scheduled flight.

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

The rotation card SHALL present the rotation's legs as an ordered strip distinguishing completed, active, and upcoming legs, SHALL let the pilot open the active or next leg's flight in tracking, and SHALL link to the rotation's detail page.

#### Scenario: Active leg identified from the current flight

- **WHEN** the pilot's current flight matches a leg's attached flight
- **THEN** that leg is marked active, earlier legs are marked completed, later legs are marked upcoming, and the card shows the rotation's overall progress

#### Scenario: Deep-link into tracking

- **WHEN** the active or next leg has an attached flight and the pilot activates it
- **THEN** the system navigates to `/track/{flightId}` for that leg's flight

#### Scenario: Next leg has no attached flight

- **WHEN** the next unflown leg has no attached flight
- **THEN** the card still presents that leg as the next leg of the itinerary, shows it as awaiting its flight, and offers no tracking link for it

#### Scenario: Card advances after a leg completes

- **WHEN** a rotation-linked flight the pilot was tracking is completed (closed)
- **THEN** the card advances to present the next unflown leg as the leg to fly next

#### Scenario: Card opens the full itinerary

- **WHEN** the pilot activates the card's link to the rotation
- **THEN** the system navigates to that rotation's detail page

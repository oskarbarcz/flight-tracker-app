## Purpose

Give a signed-in user an account page where they can connect their Google account to their Flight Tracker account, which is what makes Google sign-in possible for them, and make the connection's constraints and failures understandable.

## ADDED Requirements

### Requirement: Account page

The system SHALL provide an account page at `/me/account`, available to every signed-in role, that shows the account's identity — name, role, and active email address — and hosts account-level actions. The page SHALL be reachable from `/me` through an "Account" entry, and SHALL require an authenticated session.

#### Scenario: Opening the account page

- **WHEN** a signed-in user activates the "Account" entry on `/me`
- **THEN** the app navigates to `/me/account` and shows the user's name, role label, and active email address

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me`
- **THEN** the "Account" entry is present for each of them and leads to the same page

#### Scenario: Unauthenticated access

- **WHEN** a user with no active session requests `/me/account`
- **THEN** the app applies its standard authentication guard and sends the user to the sign-in screen

### Requirement: Google connection section

The account page SHALL contain a Google connection section that explains that connecting a Google account enables signing in with Google, and offers Google's branded control to perform the connection. The section SHALL be omitted entirely when the deployment has no Google client configured.

#### Scenario: Section is offered

- **WHEN** a signed-in user opens `/me/account` on a deployment where Google is configured
- **THEN** a Google connection section is shown, stating that connecting a Google account lets the user sign in with Google, together with Google's branded control to connect

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured
- **THEN** the account page shows no Google connection section and no reference to Google sign-in

### Requirement: Connecting a Google account

When the user completes the Google flow from the account page, the system SHALL submit the resulting Google identity assertion to `POST /api/v1/user/me/link-google-account` on behalf of the signed-in user, and SHALL confirm success in place. No Google credential SHALL be retained after the request.

#### Scenario: Successful connection

- **WHEN** the signed-in user picks a Google account and the request responds `204`
- **THEN** the section reports that the Google account is now connected and that the user can sign in with Google from the sign-in screen

#### Scenario: Request in progress

- **WHEN** the Google flow has returned an identity and the request has not yet completed
- **THEN** the section shows a connecting state and does not start a second concurrent request

#### Scenario: User abandons the Google flow

- **WHEN** the user dismisses or cancels Google's account chooser
- **THEN** no request is sent, no message is shown, and the section returns to its idle state

#### Scenario: Google credential is not retained

- **WHEN** the request completes, whether it succeeds or fails
- **THEN** the Google identity assertion is not written to local storage, session storage, cookies, or the URL

### Requirement: Connection conflicts are explained distinctly

The system SHALL surface the backend's one-Google-account-per-user and one-user-per-Google-account constraints as understandable outcomes rather than generic errors, distinguishing "you already connected an account" from "this Google account belongs to someone else" whenever the response allows it.

#### Scenario: User already connected a Google account

- **WHEN** the request responds `409` reporting that the user already has a linked Google account
- **THEN** the section explains that this account already has a Google account connected and that only one can be connected at a time

#### Scenario: Google account belongs to another user

- **WHEN** the request responds `409` reporting that the Google account is already linked to another user
- **THEN** the section explains that this Google account is already connected to another Flight Tracker account and suggests choosing a different Google account

#### Scenario: Conflict reason is not distinguishable

- **WHEN** the request responds `409` and the response does not identify which constraint was violated
- **THEN** the section states that the Google account could not be connected because either this account or that Google account is already connected

#### Scenario: Google identity is rejected

- **WHEN** the request responds `400`, or responds `401` reporting an invalid Google token or an unverified Google email address
- **THEN** the section reports that the Google account could not be connected, states the reason when it is a verification problem, and leaves the user's session intact

#### Scenario: Session is no longer valid

- **WHEN** the request responds `401` because the user's own session cannot be renewed
- **THEN** the app applies its standard expired-session handling and returns the user to the sign-in screen

#### Scenario: Service unreachable or failing

- **WHEN** the request fails without a response status or responds with a `5xx` status
- **THEN** the section reports a temporary failure and invites the user to try again later, leaving the connection state unchanged

### Requirement: Connection state is not claimed beyond what is known

Because the user profile does not report whether a Google account is connected, the system SHALL NOT present a persistent "connected" or "not connected" status, and SHALL NOT offer disconnecting. Confirmation of a successful connection SHALL be presented as the outcome of the action just performed, valid for that visit only.

#### Scenario: Returning to the page after connecting

- **WHEN** a user who connected a Google account earlier reopens `/me/account`
- **THEN** the section is presented in its neutral state offering to connect, without asserting that no account is connected

#### Scenario: No disconnect action

- **WHEN** the Google connection section is shown in any state
- **THEN** no control to disconnect or replace a connected Google account is offered

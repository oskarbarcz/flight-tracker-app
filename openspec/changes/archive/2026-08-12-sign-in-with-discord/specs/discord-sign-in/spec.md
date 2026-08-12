## Purpose

Let a user who has connected their Discord account to Flight Tracker sign in with Discord from the sign-in screen instead of typing an email and password, ending in exactly the same authenticated session a password sign-in produces.

## ADDED Requirements

### Requirement: Discord sign-in option on the sign-in screen

The sign-in screen SHALL offer Discord as an alternative to the email and password form, presented below the password form among the other third-party options and visually separated from it. The email and password form SHALL remain fully functional and SHALL remain the first control a user reaches. The option SHALL be presented as Discord, recognisably, without imitating Google's branded control.

#### Scenario: Discord option is shown

- **WHEN** a signed-out user opens the sign-in screen and Discord sign-in is configured for the deployment
- **THEN** a Discord sign-in control is shown below the email and password form, grouped with the other third-party sign-in options under the divider that introduces them

#### Scenario: Password form keeps precedence

- **WHEN** the sign-in screen is rendered with the Discord option present
- **THEN** initial focus is placed in the email field and the email/password submit button remains the primary action

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** no Discord control or Discord-related text appears anywhere on the sign-in screen, and the remaining options are presented without a gap where it would have been

### Requirement: Discord identity is exchanged for a Flight Tracker session

When the user returns from Discord having granted access, the system SHALL exchange the authorization code for the application's own access and refresh tokens via `POST /api/v1/auth/discord`, and SHALL persist and use those tokens in exactly the same way as tokens obtained from a password sign-in. The exchange SHALL carry the value binding the code to this browser's flow, so that a code intercepted elsewhere cannot be redeemed.

#### Scenario: Successful Discord sign-in

- **WHEN** a user grants access with a Discord account that is connected to a Flight Tracker account
- **THEN** the system obtains access and refresh tokens from `POST /api/v1/auth/discord`, stores them as the active session, loads the signed-in user, and navigates to the landing screen for that user's role

#### Scenario: Session is indistinguishable from a password session

- **WHEN** a user has signed in with Discord
- **THEN** token refresh, sign-out, and role-based access behave identically to a session started with email and password

### Requirement: Signing in never creates an account

Discord sign-in SHALL only ever open a session for an account that has already connected that Discord account. The system SHALL NOT create a Flight Tracker account, and SHALL NOT connect a Discord account to an existing one, as a side effect of signing in.

#### Scenario: Discord account is not connected to anything

- **WHEN** a user signs in with a Discord account that no Flight Tracker account has connected
- **THEN** no account is created, no connection is made, the user remains signed out, and the screen explains how to connect the account first

### Requirement: Discord sign-in failure messaging

The system SHALL report a failed Discord sign-in in plain language, on the sign-in screen, in the same alert region used by password sign-in errors, and SHALL distinguish an account that is not connected from a rejected authorization. A failure SHALL never leave the user in a partially authenticated state.

#### Scenario: Discord account is not connected to any Flight Tracker account

- **WHEN** the exchange responds reporting that no user account is linked to this Discord account
- **THEN** the screen explains that this Discord account is not connected to a Flight Tracker account and that the user must sign in with their email and password once and connect it from their account page

#### Scenario: Authorization is rejected

- **WHEN** the exchange responds reporting that the Discord authorization is not valid, as when the code has expired or has already been used
- **THEN** the screen explains that Discord sign-in could not be completed and invites the user to try again or use email and password

#### Scenario: Unrecognised failure reason

- **WHEN** the response carries a status the screen does not distinguish, or carries no usable reason
- **THEN** the screen falls back to a generic sign-in failure message rather than showing nothing or a raw payload

#### Scenario: Flight Tracker is unreachable

- **WHEN** the exchange request fails without a response status
- **THEN** the screen shows the same "can't reach Flight Tracker" message used by password sign-in

#### Scenario: Flight Tracker fails on its side

- **WHEN** the exchange responds with a `5xx` status
- **THEN** the screen shows the same server-side failure message used by password sign-in

#### Scenario: Discord's own service is failing

- **WHEN** the exchange responds reporting that Discord could not be reached
- **THEN** the screen explains that Discord is unavailable and invites the user to try again later or use email and password

#### Scenario: Failure leaves no partial session

- **WHEN** a Discord sign-in fails for any reason
- **THEN** no access or refresh token is stored, no user is loaded, and the user remains on the sign-in screen signed out

### Requirement: Progress and interaction locking during Discord sign-in

While a Discord sign-in is being completed, the app SHALL indicate that sign-in is in progress and SHALL prevent a second concurrent sign-in attempt through the Discord option, the other third-party options, or the password form.

#### Scenario: Exchange in progress

- **WHEN** the user has returned from Discord and the exchange with Flight Tracker has not yet completed
- **THEN** a sign-in-in-progress state is shown and no other sign-in attempt can be started

#### Scenario: Attempt finishes

- **WHEN** the exchange completes with an error
- **THEN** the in-progress state is cleared and the password form and third-party options accept input again

### Requirement: Discord sign-in respects existing session handling

Discord sign-in SHALL be startable only from the signed-out sign-in screen and SHALL respect the app's existing redirect behaviour for already-authenticated users.

#### Scenario: Already signed in

- **WHEN** a user with an active session opens the sign-in screen
- **THEN** they are redirected to their role's landing screen and never see the Discord option

#### Scenario: Offline sign-in screen

- **WHEN** the sign-in screen is opened with no network connection, for example from the installed PWA
- **THEN** the screen renders, the email and password form is presented, and starting a Discord sign-in either is prevented or reports that Discord cannot be reached, rather than leaving the app on a blank screen

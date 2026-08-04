# Google sign-in

## Purpose

Let a user who has connected their Google account to Flight Tracker sign in with Google from the sign-in screen instead of typing an email and password, ending in exactly the same authenticated session a password sign-in produces.

## Requirements

### Requirement: Google sign-in option on the sign-in screen

The sign-in screen SHALL offer Google as an alternative to the email and password form, presented as Google's own branded sign-in button below the password form and visually separated from it. The email and password form SHALL remain fully functional and SHALL remain the first control a user reaches.

#### Scenario: Google option is shown

- **WHEN** a signed-out user opens the sign-in screen and Google sign-in is configured for the deployment
- **THEN** Google's branded sign-in button is shown below the email and password form, separated by a divider labelled to indicate an alternative

#### Scenario: Password form keeps precedence

- **WHEN** the sign-in screen is rendered with the Google option present
- **THEN** initial focus is placed in the email field and the email/password submit button remains the primary action

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured
- **THEN** no Google button, divider, or Google-related text appears anywhere on the sign-in screen, and the email and password form is presented exactly as it was before this capability existed

### Requirement: Google identity is exchanged for a Flight Tracker session

When the user completes the Google flow, the system SHALL exchange the resulting Google identity assertion for the application's own access and refresh tokens via `POST /api/v1/auth/google`, and SHALL persist and use those tokens in exactly the same way as tokens obtained from a password sign-in. No Google credential SHALL be retained after the exchange.

#### Scenario: Successful Google sign-in

- **WHEN** a user picks a Google account whose Google identity is connected to a Flight Tracker account
- **THEN** the system obtains access and refresh tokens from `POST /api/v1/auth/google`, stores them as the active session, loads the signed-in user, and navigates to the landing screen for that user's role

#### Scenario: Session is indistinguishable from a password session

- **WHEN** a user has signed in with Google
- **THEN** token refresh, sign-out, and role-based access behave identically to a session started with email and password

#### Scenario: Google credential is not retained

- **WHEN** the exchange completes, whether it succeeds or fails
- **THEN** the Google identity assertion is not written to local storage, session storage, cookies, or the URL

### Requirement: Progress and interaction locking during Google sign-in

While a Google sign-in is in flight, the sign-in screen SHALL indicate that sign-in is in progress and SHALL prevent a second concurrent sign-in attempt through either the Google button or the password form.

#### Scenario: Exchange in progress

- **WHEN** the Google flow has returned an identity and the exchange with Flight Tracker has not yet completed
- **THEN** the screen shows a sign-in-in-progress state and neither the password form nor the Google button starts another attempt

#### Scenario: Attempt finishes

- **WHEN** the exchange completes with an error
- **THEN** the in-progress state is cleared and both the password form and the Google button accept input again

### Requirement: Google sign-in failure messaging

The system SHALL report a failed Google sign-in in plain language, on the sign-in screen, in the same alert region used by password sign-in errors, and SHALL distinguish an account that is not connected from a rejected Google identity, since the endpoint answers `401` for both. A failure SHALL never leave the user in a partially authenticated state.

#### Scenario: Google account is not connected to any Flight Tracker account

- **WHEN** `POST /api/v1/auth/google` responds `401` reporting that no user account is linked to this Google account
- **THEN** the screen explains that this Google account is not connected to a Flight Tracker account and that the user must sign in with their email and password once and connect it from their account page

#### Scenario: Google email address is not verified

- **WHEN** `POST /api/v1/auth/google` responds `401` reporting that the Google account's email address is not verified
- **THEN** the screen explains that the Google account's email address must be verified with Google before it can be used to sign in

#### Scenario: Google identity is rejected

- **WHEN** `POST /api/v1/auth/google` responds `401` reporting an invalid Google token, or responds `400`
- **THEN** the screen explains that Google sign-in could not be completed and invites the user to try again or use email and password

#### Scenario: Unrecognised failure reason

- **WHEN** the response carries a status the screen does not distinguish, or carries no usable reason
- **THEN** the screen falls back to a generic sign-in failure message rather than showing nothing or a raw payload

#### Scenario: Flight Tracker is unreachable

- **WHEN** the exchange request fails without a response status
- **THEN** the screen shows the same "can't reach Flight Tracker" message used by password sign-in

#### Scenario: Flight Tracker fails on its side

- **WHEN** the exchange responds with a `5xx` status
- **THEN** the screen shows the same server-side failure message used by password sign-in

#### Scenario: User abandons the Google flow

- **WHEN** the user dismisses or cancels Google's account chooser without selecting an account
- **THEN** no error is shown, no request is sent, and the sign-in screen returns to its idle state

#### Scenario: Google's own service is unavailable

- **WHEN** Google's sign-in client cannot be loaded or initialised
- **THEN** the Google button is not presented as an operable control, the email and password form remains usable, and the failure is not reported as a Flight Tracker error

### Requirement: Google sign-in respects existing session handling

Google sign-in SHALL be reachable only from the signed-out sign-in screen and SHALL respect the app's existing redirect behaviour for already-authenticated users.

#### Scenario: Already signed in

- **WHEN** a user with an active session opens the sign-in screen
- **THEN** they are redirected to their role's landing screen and never see the Google button

#### Scenario: Offline sign-in screen

- **WHEN** the sign-in screen is opened with no network connection, for example from the installed PWA
- **THEN** the screen renders and the email and password form is presented, and the Google button is either absent or reported as unavailable rather than silently failing on activation

## MODIFIED Requirements

### Requirement: Account page

The system SHALL provide an account page at `/me/account`, available to every signed-in role, that shows the account's identity — name and role — and hosts account-level actions, each credential owned by exactly one section. The page SHALL be reachable from `/me` through an "Account" entry, and SHALL require an authenticated session. The page SHALL present its sections in a stable order — identity first, then the account's own credential actions, then third-party sign-in connections — so that a section appearing or disappearing does not reorder the others.

#### Scenario: Opening the account page

- **WHEN** a signed-in user activates the "Account" entry on `/me`
- **THEN** the app navigates to `/me/account` and shows the user's name and role label in the identity summary, and the active email address in the email section

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me`
- **THEN** the "Account" entry is present for each of them and leads to the same page

#### Scenario: Unauthenticated access

- **WHEN** a user with no active session requests `/me/account`
- **THEN** the app applies its standard authentication guard and sends the user to the sign-in screen

#### Scenario: Section order

- **WHEN** a signed-in user opens `/me/account`
- **THEN** the identity summary appears first, the email section after it, the password section after that, and the Google connection section last

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured
- **THEN** the identity, email, and password sections are shown in the same order and positions, with no gap or reference where the Google section would have been

#### Scenario: No credential is shown twice

- **WHEN** a signed-in user opens `/me/account`
- **THEN** the email address appears in the email section only, and the identity summary carries no value that another section already owns

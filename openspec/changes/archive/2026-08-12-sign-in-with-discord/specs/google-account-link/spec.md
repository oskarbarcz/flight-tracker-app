## MODIFIED Requirements

### Requirement: Account page

The system SHALL provide an account page at `/me/account`, available to every signed-in role, that shows the account's identity — name and role — and hosts account-level actions, each credential owned by exactly one section. The page SHALL be reachable from `/me` through an "Account" entry, and SHALL require an authenticated session. The page SHALL present itself as a single account record — one panel headed by the account's identity, with each section a divided row inside it — rather than as a stack of separate cards, so that no optional section carries the same visual weight as the credentials the account signs in with. The page SHALL present its sections in a stable order — identity first, then the account's own credential actions, then third-party sign-in connections in a fixed relative order — so that a section appearing or disappearing does not reorder the others.

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
- **THEN** the identity summary appears first, the email section after it, the password section after that, and the third-party connection sections after those with the Google connection section before the Discord connection section, all within one record panel separated by dividers rather than as detached cards

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured
- **THEN** the identity, email, and password sections are shown in the same order and positions, with no gap or reference where the Google section would have been

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** the remaining sections are shown in the same order and positions, with no gap or reference where the Discord section would have been

#### Scenario: No credential is shown twice

- **WHEN** a signed-in user opens `/me/account`
- **THEN** the email address appears in the email section only, and the identity summary carries no value that another section already owns

### Requirement: Google connection section

The account page SHALL contain a Google connection section that explains that connecting a Google account enables signing in with Google, and offers the action appropriate to the current state: Google's branded control to connect when no Google account is connected, and disconnecting when one is. The section SHALL be omitted entirely when the deployment has no Google client configured.

Because the branded control is loaded from Google and may never arrive, the section SHALL stay invisible until either that control is ready or the profile reports a connected Google account, so it never appears as an offer the user cannot act on and never reflows the record by arriving late or being withdrawn. When a Google account is already connected, the section SHALL NOT depend on Google's control being available, since disconnecting does not need it.

#### Scenario: Section is offered

- **WHEN** a signed-in user with no connected Google account opens `/me/account` on a deployment where Google is configured
- **THEN** a Google connection section is shown, stating that connecting a Google account lets the user sign in with Google, together with Google's branded control to connect

#### Scenario: Google's control has not loaded yet

- **WHEN** the page has rendered for a user with no connected Google account and Google's branded control is still loading
- **THEN** the section is not visible, so neither its explanation nor an inert control is shown, and the rest of the record holds its position

#### Scenario: Google's control cannot be loaded

- **WHEN** Google's script fails to load, as when a content blocker prevents it, and no Google account is connected
- **THEN** the account page shows no Google connection section, exactly as when Google is not configured

#### Scenario: Connected account does not depend on Google's control

- **WHEN** the profile reports a connected Google account and Google's branded control is still loading or has failed to load
- **THEN** the section is shown, reports the account as connected, and offers disconnecting

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured
- **THEN** the account page shows no Google connection section and no reference to Google sign-in

## ADDED Requirements

### Requirement: Google connection state is reported from the profile

The Google connection section SHALL report whether a Google account is connected using the linked-identity information carried by the user's profile, so the state is correct on first render and survives reloading the page. When an account is connected, the section SHALL identify it by the email address the profile reports for it, when one is reported.

#### Scenario: No Google account connected

- **WHEN** a signed-in user whose profile reports no connected Google account opens the account page
- **THEN** the section states that no Google account is connected and offers to connect one

#### Scenario: Google account connected

- **WHEN** a signed-in user whose profile reports a connected Google account opens the account page
- **THEN** the section states that Google is connected, identifies the connected account by its email address, and offers to disconnect it

#### Scenario: State survives a reload

- **WHEN** a user who connected a Google account earlier reloads the account page
- **THEN** the section still reports the account as connected, without the user having to repeat the connection

#### Scenario: Connected account reports no email address

- **WHEN** the profile reports a connected Google account without an email address
- **THEN** the section reports the account as connected without naming it, rather than showing an empty value

#### Scenario: Connecting updates the reported state

- **WHEN** a user connects a Google account from the section
- **THEN** the section reports the account as connected and offers disconnecting, without requiring the page to be reloaded

### Requirement: Disconnecting a Google account

The section SHALL let a user with a connected Google account disconnect it via `POST /api/v1/user/me/unlink-google-account`, confirming the action with their current password because disconnecting removes a way of signing in. Disconnecting SHALL state its consequence before it is performed: signing in with Google stops working.

#### Scenario: Successful disconnection

- **WHEN** a connected user confirms disconnection with their correct current password
- **THEN** the request succeeds, the section reports that no Google account is connected, and the connect control is offered again

#### Scenario: Consequence is stated first

- **WHEN** the user begins disconnecting
- **THEN** they are told that signing in with Google will stop working, before the request is sent

#### Scenario: Wrong password

- **WHEN** the user confirms disconnection with an incorrect current password
- **THEN** the request responds `401`, the section reports that the password was not correct, and the Google account remains connected

#### Scenario: Account has no password

- **WHEN** the request responds reporting that the account cannot unlink without a password
- **THEN** the section explains that a password must be set before Google can be disconnected, so the account is not left without any way to sign in, and the account remains connected

#### Scenario: Nothing to disconnect

- **WHEN** the request responds reporting that the user has no linked Google account
- **THEN** the section reports the account as not connected and offers to connect one

#### Scenario: Request in progress

- **WHEN** the disconnection request has been sent and has not yet completed
- **THEN** the section shows a disconnecting state and does not start a second concurrent request

#### Scenario: Service unreachable or failing

- **WHEN** the request fails without a response status or responds with a `5xx` status
- **THEN** the section reports a temporary failure, invites the user to try again later, and continues to report the account as connected

## REMOVED Requirements

### Requirement: Connection state is not claimed beyond what is known

**Reason**: The limitation this requirement encoded no longer exists. It forbade reporting connection state and forbade disconnecting because the user profile did not report whether a Google account was connected. The profile now carries linked-identity information, so the section can report its real state on every visit, and the already-implemented `POST /api/v1/user/me/unlink-google-account` endpoint can be offered.

**Migration**: Replaced by "Google connection state is reported from the profile" and "Disconnecting a Google account" in this same capability. The per-visit "connected" confirmation that only reflected the action just performed is superseded by state read from the profile; no user-visible state is lost, and the previously withheld disconnect action becomes available.

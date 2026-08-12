## Purpose

Carry a user out to Discord's consent screen and back into the app safely, so that both signing in with Discord and connecting a Discord account can be started from anywhere in the app and resumed correctly on return, even though the app is unloaded in between.

## ADDED Requirements

### Requirement: Discord surfaces require configuration

Every Discord identity surface SHALL be present only when the deployment has a Discord client configured. When it is not configured, the app SHALL behave exactly as it did before this capability existed, with no Discord button, section, route reference, or explanatory text anywhere, and SHALL NOT contact `discord.com`.

This governs only the identity surfaces. The existing community invite link, which needs no client configuration, is unaffected.

#### Scenario: Discord is configured

- **WHEN** the deployment has a Discord client configured
- **THEN** the Discord sign-in option and the Discord connection section are available in their respective screens

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** the sign-in screen and the account page render with no Discord button, section, gap, or reference, and no request is made to `discord.com`

#### Scenario: Community invite is independent

- **WHEN** the deployment has no Discord client configured but a community invite is configured
- **THEN** the existing community invite link continues to work unchanged

### Requirement: Leaving for Discord carries the intent and integrity values

Starting a Discord flow SHALL send the user to Discord's authorization screen requesting only the access the flow needs, and SHALL retain, for the duration of the round trip, what the user was trying to do and the values needed to verify the return. Retained values SHALL be scoped to the browsing session rather than persisted across sessions.

The requested access SHALL be the minimum for the intent: signing in and connecting without joining the server request only the ability to read the Discord account's identity; connecting with the server join chosen additionally requests the ability to add the user to a server.

#### Scenario: Starting a sign-in

- **WHEN** a signed-out user activates the Discord sign-in option
- **THEN** the browser leaves for Discord's authorization screen requesting only identity access, and the app retains that the intent was to sign in

#### Scenario: Starting a connection without joining the server

- **WHEN** a signed-in user starts connecting Discord and has not chosen to join the server
- **THEN** the browser leaves for Discord's authorization screen requesting only identity access, and the app retains that the intent was to connect without joining

#### Scenario: Starting a connection with the server join chosen

- **WHEN** a signed-in user starts connecting Discord and has chosen to join the server
- **THEN** the browser leaves for Discord's authorization screen requesting identity access and permission to add the user to a server, and the app retains that the intent was to connect and join

#### Scenario: Integrity values are session-scoped

- **WHEN** a Discord flow is started
- **THEN** the retained verification values are available to the callback in the same browsing session and are not readable in a new browsing session

### Requirement: The callback route completes the flow it was started for

The app SHALL provide a callback route that Discord returns to, which SHALL determine what the user was trying to do from the retained intent and complete that action, rather than inferring it from the URL. While the callback is working, it SHALL show that the flow is being completed, and SHALL NOT be reachable as a meaningful destination when no flow is in progress.

#### Scenario: Returning from a sign-in

- **WHEN** Discord returns to the callback route and the retained intent was to sign in
- **THEN** the app completes the Discord sign-in and does not attempt to connect an account

#### Scenario: Returning from a connection

- **WHEN** Discord returns to the callback route and the retained intent was to connect
- **THEN** the app completes the connection, including the server join when that was chosen, and returns the user to the account page

#### Scenario: Work in progress is visible

- **WHEN** the callback route is exchanging the authorization code
- **THEN** the route reports that it is completing sign-in or completing the connection, rather than appearing blank or broken

#### Scenario: Callback opened with no flow in progress

- **WHEN** the callback route is opened directly with no retained intent, for example from a bookmark or a browser history entry
- **THEN** no request is sent, and the user is sent to the sign-in screen if signed out or to the account page if signed in, without an error being reported as a failure of theirs

### Requirement: Returns that cannot be trusted are refused

The callback SHALL verify that the return corresponds to the flow this browser started, and SHALL refuse to exchange an authorization code when it does not. A refused return SHALL leave the user signed in or signed out exactly as they were, and SHALL report that the attempt could not be completed rather than reporting a specific failure it cannot substantiate.

#### Scenario: Verification value does not match

- **WHEN** the callback receives a return whose verification value does not match the one retained for this flow
- **THEN** no authorization code is exchanged, the attempt is reported as one that could not be verified, and the user's session state is unchanged

#### Scenario: Verification value is missing

- **WHEN** the callback receives a return carrying no verification value, or the retained value is gone
- **THEN** no authorization code is exchanged and the user is invited to start the flow again

#### Scenario: Authorization code is missing

- **WHEN** the callback receives a return carrying neither an authorization code nor an error
- **THEN** no request is sent and the user is invited to start the flow again

### Requirement: Declining at Discord is not an error

When the user declines Discord's consent screen or abandons it, the app SHALL treat the return as an ordinary cancellation: no request is sent, no failure is reported, and the user is returned to where the flow began in its idle state.

#### Scenario: User declines consent

- **WHEN** Discord returns to the callback route reporting that access was denied
- **THEN** no request is sent, no error message is shown, and the user is returned to the sign-in screen or the account page according to the retained intent

#### Scenario: Discord reports another problem

- **WHEN** Discord returns to the callback route reporting a problem other than denied access
- **THEN** no request is sent and the user is told the flow could not be completed and may be retried

### Requirement: Retained values are consumed exactly once

The app SHALL clear the retained intent and verification values as soon as the callback has read them, whether the flow then succeeds or fails, so a replayed or revisited callback cannot resubmit an authorization code.

#### Scenario: Flow completes successfully

- **WHEN** the callback completes a sign-in or a connection successfully
- **THEN** the retained intent and verification values are no longer present

#### Scenario: Flow fails

- **WHEN** the callback's request fails for any reason
- **THEN** the retained intent and verification values are no longer present, and the failure is reported where the user can act on it

#### Scenario: Callback is revisited

- **WHEN** the user navigates back to the callback URL after a flow has completed
- **THEN** the authorization code is not exchanged again and the user is sent to the sign-in screen or the account page

### Requirement: No Discord credential is retained by the app

The app SHALL NOT write any Discord authorization code, access token, or refresh token to local storage, cookies, or any location that outlives the browsing session, and SHALL NOT leave an authorization code in the address bar once the callback has consumed it.

#### Scenario: After a completed flow

- **WHEN** any Discord flow completes, successfully or not
- **THEN** no Discord authorization code or token is present in local storage or cookies

#### Scenario: Address bar after the callback

- **WHEN** the callback has consumed the authorization code
- **THEN** the code is no longer present in the address bar of the page the user is left on

### Requirement: The callback works as deployed

The callback route SHALL resolve to the app under the production hosting's URL handling for a directly-requested deep link, both when the app's service worker is not yet active and when it is controlling the page, preserving the values Discord returned in the URL.

#### Scenario: Cold arrival

- **WHEN** Discord returns to the callback URL in a browser that has no active service worker for the app
- **THEN** the callback route is reached with the authorization code and verification value intact

#### Scenario: Arrival with the service worker active

- **WHEN** Discord returns to the callback URL in a browser where the app's service worker is controlling navigation
- **THEN** the callback route is reached with the authorization code and verification value intact

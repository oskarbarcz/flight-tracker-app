## Purpose

Give a signed-in user a place to connect and disconnect their Discord account, choose whether to join the Flight Tracker Discord server while doing so, and see plainly whether flight briefings can actually reach them over Discord.

## ADDED Requirements

### Requirement: Discord connection section

The account page SHALL contain a Discord connection section that explains what connecting a Discord account does — enables signing in with Discord, and lets the app send flight briefings as Discord direct messages — and offers the action appropriate to the current state. The section SHALL be omitted entirely when the deployment has no Discord client configured.

#### Scenario: Section is offered

- **WHEN** a signed-in user opens `/me/account` on a deployment where Discord is configured
- **THEN** a Discord connection section is shown, stating that connecting lets the user sign in with Discord and receive flight briefings as direct messages

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** the account page shows no Discord connection section and no reference to Discord sign-in, and the remaining sections keep their order and positions

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me/account` on a deployment where Discord is configured
- **THEN** the Discord connection section is present for each of them

### Requirement: Connection state is reported from the profile

The section SHALL report whether a Discord account is connected using the linked-identity information carried by the user's profile, so the state is correct on first render and survives reloading the page. When an account is connected, the section SHALL identify which Discord account it is, by the display name Discord reports for it, falling back to the account's username when there is no display name.

#### Scenario: No Discord account connected

- **WHEN** a signed-in user whose profile reports no connected Discord account opens the account page
- **THEN** the section states that no Discord account is connected and offers to connect one

#### Scenario: Discord account connected

- **WHEN** a signed-in user whose profile reports a connected Discord account opens the account page
- **THEN** the section presents the connected account as a card carrying its avatar, its display name, its Discord login, and a status marker on the avatar, and offers a way to manage the integration rather than a bare disconnect action

#### Scenario: Avatar is missing or cannot be loaded

- **WHEN** the connected account reports no avatar, or the reported avatar fails to load
- **THEN** the card shows a Discord placeholder in its place rather than a broken or empty image

#### Scenario: Status marker reflects what is known

- **WHEN** the card is shown for a connected account
- **THEN** the marker reads as connected while nothing is known to be wrong, and distinguishes a user known not to be in the server from one whose membership could not be checked, without ever presenting an unchecked membership as a failure

### Requirement: Managing the integration

For a connected account, the section SHALL offer a management surface listing every feature of the Discord integration with its current state — those inherent to connecting shown as always on, and server membership shown as the state it is actually in. Disconnecting SHALL be reachable from that surface, presented as the destructive action it is and separated from the features, rather than sitting alongside the account as a primary action.

#### Scenario: Management surface lists every feature

- **WHEN** a connected user opens the management surface
- **THEN** it identifies the connected account and lists briefing delivery as always on and server membership with its current state

#### Scenario: Server membership is not presented as a switch

- **WHEN** the management surface shows server membership
- **THEN** it reports the state rather than offering a control that cannot take effect, explains that joining happens only while connecting, and offers the invite when the user is not a member

#### Scenario: Disconnecting is reachable and marked destructive

- **WHEN** a connected user opens the management surface
- **THEN** disconnecting the Discord account is offered as a destructive action, and choosing it leads to the confirmation that requires the current password

#### Scenario: State survives a reload

- **WHEN** a user who connected Discord earlier reloads the account page
- **THEN** the section still reports the account as connected, without the user having to repeat the connection

#### Scenario: Connected account has no display name

- **WHEN** the profile reports a connected Discord account for which Discord supplies no display name
- **THEN** the section identifies the account by its Discord username

### Requirement: Discord settings are chosen before connecting

Starting a connection SHALL first present a Discord settings surface listing what Flight Tracker may do with the Discord account, so the user decides before any permission is requested rather than discovering the consequences at Discord's consent screen. Each entry SHALL be named, explained, and show whether it is on. Leaving that surface without confirming SHALL start nothing.

The surface SHALL distinguish entries the user controls from entries that are inherent to connecting and cannot be turned off, and SHALL state why an uncontrollable entry is always on rather than presenting it as a control that does not respond.

#### Scenario: Settings are presented before any permission is requested

- **WHEN** a signed-in user with no connected Discord account starts connecting
- **THEN** a Discord settings surface is shown listing the available features, and the browser has not yet left for Discord

#### Scenario: Abandoning the settings starts nothing

- **WHEN** the user dismisses the Discord settings surface without confirming
- **THEN** no flow is started, no permission is requested, and the section returns to its idle state

#### Scenario: Briefing delivery is inherent to connecting

- **WHEN** the Discord settings surface is shown
- **THEN** sending flight briefings as direct messages is listed as always on, is not offered as something to turn off, and is explained as what connecting Discord is for

#### Scenario: Joining the server is the user's choice

- **WHEN** the Discord settings surface is shown
- **THEN** being added to the Flight Tracker server is listed as a feature the user can turn on or off, explaining that server membership is what makes briefing direct messages deliverable

#### Scenario: Controllable features start off

- **WHEN** the Discord settings surface is first shown
- **THEN** every feature the user controls is off, so confirming without changing anything requests no more than connecting needs

#### Scenario: Joining is requested

- **WHEN** the user turns on being added to the server and confirms
- **THEN** the flow requests the additional permission needed to add them to a server, and the connection request asks for the join to be performed

#### Scenario: Joining is not requested

- **WHEN** the user confirms without turning on being added to the server
- **THEN** the flow requests only identity access and the connection request does not ask for a join

#### Scenario: Settings are not offered once connected

- **WHEN** a Discord account is already connected
- **THEN** the connect action and its settings surface are no longer offered

### Requirement: Connecting a Discord account

When the user returns from Discord having granted access for a connection, the system SHALL submit the authorization code to `POST /api/v1/user/me/link-discord-account` on behalf of the signed-in user, together with whether the server join was requested and the value binding the code to this browser's flow. On success the section SHALL report the resulting state without requiring the user to reload.

#### Scenario: Successful connection

- **WHEN** the connection request succeeds
- **THEN** the section reports that Discord is connected, identifies the connected account, and reflects the outcome of the server join

#### Scenario: Request in progress

- **WHEN** the connection request has been sent and has not yet completed
- **THEN** the section shows a connecting state and does not start a second concurrent request

#### Scenario: Session is no longer valid

- **WHEN** the request responds `401` because the user's own session cannot be renewed
- **THEN** the app applies its standard expired-session handling and returns the user to the sign-in screen

### Requirement: Connection conflicts are explained distinctly

The system SHALL surface the one-Discord-account-per-user and one-user-per-Discord-account constraints as understandable outcomes rather than generic errors, distinguishing "you already connected an account" from "this Discord account belongs to someone else" whenever the response allows it.

#### Scenario: User already connected a Discord account

- **WHEN** the request responds `409` reporting that the user already has a linked Discord account
- **THEN** the section explains that this account already has a Discord account connected and that only one can be connected at a time

#### Scenario: Discord account belongs to another user

- **WHEN** the request responds `409` reporting that the Discord account is already linked to another user
- **THEN** the section explains that this Discord account is already connected to another Flight Tracker account and suggests connecting a different Discord account

#### Scenario: Conflict reason is not distinguishable

- **WHEN** the request responds `409` and the response does not identify which constraint was violated
- **THEN** the section states that the Discord account could not be connected because either this account or that Discord account is already connected

#### Scenario: Authorization is rejected

- **WHEN** the request responds reporting that the Discord authorization is not valid
- **THEN** the section reports that the Discord account could not be connected and invites the user to try again, leaving the existing state unchanged

#### Scenario: Service unreachable or failing

- **WHEN** the request fails without a response status or responds with a `5xx` status
- **THEN** the section reports a temporary failure and invites the user to try again later, leaving the connection state unchanged

### Requirement: The outcome of the server join is reported truthfully

The system SHALL report what actually happened to the requested server join, and SHALL NOT treat a failed join as a failed connection. A connection that succeeded SHALL be kept and reported as connected even when the join did not happen.

A request rejected because the join was never authorized is a different case: no connection was made, and the system SHALL NOT report one.

#### Scenario: Join succeeded

- **WHEN** the connection succeeds and the user was added to the server
- **THEN** the section reports that Discord is connected and that the user has been added to the Flight Tracker server

#### Scenario: User was already in the server

- **WHEN** the connection succeeds and the user was already a member of the server
- **THEN** the section reports that Discord is connected and that the user is in the server, without claiming to have added them

#### Scenario: Join failed

- **WHEN** the connection succeeds but the server join could not be performed
- **THEN** the section reports that Discord is connected, states that the user could not be added to the server, explains that briefings cannot be delivered until they are in it, and offers the way to join

#### Scenario: Join was not authorized

- **WHEN** the connection request asked for a join but responds reporting that joining the server was not authorized, as when Discord reused an earlier, narrower authorization instead of asking again
- **THEN** no Discord account is connected, the section explains that permission to add the user to the server was not granted and that nothing was connected, and invites them to try again or to connect without joining

#### Scenario: Re-consent is forced when a join is requested

- **WHEN** a connection that includes the server join is started
- **THEN** the authorization request asks Discord to obtain consent again rather than reusing an existing authorization, so a previously granted narrower access cannot silently reject the connection

### Requirement: Server membership and its effect on briefings are reported

For a connected account, the account page SHALL report whether the user is a member of the Flight Tracker Discord server, and SHALL state the consequence for briefing delivery. Membership SHALL be requested only by the account page, and SHALL NOT be requested as part of loading the user's profile.

Membership SHALL be reported as one of three outcomes — a member, not a member, or not determinable — and the system SHALL NOT report a user as not a member when membership could not be determined.

#### Scenario: Connected and in the server

- **WHEN** the account page reports membership for a connected user who is in the server
- **THEN** the section states that the user is in the Flight Tracker server and that briefings will be delivered as direct messages

#### Scenario: Connected but not in the server

- **WHEN** the account page reports membership for a connected user who is not in the server
- **THEN** the section states that the user is not in the Flight Tracker server, that briefings cannot be delivered as direct messages until they are, and offers the way to join

#### Scenario: Membership cannot be determined

- **WHEN** membership cannot be determined, as when the deployment cannot reach Discord
- **THEN** the section claims neither that the user is in the server nor that they are not, and says nothing about delivery rather than filling the space with a caveat; the management surface reports the membership as unknown for anyone who looks

#### Scenario: Membership check is in progress

- **WHEN** the account page has rendered a connected account and the membership result has not arrived
- **THEN** the section shows that membership is being checked rather than showing a provisional answer

#### Scenario: No membership check without a connection

- **WHEN** the account page is opened by a user with no connected Discord account
- **THEN** no membership request is made and no membership state is shown

#### Scenario: Profile loading is unaffected

- **WHEN** the app loads the signed-in user's profile anywhere other than the account page
- **THEN** no Discord server membership request is made

### Requirement: Joining the server after connecting

When a connected user is not a member of the Discord server, the section SHALL offer a way to join it that does not require disconnecting. Because adding a user to the server is only possible while connecting, this SHALL be the community invite, opened in a new context so the user does not lose the account page.

#### Scenario: Invite is offered

- **WHEN** a connected user is reported as not a member of the server
- **THEN** the section offers a control that opens the Flight Tracker Discord invite in a new context

#### Scenario: Invite is not offered when it cannot help

- **WHEN** a connected user is reported as a member of the server
- **THEN** no join control is offered

#### Scenario: No invite configured

- **WHEN** a connected user is not a member and the deployment has no community invite configured
- **THEN** the section still states that briefings cannot be delivered until they join, without offering a control that leads nowhere

### Requirement: Disconnecting a Discord account

The section SHALL let a user with a connected Discord account disconnect it via `POST /api/v1/user/me/unlink-discord-account`, confirming the action with their current password because disconnecting removes a way of signing in. Disconnecting SHALL state its consequences before it is performed: signing in with Discord stops working, and flight briefings are no longer delivered as direct messages.

#### Scenario: Successful disconnection

- **WHEN** a connected user confirms disconnection with their correct current password
- **THEN** the request succeeds, the section reports that no Discord account is connected, and the connect action and join choice are offered again

#### Scenario: Consequences are stated first

- **WHEN** the user begins disconnecting
- **THEN** they are told that Discord sign-in will stop working and that briefings will no longer arrive as direct messages, before the request is sent

#### Scenario: Wrong password

- **WHEN** the user confirms disconnection with an incorrect current password
- **THEN** the request responds `401`, the section reports that the password was not correct, and the Discord account remains connected

#### Scenario: Account has no password

- **WHEN** the request responds reporting that the account cannot unlink without a password
- **THEN** the section explains that a password must be set before Discord can be disconnected, so the account is not left without any way to sign in, and the account remains connected

#### Scenario: Nothing to disconnect

- **WHEN** the request responds reporting that the user has no linked Discord account
- **THEN** the section reports the account as not connected and offers to connect one

#### Scenario: Request in progress

- **WHEN** the disconnection request has been sent and has not yet completed
- **THEN** the section shows a disconnecting state and does not start a second concurrent request

#### Scenario: Service unreachable or failing

- **WHEN** the request fails without a response status or responds with a `5xx` status
- **THEN** the section reports a temporary failure, invites the user to try again later, and continues to report the account as connected

### Requirement: Disconnecting does not remove the user from the server

Disconnecting a Discord account SHALL affect only the connection between the two accounts. The system SHALL NOT remove the user from the Flight Tracker Discord server, and SHALL NOT suggest that it has.

#### Scenario: Membership is untouched

- **WHEN** a user who is a member of the Flight Tracker Discord server disconnects their Discord account
- **THEN** nothing in the flow removes them from the server, and the reported consequences mention only Discord sign-in and briefing delivery

# discord-account-link Specification

## Purpose
Give a signed-in user a place to connect and disconnect their Discord account, choose whether to join the MyPreflight Discord server while doing so, choose which flight messages Discord brings them, and see plainly whether those messages can actually reach them.
## Requirements
### Requirement: Discord connection section

The account page SHALL contain a Discord connection section that explains what connecting a Discord account does — enables signing in with Discord, and lets the app send messages about the user's flights as Discord direct messages — and offers the action appropriate to the current state. The section SHALL be omitted entirely when the deployment has no Discord client configured.

#### Scenario: Section is offered

- **WHEN** a signed-in user opens `/me/account` on a deployment where Discord is configured
- **THEN** a Discord connection section is shown, stating that connecting lets the user sign in with Discord and receive messages about their flights as direct messages

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** the account page shows no Discord connection section and no reference to Discord sign-in, and the remaining sections keep their order and positions

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me/account` on a deployment where Discord is configured
- **THEN** the Discord connection section is present for each of them

### Requirement: Connection state is reported from the profile

The section SHALL report whether a Discord account is connected using the linked-identity information carried by the user's profile, so the state is correct on first render and survives reloading the page. When an account is connected, the section SHALL identify which Discord account it is, by the display name Discord reports for it, falling back to the account's username when there is no display name.

The connected account SHALL be presented as a panel spanning the full width of the account record rather than sharing a column with the row's action, and SHALL follow the account page's existing inner-panel treatment rather than inventing its own. The Discord login SHALL be set in the same treatment the page uses for other account identifiers, so it reads as a value of the same class as the email address. The status marker SHALL use the same semantic success and warning tokens as the account page's other status markers.

#### Scenario: No Discord account connected

- **WHEN** a signed-in user whose profile reports no connected Discord account opens the account page
- **THEN** the section states that no Discord account is connected and offers to connect one

#### Scenario: Discord account connected

- **WHEN** a signed-in user whose profile reports a connected Discord account opens the account page
- **THEN** the section presents the connected account as a card carrying its avatar, its display name, its Discord login, and a status marker on the avatar, and offers a way to manage the integration rather than a bare disconnect action

#### Scenario: Connected account spans the record

- **WHEN** the connected-account card is shown
- **THEN** it spans the full width of the account record, and the row's action does not sit beside it competing for the same horizontal space

#### Scenario: Login reads as an account identifier

- **WHEN** the connected-account card shows the Discord login
- **THEN** it is set in the same monospaced treatment the account page uses for the email address, and the display name above it remains the primary line

#### Scenario: Integration is identifiable as Discord

- **WHEN** the connected-account card is shown
- **THEN** the account avatar carries Discord's brand hue as a ring around it, and that hue appears only on marks that identify the integration — never on actions, body text, or panel surfaces

#### Scenario: Brand hue holds contrast in both themes

- **WHEN** the brand mark is rendered in dark mode
- **THEN** it uses a lighter variant of the brand hue, because the base hue does not meet the contrast bar against the dark canvas

#### Scenario: Avatar is missing or cannot be loaded

- **WHEN** the connected account reports no avatar, or the reported avatar fails to load
- **THEN** the card shows a Discord placeholder in its place rather than a broken or empty image

#### Scenario: Status marker reflects what is known

- **WHEN** the card is shown for a connected account
- **THEN** the marker reads as connected while nothing is known to be wrong, and distinguishes a user known not to be in the server from one whose membership could not be checked, without ever presenting an unchecked membership as a failure

### Requirement: Managing the integration

For a connected account, the section SHALL offer a notifications settings surface that opens on the connected account itself — avatar, display name, and login — followed by the messages the user can receive. The surface SHALL be dismissed by a close control in its own header and SHALL carry no bar of actions beneath it, since everything it offers takes effect where it stands.

Whether the user is in the MyPreflight server SHALL be told on that same first line, as a mark and a word rather than a switch, because joining happens only while connecting. When they are not a member, the invite SHALL be offered beside it.

Disconnecting SHALL sit on that first line, beside the account it acts on, and SHALL read as an ordinary control until it is approached — carrying the destructive hue only on hover — so it is never mistaken for the surface's main action.

#### Scenario: Settings surface opens on the account

- **WHEN** a connected user opens the notifications settings
- **THEN** the first line identifies the connected account, states whether the user is in the MyPreflight server, and offers disconnecting beside it

#### Scenario: Surface is dismissed from its header

- **WHEN** a connected user has finished with the notifications settings
- **THEN** a close control in the surface's own header dismisses it, and no footer of actions is presented

#### Scenario: Server membership is not presented as a switch

- **WHEN** the surface reports server membership
- **THEN** it marks the state rather than offering a control that cannot take effect, and offers the invite when the user is not a member

#### Scenario: Disconnecting is reachable and marked destructive

- **WHEN** a connected user opens the notifications settings
- **THEN** disconnecting the Discord account is offered beside the account, taking on its destructive hue as the user reaches for it, and choosing it leads to the confirmation that requires the current password

#### Scenario: State survives a reload

- **WHEN** a user who connected Discord earlier reloads the account page
- **THEN** the section still reports the account as connected, without the user having to repeat the connection

#### Scenario: Connected account has no display name

- **WHEN** the profile reports a connected Discord account for which Discord supplies no display name
- **THEN** the section identifies the account by its Discord username

### Requirement: Discord settings are chosen before connecting

Starting a connection SHALL first present a Discord settings surface listing what MyPreflight may do with the Discord account, so the user decides before any permission is requested rather than discovering the consequences at Discord's consent screen. Each entry SHALL be named, explained, show whether it is on, and be expandable to the message it stands for. Leaving that surface without confirming SHALL start nothing.

The surface SHALL distinguish entries that are settings of the account, kept whether or not a connection follows, from entries that apply only to the connection being started.

#### Scenario: Settings are presented before any permission is requested

- **WHEN** a signed-in user with no connected Discord account starts connecting
- **THEN** a Discord settings surface is shown listing the available features, and the browser has not yet left for Discord

#### Scenario: Abandoning the settings starts nothing

- **WHEN** the user dismisses the Discord settings surface without confirming
- **THEN** no flow is started, no permission is requested, and the section returns to its idle state

#### Scenario: Message delivery is offered as settings

- **WHEN** the Discord settings surface is shown
- **THEN** every message sent as a direct message is listed as a switch carrying the state stored for the account, explained as choices kept with the account that take effect once Discord is connected

#### Scenario: Joining the server is the user's choice

- **WHEN** the Discord settings surface is shown
- **THEN** being added to the MyPreflight server is listed as a feature the user can turn on or off, explaining that server membership is what makes briefing direct messages deliverable

#### Scenario: Permissions requested for this connection start off

- **WHEN** the Discord settings surface is first shown
- **THEN** every entry that asks Discord for more than connecting needs is off, so confirming without changing anything requests no more than connecting needs

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
- **THEN** the section explains that this Discord account is already connected to another MyPreflight account and suggests connecting a different Discord account

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
- **THEN** the section reports that Discord is connected and that the user has been added to the MyPreflight server

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

### Requirement: Each message is turned on and off by the user

Every message MyPreflight sends as a Discord direct message SHALL be a setting of the account, read from `GET /api/v1/user/me/discord-settings` and written with `PATCH /api/v1/user/me/discord-settings`, offered wherever the Discord integration is configured. The settings SHALL be readable and writable whether or not a Discord account is connected, since they decide what happens once one is.

The messages SHALL be presented together as one list, each named and stated by the moment it arrives — the flight briefing on check-in, the preliminary loadsheet when boarding starts, the final loadsheet when boarding finishes, and the delay updates that ask for an allocation and report its approval — so a user reads the whole of what Discord would bring them in one place. What they have in common — that each arrives as a direct message, is kept with the account, and reaches them only while connected and in the server — SHALL be stated once for the list rather than repeated on every entry.

A change SHALL be sent on its own as soon as it is made, carrying only the setting that changed and leaving the rest untouched, and SHALL NOT depend on the user completing a connection or confirming the surface it was made on. While a change is in flight, or while the stored settings are not known, no switch SHALL invite another change. A change that fails SHALL leave the switches showing the state that is actually stored, and SHALL say that it could not be saved.

#### Scenario: A message is turned off

- **WHEN** a user turns one of the message switches off
- **THEN** only that setting is sent, the choice is saved for the account immediately, and the switches settle on the state the API reports back

#### Scenario: Choice is kept without connecting

- **WHEN** a user with no connected Discord account changes a message switch and leaves the settings surface without connecting
- **THEN** the choice is kept for the account, so it applies as soon as a Discord account is connected

#### Scenario: Choice cannot be saved

- **WHEN** saving a message choice fails
- **THEN** the switch returns to the state stored before the change, and the surface says the choice could not be saved

#### Scenario: Stored state is not known

- **WHEN** the stored settings cannot be read
- **THEN** the switches are shown as unchangeable rather than claiming states they do not have

#### Scenario: Every message can be seen before it is chosen

- **WHEN** a user expands one of the messages
- **THEN** the message it stands for is shown as it arrives on Discord — the briefing with its schedule, departure weather and attached flight plan; a loadsheet with its crew and load; the delay pair with the delay to allocate and its approval — marked as an example rather than as their own flight

#### Scenario: One example at a time

- **WHEN** a user expands a second message
- **THEN** the one that was open closes, so the list never stacks examples on top of each other

#### Scenario: A shared setting shows every message it governs

- **WHEN** a user expands a message whose switch governs more than one message
- **THEN** each of them is shown, one after another, so the switch is understood by everything it silences

#### Scenario: The example reads as a picture of Discord

- **WHEN** an example is shown
- **THEN** it carries Discord's own surface rather than the account page's, and behaves as a picture of the message would — nothing in it is selectable, clickable, or announced as separate text — so it is never mistaken for the app's own interface

### Requirement: Server membership and its effect on briefings are reported

For a connected account, the account page SHALL report whether the user is a member of the MyPreflight Discord server, and SHALL state the consequence for briefing delivery. Membership SHALL be requested only by the account page, and SHALL NOT be requested as part of loading the user's profile.

Membership SHALL be reported as one of three outcomes — a member, not a member, or not determinable — and the system SHALL NOT report a user as not a member when membership could not be determined.

#### Scenario: Connected and in the server

- **WHEN** the account page reports membership for a connected user who is in the server
- **THEN** the section states that the user is in the MyPreflight server and that briefings will be delivered as direct messages

#### Scenario: Connected but not in the server

- **WHEN** the account page reports membership for a connected user who is not in the server
- **THEN** the section states that the user is not in the MyPreflight server, that briefings cannot be delivered as direct messages until they are, and offers the way to join

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
- **THEN** the section offers a control that opens the MyPreflight Discord invite in a new context

#### Scenario: Invite is not offered when it cannot help

- **WHEN** a connected user is reported as a member of the server
- **THEN** no join control is offered

#### Scenario: No invite configured

- **WHEN** a connected user is not a member and the deployment has no community invite configured
- **THEN** the section still states that briefings cannot be delivered until they join, without offering a control that leads nowhere

### Requirement: Disconnecting a Discord account

The section SHALL let a user with a connected Discord account disconnect it via `POST /api/v1/user/me/unlink-discord-account`, confirming the action with their current password because disconnecting removes a way of signing in. Disconnecting SHALL state its consequences before it is performed: signing in with Discord stops working, and flight messages are no longer delivered as direct messages.

#### Scenario: Successful disconnection

- **WHEN** a connected user confirms disconnection with their correct current password
- **THEN** the request succeeds, the section reports that no Discord account is connected, and the connect action and join choice are offered again

#### Scenario: Consequences are stated first

- **WHEN** the user begins disconnecting
- **THEN** they are told that Discord sign-in will stop working and that flight messages will no longer arrive as direct messages, before the request is sent

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

Disconnecting a Discord account SHALL affect only the connection between the two accounts. The system SHALL NOT remove the user from the MyPreflight Discord server, and SHALL NOT suggest that it has.

#### Scenario: Membership is untouched

- **WHEN** a user who is a member of the MyPreflight Discord server disconnects their Discord account
- **THEN** nothing in the flow removes them from the server, and the reported consequences mention only Discord sign-in and message delivery


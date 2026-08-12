## MODIFIED Requirements

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

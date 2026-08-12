## MODIFIED Requirements

### Requirement: Discord sign-in option on the sign-in screen

The sign-in screen SHALL offer Discord as an alternative to the email and password form, presented below the password form among the other third-party options and visually separated from it. The email and password form SHALL remain fully functional and SHALL remain the first control a user reaches. The option SHALL be presented as Discord, recognisably, without imitating Google's branded control.

Because the third-party options sit stacked and adjacent, the Discord control SHALL read as a visual peer of the branded control beside it — matching its height, width, border weight, and label weight — so the group reads as one set of alternatives rather than two unrelated designs. Discord's brand hue SHALL identify the option through its glyph only, and SHALL NOT be used to fill the control or to compete with the primary action.

#### Scenario: Discord option is shown

- **WHEN** a signed-out user opens the sign-in screen and Discord sign-in is configured for the deployment
- **THEN** a Discord sign-in control is shown below the email and password form, grouped with the other third-party sign-in options under the divider that introduces them

#### Scenario: Third-party options read as one set

- **WHEN** the Discord control is rendered beside another third-party option
- **THEN** its height, width, border weight, and label weight match that option's, so neither reads as heavier or more prominent than the other

#### Scenario: Brand hue is confined to the glyph

- **WHEN** the Discord control is rendered
- **THEN** Discord's brand hue appears on its glyph only, leaving the control's fill and label in the neutral treatment shared with the other third-party options

#### Scenario: Password form keeps precedence

- **WHEN** the sign-in screen is rendered with the Discord option present
- **THEN** initial focus is placed in the email field and the email/password submit button remains the primary action

#### Scenario: Discord is not configured

- **WHEN** the deployment has no Discord client configured
- **THEN** no Discord control or Discord-related text appears anywhere on the sign-in screen, and the remaining options are presented without a gap where it would have been

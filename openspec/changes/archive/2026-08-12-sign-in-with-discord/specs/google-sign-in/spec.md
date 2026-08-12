## MODIFIED Requirements

### Requirement: Google sign-in option on the sign-in screen

The sign-in screen SHALL offer Google as one of possibly several alternatives to the email and password form, presented as Google's own branded sign-in button below the password form, grouped with the other third-party sign-in options and visually separated from the form by a single divider that introduces the group. The email and password form SHALL remain fully functional and SHALL remain the first control a user reaches. The divider SHALL be present whenever at least one third-party option is available, and SHALL be absent when none is.

#### Scenario: Google option is shown

- **WHEN** a signed-out user opens the sign-in screen and Google sign-in is configured for the deployment
- **THEN** Google's branded sign-in button is shown below the email and password form, within the group of third-party options introduced by a divider labelled to indicate an alternative

#### Scenario: Password form keeps precedence

- **WHEN** the sign-in screen is rendered with the Google option present
- **THEN** initial focus is placed in the email field and the email/password submit button remains the primary action

#### Scenario: Google is not configured

- **WHEN** the deployment has no Google client configured and at least one other third-party sign-in option is configured
- **THEN** no Google button or Google-related text appears anywhere on the sign-in screen, the divider and the remaining options are shown, and no gap is left where the Google button would have been

#### Scenario: No third-party option is configured

- **WHEN** the deployment has no third-party sign-in configured at all
- **THEN** no third-party button, divider, or third-party-related text appears anywhere on the sign-in screen, and the email and password form is presented exactly as it was before any third-party sign-in existed

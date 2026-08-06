# Password change

## Purpose

Let a signed-in user replace their own password from the account page without an administrator or an email round-trip, proving the current password first, and make the strength policy and every failure outcome understandable before and after submission.

## Requirements

### Requirement: Password section on the account page

The account page SHALL host a password section, available to every signed-in role, that offers changing the account's password. The section SHALL be presented collapsed by default, showing only its purpose and a control to begin, and SHALL expand into the change form when that control is activated. The section SHALL be present regardless of whether the account also signs in with Google, because the profile does not report whether the account has a password.

#### Scenario: Section is offered

- **WHEN** a signed-in user opens `/me/account`
- **THEN** a password section is shown in its collapsed state, describing that the account password can be changed, with a control to begin

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me/account`
- **THEN** the password section is present for each of them, in the same place, offering the same action

#### Scenario: Expanding the section

- **WHEN** the user activates the control to change their password
- **THEN** the section expands to show the change form with the current-password field focused, and the collapsed control is replaced by the form's own actions

#### Scenario: Abandoning the change

- **WHEN** the user cancels an expanded form
- **THEN** the section returns to its collapsed state, every entered value is discarded, and no request is sent

### Requirement: Change form fields

The form SHALL collect the current password, the new password, and a confirmation of the new password. Every field SHALL be masked, SHALL be labelled, and SHALL carry an autocomplete hint that lets a password manager recognise its role (`current-password` for the first, `new-password` for the latter two). No entered value SHALL be written to local storage, session storage, cookies, or the URL, at any point, including after a failed attempt.

#### Scenario: Fields are presented

- **WHEN** the form is expanded
- **THEN** three masked fields are shown — current password, new password, confirm new password — each with a visible label

#### Scenario: Password manager can act

- **WHEN** a password manager inspects the form
- **THEN** the current-password field is annotated as the existing credential and both new-password fields as the replacement, so the manager can offer to fill and then to update the saved entry

#### Scenario: Entered values are not retained

- **WHEN** the user types into any field, and whether the subsequent request succeeds, fails, or is never sent
- **THEN** no entered password appears in local storage, session storage, cookies, or the URL

### Requirement: New password policy is stated before it is enforced

The system SHALL state the new-password policy — at least 12 characters, including an uppercase letter, a lowercase letter, a number and a symbol — as persistent helper text visible from the moment the form is expanded, not only as an error after a rejected attempt. The system SHALL validate the new password against that policy before sending the request, and SHALL require the confirmation field to match the new password exactly.

#### Scenario: Policy is visible up front

- **WHEN** the form is expanded and no value has been entered
- **THEN** the policy is shown as helper text next to the new-password field, in a non-error presentation

#### Scenario: New password does not satisfy the policy

- **WHEN** the user submits a new password that is shorter than 12 characters or lacks an uppercase letter, a lowercase letter, a number, or a symbol
- **THEN** the new-password field reports which part of the policy is unmet, no request is sent, and the entered values are kept so the user can correct them

#### Scenario: Confirmation does not match

- **WHEN** the user submits a confirmation that differs from the new password
- **THEN** the confirmation field reports that the two do not match, no request is sent, and the entered values are kept

#### Scenario: Current password is empty

- **WHEN** the user submits without entering a current password
- **THEN** the current-password field reports that it is required and no request is sent

#### Scenario: Server policy wins over client policy

- **WHEN** the client-side check passes but the server rejects the new password on policy grounds
- **THEN** the server's stated reason is shown on the new-password field, replacing any client-side assessment

### Requirement: Submitting a password change

When the form passes client-side validation, the system SHALL submit the current and new password to `PATCH /api/v1/user/me/change-password` on behalf of the signed-in user. While the request is in flight the form SHALL indicate progress and SHALL NOT start a second concurrent request.

#### Scenario: Successful change

- **WHEN** the request responds `204`
- **THEN** the section confirms in place that the password was changed, collapses the form, clears every entered value, and keeps the user signed in on the current session

#### Scenario: Request in progress

- **WHEN** the form has been submitted and the request has not yet completed
- **THEN** the form shows a busy state, its submit action is unavailable, and repeated activation does not send a second request

#### Scenario: Session is unaffected by success

- **WHEN** the password change succeeds
- **THEN** the app performs no sign-out, no redirect, and no re-authentication, and the user's stored tokens continue to work

### Requirement: Other sessions are revoked and the user is told

Because the API revokes every other session of the user on a successful change while keeping the session that performed it, the system SHALL state this consequence before the user submits, and SHALL restate it on success. The API also invalidates any pending email-change confirmation link on a successful password change, so when the account holds a pending address the system SHALL state that consequence too, before the user submits. The system SHALL NOT attempt to act on other sessions itself.

#### Scenario: Consequence is stated before submitting

- **WHEN** the form is expanded
- **THEN** it states that changing the password signs the account out everywhere else and keeps this session signed in

#### Scenario: Consequence is restated on success

- **WHEN** the change succeeds
- **THEN** the confirmation states that other sessions have been signed out

#### Scenario: Pending email change is mentioned when one exists

- **WHEN** the form is expanded while the account holds a pending, unconfirmed email address
- **THEN** it also states that changing the password cancels that pending email change and its confirmation link will stop working

#### Scenario: Pending email change is not mentioned when none exists

- **WHEN** the form is expanded while the account holds no pending email address
- **THEN** no statement about email changes is shown

### Requirement: Failures are explained where the user can act on them

The system SHALL map each documented failure of the endpoint to the field the user must correct, or to a section-level message when no single field is at fault, and SHALL leave the entered values in place so a corrected attempt does not start over. A rejected current password SHALL NOT be treated as an expired session.

#### Scenario: Current password is wrong

- **WHEN** the request responds `401` reporting that the credentials are incorrect
- **THEN** the current-password field reports that the current password is not correct, the user's session is left intact, no token refresh is performed, and the user is not sent to the sign-in screen

#### Scenario: New password is not different from the current one

- **WHEN** the request responds `400` stating that the new password must be different from the current one
- **THEN** the new-password field reports that the new password must differ from the current one

#### Scenario: New password violates the server policy

- **WHEN** the request responds `400` carrying a field violation for the new password
- **THEN** the new-password field reports the violation as stated by the server

#### Scenario: Account signs in with Google and has no password

- **WHEN** the request responds `409` because the account has no password to change
- **THEN** the section explains that this account signs in with Google and has no password to change, and stops offering the form for the remainder of the visit

#### Scenario: Service unreachable or failing

- **WHEN** the request fails without a response status, or responds with a `5xx` status
- **THEN** the section reports a temporary failure and invites the user to try again in a moment, the password is unchanged, and the entered values are kept

#### Scenario: Session genuinely expired

- **WHEN** the user's stored session cannot authorize the request at all, independently of the submitted current password
- **THEN** the app applies its standard expired-session handling and returns the user to the sign-in screen

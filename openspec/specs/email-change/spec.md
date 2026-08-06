# Email change

## Purpose

Let a signed-in user move their account to a new email address without an administrator, proving the current password to ask and proving control of the new mailbox to complete, and make the two-step nature, the pending state, the loss of every session, and every failure outcome understandable at the moment they matter.

## Requirements

### Requirement: Email section on the account page

The account page SHALL host an email section, available to every signed-in role, that shows the address the account signs in with today and offers changing it. The address SHALL be shown only in this section — the identity summary SHALL NOT repeat it. The section SHALL be present regardless of whether the account also signs in with Google, because the profile does not report whether the account has a password to prove.

#### Scenario: Section is offered

- **WHEN** a signed-in user opens `/me/account`
- **THEN** an email section is shown, presenting the active email address and a control to change it

#### Scenario: Address is not shown twice

- **WHEN** a signed-in user opens `/me/account`
- **THEN** the email address appears in the email section and nowhere else on the page

#### Scenario: Available to all roles

- **WHEN** a CabinCrew, Operations, or Admin user opens `/me/account`
- **THEN** the email section is present for each of them, in the same place, offering the same action

### Requirement: Requesting a change proves the current password

The request form SHALL collect the new email address and the account's current password, and SHALL NOT submit until the address is syntactically valid and the password field is non-empty. The current password is what authorises the request; the system SHALL NOT offer a path to request a change without it.

#### Scenario: Form fields

- **WHEN** the user opens the change-email form
- **THEN** it presents a new-address field and a current-password field, with the new-address field focused, the password field masked, and both marked for their respective password-manager roles

#### Scenario: Empty submission is refused

- **WHEN** the user submits with either field empty
- **THEN** each empty field reports what it needs and no request is sent

#### Scenario: Malformed address is refused before submitting

- **WHEN** the user submits an address that is not a valid email address
- **THEN** the new-address field reports that it must be a valid email address and no request is sent

#### Scenario: Abandoning the request

- **WHEN** the user cancels the form
- **THEN** the form closes, entered values are discarded, and the section returns to showing the active address unchanged

### Requirement: The two-step nature is stated before the request is sent

Because the change takes effect only when a link sent to the new address is opened, and because opening that link revokes every session of the account, the system SHALL state both consequences on the form, before submission. The system SHALL state that the confirmation link expires 24 hours after it is issued and works once.

#### Scenario: Confirmation requirement is stated

- **WHEN** the change-email form is shown
- **THEN** it states that the new address becomes active only after the link sent to it is opened, and that the account keeps signing in with the current address until then

#### Scenario: Session loss is stated

- **WHEN** the change-email form is shown
- **THEN** it states that confirming the new address signs the account out on every device, including this one

#### Scenario: Link lifetime is stated

- **WHEN** the change-email form is shown, or a change is pending
- **THEN** the stated lifetime of the confirmation link is 24 hours and single use

### Requirement: A pending change is visible on the account page

While the account holds an unconfirmed address, the email section SHALL show that address alongside the active one, labelled as awaiting confirmation, and SHALL make clear that the active address is still the one used to sign in. The pending address SHALL be read from the account profile, so it survives a page reload and appears in any session of the same account.

#### Scenario: Pending address is shown

- **WHEN** the account profile reports an inactive, unconfirmed address in addition to the active one
- **THEN** the email section shows the pending address, states that a confirmation link was sent to it, and states that sign-in continues to use the active address

#### Scenario: Pending state survives a reload

- **WHEN** the user reloads `/me/account` while a change is pending
- **THEN** the pending address is still shown, without the user having to repeat the request

#### Scenario: Pending state is cleared once confirmed

- **WHEN** the account profile reports the previously pending address as the active one
- **THEN** the email section shows it as the active address and shows no pending address

### Requirement: A successful request is acknowledged from what the profile reports, not from what was submitted

A request accepted by the API sends no response body and changes nothing the user can see immediately, so the system SHALL acknowledge it in place and SHALL refresh the account profile before doing so. An accepted request is NOT proof that a link was sent: inside the resend window the API accepts the request, sends nothing, and leaves the existing pending address in place. The system SHALL therefore determine what to say by comparing the submitted address with the pending address the refreshed profile reports, and SHALL NOT claim a link was sent to an address the profile does not report as pending.

#### Scenario: Request is acknowledged against the pending address

- **WHEN** the request is accepted and the refreshed profile reports the submitted address as pending
- **THEN** the form closes and the email section confirms that a confirmation link was sent, shown with the pending address so the address is named exactly once

#### Scenario: Request was suppressed by the resend window

- **WHEN** the request is accepted but the refreshed profile reports a different address as pending
- **THEN** the section states that no link was sent to the submitted address, names it, explains that a change is already awaiting confirmation, and directs the user to wait out the five-minute window before asking again — and it does not claim any link was sent

#### Scenario: Profile does not report a pending address

- **WHEN** the request is accepted but the refreshed profile reports no pending address, because the refresh could not be completed
- **THEN** the section confirms that a link was sent to the submitted address, naming it as entered, rather than showing nothing

#### Scenario: Pending address appears without a reload

- **WHEN** the request is accepted
- **THEN** the account profile is re-read and the pending address is shown from it

#### Scenario: Current session is unaffected by the request

- **WHEN** the request is accepted
- **THEN** the app performs no sign-out, no redirect, and no re-authentication, and the user's stored tokens continue to work

### Requirement: The resend guard is disclosed

The API accepts a second request made within five minutes of the previous one but sends no further mail and leaves the existing pending address in place, whatever address was asked for. Because that is indistinguishable from a delivery failure, the system SHALL disclose this window rather than let the user infer that the request was lost.

#### Scenario: Window is disclosed while a change is pending

- **WHEN** a change is pending
- **THEN** the email section states that another request within five minutes of the last one sends no new link and does not replace the pending address

#### Scenario: Re-requesting stays available

- **WHEN** a change is pending
- **THEN** the control to request a change remains available, so a user who asked for the wrong address can ask again once the window has passed

### Requirement: Confirming a change from the emailed link

The system SHALL serve a confirmation page at the path the API's confirmation mail points to, `/confirm-email`, taking the token from the `token` query parameter. The page SHALL NOT require a session: it is opened from the new mailbox, which may be on another device or in another browser. The page SHALL submit the token without further user action and report the outcome.

#### Scenario: Opening the link while signed out

- **WHEN** a visitor with no session opens `/confirm-email?token=<token>`
- **THEN** the page loads without redirecting to sign-in, submits the token, and reports the outcome

#### Scenario: Link is missing its token

- **WHEN** `/confirm-email` is opened with no `token` parameter, or an empty one
- **THEN** the page reports that the link is not usable and offers a route to sign in, and no request is sent

#### Scenario: Confirmation is in progress

- **WHEN** the token is being submitted
- **THEN** the page states that the address is being confirmed and offers no control that would submit it a second time

### Requirement: Confirmation ends every session and returns the user to sign-in

Confirmation revokes every session of the account, including the one that requested the change. The system SHALL therefore discard any locally stored tokens on success and direct the user to sign in with the new address. Because the API answers with no body, the system SHALL NOT name the newly active address on the confirmation page.

#### Scenario: Successful confirmation

- **WHEN** the token is accepted
- **THEN** the page states that the new address is confirmed and is now the address to sign in with, states that all sessions have been signed out, and offers a control leading to the sign-in screen

#### Scenario: Stored tokens are discarded

- **WHEN** the token is accepted and the browser held tokens for the account
- **THEN** those tokens are cleared locally, so no part of the app continues to act as if signed in

#### Scenario: The new address is not asserted

- **WHEN** the token is accepted
- **THEN** the page does not state which address is now active, because the response does not report it

### Requirement: Request failures are explained where the user can act on them

The system SHALL map each documented failure of the request endpoint to the field the user must correct, or to a section-level message when no single field is at fault, and SHALL leave the entered values in place so a corrected attempt does not start over. A rejected current password SHALL NOT be treated as an expired session.

#### Scenario: Current password is wrong

- **WHEN** the request responds `401` reporting that the credentials are incorrect
- **THEN** the current-password field reports that the current password is not correct, the user's session is left intact, no token refresh is performed, and the user is not sent to the sign-in screen

#### Scenario: New address is the one already in use by this account

- **WHEN** the request responds `400` stating that the new email address must be different from the current one
- **THEN** the new-address field reports that the address must differ from the one the account uses today

#### Scenario: Address belongs to another account

- **WHEN** the request responds `409` stating that the email address is already in use
- **THEN** the new-address field reports that the address is already in use and the current password entered is left in place

#### Scenario: Account has no password to prove

- **WHEN** the request responds `409` stating that the account signs in with Google and has no password
- **THEN** the form closes and the email section explains that this account signs in with Google and its address cannot be changed here, instead of blaming a field

#### Scenario: Address rejected by the API's own validation

- **WHEN** the request responds `400` with a field violation for the new address
- **THEN** that violation is reported on the new-address field, taking precedence over the client-side validation message

#### Scenario: Service is unavailable or unreachable

- **WHEN** the request fails with a server error or the service cannot be reached
- **THEN** a section-level message says the change could not be requested right now and invites a retry, and the entered values are preserved

### Requirement: Confirmation failures explain what to do next

The confirmation page SHALL distinguish the documented failures of the confirmation endpoint and tell the user what recovers each one, because the user arrives there from a mail client with no other context.

#### Scenario: Link is invalid, expired, or already used

- **WHEN** the confirmation responds `400` reporting that the link is invalid or has expired
- **THEN** the page states that the link no longer works, states that a link can only be used once and expires after 24 hours, and directs the user to request the change again from the account page after signing in

#### Scenario: Address was taken in the meantime

- **WHEN** the confirmation responds `409` reporting that the address is already in use
- **THEN** the page states that the address was taken by another account since the request and directs the user to request a different address

#### Scenario: A password change invalidated the link

- **WHEN** the account's password was changed after the request, so the confirmation responds `400`
- **THEN** the page reports the link as no longer valid using the same message as any other expired link, without asserting a cause it cannot verify

#### Scenario: Service is unavailable or unreachable

- **WHEN** the confirmation fails with a server error or the service cannot be reached
- **THEN** the page says the address could not be confirmed right now, states that the link remains usable, and offers a control to try again

### Requirement: Address casing is not asserted back to the user

The API normalises the requested address to lower case, so the address the account will sign in with is not necessarily the string the user typed. The system SHALL NOT present the typed casing as the address that will be used for sign-in.

#### Scenario: Mixed-case request

- **WHEN** the user requests a change to an address containing upper-case characters
- **THEN** the pending address shown on the account page is the one reported by the account profile, not the string as typed

#### Scenario: Comparing a submitted address with the pending one

- **WHEN** the system decides whether the submitted address is the one now pending
- **THEN** it compares them case-insensitively, so a mixed-case request is recognised as the address the profile reports and is not mistaken for a suppressed request

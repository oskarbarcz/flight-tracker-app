## MODIFIED Requirements

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

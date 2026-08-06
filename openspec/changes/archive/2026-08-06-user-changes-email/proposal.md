## Why

A signed-in user cannot change the address they sign in with. The address is set at account creation and only an Admin can alter it (`PATCH /api/v1/user/{id}`) — so a user who changes employer, loses access to a mailbox, or simply typed the wrong address at sign-up has to ask someone else to fix their own credential. This is worse than the password gap we just closed, because the email address is also the recovery channel: a user locked out of their mailbox has no route back into the account at all.

The API already ships the whole flow — `POST /api/v1/user/me/change-email` (proves the current password, mails a confirmation link to the new address and a heads-up to the old one) and `POST /api/v1/user/me/change-email/confirm` (applies the change, revokes every session). `GET /api/v1/user/me` already reports a `pending` address alongside the active one. Nothing on the frontend calls any of it, and the confirmation link the API mails — `<frontend>/confirm-email?token=…` — currently lands on a route that does not exist, so the emailed link is dead.

## What Changes

- Add an "Email" section to the account page (`/me/account`), between Identity and Password, available to every signed-in role. It shows the address the account signs in with today, and — while a change awaits confirmation — the pending address and what has to happen next.
- Move the address out of the Identity summary into the new section, so one surface owns it and the page does not print the same value twice.
- Add a "Change email" modal — new address, current password — mirroring the shipped `ChangePasswordModal`. Submits to `POST /api/v1/user/me/change-email`.
- State plainly, before submission, that the change takes effect only when the link sent to the new address is opened, and that confirming signs the user out on every device, including this one.
- Add a **public** route `/confirm-email?token=…` — the target of the emailed link — that submits the token to `POST /api/v1/user/me/change-email/confirm`, reports the outcome, and on success discards any locally stored tokens (the API has just revoked them) and sends the user to sign in with the new address. The route must work with no session at all: the link is opened from the new mailbox, which may be on another device or in another browser.
- Map every documented failure to the place the user can act on it: a wrong current password (`401`) to the current-password field; "must be different from the current one" (`400`) and "already in use" (`409`) to the new-address field; a Google-only account (`409`, different message) to a section-level explanation; an invalid or expired confirmation token (`400`) and an address taken in the meantime (`409`) to the confirmation page.
- Disclose the API's five-minute resend guard: a second request inside that window is accepted (`202`) but sends no second link and leaves the first pending address in place. Silence here would read as a delivery failure and invite repeated attempts.
- Surface the pending address on the account page from `GET /api/v1/user/me`, whose response now carries an `emails` array (`email`, `isConfirmed`, `active`). The frontend `User` type does not model it yet.
- **API layer fix**: `fetchWithAuthWithoutRetry` treats only `204` as an empty response and calls `response.json()` on everything else. `POST /change-email` answers `202` with no body, so the happy path would throw a `SyntaxError` after a change that actually succeeded. Empty-body handling must cover any success response without content, not just `204`.

## Capabilities

### New Capabilities
- `email-change`: A signed-in user moving their account to a new email address — the request form and what it proves, the pending state and what the user is told about it, the public confirmation page reached from the emailed link, the effect on sessions, and the outcome of every documented failure on both steps.

### Modified Capabilities
- `google-account-link`: its "Account page" requirement defines what `/me/account` hosts, in what order, and states that the page shows the active email address as part of the identity summary. The address now belongs to a dedicated email section, and the stable section order gains a fourth member.
- `password-change`: its "Other sessions are revoked and the user is told" requirement describes everything a password change does. Changing the password now also invalidates a pending email-change link, which the user must be told when a change is pending.

## Impact

- **Routing** — `app/routes.ts` gains `route("confirm-email", …)` under `AuthLayout`, outside `AppLayout`/`AuthGuard`. New `app/routes/auth/ConfirmEmailRoute.tsx`. This is the first route whose URL is authored by the API (`FRONTEND_BASE_URL` + `/confirm-email?token=`); the path is a contract with the backend's `EmailChangeMailListener` and cannot be renamed unilaterally.
- **API layer** — `app/shared/api/api.service.ts`: `fetchWithAuthWithoutRetry` stops assuming a JSON body on every non-`204` success. No existing caller changes behaviour (`change-password` returns `204`).
- **User feature** — `app/features/user/service.ts` gains `requestEmailChange` (non-retrying authorized path, because `401` means "wrong password") and `confirmEmailChange` (the unauthenticated `request` path); `request.ts` gains `RequestEmailChangeRequest` and `ConfirmEmailChangeRequest`; `form.ts` gains `ChangeEmailFormData`; `schema.ts` gains `changeEmailSchema`; `model.tsx` gains `UserEmail` and an `emails` field on `User`; new `lib/describeEmailChangeFailure.ts` and `lib/describeEmailChangeConfirmationFailure.ts` following `describePasswordChangeFailure.ts`.
- **UI** — new `app/features/user/components/EmailSection.tsx` and `ChangeEmailModal.tsx`, reusing `Container`, `ContainerTitle`, the shared Formik form and `ManagedInputBlock`. `app/routes/common/AccountRoute.tsx` renders the section and drops the Email `MetaRow`.
- **No new endpoints, no new dependencies.** Both endpoints already exist and are exercised by the API's Cucumber suite (`features/user/user.me.change-email.feature`).
- **Spec updates**: delta files for `google-account-link` and `password-change`.

## Assumptions / constraints

- **A wrong current password returns `401`, not `400`** — `{"message":"Credentials are incorrect.","error":"Unauthorized","statusCode":401}`. As with password change, this forces the non-retrying request path: routing it through refresh-and-retry would spend a token rotation on every typo and could sign the user out for mistyping their own password.
- **Two different conditions both return `409`** — `This email address is already in use.` (address belongs to another account) and `This account signs in with Google and has no password to change.` (no password to prove). They are only distinguishable by message, and they belong in different places on screen.
- **"Must be different" is a bare `400` message with no `violations`**: `New email address must be different from the current one.` It has to be recognised by message, like the equivalent password case.
- **The resend guard is per user, not per address.** Any request inside five minutes of the previous one returns `202` and does nothing — including a request for a *different* address, which will not replace the pending one. A user correcting a typo must be told to wait, otherwise the page appears broken.
- **Confirmation revokes every session, including the one that requested the change** (verified: a subsequent refresh returns `401 Session is no longer valid.`). There is no way to keep the requesting session alive, so the flow ends at the sign-in screen by design, not as a fallback.
- **Confirmation is unauthenticated** (`@SkipAuth`) and succeeds with `204` and no body, so the confirmation page cannot name the new address it just activated and must not claim to.
- **Changing the password revokes a pending email change**, after which the emailed link fails with `400 Email change confirmation link is invalid or has expired.`
- **The address is normalised and compared case-insensitively** by the API; a request for `Alan.NEW@Example.com` confirms and signs in as `alan.new@example.com`. The frontend must not present the case the user typed as the address they will sign in with.
- **The token is single-use and valid for 24 hours.** Both facts come from the mail the API sends; the frontend states the expiry so the pending state has a horizon.
- **The frontend cannot know in advance whether an account has a password**, so a Google-only account cannot have the section pre-hidden; the `409` is handled reactively. This mirrors the decision already taken in `password-change`.
- Repo conventions apply: named exports only, no code comments, Biome formatting, `~/` alias, WCAG 2.1 AA in light and dark. `package.json` version bump required before merge (CI-enforced).

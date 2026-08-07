## Context

See `proposal.md` — Why. Requirements are in `specs/email-change/spec.md`.

What already exists and shapes the approach:

- **`password-change` is the template.** The shipped implementation is `PasswordSection` (a `Container` + `ContainerTitle` with an explanation and a button) plus `ChangePasswordModal` (Formik + Yup + `ManagedInputBlock`), with failures translated by `lib/describePasswordChangeFailure.ts` into `{ kind: "field" | "section" | "unavailable" }`. The main spec text for that capability still describes an inline expanding form; the code uses a modal. This change follows the **code**, not the stale spec sentence.
- **`fetchWithAuthWithoutRetry` already exists** on `AbstractAuthorizedApiService`, added by `password-change` precisely so a `401` reaches the caller instead of triggering refresh-and-retry. `change-email` needs the same treatment for the same reason.
- **`AbstractApiService.request`** is the unauthenticated path (`authService.signIn` uses it). It rejects on `status >= 300` with `{ ...body, statusCode }` and returns `"" as T` on `204` — which is exactly the shape `POST /change-email/confirm` returns.
- **`ApiProvider` and `AuthProvider` wrap the whole router** in `root.tsx`, so a route under `AuthLayout` can use `useApi()` and `useAuth()` without a session.
- **`AuthGuard` gates on context state** (`user && accessToken`), not on localStorage. Clearing storage alone leaves a live in-memory session.
- **`GET /api/v1/user/me` now returns `emails: [{ email, isConfirmed, active }]`** — required in the DTO — which is the only source of the pending address. The frontend `User` type stops at `email`.
- **The confirmation URL is authored by the backend**: `EmailChangeMailListener` builds `${FRONTEND_BASE_URL}/confirm-email?token=<raw token>`. The path and the parameter name are a contract.

## Goals / Non-Goals

**Goals:**

- One place on the account page owns the email address, in both its states (active, pending).
- The emailed link works from a cold browser with no session, on any device.
- Every documented failure of both endpoints lands somewhere the user can act on it, with no `401` on either endpoint mistaken for an expired session.
- The API-layer changes are additive: no existing caller changes behaviour.

**Non-Goals:**

- No cancel-a-pending-change affordance — the API exposes no endpoint for it. A pending change lapses after 24 hours, or is displaced by a later request once the resend window passes, or is revoked by a password change.
- No resend button. Within five minutes it is a no-op; after five minutes it is indistinguishable from re-requesting the same address through the normal form. A button that silently does nothing is worse than no button.
- No polling for confirmation on the account page. The requesting session dies the moment the change is confirmed; there is nothing useful for it to observe.
- No client-side deliverability or MX checks — only syntactic validation, deferring to the API.
- Not touching the unauthenticated password-reset flow, which is also unimplemented on the frontend and shares the token/`/confirm`-style shape. That is a separate change.

## Decisions

### Modal for the request form, not an inline expansion

Follows the shipped `ChangePasswordModal` exactly: same `Modal` size, same footer button pair, same `status`-based section error, same `ManagedInputBlock` usage. Two credential-changing forms on the same page should not use two different interaction models.

*Alternative — inline expansion (what the `password-change` spec text describes):* rejected. It would make the email section inconsistent with the password section directly below it, and would put a form with a password field inline in a page otherwise made of read-only summaries.

### The pending address comes from the profile, never from local state

`EmailSection` derives the pending address from `user.emails` (the entry with `active: false`), not from what the modal just submitted. This is what makes the pending state survive a reload and appear in a second session of the same account, and it is the only way to show the API's normalised (lower-cased) form of the address rather than the string as typed.

After a successful request the section calls `refreshUser()` — already on `AuthContextType` — and only then records the acknowledgement, so the two are never out of step.

**A `202` is not proof that a link was sent.** Inside the resend window the API accepts the request, mails nothing, and leaves the previous pending address untouched — including when the submitted address is a *different* one. An acknowledgement that named the submitted address unconditionally would therefore state a falsehood in exactly the case the user most needs the truth: correcting a typo. So the acknowledgement is derived, not asserted. `describeRequestOutcome(state, pending)` compares the submitted address with what the refreshed profile reports, case-insensitively because the API normalises, and yields one of three outcomes:

- **`sent`** — the profile reports the submitted address as pending. The confirmation renders inside the pending block, so the address is named exactly once, in its normalised form.
- **`suppressed`** — the profile reports a *different* address as pending. The section says no link was sent to the submitted address, names it, and points at the five-minute window. This is the resend guard, surfaced rather than papered over.
- **`sentToUnreportedAddress`** — the profile reports nothing pending, which in practice means the refresh failed. The acknowledgement falls back to naming the submitted address as entered, so a failed refresh degrades to a weaker claim instead of no acknowledgement at all.

Deriving the outcome also dissolves the typed-vs-normalised casing seam: in the `sent` path the address is printed once, from the profile, so the two spellings never appear side by side.

`User` gains `emails: UserEmail[]` as a required field, matching the DTO, plus a small `lib/accountEmails.ts` exposing `pendingEmail(user)`. `user.email` stays the active address — the API already guarantees it — so nothing existing needs rewriting.

*Alternative — track pending state in the component after submit:* rejected. It would be lost on reload, invisible in other sessions, and would display the typed casing as if it were the address that will work.

### `202` forces an empty-body fix in `fetchWithAuthWithoutRetry`

`fetchWithAuthWithoutRetry` short-circuits only `status === 204` and otherwise calls `response.json()`. `POST /change-email` answers `202` with no body, so the *success* path would throw a `SyntaxError` and the UI would report failure after a change that actually went through.

Fix: read the body once as text and parse only if non-empty, replacing the `204` special case rather than adding `202` to it. Enumerating status codes invites the same bug on the next no-content response; "no body means no JSON" is the actual rule. Scoped to `fetchWithAuthWithoutRetry` — `requestWithAuthAndHeaders` and `request` keep their current handling, so the blast radius is the one method with one existing caller (`changePassword`, `204`, unaffected).

### `requestEmailChange` uses the non-retrying path; `confirmEmailChange` uses the unauthenticated one

On `POST /change-email`, `401 Credentials are incorrect.` means the *typed password* is wrong. Through `fetchWithAuth` that would burn a token rotation per typo and, on a stale refresh token, `refreshAccessToken` would `clearTokens()` and hard-redirect to `/sign-in` — signing the user out for mistyping their own password. Same reasoning as `changePassword`.

`POST /change-email/confirm` is `@SkipAuth` and must work with no tokens present, so it goes through `AbstractApiService.request`, which does not read storage at all. It stays on `userService` because it is a `/user/me` endpoint, even though it is unauthenticated.

### Two `409` conditions are split by message

`409` is both `This email address is already in use.` (belongs to another account → the new-address field) and `This account signs in with Google and has no password to change.` (no password to prove → a section-level explanation, `kind: "unavailable"`). `describeEmailChangeFailure` matches "already in use" first and treats any other `409` as the Google case, mirroring how `describePasswordChangeFailure` recognises "must be different" by substring. Substring matching on server prose is fragile, but the API returns no error code to key on; the fallback for an unrecognised `409` is a section-level message, so a reworded backend message degrades to a vaguer explanation rather than a wrong field.

Precedence in the mapper, highest first: `violations.newEmail` → `401` → `400` + "must be different" → `409` + "already in use" → any other `409` → no status (unreachable) → `5xx` → generic rejection. Server `violations` win over client-side Yup messages, per the convention already set.

### `/confirm-email` lives under `AuthLayout`, and is a state machine, not a form

`AuthLayout` is the unauthenticated shell (`sign-in`, `sign-out`) — centred card, footer, no app chrome, no `AuthGuard`. Correct for a page a stranger's mail client opens.

The route submits on mount and renders one of: `submitting` / `confirmed` / `failed(message, retryable)` / `unusable link`. It never renders an input: the token comes from the URL, and asking a user to paste anything would be theatre. The submit is guarded against React's double-invoke in dev (`useRef`) so the single-use token is not consumed twice — the second call would report `400 invalid or expired` on a change that just succeeded.

A separate `lib/describeEmailChangeConfirmationFailure.ts` handles this endpoint: `400` → link no longer works, request again from the account page after signing in; `409` → address taken since the request, ask for a different one; `5xx`/unreachable → retryable, and the link is still good. A password change also produces the plain `400`, which is correct: the page cannot verify the cause, so it must not name one.

*Verified constraint:* the GitHub Pages deep-link shim (`public/404.html` + `public/ghspa.js`) round-trips query strings, and the token alphabet is base64url, so it cannot collide with the `~and~` escaping. `/confirm-email?token=…` survives the redirect on the deployed build.

### Confirmation ends with a local-only sign-out, so add one

Confirmation revokes every session including this browser's. Calling `useAuth().signOut()` would `POST /auth/sign-out` with a token the API has already invalidated → `401` → `refreshAccessToken` → `clearTokens()` + `window.location.replace("/sign-in")`, a full page reload that stamps over the confirmation message the user has not read yet.

So `AuthProvider` exposes `clearSession()` — the existing private `clearAuthData`, promoted to the context. It clears stored tokens *and* resets `user`/`accessToken` in context, which is what `AuthGuard` reads. Calling only `clearTokens()` would leave a zombie session: `AuthGuard` would still admit the user to `/dashboard`, where every request would fail. The confirmation page then shows its own "Sign in" link rather than redirecting, so the outcome is readable before the user moves on.

### Copy carries the facts the flow depends on

Four facts are invisible unless stated, and each one, if unstated, produces a user who thinks the app is broken: the change needs confirmation from the new mailbox; confirming signs them out everywhere including here; the link is single-use and expires in 24 hours; a second request within five minutes sends nothing and does not replace the pending address. All four are on the form or the pending row, phrased as plain statements — consistent with `PRODUCT.md`'s "trust the numbers" (exact figures: 24 hours, five minutes) and with how `ChangePasswordModal` states its own session consequence up front.

## Risks / Trade-offs

- **`/confirm-email` is a contract with the backend's `FRONTEND_BASE_URL` + path.** Renaming the route breaks every link already in flight (up to 24 hours' worth) with a 404 and no explanation. → Treat the path as fixed; it is stated in the proposal's Impact and in the spec so a future rename is recognisably breaking.
- **Message-substring matching on `409` and `400`.** A backend rewording silently reclassifies "already in use" into the Google explanation. → Unrecognised statuses fall back to section-level messages, so the failure mode is a vague message, not a wrong field or a lie. Both strings are pinned by the API's Cucumber suite.
- **`emails` is typed as required, matching the DTO.** A frontend deployed against an older API would get `undefined` and the pending derivation would throw. → Both repos deploy together and the field is already live on `localhost`; `pendingEmail` reads through the array in one place, so a defensive fallback is a one-line change if it ever ships out of step.
- **The typed-casing vs normalised-casing seam.** Resolved by deriving the acknowledgement: in the `sent` path the address is printed once, from the profile, so a user who typed `Alan.NEW@…` never sees two spellings side by side. The typed string survives only in the `suppressed` and `sentToUnreportedAddress` paths, where echoing the user's own input is the point.
- **No way to cancel a pending change.** A user who requested the wrong address waits out the five-minute window before they can request the right one. → Disclosed rather than hidden; the pending row states the window, and a suppressed request says so explicitly instead of appearing to succeed. An API cancel endpoint would be the real fix and is out of scope.
- **Dev double-mount consumes the single-use token twice.** Known local behaviour (`project_dev_double_mount_network`): every effect fires twice in dev. → The `useRef` submit guard is not a nicety; without it the confirmation page is untestable in `npm run dev`.
- **Confirmation cannot name the address it activated** (`204`, no body, and the page may have no session to query). → The copy says "your new address" and points at sign-in. Fetching the profile is impossible: the tokens were just revoked.

## Migration Plan

Additive and frontend-only. Both endpoints are already deployed; `emails` is already in the profile response. Rollback is a straight revert — no data, storage, or route-shape migration. The only behaviour visible to existing users outside the new section is the email address moving out of the Identity summary.

`FRONTEND_BASE_URL` must be set correctly on the API for the emailed link to resolve; that is existing API configuration, unchanged by this work.

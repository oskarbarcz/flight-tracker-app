## Why

A signed-in user has no way to change their own password. The only paths to a new password today are an Admin editing the user (`PATCH /api/v1/user/{id}`) or the unauthenticated reset-by-email flow — neither is something a user can do for themselves from inside the app. The API already ships `PATCH /api/v1/user/me/change-password`, which proves the current password, enforces a strength policy, and revokes every *other* session of that user while keeping the one performing the change alive. Nothing on the frontend calls it.

## What Changes

- Add a "Password" section to the existing account page (`/me/account`), below Identity and above the Google connection section, available to every signed-in role.
- The section is a collapsed affordance by default ("Change password") that expands into a three-field form: current password, new password, confirm new password. Collapsed-by-default keeps the account page a calm read-only summary and matches the fact that changing a password is a rare, deliberate act.
- Validate the new password client-side against the API's published policy (≥ 12 characters, with an uppercase letter, a lowercase letter, a number and a symbol), show the policy as persistent helper text rather than only as an error, and require the confirmation field to match.
- Submit to `PATCH /api/v1/user/me/change-password` via a new `userService.changePassword(currentPassword, newPassword)`.
- Map each documented failure to a field-level or section-level message: a rejected current password (`401`) attaches to the current-password field; policy and not-different violations (`400`) attach to the new-password field; a Google-only account (`409`) explains that this account signs in with Google and has no password to change.
- **BREAKING for the API layer**: introduce a non-retrying authorized request path in `AbstractAuthorizedApiService`. Today every `401` is interpreted as an expired access token, triggering a refresh-and-retry — and a failed refresh hard-clears tokens and redirects to `/sign-in`. On this endpoint a `401` means "your current password is wrong", so routing it through the refresh path would spend a token rotation on every typo and, if the refresh token happened to be stale, would sign the user out for mistyping their own password. This endpoint must opt out of that behaviour. No existing caller changes.
- State in the UI that a successful change signs the user out of every other session but keeps this one, and confirm success in place with the form collapsed and cleared.

## Capabilities

### New Capabilities
- `password-change`: A signed-in user changing their own password from the account page — the form and its policy, proving the current password, the outcomes of each documented failure, and what the change does to other sessions.

### Modified Capabilities
- `google-account-link`: its "Account page" requirement defines what `/me/account` hosts. The page now also hosts a password section, and the page must remain coherent for an account that signs in with Google and therefore has no password.

## Impact

- **API layer** — `app/shared/api/api.service.ts`: `AbstractAuthorizedApiService` gains a request path that authorizes but does not refresh-and-retry on `401`, so a `401` reaches the caller as a real authorization failure. The existing `fetchWithAuth` / `requestWithAuthAndHeaders` behaviour is untouched.
- **User feature** — `app/features/user/service.ts` gains `changePassword`; `app/features/user/request.ts` gains `ChangePasswordRequest` (`currentPassword`, `newPassword`); new `app/features/user/schema.ts` with the Yup `changePasswordSchema`; new `app/features/user/lib/describePasswordChangeFailure.ts` mapping rejections to copy, following the `describeGoogleFailure.ts` pattern.
- **UI** — new `app/features/user/components/PasswordSection.tsx` rendered by `app/routes/common/AccountRoute.tsx`. Reuses `Container` + `ContainerTitle`, the shared `Form` (Formik + Yup) and `ManagedInputBlock`, which already accepts `type="password"`. `ManagedInputBlock` gains two additive optional props it lacks today — `autoComplete` (so password managers can recognise each field's role) and `helperText` (so the policy can be shown in a non-error state) — both of which benefit every other form.
- **No new endpoints, no new dependencies, no route changes.** `/me/account` is already registered and already behind `AuthGuard`.
- **Spec update**: `openspec/specs/google-account-link/spec.md` gets a delta for the account-page requirement.

## Assumptions / constraints

- **A wrong current password returns `401`, not `400`** — verified against the live API: `{"statusCode":401,"error":"Unauthorized","message":"Credentials are incorrect."}`. This is the fact that forces the non-retrying request path.
- **Policy violations arrive as field violations.** Verified: a weak new password returns `400` with `violations.newPassword` carrying the policy sentence, so the existing `handleFormikApiError` helper can attach it to the field directly.
- **"Not different from current" is a bare message, not a violation.** Verified: `400` with `message: "New password must be different from the current one."` and no `violations` object. It must be recognised by message and attached to the new-password field, otherwise it degrades to a section-level toast.
- **The frontend cannot know in advance whether an account has a password.** `GetOwnUserDto` exposes no `hasPassword` or `googleLinked` flag, so a Google-only account cannot have the section pre-hidden; the `409` is handled reactively when they try. This mirrors the existing decision in `google-account-link` not to claim connection state the profile does not report.
- **The current session survives the change** (API guarantee), so no re-authentication, token refresh, or redirect is performed on success. Other sessions are revoked server-side; the frontend only states this, it does not act on it.
- **Client-side validation mirrors the API policy but is not authoritative.** The server's `violations` message always wins when the two disagree.
- **Confirm-new-password is client-side only** — the API takes two fields, not three. It exists to catch typos in a masked field.
- Repo conventions apply: named exports only, no code comments, Biome formatting, `~/` alias, WCAG 2.1 AA in light and dark. `package.json` version bump required before merge (CI-enforced).

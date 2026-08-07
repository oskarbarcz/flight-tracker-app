## Context

See `proposal.md` — Why. Requirements are in `specs/password-change/spec.md`.

Three facts about the existing code shape this design:

1. **`AbstractAuthorizedApiService` treats every `401` as an expired access token.** `requestWithAuthAndHeaders` refreshes and replays the request once; `refreshAccessToken` clears tokens and hard-redirects to `/sign-in` if the refresh itself fails. Verified against the live API, `PATCH /api/v1/user/me/change-password` answers a wrong current password with `401 {"error":"Unauthorized","message":"Credentials are incorrect."}`. Sent through the existing path, a typo costs a refresh-token rotation and a replayed request, and a stale refresh token turns the typo into a forced sign-out.
2. **Error shapes differ per failure.** Policy violations arrive as `400` with `violations.newPassword: string[]`; "not different from the current one" arrives as `400` with only `message` and no `violations`; the Google-only case is `409`. `handleFormikApiError` already covers the first shape but falls through to a toast for the other two.
3. **`/me/account` is already built and already guarded.** It is a `space-y-6` column of `Container` sections. Adding a section is composition, not restructuring.

## Goals / Non-Goals

**Goals:**

- Reach the endpoint without the refresh-and-retry interception, so `401` means what the endpoint says it means.
- Keep the failure→field mapping in one testable pure function, matching the `describeGoogleFailure.ts` precedent.
- Add the section with no new shared primitives beyond two additive optional props on `ManagedInputBlock`.

**Non-Goals:**

- No change to how any existing caller handles `401`. The new request path is opt-in.
- No password-strength meter, no reveal/unmask toggle, no generated-password suggestion.
- No pre-flight probe for whether the account has a password. The `409` is the only signal and it is handled reactively.
- No handling of the revoked *other* sessions beyond stating it. Those sessions discover the revocation on their own next refresh, through the existing path.

## Decisions

### 1. Opt out of refresh-and-retry with a distinct method, not a flag on the existing one

Add to `AbstractAuthorizedApiService`:

```
protected async fetchWithAuthWithoutRetry<T>(endpoint: string, options: RequestInit = {}): Promise<T>
```

It reads the access token, refreshes it *proactively* if `isAccessTokenExpired()` (so a genuinely expired token is still renewed before the attempt — this is not the ambiguous case), sends the request once, and rejects with `{...errorResponse, statusCode}` for any `4xx` including `401`. No replay.

Because the proactive refresh runs first, a `401` from this path can only mean the endpoint rejected the request on its own terms — for this endpoint, a wrong current password. The genuinely-expired-session scenario in the spec is satisfied by the proactive refresh, which still redirects to `/sign-in` when the refresh token is dead.

*Alternative considered — an `options` flag (`{ retryOnUnauthorized: false }`) on `fetchWithAuth`.* Rejected: `RequestInit` is passed through to `fetch`, so a custom key would have to be stripped, and a boolean parameter at the call site reads as configuration rather than as a different contract. A separate named method makes the different `401` semantics visible where it matters.

*Alternative considered — leave the retry and just tolerate it.* Rejected: it is correct in the common case but signs the user out for a typo whenever the refresh token has expired, which is exactly when a user is most likely to be re-entering credentials.

### 2. One pure function maps rejections to a field-addressed outcome

`app/features/user/lib/describePasswordChangeFailure.ts` exports a function returning a discriminated result rather than a bare string, because unlike the Google case the target field varies:

```
type PasswordChangeFailure =
  | { kind: "field"; field: "currentPassword" | "newPassword"; message: string }
  | { kind: "section"; message: string }
  | { kind: "unavailable"; message: string }
```

Resolution order, first match wins:

| Condition | Result |
|---|---|
| `violations.newPassword[0]` present | `field` / `newPassword`, server's sentence |
| `violations.currentPassword[0]` present | `field` / `currentPassword`, server's sentence |
| `statusCode === 401` | `field` / `currentPassword`, "That's not your current password." |
| `statusCode === 400` and message reports not-different | `field` / `newPassword`, "Your new password must be different from your current one." |
| `statusCode === 409` | `unavailable`, the Google-only explanation |
| `statusCode === undefined` | `section`, `unreachableServiceMessage` |
| `statusCode >= 500` | `section`, temporary-failure copy |
| otherwise | `section`, generic change-failed copy |

Violations are checked *before* status so that a server sentence always beats our own wording, satisfying the "server policy wins" scenario. The not-different case is matched by substring on `message` (`"must be different"`), mirroring how `describeGoogleFailure.ts` matches backend messages — the API does not give it a code. `unreachableServiceMessage` and `isServerFailure` are reused from `app/features/auth/lib/serviceFailureMessages.ts` rather than duplicated.

`unavailable` is distinct from `section` because the spec requires the form to stop being offered for the rest of the visit, not merely to show a message.

*Alternative considered — reuse `handleFormikApiError` directly.* Rejected: it only understands `violations` and sends everything else to a toast, which would put "that's not your current password" in a transient toast detached from the field the user must fix. `describePasswordChangeFailure` handles the mapping; the component then calls Formik's `setFieldError` for `field` results.

### 3. Section state is an explicit union, not a set of booleans

```
type SectionState =
  | { status: "collapsed" }
  | { status: "editing" }
  | { status: "submitting" }
  | { status: "changed" }
  | { status: "unavailable"; message: string }
  | { status: "failed"; message: string }
```

Follows `GoogleAccountSection`'s `ConnectionState` precedent. `submitting` guards the double-submit scenario; `unavailable` is terminal for the visit; `failed` carries only section-level messages, since field-level ones live in Formik.

Formik is remounted with a `key` tied to collapse, which is how "cancelling discards every entered value" and "success clears every value" are met without imperative resets — `Form` already sets `enableReinitialize`.

### 4. Client-side policy lives in Yup, mirroring the server's four rules as four separate tests

`app/features/user/schema.ts`:

```
changePasswordSchema: object({
  currentPassword: string().required(...),
  newPassword: string().required(...).min(12, ...)
    .matches(/[A-Z]/, ...).matches(/[a-z]/, ...).matches(/\d/, ...)
    .matches(/[^A-Za-z0-9]/, ...),
  confirmNewPassword: string().required(...).oneOf([ref("newPassword")], ...),
})
```

Four separate `.matches()` tests rather than one composite regex, so the message names the specific unmet rule ("Add an uppercase letter.") instead of restating the whole policy — the spec requires reporting *which* part is unmet. The symbol class is the negation of alphanumerics, which is deliberately broader than any fixed symbol list; if the server is stricter, its `violations` message overrides ours by decision 2.

The form's shape (`ChangePasswordFormData`, three fields) is not the request shape (`ChangePasswordRequest`, two fields); the service takes the two it needs and `confirmNewPassword` never leaves the component.

### 5. Two additive optional props on `ManagedInputBlock` instead of a bespoke password field

`autoComplete?: string` (forwarded to `TextInput`, needed for password-manager recognition) and `helperText?: string` (rendered through `HelperText` only when there is no error, so the policy is visible up front and yields to the error when one appears). Both default to undefined and change nothing for existing callers.

*Alternative considered — compose `CredentialField` from the auth feature.* Rejected: it is uncontrolled by Formik (takes `value`/`onChange` directly), carries the sign-in screen's specific label typography, and has no error slot — wiring it to Formik would reimplement `ManagedInputBlock` beside it.

*Alternative considered — a local `PasswordField` inside the user feature.* Rejected: it would be `ManagedInputBlock` plus two props, and the two props are generally useful.

### 6. Copy states the multi-session consequence at both ends

Expanded form, above the fields: changing the password signs the account out everywhere else and keeps this session signed in. Success state: the password was changed and other sessions have been signed out. This is the honest reading of the API's documented behaviour, and it is the one thing about this action a user cannot infer from the form.

## Risks / Trade-offs

- **The not-different case is matched on message text.** A backend rewording drops it to a section-level generic failure. → It degrades to a still-truthful message rather than a wrong one, and the substring chosen (`"must be different"`) is the stable part of the sentence. Same exposure the Google mapping already accepts.
- **Client policy can drift from server policy.** → Server `violations` are checked before any status-based branch, so the server's sentence always wins; the client check is a fast path, not a gate.
- **A Google-only user sees a form they cannot use until they submit.** → Unavoidable: `GetOwnUserDto` reports no `hasPassword`. The `409` explanation is specific, and the section then stops offering the form. Adding the flag to the profile response is the real fix and belongs to the API.
- **`fetchWithAuthWithoutRetry` could be misapplied to an endpoint that does need retry.** → Its name states the trade-off, and it stays `protected`, so only services can reach it.
- **Password values live in Formik state while the form is open.** → Unavoidable for a controlled form; mitigated by remounting on collapse and on success so values are dropped from memory as soon as the form closes, and by never persisting them anywhere.

## Migration Plan

No migration. Additive UI on an existing route, one new service method, one new base-class method with no existing callers. Rollback is reverting the commit; nothing is persisted and no API contract changes.

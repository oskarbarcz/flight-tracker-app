## 1. API layer — non-retrying authorized request

- [x] 1.1 Add `protected async fetchWithAuthWithoutRetry<T>(endpoint, options)` to `AbstractAuthorizedApiService` in `app/shared/api/api.service.ts`: proactively refresh when `isAccessTokenExpired()`, send once, return `"" as T` on `204`, reject with `{...errorResponse, statusCode}` for any `4xx` (including `401`) without replaying the request
- [x] 1.2 Confirm `fetchWithAuth` / `requestWithAuthAndHeaders` are byte-for-byte unchanged so no existing caller's `401` handling shifts
- [x] 1.3 `npm run typecheck` passes

## 2. User feature — request, service, schema

- [x] 2.1 Add `ChangePasswordRequest` (`currentPassword: string`, `newPassword: string`) to `app/features/user/request.ts`
- [x] 2.2 Add `changePassword(currentPassword, newPassword)` to `UserService` in `app/features/user/service.ts`: `PATCH /api/v1/user/me/change-password` via `fetchWithAuthWithoutRetry<void>`, returning `void`
- [x] 2.3 Create `app/features/user/form.ts` with `ChangePasswordFormData` (`currentPassword`, `newPassword`, `confirmNewPassword`) and its empty initial values
- [x] 2.4 Create `app/features/user/schema.ts` with `changePasswordSchema`: `currentPassword` required; `newPassword` required, `.min(12)`, and four separate `.matches()` tests each naming the specific unmet rule (uppercase, lowercase, number, symbol as `[^A-Za-z0-9]`); `confirmNewPassword` required and `.oneOf([ref("newPassword")])`
- [x] 2.5 Re-export `schema` and `form` from `app/features/user/index.ts`, keeping `request.ts` out of the barrel per feature convention

## 3. Failure mapping

- [x] 3.1 Create `app/features/user/lib/describePasswordChangeFailure.ts` exporting the `PasswordChangeFailure` union (`field` / `section` / `unavailable`) and `describePasswordChangeFailure(reason)`
- [x] 3.2 Implement resolution in the order fixed by design decision 2: `violations.newPassword` → `violations.currentPassword` → `401` → `400` with a not-different message → `409` → no status → `5xx` → generic, so a server sentence always beats our own wording
- [x] 3.3 Reuse `unreachableServiceMessage` and `isServerFailure` from `app/features/auth/lib/serviceFailureMessages.ts` instead of duplicating them
- [x] 3.4 Write the user-facing copy: wrong current password, not-different, Google-only-account explanation, temporary failure, generic failure

## 4. Shared form primitive

- [x] 4.1 Add optional `autoComplete?: string` to `ManagedInputBlock` in `app/shared/ui/Form/Managed/ManagedInputBlock.tsx`, forwarded to `TextInput`
- [x] 4.2 Add optional `helperText?: string`, rendered through flowbite `HelperText` only when the field has no active error so the error replaces it
- [x] 4.3 Verify existing `ManagedInputBlock` callers render unchanged (both props default to undefined)

## 5. Password section component

- [x] 5.1 Create `app/features/user/components/PasswordSection.tsx` with the `SectionState` union (`collapsed` / `editing` / `submitting` / `changed` / `unavailable` / `failed`), inside `Container` + `ContainerTitle`
- [x] 5.2 Collapsed state: purpose line plus a "Change password" control that moves the section to `editing`
- [x] 5.3 Editing state: shared `Form` with `changePasswordSchema`, keyed so collapsing or succeeding remounts it and drops every entered value; three `ManagedInputBlock` fields with `type="password"` and `autoComplete` set to `current-password`, `new-password`, `new-password`
- [x] 5.4 Show the policy as `helperText` on the new-password field from the moment the form opens, in a non-error presentation
- [x] 5.5 Show above the fields that changing the password signs the account out everywhere else and keeps this session signed in
- [x] 5.6 Submit handler: move to `submitting` and return early if already submitting; call `userService.changePassword`; on success move to `changed`
- [x] 5.7 Failure handling: run `describePasswordChangeFailure`, route `field` results through Formik's `setFieldError` and return to `editing` with entered values intact, `section` results to `failed`, `unavailable` results to the terminal `unavailable` state that no longer offers the form
- [x] 5.8 Changed state: confirm in place that the password was changed and other sessions signed out, with the form collapsed and cleared; perform no sign-out, redirect, or token refresh
- [x] 5.9 Cancel action returns to `collapsed`, discarding entered values and sending no request
- [x] 5.10 Focus the current-password field when the section expands, and give the section-level message `role="alert"`

## 6. Wiring

- [x] 6.1 Render `PasswordSection` in `app/routes/common/AccountRoute.tsx` between the Identity `Container` and `GoogleAccountSection`, per the section-order requirement in the `google-account-link` delta

## 7. Verification

- [x] 7.1 `npm run lint` and `npm run typecheck` pass; no code comments anywhere in the new files
- [x] 7.2 Against the local API as `operations@example.com`, walk each outcome: success (`204`), wrong current password (`401`, must attach to the current-password field and must NOT sign the user out or rotate the refresh token), policy violation (`400` with violations), not-different (`400` bare message), and each client-side rejection (short, missing character class, mismatched confirmation, empty current password)
- [x] 7.3 Confirm the `401` path performs exactly one request and no `/api/v1/auth/refresh` call, via the network panel
- [x] 7.4 Confirm the current session still works after a successful change, and restore the seeded password afterwards (note: the seeded `P@$$w0rd` fails the policy, so restoring it requires an Admin `PATCH /api/v1/user/{id}`)
- [x] 7.5 Confirm no entered password appears in local storage, session storage, cookies, or the URL at any point
- [x] 7.6 Check the section in light and dark themes against WCAG 2.1 AA, and verify keyboard-only operation of expand, fill, submit, and cancel
- [x] 7.7 Bump the `package.json` version

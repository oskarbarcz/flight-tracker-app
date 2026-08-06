## 1. API layer — empty success bodies

- [x] 1.1 In `app/shared/api/api.service.ts`, change `fetchWithAuthWithoutRetry` to read the response body once as text and parse it only when non-empty, returning `"" as T` for an empty body — replacing the `status === 204` special case rather than adding `202` alongside it
- [x] 1.2 Leave `fetchWithAuth`, `requestWithAuthAndHeaders`, and `AbstractApiService.request` untouched, so no existing caller's `401` or body handling shifts
- [x] 1.3 Confirm `changePassword` (`204`) still resolves through the new path, and `npm run typecheck` passes

## 2. Auth context — local-only session teardown

- [x] 2.1 Promote `AuthProvider`'s private `clearAuthData` to the context as `clearSession(): void` in `app/app-state/useAuth.tsx`, adding it to `AuthContextType` and the default context value
- [x] 2.2 Verify it clears stored tokens *and* resets `user` / `accessToken` / `refreshToken` in context, so `AuthGuard` stops admitting the user, and that it sends no request and performs no redirect
- [x] 2.3 Confirm `signOut` is unchanged and still the path used by the sign-out route

## 3. User model — the account's addresses

- [x] 3.1 Add `UserEmail` (`email: string`, `isConfirmed: boolean`, `active: boolean`) and a required `emails: UserEmail[]` field on `User` in `app/features/user/model.tsx`, matching `GetOwnUserDto`
- [x] 3.2 Create `app/features/user/lib/accountEmails.ts` exporting `pendingEmail(user): string | null` — the address of the entry with `active: false`, or `null` when there is none
- [x] 3.3 Confirm `user.email` remains the active address everywhere it is already used, with no call sites rewritten

## 4. User feature — requests, service, schema

- [x] 4.1 Add `RequestEmailChangeRequest` (`newEmail`, `currentPassword`) and `ConfirmEmailChangeRequest` (`token`) to `app/features/user/request.ts`
- [x] 4.2 Add `requestEmailChange(newEmail, currentPassword)` to `UserService`: `POST /api/v1/user/me/change-email` via `fetchWithAuthWithoutRetry<void>`, so a `401` reaches the caller instead of triggering refresh-and-retry
- [x] 4.3 Add `confirmEmailChange(token)` to `UserService`: `POST /api/v1/user/me/change-email/confirm` via the unauthenticated `request<void>`, which reads no tokens from storage
- [x] 4.4 Add `ChangeEmailFormData` (`newEmail`, `currentPassword`) and `initChangeEmailData()` to `app/features/user/form.ts`
- [x] 4.5 Add `changeEmailSchema` to `app/features/user/schema.ts`: `newEmail` required and `.email()`; `currentPassword` required
- [x] 4.6 Confirm the feature barrel (`app/features/user/index.ts`) re-exports the new form and schema members and still keeps `request.ts` out

## 5. Failure mapping

- [x] 5.1 Create `app/features/user/lib/describeEmailChangeFailure.ts` exporting the `EmailChangeFailure` union (`field` on `newEmail` / `currentPassword`, `section`, `unavailable`) and `describeEmailChangeFailure(reason)`
- [x] 5.2 Resolve in the order fixed in design: `violations.newEmail` → `401` → `400` containing "must be different" → `409` containing "already in use" → any other `409` (the Google, no-password case) → no status (unreachable) → `5xx` → generic rejection
- [x] 5.3 Create `app/features/user/lib/describeEmailChangeConfirmationFailure.ts` returning a message plus whether a retry is worth offering: `400` → link no longer works, request again from the account page after signing in; `409` → address taken since the request, ask for a different one; no status or `5xx` → retryable, link still usable
- [x] 5.4 Reuse `unreachableServiceMessage` and `isServerFailure` from `app/features/auth/lib/serviceFailureMessages.ts` in both mappers rather than duplicating them
- [x] 5.5 Write the user-facing copy for every branch of both mappers, and confirm no branch names a cause the response does not report

## 6. Change email modal

- [x] 6.1 Create `app/features/user/components/ChangeEmailModal.tsx` mirroring `ChangePasswordModal`'s structure: same `Modal` size, `ModalHeader` / `ModalBody` / `ModalFooter`, Formik with `changeEmailSchema`, `status`-based section error with `role="alert"`
- [x] 6.2 Fields: `newEmail` as `ManagedInputBlock` with `type="email"`, `autoComplete="email"`, `autoFocus`; `currentPassword` with `type="password"`, `autoComplete="current-password"`; both disabled while submitting
- [x] 6.3 Above the fields, state that the new address becomes active only once the link sent to it is opened and that the account keeps signing in with the current address until then
- [x] 6.4 State that confirming signs the account out on every device including this one, and that the link works once and expires in 24 hours
- [x] 6.5 Submit handler: call `userService.requestEmailChange`; on success report the submitted address to the parent; on failure run `describeEmailChangeFailure` and route `field` results through `setFieldError`, `section` results to Formik `status`, `unavailable` results up to the parent and close
- [x] 6.6 Cancel discards entered values, closes, and sends no request

## 7. Email section

- [x] 7.1 Create `app/features/user/components/EmailSection.tsx` inside `Container` + `ContainerTitle` with an envelope icon, reading `user` from `useAuth()`
- [x] 7.2 Show the active address (`user.email`) as the address the account signs in with, and a "Change email" control that opens the modal
- [x] 7.3 Derive the pending address with `pendingEmail(user)`; when present, show it labelled as awaiting confirmation, state that a link was sent to it, that sign-in still uses the active address, and that the link expires in 24 hours
- [x] 7.4 In the pending state, state that another request within five minutes of the last one sends no new link and does not replace the pending address, and keep the "Change email" control available
- [x] 7.5 On a successful request, show a transient in-place acknowledgement naming the submitted address, and call `refreshUser()` so the pending row appears from the profile without a reload
- [x] 7.6 On an `unavailable` outcome, replace the section body with the Google-only explanation, following `PasswordSection`'s `unavailable` presentation (`bg-gray-50` info block)
- [x] 7.7 Keep the address values selectable and, where they can overflow a narrow viewport, wrapping rather than clipped

## 8. Confirmation route

- [x] 8.1 Register `route("confirm-email", "routes/auth/ConfirmEmailRoute.tsx")` inside the `AuthLayout` layout in `app/routes.ts`, outside `AppLayout` and `AuthGuard` — the path is the backend's `${FRONTEND_BASE_URL}/confirm-email?token=` contract and must not be renamed
- [x] 8.2 Create `app/routes/auth/ConfirmEmailRoute.tsx` reading `token` from `useSearchParams()`, with the state union `submitting` / `confirmed` / `failed` / `unusable`, and `usePageTitle`
- [x] 8.3 With no `token`, or an empty one, render the `unusable` state with a link to sign in and send no request
- [x] 8.4 Submit the token on mount through `userService.confirmEmailChange`, guarded by a `useRef` so the dev double-mount cannot consume the single-use token twice
- [x] 8.5 On success: call `clearSession()`, state that the new address is confirmed and is now the one to sign in with, state that all sessions have been signed out, offer a "Sign in" link, and name no address
- [x] 8.6 On failure: render the message from `describeEmailChangeConfirmationFailure`, offering a "Try again" control only for the retryable branches, and a link to sign in otherwise
- [x] 8.7 Match `SignInRoute`'s card presentation so the page reads as part of the same unauthenticated shell

## 9. Wiring

- [x] 9.1 Render `EmailSection` in `app/routes/common/AccountRoute.tsx` between the Identity `Container` and `PasswordSection`, per the section-order requirement in the `google-account-link` delta
- [x] 9.2 Remove the Email `MetaRow` from the Identity container, leaving name and role
- [x] 9.3 Add the pending-email consequence to `ChangePasswordModal`: when `pendingEmail(user)` is set, state that changing the password cancels the pending email change and its link will stop working; show nothing when there is no pending address

## 10. Verification

- [x] 10.1 `npm run lint` and `npm run typecheck` pass; no code comments anywhere in the new or edited files
- [x] 10.2 Against the local API as `operations@example.com`, walk each request outcome: accepted (`202` — confirm the empty body no longer throws), wrong current password (`401` — must attach to the current-password field, must not sign the user out, must not hit `/api/v1/auth/refresh`), the account's own address (`400` bare message), an address held by `cabin-crew@example.com` (`409` "already in use" → field), a malformed address (client-side, no request)
- [x] 10.3 Confirm the `401` path performs exactly one request and no refresh call, via the network panel
- [x] 10.4 Confirm the pending address appears from `/api/v1/user/me` after a request, survives a reload, and is shown in the API's lower-cased form after requesting a mixed-case address
- [x] 10.5 Confirm a second request inside five minutes returns `202` and sends no mail, and that the disclosed copy is on screen at that moment
- [x] 10.6 Take the confirmation link from the local mail output, open `/confirm-email?token=…` in a browser with no session, and verify `204`, the success copy, and that no address is asserted
- [x] 10.7 Repeat the confirmation while signed in and verify the session is torn down locally with no redirect loop, that `AuthGuard` refuses `/dashboard` afterwards, and that signing in with the new address works while the old one returns `401`
- [x] 10.8 Verify each confirmation failure: a reused token (`400`), a forged token (`400`), and — by changing the password after a request — the revoked-link `400`, each rendering its intended copy
- [x] 10.9 Verify `/confirm-email?token=…` survives the GitHub Pages deep-link shim on a production build served locally, not only in `npm run dev`
- [x] 10.10 Check the email section and confirmation page in light and dark themes against WCAG 2.1 AA, and verify keyboard-only operation of open, fill, submit, cancel, and every confirmation-page control
- [x] 10.11 Confirm no entered password and no confirmation token is written to local storage, session storage, or cookies, and restore the seeded database state afterwards
- [x] 10.12 Bump the `package.json` version

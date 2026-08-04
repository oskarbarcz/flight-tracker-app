## 1. Configuration and Google client plumbing

- [x] 1.1 Add `VITE_GOOGLE_CLIENT_ID` (empty value) to `.env` and document it, alongside the API's matching `GOOGLE_CLIENT_ID`, in the environment-variables section of `CLAUDE.md`
- [x] 1.2 Add `getGoogleClientId()` to `app/shared/lib/getGoogleClientId.ts` returning the trimmed value or `null` when unset — absence must not throw
- [x] 1.3 Declare the used `google.accounts.id` surface (`initialize`, `renderButton`, `CredentialResponse`) in `app/features/auth/googleIdentity.d.ts` and confirm `npm run typecheck` picks it up
- [x] 1.4 Add a module-level, promise-cached GIS script loader in `app/features/auth/lib/loadGoogleIdentity.ts` that injects `https://accounts.google.com/gsi/client` once and resolves to unavailable (never rejects) on load failure

## 2. Shared Google identity hook and button

- [x] 2.1 Implement `useGoogleIdentity` in `app/features/auth/hooks/useGoogleIdentity.ts`: takes a credential callback plus button `text` variant, returns a container ref and an availability flag, and reports unavailable when no client ID is configured or the script failed to load
- [x] 2.2 Inside the hook, call `google.accounts.id.initialize` with `auto_select: false` and `cancel_on_tap_outside: true`, and never call `prompt()` — no One Tap
- [x] 2.3 Render the GIS button into the container with `size: "large"`, `shape: "pill"`, and a `width` measured from the container clamped to 200–400 px
- [x] 2.4 Re-render the button when `useThemeMode()`'s resolved mode changes, mapping light to `outline` and dark to `filled_black`
- [x] 2.5 Extract the button container into `app/features/auth/components/GoogleSignInButton.tsx` that renders nothing at all when the hook reports unavailable

## 3. Failure message mapping

- [x] 3.1 Add `app/features/auth/lib/describeGoogleFailure.ts` mapping `{ statusCode, message }` to user-facing text via case-insensitive substring matching on the backend messages: `"No user account is linked to this Google account."`, `"Google account email address is not verified."`, `"Google token is not valid."`
- [x] 3.2 Map the link-specific conflicts in the same module: `"User already has a linked Google account."` and `"This Google account is already linked to another user."`, plus an indistinguishable-`409` fallback
- [x] 3.3 Cover the remaining statuses with fallbacks — `400` as a rejected identity, missing status as unreachable-service, `5xx` as server-side failure — reusing the existing wording constants in `SignInRoute.tsx` where they already say the right thing

## 4. Sign-in with Google

- [x] 4.1 Add `signInWithGoogle(idToken)` to `AuthService` using the unauthenticated `request<SignInResponse>` against `POST /api/v1/auth/google`, and a `GoogleSignInRequest` type in `app/features/auth/model.ts`
- [x] 4.2 Add `signInWithGoogle(idToken): Promise<User>` to `AuthContextType` and `AuthProvider`, reusing `saveAuthData` so persistence, `fetchCurrent`, and role landing match password sign-in
- [x] 4.3 Render the divider and `GoogleSignInButton` below the password form in `SignInRoute.tsx`, keeping initial focus in the email field and the password submit as the primary action
- [x] 4.4 Wire the credential callback in `SignInRoute.tsx` to `signInWithGoogle` → `enterApp`, reusing the existing `submitting` flag so an in-flight Google exchange blocks the password form and vice versa, and route failures through the existing single alert region using `describeGoogleFailure`
- [x] 4.5 Verify no Google credential is persisted: it stays inside the callback and the request body, never in `localStorage`, `sessionStorage`, cookies, or the URL

## 5. Account page and Google linking

- [x] 5.1 Add `linkGoogleAccount(idToken)` to `UserService` using `fetchWithAuth` against `POST /api/v1/user/me/link-google-account`, treating `204` as success
- [x] 5.2 Create `app/routes/common/AccountRoute.tsx` showing the signed-in user's name, role label, and active email from `user.emails`, and register it as `route("me/account", …)` under `AppLayout` in `app/routes.ts`
- [x] 5.3 Add an "Account" section to `MeRoute` for every role, linking to `/me/account`
- [x] 5.4 Build the Google connection section component with `idle` / `connecting` / `connected` / `error` states, explaining that connecting enables Google sign-in, and omitting itself entirely when the hook reports unavailable
- [x] 5.5 Wire the credential callback to `linkGoogleAccount`, confirming success in place without persisting it, and rendering mapped conflict and failure messages from `describeGoogleFailure`
- [x] 5.6 Confirm no disconnect or replace control is offered anywhere, and that the neutral state never claims a Google account is not connected
- [x] 5.7 Add `usePageTitle` for the account page consistent with other routes

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npm run typecheck` clean
- [ ] 6.2 With `VITE_GOOGLE_CLIENT_ID` unset, confirm the sign-in screen and `/me/account` are Google-free, no request goes to `accounts.google.com`, and password sign-in is unchanged
- [x] 6.3 With a real Google OAuth client configured on both app and API (`http://localhost:5173` as an authorized origin), link a Google account from `/me/account`, sign out, and sign in with Google end to end
- [ ] 6.4 Exercise the error paths: sign in with an unlinked Google account (expect the not-connected message), attempt a second link (expect the already-connected conflict), and attempt to link a Google account owned by another user (expect the other-account conflict)
- [x] 6.5 Confirm dismissing Google's account chooser leaves both surfaces idle with no error and no request sent
- [x] 6.6 Check the button in light and dark mode at mobile and desktop widths, and confirm the sign-in screen still renders usefully with the GIS script blocked
- [x] 6.7 Bump the version in `package.json` as CI requires

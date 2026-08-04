## Context

See `proposal.md` — Why. What shapes the approach is what the backend already does (verified against `flight-tracker-api` source, not only the OpenAPI document):

- `POST /api/v1/auth/google` takes `{ idToken }`, verifies it with `jose` against Google's JWKS with `audience = GOOGLE_CLIENT_ID`, looks the user up by the token's `sub`, and returns the same `{ accessToken, refreshToken }` pair as password sign-in. It is `@SkipAuth()`. It never creates a user.
- `POST /api/v1/user/me/link-google-account` takes the same `{ idToken }` for the signed-in user and answers `204`.
- The three `401` reasons are distinguishable only by `message`: `"No user account is linked to this Google account."`, `"Google token is not valid."`, `"Google account email address is not verified."`. The two `409` reasons likewise: `"User already has a linked Google account."` and `"This Google account is already linked to another user."`
- The backend's `audience` check means the frontend and backend must be configured with the **same** OAuth client ID.
- `GET /api/v1/user/me` (`GetOwnUserDto`) has no Google field, and there is no unlink endpoint.

Frontend constraints: React Router v7 SPA with `ssr: false`, all API access through `AbstractApiService` / `AbstractAuthorizedApiService`, session state in `useAuth`, tokens in `localStorage` via `tokenStorage`. The sign-in screen was just redesigned (`SignInRoute.tsx`, commits #237/#239) and holds its own `submitting` / `error` state with a single alert region. Flowbite's `useThemeMode` drives light/dark. The PWA precaches only local `js|css|html`.

## Goals / Non-Goals

**Goals:**

- One shared, dependency-injected way to obtain a Google ID token, used by both the sign-in screen and the account page, so the two surfaces cannot drift.
- Google is strictly additive: with `VITE_GOOGLE_CLIENT_ID` unset, the built app behaves exactly as it does today, and nothing is fetched from Google.
- No Google credential leaves the callback closure — it goes straight into a request body.
- Failure text derived from the backend's actual `message` values, matched centrally rather than in components.

**Non-Goals:**

- Google One Tap or automatic sign-in prompts on page load.
- OAuth authorization-code flow, Google API scopes, or access to any Google user data beyond the ID token's identity claims.
- Account creation or self-service registration through Google.
- A durable "connected" indicator or disconnect action — the API exposes neither (see Risks).
- Other identity providers, and other account-page actions the API already offers (`change-email`, `change-password`) — the page is created here but populated with the Google section only.

## Decisions

### 1. Google Identity Services, ID-token flow, official rendered button

Use `google.accounts.id` from `https://accounts.google.com/gsi/client` and `renderButton()`. The ID-token flow is precisely what the backend consumes, and the rendered button satisfies Google's branding requirements while handling the popup/FedCM mechanics.

Alternatives rejected: authorization-code flow (`google.accounts.oauth2`) — the backend has no code-exchange endpoint; a custom-styled button driving `google.accounts.id.prompt()` — One Tap is suppressible, subject to FedCM behaviour changes, and off Google's branding guidance for a primary sign-in control.

Consequence accepted: styling is limited to GIS's `theme` / `size` / `shape` / `text` / `width` and the button is an iframe. It will visibly not be a Flowbite button. On the sign-in screen it sits below the password form behind a divider, so the intended hierarchy (password first) is preserved.

### 2. `useGoogleIdentity` hook owning script load, init, and button rendering

One hook in `app/features/auth/hooks/useGoogleIdentity.ts` takes a callback receiving the credential and returns a ref for the button container plus an availability flag. It:

- Reads the client ID through `getGoogleClientId()` (new export in `app/shared/lib/getGoogleClientId.ts`, mirroring `getFlightTrackerApiHost`, but returning `null` instead of throwing when unset — absence is a supported deployment, not an error).
- Injects the GIS script once per document via a module-level cached promise; concurrent callers share it, and a load failure resolves to unavailable rather than rejecting into a component.
- Calls `google.accounts.id.initialize({ client_id, callback, auto_select: false, cancel_on_tap_outside: true })` and `renderButton(container, { theme, size: "large", text, shape: "pill", width })`.
- Re-renders the button when `useThemeMode()`'s resolved mode flips, mapping light → `outline` and dark → `filled_black`; GIS has no dark-mode awareness of its own.
- Sets `width` from the container's measured width clamped to GIS's supported 200–400 px range, so the button lines up with the form instead of being a fixed 400 px block on a phone.
- `text` is a parameter: `signin_with` on the sign-in screen, `continue_with` on the account page.

Alternative rejected: loading GIS from `root.tsx` `links`/`<script>`. That puts a third-party request on every route including the public map, for a script two screens need.

### 3. Google types via a local ambient declaration, not a new dependency

Declare the sliver of `google.accounts.id` we call (`initialize`, `renderButton`, `CredentialResponse`) in `app/features/auth/googleIdentity.d.ts`. `@types/google.accounts` would pull a DefinitelyTyped package to describe four call signatures; a local declaration keeps `package.json` unchanged and fails loudly if we reach for an API we did not declare.

### 4. `signInWithGoogle` on `useAuth`, next to `signIn`

`AuthService` gains `signInWithGoogle(idToken)` calling `request<SignInResponse>("/api/v1/auth/google", …)` — the unauthenticated `request`, exactly like `signIn`. `AuthProvider` gains `signInWithGoogle(idToken): Promise<User>` reusing the existing `saveAuthData`, so token persistence, `fetchCurrent`, and role landing are shared verbatim with password sign-in. `SignInRoute` keeps one `submitting` flag and one `error` string covering both paths, which is what the spec's interaction-locking requirement asks for.

Alternative rejected: a separate `useGoogleAuth` context — it would duplicate `saveAuthData` and let the two sign-in paths diverge.

### 5. Linking goes through `UserService.linkGoogleAccount` on the normal authorized path

`UserService.linkGoogleAccount(idToken)` uses `fetchWithAuth`, so the change inherits the standard token-refresh behaviour rather than inventing a second authorized transport. The known wrinkle: `requestWithAuthAndHeaders` treats *any* `401` as an expired access token and retries once after refreshing. A `401` caused by a bad Google ID token therefore costs one extra refresh plus one extra request before surfacing. That is acceptable — it converges on the real error, and the retried response body still carries the Google reason for message mapping.

Alternative rejected: a non-retrying variant in the base service. It would fork transport semantics for one call site; the wasted refresh is cheap and the failure mode is rare.

### 6. Backend messages mapped centrally in one module

`app/features/auth/lib/describeGoogleFailure.ts` (or an extension of the existing `describeFailure` in `SignInRoute`) maps `{ statusCode, message }` to user text, keyed on the backend's message strings with status-only fallbacks. Matching is on a normalised substring (case-insensitive, trimmed), not string equality, so backend punctuation edits degrade to the generic message instead of breaking. Unknown `409`/`401` shapes fall through to the "either this account or that Google account is already connected" / generic wording the specs require.

Alternative rejected: mapping on status alone. `401` covers three genuinely different user situations and `409` covers two; collapsing them produces the "something went wrong" dead end the specs exist to prevent.

### 7. New `/me/account` route, kept small

`app/routes/common/AccountRoute.tsx` registered under `AppLayout` as `route("me/account", …)`, so `AuthGuard` and the shell apply unchanged. It renders identity (name, role label, active email from `user.emails`) plus a Google connection section. `MeRoute` gains an "Account" section, present for every role, linking to it. The Google section is a component in `app/features/auth/components/`, since both it and the sign-in button share the hook.

Section state is a local `"idle" | "connecting" | "connected" | "error"`. Success is stated in place and, per the spec, not treated as persisted knowledge: it is not written to storage and is gone on reload. A `useToast` success is redundant with in-place confirmation and is not used.

### 8. Configuration is documented, not defaulted

Add `VITE_GOOGLE_CLIENT_ID` (empty) to `.env` and document it in `CLAUDE.md`'s environment block. No fallback value: a wrong client ID fails the backend's `audience` check at request time with an opaque `401`, which is worse than the feature being absent.

## Risks / Trade-offs

- **No linked-state in `GET /api/v1/user/me`** → The account page can only offer "connect" and confirm the action just taken; a user who already linked sees a neutral connect offer and learns the truth from a `409`. Mitigated by wording that never asserts "not connected", and by the `409` messages being specific. Closing this properly needs a backend field (e.g. `hasGoogleAccountLinked`) and an unlink endpoint — a follow-up change, out of scope here.
- **Frontend and backend client IDs must match** → A mismatch surfaces as `"Google token is not valid."` with nothing pointing at configuration. Mitigated by documenting both variables together and by verifying the pair once per environment during rollout.
- **Local end-to-end testing is awkward** → The dev backend verifies against a MockServer JWKS (`docker/mock/google.json`, key `ft-test-google-key`) and client ID `123456789012-devmockclientid.apps.googleusercontent.com`; real GIS cannot mint a token for that. Mitigated two ways: exercise the request/response mapping against the mock with the hand-signed tokens from `features/auth/auth.google-sign-in.feature` (the seeded `admin@example.com` is already linked to `sub` `104778392015664201883`), and exercise the button itself against a real Google OAuth client with `http://localhost:5173` as an authorized origin, with the local backend's `GOOGLE_CLIENT_ID` and `GOOGLE_JWKS_URI` pointed at the real values.
- **Third-party script on the sign-in path** → Adds a cross-origin request and a small delay before the button appears, and makes Google sign-in unavailable offline in the installed PWA. Mitigated by lazy loading (nothing on other routes), by never blocking the password form on the script, and by treating load failure as "Google unavailable" rather than an error. Deliberately not precached — a stale GIS client is worse than an absent one.
- **GIS iframe button will not match Flowbite exactly** → Accepted per Decision 1; contained by placing it below a divider so it reads as an alternative path, not a mis-styled primary button.
- **No CSP today; adding one later would break the button silently** → Noted for whoever introduces CSP headers: `script-src` and `frame-src` will need `https://accounts.google.com`.
- **GIS/FedCM behaviour changes are outside our control** → Google has shipped breaking One Tap/FedCM changes before. Using only `initialize` + `renderButton` keeps the exposed surface minimal, and the feature degrades to "button absent, password sign-in works".

## Migration Plan

1. Create (or reuse) a Google Cloud OAuth 2.0 Web client; register authorized JavaScript origins for `http://localhost:5173` and the production origin.
2. Set `GOOGLE_CLIENT_ID` on the API to that client ID with the default Google JWKS URI, and `VITE_GOOGLE_CLIENT_ID` to the same value in the app's deployment environment. Deploying the app without the variable is safe and ships the feature dark.
3. Deploy the app; verify on the sign-in screen that the button renders, and that an unlinked Google account produces the "not connected" message rather than a session.
4. Link a Google account from `/me/account`, then sign out and sign in with Google end to end.
5. Rollback: unset `VITE_GOOGLE_CLIENT_ID` and redeploy. Every Google surface disappears and password sign-in is untouched; already-linked accounts stay linked server-side and are unaffected.

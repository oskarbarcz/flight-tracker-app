## Why

Signing in requires typing an email and password every time, and the app now ships as an installable PWA where typing credentials on a phone is the slowest part of getting to a flight. The backend already exposes `POST /api/v1/auth/google` and `POST /api/v1/user/me/link-google-account`, so the whole flow can be delivered frontend-side with no API work.

## What Changes

- Add a Google Identity Services (GIS) button to the sign-in screen that exchanges a Google ID token for the app's own access/refresh token pair via `POST /api/v1/auth/google`, then enters the app exactly like a password sign-in does.
- Add a new account page at `/me/account`, reachable from `/me`, that lets a signed-in user link their Google account via `POST /api/v1/user/me/link-google-account`. This is a prerequisite for Google sign-in: the endpoint never creates users, so a Google sign-in attempt fails until the user has linked that Google account from inside the app.
- Load and configure GIS once for the app from a new `VITE_GOOGLE_CLIENT_ID` environment variable, and hide both Google surfaces entirely when that variable is absent so local and self-hosted deployments keep working unchanged.
- Distinguish the backend's failure modes in the UI: an unlinked or unknown Google account (401 on sign-in) reads as "this Google account isn't connected to a Flight Tracker account", and a conflict on linking (409) reads as either "you already linked a Google account" or "this Google account belongs to someone else".

## Capabilities

### New Capabilities

- `google-sign-in`: signing in with Google from the sign-in screen — GIS button placement and availability, the ID-token exchange against `POST /api/v1/auth/google`, session establishment identical to password sign-in, and failure messaging for unlinked accounts, rejected tokens, and unreachable service.
- `google-account-link`: the account page at `/me/account` and its Google connection section — linking a Google account for the signed-in user via `POST /api/v1/user/me/link-google-account`, the one-account-per-user and one-user-per-account constraints surfaced as conflicts, and how the page behaves when Google is not configured.

### Modified Capabilities

<!-- None. No existing spec in openspec/specs/ covers authentication or the /me page. -->

## Impact

- **Code**: `app/features/auth/` (service, model, new GIS hook and button component), `app/app-state/useAuth.tsx` (a Google sign-in entry point alongside `signIn`), `app/routes/auth/SignInRoute.tsx`, new `app/routes/common/AccountRoute.tsx`, `app/routes.ts`, `app/routes/common/MeRoute.tsx` (link to the account page), `app/features/user/service.ts` (link call).
- **API**: consumes existing `POST /api/v1/auth/google` and `POST /api/v1/user/me/link-google-account`. No backend change required.
- **Configuration**: new `VITE_GOOGLE_CLIENT_ID` in `.env` / `.env.local` and in the deployment environment; the Google Cloud OAuth client needs the app's origins registered as authorized JavaScript origins. All Google surfaces are inert without it.
- **Dependencies**: the GIS client script is loaded from `https://accounts.google.com/gsi/client` at runtime — a third-party script on the sign-in path, deliberately not precached by the service worker, so Google sign-in is unavailable offline while password sign-in is unaffected.
- **Known gap**: `GET /api/v1/user/me` does not report whether a Google account is linked, so the account page cannot show a durable "connected" state or offer unlinking. Tracked as an assumption in `design.md`; a follow-up backend change would be needed to close it.

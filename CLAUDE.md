# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyPreflight is a frontend SPA for scheduling and tracking flights in a flight simulator environment. It manages flights, aircraft, airports, crews, and passengers with role-based access (Operations, Admin, CabinCrew).

- **Frontend only** — backend API is a separate repo ([flight-tracker-api](https://github.com/oskarbarcz/flight-tracker-api))
- **Framework**: React Router v8 with SSR disabled (`react-router.config.ts: ssr: false`), React 19, Vite 8, TypeScript 7 (strict)
- **Styling**: Tailwind CSS v4 (configured via `@theme` directives in `app/styles/index.css`, no `tailwind.config.ts`), Flowbite React for UI components
- **Forms**: Formik + Yup — schemas live per feature (`app/features/<domain>/schema.ts`), shared field schemas in `app/shared/validator/`
- **Linting/Formatting**: Biome (2-space indent, 120-char line width, double quotes)
- **PWA**: `vite-plugin-pwa` with `registerType: "prompt"` — installable, prompts to reload on a new version. Launch assets (`public/icons/`, `public/splash/`) are generated, not hand-drawn — see "PWA launch assets" below
- **Node**: 26 (see `.nvmrc`)

## Commands

```bash
npm run dev          # Vite dev server with HMR (localhost:5173)
npm run build        # Production build (output: ./build/client)
npm run typecheck    # react-router typegen + tsc --build --noEmit
npm run lint         # Biome check (linter + formatter)
npm run lint:fix     # Biome auto-fix
```

No test framework is configured. CI runs lint, typecheck, and build on PRs (`.github/workflows/integrity.yaml`).

## Architecture

### Path Alias

`~/*` maps to `./app/*` — use `import { useApi } from "~/shared/api/useApi"`.

### Feature Slices (`app/features/<domain>/`)

Code is sliced by domain, not by technical layer. There are ~19 slices (`flight`, `airport`, `aircraft`, `operator`, `rotation`, `delay`, `emergency`, `diversion`, `notam`, `runway`, `terminal`, `gate`, `parking-position`, `travel`, `user`, `auth`, `adsb`, `airframe`, `skylink`). A slice uses as many of these as it needs:

```
components/      feature-owned React components
hooks/           feature-scoped hooks and context providers
lib/             pure helpers
model.ts(x)      types, enums, and domain classes
service.ts       API service class
schema.ts        Yup validation schemas
form.ts          Formik initial values / form types
request.ts       request payload types
transformer.ts   model <-> request mapping
i18n.ts          enum-to-human-label translators
index.ts         barrel export
```

Cross-feature building blocks live in `app/shared/` (`api/`, `ui/`, `hooks/`, `lib/`, `models/`, `validator/`, `pwa/`). Global app state lives in `app/app-state/`. `app/components/` holds only the public landing page.

### API Service Layer (`app/shared/api/api.service.ts`)

Two base classes:
- `AbstractApiService` — unauthenticated requests
- `AbstractAuthorizedApiService` — extends it with bearer auth

Auth handling in the authorized base class:
- Tokens in localStorage via `app/shared/lib/tokenStorage.ts` — `at` (access), `rt` (refresh), `at_exp` (access token expiry in ms, decoded from the JWT)
- Refresh is **proactive** — `isAccessTokenExpired()` (30s skew) refreshes before the call — and **reactive**, retrying once after a 401
- 4xx responses reject with `ErrorResponse<T>`, carrying `violations` for field-level form errors

Each domain implements its own service in `app/features/<domain>/service.ts` (every slice except `notam`, whose NOTAMs are fetched through `AirportService.fetchNotams`). There are two entry points:

- **`useApi()`** (`app/shared/api/useApi.tsx`) — 17 authorized services, instantiated once in `ApiProvider` and mounted in `root.tsx`
- **`usePublicApi()`** (`app/shared/api/usePublicApi.tsx`) — the unauthenticated set used by the public map: `PublicFlightService`, `PublicRunwayService`, `PublicTerminalService`, `PublicParkingPositionService`, `PublicGateService` and `AdsbService`. Plain module-level singletons, no provider.

```typescript
const { flightService } = useApi();
const flight = await flightService.fetchFlightById(id);
```

### State Management

All state is React Context — no Redux/Zustand.

Global providers, mounted in `app/root.tsx`:
- **`useToast()`** (`app/app-state/useToast.tsx`) — toast notifications
- **`useApi()`** (`app/shared/api/useApi.tsx`) — singleton service instances
- **`useAuth()`** (`app/app-state/useAuth.tsx`) — user, tokens, sign-in/out

Scoped providers, mounted in `routes/AppLayout.tsx`: `useCurrentFlight()`, `useDataRefresh()`, `usePinnedAirports()`, `usePendingDelayCount()`. `useMapSettings()` (`app/app-state/useMapSettings.tsx`) is mounted separately in `routes/public/MapRoute.tsx`.

`useLocalStorage()` is a generic persistence hook in `app/shared/hooks/`, not app state — `useMapSettings` and `usePinnedAirports` are built on it.

### Route Structure (`app/routes.ts`)

Routes use React Router's compositional config API (`layout()`, `route()`, `index()`). Key layouts:
- `AuthLayout` — sign-in/out, email confirmation, Discord OAuth callback
- `MapLayout` — public flight map (`/map`, `/map/:id`), no auth
- `LandingRoute` — public marketing index at `/`
- `AppLayout` — authenticated wrapper (sidebar, bottom nav, toasts), wraps `AuthGuard`
- `OperationsLayout` / `PilotLayout` — role-specific nested layouts; `AuthGuard` takes `allowOnly` to gate by role

### Code Style

- **No comments. Ever.** Do not write code comments under any circumstances — no explanatory comments, no section headers, no "why" notes, no JSDoc, no TODOs, and no lint-suppression comments (`biome-ignore`). Code must be self-explanatory through clear names and structure. If something seems to need a comment, refactor it instead (rename, extract a well-named function/variable, restructure). Write like a senior engineer, not a learner narrating their work.

### Component Conventions

- **Named exports for components**: `export function MyComponent() { ... }`
- **Route modules are the one exception** — React Router requires `export default` for anything referenced from `app/routes.ts`. Nothing under `app/features/`, `app/shared/` or `app/components/` uses a default export.
- **PascalCase** directories and files for components
- Managed form blocks in `app/shared/ui/Form/Managed/` (`ManagedInputBlock`, `ManagedSelectBlock`, `ManagedDateTimeInputBlock`, …) wrap Formik fields with consistent styling — use them instead of raw Flowbite inputs
- Flowbite component overrides belong in `app/styles/theme.ts` (`createTheme`), not per-call `className` or `data-testid` selector hacks
- Enum-to-label translation goes through `toHuman` (`app/i18n/translate.ts`), backed by each slice's `i18n.ts`

### Data Models

Domain types live in each slice's `model.ts` (e.g. `app/features/flight/model.ts`). Most are plain types and enums; a few are classes (`Flight`) that parse API responses and expose helper getters. Shared geometry types are in `app/shared/models/`.

### PWA Launch Assets

`npm run generate:pwa-assets` regenerates `public/icons/` and the 88 iOS startup images in `public/splash/`. Do not edit
those PNGs by hand.

The generated splash is a pixel copy of `app/routes/common/Splash.tsx` — same `gray-50` / `gray-950` field, same mark,
same `my`/`preflight` wordmark at the same `md:` breakpoint sizes — so the OS splash, the in-app splash and the first
paint are the same picture and the launch shows no flash or jump. Change `Splash.tsx` and you must rerun the generator.
`background_color` in `site.webmanifest` is the same `gray-50`, and the icons carry it as their own background, which is
what keeps Android's generated splash (background colour + icon + app name) free of a visible icon tile.

Device coverage lives in `app/shared/pwa/appleSplashDevices.json`, read by both the generator and
`appleSplashScreens.ts`, which turns each entry into four `apple-touch-startup-image` links (portrait/landscape ×
light/dark). iOS needs an exact `device-width`/`device-height`/`-webkit-device-pixel-ratio` match or it shows no splash
at all, so a new device means a new entry plus a regeneration. The images are deliberately left out of the service
worker precache — 2.5 MB against a 233 KB shell — so a cold offline launch may briefly show none.

Rendering needs `chrome-headless-shell`, not full Chrome: Chrome's headless mode clamps narrow windows to a minimum
width, which silently shifts the artwork off centre. The script finds the binary in `~/.cache/puppeteer`, honours
`CHROME_HEADLESS_SHELL`, and otherwise prints the `npx @puppeteer/browsers install` command. It also fetches the Noto
Sans latin faces from Google Fonts and inlines them, so the wordmark is the real brand font rather than a fallback.

## Environment Variables

The `.env` file has production defaults. Create `.env.local` for local dev:

```env
VITE_NODE_ENV=development
VITE_FLIGHT_TRACKER_API_HOST=http://localhost
VITE_ADSB_API_HOST=http://localhost:1080
VITE_DISCORD_INVITATION_HASH=your-hash
VITE_DISCORD_CLIENT_ID=your-discord-client-id
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

`VITE_FLIGHT_TRACKER_API_HOST` and `VITE_ADSB_API_HOST` are read through `app/shared/lib/getMyPreflightApiHost.ts`, which throws when either is missing. `VITE_NODE_ENV` drives `isProduction` / `isDebug` in `useAppEnvironment()`. Note that `.env` itself does not list `VITE_DISCORD_CLIENT_ID`, so a plain `cp .env .env.local` will not give you Discord sign-in.

`import.meta.env.PACKAGE_VERSION` is injected by Vite config from `package.json`.

`VITE_CARTO_API_KEY` is optional and is read through `app/shared/lib/getCartoApiKey.ts`, which returns `null` when it is
unset or blank. `MapTileLayer` appends it to both basemap URLs as `?key=` at module load; without it CARTO still serves
tiles but stamps each one with an "API key required" watermark. It is a public value baked into the bundle, so it lives
in GitHub Actions `vars` alongside the client IDs, not in `secrets`.

The basemap stays on CARTO's **raster** tiles deliberately. CARTO's vector styles were evaluated and rejected: the
`carto.streets/v1` vector source caps at zoom 14 and returns HTTP 400 above it, so the airport and apron views (z13-17,
where runways, terminals and gates are drawn) lose detail to overzooming. Every free vector tileset shares that z14
ceiling — OpenFreeMap and VersaTiles included — while the raster endpoints serve real tiles through zoom 20. CARTO has
flagged the raster endpoints as being retired, so revisit this only when a vector source offers data above z14.

`VITE_GOOGLE_CLIENT_ID` is optional and enables Google sign-in. It must be the same OAuth 2.0 Web client ID as the API's `GOOGLE_CLIENT_ID`, because the API verifies the ID token's `audience` against its own value; a mismatch surfaces as `Google token is not valid.` Leave it unset and every Google surface disappears — the sign-in screen and `/me/account` render without any Google reference and nothing is requested from `accounts.google.com`. The app's origin must be registered as an authorized JavaScript origin on the Google client — `https://app.mypreflight.io` for production, plus `http://localhost:5173` for local dev.

`VITE_DISCORD_CLIENT_ID` is optional and enables Discord sign-in and Discord account linking. It is the Discord application's client ID, whose secret lives only on the API — the browser never exchanges the authorization code itself. Leave it unset and every Discord identity surface disappears; `VITE_DISCORD_INVITATION_HASH` is separate and keeps working, because the community invite needs no client. `<origin>/auth/discord/callback` must be registered as a redirect URI on the Discord application for every origin the app runs on, exact match included (`https://app.mypreflight.io/auth/discord/callback` for production, `http://localhost:5173/auth/discord/callback` for local dev), and the bot needs the Create Invite permission in the server for the opt-in server join to succeed.

Discord OAuth is a full-page redirect, unlike Google's in-page identity token, so the callback route only behaves like production in a built app. Deep links reach the router through `public/404.html` plus `public/ghspa.js`, which turn `/auth/discord/callback?code=…&state=…` into `/?/auth/discord/callback&code=…~and~state=…` and reverse it before routing. Testing a built app under GitHub Pages semantics showed this rewrite handles the callback whether or not the service worker is active — `navigateFallback` did not intercept navigations — so the rewrite is the path that must keep working, and it does not exist in `npm run dev`.

## Local Development Notes

- The dev server mounts every route twice (React Router SPA + Vite, no StrictMode), so each API call fires about twice. Production does not — verify network volume against a build, not `npm run dev`.
- The service worker and the GitHub Pages deep-link rewrite do not exist in dev. Anything touching them needs `npm run build` plus a static server on port 5173, which keeps the API's CORS origin valid.

## CI/CD

- **PR** (`integrity.yaml`): version check → install → lint → typecheck → build. It does not pass `VITE_DISCORD_CLIENT_ID`, so Discord surfaces are absent from PR builds; `release.yaml` does pass it.
- **Push to main** (`release.yaml`): build → git tag from `package.json` version → GitHub release → deploy to GitHub Pages (`./build/client`)
- Version must be bumped in `package.json` before merging (enforced by `bin/check_version_is_free`)

### Deployment Domain

The app is served from **`https://app.mypreflight.io`**, not the apex. Nothing in the bundle hardcodes it: every internal
link is router-relative, and the two places that need an absolute URL — the Discord `redirect_uri`
(`app/features/auth/lib/discordAuthorization.ts`) and the map share links — derive it from `window.location.origin`. A
domain move therefore needs no code change, only the four registrations below.

`release.yaml` uploads `./build/client` through `actions/deploy-pages`, so the custom domain lives in the repository's
Settings → Pages, not in a `CNAME` file — there is none in `public/`, and adding one has no effect on an Actions-published
site. Because a Pages site carries exactly one custom domain (apex and `www` being the only automatic pairing), the apex
is no longer served by this repository and needs its own host.

Four things are keyed to the origin and live outside this repo. All four must name `https://app.mypreflight.io` or the
app breaks in ways the build cannot catch:

1. DNS — a `CNAME` record for `app` pointing at the Pages host, and the domain set in Settings → Pages.
2. API CORS — the allowed-origin list in [flight-tracker-api](https://github.com/oskarbarcz/flight-tracker-api). Every
   request fails without it.
3. Discord — the redirect URI, exact match.
4. Google — the authorized JavaScript origin.

Three things do not survive the move, because the browser scopes them per origin: the bearer tokens in `localStorage`
(`at`, `rt`, `at_exp`), so every user signs in again; the installed PWA, whose manifest `id` is `/` on the old origin, so
existing installs stay bound there and must be reinstalled; and the service worker, which keeps serving its cached shell
from `navigateFallback` to anyone who visited the apex. Whatever takes over the apex should unregister that worker
before redirecting, or those clients keep running the old app offline.

## Design Context

Strategic design context lives in `PRODUCT.md` (root) — read it before design work. Register is **product**, platform **web**. Guiding principles: trust the numbers (exact, unit-labeled figures with visible derivation), earned familiarity over novelty, density with legibility, role-appropriate surfaces, procedural realism not theater. Accessibility bar is WCAG 2.1 AA across both light and dark themes. Visual system is documented in `DESIGN.md`, component inventory in `docs/DESIGN_SYSTEM.md`. The impeccable design skill reads both.

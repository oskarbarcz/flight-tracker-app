# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flight Tracker is a frontend SPA for scheduling and tracking flights in a flight simulator environment. It manages flights, aircraft, airports, crews, and passengers with role-based access (Operations, Admin, CabinCrew).

- **Frontend only** — backend API is a separate repo ([flight-tracker-api](https://github.com/oskarbarcz/flight-tracker-api))
- **Framework**: React Router v7 with SSR disabled (`react-router.config.ts: ssr: false`), Vite, TypeScript (strict)
- **Styling**: Tailwind CSS v4 (configured via `@theme` directives in `app/styles/index.css`, no `tailwind.config.ts`), Flowbite React for UI components
- **Forms**: Formik + Yup validation schemas (in `app/validator/form/`)
- **Linting/Formatting**: Biome (2-space indent, 120-char line width, double quotes)
- **Node**: 24.x (see `.nvmrc`)

## Commands

```bash
npm run dev          # Vite dev server with HMR (localhost:5173)
npm run build        # Production build (output: ./build)
npm run typecheck    # react-router typegen + tsc --build --noEmit
npm run lint         # Biome check (linter + formatter)
npm run lint:fix     # Biome auto-fix
```

No test framework is configured. CI runs lint, typecheck, and build on PRs (`.github/workflows/integrity.yaml`).

## Architecture

### Path Alias

`~/*` maps to `./app/*` — use `import { X } from "~/state/api/context/useApi"`.

### API Service Layer (`app/state/api/`)

All API calls go through service classes that extend `AbstractAuthorizedApiService` (in `api.service.ts`). This base class handles:
- Bearer token auth via localStorage (`at` = access token, `rt` = refresh token)
- Automatic token refresh on 401 responses
- JSON request/response handling

Services are instantiated once in `ApiProvider` context and accessed via `useApi()` hook:
```typescript
const { flightService } = useApi();
const flight = await flightService.fetchFlightById(id);
```

### State Management

All state is React Context — no Redux/Zustand:
- **`useAuth()`** — user, tokens, sign-in/out
- **`useApi()`** — singleton service instances (flight, airport, operator, aircraft, skylink, user, auth)
- **`useToast()`** — toast notifications
- **`useMapSettings()` / `useLocalStorage()`** — local app state

### Route Structure (`app/routes.ts`)

Routes use React Router v7's compositional API (`layout()`, `route()`, `index()`). Key layouts:
- `AuthLayout` — sign-in/out screens
- `AppLayout` — main authenticated wrapper (with sidebar, wraps `AuthGuard`)
- `OperationsLayout` / `PilotLayout` — role-specific nested layouts
- `MapLayout` — public flight map

### Code Style

- **No comments. Ever.** Do not write code comments under any circumstances — no explanatory comments, no section headers, no "why" notes, no JSDoc, no TODOs, and no lint-suppression comments (`biome-ignore`). Code must be self-explanatory through clear names and structure. If something seems to need a comment, refactor it instead (rename, extract a well-named function/variable, restructure). Write like a senior engineer, not a learner narrating their work.

### Component Conventions

- **Named exports only** (no default exports): `export function MyComponent() { ... }`
- **PascalCase** directories and files for components
- Managed form blocks in `app/components/shared/` wrap Formik fields with consistent styling

### Data Models (`app/models/`)

Domain classes (e.g., `Flight`) parse API responses and provide helper methods/getters. Enums define flight statuses, phases, airport types, user roles.

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

`import.meta.env.PACKAGE_VERSION` is injected by Vite config from `package.json`.

`VITE_GOOGLE_CLIENT_ID` is optional and enables Google sign-in. It must be the same OAuth 2.0 Web client ID as the API's `GOOGLE_CLIENT_ID`, because the API verifies the ID token's `audience` against its own value; a mismatch surfaces as `Google token is not valid.` Leave it unset and every Google surface disappears — the sign-in screen and `/me/account` render without any Google reference and nothing is requested from `accounts.google.com`. The app's origin must be registered as an authorized JavaScript origin on the Google client.

`VITE_DISCORD_CLIENT_ID` is optional and enables Discord sign-in and Discord account linking. It is the Discord application's client ID, whose secret lives only on the API — the browser never exchanges the authorization code itself. Leave it unset and every Discord identity surface disappears; `VITE_DISCORD_INVITATION_HASH` is separate and keeps working, because the community invite needs no client. `<origin>/auth/discord/callback` must be registered as a redirect URI on the Discord application for every origin the app runs on, exact match included (`http://localhost:5173/auth/discord/callback` for local dev), and the bot needs the Create Invite permission in the server for the opt-in server join to succeed.

Discord OAuth is a full-page redirect, unlike Google's in-page identity token, so the callback route only behaves like production in a built app. Deep links reach the router through `public/404.html` plus `public/ghspa.js`, which turn `/auth/discord/callback?code=…&state=…` into `/?/auth/discord/callback&code=…~and~state=…` and reverse it before routing. Testing a built app under GitHub Pages semantics showed this rewrite handles the callback whether or not the service worker is active — `navigateFallback` did not intercept navigations — so the rewrite is the path that must keep working, and it does not exist in `npm run dev`.

## CI/CD

- **PR** (`integrity.yaml`): version check → install → lint → typecheck → build
- **Push to main** (`release.yaml`): build → git tag from `package.json` version → GitHub release → deploy to GitHub Pages (`./build/client`)
- Version must be bumped in `package.json` before merging (enforced by `bin/check_version_is_free`)

## Design Context

Strategic design context lives in `PRODUCT.md` (root) — read it before design work. Register is **product**, platform **web**. Guiding principles: trust the numbers (exact, unit-labeled figures with visible derivation), earned familiarity over novelty, density with legibility, role-appropriate surfaces, procedural realism not theater. Accessibility bar is WCAG 2.1 AA across both light and dark themes. Visual system is documented in `DESIGN.md`. The impeccable design skill reads both.
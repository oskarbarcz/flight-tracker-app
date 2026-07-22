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
```

`import.meta.env.PACKAGE_VERSION` is injected by Vite config from `package.json`.

## CI/CD

- **PR** (`integrity.yaml`): version check → install → lint → typecheck → build
- **Push to main** (`release.yaml`): build → git tag from `package.json` version → GitHub release → deploy to GitHub Pages (`./build/client`)
- Version must be bumped in `package.json` before merging (enforced by `bin/check_version_is_free`)

## Design Context

Strategic design context lives in `PRODUCT.md` (root) — read it before design work. Register is **product**, platform **web**. Guiding principles: trust the numbers (exact, unit-labeled figures with visible derivation), earned familiarity over novelty, density with legibility, role-appropriate surfaces, procedural realism not theater. Accessibility bar is WCAG 2.1 AA across both light and dark themes. Visual system is documented in `DESIGN.md`. The impeccable design skill reads both.
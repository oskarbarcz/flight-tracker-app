# AGENTS.md

This file provides guidance to coding agents working with code in this repository.

## MyPreflight knowledge base

This repo is part of MyPreflight. The knowledge base lives in the product repo, [mypreflight/product](https://github.com/mypreflight/product). It is the primary source of truth for product decisions, data sources and design rules; it holds no code or architecture, which this file covers. Read it by URL before working here:

- Start: https://raw.githubusercontent.com/mypreflight/product/main/CLAUDE.md
- Design rules: https://raw.githubusercontent.com/mypreflight/product/main/product/brand/design-rules.md

If this file or the code contradicts the knowledge base, the knowledge base takes precedence. Flag the conflict; don't silently change either side.

Anything shared between repos belongs in the knowledge base; this file keeps what is specific to this repo. When your change alters product behaviour, also open a PR to the knowledge base updating the matching file.

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
npm run storybook    # Storybook dev server (localhost:6006)
npm run build-storybook  # Static Storybook in storybook-static/
npm run test:storybook   # Every story as a test in headless Chromium (Vitest)
```

There are no unit tests; Storybook stories run as tests (see "Storybook"). CI runs lint, typecheck, the app build, the Storybook build and the story tests on PRs (`.github/workflows/integrity.yaml`).

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

Cross-feature building blocks live in `app/shared/` (`api/`, `ui/`, `hooks/`, `lib/`, `models/`, `validator/`, `pwa/`). Global app state lives in `app/app-state/`. The marketing site is a separate repo ([mypreflight/landing](https://github.com/mypreflight/landing)), so this repo has no landing page.

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
- `AuthLayout` — sign-in/out, email confirmation, Discord OAuth callback, and `/activate`, where a signed-in user approves a Transponder sign-in. The Transponder opens `/activate?code=BCDF-GHJK`, so the path and the `code` parameter must not change
- `MapLayout` — public flight map (`/map`, `/map/:id`), no auth
- `AppLayout` — authenticated wrapper (sidebar, bottom nav, toasts), wraps `AuthGuard`. Its index `/` is the dashboard: the pilot dashboard for Cabin crew, a redirect to `/flights` for Operations and to `/data-changes` for Admin. Signed-out visitors land on `/sign-in`. The old `/dashboard` address redirects to `/`, because iOS home-screen installs keep the start URL they were installed with
- Return after sign-in: `AuthGuard`, and a failed token refresh, send the visitor to `/sign-in?returnTo=<path>`, and password, Google and Discord sign-in all land back on that path (Discord carries it through the OAuth round trip in its stored flow state). `app/shared/lib/signInReturn.ts` accepts only same-origin paths outside `/`, the sign-in and sign-out routes, `/confirm-email` and `/auth/*`; anything else falls back to the role's landing page
- `OperationsLayout` / `PilotLayout` — role-specific nested layouts; `AuthGuard` takes `allowOnly` (one role or a list) to gate by role
- `ReviewLayout` — shared by Operations and Admin; holds the data change review queue at `/data-changes`, which is also the Admin landing page

### Code Style

- **No comments. Ever.** Do not write code comments under any circumstances — no explanatory comments, no section headers, no "why" notes, no JSDoc, no TODOs, and no lint-suppression comments (`biome-ignore`). Code must be self-explanatory through clear names and structure. If something seems to need a comment, refactor it instead (rename, extract a well-named function/variable, restructure). Write like a senior engineer, not a learner narrating their work.

### Component Conventions

- **Named exports for components**: `export function MyComponent() { ... }`
- **Route modules are the one exception** — React Router requires `export default` for anything referenced from `app/routes.ts`. Nothing under `app/features/` or `app/shared/` uses a default export. Storybook stories need one too, which is why they live outside `app/` (see "Storybook").
- **PascalCase** directories and files for components
- Managed form blocks in `app/shared/ui/Form/Managed/` (`ManagedInputBlock`, `ManagedSelectBlock`, `ManagedDateTimeInputBlock`, …) wrap Formik fields with consistent styling — use them instead of raw Flowbite inputs
- Flowbite component overrides belong in `app/styles/theme.ts` (`createTheme`), not per-call `className` or `data-testid` selector hacks
- Enum-to-label translation goes through `toHuman` (`app/i18n/translate.ts`), backed by each slice's `i18n.ts`

### Storybook

Storybook 10 (`@storybook/react-vite`) documents components in isolation. Config is in `.storybook/`, stories in
`stories/`, grouped the way the sidebar shows them (`dashboard/`, `tracking/`, `maps/`, `account/`, `shared/`), with
`stories/Introduction.mdx` as the landing page.

- **Vite config:** Storybook reuses `vite.config.ts` and strips the React Router, prerender and PWA plugins in
  `viteFinal`, since those only work inside the app. Fonts come from `.storybook/preview-head.html`, the same Google
  Fonts link `root.tsx` adds. Telemetry is off.
- **Providers:** every story renders inside `MemoryRouter`, `ToastProvider`, `ApiProvider` and Flowbite's
  `ThemeProvider` with the app theme. The toolbar's Theme switch calls Flowbite's `setMode`, so `useThemeMode()` readers
  such as the map tiles follow it.
- **Fixtures:** `stories/fixtures/flights.ts` builds `Flight` objects from two trimmed seeded flights (AA4912 BOS–PHL
  passenger, AA2021 FRA–JFK cargo, also re-pointed JFK–HKG as a polar route) and lays the timesheet out around the
  current time for a given status, delay and block-time delta. `trackedFlight()` builds a `TrackedFlightContext` value with Storybook spies for every action;
  `TrackedFlightContext` is exported from `useTrackedFlight.tsx` for this.
- **No live ADS-B:** a global `beforeEach` answers every `/api/v1/position/` request from the story's `adsbTrack`
  parameter, or with an empty track. `.env` points ADS-B at production, so never remove this guard. Other API calls are
  not stubbed.
- **Tests:** `@storybook/addon-vitest` turns every story into a Vitest test in headless Chromium. A story passes when
  it renders without throwing and its `play` function, if any, passes. Story tests have their own `vitest.config.ts`
  rather than a `test` block in `vite.config.ts`: the app config carries the React Router and PWA plugins, and
  Flowbite's plugin watches the source tree in serve mode, which keeps Vitest from exiting. The story tests don't need
  Flowbite's generated class list. Install the browser once with `npx playwright install chromium`.
- **Documentation:** component and story docs go in `parameters.docs.description` (the no-comments rule applies to stories
  too). Each story says when its state occurs. Frame container-driven components with `atWidth()` and in-card components
  with `onCard` from `stories/support/frames.tsx`.

### Data Models

Domain types live in each slice's `model.ts` (e.g. `app/features/flight/model.ts`). Most are plain types and enums; a few are classes (`Flight`) that parse API responses and expose helper getters. Shared geometry types are in `app/shared/models/`.

### Maps

Leaflet (react-leaflet) draws every map. Every route map can also draw on a MapLibre GL globe
(`app/shared/ui/Globe/GlobeMap.tsx`): the Briefing Route chart, the Tracking view, flight history, the public flight
page, the rotation map and the Operations route map, plus the dashboard's Current flight card and its on-the-ground
version (`GroundStopMap`), which only use the globe.
MapLibre loads lazily (`LazyFlightGlobeMap` and the per-map `React.lazy` imports), so it never reaches the entry chunk;
`app/shared/lib/maplibreSetup.ts` points MapLibre at its worker through a `?url` import.

- **Projection:** a Mercator / Globe switch, in Map options where a map has them and in the map top bar otherwise, stored
  per map under `map-projection.<map>` by `useMapProjection`; the globe is the default. Switching keeps the view: both
  renderers report a `MapCameraView` (the centre of the area below the floating cards, in Leaflet's zoom scale) and the
  other one opens there. MapLibre's zoom is Leaflet's minus one (512-pixel tiles), see `toMapLibreZoom` and `globeZoom`;
  the switchable Leaflet maps use `zoomSnap={0}` so the zoom carries over exactly.
- **Wheel zoom:** the switchable Leaflet maps never use Leaflet's scroll-wheel handler. With `zoomSnap={0}` it zoomed a
  fraction of a level per scroll (on macOS Leaflet divides wheel deltas by three times the pixel ratio, which the
  default whole-level snap used to hide), and it dropped every step that arrived during its 250 ms zoom animation.
  `useMapWheelZoom` (or the `MapWheelZoom` element, and `MapEventsHandler` on maps that follow) applies MapLibre's
  wheel maths at the globe's rates from `app/shared/lib/wheelZoom.ts`, once per frame and without animation, so both
  projections zoom alike.
- **Globe content:** `FlightGlobeMap` draws a flight on every flight map. Pure functions turn the same geometry the Leaflet
  layers use (great circles, ETP rings, runway ribbons and markings, rounded airport and terminal shapes) into GeoJSON
  layers, and labels, chips, designators and the aircraft into HTML markers with the existing CSS classes. Airport detail
  uses the Leaflet zoom tiers mapped to MapLibre's scale. Marker headings are computed on screen at the marker's position,
  because north is not up across a globe.
- **Map options:** Projection and Mode sit on the edge nearest the trigger. In Manual, Follow, Flight data (great circle,
  filed route and ETP rings, each Yes / Dim / No, with rows the flight has no data for greyed out) and Static data
  (runways, terminals, gates, stands: All / Assigned / Off), then Airspace (FIRs: Yes / Dim / No, default No). Flight
  data and Airspace are not phase-driven, so Auto keeps them.
- **Route labels:** fix names sit beside each fix with their text at 70% and a solid 1 px halo (white, or the map's
  near-black in dark mode), so they read above the basemap's names, and turn solid on hover of the fix or the name. Each
  ETP ring is titled with its minutes and the airport's ICAO code, for example `60 min (EKCH)`.
- **Pseudo-fixes:** TOC, TOD and ETP are named in brackets, `(TOC)`, everywhere a fix name shows
  (`app/features/route/lib/fixName.ts`). The API sends no fix type, so they are recognised by ident. The ETOPS plan's
  entry, equal-time, critical and exit points are drawn exactly like fixes, as `(ETP IN)`, `(ETP)`, `(CP)` and
  `(ETP OUT)`, from the same `routeFixMarks` list. They have no nav log row, so clicking one selects nothing and shows
  no pointer.
- **Fix card:** on the Tracking view, clicking a fix's dot or name, flat or globe, opens `FixInfoCard` at the top right,
  below the floating cards. It stays open until it is closed or another fix is clicked. `MapBox` only keeps whether it is
  open; the fix shown is the briefing state's selected one, so the card and the highlighted dot always agree. The card
  hides while Map options hides the flight route. On the globe a clicked name wins over a fix dot under it, because the
  name is drawn on top. Other maps pass no `onFixClick`, so their names stay passive. Its figures sit in four sections,
  Meta, Flight fix, Fuel, and Wind and environment, as one column of label and right-aligned value, with the wind levels
  highest first. Each section folds from its heading. Wind and environment starts folded, and while folded its heading
  stays pinned to the card's bottom, because on common window heights the other three sections already fill the card.
  Folds survive switching fixes and reset when the card closes. The NavLog's expanded row keeps its own field grid and
  order. The header's arrows step through the nav log's fixes, so ETOPS points are skipped, and each step centers on the
  new fix at the current zoom. The center button does the same at Leaflet zoom 8, or stays closer if already closer.
  Both stop auto-center the way dragging does, because a following camera would pull the map straight back. They aim at
  the middle of the map's free area, measured from the card when pressed, so the fix isn't under the card or the
  floating cards. A focus request held when a map mounts is ignored, so switching projection doesn't fly back to an old
  fix.
- **Floating panels:** the fix card and Map options open and close through `useFloatingPanel` and `.floating-panel`. They
  grow from the point nearest what opened them and retreat to it, like modals but quicker (220 ms in, 150 ms out), and
  only fade under reduced motion. The panel stays mounted until its opacity transition ends, so a test that closes one
  has to wait for it to leave the DOM.
- **ETOPS colour:** rings, ring titles and ETP names share one blue, apart from the grey fixes and the indigo route. Light
  mode uses `sky-500` rings with `sky-700` text. Dark mode uses a muted steel blue, `etops-night` (`#7cabcc`), for all
  three, because `sky-400` glared on the dark basemap. Rings take the colour from `etopsColor` in `chartColors.ts`.
- **Polar limit:** both renderers are built on Web Mercator, which ends at 85.05°. MapLibre clamps globe geometry
  beyond it onto that parallel, so a line that crosses the pole jumps onto a small circle around it, and a point
  beyond it lands on that circle. `GlobeMap` therefore splits every overlay before MapLibre sees it
  (`separatePolarShapes` in `app/shared/lib/globePolar.ts`): lines are cut at 85.05°, the southern runs and points stay
  in MapLibre, and the polar runs and points go to an SVG layer above the canvas and below the markers, drawn with the
  same paint (colour, width, opacity, dashes, caps; `["get", key]` colours are resolved per feature). The layer
  projects every point with `map.project` on each frame and hides what is on the far side of the globe. Polar points
  of the `clickableLayer` keep hover and click. This covers routes, tracks, the great circle, the flown path, rotation
  legs and ETOPS rings with no per-map code. The flat map draws ETOPS rings as geodesic polylines from `etopsRings`,
  never `L.Circle`, which is a screen-space ellipse; on Mercator the polar part runs along the top edge of the map.
- **Globe camera:** the fit is spherical (centre of the points on the sphere, radius kept in front of the horizon); the
  globe never shrinks below about 85% of the map height and stops zooming in at 14.5.
- **Follow:** dragging or arrow-key panning turns Follow off and switches Map options to Manual; scroll, pinch,
  double-click and key zooms keep following, and the chosen zoom sticks until the follow target changes. There is no
  timed return to the target. This holds on both renderers (`MapEventsHandler`, `GlobeMap`).
- **Runway markings:** threshold bars are drawn only once a bar is at least 2.5 device pixels wide; below that each
  threshold shows one band at the bars' average tone, which removes the moiré of sub-pixel stripes.
- **FIR boundaries:** the Tracking view, the public flight page and the Operations route map draw FIRs when Map options
  says so, flat and globe, through the same MapLibre layers (`firBoundaryOverlay`): the Leaflet maps add them to the
  vector basemap's style (`MapTileLayer withAirspace`), the globe to its overlay (`FlightGlobeMap withAirspace`). Other
  maps never draw them, whatever the stored setting. While FIRs show, the basemap's own labels are hidden
  (`composeGlobeStyle` with `labels: false`); our airport labels stay.
- **FIR labels:** below MapLibre zoom 4 each FIR shows its ICAO code at VATSpy's label point, large, regular weight and at 60% opacity; from zoom 4 the code (bold)
  and name (regular) run along the FIR's own outline on its inner side, Navigraph style, so a shared border carries
  both names. The labels follow their own copy of each outline (`fir-boundary-labels.geojson`), not the drawn lines:
  neighbouring VATSpy polygons often miss each other's vertices, and labelling the merged lines split them into pieces
  too short for a name. That copy is simplified (`tolerance` 10, three decimals), because MapLibre drops a line label
  that bends more than 45° and European borders wiggle more than a label is long, so between zoom 4 and 6 Europe shows
  only some names. The product owner chose the early switch over a later one that would fit them all.
- **FIR data:** `npm run generate:fir-boundaries` builds four files in `public/airspace/` from the newest
  [VATSpy Data Project](https://github.com/vatsimnetwork/vatspy-data-project) commit (`VATSPY_REF` pins one): the
  drawn lines plus code points, the label outlines, the parts beyond 85°, and `fir-names.json`, which maps a code to
  the name the map labels it with, for the fix card. The table also holds codes the map doesn't draw, because a flight
  plan can name them: nested areas, merged sectors under their FIR's name, and upper areas VATSpy lacks, such as EDUU,
  through the overrides. A code missing from it shows alone. VATSpy is VATSIM's ATC map, not an ICAO
  FIR list, so the generator keeps four-letter codes only (no sector splits or NAT/ADR/UKR/GUY/BAIRES), drops VATSIM
  overlays (`X…`, `…XX`, military and FIS-only areas such as EDXX and EGVV), and drops an area lying inside a larger one
  of the same state (TMAs and ACCs inside a real FIR, such as EGTL in EGTT); its label point must be strictly inside,
  which keeps areas that fill a notch (NFFJ in NFFF) or a hole. `bin/fir_boundary_overrides.json` holds ICAO names
  where VATSpy has a station name (RJJJ is "Tokyo" there) and merges sectors into their FIR (RJDG into RJJJ, the
  Australian sectors into YBBB and YMMM, the Chinese ACCs into ZBPE, ZGZU and the others); the generator warns when a
  listed member disappears. Each shared border is drawn once, edges shared inside a merged FIR are dropped, and the
  seams where VATSpy splits a FIR at the antimeridian are removed. Lines stop at 85.05°, so MapLibre never clamps one
  onto that parallel; the rest goes to the polar file, which `useFirPolarLines` loads for the globe and
  `separatePolarShapes` draws in the projected layer, so the boundaries meet at the pole. The main files are URL
  sources, so the style diff compares a URL rather than the GeoJSON on every overlay change; none is precached.
  `.github/workflows/fir-boundaries.yaml` reruns the generator every Thursday and opens a PR with a patch bump when
  VATSpy changed; its steps live in `.github/scripts/generate_fir_boundaries.sh` and `open_fir_boundaries_pr.sh`. A PR opened with `GITHUB_TOKEN` does not start the integrity checks; set a `FIR_BOUNDARIES_TOKEN`
  secret (contents and pull requests write) to have them run, or close and reopen the PR.
- **FIR style:** grey dash-dot lines, so they don't read as the basemap's evenly dashed state borders; lighter in dark
  mode. `composeGlobeStyle` drops symbol layers when the basemap has no glyphs (the offline style). The data is
  CC BY-SA 4.0: Map options credits it under the FIRs row, and `MapAttribution withAirspace` adds it while FIRs show.

### Service Worker Updates

The service worker answers every navigation with its precached `index.html` until a new version activates, which
happens when every tab is closed, when a hidden tab applies the waiting update, or from the installed app's update
toast (`app/shared/pwa/UpdatePrompt.tsx`). After a deploy the old shell still points at the previous build's hashed
chunks, and GitHub Pages no longer serves them. When a route module fails to import, React Router calls
`window.location.reload()` with no guard, the stale shell is served again, and the page reloads forever. Chrome also
keeps postponing the update check while the page navigates, so the new version never gets to wait, let alone activate.

`public/sw-recovery.js` breaks that loop. It is a classic script in the head of `root.tsx`, precached with the shell, and
counts boots in `sessionStorage`: on the fourth boot within 10 seconds it unregisters the service worker and reloads from
the network, which serves the current build; the app registers the new worker again. Never remove it, and keep it in the
precache `globPatterns`. It cannot rescue a browser whose cached shell predates the script; closing every MyPreflight tab
does.

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

Every map draws the VersaTiles **Positrino** basemap (Positrino Dark in dark mode) through MapLibre GL: the globe on its
own MapLibre map, every Leaflet map through `@maplibre/maplibre-gl-leaflet` inside `MapTileLayer`. The styles come from
`@versatiles/style` with English labels and `tiles.versatiles.org` as their base, loaded by
`app/shared/lib/versatilesBasemap.ts`. The light style draws its place names in gray-400 (`colors.label` in the
generator), quieter than our route and airport labels. The two styles are prebuilt by `npm run generate:basemap-styles` into
`public/map-styles/` (rerun it after upgrading `@versatiles/style`) and precached by the service worker. The vector data stops at zoom 14, so above it the apron basemap is the zoom-14
data drawn larger; the product owner accepted that for one theme across the flat and globe views, and the app's own
runways, terminals, gates and stands carry the apron detail. Every map with a basemap credits OpenStreetMap, VersaTiles
and ESA WorldCover through `MapAttribution`.

The Leaflet basemap layer calls MapLibre's `redraw()` on every camera sync (`moveend`). Without it the canvas showed the
previous view at the wrong scale for one frame at the end of each zoom step and on every pan update.

`VITE_CARTO_API_KEY` is optional and only matters for the fallback: when the VersaTiles style cannot be built,
`MapTileLayer` shows CARTO's raster tiles and appends the key to their URLs as `?key=`. Without it CARTO still serves
tiles but stamps each one with an "API key required" watermark. It is read through `app/shared/lib/getCartoApiKey.ts`,
which returns `null` when it is unset or blank. It is a public value baked into the bundle, so it lives in GitHub Actions
`vars` alongside the client IDs, not in `secrets`.

`VITE_GOOGLE_CLIENT_ID` is optional and enables Google sign-in. It must be the same OAuth 2.0 Web client ID as the API's `GOOGLE_CLIENT_ID`, because the API verifies the ID token's `audience` against its own value; a mismatch surfaces as `Google token is not valid.` Leave it unset and every Google surface disappears — the sign-in screen and `/me/account` render without any Google reference and nothing is requested from `accounts.google.com`. The app's origin must be registered as an authorized JavaScript origin on the Google client — `https://app.mypreflight.io` for production, plus `http://localhost:5173` for local dev.

`VITE_DISCORD_CLIENT_ID` is optional and enables Discord sign-in and Discord account linking. It is the Discord application's client ID, whose secret lives only on the API — the browser never exchanges the authorization code itself. Leave it unset and every Discord identity surface disappears; `VITE_DISCORD_INVITATION_HASH` is separate and keeps working, because the community invite needs no client. `<origin>/auth/discord/callback` must be registered as a redirect URI on the Discord application for every origin the app runs on, exact match included (`https://app.mypreflight.io/auth/discord/callback` for production, `http://localhost:5173/auth/discord/callback` for local dev), and the bot needs the Create Invite permission in the server for the opt-in server join to succeed.

Discord OAuth is a full-page redirect, unlike Google's in-page identity token, so the callback route only behaves like production in a built app. Deep links reach the router through `public/404.html` plus `public/ghspa.js`, which turn `/auth/discord/callback?code=…&state=…` into `/?/auth/discord/callback&code=…~and~state=…` and reverse it before routing. Testing a built app under GitHub Pages semantics showed this rewrite handles the callback whether or not the service worker is active — `navigateFallback` did not intercept navigations — so the rewrite is the path that must keep working, and it does not exist in `npm run dev`.

## Local Development Notes

- The dev server mounts every route twice (React Router SPA + Vite, no StrictMode), so each API call fires about twice. Production does not — verify network volume against a build, not `npm run dev`.
- The service worker and the GitHub Pages deep-link rewrite do not exist in dev. Anything touching them needs `npm run build` plus a static server on port 5173, which keeps the API's CORS origin valid.

## CI/CD

- **PR** (`integrity.yaml`): version check → install → lint → typecheck → build → Storybook build → Playwright Chromium → story tests. It does not pass `VITE_DISCORD_CLIENT_ID`, so Discord surfaces are absent from PR builds; `release.yaml` does pass it.
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

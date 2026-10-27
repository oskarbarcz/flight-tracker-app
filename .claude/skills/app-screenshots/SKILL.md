---
name: app-screenshots
description: Drive the locally installed Google Chrome over the DevTools protocol to check MyPreflight UI changes in the real app and to capture screenshots, animation frames and before/after comparisons, then turn them into 1920×1080 update graphics for the Discord community. Use this whenever a change needs to be seen in the browser ("check it in Chrome", "does it look right", "test on mobile", "the map jumps", "screenshot this"), whenever the Claude in Chrome tools are not connected, and whenever the user asks for graphics, slides, images or a before/after comparison to show the community, even if they do not say "screenshot".
---

# App screenshots and update graphics

This is how to see the MyPreflight web app the way a user does: a real Chrome, signed in, at a known time of day, with screenshots good enough to publish. Every step here exists because skipping it produced a wrong or misleading picture at least once, so read the "Things that bite" section before the first capture of a session.

The bundled files:

| File | What it is for |
|---|---|
| `scripts/cdp.mjs` | The driver. Talks to Chrome's DevTools port; runs a sequence of commands in **one** process |
| `scripts/start-chrome.sh` | Starts Chrome with its own profile and a debugging port |
| `scripts/start-main-server.sh` | Serves `origin/main` (the "before" version) from a git worktree on port 5174 |
| `scripts/probe-map-motion.js` | Records the Leaflet map's centre and zoom over seven seconds, to prove or disprove a map "jump" |
| `assets/slides.html` | The Discord slide template; data comes from a `slides.js` next to it |
| `assets/slides.example.js` | A complete four-slide example (the tracking views update) to copy from |

Paths below are relative to the repo root; `$K` means `.claude/skills/app-screenshots` and `$S` the session scratchpad.

## 1. Start a Chrome you can drive

Prefer the Claude in Chrome extension tools when they are connected. When they are not (ToolSearch finds no `mcp__claude-in-chrome__*` tools), do not try to install anything: start the user's installed Chrome with a separate profile instead.

```bash
bash $K/scripts/start-chrome.sh 9333 $S/chrome-profile http://localhost:5173/sign-in
```

A separate `--user-data-dir` is what makes this safe: it is a second Chrome instance next to the user's own, with no access to their tabs or sign-ins, and it opens a visible window they can watch.

## 2. Sign in with the seed accounts

The API README (`~/Projects/ft/flight-tracker-api/README.md`) lists the seeded users; they share one password. Pick the role the page needs: `cabin-crew@example.com` for `/track`, `/rotations` and the other pilot pages, `operations@example.com` for operations pages, `admin@example.com` for the review queue. These are local seed accounts for the local API, so using them needs no confirmation.

```bash
CDP_PORT=9333 node $K/scripts/cdp.mjs signin cabin-crew@example.com 'P@$$w0rd'
```

`signin` waits for the form, fills it the way React expects (native value setter plus an `input` event; assigning `.value` alone leaves the form state empty) and waits for the access token in `localStorage`.

## 3. Drive it with `cdp.mjs`

Commands are chained with `--` and run in order **inside one process**:

```bash
CDP_PORT=9333 CDP_CLOCK=2025-01-01T14:40:07Z node $K/scripts/cdp.mjs \
  front -- viewport 1440 900 -- theme dark -- \
  nav /track/2d1c92f6-8ed1-4921-9a70-f71b1ed2e72d/tracking 9000 -- \
  shot $S/shots/after-tracking-dark.png -- \
  frames Briefing 7 160 $S/shots/to-briefing 0.2
```

| Command | Does |
|---|---|
| `front` | Brings the window forward and prints `document.visibilityState` |
| `viewport W H [mobile]` / `viewport reset` | Device metrics override; `mobile` gives a phone with DPR 2 |
| `nav URL [settleMs]` | Full navigation; a path starting with `/` is resolved against `CDP_ORIGIN` |
| `go PATH [settleMs]` | Client-side navigation through a real link click (no reload) |
| `signin EMAIL PASSWORD` | See above |
| `theme light\|dark\|auto` | Sets Flowbite's `flowbite-theme-mode`; applies on the next `nav` |
| `shot FILE` | Full-viewport PNG at `CDP_SCALE` (default 2) |
| `hover SELECTOR [click] FILE` | Real mouse move (and click), waits for tooltips, full-viewport PNG |
| `frames LABEL COUNT INTERVAL PREFIX [rate]` | Clicks the Briefing/Tracking switch and captures a frame sequence; `rate` slows CSS animations and view transitions |
| `eval EXPR` / `evalfile FILE` | Evaluates in the page and prints the JSON result |
| `sleep MS` | Waits |

| Variable | Effect |
|---|---|
| `CDP_PORT` | Which Chrome (9333 for the branch, 9334 for main) |
| `CDP_ORIGIN` | Which tab to attach to and how to resolve `/paths` (default `http://localhost:5173`) |
| `CDP_CLOCK` | ISO time the page's `Date` starts at on every document load |
| `CDP_SCALE` | Screenshot scale; 2 for material you will crop, 1 for final slides |
| `CDP_MOTION` | `reduce` to emulate reduced motion |
| `CDP_TOUCH` | Any value turns on touch emulation, so `(pointer: coarse)` matches |
| `CDP_API_DELAY` | Delay API and ADS-B responses, e.g. `/route=1800,/path=1200,400` |
| `CDP_TIMEOUT_MS` | Hard stop for the whole process (default 180000) |

## 4. Things that bite

Each of these cost a wrong screenshot or a hung run before it was understood.

- **Every override lives only as long as the process.** The clock script, reduced-motion, touch and focus emulation are attached to the DevTools session and vanish when `cdp.mjs` exits. If the page reloads afterwards (Vite does this on its own), the next screenshot shows the real date and the real media settings. Put a whole capture sequence — `nav` through the last `shot` — in one command.
- **A hidden window stops animations.** Chrome pauses `requestAnimationFrame` for a window covered by other windows, so a Leaflet `flyTo` freezes after its first frame and the map looks wrongly placed. Run `front` first and check it prints `visible`, or use `CDP_MOTION=reduce` when the animation itself is not what you are capturing.
- **Seeded flights are in the past.** Without a clock shift the tracking page reads "ARRIVAL OVERDUE 15919:51:09". Read the flight's timesheet (`GET /api/v1/flight/:id`) and set `CDP_CLOCK` to a moment in the phase you want to show. AA4912 (`2d1c92f6-8ed1-4921-9a70-f71b1ed2e72d`) is in cruise with mock ADS-B data; `2025-01-01T14:40:07Z` puts it 1h 15m after takeoff. Graphics then carry the footer "Seeded demo flights, shown on the day they fly. Times in UTC."
- **The theme is not a media query.** The app's dark mode is Flowbite's `flowbite-theme-mode` in `localStorage`; emulating `prefers-color-scheme` changes nothing. Use `theme`.
- **Vite reloads a fresh page by itself.** On the first visit after a server start it re-optimises dependencies and reloads ("optimized dependencies changed. reloading" in the server log). A script waiting on a promise in the old document never returns; `cdp.mjs` exits after `CDP_TIMEOUT_MS` instead of hanging. Load the page once and let it settle before a capture run.
- **High-DPI comes from the screenshot, not the viewport.** A `deviceScaleFactor` override did not survive between runs; `shot` renders a clip at `CDP_SCALE` instead, which always works.
- **Copy buttons need focus.** `navigator.clipboard.writeText` fails in an unfocused page, so "copied" states never appear. `cdp.mjs` turns on focus emulation for this.
- **Touch layouts need touch emulation.** `viewport ... mobile` alone keeps a fine pointer, so the app's 44px `pointer-coarse:` targets do not apply. Add `CDP_TOUCH=1` when checking tap targets.
- **Leaflet jumps are invisible to DOM sampling.** An instant `setView` resets the map pane's transform to zero, so watching `.leaflet-map-pane` sees nothing. Use `evalfile $K/scripts/probe-map-motion.js` right after a `nav` with a short settle time; it reads the map instance and prints every change of centre or zoom.
- **Slow networks: delay the API, not everything.** Throttling the whole connection stalls Vite's module graph for minutes. `CDP_API_DELAY` holds back only `http://localhost/api/*` and the ADS-B mock, which reproduces data arriving in stages.
- **Slow motion only slows CSS.** `frames ... 0.2` stretches CSS transitions and view transitions; JavaScript animation such as Leaflet's fly does not slow down.

## 5. Capturing "before" from `main`

The API only accepts the origin `http://localhost:5173` (`flight-tracker-api/src/core/http/cors/cors.config.ts`), and the user's dev server already owns that port. Do not stash or swap their working tree. Serve `main` from a worktree on 5174 and look at it from a second Chrome that ignores CORS:

```bash
bash $K/scripts/start-main-server.sh $S/before origin/main 5174
bash $K/scripts/start-chrome.sh 9334 $S/chrome-before http://localhost:5174/sign-in --insecure
CDP_PORT=9334 CDP_ORIGIN=http://localhost:5174 node $K/scripts/cdp.mjs signin cabin-crew@example.com 'P@$$w0rd'
```

`start-main-server.sh` copies `node_modules` with `cp -c` (an APFS clone: instant and nearly free). A symlink does not work: Vite refuses to serve files outside the worktree and the page stays blank. `--disable-web-security` belongs only to this throwaway profile.

The old version has different labels (`Monitor`, not `Tracking`) and controls (buttons, not links); `frames` matches either.

## 6. Discord update graphics

Earlier sets live on the Desktop (`mypreflight-dashboard-update`, `mypreflight-flight-tracking-update`, `mypreflight-tracking-views-update`). Look at one before starting so the new set matches. Save each new set in a **new** folder, `~/Desktop/mypreflight-<topic>-update/`, with numbered files (`01-…png`).

1. Capture at `CDP_SCALE=2` and 1440×900, both versions, with the same clock and theme. Alternate themes across slides as earlier sets do, and capture each theme you will use.
2. Make a work folder with `assets/slides.html`, a `slides.js` (start from `assets/slides.example.js`), `app/assets/logo.svg` copied as `logo.svg`, and the captures in `shots/`.
3. Write one slide per change. The voice is the product's: terse, exact, plain. A headline of at most about 50 characters with one `<em>` accent; a two- or three-sentence lede; one sentence each for Before and After that a pilot would recognise from using the app. Panels crop the full screenshots in CSS: `crop(file, { x, y, w, h }, width)` in 1440×900 page coordinates (`CONTENT` drops the sidebar, `TOP_OF_PAGE` keeps the header and phase card), and `browser(url, file, region, width)` adds an address bar.
4. Render each slide at 1920×1080 and scale 1:

   ```bash
   CDP_PORT=9333 CDP_ORIGIN=file:// CDP_SCALE=1 node $K/scripts/cdp.mjs viewport 1920 1080 -- \
     nav "file://$PWD/slides.html?slide=01-full-page-map" 2500 -- shot render/01-full-page-map.png -- \
     viewport reset
   ```

5. Look at every render before copying it to the Desktop: no text running into a margin, pills not overlapping their text, crops showing whole controls, the clock reading the flight's day.

## 7. Clean up

Stop what this skill started and nothing else: `pkill -f "react-router dev --port 5174"`, `pkill -f "user-data-dir=$S/chrome-before"`, then `git worktree remove --force $S/before`. Leave the branch Chrome (9333) open if the user may want to click around, and say that it is open.

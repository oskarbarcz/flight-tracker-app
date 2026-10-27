# Product

<!-- impeccable:product-schema 1 -->

## Register

product

## Platform

web

## Users

Virtual-aviation enthusiasts running a simulated airline, in three authenticated roles, each in a distinct task context:

- **Operations** ("Dispatcher · OCC") — plan and schedule flights, build preliminary loadsheets and fuel figures, manage operators, the fleet, cabin layouts, cargo holds, airports, parking positions, gates and runways, work delays and emergencies, and review data-change requests. At a desk, often multi-monitor, treating the app like a real operations control center.
- **Cabin crew** — the flying role. Check into a flight through an EFB-style flow, review the operator's briefing, loadsheet and the crew and passenger manifests, fill the final loadsheet at finish-boarding, report live telemetry, and follow the route on the map. Between flights: rotations, flight and aircraft history, the airports library, stats, the travel log and postcards.
- **Admin** — reviews data-change requests; the review queue is the Admin landing page.

Visitors without an account reach two public surfaces: the landing page at `/` and the live flight map at `/map`, whose flights can be shared by link.

The operational workflow should feel like operating a real airline. The backend is a separate API (`flight-tracker-api`); this repo is the frontend SPA.

## Product Purpose

Give a solo simmer the full operational loop of an airline — schedule → dispatch → check-in → board → fly → track → close — backed by accurate, structured records (timesheets, loadsheets, fuel breakdowns, weight build-ups). Success is a user who trusts the numbers, moves through each flight phase without friction, and feels in command of a believable operation.

## Positioning

Solo-first, community optional. One simmer can run the whole operation alone; the Discord community invite, Discord sign-in and the public live map with its share links are optional extras.

## Capabilities and Constraints

- **Terminology:** the flying role is **Cabin crew**. "Pilot" is an alias for it; do not use it to name the role or its users in product copy or documentation.
- **Gamification is deliberate:** postcards collected per city, the travel log, and cabin-crew stats and activity heatmaps.
- **Reference data is reviewed:** changes to airports, terminals, gates, parking positions and runways arrive as data-change requests that Operations or Admin accept or reject.
- **Open:** whether the gamified surfaces keep the terse documentary voice or take a warmer one.

## Brand Personality

Precise and professional. Instrument-panel confidence: trustworthy, legible under density, calm authority. The voice is that of real aviation operations documentation — terse, exact, unit-aware (tons, UTC/`Z` times, IATA/ICAO codes), never chatty. Three words: **precise, professional, dependable**.

## Anti-references

Not a flashy gamer / sci-fi HUD: no neon glows, no aggressive gamer dark-mode, no decorative fake-cockpit skeuomorphism. Realism is carried by correct data and structured layout, never by theatrical chrome. By extension, avoid gratuitous decoration or motion that does not convey state.

## Design Principles

- **Trust the numbers.** Figures (weights, fuel, times) are the product. Present them exactly, unit-labeled, with the derivation visible (build-ups, subtotals, running totals) so users can verify at a glance.
- **Earned familiarity over novelty.** Use standard operations and app affordances — tabs, side nav, tables, modals only when nothing inline works. The tool should disappear into the task.
- **Density with legibility.** Dispatchers scan a lot at once; pack information without cramping. Hierarchy and rhythm carry density, not whitespace alone.
- **Role-appropriate surfaces.** Operations, cabin-crew and Admin views expose only what that role acts on. Reuse components across roles, but respect each role's permissions and read-only boundaries.
- **Procedural realism, not theater.** The realism dial is turned by accurate workflow and terminology, never by visual gimmickry.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text meets 4.5:1 contrast (watch the muted-gray-on-tinted-surface trap present in some data panels), every interactive control has a visible focus state, and animation honors `prefers-reduced-motion`. Both light and dark themes ship and must both hold the bar. Never encode meaning in color alone — fuel/weight limit status and emergency states need a text or icon cue alongside hue.

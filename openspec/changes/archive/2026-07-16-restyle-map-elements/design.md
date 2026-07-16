## Context

Map elements are rendered with `react-leaflet` across several surfaces (tracking dashboard, flight history, route overview, fullscreen public map, airport library). Two label kinds exist today (`AirportExtendedLabel`, `AirportShortLabel`), the airport shape has one SVG renderer plus an on-map polygon, ground markers are generic Leaflet teardrop `DivIcon`s with permanent `Tooltip`s, the great-circle uses `arc` + `Polyline`, and runways use `Polyline` at `weight 6` with filled end-chip `DivIcon`s. Styling lives partly in Tailwind classes on the components and partly in `app/styles/utilities.css` (Leaflet cannot be styled with Tailwind at the tile/tooltip level, so hand-written CSS is required there). Colors are hard-coded (`mapColors.ts`, inline hex) and drifted off the design system (`blue-500`, sky-blue pills, saturated yellow/green as decoration).

The design system (`DESIGN.md`) is near-monochrome with a single indigo accent and the rule "color is a signal, never decoration"; it bans glows and neon. The exploration (see the published artifacts) locked a full visual language for the map. This change implements it. It is presentation-only — no API, data-model, or routing changes.

## Goals / Non-Goals

**Goals:**
- One coherent, quiet visual language for all map elements, on both light and dark tiles.
- Indigo reserved for the tracked flight; orange for terminals/gates; green for parking — preserving users' existing color memory.
- Labels that mark the exact point and never cover the map, legible on both themes.
- Runways proportioned to real scale rather than fixed pixel weight.
- Reuse across every map surface with no per-call style overrides (theme lives in shared CSS / helpers).

**Non-Goals:**
- No changes to what data is fetched or which airports/gates/runways are shown (only how they are drawn).
- No new map surfaces, controls, or interactions beyond selection emphasis.
- No animation beyond what is strictly state-conveying (the pulsing-ring highlight idea was rejected).
- No redesign of the map top bar, tiles, or overlays (covered elsewhere).

## Decisions

### Labels: HTML halo via `L.DivIcon`, styled from the tile theme
Render label content as an `L.DivIcon` (as today) but drop the card. Text uses `paint-order: stroke` (or layered `text-shadow`) for the halo. **Key fix:** the label must be colored from the *map tile's* theme, not the page's `--ink` token — the current bug is dark text inheriting the page theme and vanishing on the dark map. Scope the color/halo under the tile theme (e.g. `.mtile--dark`-equivalent Leaflet container theme class), giving light-on-dark / dark-on-light.
- *Alternative considered:* a compact chip (surface + hairline border). Rejected as the default because it still floats a box over the map; the halo is more cartographic. The chip pattern is retained conceptually for a possible hover-expand later, not in this change.

### Airport & terminal shapes: shared rounded-polygon helper
Add one geometry helper with two outputs from the same corner-trim algorithm (radius clamped to `min(r, ½·shortestEdge)`): an SVG path string for the `AirportShape` avatar, and a **densified vertex list** for on-map Leaflet polygons. Recolor to the indigo token.
- *On-map polygons (settled):* Leaflet `Polygon` cannot round corners natively, and a custom SVG-overlay renderer that re-projects on every zoom/pan is not worth it for a subtle round. Instead, round in projected space (reuse the `longitudeScale` projection already in `AirportShape.tsx`), **sample each rounded corner into a handful of extra lat/lng vertices**, convert back, and pass the denser point list to the existing Leaflet `Polygon`. Fill and stroke both round, and it reprojects correctly because they are ordinary geographic vertices. This gives true visible rounding for airport boundaries and terminals without a new renderer or dependency.
- *Alternative considered:* a curve/Catmull-Rom smoothing plugin. Rejected — heavier dependency, over-smooths real geometry.

### Ground markers: dots/chips, not teardrops; shape + color + selection
Gates → orange refined chips; parking → green dots with filled(assigned)/hollow(unassigned) selection state. Replace the generic teardrop SVG in `GateMarkers`/`ParkingPositionMarkers`. Selection state for parking is derived from the existing `arrivalParkingPositionId` / `departureParkingPositionId` already threaded through `TrackingAirportLayoutLayer`.
- *Alternative considered:* neutralizing to slate + indigo-for-assigned. Rejected by product — orange/green color memory must be preserved.

### Route line: quiet dotted, correct hierarchy
`GreatCirclePath` → `weight 1.5`, `dashArray "1 7"`, `lineCap: round`, `opacity 0.7`; ensure it renders beneath `FlightPath`. Diversion variant keeps danger red, slightly bolder.

### Runways: real-width geographic-polygon ribbon + rotated halo designators
Replace `RunwayLines` `Polyline(weight 6)` + filled end-chips with an asphalt **geographic polygon**. The `Runway` model carries `width` (meters, required), `magneticHeading`, `length`, and `coordinates`, so build the ribbon rectangle by offsetting each threshold coordinate perpendicular to the heading (heading ± 90°) by `width / 2` using the existing `destinationPoint` geodesic helper in `runwayPairs.ts`. Because the corners are lat/lng, the ribbon scales with zoom exactly like the terminal/airport polygons — no per-zoom pixel math. Designators become mono halo labels rotated to the runway heading (clamp so text is never upside down). Assigned runway = indigo, others neutral slate. Gate the ribbon behind `AIRPORT_DETAIL_ZOOM_THRESHOLD` (as terminals/gates already are); when below the threshold on flight maps the runway is **hidden** (the airport-library map always fits airport bounds, so runways always show there).
- *Alternative considered:* a fixed-pixel-weight line (as today). Rejected — looks fat when zoomed out and thin when zoomed in; the whole complaint that triggered this.
- *Alternative considered:* a hairline fallback below the detail zoom. Rejected — a lone runway line with no terminals/gates/parking is inconsistent; hide the whole ground layer together.

### CSS hygiene
Untangle the crossed classes: `GateMarkers` uses a gate class, `ParkingPositionMarkers` uses a parking class; rename in `utilities.css` accordingly. Move drifted hex into named tokens where practical (`mapColors.ts` / CSS variables) so light/dark and the semantic roles are declared once.

## Risks / Trade-offs

- **Label halo via `text-shadow` can look muddy at small sizes** → prefer `paint-order: stroke` with a 3–4px stroke; verify on both themes over busy tiles.
- **Densified corner vertices could distort at extreme latitudes** → round in the local projected space (`longitudeScale`) at a small radius so the corner sampling stays faithful; the effect is negligible at terminal/airport scale.
- **Rendering ribbons/chips as SVG/DivIcons at many gates** → keep markers lightweight (no per-marker React re-render storms); reuse icon instances where the designator differs only in text.
- **WCAG contrast on colored labels** → orange/green label text must hit AA on both tiles; use darker orange/green on light tiles and brighter on dark (per the locked spec), not the raw marker hue.

## Migration Plan

Presentation-only and incremental — each element can ship independently behind the same components, no data migration or flags. Suggested order: shared helpers (rounded-polygon, color tokens, halo CSS) → labels → shapes → ground markers → route → runways → CSS class cleanup. Rollback is reverting the component/CSS diffs; no persisted state is affected. Verify visually on light and dark for every surface (tracking, history, overview, fullscreen, airport library) before merge.

## Resolved Decisions

- **Runway width:** the `Runway` model exposes `width` (meters, required) plus `magneticHeading` — always build the ribbon from real geometry; no default is needed.
- **On-map rounding:** round via densified lat/lng vertices fed to the existing Leaflet `Polygon` (fill + stroke round, reprojects correctly); the same helper emits an SVG path for the avatar. No new renderer or dependency.
- **Below detail zoom:** runways are hidden along with the rest of the ground layer (no hairline fallback).

## Why

The map layer's elements — airport labels, airport/terminal shapes, gate and parking markers, the great-circle route line, and runways — read as developer-drawn rather than designed: oversized labels that cover the map and float off the true point, off-palette sky-blue pills with a decorative globe, generic teardrop pins, saturated fills used as decoration, and heavy lines that flatten the hierarchy between the *planned* route and the *flown* track. This is off the document-grade design system (near-monochrome, one indigo accent, "color is a signal, never decoration") and makes an otherwise professional product look unfinished.

## What Changes

- **Airport labels** become cartographic halo labels: `IATA` (mono) + **airport name** (was city) over a contrast halo, with a small indigo anchor dot marking the exact coordinate. Labels flip to light-text-on-dark / dark-text-on-light per map theme so they stay legible (fixes the current dark-map invisibility). Diversion endpoints use danger red.
- **Airport shape** corners are softly rounded (per-vertex quadratic-bézier trim, radius clamped to `min(r, ½·shortestEdge)`) and recolored from raw `blue-500` to the indigo brand token. Same routine serves the list avatar and the on-map boundary.
- **Terminals** keep their established **orange** identity, gain a subtle corner round, and render as a tinted area with a quiet centered tracked-caps label.
- **Gates** keep **orange**, and replace teardrop pins with refined orange chips (mono code + leading dot, hairline border).
- **Parking stands** keep **green**, replace teardrop pins with dot markers, and the flight's **assigned stand is filled while unassigned stands are hollow** rings.
- **Great-circle route** becomes a hairline dotted line (`weight 1.5`, `dashArray "1 7"`, round caps, `opacity 0.7`) that sits *below* the altitude-colored flown track in the visual hierarchy.
- **Runways** replace the heavy `weight 6` polylines and solid filled end-chips with an asphalt ribbon sized to **real scale** (a polygon built from the centerline + real width, ~45 m default) and rotated mono halo designators; the flight's assigned runway is indigo, others neutral. Ribbon detail is gated behind the existing airport-detail zoom threshold, falling back to a hairline when zoomed out.
- Across all elements, **indigo is reserved for "this flight"** (route, endpoints, assigned runway); orange means terminals & gates, green means parking.
- **Cleanup:** untangle the crossed Leaflet tooltip CSS classes (`GateMarkers` currently uses `.terminal-label`, `ParkingPositionMarkers` uses `.gate-label`).

## Capabilities

### New Capabilities
- `map-visual-language`: the shared visual and behavioral rules for how map elements are rendered across every Leaflet map in the app (tracking, history, route overview, fullscreen, airport library) — labels, airport/terminal shapes, gate/parking markers, the planned route line, and runways, including the semantic color roles, theme legibility, selection emphasis, and zoom-gating of ground detail.

### Modified Capabilities
<!-- None. Existing specs (live-position-tracking, airport-library) describe map data and behavior, not the presentation of map elements; those presentation rules are new and captured under map-visual-language. -->

## Impact

- **Presentation only — no API, data-model, or route changes.** Purely how existing map data is drawn.
- Affected components (`app/features/flight/components/Map/Element/`): `AirportExtendedLabel`, `AirportShortLabel`, `MapAirportLabel`, `AirportShapePolygon`, `TerminalPolygons`, `GateMarkers`, `ParkingPositionMarkers`, `GreatCirclePath`, `RunwayLines`, plus `TrackingAirportLayoutLayer` / `TrackingRunwaysLayer` composition and the `zoomThresholds` gate.
- Also touches `app/features/airport/components/Airport/AirportShape.tsx` (avatar), `app/shared/lib/mapColors.ts`, and the Leaflet map styles in `app/styles/utilities.css`.
- Consumed by the tracking dashboard, flight history, route overview, fullscreen public map, and the airport library map — all inherit the change.
- No new dependencies. Runway real-width rendering may add a small geometry helper (centerline + width → polygon).

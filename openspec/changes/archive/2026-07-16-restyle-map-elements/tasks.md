## 1. Shared foundations

- [x] 1.1 Add a rounded-polygon geometry helper with two outputs from one corner-trim algorithm (radius clamped to `min(r, ½·shortestEdge)`): an SVG path string for avatars, and a densified lat/lng vertex list for Leaflet polygons (round in projected space via `longitudeScale`, then convert back)
- [x] 1.2 Consolidate map color roles into named tokens (`app/shared/lib/mapColors.ts` and/or CSS variables): indigo = this-flight, orange = terminal/gate, green = parking, danger = diversion, plus light/dark-legible label shades
- [x] 1.3 Add shared halo-label CSS in `app/styles/utilities.css` scoped to the map tile theme (light-on-dark / dark-on-light, `paint-order: stroke`, no glows)

## 2. Airport labels

- [x] 2.1 Rewrite `AirportExtendedLabel` / `AirportShortLabel` into a single halo label: mono IATA + airport name (not city), no globe icon, no sky-blue pill
- [x] 2.2 Render an indigo anchor dot at the airport's exact coordinate in `MapAirportLabel`
- [x] 2.3 Color labels from the tile theme so they are legible on both light and dark maps (fixes dark-map invisibility)
- [x] 2.4 Apply danger-red variant to diversion endpoints (label + anchor) in `DiversionRoute`
- [x] 2.5 Update `extended`/short usages across surfaces (fullscreen, tracking, history, overview, airport location) to the new label

## 3. Airport & terminal shapes

- [x] 3.1 Apply the rounded-polygon helper and indigo brand token to `AirportShape.tsx` (avatar) — replace raw `blue-500`
- [x] 3.2 Apply rounding + indigo to the on-map `AirportShapePolygon` by feeding the densified vertex list to the Leaflet `Polygon`
- [x] 3.3 Give `TerminalPolygons` subtly rounded corners, keep orange, and render a quiet centered tracked-caps label

## 4. Ground markers

- [x] 4.1 Replace the teardrop `DivIcon` in `GateMarkers` with a refined orange chip (mono designator + leading dot, hairline border)
- [x] 4.2 Replace the teardrop `DivIcon` in `ParkingPositionMarkers` with a green dot marker
- [x] 4.3 Implement parking selection state: assigned stand filled, unassigned stands hollow (default to filled when no assignment context), driven by the existing assigned parking id
- [x] 4.4 Untangle the crossed Leaflet tooltip classes so gates use a gate class and parking uses a parking class

## 5. Route line

- [x] 5.1 Restyle `GreatCirclePath` to a hairline dotted line (`weight 1.5`, `dashArray "1 7"`, round caps, `opacity 0.7`); keep the bolder danger-red diversion variant
- [x] 5.2 Ensure the great-circle renders beneath `FlightPath` so the flown track reads as primary

## 6. Runways

- [x] 6.1 Add a runway ribbon builder in `runwayPairs.ts`: from each threshold `coordinates` offset perpendicular to `magneticHeading` by `width / 2` (reuse `destinationPoint`) → a geographic 4-corner polygon that scales with zoom
- [x] 6.2 Rewrite `RunwayLines` to draw the asphalt ribbon polygon (assigned = indigo, others = neutral slate) and remove the `weight 6` polyline and filled end-chips
- [x] 6.3 Render runway designators as mono halo labels rotated to the runway heading (clamp so text is never upside down)
- [x] 6.4 Confirm `TrackingRunwaysLayer` keeps the `AIRPORT_DETAIL_ZOOM_THRESHOLD` gate so runways hide with the rest of the ground layer below it (airport-library map is unaffected — it fits airport bounds)

## 7. Verification

- [x] 7.1 `npm run lint`, `npm run typecheck`, and `npm run build` pass
- [x] 7.2 Visually verify every surface (tracking dashboard, flight history, route overview, fullscreen public map, airport library) on both light and dark themes
- [x] 7.3 Confirm label and colored-marker text meet WCAG AA contrast on both tile themes
- [x] 7.4 Confirm no element besides the tracked flight's own uses indigo, and orange/green roles are consistent everywhere

# Map visual language

## Purpose

Defines the shared visual and behavioral rules for how map elements are rendered across every Leaflet map in the app (tracking, history, route overview, fullscreen, airport library): airport labels, airport/terminal shapes, gate/parking markers, the planned route line, runways, and the aircraft marker. It establishes the semantic color roles (indigo for the tracked flight, orange for terminals & gates, green for parking), theme legibility, selection emphasis, progressive disclosure by zoom, and the map top bar's telemetry.

## Requirements

### Requirement: Semantic color roles on the map

Map elements SHALL use color only as a signal, following fixed role assignments: indigo (the brand accent) for the tracked flight's own elements (planned route, endpoint labels, airport boundary shape, assigned runway, aircraft), orange for terminals and gates, and green for parking stands. No other saturated fills SHALL be used decoratively.

#### Scenario: This-flight elements are indigo
- **WHEN** a flight's route, endpoint labels, airport shape, or assigned runway are drawn
- **THEN** they use the indigo brand token

#### Scenario: Terminals and gates are orange
- **WHEN** terminals and gates are drawn
- **THEN** both use the established orange identity

#### Scenario: Parking stands are green
- **WHEN** parking stands are drawn
- **THEN** they use the established green identity

### Requirement: Airport labels are zoom-aware halo labels

Airport labels SHALL render as indigo text over a contrast halo, with no background card and no anchor dot, centered on the airport's coordinate. Below the structure zoom threshold (where terminals and runways are not yet shown) the label SHALL show only the IATA code; at or above that threshold it SHALL expand to `IATA | airport name`. The globe icon and the sky-blue pill SHALL be removed, and the city SHALL NOT be shown.

#### Scenario: Collapsed to IATA when zoomed out
- **WHEN** the map is below the structure zoom threshold
- **THEN** the airport label shows only the IATA code, in indigo

#### Scenario: Expanded to name when zoomed in
- **WHEN** the map is at or above the structure zoom threshold
- **THEN** the airport label shows `IATA | airport name`, in indigo

### Requirement: Labels remain legible on both map themes

Airport and ground-marker text labels SHALL be legible on both light and dark map tiles: on a dark map the text carries a dark contrast halo and on a light map a light halo. Halos SHALL be crisp contrast outlines, not glows.

#### Scenario: Dark map legibility
- **WHEN** a label is rendered over the dark map tiles
- **THEN** it carries a dark halo so it is clearly readable

#### Scenario: Light map legibility
- **WHEN** a label is rendered over the light map tiles
- **THEN** it carries a light halo so it is clearly readable

### Requirement: Diversion endpoints are distinguished in red

When a diversion airport is shown, its label and route SHALL use the danger (red) semantic color to distinguish it from normal endpoints.

#### Scenario: Diversion endpoint
- **WHEN** a diversion route and its destination airport are drawn
- **THEN** the diversion airport's label and route use the danger red color

### Requirement: Airport and terminal shapes have softly rounded corners

Airport boundary polygons and terminal polygons SHALL render with softly rounded corners produced by a per-vertex corner trim, with the corner radius clamped to at most half of the shorter adjacent edge so the silhouette and orientation are preserved. The airport shape SHALL use the indigo brand token (replacing the raw `blue-500`), and its fill SHALL be lighter on the light theme than on the dark theme. The same rounding routine SHALL serve the list avatar and the on-map boundary.

#### Scenario: Rounded airport boundary
- **WHEN** an airport shape is drawn on the map or as a list avatar
- **THEN** its corners are gently rounded and its color is the indigo brand token

#### Scenario: Rounding never distorts tight corners
- **WHEN** a polygon has a short edge between two vertices
- **THEN** the applied corner radius is clamped so the edge is not overrun and the shape stays faithful

#### Scenario: Shape fill is lighter in light mode
- **WHEN** the airport boundary is drawn on the light theme
- **THEN** its fill is more transparent than on the dark theme

#### Scenario: Terminal uses a subtle round and full name
- **WHEN** a terminal polygon is drawn
- **THEN** it renders as an orange tinted area with subtly rounded corners and a quiet centered label showing the terminal's full name

### Requirement: Gates render as refined orange chips

Gate markers SHALL render as refined orange chips (monospace designator with a leading dot and a hairline border), not teardrop pins.

#### Scenario: Gate chip
- **WHEN** a gate is drawn
- **THEN** it appears as an orange chip showing its designator, with no teardrop pin

### Requirement: Parking stands render as green dots with selection emphasis

Parking-stand markers SHALL render as green dot markers (not teardrop pins). When the map has an assigned stand for the flight, the assigned stand SHALL render as a filled dot while unassigned stands render as hollow rings. When no stand is assigned (e.g. showing all stands without a flight context), stands render as filled dots.

#### Scenario: Assigned stand stands out
- **WHEN** a flight has an assigned parking stand and other stands are also shown
- **THEN** the assigned stand is a filled green dot and the other stands are hollow green rings

#### Scenario: No assignment context
- **WHEN** stands are shown without any assigned stand
- **THEN** each stand renders as a filled green dot

### Requirement: Great-circle route is subordinate to the flown track

The planned great-circle route SHALL render as a thin dashed line that is visually quieter than, and layered beneath, the altitude-colored flown track, while remaining clearly visible over the map tiles.

#### Scenario: Route hierarchy
- **WHEN** both the planned great-circle route and the flown track are visible
- **THEN** the planned route reads as a thin dashed reference line and the flown track reads as the primary line

### Requirement: Runways render as a real-scale asphalt ribbon

Runways SHALL render as an asphalt geographic-polygon ribbon whose width is the runway's real width (from the model's `width`, in meters), built by offsetting each threshold coordinate perpendicular to its heading, rather than a fixed-pixel-weight line, so the ribbon stays correctly proportioned across zoom levels. Each runway end SHALL be labelled with its designator as a mono halo label rotated to the runway heading. The flight's assigned runway SHALL be indigo and other runways neutral. The heavy weight-6 polylines and solid filled end-chips SHALL be removed.

#### Scenario: Ribbon proportioned to real width
- **WHEN** a runway is drawn at airport-detail zoom
- **THEN** its ribbon width reflects the real runway width and its length-to-width proportion looks like a real runway across zoom levels

#### Scenario: Designators and selection
- **WHEN** runways are drawn
- **THEN** each end shows its designator as a rotated halo label, the assigned runway is indigo, and the others are neutral

### Requirement: Airport detail is revealed progressively by zoom

Airport detail SHALL be revealed in tiers as the user zooms in: the airport boundary shape first, then terminals and runways, then gates and parking. Below the first tier, no airport detail is shown. This applies both to the flight maps and to the airport map.

#### Scenario: Below the first tier
- **WHEN** the map is below the shape zoom threshold
- **THEN** no airport detail (shape, terminals, runways, gates, parking) is shown

#### Scenario: Shape tier
- **WHEN** the map is at or above the shape threshold but below the structure threshold
- **THEN** only the airport boundary shape is shown

#### Scenario: Structure tier
- **WHEN** the map is at or above the structure threshold but below the labels threshold
- **THEN** the airport shape, terminals, and runways are shown, but gates and parking are not

#### Scenario: Labels tier
- **WHEN** the map is at or above the labels threshold
- **THEN** the airport shape, terminals, runways, gates, and parking are all shown

### Requirement: The aircraft marker renders above all labels

The live aircraft marker SHALL always render above every other map label and marker (airport labels, terminals, gates, parking, runway designators), so it is never obscured.

#### Scenario: Aircraft on top
- **WHEN** the aircraft marker overlaps any label or marker
- **THEN** the aircraft marker is drawn on top

### Requirement: Live telemetry appears in the map top bar

On the tracking map, live telemetry (altitude, ground speed, track, vertical rate) SHALL appear as compact small-caps values centered in the map top bar, between the ADS-B status on the left and the map action buttons on the right. On widths too narrow to fit it, the telemetry SHALL be hidden, and the status and buttons SHALL NOT overlap.

#### Scenario: Telemetry in the top bar on wide maps
- **WHEN** the tracking map is wide enough and a live position is available
- **THEN** the telemetry shows centered in the top bar between the ADS-B status and the action buttons

#### Scenario: Telemetry hidden on narrow maps
- **WHEN** the map is too narrow to fit the telemetry
- **THEN** the telemetry is hidden and the ADS-B status and action buttons do not overlap

### Requirement: Leaflet tooltip class assignments are consistent

Ground-marker styling SHALL use CSS classes that match the element they style. Gate markers SHALL NOT reuse the terminal label class and parking markers SHALL NOT reuse the gate label class.

#### Scenario: Correct class per marker type
- **WHEN** gate and parking markers are styled
- **THEN** each uses a class named for its own element rather than a crossed class

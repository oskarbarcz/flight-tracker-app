import type { LatLngTuple } from "leaflet";
import ReactDOMServer from "react-dom/server";
import type { Airport } from "~/features/airport";
import type { FlightPathElement } from "~/features/flight";
import { AirportHaloLabel } from "~/features/flight/components/Map/Element/AirportHaloLabel";
import {
  AIRPORT_LABELS_ZOOM_THRESHOLD,
  AIRPORT_STRUCTURE_ZOOM_THRESHOLD,
  RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD,
  RUNWAY_DESIGNATOR_ZOOM_THRESHOLD,
  RUNWAY_ZOOM_THRESHOLD,
  TERMINAL_LABEL_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import {
  type GlobeAirportScene,
  globeZoom,
  runwayGeometry,
  terminalRing,
} from "~/features/flight/lib/globeAirportOverlay";
import { calculateLastBearing } from "~/features/flight/lib/smooth";
import type { Position } from "~/shared/models/geo";
import type { GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

function AircraftGlyph() {
  return (
    <div className="size-9 -translate-x-1/2 -translate-y-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="map-aircraft-icon size-9"
        role="img"
        aria-label="Aircraft"
      >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    </div>
  );
}

export function airportGlobeMarkers(airport: Airport, variant: "primary" | "diversion" = "primary"): GlobeMarker[] {
  const position: LatLngTuple = [airport.location.latitude, airport.location.longitude];
  const structure = globeZoom(AIRPORT_STRUCTURE_ZOOM_THRESHOLD);
  const runways = globeZoom(RUNWAY_ZOOM_THRESHOLD);
  const label = (expanded: boolean) =>
    ReactDOMServer.renderToString(<AirportHaloLabel airport={airport} variant={variant} expanded={expanded} />);

  return [
    { id: `airport-${variant}-${airport.id}-far`, position, html: label(false), maxZoom: structure, layer: 3 },
    {
      id: `airport-${variant}-${airport.id}-structure`,
      position,
      html: label(true),
      minZoom: structure,
      maxZoom: runways,
      layer: 3,
    },
    { id: `airport-${variant}-${airport.id}-near`, position, html: label(false), minZoom: runways, layer: 3 },
  ];
}

export function aircraftGlobeMarker(path: FlightPathElement[]): GlobeMarker | null {
  const lastPoint = path.at(-1);

  if (lastPoint === undefined) {
    return null;
  }

  const positions = path.map((point): Position => [point.latitude, point.longitude]);

  return {
    id: "aircraft",
    position: [lastPoint.latitude, lastPoint.longitude],
    html: ReactDOMServer.renderToString(<AircraftGlyph />),
    heading: lastPoint.track ?? calculateLastBearing(positions),
    layer: 10,
  };
}

function anchoredHtml(className: string, text: string): string {
  return ReactDOMServer.renderToString(
    <div className="map-runway-anchor">
      <span className={className}>{text}</span>
    </div>,
  );
}

function ringCentre(ring: LatLngTuple[]): LatLngTuple {
  const latitude = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
  const longitude = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;
  return [latitude, longitude];
}

export function airportLayoutGlobeMarkers(scenes: GlobeAirportScene[]): GlobeMarker[] {
  const markers: GlobeMarker[] = [];
  const runways = runwayGeometry(scenes);

  for (const scene of scenes) {
    for (const terminal of scene.terminals) {
      const ring = terminalRing(terminal);
      if (ring === null) continue;
      markers.push({
        id: `terminal-${terminal.id}`,
        position: ringCentre(ring),
        html: anchoredHtml("map-terminal-label", terminal.fullName),
        minZoom: globeZoom(TERMINAL_LABEL_ZOOM_THRESHOLD),
      });
    }

    for (const gate of scene.gates) {
      if (!gate.coordinates) continue;
      markers.push({
        id: `gate-${gate.id}`,
        position: [gate.coordinates.latitude, gate.coordinates.longitude],
        html: ReactDOMServer.renderToString(
          <span className="map-gate-chip">
            <span className="map-gate-chip__dot" />
            {gate.name}
          </span>,
        ),
        minZoom: globeZoom(AIRPORT_LABELS_ZOOM_THRESHOLD),
        layer: 1,
      });
    }

    for (const parkingPosition of scene.parkingPositions) {
      if (!parkingPosition.coordinates) continue;
      const assigned = scene.assignedParkingPositionId !== null;
      const filled = !assigned || parkingPosition.id === scene.assignedParkingPositionId;
      markers.push({
        id: `parking-${parkingPosition.id}`,
        position: [parkingPosition.coordinates.latitude, parkingPosition.coordinates.longitude],
        html: ReactDOMServer.renderToString(
          <span className="map-parking">
            <span className={`map-parking__dot map-parking__dot--${filled ? "filled" : "hollow"}`} />
            <span className="map-parking__label">{parkingPosition.name}</span>
          </span>,
        ),
        minZoom: globeZoom(AIRPORT_LABELS_ZOOM_THRESHOLD),
        layer: 1,
      });
    }
  }

  for (const { threshold, active, onActiveRunway, bearing } of runways.designators) {
    markers.push({
      id: `runway-${threshold.id}`,
      position: threshold.designatorPosition,
      html: anchoredHtml(`map-runway-plate${active ? " map-runway-plate--active" : ""}`, threshold.designator),
      heading: bearing,
      upright: true,
      minZoom: globeZoom(onActiveRunway ? RUNWAY_ZOOM_THRESHOLD : RUNWAY_DESIGNATOR_ZOOM_THRESHOLD),
      layer: 2,
    });
  }

  for (const approach of runways.approaches) {
    for (const label of approach.labels) {
      markers.push({
        id: `approach-${approach.key}-${label.key}`,
        position: label.position,
        html: anchoredHtml("map-approach-label", label.text),
        heading: approach.bearing,
        upright: true,
        minZoom: globeZoom(RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD),
      });
    }
  }

  return markers;
}

export function aircraftLabelGlobeMarker(path: FlightPathElement[], labelHtml: string): GlobeMarker | null {
  const lastPoint = path.at(-1);

  if (lastPoint === undefined) {
    return null;
  }

  return {
    id: "aircraft-label",
    position: [lastPoint.latitude, lastPoint.longitude],
    html: `<div class="map-aircraft-label map-aircraft-label--globe">${labelHtml}</div>`,
    layer: 10,
  };
}

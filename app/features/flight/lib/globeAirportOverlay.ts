import type { ThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport";
import {
  AIRPORT_SHAPE_ZOOM_THRESHOLD,
  AIRPORT_STRUCTURE_ZOOM_THRESHOLD,
  RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD,
  RUNWAY_APPROACH_ZOOM_THRESHOLD,
  RUNWAY_MARKINGS_ZOOM_THRESHOLD,
  RUNWAY_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import {
  type ApproachPath,
  computeApproachPath,
  computeRunwayPlate,
  type Ring,
  type RunwayThreshold,
  type Segment,
} from "~/features/runway/lib/runwayMarkings";
import { computeRunwayRibbons, initialBearing } from "~/features/runway/lib/runwayPairs";
import type { Terminal } from "~/features/terminal";
import { type GlobeOverlay, lineSource, polygonSource } from "~/shared/lib/globeStyle";
import { FLIGHT_COLOR, TERMINAL_COLOR } from "~/shared/lib/mapColors";
import { roundedLatLngPolygon } from "~/shared/lib/roundedPolygon";

export type GlobeAirportScene = {
  airport: Airport;
  runways: Runway[];
  assignedRunwayId: string | null;
  terminals: Terminal[];
  gates: Gate[];
  parkingPositions: ParkingPosition[];
  assignedParkingPositionId: string | null;
};

export type GlobeRunwayDesignator = {
  threshold: RunwayThreshold;
  active: boolean;
  onActiveRunway: boolean;
  bearing: number;
};

export type GlobeApproach = ApproachPath & { bearing: number };

type RunwayGeometry = {
  surfaces: { ring: LatLngTuple[]; active: boolean }[];
  centerlines: Segment[];
  markings: Ring[];
  bands: Ring[];
  approaches: GlobeApproach[];
  designators: GlobeRunwayDesignator[];
};

const APPROACH_DISTANCE_NM = 10;
const AIRPORT_CORNER_FRACTION = 0.03;
const TERMINAL_CORNER_FRACTION = 0.04;

export function globeZoom(leafletZoom: number): number {
  return leafletZoom - 1;
}

export function terminalRing(terminal: Terminal): LatLngTuple[] | null {
  if (!terminal.shape || terminal.shape.length < 3) return null;
  return roundedLatLngPolygon(terminal.shape, TERMINAL_CORNER_FRACTION);
}

export function runwayGeometry(scenes: GlobeAirportScene[]): RunwayGeometry {
  const geometry: RunwayGeometry = {
    surfaces: [],
    centerlines: [],
    markings: [],
    bands: [],
    approaches: [],
    designators: [],
  };

  for (const scene of scenes) {
    for (const ribbon of computeRunwayRibbons(scene.runways)) {
      const active = ribbon.ends.some((end) => end.id === scene.assignedRunwayId);
      const [head, tail] = ribbon.centerline;
      const bearing = initialBearing(head[0], head[1], tail[0], tail[1]);
      const plate = computeRunwayPlate(ribbon);

      geometry.surfaces.push({ ring: ribbon.polygon, active });
      geometry.markings.push(...plate.markings);
      geometry.bands.push(...plate.thresholdBands);
      if (plate.paintedCenterline) geometry.centerlines.push(plate.paintedCenterline);

      for (const threshold of plate.thresholds) {
        geometry.designators.push({
          threshold,
          active: threshold.id === scene.assignedRunwayId,
          onActiveRunway: active,
          bearing,
        });
      }

      if (active) {
        for (const threshold of plate.thresholds) {
          geometry.approaches.push({ ...computeApproachPath(threshold, APPROACH_DISTANCE_NM), bearing });
        }
      }
    }
  }

  return geometry;
}

export function globeAirportOverlay(scenes: GlobeAirportScene[], mode: ThemeMode): GlobeOverlay {
  const dark = mode === "dark";
  const runways = runwayGeometry(scenes);
  const paintColor = dark ? "#0f172a" : "#f8fafc";
  const approachColor = dark ? "#a5b4fc" : "#4338ca";

  const shapes = scenes
    .filter(({ airport }) => airport.shape && airport.shape.length >= 3)
    .map(({ airport }) => ({ ring: roundedLatLngPolygon(airport.shape ?? [], AIRPORT_CORNER_FRACTION) }));
  const terminals = scenes.flatMap(({ terminals }) =>
    terminals.map(terminalRing).flatMap((ring) => (ring === null ? [] : [{ ring }])),
  );

  return {
    sources: {
      "airport-shapes": polygonSource(shapes),
      "airport-terminals": polygonSource(terminals),
      "airport-approaches": lineSource(runways.approaches.map(({ centerline }) => ({ path: centerline }))),
      "airport-approach-ticks": lineSource(
        runways.approaches.flatMap(({ ticks }) => ticks.map((tick) => ({ path: tick }))),
      ),
      "airport-runways": polygonSource(runways.surfaces.map(({ ring, active }) => ({ ring, properties: { active } }))),
      "airport-runway-markings": polygonSource(runways.markings.map((ring) => ({ ring }))),
      "airport-runway-bands": polygonSource(runways.bands.map((ring) => ({ ring }))),
      "airport-runway-centerlines": lineSource(runways.centerlines.map((segment) => ({ path: segment }))),
    },
    layers: [
      {
        id: "airport-shapes-fill",
        type: "fill",
        source: "airport-shapes",
        minzoom: globeZoom(AIRPORT_SHAPE_ZOOM_THRESHOLD),
        paint: { "fill-color": FLIGHT_COLOR, "fill-opacity": dark ? 0.12 : 0.07 },
      },
      {
        id: "airport-shapes-outline",
        type: "line",
        source: "airport-shapes",
        minzoom: globeZoom(AIRPORT_SHAPE_ZOOM_THRESHOLD),
        layout: { "line-join": "round" },
        paint: { "line-color": FLIGHT_COLOR, "line-width": 1.5 },
      },
      {
        id: "airport-terminals-fill",
        type: "fill",
        source: "airport-terminals",
        minzoom: globeZoom(AIRPORT_STRUCTURE_ZOOM_THRESHOLD),
        paint: { "fill-color": TERMINAL_COLOR, "fill-opacity": dark ? 0.2 : 0.12 },
      },
      {
        id: "airport-terminals-outline",
        type: "line",
        source: "airport-terminals",
        minzoom: globeZoom(AIRPORT_STRUCTURE_ZOOM_THRESHOLD),
        layout: { "line-join": "round" },
        paint: { "line-color": TERMINAL_COLOR, "line-width": 1.25 },
      },
      {
        id: "airport-approaches",
        type: "line",
        source: "airport-approaches",
        minzoom: globeZoom(RUNWAY_APPROACH_ZOOM_THRESHOLD),
        layout: { "line-cap": "round" },
        paint: {
          "line-color": approachColor,
          "line-width": 3.25,
          "line-opacity": 0.9,
          "line-dasharray": [0.15, 3.1],
        },
      },
      {
        id: "airport-approach-ticks",
        type: "line",
        source: "airport-approach-ticks",
        minzoom: globeZoom(RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD),
        paint: { "line-color": approachColor, "line-width": 1.5, "line-opacity": dark ? 0.65 : 0.6 },
      },
      {
        id: "airport-runway-casing",
        type: "line",
        source: "airport-runways",
        minzoom: globeZoom(RUNWAY_ZOOM_THRESHOLD),
        layout: { "line-join": "round" },
        paint: { "line-color": "#0f172a", "line-width": 3, "line-opacity": 0.4 },
      },
      {
        id: "airport-runway-surface",
        type: "fill",
        source: "airport-runways",
        minzoom: globeZoom(RUNWAY_ZOOM_THRESHOLD),
        paint: {
          "fill-color": ["case", ["get", "active"], dark ? "#818cf8" : "#4338ca", dark ? "#94a3b8" : "#64748b"],
          "fill-opacity": ["case", ["get", "active"], 0.95, dark ? 0.6 : 0.88],
        },
      },
      {
        id: "airport-runway-markings",
        type: "fill",
        source: "airport-runway-markings",
        minzoom: globeZoom(RUNWAY_MARKINGS_ZOOM_THRESHOLD),
        paint: { "fill-color": paintColor, "fill-opacity": dark ? 0.6 : 0.9 },
      },
      {
        id: "airport-runway-bands",
        type: "fill",
        source: "airport-runway-bands",
        minzoom: globeZoom(RUNWAY_MARKINGS_ZOOM_THRESHOLD),
        paint: { "fill-color": paintColor, "fill-opacity": dark ? 0.3 : 0.45 },
      },
      {
        id: "airport-runway-centerlines",
        type: "line",
        source: "airport-runway-centerlines",
        minzoom: globeZoom(RUNWAY_MARKINGS_ZOOM_THRESHOLD),
        paint: {
          "line-color": paintColor,
          "line-width": 1.25,
          "line-opacity": dark ? 0.55 : 0.85,
          "line-dasharray": [6.8, 4.5],
        },
      },
    ],
  };
}

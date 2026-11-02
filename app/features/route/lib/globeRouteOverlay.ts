import type { ThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport/model";
import { etopsPointColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { etopsRingSpecs } from "~/features/route/lib/etopsRings";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import { flownTrack, routeLine, trackLine } from "~/features/route/lib/routeGeometry";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing, EtopsPoint } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { type GlobeOverlay, lineSource, pointSource } from "~/shared/lib/globeStyle";
import { destinationPoint, geodesicCircle } from "~/shared/lib/greatCircle";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

export type GlobeRouteScene = {
  route: LatLngTuple[];
  track: LatLngTuple[];
  ruleRings: LatLngTuple[][];
  thresholdRings: LatLngTuple[][];
  fixes: { ordinal: number; ident: string; position: LatLngTuple }[];
  ringTitles: { key: string; position: LatLngTuple; title: string }[];
  etopsPoints: EtopsPoint[];
  selected: LatLngTuple | null;
};

type SceneInput = {
  briefing: EtopsBriefing;
  airports: Map<string, Airport>;
  insights: FixInsight[];
  runways: AssignedRunways;
  selectedOrdinal: number | null;
};

export const FIX_LAYER = "briefing-fixes";
export const FIX_TARGET_LAYER = "briefing-fix-targets";

const EARTH_RADIUS_METRES = 6_371_000;

function angularRadius(radiusNm: number): number {
  return nauticalMilesToMetres(radiusNm) / EARTH_RADIUS_METRES;
}

function rings(centres: LatLngTuple[], radiusNm: number | null | undefined): LatLngTuple[][] {
  if (radiusNm === null || radiusNm === undefined) {
    return [];
  }

  return centres.map((centre) => geodesicCircle(centre, angularRadius(radiusNm)));
}

export function globeRouteScene({
  briefing,
  airports,
  insights,
  runways,
  selectedOrdinal,
}: SceneInput): GlobeRouteScene {
  const plan = briefing.etops;
  const ringAirports = (plan?.airports ?? [])
    .map((entry) => airports.get(entry.airportId))
    .filter((airport): airport is Airport => airport !== undefined);
  const ringCentres = ringAirports.map(
    (airport): LatLngTuple => [airport.location.latitude, airport.location.longitude],
  );
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;

  return {
    route: routeLine(briefing, runways),
    track: trackLine(flownTrack(briefing)),
    ruleRings: rings(ringCentres, plan?.ruleRadiusNm),
    thresholdRings: rings(ringCentres, plan?.thresholdRadiusNm),
    fixes: insights.map(({ fix }) => ({
      ordinal: fix.ordinal,
      ident: fix.ident,
      position: [fix.latitude, fix.longitude],
    })),
    ringTitles: ringAirports.flatMap((airport) =>
      etopsRingSpecs(plan).map((spec) => ({
        key: `${airport.id}-${spec.kind}`,
        position: destinationPoint(
          [airport.location.latitude, airport.location.longitude],
          0,
          angularRadius(spec.radiusNm),
        ),
        title: `${spec.title} (${airport.icaoCode})`,
      })),
    ),
    etopsPoints: plan?.points ?? [],
    selected: selected === null ? null : [selected.fix.latitude, selected.fix.longitude],
  };
}

export function globeRouteFrame(scene: GlobeRouteScene): LatLngTuple[] {
  return [
    ...scene.route,
    ...scene.etopsPoints.map((point): LatLngTuple => [point.position.latitude, point.position.longitude]),
  ];
}

export function globeRouteOverlay(scene: GlobeRouteScene, mode: ThemeMode, emphasis = 1): GlobeOverlay {
  const pointColor = etopsPointColor(mode);
  const markerFill = fixMarkerFill(mode);

  return {
    sources: {
      "briefing-route": lineSource([{ path: scene.route }]),
      "briefing-track": lineSource([{ path: scene.track }]),
      "briefing-fixes": pointSource(
        scene.fixes.map(({ ordinal, position }) => ({ position, properties: { ordinal } })),
      ),
      "briefing-etops-points": pointSource(
        scene.etopsPoints.map((point) => ({
          position: [point.position.latitude, point.position.longitude],
          properties: { critical: point.isCritical },
        })),
      ),
      "briefing-selected-fix": pointSource(scene.selected === null ? [] : [{ position: scene.selected }]),
    },
    layers: [
      {
        id: "briefing-track",
        type: "line",
        source: "briefing-track",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": RUNWAY_COLOR,
          "line-width": 2.5,
          "line-opacity": 0.85 * emphasis,
          "line-dasharray": [0.8, 3.2],
        },
      },
      {
        id: "briefing-route",
        type: "line",
        source: "briefing-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": FLIGHT_COLOR, "line-width": 2.5, "line-opacity": 0.9 * emphasis },
      },
      {
        id: FIX_LAYER,
        type: "circle",
        source: "briefing-fixes",
        paint: {
          "circle-radius": 2.5,
          "circle-color": markerFill,
          "circle-opacity": emphasis,
          "circle-stroke-color": RUNWAY_COLOR,
          "circle-stroke-width": 1,
          "circle-stroke-opacity": emphasis,
        },
      },
      {
        id: FIX_TARGET_LAYER,
        type: "circle",
        source: "briefing-fixes",
        paint: { "circle-radius": 9, "circle-opacity": 0 },
      },
      {
        id: "briefing-etops-points",
        type: "circle",
        source: "briefing-etops-points",
        paint: {
          "circle-radius": ["case", ["get", "critical"], 3.5, 3],
          "circle-color": ["case", ["get", "critical"], pointColor, markerFill],
          "circle-opacity": emphasis,
          "circle-stroke-color": pointColor,
          "circle-stroke-width": 1.25,
          "circle-stroke-opacity": emphasis,
        },
      },
      {
        id: "briefing-selected-fix",
        type: "circle",
        source: "briefing-selected-fix",
        paint: {
          "circle-radius": 6,
          "circle-color": FLIGHT_COLOR,
          "circle-opacity": emphasis,
          "circle-stroke-color": markerFill,
          "circle-stroke-width": 2,
          "circle-stroke-opacity": emphasis,
        },
      },
    ],
  };
}

export function globeEtopsRingsOverlay(scene: GlobeRouteScene, emphasis = 1): GlobeOverlay {
  return {
    sources: {
      "briefing-rule-rings": lineSource(scene.ruleRings.map((path) => ({ path }))),
      "briefing-threshold-rings": lineSource(scene.thresholdRings.map((path) => ({ path }))),
    },
    layers: [
      {
        id: "briefing-rule-rings",
        type: "line",
        source: "briefing-rule-rings",
        paint: { "line-color": RUNWAY_COLOR, "line-width": 1, "line-opacity": 0.5 * emphasis },
      },
      {
        id: "briefing-threshold-rings",
        type: "line",
        source: "briefing-threshold-rings",
        paint: {
          "line-color": RUNWAY_COLOR,
          "line-width": 1,
          "line-opacity": 0.35 * emphasis,
          "line-dasharray": [3, 5],
        },
      },
    ],
  };
}

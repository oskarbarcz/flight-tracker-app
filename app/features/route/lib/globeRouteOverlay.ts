import type { ThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport/model";
import { etopsColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { type EtopsRing, etopsRings } from "~/features/route/lib/etopsRings";
import { type RouteFixMark, routeFixMarks } from "~/features/route/lib/routeFixMarks";
import { flownTrack, routeLine, trackLine } from "~/features/route/lib/routeGeometry";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { type GlobeOverlay, lineSource, pointSource } from "~/shared/lib/globeStyle";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

export type GlobeRouteScene = {
  route: LatLngTuple[];
  track: LatLngTuple[];
  rings: EtopsRing[];
  fixes: RouteFixMark[];
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

export function globeRouteScene({
  briefing,
  airports,
  insights,
  runways,
  selectedOrdinal,
}: SceneInput): GlobeRouteScene {
  const plan = briefing.etops;
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;

  return {
    route: routeLine(briefing, runways),
    track: trackLine(flownTrack(briefing)),
    rings: etopsRings(plan, airports),
    fixes: routeFixMarks(insights, plan?.points ?? []),
    selected: selected === null ? null : [selected.fix.latitude, selected.fix.longitude],
  };
}

export function globeRouteFrame(scene: GlobeRouteScene): LatLngTuple[] {
  return [...scene.route, ...scene.fixes.map((fix) => fix.position)];
}

function fixProperties({ key, ordinal }: RouteFixMark): Record<string, string | number> {
  return ordinal === null ? { key } : { key, ordinal };
}

export function globeRouteOverlay(scene: GlobeRouteScene, mode: ThemeMode, emphasis = 1): GlobeOverlay {
  const markerFill = fixMarkerFill(mode);

  return {
    sources: {
      "briefing-route": lineSource([{ path: scene.route }]),
      "briefing-track": lineSource([{ path: scene.track }]),
      "briefing-fixes": pointSource(
        scene.fixes.map((fix) => ({ position: fix.position, properties: fixProperties(fix) })),
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

export function globeEtopsRingsOverlay(scene: GlobeRouteScene, mode: ThemeMode, emphasis = 1): GlobeOverlay {
  const color = etopsColor(mode);
  const ringsOf = (kind: EtopsRing["kind"]) =>
    scene.rings.filter((ring) => ring.kind === kind).map((ring) => ({ path: ring.path }));

  return {
    sources: {
      "briefing-rule-rings": lineSource(ringsOf("rule")),
      "briefing-threshold-rings": lineSource(ringsOf("threshold")),
    },
    layers: [
      {
        id: "briefing-rule-rings",
        type: "line",
        source: "briefing-rule-rings",
        paint: { "line-color": color, "line-width": 1, "line-opacity": 0.5 * emphasis },
      },
      {
        id: "briefing-threshold-rings",
        type: "line",
        source: "briefing-threshold-rings",
        paint: { "line-color": color, "line-width": 1, "line-opacity": 0.35 * emphasis, "line-dasharray": [3, 5] },
      },
    ],
  };
}

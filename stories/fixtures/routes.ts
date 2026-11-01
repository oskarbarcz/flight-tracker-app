import { fn } from "storybook/test";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { buildFixInsights } from "~/features/route/lib/routeInsights";
import { type EtopsBriefing, OceanicDirection, OceanicRouting, type PlannedRouteFix } from "~/features/route/model";

type Waypoint = { ident: string; latitude: number; longitude: number };

const POLAR_WAYPOINTS: Waypoint[] = [
  { ident: "KJFK", latitude: 40.64, longitude: -73.78 },
  { ident: "YVP", latitude: 58.1, longitude: -68.4 },
  { ident: "YRB", latitude: 74.72, longitude: -94.97 },
  { ident: "N8012W", latitude: 80, longitude: -120 },
  { ident: "N8317W", latitude: 83, longitude: -170 },
  { ident: "N8016E", latitude: 80, longitude: 160 },
  { ident: "YKS", latitude: 62.09, longitude: 129.77 },
  { ident: "HLD", latitude: 49.2, longitude: 119.82 },
  { ident: "VHHH", latitude: 22.31, longitude: 113.91 },
];

function plannedFix({ ident, latitude, longitude }: Waypoint, index: number): PlannedRouteFix {
  return {
    ordinal: index + 1,
    ident,
    latitude,
    longitude,
    altitude: 36_000,
    elapsedSeconds: index * 3_600,
    distanceNm: index === 0 ? null : 500,
    trackTrue: null,
    trackMag: null,
    viaAirway: null,
    stage: "CRZ",
    fuel: { flow: null, leg: null, used: null, minimumOnBoard: null, plannedOnBoard: null },
    oat: null,
    isaDeviation: null,
    tropopause: null,
    mora: null,
    fir: null,
    wind: { direction: null, speed: null, levels: [] },
  };
}

export const polarBriefing: EtopsBriefing = {
  etops: null,
  route: {
    route: POLAR_WAYPOINTS.map((waypoint) => waypoint.ident).join(" "),
    atcRoute: null,
    fixes: POLAR_WAYPOINTS.map(plannedFix),
  },
  oceanicCrossing: {
    routing: OceanicRouting.Track,
    trackId: "P",
    direction: OceanicDirection.West,
    tracks: [
      {
        identifier: "P",
        direction: OceanicDirection.West,
        tmi: "001",
        issuingOca: null,
        route: null,
        levels: [],
        validFrom: null,
        validTo: null,
        fixes: POLAR_WAYPOINTS.slice(2, 7).map(({ ident, latitude, longitude }) => ({
          ident,
          latitude: latitude - 3,
          longitude,
        })),
      },
    ],
  },
};

export function routeBriefingState(briefing: EtopsBriefing): RouteBriefingState {
  return {
    briefing,
    airports: new Map(),
    loading: false,
    error: null,
    runways: { departure: null, arrival: null },
    insights: buildFixInsights(briefing.route.fixes),
    summary: null,
    margin: null,
    selectedOrdinal: null,
    select: fn(),
  };
}

import type { Coordinates } from "~/shared/models/coordinates";

export type PlannedRouteWindLevel = {
  altitude: number;
  direction: number;
  speed: number;
  oat: number;
};

export type PlannedRouteWind = {
  direction: number | null;
  speed: number | null;
  levels: PlannedRouteWindLevel[];
};

export type PlannedRouteFuel = {
  flow: number | null;
  leg: number | null;
  used: number | null;
  minimumOnBoard: number | null;
  plannedOnBoard: number | null;
};

export type PlannedRouteFix = {
  ordinal: number;
  ident: string;
  latitude: number;
  longitude: number;
  altitude: number;
  elapsedSeconds: number;
  distanceNm: number | null;
  trackTrue: number | null;
  trackMag: number | null;
  viaAirway: string | null;
  stage: string;
  fuel: PlannedRouteFuel;
  oat: number | null;
  isaDeviation: number | null;
  tropopause: number | null;
  mora: number | null;
  fir: string | null;
  wind: PlannedRouteWind;
};

export type PlannedRoute = {
  route: string | null;
  atcRoute: string | null;
  fixes: PlannedRouteFix[];
};

export enum EtopsPointKind {
  Entry = "entry",
  Exit = "exit",
  EqualTime = "equal_time",
  Critical = "critical",
}

export type EtopsDiversionAirport = {
  airportId: string;
  ordinal: number;
};

export type EtopsPoint = {
  kind: EtopsPointKind;
  ordinal: number;
  isCritical: boolean;
  adequateAirportId: string | null;
  position: Coordinates;
  elapsedSeconds: number;
  condition: string | null;
  diversionAirports: EtopsDiversionAirport[];
};

export type EtopsAirport = {
  airportId: string;
  suitabilityStart: string;
  suitabilityEnd: string;
  plannedRunway: string | null;
  forecastCeiling: number | null;
  forecastVisibility: number | null;
  transitionAltitude: number | null;
  transitionLevel: number | null;
};

export type EtopsPlan = {
  ruleMinutes: number | null;
  ruleRadiusNm: number | null;
  thresholdMinutes: number | null;
  thresholdRadiusNm: number | null;
  points: EtopsPoint[];
  airports: EtopsAirport[];
};

export enum OceanicRouting {
  Track = "track",
  TrackGeometry = "track_geometry",
  Random = "random",
}

export enum OceanicDirection {
  East = "east",
  West = "west",
}

export type OceanicTrackFix = {
  ident: string;
  latitude: number;
  longitude: number;
};

export type OceanicTrack = {
  identifier: string;
  direction: OceanicDirection;
  tmi: string;
  issuingOca: string | null;
  route: string | null;
  levels: number[];
  validFrom: string | null;
  validTo: string | null;
  fixes: OceanicTrackFix[];
};

export type OceanicCrossing = {
  routing: OceanicRouting;
  trackId: string | null;
  direction: OceanicDirection | null;
  tracks: OceanicTrack[];
};

export type EtopsBriefing = {
  etops: EtopsPlan | null;
  route: PlannedRoute;
  oceanicCrossing: OceanicCrossing;
};

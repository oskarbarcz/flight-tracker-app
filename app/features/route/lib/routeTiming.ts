import { cruiseFixes } from "~/features/route/lib/routeStages";
import type { PlannedRoute } from "~/features/route/model";

export type TimingMilestone = {
  at: Date;
  offsetSeconds: number;
};

export type FlightTiming = {
  takeoff: Date;
  topOfClimb: TimingMilestone | null;
  cruiseSeconds: number | null;
  topOfDescent: TimingMilestone | null;
};

function elapsedFrom(takeoff: Date, seconds: number): Date {
  return new Date(takeoff.getTime() + seconds * 1000);
}

export function summariseTiming(route: PlannedRoute, takeoff: Date): FlightTiming {
  const cruise = cruiseFixes(route.fixes);
  const entry = cruise.at(0) ?? null;
  const exit = cruise.at(-1) ?? null;
  const landingSeconds = route.fixes.at(-1)?.elapsedSeconds ?? null;

  return {
    takeoff,
    topOfClimb:
      entry === null ? null : { at: elapsedFrom(takeoff, entry.elapsedSeconds), offsetSeconds: entry.elapsedSeconds },
    cruiseSeconds: entry === null || exit === null ? null : exit.elapsedSeconds - entry.elapsedSeconds,
    topOfDescent:
      exit === null || landingSeconds === null
        ? null
        : { at: elapsedFrom(takeoff, exit.elapsedSeconds), offsetSeconds: landingSeconds - exit.elapsedSeconds },
  };
}

import type { FlightDataDisplay } from "~/app-state/useMapSettings";
import type { EtopsBriefing } from "~/features/route/model";

export const DIMMED_OPACITY = 0.5;

export function emphasisOf(display: FlightDataDisplay): number {
  return display === "dim" ? DIMMED_OPACITY : 1;
}

export function hasFiledWaypoints(briefing: EtopsBriefing | null | undefined): boolean {
  return (briefing?.route.fixes.length ?? 0) > 0;
}

export function hasEtopsRings(briefing: EtopsBriefing | null | undefined): boolean {
  const plan = briefing?.etops;

  if (!plan || plan.airports.length === 0) {
    return false;
  }

  return plan.ruleRadiusNm !== null || plan.thresholdRadiusNm !== null;
}

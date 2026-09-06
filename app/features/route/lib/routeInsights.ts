import { cruiseFixes } from "~/features/route/lib/routeStages";
import type { EtopsPlan, PlannedRoute, PlannedRouteFix } from "~/features/route/model";

export type FixInsight = {
  fix: PlannedRouteFix;
  cumulativeDistanceNm: number | null;
  fuelMarginKg: number | null;
};

export type RouteSummary = {
  totalDistanceNm: number | null;
  totalElapsedSeconds: number | null;
  tripFuelKg: number | null;
  cruiseLevelsFeet: number[];
};

export function buildFixInsights(fixes: PlannedRouteFix[]): FixInsight[] {
  let cumulativeDistanceNm: number | null = 0;

  return fixes.map((fix) => {
    cumulativeDistanceNm =
      cumulativeDistanceNm === null || fix.distanceNm === null ? null : cumulativeDistanceNm + fix.distanceNm;

    const { plannedOnBoard, minimumOnBoard } = fix.fuel;

    return {
      fix,
      cumulativeDistanceNm,
      fuelMarginKg: plannedOnBoard === null || minimumOnBoard === null ? null : plannedOnBoard - minimumOnBoard,
    };
  });
}

const DISPLAYED_KILOGRAM_PRECISION = 10;

export type FuelMarginSummary = {
  tightest: FixInsight;
  isConstant: boolean;
};

export function summariseFuelMargin(insights: FixInsight[]): FuelMarginSummary | null {
  const measured = insights.filter(
    (insight): insight is FixInsight & { fuelMarginKg: number } => insight.fuelMarginKg !== null,
  );

  if (measured.length === 0) {
    return null;
  }

  const margins = measured.map((insight) => insight.fuelMarginKg);
  const tightest = measured.reduce((lowest, insight) =>
    insight.fuelMarginKg < lowest.fuelMarginKg ? insight : lowest,
  );

  return {
    tightest,
    isConstant: Math.max(...margins) - Math.min(...margins) < DISPLAYED_KILOGRAM_PRECISION,
  };
}

function cruiseLevelsFeet(fixes: PlannedRouteFix[]): number[] {
  const cruising = cruiseFixes(fixes);

  if (cruising.length === 0) {
    return fixes.length === 0 ? [] : [Math.max(...fixes.map((fix) => fix.altitude))];
  }

  return [...new Set(cruising.map((fix) => fix.altitude))];
}

export function summariseRoute(route: PlannedRoute): RouteSummary {
  const insights = buildFixInsights(route.fixes);
  const last = insights.at(-1) ?? null;
  const burns = route.fixes.map((fix) => fix.fuel.used).filter((used): used is number => used !== null);

  return {
    totalDistanceNm: last?.cumulativeDistanceNm ?? null,
    totalElapsedSeconds: last?.fix.elapsedSeconds ?? null,
    tripFuelKg: burns.length === 0 ? null : Math.max(...burns),
    cruiseLevelsFeet: cruiseLevelsFeet(route.fixes),
  };
}

export function hasEtopsContent(plan: EtopsPlan): boolean {
  return (
    plan.points.length > 0 || plan.airports.length > 0 || plan.ruleMinutes !== null || plan.thresholdMinutes !== null
  );
}

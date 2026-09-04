import type { EtopsPlan, PlannedRoute, PlannedRouteFix } from "~/features/route/model";

export type FixInsight = {
  fix: PlannedRouteFix;
  cumulativeDistanceNm: number | null;
  fuelMarginKg: number | null;
};

export type RouteSummary = {
  fixCount: number;
  totalDistanceNm: number | null;
  totalElapsedSeconds: number | null;
  totalBurnKg: number | null;
  topAltitudeFeet: number | null;
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

export function summariseRoute(route: PlannedRoute): RouteSummary {
  const insights = buildFixInsights(route.fixes);
  const last = insights.at(-1) ?? null;
  const burns = route.fixes.map((fix) => fix.fuel.used).filter((used): used is number => used !== null);

  return {
    fixCount: route.fixes.length,
    totalDistanceNm: last?.cumulativeDistanceNm ?? null,
    totalElapsedSeconds: last?.fix.elapsedSeconds ?? null,
    totalBurnKg: burns.length === 0 ? null : Math.max(...burns),
    topAltitudeFeet: route.fixes.length === 0 ? null : Math.max(...route.fixes.map((fix) => fix.altitude)),
  };
}

export function hasEtopsContent(plan: EtopsPlan): boolean {
  return (
    plan.points.length > 0 || plan.airports.length > 0 || plan.ruleMinutes !== null || plan.thresholdMinutes !== null
  );
}

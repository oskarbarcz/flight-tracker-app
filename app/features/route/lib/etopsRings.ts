import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport/model";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import type { EtopsPlan } from "~/features/route/model";
import { destinationPoint, geodesicCircle } from "~/shared/lib/greatCircle";

export type EtopsRingSpec = {
  kind: "rule" | "threshold";
  radiusNm: number;
  title: string;
};

function ringTitle(minutes: number | null, radiusNm: number): string {
  return minutes === null ? `${Math.round(radiusNm)} nm` : `${minutes} min`;
}

export function etopsRingSpecs(plan: EtopsPlan | null): EtopsRingSpec[] {
  if (plan === null) return [];

  const specs: EtopsRingSpec[] = [];

  if (plan.ruleRadiusNm !== null) {
    specs.push({ kind: "rule", radiusNm: plan.ruleRadiusNm, title: ringTitle(plan.ruleMinutes, plan.ruleRadiusNm) });
  }
  if (plan.thresholdRadiusNm !== null) {
    specs.push({
      kind: "threshold",
      radiusNm: plan.thresholdRadiusNm,
      title: ringTitle(plan.thresholdMinutes, plan.thresholdRadiusNm),
    });
  }

  return specs;
}

export type EtopsRing = {
  key: string;
  kind: EtopsRingSpec["kind"];
  path: LatLngTuple[];
  title: string;
  titlePosition: LatLngTuple;
};

const EARTH_RADIUS_METRES = 6_371_000;

function angularRadius(radiusNm: number): number {
  return nauticalMilesToMetres(radiusNm) / EARTH_RADIUS_METRES;
}

export function etopsRings(plan: EtopsPlan | null, airports: Map<string, Airport>): EtopsRing[] {
  const specs = etopsRingSpecs(plan);
  const centres = (plan?.airports ?? [])
    .map((entry) => airports.get(entry.airportId))
    .filter((airport): airport is Airport => airport !== undefined);

  return centres.flatMap((airport) => {
    const centre: LatLngTuple = [airport.location.latitude, airport.location.longitude];

    return specs.map((spec) => ({
      key: `${airport.id}-${spec.kind}`,
      kind: spec.kind,
      path: geodesicCircle(centre, angularRadius(spec.radiusNm)),
      title: `${spec.title} (${airport.icaoCode})`,
      titlePosition: destinationPoint(centre, 0, angularRadius(spec.radiusNm)),
    }));
  });
}

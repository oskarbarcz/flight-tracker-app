import type { EtopsPlan } from "~/features/route/model";

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

import type { NotocSpecialLoad } from "~/features/notoc/model";

export enum SpecialLoadRisk {
  High = "high",
  Elevated = "elevated",
  Routine = "routine",
}

const RISK_BY_CODE: Record<string, SpecialLoadRisk> = {
  RFL: SpecialLoadRisk.High,
  RLI: SpecialLoadRisk.High,
  ICE: SpecialLoadRisk.High,
  CAO: SpecialLoadRisk.High,
  AVI: SpecialLoadRisk.Elevated,
  AVIH: SpecialLoadRisk.Elevated,
  HEA: SpecialLoadRisk.Elevated,
  BIG: SpecialLoadRisk.Elevated,
  HUM: SpecialLoadRisk.Elevated,
};

const RANK: Record<SpecialLoadRisk, number> = {
  [SpecialLoadRisk.High]: 0,
  [SpecialLoadRisk.Elevated]: 1,
  [SpecialLoadRisk.Routine]: 2,
};

export function riskOf(load: NotocSpecialLoad): SpecialLoadRisk {
  return load.shc.reduce<SpecialLoadRisk>((worst, code) => {
    const risk = RISK_BY_CODE[code] ?? SpecialLoadRisk.Routine;
    return RANK[risk] < RANK[worst] ? risk : worst;
  }, SpecialLoadRisk.Routine);
}

export function byRisk(loads: NotocSpecialLoad[]): NotocSpecialLoad[] {
  return [...loads].sort((left, right) => RANK[riskOf(left)] - RANK[riskOf(right)]);
}

export function imposesRisk(load: NotocSpecialLoad): boolean {
  return riskOf(load) !== SpecialLoadRisk.Routine;
}

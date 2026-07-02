import { type CruiseSpeed, PerformanceCode, SpeedUnit, type WeightCategory } from "~/models";

export function formatCruiseSpeed({ value, unit }: CruiseSpeed): string {
  return unit === SpeedUnit.Mach ? `Mach ${value}` : `${value} kt`;
}

export function formatServiceCeiling(feet: number): string {
  return `${feet.toLocaleString()} ft`;
}

export function formatWeightCategory(category: WeightCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

const approachSpeedBracket: Record<PerformanceCode, string> = {
  [PerformanceCode.A]: "< 91 kt",
  [PerformanceCode.B]: "91–120 kt",
  [PerformanceCode.C]: "121–140 kt",
  [PerformanceCode.D]: "141–165 kt",
  [PerformanceCode.E]: "166–210 kt",
};

export function formatPerformanceCode(code: PerformanceCode): string {
  return `${code} (${approachSpeedBracket[code]})`;
}

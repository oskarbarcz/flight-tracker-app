import { type CruiseSpeed, SpeedUnit, type WeightCategory } from "~/models";

export function formatCruiseSpeed({ value, unit }: CruiseSpeed): string {
  return unit === SpeedUnit.Mach ? `Mach ${value}` : `${value} kt`;
}

export function formatServiceCeiling(feet: number): string {
  return `${feet.toLocaleString()} ft`;
}

export function formatWeightCategory(category: WeightCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

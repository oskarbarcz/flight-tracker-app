import { HazardClass } from "~/features/cargo-manifest/model";

export type HazardMark = {
  ground: string;
  ink: string;
  lowerGround: string | null;
  symbol: string;
};

const MARKS: Record<HazardClass, HazardMark> = {
  [HazardClass.Explosives]: { ground: "#F5A623", ink: "#000000", lowerGround: null, symbol: "✸" },
  [HazardClass.FlammableGas]: { ground: "#D0021B", ink: "#FFFFFF", lowerGround: null, symbol: "🔥" },
  [HazardClass.NonFlammableGas]: { ground: "#2E7D32", ink: "#FFFFFF", lowerGround: null, symbol: "⬤" },
  [HazardClass.ToxicGas]: { ground: "#FFFFFF", ink: "#000000", lowerGround: null, symbol: "☠" },
  [HazardClass.FlammableLiquid]: { ground: "#D0021B", ink: "#FFFFFF", lowerGround: null, symbol: "🔥" },
  [HazardClass.FlammableSolid]: { ground: "#FFFFFF", ink: "#000000", lowerGround: null, symbol: "🔥" },
  [HazardClass.SpontaneouslyCombustible]: { ground: "#FFFFFF", ink: "#000000", lowerGround: "#D0021B", symbol: "🔥" },
  [HazardClass.DangerousWhenWet]: { ground: "#1565C0", ink: "#FFFFFF", lowerGround: null, symbol: "🔥" },
  [HazardClass.Oxidiser]: { ground: "#F8E71C", ink: "#000000", lowerGround: null, symbol: "◎" },
  [HazardClass.OrganicPeroxide]: { ground: "#D0021B", ink: "#000000", lowerGround: "#F8E71C", symbol: "◎" },
  [HazardClass.ToxicSubstance]: { ground: "#FFFFFF", ink: "#000000", lowerGround: null, symbol: "☠" },
  [HazardClass.InfectiousSubstance]: { ground: "#FFFFFF", ink: "#000000", lowerGround: null, symbol: "☣" },
  [HazardClass.Radioactive]: { ground: "#F8E71C", ink: "#000000", lowerGround: "#FFFFFF", symbol: "☢" },
  [HazardClass.Corrosive]: { ground: "#FFFFFF", ink: "#000000", lowerGround: "#000000", symbol: "⌁" },
  [HazardClass.Miscellaneous]: { ground: "#FFFFFF", ink: "#000000", lowerGround: null, symbol: "≡" },
};

export function hazardMark(hazardClass: HazardClass): HazardMark {
  return MARKS[hazardClass];
}

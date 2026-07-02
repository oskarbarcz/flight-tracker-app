import { Alliance } from "~/features/operator";

const ALLIANCE_DOT: Record<Alliance, string> = {
  [Alliance.StarAlliance]: "bg-amber-500",
  [Alliance.SkyTeam]: "bg-blue-600",
  [Alliance.Oneworld]: "bg-teal-600",
  [Alliance.VanillaAlliance]: "bg-purple-500",
};

export function allianceDot(alliance: Alliance | null | undefined): string {
  return alliance ? ALLIANCE_DOT[alliance] : "bg-gray-400";
}

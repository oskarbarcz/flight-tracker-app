import type { PlannedRouteFix } from "~/features/route/model";

type FuelReportStanding = "belowMinimum" | "belowPlan" | "abovePlan" | "neutral";

const TONE: Record<FuelReportStanding, string> = {
  belowMinimum: "font-semibold text-red-700 dark:text-red-400",
  belowPlan: "text-amber-800 dark:text-amber-100",
  abovePlan: "text-green-800 dark:text-green-300",
  neutral: "",
};

export function fuelReportStanding(fix: PlannedRouteFix): FuelReportStanding {
  const actualOnBoard = fix.fuelReport?.actualOnBoard ?? null;
  const { plannedOnBoard, minimumOnBoard } = fix.fuel;

  if (actualOnBoard === null) {
    return "neutral";
  }

  if (minimumOnBoard !== null && actualOnBoard < minimumOnBoard) {
    return "belowMinimum";
  }

  if (plannedOnBoard === null || actualOnBoard === plannedOnBoard) {
    return "neutral";
  }

  return actualOnBoard < plannedOnBoard ? "belowPlan" : "abovePlan";
}

export function fuelReportTone(fix: PlannedRouteFix): string {
  return TONE[fuelReportStanding(fix)];
}

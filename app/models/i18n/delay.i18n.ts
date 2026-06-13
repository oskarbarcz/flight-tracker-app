import { DelayReasonCode } from "~/models/delay.model";

export enum DelayReasonCategory {
  Atc = "ATC delays",
  Ramp = "Ramp delays",
  Engineering = "Engineering delays",
  GroundEquipment = "Ground equipment",
  Operational = "Operational delays",
}

type DelayReasonDefinition = {
  label: string;
  category: DelayReasonCategory;
};

const delayReasons: Record<DelayReasonCode, DelayReasonDefinition> = {
  // ATC delays
  [DelayReasonCode.AtcStartup]: { label: "ATC startup delay", category: DelayReasonCategory.Atc },
  [DelayReasonCode.EnrouteSlot]: { label: "Enroute slot delay", category: DelayReasonCategory.Atc },
  [DelayReasonCode.DepartureRunwayChange]: { label: "Departure runway change", category: DelayReasonCategory.Atc },
  // Ramp delays
  [DelayReasonCode.LoadingError]: { label: "Loading error", category: DelayReasonCategory.Ramp },
  [DelayReasonCode.LatePushbackCrew]: { label: "Late arrival of pushback crew", category: DelayReasonCategory.Ramp },
  [DelayReasonCode.LateStepsRemoval]: { label: "Late removal of steps", category: DelayReasonCategory.Ramp },
  [DelayReasonCode.LateServicingEquipment]: {
    label: "Late arrival of servicing equipment",
    category: DelayReasonCategory.Ramp,
  },
  // Engineering delays
  [DelayReasonCode.SystemReset]: { label: "System reset", category: DelayReasonCategory.Engineering },
  [DelayReasonCode.NewDefect]: { label: "Status message / new defect", category: DelayReasonCategory.Engineering },
  [DelayReasonCode.SimulatorRestart]: { label: "Simulator restart", category: DelayReasonCategory.Engineering },
  // Ground equipment
  [DelayReasonCode.TugBroken]: { label: "Tug broken", category: DelayReasonCategory.GroundEquipment },
  [DelayReasonCode.JetwayBroken]: { label: "Jetway broken", category: DelayReasonCategory.GroundEquipment },
  [DelayReasonCode.StairsBroken]: { label: "Stairs broken", category: DelayReasonCategory.GroundEquipment },
  // Operational delays
  [DelayReasonCode.IncorrectDepartureTime]: {
    label: "Incorrect departure time",
    category: DelayReasonCategory.Operational,
  },
  [DelayReasonCode.NewRouteAtc]: { label: "New route ATC assigned", category: DelayReasonCategory.Operational },
  [DelayReasonCode.NewRouteOps]: { label: "New route OPS assigned", category: DelayReasonCategory.Operational },
  [DelayReasonCode.Fuelling]: { label: "Fuelling / defuelling", category: DelayReasonCategory.Operational },
  [DelayReasonCode.InboundDelay]: { label: "Delay of inbound flight", category: DelayReasonCategory.Operational },
  [DelayReasonCode.SelfManeuveringStand]: {
    label: "Self maneuvering stand",
    category: DelayReasonCategory.Operational,
  },
  [DelayReasonCode.Other]: { label: "Misc / other", category: DelayReasonCategory.Operational },
};

export function translateDelayReasonCode(code: DelayReasonCode): string {
  return delayReasons[code]?.label ?? code;
}

export type DelayReasonOption = { value: DelayReasonCode; label: string };

export type DelayReasonOptionGroup = {
  category: DelayReasonCategory;
  options: DelayReasonOption[];
};

export const delayReasonOptionGroups: DelayReasonOptionGroup[] = Object.values(DelayReasonCategory).map((category) => ({
  category,
  options: (Object.keys(delayReasons) as DelayReasonCode[])
    .filter((code) => delayReasons[code].category === category)
    .map((code) => ({ value: code, label: `${code} — ${delayReasons[code].label}` })),
}));

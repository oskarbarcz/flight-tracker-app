import {
  type BlockEventKey,
  combinedProvenance,
  resolveBlockTime,
  type TimeProvenance,
} from "~/features/flight/lib/blockEvents";
import { type FlightEvent, FlightEventType, FlightStatus, type Timesheet } from "~/features/flight/model";
import { durationMinutes } from "~/shared/lib/time";

export enum LifecycleStage {
  CheckIn = "check_in",
  Boarding = "boarding",
  OffBlock = "off_block",
  Takeoff = "takeoff",
  Cruise = "cruise",
  Arrival = "arrival",
  OnBlock = "on_block",
  Offboarding = "offboarding",
  Close = "close",
}

export type LifecycleProgress = "done" | "current" | "upcoming";

export type LifecycleValue =
  | { kind: "time"; at: Date; provenance: TimeProvenance }
  | { kind: "duration"; minutes: number; provenance: TimeProvenance };

export type LifecycleSpan = {
  from: Date;
  to: Date;
};

export type LifecycleStep = {
  stage: LifecycleStage;
  progress: LifecycleProgress;
  value: LifecycleValue | null;
  span: LifecycleSpan | null;
};

type StageSource = { event: FlightEventType } | { block: BlockEventKey } | { between: [BlockEventKey, BlockEventKey] };

const STAGES: { stage: LifecycleStage; source: StageSource }[] = [
  { stage: LifecycleStage.CheckIn, source: { event: FlightEventType.PilotCheckedIn } },
  { stage: LifecycleStage.Boarding, source: { event: FlightEventType.BoardingWasStarted } },
  { stage: LifecycleStage.OffBlock, source: { block: "offBlockTime" } },
  { stage: LifecycleStage.Takeoff, source: { block: "takeoffTime" } },
  { stage: LifecycleStage.Cruise, source: { between: ["takeoffTime", "arrivalTime"] } },
  { stage: LifecycleStage.Arrival, source: { block: "arrivalTime" } },
  { stage: LifecycleStage.OnBlock, source: { block: "onBlockTime" } },
  { stage: LifecycleStage.Offboarding, source: { event: FlightEventType.OffboardingWasStarted } },
  { stage: LifecycleStage.Close, source: { event: FlightEventType.FlightWasClosed } },
];

const REACHED_STAGE: Partial<Record<FlightStatus, LifecycleStage>> = {
  [FlightStatus.CheckedIn]: LifecycleStage.CheckIn,
  [FlightStatus.BoardingStarted]: LifecycleStage.Boarding,
  [FlightStatus.BoardingFinished]: LifecycleStage.Boarding,
  [FlightStatus.TaxiingOut]: LifecycleStage.OffBlock,
  [FlightStatus.InCruise]: LifecycleStage.Cruise,
  [FlightStatus.TaxiingIn]: LifecycleStage.Arrival,
  [FlightStatus.OnBlock]: LifecycleStage.OnBlock,
  [FlightStatus.OffboardingStarted]: LifecycleStage.Offboarding,
  [FlightStatus.OffboardingFinished]: LifecycleStage.Offboarding,
  [FlightStatus.Closed]: LifecycleStage.Close,
};

const STATUS_BLOCK_EVENTS: Partial<Record<FlightStatus, BlockEventKey>> = {
  [FlightStatus.TaxiingOut]: "offBlockTime",
  [FlightStatus.InCruise]: "takeoffTime",
  [FlightStatus.TaxiingIn]: "arrivalTime",
  [FlightStatus.OnBlock]: "onBlockTime",
};

const STATUS_EVENTS: Partial<Record<FlightStatus, FlightEventType>> = {
  [FlightStatus.Ready]: FlightEventType.FlightWasReleased,
  [FlightStatus.CheckedIn]: FlightEventType.PilotCheckedIn,
  [FlightStatus.BoardingStarted]: FlightEventType.BoardingWasStarted,
  [FlightStatus.BoardingFinished]: FlightEventType.BoardingWasFinished,
  [FlightStatus.TaxiingOut]: FlightEventType.OffBlockWasReported,
  [FlightStatus.InCruise]: FlightEventType.TakeoffWasReported,
  [FlightStatus.TaxiingIn]: FlightEventType.ArrivalWasReported,
  [FlightStatus.OnBlock]: FlightEventType.OnBlockWasReported,
  [FlightStatus.OffboardingStarted]: FlightEventType.OffboardingWasStarted,
  [FlightStatus.OffboardingFinished]: FlightEventType.OffboardingWasFinished,
  [FlightStatus.Closed]: FlightEventType.FlightWasClosed,
};

function latestEventTime(events: FlightEvent[], type: FlightEventType): Date | null {
  return events.find((event) => event.type === type)?.createdAt ?? null;
}

function actualTime(at: Date | null): LifecycleValue | null {
  return at === null ? null : { kind: "time", at, provenance: "actual" };
}

function progressAt(index: number, reachedIndex: number): LifecycleProgress {
  if (index < reachedIndex) {
    return "done";
  }

  return index === reachedIndex ? "current" : "upcoming";
}

function stageValue(
  source: StageSource,
  progress: LifecycleProgress,
  timesheet: Timesheet,
  events: FlightEvent[],
): LifecycleValue | null {
  if ("between" in source) {
    const [startKey, endKey] = source.between;
    const start = resolveBlockTime(startKey, timesheet);
    const end = resolveBlockTime(endKey, timesheet);

    return {
      kind: "duration",
      minutes: durationMinutes(start.time, end.time),
      provenance: combinedProvenance(start.provenance, end.provenance),
    };
  }

  if ("block" in source) {
    if (progress !== "upcoming") {
      return actualTime(timesheet.actual?.[source.block] ?? null);
    }

    const { time, provenance } = resolveBlockTime(source.block, timesheet);
    return { kind: "time", at: time, provenance };
  }

  return progress === "upcoming" ? null : actualTime(latestEventTime(events, source.event));
}

function spanStart(source: StageSource, value: LifecycleValue | null, timesheet: Timesheet): Date | null {
  if ("between" in source) {
    return timesheet.actual?.[source.between[0]] ?? null;
  }

  return value?.kind === "time" ? value.at : null;
}

function spanEnd(next: StageSource | undefined, timesheet: Timesheet): Date | null {
  if (next === undefined || "event" in next) {
    return null;
  }

  const key = "block" in next ? next.block : next.between[1];
  return resolveBlockTime(key, timesheet).time;
}

export function lifecycleSteps(status: FlightStatus, timesheet: Timesheet, events: FlightEvent[]): LifecycleStep[] {
  const reached = REACHED_STAGE[status];
  const reachedIndex = reached === undefined ? -1 : STAGES.findIndex(({ stage }) => stage === reached);

  return STAGES.map(({ stage, source }, index) => {
    const progress = progressAt(index, reachedIndex);
    const value = stageValue(source, progress, timesheet, events);

    if (progress !== "current") {
      return { stage, progress, value, span: null };
    }

    const from = spanStart(source, value, timesheet);
    const to = spanEnd(STAGES[index + 1]?.source, timesheet);

    return { stage, progress, value, span: from !== null && to !== null && to > from ? { from, to } : null };
  });
}

export function phaseStartedAt(status: FlightStatus, timesheet: Timesheet, events: FlightEvent[]): Date | null {
  const blockKey = STATUS_BLOCK_EVENTS[status];
  const actual = blockKey === undefined ? null : (timesheet.actual?.[blockKey] ?? null);

  if (actual !== null) {
    return actual;
  }

  const type = STATUS_EVENTS[status];
  return type === undefined ? null : latestEventTime(events, type);
}

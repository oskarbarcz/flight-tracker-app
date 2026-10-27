import type { Schedule, Timesheet } from "~/features/flight/model";
import { durationMinutes, formatCompactDuration, getTimeDifferenceInMinutes } from "~/shared/lib/time";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";

export type BlockEventKey = "offBlockTime" | "takeoffTime" | "arrivalTime" | "onBlockTime";

export type TimeProvenance = "actual" | "estimated" | "scheduled";

export type BlockEvent = {
  key: BlockEventKey;
  label: string;
  time: Date;
  provenance: TimeProvenance;
  delayMinutes: number | null;
  position: number;
};

const BLOCK_EVENTS: { key: BlockEventKey; label: string }[] = [
  { key: "offBlockTime", label: "Off-block" },
  { key: "takeoffTime", label: "Takeoff" },
  { key: "arrivalTime", label: "Arrival" },
  { key: "onBlockTime", label: "On-block" },
];

export function resolveBlockTime(
  key: BlockEventKey,
  timesheet: Timesheet,
): { time: Date; provenance: TimeProvenance; scheduled: Date } {
  const scheduled = timesheet.scheduled[key];
  const actual = (timesheet.actual as Schedule | undefined)?.[key] ?? null;

  if (actual !== null) {
    return { time: actual, provenance: "actual", scheduled };
  }

  const predicted = timesheet.predicted?.[key] ?? null;
  if (predicted !== null) {
    return { time: predicted, provenance: "estimated", scheduled };
  }

  const estimated = timesheet.estimated?.[key];
  if (estimated !== undefined) {
    return { time: estimated, provenance: "estimated", scheduled };
  }

  return { time: scheduled, provenance: "scheduled", scheduled };
}

export function combinedProvenance(first: TimeProvenance, second: TimeProvenance): TimeProvenance {
  if (first === "actual" && second === "actual") {
    return "actual";
  }

  return first === "scheduled" && second === "scheduled" ? "scheduled" : "estimated";
}

export type BlockTimeSummary = {
  minutes: number;
  scheduledMinutes: number;
  provenance: TimeProvenance;
};

export function blockTimeSummary(timesheet: Timesheet): BlockTimeSummary {
  const offBlock = resolveBlockTime("offBlockTime", timesheet);
  const onBlock = resolveBlockTime("onBlockTime", timesheet);
  const minutes = durationMinutes(offBlock.time, onBlock.time);
  const scheduledMinutes = durationMinutes(timesheet.scheduled.offBlockTime, timesheet.scheduled.onBlockTime);
  const provenance = combinedProvenance(offBlock.provenance, onBlock.provenance);

  return {
    minutes,
    scheduledMinutes,
    provenance: provenance === "estimated" && minutes === scheduledMinutes ? "scheduled" : provenance,
  };
}

export type ReachedLeg = {
  from: BlockEvent | null;
  to: BlockEvent | null;
};

export function reachedLeg(events: BlockEvent[]): ReachedLeg {
  let lastReached = -1;
  events.forEach((event, index) => {
    if (event.provenance === "actual") {
      lastReached = index;
    }
  });

  if (lastReached === -1) {
    return { from: null, to: null };
  }

  return { from: events[lastReached], to: events[lastReached + 1] ?? null };
}

const NEXT_ACTION_LABELS: Record<BlockEventKey, string> = {
  offBlockTime: "off-block",
  takeoffTime: "takeoff",
  arrivalTime: "arrival",
  onBlockTime: "on-block",
};

export function nextAction(events: BlockEvent[]): BlockEvent | null {
  const leg = reachedLeg(events);

  if (leg.from === null) {
    return events[0] ?? null;
  }

  return leg.to;
}

const OVERDUE_DURATION_LIMIT_MINUTES = 24 * 60;

export function nextActionCaption(event: BlockEvent, now: Date): string {
  const minutes = getTimeDifferenceInMinutes(now, event.time);

  if (minutes > 0) {
    return `Time to ${NEXT_ACTION_LABELS[event.key]}: ${formatCompactDuration(minutes)}`;
  }

  const overdueMinutes = -minutes;

  if (overdueMinutes <= 1) {
    return `${event.label} due now`;
  }

  if (overdueMinutes < OVERDUE_DURATION_LIMIT_MINUTES) {
    return `${event.label} overdue: ${formatCompactDuration(overdueMinutes)}`;
  }

  return `${event.label} overdue since ${dateToIcaoDate(event.time)}`;
}

export function offBlockEvent(events: BlockEvent[]): BlockEvent {
  return events[0];
}

export function onBlockEvent(events: BlockEvent[]): BlockEvent {
  return events[events.length - 1];
}

export function blockReference(events: BlockEvent[]): BlockEvent {
  const offBlock = offBlockEvent(events);

  return offBlock.provenance === "actual" ? onBlockEvent(events) : offBlock;
}

const NON_BREAKING_HYPHEN = "‑";

function withUnbreakableHyphens(label: string): string {
  return label.replaceAll("-", NON_BREAKING_HYPHEN);
}

export function blockEventLabel(event: BlockEvent): string {
  if (event.provenance === "estimated") {
    return withUnbreakableHyphens(`Est. ${NEXT_ACTION_LABELS[event.key]}`);
  }

  if (event.provenance === "scheduled") {
    return withUnbreakableHyphens(`Sched. ${NEXT_ACTION_LABELS[event.key]}`);
  }

  return withUnbreakableHyphens(event.label);
}

export function axisProgress(leg: ReachedLeg, legProgressPercent: number): number {
  if (leg.from === null) {
    return 0;
  }

  if (leg.to === null) {
    return 100;
  }

  const fraction = Math.min(Math.max(legProgressPercent, 0), 100) / 100;

  return leg.from.position + (leg.to.position - leg.from.position) * fraction;
}

export function resolveBlockEvents(timesheet: Timesheet): BlockEvent[] {
  const resolved = BLOCK_EVENTS.map(({ key, label }) => ({ key, label, ...resolveBlockTime(key, timesheet) }));

  const first = resolved[0].time;
  const span = durationMinutes(first, resolved[resolved.length - 1].time);

  return resolved.map(({ key, label, time, provenance, scheduled }) => ({
    key,
    label,
    time,
    provenance,
    delayMinutes: provenance === "scheduled" ? null : getTimeDifferenceInMinutes(scheduled, time),
    position: span === 0 ? 0 : (durationMinutes(first, time) / span) * 100,
  }));
}

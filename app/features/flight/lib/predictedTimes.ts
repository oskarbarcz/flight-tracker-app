import { type BlockEventKey, resolveBlockTime } from "~/features/flight/lib/blockEvents";
import { type FilledSchedule, FlightStatus, type Timesheet } from "~/features/flight/model";

const ALL_EVENTS: BlockEventKey[] = ["offBlockTime", "takeoffTime", "arrivalTime", "onBlockTime"];

const REPORTABLE_EVENTS: Partial<Record<FlightStatus, BlockEventKey[]>> = {
  [FlightStatus.CheckedIn]: ALL_EVENTS,
  [FlightStatus.BoardingStarted]: ALL_EVENTS,
  [FlightStatus.BoardingFinished]: ALL_EVENTS,
  [FlightStatus.TaxiingOut]: ["takeoffTime", "arrivalTime", "onBlockTime"],
  [FlightStatus.InCruise]: ["arrivalTime", "onBlockTime"],
  [FlightStatus.TaxiingIn]: ["onBlockTime"],
};

const MINUTE = 60_000;

export function reportableEvents(status: FlightStatus): BlockEventKey[] {
  return REPORTABLE_EVENTS[status] ?? [];
}

export function currentBlockTimes(timesheet: Timesheet): FilledSchedule {
  return {
    offBlockTime: resolveBlockTime("offBlockTime", timesheet).time,
    takeoffTime: resolveBlockTime("takeoffTime", timesheet).time,
    arrivalTime: resolveBlockTime("arrivalTime", timesheet).time,
    onBlockTime: resolveBlockTime("onBlockTime", timesheet).time,
  };
}

function wholeMinutes(date: Date): number {
  return Math.floor(date.getTime() / MINUTE);
}

export function changedBlockTimes(
  status: FlightStatus,
  current: FilledSchedule,
  entered: FilledSchedule,
): Partial<FilledSchedule> {
  const changed: Partial<FilledSchedule> = {};

  for (const key of reportableEvents(status)) {
    if (wholeMinutes(entered[key]) !== wholeMinutes(current[key])) {
      changed[key] = entered[key];
    }
  }

  return changed;
}

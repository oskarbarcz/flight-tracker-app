export interface Schedule {
  offBlockTime: Date | null;
  takeoffTime: Date | null;
  arrivalTime: Date | null;
  onBlockTime: Date | null;
}

export interface FilledSchedule {
  offBlockTime: Date;
  takeoffTime: Date;
  arrivalTime: Date;
  onBlockTime: Date;
}

export interface Timesheet {
  scheduled: FilledSchedule;
  estimated?: FilledSchedule;
  actual?: Schedule;
}

export interface CheckedInFlightTimesheet {
  scheduled: FilledSchedule;
  estimated: FilledSchedule;
  actual?: Schedule;
}

function isFilledSchedule(schedule: Schedule): schedule is FilledSchedule {
  return (
    schedule.offBlockTime !== null &&
    schedule.takeoffTime !== null &&
    schedule.arrivalTime !== null &&
    schedule.onBlockTime !== null
  );
}

function parseSchedule<T extends Schedule | FilledSchedule>(
  data: Record<string, string | null>,
): T {
  return {
    offBlockTime: data.offBlockTime ? new Date(data.offBlockTime) : null,
    takeoffTime: data.takeoffTime ? new Date(data.takeoffTime) : null,
    arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : null,
    onBlockTime: data.onBlockTime ? new Date(data.onBlockTime) : null,
  } as T;
}

export function parseTimesheet(data: {
  scheduled: Record<string, string>;
  estimated?: Record<string, string | null>;
  actual?: Record<string, string | null>;
}): Timesheet {
  const scheduled = parseSchedule<FilledSchedule>(data.scheduled);
  if (!isFilledSchedule(scheduled)) {
    throw new Error("Scheduled times must be fully populated");
  }

  return {
    scheduled,
    estimated: data.estimated
      ? parseSchedule<FilledSchedule>(data.estimated)
      : undefined,
    actual: data.actual ? parseSchedule<Schedule>(data.actual) : undefined,
  };
}

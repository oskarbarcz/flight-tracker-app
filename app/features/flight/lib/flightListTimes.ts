import { type FilledSchedule, type Flight, isFilledSchedule } from "~/features/flight";
import { durationMinutes } from "~/shared/lib/time";

export function actualScheduleOf(flight: Flight): FilledSchedule | null {
  return isFilledSchedule(flight.timesheet.actual) ? flight.timesheet.actual : null;
}

export function listOffBlockTimeOf(flight: Flight): Date {
  return actualScheduleOf(flight)?.offBlockTime ?? flight.timesheet.scheduled.offBlockTime;
}

export function blockMinutesOf(schedule: FilledSchedule): number {
  return durationMinutes(schedule.offBlockTime, schedule.onBlockTime);
}

export function airMinutesOf(schedule: FilledSchedule): number {
  return durationMinutes(schedule.takeoffTime, schedule.arrivalTime);
}

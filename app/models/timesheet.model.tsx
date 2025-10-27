export interface Schedule {
  offBlockTime: string | null;
  takeoffTime: string | null;
  arrivalTime: string | null;
  onBlockTime: string | null;
}

export interface FilledScheduleWithoutTypes {
  offBlockTime: string;
  takeoffTime: string;
  arrivalTime: string;
  onBlockTime: string;
}

export interface FilledSchedule {
  offBlockTime: Date;
  takeoffTime: Date;
  arrivalTime: Date;
  onBlockTime: Date;
}

export interface Timesheet {
  scheduled: FilledScheduleWithoutTypes;
  estimated?: FilledScheduleWithoutTypes;
  actual?: Schedule;
}

export interface CheckedInFlightTimesheet {
  scheduled: FilledScheduleWithoutTypes;
  estimated: FilledScheduleWithoutTypes;
  actual?: Schedule;
}

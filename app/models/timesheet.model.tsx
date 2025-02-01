export interface Schedule {
  offBlockTime: string | null;
  takeoffTime: string | null;
  arrivalTime: string | null;
  onBlockTime: string | null;
}

export interface FilledSchedule {
  offBlockTime: string;
  takeoffTime: string;
  arrivalTime: string;
  onBlockTime: string;
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

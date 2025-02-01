export interface Schedule {
  offBlockTime?: string | null;
  takeoffTime?: string | null;
  arrivalTime?: string | null;
  onBlockTime?: string | null;
}

export interface Timesheet {
  scheduled: Required<Schedule>;
  estimated?: Schedule;
  actual?: Schedule;
}

export interface CheckedInFlightTimesheet {
  scheduled: Required<NonNullable<Schedule>>;
  estimated: Required<NonNullable<Schedule>>;
  actual?: Schedule;
}

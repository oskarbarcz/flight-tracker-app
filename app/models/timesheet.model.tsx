export interface Schedule {
  offBlockTime: string | undefined;
  takeoffTime: string | undefined;
  arrivalTime: string | undefined;
  onBlockTime: string | undefined;
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

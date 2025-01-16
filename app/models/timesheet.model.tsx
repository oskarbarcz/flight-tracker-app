export interface Timesheet {
  offBlockTime: string | undefined;
  takeoffTime: string | undefined;
  arrivalTime: string | undefined;
  onBlockTime: string | undefined;
}

export interface Schedule {
  scheduled: Timesheet;
  estimated?: Timesheet;
  actual?: Timesheet;
}

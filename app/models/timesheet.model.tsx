export interface Timesheet {
  offBlockTime: Date;
  takeoffTime: Date;
  arrivalTime: Date;
  onBlockTime: Date;
}

export interface Schedule {
  scheduled: Timesheet;
  estimated?: Timesheet;
  actual?: Timesheet;
}

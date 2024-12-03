export interface Timesheet {
  offBlockTime: Date;
  takeoffTime: Date;
  blockTime: string;
  airTime: string;
  landingTime: Date;
  onBlockTime: Date;
}

export interface Schedule {
  scheduled: Timesheet;
  estimated?: Timesheet;
  actual?: Timesheet;
}
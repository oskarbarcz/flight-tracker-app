export interface Timesheet {
  offBlockTime: Date;
  takeoffTime: Date;
  blockTime: string;
  airTime: string;
  landingTime: Date;
  onBlockTime: Date;
}

export default interface Schedule {
  scheduled: Timesheet;
  estimated?: Timesheet;
  actual?: Timesheet;
}
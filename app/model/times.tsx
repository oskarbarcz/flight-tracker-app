export interface Timesheet {
  offBlockTime: Date;
  takeoffTime: Date;
  landingTime: Date;
  onBlockTime: Date;
}

export default interface Schedule {
  scheduled: Timesheet;
  estimated: Timesheet;
  actual: Timesheet;
}
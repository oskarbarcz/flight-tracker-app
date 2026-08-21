export enum NotamSeverity {
  OutOfService = "out_of_service",
  Limited = "limited",
  Advisory = "advisory",
}

export type Notam = {
  notamId: string;
  dateCreated: string;
  dateEffective: string;
  dateExpire: string | null;
  dateModified: string;
  dateImported: string;
  html: string;
  text: string;
  raw: string;
  nrc: string;
  qcode: string;
  qcodeCategory: string;
  qcodeSubject: string;
  qcodeStatus: string;
};

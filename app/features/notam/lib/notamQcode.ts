import { NotamSeverity } from "~/features/notam/model";

const QCODE_STATUS_OFFSET = 3;
const QCODE_STATUS_LENGTH = 2;

const OUT_OF_SERVICE_STATUSES = new Set(["AC", "AS", "AU", "AW", "CD", "CT", "LC", "LD", "LI", "LN", "LP", "LV"]);

const LIMITED_STATUSES = new Set([
  "AD",
  "AL",
  "AM",
  "AP",
  "AR",
  "CG",
  "CM",
  "CP",
  "CR",
  "HW",
  "LB",
  "LE",
  "LF",
  "LG",
  "LH",
  "LK",
  "LL",
  "LR",
  "LS",
  "LT",
  "LW",
  "LX",
]);

export function decodeQcode(subject: string, status: string): string {
  return `${status} ${subject.toLowerCase()}`;
}

export function qcodeStatusLetters(qcode: string): string {
  return qcode.slice(QCODE_STATUS_OFFSET, QCODE_STATUS_OFFSET + QCODE_STATUS_LENGTH).toUpperCase();
}

export function notamSeverity(qcode: string): NotamSeverity {
  const status = qcodeStatusLetters(qcode);

  if (OUT_OF_SERVICE_STATUSES.has(status)) return NotamSeverity.OutOfService;
  if (LIMITED_STATUSES.has(status)) return NotamSeverity.Limited;
  return NotamSeverity.Advisory;
}

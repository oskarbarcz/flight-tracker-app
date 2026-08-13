import { notamSeverity } from "~/features/notam/lib/notamQcode";
import { type Notam, NotamSeverity } from "~/features/notam/model";

const SEVERITY_RANK: Record<NotamSeverity, number> = {
  [NotamSeverity.OutOfService]: 0,
  [NotamSeverity.Limited]: 1,
  [NotamSeverity.Advisory]: 2,
};

export type NotamGroups = {
  inForce: Notam[];
  upcoming: Notam[];
};

export type NotamSeverityTally = {
  severity: NotamSeverity;
  count: number;
};

export function orderedSeverities(): NotamSeverity[] {
  return [NotamSeverity.OutOfService, NotamSeverity.Limited, NotamSeverity.Advisory];
}

export function tallyBySeverity(notams: Notam[]): NotamSeverityTally[] {
  return orderedSeverities()
    .map((severity) => ({
      severity,
      count: notams.filter((notam) => notamSeverity(notam.qcode) === severity).length,
    }))
    .filter((tally) => tally.count > 0);
}

export function isInForce(notam: Notam, now: Date): boolean {
  return new Date(notam.dateEffective).getTime() <= now.getTime();
}

function byUrgency(left: Notam, right: Notam): number {
  const bySeverity = SEVERITY_RANK[notamSeverity(left.qcode)] - SEVERITY_RANK[notamSeverity(right.qcode)];
  if (bySeverity !== 0) return bySeverity;

  return new Date(right.dateEffective).getTime() - new Date(left.dateEffective).getTime();
}

export function groupNotams(notams: Notam[], now: Date): NotamGroups {
  const inForce: Notam[] = [];
  const upcoming: Notam[] = [];

  for (const notam of notams) {
    (isInForce(notam, now) ? inForce : upcoming).push(notam);
  }

  return {
    inForce: inForce.sort(byUrgency),
    upcoming: upcoming.sort(byUrgency),
  };
}

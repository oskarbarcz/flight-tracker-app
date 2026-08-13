import React, { useMemo } from "react";
import { groupNotams, type Notam, tallyBySeverity, translateNotamSeverity } from "~/features/notam";
import { NotamRecord } from "~/features/notam/components/NotamRecord";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

const SUMMARY_MIN_RECORDS = 6;

type Props = {
  notams: Notam[];
};

export function NotamList({ notams }: Props) {
  const { inForce, upcoming } = useMemo(() => groupNotams(notams, new Date()), [notams]);
  const isSplit = inForce.length > 0 && upcoming.length > 0;

  return (
    <div className="space-y-4">
      {notams.length >= SUMMARY_MIN_RECORDS && <SeverityTally notams={notams} />}
      {inForce.length > 0 && <NotamGroup heading={isSplit ? "In force" : null} notams={inForce} />}
      {upcoming.length > 0 && <NotamGroup heading={isSplit ? "Not yet in force" : null} notams={upcoming} />}
    </div>
  );
}

function SeverityTally({ notams }: Props) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      {tallyBySeverity(notams).map((tally) => (
        <span key={tally.severity} className="flex items-baseline gap-1.5">
          <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{tally.count}</span>
          <FieldLabel>{translateNotamSeverity(tally.severity)}</FieldLabel>
        </span>
      ))}
    </p>
  );
}

function NotamGroup({ heading, notams }: { heading: string | null; notams: Notam[] }) {
  return (
    <section className="space-y-2">
      {heading && <RuledHeading>{heading}</RuledHeading>}
      {notams.map((notam) => (
        <NotamRecord key={notam.notamId} notam={notam} />
      ))}
    </section>
  );
}

function RuledHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3">
      <FieldLabel>{children}</FieldLabel>
      <span aria-hidden className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </h3>
  );
}

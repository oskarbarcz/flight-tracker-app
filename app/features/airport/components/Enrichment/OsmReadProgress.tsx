import React, { useEffect, useState } from "react";
import { padZero } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { SweepTrack } from "~/shared/ui/Display/SweepTrack";

const READING_LABEL = "Reading OpenStreetMap";

function formatElapsed(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${padZero(seconds % 60)}`;
}

type Props = {
  startedAt: number;
  hint?: string;
};

export function OsmReadProgress({ startedAt, hint }: Props) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startedAt) / 1000));

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);

    return () => clearInterval(tick);
  }, [startedAt]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>{READING_LABEL}</FieldLabel>
        <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {formatElapsed(elapsed)}
        </span>
      </div>
      <SweepTrack label={READING_LABEL} />
      {hint !== undefined && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}

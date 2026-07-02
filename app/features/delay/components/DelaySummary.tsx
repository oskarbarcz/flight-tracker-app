import React from "react";
import type { DelayReport, DelayRequest } from "~/features/delay";
import { DelayReportRow } from "~/features/delay/components/DelayReportRow";

type Props = {
  delayRequest: DelayRequest;
  onRemove?: (report: DelayReport) => void;
  onAccept?: (report: DelayReport) => void;
  onReject?: (report: DelayReport) => void;
};

export function DelaySummary({ delayRequest, onRemove, onAccept, onReject }: Props) {
  const { totalDelayMinutes, allocatedMinutes, unallocatedMinutes, reports } = delayRequest;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total delay" value={`${totalDelayMinutes} min`} />
        <Stat label="Allocated" value={`${allocatedMinutes} min`} />
        <Stat label="Unallocated" value={`${unallocatedMinutes} min`} emphasize={unallocatedMinutes > 0} />
      </div>

      <div className="flex flex-col gap-2">
        {reports.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No delay reports filed yet.</p>
        ) : (
          reports.map((report) => (
            <DelayReportRow
              key={report.id}
              report={report}
              onRemove={onRemove}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
      <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`mt-1 font-mono text-lg font-semibold ${
          emphasize ? "text-amber-600 dark:text-amber-500" : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

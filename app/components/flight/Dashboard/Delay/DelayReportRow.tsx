import { Button } from "flowbite-react";
import React from "react";
import { FaCheck, FaTrash, FaXmark } from "react-icons/fa6";
import type { DelayReport } from "~/models";
import { DelayReportStatus } from "~/models";
import { translateDelayReasonCode } from "~/models/i18n/delay.i18n";

const STATUS_STYLES: Record<DelayReportStatus, string> = {
  [DelayReportStatus.Pending]: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
  [DelayReportStatus.Accepted]: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  [DelayReportStatus.Rejected]: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const STATUS_LABELS: Record<DelayReportStatus, string> = {
  [DelayReportStatus.Pending]: "Pending",
  [DelayReportStatus.Accepted]: "Accepted",
  [DelayReportStatus.Rejected]: "Rejected",
};

type Props = {
  report: DelayReport;
  onRemove?: (report: DelayReport) => void;
  onAccept?: (report: DelayReport) => void;
  onReject?: (report: DelayReport) => void;
};

export function DelayReportRow({ report, onRemove, onAccept, onReject }: Props) {
  const canReview = report.isPending && (onAccept || onReject);
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {report.delayMinutes} min
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-mono">{report.reasonCode}</span> · {translateDelayReasonCode(report.reasonCode)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[report.status]}`}
          >
            {STATUS_LABELS[report.status]}
          </span>
        </div>
        {report.freeText && <p className="text-xs text-gray-500 dark:text-gray-400">{report.freeText}</p>}
        {report.isPending && <p className="text-xs text-amber-600 dark:text-amber-500">Awaiting Operations review</p>}
        {report.isRejected && report.rejectionReason && (
          <p className="text-xs text-red-600 dark:text-red-400">Rejected: {report.rejectionReason}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">Filed by {report.reportedBy.name}</p>
      </div>
      {onRemove && report.isPending && (
        <Button size="xs" color="gray" outline onClick={() => onRemove(report)} title="Remove report">
          <FaTrash />
        </Button>
      )}
      {canReview && (
        <div className="flex shrink-0 gap-2">
          {onReject && (
            <Button size="xs" color="red" outline onClick={() => onReject(report)} title="Reject report">
              <FaXmark className="me-1" /> Reject
            </Button>
          )}
          {onAccept && (
            <Button size="xs" color="green" onClick={() => onAccept(report)} title="Accept report">
              <FaCheck className="me-1" /> Accept
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

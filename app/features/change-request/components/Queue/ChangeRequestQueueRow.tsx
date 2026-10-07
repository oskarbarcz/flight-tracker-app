import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { ChangeRequestKindIcon } from "~/features/change-request/components/ChangeRequestKindIcon";
import { ChangeRequestStatusBadge } from "~/features/change-request/components/ChangeRequestStatusBadge";
import { summarizeChangedFields } from "~/features/change-request/lib/changeRequestFields";
import { changeRequestHeadline } from "~/features/change-request/lib/changeRequestHeadline";
import { formatWaitingTime } from "~/features/change-request/lib/changeRequestQueue";
import type { ChangeRequest } from "~/features/change-request/model";

type Props = {
  request: ChangeRequest;
  competingCount: number;
  href: string;
  isSelected: boolean;
};

function RowHeadline({ request }: { request: ChangeRequest }) {
  const { noun, label, isCode } = changeRequestHeadline(request);

  if (label === null) {
    return (
      <span className="truncate text-sm font-semibold text-gray-500 dark:text-gray-400">
        Deleted {noun.toLowerCase()}
      </span>
    );
  }

  if (!isCode) {
    return <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">{label}</span>;
  }

  return (
    <span className="truncate text-sm text-gray-900 dark:text-white">
      <span className="text-gray-600 dark:text-gray-300">{noun}</span>{" "}
      <span className="font-mono font-bold">{label}</span>
    </span>
  );
}

export function ChangeRequestQueueRow({ request, competingCount, href, isSelected }: Props) {
  return (
    <li>
      <Link
        to={href}
        viewTransition
        preventScrollReset
        aria-current={isSelected ? "page" : undefined}
        className={twMerge(
          "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 px-3.5 py-3 transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500",
          isSelected ? "bg-indigo-50 dark:bg-indigo-950/60" : "hover:bg-gray-50 dark:hover:bg-gray-800/60",
        )}
      >
        <span
          className={twMerge(
            "mt-0.5 grid size-8 place-items-center rounded-lg transition-colors duration-150",
            isSelected
              ? "bg-white text-indigo-600 ring-1 ring-indigo-200 dark:bg-gray-900 dark:text-indigo-300 dark:ring-indigo-800"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          <ChangeRequestKindIcon resource={request.resource} className="size-4" />
        </span>

        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex min-w-0 items-baseline gap-2">
            <RowHeadline request={request} />
            {request.target && (
              <span className="shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400">
                {request.target.airport.iataCode}
              </span>
            )}
          </span>
          <span className="truncate text-xs text-gray-700 dark:text-gray-300">
            {summarizeChangedFields(request.resource, request.changedFieldNames)}
          </span>
          <span className="flex min-w-0 items-baseline gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="truncate">{request.requestedBy.name}</span>
            {competingCount > 0 && (
              <span className="shrink-0">
                · <span className="font-mono tabular-nums">{competingCount}</span> more on this record
              </span>
            )}
          </span>
        </span>

        <span className="flex flex-col items-end gap-1">
          {request.isPending ? (
            <time
              dateTime={request.createdAt.toISOString()}
              title="Waiting since submission"
              className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400"
            >
              {formatWaitingTime(request.createdAt)}
            </time>
          ) : (
            <ChangeRequestStatusBadge status={request.status} />
          )}
        </span>
      </Link>
    </li>
  );
}

import React from "react";
import { LuGitCompareArrows, LuTriangleAlert } from "react-icons/lu";
import { Link } from "react-router";
import { summarizeChangedFields } from "~/features/change-request/lib/changeRequestFields";
import type { ChangeRequest } from "~/features/change-request/model";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";

type CompetingProps = {
  competing: ChangeRequest[];
  hrefFor: (requestId: string) => string;
};

export function CompetingRequestsNote({ competing, hrefFor }: CompetingProps) {
  if (competing.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm dark:border-gray-800 dark:bg-gray-900/60">
      <LuGitCompareArrows aria-hidden={true} className="mt-0.5 size-4 shrink-0 text-gray-500 dark:text-gray-400" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-gray-700 dark:text-gray-200">
          {competing.length === 1 ? "Another proposal is" : `${competing.length} other proposals are`} pending for this
          record. Each one is decided on its own, and the last one accepted wins.
        </p>
        <ul className="flex flex-col gap-1">
          {competing.map((request) => (
            <li key={request.id}>
              <Link
                to={hrefFor(request.id)}
                viewTransition
                preventScrollReset
                className="font-medium text-indigo-600 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-indigo-400"
              >
                {request.requestedBy.name}: {summarizeChangedFields(request.resource, request.changedFieldNames)}
              </Link>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                · <FormattedIcaoDate date={request.createdAt} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TargetGoneNote({ noun }: { noun: string }) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <LuTriangleAlert aria-hidden={true} className="mt-0.5 size-4 shrink-0" />
      <p>
        This {noun.toLowerCase()} was deleted after the proposal was submitted. It can only be rejected. "Now" shows no
        value because there is no record left to read.
      </p>
    </div>
  );
}

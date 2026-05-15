import React from "react";
import { useMatches } from "react-router";
import { Breadcrumbs } from "~/components/shared/TopNav/Breadcrumbs";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

function hasBreadcrumbs(handle: unknown): handle is TopNavRouteHandle {
  return typeof (handle as TopNavRouteHandle | null)?.breadcrumbs === "function";
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatRefreshLabel(date: Date): string {
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const hh = date.getUTCHours().toString().padStart(2, "0");
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}z`;
}

function LastRefreshIndicator() {
  const { lastRefresh } = useDataRefresh();

  if (!lastRefresh) return null;

  return (
    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
      Last update: {formatRefreshLabel(lastRefresh)}
    </span>
  );
}

export function BreadcrumbsHeader() {
  const matches = useMatches();
  const match = [...matches].reverse().find((m) => hasBreadcrumbs(m.handle));

  if (!match || !hasBreadcrumbs(match.handle)) {
    return null;
  }

  const items = match.handle.breadcrumbs(match.data);

  return (
    <div className="px-4 md:px-6 py-2.5 border-b border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between gap-4">
      <Breadcrumbs items={items} />
      <LastRefreshIndicator />
    </div>
  );
}

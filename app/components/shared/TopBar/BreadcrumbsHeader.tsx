import React from "react";
import { useMatches } from "react-router";
import { Breadcrumbs } from "~/components/shared/TopNav/Breadcrumbs";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";

function hasBreadcrumbs(handle: unknown): handle is TopNavRouteHandle {
  return typeof (handle as TopNavRouteHandle | null)?.breadcrumbs === "function";
}

export function BreadcrumbsHeader() {
  const matches = useMatches();
  const match = [...matches].reverse().find((m) => hasBreadcrumbs(m.handle));

  if (!match || !hasBreadcrumbs(match.handle)) {
    return null;
  }

  const items = match.handle.breadcrumbs(match.data);

  return (
    <div className="px-4 md:px-6 py-2.5 border-b border-gray-200/60 dark:border-gray-800/60">
      <Breadcrumbs items={items} />
    </div>
  );
}

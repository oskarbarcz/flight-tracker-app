import React from "react";
import { useMatches } from "react-router";
import { Breadcrumbs } from "./Breadcrumbs";
import { TopNav } from "./TopNav";
import { TopNavUserSection } from "./TopNavUserSection";
import type { TopNavRouteHandle } from "./types";

function hasBreadcrumbs(handle: unknown): handle is TopNavRouteHandle {
  return typeof (handle as TopNavRouteHandle | null)?.breadcrumbs === "function";
}

export function TopNavOutlet() {
  const matches = useMatches();
  const match = [...matches].reverse().find((m) => hasBreadcrumbs(m.handle));

  if (!match || !hasBreadcrumbs(match.handle)) {
    return null;
  }

  const items = match.handle.breadcrumbs(match.data);

  return (
    <TopNav>
      <Breadcrumbs items={items} />
      <TopNavUserSection />
    </TopNav>
  );
}

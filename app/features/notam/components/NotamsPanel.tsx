import React from "react";
import { LuInfo } from "react-icons/lu";
import type { Notam } from "~/features/notam";
import { NotamList } from "~/features/notam/components/NotamList";
import { NotamListEmptyState, NotamListUnavailableState } from "~/features/notam/components/NotamListEmptyState";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

type Props = {
  icaoCode: string;
  notams: Notam[] | null;
  isFiltered: boolean;
  clearFilter: () => void;
};

export function NotamsPanel({ icaoCode, notams, isFiltered, clearFilter }: Props) {
  if (notams === null) {
    return <NotamListUnavailableState icaoCode={icaoCode} />;
  }

  if (notams.length === 0 && isFiltered) {
    return <NoFilterMatchesState subject="NOTAMs" onClear={clearFilter} />;
  }

  return (
    <div className="space-y-3">
      <NotamSourceNote />
      {notams.length === 0 ? <NotamListEmptyState icaoCode={icaoCode} /> : <NotamList notams={notams} />}
    </div>
  );
}

function NotamSourceNote() {
  return (
    <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
      <LuInfo aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span>
        NOTAMs are refreshed only when a flight plan is imported, so this list can lag the airport's current state.
      </span>
    </p>
  );
}

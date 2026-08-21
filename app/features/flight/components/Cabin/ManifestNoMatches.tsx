import { Button } from "flowbite-react";
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { matchesQuery } from "~/features/flight/lib/manifest";
import type { ManifestPassenger, PassengerStatus } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  passengers: ManifestPassenger[];
  query: string;
  status: PassengerStatus | "all";
  specialServiceOnly: boolean;
  onClear: () => void;
  onSearchOnly: () => void;
};

function criteriaOf(query: string, status: PassengerStatus | "all", specialServiceOnly: boolean): string[] {
  const criteria: string[] = [];

  if (query !== "") {
    criteria.push(`Search “${query}”`);
  }
  if (status !== "all") {
    criteria.push(toHuman.flight.passengerStatus(status));
  }
  if (specialServiceOnly) {
    criteria.push("Special service");
  }

  return criteria;
}

export function ManifestNoMatches({ passengers, query, status, specialServiceOnly, onClear, onSearchOnly }: Props) {
  const criteria = criteriaOf(query, status, specialServiceOnly);
  const isNarrowed = status !== "all" || specialServiceOnly;
  const searchAlone =
    query === "" ? 0 : passengers.filter((passenger) => matchesQuery(passenger, query.toUpperCase())).length;
  const canWiden = isNarrowed && searchAlone > 0;

  return (
    <NoticePanel
      tone="neutral"
      icon={FaMagnifyingGlass}
      title="No passenger matches this filter"
      description={
        <>
          <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">{criteria.join(" · ")}</span>
          {canWiden && (
            <span className="mt-1 block">
              {searchAlone === 1
                ? `One passenger matches “${query}” once the other filters come off.`
                : `${searchAlone} passengers match “${query}” once the other filters come off.`}
            </span>
          )}
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {canWiden && (
          <Button size="xs" color="indigo" onClick={onSearchOnly}>
            Keep only the search
          </Button>
        )}
        <Button size="xs" color="alternative" onClick={onClear}>
          Clear filter
        </Button>
      </div>
    </NoticePanel>
  );
}

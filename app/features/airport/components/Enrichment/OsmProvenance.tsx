import { Button } from "flowbite-react";
import React from "react";
import { HiRefresh } from "react-icons/hi";
import { OsmReadProgress } from "~/features/airport/components/Enrichment/OsmReadProgress";
import type { AirportOsmProposal } from "~/features/airport/model";
import { LastLoadedAt } from "~/shared/ui/Date/LastLoadedAt";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  proposal: AirportOsmProposal;
  refreshStartedAt: number | null;
  onRefresh: () => void;
};

export function OsmProvenance({ proposal, refreshStartedAt, onRefresh }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="min-w-0 flex-1">
        <FieldLabel>Source</FieldLabel>
        <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
          {proposal.source}
          {proposal.providerName !== null && (
            <span className="font-normal text-gray-500 dark:text-gray-400"> · listed as {proposal.providerName}</span>
          )}
        </p>

        {refreshStartedAt === null ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <LastLoadedAt at={proposal.pulledAt} label="Read" />
            {proposal.fromCache && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                from the pull already held for this airport
              </span>
            )}
          </p>
        ) : (
          <div className="mt-2">
            <OsmReadProgress
              startedAt={refreshStartedAt}
              hint="The review below is replaced as soon as Overpass answers, which can take up to a minute."
            />
          </div>
        )}
      </div>

      {refreshStartedAt === null && (
        <Button color="light" size="xs" onClick={onRefresh} className="shrink-0 px-3">
          <span className="flex items-center gap-1.5">
            <HiRefresh className="size-3.5 shrink-0" aria-hidden={true} />
            <span>Pull fresh data</span>
          </span>
        </Button>
      )}
    </div>
  );
}

import { ToggleSwitch } from "flowbite-react";
import React, { useState } from "react";
import { OsmChangeList } from "~/features/airport/components/Enrichment/OsmChangeList";
import { OsmProvenance } from "~/features/airport/components/Enrichment/OsmProvenance";
import { OsmStatusChips } from "~/features/airport/components/Enrichment/OsmStatusChips";
import type { OsmSelection } from "~/features/airport/hooks/useOsmSelection";
import { writesRecords } from "~/features/airport/lib/osmProposal";
import type { AirportOsmProposal } from "~/features/airport/model";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

type Props = {
  proposal: AirportOsmProposal;
  selection: OsmSelection;
  refreshStartedAt: number | null;
  onRefresh: () => void;
};

export function OsmProposalReview({ proposal, selection, refreshStartedAt, onRefresh }: Props) {
  const [showMatching, setShowMatching] = useState(false);
  const hasWrites = proposal.changes.some(writesRecords);

  return (
    <div className="flex flex-col gap-4">
      <OsmProvenance proposal={proposal} refreshStartedAt={refreshStartedAt} onRefresh={onRefresh} />

      {hasWrites ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <OsmStatusChips
              changes={proposal.changes}
              selected={selection.keys}
              onSelectStatus={selection.selectStatus}
            />
            <ToggleSwitch
              checked={showMatching}
              color="indigo"
              sizing="sm"
              label="Show matching records"
              onChange={setShowMatching}
            />
          </div>

          <OsmChangeList
            changes={proposal.changes}
            selected={selection.keys}
            showMatching={showMatching}
            onToggle={selection.toggle}
          />
        </>
      ) : (
        <ContainerEmptyState>
          OpenStreetMap reports nothing this airport does not already hold. There is nothing to apply.
        </ContainerEmptyState>
      )}
    </div>
  );
}

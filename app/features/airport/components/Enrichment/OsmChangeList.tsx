import React from "react";
import { OsmChangeRow } from "~/features/airport/components/Enrichment/OsmChangeRow";
import { groupProposalByResource, writesRecords } from "~/features/airport/lib/osmProposal";
import type { OsmProposedChange } from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  changes: OsmProposedChange[];
  selected: ReadonlySet<string>;
  showMatching: boolean;
  onToggle: (change: OsmProposedChange) => void;
};

function requirementsOf(changes: OsmProposedChange[], change: OsmProposedChange): OsmProposedChange[] {
  return change.requires
    .map((key) => changes.find((candidate) => candidate.key === key))
    .filter((required): required is OsmProposedChange => required !== undefined);
}

export function OsmChangeList({ changes, selected, showMatching, onToggle }: Props) {
  const groups = groupProposalByResource(changes)
    .map((group) => ({
      ...group,
      changes: showMatching ? group.changes : group.changes.filter(writesRecords),
    }))
    .filter((group) => group.changes.length > 0);

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <Container
          key={group.resource}
          padding="none"
          header={
            <CardHeader
              title={toHuman.airport.osm.resource(group.resource)}
              actions={
                group.writingCount > 0 ? (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <span className="font-mono tabular-nums">{group.writingCount}</span>{" "}
                    {group.writingCount === 1 ? "change" : "changes"}
                  </span>
                ) : undefined
              }
            />
          }
        >
          <ul className="flex flex-col">
            {group.changes.map((change) => (
              <OsmChangeRow
                key={change.key}
                change={change}
                requirements={requirementsOf(changes, change)}
                isSelected={selected.has(change.key)}
                onToggle={() => onToggle(change)}
              />
            ))}
          </ul>
        </Container>
      ))}
    </div>
  );
}

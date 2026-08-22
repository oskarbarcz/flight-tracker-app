import { Alert, Badge } from "flowbite-react";
import React from "react";
import { HiExclamationCircle } from "react-icons/hi";
import {
  type AirportOsmPushResult,
  type OsmProposedChange,
  type OsmPushedChange,
  OsmPushOutcome,
} from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const OUTCOME_TONE = {
  [OsmPushOutcome.Added]: "success",
  [OsmPushOutcome.Updated]: "success",
  [OsmPushOutcome.Removed]: "success",
  [OsmPushOutcome.Skipped]: "gray",
  [OsmPushOutcome.Failed]: "failure",
} as const;

type Props = {
  result: AirportOsmPushResult;
  changes: OsmProposedChange[];
};

function OutcomeRow({ pushed, change }: { pushed: OsmPushedChange; change: OsmProposedChange | undefined }) {
  return (
    <li className="flex flex-col gap-1 border-b border-gray-200 px-3.5 py-2.5 last:border-b-0 dark:border-gray-800">
      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <Badge color={OUTCOME_TONE[pushed.outcome]} size="xs">
          {toHuman.airport.osm.pushOutcome(pushed.outcome)}
        </Badge>
        {change === undefined ? (
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{pushed.key}</span>
        ) : (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {toHuman.airport.osm.record(change.resource)}{" "}
            <span className="font-mono font-bold text-gray-900 dark:text-white">{change.label}</span>
          </span>
        )}
      </span>
      {pushed.reason !== null && pushed.reason !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{pushed.reason}</span>
      )}
    </li>
  );
}

export function OsmPushReport({ result, changes }: Props) {
  const { totals } = result;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 sm:grid-cols-5 dark:border-gray-800 dark:bg-gray-900/40">
        <StatBlock label="Added" value={totals.added} />
        <StatBlock label="Updated" value={totals.updated} />
        <StatBlock label="Removed" value={totals.removed} />
        <StatBlock label="Skipped" value={totals.skipped} />
        <StatBlock label="Failed" value={totals.failed} />
      </div>

      {totals.failed > 0 && (
        <Alert color="failure" icon={HiExclamationCircle}>
          {totals.failed === 1
            ? "One change could not be applied. Its reason is given below."
            : `${totals.failed} changes could not be applied. The reason is given against each one below.`}
        </Alert>
      )}

      <Container padding="none" header={<CardHeader title="Outcome" />}>
        <ul className="flex flex-col">
          {result.changes.map((pushed) => (
            <OutcomeRow key={pushed.key} pushed={pushed} change={changes.find((change) => change.key === pushed.key)} />
          ))}
        </ul>
      </Container>
    </div>
  );
}

import React from "react";
import type { CabinLayoutSyncResult } from "~/features/cabin-layout/model";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  result: CabinLayoutSyncResult | null;
};

function changeSummary(result: CabinLayoutSyncResult): string {
  const changes = [
    result.created > 0 ? `${result.created} added` : null,
    result.retired > 0 ? `${result.retired} withdrawn` : null,
    result.restored > 0 ? `${result.restored} published again` : null,
  ].filter((change) => change !== null);

  return changes.length === 0 ? "Nothing changed." : `${changes.join(", ")}.`;
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}

export function CatalogueRefreshResult({ result }: Props) {
  return (
    <Container padding="condensed" header={<CardHeader title="Last refresh" />}>
      <div aria-live="polite">
        {result === null ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            LOPA could not be reached, so the catalogue is unchanged.
          </p>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{changeSummary(result)}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-6">
              <Count label="Reported" value={result.reported} />
              <Count label="Catalogued" value={result.catalogued} />
              <Count label="Added" value={result.created} />
              <Count label="Withdrawn" value={result.retired} />
              <Count label="Republished" value={result.restored} />
              <Count label="Unreadable" value={result.skipped} />
            </dl>
          </>
        )}
      </div>
    </Container>
  );
}

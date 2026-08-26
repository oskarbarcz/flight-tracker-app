import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlinePrinter } from "react-icons/hi";
import { ColdChainRisk } from "~/features/cargo-manifest/model";
import type { Flight } from "~/features/flight/model";
import { ColdChainRow } from "~/features/notoc/components/ColdChainRow";
import { DangerousGoodsEntry } from "~/features/notoc/components/DangerousGoodsEntry";
import { NotocAcknowledgement } from "~/features/notoc/components/NotocAcknowledgement";
import { NotocChangesSummary } from "~/features/notoc/components/NotocChangesSummary";
import { NotocDocumentForm } from "~/features/notoc/components/NotocDocumentForm";
import { NotocIssuedAt } from "~/features/notoc/components/NotocIssuedAt";
import { NotocLoadSummary } from "~/features/notoc/components/NotocLoadSummary";
import { NotocStatement } from "~/features/notoc/components/NotocStatement";
import { NotocUnavailableState } from "~/features/notoc/components/NotocUnavailableState";
import { SpecialLoadRow } from "~/features/notoc/components/SpecialLoadRow";
import { useFlightNotoc } from "~/features/notoc/hooks/useFlightNotoc";
import { byRisk, imposesRisk } from "~/features/notoc/lib/specialLoadRisk";
import { toHuman } from "~/i18n/translate";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type Props = {
  flight: Flight;
};

export function NotocConfirmationStep({ flight }: Props) {
  const state = useFlightNotoc(flight);
  const [asDocument, setAsDocument] = useState(false);

  if (state.status === "loading") {
    return <LoadingData />;
  }

  if (state.status === "unavailable") {
    return <NotocUnavailableState gap={state.gap} />;
  }

  const { notoc } = state;
  const notocDocument = notoc.document;
  const hasCuratedHold = flight.aircraft.holdVariant !== null;
  const sortedLoads = byRisk(notocDocument.specialLoads);
  const briefedLoads = sortedLoads.filter(imposesRisk);
  const routineLoads = sortedLoads.filter((load) => !imposesRisk(load));
  const briefedChain = notocDocument.coldChain.filter((entry) => entry.risk !== ColdChainRisk.Low);
  const routineChain = notocDocument.coldChain.filter((entry) => entry.risk === ColdChainRisk.Low);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FormSectionLabel>Notification to captain</FormSectionLabel>
        <div className="flex gap-2">
          <Button color="alternative" size="xs" onClick={() => setAsDocument(!asDocument)}>
            {asDocument ? "View as panel" : "View as document"}
          </Button>
          {asDocument && (
            <Button color="indigo" size="xs" onClick={() => window.print()}>
              <HiOutlinePrinter className="me-1.5 size-4" />
              Print
            </Button>
          )}
        </div>
      </div>

      {asDocument ? (
        <div className="rounded-xl bg-gray-200 p-4 dark:bg-gray-900">
          <NotocDocumentForm notoc={notoc} flightNumber={flight.flightNumberWithoutSpaces} acknowledgedByName={null} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {toHuman.notoc.stage(notoc.stage)} notification, issued <NotocIssuedAt at={notoc.issuedAt} />
            </p>
            {notocDocument.dangerousGoods.length === 0 && (
              <NotocStatement statement={notocDocument.statement} carriesDangerousGoods={false} />
            )}
            <NotocAcknowledgement acknowledgedById={notoc.acknowledgedById} acknowledgedAt={notoc.acknowledgedAt} />
            {notoc.changes !== null && <NotocChangesSummary changes={notoc.changes} />}
          </div>

          {notocDocument.dangerousGoods.length > 0 && (
            <section className="flex flex-col gap-3">
              <FormSectionLabel>Dangerous goods</FormSectionLabel>
              {notocDocument.dangerousGoods.map((entry) => (
                <DangerousGoodsEntry
                  key={`${entry.awb}-${entry.unNumber}`}
                  entry={entry}
                  hasCuratedHold={hasCuratedHold}
                />
              ))}
            </section>
          )}

          {sortedLoads.length > 0 && (
            <section className="flex flex-col gap-1">
              <FormSectionLabel>Special loads</FormSectionLabel>
              {briefedLoads.map((load) => (
                <SpecialLoadRow
                  key={`${load.awb}-${load.position ?? "loose"}`}
                  load={load}
                  hasCuratedHold={hasCuratedHold}
                />
              ))}

              {routineLoads.length > 0 && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                    {routineLoads.length === 1
                      ? "1 further load, no operational risk"
                      : `${routineLoads.length} further loads, no operational risk`}
                  </summary>
                  <div className="mt-1 flex flex-col gap-1">
                    {routineLoads.map((load) => (
                      <SpecialLoadRow
                        key={`${load.awb}-${load.position ?? "loose"}`}
                        load={load}
                        hasCuratedHold={hasCuratedHold}
                      />
                    ))}
                  </div>
                </details>
              )}
            </section>
          )}

          {notocDocument.coldChain.length > 0 && (
            <section className="flex flex-col gap-1">
              <FormSectionLabel>Cold chain assessments</FormSectionLabel>
              {briefedChain.map((assessment) => (
                <ColdChainRow key={assessment.awb} assessment={assessment} />
              ))}

              {routineChain.length > 0 && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                    {routineChain.length === 1
                      ? "1 further consignment, low risk and advisory only"
                      : `${routineChain.length} further consignments, low risk and advisory only`}
                  </summary>
                  <div className="mt-1 flex flex-col gap-1">
                    {routineChain.map((assessment) => (
                      <ColdChainRow key={assessment.awb} assessment={assessment} />
                    ))}
                  </div>
                </details>
              )}
            </section>
          )}

          <section className="flex flex-col gap-3">
            <FormSectionLabel>Load summary</FormSectionLabel>
            <NotocLoadSummary summary={notocDocument.summary} />
          </section>
        </div>
      )}
    </div>
  );
}

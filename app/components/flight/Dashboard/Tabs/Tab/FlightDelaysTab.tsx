import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaClock, FaPlus } from "react-icons/fa6";
import { DelaySummary } from "~/components/flight/Dashboard/Delay/DelaySummary";
import { FileDelayReportModal } from "~/components/flight/Dashboard/Delay/FileDelayReportModal";
import { RemoveDelayReportConfirmModal } from "~/components/flight/Dashboard/Delay/RemoveDelayReportConfirmModal";
import { type DelayReport, FlightStatus } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

const DEPARTED_STATUSES: ReadonlySet<FlightStatus> = new Set([
  FlightStatus.TaxiingOut,
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
  FlightStatus.Closed,
]);

export function FlightDelaysTab() {
  const { flight, delayRequest } = useTrackedFlight();
  const [filing, setFiling] = useState(false);
  const [reportToRemove, setReportToRemove] = useState<DelayReport | null>(null);

  const canFile = Boolean(delayRequest) && !delayRequest?.isSettled && (delayRequest?.unallocatedMinutes ?? 0) > 0;
  const hasDeparted = flight ? DEPARTED_STATUSES.has(flight.status) : false;

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed">
        <ContainerTitle
          icon={FaClock}
          title="Delay allocation"
          actions={
            delayRequest ? (
              <Button color="blue" onClick={() => setFiling(true)} disabled={!canFile}>
                <FaPlus className="me-1.5" />
                File delay report
              </Button>
            ) : null
          }
        />

        {delayRequest ? (
          <DelaySummary delayRequest={delayRequest} onRemove={setReportToRemove} />
        ) : hasDeparted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
            Flight departed on time, safe travels! ✈️
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nothing to report yet. Delays over 3 minutes appear here once the flight is off-block.
          </p>
        )}
      </Container>

      {filing && delayRequest && (
        <FileDelayReportModal maxMinutes={delayRequest.unallocatedMinutes} close={() => setFiling(false)} />
      )}
      {reportToRemove && (
        <RemoveDelayReportConfirmModal report={reportToRemove} close={() => setReportToRemove(null)} />
      )}
    </div>
  );
}

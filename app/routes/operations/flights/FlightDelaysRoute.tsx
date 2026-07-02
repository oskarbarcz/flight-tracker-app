import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa6";
import { useToast } from "~/app-state/useToast";
import { DelaySummary } from "~/features/delay/components/DelaySummary";
import { RejectDelayReportModal } from "~/features/delay/components/RejectDelayReportModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import type { DelayReport } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

export default function FlightDelaysRoute() {
  const { delayRequest, acceptDelayReport } = useTrackedFlight();
  const { error, success } = useToast();
  const [reportToReject, setReportToReject] = useState<DelayReport | null>(null);

  const handleAccept = async (report: DelayReport) => {
    try {
      await acceptDelayReport(report.id);
      success("Delay report accepted.");
    } catch (err) {
      const message = (err as { error?: string } | null)?.error ?? "Failed to accept delay report.";
      error(message);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed">
        <ContainerTitle icon={FaRegClock} title="Delays" />

        {delayRequest ? (
          <DelaySummary delayRequest={delayRequest} onAccept={handleAccept} onReject={setReportToReject} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No delay has been recorded for this flight.</p>
        )}
      </Container>

      {reportToReject && <RejectDelayReportModal report={reportToReject} close={() => setReportToReject(null)} />}
    </div>
  );
}

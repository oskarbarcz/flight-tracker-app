import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { DelayReport } from "~/features/delay";
import { DelaySummary } from "~/features/delay/components/DelaySummary";
import { RejectDelayReportModal } from "~/features/delay/components/RejectDelayReportModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

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
      <Container padding="condensed" header={<CardHeader title="Delays" />}>
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

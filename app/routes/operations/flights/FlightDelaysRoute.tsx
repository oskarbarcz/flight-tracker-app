"use client";

import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa6";
import { DelaySummary } from "~/components/flight/Dashboard/Delay/DelaySummary";
import { RejectDelayReportModal } from "~/components/flight/Dashboard/Delay/RejectDelayReportModal";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import type { DelayReport } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";

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
        <ContainerTitle
          icon={FaRegClock}
          title="Delays"
          description="Review coded delay reports filed by the crew. Accept them or send them back to be amended."
        />

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

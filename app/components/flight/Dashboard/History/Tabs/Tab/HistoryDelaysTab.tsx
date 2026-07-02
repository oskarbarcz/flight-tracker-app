import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";
import { DelaySummary } from "~/components/flight/Dashboard/Delay/DelaySummary";
import type { DelayRequest } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useApi } from "~/state/api/context/useApi";

type Props = {
  flightId: string;
};

export function HistoryDelaysTab({ flightId }: Props) {
  const { delayService } = useApi();
  const [delayRequest, setDelayRequest] = useState<DelayRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    delayService
      .getByFlight(flightId)
      .then((request) => {
        if (!cancelled) setDelayRequest(request);
      })
      .catch((error) => console.error("Failed to load delay allocation", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [delayService, flightId]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed">
        <ContainerTitle icon={FaClock} title="Delay allocation" />

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : delayRequest ? (
          <DelaySummary delayRequest={delayRequest} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No delay was allocated on this flight.</p>
        )}
      </Container>
    </div>
  );
}

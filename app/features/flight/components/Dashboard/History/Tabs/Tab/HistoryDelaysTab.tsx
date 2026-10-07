import React, { useEffect, useState } from "react";
import type { DelayRequest } from "~/features/delay";
import { DelaySummary } from "~/features/delay/components/DelaySummary";
import { useApi } from "~/shared/api/useApi";
import { LoadFailedState } from "~/shared/ui/Display/LoadFailedState";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flightId: string;
};

export function HistoryDelaysTab({ flightId }: Props) {
  const { delayService } = useApi();
  const [delayRequest, setDelayRequest] = useState<DelayRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    delayService
      .getByFlight(flightId)
      .then((request) => {
        if (!cancelled) setDelayRequest(request);
      })
      .catch((error) => {
        console.error("Failed to load delay allocation", error);
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [delayService, flightId]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed" header={<CardHeader title="Delay allocation" />}>
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : loadFailed ? (
          <LoadFailedState title="Delay allocation could not be retrieved." />
        ) : delayRequest ? (
          <DelaySummary delayRequest={delayRequest} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No delay was allocated on this flight.</p>
        )}
      </Container>
    </div>
  );
}

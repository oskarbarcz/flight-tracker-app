import { useCallback, useEffect } from "react";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { shouldPollForAdsbData } from "~/features/flight";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { hasLivePosition } from "~/features/flight/lib/flightAutomation";

const POLL_INTERVAL_MS = 5000;

export function useTrackedFlightAdsb(): void {
  const { flight, events } = useTrackedFlight();
  const { setCallsign, loadFlightPath } = useAdsbData();
  const hasLivePositionReceived = hasLivePosition(events);

  const fetchFlight = useCallback(async () => {
    if (!flight) return;

    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status, hasLivePositionReceived)) return;

    fetchFlight().then();
  }, [fetchFlight, flight, hasLivePositionReceived]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status, hasLivePositionReceived)) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight, hasLivePositionReceived]);
}

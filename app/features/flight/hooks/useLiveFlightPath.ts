import { useCallback, useEffect } from "react";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { type Flight, type FlightPathElement, isInFlightStatus } from "~/features/flight";

const POLL_INTERVAL_MS = 5000;
const NO_PATH: FlightPathElement[] = [];

export function useLiveFlightPath(flight: Flight): FlightPathElement[] {
  const { setCallsign, loadFlightPath, flightPath } = useAdsbData();
  const inFlight = isInFlightStatus(flight.status);

  const fetchPath = useCallback(async () => {
    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight.callsign, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!inFlight) return;
    fetchPath().then();
    const intervalId = setInterval(() => fetchPath().then(), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [inFlight, fetchPath]);

  return inFlight ? flightPath : NO_PATH;
}

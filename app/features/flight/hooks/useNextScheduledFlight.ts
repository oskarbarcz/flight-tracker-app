import { useEffect, useMemo, useState } from "react";
import { type Flight, FlightListOrder, FlightListSort, FlightPhase, FlightStatus } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

type Response = {
  nextFlight: Flight | null;
  loading: boolean;
  failed: boolean;
};

const UPCOMING_PAGE_SIZE = 100;

export function useNextScheduledFlight(currentFlightId: string | null): Response {
  const { flightService } = useApi();
  const [upcoming, setUpcoming] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    flightService
      .fetchAllFlights({
        phase: FlightPhase.Upcoming,
        sort: FlightListSort.ScheduledOffBlockTime,
        order: FlightListOrder.Ascending,
        limit: UPCOMING_PAGE_SIZE,
      })
      .then((res) => {
        setUpcoming(res.flights);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Cannot fetch upcoming flights", err);
        setUpcoming([]);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, [flightService]);

  const nextFlight = useMemo(
    () => upcoming.find((flight) => flight.status === FlightStatus.Ready && flight.id !== currentFlightId) ?? null,
    [upcoming, currentFlightId],
  );

  return { nextFlight, loading, failed };
}

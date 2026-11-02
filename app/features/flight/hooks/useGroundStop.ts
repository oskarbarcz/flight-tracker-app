import { useEffect, useState } from "react";
import type { Airport } from "~/features/airport";
import type { Flight } from "~/features/flight";
import { onBlockEvent, resolveBlockEvents } from "~/features/flight/lib/blockEvents";
import { TravelType, type UserTravel, type UserTravelAirport } from "~/features/travel";
import { useApi } from "~/shared/api/useApi";

export type GroundStop = {
  airport: Airport;
  since: Date | null;
  sinceEvent: "On-block" | "Arrival";
  arrivedOn: Flight | null;
};

type Response = {
  groundStop: GroundStop | null;
  loading: boolean;
};

type FetchedAirport = {
  id: string;
  airport: Airport | null;
};

function arrivalFlight(location: UserTravelAirport, latestTravel: UserTravel | null, lastFlight: Flight | null) {
  if (!lastFlight || !latestTravel) return null;
  if (latestTravel.type !== TravelType.PerformingFlight || latestTravel.flightId !== lastFlight.id) return null;

  return lastFlight.destinationAirport.id === location.id ? lastFlight : null;
}

function groundSince(arrivedOn: Flight | null, latestTravel: UserTravel | null): Date | null {
  if (arrivedOn) return onBlockEvent(resolveBlockEvents(arrivedOn.timesheet)).time;
  if (!latestTravel) return null;

  return latestTravel.updatedAt ?? latestTravel.createdAt;
}

export function useGroundStop(
  location: UserTravelAirport | null,
  latestTravel: UserTravel | null,
  lastFlight: Flight | null,
): Response {
  const { airportService } = useApi();
  const knownAirport =
    location && lastFlight?.destinationAirport.id === location.id ? lastFlight.destinationAirport : null;
  const [fetched, setFetched] = useState<FetchedAirport | null>(null);

  useEffect(() => {
    if (!location || knownAirport) return;

    let cancelled = false;
    airportService
      .fetchById(location.id)
      .then((airport) => !cancelled && setFetched({ id: location.id, airport }))
      .catch((err) => {
        console.error("Cannot fetch the current airport", err);
        if (!cancelled) setFetched({ id: location.id, airport: null });
      });

    return () => {
      cancelled = true;
    };
  }, [airportService, location, knownAirport]);

  if (!location) {
    return { groundStop: null, loading: false };
  }

  const fetchedHere = fetched?.id === location.id ? fetched : null;
  const airport = knownAirport ?? fetchedHere?.airport ?? null;
  const loading = knownAirport === null && fetchedHere === null;

  if (!airport) {
    return { groundStop: null, loading };
  }

  const arrivedOn = arrivalFlight(location, latestTravel, lastFlight);

  return {
    groundStop: {
      airport,
      since: groundSince(arrivedOn, latestTravel),
      sinceEvent: arrivedOn ? "On-block" : "Arrival",
      arrivedOn,
    },
    loading,
  };
}

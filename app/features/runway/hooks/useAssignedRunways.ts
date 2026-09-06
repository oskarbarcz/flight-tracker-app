import { useEffect, useState } from "react";
import type { Flight } from "~/features/flight";
import type { Runway } from "~/features/runway/model";
import { useApi } from "~/shared/api/useApi";

export type AssignedRunways = {
  departure: Runway | null;
  arrival: Runway | null;
};

const NONE: AssignedRunways = { departure: null, arrival: null };

export function useAssignedRunways(flight: Flight | null): AssignedRunways {
  const { runwayService } = useApi();
  const [runways, setRunways] = useState<AssignedRunways>(NONE);

  const departureAirportId = flight?.departureAirport.id ?? null;
  const destinationAirportId = flight?.destinationAirport.id ?? null;
  const departureRunwayId = flight?.departureRunwayId ?? null;
  const arrivalRunwayId = flight?.arrivalRunwayId ?? null;

  useEffect(() => {
    if (departureAirportId === null || destinationAirportId === null) {
      setRunways(NONE);
      return;
    }

    if (departureRunwayId === null && arrivalRunwayId === null) {
      setRunways(NONE);
      return;
    }

    let cancelled = false;

    Promise.all([
      departureRunwayId === null ? null : runwayService.fetchById(departureAirportId, departureRunwayId),
      arrivalRunwayId === null ? null : runwayService.fetchById(destinationAirportId, arrivalRunwayId),
    ])
      .then(([departure, arrival]) => {
        if (!cancelled) {
          setRunways({ departure, arrival });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRunways(NONE);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [departureAirportId, destinationAirportId, departureRunwayId, arrivalRunwayId, runwayService]);

  return runways;
}

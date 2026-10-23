import { useEffect, useState } from "react";
import { useApi } from "~/shared/api/useApi";

export function useFlightNumber(flightId: string | null): string | undefined {
  const { flightService } = useApi();
  const [flightNumber, setFlightNumber] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (flightId === null) {
      setFlightNumber(undefined);
      return;
    }

    let active = true;

    flightService
      .fetchById(flightId)
      .then((flight) => {
        if (active) {
          setFlightNumber(flight.flightNumberWithoutSpaces);
        }
      })
      .catch((err) => {
        console.error("Cannot fetch travel flight", err);
        if (active) {
          setFlightNumber(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [flightService, flightId]);

  return flightNumber;
}

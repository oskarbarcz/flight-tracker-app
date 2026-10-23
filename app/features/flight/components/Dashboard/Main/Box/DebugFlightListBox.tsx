import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

export function DebugFlightListBox() {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    flightService
      .fetchAllFlights()
      .then((res) => setFlights(res.flights))
      .catch((err) => console.error("Cannot fetch debug flight list", err));
  }, [flightService]);

  return (
    <Container padding="condensed" header={<CardHeader title="Flight list [debug]" />}>
      <div className="flex flex-col gap-1">
        {flights.map((flight) => {
          const tags: string[] = [flight.status, flight.tracking];
          if (flight.hasActiveEmergency) tags.push("emergency");
          if (flight.isFlightDiverted) tags.push("diverted");
          return (
            <Link
              key={flight.id}
              to={`/track/${flight.id}`}
              className="block font-mono text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500"
              viewTransition
            >
              {flight.flightNumber} [{tags.join(", ")}]
            </Link>
          );
        })}
      </div>
    </Container>
  );
}

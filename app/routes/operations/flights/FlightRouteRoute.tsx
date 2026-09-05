import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightRouteRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { FlightService } from "~/features/flight/service";
import { RouteBriefingPanel } from "~/features/route/components/RouteBriefingPanel";
import { RouteBriefingProvider } from "~/features/route/hooks/useRouteBriefing";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightRouteRoute() {
  const { flight } = useLoaderData<typeof clientLoader>();
  usePageTitle(`Route ${flight.flightNumber}`);

  return (
    <RouteBriefingProvider flight={flight}>
      <RouteBriefingPanel
        flight={flight}
        alternatesHref={`/flights/${flight.id}/emergencies`}
        airportHref={(airportId) => `/airports/${airportId}`}
      />
    </RouteBriefingProvider>
  );
}

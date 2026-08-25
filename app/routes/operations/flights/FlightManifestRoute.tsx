import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightManifestRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { FlightManifestPanel } from "~/features/flight/components/Cabin/FlightManifestPanel";
import { FlightService } from "~/features/flight/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightManifestRoute() {
  const { flight } = useLoaderData<typeof clientLoader>();
  usePageTitle(`Manifest ${flight.flightNumber}`);

  return (
    <FlightManifestPanel
      flight={flight}
      aircraftHref={`/operators/${flight.operator.id}/aircraft/${flight.aircraft.id}/seat-layout`}
    />
  );
}

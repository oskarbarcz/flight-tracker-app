import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightManifestRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { FlightManifestPanel } from "~/features/flight/components/Cabin/FlightManifestPanel";
import { FlightService } from "~/features/flight/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const service = new FlightService();
  const [flight, loadsheets] = await Promise.all([service.fetchById(params.id), service.fetchLoadsheets(params.id)]);
  return { flight, loadsheets };
}

export default function FlightManifestRoute() {
  const { flight, loadsheets } = useLoaderData<typeof clientLoader>();
  usePageTitle(`Manifest ${flight.flightNumber}`);

  return (
    <FlightManifestPanel
      flight={flight}
      loadsheets={loadsheets}
      aircraftHref={`/operators/${flight.operator.id}/aircraft/${flight.aircraft.id}/seat-layout`}
    />
  );
}

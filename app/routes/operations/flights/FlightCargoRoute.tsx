import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightCargoRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { FlightCargoPanel } from "~/features/cargo-manifest/components/FlightCargoPanel";
import { FlightService } from "~/features/flight/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightCargoRoute() {
  const { flight } = useLoaderData<typeof clientLoader>();
  usePageTitle(`Cargo ${flight.flightNumber}`);

  return <FlightCargoPanel flight={flight} />;
}

'use client';

import { AppNavigation } from "~/components/AppNavigation/AppNavigation";
import { Flowbite } from "flowbite-react";
import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { TrackFlightDashboard } from "~/components/TrackedFlightDashboard/TrackFlightDashboard";
import {useLoaderData} from "react-router";
import {ScheduledFlightsListElement} from "~/models";
import {FlightService} from "~/state/services/flight.service";
import {Route} from "../../.react-router/types/app/routes/+types/FlightTracking";

export function meta() {
  return [
    { title: "Tracking | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export async function clientLoader({params}: Route.ClientLoaderArgs): Promise<ScheduledFlightsListElement> {
  return FlightService.fetchFlightById(params.flightId);
}

export default function FlightTracking() {
  const flight = useLoaderData<typeof clientLoader>();

  if (flight === undefined) {
    return;
  }

  return (
    <Flowbite>
      <AppNavigation></AppNavigation>
      <FlightStateProvider>
        <TrackFlightDashboard flight={flight} />
      </FlightStateProvider>
    </Flowbite>
  );
}

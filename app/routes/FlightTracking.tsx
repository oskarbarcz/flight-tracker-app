import type { Route } from "./+types/Home";
import {AppNavigation} from "~/components/AppNavigation/AppNavigation";
import {Flowbite} from "flowbite-react";
import React from "react";
import {FlightStateProvider} from "~/state/contexts/flight.state";
import {TrackFlightDashboard} from "~/components/TrackedFlightDashboard/TrackFlightDashboard";
import {useParams} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tracking | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

type FlightTrackingParams = {
  readonly flightNumber: string;
}

export default function FlightTracking() {
  let { flightNumber } = useParams<FlightTrackingParams>();

  if(flightNumber === undefined) {
    return;
  }

  return (
    <Flowbite>
      <AppNavigation></AppNavigation>
      <FlightStateProvider>
        <TrackFlightDashboard flightNumber={flightNumber}/>
      </FlightStateProvider>
    </Flowbite>
  );
}

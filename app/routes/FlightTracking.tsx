import type { Route } from "./+types/Home";
import {AppNavigation} from "~/components/AppNavigation/AppNavigation";
import {Flowbite} from "flowbite-react";
import React from "react";
import {FlightStateProvider} from "~/state/contexts/flight.state";
import {TrackFlightDashboard} from "~/components/TrackedFlightDashboard/TrackFlightDashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tracking | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function FlightTracking() {
  return (
    <Flowbite>
      <AppNavigation></AppNavigation>
      <FlightStateProvider>
        <TrackFlightDashboard flightNumber="LH415"/>
      </FlightStateProvider>
    </Flowbite>
  );
}

import type { Route } from "./+types/home";
import {AppNavigation} from "~/components/AppNavigation/AppNavigation";
import {Flowbite} from "flowbite-react";
import React from "react";
import {getOneFlight} from "~/store/flight-provider";
import changePageTitle from "~/common/change-page-title";
import FlightAirports from "~/components/FlightAirports/FlightAirports";
import TrackedFlightTimesheet from "~/components/TrackedFlightTimesheet/TrackedFlightTimesheet";
import TrackedFlightDetails from "~/components/TrackedFlightDetails/TrackedFlightDetails";
import TrackedFlightAircraftDetails from "~/components/TrackedFlightAircraftDetails/TrackedFlightAircraftDetails";
import TrackedFlightStatus from "~/components/TrackedFlightStatus/TrackedFlightStatus";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tracking | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function FlightTracking() {
  const flight = getOneFlight();
  changePageTitle(`Tracking ${flight.flightNumber}`)

  return <Flowbite>
    <AppNavigation></AppNavigation>
    <div className="container mx-auto py-4 text-gray-800 dark:text-white">
      <div>
        <TrackedFlightStatus callsign={flight.callsign} flightNumber={flight.flightNumber} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FlightAirports departure={flight.departure} arrival={flight.arrival} />
          <TrackedFlightTimesheet scheduled={flight.timesheet.scheduled} />
        </div>
        <div>
          <TrackedFlightDetails callsign={flight.callsign} flightNumber={flight.flightNumber} />
          <TrackedFlightAircraftDetails aircraft={flight.aircraft} operator={flight.operator} />
        </div>
      </div>
    </div>
  </Flowbite>;
}

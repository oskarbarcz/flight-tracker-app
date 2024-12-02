import type { Route } from "./+types/home";
import {AppNavigation} from "~/components/app-navigation/app-navigation";
import {Flowbite} from "flowbite-react";
import React from "react";
import getFlight from "~/store/flight-provider";
import changePageTitle from "~/common/change-page-title";
import FlightAirports from "~/components/flight-airports/flight-airports";
import FlightTimesheet from "~/components/flight-timesheet/flight-timesheet";
import TrackedFlightDetails from "~/components/tracked-flight-details/tracked-flight-details";
import TrackedFlightAircraftDetails from "~/components/tracked-flight-aircraft-details/tracked-flight-aircraft-details";
import TrackedFlightStatus from "~/components/tracked-flight-status/tracked-flight-status";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tracking | Flight Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function TrackFlight() {
  const flight = getFlight();
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
          <FlightTimesheet scheduled={flight.timesheet.scheduled} />
        </div>
        <div>
          <TrackedFlightDetails callsign={flight.callsign} flightNumber={flight.flightNumber} />
          <TrackedFlightAircraftDetails aircraft={flight.aircraft} operator={flight.operator} />
        </div>
      </div>
    </div>
  </Flowbite>;
}

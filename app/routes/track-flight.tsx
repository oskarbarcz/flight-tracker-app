import type { Route } from "./+types/home";
import {AppNavigation} from "~/components/app-navigation/app-navigation";
import {Flowbite} from "flowbite-react";
import React from "react";
import getFlight from "~/store/flight-provider";
import changePageTitle from "~/common/change-page-title";
import FlightAirports from "~/components/flight-airports/flight-airports";
import FlightTimesheet from "~/components/flight-timesheet/flight-timesheet";

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
    <div className="container mx-auto py-4 text-gray-950 dark:text-white">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FlightAirports departure={flight.departure} arrival={flight.arrival} />
          <FlightTimesheet scheduled={flight.timesheet.scheduled}></FlightTimesheet>
        </div>
        <div>

        </div>
      </div>
    </div>
  </Flowbite>;
}

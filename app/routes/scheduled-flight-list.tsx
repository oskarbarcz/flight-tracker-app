import type { Route } from "./+types/home";
import {AppNavigation} from "~/components/app-navigation/app-navigation";
import {Flowbite, Table} from "flowbite-react";
import React from "react";
import {getFlightsList} from "~/store/flight-provider";
import Flight from "~/model/flight";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Scheduled flights | Flight Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function ScheduledFlightList() {
  const flights = getFlightsList();

  const hourFormatter = new Intl.DateTimeFormat('pl-pl', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dayFormatter = new Intl.DateTimeFormat('pl-pl', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',

  });

  return <Flowbite>
    <AppNavigation></AppNavigation>
    <div className="container mx-auto py-4 text-gray-800 dark:text-white">
      <Table>
        <Table.Head>
          <Table.HeadCell>Flight no</Table.HeadCell>
          <Table.HeadCell>Route</Table.HeadCell>
          <Table.HeadCell>Departure</Table.HeadCell>
          <Table.HeadCell>Block time</Table.HeadCell>
          <Table.HeadCell>Arrival</Table.HeadCell>
          <Table.HeadCell>Aircraft</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {flights.map((flight: Flight, i: number) => <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell key={i} className="font-medium text-gray-900 dark:text-white">
              {flight.flightNumber}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center">
                {flight.departure.icao}
                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"/>
                </svg>
                {flight.arrival.icao}
              </div>

            </Table.Cell>
            <Table.Cell>
              <div>{hourFormatter.format(flight.timesheet.scheduled?.takeoffTime)}</div>
              <div>{dayFormatter.format(flight.timesheet.scheduled?.takeoffTime)}</div>
            </Table.Cell>
            <Table.Cell>
              {flight.timesheet.scheduled?.blockTime}
            </Table.Cell>
            <Table.Cell>
              <div>{hourFormatter.format(flight.timesheet.scheduled?.landingTime)}</div>
              <div>{dayFormatter.format(flight.timesheet.scheduled?.landingTime)}</div>
            </Table.Cell>
            <Table.Cell>
              <div>
                {flight.aircraft.shortName}
              </div>
                {flight.aircraft.registration}
            </Table.Cell>
            <Table.Cell>
              <a href="#" className="font-bold uppercase text-green-400 hover:underline dark:text-green-600">
                Ready to check-in
              </a>
            </Table.Cell>
          </Table.Row>)}
        </Table.Body>
      </Table>
    </div>
  </Flowbite>;
}

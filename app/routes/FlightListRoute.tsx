"use client";

import { AppNavigation } from "~/components/AppNavigation/AppNavigation";
import { Flowbite, Table } from "flowbite-react";
import React from "react";
import { ScheduledFlightsListElement } from "~/models/flight.model";
import ProtectedRoute from "~/routes/ProtectedRoute";
import { FlightService } from "~/state/services/flight.service";
import { Link, useLoaderData } from "react-router";

export function meta() {
  return [
    { title: "Scheduled flights | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export async function clientLoader(): Promise<ScheduledFlightsListElement[]> {
  return FlightService.fetchAllFlights();
}

export default function FlightListRoute() {
  const flights: ScheduledFlightsListElement[] =
    useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute>
      <Flowbite>
        <AppNavigation></AppNavigation>
        <div className="container mx-auto py-4 text-gray-800 dark:text-white">
          <Table className="shadow">
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
              {Array.isArray(flights) &&
                flights.map(
                  (flight: ScheduledFlightsListElement, i: number) => (
                    <Table.Row
                      key={i}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        {flight.flightNumber}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center">
                          {
                            flight.airports.find(
                              (airport) => airport.type === "departure",
                            )?.icaoCode
                          }
                          <svg
                            className="w-4 h-4 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 12H5m14 0-4 4m4-4-4-4"
                            />
                          </svg>
                          {
                            flight.airports.find(
                              (airport) => airport.type === "destination",
                            )?.icaoCode
                          }
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div></div>
                        <div></div>
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>
                        <div>
                          {/*{flight?.timesheet?.scheduled?.arrivalTime.getTime()}*/}
                        </div>
                        <div>
                          {/*{flight?.timesheet?.scheduled?.arrivalTime.getTime()}*/}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{flight.aircraft.shortName}</div>
                        {flight.aircraft.registration}
                      </Table.Cell>
                      <Table.Cell>
                        {flight.status === "ready" ? (
                          <Link
                            className="font-bold uppercase text-green-400 hover:underline dark:text-green-600"
                            to={`/track/${flight.id}`}
                          >
                            Ready to check-in
                          </Link>
                        ) : (
                          <div className="text-gray-500">
                            <span className="font-bold uppercase">
                              {flight.status}
                            </span>
                            <span className="block text-xs">
                              Check in available soon
                            </span>
                          </div>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
            </Table.Body>
          </Table>
        </div>
      </Flowbite>
    </ProtectedRoute>
  );
}
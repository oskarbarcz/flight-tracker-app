"use client";

import { Button, Table } from "flowbite-react";
import { Flight, FlightStatus } from "~/models/flight.model";
import { FlightService } from "~/state/services/flight.service";
import { redirect, useLoaderData } from "react-router";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { FaPlane } from "react-icons/fa";

export function meta() {
  return [
    { title: "Scheduled flights | FlightModel Tracker" },
    { name: "description", content: "This is flights tracker app." },
  ];
}

export async function clientLoader(): Promise<Flight[] | Response> {
  return FlightService.fetchAllFlights().catch(() => redirect("/sign-in"));
}

function dateToHour(date: string | undefined): string {
  if (!date) {
    return "";
  }

  const utcHours = String(new Date(date).getUTCHours()).padStart(2, "0");
  const utcMinutes = String(new Date(date).getUTCMinutes()).padStart(2, "0");

  return `${utcHours}:${utcMinutes}`;
}

export default function FlightsListRoute() {
  const flights = useLoaderData<Flight[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Flights"
          linkText="Create new"
          linkUrl="/flights/new"
        />
        <Table className="mt-4 shadow">
          <Table.Head>
            <Table.HeadCell>Flight no</Table.HeadCell>
            <Table.HeadCell>Route</Table.HeadCell>
            <Table.HeadCell>Schedule (UTC)</Table.HeadCell>
            <Table.HeadCell>Aircraft</Table.HeadCell>
            <Table.HeadCell>Operator</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(flights) &&
              flights.map((flight: Flight, i: number) => (
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
                        className="size-4 text-gray-800 dark:text-white"
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
                    {flight.timesheet.scheduled && (
                      <>
                        <div>
                          <span>
                            <FaPlane className="me-1 inline-block" />
                            {dateToHour(
                              flight.timesheet.scheduled.offBlockTime,
                            )}
                          </span>
                          <span className="ms-2">
                            <FaPlane className="me-1 inline-block -rotate-45" />
                            {dateToHour(flight.timesheet.scheduled.takeoffTime)}
                          </span>
                        </div>
                        <div>
                          <span>
                            <FaPlane className="me-1 inline-block rotate-45" />
                            {dateToHour(flight.timesheet.scheduled.arrivalTime)}
                          </span>
                          <span className="ms-2">
                            <FaPlane className="me-1 inline-block" />
                            {dateToHour(flight.timesheet.scheduled.onBlockTime)}
                          </span>
                        </div>
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div>{flight.aircraft.shortName}</div>
                    {flight.aircraft.registration}
                  </Table.Cell>
                  <Table.Cell>
                    <div>{flight.operator.shortName}</div>
                    {flight.operator.icaoCode}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-gray-500">
                      {flight.status === FlightStatus.Created && (
                        <Button color="success" size="xs">
                          Release for pilot
                        </Button>
                      )}
                      {flight.status === FlightStatus.Ready && (
                        <span className="font-bold uppercase text-green-500">
                          Ready to check-in
                        </span>
                      )}

                      {flight.status !== FlightStatus.Created &&
                        flight.status !== FlightStatus.Ready && (
                          <span className="font-bold uppercase">
                            {flight.status}
                          </span>
                        )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { Button, Table } from "flowbite-react";
import { Flight, FlightStatus } from "~/models/flight.model";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import React, { useEffect } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { FaPlane, FaTrash } from "react-icons/fa";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { usePageTitle } from "~/state/hooks/usePageTitle";

function dateToHour(date: string | undefined): string {
  if (!date) {
    return "";
  }

  const utcHours = String(new Date(date).getUTCHours()).padStart(2, "0");
  const utcMinutes = String(new Date(date).getUTCMinutes()).padStart(2, "0");

  return `${utcHours}:${utcMinutes}`;
}

export default function FlightsListRoute() {
  usePageTitle("Flight plans");
  const flightService = useFlightService();
  const [flights, setFlights] = React.useState<Flight[]>([]);

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService]);

  const handleReleaseForPilot = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    const updated = await flightService.fetchFlightById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
  };

  const handleRemove = async (flightId: string) => {
    await flightService.remove(flightId);

    setFlights((state) => state.filter((prev) => !(prev.id === flightId)));
  };

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Flights"
        linkText="Create new"
        linkUrl="/flights/new"
      />
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700">
        <Table>
          <Table.Head className="dark:text-gray-100">
            <Table.HeadCell>Flight no</Table.HeadCell>
            <Table.HeadCell>Route</Table.HeadCell>
            <Table.HeadCell>Schedule (UTC)</Table.HeadCell>
            <Table.HeadCell>Aircraft</Table.HeadCell>
            <Table.HeadCell>Operator</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(flights) &&
              flights
                .sort((a, b) => a.flightNumber.localeCompare(b.flightNumber))
                .map((flight: Flight, i: number) => (
                  <Table.Row
                    key={i}
                    className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="text-gray-900 dark:text-white">
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
                              {dateToHour(
                                flight.timesheet.scheduled.takeoffTime,
                              )}
                            </span>
                          </div>
                          <div>
                            <span>
                              <FaPlane className="me-1 inline-block rotate-45" />
                              {dateToHour(
                                flight.timesheet.scheduled.arrivalTime,
                              )}
                            </span>
                            <span className="ms-2">
                              <FaPlane className="me-1 inline-block" />
                              {dateToHour(
                                flight.timesheet.scheduled.onBlockTime,
                              )}
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
                      <div className="flex text-gray-500">
                        {flight.status === FlightStatus.Created && (
                          <>
                            <Button
                              onClick={() => handleReleaseForPilot(flight.id)}
                              color="success"
                              size="xs"
                              className="ms-1"
                            >
                              Release for pilot
                            </Button>
                            <Button
                              onClick={() => handleRemove(flight.id)}
                              color="red"
                              size="xs"
                              className="ms-1 flex items-center"
                            >
                              <FaTrash />
                            </Button>
                          </>
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

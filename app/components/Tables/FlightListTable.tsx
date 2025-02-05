"use client";

import { Flight, FlightStatus } from "~/models";
import { Button, Table } from "flowbite-react";
import { FaPlane, FaTrash } from "react-icons/fa";
import React, { useEffect } from "react";
import { getHourFromDate } from "~/functions/time";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import RemoveFlightModal from "~/components/Modal/RemoveFlightModal";
import ReleaseFlightModal from "~/components/Modal/ReleaseFlightModal";

export default function FlightListTable() {
  const flightService = useFlightService();
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [flightToRemove, setFlightToRemove] = React.useState<Flight | null>(
    null,
  );
  const [flightToRelease, setFlightToRelease] = React.useState<Flight | null>(
    null,
  );

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService]);

  const removeFlight = async (flightId: string) => {
    await flightService.remove(flightId);
    setFlights((state) => state.filter((prev) => !(prev.id === flightId)));
    setFlightToRemove(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    const updated = await flightService.fetchFlightById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToRelease(null);
  };

  return (
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
                            {getHourFromDate(
                              flight.timesheet.scheduled.offBlockTime,
                            )}
                          </span>
                          <span className="ms-2">
                            <FaPlane className="me-1 inline-block -rotate-45" />
                            {getHourFromDate(
                              flight.timesheet.scheduled.takeoffTime,
                            )}
                          </span>
                        </div>
                        <div>
                          <span>
                            <FaPlane className="me-1 inline-block rotate-45" />
                            {getHourFromDate(
                              flight.timesheet.scheduled.arrivalTime,
                            )}
                          </span>
                          <span className="ms-2">
                            <FaPlane className="me-1 inline-block" />
                            {getHourFromDate(
                              flight.timesheet.scheduled.onBlockTime,
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="mb-1">{flight.aircraft.shortName}</div>
                    <div className="flex gap-2">
                      <span className="flex min-w-16 justify-center rounded-md border border-gray-600 px-2 py-0.5 text-xs">
                        {flight.aircraft.registration}
                      </span>
                      <span className="flex min-w-16 justify-center border border-gray-600 px-2 py-0.5 text-xs">
                        {flight.aircraft.selcal}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>{flight.operator.shortName}</div>
                    {flight.operator.icaoCode}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2 text-gray-500">
                      {flight.status === FlightStatus.Created && (
                        <>
                          <Button
                            onClick={() => setFlightToRemove(flight)}
                            color="failure"
                            size="xs"
                            className="ms-1 flex cursor-pointer items-center"
                          >
                            <FaTrash />
                          </Button>
                          <span className="my-1 block border-e border-gray-400 dark:border-gray-600"></span>
                          <Button
                            onClick={() => setFlightToRelease(flight)}
                            size="xs"
                            className="cursor-pointer"
                          >
                            Release for pilot
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

      {flightToRemove && (
        <RemoveFlightModal
          flight={flightToRemove}
          remove={removeFlight}
          cancel={() => setFlightToRemove(null)}
        />
      )}
      {flightToRelease && (
        <ReleaseFlightModal
          flight={flightToRelease}
          release={releaseFlight}
          cancel={() => setFlightToRelease(null)}
        />
      )}
    </div>
  );
}

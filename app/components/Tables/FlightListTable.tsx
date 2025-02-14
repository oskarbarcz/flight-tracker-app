"use client";

import { FilledSchedule, Flight, FlightStatus } from "~/models";
import { Alert, Button, Table } from "flowbite-react";
import { FaPlane, FaTrash } from "react-icons/fa";
import React, { useEffect } from "react";
import { formattedToISO, getHourFromDate } from "~/functions/time";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import RemoveFlightModal from "~/components/Modal/RemoveFlightModal";
import ReleaseFlightModal from "~/components/Modal/ReleaseFlightModal";
import { FaPencil } from "react-icons/fa6";
import UpdateFlightScheduledTimesheetModal from "~/components/Modal/UpdateFlightScheduledTimesheetModal";
import { HiInformationCircle } from "react-icons/hi";

export default function FlightListTable() {
  const flightService = useFlightService();
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [flightToRemove, setFlightToRemove] = React.useState<Flight | null>(
    null,
  );
  const [flightToUpdate, setFlightToUpdate] = React.useState<Flight | null>(
    null,
  );
  const [flightToRelease, setFlightToRelease] = React.useState<Flight | null>(
    null,
  );
  const [expandedFlight, setExpandedFlight] = React.useState<Flight | null>(
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

  const updateFlight = async (flightId: string, schedule: FilledSchedule) => {
    const normalizedSchedule = {
      offBlockTime: formattedToISO(schedule.offBlockTime),
      takeoffTime: formattedToISO(schedule.takeoffTime),
      arrivalTime: formattedToISO(schedule.arrivalTime),
      onBlockTime: formattedToISO(schedule.onBlockTime),
    };

    await flightService.updateScheduledTimesheet(flightId, normalizedSchedule);
    const updated = await flightService.fetchFlightById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToUpdate(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    const updated = await flightService.fetchFlightById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToRelease(null);
  };

  const expandFlight = (flight: Flight): void => {
    if (expandedFlight && expandedFlight.id === flight.id) {
      setExpandedFlight(null);
    } else {
      setExpandedFlight(flight);
    }
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
                <>
                  <Table.Row
                    key={i}
                    className="cursor-pointer bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => expandFlight(flight)}
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
                              onClick={() => setFlightToUpdate(flight)}
                              color="gray"
                              size="xs"
                              className="flex cursor-pointer items-center"
                            >
                              <FaPencil />
                            </Button>
                            <Button
                              onClick={() => setFlightToRemove(flight)}
                              color="failure"
                              size="xs"
                              className="flex cursor-pointer items-center"
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
                  <Table.Row
                    className={`opacity-0 transition-all duration-300 ease-in-out ${expandedFlight?.id === flight.id ? "opacity-100" : ""}`}
                  >
                    {expandedFlight?.id === flight.id && (
                      <Table.Cell colSpan={7}>
                        <div className="flex w-1/4 gap-4">
                          <div>
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-lg font-bold">
                                Timesheet
                              </h3>
                              <Button
                                onClick={() => setFlightToUpdate(flight)}
                                color="gray"
                                size="xs"
                                className="ms-3 flex cursor-pointer items-center"
                              >
                                <FaPencil />
                              </Button>
                            </div>
                          </div>
                          <span className="border-e"></span>
                          <div className="w-full">
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-lg font-bold">
                                Loadsheet
                              </h3>
                              <Button
                                onClick={() => setFlightToUpdate(flight)}
                                color="gray"
                                size="xs"
                                className="ms-3 flex cursor-pointer items-center"
                              >
                                <FaPencil />
                              </Button>
                            </div>

                            {flight.loadsheets.preliminary && (
                              <div className="flex w-full flex-wrap gap-6">
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Pilots
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {
                                      flight.loadsheets.preliminary.flightCrew
                                        .pilots
                                    }
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Relief pilots
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {
                                      flight.loadsheets.preliminary.flightCrew
                                        .reliefPilots
                                    }
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Cabin crew
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {
                                      flight.loadsheets.preliminary.flightCrew
                                        .cabinCrew
                                    }
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Passengers
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {flight.loadsheets.preliminary.passengers}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Zero-fuel weight
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {
                                      flight.loadsheets.preliminary
                                        .zeroFuelWeight
                                    }
                                    {" t"}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Cargo
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {flight.loadsheets.preliminary.cargo}
                                    {" t"}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Payload
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {flight.loadsheets.preliminary.payload}
                                    {" t"}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Block fuel
                                  </span>
                                  <span className="block font-bold text-gray-900">
                                    {flight.loadsheets.preliminary.blockFuel}
                                    {" t"}
                                  </span>
                                </div>
                              </div>
                            )}
                            {!flight.loadsheets.preliminary && (
                              <Alert color="warning" icon={HiInformationCircle}>
                                Preliminary loadsheet is missing.
                              </Alert>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                    )}
                  </Table.Row>
                </>
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
      {flightToUpdate && (
        <UpdateFlightScheduledTimesheetModal
          flight={flightToUpdate}
          update={updateFlight}
          cancel={() => setFlightToUpdate(null)}
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

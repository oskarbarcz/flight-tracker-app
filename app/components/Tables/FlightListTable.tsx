"use client";

import {
  FilledSchedule,
  Flight,
  FlightPrecedenceStatus,
  FlightStatus,
  Loadsheet,
  precedenceToStatus,
} from "~/models";
import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import React, { useEffect } from "react";
import { formatDate, formattedToISO, getHourFromDate } from "~/functions/time";
import RemoveFlightModal from "~/components/Modal/RemoveFlightModal";
import ReleaseFlightModal from "~/components/Modal/ReleaseFlightModal";
import { FaPencil } from "react-icons/fa6";
import UpdateScheduledTimesheetModal from "~/components/Modal/UpdateScheduledTimesheetModal";
import { HiInformationCircle } from "react-icons/hi";
import UpdatePreliminaryLoadsheetModal from "~/components/Modal/UpdatePreliminaryLoadsheetModal";
import { useApi } from "~/state/contexts/api.context";

export type FlightListTableProps = {
  precedence: FlightPrecedenceStatus;
};

export default function FlightListTable({ precedence }: FlightListTableProps) {
  const { flightService } = useApi();
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [flightToRemove, setFlightToRemove] = React.useState<Flight | null>(
    null,
  );
  const [flightToUpdateTimesheet, setFlightToUpdateTimesheet] =
    React.useState<Flight | null>(null);
  const [flightToUpdateLoadsheet, setFlightToUpdateLoadsheet] =
    React.useState<Flight | null>(null);
  const [flightToRelease, setFlightToRelease] = React.useState<Flight | null>(
    null,
  );
  const [expandedFlight, setExpandedFlight] = React.useState<Flight | null>(
    null,
  );

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService, precedence]);

  const removeFlight = async (flightId: string) => {
    await flightService.remove(flightId);
    setFlights((state) => state.filter((prev) => !(prev.id === flightId)));
    setFlightToRemove(null);
  };

  const updateSchedule = async (flightId: string, schedule: FilledSchedule) => {
    const normalizedSchedule = {
      offBlockTime: formattedToISO(schedule.offBlockTime),
      takeoffTime: formattedToISO(schedule.takeoffTime),
      arrivalTime: formattedToISO(schedule.arrivalTime),
      onBlockTime: formattedToISO(schedule.onBlockTime),
    };

    await flightService.updateScheduledTimesheet(flightId, normalizedSchedule);
    const updated = await flightService.getById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToUpdateTimesheet(null);
  };

  const updateLoadsheet = async (flightId: string, loadsheet: Loadsheet) => {
    await flightService.updatePreliminaryLoadsheet(flightId, loadsheet);
    const updated = await flightService.getById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToUpdateLoadsheet(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    const updated = await flightService.getById(flightId);

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
    <div className="rounded-2xl overflow-x-auto mb-6">
      <Table>
        <TableHead className="dark:text-gray-100">
          <TableRow>
            <TableHeadCell>Flight no</TableHeadCell>
            <TableHeadCell>Route</TableHeadCell>
            <TableHeadCell>Departure (UTC)</TableHeadCell>
            <TableHeadCell>Aircraft</TableHeadCell>
            <TableHeadCell>Operator</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {Array.isArray(flights) &&
            flights
              .filter((flight) =>
                precedenceToStatus(precedence).includes(flight.status),
              )
              .sort((a, b) => a.flightNumber.localeCompare(b.flightNumber))
              .map((flight: Flight, i: number) => (
                <React.Fragment key={i}>
                  <TableRow
                    key={flight.id}
                    className="cursor-pointer dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => expandFlight(flight)}
                  >
                    <TableCell className="text-gray-900 dark:text-white">
                      {flight.flightNumber}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {flight.timesheet.scheduled.offBlockTime &&
                        formatDate(
                          new Date(flight.timesheet.scheduled.offBlockTime),
                        )}
                      <span className="block text-xs text-gray-500">
                        Click for details
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1">{flight.aircraft.shortName}</div>
                      <div className="flex gap-2">
                        <span className="flex min-w-16 justify-center rounded-md border border-gray-600 px-2 py-0.5 text-xs">
                          {flight.aircraft.registration}
                        </span>
                        <span className="flex min-w-16 justify-center border border-gray-600 px-2 py-0.5 text-xs">
                          {flight.aircraft.selcal}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{flight.operator.shortName}</div>
                      {flight.operator.icaoCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 text-gray-500">
                        {flight.status === FlightStatus.Created && (
                          <>
                            <Button
                              onClick={() => setFlightToUpdateTimesheet(flight)}
                              color="gray"
                              size="xs"
                              className="flex cursor-pointer items-center"
                            >
                              <FaPencil />
                            </Button>
                            <Button
                              onClick={() => setFlightToRemove(flight)}
                              color="red"
                              size="xs"
                              className="flex cursor-pointer items-center"
                            >
                              <FaTrash />
                            </Button>
                            {flight.loadsheets.preliminary && (
                              <>
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
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={`opacity-0 transition-all duration-300 ease-in-out ${expandedFlight?.id === flight.id ? "opacity-100" : ""}`}
                  >
                    {expandedFlight?.id === flight.id && (
                      <TableCell colSpan={7}>
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-lg font-bold dark:text-white">
                                Timesheet
                              </h3>
                              {flight.status === FlightStatus.Created && (
                                <Button
                                  onClick={() =>
                                    setFlightToUpdateTimesheet(flight)
                                  }
                                  color="gray"
                                  size="xs"
                                  className="ms-3 flex cursor-pointer items-center"
                                >
                                  <FaPencil />
                                </Button>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-6">
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">
                                  Off-block
                                </span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  {getHourFromDate(
                                    flight.timesheet.scheduled.offBlockTime,
                                  )}
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">
                                  Takeoff
                                </span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  {getHourFromDate(
                                    flight.timesheet.scheduled.takeoffTime,
                                  )}
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">
                                  Arrival
                                </span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  {getHourFromDate(
                                    flight.timesheet.scheduled.arrivalTime,
                                  )}
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">
                                  On-block
                                </span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  {getHourFromDate(
                                    flight.timesheet.scheduled.onBlockTime,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="border-e"></span>
                          <div>
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-lg font-bold dark:text-white">
                                Loadsheet
                              </h3>
                              {flight.status === FlightStatus.Created && (
                                <Button
                                  onClick={() =>
                                    setFlightToUpdateLoadsheet(flight)
                                  }
                                  color="gray"
                                  size="xs"
                                  className="ms-3 flex cursor-pointer items-center"
                                >
                                  <FaPencil />
                                </Button>
                              )}
                            </div>

                            {flight.loadsheets.preliminary && (
                              <div className="flex gap-6">
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Pilots
                                  </span>
                                  <span className="block font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.passengers}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Zero-fuel weight
                                  </span>
                                  <span className="block font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.cargo}
                                    {" t"}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Payload
                                  </span>
                                  <span className="block font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.payload}
                                    {" t"}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Block fuel
                                  </span>
                                  <span className="block font-bold text-gray-900 dark:text-white">
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
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              ))}
        </TableBody>
      </Table>

      {flightToRemove && (
        <RemoveFlightModal
          flight={flightToRemove}
          remove={removeFlight}
          cancel={() => setFlightToRemove(null)}
        />
      )}
      {flightToUpdateTimesheet && (
        <UpdateScheduledTimesheetModal
          flight={flightToUpdateTimesheet}
          update={updateSchedule}
          cancel={() => setFlightToUpdateTimesheet(null)}
        />
      )}
      {flightToUpdateLoadsheet && (
        <UpdatePreliminaryLoadsheetModal
          flight={flightToUpdateLoadsheet}
          update={updateLoadsheet}
          cancel={() => setFlightToUpdateLoadsheet(null)}
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

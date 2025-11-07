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
import { FaCheckCircle } from "react-icons/fa";
import React, { useEffect } from "react";
import RemoveFlightModal from "~/components/Modal/RemoveFlightModal";
import ReleaseFlightModal from "~/components/Modal/ReleaseFlightModal";
import UpdateScheduledTimesheetModal from "~/components/Modal/UpdateScheduledTimesheetModal";
import { HiInformationCircle } from "react-icons/hi";
import UpdatePreliminaryLoadsheetModal from "~/components/Modal/UpdatePreliminaryLoadsheetModal";
import { useApi } from "~/state/contexts/api.context";
import { FormattedIcaoTime } from "~/components/Intrinsic/Date/FormattedIcaoTime";
import { FormattedIcaoDate } from "~/components/Intrinsic/Date/FormattedIcaoDate";
import translateStatus from "~/models/translate/flight.translate";

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
    await flightService.updateScheduledTimesheet(flightId, schedule);
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
                    <TableCell className="text-gray-900 font-bold font-mono dark:text-white">
                      {flight.flightNumberWithoutSpaces}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        {flight.departureAirport.iataCode}
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
                        {flight.destinationAirport.iataCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      {flight.timesheet.scheduled.offBlockTime && (
                        <>
                          <FormattedIcaoDate
                            date={flight.timesheet.scheduled.offBlockTime}
                          />
                          {" • "}
                          <FormattedIcaoTime
                            date={flight.timesheet.scheduled.offBlockTime}
                          />
                        </>
                      )}
                      <span className="block text-xs text-gray-500">
                        Click for details
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1">{flight.aircraft.shortName}</div>
                      <div className="flex gap-2">
                        <span className="flex min-w-16 justify-center rounded-md border border-gray-500 px-2 py-0.5 text-xs">
                          {flight.aircraft.registration}
                        </span>
                        <span className="flex min-w-16 justify-center border border-gray-500 px-2 py-0.5 text-xs">
                          {flight.aircraft.selcal}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{flight.operator.shortName}</div>
                      {flight.operator.icaoCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-500">
                        {flight.status === FlightStatus.Created && (
                          <>
                            <Button
                              onClick={() => setFlightToUpdateTimesheet(flight)}
                              color="gray"
                              outline
                              size="xs"
                              className="flex cursor-pointer items-center"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => setFlightToRemove(flight)}
                              color="red"
                              size="xs"
                              className="flex cursor-pointer items-center"
                            >
                              Remove
                            </Button>
                            {flight.loadsheets.preliminary && (
                              <>
                                <Button
                                  color="indigo"
                                  outline
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
                          <div className="font-bold flex items-center gap-1 text-green-500">
                            <FaCheckCircle className="inline" />
                            Pilot can check-in
                          </div>
                        )}

                        {flight.status !== FlightStatus.Created &&
                          flight.status !== FlightStatus.Ready && (
                            <span className="font-bold text-indigo-500">
                              {translateStatus(flight.status)}
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
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="text-lg font-bold dark:text-white">
                                Scheduled timesheet
                              </h3>
                              {flight.status === FlightStatus.Created && (
                                <Button
                                  onClick={() =>
                                    setFlightToUpdateTimesheet(flight)
                                  }
                                  color="gray"
                                  outline
                                  size="xs"
                                  className="ms-12 flex cursor-pointer items-center"
                                >
                                  Update
                                </Button>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-6">
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">
                                  DEP DATE
                                </span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  <FormattedIcaoDate
                                    date={
                                      flight.timesheet.scheduled.offBlockTime
                                    }
                                  />
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">OFF</span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  <FormattedIcaoTime
                                    date={
                                      flight.timesheet.scheduled.offBlockTime
                                    }
                                  />
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">OUT</span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  <FormattedIcaoTime
                                    date={
                                      flight.timesheet.scheduled.takeoffTime
                                    }
                                  />
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">IN</span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  <FormattedIcaoTime
                                    date={
                                      flight.timesheet.scheduled.arrivalTime
                                    }
                                  />
                                </span>
                              </div>
                              <div className="shrink-0 text-center">
                                <span className="mb-1 block text-xs">ON</span>
                                <span className="block font-bold text-gray-900 dark:text-white">
                                  <FormattedIcaoTime
                                    date={
                                      flight.timesheet.scheduled.onBlockTime
                                    }
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="border-e mx-3 border-gray-300 dark:border-gray-600"></span>
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="text-lg font-bold dark:text-white">
                                Preliminary loadsheet
                              </h3>
                              {flight.status === FlightStatus.Created && (
                                <Button
                                  onClick={() =>
                                    setFlightToUpdateLoadsheet(flight)
                                  }
                                  color="gray"
                                  outline
                                  size="xs"
                                  className="ms-3 flex cursor-pointer items-center"
                                >
                                  Update
                                </Button>
                              )}
                            </div>

                            {flight.loadsheets.preliminary && (
                              <div className="flex gap-6">
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Pilots
                                  </span>
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
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
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.passengers}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Zero-fuel weight
                                  </span>
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                                    {
                                      flight.loadsheets.preliminary
                                        .zeroFuelWeight
                                    }
                                    <span className="text-xs">t</span>
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Cargo
                                  </span>
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.cargo}
                                    <span className="text-xs">t</span>
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Payload
                                  </span>
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.payload}
                                    <span className="text-xs">t</span>
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="mb-1 block text-xs">
                                    Block fuel
                                  </span>
                                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                                    {flight.loadsheets.preliminary.blockFuel}
                                    <span className="text-xs">t</span>
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

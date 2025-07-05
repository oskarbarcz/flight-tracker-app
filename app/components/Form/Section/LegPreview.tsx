"use client";

import { AirportOnFlight, AirportOnFlightType, Flight } from "~/models";
import { FaArrowRight } from "react-icons/fa";
import { formatDate, getHourFromDate } from "~/functions/time";
import React from "react";
import { Button, Tooltip } from "flowbite-react";

type LegPreviewProps = {
  flight: Flight;
  removeLegAction: (flightId: string) => void;
};

export default function LegPreview({
  flight,
  removeLegAction,
}: LegPreviewProps) {
  const departure = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <div className="mb-2 rounded-xl border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">{flight.flightNumber}</h2>
            <Tooltip
              content={
                <span>
                  {departure.name}{" "}
                  <FaArrowRight className="inline-block text-gray-500" />{" "}
                  {destination.name}
                </span>
              }
            >
              <span className="inline-block text-sm text-gray-500 dark:text-gray-300">
                {departure.iataCode}
                <FaArrowRight className="mx-1 inline-block" />
                {destination.iataCode}
              </span>
            </Tooltip>
          </div>
          <div className="mt-3 flex gap-4">
            <Tooltip content={flight.aircraft.fullName}>
              <span>{flight.aircraft.icaoCode}</span>
            </Tooltip>
            <span className="flex min-w-16 items-center justify-center rounded-md border border-gray-600 px-2 text-xs dark:border-gray-400">
              {flight.aircraft.registration}
            </span>
            <span className="flex min-w-16 items-center justify-center border border-gray-600 px-2 text-xs dark:border-gray-400">
              {flight.aircraft.selcal}
            </span>
          </div>
          <div className="mt-3 flex gap-4">
            <div className="inline-block text-sm text-gray-800 dark:text-gray-300">
              <Tooltip
                placement="bottom"
                content={formatDate(
                  new Date(flight.timesheet.scheduled.offBlockTime),
                )}
              >
                <span className="block text-center text-gray-500 dark:text-gray-400">
                  OFF
                </span>
                {getHourFromDate(flight.timesheet.scheduled.offBlockTime)}
              </Tooltip>
            </div>
            <div className="inline-block text-sm text-gray-800 dark:text-gray-300">
              <Tooltip
                placement="bottom"
                content={formatDate(
                  new Date(flight.timesheet.scheduled.takeoffTime),
                )}
              >
                <span className="block text-center text-gray-500 dark:text-gray-400">
                  OUT
                </span>
                {getHourFromDate(flight.timesheet.scheduled.takeoffTime)}
              </Tooltip>
            </div>
            <div className="flex gap-4">
              <div className="inline-block text-sm text-gray-800 dark:text-gray-300">
                <Tooltip
                  placement="bottom"
                  content={formatDate(
                    new Date(flight.timesheet.scheduled.arrivalTime),
                  )}
                >
                  <span className="block text-center text-gray-500 dark:text-gray-400">
                    IN
                  </span>
                  {getHourFromDate(flight.timesheet.scheduled.arrivalTime)}
                </Tooltip>
              </div>
              <div className="inline-block text-sm text-gray-800 dark:text-gray-300">
                <Tooltip
                  placement="bottom"
                  content={formatDate(
                    new Date(flight.timesheet.scheduled.onBlockTime),
                  )}
                >
                  <span className="block text-center text-gray-500 dark:text-gray-400">
                    ON
                  </span>
                  {getHourFromDate(flight.timesheet.scheduled.onBlockTime)}
                </Tooltip>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <Button color="light" onClick={() => removeLegAction(flight.id)}>
          Remove
        </Button>
      </div>
    </div>
  );
}

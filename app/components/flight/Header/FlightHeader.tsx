"use client";

import { Button, Tooltip } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiEye, HiOutlineTrash } from "react-icons/hi";
import { TrackingStatus } from "~/components/flight/Table/TrackingStatus";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { toHuman } from "~/i18n/translate";
import { type Flight, FlightStatus } from "~/models";

type Props = {
  flight: Flight;
  onRelease: () => void;
  onRemove: () => void;
  onUpdateTracking: () => void;
};

export function FlightHeader({ flight, onRelease, onRemove, onUpdateTracking }: Props) {
  const canRelease = flight.status === FlightStatus.Created && flight.loadsheets.preliminary !== null;
  const canRemove = flight.status === FlightStatus.Created;

  return (
    <header className="flex flex-col md:flex-row md:items-start gap-x-6 gap-y-3">
      <div className="md:flex-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-gray-800 dark:text-gray-200">
            {flight.flightNumberWithoutSpaces}
          </h1>
          <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
            <span className="font-mono">{flight.departureAirport.iataCode}</span>
            <FaArrowRight size="14" className="text-gray-500" />
            <span className="font-mono">{flight.destinationAirport.iataCode}</span>
          </div>
          <span className="text-sm font-bold text-indigo-500">{toHuman.flight.status.standard(flight.status)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{flight.aircraft.fullName}</span>
          <span className="mx-2">·</span>
          <span className="font-mono">{flight.aircraft.registration}</span>
          <span className="mx-2">·</span>
          <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />{" "}
          <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
          {" UTC"}
        </p>
        <div className="mt-2">
          <TrackingStatus tracking={flight.tracking} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        {canRelease && (
          <Button color="indigo" outline size="sm" onClick={onRelease}>
            Release for pilot
          </Button>
        )}
        <Tooltip content="Change tracking visibility">
          <Button
            color="light"
            size="sm"
            onClick={onUpdateTracking}
            aria-label="Change tracking visibility"
            className="!p-2 cursor-pointer text-gray-500 hover:!text-indigo-500"
          >
            <HiEye className="size-4" />
          </Button>
        </Tooltip>
        {canRemove && (
          <Tooltip content="Remove flight">
            <Button
              color="light"
              size="sm"
              onClick={onRemove}
              aria-label="Remove flight"
              className="!p-2 cursor-pointer text-gray-500 hover:!text-red-500"
            >
              <HiOutlineTrash className="size-4" />
            </Button>
          </Tooltip>
        )}
      </div>
    </header>
  );
}

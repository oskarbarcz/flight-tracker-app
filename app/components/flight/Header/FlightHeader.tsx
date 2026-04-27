"use client";

import { Button, Tooltip } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiEye, HiOutlineTrash } from "react-icons/hi";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { toHuman } from "~/i18n/translate";
import { type Flight, FlightSource, FlightStatus } from "~/models";

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
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />

      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                {flight.flightNumberWithoutSpaces}
              </h1>
              <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                {toHuman.flight.status.standard(flight.status)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 font-mono font-bold">
                <span>{flight.departureAirport.iataCode}</span>
                <FaArrowRight size="12" className="text-gray-400" />
                <span>{flight.destinationAirport.iataCode}</span>
              </div>
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                {flight.departureAirport.city} → {flight.destinationAirport.city}
              </span>
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
                className="cursor-pointer px-3 py-2 text-gray-500 hover:text-indigo-500"
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
                  className="cursor-pointer px-3 py-2 text-gray-500 hover:text-red-500"
                >
                  <HiOutlineTrash className="size-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-5 dark:border-gray-800">
          <Stat label="Aircraft" value={flight.aircraft.fullName} />
          <Stat label="Registration" value={flight.aircraft.registration} mono />
          <Stat
            label="Scheduled departure"
            mono
            value={
              <>
                <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />{" "}
                <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
              </>
            }
          />
          <Stat label="Tracking" value={<span className="capitalize">{flight.tracking}</span>} />
          <Stat label="Source" value={flight.source === FlightSource.SimBrief ? "SimBrief" : "Manual"} />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`mt-1 text-sm font-medium text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

"use client";

import {
  AirportOnFlight,
  AirportOnFlightType,
  FilledSchedule,
  Flight,
  FlightStatus,
} from "~/models";
import { FaPlane } from "react-icons/fa";

type FlightSummaryBoxProps = {
  flight: Flight;
};

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date) {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date: Date) {
  return date.toISOString().slice(11, 16);
}

export function FlightSummaryBox({ flight }: FlightSummaryBoxProps) {
  const departure = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  const timesheet = flight.timesheet;

  const scheduledBlockTime = calculateBlockTime(
    new Date(timesheet.scheduled.offBlockTime),
    new Date(timesheet.scheduled.onBlockTime),
  );

  let estimatedBlockTime = null;

  if (
    flight.status !== FlightStatus.Created &&
    flight.status !== FlightStatus.Ready
  ) {
    const schedule = timesheet.estimated as FilledSchedule;
    estimatedBlockTime = calculateBlockTime(
      new Date(schedule.offBlockTime),
      new Date(schedule.onBlockTime),
    );
  }

  return (
    <section className="rounded-2xl border bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="text-start font-bold">
          <span className="block text-4xl">{departure.iataCode}</span>
          <span className="block">{departure.city}</span>
        </div>
        <div>
          <FaPlane className="mx-auto mb-2 block" />
          {estimatedBlockTime && (
            <span className="block text-center text-green-500">
              {estimatedBlockTime}
            </span>
          )}
          <span className="block text-center text-xs">
            {scheduledBlockTime}
          </span>
        </div>
        <div className="text-end font-bold">
          <span className="block text-4xl">{destination.iataCode}</span>
          <span className="block">{destination.city}</span>
        </div>
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <div className="text-start">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(new Date(timesheet.estimated.offBlockTime))}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.offBlockTime))}
          </span>
        </div>
        <div className="text-end">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(new Date(timesheet.estimated.onBlockTime))}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.onBlockTime))}
          </span>
        </div>
      </div>
    </section>
  );
}

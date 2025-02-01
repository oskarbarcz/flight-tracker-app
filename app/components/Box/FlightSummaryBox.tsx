"use client";

import {
  AirportOnFlight,
  AirportOnFlightType,
  CheckedInFlightTimesheet,
  Flight,
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
  return date.toLocaleTimeString("pl", { hour: "2-digit", minute: "2-digit" });
}

export function FlightSummaryBox({ flight }: FlightSummaryBoxProps) {
  const departure = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  const timesheet = flight.timesheet as CheckedInFlightTimesheet;

  const scheduledBlockTime = calculateBlockTime(
    new Date(timesheet.scheduled.offBlockTime),
    new Date(timesheet.scheduled.onBlockTime),
  );

  const estimatedBlockTime = calculateBlockTime(
    new Date(timesheet.estimated.offBlockTime),
    new Date(timesheet.estimated.onBlockTime),
  );

  return (
    <section className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
      <h2 className="text-xl font-bold dark:text-gray-300">
        Current flight summary
      </h2>
      <hr className="mt-2 dark:border-gray-700" />
      <div className="mt-8 flex items-center justify-between">
        <div className="text-start font-bold">
          <span className="block text-4xl">{departure.iataCode}</span>
          <span className="block">{departure.city}</span>
        </div>
        <div>
          <FaPlane className="mx-auto block" />
          <span className="mt-2 block text-center text-green-500">
            {estimatedBlockTime}
          </span>
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
          <span className="block text-xs text-green-500">{"On time"}</span>
          <span className="block text-2xl font-bold text-green-500">
            {formatTime(new Date(timesheet.estimated.offBlockTime))}
          </span>
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.offBlockTime))}
          </span>
        </div>
        <div className="text-end">
          <span className="block text-xs text-green-500">{"On time"}</span>
          <span className="block text-2xl font-bold text-green-500">
            {formatTime(new Date(timesheet.estimated.onBlockTime))}
          </span>
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.onBlockTime))}
          </span>
        </div>
      </div>
    </section>
  );
}

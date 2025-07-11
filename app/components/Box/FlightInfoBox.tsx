"use client";

import {
  AirportOnFlight,
  AirportOnFlightType,
  FilledSchedule,
  Flight,
  FlightStatus,
} from "~/models";
import { PiUserSoundBold } from "react-icons/pi";
import { FaPlane } from "react-icons/fa";

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date) {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date: Date) {
  return date.toISOString().slice(11, 16);
}

type FlightInfoBoxProps = {
  flight: Flight;
};
export default function FlightInfoBox({ flight }: FlightInfoBoxProps) {
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
    <>
      <div className="mb-3">
        <h2 className="block pb-2 text-3xl font-bold text-indigo-500 md:text-4xl">
          {flight.flightNumber}
        </h2>
        <div className="flex items-center">
          <span>{flight.callsign}</span>
          <span className="mx-2">•</span>
          <span className="text-xs">
            <PiUserSoundBold className="me-2 inline-block" />
            {flight.operator.callsign}
          </span>
        </div>
      </div>
      <div className="my-2 flex items-center gap-2">
        {flight.aircraft.shortName}
        <span>•</span>
        <span className="inline-block rounded-md border border-gray-600 px-2 py-0.5 text-xs">
          {flight.aircraft.registration}
        </span>
        <span>•</span>
        <span className="inline-block border border-gray-600 px-2 py-0.5 text-xs">
          {flight.aircraft.selcal}
        </span>
      </div>
      <div className="my-2">
        {"Operated by "}
        <span className="font-bold">{flight.operator.shortName}</span>
      </div>

      <div className="flex items-center justify-between mt-4">
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
    </>
  );
}

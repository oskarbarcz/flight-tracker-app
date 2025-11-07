"use client";

import { FilledSchedule, FlightStatus } from "~/models";
import { PiUserSoundBold } from "react-icons/pi";
import { FaPlane } from "react-icons/fa";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date) {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date: Date) {
  return date.toISOString().slice(11, 16);
}

type FlightInfoBoxProps = ContainerClassProps;

export default function FlightInfoBox({ className }: FlightInfoBoxProps) {
  const { flight } = useTrackedFlight();
  if (!flight) {
    return <div>Loading...</div>;
  }

  const timesheet = flight.timesheet;

  const scheduledBlockTime = calculateBlockTime(
    timesheet.scheduled.offBlockTime,
    timesheet.scheduled.onBlockTime,
  );

  let estimatedBlockTime = null;

  if (
    flight.status !== FlightStatus.Created &&
    flight.status !== FlightStatus.Ready
  ) {
    const schedule = timesheet.estimated as FilledSchedule;
    estimatedBlockTime = calculateBlockTime(
      schedule.offBlockTime,
      schedule.onBlockTime,
    );
  }

  return (
    <Container className={className} padding="condensed">
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
          <span className="block text-4xl">
            {flight.departureAirport.iataCode}
          </span>
          <span className="block">{flight.departureAirport.city}</span>
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
          <span className="block text-4xl">
            {flight.destinationAirport.iataCode}
          </span>
          <span className="block">{flight.destinationAirport.city}</span>
        </div>
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <div className="text-start">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(timesheet.estimated.offBlockTime)}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(timesheet.scheduled.offBlockTime)}
          </span>
        </div>

        <div className="text-end">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(timesheet.estimated.onBlockTime)}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(timesheet.scheduled.onBlockTime)}
          </span>
        </div>
      </div>
    </Container>
  );
}

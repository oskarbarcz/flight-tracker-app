"use client";

import React, { useCallback, useEffect } from "react";
import {
  AirportOnFlight,
  AirportOnFlightType,
  CheckedInFlightTimesheet,
  Flight,
} from "~/models";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router";
import { FaArrowDown } from "react-icons/fa";

type SidebarCurrentFlightProps = {
  flightId: string;
  isCollapsed: boolean;
};

function calculateTimeToGo(arrival: Date): string {
  dayjs.extend(relativeTime);
  return dayjs().to(arrival, true);
}

export default function SidebarCurrentFlight({
  flightId,
  isCollapsed,
}: SidebarCurrentFlightProps) {
  const flightService = useFlightService();
  const navigator = useNavigate();
  const [trackedFlight, setTrackedFlight] = React.useState<Flight | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<string | null>(null);

  const handleTimeUpdate = useCallback((flight: Flight) => {
    const timesheet = flight.timesheet as CheckedInFlightTimesheet;
    const timeRemaining = calculateTimeToGo(
      new Date(timesheet.estimated.arrivalTime),
    );
    setTimeRemaining(timeRemaining);
  }, []);

  useEffect(() => {
    flightService
      .fetchFlightById(flightId)
      .then((flight) => {
        setTrackedFlight(flight);
        return flight;
      })
      .then((flight) => handleTimeUpdate(flight));
  }, [flightService, flightId, handleTimeUpdate]);

  const handleClick = () => {
    navigator(`/track/${flightId}`, { replace: true });
  };

  if (!trackedFlight) {
    return <div>Loading...</div>;
  }

  setInterval(() => handleTimeUpdate(trackedFlight), 1000 * 60);

  const departureAirport = trackedFlight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;

  const destinationAirport = trackedFlight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  if (isCollapsed) {
    return (
      <button
        onClick={handleClick}
        className="w-full rounded-lg bg-gray-200 p-2 text-start dark:bg-gray-700"
      >
        <span className="text-xs">
          <span className="block text-center font-bold">
            {departureAirport.iataCode}
          </span>
          <FaArrowDown className="mx-auto my-1 block" />
          <span className="block text-center font-bold">
            {destinationAirport.iataCode}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-lg bg-gray-200 p-2 text-start dark:bg-gray-700"
    >
      <span className="block text-xs">
        <span className="font-bold">{trackedFlight.flightNumber}</span>
        {" to "}
        <span className="font-bold">{destinationAirport.city}</span>
      </span>

      <span className="block text-xs">est. arrival in {timeRemaining}</span>
    </button>
  );
}

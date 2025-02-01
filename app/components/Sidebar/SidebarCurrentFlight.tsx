"use client";

import React, { useEffect } from "react";
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

type SidebarCurrentFlightProps = {
  flightId: string;
};

export default function SidebarCurrentFlight({
  flightId,
}: SidebarCurrentFlightProps) {
  const flightService = useFlightService();
  const navigator = useNavigate();
  const [trackedFlight, setTrackedFlight] = React.useState<Flight | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<string | null>(null);

  useEffect(() => {
    flightService.fetchFlightById(flightId).then(setTrackedFlight);
  }, [flightService, flightId]);

  setInterval(() => {
    if (!trackedFlight) {
      return;
    }

    const timesheet = trackedFlight.timesheet as CheckedInFlightTimesheet;
    dayjs.extend(relativeTime);
    const timeAgo = dayjs().to(timesheet.estimated.arrivalTime, true);
    setTimeRemaining(timeAgo);
  }, 1000);

  const handleClick = () => {
    navigator(`/track/${flightId}`, { replace: true });
  };

  if (!trackedFlight) {
    return <div>No flight found</div>;
  }

  const destinationAirport = trackedFlight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-lg bg-gray-200 p-2 text-start dark:bg-gray-700"
    >
      <div className="text-xs">
        <span className="font-bold">{trackedFlight.flightNumber}</span>
        {" to "}
        <span className="font-bold">{destinationAirport.city}</span>
      </div>

      <div className="text-xs">est. arrival in {timeRemaining}</div>
    </button>
  );
}

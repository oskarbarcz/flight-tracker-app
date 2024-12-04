"use client";

import TrackedFlightStatus from "~/components/TrackedFlightStatus/TrackedFlightStatus";
import FlightAirports from "~/components/FlightAirports/FlightAirports";
import TrackedFlightTimesheet from "~/components/TrackedFlightTimesheet/TrackedFlightTimesheet";
import TrackedFlightDetails from "~/components/TrackedFlightDetails/TrackedFlightDetails";
import TrackedFlightAircraftDetails from "~/components/TrackedFlightAircraftDetails/TrackedFlightAircraftDetails";
import React, { useEffect } from "react";
import { useTrackedFlight } from "~/state/hooks/useTrackedFlight";
import { useChangePageTitle } from "~/state/hooks/useChangePageTitle";

type TrackFlightDashboardProps = {
  flightNumber: string;
};

export const TrackFlightDashboard = ({
  flightNumber,
}: TrackFlightDashboardProps) => {
  const { trackedFlight, loadTrackedFlight } = useTrackedFlight();

  useEffect(() => {
    loadTrackedFlight(flightNumber);
  }, [flightNumber]);

  const title =
    trackedFlight === null
      ? "Flight"
      : `Tracking ${trackedFlight.flightNumber}`;
  useChangePageTitle(title);

  if (trackedFlight === null) {
    return <div>loading...</div>;
  }

  return (
    <div className="container mx-auto py-4 text-gray-800 dark:text-white">
      <div>
        <TrackedFlightStatus
          callsign={trackedFlight.callsign}
          flightNumber={trackedFlight.flightNumber}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FlightAirports
            departure={trackedFlight.departure}
            arrival={trackedFlight.arrival}
          />
          <TrackedFlightTimesheet
            scheduled={trackedFlight.timesheet.scheduled}
          />
        </div>
        <div>
          <TrackedFlightDetails
            callsign={trackedFlight.callsign}
            flightNumber={trackedFlight.flightNumber}
          />
          <TrackedFlightAircraftDetails
            aircraft={trackedFlight.aircraft}
            operator={trackedFlight.operator}
          />
        </div>
      </div>
    </div>
  );
};

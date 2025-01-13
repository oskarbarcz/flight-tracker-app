"use client";

import TrackedFlightStatus from "~/components/TrackedFlightStatus/TrackedFlightStatus";
import FlightAirports from "~/components/FlightAirports/FlightAirports";
import TrackedFlightDetails from "~/components/TrackedFlightDetails/TrackedFlightDetails";
import TrackedFlightAircraftDetails from "~/components/TrackedFlightAircraftDetails/TrackedFlightAircraftDetails";
import React from "react";
import { Airport, ScheduledFlightsListElement } from "~/models";

type TrackFlightDashboardProps = {
  flight: ScheduledFlightsListElement;
};

export const TrackFlightDashboard = ({ flight }: TrackFlightDashboardProps) => {
  return (
    <div className="container mx-auto py-4 text-gray-800 dark:text-white">
      <div>
        <TrackedFlightStatus
          callsign={flight.callsign}
          flightNumber={flight.flightNumber}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FlightAirports
            departure={
              flight.airports.find(
                (a) => a.type === "departure",
              ) as unknown as Airport
            }
            arrival={
              flight.airports.find(
                (a) => a.type === "departure",
              ) as unknown as Airport
            }
          />
          {/*<TrackedFlightTimesheet scheduled={flight.timesheet.scheduled} />*/}
        </div>
        <div>
          <TrackedFlightDetails
            callsign={flight.callsign}
            flightNumber={flight.flightNumber}
          />
          <TrackedFlightAircraftDetails aircraft={flight.aircraft} />
        </div>
      </div>
    </div>
  );
};

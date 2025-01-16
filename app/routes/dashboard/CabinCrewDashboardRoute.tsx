"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import PilotInformationBox from "~/components/PilotInformationBox";
import {
  Flight,
  isFlightAvailableForCheckIn,
  isFlightTrackable,
} from "~/models";
import { Link } from "react-router";
import { FlightService } from "~/state/services/flight.service";

const shouldFlightBeShown = (flight: Flight): boolean => {
  return (
    isFlightTrackable(flight.status) ||
    isFlightAvailableForCheckIn(flight.status)
  );
};

export default function CabinCrewDashboardRoute() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    FlightService.fetchAllFlights().then(setFlights);
  }, []);

  return (
    <>
      <ProtectedRoute expectedRole="cabincrew">
        <div className="mt-4 grid grid-cols-2 gap-4">
          <PilotInformationBox />
        </div>
        <div>
          {Array.isArray(flights) &&
            flights
              .filter(shouldFlightBeShown)
              .map((flight: Flight, i: number) => (
                <div key={i}>
                  <Link
                    className="text-teal-500 underline"
                    to={`/track/${flight.id}`}
                  >
                    {flight.flightNumber} [{flight.status.toUpperCase()}]
                  </Link>
                </div>
              ))}
        </div>
      </ProtectedRoute>
    </>
  );
}

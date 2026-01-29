"use client";

import React, { useEffect, useState } from "react";
import AvailableFlightsBox from "~/components/flight/Dashboard/Main/AvailableFlightsBox";
import CurrentFlightBox from "~/components/flight/Dashboard/Main/CurrentFlightBox";
import CurrentRotationBox from "~/components/flight/Dashboard/Main/CurrentRotationBox";
import DebugFlightListBox from "~/components/flight/Dashboard/Main/DebugFlightListBox";
import PilotStatsBox from "~/components/flight/Dashboard/Main/PilotStatsBox";
import UserHeader from "~/components/flight/UserHeader";
import { Flight, FlightStatus, isFlightTrackable } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { useApi } from "~/state/contexts/content/api.context";
import { useAppConfig } from "~/state/hooks/useAppConfig";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function PilotDashboardRoute() {
  const { flightService } = useApi();
  const { isDevelopmentEnvironment } = useAppConfig();
  const [flights, setFlights] = useState<Flight[]>([]);
  usePageTitle("Dashboard");

  useEffect(() => {
    flightService.fetchAllFlights().then((res) => setFlights(res.flights));
  }, [flightService]);

  const nextFlight = flights.filter(
    (flight) => flight.status === FlightStatus.Ready,
  )[0];
  const currentFlight = flights.filter((flight) =>
    isFlightTrackable(flight.status),
  )[0];

  return (
    <>
      <ProtectedRoute expectedRole={UserRole.CabinCrew}>
        <UserHeader />
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          <div className="grid gap-4">
            <AvailableFlightsBox flight={nextFlight} />
            <CurrentFlightBox flight={currentFlight} />
            <CurrentRotationBox />
          </div>
          <div className="grid gap-4">
            <PilotStatsBox />
            {isDevelopmentEnvironment && (
              <DebugFlightListBox flights={flights} />
            )}
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

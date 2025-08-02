"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import UserInformationBox from "~/components/Box/UserInformationBox";
import { Flight, isFlightTrackable } from "~/models";
import { UserRole } from "~/models/user.model";
import AvailableFlightsBox from "~/components/Box/AvailableFlightsBox";
import CurrentFlightBox from "~/components/Box/CurrentFlightBox";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { useApi } from "~/state/contexts/api.context";
import PilotStatsBox from "~/components/Box/PilotStatsBox";
import CurrentRotationBox from "~/components/Box/CurrentRotationBox";
import DebugFlightListBox from "~/components/Box/DebugFlightListBox";
import { useEnvironment } from "~/state/hooks/useEnvironment";

export default function PilotDashboardRoute() {
  const { flightService } = useApi();
  const { isDebug } = useEnvironment();
  const [flights, setFlights] = useState<Flight[]>([]);
  usePageTitle("Dashboard");

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService]);

  const nextFlight = flights[0] ?? undefined;
  const currentFlight = flights.filter((flight) =>
    isFlightTrackable(flight.status),
  )[0];

  return (
    <>
      <ProtectedRoute expectedRole={UserRole.CabinCrew}>
        <UserInformationBox />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="grid gap-8">
            <AvailableFlightsBox flight={nextFlight} />
            <CurrentFlightBox flight={currentFlight} />
            <CurrentRotationBox />
          </div>
          <div className="grid gap-8">
            <PilotStatsBox flights={flights} />
            {isDebug && <DebugFlightListBox flights={flights} />}
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

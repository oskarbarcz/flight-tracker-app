"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import PilotInformationBox from "~/components/Box/PilotInformationBox";
import { Flight } from "~/models";
import { FlightService } from "~/state/services/flight.service";
import { UserRole } from "~/models/user.model";
import NextFlightBox from "~/components/Box/NextFlightBox";
import AllPendingFlightsBox from "~/components/Box/AllPendingFlightsBox";
import FinishedFlightsBox from "~/components/Box/FinishedFlightsBox";

export default function CabinCrewDashboardRoute() {
  const flightService = new FlightService();
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, []);

  return (
    <>
      <ProtectedRoute expectedRole={UserRole.CabinCrew}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PilotInformationBox />
          <NextFlightBox flights={flights} />
          <AllPendingFlightsBox flights={flights} />
          <FinishedFlightsBox flights={flights} />
        </div>
      </ProtectedRoute>
    </>
  );
}

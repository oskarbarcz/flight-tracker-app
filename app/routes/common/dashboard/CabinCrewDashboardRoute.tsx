"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import UserInformationBox from "~/components/Box/UserInformationBox";
import { Flight } from "~/models";
import { UserRole } from "~/models/user.model";
import NextFlightBox from "~/components/Box/NextFlightBox";
import AllPendingFlightsBox from "~/components/Box/AllPendingFlightsBox";
import FinishedFlightsBox from "~/components/Box/FinishedFlightsBox";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function CabinCrewDashboardRoute() {
  const flightService = useFlightService();
  const [flights, setFlights] = useState<Flight[]>([]);
  usePageTitle("Dashboard");

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService]);

  return (
    <>
      <ProtectedRoute expectedRole={UserRole.CabinCrew}>
        <div className="w-full">
          <UserInformationBox />
        </div>
        <div className=" pt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <NextFlightBox flights={flights} />
          <AllPendingFlightsBox flights={flights} />
          <FinishedFlightsBox flights={flights} />
        </div>
      </ProtectedRoute>
    </>
  );
}

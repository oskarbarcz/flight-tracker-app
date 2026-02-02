"use client";

import React, { useEffect, useState } from "react";
import CurrentFlightBox from "~/components/flight/Dashboard/Main/Box/CurrentFlightBox";
import CurrentRotationBox from "~/components/flight/Dashboard/Main/Box/CurrentRotationBox";
import DebugFlightListBox from "~/components/flight/Dashboard/Main/Box/DebugFlightListBox";
import LastFlightBox from "~/components/flight/Dashboard/Main/Box/LastFlightBox";
import CurrentFlightBoxLoader from "~/components/flight/Dashboard/Main/Box/Loader/CurrentFlightBoxLoader";
import LastFlightBoxLoader from "~/components/flight/Dashboard/Main/Box/Loader/LastFlightBoxLoader";
import NextScheduledFlightBoxLoader from "~/components/flight/Dashboard/Main/Box/Loader/NextScheduledFlightBoxLoader";
import NextScheduledFlightBox from "~/components/flight/Dashboard/Main/Box/NextScheduledFlightBox";
import NoCurrentFlightBox from "~/components/flight/Dashboard/Main/Box/NoCurrentFlightBox";
import PilotStatsBox from "~/components/flight/Dashboard/Main/Box/PilotStatsBox";
import UserHeader from "~/components/flight/Dashboard/Main/UserHeader";
import { Flight, FlightStatus } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { useApi } from "~/state/contexts/content/api.context";
import useCurrentFlight from "~/state/hooks/resources/useCurrentFlight";
import useLastFlight from "~/state/hooks/resources/useLastFlight";
import { useAppConfig } from "~/state/hooks/useAppConfig";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function PilotDashboardRoute() {
  const { flightService } = useApi();
  const { isDevelopmentEnvironment } = useAppConfig();
  const [flights, setFlights] = useState<Flight[]>([]);
  const { lastFlight, loading: loadingLast } = useLastFlight();
  const { currentFlight, loading: loadingCurrent } = useCurrentFlight();
  usePageTitle("Dashboard");

  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    setLoadingAll(true);
    flightService
      .fetchAllFlights()
      .then((res) => setFlights(res.flights))
      .finally(() => setLoadingAll(false));
  }, [flightService]);

  const nextFlight = flights.filter(
    (flight) => flight.status === FlightStatus.Ready,
  )[0];

  return (
    <>
      <ProtectedRoute expectedRole={UserRole.CabinCrew}>
        <UserHeader />
        <div className="grid grid-cols-1 gap-4 pt-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            {loadingAll ? (
              <NextScheduledFlightBoxLoader />
            ) : (
              <NextScheduledFlightBox
                flight={nextFlight}
                isCurrentFlight={currentFlight !== null}
              />
            )}
            {loadingLast ? (
              <LastFlightBoxLoader />
            ) : (
              <LastFlightBox flight={lastFlight} />
            )}
          </div>
          <div className="flex flex-col gap-4">
            {loadingCurrent ? (
              <CurrentFlightBoxLoader />
            ) : currentFlight ? (
              <CurrentFlightBox flight={currentFlight} />
            ) : (
              <NoCurrentFlightBox />
            )}
            <CurrentRotationBox />
          </div>
          <div className="flex flex-col gap-4">
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
